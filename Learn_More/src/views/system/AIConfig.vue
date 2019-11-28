<template>
  <div style="min-height: 100%;background:#fff;padding:24px;border:none;">
    <div v-if="!flag">
      <!-- 创建人，查询，重置 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="名称">
                <a-input placeholder="请输入..." v-model.trim="queryParam.configName"></a-input>
              </a-form-item>
            </a-col>
						<a-col :md="6" :sm="8">  
              <a-form-item label="引擎类型">
                <a-select placeholder="请选择..." v-model.trim="queryParam.configType">
									<a-select-option v-for="item in judgeLevel" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
								</a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 添加配置 -->
      <div class="table-operator" style="border-top: 5px">
        <a-button @click="addConfig" v-if="hasPerm('add')" type="primary" icon="plus">添加配置</a-button>
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
          <span slot="tags" slot-scope="record">
            <a-tag
              :color="record ? '#2db7f5' : '#108ee9'"
            >
              {{record ? '已配置' : '暂无配置'}}
            </a-tag>
          </span>
          <span slot="action" slot-scope="textCheck, record">
            <a-button type="default" v-if="hasPerm('edit')" @click icon="edit">编辑</a-button>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item @click v-if="hasPerm('enable')">
                  <a-icon type="key" />查看
                </a-menu-item>
                <a-menu-item @click="handleDelete(record.id)" v-if="hasPerm('delete')">
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
    <configDiv v-if="flag" @back="back" />
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { hasPerm } from "@/utils/authFilter";
import configDiv from "./modules/AIConfigDiv";
const judgeLevel = [
	{value:0,label:'阿里云'},
	{value:1,label:'百度云'},
	{value:2,label:'腾讯云'},
]

export default {
  name: "workFlow",
  mixins: [JeecgListMixin],
  components: { configDiv },
  data() {
    return {
			judgeLevel,
      data: {},
      process: {},
      ids: "",
      flag: false,
      initObj: {},
      columns: [
        {
          title: "编号",
          align: "center",
					dataIndex: "id",
					customRender: (t,arr,ind) => {
						return ind + 1 + ((this.ipagination.current - 1) * this.ipagination.pageSize)
					}
        },
        {
          title: "名称",
          align: "center",
          dataIndex: "configName"
				},
				{
          title: "名称",
          align: "center",
					dataIndex: "configType",
					customRender: (t) => {
						switch(t) {
							case 0: return '阿里云'
							case 1: return '百度云'
							case 2: return '腾讯云'
						}
					}
        },
        {
          title: "是否配置",
          align: "center",
          dataIndex: "configParams",
          scopedSlots: { customRender: 'tags'}
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
          "/nmmonitor-server-module-database/AIConfigController/getConfigInfoList",
        delete:
          "/nmmonitor-server-module-database/AIConfigController/delAIConfigInfo"
      }
    };
  },
  methods: {
    hasPerm,
    addConfig() {
      this.flag = true;
    },
    // 请求数据列表
    back() {
			this.flag = false;
			this.loadData();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
