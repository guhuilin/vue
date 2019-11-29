<template>
  <div>
    <div>
      <div class="table-page-header-submitButtons-back">
        <span style="font-size:17px">分层研判 / 研判一级</span>
        <a @click="back" style="color:#1f2438;font-size:17px;">
          <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
        </a>
      </div>
      <div style="height:50px;display:flex;justify-content:space-between">
        <div style="height:50px;display:flex;">
          <a-button style="margin-right:20px;" class="searchBtn" :class="changeClass === 0 ? 'ant-btn-primary' : 'ant-btn-default'" @click="judgeNo">未处理</a-button>
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="tableChange"
      >
        <div class="geturl" slot="pName" slot-scope="pName, record">
          <span :title="record.name">{{record.name}}</span>
        </div>
        <div class="getCategory" slot="category" slot-scope="category, record">
          <span :title="record.categoryKey">{{record.categoryKey}}</span>
        </div>
        <div class="geturl" slot="linkUrl" slot-scope="linkUrl, record">
          <a :href="record.programUrl" :title="record.programUrl" target="_blank">{{record.programUrl}}</a>
        </div>
        <span slot="action" slot-scope="action, record" v-if="showing">
          <a-button @click="dispose(record,'1')">节目处理</a-button>
          <a-divider type="vertical" />
          <a-button @click="setNormal(record)" v-if="hasPerm('enable')">设为正常</a-button>
        </span>
        <span v-else>
          <a-button @click="lookShow(record,'1')">查看</a-button>
        </span>
      </a-table>
    </div>
    <!-- <div style="width:100%;height:40px;display:flex;align-items:center;justify-content:center">
      <a-button @click="back">返回</a-button>
    </div> -->
    <stepJudgeDivView ref="stepJudgeDivView" />
    <step-judge-modal :show="flag" @close="close" :reportTemplateId="reportTemplateId" :defaultId="'1'" :item="item" :title="title" :itemList="itemList" />
  </div>
</template>

<script>
import {
  querySuspectProgram,
  querySuspectProgramtwo,
  querySuspectProgramthree,
  deleteSuspectProgram,
  queryAuditVideoHis, 
  updateSuspectProgram, 
  addauditVideoHis
} from "@api/api";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { hasPerm } from "@/utils/authFilter";
import stepJudgeModal from "./stepJudge-Modal";
import stepJudgeDivView from "./stepJudgeDivView";
import Vue from 'vue'
import { USER_INFO } from "@/store/mutation-types"

export default {
  name: "JudgeOne",
  mixins: [JeecgListMixin],
  components: {
    stepJudgeModal,
    stepJudgeDivView
  },
  data() {
    return {
      flag: false,
      showing: true,
      dataSource: [],
      item: {},
      changeClass: 0,
      userInfo: '',
      type: 'no',
      itemList: "",
      title: "",
      queryParam: {
        name: "",
        source: "",
        status: "",
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
          dataIndex: "pName",
          scopedSlots: { customRender: "pName" },
        },
        {
          title: "首次发现网站",
          align: "center",
          dataIndex: "source",
          // scopedSlots: { customRender: "firstView" },
        },
        {
          title: "链接地址",
          align: "center",
          dataIndex: "programUrl",
          scopedSlots: { customRender: "linkUrl" },
        },
        {
          title: "节目简介",
          align: "center",
          dataIndex: "categoryKey",
          scopedSlots: { customRender: "category" },
        },
        {
          title: "状态",
          align: "center",
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
            }
          }
        },
        {
          title: "节目来源",
          align: "center",
          dataIndex: "programSource"
        },
        {
          title: "备注",
          align: "center",
          dataIndex: "auditAdvice",
          customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          align: "center"
        }
      ],
      url: {
        list:
          "/nmmonitor-server-module-Judgements/Judgements/querySuspectProgram",
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
  mounted () {
    this.queryParam.bisType = this.propData.taskBusiness
    this.queryParam.domType = this.propData.taskDomain
    this.userInfo = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName));
  },
  methods: {
    hasPerm,
    search() { 
      if(this.changeClass === 0) { 
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/querySuspectProgram"
      } else {
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryAuditVideoHisonone"
      }
      this.queryParam.bisType = this.propData.taskBusiness
      this.queryParam.domType = this.propData.taskDomain
      // this.queryParam.auditLevel = 1
      this.ipagination.current = 1;
      this.loadData(1);
    },
    reset() {
      if(this.changeClass === 0) { 
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/querySuspectProgram"
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
    tableChange(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      if(this.changeClass === 0) { 
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/querySuspectProgram"
      } else {
        this.url.list = "/nmmonitor-server-module-Judgements/Judgements/queryAuditVideoHisonone"
      }
      this.queryParam.bisType = this.propData.taskBusiness
      this.queryParam.domType = this.propData.taskDomain
      this.loadData();
    },
    back() {
      this.showing = true;
      this.$emit("show", '')
    },
    judgeNo() {
      this.changeClass = 0
      this.type = 'no';
      this.ipagination.current = 1;
      this.queryParam = {}
      this.showing = true;
      this.checkData('1',{})
    },
    judgeDispose() { 
      this.changeClass = 1
      this.type = 'yes';
      this.ipagination.current = 1;
      this.queryParam = {}
      this.showing = false;
      this.loading = true;
      let query = {
        pageSize: 10,
        pageNo: 1,
        // auditLevel: '1'
      }
      query.bisType = this.propData.taskBusiness
      query.domType = this.propData.taskDomain
      query.username = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName))
      queryAuditVideoHis(query).then(res => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
          this.loading = false;
        }
      })
    },
    dispose(record,id) {
      this.item = record
      this.flag = true;
      this.itemList = ''
      this.title = '处理'
    },
    lookShow(record,id) {
      this.$refs.stepJudgeDivView.showModal(record);
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
      let obj = {
        id: record.id,
        status: 2
      }
      // 处理分层研判
      updateSuspectProgram(obj).then(res => {
        if(res.success) {
          this.$message.success('处理成功！')
          this.$emit("close", true);
        } else {
          this.$message.error('错误')
          this.$emit("close", true);
        }
      })
      let addObj = {
        auditAdvice: '',
        auditResult: 2,
        auditUser: this.userInfo,
        auditLevel: record.levele,
        dataId: record.id,
        tabledesSource: "",
        tabledesid: '',
        tabledesname: ''
      }
      // 新增节目处理历史
      addauditVideoHis(addObj).then(res => { 
        console.log(res,'新增节目处理历史') 
        this.checkData('1',{})
      })
    },
    checkData(newVal,params) {
      let obj = {
        pageNo: 1,
        pageSize: 10,
        ...params
      }
      obj.bisType = this.propData.taskBusiness
      obj.domType = this.propData.taskDomain
      obj.username = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName))
      if(newVal === '1') {
        this.loading = true;
        querySuspectProgram(obj).then(res => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
            this.loading = false;
          }
        });
      };
    },
    close(val) {
      this.showing = true;
      this.flag = false;
      this.checkData('1',{})
    }
  }
};
</script>

<style lang="scss" scoped>
.geturl {
  width: 170px;
  a,span {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.getCategory {
  width: 120px;
  span {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>