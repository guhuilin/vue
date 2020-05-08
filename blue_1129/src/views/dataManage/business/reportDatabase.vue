<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">业务数据库</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="报告名称">
                                <a-input placeholder="请输入..." v-model="queryParam.reportName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="台站">
                                <a-input placeholder="请输入..." v-model="queryParam.stationId"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="报告期数">
                                <a-input placeholder="请输入..." v-model="queryParam.reportPeriods"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <span style="overflow: hidden;" class="table-page-search-submitButtons">
                                <a-button type="primary" @click="loadData" icon="search">查询</a-button>
                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <div class="table-operator" style="border-top: 5px">
                <a-button @click="add" type="primary">新增</a-button>
                <a-button @click="" type="primary">导出数据</a-button>
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
                        @change="handleTableChange">
                <span slot="action" slot-scope="textCheck, record">
                    <a-button @click="edit(record)" icon="edit">编辑</a-button>

                    <a-divider type="vertical"/>

                    <a-button type="danger" @click="handleDelete(record.id)" icon="delete">删除</a-button>
                </span>
                </a-table>
            </div>
        </div>

        <reportDataForm :reportObj="reportObj" @back="backList" v-else></reportDataForm>
    </div>
</template>

<script>
    import  {JeecgListMixin } from '@/mixins/JeecgListMixin'
    import reportDataForm from './form/reportDataForm'

    export default {
        name: 'reportDatabase',
        mixins: [JeecgListMixin],
        components: {
            reportDataForm
        },
        data() {
            return {
                columns: [
                    {
                        title: '报告名称',
                        align: 'center',
                        dataIndex: 'reportName'
                    },
                    {
                        title: '开始时间',
                        align: 'center',
                        dataIndex: 'reportStartTime',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '结束时间',
                        align: 'center',
                        dataIndex: 'reportEndTime',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '期数',
                        align: 'center',
                        dataIndex: 'reportPeriods',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '累计期数',
                        align: 'center',
                        dataIndex: 'reportTotalCount',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '所属台站',
                        align: 'center',
                        dataIndex: 'stationId',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: "center"
                    }
                ],
                url: {
                    list: '/nmmonitor-server-module-database/datebase/queryReportInstancetwo',
                    delete: '/nmmonitor-server-module-database/datebase/deleteReportInstancetwo'
                },
                infoShow: false,
                reportObj: {}
            }
        },
        methods: {
            add() {
                this.infoShow = true;
                this.reportObj = {};
            },
            edit(obj) {
                this.infoShow = true;
                this.reportObj = obj;
            },
            back() {
                this.$emit('back');
            },
            backList(flag) {
                this.infoShow = false;
                if (flag) {
                    this.loadData();
                }
            }
        }
    }
</script>

<style scoped>

</style>