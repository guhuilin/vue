<template>
                        <!-- 创建聊天室按钮的组件 -->
    <div>
        <a-button style="width:100%;height:40px" type="primary" @click="showModal">创建聊天室</a-button>
        <a-modal
            title="聊天室基本信息"
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
        >
        
            <div class="basic-information">
                <div>
                    <addDiscussion @selectedPersonData="selectedPersonData">
                        <!-- 添加讨论人员组件 -->
                    </addDiscussion>
                </div>
            </div>
            <span style="margin:0 10px" v-for="value in childOfData">{{value.userName}}</span>
        </a-modal>
        <div>
            <a-button type="primary" @click="fn">
                创建房间
            </a-button>
            <!-- <createdRoomPopup></createdRoomPopup> -->
        </div>
        <div>
            <ul class="create-of-room">
                <li v-for="value in createdRoom">
                    {{value}}房间
                </li>
            </ul>
        </div>
        <div>
            <div v-for="value in createdRoom" style="position: absolute;float:left;width: 450px;height: 330px;left: 150px;margin-top: -32px;background: yellow;}">
                123
            </div>
        </div>
    </div>
</template>
<script>
    //引入添加讨论组人员的组件 
    import addDiscussion from './Add-discussion.vue'
    import websocket from '../../../../webSocket'
    import createdRoomPopup from './Created-room-popup'
    import webSocket from '../../../../webSocket'
    import Vue from 'vue'
    import { USER_INFO } from "@/store/mutation-types"
    export default {
        data() {
            return {
                visible: false,
                confirmLoading: false,
                childOfData : [],
                currentUser : "",
                roomAddress : null,
                createdRoom : [],//创建的房间
            }
        },
        components : {
            addDiscussion,
            createdRoomPopup
        },
        methods: {
            fn(){
                let userName = Vue.ls.get(USER_INFO).userName;
                console.log(userName)
                let num = Math.floor(Math.random()*100000+1);
                // console.log(num)
                // ws:192.168.111.200:8088/chatSocket/房间号/用户名
                let scoket = new WebSocket("ws:192.168.111.200:8088/chatSocket/" + num + "/" + userName)
                // console.log(scoket)
                scoket.onopen = function(){
                    console.log("创建房间")
                };
                let that = this;
                scoket.onmessage  = function(data){
                    that.createdRoom.push(JSON.parse(data.data).sid)
                    // console.log(that,"7777777")
                }

            },
            selectedPersonData(selecteValue){
                this.childOfData = selecteValue;
                console.log(selecteValue,"难道我不是数据吗？");
            },
            showModal() {
                this.visible = true;
            },
            handleOk(e) {
                if(this.childOfData.length <= 0){
                    // alert("孩子没有数据");

                }else{
                    let str = ""
                    for(let i = 0 ; i < this.childOfData.length ; i ++){
                        // console.log(this.childOfData[i].userName)
                        str += this.childOfData[i].userName + ","
                    }
                    console.log()
                    websocket.oWs.send(str.substring(0,str.length-1))
                    // console.log(websocket)
                    // alert("孩子有数据");
                }
                this.visible = false;
            },
            handleCancel(e) {   
                console.log('Clicked cancel button');
                this.visible = false;
            },
            // fn(){
            //     let obj = JSON.parse(localStorage.pro__Login_Userinfo)
            //     this.currentUser = obj.value.userName;
            //     let num = Math.floor(Math.random()*1000+1);
            //     let oWs = new WebSocket("ws:192.168.111.200:8088/chatSocket/"+num + "/" + this.currentUser)
            //     oWs.onopen = function(){
            //         console.log("WebSocket连接成功");
            //     };
            //     oWs.onmessage = function(data){
            //         this.roomAddress = data.target.url
            //         // console.log(data.target.url);
            //         console.log(this.roomAddress,89898989)
            //         let ws = new WebSocket(this.roomAddress);
            //         ws.onopen = function(){
            //             console.log("WebSocket连接成功",121212);
            //         }
            //     }
            //     // setTimeout(function(){
            //     //     console.log(this.roomAddress,89898989)
            //     // },1)
            // }
        },
        mounted(){

        }
    }
    // {
    //     "value":{
    //         "userId":"ad62d47de00d49d6b9becda9ad716b0b",
    //         "userName":"admin6",
    //         "fullName":"admin6",
    //         "password":"eb9ea5458fafe3e7",
    //         "mobile":null,
    //         "email":null,
    //         "sex":null,
    //         "age":null,
    //         "birthday":null,
    //         "createTime":"2019-07-31 09:38:36",
    //         "createBy":null,
    //         "salt":"zoGXMW0E",
    //         "status":1,
    //         "avatar":null,
    //         "delFlag":"1",
    //         "updateBy":null,
    //         "updateTime":"2019-08-13 10:45:24",
    //         "activitiAsync":null,
    //         "orgCode":null,
    //         "roleId":null,
    //         "departId":null
    //     },
    //     "expire":1567499012008
    // }
</script>

<style scoped lang="scss">
    *{
        list-style: none;
    }
    .create-of-room{
        margin:0;
        padding:0;
        >li{
            width:150px;
            height:40px;
            text-align:center;
            line-height: 40px;
            border-bottom:1px solid #ccc;
        }
        >li:hover{
            
        }
        cursor: pointer;
    }
</style>