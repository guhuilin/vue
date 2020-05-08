<template>
    <div>
        <div>
            <a-tabs defaultActiveKey="1" @change="callback">
                <a-tab-pane tab="综合研判会商" key="1">
                    <comprehensiveResearchAndNegotiationContent></comprehensiveResearchAndNegotiationContent>
                    
                </a-tab-pane>
                <a-tab-pane tab="网络电视辅助区" key="2">
                    <internetTvAuxiliaryArea></internetTvAuxiliaryArea>
                </a-tab-pane>
                <a-tab-pane tab="多画面辅助区" key="3">
                    <screenAuxiliaryArea></screenAuxiliaryArea>
                </a-tab-pane>
            </a-tabs>
            <div style="position:absolute;top:110px;right:120px;">
                <a-button type="primary" style="margin-right:10px;" @click="GoToCustomAuxiliaryArea">
                    自定义辅助区
                </a-button>
                <a-button type="primary" @click="backToPrevious">
                    返回
                    <a-icon type="arrow-right" />
                </a-button>
            </div>
        </div>
    </div>
</template>
<script>
    import comprehensiveResearchAndNegotiationContent from './Content-area/Comprehensive-research-and-negotiation-Content.vue'
    import internetTvAuxiliaryArea from '../Violation-data-list-processing-template/Internet-tv-auxiliary-area.vue'
    import screenAuxiliaryArea from '../Violation-data-list-processing-template/Screen-auxiliary-area.vue'
    export default {
        data() {
            return {

            };
        },
        components : {
            comprehensiveResearchAndNegotiationContent,
            internetTvAuxiliaryArea,
            screenAuxiliaryArea,
        },
        methods: {
            callback(key) {
                console.log(key);
            },
            backToPrevious(){
                this.$router.push({
                    path : "/monitoring-Supervision/judge",
                })
            },
            GoToCustomAuxiliaryArea(){
                // console.log(this.$route.query.violationDataDetailsProcessing)
                // console.log(this.$route.query.leftData)
                // console.log(this.$route.query.mp4)
                this.$router.push({
                    path : "/GoCustomAuxiliaryArea",
                    query : {
                        violationDataDetailsProcessing : this.$route.query.violationDataDetailsProcessing,
                        leftData : this.$route.query.leftData,
                        mp4 : this.$route.query.mp4,
                    }
                })
            }
        },
    };
</script>

<style lang="scss" scoped>
    .ant-btn{
        background: #fff;
        color: #5868d9;
        border: 1px solid #5868d9;
        height: 40px;
    }
</style>

<style scoped>
    >>>.ant-tabs-bar{
        margin:0px;
        border: 0px;
    }
    >>>.ant-tabs-ink-bar{
        bottom: 0px;
        height: 0px;
    }
    >>>.ant-tabs-tab{
        width:156px;
        text-align: center;
        border:1px solid #5868d9;
        color: #5868d9;
        border-radius: 5px;
    }
    >>>.ant-tabs-tab:hover{
        color:#5868d9;
    }
    >>>.ant-tabs-nav-wrap{
        margin: 22.5px 0 0 10px;
    }
    >>>.ant-tabs-tab-active{
        color: #fff;
        background: #5868d9;
    }
    >>>.ant-tabs-tab-active:hover{
        color:#fff;
    }
    >>>.ant-tabs-bar{
        background: #fff;
        height: 92px;
        position: relative;
    }
    >>>.ant-tabs-nav-container{
        margin:0px;
        /* line-height: 92px; */
    }
</style>