<template>
    <div v-show="isShow">
        <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'TabPane',
  data () {
    return {
      isShow: false
    }
  },
  props: {
    label: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
