<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="disableSubmit ? true : false"
            :centered="true"
            @ok="handleOk"
            @cancel="close"
            :okButtonProps="{ props: {disabled: disableSubmit} }"
            cancelText="关闭">

        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item label="报告领域名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入报告领域名称" v-decorator="[ 'domainName', validatorRules.domainName]"
                             :readOnly="disableSubmit"/>
                </a-form-item>

                <a-form-item label="报告领域编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入报告领域编号" :readOnly="disableSubmit"
                             v-decorator="[ 'code', validatorRules.code]"/>
                </a-form-item>

                <a-form-item label="展示图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-upload
                            listType="picture-card"
                            class="avatar-uploader"
                            :showUploadList="false"
                            :action="uploadAction"
                            :data="{'isup':1}"
                            :headers="headers"
                            :beforeUpload="beforeUpload"
                            @change="handleChange">
                        <img v-if="picUrl" :src="getAvatarView()" alt="头像" style="height:150px;width:150px"/>
                        <div v-if="picUrl" class="imgBtnDiv">
                            <a-icon type="eye" style="position: relative;right: 10px;" @click="imgView($event)"></a-icon>
                            <a-icon type="delete" style="position: relative;left: 10px;" @click="delImg($event)"></a-icon>
                        </div>
                        <div v-if="!picUrl">
                            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
                            <div class="ant-upload-text">上传</div>
                        </div>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="cancelImg">
                            <img alt="example" style="width: 100%" :src="getAvatarView()" />
                        </a-modal>
                    </a-upload>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { addReportDomainInfo, editReportDomainInfo } from '@/api/api'
    import Vue from 'vue'
    import { ACCESS_TOKEN } from "@/store/mutation-types"

    export default {
        name: 'reportAreaModal',
        data() {
            return {
                title: '操作',
                visible: false,
                disableSubmit: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                model: {},
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                validatorRules: {
                    domainName: {
                        rules: [{required: true, message: '请输入报告领域名称!'}]
                    },
                    code: {
                        rules: [{required: true, message: '请输入报告领域编号!'}]
                    },
                },
                uploadLoading: false,
                headers: {},
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
                    imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
                },
                picUrl: '',
                previewVisible: false
            }
        },
        created() {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token": token};
        },
        computed: {
            uploadAction() {
                return this.url.fileUpload;
            }
        },
        methods: {
            add() {
                this.picUrl = '';
                this.edit({});
            },
            edit(record) {
                this.model = Object.assign({}, record);
                if (record.hasOwnProperty('id')) {
                    this.picUrl = "Has no pic url yet";
                }
                this.form.resetFields();
                this.visible = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'domainName', 'code', 'imgUrl'));
                });
            },
            close() {
                this.$emit('close');
                this.visible = false;
                this.disableSubmit = false;
            },
            getAvatarView() {
                return this.url.imgerver + "/" + this.model.imgUrl;
            },
            beforeUpload(file) {
                let fileType = file.type;
                if (fileType.indexOf('image') < 0) {
                    this.$message.warning('请上传图片');
                    return false;
                }
            },
            handleChange(info) {
                this.picUrl = '';
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true;
                    return
                }
                if (info.file.status === 'done') {
                    let response = info.file.response;
                    this.uploadLoading = false;
                    if (response.success) {
                        this.model.imgUrl = response.message;
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
                this.model.imgUrl = '';
                this.picUrl = '';
            },
            cancelImg() {
                this.previewVisible = false;
            },
            handleOk() {
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        if (this.model.imgUrl) {
                            that.confirmLoading = true;
                            let formData = Object.assign(this.model, values);

                            let obj;
                            if (!this.model.id) {
                                obj = addReportDomainInfo(formData);
                            } else {
                                obj = editReportDomainInfo(formData);
                            }
                            obj.then((res) => {
                                if (res.success) {
                                    that.$message.success(res.message);
                                    that.$emit('ok');
                                } else {
                                    that.$message.warning(res.message);
                                }
                            }).finally(() => {
                                that.confirmLoading = false;
                                that.close();
                            })
                        } else {
                            this.$message.warning('请上传展示图片！');
                        }
                    }
                })
            },
        }
    }
</script>

<style scoped>
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