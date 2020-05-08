<template>
    <div class="boxDiv">
        <a-list itemLayout="vertical" :pagination="ipagination" :dataSource="dataSource">
            <a-list-item slot="header">
                <a-row style="text-align: center;display: flex;align-items: center;">
                    <a-col v-for="col in columns" :md="col.span" :sm="8">{{col.name}}</a-col>
                    <a-col :md="1" :sm="8">
                        <a-button type="primary" @click="back">返回</a-button>
                    </a-col>
                </a-row>
            </a-list-item>

            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-row style="text-align: center;display: flex;align-items: center;">
                    <a-col :md="2" :sm="8">{{item.id}}</a-col>
                    <a-col :md="4" :sm="8">{{item.videoName}}</a-col>
                    <a-col :md="4" :sm="8">{{item.insertTime}}</a-col>
                    <a-col :md="12" :sm="8">{{item.playUrl}}</a-col>
                    <a-col :md="1" :sm="8">
                        <a>详情</a>
                    </a-col>
                </a-row>
            </a-list-item>
        </a-list>
    </div>
</template>

<script>
    import { queryDbHotTwoMicroRankList } from '@api/api'

    export default {
        name: 'microBlogList',
        data() {
            return {
                columns: [
                    {
                        span: 2,
                        name: '排名'
                    },
                    {
                        span: 4,
                        name: '节目名称'
                    },
                    {
                        span: 4,
                        name: '发布时间'
                    },
                    {
                        span: 12,
                        name: '简介'
                    },
                    {
                        span: 1,
                        name: '详情'
                    }
                ],
                dataSource: [],
                ipagination: {
                    current: 1,
                    pageSize: 5,
                    pageSizeOptions: ['5'],
                    showTotal: (total, range) => {
                        return range[0] + "-" + range[1] + " 共" + total + "条"
                    },
                    showQuickJumper: true,
                    showSizeChanger: true,
                    total: 0,
                    onChange: (page, pageSize) => {
                        this.loadData(page, pageSize);
                    }
                }
            }
        },
        created() {
            this.loadData(1, 5);
        },
        methods: {
            loadData(page, pageSize) {
                let param = {
                    pageNo: page,
                    pageSize: pageSize
                };
                this.ipagination.current = page;
                queryDbHotTwoMicroRankList(param).then(res => {
                    if (res.success) {
                        this.dataSource = res.result.records;
                        this.ipagination.total = res.result.total;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            back() {
                this.$emit('back');
            }
        }
    }
</script>

<style scoped>

</style>