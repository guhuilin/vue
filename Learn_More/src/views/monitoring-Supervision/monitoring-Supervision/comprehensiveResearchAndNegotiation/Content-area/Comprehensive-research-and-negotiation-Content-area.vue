<template>
    <div>
        <a-spin
            :spinning="spinning"
        >
            <div class="content" ref="content">
                <div v-for="value in topArr" @dblclick="dbClick(value.areaCode)" ref="topAreaDiv" style="border:1px solid black;line-height:100px;text-align: center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;">{{value.areaCode}}

                    <div style="display:none">
                        <a-button  style="position:absolute;left:42%;top:0;" @click="deleteElement">
                            <a-icon type="delete" /> 
                            删除
                        </a-button>
                        <a-button @click="cutBackWidthPx" style="position:absolute; left:0;top:0;">
                            -宽
                        </a-button>
                        <a-button @click="increaseWidthPx" style="position:absolute;right:0;top:0;">
                            +宽
                        </a-button>
                        <a-button @click="increaseHeightPx" style="position:absolute;bottom:0;right:0;">
                            +高
                        </a-button>
                        <a-button @click="cutBackHeightPx" style="position:absolute;bottom:0;left:0;">
                            -高
                        </a-button>
                    </div>
                </div>
            </div>
        </a-spin>
    </div>
</template>

