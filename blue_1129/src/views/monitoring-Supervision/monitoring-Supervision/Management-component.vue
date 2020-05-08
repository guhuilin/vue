<template>
  <!-- 监听监看管理组件 -->
  <div class="management">
    <a-tabs @change="callback">
      <a-tab-pane
        v-for="valueTab in managementHomeTab"
        :tab="valueTab.domainName"
        :key="valueTab.id"
      >
        <!-- {{value}} -->
        <ul class="nav">
          <li v-for="value in reportType">
            <ul class="nav_one">
              <li>{{value.reportTypeName}}</li>
              <li
                class="more"
                @click="fn(value.reportTypeName,value.id,valueTab.domainName,valueTab.id)"
              >更多</li>
            </ul>
            <ul class="nav_two">
              <li class="dataRow"
                @click="goTodetails(valueTab.domainName,valueTab.id,value.reportTypeName,value.id,item.typeName,item.reportTypeId)"
                style="margin:10px 0;white-space: nowrap;text-overflow:ellipsis;overflow: hidden;"
                v-for="item in value.list"
              >
                【{{item.typeName}}】
                {{item.reportName}}
              </li>
            </ul>
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  queryReportDomainSelectList,
  findReportInfo,
  queryReportTypeSelectList,
  querySuspectVideoList
} from "@api/api";
export default {
  data() {
    return {
      name: [],
      managementHomeTab: [],
      typeBox: [],
      reportType: [],
      tabId: null
    };
  },
  computed: {
    ...mapState(["commodity"])
  },
  methods: {
    goTodetails(
      valueTabDomainName,
      valueTabId,
      valueReportTypeName,
      valueId,
      itemTypeName,
      itemReportTypeId
    ) {
      this.$router.push({
        path: "/managementDetails",
        query: {
          // tab栏的内容和ID(2)
          valueTabDomainName: valueTabDomainName,
          valueTabId: valueTabId,
          // 框中的表头的内容和ID(2)
          valueReportTypeName: valueReportTypeName,
          valueId: valueId,
          // 框中的每一条数据的内容和ID(2)
          itemTypeName: itemTypeName,
          itemReportTypeId: itemReportTypeId,
          name: name,
          management: this.name
        }
      });
    },
    fn(name, id, tabName, tabId) {
      this.$router.push({
        path: "/managementDetails",
        query: {
          valueTabDomainName: tabName,
          valueTabId: tabId,
          valueReportTypeName: name,
          valueId: id,
          management: this.name
        }
      });
    },
    callback(key) {
      this.tabId = key;
      this.get();
      // this.getManagementSelectList()
    },
    // 获取管理的tab切换
    getManagementTab() {
      queryReportDomainSelectList({}).then(res => {
        // console.log(res, "获取管理的tab切换");
        this.managementHomeTab = res.result;
        this.tabId = res.result[0].id;
        this.get();
        if (res.success) {
        } else {
          console.log(res.message);
        }
      });
    },
    get() {
      // console.log(this.tabId, "我是id");
      findReportInfo({
        domainTypeId: this.tabId
      }).then(res => {
        this.reportType = res.result;
        // console.log(reportType)
        // console.log(res, "我是每一个框");
      });
    }
  },
  created() {
    // 再页面加载的时候调取数据（tab，表头，表头下面的数据）
    this.getManagementTab();
    // this.getManagementSelectList();
  },
  mounted() {
    for (var i = 0; i < this.$store.getters.permissionList.length; i++) {
      this.name = this.$router.currentRoute.meta.title;
    }
  }
};
</script>
<style scoped>
    * {
        margin: 0;
        padding: 0;
        list-style: none;
        text-decoration: none;
    }
    >>> .ant-tabs-nav .ant-tabs-tab:hover {
        color: #fff;
    }
    >>> .ant-tabs .ant-tabs-top-content > .ant-tabs-tabpane-inactive,
    .ant-tabs .ant-tabs-bottom-content > .ant-tabs-tabpane-inactive {
        opacity: 1 !important;
    }
    >>> .ant-tabs-nav .ant-tabs-tab-active {
        color: #fff;
    }
    >>> .ant-tabs-tabpane-active {
        margin-left: 20px;
    }
    .nav_two {
        margin-left: 20px;
        font-size: 15px;
    }
    .nav .nav_one li:nth-child(1) {
        float: left;
        font-size: 20px;
        margin-left: 20px;
        line-height: 50px;
    }
    .nav .nav_one li:nth-child(2) {
        float: right;
    }
    .more {
        width: 62px;
        height: 24px;
        border-radius: 15px;
        border: 1px solid #8593fc;
        text-align: center;
        line-height: 24px;
        color: #8593fc;
        margin-top: 11.5px;
    }
    .more:hover{
      cursor: pointer;
    }
    .nav > li {
        width: 400px;
        height: 200px;
        border: 1px solid black;
        margin-right: 25px;
        margin-top: 30px;
        float: left;
    }
    .nav > li:hover {
        /* cursor: pointer; */
        background: #8593fc;
        color: #fff;
        border: 1px solid #8593fc;
    }
    .nav > li:hover .more {
        border-color: #fff;
        color: #fff;
    }
    .nav .nav_one {
        margin: 5px 0;
        width: 380px;
        height: 50px;
        margin-top: 29px;
    }

    .ant-tabs-nav {
        height: 118px;
    }
    >>> .ant-tabs-nav div > div {
        height: 128px;
        width: 248px;
        margin: 0;
        text-align: left;
        padding-left: 80px;
        padding-top: 48px;
    }
    >>> .ant-tabs-nav div div:nth-child(1) {
        background: url("../../../assets/tab.png") no-repeat;
    }
    >>> .ant-tabs-nav div div:nth-child(2) {
        background: url("../../../assets/tab1.png") no-repeat;
    }
    >>> .ant-tabs-nav div div:nth-child(3) {
        background: url("../../../assets/tab2.png") no-repeat;
    }
    >>> .ant-tabs-nav div div:nth-child(4) {
        background: url("../../../assets/tab3.png") no-repeat;
    }
    >>> .ant-tabs-nav div div:nth-child(5) {
        background: url("../../../assets/tab.png") no-repeat;
    }
    >>> .ant-tabs-nav-scroll {
        overflow: visible;
    }
    >>> .ant-tabs-nav-wrap {
        overflow: visible;
        border: 0;
        margin-bottom: 0;
    }
    >>> .ant-tabs-nav-container {
        width: 100%;
        margin: 0;
        overflow: visible;
    }
    >>> .ant-tabs-bar {
        color: #fff;
    }
    >>>.dataRow:hover{
      cursor: pointer;
    }
    >>>.ant-tabs-ink-bar{
      width:240px !important;
    }
</style>

