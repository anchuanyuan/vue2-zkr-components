<template>
    <div :id="id"  ref="tableBody" :class="['custom-table-wrapper',{'showPagination':showPagination}]">
        <!--自定义类-->
        <div class="tableHead">
            <el-checkbox border :class='{"select-all-cadre":selectFlag}' v-if="showSelectBtn"
                v-model="selectFlag" @change="selectAllChange" :indeterminate="isIndeterminate">
                全选 {{totalCount}}条
            </el-checkbox>
            <div>
                <slot></slot>
            </div>
        </div>
        <!--表格主体-->
        <div class="tableBody" :style="{height:tableHeight}">
            <span
                v-show="local&&gridColumns.length>0"
                class="configColumns iconfont icon-shezhi"
                title="列配置"
                @click="configColumns()"
            ></span>
            <span class="configColumns" v-if="canWrite" >
            <el-checkbox v-model="canWriteCheck" style="position: absolute;right: 125px;top: 11px;"></el-checkbox>
          </span>
            <span class="configColumns" v-if="canRead">
            <el-checkbox v-model="canReadCheck" style="position: absolute;right: 270px;top: 11px;"></el-checkbox>
          </span>
            <el-table :ref="id"
								v-loading="loading"
                 :stripe="stripe"
                @cell-click='cellClick'
                v-show="gridColumns.length>0"
                height="100%"
                empty-text=" "
                :row-key="rowKey"
                border highlight-current-row
                :fit="fit" :data="tableData"
                :summary-method="returnSummary"
                :show-summary="showSummary"
                :sum-text="summary"
                :tree-props="treeProps"
                :default-expand-all="defaultExpandAll"
                :span-method="returnSpan"
                :row-class-name="trClass" tooltip-effect="dark"
                @selection-change="handlerSelect"
                @select="selectChange"
                @select-all="selectAllFn"
                @row-click="rowClick"
                @current-change='currentChange'
                @row-dblclick="rowDbClick"
                @row-contextmenu="rowRightClick"
                :cell-class-name="cellClass"
            >

                <el-table-column v-if="showSelect" type="selection" align="center" width="50" :reserve-selection="reserveSelection" :selectable="selectableFunc"> </el-table-column>
                <el-table-column :fixed="indexfixed" v-if="showIndex" type="index"  align="center" :label="sortName"  width="60"></el-table-column>
                <!--通用表格 1.树形，2.合并行列，3.普通-->
                <el-table-column
                    v-for="(column, index) in columns"
                    :fixed="column.fixed"
                    :width="column.width"
                    :align="column.align?column.align:'center'"
                    :label="column.text"
                    :index="index"
										:sortable="column.sortable"
                    :key="column.text + (column.dataIndex || index)"
                    v-if="column.text!='操作' || !hideOperate"
                    :prop="column.dataIndex">
                    <el-table-column
                        v-for="(column1, index1) in column.children"
                        :fixed="column1.fixed"
                        :width="column1.width"
                        :align="column1.align?column.align:'center'"
                        :label="column1.text"
                        :index="index1"
                        :key="column1.text"
                        :prop="column1.dataIndex">
                        <el-table-column
                            v-for="(column2, index2) in column1.children"
                            :fixed="column2.fixed"
                            :width="column2.width"
                            :align="column2.align?column.align:'center'"
                            :label="column2.text"
                            :index="index2"
                            :key="column2.text"
                            :prop="column2.dataIndex">
                            <template slot-scope="scope">
                                <div v-if="column2.formatter" class="formatter">
                                    <div v-show="false">{{tdData=column2.formatter(scope)||''}}</div>
                                    <!--返回是纯文字-->
                                    <div v-if="$getType(tdData)==='string'" :title="tdData">{{tdData}}</div>

                                        <!--返回是自定义按钮-->
                                        <el-button v-if="tdData.showBtn"
                                            :class="tdData.class"
                                            :title="tdData.text"
                                            :type="tdData.type"
                                            :size="tdData.size?tdData.size:'mini'"
                                            :style="{textAlign:column2.align}"
                                            @click="runBtnClick(column2.formatter(scope).eName,scope.row,column2.formatter(scope).limit)"
                                            :disabled="tdData.disabled">
                                            {{tdData.text}}
                                        </el-button>
                                        <!--返回是自定义文字-->
                                        <div v-if="tdData.showText"
                                            @click="runBtnClick(column2.formatter(scope).eName,scope.row,column2.formatter(scope).limit)"
                                            :style="tdData.style"
                                            :class="tdData.class"
                                            :title="tdData.text">
                                            {{tdData.text}}
                                        </div>
                                        <!--返回是icon图标-->
                                        <span v-if="tdData.showIcon" :class="['iconfont',tdData.class]" :style="tdData.style"></span>
                                    </div>
                                    <div v-else-if="column2.edit" class="dbEdit">
                                        <input type="text" v-model="scope.row[column2.dataIndex]"  @keydown="keyDown"/>
                                        <span style="white-space: pre-line;">{{scope.row[column2.dataIndex]}}</span>
                                    </div>
                                    <span v-else :title="scope.row[column2.dataIndex]">{{scope.row[column2.dataIndex]}}</span>
                                </template>
                            </el-table-column>
                            <template slot-scope="scope" v-if="!column1.children">
                                <div v-if="column1.formatter" class="formatter">
                                    <div v-show="false">{{tdData=column1.formatter(scope)||''}}</div>
                                    <!--返回是纯文字-->
                                    <div v-if="$getType(tdData)==='string'" :title="tdData">{{tdData}}</div>
                                    <!--返回是自定义按钮-->
                                    <el-button v-if="tdData.showBtn"
                                        :class="tdData.class"
                                        :title="tdData.text"
                                        :type="tdData.type"
                                        :size="tdData.size?tdData.size:'mini'"
                                        :style="{textAlign:column1.align}"
                                        @click="runBtnClick(column1.formatter(scope).eName,scope.row,column1.formatter(scope).limit)"
                                        :disabled="tdData.disabled">
                                        {{tdData.text}}
                                    </el-button>
                                    <!--返回是自定义文字-->
                                    <div v-if="tdData.showText"
                                        @click="runBtnClick(column1.formatter(scope).eName,scope.row,column1.formatter(scope).limit)"
                                        :style="tdData.style"
                                        :class="tdData.class"
                                        :title="tdData.text">
                                        {{tdData.text}}
                                    </div>
                                    <!--返回是icon图标-->
                                    <span v-if="tdData.showIcon" :class="['iconfont',tdData.class]" :style="tdData.style"></span>
                                    <slot v-if="tdData.slot" :name='tdData.slot' :item="scope"></slot>
                                </div>
                                <div v-else-if="column1.edit" class="dbEdit">
                                    <input type="text" v-model="scope.row[column1.dataIndex]"  @keydown="keyDown"/>
                                    <span style="white-space: pre-line;">{{scope.row[column1.dataIndex]}}</span>

                                </div>
                                <span v-else :title="scope.row[column1.dataIndex]">{{scope.row[column1.dataIndex]}}</span>
                            </template>
                            <!-- <span v-if="column1.children" :title="scope.row[column1.dataIndex]">{{scope.row[column1.dataIndex]}}</span> -->
                        </el-table-column>
                        <template slot-scope="scope" v-if="!column.children">
                            <div v-if="column.formatter" class="formatter">

                                <div v-show="false">{{tdData=column.formatter(scope)||''}}</div>
                                <slot :name="tdData.soltName" v-if="tdData.showSlot" :data="scope.row"></slot>
                                <!--返回是纯文字-->
                                <div v-if="$getType(tdData)==='string'" :title="tdData">{{tdData}}</div>
                                <div v-if="tdData.showHtml" v-html="tdData.htmlText"></div>
                                <!--返回是自定义按钮-->
                                <el-button v-if="tdData.showBtn"
                                    :class="tdData.class"
                                    :title="tdData.text"
                                    :type="tdData.type"
                                    :size="tdData.size?tdData.size:'mini'"
                                    :style="{textAlign:column.align}"
                                    @click="runBtnClick(column.formatter(scope).eName,scope.row,column.formatter(scope).limit)"
                                    :disabled="tdData.disabled">
                                    {{tdData.text}}
                                </el-button>
                                <!--返回是自定义文字-->
                                <div v-if="tdData.showText"
                                    @click="runBtnClick(column.formatter(scope).eName,scope.row,column.formatter(scope).limit)"
                                    :style="tdData.style"
                                    :class="tdData.class"
                                    :title="tdData.text">
                                    {{tdData.text}}
                                </div>
                                <!--返回是icon图标-->
                                <span v-if="tdData.showIcon" :class="['iconfont',tdData.class]" :style="tdData.style"></span>
                                <!-- 进度条 -->
                                <el-progress v-if="tdData.showProgress"


                                             :color="customColor"
                                    :percentage="tdData.data">
                                </el-progress>
                                <!-- 返回复选框 -->
                                <el-checkbox v-if="tdData.showCheckbox"
                                    :class="tdData.class"
                                    :style="tdData.style"
                                    v-model="tdData.check"
                                    :disabled="tdData.disabled"
                                    @change.native="runBtnClick(column.formatter(scope).eName,scope.row,column.formatter(scope).limit)">
                                </el-checkbox>
                                <!-- 返回是input输入框 -->
                                <formInput
                                    class="noBorder"
                                    v-if="tdData.showInput"
                                    v-model="tdData.value"
                                    :type="tdData.type"
                                    :min="tdData.min"
                                    :max="tdData.max"
                                    @change="tdData.change"
                                    :placeholder="tdData.placeholder?tdData.placeholder:' '">
                                </formInput>
                                <!-- 下拉框 -->
                                <formSelect v-if="tdData.showSelect"
                                    v-model="scope.row[column.dataIndex]"
                                    :options="tdData.data"
                                    @change="runBtnClick(column.formatter(scope).eName,scope.row,column.formatter(scope).limit)">
                                </formSelect>
                                <!-- 返回switch按钮 -->
                                <formSwitch v-if="tdData.showSwitch"
                                    v-model="scope.row[column.dataIndex]"
                                    :activeText="tdData.showRight"
                                    :text="tdData.showLeft"
                                    @change="runBtnClick(column.formatter(scope).eName,scope.row,column.formatter(scope).limit)">
                                </formSwitch>
                                <!--返回自定义下拉菜单-->
                                <formDropDown
                                    @click="dropClick"
                                    v-if="tdData.showDropDown"
                                    type="text primary"
                                    :title="tdData.text"
                                    trigger="click"
                                    placement="left-start"
                                >
                                    <template slot="dropdown">
                                        <el-dropdown-item
                                            :command="{eName:item.eName,row:scope.row}"
                                            v-for="(item,index) in tdData.data"
                                            :key="item.text"
                                             v-show="(item.show==undefined&&!item.show)||item.show"
                                            :disabled="item.disabled"
                                            :class="[item.class,{'last':tdData.data.length-1 === index}]"
                                        >{{item.text}}</el-dropdown-item>
                                    </template>
                                </formDropDown>
                                <slot v-if="tdData.slot" :name='tdData.slot' :item="scope"></slot>
                                <!-- 返回是操作 -->
                                <div v-if="tdData.operate">
                                    <el-button
                                        v-for="(item,index) in tdData.data"
                                        type="text"
                                        :class="item.class"
                                        :key="index"
                                        @click="runBtnClick(item.eName,scope.row,item.limit)">
                                    {{item.text}}
                                </el-button>
                                </div>
                            </div>
                            <div v-else-if="column.edit" class="dbEdit">
                                <input type="text" v-model="scope.row[column.dataIndex]" @keydown="keyDown"/>
                                <span style="white-space: pre-line;">{{scope.row[column.dataIndex]}}</span>
                            </div>
                            <span v-else :title="scope.row[column.dataIndex]">{{scope.row[column.dataIndex]}}</span>
                        </template>
                        <template :slot="column.header?'header':' '" slot-scope="scope" v-if="!column.children">
                             <slot :name='column.header' :item="scope" :column='column'></slot>
                        </template>

                    </el-table-column>

            </el-table>
        </div>
        <div class="tableFooter">
            <slot name="bottom">
                <formRadio v-show="showDrag && showPagination" button v-model="useDrag" :options="[{name:'拖动排序',id:'1'},{name:'不拖动',id:'0'}]"></formRadio>
            </slot>
            <!--表格尾部操作类-->
            <commonPagination v-if="showPagination&&tableShow" :sizeLimit="sizeLimit"
                :layout="layout" :size.sync="pageSize" :pageCount='pageCount'
                :page.sync="pageIndex" :total="total ? total:totalCount"
							@changeSize="changeSize"
							@changePage="changePage"
            ></commonPagination>
        </div>
        <columnConfig
            :visible.sync="columnConfigVisible"
            v-model="localConfig"
            :options="gridColumns"
            @save="saveColumn"
        ></columnConfig>
    </div>
