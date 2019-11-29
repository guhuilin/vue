<template>
  <div class="boxDiv">
    <div v-if="!taskShow && !viewShow && !taskShowEdit">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="任务名称">
                <a-input placeholder="请输入..." v-model.trim="queryParam.taskName"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="10" :sm="8">
              <a-form-item label="创建时间">
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

            <a-col :md="6" :sm="8" v-if="hasPerm('query')">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="search" icon="search">查询</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator" style="border-top: 5px">
        <a-button @click="add" type="primary" icon="plus" v-if="hasPerm('add')">新建任务</a-button>
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
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="textCheck, record">
            <a-button @click="view(record)" icon="eye">查看</a-button>

            <a-divider type="vertical" />

            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item
                  @click="edit(record)"
                  v-if="hasPerm('edit')"
                  :disabled="record.runningStatus !== '1' || record.isDelivery != 0"
                >编辑</a-menu-item>
                <a-menu-item @click="handleDelete(record.id)" v-if="hasPerm('delete')">删除</a-menu-item>
                <a-menu-item
                  @click="handleUpdate('stop',record.id)"
                  :disabled="record.runningStatus !== '1'"
                >
                  <!--0-->
                  停止
                </a-menu-item>
                <a-menu-item
                  @click="handleUpdate('end',record.id)"
                  :disabled="record.runningStatus !== '1'"
                >
                  <!--3-->
                  结束
                </a-menu-item>
                <a-menu-item
                  @click="instanceTask(record)"
                  :disabled="record.isDelivery != 0"
                  v-if="hasPerm('enable')"
                >下发</a-menu-item>
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
    <taskModalDiv v-if="taskShow" :taskObj="taskObj" @back="back"></taskModalDiv>
    <!-- <taskModalDivEdit v-if="taskShowEdit" :taskObj="taskObj" @back="back"></taskModalDivEdit> -->
    <taskView :taskObj="taskObj" viewType="normal" @back="back" v-if="viewShow"></taskView>
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
// import taskModalDivEdit from './monitoring-Supervision/taskModalDivEdit'
import taskModalDiv from "./monitoring-Supervision/taskModalDiv";
import taskView from "./monitoring-Supervision/taskView";
import JDate from "@/components/jeecg/JDate";
import {
  modifyTaskRunningStatus,
  instanceTask,
  suspendProcessInstanceByKey,
  activateProcessInstanceByKey
} from "@api/api";
import { getAction } from "@/api/manage";
import { hasPerm } from "@/utils/authFilter";
import moment from "moment";

export default {
  name: "taskScheduling",
  mixins: [JeecgListMixin],
  components: {
    taskModalDiv,
    taskView,
    // taskModalDivEdit,
    JDate
  },
  data() {
    return {
      taskShow: false,
      viewShow: false,
      taskShowEdit: false,
      startTime: null,
      endTime: null,
      endOpen: false,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条";
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
          title: "任务分类",
          align: "center",
          dataIndex: "taskSourceName",
          customRender: function(t, r, index) {
            return t ? t : "--";
          }
        },
        {
          title: "任务期限",
          align: "center",
          dataIndex: "guTime",
          customRender: function(t, r, index) {
            return t ? t + "天" : "--";
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
                return "--";
                break;
              }
            }
          }
        },
        {
          title: "任务流程图",
          align: "center",
          dataIndex: "workflowTemplateName",
          customRender: function(t, r, index) {
            return t ? t : "--";
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
      form: this.$form.createForm(this),
      url: {
        list:
          "/nmmonitor-server-module-taskScheduling/taskSchedulingV2/queryTaskInfoList",
        delete:
          "/nmmonitor-server-module-taskScheduling/taskSchedulingV2/deleteTaskInfo"
      },
      taskObj: {}
    };
  },
  methods: {
    hasPerm,
    search() {
      let startTime = this.queryParam.startTime
        ? moment(this.queryParam.startTime).format("YYYY-MM-DD")
        : null;
      let endTime = this.queryParam.endTime
        ? moment(this.queryParam.endTime).format("YYYY-MM-DD")
        : null;
      let taskName = this.queryParam.taskName;
      let obj = {
        pageNo: 1,
        pageSize: 10,
        startTime,
        endTime,
        taskName
      };
      this.ipagination.current = 1;
      this.loading = true;
      getAction(this.url.list, obj).then(res => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        }
        this.loading = false;
      });
    },
    validateStartTime(rule, value, callback) {
      let obj = this.form.getFieldsValue(["endTime"]);
      if (value && obj.endTime) {
        if (value === moment.max(value, obj.endTime)) {
          callback("开始时间不能大于结束时间");
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validateEndTime(rule, value, callback) {
      let obj = this.form.getFieldsValue(["startTime"]);
      if (value && obj.startTime) {
        if (value === moment.min(value, obj.startTime)) {
          callback("结束时间不能小于开始时间");
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    timeChange(date, dateString) {
      this.queryParam.startTime = dateString[0];
      this.queryParam.endTime = dateString[1];
    },
    add() {
      this.taskObj = {};
      this.taskShow = true;
    },
    edit(obj) {
      this.taskObj = obj;
      this.taskShow = true;
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
      this.taskShowEdit = false;
      this.viewShow = false;
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
    }
  }
};
</script>

<style scoped>
</style>
