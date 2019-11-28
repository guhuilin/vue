<template>
  <div class="height1">
    <a-spin :spinning="spinning">
    <div class="height">
      <a-row class="searchDiv">
        <a-col :md="24" :sm="24" offset="6" class="searchInput">
          <a-row style="width:100%;height: 40%;display:flex;flex-direction:column">
            <a-col :md="12" :sm="24" style="height: 100%;">
            <a-input-search
              v-model.trim="keyword"
              placeholder="请输入搜索内容..."
              @search="onSearch"
              enterButton="搜索"
              size="large"
              v-if="hasPerm('query')"
            />
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-checkbox-group :options="plainOptions" v-model="checkVal" @change="onChange" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      
      <div class="searchXxx">
        <div class="left">
          <a-list itemLayout="vertical" size="large" :dataSource="listData">
            <a-list-item slot="renderItem" slot-scope="item" key="item.title">
              <template slot="actions">
                <div style="width:100%;display:flex;justify-content:space-between">
                  <div>
                    <span class="action action1" v-show="item.wangzhan">{{item.wangzhan}}</span>
                    <span class="action action2" v-show="item.type">{{item.type}}</span>
                  </div>
                  <div>{{item.createTime}}</div>
                </div>
              </template>
              <a-list-item-meta :description="item.description">
                <a slot="title" style="color:blue;font-size:14px;text-decoration:underline" :href="item.titleUrl" target="_blank">
                  <span class="hideHtml" v-html="brightenKeyword(item.name, keyword)"></span>
                </a>
                <!-- <span slot="avatar">
                  <img :title="item.img" :src="item.img" alt="">
                </span> -->
                <a-avatar alt="" :src="item.img+'?'+new Date().valueOf()" shape="square" slot="avatar" :size="64" />
              </a-list-item-meta>
              {{item.content}}
            </a-list-item>
            <a-pagination
              class="page"
              :total="total"
              :showTotal="total => `${(pageSize * (page - 1)) + 1}-${total < pageSize ? total : pageSize * page} 共${total}条`"
              :pageSize="pageSize"
              :current="page"
              showQuickJumper
              @change="changePage"
              v-if="listData.length > 0"
            />
          </a-list>
        </div>
        <div class="right">
          <a-row style="height: 54%;background-color: white;margin-top: 1%;padding: 0px 10px 0 15px;">
            <a-row class="newsListTitle">
              <a-col :md="1" :sm="24" class="flagCol">
                <div class="titleFlag"></div>
              </a-col>
              <a-col :md="23" :sm="24" class="flagCol" style="padding-left: 10px;">互联网专题</a-col>
            </a-row>
            <div class="newsList">
              <a-row v-for="(news, index) in newsList" style="height: 24px;" :key="index">
                <a-col :md="1" :sm="24" offset="1" class="flagCol">
                  <div class="titleFlag"></div>
                </a-col>
                <a-col
                  :md="22"
                  :sm="24"
                  class="flagCol"
                ><a :href="news.url" target="_blank" :style="getTitleStyle(index)">{{news.name}}</a></a-col>
              </a-row>
            </div>
          </a-row>
          <a-row style="height: 54%;background-color: white;margin: 6px 0;padding: 0px 10px 0 15px;">
            <a-row class="newsListTitle">
              <a-col :md="1" :sm="24" class="flagCol">
                <div class="titleFlag"></div>
              </a-col>
              <a-col :md="23" :sm="24" class="flagCol" style="padding-left: 10px;">互联网热搜</a-col>
            </a-row>
            <div class="newsList">
              <a-row v-for="(news, index) in newsList1" style="height: 24px;" :key="index">
                <a-col :md="1" :sm="24" offset="1" class="flagCol">
                  <div class="titleFlag"></div>
                </a-col>
                <a-col
                  :md="22"
                  :sm="24"
                  class="flagCol"
                ><a :href="news.url" target="_blank" :style="getTitleStyle(index)">{{news.name}}</a></a-col>
              </a-row>
            </div>
          </a-row>
        </div>
      </div>
    </div>
    </a-spin>
  </div>
</template>

<script>
import { getProgramTypeHotwordTokeyword, queryAllCont, getProgramTypeHotword } from "@api/api";
import { hasPerm } from '@/utils/authFilter'
import More from './components/More'
import Detail from './components/Detail'
import moment from 'moment'


const plainOptions = ['全部','互联网', '微博', '微信','APP']

