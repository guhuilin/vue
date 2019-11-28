<template>
  <div class="stepJudge" style="background:#fff;padding:20px;">
    <a-tabs @prevClick="callback" @nextClick="callback" @change="changeTab" v-if="!showTable">
      <a-tab-pane v-for="item in tabMenu" :tab="item.domainName" :key="item.id">
        <div style="width:100%;height:100%;display:flex;flex-wrap:wrap">
          <div class="box gplus" v-for="(item,key) in tabList" :key="key">
            <div class="boxTitle">
              <b>{{item.typeName}}</b><a href="#" style="font-size:14px;">更多<a-icon type="right" /></a> 
            </div>
            <ul class="ul" style="list-style:none;padding:0">
              <li v-for="(val,ind) in item.list" :key="ind">【{{val.typeName}}】<span @click="goTable(val.typeName)">{{val.reportName}}</span></li>
            </ul>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <judgeAll :showTable="showTable" :showType="showType" />
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin"
// import Stable from './monitoring-Supervision/stepJudge-table'
import judgeAll from './judgeAll'
import { queryMonitorManage, ReportDomainSelectList, queryReportInstanceBean } from '@api/api'

export default {
	name: 'judgeAllDispose',
	mixins: [JeecgListMixin],
	components: { judgeAll },
  data() {
    return {
      tabList: [],
      showTable: false,
      showType: '',
      tabMenu: [],
			url: {
					list: ''
			},
    };
  },
  created() {
    this.getMethods()
    this.changeTab(1)
  },
  methods: {
    changeTab(key) {
      queryMonitorManage({domainTypeId:key}).then(res => {
          console.log(res,'tabList')
        this.tabList = res.result
      })
    },
    callback (val) {},
    getMethods() {
      ReportDomainSelectList().then(res => {
        this.tabMenu = res.result
      })
    },
    goTable(type) {
      switch(type) {
        case '常规任务': {
          this.showType = 'groove'
          this.showTable = true
          break;
        };
        case '应急报告': {
          this.showType = 'emergent'
          this.showTable = true
          break;
        };
        case '专项报告': {
          this.showType = 'special'
          this.showTable = true
          break;
        };
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.stepJudge {
  width: 100%;
  min-height:100%;
  background: #fff;
}
/deep/.ant-tabs-tab {
  width: 150px;
  color:#fff;
}
/deep/.ant-tabs-nav .ant-tabs-tab:nth-child(1) {
  background: url("../../assets/tab2.png") no-repeat;
}
/deep/.ant-tabs-nav .ant-tabs-tab:nth-child(2) {
  background: url("../../assets/tab1.png") no-repeat;
}
/deep/.ant-tabs-nav .ant-tabs-tab:nth-child(3) {
  background: url("../../assets/tab.png") no-repeat;
}
/deep/.ant-tabs-nav .ant-tabs-tab:nth-child(4) {
  background: url("../../assets/tab3.png") no-repeat;
}
/deep/.ant-tabs-nav .ant-tabs-tab:nth-child(5) {
  background: url("../../assets/tab1.png") no-repeat;
}
/deep/.ant-tabs-nav div > div {
  height: 128px;
  width: 248px;
  margin: 0;
  text-align: left;
  padding-left: 80px;
  padding-top: 48px;
}
.box {
    height: 150px;
    width: 300px;
    border-radius:4px;
    margin:20px;
    box-shadow: 10px 10px 10px 0px rgba(0, 128, 0, 0.2);
    position: relative;
    border:1px solid #ccc;
}
.gplus {
    z-index: 1;
    right: 15px;
    bottom: 15px;
    left:14px;
}
.boxTitle {
  height:40px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:5px;
  font-size:18px;
}
.ul>li {
  height:30px;
  display:flex;
  align-items:center;
  span {
    cursor: pointer;
  }
  span:hover {
    color:#999;
  }
}
</style>