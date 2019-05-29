<template>
    <div class="search">
        <span>©</span>
        <input type="text" placeholder="查询药品" v-model="searchData">
        <!-- @click="getListd"  -->
        <span @click="getListd" :class="searchData==''?'search':'seachactive'">搜索</span>
    </div>
</template>

<script>
export default {
  name: 'searchBar',
  data () {
    return {
      searchData: ''
    }
  },
  watch: {
    searchData (newval, oldval) {
      this.searchData = newval
    }
  },
  methods: {
    getListd () {
      this.$emit('searchData', this.searchData)
    }
  }
}
</script>

<style lang="scss" scoped>.search {
  @include wh(80%, 0.3rem);
  @include marginTrbl(0.1rem, auto, 0.1rem, auto);
  border-radius: 0.3rem;
  border: 0.01rem solid #eee;
  line-height: 0.3rem;
  color: #ccc;
  display: flex;
  span {
    text-align: center;
    width: 15%;
  }
  .search {
    @include wh(20%, 0.22rem);
    @include marginTrbl(0.04rem, 0.04rem, 0, 0);
    background: #eee;
    color: #fff;
    border-radius: 0.1rem;
    line-height: 0.22rem;
    text-indent: 1.1em;
  }
  .seachactive {
    @include wh(20%, auto);
    @include marginTrbl(0.04rem, 0.04rem, 0, 0);
    background: $color-base;
    color: #fff;
    border-radius: 0.1rem;
    line-height: 0.22rem;
    text-align: center;
  }
  input {
    @include wh(65%, auto);
    border: none;
    outline: none;
  }
}
</style>
