<template>
    <div id="video-area">
        <div class="shipin">
            <video src="https://vd4.bdstatic.com/mda-jgkjffd62yfw87in/sc/mda-jgkjffd62yfw87in.mp4?auth_key=1563773568-0-0-9d6f376c7376fce41c929af6de9352c9&bcevod_channel=searchbox_feed&pd=bjh&abtest=all" controls="controls" class="video-area">
                您的浏览器不支持 video 标签。
            </video>
        </div>
        <div>
            <tvSelection></tvSelection>
            <remoteControl></remoteControl>
        </div>
    </div>
</template>

<script>
    import tvSelection from './Tv-selection.vue'//引入网络电视选择的按钮弹出层
    import remoteControl from './Remote-control.vue'//引入遥控器组件
    export default {
        components : {
            tvSelection,
            remoteControl
        }
    }
</script>

<style lang="scss" scoped>
    #video-area{
        height: 700px;
        background: #fff;
        overflow-y: auto;
        display: flex;
        margin-top:10px;
        >div{
            padding:10px;
        }
    }
    .shipin{
        width:850px;
        .video-area{
            width:100%;
            height:100%;
            // float: left;
            // background: yellow;
        }
    }
</style>

