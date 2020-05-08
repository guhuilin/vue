<template>
    <!-- 违规数据列表处理 -->
        <globalLayout>
            
            <!-- <breadCrumbsComponent>
                面包屑组件
            </breadCrumbsComponent> -->
            <!-- <processingTab>
                tab栏切换的功能
            </processingTab> -->
            <!-- <chatFunctionComponent></chatFunctionComponent> -->

            <comprehensiveResearchAndNegotiationTab>
                
            </comprehensiveResearchAndNegotiationTab>
        </globalLayout>
</template>

<script>
    // 引入全局的组件
    import globalLayout from '@/components/page/GlobalLayout.vue'
    //引入的面包屑组件
    import breadCrumbsComponent from "./Violation-data-list-processing-template/Bread-crumbs-component.vue"
    // 引入处理的tab栏切换功能
    import processingTab from './Violation-data-list-processing-template/Processing-tab.vue'
    // 引入聊天的功能
    import chatFunctionComponent from './Violation-data-list-processing-template/Chat-function-component.vue'
    // import index from './Violation-data-list-processing-template/index1.vue'

    // 最新
    import comprehensiveResearchAndNegotiationTab from './comprehensiveResearchAndNegotiation/Comprehensive-research-and-negotiation-tab.vue'
    export default {
        
        data(){
            return {

            }
        },
        components : {
            globalLayout,
            breadCrumbsComponent,
            processingTab,
            chatFunctionComponent,
            comprehensiveResearchAndNegotiationTab
        }
    }
</script>

<style lang="scss" scoped>

</style>
