<template>
<!-- 综合研判中的各种区 -->
    <div>
        <a-collapse :accordion="true" v-for="value in dataForVariousDistricts" :key="value.id" ref="areaBox" class="areaBox">
            <a-collapse-panel :header="value.configName" :key="value.id" :forceRender="false">
                <div class="content">
                    <p v-for="item in value.list" :key="item.id">
                        {{item.title}}
                    </p>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <div>
            <div v-for="value in ProgramInformationArea" :key="value.id" style="position:absolute;overflow-y:auto;" ref="ProgramInformationArea" class="ProgramInformationArea">
                <div style="height:10%;background:#5868d9;color:#fff;display:flex;justify-content: center;align-items: center;">
                    {{value.configName}}
                </div>


                <div style="height:55%;overflow-y:auto;padding:0 15px;background:#fff;" class="programInformation">
                    <div style="float:left;width:20%;">
                        <div style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;padding:7px 0px;height: 46px;display:flex;align-items: center;" v-for="value in leftData">
                            <!-- {{value.id}} -->
                            {{value}}：
                        </div>
                    </div>
                    <div style="float:left;width:80%;">
                        <div style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;padding:7px 0px;" v-for="value in rightData">
                            <!-- {{value.id}} -->
                            <!-- {{value}} -->
                            <a-input :placeholder="value" :disabled="disabled" />
                        </div>
                    </div>
                </div>


                <div style="height:35%; display: flex;justify-content: center;align-items: center;background:#fff;">
                    <a-button type="primary" @click="showModal">提交</a-button>
                    <a-modal
                        title="研判状态选择"
                        :visible="visible"
                        @ok="handleOk"
                        @cancel="handleCancel"
                        :maskClosable="false"
                        :okButtonProps="{ props: {disabled: submitDisabled} }"
                    >
                    <div>
                        <div style="padding:20px 0px;color:#f40;">
                            {{submitVotingResultsData}}
                        </div>
                        <span>
                            请选择研判状态：
                        </span>
                        <div style="display:inline-block;">
                            <a-select  style="width: 120px" @change="handleChange">
                                <a-select-option value="1">违规</a-select-option>
                                <a-select-option value="2">不违规</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    </a-modal>
                </div>
            </div>
        </div>
        <div>
            <div v-for="value in VideoArea" ref="VideoArea" style="position:absolute;background:#fff;">
                
                <div style="height:8%;font-weight:600;display:flex;align-items: center;padding:1%;">
                    {{value.configName}}
                </div>
                <div style="width:100%;height:92%;">
                    <video style="width:100%;height:100%;object-fit: fill" :src="mp4" controls="controls" />
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
    import {query , queryCustomAreaCode , updateSuspectProgramevaluation , addauditVideoHis} from '@/api/api.js'
    import axios from 'axios'
    export default {
        // props : ["submitVotingResultsData"],
        data () {
            return {
                disabled:true,
                submitDisabled : false,
                // 各种区的数据
                dataForVariousDistricts : [],
                str : "",
                sty : "",
                isShow : false,

                currentUser : "",
                //节目信息区
                ProgramInformationArea : [],
                // 视频区
                VideoArea : [],

                // 节目信息区的数据
                leftData : [],
                rightData : [],

                // 提交保存
                visible: false,

                mp4 : '',

                // 研判状态
                researchStatus : '',

                // 节目ID
                progromId : '',
                submitVotingResultsData : "",
            }
        },
        methods : {
            
            // areaBox(){
            //     console.log(this)
            // },
            handleChange(value) {
                this.researchStatus = value;
                // console.log(value);
            },



            fn(value){
                let obj = {};
                for(let i = 0 ; i < this.$refs.oButton.length ; i ++){
                    for(let j = 0 ; j < this.$refs.oInput.length ; j ++){
                        if(value === Number(this.$refs.oButton[i].innerText) && i === j){
                            // console.log(this.$refs.oInput[j].$el.value);
                            obj.id = value;
                            obj.key = this.$refs.oInput[j].$el.value
                        }
                    }
                }
            },
            getDistrictInformation(){
                    query({}).then((res)=>{
                        for(let i = 0 ; i < res.result.length ; i ++){
                            if(res.result[i].areaCode !== "A" && res.result[i].areaCode !== "B"){
                                // console.log(res.result[i],"777777777")
                                this.dataForVariousDistricts.push(res.result[i])
                            }
                            if(res.result[i].areaCode === "B"){
                                this.ProgramInformationArea.push(res.result[i])
                            }
                            if(res.result[i].areaCode === "A"){
                                this.VideoArea.push(res.result[i])
                            }
                        }
                        // console.log(this.ProgramInformationArea,"222222")
                        if(res.success){

                        }else{
                            console.log(res.message);
                        }
                    });
            },
            showModal() {
                console.log(this.progromId)
                axios.get("/websocket/queryVoteResult",{
                    params : {
                        programId : this.progromId,//节目的ID
                    },
                }).then((res)=>{
                    this.submitVotingResultsData = res.data.msg;
                    this.submitDisabled = !res.data.success
                    console.log(res.data);
                })
                // axios.get("/websocket/queryWebsocketSid",{
                //     params : {
                //         userName : this.currentUser,
                //     },
                //     Headers : {
                //         "content-type" : "application/json;charset=UTF-8"
                //     }
                // }).then((res)=>{
                //     console.log(res.data,"房间")
                //     if(res.data.length > 0){
                //         axios.get("/websocket/queryVoteResult",{
                //             params : {
                //                 sid : res.data[0],//房间号
                //                 programId : this.progromId,//节目的ID
                //             },
                //         }).then((res)=>{
                //             this.submitVotingResultsData = res.data.msg
                //             console.log(res.data.msg);
                //         })
                //     }
                // })
                this.visible = true;
            },
            handleOk(e) {
                // this.visible = false;
                if(this.researchStatus === ""){
                    // alert("请选择研判的状态")
                     this.$message.warning('请选择研判状态');
                }else{
                    updateSuspectProgramevaluation({
                        id : this.progromId,
                    }).then((res)=>{
                        addauditVideoHis({
                            auditResult : this.researchStatus,//研判的状态
                            auditLevel : "3",//研判的级别，默认给传3
                            auditUser : this.currentUser,//当前用户
                            dataId : this.progromId,//ID
                        }).then((res)=>{
                            // console.log(res);
                            this.visible = false;
                            this.$message.success(res.message);
                            this.$router.push({
                                path : "/monitoring-Supervision/judge",
                            })
                        })
                    })
                }
            },
            handleCancel(e) {
                this.visible = false;
            },
        },
        created(){
            this.currentUser = JSON.parse(localStorage.pro__Login_Userinfo).value.userName;
            this.getDistrictInformation();
            this.rightData = this.$route.query.violationDataDetailsProcessing;
            this.leftData = this.$route.query.leftData;
            this.mp4 = this.$route.query.mp4;
            this.progromId = this.$route.query.progromId;
            console.log(this.$route.query.progromId,"999999999999999999999999999999")
        },
        beforeUpdate(){
            this.$nextTick(()=>{
                // console.log(this.$refs.areaBox)
                if(this.$refs.areaBox){
                    for(let i = 0 ; i < this.$refs.areaBox.length ; i ++){
                        for(let j = 0 ; j < this.dataForVariousDistricts.length ; j ++){
                            // console.log();
                            if(this.dataForVariousDistricts[j].configName === this.$refs.areaBox[i].$el.innerText){
                                // console.log(this.$refs.areaBox[i].$el)
                                this.$refs.areaBox[i].$el.style.width = this.dataForVariousDistricts[j].width + "px";
                                this.$refs.areaBox[i].$el.style.left = this.dataForVariousDistricts[j].left + "px";
                                this.$refs.areaBox[i].$el.style.top = this.dataForVariousDistricts[j].top + "px";
                                                        

                                // // this.$refs.areaBox[i].$el.style.height = this.dataForVariousDistricts[j].height + "px";

                                // console.log(this.dataForVariousDistricts[j])
                            }
                        }
                    };
                }
                


                if(this.$refs.ProgramInformationArea){
                    for(let i = 0 ; i < this.$refs.ProgramInformationArea.length ; i ++){
                        for(let j = 0 ; j < this.ProgramInformationArea.length ; j ++){
                            // console.log(this.$refs.ProgramInformationArea[i].innerText.substring(-1,7),"9999999999999")
                            if(this.$refs.ProgramInformationArea[i].innerText.substring(-1,7) === this.ProgramInformationArea[i].configName){
                                this.$refs.ProgramInformationArea[i].style.width = this.ProgramInformationArea[i].width + "px";
                                this.$refs.ProgramInformationArea[i].style.height = this.ProgramInformationArea[i].height + "px";
                                this.$refs.ProgramInformationArea[i].style.left = this.ProgramInformationArea[i].left + "px";
                                this.$refs.ProgramInformationArea[i].style.top = this.ProgramInformationArea[i].top + "px";
                                // this.$refs.ProgramInformationArea[i].style.border = '1px solid black'

                            }   
                        }
                    }
                };

                if(this.$refs.VideoArea){
                    for(let i = 0 ; i < this.$refs.VideoArea.length ; i ++){
                        for(let j = 0 ; j < this.VideoArea.length ; j ++){
                            // console.log(this.$refs.VideoArea[i].innerText,this.VideoArea[j].configName,"=====================")
                            if(this.$refs.VideoArea[i].innerText === this.VideoArea[j].configName){
                                
                                this.$refs.VideoArea[i].style.width = this.VideoArea[j].width + 'px';
                                this.$refs.VideoArea[i].style.height = this.VideoArea[j].height + 'px';
                                this.$refs.VideoArea[i].style.top = this.VideoArea[j].top + 'px';
                                this.$refs.VideoArea[i].style.left = this.VideoArea[j].left + 'px';
                                // this.$refs.VideoArea[i].style.border = '1px solid black';
                            }
                        }
                    }
                }



                let oAreaBox = document.querySelectorAll(".areaBox")
                let oProgramInformationArea = document.querySelectorAll(".ProgramInformationArea")
                // console.log(oAreaBox,"22222222222")
                for(let i = 0 ; i < oAreaBox.length ; i ++){
                    oAreaBox[i].onclick = function(){
                        for(let j = 0 ; j < oAreaBox.length ; j ++){
                            if(oProgramInformationArea[j] !== undefined){
                                oProgramInformationArea[j].style.zIndex = 0
                            }
                            oAreaBox[j].style.zIndex = 0
                        }
                        this.style.zIndex = 10;
                    }
                    // console.log(oProgramInformationArea[i])
                    if(oProgramInformationArea[i] !== undefined){
                        oProgramInformationArea[i].onclick = function(){
                            for(let j = 0 ; j < oAreaBox.length ; j ++){
                                if(oProgramInformationArea[j] !== undefined){
                                    oProgramInformationArea[j].style.zIndex = 0
                                }
                                oAreaBox[j].style.zIndex = 0
                            }
                            this.style.zIndex = 10;
                        }
                    }
                    

                }
            })
            
        },
        mounted(){
            // console.log(this.submitVotingResultsData,"传过来的投票结果")
        },
    }
