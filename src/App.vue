
<template>
  <!-- vue-router 提供的组件 写在入口组件后 自己解析加载路由表中的vue组件 -->
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import codeData from './assets/codeData.json'
console.log(codeData)
export default {
  created() {
    localStorage.setItem("cadre_codeData",JSON.stringify(codeData))

  }
}
</script>

<style>

#app {
  //width: 80vw;
  margin: 0 auto;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}
</style>
