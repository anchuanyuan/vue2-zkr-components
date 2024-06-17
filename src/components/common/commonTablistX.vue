<template>
    <div :class='["common-tabPaneX-wrapper",tabClass,{"border":border}]' >
        <el-tabs :class='["main"]' :type="type" :tab-position="position" v-model="selectedVal" @tab-click="handleClick">
            <el-tab-pane v-for="(tab,index) in data" :key="index" :label="tab.name" :name='""+index'>
                <span slot="label">
                    <slot name="tab" :tab="tab">
                         <i :class='["iconfont",tab.class,tab.icon]'></i>
                        {{tab.name}}
                        <span class="count" v-if="tab.count">{{tab.count}}</span>
                        <span v-if="tab.valid" class="validError el-icon-warning"></span>
                    </slot>
                </span>
                <slot :item="tab"></slot>
            </el-tab-pane>
        </el-tabs>
        <div class="other">
            <slot name="other"></slot>
        </div>
    </div>
</template>
<script>
	export default {
        name: "commonTabPaneX",
        props:{
            border:{
                type:Boolean,
                default:false
            },
            type:String,//tab样式card/border-card
            value:[String,Number],
            position:{//tab定位
                type:String,
                default:"top"
            },
            searchData:{
                type:Object,
                default:()=> {
                    return {};
                }
            },
            options:{
                type:Array,
                default:()=> {
                    return [];
                }
            },
        },
		data() {
			return {
                data:[],
			};
		},
        computed: {
            tabClass() {
                if(this.position==="top"||this.position==="bottom"){
                    return "positionX";
                }else{
                    return "positionY";
                }
            },
            selectedVal:{
                get() {
                    if(!this.value)
                        return "0";
                    return this.value+"";
                },
                set(val) {
                    this.$emit("input",parseInt(val));
                }
            },
        },
        watch:{
            options:{
                handler() {
                    this.data = this.$deepClone(this.options);
                },deep:true
            }
        },
        mounted() {
            this.data = this.$deepClone(this.options);
        },
		methods: {
			handleClick(tab, event) {
                setTimeout(()=> {
                    let index = parseInt(this.selectedVal);
                    this.$emit('change',index,this.data[index]);
                },10)
			}
		}
	};
</script>
<style type="text/scss" lang="scss">
$height:40px;
.common-tabPaneX-wrapper {
    position: relative;
    padding: 0 5px;
    &.border{
        border-bottom: 1px solid #ddd;
    }
    &.positionY {
        .main {
            height: 100%;
            .el-tabs__item{
                padding: 0 20px!important;
            }
        }
    }
    .main{
        width: 100%;
        min-height: $height;
        &.el-tabs--border-card{
            .el-tabs__item{
                padding: 0 10px;
            }
        }
        .el-tabs__item{
            text-align: left;
            position: relative;
            .validError {
                color: red;
                font-size: 16px;
                position: absolute;
                right: 0;
                top: 12px;
            }
            .count{
                display: inline-block;
                width: 20px;
                height: 20px;
                line-height: 20px;
                color: #fff;
                font-weight: 1;
                font-size: 12px;
                border-radius: 50%;
                text-align: center;
                background-color: #198fff;
            }
        }
        .el-tabs__header{
            margin: 0 !important;
        }
        .el-tabs__content{
            padding: 0;
        }
    }
}
</style>