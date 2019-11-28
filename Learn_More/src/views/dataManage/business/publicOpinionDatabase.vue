<template>
    <div class="boxDiv">
        <div v-if="showFlag === 'index'">
            <a-tabs defaultActiveKey="1" @change="changeTime">
                <a-tab-pane tab="今日" key="1"></a-tab-pane>
                <a-tab-pane tab="本周" key="2"></a-tab-pane>
                <a-tab-pane tab="本月" key="3"></a-tab-pane>
                <a-button slot="tabBarExtraContent" type="primary" @click="back">返回</a-button>
            </a-tabs>

            <a-row :gutter="16">
                <a-col :md="8" :sm="8">
                    <a-card title="热点视听节目排行">
                        <a href="#" slot="extra" @click="showView('audioVisual')">更多></a>
                        <p>
                            <a-table
                                    ref="table"
                                    bordered
                                    size="middle"
                                    rowKey="id"
                                    :columns="audioVisualColumns"
                                    :dataSource="audioVisualData"
                                    :pagination="false">
                            </a-table>
                        </p>
                    </a-card>
                </a-col>
                <a-col :md="8" :sm="8">
                    <a-card title="热点两微一端节目排行">
                        <a href="#" slot="extra" @click="showView('microBlog')">更多></a>
                        <p>
                            <a-table
                                    ref="table"
                                    bordered
                                    size="middle"
                                    rowKey="id"
                                    :columns="microBlogColumns"
                                    :dataSource="microBlogData"
                                    :pagination="false">
                            </a-table>
                        </p>
                    </a-card>
                </a-col>
                <a-col :md="8" :sm="8">
                    <a-card title="热点舆情信息">
                        <a href="#" slot="extra" @click="showView('publicOpinion')">更多></a>
                        <p>
                            <a-table
                                    ref="table"
                                    bordered
                                    size="middle"
                                    rowKey="id"
                                    :columns="publicOpinionColumns"
                                    :dataSource="publicOpinionData"
                                    :pagination="false">
                            </a-table>
                        </p>
                    </a-card>
                </a-col>
            </a-row>

            <a-row :gutter="16" style="margin-top: 20px;">
                <a-col :md="8" :sm="8">
                    <a-card title="舆情关键词">
                        <p>card content</p>
                    </a-card>
                </a-col>
                <a-col :md="8" :sm="8">
                    <a-card title="舆情属性">
                        <p>card content</p>
                    </a-card>
                </a-col>
                <a-col :md="8" :sm="8">
                    <a-card title="舆情热度">
                        <p>card content</p>
                    </a-card>
                </a-col>
            </a-row>
        </div>

        <listView :showFlag="showFlag" @back="backDatabase" v-if="!['index', 'microBlog', 'audioVisual'].includes(showFlag)"></listView>

        <microBlogList @back="backDatabase" v-if="showFlag === 'microBlog'"></microBlogList>

        <audioVisualList @back="backDatabase" v-if="showFlag === 'audioVisual'"></audioVisualList>
    </div>
</template>

<script>
    import { queryDbHotTwoMicroRankList, queryDbHotVideoRankList } from '@api/api'
    import listView from './listView'
    import microBlogList from './microBlogList'
    import audioVisualList from './audioVisualList'

    export default {
        name: 'publicOpinionDatabase',
        components: {
            listView,
            microBlogList,
            audioVisualList
        },
        data() {
            return {
                audioVisualColumns: [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'rowIndex',
                        width: 60,
                        align: 'center',
                        customRender: function (t, r, index) {
                            return parseInt(index) + 1;
                        }
                    },
                    {
                        title: '节目名称',
                        align: 'center',
                        dataIndex: 'videoName'
                    },
                    {
                        title: '点击量',
                        align: 'center',
                        dataIndex: 'playcount'
                    }
                ],
                audioVisualData: [],
                microBlogColumns: [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'rowIndex',
                        width: 60,
                        align: 'center',
                        customRender: function (t, r, index) {
                            return parseInt(index) + 1;
                        }
                    },
                    {
                        title: '节目名称',
                        align: 'center',
                        dataIndex: 'videoName'
                    },
                    {
                        title: '播放次数',
                        align: 'center',
                        dataIndex: 'playcount'
                    }
                ],
                microBlogData: [],
                publicOpinionColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        dataIndex: 'id'
                    },
                    {
                        title: '热点新闻',
                        align: 'center',
                        dataIndex: 'news'
                    },
                ],
                publicOpinionData: [
                    {
                        id: 1,
                        news: '"大庆第一猛女"被拘:着仿制警服直播辱骂恐吓内容_网易新闻'
                    },
                    {
                        id: 2,
                        news: '"大庆第一猛女"被拘:着仿制警服直播辱骂恐吓内容_网易新闻'
                    },
                    {
                        id: 3,
                        news: '"大庆第一猛女"被拘:着仿制警服直播辱骂恐吓内容_网易新闻'
                    },
                    {
                        id: 4,
                        news: '"大庆第一猛女"被拘:着仿制警服直播辱骂恐吓内容_网易新闻'
                    },
                    {
                        id: 5,
                        news: '"大庆第一猛女"被拘:着仿制警服直播辱骂恐吓内容_网易新闻'
                    }
                ],
                showFlag: 'index',
            }
        },
        created() {
            this.getMicroBlogData();
            this.getAudioVisualData();
        },
        methods: {
            getMicroBlogData() {
                let param = {
                    pageNo: 1,
                    pageSize: 5
                };
                queryDbHotTwoMicroRankList(param).then(res => {
                    if (res.success) {
                        this.microBlogData = res.result.records;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getAudioVisualData() {
                let param = {
                    pageNo: 1,
                    pageSize: 5
                };
                queryDbHotVideoRankList(param).then(res => {
                    if (res.success) {
                        this.audioVisualData = res.result.records;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            changeTime() {

            },
            showView(str) {
                this.showFlag = str;
            },
            back() {
                this.$emit('back');
            },
            backDatabase() {
                this.showFlag = 'index';
            }
        }
    }
</script>

<style scoped>

</style>