export default {
  name: "contentConverge",
  data() {
    return {
      plainOptions,
      spinning: true,
      checkVal:[],
      listData:[],
      hotShopList:[],
      newsList:[],
      newsList1:[],
      type: '',
      page: 1,
      total: 0,
      pageSize: 10,
      keyword: "",
    };
  },
  computed: {
    getStyle() {
      return function(val) {
        switch (val) {
          case 0: {
            return "";
          }
          case 1: {
            return "background-color: #f7d934;";
          }
          case 2: {
            return "background-color: #54f734;";
          }
          case 3: {
            return "background-color: #f734f0;";
          }
        }
      };
    },
    getTitleStyle() {
      return function(val) {
        let str = "padding:0 10px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;text-decoration: none;";
        switch (val) {
          case 0: {
            return `${str}color: #5ce887;`;
          }
          case 1: {
            return `${str}color: #ffb142;`;
          }
          case 2: {
            return `${str}color: #2bc8db;`;
          }
          case 3: {
            return `${str}color: #ff33f3;`;
          }
          case 4: {
            return `${str}color: #7b64dd;`;
          }
          case 5: {
            return str;
          }
        }
      };
    }
  },
  created() {
    this.queryAllCont()
    this.getProgramType()
  },
  methods: {
    hasPerm,
    brightenKeyword(val, keyword) {
      val = val + '';
      if (val.indexOf(keyword) !== -1 && keyword !== '') {
            return val.replace(keyword, '<font color="red">' + keyword + '</font>')
      } else {
          return val
        }
    },
    onChange(val) {
      this.checkVal = val
      console.log(val,'val')
    },
    // 请求所有类型
    queryAllCont() {
      let obj = {
        type: this.type,
        keyWord: this.keyword,
        page: this.page-1,
        size: 10
      }
      this.spinning = true
      queryAllCont(obj).then(res => {
        console.log(res,'resres')
        if (res.success) {
          this.spinning = false
          this.listData = res.result.content;
          this.total = res.result.totalElements
        } else {
          this.$message.error(res.message)
        }
      });
    },
    getProgramType() {
      getProgramTypeHotword({type:'web'}).then(res => {
        if(res.success) {
          this.newsList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
      getProgramTypeHotwordTokeyword({type:'web'}).then(res => {
        if(res.success) {
          this.newsList1 = res.result.records
        } else {
          this.$message.error(res.message)
        }
      })
    },
    changePage(page) { // 切换分页
    let arr = []
      this.page = page=1 ? page : page-1;
      let check = this.checkVal.map(item => {
        if(item === '全部') { arr.push(item) } 
        return item === '微博'?'wb':(item === '微信'?'wx':(item === '互联网'?'web':(item==='APP'?'app':'')))
      })
      this.type = arr.length ? '' : check.join(',')
      this.queryAllCont();
    },
    onSearch() {
      let arr = []
      let check = this.checkVal.map(item => {
        if(item === '全部') { arr.push(item) } 
        return item === '微博'?'wb':(item === '微信'?'wx':(item === '互联网'?'web':(item==='APP'?'app':'')))
      })
      this.type = arr.length ? '' : check.join(',')
      this.page = 1;
      this.queryAllCont();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.ant-checkbox-wrapper {
  color:#fff;
}
/deep/.ant-list-item-action > li {
  width: 100%;
  cursor: initial
}
.action {
  padding:2px;
  color:#fff;
  opacity:.5;
  border-radius:3px;
  font-size:12px;
  margin-right:10px;
}
.action1 {
  background:red;
}
.action2 {
  background:blue;
}
.height1 {
  min-height:100%;
}
.height {
  height: 109px; 
  background: #fff;
  .searchDiv {
    height: 25%;
    max-height:130px;
    min-height:120px;
    background-image: url(~@/assets/converge/searchBack.png);
    background-size: 100% 100%; 
    .searchInput {
      display: flex;
      align-items: center;
      height: 100%;
    }
  } 
  .hideHtml {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .searchXxx {
    width: 100%;
    display: flex;
    background-color: white;
    .left {
      width: 70%;
      padding: 15px;
      border-right:2px solid #eee; 
      height: 100%; 
      background-color: white;
    }
    .right {
      width: 30%;
      height: 100%;
      background-color: white;
      margin-top: 1%;
      padding: 0px 10px 0 15px;
    }
  }
  .hotShopTitle {
    height: 100%;
    font-weight: bold;
    padding: 15px;
    background-color: white;
    display: flex;
    align-items: center; 
    .titleFlag {
      height: 17px;
      width: 17px;
      background-color: #3482f7;
      border-radius: 100%;
    }
  } 
  .hotShop {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between; 
    a {
      height: 32%;
      color: white;
      text-decoration: none;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px; 
      cursor: pointer;
      &:first-child {
        width: 59%;
        background-color: #d757b7;
      } 
      &:nth-child(2) {
        width: 39%;
        background-color: #299df5;
      } 
      &:nth-child(3) {
        width: 39%;
        background-color: #299df5;
      } 
      &:nth-child(4) {
        width: 59%;
        background-color: #15c1a3;
      } 
      &:nth-child(5) {
        width: 59%;
        background-color: #15c1a3;
      } 
      &:nth-child(6) {
        width: 39%;
        background-color: #eeda32;
      }
    }
  } 
  .newsListTitle {
    height: 18%;
    font-weight: bold;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8e8e8; 
    .titleFlag {
      height: 17px;
      width: 17px;
      background-color: #f77434;
      border-radius: 100%;
    }
  } 
  .newsList {
    height: 82px; 
    .titleFlag {
      height: 10px;
      width: 10px;
      background-color: #3482f7;
      border-radius: 100%;
    }

  } 
  .flagCol {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>