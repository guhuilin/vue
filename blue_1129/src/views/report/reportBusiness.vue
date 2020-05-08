<template>
    <div class="boxDiv">
        <div class="table-operator">
            <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasPerm('add')">添加报告业务</a-button>
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
                    <a-button @click="getReportBusiness(record, 'edit')" icon="edit" v-if="hasPerm('edit')">编辑</a-button>

                    <a-divider type="vertical" v-if="hasPerm('edit')"/>

                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="getReportBusiness(record, 'detail')">
                                <a-icon type="snippets"/>
                                详情
                            </a-menu-item>
                            <a-menu-item key="3" @click="handleDelete(record.id)" v-if="hasPerm('delete')">
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

        <reportBusinessModal ref="modalForm" @ok="modalFormOk"></reportBusinessModal>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import reportBusinessModal from './modules/reportBusinessModal'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'reportBusiness',
        mixins: [JeecgListMixin],
        components: {
            reportBusinessModal
        },
        data() {
            return {
                columns: [
                    {
                        title: '业务名称',
                        align: 'center',
                        dataIndex: 'typeName',
                    },
                    {
                        title: '业务编号',
                        align: 'center',
                        dataIndex: 'code',
                    },
                    {
                        title: '报告领域',
                        align: 'center',
                        dataIndex: 'reportDomainName',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center'
                    }
                ],
                url: {
                    list: '/nmmonitor-server-report/report/queryReportBusinessInfoList',
                    delete: '/nmmonitor-server-report/report/delReportBusinessInfo'
                }
            }
        },
        methods: {
            hasPerm,
            getReportBusiness(report, type) {
                if (type === 'edit') {
                    this.handleEdit(report);
                } else {
                    this.handleDetail(report);
                }
            }
        }
    }
</script>

<style scoped>

</style>