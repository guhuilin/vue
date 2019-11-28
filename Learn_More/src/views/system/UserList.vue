<template>
    <div class="boxDiv">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="24">

                    <a-col :md="5" :sm="8">
                        <a-form-item label="账号">
                            <a-input placeholder="请输入账号查询" v-model="queryParam.userName" style="width: 100%;"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :md="5" :sm="8">
                        <a-form-item label="性别">
                            <a-select v-model="queryParam.sex" placeholder="请选择性别查询">
                                <a-select-option value="">请选择性别查询</a-select-option>
                                <a-select-option value="1">男性</a-select-option>
                                <a-select-option value="2">女性</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :md="5" :sm="8">
                        <a-form-item label="邮箱">
                            <a-input placeholder="请输入邮箱查询" v-model="queryParam.email"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :md="5" :sm="8">
                        <a-form-item label="手机号码">
                            <a-input placeholder="请输入手机号码查询" v-model="queryParam.mobile"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :md="5" :sm="8">
                        <a-form-item label="部门">
                            <a-select v-model="queryParam.departId" allowClear>
                                <a-select-option v-for="dep in departmentList" :value="dep.id" :key="dep.id">{{dep.departName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :md="5" :sm="8">
                        <a-form-item label="角色">
                            <a-select v-model="queryParam.roleId" allowClear>
                                <a-select-option v-for="role in roleList" :value="role.roleId" :key="role.roleId">{{role.roleName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :md="4" :sm="8" v-if="hasPerm('query')">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                            <a-button class="searchBtn" type="primary" @click="searchQuery" icon="search">查询</a-button>
                            <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                        </span>
                    </a-col>

                </a-row>
            </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasPerm('add')">添加用户</a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0 && hasPerm('delete')">
                <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item key="1">
                        <a-icon type="delete" @click="batchDel"/>
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
<!--                <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{-->
<!--                selectedRowKeys.length }}</a>项&nbsp;&nbsp;-->
<!--                <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--            </div>-->

            <a-table
                    ref="table"
                    bordered
                    size="middle"
                    rowKey="userId"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    @change="handleTableChange">

                <template slot="avatarslot" slot-scope="textCheck, record, index">
                    <div class="anty-img-wrap">
                        <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
                    </div>
                </template>

                <span slot="action" slot-scope="textCheck, record">
                    <a-button @click="getUserRole(record, 'edit')" icon="edit" v-if="hasPerm('edit')">编辑</a-button>

                    <a-divider type="vertical" v-if="hasPerm('edit')"/>

                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="getUserRole(record, 'detail')">
                                <a-icon type="snippets"/>
                                详情
                            </a-menu-item>
                            <a-menu-item key="2" @click="handleChangePassword(record.userName)" v-if="hasPerm('enable')">
                                <a-icon type="key"/>
                                密码
                            </a-menu-item>
                            <a-menu-item key="3" @click="handleDelete(record.userId)" v-if="hasPerm('delete')">
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

        <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

        <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>
    </div>
</template>

<script>
    import UserModal from './modules/UserModal'
    import PasswordModal from './modules/PasswordModal'
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import { queryUserRole, getAllDeportmentInfo, queryall } from '@/api/api'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'UserList',
        mixins: [JeecgListMixin],
        components: {
            UserModal,
            PasswordModal
        },
        data() {
            return {
                queryParam: {},
                columns: [
                    {
                        title: '用户账号',
                        align: 'center',
                        dataIndex: 'userName',
                    },
                    {
                        title: '真实姓名',
                        align: 'center',
                        dataIndex: 'fullName',
                    },
                    {
                        title: '头像',
                        align: 'center',
                        dataIndex: 'avatar',
                        scopedSlots: {customRender: 'avatarslot'}
                    },

                    {
                        title: '性别',
                        align: 'center',
                        dataIndex: 'sex',
                        customRender: function (t, r, index) {
                            if (t) {
                                return t === 1 ? '男' : '女';
                            } else {
                                return '--';
                            }
                        }
                    },
                    {
                        title: '台站',
                        align: 'center',
                        dataIndex: 'departName',
                        customRender: function (t, r, index) {
                            return t ? t : '--';
                        }
                    },
                    {
                        title: '角色',
                        align: 'center',
                        dataIndex: 'roleName',
                        customRender: function (t, r, index) {
                            return t ? t : '--';
                        }
                    },
                    {
                        title: '手机号码',
                        align: 'center',
                        dataIndex: 'mobile',
                        customRender: function (t, r, index) {
                            return t ? t : '--';
                        }
                    },
                    {
                        title: '邮箱',
                        align: "center",
                        dataIndex: 'email',
                        customRender: function (t, r, index) {
                            return t ? t : '--';
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center',
                    }
                ],
                departmentList: [],
                roleList: [],
                url: {
                    imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
                    list: '/nmmonitor-server/user/list',
                    delete: '/nmmonitor-server/user/delUser',
                    deleteBatch: '/nmmonitor-server/user/delUserBatch',
                },
            }
        },
        created() {
            this.getAllDeportmentInfo();
            this.queryall();
        },
        methods: {
            hasPerm,
            queryall() {
                queryall({}).then(res => {
                    if (res.success) {
                        this.roleList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getAllDeportmentInfo() {
                getAllDeportmentInfo({}).then(res => {
                    if (res.success) {
                        this.departmentList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getUserRole(user, type) {
                queryUserRole({userId: user.userId}).then((res) => {
                    if (res.success) {
                        user.selectedroles = res.result;
                        if (type === 'edit') {
                            this.handleEdit(user);
                        } else {
                            this.handleDetail(user);
                        }
                    } else {
                        console.log(res.message);
                    }
                });
            },

            getAvatarView: function (avatar) {
                return this.url.imgerver + "/" + avatar;
            },

            handleMenuClick(e) {
                this.batchDel();
            },

            handleChangePassword(username) {
                this.$refs.passwordmodal.show(username);
            },

            passwordModalOk() {
                //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
            }
        }

    }
</script>

<style scoped>

</style>