<template>
    <div class="common-tree-table-wrapper padding">
        <!--自定义类-->
        <slot></slot>
        <!--表格主体-->
        <div ref="tableTreeBody" class="tableTreeBody">
            <el-table
                :ref="refName"
                :data="treeTabledata"
                :row-key="rowKey"
                :lazy="lazy"
                :load="load"
                border
                :height="tableHeight"
                :highlight-current-row="hightlight"
                @row-click="rowClick"
                @row-dblclick="rowDbClick"
                @current-change="handleCurrentChange"
                @selection-change="handleSelectionChange"
                @header-dragend="columnDrag">
                <!-- 表格列复选框 -->
                <slot name="selection">
                    <el-table-column v-if="showSelect" fixed type="selection" align="center" width="30"> </el-table-column>
                </slot>
                <el-table-column v-if="showIndex" type="index" align="center" label="序号" width="50"> </el-table-column>
                <!--通用表格 1.树形，2.合并行列，3.普通-->
                <el-table-column v-for="(column, index) in columns" :key="index"
                    :fixed="column.fixed"
                    :width="column.width"
                    :align="column.align"
                    :label="column.text"
                    :prop="column.dataIndex">
                    <template slot-scope="scope" v-if="!column.children">
                        <span v-if="!column.formatter" :title="scope.row[column.dataIndex]">{{scope.row[column.dataIndex]}}</span>
                        <div v-if="column.formatter" >
                            <div v-show="false">{{tdData=column.formatter(scope)||''}}</div>
                            <!--返回是纯文字-->
                            <div v-if='$getType(tdData)!=="array"&&$getType(tdData)!=="object"' :title="tdData">{{tdData}}</div>
                            <!--返回是自定义按钮-->
                            <el-button
                                v-if="tdData.showBtn" :class="tdData.class"
                                :circle="tdData.circle" :title="tdData.title"
                                :type="tdData.type" :size='tdData.size?tdData.size:"mini"'
                                @click="runBtnClick(column.formatter(scope).eName,scope.row,column.formatter(scope).limit)"
                                :disabled="tdData.disabled">{{tdData.text}}
                            </el-button>
                            <!--返回是自定义文字-->
                            <div v-if='tdData.showText' :class="tdData.class" :title="tdData.text">{{tdData.text}}</div>
                            <!--返回是icon图标-->
                            <i v-if="tdData.showIcon" :class="tdData.class" class="iconfont" :style="tdData.style"></i>
                            <!-- 返回复选框 -->
                                <el-checkbox
                                    v-if="tdData.checkbox"
                                    :class="tdData.class"
                                    :style="tdData.style"
                                    v-model="tdData.check"
                                    :disabled="tdData.disabled"
                                    @change.native="checkClick(column.formatter(scope).type,scope.row,column.formatter(scope).limit)">
                                </el-checkbox>
                            <!-- 返回switch按钮 -->
                            <formSwitch v-if="tdData.showSwitch"
                                v-model="scope.row[column.dataIndex]"
                                :activeText="tdData.showRight"
                                :text="tdData.showLeft"
                                @change="runBtnClick(column.formatter(scope).eName,scope.row,column.formatter(scope).limit)">
                            </formSwitch>
                            <!--返回自定义下拉菜单-->
                            <formDropDown @click="dropClick" v-if="tdData.showDropDown" type="text primary"
                                :title="tdData.showText" trigger="click" placement="left-start">
                                <template slot="dropdown">
                                    <el-dropdown-item
                                        :command="{eName:item.eName,row:scope.row}"
                                        v-for="(item,index) in tdData.data" :key="item.text"
                                        :disabled="item.disabled" :class='[item.class,{"last":tdData.data.length-1 === index}]'>
                                        {{item.text}}
                                    </el-dropdown-item>
                                </template>
                            </formDropDown>
                            <!-- 返回进度条 -->
                            <el-progress v-if="tdData.showProgress" :class="['paddingX', tdData.class]" :text-inside="tdData.textInside ? tdData.textInside : true" :stroke-width="tdData.strokeWidth ? tdData.strokeWidth : 18" :percentage = "tdData.data"></el-progress>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <commonPagination
            v-if="showPagination" :sizeLimit="sizeLimit" :layout="layout"
            :size.sync="pageSize" :page.sync="pageIndex" :total="total ? total:totalCount">
        </commonPagination>
        <!--表格尾部操作类-->
        <slot name="bottom"></slot>
    </div>
