<template>
  <div class="wrap">
    <!-- searchbar -->
    <searchBar @searchData="searchData"></searchBar>
    <!-- nav -->
    <navList @changeData="changeData"></navList>

    <!-- product list -->
    <div style="text-align:center" v-if="datalist.length==0?true:false">正在加载ing...</div>
    <div class="product">
      <scroll-view @on-scroll-bottom="scrollBottom" :flg="scrollFlg">
        <router-link
          tag="dl"
          :to="`/detail/${item.medicine_id}`"
          v-for="(item,index) in datalist"
          :key="index"
        >
        <project :pic="item.picture" :proTitle="item.product_name" :describe="item.specification"></project>
        </router-link>
      </scroll-view>
    </div>
  </div>
</template>
<script>
import navList from './components/navList.vue'
import searchBar from './components/searchBar.vue'
import project from '@/components/project/project.vue'
export default {
  data () {
    return {
      datalist: [],
      scrollFlg: true,
      limit: 5
    }
  },
  components: {
    project,
    navList,
    searchBar
  },
  methods: {
    getdata () {
      this.api.api
        .medicine({
          category_name: this.activetitle,
          limit: this.limit
        })
        .then(res => {
          this.datalist = this.datalist.concat(res.data)
          this.scrollFlg = true
        })
    },
    changeData (item) {
      // console.log(item, 'item')
      // 点击切换数据
      this.limit = 5
      this.activetitle = item
      this.getdata()
      this.datalist = []
    },
    scrollBottom () {
      this.limit += 5
      this.getdata()
      this.scrollFlg = false
    },
    searchData (val) {
      let data = this.datalist.filter((ele, ind) => {
        return ele.product_name.includes(val)
      })
      this.datalist = data
      // console.log(data)
    }
  },
  created () {
    this.getdata()
  }
}
</script>

<style lang="scss" scoped>

.product {
  @include wh(100%, auto);
  background: #fff;
  padding-top: 0.1rem;
  margin-bottom: .5rem;
  dl {
    @include wh(90%, 0.9rem);

    border-bottom: 0.01rem solid #eee;
    display: flex;
    margin: 0 auto;
    dt {
      @include wh(30%, auto);
      img {
        @include wh(80%, 0.05rem);
      }
    }
    dd {
      @include wh(70%, auto);
      line-height: 0.3rem;
      .span1 {
        font-size: 0.14rem;
      }
      .p2 {
        @include aline();
      }
      .span2 {
        @include cen(0.4rem, 0.2rem);
        border: 0.02rem solid $color-base;
        display: inline-block;
        border-radius: 0.2rem;
        color: $color-base;
      }
    }
  }
}
</style>
