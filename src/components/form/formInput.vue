<template>
    <div :class="['formInput',{'search':search},{'radius':radius}]" >
        <el-input class="content" :class="[{'invalid-input': validInput}]"
            v-model="inputValue" :clearable="clearable" 
            :disabled="disabled" :readonly="readonly"
            :type="type" :size="size" :min="min" :max="max"
            :placeholder="placeholder" :rows="rows" :maxlength="maxlength"
            :step="step" :autosize="autosize"
            @blur="blur()"
            @focus="focus()"
            @keyup.enter.native="handleIconClick()"
            @clear="clear()"
            onsubmit="return false;"
        >
            <i v-if="prefixIcon" slot="prefix" :class="['el-input__icon',prefixIcon]"></i>
            <i v-if="suffixIcon" slot="suffix" :class="['el-input__icon',suffixIcon]" @click="handleIconClick"> </i>
        </el-input>
        <div class="boxBtn">
             <el-button  v-if="search" :disabled="disabled"  class='searchBtn' type="primary" @click="searchClick">{{search}}</el-button>
            <el-button  v-if="add" :disabled="disabled" class='addBtn' type="primary" @click="addClick">{{add}}</el-button>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'formInput',
        props:{
            value:[String,Number,Array],                //值
            min:Number,                                 //为number时最小值
            max:Number,                                 //为number时最大值
            type:String,                                //类型,number,text,textarea
            size:String,                                //small,large,mini
            step:{type:Number, default:1},              //前面的空格占位符数量
            placeholder:{type:String,default:"请输入"},       //提示文字
            rows:{type:Number,default:3},               //位textarea时的行数
            radius:{type:Boolean,default:false},        //是否圆角框
            autosize:{type:Boolean,default:false},      //位textarea时自动根据文本撑开高度
            readonly:{type:Boolean,default:false},      //是否只读
            disabled:{type:Boolean,default:false},      //是否禁用
            mustlower:{type:Boolean,default:false},     //是否必须小写
            prefixIcon:String,                          //前置图标
            suffixIcon:String,                          //后置图标
            clearable:{type:Boolean,default:false},     //是否可清空
            rule:[Array,Object],                        //验证规则
            search:String,
            add:String,                              //其他按钮自定义
            maxlength:Number
        },
        data() {
            return {}
        },
        computed: {
            inputValue: {
                get() {
                    if(this.$getType(this.value) === "array")
                        return this.value.join(",");
                    return this.value;
                },
                set(val) {
                    this.ruleVal();
                    this.change(val);
                    if (this.mustlower) val = val.toLowerCase();
                    if (this.type==="number") val = parseFloat(val);
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
            clear() {
                this.$emit('clear');
            },
            blur() {
                this.ruleVal();
                this.$emit('blur');
            },
            focus() {
                this.$emit('focus');
            },
            handleIconClick() {
                this.$emit("iconClick", this.inputValue);
                return false;
            },
            change(val) {
                this.$emit("change", val);
            },
            searchClick() {
                this.$emit("search");
            },
            addClick(){
                this.$emit("add");
            },
            ruleVal() {
                setTimeout(()=>{
                    if (this.rule) {
                        this.$validate.validRule(this.rule, this.inputValue);
                    }
                })
            },
        },
    }
</script>
<style lang="scss" type="text/scss">
.formInput {
    position: relative;
    display: flex;
    align-items: center;
    .content {
        flex:1;
    }
    &.search {
        .el-input__inner {
            padding-right: 45px;
        }
    }
    .boxBtn {
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        .searchBtn{
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
        }
        .addBtn{
           border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
            margin:0px;
        }
    }
    &.radius {
        .el-input__inner {
            border-radius: 15px;
        }
    }
    .el-input__inner {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    .invalid-input {
        .el-input__inner {
            border: #ff4848 1px solid !important;
        }
        .el-textarea__inner{
            border: #ff4848 1px solid !important;
        }
    }
}
</style>
