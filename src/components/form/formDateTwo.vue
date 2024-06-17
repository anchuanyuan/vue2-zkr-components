<template>
  <div :class="['formDate',{'invalid-input': validInput}]">
    <el-date-picker :disabled="disabled" v-model="inputValue" :type="useType" :placeholder="placeholder" :clearable="clearable" @change="change" @blur="blur()"> </el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'formInput',
  props:{
    value:[String,Number],
    type:String,
    placeholder:{
      type:String,
      default:"请选择时间",
    },
    format:{
      type:String,
      default:"YYYY-MM",
    },
    clearable:{type:Boolean,default:true},
    disabled:{type:Boolean,default:false},
    rule:[Object,Array]
  },
  data() {
    return{
    }
  },
  computed: {
    useType() {
      if(this.type)
        return this.type;
      let type = "date";
      switch(this.format) {
        case "YYYY-MM-DD":
          type="date";
          break;
        case "YYYY-MM":
          type="month";
          break;
        case "YYYY":
          type="year";
          break;
        case "YYYY-MM-DD hh:mm:ss":
          type="datetime";
          break;
        default:
          break;
      };
      return type;
    },
    inputValue: {
      get() {
        if(this.value)
          return this.$moment(this.value).format(this.format);
        return null;
      },
      set(val) {
        if(val) {
          val=this.$moment(val).format(this.format);
          if(this.format==="X"||this.format==="x")
            val = parseInt(val);
        }
        this.$emit("input", val);
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
  },
  methods: {
    blur() {
      if (this.rule) {
        this.validRule(this.inputValue);
      }
    },
    change(val) {
      this.validRule(val);
      this.$emit("change", val);
    },
    validRule(val) {
      let validVal = "";
      if(val&&val!=="Invalid date")
        validVal = val;
      if (this.rule) {
        this.$validate.validRule(this.rule, validVal);
      }
    }
  },
}
</script>
<style lang="scss" type="text/scss">
.formDate{
  width: 100%;
  // display:inline-block;
  &.invalid-input {
    .el-input__inner {
      border: #ff4848 1px solid !important;
    }
  }
  .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
  .el-input__icon{
    line-height: 32px;
    cursor: pointer;
  }
}
</style>
