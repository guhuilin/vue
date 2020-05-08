<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">视听节目库 / 违规节目库</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="5" :sm="8">
                            <a-form-item label="节目名称">
                                <a-input placeholder="请输入..." v-model="queryParam.programName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="5" :sm="8">
                            <a-form-item label="节目url">
                                <a-input placeholder="请输入..." v-model="queryParam.programUrl"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="5" :sm="8">
                            <a-form-item label="网站名称">
                                <a-input placeholder="请输入..." v-model="queryParam.websiteName"></a-input>
                            </a-form-item>

                        </a-col>

                        <a-col :md="5" :sm="8">
                            <a-form-item label="主要问题">
                                <a-input placeholder="请输入..." v-model="queryParam.problem"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="4" :sm="8">
                            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <div class="table-operator" style="border-top: 5px">
                <a-button @click="add" type="primary">添加</a-button>
                <a-button @click="" type="primary">导入数据</a-button>
                <a-button @click="" type="primary">导出数据</a-button>
            </div>

            <a-divider/>

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
                    <a-button @click="" icon="eye">查看</a-button>

                    <a-divider type="vertical"/>

                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="">
                                <a-icon type="download"/>
                                下载
                            </a-menu-item>
                            <a-menu-item key="2" @click="edit(record)">
                                <a-icon type="edit"/>
                                编辑
                            </a-menu-item>
                            <a-menu-item key="3" @click="handleDelete(record.id)">
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

        <violationForm :violationObj="violationObj" @back="backList" v-else></violationForm>
    </div>
</template>

<script>
    import { JeecgListMixin } from "@/mixins/JeecgListMixin";
    import violationForm from './form/violationForm';

    export default {
        name: 'violationList',
        mixins: [JeecgListMixin],
        components: {
            violationForm
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
                        title: '节目名称',
                        align: 'center',
                        dataIndex: 'programName'
                    },
                    {
                        title: '网站名称',
                        align: 'center',
                        dataIndex: 'websiteName',
                        customRender: (t)=> {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '节目URL',
                        align: 'center',
                        dataIndex: 'programUrl',
                        customRender: (t)=> {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '主要问题',
                        align: 'center',
                        dataIndex: 'problem',
                        customRender: (t)=> {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '最近一次检查时间',
                        align: 'center',
                        dataIndex: 'latestCheckTime',
                        customRender: (t)=> {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        align: 'center',
                        scopedSlots: { customRender: 'action' },
                        fixed: 'right',
                        width: 300
                    }
                ],
                url: {
                    list: '/nmmonitor-server-module-database/datebase/queryDbHarmVideoBeanList',
                    delete: '/nmmonitor-server-module-database/datebase/deleteDbHarmVideoBean'
                },
                infoShow: false,
                violationObj: {}
            }
        },
        methods: {
            add() {
                this.infoShow = true;
                this.violationObj = {};
            },
            edit(obj) {
                this.infoShow = true;
                this.violationObj = obj;
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