</template>
<script>
    import Sortable from "sortablejs"
    import columnConfig from "../custom/columnConfig.vue"
    export default {

        name: 'commonTable',
        components:{
            columnConfig
        },
        props:{
          	loading: {
              type: Boolean,
              default:false
            },
            pageName:String,
            //序号位置
            indexfixed:{
                type: [String,Boolean],
                default:false
            },
            //用来区分单位模块还是干部综合信息管理模块，方便修改table的操作中的删除功能
            isCadre:{
                type: Boolean,
                default:false
            },
            selectableFlag:{
                type: Boolean,
                default:false
            },                                  //判断表格多选框是否可勾选
            selectableForm:Object,
            defaultSelectData:Object,           //多选框默认选中行
            pageCount: Number,
            rowIndex: Number,                   //当前选中行
            offset: {                           //高度偏移
                type: Number,
                default: 0
            },
						rowKey: {
                type: String,
                default: 'id'
            },
            reserveSelection:{
                type: Boolean,
                default:false
            },
            sortName: {                         //序号列label
                type: String,
                default: "序号"
            },
            showSelect:Boolean,                 //是否需要复选框
            showIndex: {                        //是否展示序号
                type: Boolean,
                default: true
            },
			canWrite: {                        //是否展示序号
                type: Boolean,
                default: false
            },
			canRead: {                        //是否展示序号
                type: Boolean,
                default: false
            },
            showSummary: {                        //是否展示合计
                type: Boolean,
                default: false
            },
            showPagination:Boolean,             //是否需要分页
            autoHeight:Boolean,                 //是否自动高度
            height: String,                     //高度
            refresh:Boolean,                    //刷新请求
            defaultChecked:Boolean,             //默认选择
            autoOperate:Boolean,                //自动添加操作列
            dragable:Boolean,                   //是否可拖动
            fit:{                               //列宽是否自动撑开
                type:Boolean,
                default:true
            },
            stripe:{
                type:Boolean,
                default:false
            },
            local: String,                      //本地配置
            summary:String,                     //是否需要合计行 并且合计行第一列文字
            gridColumns:Array,                  //表格列配置
            /*数据及查询数据 */
            options:Array,                      //表格数据配置
            method: String,                     //请求方式
            url: String,                        //->查询数据url
            search:Object,                      //查询条件
            /*分页 */
            sizeLimit: Array,                   //分页的页量码
            total: Number,                      //分页总条数
            layout: String,                     //分页的配置
            /*函数 */
            rowClass: Function,                 //->行样式
            returnForData:Function,             //数据返回外部方法
            summaryFn:Function,             //求和函数
            customSpanMethod: Function,         //->合并单元格的方式
            hideOperate: {                      //隐藏操作
                type: Boolean,
                default: false
            },
            cellClass: {},
            showSelectBtn: Boolean,              //是否展示全选按钮
            mainkey: String,                          //全选功能需要用到的key
            treeProps: {                                                //显示数据的key
                type: Object,
                default: () => {
                    return {
                        children:"subTreeNode",
                        hasChildren:"leaf"
                    };
                }
            },
            defaultExpandAll:{
                type: Boolean,
                default: false
            },
        },
        data() {
            let id = "commonTable_" + this.$moment().format("x");
            return {
								canWriteCheck:true,
								canReadCheck:true,
								tableShow:true,
                editValue: '',
                id: id,
                columns:[],
                tableData:[],
                useDrag:"0",
                sortAble: null,
                totalCount: 0,
                offsetTop: 0,
                offsetBottom: 10,
                columnConfigVisible:false,
	              customColor: [
		            {color: '#f56c6c', percentage: 20},
		            {color: '#e6a23c', percentage: 40},
		            {color: '#6f7ad3', percentage: 60},
		            {color: '#1989fa', percentage: 80},
		            {color: '#5cb87a', percentage: 100},
                ],
                selectAll: false, //表格是否处于全选状态
                selectFlag: false, //控制全选按钮的状态
                isIndeterminate: false,
                checkedList: [],
                uncheckedList: [],
            };
        },
        computed: {
            //显示拖动
            showDrag() {
                return this.dragable && this.columns.length>0;
            },
            //重新渲染高度
            refreshHeight() {
                if (this.$store.state.refreshHeight) this.initHieght()
                return this.$store.state.refreshHeight
            },
            //表格高度
            tableHeight() {
                if (this.refreshHeight)
                    this.$store.commit("updateRefreshHeight", false)
                if (this.autoHeight) {
                    let offsetOther = 0 + this.offset + this.offsetBottom;
                    if ($(`#${this.id} .tableHead`).height())
                        offsetOther += $(`#${this.id} .tableHead`).height();
                    if ($(`#${this.id} .tableFooter`).height())
                        offsetOther += $(`#${this.id} .tableFooter`).height();
                    else
                        offsetOther += 10;
                    if (this.height) {
                        this.offsetTop = 0;
                        return `calc(${this.height} - ${this.offsetTop}px - ${offsetOther}px)`;// - 10
                    }else{
                        return `calc(100vh - ${this.offsetTop}px - ${offsetOther}px - 10px)`;
                    }
                }else {
                    if (this.height) return this.height;
                }
                return "auto";
            },
            //分页当前页量
            pageSize: {
                get() {
                    return this.search.pageSize
                },
                set(val) {
                    this.search.pageSize = val
                }
            },
            //分页当前页码
            pageIndex: {
                get() {
                    return this.search.pageIndex
                },
                set(val) {
                    this.search.pageIndex = val
                }
            },
            //本地缓存配置
            localConfig() {
                if (this.local) {
                    return this.$store.getters.userTable[this.local]
                }
                return null
            }
        },
        watch:{
            //初始化拖动
            useDrag() {
                this.initSortAble()
            },
            canWriteCheck(val){
                this.$emit('canChange',val,'canWrite');
            },
            canReadCheck(val){
                this.$emit('canChange',val,'canRead');
            },
            options: {
                handler() {
                    this.tableData = this.options;
                    if(this.showSelectBtn)
                        this.setChecked()
                    this.columns = new Array();
                    this.initColumns();
                    this.initChecked();
                    this.initCheckedAfterMove();
                },
                 deep: true
            },
            gridColumns: {
                handler() {
                    this.initColumns();
                },
                deep: true
            },
            search: {
                handler(val,oldVal) {
                    if(val.pageIndex == oldVal.pageIndex && val.pageIndex !== undefined)
                        this.pageIndex == 1
                    this.loadData()
                },
                deep: true
            },
            refresh(refresh) {
                //->刷新重新请求
                if (refresh) {
                    this.loadData()
                    this.$emit("update:refresh", false)
                }
            },
        },
        mounted() {
            this.$nextTick(()=> {
                if(this.gridColumns)
                    this.columns = this.$deepClone(this.gridColumns);
                if(this.options) {
                    this.tableData = this.$deepClone(this.options);
                    this.initChecked()
                }

                this.initCheckedAfterMove()
                this.loadData();
                this.initHieght();
                this.initColumns();
                this.initSortAble();
            })
        },
        methods:{
            selectableFunc(row,index){
                //判断表格多选框中行数据是否可以勾选
                if(this.selectableFlag && JSON.stringify(this.selectableForm) != "{}"){
                    for(let key in this.selectableForm){
                        if(row[key] != this.selectableForm[key]){
                            return false
                        }
                    }
                }
                return true
            },
            initCheckedAfterMove(){
                //根据传递参数保存默认多选框选中内容
                if(this.defaultSelectData && JSON.stringify( this.defaultSelectData) != "{}" && this.tableData.length > 0 && this.tableData[0].subId && this.defaultSelectData.subId) {
                    this.$nextTick(()=>{
                        let row = this.tableData.find(item => item.subId == this.defaultSelectData.subId)
                        this.$refs[this.id].toggleRowSelection(this.tableData[row['$index']],true)
                    })
                }
            },
            currentChange(currentRow,oldCurrentRow) {

                this.$emit('currentChange',currentRow,oldCurrentRow)
            },
            changeSize(page) {
                        this.$emit('changeSize',page)
                    },
            changePage(page) {
                        this.$emit('changePage',page)
                    },
            //清空选择
            deselected() {
                this.selectAll = false
                this.isIndeterminate = false
                this.selectFlag = false
                this.uncheckedList = []
                this.checkedList = []
                this.$refs[this.id].clearSelection()
            },
            setChecked(){
                var rows = this.tableData.filter(item => {
                    if(!this.selectAll)
                        return this.checkedList.includes(item[this.mainkey])
                    else
                        return !this.uncheckedList.includes(item[this.mainkey])
                })
                //勾选过滤行
                if(rows.length)
                    setTimeout(_ => {
                        rows.forEach(row => {
                            this.$refs[this.id].toggleRowSelection(row,true)
                        })
                    },200)
            },
            selectAllChange(val) {
                this.tableData.forEach(row => {
                    this.$refs[this.id].toggleRowSelection(row,val)
                })
                this.selectFlag = val
                this.selectAll = val
                this.isIndeterminate = false
                this.uncheckedList = []
                this.checkedList = []
            },
            //合计行自定义
            returnSummary({columns,data}) {
                if(this.summaryFn)
                    return this.summaryFn(columns,data)
            },
            keyDown(e,row) {
                if(e.keyCode != 13)
                    return
                let inputs = $(e.target).parents('tr').find('.dbEdit input')
                let index = Array.prototype.indexOf.call(inputs,e.target)
                if(inputs[index + 1]) {
                    inputs[index + 1].focus()
                    inputs[index + 1].select()
                }
            },
            toggleInput(input) {
                input.next().css({display: 'none'})
                input.css({display: 'block'})
                input.focus()
                input.select()
            },
            toggleSpan(input) {
                input.next().css({display: 'block'})
                input.css({display: 'none'})
            },
            //初始化选择
            initChecked() {

                if (this.defaultChecked) {
                    setTimeout(() => {
                        if (this.tableData.length > 0) {//避免点击其他跳到第一条
                            this.$refs[this.id].setCurrentRow(this.tableData[0])
                            this.rowClick(this.tableData[0])
                        }
                    }, 10)
                }
            },
            //设定某一行为选中行
            setCurrentRow(row){
                this.$refs[this.id].setCurrentRow(row)
            },
            //初始化拖动
            initSortAble() {
                //不显示分页器处理方式
                if(!this.showPagination && this.dragable) {
                    let that = this
                    let table = $(this.$refs[this.id].bodyWrapper).find("tbody")[0]
                    let tableConfig = {
                        disabled: false,
                        onEnd(data) {
                            console.log(111111,data)
                            that.$emit("dragEnd", data.newIndex, data.oldIndex)
                        }
                    }
                    this.sortAble = Sortable.create(table, tableConfig)
                    return
                }


                if (this.useDrag === "0" || !this.dragable) {
                    if (this.sortAble) this.sortAble.destroy()
                    return
                }
                let that = this
                let table = $(this.$refs[this.id].bodyWrapper).find("tbody")[0]
                let tableConfig = {
                    disabled: this.useDrag === "0",
                    onEnd({ newIndex, oldIndex }) {
                        that.$emit("dragEnd", newIndex, oldIndex)
                    }
                }
                this.sortAble = Sortable.create(table, tableConfig)
            },
            //加载数据
            loadData() {
                if (!this.url) return
                let isLoad = true //控制条件加载完成再请求数据
                for (var key in this.search) {
                    if (this.search[key] === null) {
                        isLoad = false
                    }
                }
                if (!isLoad) return
                let ajaxOption = {
                    url: this.url,
                    data: this.search,
                    method: this.method ? this.method : "post"
                }
                this.tableData = new Array()
                this.$ajaxPost(ajaxOption, true, res => {
                    if (res.code === 200) {
                        if (this.returnForData)
                            res.data = this.returnForData(res.data)
                        if (res.data.totalCount !== undefined) {
                            this.totalCount = res.data.totalCount
                            this.tableData = res.data.data
                        } else {
                            this.tableData = this.$deepClone(res.data)
                        }
                        if(this.showSelectBtn)
                            this.setChecked()
                        this.initColumns();
                        this.initChecked();
                    } else {
                        this.$showMsg("error", res.message)
                    }
                })
            },
            //延迟初始化应用表格头部
            initHieght() {
                this.$nextTick(()=> {
                    if (this.$refs.tableBody)
                        this.offsetTop = this.$refs.tableBody.getBoundingClientRect().top;
                })
            },
            //初始化列
            initColumns() {
                if (this.gridColumns.length === 0) return
                let resultColumns = new Array()
                let localResult = new Array()
                this.gridColumns.forEach((item, index) => {
                    let itemResult = this.$deepClone(item)
                    //从配置项中找到该列
                    if (this.$dataFields.table[itemResult.dataIndex] && itemResult.dataIndex!=="name") {
                        itemResult = this.$mergeObj(this.$dataFields.table[itemResult.dataIndex],itemResult)
                    }
                    //将本地存储的列中的一些独有特性赋给itemResult
                    if (this.localConfig && this.localConfig.length > 0) {
                        let result = this.localConfig.filter(local => {
                            return local.dataIndex === itemResult.dataIndex && itemResult.dataIndex
                        })
                        if (result.length > 0) {
                            itemResult = this.$mergeObj(result[0],itemResult)
                        }
                    }
                    if(itemResult.text!=="操作")
                        localResult.push(itemResult)
                    if (itemResult.show !== false)//->显示
                        resultColumns.push(itemResult)
                })
                //autoOperate为true，则自动添加操作列
                if (this.autoOperate) {
                    var operate = this.$dataFields.table.operate
                    if(this.isCadre){
                         operate = this.$dataFields.table.operateCadre
                    }
                    if(this.pageName == 'InformationCenter'){
                        operate = this.$dataFields.table.operate4
                    }
                    // 编辑项任用考察的编辑列和别的地方不一样
                    if(this.gridColumns.find(item => item.text == '考核方案标题'))
                        operate = this.$dataFields.table.operate1
					// if(this.gridColumns.find(item => item.dataIndex == 'ORDINAL')){
					// 	operate = this.$dataFields.table.operate3
					// }
                    resultColumns.push(operate)
                }
                resultColumns.push({text: this.$moment().format("x"), width:"1px",dataIndex: "refresh"})
                this.columns = this.$deepClone(resultColumns)
                //初始化表格完成后将其保存值localStorage中
                this.$store.commit("updateUserTable", [this.local, localResult])
            },
            //行类名
            trClass({ row, rowIndex }) {
                let className = ""
                // 把每一行的索引放进row
                row.$index = rowIndex
                if (this.rowIndex || this.rowIndex === 0) {
                    this.hightlight = false
                    className += this.rowIndex === rowIndex ? " checked-row" : ""
                }
                if (this.customSpanMethod) className += " hideTrBg"
                if (this.rowClass) {
                    className += ` ${this.rowClass(row, rowIndex)}`
                }
                return className
            },
            //下拉菜单command事件转移
            dropClick(command) {
                this.runBtnClick(command.eName, command.row)
            },
            //操作按钮点击事件
            runBtnClick(clickEvent, row, limit) {
                if(clickEvent)
                    this.$emit(clickEvent, row, this.data, limit);
            },
            //行点击时
            rowClick(row, column, event) {
                this.$emit("rowClick", row, column, event)
            },
            //行双击
            rowDbClick(row, column, event) {
                this.$emit("rowDbClick", row, column, event)
                let target = $(event.target)
                let inputs = target.parents('tr').find('.dbEdit input')
                if(inputs.length) {
                    this.toggleInput(inputs)
                    let input = event.target.tagName == 'TD' ? target.find('.dbEdit input') : target.parents('td').find('.dbEdit input')
                    if(input.length) {
                        input.focus()
                        input.select()
                    }else {
                        inputs[0].focus()
                        inputs[0].select()
                    }
                }
            },
            //行右击时
            rowRightClick(row, column, event) {
                this.$emit("rowRightClick", row, column, event)
            },
            //选中值改变
            handlerSelect(val) {
                // if(this.showSelectBtn) {
                    //对checkedList和uncheckedList进行处理
                    let checkedVal = val.map(item => item[this.mainkey])
                    var arr = this.tableData.map(item => item[this.mainkey])
                    if(!this.selectAll)
                        this.checkedList = this.checkedList.filter(item => !arr.includes(item))
                            .concat(checkedVal)
                    else
                        this.uncheckedList = this.uncheckedList.filter(item => !arr.includes(item))
                        .concat(arr.filter(item => !checkedVal.includes(item)))
                    //全选按钮的显示进行处理
                    if(this.selectAll) {
                        this.selectFlag = !this.uncheckedList.length
                        this.isIndeterminate = Boolean(this.uncheckedList.length
                            && this.uncheckedList.length != this.totalCount)
                    }else {
                        this.selectFlag = this.totalCount
                            && this.checkedList.length == this.totalCount
                        this.isIndeterminate = Boolean(this.checkedList.length
                            && this.checkedList.length != this.totalCount)
                    }
                // }
                this.$emit("checkedChange",val);
            },
            //复选框选中
            selectChange(val,row) {
                this.$emit("select",val,row);
            },
            //复选框选中全选
            selectAllFn(val) {
                this.$emit("selectAll",val);
            },
            cellClick(row, column, cell, event) {
                this.$emit('cellClick',row, column, cell, event)
            },
            //表格列配置
            configColumns() {
                this.columnConfigVisible = true
            },
            saveColumn(checkedVal, checkedData) {
                let result = this.$deepClone(this.localConfig)
                result.forEach(item => {
                    item.show = true
                    if (!~checkedVal.indexOf(item.dataIndex)) {
                        item.show = false
                    }
                })
                this.$store.commit("updateUserTable", [this.local, result])
                this.initColumns()
				this.$emit('saveColumn',result)
				this.columnConfigVisible = false
            },
            //合并行，列
            returnSpan({ row, column, rowIndex, columnIndex }) {
                if (this.customSpanMethod) {
                    return this.customSpanMethod({
                        row,
                        column,
                        rowIndex,
                        columnIndex
                    })
                } else {
                    if (row.spanList) {
                        for (var i = 0; i < row.spanList.length; i++) {
                            if (columnIndex === row.spanList[i].colIndex) {
                                return {
                                    rowspan: row.spanList[i].rowspan,
                                    colspan: row.spanList[i].colspan
                                }
                            }
                        }
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        }
                    }
                }
            },
            // 动态处理分页是否显示
            methodsPagination(val){
                this.tableShow = val
              }
        },
        beforeDestroy() {}
    }
