<template>
    <div class="boxDiv">
        <div v-if="!viewShow">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="任务名称">
                                <a-input placeholder="请输入..." v-model="queryParam.taskName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="10" :sm="8">
                            <a-form-item label="创建时间">
                                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择开始时间"></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择结束时间"></j-date>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8" v-if="hasPerm('query')">
                            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                                <a-button type="primary" @click="loadData" icon="search">查询</a-button>
                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <a-divider style="margin-top: 0;"/>

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
                        <a-button @click="view(record)" icon="eye">查看</a-button>

                        <a-divider type="vertical"/>

                        <a-button @click="assignTask(record.procInstId)" icon="usergroup-add" v-if="hasPerm('enable')">指派任务</a-button>

                        <a-divider type="vertical"/>

                        <a-button @click="claimTask(record.procInstId)" icon="user-add" v-if="hasPerm('enable')">认领任务</a-button>
                    </span>

                </a-table>
            </div>
        </div>

        <assignTaskModal ref="assignTaskModal"></assignTaskModal>

        <taskView :taskObj="taskObj" viewType="normal" @back="back" v-if="viewShow"></taskView>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import { hasPerm } from "@/utils/authFilter";
    import taskView from './monitoring-Supervision/taskView'
    import { getTaskInfoByTaskId, claimTask } from '@api/api'
    import assignTaskModal from "./monitoring-Supervision/assignTaskModal";

    export default {
        name: 'taskSchedulingDirector',
        mixins: [JeecgListMixin],
        components: {
            JDate,
            taskView,
            assignTaskModal
        },
        data() {
            return {
                columns: [
                    {
                        title: '任务名称',
                        align: 'center',
                        dataIndex: 'taskName'
                    },
                    {
                        title: '任务期限',
                        align: 'center',
                        dataIndex: 'interval'
                    },
                    {
                        title: '修改时间',
                        align: 'center',
                        dataIndex: 'updateTime'
                    },
                    {
                        title: '工作流名称',
                        align: 'center',
                        dataIndex: 'workflowTemplateName'
                    },
                    {
                        title: '报告模板名称',
                        align: 'center',
                        dataIndex: 'reportTemplateName'
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center'
                    }
                ],
                url: {
                    list: '/nmmonitor-server-module-taskScheduling/taskScheduling/getTaskInstanceList'
                },
                viewShow: false,
                taskObj: {}
            }
        },
        methods: {
            hasPerm,
            view(obj) {
                getTaskInfoByTaskId({taskId: obj.taskId}).then(res => {
                    if (res.success) {
                        this.taskObj = res.result;
                        this.viewShow = true;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            claimTask(procInstId) {
                claimTask({procInstId: procInstId}).then(res => {
                    if (res.success) {
                        this.$message.info(res.message);
                    } else {
                        console.log(res.message);
                    }
                });
            },
            assignTask(procInstId) {
                this.$refs.assignTaskModal.show(procInstId);
            },
            back() {
                this.viewShow = false;
            }
        }
    }
</script>

<style scoped>

</style>