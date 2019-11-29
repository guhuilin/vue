<template>
  <div class="server-config" style="padding: 24px;">
    <div style="background:#fff">
      <a-button type="primary" @click="addSystem">添加子系统</a-button>
    </div>
    <div class="childserver" v-for="(item, ind) in list" :key="ind">
      <div class="table-top">
        <span style="padding-left: 10px;">{{item.systemName}}</span>
        <a-button type="primary" @click="handleAdd(item.id)">添加配置</a-button>
      </div>
      <a-table
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="item.records"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="records,item">
          <a-button type="default" icon="edit" @click="edit(item)">编辑</a-button>
          <a-divider type="vertical" />
          <a-button type="default" icon="edit" @click="deleteItem(item.id)">删除</a-button>
        </span>
      </a-table>
    </div>
    <a-modal :title="title" v-model="visible" @ok="handleSubmit" @cancel="close" okText="确认" cancelText="取消">
      <a-form v-if="title === '添加系统'" :form="form" @submit="handleSubmit">
        <a-form-item label="系统名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="[ 'system',{rules: [{ required: true, message: '请输入系统名称！' }]}]"
          />
        </a-form-item>
        <a-form-item label="服务地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['server',{}]" />
        </a-form-item>
      </a-form>
      <a-form v-if="title === '添加配置'" :form="form" @submit="handleSubmit">
        <a-form-item label="配置名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[ 'note',validatorRules.note]" />
        </a-form-item>
        <a-form-item label="属性值" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['address',validatorRules.address]" />
        </a-form-item>
      </a-form>
			<a-form v-if="title === '编辑'" :form="form" @submit="handleSubmit">
        <a-form-item label="配置名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[ 'newnote',{initialValue: configProperty.configName}]" />
        </a-form-item>
        <a-form-item label="属性值" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['newaddresss',{initialValue: configProperty.configValue}]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { querySubSystem, querySystemConfig, addSubSystem, addSystemConfig, updateSystemConfig, deleteSystemConfig } from '@api/api'

export default {
  mixins: [JeecgListMixin],
  data() {
    return {
      list: [],
      title: "",
      visible: false,
      configProperty: {},
      currentId: '',
      parentId: '',
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      validatorRules: {
        note: {
          rules: [{required: true, message: '请输入任务名称!'}]
        },
        address: {
          rules: [{required: true, message: '请输入属性值!'}]
        }
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
          title: "配置属性",
          align: "center",
          dataIndex: "configName"
        },
        {
          title: "属性值",
          align: "center",
          dataIndex: "configValue"
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
				list: "/nmmonitor-server/componentToolController/getFieldComponentList",
        delete: "/nmmonitor-server-module-database/datebase/deleteSystemConfig"
      }
    };
  },
	created() {
    this.getAll()
  },
  methods: {
    addSystem() {
      this.title = "添加系统"
			this.visible = true
    },
		edit(item) {
      this.parentId = item.systemId
      this.currentId = item.id
      this.configProperty = {
        configName:item.configName,
        configValue:item.configValue
      }
			this.title = '编辑'
			this.visible = true
    },
    deleteItem(id) {
      let that = this;
      this.$confirm({
        title: '提示',
        content: '确定要删除此条记录么？',
        onOk() {
          deleteSystemConfig({id}).then(res => {
            if (res.success) {
              that.getAll()
            } else {
              that.$message.warning(res.message);
            }
          });
        },
        onCancel() {
        },
      });
    },
    handleSubmit(e) {
			e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
					if(values.system) {  // 系统
						let newData = {
							systemName: values.system,
							serverUrl: values.server
						}
						addSubSystem(newData).then(res => {
							if(res.success) {
                this.form.resetFields()
								this.getAll()
							}
						})
          }else if(values.note) {  // 配置
						let newData = {
							systemConfig: 1234,
							systemId: this.currentId,
							configName: values.note,
							configValue: values.address
            };
						addSystemConfig(newData).then(res => {
							if(res.success) {
                this.form.resetFields()
                this.getAll()
              }
						})
          } else {  // 编辑
						let newData = {
							systemConfig: '',
              id: this.currentId,
              systemId: this.parentId,
							configName: values.newnote,
							configValue: values.newaddresss
            };
						updateSystemConfig(newData).then(res => {
							if(res.success) {
                this.form.resetFields()
                this.$message.warning('修改成功！');
                this.getAll()
              }
						})
					}
          this.visible = false;
        }
      });
    },
    close() {
      this.form.resetFields()
    },
    handleAdd(id) {
      this.currentId = id
      this.title = "添加配置"
      this.visible = true
		},
		getAll() {
			querySubSystem({}).then(res => {
          this.list = []
				let result = res.result
				result.map(item => {
					this.query(item,{SystemId:item.id})
        })
      })
    },
    query(item,id) {
      querySystemConfig(id).then(res => {
        if(res.success) {
          item.records = res.result.records
          this.list.push(item)
        }
      })
    }
  }
};
   
</script>
<style lang="scss" scoped>
.server-config {
  width: 100%;
  background: #fff;
}
.childserver {
  margin-top: 10px;
  .table-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }
}
</style>