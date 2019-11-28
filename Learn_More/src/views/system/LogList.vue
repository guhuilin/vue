<template>
    <div class="boxDiv">
        <!--导航区域-->
        <div>
            <a-tabs defaultActiveKey="1" @change="callback">
                <a-tab-pane tab="登录日志" key="1"></a-tab-pane>
                <a-tab-pane tab="操作日志" key="2"></a-tab-pane>
            </a-tabs>
        </div>

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="24">

                    <a-col :md="6" :sm="8">
                        <a-form-item label="搜索日志">
                            <a-input placeholder="请输入搜索关键词" v-model="queryParam.keyWord"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :md="10" :sm="10">
                        <a-form-item label="创建时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                            <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                    style="width:45%" placeholder="请选择开始时间"></j-date>
                            <span style="width: 10px;">~</span>
                            <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                    style="width:45%" placeholder="请选择结束时间"></j-date>
                        </a-form-item>
                    </a-col>

                    <a-col :md="8" :sm="10" v-if="hasPerm('query')">
                        <span style="float: right;" class="table-page-search-submitButtons">
                            <a-button type="primary" style="left: -35px" @click="searchQuery" icon="search">查询</a-button>
                            <a-button @click="searchReset" icon="reload" style="margin-left: 8px;left: -35px">重置</a-button>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <a-divider style="margin-top: 0;"/>

        <!-- table区域-begin -->
        <a-table
                ref="table"
                size="middle"
                rowKey="id"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                @change="handleTableChange">
        </a-table>
        <!-- table区域-end -->
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'LogList',
        mixins: [JeecgListMixin],
        components: {
            JDate
        },
        data() {
            return {
                description: '这是日志管理页面',
                // 查询条件
                queryParam: {
                    ipInfo: '',
                    createTimeRange: [],
                    logType: '1',
                    keyWord: '',
                },
                // 表头
                columns: [
                    {
                        title: '#',
                        dataIndex: '',
                        key: 'rowIndex',
                        align: 'center',
                        customRender: function (t, r, index) {
                            return parseInt(index) + 1;
                        }
                    },
                    {
                        title: '日志内容',
                        align: 'left',
                        dataIndex: 'logContent',
                        sorter: true
                    },
                    {
                        title: '操作人名称',
                        dataIndex: 'userName',
                        align: 'center',
                        sorter: true
                    },
                    {
                        title: 'IP',
                        dataIndex: 'ip',
                        align: 'center',
                        sorter: true
                    },
                    {
                        title: '耗时(毫秒)',
                        dataIndex: 'costTime',
                        align: 'center',
                        sorter: true
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        align: 'center',
                        sorter: true
                    }
                ],
                labelCol: {
                    xs: {span: 1},
                    sm: {span: 2},
                },
                wrapperCol: {
                    xs: {span: 10},
                    sm: {span: 16},
                },
                url: {
                    list: '/nmmonitor-server/log/logInfoList',
                },
            }
        },
        methods: {
            hasPerm,
            // 重置
            searchReset() {
                var that = this;
                var logType = that.queryParam.logType;
                that.queryParam = {}; //清空查询区域参数
                that.queryParam.logType = logType;
                that.loadData(this.ipagination.current);
            },
            // 日志类型
            callback(key) {
                let that = this;
                that.queryParam.logType = key;
                that.loadData();
            }
        }
    }
</script>

<style scoped>

</style>