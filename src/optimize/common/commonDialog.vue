<template>
<el-dialog
  :id="id"
  :class="[
    'common-dialog-wrapper',
    { fullscreen: fullscreen },
    { notFoot: !showFooter },
    { needPadding: padding },
  ]"
  v-bind="$attrs"
  @open="open"
  :visible.sync="showVisible"
  :fullscreen="fullscreen"
  :show-close="false"
  v-draggable="isDraggable"
>
  <div slot="title" class="dialog-title">
    <div class="left-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <span
      class="right-title iconfont el-icon-full-screen"
      title="全屏"
      v-if="showFullScreen && !isDraggable"
      @click="changeFull"
    ></span>
    <!-- " @click="fullscreen=!fullscreen" -->
    <span
      class="right-title iconfont icon-close"
      title="关闭"
      @click="closeVisible()"
      v-if="showClose"
    ></span>
  </div>
  <div class="dialog-form" :style="heightStyle">
    <slot></slot>
  </div>
  <div slot="footer" class="dialog-footer" v-if="showFooter">
    <div class="foot-content">
      <slot name="foot"></slot>
    </div>
    <div class="foot-operate">
      <slot name="footer">
        <el-button @click="cancel" v-if="showClose">取 消</el-button>
        <slot name="more"></slot>
        <el-button
          type="primary"
          :disabled="disabled"
          @click="saveForm"
          v-if="showConfirm"
          >确 定</el-button
        >
      </slot>
    </div>
  </div>
</el-dialog>
</template>
<script>
export default {
name: "commonDialog",
props: {
  isDraggable: {
    type: Boolean,
    default: false,
  },
  height: String, //->高度->自定义单位
  width: {
    //->宽度->自定义单位
    type: String,
    default: "600px",
  },
  full: {
    //->是否需要全屏
    type: Boolean,
    default: false,
  },
  showClose: {
    //->是否显示关闭
    type: Boolean,
    default: true,
  },
  showConfirm: {
    // 显示确认
    type: Boolean,
    default: true,
  },
  showFullScreen: {
    //->是否显示关闭
    type: Boolean,
    default: true,
  },
  showFooter: {
    //是否显示底部
    type: Boolean,
    default: true,
  },
  visible: {
    //->是否显示
    type: Boolean,
    default: false,
  },
  refresh: {
    //->是否刷新
    type: Boolean,
    default: false,
  },
  padding: {
    //->是否需要padding
    type: Boolean,
    default: false,
  },
  initFullscreen: {
    //默认最大化
    type: Boolean,
    default: false,
  },
  form: Object, //->表单数据
  url: String, //新增保存Url
  updateUrl: String, //修改保存url
  rules: Object, //->验证规则集合
  save: Function, //->外部的保存方法
  beforeSave: Function, //->保存之前回调
  afterSave: Function,
},
data() {
  let id =
    "commonDialog" +
    (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
  return {
    id: id,
    disabled: false,
    fullscreen: false,
  };
},
computed: {
  showVisible: {
    get() {
      if (!this.visible) this.disabled = false;
      return this.visible;
    },
    set(val) {
      this.initRules();
      this.$emit("update:visible", val);
    },
  },
  heightStyle() {
    if (this.fullscreen) return {};
    if (this.height)
      return { height: `${this.height} !important`, minHeight: "0px" };
    else return {};
  },
},
watch: {},
methods: {
  cancel() {
    this.showVisible = false;
    this.$emit("cancel");
  },
  changeFull() {
    //窗口size重新
    var myEvent = new Event("resize");
    window.dispatchEvent(myEvent);
    this.fullscreen = !this.fullscreen;
  },
  //保存
  saveForm() {
    this.$emit("ok");
    if (this.beforeSave) {
      //保存之前
      this.beforeSave();
    }
    let ruleResult = true;
    //->验证
    if (this.rules)
      ruleResult = this.$validate.validRules(this.rules, this.form);
    //->验证通过
    if (!ruleResult) return;
    this.disabled = true;
    if (this.save) {
      //调用外部自己的save方法
      this.save(() => {
        this.disabled = false;
      });
      this.disabled = false;
      return;
    }
    if (this.url || this.updateUrl) {
      //->有保存或更新路径执行
      let ajaxOptions = {
        url: this.form.id && this.updateUrl ? this.updateUrl : this.url,
        data: this.form,
      };
      this.$ajaxPost(ajaxOptions, true, (res) => {
        this.disabled = false;
        if (res.code === 200) {
          this.showVisible = false;
          this.$emit("update:refresh", true);
          this.$showMsg("success", "操作成功");
          if (this.afterSave) this.afterSave(res);
        } else {
          this.$showMsg("error", res.message);
        }
      });
    } else {
      //->关闭弹窗
      this.showVisible = false;
      this.$emit("update:refresh", true);
    }
  },
  //初始化验证规则
  initRules(rules = this.rules) {
    let rulesType = this.$getType(rules);
    if (rulesType === "array") {
      rules.forEach((val, index) => {
        delete rules[index].valid;
      });
    }
    if (rulesType === "object") {
      for (var key in rules) {
        let itemRule = rules[key];
        if (rules[key].valid != undefined) rules[key].valid = true;
        this.initRules(rules[key]);
      }
    }
  },
  closeVisible() {
    this.showVisible = false;
    this.$emit("closeVisible");
  },
  //弹窗打开
  open() {
    this.fullscreen = this.initFullscreen;
    $(`#${this.id} .dialog-form`).animate({ scrollTop: 0 }, 100); //->设置滚动条滚动到->携带动画
    this.$emit("open");
  },
  disabledStatus(status) {
    this.disabled = status;
  },
},
};
</script>
<style type="text/scss" lang="scss">
$height: 45px;
.common-dialog-wrapper {
.common-dialog-operate {
  position: absolute;
  right: 20px;
  top: 20px;
}
.el-dialog__header {
  .common-tabPaneX-wrapper {
    position: relative;
    top: -1px;
    .el-tabs__item {
      font-size: 16px;
      font-weight: bold;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: $height;
  border-bottom: 1px solid #efefef;
  .dialog-title {
    width: 100%;
    display: flex;
    align-items: center;
    > .left-title {
      font-size: 18px;
      font-weight: 600;
      flex: 1;
    }
    > .right-title {
      cursor: pointer;
      padding-left: 5px;
    }
  }
}
.el-dialog__body {
  padding: 0;
  .dialog-form {
    .common-form-wrapper {
      padding: 10px 0 0;
    }
  }
  .filterInput {
    z-index: 10;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
}
.el-dialog__footer {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: $height;
  border-top: 1px solid #efefef;
  .dialog-footer {
    width: 100%;
    display: flex;
    align-items: center;
    .foot-content {
      flex: 1;
      text-align: left;
    }
  }
}
&.needPadding {
  .el-dialog__body {
    .dialog-form {
      padding: 10px 10px 4px;
    }
  }
}
@media screen and (min-width: 1367px) {
  .el-dialog__body {
    .dialog-form {
      overflow-x: hidden;
      overflow-y: auto;
      height: 500px !important;
    }
  }
}
@media screen and (max-width: 1366px) {
  .el-dialog__body {
    .dialog-form {
      overflow-x: hidden;
      overflow-y: auto;
      height: 320px !important;
    }
  }
}
&.fullscreen {
  .el-dialog__body {
    .dialog-form {
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100vh - #{$height} - #{$height}) !important;
    }
  }
  &.notFoot {
    .el-dialog__body {
      .dialog-form {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100vh - #{$height}) !important;
      }
    }
  }
}
}
</style>
