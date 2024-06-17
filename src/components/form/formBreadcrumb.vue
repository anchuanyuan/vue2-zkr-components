<template>
    <div class="form-breadcrumb-wrapper">
        <span v-for="(item,index) in options" :key="index">
            <span :class='[item.titleClass]'>{{item.title}}</span>
            <span class="text">{{item.text}} </span>
        </span>
    </div>
</template>
<style lang="scss" type="text/scss">
    .form-breadcrumb-wrapper{
        height: 32px;
        line-height: 32px;
        .circle {
            display: inline-block;
            color: #fff;
            width: 20px;
            height: 20px;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            background-color: #409EFF;
        }
        .title{
            font-weight: bold;
            color:#000;
        }
    }
</style>
<script>
    export default {  
        name: 'formBreadcrumb',  
        props:{
            options:{
                type:Array,
                default:()=>{
                    return[];
                }
            }
        },
        data() {
            return {};
        },
        computed: {
        },
        created() {}
    }
</script>
