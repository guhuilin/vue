<template>
  <div class="boxDiv">
    <div v-if="!taskShow && !viewShow">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="任务名称">
                <a-input placeholder="请输入..." v-model.trim="queryParam.taskName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="8">
              <a-form-item label="下发时间">
                <a-date-picker
                  style="width:150px"
                  :disabledDate="disabledStartDate"
                  showTime
                  v-model="queryParam.startTime"
                  placeholder="开始时间"
                  @openChange="handleStartOpenChange"
                />~
                <a-date-picker
                  style="width:150px"
                  :disabledDate="disabledEndDate"
                  showTime
                  placeholder="结束时间"
                  v-model="queryParam.endTime"
                  :open="endOpen"
                  @openChange="handleEndOpenChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="任务分类">
                <a-select placeholder="请选择..." @change="onChangeSelectTaskPeriods" v-model="queryParam.taskSource">
                  <a-select-option
                    v-for="(item,ind) in taskSource"
                    :key="ind"
                    :value="item.id"
                  >{{item.typeName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="任务类型">
                <a-select placeholder="请选择..." @change="onChangeSelectTaskPeriods" v-model="queryParam.taskType">
                  <a-select-option
                    v-for="(item,ind) in taskType"
                    :key="ind"
                    :value="item.id"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="任务状态">
                <a-select placeholder="请选择..." @change="onChangeSelectTaskPeriods" v-model="queryParam.runningStatus">
                  <a-select-option
                    v-for="(item,ind) in runningStatus"
                    :key="ind"
                    :value="item.id"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8" v-if="hasPerm('query')">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="search" icon="search">查询</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div>
        <a-table
          ref="table"
          bordered
          size="middle"
          rowKey="procInstId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="textCheck, record">
            <a-button @click="view(record)" icon="eye">查看</a-button>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item @click="claim(record)" :disabled="record.runningStatus !== '1'">认领</a-menu-item>
                <a-menu-item @click="executeTask(record)" :disabled="record.runningStatus !== '1'">执行任务</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                更多
                <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </span>
        </a-table>
      </div>
    </div>
    <allotModal :visible="visible" :needData="needData" @back="back" />
    <taskLook :taskObj="taskObj" @back="back" v-if="viewShow"></taskLook>
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import taskLook from "./monitoring-Supervision/taskLook";
import allotModal from "./monitoring-Supervision/allotModal";
import JDate from "@/components/jeecg/JDate";
import moment from 'moment';
import {
  claimAndCompleteTask,
  claimTask2,
  getActInstTypeInfoList,
  modifyTaskRunningStatus,
  instanceTask,
  suspendProcessInstanceByKey,
  activateProcessInstanceByKey
} from "@api/api";
import { getAction } from '@/api/manage'
import { hasPerm } from "@/utils/authFilter";

const selectTaskDownDate = [
  { name: "周一", id: 1 },
  { name: "周二", id: 2 },
  { name: "周三", id: 3 }
];
const runningStatus = [
  { name: "停止", id: 0 },
  { name: "运行", id: 1 },
  { name: "暂停", id: 2 },
  { name: "结束", id: 3 }
];
const taskType = [
  { name: "常规任务", id: 0 },
  { name: "应急任务", id: 1 },
  { name: "专项任务", id: 2 }
];

export default {
  name: "taskScheduling",
  mixins: [JeecgListMixin],
  components: {
    JDate,
    taskLook,
    allotModal
  },
  data() {
    return {
      taskShow: false,
      viewShow: false,
      visible: false,
      endOpen: false,
      selectTaskDownDate,
      runningStatus,
      taskType,
      needData: {},
      taskSource: [],
      nowStatus: [],    // 认领的当前状态，无实际作用
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
      queryParam: {
        taskName: "",
        downTime: "",
        startTime: null,
        endTime: null,
        runningStatus: "",
        taskType: "",
        taskSource: "",
      },
      columns: [
        {
          title: "任务名称",
          align: "center",
          dataIndex: "taskName"
        },
        {
          title: "任务分类",
          align: "center",
          dataIndex: "taskSourceName",
          customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "任务期限",
          align: "center",
          dataIndex: "guTime",
          customRender: function (t, r, index) {
            return t ? t+'天' : '--';
          }
        },
        {
          title: "当前期数",
          align: "center",
          dataIndex: "taskCertainPeriods",
          customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "任务下发时间",
          align: "center",
          dataIndex: "downTime",
          customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "任务类型",
          align: "center",
          dataIndex: "taskType",
          customRender: function(t, r, index) {
            switch (t) {
              case 0: {
                return "常规任务";
                break;
              }
              case 1: {
                return "应急任务";
                break;
              }
              case 2: {
                return "专项任务";
                break;
              }
              default: {
                return '--';
                break;
              }
            }
          }
        },
        {
          title: "任务流程图",
          align: "center",
          dataIndex: "workflowTemplateName",
          customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "任务状态",
          align: "center",
          dataIndex: "runningStatus",
          customRender: function(t, r, index) {
            switch (t) {
              case "0": {
                return "已停止";
                break;
              }
              case "1": {
                return "运行中";
                break;
              }
              case "2": {
                return "已暂停";
                break;
              }
              case "3": {
                return "已结束";
                break;
              }
              case "4": {
                return "等待下次运行";
                break;
              }
            }
            if (t) {
              return t === 1 ? "下发" : "自建";
            } else {
              return "";
            }
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
          "/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getTaskInstanceInfoList",
        delete:
          "/nmmonitor-server-module-taskScheduling/taskSchedulingV2/deleteTaskInfo"
      },
      taskObj: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    hasPerm,
    search() {
      let param = Object.assign({}, this.queryParam)
      param.startTime = this.queryParam.startTime ? moment(this.queryParam.startTime).format('YYYY-MM-DD') : null
      param.endTime = this.queryParam.endTime ? moment(this.queryParam.endTime).format('YYYY-MM-DD'): null
      param.pageNo = 1
      param.pageSize = 10
      this.ipagination.current = 1;
      this.loading = true;
      getAction(this.url.list, param).then((res) => {
          if (res.success) {
              this.dataSource = res.result.records;
              this.ipagination.total = res.result.total;
          }
          this.loading = false;
      })
    },
    timeChange(date, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]
    },
    onChangeSelectTaskPeriods() {},
    getData() {
      getActInstTypeInfoList().then(res => {
        if (res.success) {
          this.taskSource = res.result;
        } else {
          console.log(this.message);
        }
      });
    },
    add() {
      this.taskObj = {};
      this.taskShow = true;
    },
    claim(val) {
      let xxx = this.nowStatus && this.nowStatus.some(item => {
        return val.id === item
      })
      if(!xxx) {
        this.loading = true;
        claimTask2({ procInstId: val.procInstId }).then(res => {
          this.loading = false;
          if (res.success) {
            this.$message.success("认领成功！");
            this.loadData();
          } else {
            this.$message.error("认领失败！");
          }
        });
        this.nowStatus.push(val.id);
      } else {
        this.$message.info("不能重复认领！");
      }
    },
    executeTask(val) {
      this.needData = {
        procInstId: val.procInstId,
        taskInstanceId: val.taskInstanceId
      };
      this.visible = true;
      // this.loading = true;
    },
    view(obj) {
      this.taskObj = Object.assign(obj);
      this.viewShow = true;
    },
    instanceTask(obj) {
      let that = this;
      this.$confirm({
        title: "提示",
        content: "确定要下发当前任务么？",
        onOk() {
          instanceTask({ taskId: obj.id }).then(res => {
            if (res.success) {
              that.$message.success("下发成功！");
              that.loadData();
            } else {
              that.$message.warning(res.message);
            }
          });
        },
        onCancel() {}
      });
    },
    handleUpdate(type, id) {
      if (type == "stop") {
        modifyTaskRunningStatus({ id, runningStatus: 0 }).then(res => {
          if (res.success) {
            this.$message.success("停止成功！");
            this.loadData();
          } else {
            this.$message.warning(res.message);
          }
        });
      } else {
        modifyTaskRunningStatus({ id, runningStatus: 3 }).then(res => {
          if (res.success) {
            this.$message.success("结束成功！");
            this.loadData();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    hangUpWorkflow(id) {
      let that = this;
      this.$confirm({
        title: "提示",
        content: "确定要挂起当前任务流程么？",
        onOk() {
          suspendProcessInstanceByKey({ workflowTemplateId: id }).then(res => {
            if (res.success) {
              that.$message.success("挂起成功！");
              that.loadData();
            } else {
              that.$message.warning(res.message);
            }
          });
        },
        onCancel() {}
      });
    },
    activeWorkflow(id) {
      let that = this;
      this.$confirm({
        title: "提示",
        content: "确定要激活当前任务流程么？",
        onOk() {
          activateProcessInstanceByKey({ workflowTemplateId: id }).then(res => {
            if (res.success) {
              that.$message.success("激活成功！");
              that.loadData();
            } else {
              that.$message.warning(res.message);
            }
          });
        },
        onCancel() {}
      });
    },
    back(flag) {
      this.taskShow = false;
      this.viewShow = false;
      this.visible = false;
      if (flag) {
        this.loadData();
      }
    },
    disabledStartDate(startTime) {
      const endTime = this.queryParam.endTime;
      if (!startTime || !endTime) {
        return false;
      }
      return startTime.valueOf() > endTime.valueOf();
    },
    disabledEndDate(endTime) {
      const startTime = this.queryParam.startTime;
      if (!endTime || !startTime) {
        return false;
      }
      return startTime.valueOf() >= endTime.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
  }
};
</script>

<style scoped>
</style>
