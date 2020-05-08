<template>
  <div style="height: 100%;background:#fff;border:none;">
    <div v-if="!flag" style="padding:24px;min-height: 100%;background:#fff;border:none;">
      <!-- 创建人，查询，重置 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="工作流名称">
                <a-input placeholder="请输入..." v-model.trim="queryParam.activitiName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="创建人">
                <a-input placeholder="请输入..." v-model.trim="queryParam.createBy"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                >重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 新建工作流 -->
      <div class="table-operator" style="border-top: 5px">
        <a-button
          @click="addFlow($event, 'add')"
          v-if="hasPerm('add')"
          type="primary"
          icon="plus"
        >新建工作流</a-button>
      </div>
      <!-- 展示table -->
      <div>
        <a-table
          ref="table"
          rowKey="id"
          bordered
          size="middle"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="workflowType" slot-scope="item">
            {{item == 1 ? '任务工作流' : '报告工作流'}}
          </span>
          <span slot="action" slot-scope="textCheck, record">
            <a-button type="default" :disabled="record.isStart=='T'?true:false" v-if="hasPerm('edit')" @click="addFlow(record, 'edit')" icon="edit"
            >编辑</a-button>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item @click="handleDetail(record)" v-if="hasPerm('enable')">
                  <a-icon type="key" />查看
                </a-menu-item>
                <a-menu-item :disabled="record.isStart=='T'?true:false" @click="handleDelete(record.key)" v-if="hasPerm('delete')">
                  <a-icon type="delete" />删除
                </a-menu-item>
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
    <flow-modal ref="modalForm" @ok="modalFormOk"></flow-modal>
    <!-- 新建工作流页面 -->
    <HomePage :data="data" :initObj="initObj" v-if="flag" :ids="ids" :flag="flag" @back="changeShow" />
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import HomePage from "./modules/HomePage";
import FlowModal from './modules/FlowModal'
import { hasPerm } from "@/utils/authFilter";
import { queryDeployedProcessInfoList, updateBpnmModel } from "@api/api";

export default {
  name: "workFlow",
  mixins: [JeecgListMixin],
  components: { HomePage, FlowModal },
  data() {
    return {
      data: {},
      process: {},
      ids: '',
      flag: false,
      initObj: {},
      columns: [
        {
          title: "编号",
          align: "center",
          dataIndex: "actUserInfoId"
        },
        {
          title: "工作流名称",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "创建人",
          align: "center",
          dataIndex: "createBy"
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "工作流类型",
          align: "center",
          dataIndex: "workflowType",
          scopedSlots: { customRender: "workflowType" },
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          align: "center"
        }
      ],
      url: {
        list: "/nmmonitor-server-activiti/activiti/queryDeployedProcessInfoList",
        delete: "/nmmonitor-server-activiti/activiti/deleteProcessDefinitionByKey"
      }
    };
  },
  methods: {
    hasPerm,
    // (新建，编辑)工作流
    addFlow(item, type) {
      if (type === "add") {
        this.initObj = { type: "add" };
        this.flag = true;
      } else {
        this.initObj = { type: "edit" };
        let id = item.key;
        let actActivitiDiagramJson = JSON.parse(item.actActivitiDiagramJson);
        this.ids = id;
        this.initObj = actActivitiDiagramJson;
        this.data = actActivitiDiagramJson.showJson;
        this.flag = true;
      }
    },
    changeShow() {
      this.flag = false;
      this.queryParam = {};
      this.loadData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
