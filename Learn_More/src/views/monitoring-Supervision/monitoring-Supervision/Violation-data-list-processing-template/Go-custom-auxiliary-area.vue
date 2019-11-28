<template>
    <globalLayout>
        <div>
            <div>
                <a-tabs defaultActiveKey="1" @change="callback">
                    <a-tab-pane tab="综合研判会商" disabled key="1">
                        <comprehensiveResearchAndNegotiationContentArea ref="elementPosition"></comprehensiveResearchAndNegotiationContentArea>
                    </a-tab-pane>
                    <a-tab-pane tab="网络电视辅助区" disabled key="2">Content of Tab Pane 2</a-tab-pane>
                    <a-tab-pane tab="多画面辅助区" disabled key="3">Content of Tab Pane 3</a-tab-pane>
                </a-tabs>
                <customElement @save="save" ref="elementLength"></customElement>
                <!-- <div style="position:absolute;top:110px;right:120px;">
                    <a-button type="primary" style="margin-right:10px;" @click="showModal">添加自定义元素</a-button>
                    <a-modal
                        title="添加自定义元素"
                        :visible="visible"
                        :maskClosable="false"
                        @ok="handleOk"
                        @cancel="handleCancel"
                    >
                        <div>
                            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                                <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">
                                    全选
                                </a-checkbox>
                            </div>
                            <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />
                        </div>
                    </a-modal>
                </div> -->
            </div>
        </div>
    </globalLayout>
</template>

