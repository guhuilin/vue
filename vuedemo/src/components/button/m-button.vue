<template>
  <button class="m-button" :class="buttonClass">
    <svg-icon v-if="icon" :name="icon" />
    <slot></slot>
  </button>
</template>

<script>
import { oneOf } from '@/utils/oneOf.js'
export default {
  name: 'MButton',
  props: {
    type: {
      type: String,
      validator (value) {
        return oneOf(value, 'primary', 'success', 'info', 'warning ')
      },
      default: 'default'
    },
    size: {
      type: String,
      validator (value) {
        return oneOf(value, ['lg', 'medium', 'small', 'mini'])
      },
      default: 'lg'
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    buttonClass () {
      const classObj = {
        [this.type]: true,
        [this.size]: true,
        round: this.round,
        disabled: this.disabled
      }
      if (this.icon) {
        classObj[this.icon] = true
      }
      return classObj
    }
  }
}
</script>

<style lang="scss" scoped>
.m-button {
  @include wh(100%, 0.5rem);
}
.primary {
  background: lightcoral;
}
.success {
  background: lightgreen;
}
.warning {
  background: lightsalmon;
}
.info {
  background: yellow;
}
.lg {
  @include wh(100%, 0.5rem);
}
.medium {
  @include wh(70%, 0.4rem);
}
.small {
  @include wh(40%, 0.3rem);
}
.mini {
  @include wh(20%, 0.2rem);
}
.round {
  border-radius: 0.2rem;
}
</style>
