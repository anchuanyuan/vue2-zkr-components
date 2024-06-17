<template>
  <div class="EmpA15">
    <div class="showText" @click="visible=true">
     共 {{tableData.length}} 条
    </div>
    <commonDialog
        title="考核信息"
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
        <formRow label="考核年度" >
          <formDate type="year" v-model="form.a15021"></formDate>
        </formRow>
        <formRow label="考核类别"  >
          <formSelectInput v-model="form.a15001" code-key="DM017" value-key="nameCn"/>
        </formRow>
        <formRow label="考核结论类别" >
          <formSelectInput v-model="form.a15017" code-key="DM018" value-key="nameCn" />
        </formRow>
        <formRow label="备注信息"  >
          <formInput v-model="form.sdNdkhBzxx" >
          </formInput>
        </formRow>

      </commonForm>
    </commonDialog>
  </div>
</template>

<script>


export default {
  name: "EmpA15", // 考核情况
  // 政治面貌
  props: {
    value: {
      type: Array,
      default: ()=>[]
    },
  },
  created() {
  },
  // 政治面貌
  data() {
    return {
      visible: false,
      gridColumns: [
        {
          dataIndex: 'a15021',
          text: "考核年度",
          align: "center",
        },
        {
          dataIndex: 'a15001',
          text: '考核类别',
          align: "center"
        },
        {
          dataIndex: 'a15017',
          text: '考核结论类别',
          align: "center"
        },
        {
          dataIndex: 'sdNdkhBzxx',
          text: '备注信息',
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
        "a15001": "[11]年度考核", // 考核类别
        "a15017": "[3]基本称职", //考核结论类别
        "a15021": "2000", //考核年度
        "sdNdkhBzxx": "备注" // 备注
      },
      selectIndex: 0,
      isEdit: false,
      isAdd: true
    }
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
.EmpA15 {
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

  ::v-deep .el-dialog__wrapper .formRow .el-input__inner {
    text-align: left !important;
    border: 1px solid #DCDFE6 !important;
  }
}
</style>