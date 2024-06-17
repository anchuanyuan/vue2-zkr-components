<template>
    <el-switch  class="formSwitch" v-model="inputValue" :active-text="activeText" :active-icon-class="activeCorlor" :inactive-color="color" :inactive-text="text" @change="change"> </el-switch>
</template>
<script>
    export default {
        name: 'formSwitch',
        props: ['value','activeText','text'],
        props:{
            value:[String,Number,Boolean],          //值
            activeText:String,                      //选中状态文字
            text:String,                            //文字
            activeCorlor:String,                    //选中颜色
            color:String,                           //未选中颜色
        },
        data() {
            return {}
        },
        computed: {
            inputValue: {
                get() {
                    if(this.value === true||this.value===1||this.value==="1")
                        return true;
                    else
                        return false;
                },
                set(val) {
                    this.$emit("input", val);
                },
            }
        },
        methods: {
            change(val) {
                this.$emit("change", val);
            }
        },
    }
</script>
<style lang="scss" type="text/scss">
</style>
