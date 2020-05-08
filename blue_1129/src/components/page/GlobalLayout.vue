<template>
    <a-layout class="layout" :class="[device]" ref="windowLayout">

        <template>
            <side-menu
                    mode="inline"
                    :menus="menus"
                    :theme="navTheme"
                    :collapsed="collapsed"
                    :collapsible="true"></side-menu>
        </template>

        <a-layout
                :class="[layoutMode, `content-width-${contentWidth}`]"
                :style="{ paddingLeft: fixSiderbar ? `${sidebarOpened ? 200 : 80}px` : '0' }">
            <!-- layout header -->
            <global-header
                    :mode="layoutMode"
                    :menus="menus"
                    :theme="navTheme"
                    :collapsed="collapsed"
                    :device="device"
                    @toggle="toggle"
            />

            <!-- layout content -->
            <a-layout-content
                    :style="{ height: '100%', padding: '20px', overflowY: 'hidden', background: 'rgb(233, 238, 241)' }">
                <slot></slot>
            </a-layout-content>

            <!-- layout footer -->
            <!--      <a-layout-footer style="padding: 0px">-->
            <!--        <global-footer/>-->
            <!--      </a-layout-footer>-->
        </a-layout>

        <!--    <setting-drawer></setting-drawer>-->
    </a-layout>
</template>

<script>
    import SideMenu from '@/components/menu/SideMenu'
    import GlobalHeader from '@/components/page/GlobalHeader'
    // import GlobalFooter from '@/components/page/GlobalFooter'
    // import SettingDrawer from '@/components/setting/SettingDrawer'
    import {triggerWindowResizeEvent} from '@/utils/util'
    import {mapState, mapActions} from 'vuex'
    import {mixin, mixinDevice} from '@/utils/mixin.js'

    export default {
        name: 'GlobalLayout',
        components: {
            SideMenu,
            GlobalHeader,
            // GlobalFooter,
            // SettingDrawer
        },
        mixins: [mixin, mixinDevice],
        data() {
            return {
                collapsed: false,
                menus: []
            }
        },
        watch: {
            sidebarOpened(val) {
                this.collapsed = !val
            }
        },
        created() {
            this.menus = JSON.parse(sessionStorage.getItem('menuList'));
            // 根据后台配置菜单，重新排序加载路由信息
            console.log('----加载菜单逻辑----')
            console.log('----navTheme------' + this.navTheme)
        },
        methods: {
            ...mapActions(['setSidebar']),
            toggle() {
                this.collapsed = !this.collapsed
                this.setSidebar(!this.collapsed)
                triggerWindowResizeEvent()
            }
        },
        mounted() {
            this.xinxi = this.menus;
        }
    }
</script>

