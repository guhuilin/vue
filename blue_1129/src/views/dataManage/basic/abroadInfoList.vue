<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">基础数据库 / 网上境外剧引进信息库</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="节目名称">
                                <a-input placeholder="请输入..." v-model="queryParam.programName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="制作机构">
                                <a-input placeholder="请输入..." v-model="queryParam.productionCompany"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="国别">
                                <a-input placeholder="请输入..." v-model="queryParam.country"></a-input>
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

        <abroadForm :abroadObj="abroadObj" @back="backList" v-else></abroadForm>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import abroadForm from './form/abroadForm'

    export default {
        name: 'appInfoList',
        mixins: [JeecgListMixin],
        components: {
            abroadForm
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
                        title: '国别',
                        align: 'center',
                        dataIndex: 'country'
                    },
                    {
                        title: '时长',
                        align: 'center',
                        dataIndex: 'runTime'
                    },
                    {
                        title: '制作机构',
                        align: 'center',
                        dataIndex: 'productionCompany'
                    },
                    {
                        title: '播出时间',
                        align: 'center',
                        dataIndex: 'showTime'
                    },
                    {
                        title: '集数',
                        align: 'center',
                        dataIndex: 'programCount'
                    },
                    {
                        title: '主要演员',
                        align: 'center',
                        dataIndex: 'protagonist'
                    },
                    {
                        title: '链接地址',
                        align: 'center',
                        dataIndex: 'programUrl'
                    },
                    {
                        title: '节目简介',
                        align: 'center',
                        dataIndex: 'programAbstract'
                    },
                    {
                        title: '海报',
                        align: 'center',
                        dataIndex: 'photo',
                        scopedSlots: {customRender: 'photo'}
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
                    list: '/nmmonitor-server-module-database/datebase/queryDbAbroadNetProgram',
                    delete: '/nmmonitor-server-module-database/datebase/deleteDbAbroadNetProgram'
                },
                infoShow: false,
                abroadObj: {}
            }
        },
        methods: {
            add() {
                this.infoShow = true;
                this.abroadObj = {};
            },
            edit(obj) {
                this.infoShow = true;
                this.abroadObj = obj;
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