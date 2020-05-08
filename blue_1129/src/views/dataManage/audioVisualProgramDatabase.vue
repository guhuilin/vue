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

        <programList :programType="menuShowFlag" v-if="!['violation', 'index', 'internet'].includes(menuShowFlag)" @back="back"></programList>

        <violationList v-if="menuShowFlag === 'violation'" @back="back"></violationList>
        <internetList v-if="menuShowFlag === 'internet'" @back="back"></internetList>
    </div>
</template>

<script>
    import programList from './audioVisual/programList'
    import violationList from './audioVisual/violationList'
    import internetList from './audioVisual/internetList'

    export default {
        name: 'audioVisualProgramDatabase',
        components: {
            programList,
            violationList,
            internetList
        },
        data() {
            return {
                menuList: ['境内节目库', '境外节目库', '视听节目标准案例库', '违规节目库', '互联网电视平台节目库'],
                menuShowFlag: 'index'
            }
        },
        methods: {
            showMenu(menu) {
                switch (menu) {
                    case '境内节目库': {
                        this.menuShowFlag = 'domestic';
                        break;
                    }
                    case '境外节目库': {
                        this.menuShowFlag = 'overseas';
                        break;
                    }
                    case '视听节目标准案例库': {
                        this.menuShowFlag = 'standard';
                        break;
                    }
                    case '违规节目库': {
                        this.menuShowFlag = 'violation';
                        break;
                    }
                    case '互联网电视平台节目库': {
                        this.menuShowFlag = 'internet';
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