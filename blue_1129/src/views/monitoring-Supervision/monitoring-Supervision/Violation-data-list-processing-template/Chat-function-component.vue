<template>
    <div id="chat" ref="chat">
        <div class="chat-icon" @click="clickToDisplayTheThatArea" ref="chatIcon">
            <img src="../../../../assets/Monitor-monitoring-management/chatIcon.png" alt="">
        </div>
        <div class="chat-box" ref="chatBox">
            <div class="chat-box-top">
                <div style="float:left;width:120px;height:50px;background:#5868d9;border-bottom:1px solid #6676e6">
                    <a-button type="primary" :disabled="disabled" style="width:100px;height:30px;display:block;border-radius: 20px;margin-top: 10px;margin-left: 10px; background-color:#fff !important;color:black;font-size:14px;border:0;" @click="createChatRoomBtn">
                        创建聊天室
                    </a-button>
                </div>
                <div @click="chatBoxShow" class="chat-box-show" style="width:50px;height:50px;text-align:center;line-height:40px;float:right;border-left:1px solid #cdd0e1;">
                    <a-icon type="close-circle" style="padding-top:20px;" />
                </div>
            </div>
            <div class="chat-box-buttom">
                <div class="chat-box-buttom-left">
                    <div ref="chatRoomName" @click="chatRoomName(index,value)" v-for="(value,index) in createdRoom" style="width:120px;height:40px;line-height:40px;text-align:center;border-bottom:1px solid #6373e3;color:#d0d5fb;">
                        房间{{value}}号
                    </div>
                </div>
                <div style="float:right;width:480px;">
                    <div ref="chatArea" v-for="(item) in createdRoom" style="width:480px;height:450px;background-color:red;position:absolute;display:none;top:0;">
                        <div style="width:430px;height:50px;margin-top:-50px;">
                            <div style="float:left;width:370px;height:50px;text-align:center;line-height:50px;">
                                房间{{item}}号
                            </div>
                            <div style="float:right;margin-right:10px">
                                <div @click="groupSetting" class="group-setting" style="font-size:18px;width:50px;height:49px;background-color:#fff;text-align:center;line-height:50px">
                                    ...
                                </div>
                            </div>
                        </div>
                        <div ref="groupSettingShow" style="position:absolute;z-index:1;width:200px;height:400px;background:#eaeef1;margin-left:280px;display:none">
                            <div>
                                <a-button style="margin-left:35px;" @click="addDiscussionGroupStaff">添加讨论组人员</a-button>
                                <div @click="close(item)" ref="close" class="close" style="font-size:18px;display:inline-block;width:35px;height:32px;text-align:center;line-height:32px">
                                    ×
                                </div>
                            </div>
                            <div>
                                <p style="text-align:center" ref="closeBtn">{{item}}讨论组人员</p>
                                <div style="overflow-y: auto;height: 332px;">
                                    <p v-for="value in inTheCurrentRoomUser">
                                        {{value}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style="position:absolute;">
                            <div style="width:480px;height:350px;background-color:#fff;" >
                                <ul style="height:350px;overflow-y: auto;padding:0 0 20px 0" class="chat-area-content" ref="content">
                                    <li v-for="value in chatContentInformation" style="margin-top: 10px;min-height: 43px;overflow: hidden;">
                                        <span :class="[currentUserName === value.from ? 'userName' : 'no-userName']">
                                            {{value.from}}
                                        </span>
                                        <div :class="[currentUserName === value.from ? 'current-user' : 'no-current-user']" style="">
                                            
                                            <font style="font-size:14px;">
                                                {{value.sendMsg}}
                                            </font>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div style="width:480px;height:100px;background-color:#fff;border-top:1px solid #ccc;border-bottom:1px solid #ccc;">
                                <div ref="inputValue" style="width:480px;height:62px;background-color:#fff;border:1px solid rgb(204, 204, 204);" contenteditable class="input" @keyup="">
                                </div>
                                <div class="emoticon-image-area" v-if="showEmoticonImageArea">
                                    <ul>
                                        <li v-for="(value,index) in expressionList" :key="index" @click="checkExpression(index)">{{value}}</li>
                                    </ul>
                                </div>
                                <div class="expression" @click="expression">
                                    <img style="width: 50px;height: 36px;margin-top: -4px;" src="../../../../assets/Monitor-monitoring-management/expression.png" alt="" title="表情">
                                </div>
                                <a-button style="height:36px;" @click="closeCurrentChatRoom(item)">关闭当前聊天室</a-button>
                                <a-button style="height:36px;" ref="currentRoomVote" @click="initiateVote(item)">{{item}}房间发起投票</a-button>
                                <!-- <div>
                                    {{data}}
                                </div> -->
                                <div class="voting-show" ref="voteContent">
                                    <a-radio-group name="radioGroup" @change="votingSelect">
                                        <a-radio value="违规">违规</a-radio>
                                        <a-radio value="不违规">不违规</a-radio>
                                        <a-radio value="弃权">弃权</a-radio>
                                    </a-radio-group>
                                    <a-button @click="votingSelectOk">确定</a-button>
                                    <div ref="countdownValue" style="display:inline-block"></div>
                                </div>
                                <input type="submit" @click="fn1" @keyup="submit(e)" value="提交" style="position: absolute;left: 417px;bottom: 6px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 添加讨论组人员的弹出层 -->
            <div>
                <a-modal
                    title="Title"
                    :visible="visible"
                    @ok="addDiscussionGroupStaffOk"
                    :confirmLoading="confirmLoading"
                    @cancel="addDiscussionGroupStaffCancel"
                >
                    <div>
                        <div>
                            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                            <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">
                                全选
                            </a-checkbox>
                            </div>
                            <br />
                            <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />
                        </div>
                    </div>
                </a-modal>
            </div>
        </div>
    </div>
</template>

<script>
    // const plainOptions = ['Apple', 'Pear', 'Orange'];
    const defaultCheckedList = [];
    const appData = require("@/assets/Monitor-monitoring-management/expression.json");
    import { getCurrentLoginUserList , queryUserCount , addJudgeVote} from '@/api/api.js'
    //引入创建聊天室按钮的组件 
    import createChatRoom from './Create-chat-room.vue'
    // websocket
    import websocket from '../../../../webSocket'
    import Vue from 'vue'
    import axios from 'axios'
    import { USER_INFO } from "@/store/mutation-types"
    import bus from '../../bus/bus.js'
    // import {queryUserList} from 
    export default {
        data(){
            return{
                inputValue : "",
                data : "admin",
                vLi : [],
                createdRoom : [],//创建的房间
                currentChatRoom : "",
                // 弹出层大的显示和隐藏
                visible: false,
                confirmLoading: false,
                // 所有在线用户
                allOnlineUsers : [],
                // 选择拉入的人员
                selectPullPersonnel : null,
                url : "",
                scoket : null,
                fang : null,
                sUrl : null,
                // 邀请进入的房间号
                invitedRoomNumber : null,
                // 聊天内容信息
                chatContentInformation : [],
                // 当前的用户
                currentUserName : "",
                // 发送消息的用户
                sendMessageUser : null,
                // 下标
                subscript : null,
                // 当前房间中的用户
                inTheCurrentRoomUser : [],
                isShow : false,
                // 提示
                prompt : [],
                //表情区的显示和隐藏
                showEmoticonImageArea : false,
                // 表情的list
                expressionList : [],
                app : null,
                sendMsgWebsocket : null,
                voteWebsocket : null,
                //投票选中数据
                votingSelectData : "",
                // 投票的显示和隐藏
                voteShow : false,
                // 发起投票按钮的显示和隐藏
                initiateVoteShow : true,
                D : [],
                // 倒计时
                // Countdown : "",
                str : "",
                data : [],
                // arr : [1,2,3],

                checkedList: defaultCheckedList,
                indeterminate: false,
                checkAll: false,
                plainOptions : [],

                // 创建聊天室按钮是否失效
                disabled : false,

                // 节目ID
                programId : "",
                // 房间号
                sid : "",
            }
        },
        components : {
            createChatRoom 
        },
        created(){
            this.programId = this.$route.query.progromId,
            this.currentUserName = JSON.parse(localStorage.pro__Login_Userinfo).value.userName;
            this.getCurrentUserRoom();
        },
        methods : {
            // enterSubmit(e){
            //     if(e.keyCode == 13 ){
            //         // alert("我时13")
            //         this.fn1();
            //     }
            //     console.log(e,"=================")
            // },
            submit(e){
                console.log(e);
                // console.log(e.keyCode)
            },
            resetTime(time,value){
                let that = this;
                // console.log(this,"我是this")
                var timer = null;
                var t = time;
                var m = 0;
                var s = 0;
                m = Math.floor(t / 60 % 60);
                m < 10 && (m = '0' + m);
                s = Math.floor(t % 60);
                function countDown(){
                    s --;
                    s < 10 && (s = '0' + s);
                    if(s.length >= 3){
                        s = 59;
                        m = "0" + (Number(m) - 1);
                    };
                    if(m.length >= 3){
                        m = '00';
                        s = '00';
                        clearInterval(timer);
                    };
                    for(let i = 0 ; i < that.$refs.currentRoomVote.length ; i ++){
                        if(value * 1 === that.$refs.currentRoomVote[i].$el.innerText.substring(0,that.$refs.currentRoomVote[i].$el.innerText.length - 6) * 1){
                            that.$refs.countdownValue[i].innerText = value + "倒计时： " + m + "分钟" + s + "秒"
                            if( value + "倒计时： " + m + "分钟" + s + "秒" === value + "倒计时： 00分钟01秒"){
                                axios.get("/websocket/queryVoteResult",{
                                    params : {
                                        sid : that.sid,//房间号
                                        programId : that.programId,//节目的ID
                                    },
                                }).then((res)=>{
                                    bus.$emit("votingResultsData",res)
                                    // console.log(res,"投票的结果")
                                })
                                that.str = value + "倒计时： 00分钟01秒"
                                that.$notification.open({
                                    message: '通知',
                                    description: '投票时间已经结束',
                                    duration: 15,
                                });
                                that.$refs.voteContent[i].style.display = "none";
                                // console.log(that.$refs.voteContent[i])
                            }
                            
                        }
                    }
                }
                timer = setInterval(countDown,1000);
            },
            // 投票确定
            votingSelectOk(){
                if(this.str === this.invitedRoomNumber + "倒计时： 00分钟01秒"){
                    this.$message.info("投票时间已经结束,无法继续投票",15);
                }else if(this.votingSelectData !== ""){
                    // addJudgeVote({}).then((res)=>{
                    //     console.log(res,"投票")
                    // })
                    axios.get("/websocket/callVote",{
                        params : {
                            userName : this.currentUserName,//当前的用户名
                            sid : this.sid,//房间号
                            programId : this.programId * 1,//节目ID
                            status : this.votingSelectData,//是否违规
                        },
                    }).then((res)=>{
                        if(res.data.msg === "投票成功"){
                            this.$message.success(res.data.msg);
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                }else{
                    alert("请选择是否违规")
                }
            },
            votingSelect(e){
                this.votingSelectData = e.target.value;
            },
            // 点击发起投票
            initiateVote(value){
                this.sid = value;//房间号
                axios.get("/websocket/queryWebsocketUser",{
                    params : {
                        sid : value,
                    }
                }).then((data)=>{
                    this.inTheCurrentRoomUser = data.data;
                    let str = "";
                    for(let i = 0 ; i < this.inTheCurrentRoomUser.length ; i ++){
                        str += this.inTheCurrentRoomUser[i] + ','
                    }
                    axios({
                        method:"get",
                        url:"/websocket/queryIfVote",
                        params : {
                            programId : this.programId * 1,
                            userList : str
                        },
                        headers:{
                            "content-type":"application/json"
                        },
                    }).then((res)=>{
                        if(res.data.success === true){
                            if(this.str === this.invitedRoomNumber + "倒计时： 00分钟01秒"){
                                this.$message.info("无法再次发起投票",15);
                            }else{
                                let that = this;
                                let userName = Vue.ls.get(USER_INFO).userName;
                                if(that.voteWebsocket === null){
                                    that.voteWebsocket = this.fn("ws:192.168.111.200:8088/websocket/chatSocket/" + this.invitedRoomNumber + "/" + userName);
                                    that.voteWebsocket.onopen = function(){
                                        that.voteWebsocket.send("!~%^^__++!qw")
                                    }
                                    that.voteWebsocket.onmessage = function(data){
                                        if(JSON.parse(data.data).secretWord === "!~%^^__++!qw" ){
                                            that.data.push(JSON.parse(data.data).secretWord)
                                            for(let i = 0 ; i < that.$refs.currentRoomVote.length ; i ++){
                                                if(value === that.$refs.currentRoomVote[i].$el.innerText.substring(0,that.$refs.currentRoomVote[i].$el.innerText.length - 6) * 1){
                                                    that.$refs.voteContent[i].style.display = "block";
                                                    that.resetTime(120,value)
                                                }
                                            }
                                            that.voteShow =  true;
                                        }
                                    }
                                }else{
                                    that.voteWebsocket.send("!~%^^__++!qw")
                                    that.voteWebsocket.onmessage = function(data){
                                        if(JSON.parse(data.data).secretWord === "!~%^^__++!qw"){
                                            that.data.push(JSON.parse(data.data).secretWord)
                                            that.voteShow =  true;
                                        }
                                    }
                                }
                            }
                        }else if(res.data.success === false){
                            this.$message.warning('已经投过票了,无法再次开启投票');
                        }
                    }).catch((data)=>{
                        console.log(data)
                    })
                }).catch((data)=>{
                    console.log(data)
                });
            },
                // axios({
                //     method:"get",
                //     url:"/websocket/queryIfVote",
                //     params : {
                //         programId : this.programId * 1,
                //         userList : 'admin' + "," + 'admin1',
                //     },
                //     headers:{
                //         "content-type":"application/json"
                //     },
                // }).then((res)=>{
                //     console.log(res,"----------------------------")
                // })
                // axios.post("/websocket/queryIfVote",{
                //     // sid : value,
                //     userList : ["admin",],
                //     programId : this.programId * 1,
                // }).then((res)=>{
                //     if(res.data === true){
                //         if(this.str === this.invitedRoomNumber + "倒计时： 00分钟01秒"){
                //             this.$message.info("无法再次发起投票",15);
                //         }else{
                //             let that = this;
                //             let userName = Vue.ls.get(USER_INFO).userName;
                //             if(that.voteWebsocket === null){
                //                 that.voteWebsocket = this.fn("ws:192.168.111.200:8088/websocket/chatSocket/" + this.invitedRoomNumber + "/" + userName);
                //                 that.voteWebsocket.onopen = function(){
                //                     that.voteWebsocket.send("!~%^^__++!qw")
                //                 }
                //                 that.voteWebsocket.onmessage = function(data){
                //                     if(JSON.parse(data.data).secretWord === "!~%^^__++!qw" ){
                //                         that.data.push(JSON.parse(data.data).secretWord)
                //                         for(let i = 0 ; i < that.$refs.currentRoomVote.length ; i ++){
                //                             if(value === that.$refs.currentRoomVote[i].$el.innerText.substring(0,that.$refs.currentRoomVote[i].$el.innerText.length - 6) * 1){
                //                                 that.$refs.voteContent[i].style.display = "block";
                //                                 that.resetTime(120,value)
                //                             }
                //                         }
                //                         that.voteShow =  true;
                //                     }
                //                 }
                //             }else{
                //                 that.voteWebsocket.send("!~%^^__++!qw")
                //                 that.voteWebsocket.onmessage = function(data){
                //                     if(JSON.parse(data.data).secretWord === "!~%^^__++!qw"){
                //                         that.data.push(JSON.parse(data.data).secretWord)
                //                         that.voteShow =  true;
                //                     }
                //                 }
                //             }
                //         }
                //     }else if(res.data === false){
                //         this.$message.warning('已经投过票了,无法再次开启投票');
                //     }
                // })
                
                // `str+!__++#^.`
            
            getUrlparameter(str,name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");     
                var r = str.match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            web(){
                let url = window.location.href;
                let a = this.getUrlparameter(url.split("?")[1],"n");
                if(a){
                    // console.log(a,"=======================");
                    let socket = new WebSocket(a);
                    socket.onopen = function(){

                    };
                    let that = this;
                    socket.onmessage = function(data){
                        // console.log(data);
                        // if(JSON.parse(data.data).performVoting){
                        //     that.D.push(JSON.parse(data.data).performVoting)
                        // }
                    }
                }
            },
            close(value){
                for(let i = 0 ; i < this.$refs.groupSettingShow.length ; i ++){
                    for(let j = 0 ; j < this.$refs.closeBtn.length ; j ++){
                        if(value === this.$refs.closeBtn[j].innerText.substring(0,this.$refs.closeBtn[j].innerText.length-5) * 1 && j === i){
                            this.$refs.groupSettingShow[i].style.display = "none";
                        }
                    }
                }
            },
            fn1(){
                let that = this;
                this.scoket = null;
                let userName = Vue.ls.get(USER_INFO).userName;
                // console.log(that.sendMsgWebsocket,userName,this.invitedRoomNumber,"第二个oooooooo")
                if(that.sendMsgWebsocket === null){
                    that.sendMsgWebsocket = this.fn("ws:192.168.111.200:8088/websocket/chatSocket/" + this.invitedRoomNumber + "/" + userName);
                    that.sendMsgWebsocket.onopen = function(){
                        if(that.$refs.inputValue[that.subscript].innerText !== ""){
                            that.sendMsgWebsocket.send(that.$refs.inputValue[that.subscript].innerText)
                        }
                        for(let i = 0 ; i < that.$refs.inputValue.length ; i ++){
                            that.$refs.inputValue[i].innerText = ""
                        }
                    }
                    that.sendMsgWebsocket.onmessage = function(data){
                        if(JSON.parse(data.data).sendMsg){
                            that.chatContentInformation.push(JSON.parse(data.data))
                            // console.log(data,"我是发送消息1111111113333333333");
                        }
                        if(JSON.parse(data.data).secretWord === "!~%^^__++!qw"){
                            // alert("我被触发了")
                            for(let i = 0 ; i < that.$refs.currentRoomVote.length ; i ++){
                                console.log(that.$refs.currentRoomVote[i].$el.innerText.substring(0,that.$refs.currentRoomVote[i].$el.innerText.length - 6))
                                if(that.invitedRoomNumber === that.$refs.currentRoomVote[i].$el.innerText.substring(0,that.$refs.currentRoomVote[i].$el.innerText.length - 6) * 1){
                                    that.$refs.voteContent[i].style.display = "block";
                                    that.resetTime(120,that.invitedRoomNumber)
                                }
                            }
                            that.voteShow =  true;
                        }
                    }
                }else{
                    if(that.$refs.inputValue[that.subscript].innerText){
                        that.sendMsgWebsocket.send(that.$refs.inputValue[that.subscript].innerText)
                    }
                    for(let i = 0 ; i < that.$refs.inputValue.length ; i ++){
                        that.$refs.inputValue[i].innerText = ""
                    }
                    that.sendMsgWebsocket.onmessage = function(data){
                        if(JSON.parse(data.data).sendMsg){
                            that.chatContentInformation.push(JSON.parse(data.data))
                        }
                    }
                }
            },
            success (value) {
                this.$message.success(value);
            },
            clickToDisplayTheThatArea(){
                this.$refs.chatBox.style.display = "block";
                this.$refs.chatIcon.style.display = "none";
            },
            chatBoxShow(){
                this.$refs.chatBox.style.display = "none";
                this.$refs.chatIcon.style.display = "block"
            },

            fn(value){
                let userName = Vue.ls.get(USER_INFO).userName;
                let num = Math.floor(Math.random()*100000+1);
                if(this.scoket === null && value === undefined){
                    this.scoket = new WebSocket("ws:192.168.111.200:8088/websocket/chatSocket/" + num + "/" + userName);
                    return this.scoket
                }
                if(value !== undefined){
                    this.scoket = new WebSocket(value)
                    return this.scoket
                }
            },
            // 创建房间
            createChatRoomBtn(){
                if(this.$refs.chatArea){
                    for(let i = 0 ; i < this.$refs.chatArea.length ; i ++){
                        this.$refs.chatArea[i].style.display = "none"
                        this.$refs.chatArea[i].style.zIndex = "0"
                    };
                };
                if(this.$refs.chatRoomName){
                    for(let i = 0 ; i < this.$refs.chatRoomName.length ; i ++){
                        this.$refs.chatRoomName[i].style.background = "#5868d9";
                        this.$refs.chatRoomName[i].style.color = "#d0d5fb";
                    };
                };
                
                this.scoket = null;
                let scoket = this.fn();
                scoket.onopen = function(){
                    // console.log("创建房间")
                    
                };
                let that = this;
                scoket.onmessage  = function(data){
                    // console.log(data,"我是data")
                    if(JSON.parse(data.data).urls){
                        that.url = JSON.parse(data.data).urls ;
                    }
                    if(JSON.parse(data.data).sid){
                        that.createdRoom.push(JSON.parse(data.data).sid);
                    }
                    that.fang = data.currentTarget.url;
                    that.getCurrentUserRoom();
                };
                
            },
            // 关闭当前房间
            closeCurrentChatRoom(value){

            },
            // 获取当前用户的所有房间
            getCurrentUserRoom(){
                // alert(this.currentUserName)
                axios.get("/websocket/queryWebsocketSid",{
                    params : {
                        userName : this.currentUserName,
                    },
                    Headers : {
                        "content-type" : "application/json;charset=UTF-8"
                    }
                }).then((data)=>{
                    this.createdRoom = data.data;
                    if(data.data.length >= 1){
                        this.disabled = true;
                    }
                    // console.log(data,"6666");
                }).catch((data)=>{
                    console.log(data);
                })
            },
            // 切换房间
            chatRoomName(value,valuefang){
                for(let i = 0 ; i < this.$refs.voteContent.length ; i ++){
                    // console.log(this.$refs.voteContent[i])
                }
                for(let i = 0 ; i < this.$refs.chatRoomName.length ; i ++){
                    if(value === i){
                        this.$refs.chatRoomName[i].style.background = "#3949b7"
                        this.$refs.chatRoomName[i].style.color = "#fff"
                    }else{
                        this.$refs.chatRoomName[i].style.background = "#5868d9"
                        this.$refs.chatRoomName[i].style.color = "#d0d5fb"
                    }
                };
                
                if(this.sendMsgWebsocket !== null){
                    this.sendMsgWebsocket.close();
                }
                if(this.voteWebsocket !== null){
                    this.voteWebsocket.close();
                }
                this.chatContentInformation = [];
                this.subscript = value;
                this.invitedRoomNumber = valuefang;
                this.sendMsgWebsocket = null;
                this.voteWebsocket = null;
                this.fn1();
                this.data = [];
                // this.initiateVote();
                this.currentChatRoom = value;
                axios.get("/websocket/querySidUserRecord",{
                    params : {
                        sid : valuefang
                    }
                }).then((data)=>{
                    this.chatContentInformation = data.data;
                }).catch((data)=>{
                    // alert(data)
                });
                for(let i = 0 ; i < this.$refs.chatArea.length ; i ++){
                    if(value === i){
                        this.$refs.chatArea[i].style.zIndex = "1"
                        this.$refs.chatArea[i].style.display = "block"
                    }else{
                        this.$refs.chatArea[i].style.zIndex = "0"
                        this.$refs.chatArea[i].style.display = "none"
                    }
                };
                // console.log(this.$refs.countdownValue)
                for(let i = 0 ; i < this.$refs.currentRoomVote.length ; i ++){
                    if(valuefang === this.$refs.currentRoomVote[i].$el.innerText.substring(0,this.$refs.closeBtn[i].innerText.length-5) * 1){
                        // console.log(this.$refs.currentRoomVote[i]);
                    }
                    // console.log(this.$refs.currentRoomVote[i])
                }
            },
            // 点击群设置
            groupSetting(){
                for(let i = 0 ; i < this.$refs.groupSettingShow.length ; i ++){
                    if(this.currentChatRoom === i){
                        this.$refs.groupSettingShow[i].style.display = "block";
                        this.getInTheCurrentRoomUser(this.invitedRoomNumber);
                    }else{
                        this.$refs.groupSettingShow[i].style.display = "none";
                    }
                }
            },
            // 添加讨论组人员
            addDiscussionGroupStaff(){
                this.plainOptions = [];
                this.getAllOnlineUsers();
                this.visible = true;
            },
            onChange(checkedList) {
                this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length;
                this.checkAll = checkedList.length === this.plainOptions.length;
                // console.log(checkedList)
            },
            onCheckAllChange(e) {
                Object.assign(this, {
                    checkedList: e.target.checked ? this.plainOptions : [],
                    indeterminate: false,
                    checkAll: e.target.checked,
                });
                // console.log(this.checkedList)
            },
            addDiscussionGroupStaffOk(){
                let rightStr = "";
                let leftStr = "";
                let URL = this.$route.query.mp4;
                for(let i = 0 ; i < this.$route.query.violationDataDetailsProcessing.length ; i ++){
                    rightStr += this.$route.query.violationDataDetailsProcessing[i] + '`new++//`'
                }
                for(let i = 0 ; i < this.$route.query.leftData.length ; i ++){
                    leftStr += this.$route.query.leftData[i] + ','
                }
                let url = window.location.href;
                let progromId = this.getUrlparameter(url.split("?")[1],"progromId");
                let userName = Vue.ls.get(USER_INFO).userName;
                let str = "";
                
                for(let i = 0 ; i < this.checkedList.length ; i ++){
                    str += this.checkedList[i] + ","
                }
                //console.log("ws:192.168.111.200:8088/websocket/chatSocket/" + this.invitedRoomNumber + "/" +"," + this.invitedRoomNumber + ","  + progromId + "," + str.substring(0,str.length-1) + ',' + "str+!__++#^" + leftStr + "str+!__++#^" + rightStr + "str+!__++#^" + URL,"-------------------------")
                websocket.oWs.send("ws:192.168.111.200:8088/websocket/chatSocket/" + this.invitedRoomNumber + "/" +"," + this.invitedRoomNumber + ","  + progromId + "," + str.substring(0,str.length-1) + ',' + "str+!__++#^" + leftStr + "str+!__++#^" + rightStr + "str+!__++#^" + URL)
                this.visible = false;
                this.indeterminate = false;
                this.checkAll = false;
                this.checkedList = [];
                this.close(this.invitedRoomNumber);
            },
            addDiscussionGroupStaffCancel(){
                this.indeterminate = false;
                this.checkAll = false;
                this.checkedList = [];
                this.visible = false;
            },
            // 获取所有在线用户
            getAllOnlineUsers(){
                getCurrentLoginUserList({}).then((res)=>{
                    let arr = [];
                    let userArr = [];
                    for(let i = 0 ; i < res.result.length ; i ++){
                        arr.push(JSON.parse(res.result[i]).userName)
                    }
                    axios.get("/websocket/querySidUserName").then((res)=>{
                        // console.log(res.data);
                        for(let i = 0 ; i < res.data.length ; i ++){
                            for(let j = 0 ; j < arr.length ; j ++){
                                if(res.data[i] == arr[j]){
                                    arr.splice(j,1);
                                }
                            }
                        }
                        this.plainOptions = arr
                        console.log(this.plainOptions,"呵呵");
                    })
                })
            },
            // 获取当前房间内的用户
            getInTheCurrentRoomUser(value){
                axios.get("/websocket/queryWebsocketUser",{
                    params : {
                        sid : value,
                    }
                }).then((data)=>{
                    this.inTheCurrentRoomUser = data.data;
                }).catch((data)=>{
                    console.log(data)
                })
            },
            // 点击表情的按钮
            expression(){
                this.showEmoticonImageArea = !this.showEmoticonImageArea;
                if(this.showEmoticonImageArea === true){
                    for (let i in appData) {
                        this.expressionList.push(appData[i].char)
                    }
                }else{
                    this.expressionList = [];
                }
            },
            // 选中的表情
            checkExpression(value){
                let str = ""
                for(let i in this.expressionList){
                    if(value === i * 1){
                        str = this.expressionList[i]
                        // console.log(this.expressionList[i])
                    }
                }
                for(let k = 0 ; k < this.$refs.chatArea.length ; k ++){
                    if(this.$refs.chatArea[k].style.display === "block"){
                        // console.log(this.$refs.chatArea[k])
                        for(let j = 0 ; j < this.$refs.inputValue.length ; j ++){
                            if(k === j){
                                this.$refs.inputValue[j].innerText += str;
                                this.showEmoticonImageArea = !this.showEmoticonImageArea
                            }
                        }
                    }else{
                        // alert("222222")
                    }
                }
            }
        },
        mounted(){

            let oChatBox = document.querySelectorAll('.chat-box');
            oChatBox[0].onmousedown = function(e){
                // console.log(e.offsetX)
            }
            this.web();
            this.getCurrentUserRoom();
        },
        beforeUpdate(){
            this.$nextTick(()=>{
                if(this.$refs.content){
                    for(let i = 0 ; i < this.$refs.content.length ; i ++){
                        if(this.$refs.content[i].scrollHeight > 0){
                            this.$refs.content[i].scrollTop = this.$refs.content[i].scrollHeight
                        };
                    };
                };
            });
        },
    }
</script>

<style lang="scss" scoped>
    #chat{
        position: absolute;
        right: 625px;
        // left : 738px;
        // top : 233px;
    }
    .chat-box{
        width: 602px;
        height:500px;
        background: #fff;
        position: absolute;
        // margin-top: -600px;
        // margin-left: 715px;
        display: none;
        z-index: 100;
        padding: 1px 1px 0 0;
        // border: 1px solid black;
        .chat-box-top{
            width: 602px;
            height:50px;
            border-bottom: 1px solid #e9eef1;
            // background: purple; 
            .chat-box-show:hover{
                cursor: pointer;
            }
        }
        .chat-box-buttom{
            position: relative;
            .chat-box-buttom-left{
                width:120px;
                height:450px;
                background: #5868d9;
                overflow-y: auto;
                float: left;
                
                >div{
                    cursor: pointer;
                }
            }
            .chat-box-buttom-left::-webkit-scrollbar {/*滚动条整体样式*/
                    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
                    height: 1px;
            }
            .chat-box-buttom-left::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                    background:#BEBEBE;
                }
            .chat-box-buttom-left::-webkit-scrollbar-track {/*滚动条里面轨道*/
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                    border-radius: 10px;
                    background: #EDEDED;
                }
        }
    }
    .group-setting:hover{
        cursor: pointer;  
    }
    .chat-icon{
        width:50px;
        height:50px;
        position: fixed;
        right: 20px;
        top:220px;
        img{
            width:100%;
            height:100%;
        }
    }
    .chat-icon:hover{
        cursor: pointer;
    }
    .input:focus{
        border: 0px;
    }
    .input{
        overflow-y: auto;
    }
    .input::-webkit-scrollbar{
        width:5px;
        height:1px;
    }
    .input::-webkit-scrollbar-thumb{
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #EDEDED;
    }
    .input::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #fff;
    }
    .close:hover{
        cursor: pointer;
    }
    ul,li{
        list-style: none;
        margin: 0px;
        padding: 0px;
    }
    .current-user{
        float: right;
        color:#424242;
        margin-right: 10px;
        background: #fff;
        word-break: break-all;
        width: auto;
        max-width: 35%;
        min-height: 27px;
        border-radius: 5px;
        line-height: 25px;
        font-size: 16px;
        text-align: left;
        padding: 8px;
        background: #5868d9;
        margin-top:9px;
    }
    .no-current-user{
        float: left;
        color:#424242;
        margin-left: 10px;
        background: #fff;
        word-break: break-all;
        width: auto;
        max-width: 35%;
        min-height: 27px;
        border-radius: 5px;
        line-height: 25px;
        font-size: 16px;
        text-align: left;
        padding: 8px;
        background: #e9eff1;
        margin-top:9px;
    }
    .input:focus{
        border-color:#fff !important;
    }
    .no-userName{
        width:55px;
        height:55px;
        border-radius: 50%;
        text-align: center;
        line-height: 55px;
        font-size: 13px;
        background-color: #5868d9;
        display: block;
        float: left;
        // margin-top:9px;
    }
    .userName{
        width:55px;
        height:55px;
        border-radius: 50%;
        text-align: center;
        line-height: 55px;
        font-size: 13px;
        background-color: #5868d9;
        display: block;
        float: right;
        // margin-top:9px;
    }
    .chat-area-content::-webkit-scrollbar {/*滚动条整体样式*/
        width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    .chat-area-content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        height:5px;
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #EEEEE0;
    }
    .chat-area-content::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #fff;
    }
    .expression{
        width:50px;
        height:36px;
        background: yellow;
        display: inline-block;
        text-align: center;
        line-height: 36px;
    }
    .emoticon-image-area{
        width:300px;
        height:150px;
        background-color:#F2F2F2;
        margin-top:-150px;
        border: 1px solid;
        margin-left: -100px;
        position: relative;
        ul{
            width: 100%;
            height:100%;
            overflow-y: auto;
            li{
                float: left;
                width:25px;
                height:25px;
            }
            li:hover{
                cursor: pointer;
            }
        }
        ul::-webkit-scrollbar{
            width: 0px;
        }
    }
    .expression:hover{
        cursor: pointer;
    }
    .voting-show{
        width:235px;
        height:55px;
        background: #8896fb;
        margin-top:-155px;
        margin-left: 140px;
        display: none;
    }
</style>
        