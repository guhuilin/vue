<template>
    <div class="boxDiv">
        <div class="table-operator">
            <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasPerm('add')">添加报告领域</a-button>
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

                <template slot="avatarslot" slot-scope="textCheck, record, index">
                    <div class="anty-img-wrap">
                        <a-avatar shape="square" :src="getAvatarView(record.imgUrl)" icon="user"/>
                    </div>
                </template>

                <span slot="action" slot-scope="textCheck, record">
                    <a-button @click="getReportArea(record, 'edit')" icon="edit" v-if="hasPerm('edit')">编辑</a-button>

                    <a-divider type="vertical" v-if="hasPerm('edit')"/>

                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="getReportArea(record, 'detail')">
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

        <reportAreaModal ref="modalForm" @ok="modalFormOk"></reportAreaModal>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import reportAreaModal from './modules/reportAreaModal'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'reportArea',
        mixins: [JeecgListMixin],
        components: {
            reportAreaModal
        },
        data() {
            return {
                columns: [
                    {
                        title: '领域名称',
                        align: 'center',
                        dataIndex: 'domainName',
                    },
                    {
                        title: '领域编号',
                        align: 'center',
                        dataIndex: 'code',
                    },
                    {
                        title: '图标',
                        align: 'center',
                        dataIndex: 'imgUrl',
                        scopedSlots: {customRender: 'avatarslot'}
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center'
                    }
                ],
                url: {
                    list: '/nmmonitor-server-report/report/queryReportDomainInfoList',
                    delete: '/nmmonitor-server-report/report/delReportDomainInfo',
                    imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
                }
            }
        },
        computed: {
            getAvatarView() {
                return function(avatar) {
                    return this.url.imgerver + "/" + avatar;
                }
            },
        },
        methods: {
            hasPerm,
            getReportArea(area, type) {
                if (type === 'edit') {
                    this.handleEdit(area);
                } else {
                    this.handleDetail(area);
                }
            }
        }
    }
</script>

<style scoped>

</style>