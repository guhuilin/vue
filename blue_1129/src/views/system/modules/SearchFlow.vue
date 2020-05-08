<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col :md="6" :sm="8">
          <a-form-item label="工作流名称">
            <a-input placeholder="请输入..." v-model.trim="queryParam.name"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <a-form-item label="创建人">
            <a-input placeholder="请输入..." v-model.trim="queryParam.person"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="8">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="search('search')" icon="search">查询</a-button>
            <a-button
              type="primary"
              @click="search('reset')"
              icon="reload"
              style="margin-left: 8px"
            >重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import { queryDeployedProcessInfoList } from '@api/api';
import bus from '@views/monitoring-Supervision/bus/bus';

export default {
  data () {
    return {
      queryParam: {},
    }
  },
  methods: {
    // 搜索查询，重置
    search(type) {
      if(type === 'search') {
        bus.$emit('searchType',this.queryParam);
      } else {
        for(let key in this.queryParam){ this.queryParam[key] = '' }
      }
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
}
</script>

