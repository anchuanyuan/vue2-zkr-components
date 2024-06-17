<template>
  <div :class="['formDate',{'invalid-input': validInput}]">
    <el-date-picker
        :disabled="disabled"
        :prefix-icon="preFixIcon"
        v-model="inputValue"
        :type="dateType"
        :placeholder="placeholder"
        :clearable="clearable"
        @change="change"
        :format="format"
        :picker-options="pickerOptions"
        @blur="blur()"></el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'formInput',
  props: {
    isClear:{
      type: String,
      default: '1'
    },
    value: [String, Number, Date],              //值
    rule: Object,                        //验证
    type: {                              //类型
      type: String,
      default: "date"//year,month,date,dates,week,datetime
    },
    useType: {
      type: Boolean,
      default: false
    },
    origin: {
      type: Boolean,
      default: false
    },
    placeholder: {                       //提示文字
      type: String,
      default: "请选择时间"
    },
    dateDisabled: {                      //超出今天禁用
      type: Boolean,
      default: false
    }, 
    yearDisabled: {      //超出或等于今年禁用
        type: Boolean,
        default: false
    },                   
    clearable: {                         //是否可清空
      type: Boolean,
      default: true
    },
    disabled: {                          //禁用
      type: Boolean,
      default: false
    },
    preFixIcon: {
      type: String,
      default: 'el-icon-date'
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: this.disabledDate
      }
    };
  },
  computed: {
    dateType() {
      if (this.useType)
        return this.type;
      if (this.type === "date")
        return this.$dataFields.dateType || this.type;
      return this.type;
    },
    format() {
      let format = "yyyy-MM-DD";
      switch (this.dateType) {
        case "year":
          format = "yyyy";
          break;
        case "month":
          format = "yyyy.MM";
          break;
        case "date":
        case "dates":
          format = "yyyy.MM.DD";
          break;
        case "week":
          format = "yyyy 第 WW 周";
          break;
        case "datetime":
          format = "yyyy.MM.DD HH:mm:ss";
          break;
      }
      return format;
    },
    inputValue: {
      get() {
        let result = this.value;
        if (navigator.userAgent.indexOf("Firefox") > 0) {
          result = this.value.replace(/\./g, '-');
          return result;
        }
        if (result) {
          if (this.origin) {
            return result;
          }
          return this.$moment(result).format(this.format);
        }
        return "";
      },
      set(val) {
        let result = '';
        if (val) {
          result = this.$moment(val).format(this.format);
          if (this.origin) {
            result = val;
          }
        }
        this.$emit("input", result);
      }
    },
    validInput: {
      get() {
        if (this.rule) {
          return this.rule.valid === false;
        } else {
          return false;
        }
      }
    }
  },
  methods: {
    disabledDate(time) {
      if (this.dateDisabled)
        return time.getTime() > Date.now();
      if(this.yearDisabled)
          // 获取今年
          return time.getFullYear() >= new Date().getFullYear();
      return false;
    },
    blur() {
      if (this.rule)
        this.validRule(this.inputValue);
    },
    change(val) {
      this.validRule(val);
      console.log("va;",this.isClear)
      if(this.isClear=='0'&&val==null){
        return
      }else{
        this.$emit("change", val);
      }


    },
    validRule(val) {
      let validVal = "";
      if (val && val !== "Invalid date")
        validVal = val;
      if (this.rule)
        this.$validate.validRule(this.rule, validVal);
    }
  }
};
</script>
<style lang="scss" type="text/scss">
.formDate {
  width: 100%;

  &.invalid-input {
    .el-input__inner {
      border: #ff4848 1px solid !important;
    }
  }
}
</style>
