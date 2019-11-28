<template>
  <div style="padding:0px;background:#fff;min-height:100%">
    <div>
      <div class="table-page-header-submitButtons-back">
        <span style="font-size:17px">分层研判 / 研判三级</span>
        <a @click="back" style="color:#1f2438;font-size:17px;">
          <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
        </a>
      </div>
      <div style="height:50px;display:flex;justify-content:space-between">
        <div style="height:50px;display:flex;">
          <a-button style="margin-right:20px;" :class="changeClass === 0 ? 'ant-btn-primary' : 'ant-btn-default'" class="searchBtn" @click="judgeNo">未处理</a-button>
          <a-button class="searchBtn" :class="changeClass === 1 ? 'ant-btn-primary' : 'ant-btn-default'" @click="judgeDispose">已处理</a-button>
        </div>
        <div>
          <a-button class="searchBtn" type="primary" @click="explain">任务说明</a-button>
        </div>
      </div>
    </div>
    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col :md="6" :sm="6">
          <a-form-item label="节目名称">
            <a-input style="width:150px;" placeholder="请输入..." v-model="queryParam.name"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="7" :sm="6">
          <a-form-item label="首次发现网站">
            <a-input style="width:150px;" placeholder="请输入..." v-model="queryParam.source"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="6">
          <a-form-item label="状态">
            <a-select placeholder="请选择..." style="width:150px;"  v-model="queryParam.status">
              <a-select-option :value="0">无状态</a-select-option>
              <a-select-option :value="1">违规</a-select-option>
              <a-select-option :value="2">不违规</a-select-option>
              <a-select-option :value="3">以使用</a-select-option>
            </a-select>
            <!-- <a-input style="width:150px;" placeholder="请输入..." v-model="queryParam.status"></a-input> -->
          </a-form-item>
        </a-col>
        <a-col :md="5" :sm="6">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button class="searchBtn" type="primary" @click="search" icon="search">查询</a-button>
            <a-button @click="reset" icon="reload" style="margin-left: 8px">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <a-divider />
    <div>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        width="100%"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="tableChange"
      >
        <div class="geturl" style="width:100%" slot="pName" slot-scope="pName, record">
          <span :title="record.name">{{record.name}}</span>
        </div>
        <div class="geturl" slot="newEvid" slot-scope="newEvid, record"> 
          <a :href="record.newEvidenceVideoName" :title="record.newEvidenceVideoName" target="_blank">{{record.newEvidenceVideoName ? record.newEvidenceVideoName : '--'}}</a>
        </div>
        <div class="getCategory" slot="category" slot-scope="category, record">
          <span :title="record.categoryKey">{{record.categoryKey}}</span>
        </div>
        <div class="geturl" slot="linkUrl" slot-scope="linkUrl, record">
          <a :href="record.programUrl" :title="record.programUrl" target="_blank">{{record.programUrl}}</a>
        </div>
        <span slot="action" slot-scope="action, record" v-if="showing">
          <a-button @click="view(record)">综合研判</a-button>
          <a-divider type="vertical" />
          <!--  v-if="hasPerm('enable')" -->
          <a-button @click="setNormal(record)">设为正常</a-button>
        </span>
        <span v-else>
          <a-button @click="lookShow(record,'3')">查看</a-button>
        </span>
      </a-table>
    </div>
    <stepJudgeDivView3 ref="stepJudgeDivView3" />
    <!-- <step-judge-modal :show="flag" @close="close" :reportTemplateId="reportTemplateId" :defaultId="'3'" :item="item" :title="title" :itemList="itemList" /> -->
  </div>
</template>

<script>
import {
  updateSus,
  queryPorgramVideozerothree,
  queryAuditVideoHis
} from "@api/api";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { hasPerm } from "@/utils/authFilter";
// import stepJudgeModal from "./stepJudge-Modal";
import stepJudgeDivView3 from "./stepJudgeDivView3";
import Vue from 'vue'
import { USER_INFO } from "@/store/mutation-types"

