<template>
    <div class="boxDiv">
        <div v-if="!infoShow">
            <div class="table-page-header-submitButtons-back">
                <span style="font-size:17px">视听节目库 / {{getName}}</span>
                <a @click="back" style="color:#1f2438;font-size:17px;">
                    <a-icon type="double-left" :style="{ fontSize: '16px', }"/>返回
                </a>
            </div>
            <a-tabs defaultActiveKey="1" @change="changeType">
                <a-tab-pane v-for="tab in tabList" :tab="tab.name" :key="tab.id"></a-tab-pane>
            </a-tabs>

            <div class="table-page-search-wrapper">
                <a-form layout="inline" v-if="programType === 'domestic'">
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
                            <a-form-item label="导演">
                                <a-input placeholder="请输入..." v-model="queryParam.director"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="播放平台">
                                <a-input placeholder="请输入..." v-model="queryParam.website"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <a-form-item label="题材">
                                <a-input placeholder="请输入..." v-model="queryParam.type"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
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

                <a-form layout="inline" v-if="programType === 'overseas'">
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

                        <a-col :md="6" :sm="8">
                            <a-form-item label="集数">
                                <a-input placeholder="请输入..." v-model="queryParam.num"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
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

                <a-form layout="inline" v-if="programType === 'standard'">
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
                            <a-form-item label="集数">
                                <a-input placeholder="请输入..." v-model="queryParam.num"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="12" :sm="8">
                            <a-form-item label="时间日期" :labelCol="{span: 3}" :wrapperCol="{span: 18}">
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
                <a-button @click="add" type="primary" v-if="programType != 'standard'">添加</a-button>
                <a-button @click="" type="primary">导入数据</a-button>
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
                        @change="handleTableChange">
                <span slot="action" slot-scope="textCheck, record">
                    <a-button @click="view" icon="eye">查看</a-button>

                    <a-divider type="vertical"/>

                    <a-dropdown v-if="programType != 'standard'">
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="">
                                <a-icon type="download"/>
                                下载
                            </a-menu-item>
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

                    <a-button @click="" icon="delete" v-else>删除</a-button>
                </span>
                </a-table>
            </div>
        </div>

        <programInfo
                :fieldList="fieldList"
                :programType="programType"
                :operation="operation"
                ref="programInfo"
                @back="backList"
                v-if="infoShow">
        </programInfo>
    </div>
</template>

