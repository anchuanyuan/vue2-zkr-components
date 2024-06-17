<template>
  <div class="quickEditorSubInfo-wrapper-person relative">
    <div class="title">基本信息</div>
    <div class="form">
      <div class="item">
        <formRow class="subPersonRow" label="出生地乡镇" label-width="120px" other-width="0" msg-width="0">
          <formInput class="subFormInput" v-model="subVal.a01015"></formInput>
        </formRow>
      </div>
      <div class="item">
        <formRow class="subPersonRow" label="成长地" label-width="120px" other-width="0" msg-width="0">
          <formInput class="subFormInput" v-model="subVal.a01110"></formInput>
        </formRow>
      </div>
      <div class="item">
        <formRow class="subPersonRow" label="人员类别" label-width="120px" other-width="0" msg-width="0" :rules="rules.a01060" required>
          <formSelectInput v-model="subVal.a01060" placeholder="人员类别" :rules="rules.a01060"
                           codeKey="SD_ZB125" valueKey="nameCn" ></formSelectInput>
        </formRow>

      </div>
      <div class="item">
        <formRow class="subPersonRow" label="人员职位类别" label-width="120px" other-width="0" msg-width="0" :rules="rules.ryZwlbDm" required>
          <formSelectInput v-model="subVal.ryZwlbDm" placeholder="人员职位类别" :rules="rules.ryZwlbDm"
                           codeKey="SD_XZ93" valueKey="nameCn"></formSelectInput>
        </formRow>
      </div>
      <div class="item">
        <formRow class="subPersonRow" label="人员编制类型" label-width="120px" other-width="0" msg-width="0" :rules="rules.ryBzlxDm" required>
          <formSelectInput v-model="subVal.ryBzlxDm" placeholder="人员编制类型" :rules="rules.ryBzlxDm"
                           codeKey="SD_ZB135" valueKey="nameCn"></formSelectInput>
        </formRow>
      </div>
      <div class="item">
        <formRow class="subPersonRow" label="人员管理类别" label-width="120px" other-width="0" msg-width="0" :rules="rules.a01065" required>
          <formSelectInput
              v-model="subVal.a01065"
              codeKey="SD_DB201"
              placeholder="请选择人员管理类别"
              value-key="nameCn"
              :rules="rules.a01065"></formSelectInput>
        </formRow>
      </div>
     <!-- <div class="item">
        <formRow class="subPersonRow" label="人员管理状态" label-width="120px" other-width="0" msg-width="0" :rules="rules.a01063" required>
          <formSelect disabled v-model="subVal.a01063" codeKey="DM200" :rules="rules.a01063" placeholder="请选择人员管理状态"></formSelect>
        </formRow>
      </div>-->
      <div class="item">
        <formRow class="subPersonRow" label="统计关系所在单位" label-width="120px" other-width="0" msg-width="0" :rules="rules.a001004a" required>
          <departDialog :noPermission="true" limit="unLimit"  v-model="subVal.a001004a" :label="subVal.a001004ALabel"  :rules="rules.a001004a" placeholder="统计关系所在单位"/>
<!--                a01071    -->
          <span></span>
          <span slot="lableOther">
            <span style="color: red">选到科室</span>
          </span>
        </formRow>

      </div>
      <div class="item">
        <formRow class="subPersonRow" label="人事关系所在单位" label-width="120px" other-width="0" msg-width="0" :rules="rules.a01057B" required>
          <departDialog v-model="subVal.a01057B" :label="subVal.a01057BLabel" :rules="rules.a01057B" placeholder="人事关系所在单位"/>
          <!--      a01071    -->
          <span slot="lableOther">
            <span style="color: red">选到法人单位</span>
          </span>
        </formRow>

      </div>
     <!-- <div class="item">
       <formRow class="subPersonRow" label="参加工作时间" label-width="100rem" other-width="0" msg-width="0">
         <formDate class="subFormInput" v-model="subVal.a01034"></formDate>
       </formRow>
     </div> -->
     <div class="item">
       <formRow class="subPersonRow" label="公务员登记时间" label-width="120px" other-width="0" msg-width="0">
         <formDate class="subFormInput" v-model="subVal.a010910"></formDate>
       </formRow>
     </div>
      <div class="item">
        <formRow class="subPersonRow" label="是否有基层工作经验" label-width="120px" other-width="0" msg-width="0">
          <formSelect class="subFormInput" v-model="subVal.a01107"
                      @change="changeBaseWorkExp"
                      codeKey="whether" :props="{label: 'name', value: 'name'}"></formSelect>
        </formRow>
      </div>
      <div class="item" v-if="subVal.a01107.includes('1')">
        <formRow class="subPersonRow" label="基层工作经验时间" label-width="120px" other-width="0" msg-width="0">
          <formInput class="subFormInput" v-model="subVal.a01103"></formInput>
          <span slot="lableOther">
            <span style="color: red">格式(*年*月)</span>
          </span>
        </formRow>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'subInfo',
  props: ['subInfoData', 'rules'],
  watch: {
    subVal(val) {
      // this.$emit("input", val);
    },
    subInfoData(val) {
      this.subVal = this.val
    }
  },
  computed:{
    subVal:{
      get(val) {
        return this.subInfoData
      },
      set(val) {
        console.log(val);
        this.$emit("update:subInfoData", val);
      }
    }
  },
  mounted() {
    // this.subVal = this.subInfoData;
  },
  data() {
    return {
      // subVal: {},
    }
  },
  methods: {
    submit(){
      this.$emit("submit");
    },
    changeBaseWorkExp() {
      if (this.subVal.a01107.includes('0')) {
        this.subVal.a01103 = undefined;
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.quickEditorSubInfo-wrapper-person {
  background-color: #F3F3FA;
  overflow: auto;
  height: 100%;
  .title {
    padding: 20px 20px 20px 20px;
    font-size: 18px;
    color: #333;
    line-height: 18px;
    font-weight: 600;
    border-bottom: 1px solid #E5E5E5;
  }

  .form {
    padding: 20px 20px;
    .item {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .subPersonRow {
        padding-right: 0;
        .itemContent {
          padding-right: 0;
        }
        .form-input {
          margin-right: 0;
        }
      }
    }
  }
}
.bottom-2 {
  bottom: 20px;
}
.right-30px {
  right: 30px;
}
</style>