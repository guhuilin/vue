<template>
    <div class="navlist">
        <dl v-for="(item,index) in navlist" :key="index" @click="changeData(index,item.title)">
            <dt>
                <img class="img" :src="activetitle==item.title?item.hei:item.img">
                <p>{{item.title}}</p>
            </dt>
        </dl>
    </div>
</template>

<script>
export default {
  name: 'navList',
  data () {
    return {
      navlist: [
        {
          img: 'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/fr.png',
          hei:
            'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/fr-active.png',
          title: '发热感冒药'
        },
        {
          img: 'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/gm.png',
          hei:
            'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/gm-active.png',
          title: '过敏药'
        },
        {
          img: 'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/cw.png',
          hei:
            'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/cw-active.png',
          title: '肠胃药'
        },
        {
          img: 'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/ks.png',
          hei:
            'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/ks-active.png',
          title: '咳嗽药'
        },
        {
          img: 'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/yy.png',
          hei:
            'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/yy-active.png',
          title: '营养药'
        },
        {
          img: 'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/wy.png',
          hei:
            'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/wy-active.png',
          title: '外用药'
        },
        {
          img: 'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/qt.png',
          hei:
            'http://qx.dev.iluckybao.com/assets/mobile/img/drugs/qt-active.png',
          title: '其他药物'
        }
      ],
      activetitle: '发热感冒药'
    }
  },
  methods: {
    changeData (index, item) {
      this.activetitle = item
      this.$emit('changeData', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.navlist {
  @include wh(100%, auto);
  @include flex_wrap(flex, wrap);
  background: #fff;
  padding: 0.1rem;
  box-sizing: border-box;
  dl {
    @include wh(25%, auto);
    text-align: center;
    dt {
      @include wh(100%, 100%);
      .img {
        @include wh(0.5rem, 0.5rem);
        margin-left: 0.15rem;
      }
    }
  }
}

</style>
