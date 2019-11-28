<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增APP
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="app名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'softName', validatorRules.softName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="主要下载地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'downloadAddr', validatorRules.downloadAddr]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="操作系统" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'operSys', validatorRules.operSys]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="开发/运营机构" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'devOrg', validatorRules.devOrg]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="节目类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'programForm', validatorRules.programForm]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'contactInfo', validatorRules.contactInfo]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="AVSP" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'isAvsp', validatorRules.isAvsp]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="是否提供视听节目服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'isVideoSupport', validatorRules.isVideoSupport]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="违法违规新类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."
                                 v-decorator="[ 'illegalharmtype', validatorRules.illegalharmtype]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="软件版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'softVersion', validatorRules.softVersion]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="传播方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'spreadForm', validatorRules.spreadForm]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="app类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'appType', validatorRules.appType]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="联系地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'contactAddress', validatorRules.contactAddress]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="app图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-upload
                                listType="picture-card"
                                class="avatar-uploader"
                                :showUploadList="false"
                                :action="url.fileUpload"
                                :data="{'isup':1}"
                                :headers="headers"
                                :beforeUpload="beforeUpload"
                                @change="handleChange">
                            <img v-if="picUrl" :src="getAvatarView()" alt="头像" style="height:150px;width:150px"/>
                            <div v-if="picUrl" class="imgBtnDiv">
                                <a-icon type="eye" style="position: relative;right: 10px;"
                                        @click="imgView($event)"></a-icon>
                                <a-icon type="delete" style="position: relative;left: 10px;"
                                        @click="delImg($event)"></a-icon>
                            </div>
                            <div v-if="!picUrl">
                                <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
                                <div class="ant-upload-text">上传</div>
                            </div>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="cancelImg">
                                <img alt="example" style="width: 100%" :src="getAvatarView()"/>
                            </a-modal>
                        </a-upload>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <div style="text-align: center;margin-top: 10px;">
            <a-button type="primary" @click="back">取消</a-button>
            <a-button type="primary" @click="save" style="margin-left: 8px;">保存</a-button>
        </div>
    </a-card>
</template>

<script>
    import Vue from 'vue'
    import { ACCESS_TOKEN, USER_INFO } from "@/store/mutation-types"
    import pick from 'lodash.pick'
    import { addDbAppSoft, updateDbAppSoft } from '@api/api'

    export default {
        name: 'appForm',
        props: ['appObj'],
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
                headers: {},
                model: {},
                validatorRules: {

                },
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
                    imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
                },
                previewVisible: false,
                picUrl: '',
                uploadLoading: false
            }
        },
        created() {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = { 'X-Access-Token': token };
            this.show();
        },
        methods: {
            show() {
                this.picUrl = '';
                this.model = Object.assign({}, this.appObj);
                if (this.appObj.hasOwnProperty('id') && this.appObj.softLogo) {
                    this.picUrl = 'Has no pic url yet';
                }
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'softName', 'downloadAddr', 'operSys', 'devOrg', 'programForm', 'contactInfo',
                            'isAvsp', 'isVideoSupport', 'illegalharmtype', 'softVersion', 'spreadForm', 'appType', 'contactAddress')
                    )
                });
            },
            getAvatarView() {
                return this.url.imgerver + '/' + this.model.softLogo;
            },
            beforeUpload(file) {
                let fileType = file.type;
                if (fileType.indexOf('image') < 0) {
                    this.$message.warning('请上传图片');
                    return false;
                }
            },
            handleChange(info) {
                this.picUrl = "";
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return
                }
                if (info.file.status === 'done') {
                    let response = info.file.response;
                    this.uploadLoading = false;
                    if (response.success) {
                        this.model.softLogo = response.message;
                        this.picUrl = 'Has no pic url yet';
                    } else {
                        this.$message.warning(response.message);
                    }
                }
            },
            imgView(event) {
                event.stopPropagation();
                this.previewVisible = true;
            },
            delImg(event) {
                event.stopPropagation();
                this.model.softLogo = '';
                this.picUrl = '';
            },
            cancelImg() {
                this.previewVisible = false;
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.lastModifyUserId = Vue.ls.get(USER_INFO).userId;
                        if (this.appObj.hasOwnProperty('id')) {
                            updateDbAppSoft(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            formData.insertUserId = Vue.ls.get(USER_INFO).userId;
                            addDbAppSoft(formData).then(res => {
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

    .imgBtnDiv {
        height: 50px;
        width: 150px;
        position: absolute;
        bottom: 0;
        font-size: 25px;
        background-color: #ffffffaa;
        z-index: 1000;
    }
</style>