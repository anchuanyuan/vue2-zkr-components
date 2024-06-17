<template>
  <div class="EmpA14A">
    <div class="showText" @click="visible=true">
     共 {{tableData.length}} 条惩戒
    </div>
    <commonDialog
        title="惩戒信息"
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
        <formRow label="监督单位" >
          <formSelectInput v-model="form.sdCfDwlx" code-key="overallSupervision" value-key="nameCn"/>
        </formRow>
        <formRow label="批准日期" >
          <formDate v-model="form.sdCfPzrq"></formDate>
        </formRow>
        <formRow label="批准机关"  >
          <formInput v-model="form.sdCfPzjg" >
          </formInput>
        </formRow>
        <formRow label="批准机关性质"  >
          <formSelectInput v-model="form.sdCfPzjgJgxzDm" code-key="SD_ZB04" value-key="nameCn"/>
        </formRow>
        <formRow label="批准机关级别" >
          <formSelectInput v-model="form.sdCfPzjgJgjbDm" code-key="DM141" value-key="nameCn" />
        </formRow>
        <formRow label="惩戒名称代码"> <!--获得专业技术职务任职资格途径代码-->
          <formSelectInput v-model="form.sdCfDm" key="sdCfDm" code-key="SD_DB203"  value-key="nameCn"/>
        </formRow>

        <formRow label="惩戒名称" >
          <formInput v-model="form.sdCfMc" />
        </formRow>

        <formRow label="惩戒原因" >
          <formInput v-model="form.sdCfCfyy" />
        </formRow>

        <formRow label="备注信息"  >
          <formInput v-model="form.sdCfBzxx" >
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
  name: "EmpA14B", // 惩戒信息
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
          dataIndex: 'sdCfDwlx',
          text: "监督单位",
          align: "center",
        },
        {
          dataIndex: 'sdCfPzrq',
          text: '批准日期',
          align: "center"
        },
        {
          dataIndex: 'sdCfPzjg',
          text: '批准机关',
          align: "center"
        },
        {
          dataIndex: 'sdCfPzjgJgjbDm',
          text: '批准机关级别',
          align: "center"
        },
        {
          dataIndex: 'sdCfDm',
          text: '惩戒名称代码',
          align: "center"
        },
        {
          dataIndex: 'sdCfMc',
          text: '惩戒名称',
          align: "center"
        },
        {
          dataIndex: 'sdCfCfyy',
          text: '惩戒原因',
          align: "center"
        },
        {
          dataIndex: 'sdCfBzxx',
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
        "sdCfBzxx": "备注", // 备注信息
        "sdCfCfyy": "原因", // 惩戒原因
        "sdCfDm": "[2230]警告", // 惩戒名称代码
        "sdCfDwlx": "[1]民政局", // 监督单位
        "sdCfMc": "惩戒名称", // 惩戒名称
        "sdCfPzjg": "", // 批准机关
        "sdCfPzjgJgjbDm": "[101]中央、国家级(正)", //  批准机关级别
        "sdCfPzjgJgxzDm": "[1002]党的纪委", // 批准机关性质
        "sdCfPzrq": "2023.02" // 批准日期
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