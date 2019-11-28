<template>
  <div id="userLayout">
    <route-view></route-view>
  </div>
</template>

<script>
  import RouteView from "@/components/layouts/RouteView"

  export default {
    name: "UserLayout",
    components: { RouteView },
    methods: {
      login() {
        this.$refs['login'].handleSubmit();
      }
    }
  }
</script>

<style lang="scss" scoped>
  #userLayout {
    height: 100%;
    background-image: url(~@assets/login/back.png);
    background-size: 100% 100%;
  }
</style>