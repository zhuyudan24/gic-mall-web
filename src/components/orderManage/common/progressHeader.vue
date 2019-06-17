<template>

</template>

<script>
  export default {
    name: "progressHeader.vue",
    props: {
      progressList: {
        type: Array,
        default: []
      }
    },
    data(){
      return {
        headerName:''
      }
    }
  }
</script>

<style scoped>

</style>