</script>
<style lang="scss" type="text/scss">
.custom-table-wrapper {
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    padding: 10px 10px 0;
    height: 100%;
    .tableHead {
        display: flex;
        >.el-checkbox {
            margin-right: 10px;
        }
        >div {
            flex: 1;
        }
    }
    .dbEdit {
        input {
            display: none;
            height: 30px;
            width: 100%;
        }
    }
    .tableBody {
        position: relative; overflow: auto;
    }
    .el-table {
        width:100%;
        position: absolute;
        // width: auto;
        max-width: none;
    }
    .cell {
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 13px;
        .formatter {
            > button,
            > div {
                width: 100%;
                padding-left: 0;
                padding-right: 0;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
    .tableBody {
        position: relative;
        width: 100% !important;
        // .el-table__empty-block {
        //     width: 100% !important;
        // }
        .configColumns {
            cursor: pointer;
            position: absolute;
            z-index: 10;
            right: 8px;
            top: 2px;
        }
        .el-button {
            padding: 0;
        }
    }
    .tableFooter {
        display: flex;
        align-items: center;
        .common-pagination-wrapper {
            flex: 1;
        }
    }
    .warning-row {
        background: oldlace;
    }
    .success-row {
        background: #f0f9eb;
    }
    .danger-row {
        background: #f56c6c;
    }
    .discriminate-row {
        background: #f6f5ec;
    }
    .danger-row,
    .warning-row,
    .success-row {
        &.hover-row {
            td {
                background-color: transparent !important;
            }
        }
    }
    .el-table th.gutter{
        display: table-cell!important;
    }

    .el-table colgroup.gutter{
        display: table-cell!important;
    }
    .select-all-cadre {
        background: #409EFF;
        .el-checkbox__label {
            color: #fff !important;
        }
        .el-checkbox__inner {
            border-color: #fff !important;
        }
    }
}
</style>