</template>
<script>
    import $ from 'jquery'
    export default {
        name: "commonTreeTable",
        props:{
            search:{//->表格查询条件
                type:Object,
                default() {
                    return {}
                }
            },
            //懒加载的查询条件
            lazySearch:{//->表格查询条件
                type:Object,
                default() {
                    return {}
                }
            },
            tableTitle: {
                type: String,
                default: ''
            },
            showSelect:{//->是否显示表格复选框
                type:Boolean,
                default:false
            },
            showIndex:{//是否展示序号
                type:Boolean,
                default: false
            },
            showPagination:{//->是否显示表格分页
                type:Boolean,
                default:false
            },
            autoHeight:{//->是否自动高度
                type:Boolean,
                default:false
            },
            offset:{//高度偏移
                type:Number,
                default:0
            },
            rowKey: {
                type: String,
                default: 'id'
            },
            // 是否支持子节点数据异步加载
            lazy: { 
                type:Boolean,
                default: true
            },
            // 异步加载函数 load
            // load: {
            //     type:Boolean,
            //     default: true
            // },
            method:String,//请求方式
            url:String,//->查询数据url
            loadUrl: String,
            options:[Array,Object],//->外部传入的table数据
            gridColumns:Array,//->外部传入的表格列参
            refresh:Boolean,//->表格总配置
            rowClass:Function,//->行样式
            returnForData:Function,//->请求数据返回后外部的方法
            customSpanMethod:Function,//->合并单元格的方式
            beforeLazyLoad: Function, // 加载叶子节点更改参数
            beforeLazySearchLoad: Function,  // 加载叶子节点和一级节点不同时更改参数
            normalResult: Function,   //格式化返回数据获取ID
            sizeLimit:Array,//分页的页量码
            local:String,//本地配置
            total:Number,//分页总条数
            layout:String,//分页的配置
        },
        data() {
            var refName = "ref_"+this.$moment().format("x");
            return {
                refName:refName,
                offsetTop: 0,
                offsetBottom: 15,
                treeTabledata: [], //最终显示的表格数据
                columns: [],//最终显示的表格列
                totalCount:0,
                hightlight:true,
                checked: true,
                callback: () => {},
                isLoad: false,
            };
        },
        mounted () {
            // 初始化表格列
            this.initColumns();
            if (this.options && this.$getType(this.options)==="array") {//->外部的tabledata直接显示
                this.treeTabledata = this.options;
                // this.initChecked();
            }
            else if (this.url) //->有url按照url请求数据
                this.loadTableData();
            // 初始化获取应用表格头部高度
            this.initTableHeight();  
        },
        watch: {
            search: {
                handler(val) {
                  console.log("this.search重载")
                    this.$emit("update:search",this.search);
                    if (this.isLoad) {
                        this.loadTableData(this.search,this.callback);
                    } else {
                        this.loadTableData(this.search);
                    }
                },
                deep: true
            },  
        },
        computed: {
            //表格高度
            tableHeight() {
                let offsetOther = 0;
                if ($(".container-footer-wrapper").height())
                    offsetOther += $(".container-footer-wrapper").height();
                if (this.showPagination||$(".container-pagination-wrapper").height())
                    offsetOther += $(".common-pagination-wrapper").height();
                return `calc(100vh - ${this.offsetTop}px - ${this.offsetBottom}px - ${offsetOther}px)`
            },
        },
        methods: {
            //延迟初始化应用表格头部
            initTableHeight() {
                setTimeout(() => {
                    if (this.$refs.tableTreeBody)
                        this.offsetTop = this.$refs.tableTreeBody.getBoundingClientRect().top;
                }, 100)//500
            },
            //初始化表格列
            initColumns(columns) {
                if(!columns) {
                    this.columns = this.gridColumns;
                }
            },
            // 加载表格数据
            loadTableData (query,callback) {
                if(!this.url) return;
                if (!query) query = this.search;
                let isLoad = true; //控制条件加载完成再请求数据
                for (var key in query) {
                    if (query[key] === null) {
                        isLoad = false;
                    }
                }
                if(!isLoad) return;
                console.log(query)
                let ajaxOptions = {
                    url: this.url,
                    data: query,
                    method:this.method?this.method:"post"
                }
                this.$ajaxPost(ajaxOptions,true,(res)=> {
                    if(res.code === 200) {
                        let result;
                        if (this.normalResult) {
                            result = this.normalResult(res);
                        } else {
                            result = res.data[0].items
                            this.$emit("update:tableTitle", res.data[0].title);
                        }
                        if(callback) {
                            callback(result)
                        } else {
                            this.treeTabledata = result;
                        }
                    }else{
                        this.$showMsg("error",res.message)
                    }
                })
            },
            // 懒加载表格数据
            load(tree, treeNode, resolve) {
                // if(tree.orgId && tree.hasChildren) {
                //     this.$emit("loadLazyData", tree, treeNode);
                //     this.callback = resolve;
                //     this.isLoad = true;
                //     // this.loadTableData(this.selecType, tree.orgId, resolve)
                // }
                if (!this.loadUrl) {
                    this.beforeLazyLoad(tree, (query)=> {
                        this.loadTableData(query, resolve)
                    })
                } else {
                    // lazySearch
                    console.log('loadUrl is true')
                    this.beforeLazySearchLoad(tree, (query)=> {
                        // this.loadTableData(query, resolve)
                        let ajaxOptions = {
                            url: this.loadUrl,
                            data: query,
                            method:this.method?this.method:"post"
                        }
                        this.$ajaxPost(ajaxOptions,true,(res)=> {
                            if(res.code === 200) {
                                let result;
                                if (this.normalResult) {
                                    result = this.normalResult(res);
                                    console.log(result)
                                } else {
                                    result = res.data[0].items;
                                }
                                resolve(result)
                            }else{
                                this.$showMsg("error",res.message)
                            }
                        })
                    })
                }
                
            },

            
            //行点击时
            rowClick(row,column,event) {
                this.$emit("rowClick",row,column,event)
            },
            //行双击
            rowDbClick(row,column,event) {
                this.$emit("rowDbClick",row,column,event)
            },
            ////列拖动时
            columnDrag(newWidth, oldWidth, column, event) {
                
            },
            //高亮改变时
            handleCurrentChange(val) {
                this.$emit('handleCurrentChange', val);
            },
            //复选框选中时
            handleSelectionChange(data) {
                if (typeof this.$parent["checkedChange"] == "function") {
                    this.$parent["checkedChange"](data);
                } else {
                    this.$emit("checkedChange", data);
                }
            },
        }
    }
</script>
<style lang="scss" type="text/scss">
    .common--tree-table-wrapper {
        
    }
</style>