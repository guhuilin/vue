<template>
    <global-layout>
        <transition>
            <div style="height: 100%;overflow-x: hidden;">
                <transition name="fade-transverse">
                    <router-view/>
                </transition>
            </div>
        </transition>
    </global-layout>
</template>

<script>
    import GlobalLayout from '@/components/page/GlobalLayout'
    import Contextmenu from '@/components/menu/Contextmenu'
    import {mixin, mixinDevice} from '@/utils/mixin.js'
    import breadcrumb from '@/components/tools/Breadcrumb'

    export default {
        name: 'TabLayout',
        components: {
            GlobalLayout,
            Contextmenu,
            breadcrumb
        },
        mixins: [mixin, mixinDevice],
        data() {
            return {
                spinning: false
            }
        },
        watch: {
            '$route': function (newRoute) {
                this.spinning = true;
                setTimeout(() => {
                    this.spinning = false;
                }, 500);
            },
        },
        methods: {

        }
    }
</script>

<style lang="scss">
    .page-transition-enter {
        opacity: 0;
    }

    .page-transition-leave-active {
        opacity: 0;
    }

    .page-transition-enter .page-transition-container,
    .page-transition-leave-active .page-transition-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    /*美化弹出Tab样式*/
    .ant-tabs-nav-container {
        margin-top: 4px;
    }

    /* 修改 ant-tabs 样式 */
    .tab-layout-tabs.ant-tabs {
        border-bottom: 1px solid #ccc;
        border-left: 1px solid #ccc;
        background-color: white;
        padding: 0 20px;

        .ant-tabs-bar {
            margin: 4px 0 0;
            border: none;
        }

    }

    .ant-tabs {

        &.ant-tabs-card .ant-tabs-tab {

            padding: 0 24px !important;
            background-color: white !important;
            margin-right: 10px !important;

            .ant-tabs-close-x {
                width: 12px !important;
                height: 12px !important;
                opacity: 0 !important;
                cursor: pointer !important;
                font-size: 12px !important;
                margin: 0 !important;
                position: absolute;
                top: 36%;
                right: 6px;
            }

            &:hover .ant-tabs-close-x {
                opacity: 1 !important;
            }

        }

    }

    .ant-tabs.ant-tabs-card > .ant-tabs-bar {
        .ant-tabs-tab {
            border: none !important;
            border-bottom: 1px solid transparent !important;
        }

        .ant-tabs-tab-active {
            border-color: #1890ff !important;
        }
    }

    // 过渡动画 横向渐变
    .fade-transverse-leave-active,
    .fade-transverse-enter-active {
        transition: all .5s;
    }
    .fade-transverse-enter {
        opacity: 0;
        transform: translateX(-30px);
    }
    .fade-transverse-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
</style>