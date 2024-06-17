<template>
    <div :class="['formInputSelect']">
        <formInput v-if="showInput" v-model="inputVal" class="input" @change="changeInput" placeholder="请填写"></formInput>
        <formSelect ref="select" class="select" :filterable="false" :clearable="false" :multiple="multiple" 
            v-model="selectVal" :props="props" :rule="rule" placeholder="请填写"
            :options="data" @change="changeSelect" @visibleChange="visibleChange">
        </formSelect>
    </div>
</template>
<script>
    export default {
        name: 'formInputSelect',
        props:{
            rule:Object,                                //验证类型
            codeKey:String,                             //码表
            value:[String,Array,Number],                //值
            label:String,                               //显示值
            options:Array,                              //数据
            placeholder:String,                         //提示文字
            multiple:{                                  //多选
                type:Boolean,
                default:false,
            },
            props:{                                     //配置项
                type:Object,
                default:()=> {
                    return {
                        value:"code",
                        label:"name"
                    }
                }
            }
        },
        data() {
            return {
                data:[],
                inputVal:null,
                selectVal:null,
                filterShow:false,
                onlyReadData:[],
            };
        },
        computed: {
            showInput() {
                if(this.multiple && this.data && this.data.length>0)
                    return false;
                return true;
            },
            codeData() {
                return this.$store.state.codeData
            },
        },
        watch: {
            codeKey() {
                this.initData();
            },
            value() {
                this.initVal();
            },
            label() {
                this.initVal();
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                //data数据
                if(this.codeKey) {
                    this.onlyReadData = this.codeData[this.codeKey].sysCodeItemModels.map(item=>{
                        let result = this.$deepClone(item)
                        result[this.props.label] = `[${result[this.props.value]}]${result[this.props.label]}`;
                        return result;
                    }).sort((a, b) => {
                        return a.ordinal-b.ordinal; // 从小到大排序
                    })
                    this.data = this.$deepClone(this.onlyReadData);
                }else{
                    this.onlyReadData = this.options?this.$deepClone(this.options):[];
                    this.data = this.options?this.$deepClone(this.options):[];
                }
                this.initVal();
            },
            initVal() {
                if(this.showInput) {
                    this.selectVal = this.value;
                    if(this.multiple)
                        this.inputVal = this.label || this.value;
                    else {
                        let result = this.data.filter(item=>this.value === item[this.props.value]);
                        this.inputVal = result.length>0?result[0][this.props.label]:this.label?this.label:this.value;
                    }
                }else{
                    this.selectVal = this.value;
                }
            },
            visibleChange(show) {
                if(show && !this.filterShow) {
                    this.initData();
                }
                this.filterShow = false;
            },
            changeInput(val) {
                this.$emit("input",val);
                this.$emit("update:label",val);
                this.$emit("change",val)
                if(val) {
                    this.data = this.onlyReadData.filter((item)=> {
                        return ~item[this.props.label].indexOf(val);
                    })
                }else{
                    this.selectVal = null;
                    this.data = this.$deepClone(this.onlyReadData);
                }
                if(this.data.length>0) {
                    this.$refs.select.$refs.formSelect.visible = true;
                    this.filterShow = true;
                }else{
                    this.$refs.select.$refs.formSelect.visible = false;
                }
            },
            changeSelect(val,data) {
                if(this.multiple) 
                    this.inputVal = data.map(item=>item[this.props.label]).join(",");
                else
                    this.inputVal = data[this.props.label];
                this.selectVal = val;
                this.$emit("input",val);
                this.$emit("update:label",this.inputVal);
                this.$emit("change",val,data)
            }
        },
    }
</script>
<style lang="scss" type="text/scss">
.formInputSelect {
    position: relative;
    .input {
        width: calc(100% - 30px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        .el-input__inner {
            border:0;
            border: none;
            outline: none;
            height:25px;
            position: relative;
            left: 1px;
            &:focus {
                border-color: #DCDFE6;
            }
        }
    }
    .select {
        .is-focus {
            .el-input__inner {
                border-color: #DCDFE6;
            }
        }
    }
}
</style>
