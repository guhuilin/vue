<template>
    <div class="tabs">
        <!-- tab切换 -->
        <header class="tabs-header">
            <nav ref="navitem">
              <a href="javascripy:;"
                 :class="activeIndex==index?'active':''"
                 @click="change(index)"
                 @mouseup="tabChange(index)"
                 v-for="(item,index) in menu"
                 :key="index">{{item}}
              </a>
            </nav>
            <b class="line" :style="styles"></b>
        </header>
        <!-- 内容区 -->
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
  name: 'Tabs',
  props: {
    defaultActive: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      menu: [],
      activeIndex: 0
    }
  },
  mounted () {
    this.initMenu()
  },
  computed: {
    styles () {
      // 计算tab切换小下划的宽度和放在何地?
      // 左移 视口宽度/tab个数就知道一条线width
      // left左移距离*下表 1，2，3，4 ---- 0左移0px
      const width = window.innerWidth / this.menu.length// width 屏幕视区宽度/menu的个数
      return {
        left: width * this.activeIndex + 'px',
        width: width + 'px'
      }
    }
  },
  methods: {
    initMenu () {
      this.menu = this.$children.map(child => child.label)
      // 默认显示第一个内容
      this.$children[this.activeIndex].isShow = true
    },
    change (ind) {
      this.activeIndex = ind
      // 循环所有的内容，把相同ind改变为true
      this.$children.forEach((child, index) => {
        if (ind === index) {
          this.$children[index].isShow = true
        } else {
          this.$children[index].isShow = false
        }
        // 子传父 emit 事件名
        if (ind === 0) {
          this.$emit('getTab', 2)
        } else {
          this.$emit('getTab', 1)
        }
      })
    },
    tabChange (ind) {
      this.$emit('tabChange', ind)
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs{
  @include wh(100%,auto);
  .tabs-header{
    @include wh(100%,.44rem);
    margin-bottom: .03rem;
    position: sticky;
    background: #fff;
    top: 0;
    nav{
      display:flex;
      justify-content: space-around;
      a{
        text-decoration: none;
        color: #000;
        width: 35%;
        height: .44rem;
        text-align: center;
        line-height: .44rem;
      }
    }
    .line{
      @include wh(auto,.02rem);
      @include posBl(absolute,0,0);
      background: lightcoral;
      transition: left .5s ease;
    }
  }
}
.content{
  margin-bottom: .5rem;
}
// .active{
//   border-bottom: .03rem solid lightcoral;
// }

</style>
