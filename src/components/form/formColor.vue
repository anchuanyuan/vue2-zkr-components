<template>
    <div class="formColor">
        <el-color-picker v-model="inputValue"></el-color-picker>
        <slot><span class="colorText" :style="{color:inputValue}">{{inputValue}}</span></slot>
    </div>
</template>

<script>
    export default {  
        name: 'formColor',  
        props:{
            value:String
        },  
        data() {
            return{
            }
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
        },
        methods: {
        },
    }
</script>
<style lang="scss" type="text/scss">
.formColor{
    display: flex;
    .colorText {
        font-size: 12px;
        margin-left: 5px;
    }
}
</style>
