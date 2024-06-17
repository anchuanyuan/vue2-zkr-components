<template>
  <div class="Empa16">
    <div class="showText" @click="visible=true">
      {{qrzxl}}
    </div>
    <commonDialog
        title="学历学位信息"
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
        <formRow label="教育类别" required>
          <formCodeSelect v-model="form.a16001" code-key="SD_ZB123" :props="{value: 'name'}">
          </formCodeSelect>
        </formRow>
        <formRow label="入学日期">
          <formDate v-model="form.a16006"></formDate>
        </formRow>

        <formRow label="毕(肄/结)业日期">
          <formDate v-model="form.a16007">
          </formDate>
        </formRow>
        <formRow label="学校(单位)名称" required>
          <formInput v-model="form.a16010">
          </formInput>
        </formRow>
        <formRow label="院系名称">
          <formInput v-model="form.a16011">
          </formInput>
        </formRow>
        <formRow label="学历代码">
          <formSelectInput v-model="form.a16002" code-key="GB/T4658-2006" value-key="nameCn">
          </formSelectInput>
        </formRow>
        <formRow label="所学专业名称">
          <formInput v-model="form.a16012">
          </formInput>
        </formRow>
        <formRow label="所学专业名称类别">
          <formSelectInput v-model="form.a16013" code-key="GB/T16835-1997" value-key="nameCn">
          </formSelectInput>
        </formRow>
        <formRow label="学位代码">
          <formSelectInput v-model="form.a16004" code-key="SD_GB6864" value-key="nameCn">
          </formSelectInput>
        </formRow>
        <formRow label="学位授予日期">
          <formDate v-model="form.a16009">
          </formDate>
        </formRow>
        <formRow label="是否输出" required>
          <formCodeSelect v-model="form.a16015" code-key="whether" :props="{value: 'name'}" >
          </formCodeSelect>
        </formRow>


      </commonForm>
    </commonDialog>
  </div>
</template>

<script>


export default {
  name: "EmpA16", // 全日制教育
  // 政治面貌
  props: {
    value: {
      type: Array,
      default: ()=>[]
    },
    showText: {
      type: Object,
      default() {
        return {
          qrzxl: false,
        }
      }
    }
  },
  created() {
  },
  // 政治面貌
  data() {
    return {
      visible: false,
      gridColumns: [
        {
          dataIndex: 'a16001',
          text: '教育类别',
          align: "center"
        },
        {
          dataIndex: 'a16006',
          text: '入学日期',
          align: "center"
        },
        {
          dataIndex: 'a16007',
          text: '毕(肄/结)业日期',
          width: "150",
          align: "center"
        },
        {
          dataIndex: 'a16010',
          text: '学校(单位)名称',
          width: "150",
          align: "center"
        },
        {
          dataIndex: 'a16011',
          text: '院系名称',
          align: "center"
        },
        {
          dataIndex: 'a16002',
          text: '学历代码',
          align: "center"
        },
        {
          dataIndex: 'a16012',
          text: '所学专业名称',
          width: "140",
          align: "center"
        },
        {
          dataIndex: 'a16013',
          text: '所学专业名称类别',
          width: "150",
          align: "center"
        },
        {
          dataIndex: 'a16004',
          text: '学位代码',
          align: "center"
        },
        {
          dataIndex: 'a16009',
          text: '学位授予日期',
          width: "140",
          align: "center"
        },
        {
          dataIndex: 'a16015',
          text: '是否输出',
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
        "a16001": "", //教育类别
        "a16002": "", // 学历代码
        "a16004": "", // 学位代码
        "a16006": "", // 入学时间
        "a16007": "", // 毕业时间
        "a16009": "", // 学位授予时间
        "a16010": "", // 学校单位名称
        "a16011": "", // 院系名称
        "a16012": "", //  所学专业名称
        "a16013": "", // 所学专业类别
        "a16015": ""  // 输出表示
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
    qrzxl() { // 全日学历
      if (this.tableData && this.tableData.length > 0) {
        let qrzData =  this.tableData.filter(item => item.a16001.includes('1'))
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
.Empa16 {
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