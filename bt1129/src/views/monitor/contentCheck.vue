<template>
    <a-row :gutter="10" style="height: 100%;">
        <a-spin :spinning="spinning">
            <a-col :md="24" :sm="24" style="height: 100%;">
                <div class="tabDiv">
                    <a-tabs defaultActiveKey="1" @change="changeTab">
                        <a-tab-pane tab="文本" key="1"></a-tab-pane>
                        <a-tab-pane tab="图片" key="2"></a-tab-pane>
                        <a-tab-pane tab="视频" key="3"></a-tab-pane>
                    </a-tabs>
                </div>

                <textCheck v-if="tab === '1'"></textCheck>

                <picCheck v-if="tab === '2'"></picCheck>

                <videoCheck v-if="tab === '3'" @changeSpin="changeSpin"></videoCheck>
            </a-col>
        </a-spin>
    </a-row>
</template>

<script>
    import textCheck from './components/textCheck'
    import picCheck from './components/picCheck'
    import videoCheck from './components/videoCheck'

    export default {
        name: 'contentCheck',
        components: {
            textCheck,
            picCheck,
            videoCheck
        },
        data() {
            return {
                tab: '1',
                spinning: false
            }
        },
        methods: {
            changeTab(val) {
                this.tab = val;
            },
            changeSpin(flag) {
                this.spinning = flag;
            }
        }
    }
</script>

<style scoped>
    .tabDiv {
        background-color: white;
        text-align: center;
        height: 50px;
    }
</style>