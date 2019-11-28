<template>
    <div class="dashDiv">
        <div @click="handleLogout" class="titleBtn">
            <a-icon type="poweroff"/>
            <span>&nbsp&nbsp退出</span>
        </div>
        <a-row class="titleRow">
            <a-col span="16" offset="4" class="title">
                蓝拓扑新媒体监管系统
            </a-col>
        </a-row>
        <a-row :gutter="24" class="menuDiv">
            <a-col :md="12" :sm="8" class="flexCol">
                <div class="menuOne hand" @click="jump('业务统一管理')">
                    <div class="menuLogo converge" style="height: 20% !important;"></div>
                    <div class="menuTitle" style="top: 50%;">业务统一管理</div>
                </div>
                <div class="menuTwo hand" @click="jump('综合监听监看')">
                    <div class="menuLogo examine" style="height: 20% !important;"></div>
                    <div class="menuTitle" style="top: 50%;">综合监听监看</div>
                </div>
            </a-col>
            <a-col :md="12" :sm="8" class="flexCol">
                <div class="menuThree hand" @click="jump('综合数据管理')">
                    <div class="menuLogo data" style="height: 35% !important;"></div>
                    <div class="menuTitle" style="top: 20%;">综合数据管理</div>
                </div>

                <div class="menuFour hand" @click="jump('数据综合展示')">
                    <div class="menuLogo task" style="height: 35% !important;"></div>
                    <div class="menuTitle" style="top: 20%;">数据综合展示</div>
                </div>

                <div class="menuFive hand" @click="jump('效果核查')">
                    <div class="menuLogo analysis" style="height: 35% !important;"></div>
                    <div class="menuTitle" style="top: 20%;">效果核查</div>
                </div>

                <div class="menuSix hand" @click="jump('系统管理')">
                    <div class="menuLogo system" style="height: 35% !important;"></div>
                    <div class="menuTitle" style="top: 20%;">系统管理</div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import store from '../../store'
    import {mapState, mapActions} from 'vuex'

    export default {
        computed: {
            ...mapState({
                // 后台菜单
                permissionMenuList: state => state.user.permissionList
            })
        },
        methods: {
            ...mapActions(["Logout"]),
            jump(str) {
                let routeArr = store.getters.addRouters[0].children;
                let roleName = [];
                routeArr.forEach(menu => {
                    roleName.push(menu.meta.title);
                });
                console.log(routeArr,roleName,"66666")
                if (!roleName.includes(str)) {
                    this.$message.warning('用户没有当前菜单权限！');
                } else {
                    let obj = this.permissionMenuList.find(menu => {
                        return menu.meta.title === str;
                    });
                    console.log(obj,"我是obj")
                    let menuArr = obj.children;
                    sessionStorage.setItem('menuList', JSON.stringify(menuArr));
                    console.log(menuArr[0].path,"路径")
                    if (menuArr[0].path.split('/').length === 2) {
                        this.$router.push({path: menuArr[0].children[0].path});
                    } else {
                        this.$router.push({path: menuArr[0].path});
                    }
                }
            },
            handleLogout() {
                let that = this;
                this.$confirm({
                    title: '提示',
                    content: '确定退出吗 ?',
                    onOk() {
                        return that.Logout({}).then(() => {
                            window.location.href = "/";
                            localStorage.clear();
                        }).catch(err => {
                            that.$message.error({
                                title: '错误',
                                description: err.message
                            })
                        })
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .titleBtn {
        font-size: 130%;
        color: rgb(82, 126, 249);
        cursor: pointer;
        position: absolute;
        top: 3%;
        right: 5%;
    }

    .titleRow {
        height: 10%;
        position: absolute;
        top: 5%;
        width: 100%;
        .title {
            font-size: 400%;
            font-weight: 500;
            background: linear-gradient(to bottom, #ffffff, #35b0de);
            -webkit-background-clip: text;
            color: transparent;
            text-align: center;
        }
    }

    .menuTitle {
        width: 60% !important;
        height: 20%;
        font-size: 155%;
        color: white;
        font-weight: bold;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 20%;
    }

    .menuLogo {
        width: 40% !important;
        position: relative;
        top: 15%;
        left: 30%;
    }

    .dashDiv {
        height: 100%;
        width: 100%;
        background-image: url(~@assets/dash/back.jpg);
        background-size: 100% 100%;

        .menuDiv {
            width: 70%;
            height: 60%;
            position: absolute;
            top: 20%;
            left: 15%;

            .flexCol {
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                align-content: space-between;
                justify-content: space-between;

                .menuOne {
                    height: 100%;
                    width: 48%;
                    background-image: url(~@assets/dash/menuOneBack.png);
                    background-size: 100% 100%;

                    .converge {
                        background-image: url(~@assets/dash/converge.png);
                        background-size: 100% 100%;
                    }
                }

                .menuTwo {
                    height: 100%;
                    width: 48%;
                    background-image: url(~@assets/dash/menuTwoBack.png);
                    background-size: 100% 100%;

                    .examine {
                        background-image: url(~@assets/dash/examine.png);
                        background-size: 100% 100%;
                    }
                }

                .menuThree {
                    height: 48%;
                    width: 48%;
                    background-image: url(~@assets/dash/menuThreeBack.png);
                    background-size: 100% 100%;

                    .data {
                        background-image: url(~@assets/dash/data.png);
                        background-size: 100% 100%;
                    }
                }

                .menuFour {
                    height: 48%;
                    width: 48%;
                    background-image: url(~@assets/dash/menuFourBack.png);
                    background-size: 100% 100%;

                    .task {
                        background-image: url(~@assets/dash/task.png);
                        background-size: 100% 100%;
                    }
                }

                .menuFive {
                    height: 48%;
                    width: 48%;
                    background-image: url(~@assets/dash/menuFiveBack.png);
                    background-size: 100% 100%;

                    .analysis {
                        background-image: url(~@assets/dash/analysis.png);
                        background-size: 100% 100%;
                    }
                }
                .menuSix {
                    height: 48%;
                    width: 48%;
                    background-image: url(~@assets/dash/menuSixBack.png);
                    background-size: 100% 100%;

                    .system {
                        background-image: url(~@assets/dash/system.png);
                        background-size: 100% 100%;
                    }
                }
            }
        }
    }

    .hand:hover {
        cursor: pointer;
        transform: scale(1.1);
        box-shadow:white 0px 0px 30px;
    }
</style>