<template>
    <div class="formCheckbox">
        <el-checkbox-group v-model="inputVal" @change="change" :size="size">
            <el-checkbox v-for="(item,index) in options"
                :label="item[props.value]" :key="index" :border="border"
                :disabled="item.disabled">
                {{item[props.label]}}
                <span class="hint">{{item.hint}}</span>
            </el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
    export default {
        name: 'formCheckbox',
        props:{
            value:[Number,String,Array],               //值
            size:String,                        //尺寸
            options:Array,                      //数据
            border:{                            //是否边框
                type:Boolean,
                default:false
            },
            multiple:{                          //多选
                type:Boolean,
                default:true,
            },
            props:{                             //配置
                type:Object,
                default:()=> {
                    return {
                        value:"id",
                        label:"name",
                        hint:"hint"
                    }
                }
            }
        },
        data() {
            return {
            };
        },
        computed: {
            data() {
                return this.options.filter((item)=> {
                    return item.show!==false;
                })
            },
            inputVal: {
                get() {
                    if(this.$getType(this.value) === "string")
                        return this.value.split(",");
                    return this.value?this.value:[];
                },
                set(val) {
                    this.$emit("input",val);
                }
            }
        },
        mounted() {
        },
        methods: {
            change(value,data) {
                let result = new Array();
                value.forEach((val)=> {
                    let itemData = this.options.filter((item)=> {
                        return item[this.props.value] === val;
                    })
                    result.push(...itemData);
                })
                this.$emit("change",value,result);
            },
        },
    }
</script>
<style lang="scss" type="text/scss">
    .formCheckbox {
        max-height: 300px;
        overflow-y: auto;
        .el-checkbox__inner {
            position: relative;
            top: -1px;
        }
    }
</style>
