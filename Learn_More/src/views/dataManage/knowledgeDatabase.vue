<template>
    <div style="height: 100%;background: white;padding: 20px;position:relative">
        <div class="menuRow" v-if="menuShowFlag === 'index'">
            <div class="menu" v-for="menu in menuList" @click="showMenu(menu)">
                <div class="menuIcon"></div>
                <div class="menuTitle">
                    {{menu}}
                </div>
            </div>
        </div>

        <dataList :knowledgeType="menuShowFlag" @back="back" v-if="menuShowFlag != 'index'"></dataList>
    </div>
</template>

<script>
    import dataList from './knowledge/dataList'

    export default {
        name: 'knowledgeDatabase',
        components: {
            dataList
        },
        data() {
            return {
                menuList: ['实体对象库', '违规线索库', '语料库', '标引规则库', '行业知识库'],
                menuShowFlag: 'index'
            }
        },
        methods: {
            showMenu(menu) {
                switch (menu) {
                    case '实体对象库': {
                        this.menuShowFlag = 'entityObject';
                        break;
                    }
                    case '违规线索库': {
                        this.menuShowFlag = 'violation';
                        break;
                    }
                    case '语料库': {
                        this.menuShowFlag = 'corpus';
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