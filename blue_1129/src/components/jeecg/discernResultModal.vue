<template>
    <a-modal
            title="识别结果"
            :width="500"
            :visible="visible"
            :maskClosable="false"
            :footer="null"
            :centered="true"
            @cancel="close">
        <div>
            <a-timeline>
                <a-timeline-item :color="stepOne ? 'blue' : 'green'">
                    <div style="display: flex;">
                        <div>{{ discernType === 'pic' ? '上传图片到阿里云' : '上传视频到阿里云' }}</div>
                        <a-spin :spinning="stepOne" style="margin-left: 20px;">
                            <a-icon slot="indicator" type="loading" spin />
                        </a-spin>
                    </div>
                </a-timeline-item>
                <a-timeline-item :color="stepTwo ? 'blue' : 'green'">
                    <div style="display: flex;">
                        <div>{{ discernType === 'pic' ? '阿里云检测图片中' : '获取视频任务列表' }}</div>
                        <a-spin :spinning="stepTwo" style="margin-left: 20px;">
                            <a-icon slot="indicator" type="loading" spin />
                        </a-spin>
                    </div>
                </a-timeline-item>
                <a-timeline-item :color="stepThree ? 'blue' : 'green'">
                    <div style="display: flex;">
                        <div>{{ discernType === 'pic' ? '获取图片识别结果' : '获取视频识别结果' }}</div>
                        <a-spin :spinning="stepThree" style="margin-left: 20px;">
                            <a-icon slot="indicator" type="loading" spin />
                        </a-spin>
                    </div>
                </a-timeline-item>
                <a-timeline-item color="green" v-if="stepFour && !stepThree">
                    <div style="display: flex;">
                        <div>{{ discernType === 'pic' ? resultStr : '识别完成' }}</div>
                    </div>
                </a-timeline-item>
            </a-timeline>
        </div>
    </a-modal>
</template>

<script>
    export default {
        name: 'discernResultModal',
        props: ['discernType'],
        data() {
            return {
                visible: false,
                resultStr: '',
                stepOne: true,
                stepTwo: true,
                stepThree: true,
                stepFour: false
            }
        },
        methods: {
            show() {
                this.resultStr = '';
                this.visible = true;
                this.stepOne = false;
                this.stepTwo = false;
            },
            close() {
                this.visible = false;
            },
            getResult(type, str) {
                this.stepFour = true;
                this.stepThree = false;
                if (type === 'pic') {
                    this.resultStr = str;
                }
            },
        }
    }
</script>

<style scoped>
    .ant-modal-body {
        display: flex;
        justify-content: center;
    }
</style>