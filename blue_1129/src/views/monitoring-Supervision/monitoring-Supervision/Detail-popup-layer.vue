<template>
    <div>
        <a-button type="primary" @click="clickDetailPopupLayer">详情</a-button>
        <a-modal
            title="查看"
            :visible="DetailPopupLayerVisible"
            :confirmLoading="DetailPopupLayerLoading"
            :footer="null"
            :closable="false"
        >
            <div>

            </div>

            <div>

            </div>
            <div style="margin-left: 165px;">
                <a-button @click="DetailPopupLayerCancel" style="margin-right:5px">取消</a-button>
                <a-button type="primary" @click="DetailPopupLayerOk">确定</a-button>
            </div>
        </a-modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // DetailPopupLayer
                DetailPopupLayerVisible: false,
                DetailPopupLayerLoading: false,
            }
        },
        methods: {
            // 点击详情让弹出层显示出来
            clickDetailPopupLayer() {
                this.DetailPopupLayerVisible = true
            },
            // 详情弹出层的确定事件
            DetailPopupLayerOk(e) {
                this.DetailPopupLayerVisible = false;
            },
            // 详情弹出层的取消事件
            DetailPopupLayerCancel(e) {
                this.DetailPopupLayerVisible = false
            },
        }
    }
</script>
