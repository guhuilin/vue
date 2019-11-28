<template>
  <div class="height1">
    <a-spin :spinning="spinning">
    <div class="height">
      <a-row class="searchDiv">
        <a-col :md="24" :sm="24" offset="5" class="searchInput">
          <a-row style="width:100%;height: 40%;display:flex;flex-direction:column">
            <a-col :md="16" :sm="24" style="height: 100%;">
            <a-input-group :compact="true">
              <a-input style="width: 30%" v-model.trim="keyword" placeholder="请输入搜索内容..."/>
              <a-date-picker
                :disabledDate="disabledStartDate"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                v-model="dateVal.startTime"
                placeholder="开始时间"
                @openChange="handleStartOpenChange"
              />
              <a-date-picker
                :disabledDate="disabledEndDate"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
                v-model="dateVal.endTime"
                :open="endOpen"
                @openChange="handleEndOpenChange"
              />
              <a-button type="primary" @click="onSearch">搜索</a-button>
            </a-input-group>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      
      
      <a-row class="searchBody" style="min-height: 100%;">
        <a-col :md="24" :sm="24" style="min-height: 100%;">
          <a-row style="height: 88%;margin-top: 1%;">
            <a-col :md="24" :sm="24" style="padding: 15px;border-right:2px solid #eee; height: 100%; background-color: white;">
              <a-list itemLayout="vertical" size="large" :dataSource="listData">
                <a-list-item slot="renderItem" slot-scope="item" key="item.title">
                  <template slot="actions">
                    <div style="width:100%;display:flex;justify-content:space-between">
                      <div>
                        <span class="action action1" v-show="item.source">{{item.source}}</span>
                        <span class="action action2" v-show="item.category">{{item.category}}</span>
                      </div>
                      <div>{{item.postdate}}</div>
                    </div>
                  </template>
                  <a-list-item-meta>
                    <div class="txt" slot="title">
                      <a :href="item.url" target="_blank">
                        <span v-html="brightenKeyword(item.title, keyword)" ></span>
                      </a>
                      <p>{{item.content}}</p>
                    </div>
                    <a-avatar alt="" shape="square" slot="avatar" :size="64" :src="item.pic+'?'+new Date().valueOf()" />
                  </a-list-item-meta>
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
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    </a-spin>
  </div>
</template>

<script>
import { queryCrawl } from "@api/api";
import { hasPerm } from '@/utils/authFilter'
import moment from 'moment';


export default {
  name: "contentM",
  data() {
    return {
      dateVal: {
        startTime: null,
        endTime: null
      },
      endOpen: false,
      spinning: false,
      listData:[],
      hotShopList:[],
      page: 1,
      total: 0,
      pageSize: 10,
      keyword: "",
      url: {
        list: '/nmmonitor-server-moduls-elasticsearch/elasticsearch/queryCrawl',
      }
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
    this.queryCrawl()
  },
  methods: {
    hasPerm,
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    disabledStartDate(startTime) {
      const endTime = this.dateVal.endTime;
      if (!startTime || !endTime) {
        return false;
      }
      return startTime.valueOf() > endTime.valueOf();
    },
    disabledEndDate(endTime) {
      const startTime = this.dateVal.startTime;
      if (!endTime || !startTime) {
        return false;
      }
      return startTime.valueOf() >= endTime.valueOf();
    },
    brightenKeyword(val, keyword) {
      val = val + '';
      if (val.indexOf(keyword) !== -1 && keyword !== '') {
            return val.replace(keyword, '<font color="red">' + keyword + '</font>')
      } else {
          return val
        }
    },
    // 请求所有类型
    queryCrawl() {
      let obj = {
        keyWord: this.keyword,
        page: this.page-1,
        size: 10,
        startTime:this.dateVal.startTime ? moment(this.dateVal.startTime).format('YYYY-MM-DD HH:mm:ss'): '',
        endTime: this.dateVal.endTime ? moment(this.dateVal.endTime).format('YYYY-MM-DD HH:mm:ss'): ''
      }
      this.spinning = true
      queryCrawl(obj).then(res => { 
        if (res.success) {
          this.spinning = false
          this.listData = res.result.content;
          this.listData.map(item => {
            item.postdate = moment(item.postdate).format("YYYY-MM-DD HH:mm:ss")
          })
          this.total = res.result.totalElements
        } else {
          this.$message.error(res.message)
        }
      });
    },
    changePage(page) { // 切换分页
      this.page = page=1 ? page : page-1;
      this.queryCrawl();
    },
    onSearch() {
      this.page = 1;
      this.queryCrawl();
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  font-size:14px;
}
a>span {
  text-decoration:underline;
  color:blue;
  font-size:17px;
}
.txt>p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size:15px;
}
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
  .searchBody {
    background: #fff;
    .page {
      margin-top: 10px;
      text-align: center;
    } 
    .listBody {
      height: 100%; 
      .ant-list-item {
        height: 23%; 
        .ant-list-item-meta {
          height: 100%; 
          .ant-list-item-meta-content {
            height: 100%; 
            .ant-list-item-meta-description {
              height: 20%;
            } 
            .ant-list-item-meta-title {
              height: 80%; 
              .flagCol {
                height: 100%;
                display: flex;
                align-items: center;
                .text {
                  height:30px;
                }
              }
            }
          }
        }
      }
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