<template>
    <a-locale-provider :locale="locale">
        <div id="app">
            <!-- 添加了一个keep-alive将需要的路由缓存一下 -->
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view/>
        </div>
    </a-locale-provider>
</template>
<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import Vue from 'vue'
    import { USER_INFO } from "@/store/mutation-types"
    import webSocket from './webSocket'
    export default {
        data() {
            return {
                locale: zhCN
            }
        },
        mounted(){
            // console.log(webSocket)
            // webSocket.oWs()
        }
    }
</script>
<style>
    #app {
        height: 100%;
    }
</style>

<style scoped>
    @import '~@assets/less/common.less'
</style>