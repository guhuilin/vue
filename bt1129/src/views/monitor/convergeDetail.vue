<template>
  <div class="height">
    <div class="height" v-if="!show">
      <a-row class="searchDiv">
        <a-col :md="12" :sm="24" offset="6" class="searchInput">
          <a-input-search
            v-model="keyword"
            placeholder="请输入搜索内容..."
            @search="onSearch"
            enterButton="搜索"
            size="large"
            v-if="hasPerm('query')"
          />
        </a-col>
      </a-row>

      <a-row class="searchBody">
        <a-col :md="24" :sm="24" style="height: 100%;">
          <a-row style="height: 11%;">
            <a-col :md="16" :sm="24" style="height: 100%;">
              <a-tabs
                defaultActiveKey="1"
                style="height: 100%;background-color: white;"
                @change="changeTab"
              >
                <a-tab-pane v-for="type in typeList" :tab="type" :key="type"></a-tab-pane>
              </a-tabs>
            </a-col>

            <a-col :md="8" :sm="24" style="padding: 0px 10px 0 15px; height: 100%;">
              <a-row class="hotShopTitle">
                <a-col :md="1" :sm="24" class="flagCol">
                  <div class="titleFlag"></div>
                </a-col>
                <a-col :md="23" :sm="24" class="flagCol" style="padding-left: 10px;display:flex;justify-content:space-between">
                  <span>专题列表</span><span @click="goDetail('More')" style="color:skyblue;cursor:pointer">更多</span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>

          <a-row style="height: 88%;margin-top: 1%;">
            <a-col :md="16" :sm="24" style="padding: 15px; height: 100%; background-color: white;">
              <a-list itemLayout="horizontal" :dataSource="listData" class="listBody">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta :description="item.album">
                    <span slot="title" style="height: 50%;">
                      <a-row style="height: 100%;">
                        <a-col :md="2" :sm="24" class="flagCol">
                          <div class="listFlag" :style="getStyle(index)"></div>
                        </a-col>
                        <a-col :md="22" :sm="24" class="flagCol">
                          <a :href="item.programurl" target="_blank">{{item.programname}}</a>
                        </a-col>
                      </a-row>
                    </span>
                  </a-list-item-meta>
                  <div style="margin-top: 17%;">{{item.postdate}}</div>
                </a-list-item>
                <a-pagination
                  class="page"
                  :total="total"
                  :showTotal="total => `${(pageSize * (page - 1)) + 1}-${total < pageSize ? total : pageSize * page} 共${total}条`"
                  :pageSize="pageSize"
                  :current="page"
                  :loading="loading"
                  showQuickJumper
                  @change="changePage"
                  v-if="listData.length > 0"
                />
              </a-list>
            </a-col>
            <a-col :md="8" :sm="24" style="padding: 0px 10px 0 15px; height: 100%;">
              <a-row style="height: 45%;">
                <div class="hotShop">
                  <a :href="hot.url" target="_blank" v-for="(hot,ind) in hotShopList" :key="ind">{{hot.name}}</a>
                </div>
              </a-row>

              <a-row
                style="height: 54%;background-color: white;margin-top: 1%;padding: 0px 10px 0 15px;"
              >
                <a-row class="newsListTitle">
                  <a-col :md="1" :sm="24" class="flagCol">
                    <div class="titleFlag"></div>
                  </a-col>
                  <a-col :md="23" :sm="24" class="flagCol" style="padding-left: 10px;">热搜列表</a-col>
                </a-row>
                <div class="newsList">
                  <a-row v-for="(news, index) in newsList" style="height: 15%;" :key="index">
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
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <component v-if="show" @close="close" :is="pageType"></component>
  </div>
</template>

<script>
import { getProgramTypeList, getProgramInfoList, getProgramTypeHitShow, getProgramTypeHotword } from "@api/api";
import { hasPerm } from '@/utils/authFilter'
import More from './components/More'
import Detail from './components/Detail'

export default {
  name: "contentConverge",
  components: {
    More,
    Detail
  },
  watch: {
    page(newPage) {
      return this.page = newPage
    }
  },
  data() {
    return {
      show:false,
      pageType: 'Detail',
      page: 1,
      total: 0,
      pageSize: 4,
      typeName: "",
      keyword: "",
      loading: true,
    };
  },
  watch: {
    typeList(newVal) {
      console.log(11111)
      // this.loading = true;
      // console.log(newVal,this.typeList,this.listData,this.hotShopList,this.newsList,'newVsal')
      // this.loading = false;
    }
  },
  props: {
    typeList: {
      type: Array,
      default: []
    },
    listData: {
      type: Array,
      default: []
    },
    hotShopList: {
      type: Array,
      default: []
    },
    newsList: {
      type: Array,
      default: []
    }
  },
  computed: {
    getStyle() {
      return function(val) {
        switch (val) {
          case 0: {
            return "background-color: #00aeef;";
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
  methods: {
    hasPerm,
    goDetail(type) {
      this.pageType = type;
      this.show = true;
    },
    close() {
      this.show = false;
    },
    // 请求所有类型
    getProgramTypeList() {
      getProgramTypeList({}).then(res => {
        if (res.success) {
          this.typeList = res.result;
          this.typeName = this.typeList[0];
          this.getProgramInfoList(1, 5);
        } else {
          console.log(res.message);
        }
      });
    },
    // 专题列表
    async getProgramTypeHitShow() {
      await getProgramTypeHitShow({}).then(res => {
        if (res.success) {
          this.hotShopList = res.result
        } else {
          console.log(res.message);
        }
      });
    },
    // 热搜列表
    getProgramTypeHotword() {
      getProgramTypeHotword({}).then(res => {
        if (res.success) {
          this.newsList = res.result
        } else {
          console.log(res.message);
        }
      });
    },

    // 信息列表
    getProgramInfoList() {
      let obj = {
        typeName: this.typeName,
        keyword: this.keyword,
        page: this.page-1,
        size: this.pageSize
      };

      getProgramInfoList(obj).then(res => {
        if (res.success) {
          this.listData = res.result.records;
          this.total = res.result.total;
        } else {
          console.log(res.message);
        }
      });
    },
    changeTab(val) {
      this.typeName = val;
      this.page = 1;
      // this.getProgramInfoList();
    },
    changePage(page) { // 切换分页
      this.page = page;
      // this.getProgramInfoList();
    },
    onSearch() {
      this.page = 1;
      // this.getProgramInfoList();
    }
  }
};
</script>

<style lang="scss" scoped>
.height {
  height: 100%; 
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
    height: 75%; 
    .page {
      margin-top: 10px;
      text-align: center;
    } 
    .listBody {
      height: 100%; 
      .ant-list-item {
        height: 13%; 
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
                .listFlag {
                  height: 21px;
                  width: 21px;
                  border-radius: 7px;
                }
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
    height: 82%; 
    .titleFlag {
      height: 10px;
      width: 10px;
      background-color: #3482f7;
      border-radius: 100%;
    }

    /*&:first-child {*/
    /*  color: #5ce887;*/
    /*}*/
    /*&:nth-child(2) {*/
    /*  color: #ffb142;*/
    /*}*/
    /*&:nth-child(3) {*/
    /*  color: #2bc8db;*/
    /*}*/
    /*&:nth-child(4) {*/
    /*  color: #ff33f3;*/
    /*}*/
    /*&:nth-child(5) {*/
    /*  color: #7b64dd;*/
    /*}*/
  } 
  .flagCol {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>