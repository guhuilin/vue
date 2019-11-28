<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增报告
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="报告名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reportName', validatorRules.reportName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="台站ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'stationId', validatorRules.stationId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报告期数" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reportPeriods', validatorRules.reportPeriods]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报告开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['reportStartTime', {initialValue:!model.reportStartTime ? null : moment(model.reportStartTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报告结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['reportEndTime', {initialValue:!model.reportEndTime ? null : moment(model.reportEndTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="是否重点网站报告" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'reportIsImportant', validatorRules.reportIsImportant]">
                            <a-select-option value="T">是</a-select-option>
                            <a-select-option value="F">否</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="任务ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'taskId', validatorRules.taskId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="是否刻盘" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'isRecordCd', validatorRules.isRecordCd]">
                            <a-select-option value="T">是</a-select-option>
                            <a-select-option value="F">否</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="刻录时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['recordCdTime', {initialValue:!model.recordCdTime ? null : moment(model.recordCdTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报告周期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reportPeriod', validatorRules.reportPeriod]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="周期单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'periodUnit', validatorRules.periodUnit]">
                            <a-select-option value="M">月</a-select-option>
                            <a-select-option value="W">周</a-select-option>
                            <a-select-option value="D">天</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="一次性创建报告期数" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'createReportCount', validatorRules.createReportCount]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报告累计期数" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reportTotalCount', validatorRules.reportTotalCount]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报告批次" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reportBatchNo', validatorRules.reportBatchNo]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="任务分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'taskType', validatorRules.taskType]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="报出时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['baochuDate', {initialValue:!model.baochuDate ? null : moment(model.baochuDate, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="模板ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reporttableId', validatorRules.reporttableId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="是否自建" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'source', validatorRules.source]">
                            <a-select-option value="1">下发任务</a-select-option>
                            <a-select-option value="2">自建任务</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="完成情况" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'status', validatorRules.source]">
                            <a-select-option value="1">已完成</a-select-option>
                            <a-select-option value="2">未完成</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="工作流实例ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'procInstId', validatorRules.procInstId]"/>
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
    import { addReportInstancetwo, updateReportInstancetwo } from '@api/api'
    import moment from 'moment'

    export default {
        name: 'reportDataForm',
        props: ['reportObj'],
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
                this.model = Object.assign({}, this.reportObj);
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'reportName', 'stationId', 'reportPeriods', 'reportIsImportant',
                            'taskId', 'isRecordCd', 'reportPeriod', 'periodUnit', 'createReportCount',
                            'reportTotalCount', 'reportBatchNo', 'taskType', 'reporttableId', 'source',
                            'status', 'procInstId')
                    )
                });
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.reportStartTime = moment(formData.reportStartTime).format('YYYY-MM-DD HH:mm:ss');
                        formData.reportEndTime = moment(formData.reportEndTime).format('YYYY-MM-DD HH:mm:ss');
                        formData.recordCdTime = moment(formData.recordCdTime).format('YYYY-MM-DD HH:mm:ss');
                        formData.baochuDate = moment(formData.baochuDate).format('YYYY-MM-DD HH:mm:ss');
                        if (this.reportObj.hasOwnProperty('id')) {
                            updateReportInstancetwo(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            formData.reportCreateUser = Vue.ls.get(USER_INFO).userId;
                            addReportInstancetwo(formData).then(res => {
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