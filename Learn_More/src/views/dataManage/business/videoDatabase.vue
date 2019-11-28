<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <span class="table-page-header-submitButtons-back">
                <span style="font-size:17px">业务数据库</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </span>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="视频名称">
                                <a-input placeholder="请输入..." v-model="queryParam.evidenceVideoName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
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
                    <a-button @click="" icon="download">下载</a-button>

                    <a-divider type="vertical"/>

                    <a-button @click="" icon="eye">查看</a-button>

                    <a-divider type="vertical"/>

                    <a-button @click="edit(record)" icon="edit">编辑</a-button>

                    <a-divider type="vertical"/>

                    <a-button type="danger" @click="handleDelete(record.id)" icon="delete">删除</a-button>
                </span>
                </a-table>
            </div>
        </div>

        <videoDataForm :videoObj="videoObj" @back="backList" v-else></videoDataForm>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import videoDataForm from './form/videoDataForm'

    export default {
        name: 'videoDatabase',
        mixins: [JeecgListMixin],
        components: {
            videoDataForm
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
                        title: '视频名称',
                        align: 'center',
                        dataIndex: 'evidenceVideoName',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },

                    {
                        title: '上传时间',
                        align: 'center',
                        dataIndex: 'insertTime',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '报告实例',
                        align: 'center',
                        dataIndex: 'rptInsId',
                        customRender: (t) => {
                            return t ? t : '--'
                        }
                    },
                    {
                        title: '视频海报',
                        align: 'center',
                        dataIndex: 'evidencePoster',
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
                    list: '/nmmonitor-server-module-database/datebase/queryEvidenceVideotwo',
                    delete: '/nmmonitor-server-module-database/datebase/deleteReportInstancetwo'
                },
                infoShow: false,
                videoObj: {}
            }
        },
        methods: {
            add() {
                this.infoShow = true;
                this.videoObj = {};
            },
            edit(obj) {
                this.infoShow = true;
                this.videoObj = obj;
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