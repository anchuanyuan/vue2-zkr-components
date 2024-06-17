<template>
    <div class="common404-wrapper">
        <div class="main">
            <img src="@/assets/images/common/404.png"/>
            <div class="msg">
                <span>404</span>
                抱歉，你访问的页面不存在
            </div>
            <el-button>
                <router-link :to="backUrl">
                    返回首页
                </router-link>
            </el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: "common404",
        computed:{
            backUrl() {
                return sessionStorage[this.$store.state.sysPrefix +'useHome'] || 'Home'
            }
        },
    }
</script>
<style scoped lang="scss" type="text/scss">
.common404-wrapper {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .msg{
        margin: 10px 0;
        span {
            font-size:30px;
        }
    }
}
</style>