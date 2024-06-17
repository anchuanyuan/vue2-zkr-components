<template>
    <div :class='["common-title-wrapper",{"showShadow":showShadow}]' :style="titleStyle">
        <div class="title-left">
            <div class="titleHead" v-if="title!==undefined">
                <!-- 此处title的信息 -->
                <div class="title">
                    <slot name="left">
                        <span v-if="icon" :class='["iconfont",icon]'></span>
                        <span v-else class="bg-icon-block"></span>
                    </slot>
                    <label v-if="title" class="titleName" >{{title}}</label>
                    <slot></slot>
                    <span v-if="count" :class='["count bgred"]'>{{count}}</span>
                    <slot name="options">
                        <span class="options" v-if="options">
                            ( <span v-for="(item,index) in options" :key="index">
                                <span v-if="item.name">{{item.name}}</span>
                                <span :class="item.class">{{item.count}}</span>
                                <span>{{item.unit}}</span>
                                <span v-if="index<options.length-1">,</span>
                            </span>)
                        </span>
                    </slot>
                </div>
                <div class="titleOther">
                    <!-- 此处title的更多内容 -->
                    <slot name="right"></slot><!-- 片段分发>title右侧 -->
                </div>
            </div>
            <div class="titleBody">
                <slot name="content"></slot><!-- 片段分发>title下方 -->
            </div>
        </div>
        <div class="title-right">
            <slot name="button"></slot>
            <el-button v-if="showBack"  type="primary" class="iconfont icon-fanhui" @click="back?back():$router.back(-1)">返回</el-button>
        </div>
        <br>
    </div>
</template>
<script>
    export default {
        props: {
            title:String,
            options:Array,
            height:String,
            icon:String,
            count:[Number,String],
            showBack:{
                type:Boolean,
                default:false
            },
            showShadow:{
                type:Boolean,
                default:false
            },
            border:{
                type:Boolean,
                default:false
            },
            back: {
                type:Function,
            }
        },
        data() {
            return {}
        },
        computed: {
            titleStyle() {
                let result = {};
                if(!this.showShadow)
                    result.minHeight = "40px";
                if(this.height)
                    result.height = this.height;
                if(this.border) {
                    result.borderBottom = "1px solid #ddd";
                }
                return result;
            }
        },
        methods: {
        }
    }
</script>
<style type="text/scss" lang="scss">
    $height:45px;
    $smallHeight:40px;
    $primary:#198fff;
    .common-title-wrapper {
        font-size: 14px;
        display: flex;
        flex-wrap:wrap;
        align-items: center;
        width: 100%;
        padding: 0 1em;
        min-height: $height;
        position: relative;
        background-color: #fff;
        z-index:1;
        &.showShadow{
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            z-index:2;
        }
        .title-left{
            flex:1;
            .titleHead{
                display: flex;
                align-items: center;
                .title{
                    flex:1;
                    .el-button.is-circle {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        padding: 0;
                    }
                    .bg-icon-block {
                        display: inline-block;
                        width: 4px;
                        height: 16px;
                        background-color: $primary;
                        position: relative;
                        top: 2px;
                        margin-right: 5px;
                    }
                    .titleName{
                        font-size: 1.2em;
                    }
                    .options {
                        color: #999999;
                        padding-left: 6px;
                    }
                    .count {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        border-radius: 50%;
                        position: relative;
                        top:-4px;
                    }
                }
                .titleOther{
                    display: flex;
                    align-items: center;
                }
            }
            .titleBody{
                .cadreInfo{
                    display: flex;
                    align-items: center;
                    img{
                        width: 40px;
                        height: 50px;
                    }
                }
                .itemInfo{
                    margin-right: 6em;
                    .el-button {
                        padding: 3px 5px;
                    }
                }
            }
        }
        .title-right{
            display: flex;
            align-items: center;
            .el-button {
                margin-left: 10px;
            }
        }
    }
    @media screen and (max-width: 1366px) {
        .common-title-wrapper{
            min-height: $smallHeight;
        }
    }
</style>
