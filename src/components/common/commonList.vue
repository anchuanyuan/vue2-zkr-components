<template>
    <div :id="id" :ref="id" :class="['common-list-wrapper',type,{'configHeight':height || autoHeight}]">
        <div class="list-container">
            <slot></slot>
            <div class="right-content">
                <div v-if="filterable" class="listHead">
                    <formInput  class="filterInput" radius v-model="searchText" placeholder="请输入搜索关键字" suffixIcon="el-icon-search" @iconClick="onSearch"></formInput>
                </div>
                <div class="listBody" :style="{height:Height}">
                    <div class="item" v-show="showCheckedAll">
                        <div class="label"><span class="name">全选</span></div>
                        <formCheckedBox v-model="checkedAll" @change="changeAll()"></formCheckedBox>
                    </div>
                    <div :class='["item",{"active":item.checked}]' v-for="(item,index) in data" :key="index" >

                        <div class="label" @click.stop="clickList(item,data,index)">
                            <slot name="label" :item="item">
                                <span class="blue iconfont icon-homeclose"></span>
                                <span class="name">{{item[props.label]}}</span>
                            </slot>
                        </div>
                        <formCheckedBox v-model="item.checked" @change="change(data,index)"></formCheckedBox>
                    </div>
                    <slot name="noData"></slot>
                </div>
                <div class="listFooter">
                    <slot name="bottom"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'commonList',
    props:{
        offset: {                                               //高度偏移
            type: Number,
            default: 0
        },
        showCheckedAll: {                                      //多选
            type: Boolean,
            default: false
        },
        height: String,                                         //高度
        autoHeight: {                                           //->是否自动高度
            type: Boolean,
            default: false
        },
        value:[Array,String],                                   //选中值
        filterable:{                                            //过滤
            type:Boolean,
            default:false,
        },
        multiple: {                                             //多选
            type:Boolean,
            default:false,
        },
        type:String,                                            //显示方式
        props:{                                                 //配置
            type:Object,    
            default:()=> {
                return {
                    value:"id",
                    label:"name"
                }
            }
        },
        options:{                                               //->是否多选
            type:Array,
            default:()=> {
                return []
            }
        },
    },
    data () {
        let id =
            "commonList" +
            (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
        return {
            id: id,
            data:[],
            loaded:false,
            searchText:"",
            checkedAll: false,
            offsetTop:0,
            offsetBottom:0,
        }
    },
    created(){
        this.initData();
        this.initHieght();
    },
    computed:{
        //重新渲染高度
        refreshHeight() {
            if (this.$store.state.refreshHeight) this.initHieght()
            return this.$store.state.refreshHeight
        },
        //列表高度
        Height() {
            if (this.refreshHeight)
                this.$store.commit("updateRefreshHeight", false)
            if (this.autoHeight) {
                let offsetOther = 0 + this.offset + this.offsetBottom;
                if ($(`#${this.id} .listHead`).height())
                    offsetOther += $(`#${this.id} .listHead`).height();
                if ($(`#${this.id} .listFooter`).height())
                    offsetOther += $(`#${this.id} .listFooter`).height();
                
                if (this.height) {
                    this.offsetTop = 0;
                    return `calc(${this.height} - ${this.offsetTop}px - ${offsetOther}px)`;// - 10
                }else{
                    return `calc(100vh - ${this.offsetTop}px - ${offsetOther}px)`;
                }
            }else {
                if (this.height) return this.height;
            }
            return "auto";
        },
    },
    watch:{
        options:{
            handler() {
                this.initData();
            },deep:true
        },
        value:{
            handler() {
                this.initData();
            },deep:true
        }
    },
    methods:{
        initData(data) {
            if(!data)
                data = this.$deepClone(this.options);
            this.data = data.map((item)=> {
                this.$set(item,"checked",false);
                if(this.value) {
                    if(this.multiple) {
                        if(~this.value.indexOf(item[this.props.value]))
                            this.$set(item,"checked",true);
                    }else{
                        if(this.value === item[this.props.value])
                            this.$set(item,"checked",true);
                    }
                }
                return item;
            })
        },
        //延迟初始化应用表格头部
        initHieght() {
            this.$nextTick(()=> {
                if (this.$refs[this.id])
                    this.offsetTop = this.$refs[this.id].getBoundingClientRect().top;
            })
        },
        // 点击列表项复选框选中
        clickList(item,data,dataIndex) {
            item.checked = !item.checked
            this.change(data,dataIndex)
        },
        // 全选、取消全选
        changeAll() {
            if(this.multiple) {
                if(this.checkedAll) {
                    this.data.forEach(item => {
                        item.checked = true
                    })
                } else {
                    this.data.forEach(item => {
                        item.checked = false
                    })
                }
                this.change(this.data)
            }
        },
        change(data,dataIndex) {
            let checkedId = null;
            let checkedData = null;
            if(this.multiple) {
                checkedData = this.data.filter((item)=>{
                    return item.checked;
                });
                checkedId = checkedData.map(item=>item[this.props.value]);
            }else{
                this.data.forEach((item,index)=>{
                    if(index !== dataIndex)
                        this.$set(item,"checked",false);
                })
                checkedData = this.data.filter((item)=>{
                    return item.checked;
                })[0];
                checkedData = checkedData ? checkedData : []
                checkedId = checkedData[this.props.value] ? checkedData[this.props.value] : ''
            }
            if(checkedId.length != this.data.length)
                this.checkedAll = false
            this.$emit("input",checkedId)
            this.$emit("change",checkedData,checkedId);
        },
        onSearch() {
            let arr = this.$deepClone(this.options)
            let result = arr.filter((item)=> {
                return ~item[this.props.label].indexOf(this.searchText);
            })
            this.initData(result);
            this.$emit("onSearch",this.searchText);
        },
    },
}
</script>
<style lang="scss">
.common-list-wrapper{
    &.configHeight {
        height: 100%;
        .list-container {
            height: 100%;
            .right-content {
                height: 100%;
            }
        }
    }
    .common-tablistY-wrapper {
        .common-container-wrapper {
            border-right: 1px solid #eee;
            background-color: #fafafa;
        }
    }
    &.card {
        .list-container{
            .listBody{
                padding: 10px 10px 10px 10px;
                .item{
                    padding: 10px;
                    border: 1px solid #eee;
                    border-radius: 5px;
                    &:not(:last-child) {
                        margin-bottom: 10px;
                    }
                    &.active {
                        border-color: #198fff;
                    }
                }
            }
        }
    }
    .list-container {
        display: flex;
        .right-content {
            flex: 1;
        }
        .listBody{
            padding: 0 10px;
            overflow-y: auto;
            .formCheckedbox {
                height:auto;
            }
            .item {
                display: flex;
                align-items: center;
                padding: 6px 0;
                &:not(:last-child) {
                    border-bottom: 1px solid #eee;
                }
                .label{
                    flex: 1;
                    cursor: pointer;
                    .iconfont{
                        padding: 0 5px;
                    }
                }
            }
        }
    }
    .el-checkbox__inner {
        width: 18px;
        height: 18px;
        &::after {
            height: 12px;
            width: 6px;
            top: -1px;
            left: 4px;
        }
    }
}
</style>
