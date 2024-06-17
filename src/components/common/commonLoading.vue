<template>
    <div class="page-loading">
        <div class="page-loading-back"></div>
        <div class="page-loading-container">
            <slot name="customContent">
                <vue-loading :type="Type" :color="Color" :size="{ width: '60px', height: '60px' }"></vue-loading>
                <span class="page-loading-text">{{text}}</span>
            </slot>
        </div>
    </div>
</template>
<style type="text/scss" lang="scss">
    //loading样式
    .page-loading {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10000;
        .page-loading-back {
            height: 100%;
            opacity: 0.2;
        }
        .page-loading-container {
            position: absolute;
            top: calc(50% - 100px);
            left: calc(50% - 100px);
            width: 200px;
            height: 200px;
        }
        .page-loading-text {
            display: inline-block;
            padding: 5px;
            color: #198fff;
        }
    }
</style>

<script>
    import vueLoading from 'vue-loading-template'
    export default {
        name: "pageLoading",
        components: {
            vueLoading
        },
        props:['type','color','text'],
        // balls// bars// beat// bubbles// cylon// spin// spiningDubbles// barsCylon
        data(){
            return {
            }
        },
        computed: {
            Type() {
                if(this.color)
                    return this.type;
                else
                    return "spiningDubbles";
            },
            Color() {
                if(this.color)
                    return this.color;
                else
                    return "#198fff";
            }
        },
        methods: {
        },
        created() {
        }
    }
</script>