<script>
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import programInfo from './programInfo'

    export default {
        name: 'programList',
        props: ['programType'],
        mixins: [JeecgListMixin],
        components: {
            JDate,
            programInfo
        },
        computed: {
          getName() {
              switch(this.programType) {
                  case 'domestic': {
                      return '境内节目库'
                  };
                  case 'overseas': {
                      return '境外节目库'
                  };
                  case 'standard': {
                      return '视听节目标准案例库'
                  };
                  case 'violation': {
                      return '违规节目库'
                  };
                  case 'internet': {
                      return '互联网电视平台节目库'
                  };
              }
          }  
        },
        data() {
            return {
                tabList: [],
                columns: [],
                dataSource: [],
                url: {
                    list: ''
                },
                infoShow: false,
                operation: true,
                fieldList: []
            }
        },
        created() {
            this.getColumns();
        },
        methods: {
            getColumns() {
                switch (this.programType) {
                    case 'domestic': {
                        this.tabList = [
                            {
                                id: 1,
                                name: '网络自制剧库'
                            },
                            {
                                id: 2,
                                name: '网络综艺节目库'
                            },
                            {
                                id: 3,
                                name: '网络动漫节目库'
                            },
                            {
                                id: 4,
                                name: '境内影视剧库'
                            },
                            {
                                id: 5,
                                name: '境内纪录片库'
                            },
                            {
                                id: 6,
                                name: '境内音频节目库'
                            },
                            {
                                id: 7,
                                name: '境内其他视听节目库'
                            }
                        ];
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
                                title: '制作机构',
                                align: 'center',
                                dataIndex: 'org'
                            },
                            {
                                title: '时长',
                                align: 'center',
                                dataIndex: 'time'
                            },
                            {
                                title: '播出时间',
                                align: 'center',
                                dataIndex: 'startTime'
                            },
                            {
                                title: '集数',
                                align: 'center',
                                dataIndex: 'num'
                            },
                            {
                                title: '链接地址',
                                align: 'center',
                                dataIndex: 'url'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: { customRender: 'action' }
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 2,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 3,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 4,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 5,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 6,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 7,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 8,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 9,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 10,
                                name: '班花朵朵',
                                org: '优酷网',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            }
                        ];
                        break;
                    }
                    case 'overseas': {
                        this.tabList = [
                            {
                                id: 1,
                                name: '境外影视剧节目库'
                            },
                            {
                                id: 2,
                                name: '境外广播电视节目库'
                            },
                            {
                                id: 3,
                                name: '境外纪录片库'
                            },
                            {
                                id: 4,
                                name: '境外音频节目库'
                            },
                            {
                                id: 5,
                                name: '境外其他视听节目总库'
                            }
                        ];
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
                                title: '时长',
                                align: 'center',
                                dataIndex: 'time'
                            },
                            {
                                title: '播出时间',
                                align: 'center',
                                dataIndex: 'startTime'
                            },
                            {
                                title: '集数',
                                align: 'center',
                                dataIndex: 'num'
                            },
                            {
                                title: '链接地址',
                                align: 'center',
                                dataIndex: 'url'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: { customRender: 'action' }
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 2,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 3,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 4,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 5,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 6,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 7,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 8,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 9,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 10,
                                name: '班花朵朵',
                                country: '美国',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            }
                        ];
                        break;
                    }
                    case 'standard': {
                        this.tabList = [
                            {
                                id: 1,
                                name: '网络视听节目审核标准案例库'
                            },
                            {
                                id: 2,
                                name: '影视剧内容审核标准案例库'
                            },
                            {
                                id: 3,
                                name: '短视频内容审核标准案列库'
                            }
                        ];
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
                                title: '违规业务',
                                align: 'center',
                                dataIndex: 'business'
                            },
                            {
                                title: '时长',
                                align: 'center',
                                dataIndex: 'time'
                            },
                            {
                                title: '播出时间',
                                align: 'center',
                                dataIndex: 'startTime'
                            },
                            {
                                title: '集数',
                                align: 'center',
                                dataIndex: 'num'
                            },
                            {
                                title: '链接地址',
                                align: 'center',
                                dataIndex: 'url'
                            },
                            {
                                title: '操作',
                                dataIndex: 'action',
                                align: 'center',
                                scopedSlots: { customRender: 'action' }
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 2,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 3,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 4,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 5,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 6,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 7,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 8,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 9,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            },
                            {
                                id: 10,
                                name: '班花朵朵',
                                business: '违规有害',
                                time: '02:30:00',
                                startTime: '2019.06.01 10:00:00',
                                num: 10,
                                url: 'www.baidu.com',
                            }
                        ];
                        break;
                    }
                }
            },
            changeType(val) {
                console.log(val);
            },
            add() {
                this.operation = true;
                this.getFieldList();
                this.infoShow = true;
            },
            view() {
                this.operation = false;
                this.getFieldList();
                this.infoShow = true;
            },
            getFieldList() {
                switch (this.programType) {
                    case 'domestic': {
                        this.fieldList = [
                            [
                                {
                                    label: '节目名称',
                                    type: 'input'
                                },
                                {
                                    label: '集数',
                                    type: 'input'
                                }
                            ],
                            [
                                {
                                    label: '制作机构',
                                    type: 'input'
                                },
                                {
                                    label: '导演',
                                    type: 'input'
                                }
                            ],
                            [
                                {
                                    label: '播出时间',
                                    type: 'date'
                                },
                                {
                                    label: '题材',
                                    type: 'input'
                                }
                            ],
                            [
                                {
                                    label: '时长',
                                    type: 'input'
                                },
                                {
                                    label: '播放平台',
                                    type: 'input'
                                }
                            ]
                        ];
                        break;
                    }
                    case 'overseas': {
                        this.fieldList = [
                            [
                                {
                                    label: '节目名称',
                                    type: 'input'
                                },
                                {
                                    label: '时长',
                                    type: 'input'
                                }
                            ],
                            [
                                {
                                    label: '制作机构',
                                    type: 'input'
                                },
                                {
                                    label: '集数',
                                    type: 'input'
                                }
                            ],
                            [
                                {
                                    label: '国别',
                                    type: 'input'
                                },
                                {
                                    label: '语言',
                                    type: 'input'
                                }
                            ],
                            [
                                {
                                    label: '播出时间',
                                    type: 'date'
                                },
                                {
                                    label: '导演',
                                    type: 'input'
                                }
                            ],
                            [
                                {
                                    label: '题材',
                                    type: 'input'
                                },
                                {
                                    label: '播放平台',
                                    type: 'input'
                                }
                            ]
                        ];
                        break;
                    }
                }
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