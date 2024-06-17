<template>
        <el-transfer  class="common-transfer-wrapper"
            :filterable="filter"
            :filter-method="filterMethod"
            filter-placeholder="请输入关键字搜索"
            v-model="inputVal"
            :data="data"
            :props="props"
            @change="change"
            :format="format"
            :titles="titles"
            :button-texts="buttonTexts"
            :render-content="renderFunc"
            :left-default-checked="[]"
            :right-default-checked="[]"
        >
            <slot name="left-footer"></slot>   
            <slot name="right-footer"></slot>     
        </el-transfer>
</template>
<script>
    export default {
        props:{
            value:Array,
            options:Array,
            search:Object,
            funcRender:Function,
            leftChecked:Array,
            rightChecked:Array,
            props:{
                type:Object,
                default:()=>{
                    return {
                        label:"name",
                        key:"id",
                        disabled:"disabled"
                    }
                }
            },
            format:{
                type:Object,
                default:()=>{
                    return {
                        // noChecked: '${total}',
                        // hasChecked: '${checked}/${total}'
                    }
                }
            },
            titles:{
                type:Array,
                default:()=>{
                    return ['未选择','已选择']//[]
                }
            },
            buttonTexts:{
                type:Array,
                default:()=>{
                    return []//['左移动', '右移动'];
                }
            },
            filter:{
                type:Boolean,
                default:true
            }
        },
        data() {
            return {
                data:[],
            };
        },
        computed:{
            inputVal:{
                get() {
                    if(this.value)
                        return this.value;
                    else
                        return [];
                },
                set(val) {
                    this.$emit("input",val);
                }
            }
        },
        mounted() {
            if(this.options){
                this.data = this.$deepClone(this.options);
                return;
            };
            if(this.url){
                this.loadData();
                return;
            };
        },
        watch:{
            search:{
                handler() {
                    this.loadData();
                },deep:true
            },
            options:{
                handler() {
                    this.data = this.$deepClone(this.options);
                },deep:true
            },
        },
        methods:{
            loadData() {
                let ajaxOptions = {
                    url:this.url,
                    data:this.search
                };
                this.$ajaxPost((res)=> {
                    if(res.code===200) {
                        this.data = res.data;
                    }else{
                        this.$showMsg("error",res.message);
                    }
                })
            },
            renderFunc(h, option) {
                if(this.funcRender)
                    return this.funcRender(h, option);
                return <span>{ option[this.props.label] }</span>;
            },
            filterMethod(query, item) {
                return item[this.props.label].indexOf(query) > -1;
            },
            change(data,where,changeData) {
                this.inputVal = data;
                let checkedData = this.options.filter((item)=>{
                    if(~data.indexOf(item[this.props.key]))
                        return item;
                });
                this.$emit("change",data,checkedData)
            }
        }
    };
</script>
<style type="text/scss" lang="scss">
    .common-transfer-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-transfer-panel__item {
            &.is-checked {
                background-color: #f3f5f9;
            }
        }
        .el-transfer-panel__filter {
            margin: 0;
            padding: 8px;
            border-bottom: 1px solid #ddd;
            .el-input__inner{
                height:28px;
                line-height:28px;
            }
            .el-input__icon{
                line-height:28px;
            }
        }
    }
</style>