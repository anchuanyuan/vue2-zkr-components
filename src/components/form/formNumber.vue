<template>
    <div class="formNumber">
        <el-input-number :class="['formInputNumber',{'invalid-input': validInput}]" :size="size" 
            v-model="inputValue" :controls-position="position"
            :max="max" :min="min" :step="step" :readonly="readonly" :disabled="disabled" @change="change"
        ></el-input-number>
        <slot></slot>
    </div>
</template>
<script>
    export default {  
        name: 'formNumber',  
        props:{
            value:[Number,String],              //值
            rule:Object,                        //验证规则
            size:String,                        //数字框型号mini,small,large
            max:Number,                         //最大值
            min:Number,                         //最小值
            step:{                              //加或减的范畴
                type:Number,
                default:1
            },
            position:{                          //按钮定位
                type:String,
                default:"right"
            },
            readonly:{                          //是否只读
                type:Boolean,
                default:false
            },
            disabled:{                          //是否禁用
                type:Boolean,
                default:false
            }
        },
        data() {
            return {}
        },
        computed: {
            inputValue: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit("input", val);
                },
            },
            validInput: {
                get() {
                    if (this.rule) {
                        return this.rule.valid === false;
                    } else {
                        return false;
                    }
                },
            },
        },
        methods: {
            change(val) {
                if(this.rule)
                    this.$validate.validRule(this.rule,val);
                this.$emit("change",val);
            }
        },
    }
</script>
<style lang="scss" type="text/scss">
    .formNumber {
        .formInputNumber {
            &.invalid-input {
                .el-input__inner {
                    border: #ff4848 1px solid !important;
                }
            }
        }
    }
</style>

