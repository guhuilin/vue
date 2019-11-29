<template>
    <div class="logo" @click="goToDash">
        <router-link :to="{name:'dashboard'}">
            <img :src="getIcon" alt="logo">
            <h1 v-if="showTitle">{{ title }}</h1>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'Logo',
        props: {
            title: {
                type: String,
                default: '首页',
                required: false
            },
            showTitle: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        computed: {
            getIcon() {
                return window._CONFIG['systemIconUrl'];
            }
        },
        methods: {
            goToDash() {
                this.$router.push({path: '/dashboard'});
            }
        }
    }
</script>
<style lang="scss" scoped>
    /*缩小首页布 局顶部的高度*/
    $height: 59px;

    .sider {
        box-shadow: none !important;

        .logo {
            height: $height !important;
            line-height: $height !important;
            box-shadow: none !important;
            transition: background 300ms;
            width: 100%;
            text-align: center;

            a {
                color: white;

                &:hover {
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }

        &.light .logo {
            background-color: rgb(36, 44, 80);
        }
    }
</style>