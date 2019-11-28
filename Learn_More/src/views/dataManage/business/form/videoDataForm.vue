<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增取证视频
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="10" :sm="8">
                    <a-form-item label="报告名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'evidenceVideoName', validatorRules.evidenceVideoName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="报告实例id" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'rptInsId', validatorRules.rptInsId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="转码后的名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'newEvidenceVideoName', validatorRules.newEvidenceVideoName]"/>
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
    import { addEvidenceVideotwo, updateEvidenceVideotwo } from '@api/api'
    import moment from 'moment'

    export default {
        name: 'videoDataForm',
        props: ['videoObj'],
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
                this.model = Object.assign({}, this.videoObj);
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model)
                    )
                });
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.updatedBy = Vue.ls.get(USER_INFO).userId;
                        if (this.videoObj.hasOwnProperty('id')) {
                            updateEvidenceVideotwo(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            formData.createdBy = Vue.ls.get(USER_INFO).userId;
                            addEvidenceVideotwo(formData).then(res => {
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