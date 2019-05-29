<template>
  <div class="wrap">
    <ul class="list">
      <router-link tag="li" :to="item.toLink" v-for="(item,index) in list" :key="index">
        <p :style="{background: item.color}" class="img1">
          <svg-icon :name="item.img" class="svgs"></svg-icon>
        </p>
        <p>{{item.title}}</p>
      </router-link>
    </ul>
    <!-- <m-button type='success' size='mini' icon="dianpu">哈哈</m-button> -->
    <!-- 精彩文章 安全用药 -->
    <scroll-view @on-scroll-bottom="scrollBottom" :flg="scrollFlg">
      <tabs v-on:getTab="getTab">
        <tab-pane label="精彩文章">
          <!-- :pic="item.picture" :proTitle="item.product_name" :describe="item.specification" -->
          <project v-for="(item,index) in alldata" :key="index" :pic="item.cover" :contentid="item.content_id" :proTitle="item.title" :describe="item.description" :times="item.updated_at"></project>
        </tab-pane>
        <tab-pane label="安全用药">
          <project v-for="(item,index) in alldata" :key="index" :pic="item.cover" :contentid="item.content_id" :proTitle="item.title" :describe="item.description" :times="item.created_at"></project>
        </tab-pane>
      </tabs>
    </scroll-view>
  </div>
</template>

<script>
import project from '@/components/project/project.vue'
import { Tabs, TabPane } from '@/components/tabbar/index.js'
// import BScroll from 'better-scroll'
export default {
  data () {
    return {
      alldata: [],
      dataDemo: [],
      offset: 0,
      scrollFlg: true,
      list: [
        {
          img: 'yaoxiang',
          title: '儿童药箱',
          color: '#FEB235',
          toLink: '/childrentool'
        },
        {
          img: 'dianpu',
          title: '附近药店',
          color: '#C762E2',
          toLink: '/nearStore'
        },
        {
          img: 'bulb',
          title: '智能医生',
          color: '#FE6488',
          toLink: '/clearDoctor'
        }
      ]
    }
  },
  components: {
    project,
    Tabs,
    TabPane
  },
  methods: {
    getData (type = 2) {
      this.api.api
        .list({
          limit: 15,
          offset: this.offset * 15,
          type_id: type
        })
        .then(res => {
          this.alldata = this.alldata.concat(res.data)
          this.scrollFlg = true
        })
    },
    getTab (type) {
      this.offset = 0
      this.getData(type)
      this.alldata = []
    },
    scrollBottom () {
      this.scrollFlg = false
      this.offset += 1
      this.getData()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang='scss' scoped>
.list {
  @include wh(100%, auto);
  background: #fff;
  display: flex;
  li {
    @include wh(33.3%, auto);
    text-align: center;
    p {
      line-height: 0.2rem;
    }
    .img1 {
      @include wh(0.5rem, 0.5rem);
      @include marginTrbl(0.15rem, 0, 0, 0.27rem);
      border-radius: 50%;
      overflow: hidden;
      .svgs {
        @include marginTrbl(0.15rem, 0, 0, 0);
      }
    }
  }
}
.tobottom {
  @include wh(100%, auto);
}
.fathers {
  @include wh(100%, 4rem);
  background: #fff;
  overflow: auto;
  .little {
    @include wh(100%, auto);
    .top {
      @include wh(100%, 0.3rem);
      @include posTl(fixed, -0.3rem, 0);
      text-align: center;
    }
    .bot {
      @include wh(100%, 0.3rem);
      @include posBl(fixed, -0.3rem, 0);
      text-align: center;
    }
  }
}
</style>
