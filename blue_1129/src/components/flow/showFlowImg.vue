<template>
    <a-modal
            title="报告详情"
            :width="800"
            :visible="visible"
            :maskClosable="false"
            :footer="null"
            :centered="true"
            cancelText="关闭"
            @cancel="cancel">
        <img :src="'data:image/png;base64,' + imgUrl" style="height: 100%;width: 100%;"/>
    </a-modal>
</template>

<script>
    import { getNoHighLightImageByteDataByProcessDefinitionKey } from '@api/api'

    export default {
        name: 'showFlowImg',
        data() {
            return {
                visible: false,
                imgUrl: ''
            }
        },
        methods: {
            show(id) {
                this.visible = true;
                getNoHighLightImageByteDataByProcessDefinitionKey({processDefinitionKey: id}).then(res => {
                    if (res.success) {
                        this.imgUrl = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            cancel() {
                this.visible = false;
            }
        }
    }
</script>

<style scoped>

</style>