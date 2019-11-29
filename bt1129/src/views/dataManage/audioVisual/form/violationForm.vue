<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增违规节目
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="节目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'programName', validatorRules.programName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="节目URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'programUrl', validatorRules.programUrl]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="网站名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'websiteName', validatorRules.websiteName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="台站ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'stationId', validatorRules.stationId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="机构编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'orgCode', validatorRules.orgCode]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报告ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reportId', validatorRules.reportId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="基础数据表ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'dataLocalId', validatorRules.dataLocalId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="最近一次检查时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['latestCheckTime', {initialValue:!model.latestCheckTime ? null : moment(model.latestCheckTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="最近一次检查状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'latestCheckStatus', validatorRules.latestCheckStatus]">
                            <a-select-option value="T">正常</a-select-option>
                            <a-select-option value="F">不正常</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="第一次验证时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['firstCheckTime', {initialValue:!model.firstCheckTime ? null : moment(model.firstCheckTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="数据上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['reportTime', {initialValue:!model.reportTime ? null : moment(model.reportTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="主要问题" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'problem', validatorRules.problem]"/>
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
    import { USER_INFO } from "@/store/mutation-types"
    import pick from 'lodash.pick'
    import { addDbHarmVideoBean, updateDbHarmVideoBean } from '@api/api'
    import moment from 'moment'

    export default {
        name: 'violationForm',
        props: ['violationObj'],
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
                model: {},
                validatorRules: {

                }
            }
        },
        created() {
            this.show();
        },
        methods: {
            moment,
            show() {
                this.model = Object.assign({}, this.violationObj);
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'programName', 'programUrl', 'websiteName', 'stationId', 'orgCode',
                            'reportId', 'dataLocalId', 'latestCheckStatus', 'problem')
                    )
                });
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.latestCheckTime = moment(formData.latestCheckTime).format('YYYY-MM-DD HH:mm:ss');
                        formData.firstCheckTime = moment(formData.firstCheckTime).format('YYYY-MM-DD HH:mm:ss');
                        formData.reportTime = moment(formData.reportTime).format('YYYY-MM-DD HH:mm:ss');
                        if (this.violationObj.hasOwnProperty('id')) {
                            updateDbHarmVideoBean(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            formData.insertUserId = Vue.ls.get(USER_INFO).userId;
                            addDbHarmVideoBean(formData).then(res => {
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
</style>