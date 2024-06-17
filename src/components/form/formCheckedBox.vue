<template>
   <el-checkbox :disabled="disabled" :class="['formCheckedbox',{'border':border}]" :size="size" :border="border" v-model="inputVal" @change="change">
	   <slot>{{label}}</slot>
   </el-checkbox>
</template>
<script>
		export default {  
			name: 'formCheckedbox',  
            props:{
                label:String,                       //文字
                value:[String,Boolean],             //值
                size:String,                        //尺寸
								disabled: {
									type: Boolean,
									default: false
								},
                border:{                            //是否边框
                    type:Boolean,
                    default:false
                },
            },
			data() {
				return {
				}
			},
			computed: {
				inputVal:{
					get() {
						return this.value?true:false;
					},
					set(val) {
						this.$emit("input",val)
					}
				}
			},
			watch: {
			},
			mounted() {
			},
			methods: {
				change(val) {
					this.$emit("change",val);
				}
			},
		}
</script>
<style lang="scss" type="text/scss">
.formCheckedbox {
    padding-right: 10px;
	.disabled {
		color: #aaa;
	}
    .el-checkbox__label {
        white-space: normal;
    }
    margin-right:0;
}
</style>

