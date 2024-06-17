<template>
  <div class="EmpA36">
    <div class="showText" @click="visible=true">
     共 {{tableData.length}} 条数据
    </div>
    <commonDialog
        title="家庭成员"
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
        <formRow label="关系名称代码" required>
          <formSelectInput v-model="form.a36005B" code-key="GB/T4761-2008" value-key="nameCn"/>
        </formRow>
        <formRow label="姓名" required >
          <formInput v-model="form.a36001" />
        </formRow>
        <formRow label="身份证号码"  >
          <formInput :maxlength="18"  v-model="form.a36013" />
        </formRow>

        <formRow label="出生日期"  >
          <formDate  v-model="form.a36007" />
        </formRow>
        <formRow label="民族" >
          <formCodeSelect v-model="form.a36021" code-key="GB/T3304-1991" :props="{value: 'name'}" />
        </formRow>
        <formRow label="政治面貌" >
          <formCodeSelect v-model="form.a36027B" code-key="GB/T4762-1984" :props="{value: 'name'}" />
        </formRow>

        <formRow label="工作单位及职务"  required>
          <formInput   v-model="form.a36011" />
        </formRow>
        <formRow label="身份"  > <!--个人身份-->
          <formCodeSelect v-model="form.a36031" code-key="GB/T2261.4-2003" :props="{value: 'name'}" />
        </formRow>
        <formRow label="现状" >
          <formCodeSelect v-model="form.a36041" code-key="DM125" :props="{value: 'name'}" />
        </formRow>
      </commonForm>
    </commonDialog>
  </div>
</template>

<script>
//

export default {
  name: "EmpA36", // 家庭成员
  // 政治面貌
  props: {
    value: {
      type: Array,
      default: ()=>[]
    },
  },
  created() {
    this.tableData = this.EmpA36Data;
  },
  // 政治面貌
  data() {
    return {
      visible: false,
      gridColumns: [
        {
          dataIndex: 'a36005B',
          text: "关系名称代码",
          align: "center",
        },
        {
          dataIndex: 'a36001',
          text: '姓名',
          align: "center"
        },
        {
          dataIndex: 'a36007',
          text: '出生日期',
          align: "center"
        },
        {
          dataIndex: 'a36021',
          text: '民族',
          align: "center"
        },
        {
          dataIndex: 'a36027B',
          text: '政治面貌',
          align: "center"
        },
        {
          dataIndex: 'a36011',
          text: '工作单位及职务',
          align: "center"
        },
        {
          dataIndex: 'a36031',
          text: '身份',
          align: "center"
        },
        {
          dataIndex: 'a36041',
          text: '现状',
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
        "a36005B": "[01]本人", // 关系名称代码
        "a36001": "本人姓名",  // 姓名
        "a36013": "379802111122220123", // 身份证号码

        "a36007": "2018.02", // 出生日期
        "a36021": "[05]维吾尔族", // 民族
        "a36027B": "[04]民革", // 政治面貌

        "a36011": "工作单位及职务", // 工作单位及职务
        "a36031": "[37]现役军人",  // 身份
        "a36041": "[3]在业" // 现状
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
.EmpA36 {
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