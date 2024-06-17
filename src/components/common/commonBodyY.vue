<template>
    <div :id="id" class="common-bodyY-wrapper">
        <slot>
            <div class="top">
                <slot name="top"></slot>
            </div>
            <div v-show="drag" class="YdragE">
                <span class="iconfont icon-tuozhuaiY"></span>
            </div>
            <div class="bottom">
                <slot name="bottom"></slot>
            </div>
        </slot>
    </div>
</template>
<script>
    export default {
        props:{
            value:[Number,String],
            max:{
                type:[Number,String],
                default:200
            },
            drag:{
                type:Boolean,
                default:true
            },
            offset:{
                type:Number,
                default:0,
            },
            element:{
                type:String,
                default:"tableBody"
            },
            local:String,
        },
        data() {
            let id = "bodyY" + (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
            return {
                id:id,
                baseHeight:0,
                minHeight:100,
                modelHeight:0,
                maxHeight:0,
			    userPage:this.$store.getters.userPage,
            }
        },
        computed:{
            localName() {
                if(this.local)
                    return this.local + "-bottom";
                else
                    return null;
            },
            Offset() {
                return this.offset + 10;
            }
        },
        mounted() {
            this.initElement();
        },
        activated() {
            this.initElement();
        },
        deactivated() {
            this.id = null;
        },
        destroyed() {
            this.id = null;
        },
        watch:{
            modelHeight(val) {
                if(this.localName)
                    this.$store.commit("updateUserPage",[this.localName,val]);
                this.$emit("input",val);
            }
        },
        methods:{
            initElement() {
                this.id = "bodyY" + (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
                this.initHeight();
            },
            initHeight() {
                this.$nextTick(()=> {
                    let result = this.$getHeight(`#${this.id} .top .${this.element}`,this.Offset);
                    if(!result) return
                    if(this.userPage[this.localName]) {
                        this.modelHeight = this.userPage[this.localName];
                    }else{
                        this.modelHeight = result.height;
                    }
                    this.maxHeight = result.maxHeight;
                    this.addMove();
                    window.onresize = (()=> {
                        if(this.id&&$(`#${this.id}`)[0]) {
                            result = this.$getHeight(`#${this.id} .top .${this.element}`,this.Offset);
                            this.modelHeight = result.height;
                            this.maxHeight = result.maxHeight;
                            this.addMove();
                        }
                    })
                })
            },
            addMove() {
                let that = this;
                this.$nextTick(()=> {
                    let that = this;
                    let height = that.value;
                    let minHeight = that.minHeight;
                    let maxHeight = that.maxHeight-minHeight;
                    let clickY,dragClickY;
                    let dragging  = false;
                    let doc 	  = document;
                    let labBtn 	  = $(`#${this.id} .YdragE`);
                    let dragContainer = labBtn;
                    labBtn.bind('mousedown',function(e){
                      window.getSelection().empty()
                        clickY = e.pageY;
                        dragging = true;
                    });
                    $(doc).mousemove(function(e) {
                        if(dragging){
                            e.preventDefault();
                            dragClickY = e.pageY;
                            let diff = dragClickY - clickY;
                            let resHeight = height - diff;
                            if(resHeight<=minHeight)
                                resHeight = minHeight;
                            if(resHeight>=maxHeight&&maxHeight>0)
                                resHeight = maxHeight;
                            that.modelHeight = resHeight;
                            that.baseHeight = resHeight;
                        }
                    });
                    $(doc).mouseup(function(e) {
                        if(dragging) {
                            dragging = false;
                            e.cancelBubble = true;
                            height = that.baseHeight;
                        }
                    });
                })
            }
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
.common-bodyY-wrapper {
    .YdragE {
        width: 100%;
        height:10px;
        cursor: row-resize;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
            //font-size: 2em;
            font-size: 20px;
            color: #9a8e8e;
					  background-color: #FFFFFF;
						border-radius: 50%;
						z-index: 9;
        }
    }
    .top,.bottom {
        position: relative;
        .common-footer-wrapper {
            bottom: -40px;
        }
    }
}
</style>
