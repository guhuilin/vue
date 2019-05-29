<template>
    <div>
        <slot></slot>
        <span class="showtoast" v-show="loading">正在加载...</span>
    </div>
</template>

<script>
export default {
  name: 'ScrollView',
  props: {
    //  开关到达底部的到达底部请求数据的时候不允许请求多次，请求完毕的时候打开开关
    flg: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {
    flg (newVal) {
      this.loading = !newVal
    }
  },
  mounted () {
    this.initEvent()
  },
  methods: {
    _scroll (event) {
      const scrollTop = window.scrollY
      const bodyHeight = document.body.scrollHeight // clinentheight如果不设置高100%
      const windowHeight = window.innerHeight
      if (bodyHeight - scrollTop === windowHeight) {
        if (this.flg) {
          this.scrollBottom()
        }
      }
    },
    initEvent () {
      window.addEventListener('scroll', this._scroll)
    },
    scrollBottom () {
      this.$emit('on-scroll-bottom')
    }
  }
}
</script>

<style lang="scss" scoped>
.showtoast{
    position: fixed;
    top: 50%;
    left: 50%;
    @include cen(1rem,.3rem);
    @include marginTrbl(-.15rem,0,0,-.5rem);
    background: rgba(0,0,0,.4);
    color: #fff;
}
</style>
