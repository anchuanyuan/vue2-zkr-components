<template>
  <div class="EmpA05">
    <div class="showText" @click="visible=true">
     共 {{tableData.length}} 条
    </div>
    <commonDialog
        title="职务层次"
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
        <formRow label="职务层次批准日期" required>
          <formDate v-model="form.a05004"></formDate>
        </formRow>
        <formRow label="职务层次终止日期">
          <formDate v-model="form.a05017"></formDate>
        </formRow>
        <formRow label="职务层次代码" required>
          <formSelectInput v-model="form.a05002B"  code-key="SD_DB205" value-key="nameCn">
          </formSelectInput>
        </formRow>
        <formRow label="现行职务层次标识"  required>
          <formCodeSelect v-model="form.a05024" @save="changeA02016B" code-key="whether" :props="{value: 'name'}">
          </formCodeSelect>
        </formRow>

      </commonForm>
    </commonDialog>
  </div>
</template>

<script>


export default {
  name: "EmpA05", // 全日制教育
  // 政治面貌
  props: {
    value: {
      type: Array,
      default: ()=> []
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
          dataIndex: 'a05004',
          text: "职务层次批准日期",
          align: "center",
        },
        {
          dataIndex: 'a05017',
          text: '职务层次终止日期',
          align: "center"
        },
        {
          dataIndex: 'a05002B',
          text: '职务层次代码',
          align: "center"
        },
        {
          dataIndex: 'a05024',
          text: '现行职务层次标识',
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
        a05004: '', // 职务层次批准日期
        a05017: '', // 职务层次终止日期
        a05002B: '', // 职务层次代码
        a05024: '', // 现行职务层次标识
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
   /* qrzxw() { // 全日制学位
      if (this.tableData.length > 0) {
        let qrzData =  this.tableData.filter(item => item.a16001 == '[1]全日制')
        if(qrzData && qrzData.length >0) {
          return qrzData[0].a16004.split(']')[1]
        }
      } else {
        return ''
      }
    },
    qrzyx() { // 全日学校院系
      if (this.tableData.length > 0) {
        let zzData =  this.tableData.filter(item => item.a16001 == '[1]全日制')
        if(zzData && zzData.length >0) {
          return zzData[0].a16010 + zzData[0].a16011
        }
      } else {
        return ''
      }
    },
    zzxl() { // 在职学历
      if (this.tableData.length > 0) {
        let zzData =  this.tableData.filter(item => item.a16001 == '[2]在职')
        if(zzData && zzData.length >0) {
          return zzData[0].a16002.split(']')[1]
        }
      } else {
        return ''
      }
    },
    zzxw() { // 在职学位
      if (this.tableData.length > 0) {
        let zzData =  this.tableData.filter(item => item.a16001 == '[2]在职')
        if(zzData && zzData.length >0) {
          return zzData[0].a16004.split(']')[1]
        }
      } else {
        return ''
      }
    },
    zzyx() { // 在职日学校院系
      if (this.tableData.length > 0) {
        let zzData =  this.tableData.filter(item => item.a16001 == '[2]在职')
        if(zzData && zzData.length >0) {
          return zzData[0].a16010 + zzData[0].a16011
        }
      } else {
        return ''
      }
    },*/
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
.EmpA05 {
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