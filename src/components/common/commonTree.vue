<template>
<div :id="id" :ref="id" class="common-tree-wrapper">

    <div class="treeHead">
        <slot></slot>
        <slot name="filter" v-if="filterable" >
            <formInput radius :style="{width:operation?'85%':'100%'}" class="filterInput" v-model="filterText" suffixIcon="el-icon-search" placeholder="请输入搜索关键字"></formInput>
        </slot>
		<slot name="operation" class="el-icon-plus"></slot>
    </div>
    <div class="treeBody"  :style="{height:treeHeight}">
        <el-tree class="tree" ref="tree"
            empty-text=""
            :lazy="lazy"
            :props="props"
            :data="treeData"
            highlight-current
            :node-key="props.value"
            :show-checkbox="selectable"
            :default-expand-all="openAll"
            :default-checked-keys="defaultCheckedKeys"
            :check-strictly="checkStrictly"
            :render-content="renderContent"
            :filter-node-method="filterNode"
            :expand-on-click-node="expandNode"
            :default-expanded-keys="expandedData"
            :load="loadNode"
            :accordion="accordion"
            @node-click="nodeClick"
            @nodeDbClick="nodeDbClick"
            @check="checkClick"
            @node-contextmenu='rightClick'
            @current-change="(data,node)=>$emit('currentChange',data,node)"
        >
        </el-tree>
    </div>
    <div class="treeFooter" v-if="showTreeBottom">
        <slot name="bottom"></slot>
    </div>
    <!--鼠标右键点击出现页面-->
    <div v-show="rightVisible">
        <el-menu
            id="rightClickMenu"
            class="el-menu-vertical"
            @select="handleRightSelect">
            <el-menu-item :index="index.toString()" :class="item.class" class="menuItem" v-for="(item, index) in operate" :key="index">
                <i :class ="['iconfont',item.icon,item.class]" style="font-size:14px"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </el-menu>
    </div>
    <commonLoading v-if="treeLoading&&!hideLoading"></commonLoading>
</div>
</template>

