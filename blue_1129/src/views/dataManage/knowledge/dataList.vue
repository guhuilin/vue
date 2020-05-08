<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">知识库 / {{getName}}</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <a-tabs v-model="tabs" @change="changeType" v-if="knowledgeType === 'entityObject'">
                <a-tab-pane v-for="tab in tabList" :tab="tab.name" :key="tab.id"></a-tab-pane>
            </a-tabs>

            <div class="table-page-search-wrapper">
                <a-form layout="inline" v-if="knowledgeType === 'entityObject'">
                    <a-row :gutter="24" v-if="tabs === 1">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="名称">
                                <a-input placeholder="请输入..." v-model="queryParam.name"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="声纹所属人员">
                                <a-input placeholder="请输入..." v-model="queryParam.person"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="来源">
                                <a-input placeholder="请输入..." v-model="queryParam.source"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
                                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择开始时间"></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择结束时间"></j-date>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                            <a-button type="primary" @click="loadData" icon="search">查询</a-button>
                            <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                        </span>
                        </a-col>
                    </a-row>

                    <a-row :gutter="24" v-else-if="tabs === 2">
                        <a-col :md="5" :sm="8">
                            <a-form-item label="标题名称">
                                <a-input placeholder="请输入..." v-model="queryParam.name"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="5" :sm="8">
                            <a-form-item label="来源">
                                <a-input placeholder="请输入..." v-model="queryParam.source"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="10" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
                                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择开始时间"></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择结束时间"></j-date>
                            </a-form-item>
                        </a-col>

                        <a-col :md="4" :sm="8">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                            <a-button type="primary" @click="loadData" icon="search">查询</a-button>
                            <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                        </span>
                        </a-col>
                    </a-row>

                    <a-row :gutter="24" v-else-if="tabs === 3">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="标题名称">
                                <a-input placeholder="请输入..." v-model="queryParam.name"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="作者">
                                <a-input placeholder="请输入..." v-model="queryParam.person"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="关键字">
                                <a-input placeholder="请输入..." v-model="queryParam.keyword"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
                                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择开始时间"></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择结束时间"></j-date>
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

                <a-form layout="inline" v-if="knowledgeType === 'violation'">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="节目名称">
                                <a-input placeholder="请输入..." v-model="queryParam.name"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="制作机构">
                                <a-input placeholder="请输入..." v-model="queryParam.org"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="国别">
                                <a-input placeholder="请输入..." v-model="queryParam.country"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
                                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择开始时间"></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择结束时间"></j-date>
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

                <a-form layout="inline" v-if="knowledgeType === 'corpus'">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="标题名称">
                                <a-input placeholder="请输入..." v-model="queryParam.name"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="语言">
                                <a-input placeholder="请输入..." v-model="queryParam.language"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
                                <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择开始时间"></j-date>
                                <span style="width: 10px;">~</span>
                                <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                        style="width:45%" placeholder="请选择结束时间"></j-date>
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
                <a-button @click="add" type="primary">添加</a-button>
                <a-button @click="" type="primary">导入数据</a-button>
                <a-button @click="" type="primary">导出数据</a-button>
                <span style="float: right;" v-if="tabs === 2">
                    <a-icon
                            type="bars"
                            :style="{
                                fontSize: '25px',
                                marginRight: '10px',
                                cursor: 'pointer',
                                color: openMode === 'list' ? 'white' : 'black',
                                background: openMode === 'list' ? '#1890ff' : ''
                            }"
                            @click="changeOpenMode('list')"
                    />
                    <a-icon
                            type="appstore"
                            :style="{
                                fontSize: '25px',
                                cursor: 'pointer',
                                color: openMode === 'graphical' ? 'white' : 'black',
                                background: openMode === 'graphical' ? '#1890ff' : ''
                            }"
                            @click="changeOpenMode('graphical')"
                    />
                </span>
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
                        @change="handleTableChange"
                        v-if="openMode === 'list'">
                    <template slot="imgslot" slot-scope="textCheck, record, index" v-if="tabs === 2">
                        <div class="anty-img-wrap">
                            <a-avatar shape="square" :src="record.img" icon="user"/>
                        </div>
                    </template>

                    <span slot="action" slot-scope="textCheck, record">
                        <a-button @click="view" icon="eye">查看</a-button>

                        <a-divider type="vertical"/>

                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item key="2" @click="">
                                    <a-icon type="edit"/>
                                    编辑
                                </a-menu-item>
                                <a-menu-item key="3" @click="">
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

                <div class="imgBox" v-if="openMode === 'graphical'">
                    <div class="imgDiv" v-for="img in dataSource"></div>
                </div>
            </div>
        </div>

        <knowledgeInfo :operation="operation" :fieldList="fieldList" :knowledgeType="knowType" @back="backList" v-else></knowledgeInfo>
    </div>
