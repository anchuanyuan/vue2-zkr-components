<template>
  <div>
    <el-button @click="showDialog(1)">打开弹窗1</el-button>
    <el-button @click="showDialog(2)">打开弹窗2</el-button>
    <commonDialog  :visible.sync="open.dialog1"/>
    <commonDialog title="弹窗2"  :visible.sync="open.dialog2"/>
  </div>
</template>
<script>
  export default {
    components: {
      // commonDialog
    },
    data() {
      return {
        open: {
          dialog1: false,
          dialog2: false
        }
      }
    },
    methods: {
      showDialog(index) {
        this.open['dialog' + index ] = true
      }
    }
  }
</script>