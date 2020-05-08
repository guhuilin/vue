<template>
    <div style="height: 100%;background: white;padding: 0px;position:relative">
        <div class="menuRow" v-if="menuShowFlag === 'index'">
            <div class="menu" v-for="menu in menuList" @click="showMenu(menu)">
                <div class="menuIcon"></div>
                <div class="menuTitle">
                    {{menu}}
                </div>
            </div>
        </div>

        <basicList :basicType="menuShowFlag" :searchForm="searchForm" @back="back"
                   v-if="!['index', 'appInfo', 'avspInfo', 'visualWebsiteOrgInfo', 'tvDeviceRecord', 'abroadInfo'].includes(menuShowFlag)"></basicList>

        <appInfoList @back="back" v-if="menuShowFlag === 'appInfo'"></appInfoList>
        <avspInfoList @back="back" v-if="menuShowFlag === 'avspInfo'"></avspInfoList>
        <visualWebsiteOrgInfoList @back="back" v-if="menuShowFlag === 'visualWebsiteOrgInfo'"></visualWebsiteOrgInfoList>
        <tvDeviceRecordList @back="back" v-if="menuShowFlag === 'tvDeviceRecord'"></tvDeviceRecordList>
        <abroadInfoList @back="back" v-if="menuShowFlag === 'abroadInfo'"></abroadInfoList>
    </div>
</template>

<script>
    import basicList from './basic/basicList'
    import appInfoList from './basic/appInfoList'
    import avspInfoList from './basic/avspInfoList'
    import visualWebsiteOrgInfoList from './basic/visualWebsiteOrgInfoList'
    import tvDeviceRecordList from './basic/tvDeviceRecordList'
    import abroadInfoList from './basic/abroadInfoList'

    export default {
        name: 'basicDatabase',
        components: {
            basicList,
            appInfoList,
            avspInfoList,
            visualWebsiteOrgInfoList,
            tvDeviceRecordList,
            abroadInfoList
        },
        data() {
            return {
                menuList: [
                    '视听网站机构信息库',
                    'AVSP信息库',
                    'APP信息库',
                    'ICP信息库',
                    '互联网电视终端设备备案库',
                    '网上境外剧引进信息库',
                    '短视频网站备案库',
                    '直播网站备案库'
                ],
                menuShowFlag: 'index',
                searchForm: []
            }
        },
        methods: {
            showMenu(menu) {
                switch (menu) {
                    case '视听网站机构信息库': {
                        this.menuShowFlag = 'visualWebsiteOrgInfo';
                        break;
                    }
                    case 'AVSP信息库': {
                        this.menuShowFlag = 'avspInfo';
                        break;
                    }
                    case 'APP信息库': {
                        this.menuShowFlag = 'appInfo';
                        break;
                    }
                    case 'ICP信息库': {
                        this.menuShowFlag = 'icpInfo';
                        this.searchForm = [
                            {
                                label: '网站名称',
                                type: 'input'
                            },
                            {
                                label: '网站域名',
                                type: 'input'
                            },
                            {
                                label: 'icp备案号',
                                type: 'input'
                            },
                            {
                                label: '所属区域',
                                type: 'input'
                            }
                        ];
                        break;
                    }
                    case '互联网电视终端设备备案库': {
                        this.menuShowFlag = 'tvDeviceRecord';
                        break;
                    }
                    case '网上境外剧引进信息库': {
                        this.menuShowFlag = 'abroadInfo';
                        break;
                    }
                    case '短视频网站备案库': {
                        this.menuShowFlag = 'shortVideoWebsiteRecord';
                        this.searchForm = [
                            {
                                label: '网站名称',
                                type: 'input'
                            },
                            {
                                label: '域名',
                                type: 'input'
                            },
                            {
                                label: '地点',
                                type: 'input'
                            },
                            {
                                label: 'ip地址',
                                type: 'input'
                            },
                            {
                                label: '开办单位类别',
                                type: 'select'
                            },
                            {
                                label: '支持上传节目',
                                type: 'select'
                            },
                            {
                                label: '网站资质',
                                type: 'select'
                            },
                            {
                                label: '节目更新情况',
                                type: 'select'
                            },
                            {
                                label: '验证效果',
                                type: 'input'
                            }
                        ];
                        break;
                    }
                    case '直播网站备案库': {
                        this.menuShowFlag = 'liveWebsiteRecord';
                        this.searchForm = [
                            {
                                label: '网站名称',
                                type: 'input'
                            },
                            {
                                label: '域名',
                                type: 'input'
                            },
                            {
                                label: '地点',
                                type: 'input'
                            },
                            {
                                label: 'ip地址',
                                type: 'input'
                            },
                            {
                                label: '开办单位类别',
                                type: 'select'
                            },
                            {
                                label: '网站资质',
                                type: 'select'
                            },
                            {
                                label: '验证效果',
                                type: 'input'
                            },
                            {
                                label: '节目更新情况',
                                type: 'select'
                            }
                        ];
                        break;
                    }
                }
            },
            back() {
                this.menuShowFlag = 'index';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .menuRow {
        height: 60%;
        width: 100%;
        position: absolute;
        top: 20%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .menu {
            height: 50%;
            width: 21%;
            cursor: pointer;
            padding: 1%;
            margin: 10px auto;
            .menuIcon {
                height: 70%;
                width: 69%;
                margin: auto;
                background: url(~@assets/dataBase/dataBase.png);
                background-size: 100% 100%;
            }
            .menuTitle {
                width: 78%;
                margin: 20px auto;
                font-size: 98%;
                font-weight: bold;
                border: 1px solid;
                border-radius: 8px;
                color: white;
                background: #5868d9;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>