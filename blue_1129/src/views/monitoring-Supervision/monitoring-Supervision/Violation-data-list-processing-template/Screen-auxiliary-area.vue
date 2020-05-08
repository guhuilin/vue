<template>
<!-- customArea -->
    <div style="background:#fff;margin-top:10px;">
        <div>
            <div style="padding:15px 0px;">
                <a-button type="primary" @click="showModal">自定义区域</a-button>
                <a-button type="primary" @click="fullScreen">打开全屏</a-button>
                <a-modal
                    title="自定义区域"
                    :visible="visible"
                    @ok="customAreaOk"
                    @cancel="customAreaCancel"
                    :maskClosable="false"
                    :width="400"
                    :centered="true"
                >
                    <div class="custom-area">
                        <div>
                            <p>
                                每行：
                            </p>
                            <p>
                                共：
                            </p>
                        </div>
                        <div>
                            <a-input placeholder="请输入" v-model="row" style="width:150px;display:block;margin: 0 0 5px 0;"></a-input>
                            <a-input placeholder="请输入" v-model="column" style="width:150px;display:block;margin: 0 0 5px 0;"></a-input>
                        </div>
                    </div>
                </a-modal>
            </div>
        </div>
        <div class="play-source" ref="platSource">

            <div style="width:400px;height:257px;border:1px solid #ccc;">
                <div style="width:400px;height:216px">
                    <video style="width:100%;height:100%;padding-right:2px;" controls="controls" src="http://192.168.111.200/videos/ts/2.mp4">
                        此视频暂无法播放，请稍后再试
                    </video>
                </div>
                <div style="margin-left:155px;margin-top:9px;">
                    <a-button style="margin-right:10px;">播放原</a-button>
                    <!-- <div style="display:inline-block;width:20px;height:32px;"> -->
                        <a-icon class="icon" type="close-circle" />
                    <!-- </div> -->
                </div>
            </div>
            <div style="width:400px;height:257px;border:1px solid #ccc;">
                <div style="width:400px;height:216px">
                    <video style="width:100%;height:100%;padding-right:2px;" controls="controls" src="http://192.168.111.200/videos/ts/2.mp4">
                        此视频暂无法播放，请稍后再试
                    </video>
                </div>
                <div style="margin-left:155px;margin-top:9px;">
                    <a-button style="margin-right:10px;">播放原</a-button>
                    <!-- <div style="display:inline-block;width:20px;height:32px;"> -->
                        <a-icon class="icon" type="close-circle" />
                    <!-- </div> -->
                </div>
            </div>
            <div style="width:400px;height:257px;border:1px solid #ccc;">
                <div style="width:400px;height:216px">
                    <video style="width:100%;height:100%;padding-right:2px;" controls="controls" src="http://192.168.111.200/videos/ts/2.mp4">
                        此视频暂无法播放，请稍后再试
                    </video>
                </div>
                <div style="margin-left:155px;margin-top:9px;">
                    <a-button style="margin-right:10px;">播放原</a-button>
                    <!-- <div style="display:inline-block;width:20px;height:32px;"> -->
                        <a-icon class="icon" type="close-circle" />
                    <!-- </div> -->
                </div>
            </div>
            <div style="width:400px;height:257px;border:1px solid #ccc;">
                <div style="width:400px;height:216px">
                    <video style="width:100%;height:100%;padding-right:2px;" controls="controls" src="http://192.168.111.200/videos/ts/3.mp4">
                        此视频暂无法播放，请稍后再试
                    </video>
                </div>
                <div style="margin-left:155px;margin-top:9px;">
                    <a-button style="margin-right:10px;">播放原</a-button>
                    <!-- <div style="display:inline-block;width:20px;height:32px;"> -->
                        <a-icon class="icon" type="close-circle" />
                    <!-- </div> -->
                </div>
            </div>
            <div style="width:400px;height:257px;border:1px solid #ccc;">
                <div style="width:400px;height:216px">
                    <video style="width:100%;height:100%;padding-right:2px;    margin: 0px auto;" controls="controls" src="http://192.168.111.200/videos/ts/4.mp4">
                        此视频暂无法播放，请稍后再试
                    </video>
                </div>
                <div style="margin-left:155px;margin-top:9px;">
                    <a-button style="margin-right:10px;">播放原</a-button>
                    <!-- <div style="display:inline-block;width:20px;height:32px;"> -->
                        <a-icon class="icon" type="close-circle" />
                    <!-- </div> -->
                </div>
            </div>
            
            
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                visible: false,
                row : "",// 行
                column : "",//列
            }
        },
        methods: {
            // root.webkitRequestFullScreen();
            fullScreen(){
                this.$refs.platSource.webkitRequestFullScreen()
            },
            showModal() {
                this.visible = true
            },
            // 确定
            customAreaOk(e) {
                    this.visible = false;
            },
            // 取消
            customAreaCancel(e) {
                this.visible = false
            },
            
        },
        mounted(){
            
        }
    }
</script>

<style lang="scss" scoped>
    .custom-area{
        >div{
            display: inline-block;
        }
    }
    .icon{
        font-size: 22px;
        
    }
    .play-source{
        width:100%;
        height:559px;
        // background:yellow;
        overflow-y: auto;
        >div{
            margin:5px 13px;
            float: left;
        }
    }
    .icon:hover{
        cursor: pointer;
    }
    video{
        // border: 10px solid yellow;
        outline:none;
    }
</style>