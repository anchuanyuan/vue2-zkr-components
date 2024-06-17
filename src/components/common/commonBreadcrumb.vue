<template>
    <div class="common-breadcrumb-wrapper">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="index" @click.native="click(item)">
                {{ item.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="slot">
            <slot></slot>  
        </div>   
        <slot name="right"></slot>  
    </div>
</template>
<script>
    export default {
        name: "commonBreadcrumb",
        data() {
            return {
                breadcrumbData: []
            }
        },
        computed: {
            currentRoute() {
                return this.$route;
            },
            currentBreadcrumb() {
                return this.$store.state.currentBreadcrumb;
            }
        },
        watch: {},
        mounted() {
            this.getBreadcrumb();
        },
        methods: {
            getBreadcrumb() {
                let result = this.$route.matched.map((itemMenu, menuIndex) => {
                    return {
                        title: itemMenu.meta?itemMenu.meta.title:"",
                        name: itemMenu.name,
                    };
                });
                if(result[result.length-1].name===sessionStorage[this.$store.state.sysPrefix+'useHome'])
                    result[0].title="工作台";
                this.breadcrumbData = result;
            },
            click(item) {
                this.$router.push({name:item.name});
            }
        }
    }
</script>
<style type="text/scss" lang="scss">
$height:30px;
.common-breadcrumb-wrapper {
    height: $height;
    display: flex;
    align-items: center;
    padding: 0 10px;
    .breadIcon{
        color: #999;
        font-size: 20px;
    }
    .el-breadcrumb__separator{
        margin: 0 2px;
    }
    .el-breadcrumb__item{
        .el-breadcrumb__inner {
            cursor: pointer;
            color: #999;
            &:hover {
                color: #409EFF;
            }
        }
        &:last-child {
            .el-breadcrumb__inner {
                cursor: pointer;
                color: #333;
                &:hover {
                    color: #409EFF;
                }
            }
        }
    }
    .slot {
        flex: 1;
    }
}
</style>