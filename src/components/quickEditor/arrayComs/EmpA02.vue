<template>
  <div class="EmpA02">
    <div class="showText" @click="visible=true">
     共 {{tableData.length}} 条
    </div>
    <commonDialog
        title="工作单位及职务"
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
        <formRow label="决定或批准任职的日期" required>
          <formDate v-model="form.a02043"></formDate>
        </formRow>
        <formRow label="决定或批准免职的日期">
          <formDate v-model="form.a02065"></formDate>
        </formRow>

        <formRow label="任职机构代码(统计关系)"  required>
          <departDialog :noPermission="true" limit="unLimit" v-model="form.a02001B" :label="form.a001004ALabel" placeholder="统计关系所在单位"/>
          <span></span>
          <span slot="lableOther">
            <span style="color: red">选到科室</span>
          </span>
        </formRow>
        <formRow label="任职单位" >
          <formInput v-model="form.a02001A" />
        </formRow>
        <formRow label="职务代码" required>
          <formSelectInput v-model="form.a02016B" @save="changeA02016B" code-key="GB/T12403-1990" value-key="nameCn">
          </formSelectInput>
        </formRow>
        <formRow label="职务名称">
          <formInput :value="form.a02016A">
          </formInput>
        </formRow>
        <formRow label="职务属性" required>
          <formSelectInput v-model="form.a02008" code-key="SD_DM049" value-key="nameCn">
          </formSelectInput>
        </formRow>
        <formRow label="是否占领导编制职数" required>
          <formCodeSelect v-model="form.a02066" code-key="whether" >
          </formCodeSelect>
        </formRow>
        <formRow label="任职状态" required>
          <formCodeSelect v-model="form.a02055" code-key="DM007" :props="{value: 'name'}" >
          </formCodeSelect>
        </formRow>
        <formRow label="任职方式" required>
          <formCodeSelect v-model="form.a02047" code-key="DM003" :props="{value: 'name'}">
          </formCodeSelect>
        </formRow>
        <formRow label="任职原因" required>
          <formSelectInput v-model="form.a02049" codeKey="DM004" valueKey="nameCn">
          </formSelectInput>
        </formRow>
        <formRow label="是否调任" required>
          <formCodeSelect v-model="form.xxxx" code-key="whether" :props="{value: 'name'}" >
          </formCodeSelect>
        </formRow>
        <formRow label="多职务主次序号" required>
          <formInput v-model="form.a02023" type="number" />
        </formRow>
        <formRow label="是否主要职务" required>
          <formCodeSelect v-model="form.sdZwSfzyzw" code-key="whether" :props="{value: 'name'}" >
          </formCodeSelect>
        </formRow>
        <formRow label="是否班子领导成员" required>
          <formCodeSelect v-model="form.a020730" code-key="whether" :props="{value: 'name'}" >
          </formCodeSelect>
        </formRow>
        <formRow label="是否领导职务" required>
          <formCodeSelect v-model="form.zwSfldzw" code-key="whether" :props="{value: 'name'}" >
          </formCodeSelect>
        </formRow>

      </commonForm>
    </commonDialog>
  </div>
</template>

<script>


export default {
  name: "EmpA02", // 全日制教育
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
          dataIndex: 'a02043',
          "text": "决定或批准任职的日期",
          "width": "150",
          "align": "center",
        },
        {
          dataIndex: 'a02065',
          text: '决定或批准免职的日期',
          align: "center"
        },
        // {
        //   dataIndex: 'a16007',
        //   text: '统计关系所在单位',
        //   width: "150",
        //   align: "center"
        // },
        // {
        //   dataIndex: 'a16010',
        //   text: '任职机构名称',
        //   width: "150",
        //   align: "center"
        // },
        {
          dataIndex: 'a02016A',
          text: '职务名称',
          align: "center"
        },
        {
          dataIndex: 'zwSfldzw',
          text: '是否占领导编制职数',
          align: "center"
        },
        {
          dataIndex: 'a02055',
          text: '任职状态',
          width: "140",
          align: "center",
          // formatter: scope => {
          //   return {
          //     text: scope.row.a16012,
          //     showText: true,
          //   };
          // }
        },
        {
          dataIndex: 'a02023',
          text: '多职务主次序号',
          width: "150",
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
        "a02001A": "", // xxx
        "a02001B": "xxx", //  任职机构代码  统计关系所在单位
        "a02008": "[22]非领导职务助理职", // 职务属性
        "a02016A": "党组成员",  // 职务名称
        "a02016B": "[003Z]党组成员", // 职务代码
        "a02023": "1", // 多职务主次序号
        "a02043": "2017.01", // 决定或批准任职的日期
        "a02047": "[101]党委任命", // 任职方式 (表里没有)
        "a02049": "[101]进一步使用", // 任职原因
        "a02050": "[1]是", // xxx?
        "a02055": "[2]在任", // 任职状态
        "a02065": "2016.02", //  决定或批准免职的日期
        "a02066": "[1]是", // 任职状态
        "a020730": "[1]否", // 是否班子领导成员
        "sdZwSfzyzw": "[2]是", // 是否主要职务
        "zwSfldzw": "[2]是", // // 是否领导职务
          // zw_sfldzw: ''
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
.EmpA02 {
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