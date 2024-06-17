<template>
    <div :class='["common-search-wrapper",{"border":border===true}]' >
        <div class="main">
            <slot>
                <div class="search-left">
                    <slot name="left"></slot>
                </div>
                <div class="search-right">
                    <slot name="right"></slot>
                    <el-button v-if="showMore" :class='["moreBtn","right",{"open":showMoreSearch}]'  type="text primary" @click="clickMore()">
                        高级搜索
                        <i class="el-icon-arrow-down"></i>
                    </el-button>
                    <slot name="right1"></slot>
                </div>
            </slot>   
        </div> 
        <el-collapse-transition>
            <div class="otherSearch" v-if="showMoreSearch&&!dialog">
                <slot name="more"></slot>
                <div class="operate">
                    <el-button  type="primary" class="el-icon-refresh" @click="reset()"> 重置</el-button>
                    <el-button  type="primary" class="el-icon-search" @click="search()"> 搜索</el-button>
                </div>
            </div>
        </el-collapse-transition>
        <commonDialog :visible.sync="showMoreSearch" title="高级搜索" v-if="dialog" :save="save">
            <slot name="more"></slot>
        </commonDialog>
    </div>
</template>
<script>
    export default {
        props: {
            border:{
                type:Boolean,
                default:false,
            },
            showMore:{
                type:Boolean,
                default:false,
            },
            dialog:{
                type:Boolean,
                default:false,
            },
            form:{
                type:Object,
                default:()=> {
                    return {}
                }
            },
        },
        data() {
            return {
                showMoreSearch:false,
            }
        },
        mounted() {
        },
        methods: {
            clickMore() {
                this.showMoreSearch = !this.showMoreSearch;
                this.$emit("clickMore");
                setTimeout(()=> {
                    this.$store.commit("updateRefreshHeight",true);
                },500)
            },
            reset() {
                for(var key in this.form)
                    this.form[key] = null;
                this.$emit("reset");
            },
            search() {
                this.$emit("search");
            },
            save() {
                this.$emit("save");
            }
        }
    }
</script>
<style type="text/scss" lang="scss">
$inputHeight:28px;
$height:34px;
//全局搜索处样式
.common-search-wrapper {
    margin-bottom: 8px;
    .easyBtn{
        position: relative;
        .count {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            position: absolute;
            top: -6px;
            right: -10px;
            z-index: 10;
        }
    }
    &.border {
        border-bottom: 1px solid #ddd;
        padding-left: 10px;
        padding-right: 10px;
    }
    >.main {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        .search-left{
            flex:1;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        .search-right{
            display: flex;
            align-items: center;
            :last-child {
                margin-right: 0;
            }
            .moreBtn{
                i{
                    transition: transform .3s ease-in-out;
                }
                &.open {
                    i{
                        transform: rotate(180deg);
                    }
                }
            }
        }
        .search-left,.search-right {
            >.el-button {
                margin:0 10px 0 0;
            }
            >.formInput,.formSelect,.formDropDown,.formDate,.formDateRange {
                margin:0 10px 0 0;
            }
            :last-child {
                margin:0px;
            }
        }
        .formDateRange {
            width: 220px;
        }
        .formInput, .formSelect, .formDate,.formInputSelect{ /*位置偏移*/
            &:not(.auto){
                width: 170px;
                &.large {
                    width: 200px;
                }
                &.mini {
                    width: 100px;
                }
                &.small {
                    width: 120px;
                }
            }
        }
    }
    .otherSearch {
        padding-top: 8px;
        overflow: hidden;
        .formRow {
            margin-bottom: 5px;
        }
        .operate {
            text-align: right;
        }
    }
}
@media screen and (max-width: 1280px) {
    .common-search-wrapper{
        .common-form-wrapper{
            .formRow{
                width:33% !important;
            }
        }
    }
}
@media screen and (max-width: 980px) {
    .common-search-wrapper{
        .common-form-wrapper{
            .formRow{
                width:50% !important;
            }
        }
    }
}
@media screen and (max-width: 600px) {
    .common-search-wrapper{
        .common-form-wrapper{
            .formRow{
                width:100% !important;
            }
        }
    }
}
</style>