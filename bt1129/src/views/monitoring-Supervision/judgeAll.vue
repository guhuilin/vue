<template>
  <div v-if="showTable">
    <!-- <div style="height:50px;display:flex;justify-content:space-between">
      <div style="height:50px;display:flex;">
        <a-button style="margin-right:20px;" class="searchBtn" type="primary" @click="untreated">未完成</a-button>
        <a-button class="searchBtn" type="default" @click="processed">已完成</a-button>
      </div>
    </div> -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
      <a-row :gutter="24">
        <a-col :md="6" :sm="8">
          <a-form-item label="报告名称">
            <a-input placeholder="请输入..." v-model="queryParam.reportname"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="报告类型">
            <a-select @change="onChangeSelectTaskPeriods" v-model="queryParam.reporttypeid">
              <a-select-option
                v-for="(item,ind) in reportType"
                :key="ind"
                :value="item.id"
              >{{item.typename}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="报告所属领域">
            <a-select @change="onChangeSelectTaskPeriods" v-model="queryParam.domaintypeid">
              <a-select-option
                v-for="(item,ind) in reportDomain"
                :key="ind"
                :value="item.id"
              >{{item.domainname}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="报告业务">
            <a-select @change="onChangeSelectTaskPeriods" v-model="queryParam.businesstypeid">
              <a-select-option
                v-for="(item,ind) in reportBusiness"
                :key="ind"
                :value="item.id"
              >{{item.typename}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="任务状态">
            <a-select @change="onChangeSelectTaskPeriods" v-model="queryParam.id">
              <a-select-option
                v-for="(item,ind) in taskStatus"
                :key="ind"
                :value="item.id"
              >{{item.typename}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8" v-if="hasPerm('query')">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="loadData" icon="search">查询</a-button>
            <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    </div>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="action, record">
          <a-button @click="view(record)">报告处理</a-button>
          <a-divider type="vertical" />
          <a-button @click="presentAuid(record)">提交审核</a-button>
        </span>
      </a-table>
    </div>
    <div style="width:100%;height:40px;display:flex;align-items:center;justify-content:center">
      <a-button @click="back">返回</a-button>
    </div>
  </div>
</template>

<script>
import {
  queryReporttypeBean,
  queryReportbusinessBean,
  queryReportdomainBean,
  queryReportInstanceBean,
  deleteSuspectProgram,
  queryClaimTask
} from "@api/api";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { hasPerm } from "@/utils/authFilter";

const taskStatus = [
  { typename: "草稿", id: 0 },
  { typename: "使用状态", id: 1 },
  { typename: "过期状态", id: 2 }
];

export default {
  name: "judgeAll",
  mixins: [JeecgListMixin],
  props: {
    showTable: {
      type: Boolean,
      default: false
    },
    showType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      flag: false,
      dataSource: [],
      reportType: [],
      reportDomain: [],
      reportBusiness: [],
      item: {},
      taskStatus,
      itemList: "",
      title: "",
      queryParam: {
        taskName: "",
        reportType: "",
        reportDomain: "",
        reportBusiness: "",
        taskStatus: "",
        domaintypeid: "",
        reporttypeid: "",
        reportname: "",
        businesstypeid: "",
        id: "",
      },
      columns: [
        {
          title: "报告名称",
          align: "center",
          dataIndex: "reportname"
        },
        {
          title: "所属任务",
          align: "center",
          dataIndex: "domainname"
        },
        {
          title: "任务类型",
          align: "center",
          dataIndex: "tasktype"
        },
        {
          title: "开始时间",
          align: "center",
          dataIndex: "starttime"
        },
        {
          title: "任务期数",
          align: "center",
          dataIndex: "taskperiods"
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
          "/nmmonitor-server-module-Judgements/Judgements/queryReportInstanceBean",
        delete:
          "/nmmonitor-server-module-Judgements/Judgements/deleteSuspectProgram"
      }
    };
  },
  watch: {
    flag(newVal) {
      this.getData();
    },
    showTable(newVal) {},
    showType(newVal) {
      if (newVal) this.getData();
    }
  },
  created() {
    this.getData();
  },
  methods: {
    hasPerm,
    onChangeSelectTaskPeriods() { },
    back() {
      this.$emit("show", true);
    },
    untreated() {},
    processed() { },
    getData() {
      queryReporttypeBean().then(res => {
        if (res.success) {
          this.reportType = res.result;
        }
      });
      queryReportdomainBean().then(res => {
        if (res.success) {
          this.reportDomain = res.result;
        }
      });
      queryReportbusinessBean().then(res => {
        if (res.success) {
          this.reportBusiness = res.result;
        }
      });
    },
    view(item) {
      this.$router.push({
        path: "/violationDataProcessing",
        query: {
          leftData: [
            "节目名称",
            "首次发现网站",
            "链接地址",
            "节目简介",
            "状态",
            "备注"
          ], // 數據
          violationDataDetailsProcessing: [
            item.name,
            item.programUrl,
            item.poster,
            item.categoryKey,
            item.status,
            item.programSource
          ], // 表頭
          mp4: "//"
        }
      });
      this.item = item;
      this.flag = true;
    },
    presentAuid(val) {
      queryClaimTask({taskId:val.id}).then(res => {
        if (res.success) {
          this.$message.success('提交审核成功！')
        } else {
          this.$message.error(this.message);
        }
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