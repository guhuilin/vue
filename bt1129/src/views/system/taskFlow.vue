<template>
  <div class="taskFlow" style="padding: 24px;">
    <div v-if="!show">
      <div style="background:#fff;margin-bottom:10px;">
        <a-button type="primary" @click="addTaskFlow">添加</a-button>
      </div>
      <a-table
          bordered
          size="middle"
          rowKey="id"
          :columns="columns"
          :pagination="ipagination"
          :dataSource="dataSource"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="records,item">
            <a-button type="default" icon="edit" @click="edit(item)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button type="default" icon="edit" @click="handleDelete(item.id)">删除</a-button>
          </span>
        </a-table>
    </div>
    <taskFlowModal :show="show" :itemList="itemList" @close="close" />
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import taskFlowModal from './modules/taskFlowModal'
import { updateCustomActProcInstInfo, deleteCustomActProcInstInfo } from '@api/api'

export default {
  mixins:[ JeecgListMixin ],
  components: { taskFlowModal },
  data() {
    return {
      show: false,
      itemList: {},
			columns: [
        {
          title: "编号",
          align: "center",
          dataIndex: "id"
        },
        {
          title: "工作流名称",
          align: "center",
          dataIndex: "actReProcdefName"
        },
        {
          title: "任务工作流名称",
          align: "center",
          dataIndex: "actInstName"
        },
        {
          title: "工作流编号",
          align: "center",
          dataIndex: "actReProcdefKey"
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      dataSource: [],
      url: {
				list: "/nmmonitor-server-activiti/activiti/getCustomActProcInstInfoList",
        delete: "/nmmonitor-server-activiti/activiti/deleteCustomActProcInstInfo"
      }
		};
	},
	methods: {
		addTaskFlow() {
      this.itemList = {}
			this.show = true
    },
    close() {
      this.show = false
      this.loadData()
    },
    edit(item) {
      this.itemList = item
      this.show = true
    }
	}
};
</script>

<style lang="scss" scoped>
.taskFlow {
  width: 100%;
  min-height: 100%;
  background: #fff;
}
</style>