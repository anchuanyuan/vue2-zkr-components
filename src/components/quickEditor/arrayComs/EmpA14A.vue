<template>
  <div class="EmpA14A">
    <div class="showText" @click="visible=true">
     共 {{tableData.length}} 条奖励
    </div>
    <commonDialog
        title="奖励信息"
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
        <formRow label="批准日期" >
          <formDate v-model="form.sdJlPzrq"></formDate>
        </formRow>
        <formRow label="批准机关"  >
          <formInput v-model="form.sdJlPzjg" >
          </formInput>
        </formRow>
        <formRow label="批准机关性质"  >
          <formSelectInput v-model="form.sdJlPzjgJgxzDm" code-key="SD_ZB04" value-key="nameCn"/>
        </formRow>
        <formRow label="批准机关级别" >
          <formSelectInput v-model="form.sdJlPzjgJgjbDm" code-key="DM141" value-key="nameCn" />
        </formRow>
        <formRow label="奖励名称代码"> <!--获得专业技术职务任职资格途径代码-->
          <formSelectInput v-model="form.sdJlDm" code-key="SD_DB202"  value-key="nameCn"/>
        </formRow>

        <formRow label="奖励名称" >
          <formInput v-model="form.sdJlMc" />
        </formRow>

        <formRow label="奖励原因" >
          <formInput v-model="form.sdJlJlyy" />
        </formRow>

        <formRow label="备注信息"  >
          <formInput v-model="form.sdJlBzxx" >
          </formInput>
        </formRow>

        <!--<formRow label="是否输出到任免表"  >-->
        <!--  <formCodeSelect v-model="form.outPut"  code-key="whether" :props="{value: 'name'}">-->
        <!--  </formCodeSelect>-->
        <!--</formRow>-->
      </commonForm>
    </commonDialog>
  </div>
</template>

<script>



export default {
  name: "EmpA14A", // 奖励信息
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
          dataIndex: 'sdJlPzrq',
          text: "批准日期",
          align: "center",
        },
        {
          dataIndex: 'sdJlPzjg',
          text: '批准机关',
          align: "center"
        },
        {
          dataIndex: 'sdJlPzjgJgxzDm',
          text: '批准机关性质',
          align: "center"
        },
        {
          dataIndex: 'sdJlPzjgJgjbDm',
          text: '批准机关级别',
          align: "center"
        },
        {
          dataIndex: 'sdJlDm',
          text: '奖励名称代码',
          align: "center"
        },
        {
          dataIndex: 'sdJlMc',
          text: 'sdJlMc',
          align: "center"
        },
        {
          dataIndex: 'sdJlJlyy',
          text: '奖励原因',
          align: "center"
        },
        {
          dataIndex: 'sdJlBzxx',
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
        sdJlBzxx: "", // 奖励备注
        sdJlDm: "", // 奖励名称代码
        sdJlJlyy: "", // 奖励原因
        sdJlMc: "", // 奖励名称
        sdJlPzjg: "", // 批准机关
        sdJlPzjgJgjbDm: "", // 批准机关级别
        sdJlPzjgJgxzDm: "", // 批准机关性质
        sdJlPzrq: "", // 奖励 批准日期
        // outPut: "", // 是否输出到任免表
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
    showText() { // 全日学历
      if (this.tableData.length > 0) {
        let qrzData =  this.tableData.filter(item => item.a16001 == '[1]全日制')
        if(qrzData && qrzData.length >0) {
          return qrzData[0].a16002.split(']')[1]
        }
      } else {
        return ''
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
.EmpA14A {
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