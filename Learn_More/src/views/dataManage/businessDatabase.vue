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

        <reportDatabase v-if="menuShowFlag === 'reportDatabase'" @back="back"></reportDatabase>

        <publicOpinionDatabase v-if="menuShowFlag === 'publicOpinionDatabase'" @back="back"></publicOpinionDatabase>

        <videoDatabase v-if="menuShowFlag === 'videoDatabase'" @back="back"></videoDatabase>
    </div>
</template>

<script>
    import reportDatabase from './business/reportDatabase'
    import publicOpinionDatabase from './business/publicOpinionDatabase'
    import videoDatabase from './business/videoDatabase'

    export default {
        name: 'businessDatabase',
        components: {
            reportDatabase,
            publicOpinionDatabase,
            videoDatabase
        },
        data() {
            return {
                menuList: ['报告库', '视听节目舆情库', '取证视频库'],
                menuShowFlag: 'index'
            }
        },
        methods: {
            showMenu(menu) {
                switch (menu) {
                    case '报告库': {
                        this.menuShowFlag = 'reportDatabase';
                        break;
                    }
                    case '视听节目舆情库': {
                        this.menuShowFlag = 'publicOpinionDatabase';
                        break;
                    }
                    case '取证视频库': {
                        this.menuShowFlag = 'videoDatabase';
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
        height: 30%;
        width: 100%;
        position: absolute;
        top: 35%;
        display: flex;
        justify-content: space-around;
        .menu {
            height: 100%;
            width: 15%;
            cursor: pointer;
            padding: 1%;
            .menuIcon {
                height: 70%;
                width: 100%;
                background: url(~@assets/dataBase/dataBase.png);
                background-size: 100% 100%;
            }
            .menuTitle {
                width: 100%;
                margin: 20px auto;
                font-size: 100%;
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