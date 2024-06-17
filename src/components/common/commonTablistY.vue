<template>
    <div :class="['common-tablistY-wrapper',]" :style="containerStyle">
        <div :class="['listY-left',{'border':border}]" :style="style">
            <div v-if="filterable" class="listHead">
                <formInput  class="filterInput" radius v-model="searchText" placeholder="请输入搜索关键字" suffixIcon="el-icon-search" @iconClick="onSearch"></formInput>
            </div>  
            <commonContainer :height="height?height:''" :offset="offset">
                <ul v-if="data.length>0">
                    <li v-for="(tab, index) in data"
                        :key="index" @click="choose(index,tab)"
                        :class='["e_navbar_item",{"active":index===value}]'
                    >
                        <span class="tabs-title">
                            <slot name="tabName" :tab="tab" :index="index">
                                <i :class="['iconfont',tab.class,tab.icon]"></i>
                                <a :title="tab.name">{{tab.name}}</a>
                            </slot>
                        </span>
                        <span v-if="tab.valid===false" class="validError el-icon-warning"></span>
                        <slot :tab="tab" :index="index"></slot>
                    </li>
                </ul>
                <div class="listY-bottom">
                    <slot name="bottom"></slot>
                </div>
            </commonContainer>
        </div>
        <div class="listY-right">
            <slot name="components"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: "commonTablistY",
        props: {
            width:String,
            border:Boolean,
            height:[Number,String],
            options: Array,
            value: {
                type:Number,
                default:0
            },
            filterable: {
                type:Boolean,
                default: false
            },
            offset: {
                type:Number,
                default: 0
            },disabled: {
                type:Boolean,
                default: false
            },
        },
        data() {
            return {
                data: [],
                loading:true,
                searchText:"",
            }
        },
        mounted() {
            if (this.options)
                this.initData(this.options);
        },
        computed: {
            containerStyle() {
                let result = {};
                if(this.height)
                    result.height = `calc(${this.height})`
                return result;
            },
            // offset() {
            //     if(this.filterable) {
            //         return 0
            //     }
            // },
            style() {
                let result = {
                    width:this.width || "100%",
                };
                return result;
            },
        },
        watch: {
            options:{
                handler() {
                    this.initData(this.options);
                },deep:true
            }
        },
        methods: {
            initData(data) {
                this.data = data.map((item)=> {
                    if(item.show!==false)
                        return item;
                });
                this.loading = false;
            },
            choose(index, data) {
                if(!this.disabled){
                    this.$emit("input",parseInt(index));
                    this.$emit("change", data,index)
                }
            },
            onSearch() {
                let result = this.options.filter((item)=> {
                    return ~item.name.indexOf(this.searchText);
                })
                console.log(result)
                this.initData(result);
                // this.$emit("onSearch",this.searchText);
            },
        }
    }
</script>
<style type="text/scss" lang="scss">
    $height:35px;
    .common-tablistY-wrapper {
        display: flex;
        background-color: #fff;
        .listY-left {
            height: 100%;
            overflow-y: auto;
            &.border {
                border-right: 1px solid #E8E8E8;
            }
            li {
                display: flex;
                cursor: pointer;
                font-size: 14px;
                padding: 0 10px;
                position: relative;
                align-items: center;
                min-height: $height;
                border-left: 5px solid transparent;
                .el-button{
                    padding: 0;
                }
                .tabs-title {
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    i {
                        padding-right: 5px;
                    }
                }
                .validError {
                    color: red;
                    font-size: 20px;
                    position: absolute;
                    top: 9px;
                    right: 9px;
                }
                &.active {
                    background-color: rgba(33, 138, 255, 0.1);
                    border-right: 5px solid #198FFF;
                    padding-right:5px;
                    .tabs-title {
                        a {
                            color: #198FFF;
                        }
                        i {
                            color: #198FFF;
                        }
                    }
                }
            }
            .listY-bottom {
                display: flex;
                justify-content: center;
            }
        }
        .listY-right {
            flex: 1;
            height: 100%;
        }
        .addBtn {
            display: flex;
            justify-content: center;
        }
    }
</style>
