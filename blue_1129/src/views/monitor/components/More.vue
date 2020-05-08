<template>
  <div class="more" style="background:#fff;width:100%;height:100%">
    <!-- 搜索 -->
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
		<a-row class="topTitle">
			<a-col :md="2" :sm="24" class="flagCol">
				<span>序列</span>
			</a-col>
			<a-col :md="19" :sm="24" class="flagCol">
				<span>名称</span>
			</a-col>
			<a-col :md="3" :sm="24" class="flagCol" style="text-align:center">
				<span>节目数</span>
			</a-col>
		</a-row>
    <a-list itemLayout="horizontal" :dataSource="list" class="listBody">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta style>
          <span slot="title" style="height: 50%;">
            <a-row style="height: 100%;min-width:500px">
              <a-col :md="2" :sm="24" class="flagCol">
                <div class="num">{{item.id}}</div>
              </a-col>
              <a-col :md="19" :sm="24" class="flagCol">
                <a :href="item.url" target="_blank">{{item.name?item.name:'未命名'}}</a>
              </a-col>
              <a-col :md="3" :sm="24" class="flagCol">
                <span class="ranking">{{item.sum}}</span>
              </a-col>
            </a-row>
          </span>
        </a-list-item-meta>
      </a-list-item>
      <a-pagination
        class="page"
        :total="total"
        :showTotal="total => `${(pageSize * (page - 1)) + 1}-${total < pageSize ? total : pageSize * page} 共${total}条`"
        :pageSize="pageSize"
        :defaultCurrent="page"
        showQuickJumper
        @change="changePage"
        v-if="list.length > 0"
      />
    </a-list>
		<div class="goBack" style="height:30px;margin-left:10px;"><a-button @click="goBack" type="primary">返回</a-button></div>
  </div>
</template>

<script>
import { getProgramTypeHotwordTokeyword } from "@api/api";
import { hasPerm } from "@/utils/authFilter";

export default {
  name: "More",
  data() {
    return {
      keyword: "",
      page: 1,
      total: 11,
      pageSize: 10,
      typeName: "",
      list: []
    };
  },
  created() {
    this.getProgramTypeHotwordTokeyword();
  },
  methods: {
		hasPerm,
		goBack() {
			this.$emit('close',true);
		},
    onSearch() {
      let obj = {
        keyword: this.keyword,
        pageNo: this.page,
        pageSize: 4
      };
      this.getProgramTypeHotwordTokeyword(obj);
    },
    changePage(page) {
      this.page = page;
      let obj = {
        keyword: this.keyword,
        pageNo: this.page,
        pageSize: this.pageSize
      };
      this.getProgramTypeHotwordTokeyword(obj);
    },
    // 请求所有类型
    getProgramTypeHotwordTokeyword() {
      let obj = {
        keyword: this.keyword,
        pageNo: this.page,
        pageSize: this.pageSize
      };
      getProgramTypeHotwordTokeyword(obj).then(res => {
        if (res.success) {
          this.list = res.result.records;
          this.total = res.result.total;
        } else {
          console.log(res.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.more {
  width: 100%;
	position: relative;
  .searchDiv {
    height: 16%;
    background-image: url(~@/assets/converge/searchBack.png);
    background-size: 100% 100%;
    .searchInput {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
  .page {
    margin-top: 12px;
  }
	.goBack {
		position: absolute;
		bottom:15px;
		left: 0;
	}
	.topTitle {
		width: 100%;
		height: 30px;
		display: flex;
		align-items: center;
	}
  .listBody {
    height: 80%;
    text-align: center;
    .ant-list-item {
      height: 38px;
      border-bottom: 1px dashed #ccc;
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
              .num {
                height: 11px;
                padding:0 2px;
                color: #fff;
                text-align: center;
                display: inline;
                font-size: 10px;
                line-height: 10px;
                background: #c0c1c3;
                border: 1px solid #acaeb2;
                margin: 0 20px 0 10px;
              }
              .title {
                flex: 1;
              }
              .ranking {
                width: 100px;
                flex-shrink: 0;
              }
              .listFlag {
                height: 21px;
                width: 21px;
                border-radius: 7px;
              }
              .text {
                height: 30px;
              }
            }
          }
        }
      }
    }
  }
  .topTitle {
    width: 100%;
    height: 30px;
    display: flex;
    line-height: 34px;
    color: #777;
    background: #f7f7f7;
    padding-left: 10px;
  }
}
</style>