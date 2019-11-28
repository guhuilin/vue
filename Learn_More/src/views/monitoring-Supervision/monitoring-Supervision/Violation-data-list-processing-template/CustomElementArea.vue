<template>
    <div>
        <div class="topArea" ref="topArea">
            <div
                v-for="(value,index) in topArr"
                :key="index"
                ref="topAreaDiv"
                style="border:1px solid black"
            >{{value.areaCode}}</div>
        </div>
    </div>
</template>

<script>
    import { queryCustomAreaCode } from '@/api/api.js'
    export default {
        data(){
            return{
                topArr : [],
                currentUser : "",
            }
        },
        created(){
            this.currentUser = JSON.parse(localStorage.pro__Login_Userinfo).value.userName;
            this.getCustomZoneContent();
        },
        beforeUpdate(){
            this.$nextTick(() => {
                for(let i = 0 ; i < this.topArr.length ; i ++){
                    this.$refs.topAreaDiv[i].style.position = "absolute"
                    this.$refs.topAreaDiv[i].style.left = this.topArr[i].left + "px";
                    this.$refs.topAreaDiv[i].style.top = this.topArr[i].top + "px";
                    this.$refs.topAreaDiv[i].style.left = this.topArr[i].left + "px";
                    this.$refs.topAreaDiv[i].style.width = this.topArr[i].width + "px";
                    this.$refs.topAreaDiv[i].style.height = this.topArr[i].height + "px";
                };
                for(let i = 0 ; i < this.$refs.topAreaDiv.length ; i ++){
                    this.$refs.topAreaDiv[i].onmousedown = function(e){
                        console.log();
                        let mouseDistanceBrowserLeft = e.clientX;//鼠标距离浏览器窗口的距离
                        let mouseDistanceBrowserTop = e.clientY;//鼠标距离浏览器窗口的距离
                        let oleft = this.offsetLeft;
                        let otop = this.offsetTop;
                        // console.log(mouseDistanceBrowserLeft,left,top)
                        let that = this
                        document.onmousemove = function(e){
                            var clientX = e.clientX;
                            var clientY = e.clientY;
                            var left = clientX - (mouseDistanceBrowserLeft - oleft);
                            var top = clientY - (mouseDistanceBrowserTop - otop);
                            let topArea = document.querySelectorAll(".topArea")
                            if(left <= 0 ){
                                left = 0;
                            }else if(left >= topArea[0].offsetWidth - that.offsetWidth){
                                left = topArea[0].offsetWidth - that.offsetWidth;
                            };
                            if(top <= 0){
                                top = 0;
                            }else if(top >= topArea[0].offsetHeight - that.offsetHeight){
                                top = topArea[0].offsetHeight - that.offsetHeight;
                            }
                            that.style.left = left + "px";
                            that.style.top = top + "px";
                        };
                        document.onmouseup = function(){
                            this.onmousedown = null;
                            this.onmousemove = null;
                        }
                    }
                }
            });
        },
        methods : {
            getCustomZoneContent(){
                queryCustomAreaCode({
                    userName : this.currentUser
                }).then((res)=>{
                    this.topArr = res.result;
                })
            },
        }
    };
</script>

<style lang="scss" scoped>
</style>