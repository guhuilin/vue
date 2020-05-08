<template>
    <div class="boxDiv">
        <div v-if="!planShow">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="报告所属领域" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                                <a-select placeholder="请选择..." v-model="queryParam.domainTypeId" allowClear>
                                    <a-select-option v-for="domain in domainList" :value="domain.id" :key="domain.id">
                                        {{domain.domainName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="报告业务" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                                <a-select placeholder="请选择..." v-model="queryParam.businessTypeId" allowClear>
                                    <a-select-option v-for="business in businessList" :value="business.id"
                                                     :key="business.id">{{business.typeName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="报告类型" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                                <a-select placeholder="请选择..." v-model="queryParam.reportTypeId" allowClear>
                                    <a-select-option v-for="type in typeList" :value="type.id" :key="type.id">
                                        {{type.typeName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="报告名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                                <a-input placeholder="请输入..." v-model="queryParam.reportName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="报告期数" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                                <a-input placeholder="请输入..." v-model="queryParam.reportPeriods"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="所属台站" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                                <a-select placeholder="请选择..." v-model="queryParam.stationId" allowClear>
                                    <a-select-option v-for="station in stationList" :value="station.id"
                                                     :key="station.id">{{station.orgCode}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8" v-if="hasPerm('query')">
                            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <div class="table-operator" style="border-top: 5px">
                <a-button @click="planReport" type="primary" icon="plus" v-if="hasPerm('add')">规划报告</a-button>
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
                </a-table>
            </div>
        </div>

        <planView
                :domainList="domainList"
                :businessList="businessList"
                :typeList="typeList"
                :stationList="stationList"
                v-if="planShow"
                @back="changeShow">
        </planView>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import planView from './modules/reportPlanView'
    import {
        queryReportTypeSelectList,
        queryReportBusinessSelectList,
        queryReportDomainSelectList,
        queryStationsList
    } from '@api/api'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'reportPlan',
        mixins: [JeecgListMixin],
        components: {
            planView
        },
        data() {
            return {
                domainList: [],
                businessList: [],
                typeList: [],
                stationList: [],
                columns: [
                    {
                        title: '报告类型',
                        align: 'center',
                        dataIndex: 'reportTypeName',
                    },
                    {
                        title: '所属领域',
                        align: 'center',
                        dataIndex: 'domainTypeName',
                    },
                    {
                        title: '报告业务',
                        align: 'center',
                        dataIndex: 'businessTypeName',
                    },
                    {
                        title: '报告名称',
                        align: 'center',
                        dataIndex: 'reportName',
                    },
                    {
                        title: '开始时间',
                        align: 'center',
                        dataIndex: 'reportStartTime',
                    },
                    {
                        title: '期数',
                        align: 'center',
                        dataIndex: 'reportPeriods',
                    },
                    {
                        title: '任务来源',
                        align: 'center',
                        dataIndex: 'source',
                        customRender: function (t, r, index) {
                            if (t) {
                                return t === 1 ? '下发' : '自建';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        title: '台站',
                        align: 'center',
                        dataIndex: 'stationCode',
                    }
                ],
                url: {
                    list: '/nmmonitor-server-moduls-monitor/report/queryReportList'
                },
                planShow: false
            }
        },
        created() {
            this.getDict();
        },
        methods: {
            hasPerm,
            getDict() {
                queryReportDomainSelectList({}).then((res) => {
                    if (res.success) {
                        this.domainList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
                queryReportBusinessSelectList({}).then((res) => {
                    if (res.success) {
                        this.businessList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
                queryReportTypeSelectList({}).then((res) => {
                    if (res.success) {
                        this.typeList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
                queryStationsList().then(res => {
                    if (res.success) {
                        this.stationList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            planReport() {
                this.planShow = true;
            },
            changeShow(flag) {
                this.planShow = false;
                if (flag) {
                    this.queryParam = {};
                }
                this.loadData();
            }
        }
    }
</script>

<style scoped>

</style>