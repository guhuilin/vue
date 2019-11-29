<template>
    <div>
        <div class="center">
            <chatFunctionComponent></chatFunctionComponent>
            <comprehensiveSearch></comprehensiveSearch>
            <correspondingDataArea :submitVotingResultsData="submitVotingResultsData"></correspondingDataArea>
        </div>
    </div>
</template>

<script>
    import chatFunctionComponent from '../../Violation-data-list-processing-template/Chat-function-component.vue'
    import comprehensiveSearch from './Comprehensive-search'
    import correspondingDataArea from '../../Violation-data-list-processing-template/Corresponding-data-area'
    import bus from '../../../bus/bus.js'
    export default {
        data(){
            return{
                submitVotingResultsData : "",//提交的投票结果
            }
        },
        mounted(){
            bus.$on("votingResultsData",data=>{
                // msg: "认为违规人数:1,认为不违规人数:0,弃权人数为:0"
                // result: "投票结果:违规"
                this.submitVotingResultsData = data.data.msg + "`++`" + data.data.result;
                console.log(this.submitVotingResultsData,"我是投票的结果")
            })
        },
        components : {
            chatFunctionComponent,
            comprehensiveSearch,
            correspondingDataArea
        }
    }
</script>

<style lang="scss" scoped>
    .center{
        height: 760px;
        // background: #fff;
        margin-top:10px;
        position: relative;
    }
</style>