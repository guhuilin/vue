<template>
    <a-layout-sider
            :class="['sider', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
            width="200px"
            :collapsible="collapsible"
            v-model="collapsed"
            :trigger="null">
        <logo/>
        <s-menu
                :collapsed="true"
                :menu="menus"
                :theme="theme"
                @select="onSelect"
                :mode="mode"
                :style="{padding: '0', height: getHeight, overflowY: 'auto', overflowX: 'hidden'}"></s-menu>
    </a-layout-sider>

</template>

<script>
    import ALayoutSider from "ant-design-vue/es/layout/Sider"
    import Logo from '../tools/Logo'
    import SMenu from './index'
    import {mixin, mixinDevice} from '@/utils/mixin.js'

    export default {
        name: "SideMenu",
        components: {Logo, ALayoutSider, SMenu},
        mixins: [mixin, mixinDevice],
        props: {
            mode: {
                type: String,
                required: false,
                default: 'inline'
            },
            theme: {
                type: String,
                required: false,
                default: 'dark'
            },
            collapsible: {
                type: Boolean,
                required: false,
                default: false
            },
            collapsed: {
                type: Boolean,
                default: true
            },
            menus: {
                type: Array,
                required: true
            }
        },
        computed: {
            getHeight() {
                return (window.innerHeight - 59) + 'px';
            }
        },
        methods: {
            onSelect(obj) {
                this.$emit('menuSelect', obj)
            }
        }
    }
</script>