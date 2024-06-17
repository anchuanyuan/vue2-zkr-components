<template>
    <div class="formDropDown">
        <slot></slot>
       <el-dropdown @command="handleCommand" :trigger="trigger" :placement="position">
            <slot name="linkDom">
              <span class="el-dropdown-link" @click.stop>
                  <slot name="link">
                      <slot name="left"></slot>
                      <el-button  :type='type' :class='["iconfont",icon]'>{{title}}<slot name="right"><i class="el-icon-arrow-down el-icon--right"></i></slot></el-button>
                  </slot>
              </span>
            </slot>
            <el-dropdown-menu slot="dropdown" >
                <slot name="dropdown">
                    <el-dropdown-item v-for="(item,index) in options"
                        :class='[item.class,item.icon,"iconfont",{"last":index===options.length-1}]'
                        :style="item.style"
                        :command="item" :key="index"
                    >
                        <span class="label" :style='item.style'>
                            {{item[props]}}
                            <slot name="other" :data='item'></slot>
                        </span>
                        <slot name='hint' :item='item'></slot>
                        <span v-if="item.children&&item.children.length>0" class="el-icon-caret-right"></span>
                        <ul v-if="item.children&&item.children.length>0" class="moreList" :style='level2Style'>
                            <li v-for="(list,listIndex) in item.children" :key="listIndex" :style='list.style' @click.stop="handleCommand(list)">
                                <slot name="level2" :data='list'>
                                    <span :class="list.icon"></span>
                                    <span class="label">{{list[props]}}</span>
                                </slot>
                            </li>
                        </ul>
                    </el-dropdown-item>
                </slot>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: 'formDropDown',
        props:{
            icon:String,                                    //图标图标
            title:String,                                   //提示文字
            type:{                                          //展示方式 text/button primary/danger...
                type:String,
                default:""
            },
            trigger:{                                       //触发方式
                type:String,
                default:"click"
            },
            position:{                                      //定位
                type:String,
                default:"bottom"
            },
            options:{                                       //数据
                type:Array,
                default() {
                    return [];
                }
            },
            config:[String,Array,Object,Number,Boolean],    //配置
            props:{                                         //主键
                type:String,
                default:"name"
            },
            level2Style: Object
        },
        data() {
            return {};
        },
        methods: {
            handleCommand(command) {
                if(this.config)
                    command.config = this.config;
                this.$emit("click",command);
            }
        },
    }
</script>
<style lang="scss" type="text/scss">
    .formDropDown {
        .el-dropdown-link{
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        .el-button {
            margin: 0 !important;
        }
    }
    .el-popper[x-position^=bottom]{
        margin-top: 5px;
    }
    .el-popper[x-placement^=bottom]{
        margin-top: 5px;
    }
    .el-dropdown-menu{
        z-index: 10001;
        padding: 0;
        .el-dropdown-menu__item{
            display: flex;
            align-items: center;
            padding:5px 10px;
            border-bottom: 1px solid #e8e8e8;
            position: relative;
            .label{
                flex:1;
                padding-left: 2px;
            }
            &.last{
                border: none;
            }
            &:last-child {
                border: none;
            }
            .iconfont{
                margin-right: 2px;
            }
            &:hover {
                .moreList {
                    display: block;
                }
            }
            .moreList {
                display: none;
                position:absolute;
                width: 120px;
                right: -120px;
                top: -1px;
                color: #606266;
                background-color: #FFF;
                border: 1px solid #EBEEF5;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                border-radius: 4px;
                li {
                    display: block;
                    font-size: 13px;
                    padding:5px 10px;
                    border-bottom: 1px solid #e8e8e8;
                    position: relative;
                    &.last{
                        border: none;
                    }
                    &:last-child {
                        border: none;
                    }
                    &:hover {
                        background-color: #ecf5ff;
                        color: #66b1ff;
                        ul {
                            display: block;
                        }
                    }
                }
            }
        }
    }
</style>