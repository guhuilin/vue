<template>
    <div class="user-wrapper" :class="theme">
        <!--    <header-notice class="action"/>-->
        <!--    <a-dropdown>-->
        <span class="username">
            <span style="cursor: pointer;display: flex;align-items: center;" @click="goToPersonalInfo">
                <a-avatar class="avatar" size="small" :src="getAvatar()"/>
                <span :title="nickname()" style="margin-left: 5px;width:120px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">欢迎您，{{ nickname() }}</span>
            </span>
            <span class="action action-full ant-dropdown-link user-dropdown-menu" @click="handleLogout">
                <a-icon type="poweroff"/>
            </span>
        </span>
        <!--      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">-->
        <!--        <a-menu-item key="1" @click="updatePassword">-->
        <!--          <a-icon type="setting"/>-->
        <!--          <span>密码修改</span>-->
        <!--        </a-menu-item>-->
        <!--        <a-menu-item key="2" @click="handleLogout">-->
        <!--          <a-icon type="logout"/>-->
        <!--          <span>退出登录</span>-->
        <!--        </a-menu-item>-->
        <!--      </a-menu>-->
        <!--    </a-dropdown>-->
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {mixinDevice} from '@/utils/mixin.js'

    export default {
        name: "UserMenu",
        mixins: [mixinDevice],
        props: {
            theme: {
                type: String,
                required: false,
                default: 'dark'
            }
        },
        methods: {
            ...mapActions(["Logout"]),
            ...mapGetters(["nickname", "avatar", "userInfo"]),
            getAvatar() {
                return window._CONFIG['imgDomainURL'] + "/" + this.avatar();
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
            goToPersonalInfo() {
                this.$router.push({path: '/personal/info'});
            }
        }
    }
</script>

<style scoped>
    .logout_title {
        color: inherit;
        text-decoration: none;
    }
    .username {
        display: flex;
        align-items: center;
        justify-content: space-around;
        max-width: 200px;
    }
</style>