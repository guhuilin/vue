<template>
    <div class="wrap">
        <div class="top">{{data.title}}</div>
        <div class="middle">来源：{{data.source_name}} {{data.created_at}}</div>
        <div v-html="data.content"></div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      data: []
    }
  },
  created () {
    this.api.api.detail(this.$route.params.id).then(res => {
      this.data = res.data
    })
  }
}
</script>
<style lang="scss" scoped>
.wrap{
  padding: .2rem;
  line-height: .25rem;
  box-sizing: border-box;
  .top{
    font-size: .14rem;
  }
}
</style>
