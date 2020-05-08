<template>
    <div class="boxDiv">

        <!-- 操作按钮区域 -->
        <div class="table-operator">
            <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasPerm('add')">新增</a-button>
            <a-button
                    @click="batchDel"
                    v-if="selectedRowKeys.length > 0 && hasPerm('delete')"
                    ghost
                    type="primary"
                    icon="delete">批量删除
            </a-button>
        </div>

        <a-divider />

        <!-- table区域-begin -->
        <div class="tableDiv">

<!--            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--                <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{-->
<!--                selectedRowKeys.length }}</a>项&nbsp;&nbsp;-->
<!--                <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--            </div>-->

            <a-table
                    :columns="columns"
                    size="middle"
                    :pagination="false"
                    :dataSource="dataSource"
                    :loading="loading"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
                <span slot="action" slot-scope="textCheck, record">
                    <a-button @click="handleEdit(record)" icon="edit" v-if="hasPerm('edit')">编辑</a-button>

                    <a-divider type="vertical" v-if="hasPerm('edit')"/>

                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="handleDetail(record)">
                                <a-icon type="snippets"/>
                                详情
                            </a-menu-item>
                            <a-menu-item key="3" @click="handleDelete(record.menuId)" v-if="hasPerm('delete')">
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
        <!-- table区域-end -->

        <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
    </div>
</template>

<script>
    import PermissionModal from './modules/PermissionModal'
    import {getPermissionList} from '@/api/api'
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'
    import {hasPerm} from "@/utils/authFilter";

    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '菜单类型',
            dataIndex: 'menuType',
            key: 'menuType',
            customRender: function (text) {
                if (text == 0) {
                    return '菜单'
                } else if (text == 1) {
                    return '菜单'
                } else if (text == 2) {
                    return '按钮'
                } else {
                    return text
                }
            }
        },
        {
            title: 'icon',
            dataIndex: 'icon',
            key: 'icon'
        },
        {
            title: '组件',
            dataIndex: 'component',
            key: 'component',
            scopedSlots: {customRender: 'component'}
        },
        {
            title: '路径',
            dataIndex: 'url',
            key: 'url',
            scopedSlots: {customRender: 'url'}
        },
        {
            title: '排序',
            dataIndex: 'sortNo',
            key: 'sortNo'
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: 'center',
        }
    ]

    export default {
        name: 'PermissionList',
        mixins: [JeecgListMixin],
        components: {
            PermissionModal

        },
        data() {
            return {
                description: '这是菜单管理页面',
                // 表头
                columns: columns,
                loading: false,
                url: {
                    list: '/nmmonitor-server/menu/list',
                    delete: '/nmmonitor-server/menu/delMenuInfoByMenuId',
                    deleteBatch: '/nmmonitor-server/menu/delMenuInfoBatch'
                }
            }
        },
        methods: {
            hasPerm,
            loadData() {
                this.dataSource = [];
                getPermissionList().then((res) => {
                    if (res.success) {
                        this.dataSource = res.result;
                    }
                })
            }
        }
    }
</script>
<style scoped>

</style>