<script>
    import { queryCustomAreaCode } from '@/api/api.js'
    import bus from '../../../bus/bus.js'
    
    export default {
        data(){
            return{
                topArr : [],
                currentUser : "",

                // 加载中
                spinning : true,
            }
        },
        created(){
            this.currentUser = JSON.parse(localStorage.pro__Login_Userinfo).value.userName;
            this.getCustomZoneContent();
        },
        beforeUpdate(){
            bus.$on("createdElement",data=>{
                // console.log(data,"我是data");
                for(let i = 0 ; i < data.length ; i ++){
                    this.topArr.push(data[i]);
                }
            })
            let obj = {};
            this.topArr = this.topArr.reduce((cur,next) => {
                obj[next.areaCode] ? "" : obj[next.areaCode] = true && cur.push(next);
                return cur;
            },[])

            this.$nextTick(() => {
                let thatt = this;
                for(let i = 0 ; i < this.topArr.length ; i ++){
                    this.$refs.topAreaDiv[i].style.position = "absolute"
                    this.$refs.topAreaDiv[i].style.left = this.topArr[i].left + "px";
                    this.$refs.topAreaDiv[i].style.top = this.topArr[i].top + "px";
                    this.$refs.topAreaDiv[i].style.left = this.topArr[i].left + "px";
                    this.$refs.topAreaDiv[i].style.width = this.topArr[i].width + "px";
                    this.$refs.topAreaDiv[i].style.height = this.topArr[i].height + "px";
                };

                // 拖拽
                if(this.$refs.topAreaDiv){
                    for(let i = 0 ; i < this.$refs.topAreaDiv.length ; i ++){
                        this.$refs.topAreaDiv[i].onmousedown = function(e){
                            let mouseDistanceBrowserLeft = e.clientX;//鼠标距离浏览器窗口的距离
                            let mouseDistanceBrowserTop = e.clientY;//鼠标距离浏览器窗口的距离
                            // console.log(e.pageX,e.pageY);
                            let oleft = this.offsetLeft;
                            let otop = this.offsetTop;
                            let that = this
                            document.onmousemove = function(e){
                                // console.log(that);
                                let clientX = e.clientX;
                                let clientY = e.clientY;
                                let left = clientX - (mouseDistanceBrowserLeft - oleft);
                                let top = clientY - (mouseDistanceBrowserTop - otop);
                                let oBox = document.querySelectorAll(".content")
                                
                                if(left <= 0){
                                    left = 0;
                                }else if(left >= oBox[0].offsetWidth - that.offsetWidth){
                                    left = oBox[0].offsetWidth - that.offsetWidth
                                }
                                if(top <= 0){
                                    top = 0;
                                }else if(top >= oBox[0].offsetHeight - that.offsetHeight){
                                    top =  oBox[0].offsetHeight - that.offsetHeight;
                                }
                                // console.log(that.style.left.substring(0,that.style.left.length - 2) ,that.style.top.substring(0,that.style.top.length - 2) ,"999999999999999")
                                thatt.topArr[i].left = that.style.left.substring(0,that.style.left.length - 2)                       
                                thatt.topArr[i].top = that.style.top.substring(0,that.style.top.length - 2)
                                that.style.left = left + "px";
                                that.style.top = top + "px";
                            },
                            document.onmouseup = function(e){
                                this.onmousemove = null;
                            }
                        }
                    }
                }
            });
            
        },
        methods : {
            showDeleteConfirm() {
                
            },
            // 删除当前元素
            deleteElement(e){
                let that = this
                this.$confirm({
                    title: '提示',
                    content: '确定要删除当前元素吗',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    onOk() {
                        for(let i = 0 ; i < that.topArr.length ; i ++){
                            if(that.topArr[i].areaCode === e.path[2].innerText.substring(0,e.path[2].innerText.length - 15)){
                                that.topArr.splice(i,1)
                            };
                            that.$refs.topAreaDiv[i].childNodes[1].style.display = "none"
                        };
                    },
                    onCancel() {

                    },
                });
                
            },
            // 减宽
            cutBackWidthPx(e){
                let str = 20;
                if(e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2) * 1 === 100){
                    e.currentTarget.parentNode.parentNode.style.width = e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2)
                }else{
                    e.currentTarget.parentNode.parentNode.style.width = e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2) * 1 - str + "px"
                    for(let i = 0 ; i < this.topArr.length ; i ++){
                        if(this.topArr[i].areaCode === e.currentTarget.parentNode.parentNode.innerText.substring(0,e.currentTarget.parentNode.parentNode.innerText.length - 15)){
                            this.topArr[i].width = e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2);
                        }else{
                            
                        }
                    }
                    // console.log(this.topArr)
                }
            },
            // 减高
            cutBackHeightPx(e){
                let str = 20;
                if(e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2) * 1 === 100){
                    e.currentTarget.parentNode.parentNode.style.height = e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2)
                }else{
                    e.currentTarget.parentNode.parentNode.style.height = e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2) * 1 - str + "px"
                    for(let i = 0 ; i < this.topArr.length ; i ++){
                        if(this.topArr[i].areaCode === e.currentTarget.parentNode.parentNode.innerText.substring(0,e.currentTarget.parentNode.parentNode.innerText.length - 15)){
                            this.topArr[i].height = e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2);
                        }else{
                            
                        }
                    }
                    // console.log(this.topArr)
                }
            },
            // // 变高
            increaseHeightPx(e){
                let str = 20;
                if(e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2) * 1 + str === 520){
                    e.currentTarget.parentNode.parentNode.style.height = e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2) * 1 + str
                }else{
                    e.currentTarget.parentNode.parentNode.style.height = e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2) * 1 + str + "px"
                    for(let i = 0 ; i < this.topArr.length ; i ++){
                        if(this.topArr[i].areaCode === e.currentTarget.parentNode.parentNode.innerText.substring(0,e.currentTarget.parentNode.parentNode.innerText.length - 15)){
                            this.topArr[i].height = e.currentTarget.parentNode.parentNode.style.height.substring(0,e.currentTarget.parentNode.parentNode.style.height.length - 2);
                        }else{
                            
                        }
                    }
                    // console.log(this.topArr)
                }
            },
            // 变宽
            increaseWidthPx(e){
                let str = 20;
                if(e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2) * 1 + str === 520){
                    e.currentTarget.parentNode.parentNode.style.width = e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2) * 1 + str
                }else{
                    e.currentTarget.parentNode.parentNode.style.width = e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2) * 1 + str + "px"
                    for(let i = 0 ; i < this.topArr.length ; i ++){
                        console.log(e.currentTarget.parentNode.parentNode.innerText.substring(0,e.currentTarget.parentNode.parentNode.innerText.length - 15),1111);
                        console.log(this.topArr[i].areaCode,22222)
                        if(this.topArr[i].areaCode === e.currentTarget.parentNode.parentNode.innerText.substring(0,e.currentTarget.parentNode.parentNode.innerText.length - 15)){
                            this.topArr[i].width = e.currentTarget.parentNode.parentNode.style.width.substring(0,e.currentTarget.parentNode.parentNode.style.width.length - 2);
                        }else{

                        }
                    }
                    // console.log(this.topArr)
                }
            },
            dbClick(value){
                for(let i = 0 ; i < this.$refs.topAreaDiv.length ; i ++){
                    // console.log(this.$refs.topAreaDiv[i].innerText)
                    if(this.$refs.topAreaDiv[i].innerText === value){
                        this.$refs.topAreaDiv[i].childNodes[1].style.display = "block"
                    }
                }
                // console.log(this.$refs.topAreaDiv,value)
            },
            getCustomZoneContent(){
                this.spinning = true;
                queryCustomAreaCode({
                    userName : this.currentUser
                }).then((res)=>{
                    for(let i = 0 ; i < res.result.length ; i ++){
                        if(res.result[i].areaCode === "B"){
                            res.result[i].areaCode = "节目基本信息区"
                        }
                        if(res.result[i].areaCode === "A"){
                            res.result[i].areaCode = "视频区"
                        }
                        // 
                        if(res.result[i].areaCode === "DbCheckArea"){
                            res.result[i].areaCode = "研判参考区"
                        }
                        if(res.result[i].areaCode === "DbMateLrial"){
                            res.result[i].areaCode = "资料库区"
                        }
                        if(res.result[i].areaCode === "DbAnalyseArea"){
                            res.result[i].areaCode = "数据分析区"
                        }
                        // 3: {id: 4, configCode: "", isChecked: 0, configName: ""}
                        // 4: {id: 5, configCode: "", isChecked: 0, configName: ""}
                    }
                    // console.log(res,"11111111111111111111111");
                    this.topArr = res.result;
                    let that = this;
                    setTimeout(function(){
                        that.spinning = false;
                    },500);
                })
            },
        },
        mounted(){
            
        }
    };
</script>

<style scoped>
    .content{
        height: 760px;
        background: #fff;
        margin-top:10px;
        position: relative;
        /* cursor: pointer; */
    }
</style>