<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">基础数据库 / 互联网电视终端设备备案库</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="设备名称">
                                <a-input placeholder="请输入..." v-model="queryParam.ottName"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="设备型号">
                                <a-input placeholder="请输入..." v-model="queryParam.ottModel"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="厂商">
                                <a-input placeholder="请输入..." v-model="queryParam.ottFirm"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="商品来源">
                                <a-input placeholder="请输入..." v-model="queryParam.ottSource"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="10" :sm="10">
                            <a-form-item label="时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                <j-date v-model="queryParam.starttime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择开始时间"></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endtime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择结束时间"></j-date>
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

        <tvDeviceRecordForm :tvDeviceObj="tvDeviceObj" @back="backList" ref="appForm" v-else></tvDeviceRecordForm>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import tvDeviceRecordForm from './form/tvDeviceRecordForm'

    export default {
        name: 'tvDeviceRecordList',
        mixins: [JeecgListMixin],
        components: {
            JDate,
            tvDeviceRecordForm
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
                        title: '设备名称',
                        align: 'center',
                        dataIndex: 'ottName'
                    },
                    {
                        title: '设备型号',
                        align: 'center',
                        dataIndex: 'ottModel'
                    },
                    {
                        title: '厂商',
                        align: 'center',
                        dataIndex: 'ottFirm'
                    },
                    {
                        title: '设备照片',
                        align: 'center',
                        scopedSlots: {customRender: 'imgUrl'},
                        dataIndex: 'ottPicBase64'
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
                    list: '/nmmonitor-server-module-database/datebase/queryDbottList',
                    delete: '/nmmonitor-server-module-database/datebase/deleteDbott'
                },
                infoShow: false,
                tvDeviceObj: {}
            }
        },
        methods: {
            add() {
                this.infoShow = true;
                this.tvDeviceObj = {};
            },
            edit(obj) {
                this.infoShow = true;
                this.tvDeviceObj = obj;
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