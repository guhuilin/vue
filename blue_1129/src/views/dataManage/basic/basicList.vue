<template>
    <div class="boxDiv">
        <div v-if="infoShow === 'index'">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">基础数据库 / {{getName}}</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8" v-for="search in searchForm">
                            <a-form-item :label="search.label">
                                <a-input placeholder="请输入..." v-if="search.type === 'input'" v-model="queryParam[search.value]"></a-input>
                                <a-select style="width: 100%;" v-else-if="search.type === 'select'" v-model="queryParam[search.value]">
                                    <a-select-option value="jack">测试</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8" v-if="['icpInfo', 'shortVideoWebsiteRecord'].includes(basicType)">
                            <a-form-item label="发现时间从" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
                                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD" style="width:45%" placeholder="请选择开始时间" ></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD" style="width:45%" placeholder="请选择结束时间"></j-date>
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
                <a-button @click="" type="primary" v-if="!['icpInfo', 'shortVideoWebsiteRecord', 'liveWebsiteRecord'].includes(basicType)">下载模板</a-button>
                <a-button @click="" type="primary" v-if="!['icpInfo'].includes(basicType)">导入数据</a-button>
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
                        <a-button @click="" icon="edit">编辑</a-button>

                        <a-divider type="vertical"/>

                        <a-button type="danger" @click="" icon="delete">删除</a-button>
                    </span>
                </a-table>
            </div>
        </div>

        <icpForm @back="backList" v-else-if="infoShow === 'icpInfo'"></icpForm>
        <shortVideoWebsiteRecordForm @back="backList" v-else-if="infoShow === 'shortVideoWebsiteRecord'"></shortVideoWebsiteRecordForm>
        <liveWebsiteRecordForm @back="backList" v-else-if="infoShow === 'liveWebsiteRecord'"></liveWebsiteRecordForm>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import icpForm from './form/icpForm'
    import shortVideoWebsiteRecordForm from './form/shortVideoWebsiteRecordForm';
    import liveWebsiteRecordForm from './form/liveWebsiteRecordForm';

    export default {
        name: 'basicList',
        props: ['basicType', 'searchForm'],
        mixins: [JeecgListMixin],
        components: {
            JDate,
            icpForm,
            shortVideoWebsiteRecordForm,
            liveWebsiteRecordForm
        },
        data() {
            return {
                columns: [],
                url: {
                    list: ''
                },
                infoShow: 'index',
                operation: true,
                fieldList: [],
            }
        },
        computed: {
            getName() {
                switch(this.basicType) {
                    case 'visualWebsiteOrgInfo': {
                        return '视听网站机构信息库';
                        break;
                    }
                    case 'avspInfo': {
                        return 'AVSP信息库';
                        break;
                    }
                    case 'appInfo': {
                        return 'APP信息库';
                        break;
                    }
                    case 'tvDeviceRecord': {
                        return '互联网电视终端设备备案库';
                        break;
                    }
                    case 'abroadInfo': {
                        return '网上境外剧引进信息库';
                        break;
                    }
                    case 'icpInfo': {
                        return 'ICP信息库';
                        break;
                    }
                    case 'shortVideoWebsiteRecord': {
                        return '短视频网站备案库';
                        break;
                    }
                    case 'liveWebsiteRecord': {
                        return '直播网站备案库';
                        break;
                    }
                }
            }
        },
        created() {
            this.loadTable();
        },
        methods: {
            loadTable() {
                switch (this.basicType) {
                    case 'icpInfo': {
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id'
                            },
                            {
                                title: '网站名称',
                                align: 'center',
                                dataIndex: 'website'
                            },
                            {
                                title: '网站域名',
                                align: 'center',
                                dataIndex: 'domainName'
                            },
                            {
                                title: 'ip地址',
                                align: 'center',
                                dataIndex: 'ip'
                            },
                            {
                                title: '网站备案名称',
                                align: 'center',
                                dataIndex: 'record'
                            },
                            {
                                title: 'icp备案号',
                                align: 'center',
                                dataIndex: 'icpRecord'
                            },
                            {
                                title: '所属区域',
                                align: 'center',
                                dataIndex: 'area'
                            },
                            {
                                title: '主办单位名称',
                                align: 'center',
                                dataIndex: 'org'
                            },
                            {
                                title: '主办单位性质',
                                align: 'center',
                                dataIndex: 'type'
                            },
                            {
                                title: '记录时间',
                                align: 'center',
                                dataIndex: 'time'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                scopedSlots: {customRender: 'action'},
                                align: 'center',
                                fixed: 'right',
                                width: 200
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 2,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 3,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 4,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 5,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 6,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 7,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 8,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 9,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            },
                            {
                                id: 10,
                                website: '土豆',
                                domainName: 'http://www',
                                ip: '192.168.1.1',
                                record: '土豆',
                                icpRecord: 'ICP233944',
                                area: '东城区',
                                org: '百度在线',
                                type: '国有企业',
                                time: '2019-01-01 11:32:32'
                            }
                        ];
                        break;
                    }
                    case 'shortVideoWebsiteRecord': {
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id',
                                width: 60
                            },
                            {
                                title: '网站名称',
                                align: 'center',
                                dataIndex: 'website',
                                width: 100
                            },
                            {
                                title: '域名',
                                align: 'center',
                                dataIndex: 'domainName',
                                width: 150
                            },
                            {
                                title: '地址',
                                align: 'center',
                                dataIndex: 'address',
                                width: 60
                            },
                            {
                                title: 'ICP备案号',
                                align: 'center',
                                dataIndex: 'icpRecord',
                                width: 100
                            },
                            {
                                title: 'ip地址',
                                align: 'center',
                                dataIndex: 'ip',
                                width: 150
                            },
                            {
                                title: '开办单位类型',
                                align: 'center',
                                dataIndex: 'orgType',
                                width: 150
                            },
                            {
                                title: '是否有app',
                                align: 'center',
                                dataIndex: 'app',
                                width: 100
                            },
                            {
                                title: 'app列表',
                                align: 'center',
                                dataIndex: 'appList',
                                width: 100
                            },
                            {
                                title: '支持上传节目',
                                align: 'center',
                                dataIndex: 'upload',
                                width: 120
                            },
                            {
                                title: '提供网络直播',
                                align: 'center',
                                dataIndex: 'live',
                                width: 120
                            },
                            {
                                title: '网站资质',
                                align: 'center',
                                dataIndex: 'websiteType',
                                width: 100
                            },
                            {
                                title: '节目更新情况' ,
                                align: 'center',
                                dataIndex: 'update',
                                width: 120
                            },
                            {
                                title: '日均ip访问量' ,
                                align: 'center',
                                dataIndex: 'ipNum',
                                width: 120
                            },
                            {
                                title: '日均pv访问量' ,
                                align: 'center',
                                dataIndex: 'pvNum',
                                width: 120
                            },
                            {
                                title: 'alex排名' ,
                                align: 'center',
                                dataIndex: 'alex',
                                width: 100
                            },
                            {
                                title: '记录时间' ,
                                align: 'center',
                                dataIndex: 'time',
                                width: 100
                            },
                            {
                                title: '验证效果' ,
                                align: 'center',
                                dataIndex: 'state',
                                width: 100
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                scopedSlots: {customRender: 'action'},
                                align: 'center',
                                fixed: 'right',
                                width: 200
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 2,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 3,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 4,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 5,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 6,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 7,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 8,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 9,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            },
                            {
                                id: 10,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                upload: '是',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                                state: '验证'
                            }
                        ];
                        break;
                    }
                    case 'liveWebsiteRecord': {
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id'
                            },
                            {
                                title: '网站名称',
                                align: 'center',
                                dataIndex: 'website'
                            },
                            {
                                title: '域名',
                                align: 'center',
                                dataIndex: 'domainName'
                            },
                            {
                                title: '地址',
                                align: 'center',
                                dataIndex: 'address'
                            },
                            {
                                title: 'ICP备案号',
                                align: 'center',
                                dataIndex: 'icpRecord'
                            },
                            {
                                title: 'ip地址',
                                align: 'center',
                                dataIndex: 'ip'
                            },
                            {
                                title: '开办单位类型',
                                align: 'center',
                                dataIndex: 'orgType'
                            },
                            {
                                title: '是否有app',
                                align: 'center',
                                dataIndex: 'app'
                            },
                            {
                                title: 'app列表',
                                align: 'center',
                                dataIndex: 'appList'
                            },
                            {
                                title: '提供网络直播',
                                align: 'center',
                                dataIndex: 'live',
                            },
                            {
                                title: '网站资质',
                                align: 'center',
                                dataIndex: 'websiteType',
                            },
                            {
                                title: '节目更新情况' ,
                                align: 'center',
                                dataIndex: 'update',
                            },
                            {
                                title: '日均ip访问量' ,
                                align: 'center',
                                dataIndex: 'ipNum',
                            },
                            {
                                title: '日均pv访问量' ,
                                align: 'center',
                                dataIndex: 'pvNum',
                            },
                            {
                                title: 'alex排名' ,
                                align: 'center',
                                dataIndex: 'alex',
                            },
                            {
                                title: '记录时间' ,
                                align: 'center',
                                dataIndex: 'time',
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                scopedSlots: {customRender: 'action'},
                                align: 'center',
                                fixed: 'right',
                                width: 200
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 2,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 3,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 4,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 5,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 6,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 7,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 8,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 9,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            },
                            {
                                id: 10,
                                website: '快手',
                                domainName: 'www.kuaishou.com',
                                address: '北京',
                                icpRecord: '030173',
                                ip: '192.168.22.34',
                                orgType: '私营',
                                app: '是',
                                appList: '快手',
                                live: '是',
                                websiteType: '短视频',
                                update: '有更新',
                                ipNum: 10000,
                                pvNum: 10000,
                                alex: 12,
                                time: '2019-01-01',
                            }
                        ];
                        break;
                    }
                }
                this.loadData();
            },
            add() {
                this.infoShow = this.basicType;
            },
            back() {
                this.$emit('back');
            },
            backList() {
                this.infoShow = 'index';
            }
        }
    }
</script>

<style scoped>
    >>> .formTitle {
        height: 50px;
        line-height: 50px;
        font-size: 25px;
        font-weight: bold;
        text-align: center;
    }
</style>