<script lang="jsx">
    export default {
        name: "commonTree",
        props: {
            afterGetNode: {
                type: Function
            },
            defaultCheckedKeys:{
                type: Array,
            },
            value:[String,Number,Array],                            //数据
            options:Array,
            offset: {                                               //高度偏移
                type: Number,
                default: 0
            },
            height: String,                                         //高度
            autoHeight: {                                           //->是否自动高度
                type: Boolean,
                default: false
            },
             accordion: {                                           //->是否自动高度
                type: Boolean,
                default: false
            },

            showTreeBottom: {                                       //是否显示树下侧
                type: Boolean,
                default: false,
            },
            filterable: {                                           //是否显示过滤
                type: Boolean,
                default: false,
            },
            noPermission: {                                           //后台根据账号权限显示机构树
                type: Boolean,
                default: false,
            },
            search:Object,                                          //查询数据条件
            url:String,                                             //查询数据url
            nodeUrl: String,                                        //->根据节点id懒加载url
            lazy:Boolean,                                           //是否懒加载
            defaultChecked:Boolean,                                 //是否默认选中第一条真数据
            expandNode: {
            	type:Boolean,
                default:false
            },                                     //是否点击节点即展开节点
            checkStrictly:Boolean,                                  //是否遵循父子节点
            selectable:Boolean,                                     //是否显示复选框
            multiple:Boolean,                                       //是否多选
            openAll:Boolean,                                        //展开全部
            loading:Boolean,                                        //loading图
            hideLoading: Boolean,                                   //是否隐藏loading
            render:Function,                                        //自定义render函数
            operate:Array,                                          //右击事件菜单
            returnForData:Function,                                 //返回数据处理方法
            loadForNode: Function,                                  //加载节点
            returnForNode: Function,                            //节点数据返回
            props: {                                                //显示数据的key
                type: Object,
                default: () => {
                    return {
                        value: "id",
                        label: "name",
                        isLeaf: "leaf",
                        isFalse:"isFalse",
                        children: "children",
                        hasChildren:"hasChildren",
                    };
                }
            },
            rootNode: Array,                                        // 根节点外部传入
			operation:{
				type:Boolean,
				default:false
			}
        },
        data() {
            let id =
                "commonTree" +
                (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
            return {
                id:id,
                treeData:[],
                expandedData:[],
                defaultExpandData:[],
	              treeClickCount:0,
                offsetTop:0,
                offsetBottom: 0,
                filterText:null,
                rightVisible:false,
                treeLoading:false,
                lazyData: [],//懒加载回显数据
                firstNode:null,//第1个节点
                firstCallback:null,//第一个节点的callback
                loadLazyNode: null,       // 懒加载当前点击的节点
            };
        },
        computed: {
            //重新渲染高度
            refreshHeight() {
                if (this.$store.state.refreshHeight) this.initHieght()
                return this.$store.state.refreshHeight
            },
            //树高度
            treeHeight() {
                if (this.refreshHeight)
                    this.$store.commit("updateRefreshHeight", false)
                if (this.autoHeight) {
                    let offsetOther = 0 + this.offset + this.offsetBottom;
                    if ($(`#${this.id} .treeHead`).height())
                        offsetOther += $(`#${this.id} .treeHead`).height();
                    if ($(`#${this.id} .treeFooter`).height())
                        offsetOther += $(`#${this.id} .treeFooter`).height();
                    if (this.height) {
                        this.offsetTop = 2;
                        return `calc(${this.height} - ${this.offsetTop}px - ${offsetOther}px)`;
                    }else{
                        return `calc(100vh - ${this.offsetTop}px - ${offsetOther}px)`;
                    }
                }else {
                    if (this.height) return this.height;
                }
                return "auto";
            },
        },
        watch: {
            filterText(val) {//->外部传入filter字符串 影响element
                this.$refs.tree.filter(val);
            },
            search: {//->外部传入的查询条件
                handler() {

                    this.loadData();
                },
                deep: true
            },
            value(val) {
                console.log("123vvv",val)
                this.initDefaultChecked(this.treeData,false);
            },
            options: {
                handler() {
                    this.treeData = this.$deepClone(this.options);
                    this.initData();
                    this.initDefaultChecked();
                },deep:true
            },
            loading() {
                this.treeLoading = this.loading;
            },
            refresh(val){
                if(val){
                    this.refreshTree()
                }
            }
        },
        created() {
            if(this.loading !== undefined)
                this.treeLoading = this.loading;
            if(this.options) {
                this.treeData = this.$deepClone(this.options);
                if(!this.lazy) {
                    this.initData();
                    this.initDefaultChecked();
                }
            }else if (this.url) {//->不是懒加载的情况直接加载数据
                this.loadData();
            }
            this.initHieght();
        },
        methods: {
			refreshTree(){
				this.loadNode()
			},
            //初始化数据
            loadData() {
                if(!this.url || this.lazy)
                    return;
                let ajaxOptions = {
                    data:this.search,
                    url:this.url
                };
                // this.treeLoading = true;
                if (this.noPermission){
                    ajaxOptions.data.noPermission = this.noPermission;
                }
                this.$ajaxPost(ajaxOptions,false,(res)=> {
                    if(res.code === 200) {
                        if(this.returnForData)
                            this.treeData = this.returnForData(res.data);
                        else{
                            if (this.$getType(res.data === "array"))
                                this.treeData = res.data;
                            else
                                this.treeData = [res.data];
                        }
                        this.initData(this.treeData);
                        this.initDefaultChecked();
                        this.treeLoading = false;
                    }else{
                        this.$showMsg("error",res.errMsg);
                    }
                })
            },
            //加载节点
            loadNode(node, resolve) {
                this.loadLazyNode = node

                if(node.level === 0) {
                    this.treeData = new Array();
                    this.firstNode = node;

                    this.firstCallback = resolve;
                    if(this.rootNode && this.rootNode.length>0) {
                        let rootData = this.$deepClone(this.rootNode)
                        resolve(rootData)
                        this.treeData = rootData
                        this.initDefaultChecked(rootData)
                        return
                    }
                }
                if(node.level>0) {

                    let nodeId = node.data[this.props.value];
                    let result = this.lazyData.filter((itemLazy)=>{
                        return itemLazy[this.props.value] === nodeId;
                    })
                    if(result.length>0) {
                        resolve(result[0][this.props.children]);

                        setTimeout(()=> {
                            this.initScroll();
                        },100)
                        return;
                    }
                }
                if (this.loadForNode) {//->初始化node lazy懒加载时的数据
                    this.loadForNode(node, () => {
                        setTimeout(()=> {
                            this.treeLoading = true;
                            let query = {nodeId: node.data[this.props.value]};
                            let ajaxOptions = {
                                data:this.nodeUrl.indexOf("parentId")>-1?{}:this.search,
                                url:this.nodeUrl,
                            };
                            if (this.noPermission){
                                ajaxOptions.data.noPermission = this.noPermission;
                            }
                            this.$ajaxPost(ajaxOptions,false,(res) => {
                                if (res.code === 200) {
                                    let resultData = res.data;
                                    if(this.returnForNode) {
                                        resultData = this.returnForNode(res.data,node);
                                    }else{
                                        if (node.level === 0){
                                            if(this.$getType(resultData) === "object")
                                                resultData = [resultData];
                                        }else if(node.level === 1) {
                                            if(this.$getType(resultData) === "object"){
                                                resultData = resultData[this.props.children];

                                            }
                                        }
                                    }
                                    if (node.level === 0)
                                        this.lazyData = new Array();
                                    else
                                        resultData.forEach(item=>item.parentData = node.data);
                                    this.initData(resultData)
                                    //不是第一层不准默认展开选中
                                    this.initDefaultChecked(resultData,!node.level)
                                    if(this.afterGetNode)
                                        this.afterGetNode(res.data,node)
                                    this.treeLoading = false;
                                    resolve(resultData);
                                } else this.$showMsg("error", res.errMsg);
                            })
                        },10)
                    })
                }
                this.$emit('update:refresh',false)
            },
            //初始化加载后的数据（例如：选中值禁用，虚机构标识）
            initData(data=this.treeData||[], parent) {
                let childrenKey = this.props.children;
                data.forEach((item, index) => {
                    //设置子父级区分
                    if (parent) {
                        this.$set(item, "parentData", parent);
                        this.$set(item, "parentId", parent[this.props.value]);
                    }
                    if(this.props.isFalse ){
                        if(this.$getType(this.props.isFalse)==='function'){
                          this.$set(item, "disabled", this.props.isFalse(item));
                        }else if(item[this.props.isFalse]){
                          this.$set(item, "disabled", true);
                        }
                  }
                    if (this.lazy) {
                        if(this.props.isLeaf)
                            this.$set(item, this.props.isLeaf, false);
                        //设置叶子节点
                        if (item[this.props.hasChildren]==="0" || item[this.props.hasChildren]===false)
                            this.$set(item, this.props.isLeaf, true);
                        //->选中值初始化
                        let useInit = item[this.props.value] === this.value;
                        if (this.multiple && this.value)
                            useInit = this.value.includes(item[this.props.value])
                        if(useInit){

                            this.initCheckedDataForLazy(item);
                        }

                    }
                    //->递归循环
                    if (item[childrenKey]&&item[childrenKey].length>0) {
                        let newParent = new Object();
                        for(let key in item) {
                            newParent[key] = item[key]
                        }
                        this.initData(item[childrenKey], newParent);
                    }
                });
            },
            //延迟初始化应用表格头部
            initHieght() {
                this.$nextTick(()=> {
                    if (this.$refs[this.id])
                        this.offsetTop = this.$refs[this.id].getBoundingClientRect().top;
                })
            },
            //->懒加载时初始化选中值
            initCheckedDataForLazy(data,isParent) {
                if(data) {
                    if(isParent) {
                        this.lazyData.push(data);
                        this.expandedData.push(data[this.props.value]);
                    }
                    if (data.parentData && data.parentData !== null) {
                        this.initCheckedDataForLazy(data.parentData,true);
                    }
                }
            },
            //初始化默认选中
            initDefaultChecked(data=this.treeData,init) {
                this.$nextTick(()=> {
                    let haveVal = this.value?true:false;
                    if(this.multiple && haveVal) {
                        haveVal = this.value.length > 0;
                    }
                    console.log("haveVal",haveVal)
                    if(haveVal){
                        if(this.selectable) {
                            let checkedVal = this.multiple?this.value:[this.value];
                            if(!this.value) checkedVal = new Array();
                            this.$refs.tree.setCheckedKeys(this.multiple?this.value:[this.value]);
                        }else{
                            //选中高亮
                            this.$refs.tree.setCurrentKey(this.value);
                            let node = this.$refs.tree.getNode(this.value);
                            if(node) {
                                //customNodeClick函数中也设置了选中高亮
                                this.customNodeClick(node.data,node);
                            }
                        }
                    }else{
                        if(this.defaultChecked)
                            //第一次选中
                            this.initSetChecked(data);
                        else{
                            if(this.selectable) {
                                this.$refs.tree.setCheckedKeys([]);
                            }else{
                                this.$refs.tree.setCurrentKey(null);
                            }
                        }
                    }
                    if(init !== false) {
                        console.log("infoinfo",data)
                        //第一次展开
                        this.initExpandData(data);
                        if(!this.lazy)
                            this.initScroll();
                    }
                })
            },
            //初始化默认选中（p找到第一条真值）
            initSetChecked(isFalseArray) {
                for (let i=0; i < isFalseArray.length; i++){
                    if(isFalseArray[i][this.props.isFalse]) {
                        if(isFalseArray[i][this.props.children] && isFalseArray[i][this.props.children].length > 0){
                            return this.initSetChecked(isFalseArray[i][this.props.children]);
                        }
                    } else {
                        if (this.selectable){
                            return this.checkClick(isFalseArray[i],{
                                    checkedKeys:[isFalseArray[i][this.props.value]],
                                    checkedNodes:[isFalseArray[i]]
                                }
                            );
                        }
                        else{
                            //点一次加载右侧数据，并获取value，发送根节点id并不是从value中获取的，是从departTree的node.data.id中拿到的
                            return this.customNodeClick(isFalseArray[i]);
                        }
                    }
                }
            },
            customNodeClick(data,node){
	            if(this.$refs.tree) {
	                //选中高亮
		            this.$refs.tree.setCurrentKey(data[this.props.value] || data.id);
	            }

	            this.$emit("nodeClick",data[this.props.value], data);
	            this.rightVisible = false;
            },
            //节点点击
            nodeClick(data,node) {
                if (data.disabled){
                  const oldValue = this.value
                  this.$refs.tree.setCurrentKey();
                  if(oldValue)
                    this.$refs.tree.setCurrentKey(oldValue);
                  return
                }
                if(this.$refs.tree) {
                    this.$refs.tree.setCurrentKey(data[this.props.value] || data.id);
                }
	            this.treeClickCount++;
                /* 双击处理*/
	            window.setTimeout(() => {
		            if (this.treeClickCount === 1) {
			            this.treeClickCount = 0;
		            } else if (this.treeClickCount >= 2) {
			            this.treeClickCount = 0;
			            if (this.defaultExpandData.length === 0){
			            	this.defaultExpandData = this.$deepClone(this.expandedData);
                        }else{
				            this.expandedData = this.$deepClone(this.defaultExpandData);
                        }
			            this.expandedData.push(data[this.props.value]);
		            }
	            }, 300);
	            this.$emit("nodeClick",data[this.props.value], data);
                this.rightVisible = false;
            },
            //节点双击
            nodeDbClick(data,node) {
                this.$emit("nodeDbClick",data[this.props.value], data);
                this.rightVisible = false;
            },
            //树形选择框选中
            checkClick(data, checkedData) {
                if(this.$refs.tree) {
                    this.$refs.tree.setCheckedKeys(checkedData.checkedKeys);
                }
                if (this.multiple) {
                    if (this.rule)
                        this.$validate.validRule(this.rule, checkedData.checkedKeys);
                    this.$emit("checkedChange",data,checkedData.checkedKeys, checkedData.checkedNodes);
                } else {
                    if (this.rule)
                        this.$validate.validRule(this.rule, [data[this.props.value]]);
                    this.$emit("checkedChange", data,data[this.props.value], data);
                }
            },
            //初始化展开集
            initExpandData(data) {
                if(!data)
                    data = this.treeData;
                setTimeout(()=> {
                    let checkedNode = this.selectable?this.$refs.tree.getCheckedNodes():this.$refs.tree.getCurrentNode();
                    if(!this.selectable)//->如果是高量选择设成数组格式
                        checkedNode = checkedNode?[checkedNode]:[];
                    if(checkedNode.length === 1 && !checkedNode[0].parentId) {
                        this.expandedData = [checkedNode[0][this.props.value]];
                        return;
                    }
                    // 下面的条件防止子节点只有一个节点，默认展开子节点的问题
                    //&& this.loadLazyNode && this.loadLazyNode.level == 0
                    if(checkedNode.length === 0 && data.length === 1 && this.lazy ) {
                        this.expandedData = [data[0][this.props.value]];
                        return;
                    }
                    let expandedData = checkedNode.filter(item=>{return item.parentId});
                    this.expandedData = expandedData.map(item=>item.parentId);
                });
            },
            //自定义显示
            renderContent(h, {node, data, store}) {
                if(this.render)
                    return this.render(h, {node, data, store})
                let classText = [
                    "iconfont blue",
                    node.data.icon?node.data.icon
                    :node.data[this.props.isFalse]?"icon-group red"
                    :node.level===1&&this.props.firstIcon?this.props.firstIcon
                    :node.data[this.props.children]&&node.data[this.props.children].length>0&&this.props.parentIcon?this.props.parentIcon
                    :this.props.childrenIcon?this.props.childrenIcon
                    :this.props.icon?this.props.icon
                    // :node.data.orgType==='010'?"icon-erjidanwei deepblue":"icon-homeopen blue"
                    :node.level===1?"icon-homeclose blue":"icon-homeopen blue"
                ];
                return (
                    <div class="commonTreeNode" title={node.label} >
                        <i class={classText}> </i>
                        <span class="nodeName"> {node.label}</span>
                    </div>
                );
            },
            //右击点击
            rightClick(event, object, value, element) {
                let id = this.props.value
                this.$emit("rightClick",object,value)
                if(this.operate.length>0) {
                    // this.nodeClick(object,value);
                    if (this.objectID !== object[id]) {
                        this.objectID = object.id;
                        this.rightVisible = true;
                        this.DATA = object;
                        this.NODE = value;
                    } else {
                        this.rightVisible = !this.rightVisible;
                    }
                    document.addEventListener('click',(e)=>{
                        this.rightVisible = false;
                    })
                    let menu = document.querySelector(`#${this.id} #rightClickMenu`)
                    // console.log(menu)
                    // console.log(menu.style.top)
                    let windowHeight = document.documentElement.clientHeight
                    // console.log(windowHeight)
                    let menuTop = event.clientY
                    // console.log(menuTop)
                    let parentTop = $(`#${this.id}`).offset().top;
                    // console.log(parentTop)
                    let basicHeight = this.operate.length*40;
                    // console.log(basicHeight)
                    let rateTop = menuTop - parentTop;
                    // console.log(rateTop)
                    let diff = windowHeight - menuTop - basicHeight;
                    // console.log(diff)
                    diff -=this.showTreeBottom?40:0;
                    // console.log(diff)
                    /* 菜单定位基于鼠标点击位置 */
                    menu.style.position = ""
                    menu.style.position = "absolute" // 为新创建的DIV指定绝对定位
                    menu.style.left = 200 + "px"
                    if(diff < 0) {
                        rateTop+=diff;
                    }
                    // console.log(rateTop)
                    // console.log(menu.style.top)
                    menu.style.top = rateTop + "px"
                }
            },
            // 右击点击菜单
            handleRightSelect(index) {
                let dataIndex = parseInt(index);
                if(this.operate[dataIndex].eName)
                    this.$emit(this.operate[dataIndex].eName, this.NODE,this.DATA)
            },
            //过滤节点
            filterNode(value, data) {
                if (!value) return true;
                return ~data[this.props.label].indexOf(value);
            },
            //初始化滚动条
            initScroll() {
                setTimeout(() => {
                    let containerOffsetTop = $(`#${this.id} >.treeBody`).offset().top;//->树形容器距离窗口top
                    let containerHeight = $(`#${this.id} >.treeBody`).height()
                    let elementOffsetTop = 0;
                    let checkedNode = $(`#${this.id} >.treeBody`).find(".is-current")
                    if (this.selectable)
                        checkedNode = $(`#${this.id} >.treeBody`).find(".is-checked");
                    if(checkedNode.length === 0)
                        return;
                    elementOffsetTop = checkedNode.offset().top;//->树形选中节点距离窗口top
                    let elementHeight = checkedNode.height()

                    let scrollTop = elementOffsetTop - containerOffsetTop - (containerHeight/2) + (elementHeight/2);//->实际树形滚动条定位top
                    $(`#${this.id} >.treeBody`).animate({scrollTop: scrollTop}, scrollTop>500?500:scrollTop)//->设置滚动条滚动到->携带动画
                },100);
            },
            getChecked() {
                return this.selectable?this.$refs.tree.getCheckedNodes():this.$refs.tree.getCurrentNode();
            },
            //获取节点
            getNode(key) {
                return this.$refs.tree.getNode(key);
            },
            //删除节点
            removeNode(data) {
                // if(data[this.props.value] && data[this.props.value] === this.value)
                //     this.$emit("input","");
                this.$refs.tree.remove(data);
            },
        }
    };
</script>
<style type="text/scss" lang="scss">
$treeFooter:40px;
.common-tree-wrapper {
    height: 100%;
    position: relative;
	.treeHead{
		border-bottom: 1px solid #ddd;
		.filterInput {
		    z-index: 10;
		    padding: 9px;
		}
	}

    .treeBody {
        padding: 5px 0 10px;
        overflow-y: auto;
        .commonTreeNode {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .treeFooter {
        display: flex;
        align-items: center;
        height: $treeFooter;
        padding: 0 15px 0 10px;
        justify-content: flex-end;
        border-top: 1px solid #ddd;
    }
    #rightClickMenu{
        width: auto;
        background: #fff;
        background-color: #FFF;
        border: 1px solid #EBEEF5;
        border-radius: 4px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        z-index: 100;
        .el-menu-item{
            padding: 0 10px;
            padding-left: 10px !important;
            border-bottom: 1px solid #e8e8e8;
        }
        .el-menu-item, .el-submenu__title {
            height: 40px;
            line-height: 40px;
        }
    }
    .el-tree-node__content>.el-checkbox {
        margin-right: 8px;
    }
    .el-tree-node[aria-disabled*=true]{
        >.el-tree-node__content{
          cursor: no-drop;
        }
    }
}

</style>
