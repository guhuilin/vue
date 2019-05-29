<template>
  <div id="app">
    <router-view></router-view>
    <ul class="bottom">
      <li @click="changeTab(item.title)" v-for="(item,index) in list" :key="index">
        <router-link :to="item.toLink">
          <svg-icon :name='activeTab==item.title?item.navimg:item.activeimg' class="imgs"></svg-icon>
          <p :class="activeTab==item.title?'active':''">{{item.title}}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      list: [
        {
          navimg: 'toolbox_active',
          activeimg: 'toolbox',
          title: '育儿助手',
          toLink: '/childrenassistant'
        },
        {
          navimg: 'study_active',
          activeimg: 'study',
          title: '爸妈学医',
          toLink: '/parentleaning'
        },
        {
          navimg: 'ask_active',
          activeimg: 'ask',
          title: '问医生',
          toLink: '/askdoctor'
        },
        {
          navimg: 'mine_active',
          activeimg: 'mine',
          title: '会员中心',
          toLink: '/vip'
        }
      ],
      activeTab: '育儿助手'
    }
  },
  methods: {
    changeTab (item) {
      this.activeTab = item
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.bottom{
  /* @include wh(100%, .5rem); */
  width: 100%;
  height: .5rem;
  border-top: .01rem solid #f7f7f7;
  display: flex;
  position: fixed;
  bottom: 0;
  text-align: center;
  left: 0;
  line-height: .15rem;
  background: #fff;
}
.bottom li{
  /* @include wh(25%, auto); */
  width: 25%;
  height: auto;
}
.imgs{
  /* @include wh(40%, 40%); */
  width: 40%;
  height: 40%;
  margin-top: .04rem;
}
.active{
  color: lightcoral;
}
a{
  text-decoration: none;
  color: #000;
}
a{
  -webkit-tap-highlight-color:rgba(255,0,0,0);
}
.active{
  color: lightcoral!important;
}
</style>
