<template>
    <div style="height:600px;position: relative;">
        <div style="margin-top:66px;">
            <canvas id="canvas" height="360" width="640" style="width:640px;display:none"></canvas>
            <div class="lalal">
                <video id="srcvideo" src="./video.mp4"  controls="controls" class="video-area">
                    您的浏览器不支持 video 标签。
                    
                </video>
                <div class="mask">

                </div>
            </div>
        </div>
        <div>
        </div>
        <div style="margin:15px 0 15px 73px;" v-show="isShow">
            <a-button type="primary" id="startBtn" disabled>开始录制</a-button>
            <a-button id="pauseBtn" disabled>暂停录制</a-button>
            <a-button id="resumeBtn" disabled type="dashed">恢复录制</a-button>
            <a-button id="stopBtn" disabled type="danger">结束录制</a-button>
        </div>
        <uploadVideo></uploadVideo>
        <div style="margin-top:20px; display:none">
            <p>切换录制编码格式</p>
            <p>
                <input
                    type="radio"
                    name="format"
                    value="video/webm;codecs=vp8"
                    onclick="setFormatSelect('video/webm;codecs=vp8')"
                />video/webm;codecs=vp8
            </p>
            <p>
                <input
                    type="radio"
                    name="format"
                    value="video/webm;codecs=vp9"
                    onclick="setFormatSelect('video/webm;codecs=vp9')"
                    checked="checked"
                />video/webm;codecs=vp9
            </p>
            <p>
                <input
                    type="radio"
                    name="format"
                    value="video/webm;codecs=h264"
                    onclick="setFormatSelect('video/webm;codecs=h264')"
                />video/webm;codecs=h264
            </p>
            <p>
                <input
                    type="radio"
                    name="format"
                    value="video/webm;codecs=avc1"
                    onclick="setFormatSelect('video/webm;codecs=avc1')"
                />video/webm;codecs=avc1
            </p>
            <p>
                <input
                    type="radio"
                    name="format"
                    value="video/x-matroska;codecs=avc1"
                    onclick="setFormatSelect('video/x-matroska;codecs=avc1')"
                />video/x-matroska;codecs=avc1
            </p>
        </div>
    </div>

</template>

<script>
    import uploadVideo from './Upload-video.vue'
    export default {
        data(){
            return{
                isShow : false
            }
        },
        components : {
            uploadVideo
        },
        methods:{
            
        },
        mounted() {
            var allChunks = [];
            var mousex = 0;
            var mousey = 0;
            var drawArray = [];
            var showDataAvailable = false;
            var el = this;
            init();
            function init() {
                var oStartPlaying = document.querySelector(".start-playing")
                var oPausePlayback = document.querySelector(".pause-playback")
                var mask = document.querySelector(".mask")
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                var srcvideo = document.getElementById("srcvideo");
                mask.onclick  = function(){
                    el.isShow = !el.isShow;
                    this.style.display = "none";
                    srcvideo.play();
                    playCanvas(srcvideo, ctx);
                }
            setRecorder();
            setFormatSelect("video/webm;codecs=vp9");
            }
            function playCanvas(srcvideo, ctx) {
                ctx.drawImage(srcvideo, 0, 0, 640, 360);
                for (var i = 0; i < drawArray.length; i++) {
                    ctx.beginPath();
                    const xFraction = drawArray[i].x / 640;
                    const yFraction = drawArray[i].y / 360;
                    const r = 255 * (1 - xFraction);
                    const g = 255 * yFraction;
                    const b = 255 * xFraction * (1 - yFraction);
                    ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, 1)`;
                    ctx.arc(drawArray[i].x, drawArray[i].y, 10, 0, 2 * Math.PI);
                    ctx.fill();
                }
                requestAnimationFrame(() => {
                    playCanvas(srcvideo, ctx);
                });
            }
            function setFormatSelect(format) {
                if (!MediaRecorder.isTypeSupported(format)) {
                    alert(format);
                    alert("当前浏览器不支持该编码类型");
                    return;
                }
                allChunks = [];
                setRecorder(format);
            }

            function setRecorder(format) {
                const stream = canvas.captureStream(60); // 60 FPS recording
                const recorder = new MediaRecorder(stream, {
                    mimeType: format
                });
                recorder.ondataavailable = e => {
                    if (showDataAvailable) {
                        console.log("trigger ondataavailable");
                    }
                    allChunks.push(e.data);
                };
                startBtn.disabled = false;
                startBtn.onclick = e => {
                    recorder.start(10);
                    startBtn.disabled = true;
                    pauseBtn.disabled = false;
                    resumeBtn.disabled = true;
                    stopBtn.disabled = false;
                };
                stopBtn.onclick = e => {
                    recorder.stop();
                    blobDownload(format);
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    resumeBtn.disabled = true;
                    stopBtn.disabled = true;
                };
                pauseBtn.onclick = e => {
                    recorder.pause();
                    pauseBtn.disabled = true;
                    resumeBtn.disabled = false;
                };
                resumeBtn.onclick = e => {
                    recorder.resume();
                    pauseBtn.disabled = false;
                    resumeBtn.disabled = true;
                };
            }
            function blobDownload(format) {
                const link = document.createElement("a");
                link.style.display = "none";
                const fullBlob = new Blob(allChunks);
                const downloadUrl = window.URL.createObjectURL(fullBlob);
                link.href = downloadUrl;
                link.download = "media - " + format + ".mp4";
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .lalal{
        width:500px;
        height:300px;
        // position: relative;
    }
    .mask{
        width:500px;
        height:300px;
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom: 0;
        background: url(../../../../assets/Monitor-monitoring-management/video.png) no-repeat;
    }
    .mask:hover{
        cursor: pointer;
    }
    video{
        width: 100%;
        height:100%; 
        object-fit: fill;
        // background: url(../../../../assets/Monitor-monitoring-management/video.png) no-repeat;
    }
    canvas {
        box-shadow: 0 0 10px gray;
        display: block;
    }
</style>