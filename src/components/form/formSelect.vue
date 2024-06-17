<template>
  <div :class="['formSelect',{'invalid-input': validInput}]">
    <el-select
      class="content"
      ref="formSelect"
      v-model="inputValue"
      :filter-method="dataFilter"
      :showKey="showProps"
      :disabled="disabled"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="filterable"
      :collapse-tags="collapseTags"
      :clearable="clearable"
      :allow-create="createable"
      :default-first-option="createable"
      @change="change"
      @visible-change="onVisibleChange"
      @blur="blur"
    >
      <slot name="option">
        <el-option
          v-for="(item,index) in data"
          :key="index"
          :label="item[showProps.label]"
          :disabled="item.disabled"
          :value="item[showProps.value]"
          v-show="item.show!==false"
        >
          <slot :row="item">
            <span class="label left">{{item[showProps.label]}}</span>
            <span class="right">
              <slot :row="item" name="other"></slot>
            </span>
          </slot>
        </el-option>
        <slot name="more"></slot>
      </slot>
    </el-select>
    <slot name="right"></slot>
  </div>
</template>
<script>
export default {
  name: "formSelect",
  props: {
    collapseTags: {
      type: Boolean,
      default: false,
    },
    codeKey: String, //本地code码值key
    value: [String, Array, Number, Boolean], //值
    label: String, //显示label
    placeholder: String, //提示文字
    rule: Object, //验证规则
    options: Array, //下拉数据
    disabled: {
      //是否禁用
      type: Boolean,
      default: false,
    },
    defaultChecked: {
      //是否默认选中第一条
      type: Boolean,
      default: false,
    },
    useProps: {
      //是否坚持使用props
      type: Boolean,
      default: false,
    },
    filterable: {
      //是否可过滤
      type: Boolean,
      default: true,
    },
    clearable: {
      //是否可清空
      type: Boolean,
      default: true,
    },
    multiple: {
      //是否多选
      type: Boolean,
      default: false,
    },
    createable: {
      //是否可自定义添加
      type: Boolean,
      default: false,
    },
    props: {
      //配置项
      type: Object,
      default: () => {
        return {
          label: "name",
          value: "id",
        };
      },
    },
    hideCode:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      data: [],
    };
  },
  computed: {
    inputValue: {
      get() {
        // this.initDefaultChecked();
        if (this.multiple) {
          if (!this.value) return [];
          if (~this.value.indexOf(",")) return this.value.split(",");
        }
        return this.value;
      },
      set(val) {
        if (this.multiple || this.createable) {
          this.$emit("input", val); /// 更新父组件
        } else {
          let result = this.data.filter((item) => {
            return val === item[this.showProps.value];
          });
          result = result.length > 0 ? result[0] : {};
          this.$emit("input", result[this.showProps.value]); /// 更新父组件
          this.$emit("update:label", result[this.showProps.label]); /// 更新父组件
        }
      },
    },
    validInput: {
      get() {
        if (this.rule) {
          return this.rule.valid === false;
        } else {
          return false;
        }
      },
    },
    codeData() {
      return this.$store.getters.codeData;
    },
    tagData() {
      return this.$store.getters.tagData;
    },
    showProps() {
      let result = this.props;
      if (this.codeKey && !this.useProps) {
        result = {
          label: "name",
          value: "code",
        };
      }
      return result;
    },
  },
  watch: {
    options: {
      handler(val) {
        this.data = this.$deepClone(val);
      },
      deep: true,
    },
    data: {
      handler() {
        this.initDefaultChecked();
      },
      deep: true,
    },
    codeKey() {
      //->标签数据
      if (this.tagData[this.codeKey]) {
        this.data = this.tagData[this.codeKey];
        return;
      }
      //->码表数据
      this.data = this.codeData[this.codeKey].sysCodeItemModels
        .map((item) => {
          let data = this.$deepClone(item);
          data.name = `[${data.code}] ${data.name}`;
          return data;
        })
        .sort((a, b) => {
          return a.ordinal - b.ordinal; // 从小到大排序
        });
    },
  },
  mounted() {
    if (this.codeKey) {
      //->标签数据
      if (this.tagData[this.codeKey]) {
        this.data = this.tagData[this.codeKey];
        return;
      }
      //->码表数据
      this.data = this.codeData[this.codeKey].sysCodeItemModels
        .map((item) => {
          let data = this.$deepClone(item);
          if(!this.hideCode)
            data.name = `[${data.code}] ${data.name}`;
          return data;
        })
        .sort((a, b) => {
          return a.ordinal - b.ordinal; // 从小到大排序
        });
      return;
    }
    if (this.options) {
      this.data = this.$deepClone(this.options);
      return;
    }
  },
  methods: {
    //初始化默认选中
    initDefaultChecked() {
      if (this.data.length > 0 && this.defaultChecked) {
        let result = this.data.filter((item) => {
          if (!this.inputValue) {
            return false;
          }
          return (
            item[this.props.value] === this.inputValue ||
            this.inputValue.includes(item[this.props.value])
          );
        });
        if (result.length < 1) {
          if (this.multiple) {
            this.$emit("input", [this.data[0][this.showProps.value]]);
            this.change([this.data[0][this.showProps.value]]);
          } else {
            this.$emit("input", this.data[0][this.showProps.value]);
            this.change(this.data[0][this.showProps.value]);
          }
        }
      }
    },
    dataFilter(val) {
       this.$emit("dataFilter", val);
    },
    change(val) {
      this.checkRule(val);
      let result = this.data.filter((item) => {
        if (this.multiple) return ~val.indexOf(item[this.showProps.value]);
        return val === item[this.showProps.value];
      });
      if (!this.multiple) result = result[0] ? result[0] : {};
      this.$emit("change", val, result);
    },
    blur() {
      this.checkRule(this.inputValue);
    },
    onVisibleChange(show) {
      this.$emit("visibleChange", show);
    },
    checkRule(val) {
      if (this.rule) {
        this.$validate.validRule(this.rule, val);
      }
    },
  },
};
</script>
<style lang="scss" type="text/scss">
.formSelect {
  display: flex;
  align-items: center;
  .content {
    flex: 1;
  }
  &.invalid-input {
    .el-input__inner {
      border: #ff4848 1px solid !important;
    }
  }
}
.el-select-dropdown__list {
  .item-list {
    display: flex;
    .iconNameEn {
      flex: 0 0 25px;
    }
    .iconNameCn {
      flex: 1;
    }
  }
}
</style>