<script>
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    import globalLayout from '@/components/page/GlobalLayout.vue'
    // import CustomElementArea from './CustomElementArea.vue'
    import comprehensiveResearchAndNegotiationContentArea from '../comprehensiveResearchAndNegotiation/Content-area/Comprehensive-research-and-negotiation-Content-area'
    import customElement from '../comprehensiveResearchAndNegotiation/Content-area/Custom-element'
    import {addCustomAreaCodeone,updateCustomAreaCodeuser} from '@/api/api.js'
    export default {
        data(){
            return{
                currentUser : "",
                arr : [],
                visible: false,//弹窗

                checkedList: [],
                indeterminate: true,
                checkAll: false,
                plainOptions,
                arr : [
                    {
                        "id":9,"top":"3","left":"44","width":"100","height":"100","areaId":3,"areaCode":"A","userId":"ad62d47de00d49d6b9becda9ad716b0b","userName":"admin6"
                    },
                    {
                        "id":10,"top":"2","left":"55","width":"100","height":"100","areaId":3,"areaCode":"B","userId":"ad62d47de00d49d6b9becda9ad716b0b","userName":"admin6"
                    },
                    {
                        "id":11,"top":"60","left":"514","width":"100","height":"100","areaId":3,"areaCode":"DbAnalyseArea","userId":"ad62d47de00d49d6b9becda9ad716b0b","userName":"admin6"
                    }
                ]




            }
        },
        created(){
            this.currentUser = JSON.parse(localStorage.pro__Login_Userinfo).value.userName;
        },
        methods : {
            callback(){
                
            },

            save(){
                for(let i = 0 ; i < this.$refs.elementPosition.topArr.length ; i ++){
                    if(this.$refs.elementPosition.topArr[i].areaCode === "节目基本信息区"){
                        this.$refs.elementPosition.topArr[i].areaCode = "B"
                    }
                    if(this.$refs.elementPosition.topArr[i].areaCode === "视频区"){
                        this.$refs.elementPosition.topArr[i].areaCode = "A"
                    }
                    if(this.$refs.elementPosition.topArr[i].areaCode === "研判参考区"){
                        this.$refs.elementPosition.topArr[i].areaCode = "DbCheckArea"
                    }
                    if(this.$refs.elementPosition.topArr[i].areaCode === "资料库区"){
                        this.$refs.elementPosition.topArr[i].areaCode = "DbMateLrial"
                    }
                    if(this.$refs.elementPosition.topArr[i].areaCode === "数据分析区"){
                        this.$refs.elementPosition.topArr[i].areaCode = "DbAnalyseArea"
                    }
                    // 0: {id: 1, configCode: "B", isChecked: 1, configName: "节目基本信息区"}
                    // 1: {id: 2, configCode: "A", isChecked: 0, configName: "视频区"}
                    // 2: {id: 3, configCode: "", isChecked: 0, configName: ""}
                    // 3: {id: 4, configCode: "", isChecked: 0, configName: ""}
                    // 4: {id: 5, configCode: "", isChecked: 0, configName: ""}
                }
                // console.log()
                if(this.$refs.elementLength.length < 1){
                    // 调取新增的接口
                    addCustomAreaCodeone({
                        "list" : this.$refs.elementPosition.topArr
                    }).then((res)=>{
                        this.$refs.elementPosition.getCustomZoneContent();
                    })
                }else if(this.$refs.elementLength.length >= 1){
                    // 调取修改的接口
                    updateCustomAreaCodeuser({
                        "list" : this.$refs.elementPosition.topArr
                    }).then((res)=>{
                        this.$refs.elementPosition.getCustomZoneContent();
                    })
                }
            }
            // 弹窗里面的事件
            // showModal() {
            //     this.visible = true;
            // },
            // handleOk(e) {
            //     // areaCode: "A"
            //     // areaId: 3
            //     // height: "100"
            //     // id: 9
            //     // left: "44"
            //     // top: "3"
            //     // userId: "ad62d47de00d49d6b9becda9ad716b0b"
            //     // userName: "admin6"
            //     // width: "100"
            //     // let arr = [];
            //     this.arr = [];
            //     let obj = {};
            //     let oContent = document.querySelectorAll(".content")
            //     for(let i = 0 ; i < this.checkedList.length ; i ++){
            //         let obj = new Object();
            //         obj.width = "100";
            //         obj.height = "100";
            //         obj.left = "100";
            //         obj.top = "100";
            //         obj.userName = this.currentUser; 
            //         obj.areaCode = this.checkedList[i];
            //         // obj.width = 100;
            //         // obj.height = 100;
            //         // obj.areaCode = this.checkedList[i];
            //         this.arr.push(obj);
            //         // console.log(this.checkedList[i]);
            //         // let oDiv = document.createElement("div");
            //         // oDiv.innerText = this.checkedList[i];
            //         // oDiv.style.position = "absolute";
            //         // oDiv.style.width = "200px";
            //         // oDiv.style.height = "200px";
            //         // oDiv.style.zIndex = "10000"
            //         // oDiv.style.border = "1px solid black";
            //         // oContent[0].appendChild(oDiv)
            //         // console.log(oDiv,oContent[0])
            //     }
            //     // this.visible = false;
            // },
            // handleCancel(e) {
            //     console.log(this.checkedList)
            //     this.visible = false;
            // },
            // // 弹窗里面选中的事件
            // onChange(checkedList) {
            //     this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length;
            //     this.checkAll = checkedList.length === plainOptions.length;
            //     console.log(this.checkedList)
            // },
            // onCheckAllChange(e) {
            //     Object.assign(this, {
            //         checkedList: e.target.checked ? plainOptions : [],
            //         indeterminate: false,
            //         checkAll: e.target.checked,
            //     });
            //     console.log(this.checkedList)
            // },
        },
        
        mounted(){

        },
        components : {
            globalLayout,
            // CustomElementArea,
            comprehensiveResearchAndNegotiationContentArea,
            customElement
        }
    }
</script>

<style lang="scss" scoped>
    .topArea{
        width:1296px;
        height:660px;
        background: #fff;
        overflow-y: auto;
        position: relative;
        >div{
            text-align: center;
            -webkit-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;
        }
        >div:hover{
            cursor: move;
        }
    }
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
        height: 92px;
        position: relative;
        background: #ccc;
        opacity: 0.5;
    }
    >>>.ant-tabs-nav-container{
        margin:0px;
        /* line-height: 92px; */
    }
</style>