</template>

<script>
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import knowledgeInfo from './knowledgeInfo'

    export default {
        name: 'dataList',
        props: ['knowledgeType'],
        mixins: [JeecgListMixin],
        components: {
            JDate,
            knowledgeInfo
        },
        computed: {
            getName() {
                switch(this.knowledgeType) {
                    case 'entityObject': {
                        return '实体对象库'
                    };
                    case 'violation': {
                        return '违规线索库'
                    };
                    case 'corpus': {
                        return '语料库'
                    };
                }
            }
        },
        data() {
            return {
                tabs: 1,
                tabList: [
                    {
                        id: 1,
                        name: '声纹库'
                    },
                    {
                        id: 2,
                        name: '图片库'
                    },
                    {
                        id: 3,
                        name: '文本库'
                    }
                ],
                columns: [],
                url: {
                    list: ''
                },
                openMode: 'list',
                infoShow: false,
                operation: true,
                fieldList: [],
                knowType: ''
            }
        },
        created() {
            this.loadData();
        },
        methods: {
            loadData() {
                switch (this.knowledgeType) {
                    case 'entityObject': {
                        this.changeType(this.tabs);
                        break;
                    }
                    case 'violation': {
                        this.openMode = 'list';
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id'
                            },
                            {
                                title: '节目名称',
                                align: 'center',
                                dataIndex: 'name'
                            },
                            {
                                title: '国别',
                                align: 'center',
                                dataIndex: 'country'
                            },
                            {
                                title: '制作机构',
                                align: 'center',
                                dataIndex: 'org'
                            },
                            {
                                title: '链接',
                                align: 'center',
                                dataIndex: 'url'
                            },
                            {
                                title: '境内传播网站',
                                align: 'center',
                                dataIndex: 'website'
                            },
                            {
                                title: '发现时间',
                                align: 'center',
                                dataIndex: 'date'
                            },
                            {
                                title: '备注',
                                align: 'center',
                                dataIndex: 'remark'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: {customRender: 'action'}
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 2,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 3,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 4,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 5,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 6,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 7,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 8,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 9,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            },
                            {
                                id: 10,
                                name: '纸牌屋',
                                country: '美国',
                                org: '奈飞公司',
                                url: 'https://www.baidu.com',
                                website: '优酷',
                                date: '2019-06-11 12:00:00',
                                remark: '123123123'
                            }
                        ];
                        break;
                    }
                    case 'corpus': {
                        this.openMode = 'list';
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id'
                            },
                            {
                                title: '标题名称',
                                align: 'center',
                                dataIndex: 'name'
                            },
                            {
                                title: '音频',
                                align: 'center',
                                dataIndex: 'audio'
                            },
                            {
                                title: '对应文本',
                                align: 'center',
                                dataIndex: 'text',
                                width: 600
                            },
                            {
                                title: '语言',
                                align: 'center',
                                dataIndex: 'language'
                            },
                            {
                                title: '记录时间',
                                align: 'center',
                                dataIndex: 'date'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: {customRender: 'action'}
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 2,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 3,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 4,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 5,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 6,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 7,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 8,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 9,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            },
                            {
                                id: 10,
                                name: '超级跑跑',
                                audio: '音频',
                                text: '紧紧抖包袱的。前段时间炒的比较火的三大段子手经纪白洱、售楼先生、铜雀叔叔。基本网络大部分。因为这部分段子手，基本靠段子广告生存，为了保持热度，写了大量的口水段子。',
                                language: '汉语',
                                date: '2019-06-11 12:00:00'
                            }
                        ];
                        break;
                    }
                }
            },
            changeType(val) {
                this.openMode = 'list';
                switch (val) {
                    case 1: {
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id'
                            },
                            {
                                title: '标题名称',
                                align: 'center',
                                dataIndex: 'name'
                            },
                            {
                                title: '声纹所属人员',
                                align: 'center',
                                dataIndex: 'person'
                            },
                            {
                                title: '来源',
                                align: 'center',
                                dataIndex: 'source'
                            },
                            {
                                title: '记录时间',
                                align: 'center',
                                dataIndex: 'date'
                            },
                            {
                                title: '内容简介',
                                align: 'center',
                                dataIndex: 'content'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: {customRender: 'action'}
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 2,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 3,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 4,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 5,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 6,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 7,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 8,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 9,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 10,
                                name: '疑似违规',
                                person: '人员A',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            }
                        ];
                        break;
                    }
                    case 2: {
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id'
                            },
                            {
                                title: '标题名称',
                                align: 'center',
                                dataIndex: 'name'
                            },
                            {
                                title: '缩略图',
                                align: 'center',
                                dataIndex: 'img',
                                scopedSlots: {customRender: "imgslot"}
                            },
                            {
                                title: '来源',
                                align: 'center',
                                dataIndex: 'source'
                            },
                            {
                                title: '记录时间',
                                align: 'center',
                                dataIndex: 'date'
                            },
                            {
                                title: '内容简介',
                                align: 'center',
                                dataIndex: 'content'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: {customRender: 'action'}
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 2,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 3,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 4,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 5,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 6,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 7,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 8,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 9,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 10,
                                name: '疑似违规',
                                img: '',
                                source: 'XX节目',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            }
                        ];
                        break;
                    }
                    case 3: {
                        this.columns = [
                            {
                                title: '编号',
                                align: 'center',
                                dataIndex: 'id'
                            },
                            {
                                title: '标题名称',
                                align: 'center',
                                dataIndex: 'name'
                            },
                            {
                                title: '作者',
                                align: 'center',
                                dataIndex: 'person'
                            },
                            {
                                title: '关键字',
                                align: 'center',
                                dataIndex: 'keyword'
                            },
                            {
                                title: '来源',
                                align: 'center',
                                dataIndex: 'source'
                            },
                            {
                                title: '记录时间',
                                align: 'center',
                                dataIndex: 'date'
                            },
                            {
                                title: '内容简介',
                                align: 'center',
                                dataIndex: 'content'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: {customRender: 'action'}
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 2,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 3,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 4,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 5,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 6,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 7,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 8,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 9,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            },
                            {
                                id: 10,
                                name: '段子A',
                                person: '叫兽易小星',
                                keyword: '叫兽',
                                source: '苦苦网站',
                                date: '2019-06-11 12:00:00',
                                content: '简介简介...'
                            }
                        ];
                        break;
                    }
                }
            },
            changeOpenMode(mode) {
                this.openMode = mode;
            },
            add() {
                this.infoShow = true;
                this.operation = true;
                switch (this.knowledgeType) {
                    case 'entityObject': {
                        if (this.tabs === 1) {
                            this.knowType = 'audio';
                            this.fieldList = [
                                {
                                    label: '标题名称',
                                    type: 'input'
                                },
                                {
                                    label: '声纹所属人员',
                                    type: 'input'
                                },
                                {
                                    label: '来源',
                                    type: 'input'
                                },
                                {
                                    label: '记录时间',
                                    type: 'date'
                                }
                            ];
                        } else if (this.tabs === 2) {
                            this.knowType = 'pic';
                            this.fieldList = [
                                {
                                    label: '标题名称',
                                    type: 'input'
                                },
                                {
                                    label: '来源',
                                    type: 'input'
                                },
                                {
                                    label: '记录时间',
                                    type: 'date'
                                }
                            ];
                        } else if (this.tabs === 3) {
                            this.knowType = 'text';
                            this.fieldList = [
                                {
                                    label: '标题名称',
                                    type: 'input'
                                },
                                {
                                    label: '作者',
                                    type: 'input'
                                },
                                {
                                    label: '关键字',
                                    type: 'input'
                                },
                                {
                                    label: '来源',
                                    type: 'input'
                                },
                                {
                                    label: '记录时间',
                                    type: 'date'
                                }
                            ];
                        }
                        break;
                    }
                    case 'violation': {
                        this.knowType = 'violation';
                        this.fieldList = [
                            {
                                label: '标题名称',
                                type: 'input'
                            },
                            {
                                label: '国别',
                                type: 'input'
                            },
                            {
                                label: '制作机构',
                                type: 'input'
                            },
                            {
                                label: '链接地址',
                                type: 'input'
                            },
                            {
                                label: '境内传播网站',
                                type: 'input'
                            },
                            {
                                label: '记录时间',
                                type: 'date'
                            }
                        ];
                        break;
                    }
                    case 'corpus': {
                        this.knowType = 'corpus';
                        this.fieldList = [
                            {
                                label: '标题名称',
                                type: 'input'
                            },
                            {
                                label: '语言',
                                type: 'input'
                            },
                            {
                                label: '记录时间',
                                type: 'date'
                            }
                        ];
                        break;
                    }
                }
            },
            view() {
                this.infoShow = true;
                this.operation = false;
            },
            back() {
                this.$emit('back');
            },
            backList() {
                this.infoShow = false;
            }
        }
    }
</script>

<style scoped>

</style>

<style lang="scss" scoped>
    .imgBox {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        .imgDiv {
            height: 100px;
            width: 20%;
            border: 1px solid #000000;
        }
    }
</style>