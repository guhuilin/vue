<template>
    <div class="boxDiv">
        <div class="table-operator">
            <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasPerm('add')">添加报告类型</a-button>
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
                    <a-button @click="getReportType(record, 'edit')" icon="edit" v-if="hasPerm('edit')">编辑</a-button>

                    <a-divider type="vertical" v-if="hasPerm('edit')"/>

                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="getReportType(record, 'detail')">
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

        <reportTypeModal ref="modalForm" @ok="modalFormOk"></reportTypeModal>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import reportTypeModal from './modules/reportTypeModal'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'reportType',
        mixins: [JeecgListMixin],
        components: {
            reportTypeModal
        },
        data() {
            return {
                columns: [
                    {
                        title: '类型名称',
                        align: 'center',
                        dataIndex: 'typeName',
                    },
                    {
                        title: '类型编号',
                        align: 'center',
                        dataIndex: 'code',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center'
                    }
                ],
                dataSource: [],
                url: {
                    list: '/nmmonitor-server-report/report/queryReportTypeInfoList',
                    delete: '/nmmonitor-server-report/report/delReportTypeInfo'
                }
            }
        },
        methods: {
            hasPerm,
            getReportType(report, type) {
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