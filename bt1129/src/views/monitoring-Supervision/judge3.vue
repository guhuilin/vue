<template>
  <div style="padding:20px;background:#fff;min-height:100%">
    <div v-if="!defaultId">
      <!-- <div style="height:50px;display:flex;justify-content:space-between">
        <div style="height:50px;display:flex;">
          <a-button style="margin-right:20px;" class="searchBtn" type="primary" @click="untreated">未完成</a-button>
          <a-button class="searchBtn" type="default" @click="processed">已完成</a-button>
        </div>
        <div></div>
      </div> -->
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="6">
            <a-form-item label="任务名称">
              <a-input style="width:150px;" placeholder="请输入..." v-model.trim="queryParam.taskName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="6">
            <a-form-item label="任务类型">
              <a-select placeholder="请选择..." style="width:150px;"  v-model="queryParam.taskType">
                <a-select-option :value="0">常规任务</a-select-option>
                <a-select-option :value="1">应急任务</a-select-option>
                <a-select-option :value="2">专项任务</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="6">
            <a-form-item label="其它条件">
              <a-input style="width:150px;" placeholder="请输入..." v-model="queryParam.status"></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :md="5" :sm="6">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button class="searchBtn" type="primary" @click="search" icon="search">查询</a-button>
              <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="action, record">
            <a-button @click="dispose(record)">任务处理</a-button>
          </span>
        </a-table>
      </div>
    </div>
    <JudgeOne v-if="defaultId === '1'" :reportTemplateId="reportTemplateId" :propData="propData" @show="show" />
    <JudgeTwo v-if="defaultId === '2'" :reportTemplateId="reportTemplateId" :reportid="reportid" :ids="ids" :propData="propData" @show="show" />
    <JudgeThree v-if="defaultId === '3'" :reportTemplateId="reportTemplateId" :propData="propData" @show="show" />
  </div>
</template>

<script>
import JudgeOne from './monitoring-Supervision/Judgeone';
import JudgeTwo from './monitoring-Supervision/Judgetwo';
import JudgeThree from './monitoring-Supervision/Judgethree';
import { queryTask } from "@api/api";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { hasPerm } from "@/utils/authFilter";
import stepJudgeModal from "./monitoring-Supervision/stepJudge-Modal";
import Vue from 'vue'
import { USER_INFO } from "@/store/mutation-types"

export default {
  name: "judge3",
  mixins: [JeecgListMixin],
  components: {
    stepJudgeModal,
    JudgeOne,
    JudgeTwo,
    JudgeThree
  },
  data() {
    return {
      flag: false,
      dataSource: [],
      title: "",
      defaultId: "",
      reportTemplateId: 0,
      ids: 0,
      reportid: 0,
      userInfo: '',
      propData: {},
      queryParam: {
        taskName: '',
        taskType: '',
        judgedLevel: '3',
        username: JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName))
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
          title: "任务名称",
          align: "center",
          dataIndex: "taskName"
        },
        {
          title: "任务类型",
          align: "center",
          dataIndex: "taskType",
          customRender: function (t, r, index) {  //  r, index
            switch(t) {
              case 0: {
                return '常规任务'
              };
              case 1: {
                return '应急任务'
              };
              case 2: {
                return '专项任务'
              };
              default: {
                return '--'
              }
            }
          }
        },
        {
          title: "权限类别",
          align: "center",
          dataIndex: "judgedLevel",
          customRender: function (t, r, index) {
            switch(t) {
              case 1: {
                return '初级研判'
              };
              case 2: {
                return '复核研判'
              };
              case 3: {
                return '最终研判'
              };
              default: {
                return '--'
              }
            }
          }
        },
        {
          title: "开始时间",
          align: "center",
          dataIndex: "starttime"
        },
        {
          title: "任务期限",
          align: "center",
          dataIndex: "interval",
          customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "任务目标",
          align: "center",
          dataIndex: "description",
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
        list: "/nmmonitor-server-module-Judgements/Judgements/queryTask"
      }
    };
  },
  mounted() {
    this.userInfo = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName));
    this.queryParam = {
      username: this.userInfo,
      judgedLevel: '3'
    }
  },
  methods: {
    hasPerm,
    show() {
      this.defaultId = ''
    },
    untreated() {},
    processed() {},
    dispose(item) { 
      window.localStorage.setItem('bisType',item.taskBusiness)
      window.localStorage.setItem('domType',item.taskDomain)
      this.propData = item;
      this.defaultId = item.judgedLevel + "";
      this.reportTemplateId = item.propertytableid
      this.reportid = item.reportid
      this.ids = item.ids
      this.flag = true;
    },
    search() {
      this.ipagination.current = 1;
      this.loadData(1);
    },
    getData() {
      let obj = {
        pageNo: 1,
        pageSize: 10,
        username: this.userInfo,
        ...this.queryParam
      }
      this.ipagination.current = 1;
      this.loading = true;
      queryTask(obj).then(res => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        }
        this.loading = false;
      })
    },
    close() {
      this.flag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>