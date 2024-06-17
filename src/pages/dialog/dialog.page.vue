<template>
  <div>
    <el-button @click="showDialog(1)">打开弹窗1</el-button>
    <el-button @click="showDialog(2)">打开弹窗2</el-button>
    <commonDialog  :visible.sync="open.dialog1"/>
  </div>
</template>
<script>
  import {routes} from "@/router/index.js"
  import commonDialog from "@/optimize/common/commonDialog.vue"
  console.log(routes)
  export default {
    componments: {
      commonDialog
    },
    data() {
      return {
        routes,
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