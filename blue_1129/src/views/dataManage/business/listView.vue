<template>
    <div style="height: 100%;">
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
                <a-row style="text-align: center;display: flex;align-items: center;" v-if="showFlag === 'publicOpinion'">
                    <a-col :md="2" :sm="8">{{item.id}}</a-col>
                    <a-col :md="4" :sm="8">{{item.name}}</a-col>
                    <a-col :md="12" :sm="8">{{item.description}}</a-col>
                    <a-col :md="4" :sm="8">{{item.time}}</a-col>
                    <a-col :md="1" :sm="8">
                        <a>详情</a>
                    </a-col>
                </a-row>
            </a-list-item>
        </a-list>
    </div>
</template>

<script>
    export default {
        name: 'listView',
        props: ['showFlag'],
        data() {
            return {
                ipagination: {
                    current: 1,
                    pageSize: 4,
                    pageSizeOptions: ['5'],
                    showTotal: (total, range) => {
                        return range[0] + "-" + range[1] + " 共" + total + "条"
                    },
                    showQuickJumper: true,
                    showSizeChanger: true,
                    total: 4,
                    onChange: (page, pageSize) => {
                        console.log(page);
                        console.log(pageSize);
                    }
                },
                columns: [],
                dataSource: []
            }
        },
        created() {
            this.loadData();
        },
        methods: {
            loadData() {
                switch (this.showFlag) {
                    case 'audioVisual': {
                        this.columns = [
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
                                name: '海报'
                            },
                            {
                                span: 12,
                                name: '简介'
                            },
                            {
                                span: 1,
                                name: '详情'
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '神奇的动物在哪里',
                                description: '《神奇动物在哪里》是由美国华纳兄弟影片公司、英国盛日影业公司联合出品的奇幻冒险电影，由英国导演大卫·叶茨执导，埃迪·雷德梅恩、凯瑟琳·沃特斯顿、艾莉森·苏朵儿、丹·福格勒等联合主演。该片讲述了神奇动物学家纽特·斯卡曼德离开霍格沃兹魔法学校后，为了寻找和保护神奇动物踏入纽约所发生的一段惊心动魄的冒险故事。该片于2016年11月18日在美国上映，2016年11月25日在中国上映。'
                            },
                            {
                                id: 2,
                                name: '神奇的动物在哪里',
                                description: '《神奇动物在哪里》是由美国华纳兄弟影片公司、英国盛日影业公司联合出品的奇幻冒险电影，由英国导演大卫·叶茨执导，埃迪·雷德梅恩、凯瑟琳·沃特斯顿、艾莉森·苏朵儿、丹·福格勒等联合主演。该片讲述了神奇动物学家纽特·斯卡曼德离开霍格沃兹魔法学校后，为了寻找和保护神奇动物踏入纽约所发生的一段惊心动魄的冒险故事。该片于2016年11月18日在美国上映，2016年11月25日在中国上映。'
                            },
                            {
                                id: 3,
                                name: '神奇的动物在哪里',
                                description: '《神奇动物在哪里》是由美国华纳兄弟影片公司、英国盛日影业公司联合出品的奇幻冒险电影，由英国导演大卫·叶茨执导，埃迪·雷德梅恩、凯瑟琳·沃特斯顿、艾莉森·苏朵儿、丹·福格勒等联合主演。该片讲述了神奇动物学家纽特·斯卡曼德离开霍格沃兹魔法学校后，为了寻找和保护神奇动物踏入纽约所发生的一段惊心动魄的冒险故事。该片于2016年11月18日在美国上映，2016年11月25日在中国上映。'
                            },
                            {
                                id: 4,
                                name: '神奇的动物在哪里',
                                description: '《神奇动物在哪里》是由美国华纳兄弟影片公司、英国盛日影业公司联合出品的奇幻冒险电影，由英国导演大卫·叶茨执导，埃迪·雷德梅恩、凯瑟琳·沃特斯顿、艾莉森·苏朵儿、丹·福格勒等联合主演。该片讲述了神奇动物学家纽特·斯卡曼德离开霍格沃兹魔法学校后，为了寻找和保护神奇动物踏入纽约所发生的一段惊心动魄的冒险故事。该片于2016年11月18日在美国上映，2016年11月25日在中国上映。'
                            }
                        ];
                        break;
                    }
                    case 'publicOpinion': {
                        this.columns = [
                            {
                                span: 2,
                                name: '排名'
                            },
                            {
                                span: 4,
                                name: '发布网站'
                            },
                            {
                                span: 12,
                                name: '文章标题'
                            },
                            {
                                span: 4,
                                name: '发布时间'
                            },
                            {
                                span: 1,
                                name: '详情'
                            }
                        ];
                        this.dataSource = [
                            {
                                id: 1,
                                name: '京新报',
                                time: '7月4日 14：12',
                                description: '宋仲基哥哥发四字中文，疑暗指女宋只手遮天，中国网友不知实情？'
                            },
                            {
                                id: 2,
                                name: '京新报',
                                time: '7月4日 14：12',
                                description: '宋仲基哥哥发四字中文，疑暗指女宋只手遮天，中国网友不知实情？'
                            },
                            {
                                id: 3,
                                name: '京新报',
                                time: '7月4日 14：12',
                                description: '宋仲基哥哥发四字中文，疑暗指女宋只手遮天，中国网友不知实情？'
                            },
                            {
                                id: 4,
                                name: '京新报',
                                time: '7月4日 14：12',
                                description: '宋仲基哥哥发四字中文，疑暗指女宋只手遮天，中国网友不知实情？'
                            }
                        ];
                        break;
                    }
                }
            },
            back() {
                this.$emit('back');
            }
        }
    }
</script>

<style scoped>

</style>