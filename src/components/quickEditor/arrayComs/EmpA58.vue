
<template>
  <div class="empa58">
    <div class="showText" @click="visible = true">
      {{showText}}
    </div>
    <commonDialog
        title="政治面貌"
        isDraggable
        :visible.sync="visible"
        width="800px"
        height="600px"
        >
      <commonTable
          :gridColumns="gridColumns"
          :options="tableData"
          height="580px"
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
        title="新增" width="500px"
        top="35vh"
        height="200px"
        :save="saveForm"
    >
      <commonForm>
        <formRow label="政治面貌" >
          <formCodeSelect v-model="form.a58001B" code-key="GB/T4762-1984"  :props="{value: 'name'}">
          </formCodeSelect>
        </formRow>
        <formRow label="参加党派日期" >
         <formDate v-model="form.a58005"></formDate>
        </formRow>
      </commonForm>
    </commonDialog>
  </div>
</template>

<script>


export default {
  name: "Empa58",
 // 政治面貌
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  created() {
    // this.tableData = this.value;
  },
 // 政治面貌
  data() {
    return {
      visible: false,
      gridColumns:[
        {
          dataIndex: 'a58001B',
          text: '政治面貌',
          align: "center"
        },
        {
          dataIndex: 'a58005',
          text: '参加党派时间',
          align: "center"
        },
        {
          text: "操作",
          align: "center",
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
        a58001B: '',
        a58005: ''
      },
      selectIndex: 0,
      isEdit: false,
      isAdd: true
    }
  },
  watch:{  },
  computed: {
    tableData: {
      get() {
        return this.value
      },
      set(value) {
        let res = []
        if (value && value.length > 0) {
          res = value.map(item => {
            delete item.$index
            return item
          })
        }
        this.$emit('update:value', res)
      }
    },
    showText(){
      if(this.tableData && this.tableData.length > 0){
        return this.tableData[0].a58001B
      }else {
        return ''
      }
    }
  },
  methods: {
    addRow(){
      this.isEdit = false
      this.isAdd = true
      this.showAddDialog = true
    },
    changeRow(row){
      this.isEdit = true
      this.isAdd = false
      this.form = row

      this.selectIndex = row.$index
      this.showAddDialog = true
    },
    delRow(row){
      this.tableData.splice(row.$index, 1)
    },
    saveForm(){
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
 .empa58 {
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
  ::v-deep .el-dialog__wrapper .formRow  .el-input__inner{
    text-align: left!important;
    border: 1px solid #DCDFE6!important;
  }
}
</style>