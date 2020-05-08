<template>
    <div class="boxDiv">
        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="13" :sm="8" v-for="field in fieldList">
                    <a-form-item :label="field.label" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-if="operation && field.type === 'input'"></a-input>
                        <a-date-picker style="width: 100%" v-else-if="operation && field.type === 'date'"/>
                        <a-select v-else-if="operation && field.type === 'select'">
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                        <div v-else>123</div>
                    </a-form-item>
                </a-col>

                <a-col :md="13" :sm="8">
                    <a-form-item :label="getLabel" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-textarea placeholder="请输入..." :rows="4" v-if="operation"/>
                        <div v-else>123</div>
                    </a-form-item>
                </a-col>

                <a-col :md="13" :sm="8">
                    <a-form-item label="文本" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-upload
                                class="avatar-uploader"
                                :action="uploadAction"
                                :data="{'isup':1}"
                                :showUploadList="false"
                                :headers="headers"
                                :beforeUpload="beforeUpload"
                                @change="handleChange"
                                :defaultFileList="defaultFileList">
                            <a-button>
                                <a-icon type="upload" /> Upload
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <div style="text-align: center;margin-top: 10px;">
            <a-button type="primary" @click="back">取消</a-button>
            <a-button type="primary" @click="" style="margin-left: 8px;">保存</a-button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { ACCESS_TOKEN } from "@/store/mutation-types"

    export default {
        name: 'knowledgeInfo',
        props: ['operation', 'knowledgeType', 'fieldList'],
        data() {
            return {
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 5},
                    sm: {span: 6},
                },
                wrapperCol: {
                    xs: {span: 8},
                    sm: {span: 18},
                },
                headers:{},
                defaultFileList: [],
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
                }
            }
        },
        created () {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token":token};
        },
        computed:{
            uploadAction: function () {
                return this.url.fileUpload;
            },
            getLabel() {
                if (['audio', 'pic', 'text'].includes(this.knowledgeType)) {
                    return '简介';
                } else if (this.knowledgeType === 'violation') {
                    return '备注';
                } else if (this.knowledgeType === 'corpus') {
                    return '对应文本';
                }
            }
        },
        methods: {
            beforeUpload(file) {
                let fileType = file.type;
                if(fileType.indexOf('video') < 0){
                    this.$message.warning('请上传视频');
                    return false;
                }
            },
            handleChange (info) {
                if (info.file.status === 'uploading') {
                    return
                }
                if (info.file.status === 'done') {
                    let response = info.file.response;
                    if (response.success) {
                        this.$message.success('上传成功');
                    } else {
                        this.$message.warning(response.message);
                    }
                }
            },
            back() {
                this.$emit('back');
            }
        }
    }
</script>

<style scoped>

</style>