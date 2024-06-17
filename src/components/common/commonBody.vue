<template>
  <div class="commonBody-wrapper h-full  overflow-hidden" :id="id">
    <slot name="title"></slot>
    <div class="main-container h-full">
      <div class="main-content">
        <slot></slot>
      </div>
      <div class="main-content-side h-full">
        <div class="addTree" :style="addTreeStyle">
          <slot name="addTree"></slot>
          <!-- <div class="dragE">-->
          <!--    <span class="iconfont icon-tuozhuaiX"></span>-->
          <!--</div> -->
        </div>
        <div class="left-content h-full" :style="leftStyle">
          <slot name="left"></slot>
          <div class="dragE" v-if="dragIsYes">
            <span class="iconfont icon-tuozhuaiX"></span>
          </div>
        </div>
        <div class="right-content h-full " :style="rightStyle">
          <slot name="right"></slot>
        </div>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    local: String,           //本地配置
    width: {                 //宽度-left
      type: String,
      default: "250px"
    },
    marginRight: {                 //宽度-left
      type: String,
      default: "10px"
    },
    refresh: {               //刷新当前渲染布局
      type: Boolean,
      default: false
    },
    min: {                   //最小宽度
      type: [Number, String],
      default: 200
    },
    max: {                   //是否使用最大值
      type: Boolean,
      default: false
    },
    dragIsYes: {
      type: Boolean,
      default: true
    },
    addTreeStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    let id = "bodyX" + (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
    return {
      id: id,
      baseOffset: 10,//基础偏移
      leftOffset: 0,//左侧偏移
      userPage: this.$store.getters.userPage
    };
  },
  computed: {
    localName() {
      if (this.local)
        return this.local + "-left";
      else
        return null;
    },
    leftStyle() {
      // 如果 this.min是数字
      let minWidth = typeof this.min === "number" ? this.min + "px" : this.min
      let result = {
        minWidth,
        marginRight: '10px'
      };
      if (this.width)
        result.width = this.width;
      if (this.localName && this.userPage[this.localName]) {
        result.width = this.userPage[this.localName] + "px";
      }
      if (this.marginRight) {
        result.marginRight = this.marginRight;
      }
      return result;
    },
    rightStyle() {
      let width = 0;
      if (this.width)
        width = this.width;
      if (this.localName && this.userPage[this.localName])
        width = this.userPage[this.localName] + "px";
      return {width: `calc(100% - ${width} - ${this.leftOffset}px - ${this.baseOffset}px)`};
    }
  },
  watch: {
    refresh(refresh) {
      this.addMove();
      this.$emit("update:refresh", false);
    }
  },
  mounted() {
    this.addMove();
  },
  methods: {
    addMove() {
      let that = this;
      setTimeout(() => {
        var clickX;
        var dragging = false;
        var container = $(`#${this.id} > .main-container`);
        var dragContainer = container.find(">.main-content-side>.left-content");
        var labBtn = dragContainer.find(">.dragE");
        var wrapWidth = container.width();
        this.leftOffset = container.offset().left;//computed重新计算用
        // console.log('this.leftOffset   = container.offset().left;//computed重新计算用');
        // console.log(this.leftOffset);
        labBtn.bind('mousedown', function (e) {
          if(window.getSelection){
            window.getSelection().empty()
          }
          dragging = true;
          // labBtn.css({backgroundColor:"#bbb"});
          labBtn.find('.dragP').css({backgroundColor: "#666"});
        });
        $(document).mousemove(function (e) {
          if (dragging) {
            clickX = e.pageX;
            let minWidth = that.min;
            let maxWidth = ($(document).width() - that.leftOffset) / 3;
            if (that.max) {
              maxWidth = $(document).width() - that.leftOffset - minWidth;
            }
            let resWidth = clickX - that.leftOffset - 15;
            if (resWidth >= maxWidth) {
              resWidth = maxWidth;
            }
            if (resWidth <= minWidth) {
              resWidth = minWidth;
            }
            dragContainer.width(resWidth + 'px');
            dragContainer.next().width(`calc(${wrapWidth}px - ${resWidth}px - ${that.leftOffset}px - ${that.baseOffset}px `);
            if (that.localName) {
              that.$store.commit("updateUserPage", [that.localName, resWidth]);
            }
            that.$emit("changeWidth", resWidth);
          }
        });
        $(document).mouseup(function (e) {
          dragging = false;
          e.cancelBubble = true;
          labBtn.find(".dragP").css({backgroundColor: "#bbb"});
        });
      }, 100);
    }
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
//全局容器样式
.commonBody-wrapper {
  background-color: #f0f2f5;

  .main-content {
    background-color: #fff;
  }

  .main-content-side {
    display: flex;
    overflow: hidden;

    .addTree {
      margin-right: 10px;
      background-color: #fff;
      position: relative;

      .dragE {
        height: 100%;
        width: 10px;
        background-color: transparent;
        position: absolute;
        right: -10px;
        top: 0;
        cursor: col-resize;
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
          //font-size: 2em;
          font-size: 20px;
          color: #9a8e8e;
        }
      }
    }

    .left-content {
      margin-right: 10px; //10px;//5px;
      background-color: #fff;
      position: relative;

      .dragE {
        height: 100%;
        width: 10px;
        background-color: transparent;
        position: absolute;
        right: -10px;
        top: 0;
        cursor: col-resize;
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
          //font-size: 2em;
          font-size: 20px;
          color: #9a8e8e;
        }
      }
    }

    .right-content {
      flex: 1;
      background-color: #fff;
      position: relative;
    }
  }
}

@media screen and (max-width: 1280px) {
  .commonBody-wrapper {
    .main-container {
      .main-content-side {
        .left-content {
          max-width: 800px !important;
          width: 300px;
        }
      }
    }

  }
}
</style>
