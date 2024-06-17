<template>
    <div :class="['formTags',{'invalid-input': validInput}]">
        <span v-if="inputVal.length<1" class="placeholder">{{placeholder}}</span>
        <el-tag :size="size" v-for="(item,index) in inputVal" :type="item.type" :key="index" closable @close="tagClose(item,index)">{{item[props.label]}}</el-tag>
    </div>
</template>

<script>
    export default {
        name: 'formTags',
        props:{
            size:String,                                //尺寸
            value:Array,                                //值
            rule:Object,                                //验证规则
            placeholder:{                               //提示文字
                type:String,
                default:"请填充"
            },
            props:{                                     //配置项
                type:Object,
                default:()=> {
                    return {
                        label: "name",
                        value: "id"
                    }
                }
            },

        },
        data() {
            return {
                data:[]
            };
        },
        computed: {
            inputVal: {
                get() {
                    if(this.value){
                        return this.value;
                    }
                    else
                        return this.data;
                },
                set(val) {
                    this.$emit("update:input",val);
                }
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
            tagClose(data,index) {
                this.inputVal.splice(index,1);
                if(this.value&&this.rule){
                    this.$validate.validRule(this.rule, this.inputVal);
                }
                this.$emit('tagClose',data);
            },
        },
    }
</script>
<style lang="scss" type="text/scss">
    .formTags {
        width: 100%;
        padding: 0 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        min-height:30px;
        max-height: 200px;
        overflow-y: auto;
        position: relative;
        .placeholder{
            font-size: 12px;
            color: #CBCBCB;
        }
        &.invalid-input {
            border: #ff4848 1px solid !important;
        }
    }
</style>
