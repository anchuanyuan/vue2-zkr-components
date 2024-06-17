<template>
   <el-radio-group :class='["formRadio",size,{"button":button}]' v-model="inputVal" :size="size" @change="change">
        <div v-if="button">
            <el-radio-button v-for="item in data" :key="item[props.value]" :label="item[props.value]" clearable >
                {{item[props.label]}}
            </el-radio-button>
        </div>
        <div v-else class="group">
            <el-radio :disabled="disabled" v-for="item in data" :key="item[props.value]" :label="item[props.value]" clearable>{{item[props.label]}}</el-radio>
        </div>
   </el-radio-group>
</template>
<script>
    export default {  
        name: 'formRadio',  
        props:{
            value:[String,Boolean,Number],              //值
            options:Array,                              //数据
            size:String,                                //尺寸
            button:{                                    //是否按钮
                type:Boolean,
                default:false,
            },
            defaultChecked:{                            //是否默认选中
                type:Boolean,
                default:true,
            },
            disabled:{                                  //是否禁用
                type:Boolean,
                default:false,
            },
            props:{                                     //配置
                type:Object,
                default() {
                    return {
                        label:"name",
                        value:"id"
                    }
                }
            },
        },
        data() {
            return {};
        },
        mounted() {
        },
        computed: {
            data() {
                if(this.options)
                    return this.options;
                return [];
                
            },
            inputVal: {
                get() {
                    if(this.value || this.value == false) {
                        return this.value;
                    }else{
                        if(this.defaultChecked)
                            this.$emit("input", this.data[0][this.props.value]);
                    }
                },
                set(val) {
                    this.$emit("input", val);
                }
            },
        },
        methods: {
            change(val) {
                this.$emit('change', val);
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
.formRadio {
    padding-right: 10px;
    .group {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