<style lang="scss">
    body {
        // 打开滚动条固定显示
        overflow: hidden;

        &.colorWeak {
            filter: invert(80%);
        }
    }


    .layout {
        min-height: 100vh !important;
        overflow: hidden;

        &.mobile {

            .ant-layout-content {
                .content {
                    margin: 24px 0 0;
                }
            }

            /**
             * ant-table-wrapper
             * 覆盖的表格手机模式样式，如果想修改在手机上表格最低宽度，可以在这里改动
             */
            .ant-table-wrapper {
                .ant-table-content {
                    overflow-y: auto;
                }

                .ant-table-body {
                    min-width: 800px;
                }
            }

            .sidemenu {
                .ant-header-fixedHeader {

                    &.ant-header-side-opened, &.ant-header-side-closed {
                        width: 100%
                    }
                }
            }

            .topmenu {
                /* 必须为 topmenu  才能启用流式布局 */
                &.content-width-Fluid {
                    .header-index-wide {
                        margin-left: 0;
                    }
                }
            }

            .header, .top-nav-header-index {
                .user-wrapper .action {
                    padding: 0 12px;
                }
            }
        }

        &.ant-layout-has-sider {
            flex-direction: row;
        }

        .trigger {
            font-size: 22px;
            line-height: 42px;
            padding: 0 18px;
            cursor: pointer;
            transition: color 300ms, background 300ms;

            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        }

        .topmenu {
            .ant-header-fixedHeader {
                position: fixed;
                top: 0;
                right: 0;
                z-index: 9;
                width: 100%;
                transition: width .2s;

                &.ant-header-side-opened {
                    width: 100%;
                }

                &.ant-header-side-closed {
                    width: 100%;
                }
            }

            /* 必须为 topmenu  才能启用流式布局 */
            &.content-width-Fluid {
                .header-index-wide {
                    max-width: unset;
                    margin-left: 24px;
                }

                .page-header-index-wide {
                    max-width: unset;
                }
            }

        }

        .sidemenu {
            position: absolute;
            left: 200px;
            right: 0;
            top: 0;
            bottom: 0;

            .ant-header-fixedHeader {
                position: fixed;
                top: 0;
                right: 0;
                z-index: 9;
                width: 100%;
                transition: width .2s;

                &.ant-header-side-opened {
                    width: calc(100% - 200px)
                }

                &.ant-header-side-closed {
                    width: calc(100% - 80px)
                }
            }
        }

        .header {
            height: 64px;
            padding: 0 12px 0 0;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
            position: relative;
        }

        .header, .top-nav-header-index {

            .user-wrapper {
                float: right;
                height: 100%;

                .action {
                    cursor: pointer;
                    padding: 0 14px;
                    display: inline-block;
                    transition: all .3s;

                    height: 70%;
                    line-height: 46px;

                    &.action-full {
                        height: 100%;
                    }

                    &:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }

                    .avatar {
                        margin: 20px 10px 20px 0;
                        color: #1890ff;
                        background: hsla(0, 0%, 100%, .85);
                        vertical-align: middle;
                    }

                    .icon {
                        font-size: 16px;
                        padding: 4px;
                    }
                }
            }

            &.dark {
                .user-wrapper {

                    .action {
                        color: black;

                        &:hover {
                            background: rgba(0, 0, 0, 0.05);
                        }
                    }
                }
            }
        }

        &.mobile {
            .top-nav-header-index {

                .header-index-wide {

                    .header-index-left {

                        .trigger {
                            color: rgba(255, 255, 255, 0.85);
                            padding: 0 12px;
                        }

                        .logo.top-nav-header {
                            text-align: center;
                            width: 56px;
                            line-height: 58px;
                        }
                    }
                }

                .user-wrapper .action .avatar {
                    margin: 20px 0;
                }

                &.light {

                    .header-index-wide {

                        .header-index-left {
                            .trigger {
                                color: rgba(0, 0, 0, 0.65);
                            }
                        }
                    }

                    //
                }
            }
        }

        &.tablet {
            // overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
            .top-nav-header-index {

                .header-index-wide {

                    .header-index-left {
                        .logo > a {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }

        }

        .top-nav-header-index {
            box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
            position: relative;
            transition: background .3s, width .2s;

            .header-index-wide {
                width: 100%;
                margin: auto;
                padding: 0 20px 0 0;
                display: flex;
                height: 59px;

                .ant-menu.ant-menu-horizontal {
                    border: none;
                    height: 64px;
                    line-height: 64px;
                }

                .header-index-left {
                    flex: 1 1;
                    display: flex;

                    .logo.top-nav-header {
                        width: 165px;
                        height: 64px;
                        position: relative;
                        line-height: 64px;
                        transition: all .3s;
                        overflow: hidden;

                        img {
                            display: inline-block;
                            vertical-align: middle;
                            height: 32px;
                        }

                        h1 {
                            color: #fff;
                            display: inline-block;
                            vertical-align: top;
                            font-size: 16px;
                            margin: 0 0 0 12px;
                            font-weight: 400;
                        }
                    }
                }

                .header-index-right {
                    float: right;
                    height: 59px;
                    overflow: hidden;

                    .action:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                }
            }

            &.light {
                background-color: #fff;

                .header-index-wide {
                    .header-index-left {
                        .logo {
                            h1 {
                                color: #002140;
                            }
                        }
                    }
                }
            }

            &.dark {

                .user-wrapper {

                    .action {
                        color: white;

                        &:hover {
                            background: rgba(255, 255, 255, 0.3);
                        }
                    }
                }

                .header-index-wide .header-index-left .trigger:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            }

        }

        // 内容区
        .layout-content {
            margin: 24px 24px 0px;
            height: 64px;
            padding: 0 12px 0 0;
        }

    }

    .topmenu {
        .page-header-index-wide {
            margin: 0 auto;
            width: 100%;
        }
    }

    // drawer-sider 自定义
    .ant-drawer.drawer-sider {
        .sider {
            box-shadow: none;
        }

        &.dark {
            .ant-drawer-content {
                background-color: rgb(0, 21, 41);
            }
        }

        &.light {
            box-shadow: none;

            .ant-drawer-content {
                background-color: #fff;
            }
        }

        .ant-drawer-body {
            padding: 0
        }
    }

    // 菜单样式
    .sider {
        box-shadow: 2px 116px 6px 0 rgba(0, 21, 41, .35);
        position: relative;
        z-index: 10;

        &.ant-fixed-sidemenu {
            position: fixed;
            height: 100%;
        }

        .logo {
            height: 64px;
            position: relative;
            line-height: 64px;
            /*padding-left: 24px;*/
            -webkit-transition: all .3s;
            transition: all .3s;
            background: #002140;
            overflow: hidden;

            img, h1 {
                display: inline-block;
                vertical-align: middle;
            }

            img {
                height: 32px;
            }

            h1 {
                color: #fff;
                font-size: 18px;
                margin: 0 0 0 8px;
                font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                font-weight: 600;
            }
        }

        .ant-menu {
            height: calc(100% - 10px);
            background-color: rgb(31, 36, 56);
            color: #7c8087;

            .ant-menu-item {
                & a {
                    color: white;
                }
            }

            .ant-menu-item-active {
                background-color: #289ef5;
                color: white;
            }

            .ant-menu-item-selected {
                background-color: #289ef5 !important;

                & a {
                    color: white;
                }

                & a:hover {
                    color: white;
                }
            }

            .ant-menu-submenu-title {
                color: white;
            }

            .ant-menu-sub {
                background: #1d232c;
            }
        }

        &.light {
            background-color: #1d2531;
            box-shadow: 2px 116px 8px 0 rgba(29, 35, 41, 0.05);

            .logo {
                background: #fff;
                box-shadow: 1px 1px 0 0 #e8e8e8;

                h1 {
                    color: unset;
                }
            }

            .ant-menu-light {
                border-right-color: transparent;
            }
        }

    }

    // 外置的样式控制
    .user-dropdown-menu-wrapper.ant-dropdown-menu {
        padding: 4px 0;

        .ant-dropdown-menu-item {
            width: 160px;
        }

        .ant-dropdown-menu-item > .anticon:first-child,
        .ant-dropdown-menu-item > a > .anticon:first-child,
        .ant-dropdown-menu-submenu-title > .anticon:first-child
        .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
            min-width: 12px;
            margin-right: 8px;
        }

    }

    // 数据列表 样式
    .table-alert {
        margin-bottom: 16px;
    }

    .table-page-search-wrapper {

        .ant-form-inline {

            .ant-form-item {
                display: flex;
                font-weight: bold;
                margin-bottom: 24px;
                margin-right: 0;

                .ant-form-item-control-wrapper {
                    flex: 1 1;
                    display: inline-block;
                    vertical-align: middle;
                }

                > .ant-form-item-label {
                    line-height: 32px;
                    padding-right: 8px;
                    width: auto;
                }

                .ant-form-item-control {
                    height: 32px;
                    line-height: 32px;
                }
            }
        }

        .table-page-search-submitButtons {
            display: block;
            margin-bottom: 24px;
            white-space: nowrap;
        }

    }

    .content {

        .table-operator {
            margin-bottom: 18px;

            button {
                margin-right: 8px;
            }
        }
    }
    // 全局的表头的样式
    .ant-table-thead > tr > th{
        background: rgb(241,243,255) !important;
    }
</style>