<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增互联网电视终端设备
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="10" :sm="8">
                    <a-form-item label="设备名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'ottName', validatorRules.ottName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="设备型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'ottModel', validatorRules.ottModel]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="厂商" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'ottFirm', validatorRules.ottFirm]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="销售数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'salesCount', validatorRules.salesCount]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="url地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'ottUrl', validatorRules.ottUrl]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'ottCode', validatorRules.ottCode]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="商品来源" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'ottSource', validatorRules.ottSource]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="台站ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'stationId', validatorRules.stationId]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="描述" :labelCol="{xs: {span: 5},sm: {span: 4}}" :wrapperCol="{xs: {span: 5},sm: {span: 20}}">
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'ottDescription', validatorRules.ottDescription]"/>
                    </a-form-item>
                </a-col>
            </a-row>

<!--            <a-row :gutter="24">-->
<!--                <a-col :md="24" :sm="8">-->
<!--                    <a-form-item label="设备照片" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">-->
<!--                        <a-upload-->
<!--                                :action="url.fileUpload"-->
<!--                                listType="picture-card"-->
<!--                                :fileList="fileList"-->
<!--                                @preview="handlePreview"-->
<!--                                @change="handleChange"-->
<!--                        >-->
<!--                            <div v-if="fileList.length < 3">-->
<!--                                <a-icon type="plus" />-->
<!--                                <div class="ant-upload-text">Upload</div>-->
<!--                            </div>-->
<!--                        </a-upload>-->
<!--                    </a-form-item>-->
<!--                </a-col>-->
<!--            </a-row>-->
        </a-form>

        <div style="text-align: center;margin-top: 10px;">
            <a-button type="primary" @click="back">取消</a-button>
            <a-button type="primary" @click="save" style="margin-left: 8px;">保存</a-button>
        </div>
    </a-card>
</template>

<script>
    import Vue from 'vue'
    import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'
    import pick from 'lodash.pick'
    import moment from 'moment'
    import { addDbott, updateDbott } from '@api/api'

    export default {
        name: 'tvDeviceRecordForm',
        props: ['tvDeviceObj'],
        data() {
            return {
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 5},
                    sm: {span: 8},
                },
                wrapperCol: {
                    xs: {span: 8},
                    sm: {span: 16},
                },
                headers:{},
                fileList: [
                    {
                        uid: '-1',
                        name: 'xxx.png',
                        status: 'done',
                        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                    }
                ],
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
                },
                previewVisible: false,
                previewImage: '',
                validatorRules: {},
                model: {}
            }
        },
        created () {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token":token};
            this.show();
        },
        methods: {
            moment,
            show() {
                this.model = Object.assign({}, this.tvDeviceObj);
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'ottName', 'ottModel', 'ottFirm', 'salesCount', 'ottUrl',
                            'ottCode', 'ottSource', 'stationId', 'ottDescription')
                    )
                });
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.starttime = moment(formData.starttime).format('YYYY-MM-DD HH:mm:ss');
                        formData.endtime = moment(formData.endtime).format('YYYY-MM-DD HH:mm:ss');
                        if (this.tvDeviceObj.hasOwnProperty('id')) {
                            updateDbott(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            formData.createUser = Vue.ls.get(USER_INFO).userId;
                            addDbott(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('新增成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        }
                    }
                });
            },
            handlePreview (file) {
                this.previewImage = file.url || file.thumbUrl;
                this.previewVisible = true;
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
                this.$emit('back', false);
            }
        }
    }
</script>

<style scoped>
    .formTitle {
        height: 50px;
        line-height: 50px;
        font-size: 25px;
        font-weight: bold;
        text-align: center;
    }
</style>