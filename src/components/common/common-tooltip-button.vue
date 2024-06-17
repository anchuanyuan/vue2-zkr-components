<template>
  <el-tooltip
      class="fx-tooltip-button-wrapper"
      :effect="effect"
      :content="content || title"
      :placement="placement"
      :disabled="toolDisabled"
      :offset="offset"
      :transition="transition"
      :visible-arrow="visibleArrow"
      :open-delay="openDelay"
      :manual="manual"
      :popper-class="popperClass"
      :enterable="enterable"
      :hide-after="hideAfter">
    <div slot="content">
      <slot name="content">{{ content || title }}</slot>
    </div>
    <el-button
        v-if="state === 'button'"
        :class="[toolDisabled || !iconClassReplace?iconClass:iconClassReplace]"
        :size="size"
        :type="type"
        :plain="plain"
        :round="round"
        :circle="circle"
        :loading="loading"
        :disabled="disabled"
        :icon="toolDisabled || !iconReplace?icon:iconReplace"
        :autofocus="autofocus"
        :native-type="nativeType"
        @click="buttonClick"
    >{{ toolDisabled ? title : '' }}
    </el-button>
    <fx-drop-down
        v-if="state === 'dropDown'"
        class="dropDown"
        :type="type"
        :title="toolDisabled?title:''"
        :icon="toolDisabled?icon:''"
        :trigger="trigger"
        :position="position"
        :options="options"
        :props="props"
        @click="(val) => dropClick(val)">
    </fx-drop-down>
  </el-tooltip>
</template>

<script>
export default {
  name: 'fx-tooltip-button',
  props: {
    clientWidth: { // 分辨率
      type: Number,
      default: 0
    },
    time: { // 节流延迟时间
      type: Number,
      default: 500
    },
    state: { // 状态
      type: String,
      default: 'button'
    },
    // tooltip属性
    effect: String, // 默认提供的主题
    content: String,
    placement: { // Tooltip 的出现位置
      type: String,
      default: 'top'
    },
    offset: Number, // 出现位置的偏移量
    transition: String, // 定义渐变动画
    visibleArrow: Boolean,// 是否显示 Tooltip 箭头
    openDelay: Number, // 延迟出现，单位毫秒
    manual: Boolean, // 手动控制模式，设置为 true 后，mouseenter 和 mouseleave 事件将不会生效
    popperClass: String, // 为 Tooltip 的 popper 添加类名
    enterable: Boolean, // 鼠标是否可进入到 tooltip 中
    hideAfter: Number, // Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏
    // botton属性
    iconClass: String, // button图标
    iconClassReplace: String, // 要替换的button图标
    icon: String, // ioncfont图标
    iconReplace: String, // ioncfont替换图标
    size: { // 尺寸
      type: String,
      default: 'mini'
    },
    type: { // 类型
      type: String,
      default: 'primary'
    },
    plain: Boolean, // 是否朴素按钮
    round: Boolean, // 是否圆角按钮
    circle: Boolean, // 是否圆形按钮
    loading: Boolean, // 是否加载中状态
    disabled: Boolean, // 是否禁用状态
    autofocus: Boolean, // 是否默认聚焦
    nativeType: String, // 原生 type 属性
    title: String, // 按钮名称
    // dropdown属性
    trigger: String, // 触发下拉的行为
    position: String, // 菜单弹出位置
    options: Array, // 下拉列表数据(icon,class,children,name,id等组成的对象数组)
    props: String, // 下拉列表数据显示字段名
  },
  data() {
    return {
      toolDisabled: true,
      theClientWidth: this.clientWidth,
      theTime: this.time,
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.handle)
  },
  mounted() {
    this.handle();
    window.addEventListener('resize', this.throttle(this.handle, this.theTime))
  },
  methods: {
    handle() {
      this.toolDisabled = document.body.clientWidth > this.theClientWidth;
    },
    buttonClick() {
      this.$emit('click')
    },
    dropClick(val) {
      this.$emit('click', val)
    },
    throttle(fn, interval = 500) {
      let run = true;
      let init = false;
      return function () {
        if (!run) return;
        run = false;
        if (!init) {
          init = true;
          fn.apply(this, arguments);
        }
        setTimeout(() => {
          fn.apply(this, arguments);
          run = true;
        }, interval);
      };
    }
  },
}
</script>

<style scoped type="text/scss" lang="scss">
.dropDown {
  display: inline-block;
}

.el-badge + .fx-tooltip-button-wrapper {
  margin-left: 10px !important;

}

.fx-tooltip-button-wrapper {
    ::v-deep .iconfont {
    margin-right: 7px;
  }
}
</style>




