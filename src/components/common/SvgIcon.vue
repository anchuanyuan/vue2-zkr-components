<template>
    <svg aria-hidden="true">
      <use :href="symbolId" :fill="color" />
    </svg>
  </template>
  
  <script>
  
  export default {
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#333',
      },
    },
    computed : {
        symbolId() {
            return  `#${this.prefix}-${this.name}`
        }
    }
  }
  </script>
  <style scoped>
svg {
  width: 1.15em;
  height: 1.15em;
  line-height: 1.25em;
}
</style>