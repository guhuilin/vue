<template>
  <div>
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="actUserInfoId"
      :columns="this.columns ? this.columns : columns1"
      :dataSource="dataSource.records"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="this.rowSelection"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="textCheck, record">
        <!-- addFlow(record, 'edit') -->
        <a @click="addFlow(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.key)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>
    <!-- 新建工作流页面 -->
    <HomePage1 :initObj="initObj" v-if="flag" :flag="flag" @back="changeShow" />
  </div>
</template>
<script>
import { updateBpnmModel, queryDeployedProcessInfoList, deleteProcessDefinitionByKey } from '@api/api';
import HomePage from './HomePage'
import bus from '@views/monitoring-Supervision/bus/bus'

export default {
	name: 'tableFlow',
  data() {
    return {
      flag: false,
      columns1: [
        {
          title: "id",
          align: "center",
          dataIndex: "actUserInfoId"
        },
        {
          title: "流程名称",
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
          title: "备注",
          align: "center",
          dataIndex: "remarks"
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          align: "center"
        }
      ],
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条";
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 10
      },
      loading: false
    };
  },
  components: {
    HomePage
  },
  props: {
    rowSelection: {
      type: Object,
      default: null
    },
    columns: {
      type: Array,
      default: null
    },
  },
  watch: {
    'flag':function() {
      this.$emit('changeShow',this.flag);
    }
  },
	created () {
		let params = { activitiName:'', createBy: '', pageNo:1, pageSize: 20 };
    this.$nextTick(()=> {
      this.queryDeploy(params)
    })
	},
	mounted () {
		bus.$on('searchType',queryParam => {
			if(queryParam.name || queryParam.person) {
				let params = { activitiName:queryParam.name, createBy: queryParam.person, pageNo:1, pageSize: 10 };
				this.queryDeploy(params)
			} else {
				let params = { activitiName:'', createBy: '', pageNo:1, pageSize: 10 };
				this.queryDeploy(params)
			}
    })
	},
	methods: {
		// 分页
    handleTableChange(data) {
      let params = { activitiName:'', createBy: '', pageNo:data.current, pageSize: data.pageSize };
      this.queryDeploy(params)
		},
		// (新建，编辑)工作流
    addFlow(item) {
      let id = item.key;
      let actActivitiDiagramJson = JSON.parse(item.actActivitiDiagramJson);
      actActivitiDiagramJson.process.id = id;
      updateBpnmModel(JSON.stringify(actActivitiDiagramJson)).then(res => {
        if(res.success) { 
          this.initObj = actActivitiDiagramJson
          this.flag = true;
        }
      })
    },
    changeShow() {
      this.flag = false;
		},
		// 根据key删除工作流
    handleDelete(id) {
      deleteProcessDefinitionByKey({id:id}).then(res => {
        if(res.success) {
          this.queryDeploy()
          this.$message.success('删除成功！')
        }
      })
    },
		// 请求数据列表
    queryDeploy(params) {
      queryDeployedProcessInfoList(params).then(res => {
        if(res.success) {
					this.dataSource = res.result
        }
        return res.result
      });
    },
	}
};
</script>


