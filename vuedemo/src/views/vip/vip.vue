<template>
  <div class="Member">
    <div class="name">
      <div class="left">
        <dl>
          <dt>
            <img :src="list.avatar" alt="">
          </dt>
          <dd>
            <h3>{{list.nickname}}</h3>
            <div class="number">
              <h4>{{list.integral}}</h4>
              <p>积分</p>
            </div>
          </dd>
        </dl>
      </div>
      <div class="right">
        <p>签到</p>
      </div>
    </div>
    <water></water>
    <div class="interal">
      <div class="order" v-for="(item,index) in data" :key="index">
        <div class="lef">
          <dl>
            <dt>
              <svg-icon :name="item.icons"/>
            </dt>
            <dd>{{item.title}}</dd>
          </dl>
        </div>
        <div class="rig">{{item.angle}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import water from './water/water.vue'
export default {
  data () {
    return {
      data: [
        {
          title: '积分兑换',
          icons: 'gift',
          angle: '>'
        },
        {
          title: '我的订单',
          icons: 'order',
          angle: '>'
        },
        {
          title: '我的二维码',
          icons: 'qrcode',
          angle: '>'
        },
        {
          title: '负责门店',
          icons: 'store',
          angle: '>'
        },
        {
          title: '分享海报',
          icons: 'share',
          angle: '>'
        }
      ]
    }
  },
  components: {
    water
  },
  computed: {
    ...mapState({
      list: state => state.index.list
    })
  },
  methods: {
    ...mapActions({
      getMineData: 'index/getMineData'
    })
  },
  created () {
    this.getMineData()
  }
}
</script>

<style lang='scss' scoped>
.Member {
  @include wh(100%, 100%);
  display: flex;
  flex-direction: column;
}
.name {
  @include wh(100%, 1.1rem);
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fb4544;
}
.left {
  @include wh(50%, auto);
  display: flex;
  color: #fff;
  dl {
    display: flex;
    dt img {
      @include wh(0.5rem, 0.5rem);
      border-radius: 50%;
    }
    dd {
      margin-left: 20px;
      h3 {
        font-size: .16rem;
        font-weight: normal;
      }
      .number {
        display: flex;
        line-height: .3rem;
        h4 {
        font-size: .16rem;
          font-weight: normal;
        }
        p {
          margin-left: 0.04rem;
        }
      }
    }
  }
}
.right {
  p {
    @include wh(40px, 0.2rem);
    border: 1px solid #fff;
    text-align: center;
    line-height: 20px;
    color: #fff;
  }
}
.interal {
  @include wh(100%, auto);
  display: flex;
  flex-direction: column;
  .order {
    @include wh(98%, 50px);
    border-bottom: 1px solid #eee;
    margin-left: 4px;
    display: flex;
    justify-content: space-between;
    padding: 0 0.2rem;
    box-sizing: border-box;
    .lef {
      display: flex;
      line-height: 50px;
      dl {
        display: flex;
        dd {
          margin-left: 0.06rem;
        }
      }
    }
    .rig {
      line-height: 0.05rem;
      margin-right: 0.2rem;
      color: #e6e6e6;
    }
  }
  &:nth-child(5) .order {
    border-bottom: 0;
  }
}

</style>
