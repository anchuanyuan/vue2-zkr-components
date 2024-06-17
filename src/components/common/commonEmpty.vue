<template>
    <div class="commonEmpty-wrapper" ref="empty" :style="{height}">
        <div>
            <img src="@/assets/images/common/empty.png" alt="">
            <span>暂无数据...</span>
        </div>
    </div>
</template>
<style type="text/scss" lang="scss">
    .commonEmpty-wrapper {
        position: relative;
        // display: block;
        width: 100%;
        height:100%;
        > div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translateX(-50%);
            color: #999;
            text-align: center;
            >img{
                transform: translateX(-10px);
            }
            > span {
                margin-top: 17px;
                display: block;
                text-align: center;
                width: 100%;
                vertical-align: middle;
                font-size: 16px;
                // font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
                font-family: 'PingFangSC-Medium';
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                height: ''
            }
        },
        mounted() {
        },
        methods: {
        }
    }
</script>