</script>


<style lang="scss" scoped>
    video:focus {
        outline: -webkit-focus-ring-color auto 0px;
    }
    .programInformation::-webkit-scrollbar {display:none}
    .ant-collapse-content-box{
        .content{
            height: 250px;
            overflow-y: auto;
            p{
                width:268px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        // .content::-webkit-scrollbar{
        //     width: 4px;
        // }
        // .content::-webkit-scrollbar-thumb{
        //     // width:4px;
        //     color:yellow;
        // }
        .content::-webkit-scrollbar {/*滚动条整体样式*/
            width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }
        .content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: #535353;
        }
        .content::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 10px;
            background: #EDEDED;
        }
    }
    .ant-collapse{
        border: 0;
        display: inline-block;
        // margin: 10px;
        background: rgb(88,104,217);
        position: absolute;
        // color:#fff !important;
        .ant-collapse-item{
            width:100%;
            display: inline-block;
            border: 0;
            padding:10px;
            vertical-align:text-top;
        }
        .ant-collapse-item::after{
            content: "";
            display : block;
            clear: both;
        }
    }
    // .ant-collapse > .ant-collapse-item > .ant-collapse-header{
    //     // color:#fff !important;
    //     padding:50px !important;
    // }
</style>
<style scoped>
    >>>.ant-collapse > .ant-collapse-item > .ant-collapse-header{
        color:#fff;
    }
</style>
