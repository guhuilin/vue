<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">基础数据库 / APP信息库</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="app名称">
                                <a-input placeholder="请输入..." v-model="queryParam.softName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="操作系统">
                                <a-input placeholder="请输入..." v-model="queryParam.operSys"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="app类型">
                                <a-input placeholder="请输入..." v-model="queryParam.appType"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="传播方式">
                                <a-input placeholder="请输入..." v-model="queryParam.spreadForm"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="节目类型">
                                <a-input placeholder="请输入..." v-model="queryParam.programForm"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="开发/运营机构">
                                <a-input placeholder="请输入..." v-model="queryParam.devOrg"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <div class="table-operator" style="border-top: 5px">
                <a-button @click="add" type="primary">新增</a-button>
                <a-button @click="" type="primary">下载模板</a-button>
                <a-button @click="" type="primary">导入数据</a-button>
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
                        :scroll="{x: 2100}"
                        @change="handleTableChange">
                    <span slot="action" slot-scope="textCheck, record">
                        <a-button @click="edit(record)" icon="edit">编辑</a-button>

                        <a-divider type="vertical"/>

                        <a-button type="danger" @click="handleDelete(record.id)" icon="delete">删除</a-button>
                    </span>
                </a-table>
            </div>
        </div>

        <appForm :appObj="appObj" @back="backList" ref="appForm" v-else></appForm>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import appForm from './form/appForm'

    export default {
        name: 'appInfoList',
        mixins: [JeecgListMixin],
        components: {
            appForm
        },
        data() {
            return {
                columns: [
                    {
                        title: '编号',
                        align: 'center',
                        dataIndex: 'id'
                    },
                    {
                        title: 'app名称',
                        align: 'center',
                        dataIndex: 'softName'
                    },
                    {
                        title: '操作系统',
                        align: 'center',
                        dataIndex: 'operSys',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '下载地址',
                        align: 'center',
                        dataIndex: 'downloadAddr',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '软件版本',
                        align: 'center',
                        dataIndex: 'softVersion',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '类型',
                        align: 'center',
                        dataIndex: 'appType',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '传播方式',
                        align: 'center',
                        dataIndex: 'spreadForm',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '开发/运营机构',
                        align: 'center',
                        dataIndex: 'devOrg',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '联系方式',
                        align: 'center',
                        dataIndex: 'contactInfo',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '联系地址',
                        align: 'center',
                        dataIndex: 'contactAddress',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '记录时间',
                        align: 'center',
                        dataIndex: 'insertTime',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center',
                        fixed: 'right',
                        width: 200
                    }
                ],
                url: {
                    list: '/nmmonitor-server-module-database/datebase/queryDbAppSoftList',
                    delete: '/nmmonitor-server-module-database/datebase/deleteDbAppSoft'
                },
                infoShow: false,
                appObj: {}
            }
        },
        methods: {
            add() {
                this.infoShow = true;
                this.appObj = {};
            },
            edit(obj) {
                this.infoShow = true;
                this.appObj = obj;
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