<template>
  <div class="quickEditorResume-wrapper">
    <div :class="['viewData']" @dblclick="openDialog">
      <!--<customResumeEditor style="user-select: none;" @blur="onBlur" ref="editorA" @lock="onLock" :lock="lockFn"-->
      <!--                    v-model="inputVal" />-->
      <customResumeEditor2 style="user-select: none;" @blur="onBlur" ref="editorA"
                          v-model="inputVal" />
<!--      <div class="generator" @click="generator">自动生成简历</div>-->
    </div>
    <commonDialog v-if="controller.visible" title="简历编辑"
                  :visible.sync="controller.visible"
                  appendBody
                  height="520px"
                  width="1000px"
                  :save="closeDialog">
      <div class="resumeContainer">

        <div class="edit">
          <!--<customResumeEditor ref="editorB" blurDisabled @lock="onLock" :lock="lockFn" v-model="inputVal"></customResumeEditor>-->
          <customResumeEditor2 ref="editorB" blurDisabled v-model="inputVal"></customResumeEditor2>
        </div>
      </div>
    </commonDialog>
  </div>
</template>
<script>
import customResumeEditor2 from './customResumeEditor.vue'
export default {
  props: {
    value: String,
    locked: String,
    personEmpId: String
  },
  components: {
    customResumeEditor2
  },
  watch: {
    value(val) {
      console.log('update.................');
      console.log(val);
      this.inputVal = val
    },
    // value:{
    //   handler(val){
    //       console.log('update.................');
    //       console.log(val);
    //     this.inputVal = val
    //   },
    //   deep:true
    // },
    inputVal(val) {
      this.$emit('input', this.spaceFormat(val))
    },
    locked() {
      if (this.$refs.editorA)
        this.$refs.editorA.initValue(this.inputVal)
      if (this.$refs.editorB)
        this.$refs.editorB.initValue(this.inputVal)
    },
  },
  data() {
    return {
      controller: {
        visible: false,
      },
      inputVal: '',
    }
  },
  created() {
	  
  },
  mounted() {
    if (this.value) {
      this.inputVal = this.value
    }
  },
  methods: {
    onBlur(val) {
      this.$emit('change',this.spaceFormat(val))
    },
    generator() {
      this.$showConfirm('确认根据当前职务及教育信息生成简历?',()=>{
        this.$emit('generate')
      })
    },
    lockFn(str) {
      let newStr = str.replace(/&ensp;/g, " ")
      return this.locked && ~this.locked.split('$_').indexOf(newStr)
    },
    onLock(content, locked) {
      content = this.spaceFormat(content)
      // let date = content.substr(0, 16)
      // let info = content.substr(16)
      

      let lockedList = this.locked ? this.locked.split('$_') : []
      const index = lockedList.indexOf(content)
      if (~index) {
        lockedList.splice(index, 1)
      } else {
        lockedList.push(content)
      }
      this.$ajaxPost({
        url: this.$baseUrl + 'cadre/batchUpdateEmpA001ByEmpId',
        data: {
          empId: this.personEmpId || this.$route.query.EMP_ID,
          fieldModels: [{
            'fieldCode': 'a01091',
            'fieldCodeValue': lockedList.join('$_'),
          }]
        }
      }, true, res => {
        if (res.code === 200) {
          this.$showMsg("success", `${~index ? "解锁" : "锁定"}简历成功!`);
          this.$emit('lock')
        } else {
          this.$showMsg("error", res.message);
        }
      })
    },
    openEducation() {
      this.$emit('openEducation')
    },
    openPosition() {
      this.$emit('openPosition')
    },
    openDialog() {
      this.controller.visible = true
      this.inputVal = this.value
    },
    spaceFormat(val) {
      val = val && val.replace(/\u2002/g, ' ')
      return val
    },
    closeDialog() {
      this.$nextTick(()=>{
        let data = this.$refs.editorB.currentValue
        this.$emit('input', this.spaceFormat(this.$refs.editorB.currentValue))
        this.$emit('change',this.spaceFormat(this.$refs.editorB.currentValue))
        this.controller.visible = false
      })
    },
  }
}
</script>

<style type="text/scss" lang="scss">
.quickEditorResume-wrapper {
  height: 100%;
  width: 100%;

  .viewData {
    //position: relative;
    //height: calc(100% + 1px);
    height: 100%;
    width: calc(100% + 1px);
    //cursor: pointer;
    font-size: 16px;
    display: flex;
    //align-items: center;
    //justify-content: center;
    padding: 3px;

    .generator {
      position: absolute;
      bottom: 15px;
      right: 15px;
      color: #417FF2;
      border: 1px solid #417FF2;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      transition: .1s;
      background-color: #fff;

      &:hover {
        transition: .1s;
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }

    //&:hover {
    //  padding: 0px;
    //  //padding: 0 17px;
    //  //box-sizing: border-box;
    //  border: 3px solid #417FF2;
    //  color: #417FF2;
    //}
  }

  .alignLeft {
    justify-content: flex-start;
  }
}

.resumeContainer {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;

  .operate {
    padding: 10px 15px;
    border-bottom: 1px solid #E5E5E5;
  }

  .edit {
    padding: 10px 0 10px 30px;
    height: 450px;
    outline: none;
    font-size: 14px;
    color: #333;
    overflow: auto;
    .customResumeEditor-wrapper{
      height: auto;
    }
  }
}
</style>
