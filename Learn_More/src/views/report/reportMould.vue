<template>
    <div class="boxDiv">
        <a-spin :spinning="spinning">
        <div v-if="!reportDivShow && !viewDivShow">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="5" :sm="8">
                            <a-form-item label="模板名称">
                                <a-input placeholder="请输入..." v-model="queryParam.reportName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="5" :sm="8">
                            <a-form-item label="报告类型">
                                <a-select placeholder="请选择..." v-model="queryParam.reportTypeId">
                                    <a-select-option v-for="type in typeList" :value="type.id" :key="type.id">
                                        {{type.typeName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="5" :sm="8">
                            <a-form-item label="报告所属领域">
                                <a-select @change="selectDomain" placeholder="请选择..." v-model="queryParam.domainTypeId">
                                    <a-select-option v-for="domain in domainList" :value="domain.id" :key="domain.id">
                                        {{domain.domainName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="5" :sm="8">
                            <a-form-item label="报告业务" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                                <a-select placeholder="请选择..." v-model="queryParam.businessTypeId">
                                    <a-select-option v-for="business in businessList" :value="business.id"
                                                     :key="business.id">{{business.typeName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="4" :sm="8" v-if="hasPerm('query')">
                            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                                <a-button type="primary" @click="getData" icon="search">查询</a-button>
                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <div class="table-operator" style="border-top: 5px">
                <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasPerm('add')">添加模板</a-button>
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
                    <span slot="reportName" slot-scope="textCheck, record">
                        {{record.reportName}}&nbsp;&nbsp;<a-tag class="tagPos" color="#87d068" v-if="record.saveType === '0'">草稿</a-tag>
                    </span>

                    <span slot="action" slot-scope="textCheck, record">
                        <a-button @click="reportView(record.id)" icon="eye">查看</a-button>

                        <a-divider type="vertical"/>

                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item key="1" @click="edit(record)" v-if="hasPerm('edit')">
                                    <a-icon type="edit"/>
                                    编辑
                                </a-menu-item>
                                <a-menu-item key="3" @click="delReport(record)" v-if="hasPerm('delete')">
                                    <a-icon type="delete"/>
                                    删除
                                </a-menu-item>
                            </a-menu>
                            <a-button style="margin-left: 8px">
                                更多
                                <a-icon type="down"/>
                            </a-button>
                        </a-dropdown>
                    </span>
                </a-table>
            </div>
        </div>

        <reportModal
                :typeList="typeList"
                :domainList="domainList"
                :businessLists="businessList"
                :operation="operation"
                :domainTypeId="domainTypeId"
                :reportId="reportId"
                v-if="reportDivShow"
                @back="changeShow">
        </reportModal>

        <reportView v-if="viewDivShow" :reportId="reportId" :backBtn="true" @back="changeShow"></reportView>
        </a-spin>
    </div>
</template>

<script>
    import reportModal from './modules/reportModal'
    import fileDiv from './modules/fileDiv'
    import reportView from '@/components/report/reportView'
    import store from '@/store'
    import { queryReportTableInfoList, delReportTemplate } from '@api/api'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'reportMould',
        components: {
            reportModal,
            fileDiv,
            reportView
        },
        data() {
            return {
                spinning:false,
                domainList: [],
                businessList: [],
                typeList: [],
                form: this.$form.createForm(this),
                domainTypeId: 0,
                queryParam: {
                    // businessTypeId: '',
                    // domainTypeId: '',
                    // reportTypeId: '',
                    // reportName: '',
                },
                columns: [
                    {
                        title: '名称',
                        align: 'center',
                        dataIndex: 'reportName',
                        scopedSlots: {customRender: 'reportName'},
                    },
                    {
                        title: '创建人',
                        align: 'center',
                        dataIndex: 'createBy',
                    },
                    {
                        title: '附件',
                        align: 'center',
                        dataIndex: 'appendixCount',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center'
                    }
                ],
                dataSource: [],
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
                loading: false,
                toggleSearchStatus: false,
                reportDivShow: false,
                viewDivShow: false,
                reportId: '',
                operation: '',
                // url: {
                //     list: '/nmmonitor-server-moduls-monitor/report/queryReportTableInfoList',
                //     delete: '/nmmonitor-server-moduls-monitor/report/delReportTemplate'
                // },
            }
        },
        created() {
            this.getData();
            this.getDict();
        },
        methods: {
            hasPerm,
            selectDomain(val) {
                if(val) {
                    store.dispatch('getReportBusiness',val).then(res => {
                        this.businessList = res;
                    });
                }
            },
            getData() {
                this.spinning = true
                let param = {
                    reportName: this.queryParam.reportName,
                    domainTypeId: this.queryParam.domainTypeId,
                    businessTypeId: this.queryParam.businessTypeId,
                    reportTypeId: this.queryParam.reportTypeId,
                    pageNo: this.ipagination.current,
                    pageSize: this.ipagination.pageSize
                };
                queryReportTableInfoList(param).then((res) => {
                    if (res.success) {
                        this.dataSource = res.result.records;
                        this.ipagination.total = res.result.total;
                        this.spinning = false
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getDict() {
                store.dispatch('getReportArea').then(res => {
                    this.domainList = res;
                });
                store.dispatch('getReportType').then(res => {
                    this.typeList = res;
                });
            },
            handleTableChange(pagination, filters, sorter) {
                this.ipagination = pagination;
                this.getData();
            },
            searchReset() {
                this.queryParam = {};
                this.getData();
            },
            handleToggleSearch() {
                this.toggleSearchStatus = !this.toggleSearchStatus;
            },
            handleAdd() {
                this.reportDivShow = true;
                this.operation = 'add';
            },
            edit(obj) { 
                if (obj.saveType === '1') {
                    this.$message.warning('已经生成的报告模板无法进行编辑！');
                } else {
                    this.reportDivShow = true;
                    this.operation = 'edit';
                    this.reportId = obj.id;
                    this.domainTypeId = obj.domainTypeId;
                }
            },
            delReport(obj) {
                if (obj.saveType === '1') {
                    this.$message.warning('已经生成的报告模板无法删除！');
                } else {
                    let that = this
                    this.$confirm({
                        title: '提示',
                        content: '确定要删除此条记录么？',
                        onOk() {
                            delReportTemplate({id: obj.id}).then((res) => {
                                if (res.success) {
                                    that.$message.success('删除成功！');
                                    that.getData();
                                } else {
                                    console.log(res.message);
                                }
                            });
                        },
                        onCancel() {
                        },
                    });
                }
            },
            changeShow(str) {
                if (str === 'report') {
                    this.reportDivShow = false;
                } else {
                    this.viewDivShow = false;
                }
                this.searchReset();
            },
            reportView(id) {
                this.reportId = id;
                this.viewDivShow = true;
            }
        }
    }
</script>

<style scoped>
    .tagPos {
        position: relative;
        bottom: 10px;
        cursor: default;
        pointer-events: none;
    }
</style>