export default {
  name: "Stab",
  mixins: [JeecgListMixin],
  components: {
    // stepJudgeModal,
    stepJudgeDivView3
  },
  data() {
    return {
      flag: false,
      showing: true,
      dataSource: [],
      item: {},
      changeClass: 0,
      itemList: "",
      title: "",
      queryParam: {
        name: "",
        programUrl: "",
        status: ""
      },
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      columns: [
        {
          title: "节目名称",
          align: "center",
          // width: 100,
          dataIndex: "name",
          // scopedSlots: { customRender: "pName" },
        },
        {
          title: "首次发现网站",
          align: "center",
          // width: '10%',
          dataIndex: "source",
        },
        {
          title: "原片视频",
          align: "center",
          // width: '10%',
          dataIndex: "newEvidenceVideoName",
          scopedSlots: { customRender: "newEvid" },
        },
        {
          title: "链接地址",
          align: "center",
          // width: '10%',
          dataIndex: "programUrl",
          scopedSlots: { customRender: "linkUrl" },
        },
        {
          title: "节目简介",
          align: "center",
          // width: '10%',
          dataIndex: "categoryKey",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "状态",
          align: "center",
          // width: '10%',
          dataIndex: "status",
          customRender: function (t, r, index) {
            switch(t) {
              case 0: {
                return '无状态'
              };
              case 1: {
                return '违规'
              };
              case 2: {
                return '不违规'
              };
              case 3: {
                return '已使用'
              };
              default: {
                return '--'
              }
            }
          }
        },
        {
          title: "节目来源",
          align: "center",
          // width: '10%',
          dataIndex: "programSource"
        },
        {
          title: "备注",
          align: "center",
          // width: '10%',
          dataIndex: "auditAdvice",
          customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
          width:'24%'
        }
      ],
      url: {
        list:
          "/nmmonitor-server-module-Judgements/Judgements/queryPorgramVideothree",
        delete:
          "/nmmonitor-server-module-Judgements/Judgements/deleteSuspectProgram"
      }
    };
  },
  props: {
    reportTemplateId: {
      default: 1,
      type: Number
    },
    propData: {
      default: () => {},
      type: Object
    }
  },
  watch: {
    defaultId(newVal) {
      this.checkData('3',{})
    },
    reportTemplateId(newVal) {
      console.log(newVal,'reportTemplateId')
    },
    flag(newVal) { },
  },
  created () {
    this.queryParam.bisType = window.localStorage.getItem('bisType')
    this.queryParam.domType = window.localStorage.getItem('domType')
  },
  mounted() {
    this.queryParam.bisType = window.localStorage.getItem('bisType')
    this.queryParam.domType = window.localStorage.getItem('domType')
    // this.loadData();
  },
  methods: {
    hasPerm,
    search() { 
      if(this.changeClass === 0) { 
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryPorgramVideothree"
      } else {
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryAuditVideoHisonone"
      }
      this.queryParam.bisType = this.propData.taskBusiness
      this.queryParam.domType = this.propData.taskDomain
      this.queryParam.auditLevel = 3
      this.ipagination.current = 1;
      this.loadData(1);
    },
    back() {
      this.showing = true;
      // this.$router.push('/monitoring-Supervision/judge')
      this.$emit("show", '')
    },
    judgeNo() {
      this.showing = true;
      this.ipagination.current = 1;
      this.queryParam = {}
      this.changeClass = 0
      this.checkData('3',{})
    },
    judgeDispose() { 
      this.showing = false;
      this.ipagination.current = 1;
      this.queryParam = {}
      this.changeClass = 1
      this.loading = true;
      let query = {
        pageSize: 10,
        pageNo: 1,
        auditLevel:3
      }
      query.username = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName))
      query.bisType = this.propData.taskBusiness
      query.domType = this.propData.taskDomain
      queryAuditVideoHis(query).then(res => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
          this.loading = false;
        }
      })
    },
    tableChange(pagination, filters, sorter) {
      this.ipagination = pagination;
      if(this.changeClass === 0) { 
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryPorgramVideothree"
      } else {
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryAuditVideoHisonone"
      }
      this.queryParam.bisType = this.propData.taskBusiness
      this.queryParam.domType = this.propData.taskDomain
      this.loadData();
    },
    dispose(record,id) {
      this.item = record
      this.flag = true;
      this.itemList = ''
      this.title = '处理'
    },
    lookShow(record,id) {
      // this.item = record
      // this.flag = true;
      // this.itemList = ''
      this.title = '查看'
      this.$refs.stepJudgeDivView3.showModal(record);
    },
    explain() {
      let self = this
      this.$info({
        title: '任务说明',
        content: self.propData.taskDesc || '暂无说明...',
        okText: '确认',
        cancelText: '取消',
      });
    },
    setNormal(record) {
      console.log(record,'recode')
      let id = record.id
      updateSus({id}).then(res => {
        if (res.success) {
          this.$message.success('处理成功！')
          this.checkData('3',{});
        } else {
          console.log(res.message)
        }
      })
      let addObj = {
        // auditAdvice: values.description,
        auditResult: this.item.status,
        auditUser: this.userInfo,
        auditLevel: this.item.levele,
        dataId: this.item.id,
        tabledesSource: this.tabledesSource,
        tabledesid: this.tabledesid,
        tabledesname: this.tableName
      }
      console.log(addObj,'addObj')
      // 新增节目处理历史
      // addauditVideoHis(addObj).then(res => { console.log(res,'新增节目处理历史') })
    },
    reset() {
      if(this.changeClass === 0) { 
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryPorgramVideothree"
      } else {
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryAuditVideoHisonone"
      }
      this.ipagination.current = 1;
      this.queryParam = {}
      this.queryParam.bisType = this.propData.taskBusiness
      this.queryParam.domType = this.propData.taskDomain
      // this.queryParam.auditLevel = 1
      this.loadData(1);
    },
    // reset() {
    //   this.queryParam = {};
    //   this.checkData('3',{});
    // },
    checkData(newVal,params) {
      let obj = {
        current: 1,
        pageSize: 10,
        ...params
      }
      obj.username = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName))
      obj.bisType = this.propData.taskBusiness
      obj.domType = this.propData.taskDomain
      if(newVal === '3') {
        this.loading = true;
        queryPorgramVideozerothree(obj).then(res => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
            this.loading = false;
          }
        });
      };
    },
    view(item) {  console.log(item,'item')
      this.$router.push({
        path: "/violationDataProcessing",
        query: {
          progromId: item.id,
          leftData: ["节目名称","首次发现网站","链接地址","节目简介","状态","备注"], // 數據
          violationDataDetailsProcessing: [
            item.name,
            item.programUrl,
            item.poster,
            item.categoryKey,
            item.status,
            item.programSource
          ], // 表頭
          mp4: item.newEvidenceVideoName ? item.newEvidenceVideoName : ''
        }
      });
      // this.item = item;
      // this.flag = true;
    },
    close(val) {
      this.showing = true;
      this.flag = false;
      this.checkData('3',{})
    }
  }
};
</script>

<style lang="scss" scoped>
.geturl {
  width: 170px;
  a,b,span {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.getCategory {
  width: 120px;
}
</style>