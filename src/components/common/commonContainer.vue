<template>
  <div :id="id" class="common-container-wrapper" :style='{height:Height}' ref="commonContainer">
    <slot :style='{height:Height}'></slot>
  </div>
</template>

<script>
/* 分配容器高度    高度= 整个页面高度 - 距离浏览器顶部的距离
* */
export default {
  props: {
    offset: {
      type: Number,
      default: 0
    },
    height: [String, Number],//容器高度
    real: {//
      type: Boolean,
      default: false,
    }
  },
  data() {
    let id = "inp" + (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
    return {
      id: id,
      offsetTop: 0,
      offsetBottom: 0,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.updateOffsetTop();
    })
    if (this.real) {
      $(window).resize(() => {
        this.updateOffsetTop();
      })
    }
  },
  destroyed() {
    $(window).resize(() => null)
  },
  computed: {
    Height() {
      if (this.height && this.height !== '0px') {
        if (this.$getType(this.height) === "number")
          return this.height + "px";
        return `calc(${this.height} - ${this.offset}px)`;
        // return `calc(${this.height})`
      }
      ;
      let offsetOther = this.offsetBottom;
      if ($('.container-footer-wrapper').height())
        offsetOther += $('.container-footer-wrapper').height()
      let offsetAll = this.offsetTop + this.offset + offsetOther + "px";

      return `calc(100vh - ${offsetAll})`;

    },

  },
  methods: {
    updateOffsetTop() {
      this.offsetTop = this.$refs.commonContainer.getBoundingClientRect().top;
    },
  },
}
</script>
<style type="text/scss" lang="scss">
.common-container-wrapper {
  background-color: transparent;
  overflow: auto;
  position: relative;
}
</style>

