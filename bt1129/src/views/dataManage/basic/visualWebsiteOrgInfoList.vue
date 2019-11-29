<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">基础数据库 / 视听网站机构信息库</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="机构名称">
                                <a-input placeholder="请输入..." v-model="queryParam.organName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="网站名称">
                                <a-input placeholder="请输入..." v-model="queryParam.siteName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="法人代表">
                                <a-input placeholder="请输入..." v-model="queryParam.corporation"></a-input>
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

        <visualWebsiteOrgForm :visualWebsiteOrgObj="visualWebsiteOrgObj" @back="backList" v-else></visualWebsiteOrgForm>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import visualWebsiteOrgForm from './form/visualWebsiteOrgForm'

    export default {
        name: 'appInfoList',
        mixins: [JeecgListMixin],
        components: {
            visualWebsiteOrgForm
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
                        title: '机构名称',
                        align: 'center',
                        dataIndex: 'organName'
                    },
                    {
                        title: '开办网站名称',
                        align: 'center',
                        dataIndex: 'siteName',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '网站域名',
                        align: 'center',
                        dataIndex: 'domain',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '机构简介',
                        align: 'center',
                        dataIndex: 'description',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '地址',
                        align: 'center',
                        dataIndex: 'address',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '联系方式',
                        align: 'center',
                        dataIndex: 'telephone',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '法人代表',
                        align: 'center',
                        dataIndex: 'corporation',
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
                    list: '/nmmonitor-server-module-database/datebase/queryDbWebstieOrganList',
                    delete: '/nmmonitor-server-module-database/datebase/deleteDbWebstieOrgan'
                },
                infoShow: false,
                visualWebsiteOrgObj: {}
            }
        },
        methods: {
            add() {
                this.infoShow = true;
                this.visualWebsiteOrgObj = {};
            },
            edit(obj) {
                this.infoShow = true;
                this.visualWebsiteOrgObj = obj;
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