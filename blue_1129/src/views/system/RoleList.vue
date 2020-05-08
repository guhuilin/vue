<template>
    <div class="boxDiv">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <!-- 搜索区域 -->
            <a-form layout="inline">
                <a-row :gutter="24">
                    <a-col :md="6" :sm="8">
                        <a-form-item label="名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                            <a-input placeholder="请输入名称查询" v-model="queryParam.roleName"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="10" :sm="12">
                        <a-form-item label="创建时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                            <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                    style="width:45%" placeholder="请选择开始时间"></j-date>
                            <span style="width: 10px;">~</span>
                            <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                    style="width:45%" placeholder="请选择结束时间"></j-date>
                        </a-form-item>
                    </a-col>
                    <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons" v-if="hasPerm('query')">
                        <a-col :md="6" :sm="24">
                            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                            <a-button style="margin-left: 8px" @click="searchReset" icon="reload">重置</a-button>
                        </a-col>
                    </span>
                </a-row>
            </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator" style="margin-top: 5px">
            <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasPerm('add')">新增</a-button>

            <a-dropdown v-if="selectedRowKeys.length > 0 && hasPerm('delete')">
                <a-menu slot="overlay">
                    <a-menu-item key="1" @click="batchDel">
                        <a-icon type="delete"/>
                        删除
                    </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down"/>
                </a-button>
            </a-dropdown>
        </div>

        <a-divider />

        <!-- table区域-begin -->
        <div>
<!--            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--                <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择&nbsp;<a style="font-weight: 600">{{-->
<!--                selectedRowKeys.length }}</a>项&nbsp;&nbsp;-->
<!--                <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--            </div>-->

            <a-table
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="roleId"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    @change="handleTableChange">

                <span slot="action" slot-scope="textCheck, record">
                    <a-button @click="handleEdit(record)" icon="edit" v-if="hasPerm('edit')">编辑</a-button>

                    <a-divider type="vertical" v-if="hasPerm('edit')"/>

                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item @click="handlePerssion(record.roleId)" v-if="hasPerm('enable')">
                                <a-icon type="key"/>
                                授权
                            </a-menu-item>
                            <a-menu-item @click="handleDelete(record.roleId)" v-if="hasPerm('delete')">
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

        <!-- 表单区域 -->
        <role-modal ref="modalForm" @ok="modalFormOk" @close="close"></role-modal>
        <user-role-modal ref="modalUserRole"></user-role-modal>
    </div>
</template>

<script>
    import RoleModal from './modules/RoleModal'
    import UserRoleModal from './modules/UserRoleModal'
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'RoleList',
        mixins: [JeecgListMixin],
        components: {
            RoleModal,
            UserRoleModal,
            JDate
        },
        data() {
            return {
                description: '角色管理页面',
                // 查询条件
                queryParam: {roleName: '',},
                // 表头
                columns: [
                    {
                        title: '#',
                        dataIndex: '',
                        key: 'rowIndex',
                        width: 60,
                        align: 'center',
                        customRender: function (t, r, index) {
                            return parseInt(index) + 1;
                        }
                    },
                    {
                        title: '角色名称',
                        align: 'center',
                        dataIndex: 'roleName'
                    },
                    {
                        title: '用户人数',
                        align: 'center',
                        dataIndex: 'totalPerson'
                    },
                    {
                        title: '备注',
                        align: 'center',
                        dataIndex: 'roleDesc'
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        align: 'center',
                        sorter: true
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        align: 'center',
                        scopedSlots: {customRender: 'action'},
                    }
                ],
                url: {
                    list: '/nmmonitor-server/role/list',
                    delete: '/nmmonitor-server/role/delRole',
                    deleteBatch: '/nmmonitor-server/role/delRoleBatch'
                },
            }
        },
        methods: {
            hasPerm,
            handlePerssion: function (roleId) {
                this.$refs.modalUserRole.show(roleId);
            },
            close() {
                this.loadData();
            }
        }
    }
</script>

<style scoped>

</style>