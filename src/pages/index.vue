<template>
<div>
 <h2> 导航页 </h2>
 <div  v-for="item in routes">
  <router-link :to="item.path" > {{item.meta.title}}</router-link>
 </div>
</div>
</template>
<script>
import {routes} from "@/router/index.js";
console.log(routes)
export default {
  data() {
    return {
      routes
    }
  }
}
</script>