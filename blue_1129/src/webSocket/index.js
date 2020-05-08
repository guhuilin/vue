let userName
let oWs
let url
import Vue from "vue";
import router from '../router'
if(localStorage.pro__Login_Userinfo === undefined){

}else{
    userName = JSON.parse(localStorage.pro__Login_Userinfo)
    oWs = new WebSocket("ws://192.168.111.200:8088/websocket/chatSocket/1/"+userName.value.userName);
    oWs.onmessage = function(data){
        let str = ""
        str = JSON.parse(data.data)
        if(str.sendMsg !== undefined){
            let arr = str.sendMsg.split(",")
            let stry = "";
            stry = userName.value.userName
            let number = arr.indexOf(stry)
            if(arr[number] !== undefined){
                var div=document.createElement("div");
                let buttonOk = document.createElement("button");
                let buttonCancel = document.createElement("button");
                let app = document.querySelector("#app");
                buttonOk.innerText = "确定";
                buttonCancel.innerText = "取消";
                div.innerText = str.from + "邀请您加入聊天室"
                div.style.width = "325px";
                div.style.height = "150px";
                div.style.background = "#fff";
                div.style.position = "absolute";
                div.style.left = "50%";
                div.style.top = "50%";
                div.style.zIndex = "10";
                div.style.marginLeft = "-162px";
                div.style.marginTop = "-90px";
                div.style.boxShadow = "0px 0px 20px #333"
                div.style.borderRadius = "1em";
                div.style.padding = "0.5em";
                div.style.fontSize = "16px";
                buttonOk.style.marginTop = "80px";
                buttonOk.style.marginLeft = "107px";
                buttonOk.style.marginRight = "5px";
                buttonOk.style.display = "inline-block"
                div.appendChild(buttonOk)
                div.appendChild(buttonCancel)
                app.appendChild(div);
                buttonOk.onclick = function(){
                    let leftData = str.title.substring(0,str.title.length - 1).split(",")
                    let rightData = str.content.split("`new++//`");
                    let vm = new Vue({
                        router,
                    });
                    div.remove();
                    url = str.urls;
                    let href = vm.$router.resolve({
                        path : "/violationDataProcessing",
                        query : {
                            n : url + userName.value.userName,
                            progromId : str.programId,
                            leftData : leftData,
                            violationDataDetailsProcessing : rightData,
                            mp4 : str.urlMp,
                        }
                    })
                    window.open(href.href,'_blank')
                }
                // 取消事件
                buttonCancel.onclick = function(){
                    div.remove();
                }
            }
        }
    };
};
export default {
    userName,
    oWs,
}
