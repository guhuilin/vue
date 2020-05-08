<template>
  <div class="taskflowmenu">
    <div style="background:#fff;margin-bottom:10px;">
      <a-button type="primary" @click="addTaskFlow" icon="plus">添加</a-button>
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
		<FlowMenuModal ref="flowMenuModal" :itemList="itemList" :title="title" @close="close" />
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import FlowMenuModal from './modules/FlowMenuModal'
import { queryActInstTypeList } from '@api/api'

export default {
  mixins:[ JeecgListMixin ],
  components: { FlowMenuModal },
  data() {
    return {
      itemList: {},
      title: '',
			columns: [
        {
          title: "编号",
          align: "center",
          dataIndex: "id"
        },
        {
          title: "分类名称",
          align: "center",
          dataIndex: "typeName"
        },
        {
          title: "分类描述",
          align: "center",
          dataIndex: "describe"
        },
        {
          title: "分类编号",
          align: "center",
          dataIndex: "typeNumber"
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
				list: "/nmmonitor-server-report/actinsttype/queryActInstTypeList",
        delete: "/nmmonitor-server-report/actinsttype/delectActInstType"
      }
		};
	},
	methods: {
		addTaskFlow() {
      this.title = '添加'
			this.$refs.flowMenuModal.show();
    },
    close() {
      this.loadData()
    },
    edit(item) {
      this.title = '编辑'
      this.itemList = item
      this.$refs.flowMenuModal.show();
    }
	}
};
</script>

<style lang="scss" scoped>
.taskflowmenu {
  width: 100%;
  min-height: 100%;
  background: #fff;
  padding: 24px;
}
</style>