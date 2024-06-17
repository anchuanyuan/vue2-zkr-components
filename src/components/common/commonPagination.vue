<template>
    <div :class='["common-pagination-wrapper",{"container-pagination-wrapper":container}]'>
        <el-pagination
            :background="background"
            @size-change="changePageSize"
            @current-change="turnPage"
            :pager-count="pagerCount"
            :page-sizes="sizeLimit"
            :current-page="pageIndex"
            :page-size='pageSize'
            :layout="layout"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name: 'commonPagination',
        props:{
            total:{
                type:Number,
                default:0
            },
            page:{
                type:Number,
                default:1
            },
						background :{
							type:Boolean,
							default:true
						},
            pagerCount:{
                type:Number,
                default:5
            },
            size:{
                type:Number,
                default:10
            },
            sizeLimit:{
                type:Array,
                default() {
                    return [10,20, 30, 50, 100]
                }
            },
            layout:{
                type:String,
                default:"total, sizes, prev, pager, next, jumper"
            },
            container: {
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                pageSize:10,
                pageIndex:1,
            }
        },
        computed: {},
        watch:{
            total() {
                this.initPage();
            },
            page() {
                this.initPage();
            },
            size() {
                this.initPage();
            }

        },
        mounted() {
            this.initPage();
        },
        methods: {
            initPage() {
                this.pageSize = this.size;
                if(this.page>1) {
                    if(this.total>0) {
                        this.pageIndex = this.page;
                    }
                }else{
                    this.pageIndex = 1;
                }
            },
            changePageSize(val) {
                this.pageSize = val;
                this.$emit('update:size', val)
                this.$emit('changeSize', val)
            },
            turnPage(val) {
                this.pageIndex = val;
                this.$emit('update:page', val)
                this.$emit('changePage', val)
            },

        }
    }
</script>
<style scoped lang="scss">
    .common-pagination-wrapper {
        padding-right: 10px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        overflow: hidden;
    }
</style>
