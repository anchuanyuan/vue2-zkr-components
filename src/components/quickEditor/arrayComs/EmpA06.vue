<template>
  <div class="EmpA06">
    <div class="showText" @click="visible=true">
     共 {{tableData.length}} 条
    </div>
    <commonDialog
        title="专业技术资格信息"
        isDraggable
        :visible.sync="visible"
        width="1200px"
        height="600px"
    >
      <commonTable
          :gridColumns="gridColumns"
          width="100%"
          :options="tableData"
          height="550px"
          @changeRow="changeRow"
          @delRow="delRow"
      >
        <commonSearch>
          <el-button slot="left" type="primary" @click="addRow">新增</el-button>
        </commonSearch>
      </commonTable>
    </commonDialog>

    <commonDialog
        is-draggable
        :visible.sync="showAddDialog"
        title="新增"
        width="1000px"
        height="500px"
        :save="saveForm"
    >
      <commonForm>
        <formRow label="专业技术资格代码" required>
          <formSelectInput v-model="form.a06001B"  code-key="SD_GB8561" value-key="nameCn"/>
        </formRow>
        <formRow label="专业技术资格名称"  required>
          <formInput v-model="form.a06001A" >
          </formInput>
        </formRow>
        <formRow label="专业技术资格级别"  required>
          <formSelectInput v-model="form.a06002" code-key="SD_ZB139" value-key="nameCn"/>
        </formRow>
        <formRow label="获得资格日期" required>
          <formDate v-model="form.a06004"></formDate>
        </formRow>
        <formRow label="获得资格方式"> <!--获得专业技术职务任职资格途径代码-->
          <formSelectInput v-model="form.a06007" code-key="SD_ZB24"  value-key="nameCn"/>
        </formRow>

        <formRow label="评委会或考试名称" >
          <formInput v-model="form.a06011" />
        </formRow>

        <formRow label="聘任专业技术职务情况"  >
          <formCodeSelect v-model="form.a06040"  code-key="whether" :props="{value: 'name'}">
          </formCodeSelect>
        </formRow>

        <formRow label="聘任专业技术职务起始日期" >
          <formDate v-model="form.a06025"></formDate>
        </formRow>
        <formRow label="聘任专业技术职务终止日期" >
          <formDate v-model="form.a06030"></formDate>
        </formRow>

        <formRow label="聘任专业技术职务单位"  >
          <formInput v-model="form.a06035" >
          </formInput>
        </formRow>

        <formRow label="是否输出到任免表"  >
          <formCodeSelect v-model="form.sdZyjsSc"  code-key="whether" :props="{value: 'name'}">
          </formCodeSelect>
        </formRow>
      </commonForm>
    </commonDialog>
  </div>
</template>

<script>


export default {
  name: "EmpA06", // 全日制教育
  // 政治面貌
  props: {
    value: {
      type: Array,
      default: ()=>[]
    },
  },

  // 政治面貌
  data() {
    return {
      visible: false,
      gridColumns: [
        {
          dataIndex: 'a06001B',
          text: "专业技术资格代码",
          align: "center",
        },
        {
          dataIndex: 'a06001A',
          text: '专业技术资格名称',
          align: "center"
        },
        {
          dataIndex: 'a06002',
          text: '专业技术资格级别',
          align: "center"
        },
        {
          dataIndex: 'a06007',
          text: '获得资格方式',
          align: "center"
        },
        {
          dataIndex: 'a06011',
          text: '评委会或考试名称',
          align: "center"
        },
        {
          dataIndex: 'sdZyjsSc',
          text: '是否输出到任免表',
          align: "center"
        },

        {
          text: "操作",
          align: "center",
          fixed: "right",
          width: "70",
          formatter: scope => {
            return {
              showDropDown: true,
              text: "操作",
              data: [
                {text: "修改", class: "blue", eName: "changeRow"},
                {text: "删除", class: "red", eName: "delRow"},
              ]
            };
          }
        }
      ],
      showAddDialog: false,
      form: {
        a06001B: '', // 专业技术资格代码
        a06001A: '', // 专业技术资格名称
        a06002: '', // 专业技术资格级别
        a06004: '', // 获得资格日期

        a06007: '', // 获得资格方式
        a06011: '', // 评委会或考试名称

        a06040: '', // 聘任专业技术职务情况
        a06025: '', // 聘任专业技术职务起始日期
        a06030: '', // 聘任专业技术职务终止日期
        a06035: '', // 聘任专业技术职务单位

        sdZyjsSc: '', // 是否输出到任免表
      },
      selectIndex: 0,
      isEdit: false,
      isAdd: true
    }
  },
  created() {
  },
  watch: {
  },
  computed: {
    tableData: {
      get() {
        return this.value
      },
      set(value) {
        let res = []
        if(value && value.length > 0) {
          res = value.map(item => {
            delete item.$index
            return item
          })
        }
        this.$emit('update:value', res)
      }
    },
  },
  methods: {
    changeA02016B(val,checkData){
      console.log(checkData,'changeA02016B')
      this.form.a02016A = checkData.name
    },
    addRow() {
      this.isEdit = false
      this.isAdd = true
      this.resetForm()
      this.showAddDialog = true
    },
    changeRow(row) {
      this.isEdit = true
      this.isAdd = false
      this.form = row

      this.selectIndex = row.$index
      this.showAddDialog = true
    },
    delRow(row) {
      this.tableData.splice(row.$index, 1)
    },
    saveForm() {
      let data = this.$deepClone(this.form)
      // delete data.$index
      if(this.isAdd) {
        this.tableData.push(data)
      } else {
        this.$set(this.tableData, this.selectIndex, data);
      }
      // this.tableData.push(this.form)
      this.showAddDialog = false
      this.resetForm()
    },
    resetForm() {
      for (let key in this.form) {
        this.$set(this.form, key, '')
      }
    }
  },
}
</script>

<style scoped lang="scss">
.EmpA06 {
  width: 100%;
  height: 100%;

  .showText {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  ::v-deep.el-dialog__wrapper .formRow .el-input__inner {
    text-align: left !important;
    border: 1px solid #DCDFE6 !important;
  }
}
</style>