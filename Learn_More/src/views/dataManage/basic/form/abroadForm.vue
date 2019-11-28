<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增引进境外剧信息
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="10" :sm="8">
                    <a-form-item label="节目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'programName', validatorRules.programName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="节目地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'programUrl', validatorRules.programUrl]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="主演" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'protagonist', validatorRules.protagonist]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="导演" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'director', validatorRules.director]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="国别" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'country', validatorRules.country]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="制作机构" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'productionCompany', validatorRules.productionCompany]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请输入..." v-decorator="[ 'programType', validatorRules.programType]">
                            <a-select-option value="1">电影</a-select-option>
                            <a-select-option value="2">电视剧</a-select-option>
                            <a-select-option value="3">动漫</a-select-option>
                            <a-select-option value="4">其他</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="节目集数" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'programCount', validatorRules.programCount]"/>
                    </a-form-item>
                </a-col>


                <a-col :md="10" :sm="8">
                    <a-form-item label="节目时长" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-time-picker
                                :defaultOpenValue="moment('00:00:00', 'HH:mm:ss')"
                                v-decorator="['runTime', {initialValue:!model.runTime ? null : moment(model.runTime, 'HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="上映时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['showTime', {initialValue:!model.showTime ? null : moment(model.showTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="影视剧简介摘要" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'programAbstract', validatorRules.programAbstract]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="机构介绍" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'introduce', validatorRules.introduce]"/>
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
    import { ACCESS_TOKEN, USER_INFO  } from "@/store/mutation-types"
    import moment from 'moment'
    import pick from 'lodash.pick'
    import { addDbAbroadNetProgram, updateDbAbroadNetProgram } from '@api/api'

    export default {
        name: 'abroadForm',
        props: ['abroadObj'],
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
                validatorRules: {},
                model: {},
                previewVisible: false,
                previewImage: ''
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
                this.model = Object.assign({}, this.abroadObj);
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'programName', 'programUrl', 'protagonist', 'director',
                            'country', 'productionCompany', 'programType', 'programCount', 'programAbstract', 'introduce')
                    )
                });
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.showTime = moment(formData.showTime).format('YYYY-MM-DD HH:mm:ss');
                        formData.runTime = moment(formData.runTime).format('HH:mm:ss');
                        if (this.abroadObj.hasOwnProperty('id')) {
                            updateDbAbroadNetProgram(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            formData.insterUser = Vue.ls.get(USER_INFO).userId;
                            addDbAbroadNetProgram(formData).then(res => {
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