<template>
    <div :class="['formDateRange',{'invalid-input': validInput}]">
        <el-date-picker
                @change="change"
            v-model="inputValue"
            :type="type+'range'"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled="disabled">
        </el-date-picker>
    </div>
</template>
<script>
    export default {  
        name: 'formDateRange',  
        props:{
            start:[String,Number,Object],       //开始时间
            end:[String,Number,Object],         //结束时间
            rule:Object,                        //验证规则
            type:{                              //类型
                type:String,
                default:"date",//date,datetime,month
            },                        
            clearable:{                         //是否可删除
                type:Boolean,
                default:false,
            },      
            disabled:{                          //是否禁用
                type:Boolean,
                default:false,
            },
            
        },
        data() {
            return {};
        },
        computed: {
            format() {
                let format = "YYYY-MM-DD";
                switch(this.type) {
                    case "date":
                        format = "YYYY-MM-DD";
                        break;
                    case "datetime":
                        format = "YYYY-MM-DD HH:mm:ss";
                        break;
                    case "month":
                        format = "YYYY-MM";
                        break;
                }
                return format;
            },
            inputValue: {
                get() {
                    let returnDate = new Array();
                    returnDate.push(this.start?this.start:"");
                    returnDate.push(this.end?this.end:"");
                    return returnDate;
                },
                set(val) {
                    this.$emit("update:start",val&&val[0]?this.$moment(val[0]).format(this.format):"");
                    this.$emit("update:end",val&&val[1]?this.$moment(val[1]).format(this.format):"");
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
            blur() {
                if (this.rule) 
                    this.validRule(this.inputValue);
            },
            change(val) {
                this.validRule(val);
                this.$emit("change", val);
            },
            validRule(val) {
                let validVal = "";
                if(val&&val!=="Invalid date")
                    validVal = val;
                if (this.rule) 
                    this.$validate.validRule(this.rule, validVal);
            }
        },
    }
</script>
<style lang="scss" type="text/scss">
    .formDateRange{
        width: 100%;
        &.invalid-input {
            .el-input__inner {
                border: #ff4848 1px solid !important;
            }
        }
        .el-range-input{
            width: 35%;
        }
        .el-range-separator {
            width: 10%;
        }
    }
</style>
