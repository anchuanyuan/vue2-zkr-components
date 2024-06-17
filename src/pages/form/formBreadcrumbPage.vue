<template>
<div>
 <h2> {{$route.meta.title}} </h2>
  
</div>
</template>
<script>

export default {
  data() {
    return {
    }
  },
  created(){
    console.log(this.$route)
  },
  computed: {

  }

}
</script>