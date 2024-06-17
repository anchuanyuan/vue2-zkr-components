<template>
    <div :id="id" :class="'formRow '+className" :style="style">
        <slot name="content">
            <div class="itemContent">
                <div :class='["form-label",{"icon":icon}]' :style="{width:labelWidth?labelWidth:'25%'}">
                    <div :class="['labelContent',{'round-align':round}]">
                        <span :class="['iconfont',icon]"></span>
                        <span class="mark">{{required?"*":"&nbsp;"}}</span>
                        <span class="label">{{label}}<slot name="lableOther"></slot></span>

                    </div>
                </div>
                <div class="form-input" ref="formContent">
                    <slot></slot>
                    <div class="ms-message">
                        <span>{{message}}</span>
                    </div>
                </div>
                <div class="form-other" :style="{width:otherWidth?otherWidth:'auto'}">
                    <slot name="other" class="form-other"></slot>
                </div>
                <div class="form-msg" :style="{width:msgWidth}">
                    <div class="hint" v-if="showHint">
                        <span v-show="hint" :class="['lightGray',isLightRed?'lightRed':'']">({{hint}})</span>    
                        <span v-show="warning" class="red">({{warning}})</span>    
                    </div>
                    <div v-if="message" class="message">{{message}}</div>
                </div>
            </div>
        </slot>
    </div>
</template>
<script>
    export default {
        name: 'formRow',
        props: {
            className: {                     //css类名
                type:String,
                default:""
            },
            hint: String,                   //提示文字
            rule: Object,                   //验证规则
            width: String,                  //宽
            label: String,                  //标题文字
            icon:String,                    //图标
            labelWidth: String,             //标题宽
            otherWidth: String,             //其他宽
            msgWidth: {                     //提示消息宽
                type:String,
                default:"20%"
            },
            rowspan:[Number, String],       //合并行数
            round: {                        //两端对其文字
                type: Boolean,
                default:false
            },
            required: {                     //验证特殊字符
                type: Boolean,
                default: false
            },
            isLightRed: {                     // 更改hint提示颜色
                type: Boolean,
                default: false
            },               
        },
        data() {
            let id =
                "formRow" +
                (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
            return {
                id:id,
                showHint:false,
                warning:"",//警告文字
            }
        },
        computed: {
            style() {
                let result = {};
                if (this.width)
                    result.width = this.width;
                else
                    result.width = "100%";
                if(this.rowspan !==undefined)
                    result.height = 28*this.rowspan+(this.rowspan-1>0?this.rowspan*6:0)+"px";//minHeight
                return result;
            },
            message: {
                get() {
                    if (this.rule) {
                        if (this.rule.valid === false)
                            return this.rule.msg;
                        else {
                            let ruleMsg = new Array();
                            for (var key in this.rule) {
                                if (this.rule[key].valid === false) {
                                    ruleMsg.push(this.rule[key].msg);
                                }
                            };
                            if (ruleMsg.length > 0) {
                                return ruleMsg[0];
                            } else {
                                return null;
                            }
                        }
                    } else
                        return null;
                }
            },
        },
        watch: {
            hint() {
                this.initShowHint();
            },
            warning() {
                this.initShowHint();
            }
        },
        created() {
            this.initShowHint();
        },
        methods: {
            initShowHint() {
                if(this.hint) {
                    if(this.hint === "原："||~this.hint.indexOf("undefined")||~this.hint.indexOf("null")) {
                        this.showHint = false;
                        return;
                    }
                }else if(!this.warning) {
                    this.showHint = false;
                    return;
                }
                this.showHint = true;
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
$bottomGap:12px;
$bigBottomGap:16px;
    .formRow {
        margin-bottom: $bottomGap;
        line-height: 28px;
        &:last-child{
            margin-bottom: 0;
        }
        .lightRed{
            color: red;
        }
        .itemContent {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 10px;
            .form-label {
                line-height: 1;
                text-align: right;
                position: relative;
                top: 5px;
                align-self: flex-start;
                .labelContent {
                    display: flex;
                    align-items: center;
                    .mark {
                        flex: 1;
                        width: 6px;
                        display: inline-block;
                        color: #ff0000;
                    }

                    .label {
                        display: inline-block;
                        //font-size: 0.89em;
                    }
                    &.round-align {
                        > .label {
                            display: inline-block;
                            height: 100%;
                            width: calc(100% - 60px);
                            text-align: justify;
                            text-align-last: justify;
                        }
                    }
                }
            }

            .form-input {
                flex: 1;
                padding-left: 6px;
                margin-right: 4px;
                .ms-message {
                    display: none;
                    position:relative;
                    line-height: 1;
                    span {
                        color: #ff0000;
                        font-size: 12px;
                        position: absolute;
                        top: 3px;
                        left:5px;
                    }
                }
            }

            .form-msg {
                .hint {
                    font-size: 13px;
                }
                .message {
                    color: #ff0000;
                    font-size: 12px;
                }
            }
            .form-other {
                width: 50%;
                display: flex;
                align-items: center;

                .hint {
                    font-size: 13px;
                }
            }
        }
        .common-tree-wrapper {
            .treeTop {
                padding-top: 0;
            }
        }
    }
    @media screen and (max-width: 1280px) {
        .formRow {
            margin-bottom: $bigBottomGap;
            .form-msg{
                display: none!important;
            }
            .ms-message{
                display:block!important;
            }
        }
    }
    @media screen and (max-width: 960px) {
        .formRow {
            width: 100%!important;
        }
    }
</style>
