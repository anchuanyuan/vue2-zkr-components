<template>
    <!-- 分类维护 -->
    <commonDialog class="columnConfig-dialog" title="表格列配置" width="400px" 
        appendBody :visible.sync="showVisible" @open="open" :save="saveForm">
        <commonTree ref="commonTree" height="100%" autoHeight selectable multiple filterable
            v-model="checkedVal" :options="treeData" :props="treeProps" @checkedChange="checkedChange">
        </commonTree>
    </commonDialog>
</template>

<script>
export default {
    name: 'columnConfig-dialog',
    props:{
        value:Array,
        options:Array,
        visible:Boolean
    },
    data () {
        return {
            checkedVal:[],
            checkedData:[],
            treeData:[],
            treeProps:{
                value:"dataIndex",
                label:"text",
                icon:"icon-biaodan",
                children:""
            }
        }
    },
    computed:{
        showVisible:{
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible",val);
            }
        },
    },
    watch:{
    },
    mounted() {
    },
    methods:{
        open() {
            // this.treeData = this.$deepClone(this.options);
            this.treeData = this.options.filter(item=>item.text!=="操作");
            this.checkedVal = this.value.map((item)=>{
                if(item.show!==false)
                    return item.dataIndex;
            });
        },
        checkedChange(checkedNode,checkedVal,checkedData) {
            this.checkedVal = checkedVal;
            this.checkedData = checkedData;
        },
        saveForm() {
            this.$emit("save",this.checkedVal,this.checkedData);
        }
    },
}
</script>
<style lang="scss" type="text/scss">
</style>
