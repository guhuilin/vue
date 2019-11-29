<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增机构信息
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="机构名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'organName', validatorRules.organName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="机构英文名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'organNameEn', validatorRules.organNameEn]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="机构编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'organCode', validatorRules.organCode]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="机构类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'orgType', validatorRules.orgType]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'address', validatorRules.address]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="所属省份" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'provice', validatorRules.provice]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="开办网站名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'siteName', validatorRules.siteName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="网站域名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'domain', validatorRules.domain]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'telephone', validatorRules.telephone]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="法人代表" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'corporation', validatorRules.corporation]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="机构简介" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'description', validatorRules.description]"/>
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
    import { addDbWebstieOrgan, updateDbWebstieOrgan } from '@api/api'
    import pick from 'lodash.pick'
    import { USER_INFO } from "@/store/mutation-types"

    export default {
        name: 'visualWebsiteOrgForm',
        props: ['visualWebsiteOrgObj'],
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
                validatorRules: {},
                model: {}
            }
        },
        created() {
            this.show();
        },
        methods: {
            show() {
                this.model = Object.assign({}, this.visualWebsiteOrgObj);
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'organName', 'organNameEn', 'organCode', 'orgType', 'address',
                            'provice', 'siteName', 'domain', 'telephone', 'corporation', 'description')
                    )
                });
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.updateBy = Vue.ls.get(USER_INFO).userId;
                        formData.delFlag = '0';
                        if (this.visualWebsiteOrgObj.hasOwnProperty('id')) {
                            updateDbWebstieOrgan(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            formData.createBy = Vue.ls.get(USER_INFO).userId;
                            addDbWebstieOrgan(formData).then(res => {
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