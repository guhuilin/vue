<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script >
export default {
  name: 'svg-icon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 20
    }
  }
}
</script>

<style scoped>
.svg-icon {
      width: 20px;
      height: 20px;
      vertical-align: -0.15em;
      font-size:16px;
      fill: currentColor;
      overflow: hidden;
  }
</style>
