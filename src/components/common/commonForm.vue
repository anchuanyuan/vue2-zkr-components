<template>
    <form :id="id" :ref="id" :class='["common-form-wrapper",{"alignCenter":center},{"msgBottom":msgPosition!=="right"}]'>
        <slot></slot> 
    </form>
</template>
<script>
    export default {
        name: 'commonForm',
        props:{
            form:Object,
            width:String,
            labelWidth:String,
            msgWidth:String,
            otherWidth:String,
            labelRound:{
                type:Boolean,
                default:false,
            },
            center:{
                type:Boolean,
                default:false,
            },
            msgPosition:{//bottom,right
                type:String,
                default:"right"
            },
        },
        data() {
            let id =
                "inp" +
                (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
            return {
                id: id,
            }
        },
        computed: {
        },
        mounted() {
            this.hisForm = this.$deepClone(this.form);
            this.initWidth();
        },
        watch:{
            labelWidth() {
                this.initWidth();
            }
        },
        methods:{
            initWidth() {
                this.$nextTick(()=>{
                    let labelWidth = this.labelWidth;
                    let msgWidth = this.msgWidth;
                    let otherWidth = this.otherWidth;
                    let width = this.width;
                    if(this.width)
                        $("#"+this.id).find(".formRow").width(width);
                    if(this.labelWidth)
                        $("#"+this.id).find(".form-label").width(labelWidth);
                    if(this.msgWidth)
                        $("#"+this.id).find(".form-msg").width(msgWidth);
                    if(this.otherWidth)
                        $("#"+this.id).find(".form-other").width(otherWidth);
                    if(!this.labelRound)
                        $("#"+this.id).find(".roundAlign").removeClass("roundAlign");
                })
            },
            reset() {
                for(let key in this.hisForm) {
                    this.form[key] = this.hisForm[key];
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
.common-form-wrapper{
    &:not(.grid) {
        display: flex;
        flex-wrap: wrap;
    }
    &.alignCenter{
        justify-content: center;
    }
    .formRow:last-child{
        margin-bottom: 5px;
    }
    &.msgBottom {//->验证消息在下方
        .formRow {
            margin-bottom: 15px!important;
            .form-msg{
                .message {
                    display: none!important;
                }
            }
            .ms-message{
                display:block!important;
            }
        }
    }
}
</style>
