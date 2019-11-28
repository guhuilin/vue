<template>
    <div style="height: 87%;margin-top: 1%;">
        <a-row :gutter="24" style="height: 100%;">
            <a-col :md="4" :sm="24" class="leftDiv">
                <div style="height: 100%;background: white;">
                    <div class="title">
                        <div class="flag"></div>
                        &nbsp;&nbsp;违规分类
                    </div>
                    <div class="treeDiv">
                        <a-tree :treeData="programTree" :selectedKeys="selectedKeys" @select="onSelect">
                            <span slot="title" style="color: #1890ff">parent 1</span>
                        </a-tree>
                    </div>
                </div>
            </a-col>

            <a-col :md="20" :sm="24" class="rightDiv">
                <div style="min-height: 100%;background: white;">
                    <a-row class="title">
                        <div class="flag"></div>
                        &nbsp;&nbsp;文本违规列表
                    </a-row>

                    <div class="searDiv">
                        <a-form layout="inline">
                            <a-row :gutter="6">
                                <a-col :md="5" :sm="6">
                                    <a-form-item label="节目名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }"
                                                 style="width: 100%;">
                                        <a-input v-model="queryParam.programName" placeholder="请输入..."/>
                                    </a-form-item>
                                </a-col>

                                <a-col :md="5" :sm="6">
                                    <a-form-item label="所属站点" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }"
                                                 style="width: 100%;">
                                        <a-select v-model="queryParam.source">
                                            <a-select-option v-for="web in website" :value="web" :key="web">{{web}}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>

                                <a-col :md="9" :sm="6">
                                    <a-form-item label="创建时间" :labelCol="{span: 5}" :wrapperCol="{span: 19}"
                                                 style="width: 100%;">
                                        <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                                style="width:45%" placeholder="请选择开始时间"></j-date>
                                        <span style="width: 10px;">~</span>
                                        <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                                style="width:45%" placeholder="请选择结束时间"></j-date>
                                    </a-form-item>
                                </a-col>

                                <a-col :md="5" :sm="6" v-if="hasPerm('query')">
                                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                                    <a-button type="primary" icon="search" style="background-color: #43d457;border: none;"
                                              @click="search">查询</a-button>
                                    <a-button type="primary" icon="reload" style="background-color: #ffae00;border: none;margin-left: 5px"
                                              @click="reset">重置</a-button>
                                </span>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>

                    <a-table
                            style="margin-top: 1%;"
                            ref="table"
                            size="middle"
                            rowKey="name"
                            :columns="columns"
                            :dataSource="dataSource"
                            :pagination="ipagination"
                            :loading="loading"
                            :scroll="{x: 1500}"
                            @change="handleTableChange">

                    <span slot="titleSlot" slot-scope="textCheck, record">
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                              <span v-html="record.title"></span>
                            </template>
                            <span v-html="record.title" class="titleSpan"></span>
                        </a-tooltip>
                    </span>

                        <span slot="action" slot-scope="textCheck, record">
                        <a-button type="primary" size="small" style="background-color: #37b047;border: none;" @click="showUrl(record.url)" icon="eye">查看</a-button>
                    </span>

                    </a-table>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import { JeecgListMixin } from '@/mixins/JeecgListMixin'
    import JDate from '@/components/jeecg/JDate'
    import { getProgramCategroyInfoListOld, getSiteInfoList } from '@api/api'
    import { hasPerm } from "@/utils/authFilter";

    export default {
        name: 'textCheck',
        mixins: [JeecgListMixin],
        components: {
            JDate
        },
        data() {
            return {
                website: [],
                programTree: [],
                selectedKeys: [],
                columns: [
                    {
                        title: '节目名称',
                        dataIndex: 'title',
                        scopedSlots: {customRender: 'titleSlot'},
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '所属站点',
                        dataIndex: 'source',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '关键词',
                        dataIndex: 'rule',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '发布时间',
                        dataIndex: 'uploadtime',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '节目地址',
                        dataIndex: 'url',
                        align: 'center',
                        width: 300
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: 'center',
                        fixed: 'right',
                        width: 100
                    }
                ],
                url: {
                    list: '/nmmonitor-server/program/getViolateTextProgramInfoList'
                }
            }
        },
        created() {
            this.getProgramCategroyInfoListOld();
            this.getSiteInfoList();
        },
        methods: {
            hasPerm,
            getSiteInfoList() {
                getSiteInfoList({}).then((res) => {
                    if (res.success) {
                        this.website = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getProgramCategroyInfoListOld() { 
                getProgramCategroyInfoListOld({}).then((res) => {
                    if (res.success) {
                        this.programTree = res.result;
                        this.getListData('');
                    } else {
                        console.log(res.message);
                    }
                });
            },
            onSelect(selectedKeys, e) {
                let record = e.node.dataRef;
                this.selectedKeys = [record.key];
                this.getListData(this.selectedKeys[0]);
            },
            getListData(categoryId) {
                this.queryParam.categoryId = categoryId;
                if (categoryId) {
                    this.loadData(1);
                }
            },
            search() {
                this.loadData(1);
            },
            reset() {
                this.queryParam.programName = '';
                this.queryParam.source = '';
                this.queryParam.startTime = '';
                this.queryParam.endTime = '';
                this.loadData(1);
            },
            showUrl(url) {
                window.open(url);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        height: 5%;
        display: flex;
        align-items: center;
        padding-left: 10px;
        font-size: 15px;
        font-weight: bold;

        .flag {
            height: 11px;
            width: 11px;
            background-color: #ff4e2b;
            border-radius: 100%;
        }
    }

    .leftDiv {
        height: 100%;

        .treeDiv {
            height: 95%;
            overflow: auto;
        }
    }

    .rightDiv {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        .searDiv {
            height: 5%;
            padding-left: 15px;
        }

        .titleSpan {
            display: inline-block;
            white-space: nowrap;
            width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>