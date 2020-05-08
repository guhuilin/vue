<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-form :form="form">
            <a-row :gutter="24" v-for="field in fieldList">
                <a-col :md="11" :sm="8">
                    <a-form-item :label="field[0].label" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-if="operation && field[0].type === 'input'"></a-input>
                        <a-date-picker style="width: 100%" v-else-if="operation && field[0].type === 'date'"/>
                        <a-select v-else-if="operation && field[0].type === 'select'">
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                        <div v-else>123</div>
                    </a-form-item>
                </a-col>

                <a-col :md="11" :sm="8" v-if="field[1]">
                    <a-form-item :label="field[1].label" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-if="operation && field[1].type === 'input'"></a-input>
                        <a-date-picker style="width: 100%" v-else-if="operation && field[1].type === 'date'"/>
                        <a-select v-else-if="operation && field[1].type === 'select'">
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                        <div v-else>123</div>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="11" :sm="8">
                    <a-form-item label="地址链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-if="operation"></a-input>
                        <div v-else>123</div>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="11" :sm="8">
                    <a-form-item label="主要演员" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-textarea placeholder="请输入..." :rows="4" v-if="operation"/>
                        <div v-else>123</div>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="11" :sm="8">
                    <a-form-item label="简介" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-textarea placeholder="请输入..." :rows="4" v-if="operation"/>
                        <div v-else>123</div>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="11" :sm="8">
                    <a-form-item label="海报、截图" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-upload
                                :action="url.fileUpload"
                                listType="picture-card"
                                :fileList="fileList"
                                :disabled="!operation"
                                @preview="handlePreview"
                                @change="handleChange"
                        >
                            <div v-if="fileList.length < 3">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24" v-if="programType != 'internet'">
                <a-col :md="11" :sm="8">
                    <a-form-item label="节目剧集" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-upload
                                :action="url.fileUpload"
                                listType="picture-card"
                                :fileList="fileList"
                                :disabled="!operation"
                                @preview="handlePreview"
                                @change="handleChange"
                        >
                            <div v-if="fileList.length < 3">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <div style="text-align: center;margin-top: 10px;">
            <a-button type="primary" @click="back">取消</a-button>
            <a-button type="primary" @click="" style="margin-left: 8px;">保存</a-button>
        </div>

        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </a-card>
</template>

<script>
    import Vue from 'vue'
    import { ACCESS_TOKEN } from '@/store/mutation-types'

    export default {
        name: 'programInfo',
        props: ['operation', 'programType', 'fieldList'],
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
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
                },
                fileList: [
                    {
                        uid: '-1',
                        name: 'xxx.png',
                        status: 'done',
                        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                    }
                ],
                previewVisible: false,
                previewImage: ''
            }
        },
        created() {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token": token};
        },
        methods: {
            handleCancel () {
                this.previewVisible = false
            },
            handlePreview (file) {
                this.previewImage = file.url || file.thumbUrl;
                this.previewVisible = true;
            },
            handleChange ({ fileList }) {
                this.fileList = fileList
            },
            back() {
                this.$emit('back');
            }
        }
    }
</script>

<style scoped>

</style>