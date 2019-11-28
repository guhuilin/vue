<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增AVSP网站
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="网站名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'siteName', validatorRules.siteName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="播出名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'broadcastName', validatorRules.broadcastName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="唯一编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'code', validatorRules.code]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="许可证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'licenseKey', validatorRules.licenseKey]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="许可证有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['licenseEndDate', {initialValue:!model.licenseEndDate ? null : moment(model.licenseEndDate, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="网站地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'loginAddress', validatorRules.loginAddress]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="所在省份" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'province', validatorRules.province]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="开办单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'unit', validatorRules.unit]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="开办单位类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'unitType', validatorRules.unitType]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="开办单位性质" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'unitProperty', validatorRules.unitProperty]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="法人代表" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'legal', validatorRules.legal]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="发证日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['certDate', {initialValue:!model.certDate ? null : moment(model.certDate, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="最新发证时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['lastcertTime', {initialValue:!model.lastcertTime ? null : moment(model.lastcertTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="最新修改时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                                v-decorator="['lastModifyTime', {initialValue:!model.lastModifyTime ? null : moment(model.lastModifyTime, 'YYYY-MM-DD HH:mm:ss')}]"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="许可业务范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'businessRange', validatorRules.businessRange]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="备注" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'remark', validatorRules.remark]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="业务类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'businessType', validatorRules.businessType]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="业务类别代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'businesstypecode', validatorRules.businesstypecode]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="播出方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'playMode', validatorRules.playMode]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="是否重点监看" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'isImportant', validatorRules.isImportant]">
                            <a-select-option value="T">重点</a-select-option>
                            <a-select-option value="F">非重点</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="台站" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'stationId', validatorRules.stationId]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="许可证是否为附页一" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select placeholder="请选择..." v-decorator="[ 'isFirstLicensePage', validatorRules.isFirstLicensePage]">
                            <a-select-option value="T">是</a-select-option>
                            <a-select-option value="F">否</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="许可证附页码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'licensePage', validatorRules.licensePage]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="节目内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'content', validatorRules.content]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="接受终端" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'terminal', validatorRules.terminal]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="传输网络" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'network', validatorRules.network]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="传播范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'range', validatorRules.range]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'avspVersion', validatorRules.avspVersion]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="互联网视听节目服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'website', validatorRules.website]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="互联网手机视听节目服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'mobilesite', validatorRules.mobilesite]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="互联网电视传输服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'tvsitetrans', validatorRules.tvsitetrans]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="IPTV传输服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'iptvtrans', validatorRules.iptvtrans]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="IPTV内容服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'iptvcontent', validatorRules.iptvcontent]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="互联网电视内容服务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'tvsitecontent', validatorRules.tvsitecontent]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="更新记录" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">
<!--                        2019-01-01 12:12:34 admin将是否重点监看从"重点网站"更新为"非重点网站"。<br>-->
<!--                        2019-01-01 12:12:34 admin将是否重点监看从"重点网站"更新为"非重点网站"。-->
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'updateInfo', validatorRules.updateInfo]"/>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :md="20" :sm="8">
                    <a-form-item label="历史名称汇总" :labelCol="{xs: {span: 5},sm: {span: 3}}" :wrapperCol="{xs: {span: 5},sm: {span: 21}}">
                        <a-textarea placeholder="请输入..." :row="4" v-decorator="[ 'hiscodeloginaddress', validatorRules.hiscodeloginaddress]"/>
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
    import moment from 'moment'
    import { addDbAvspBean, updateDbAvspBean } from '@api/api'
    import pick from 'lodash.pick'
    import { USER_INFO } from "@/store/mutation-types"

    export default {
        name: 'avspForm',
        props: ['avspObj'],
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
                validatorRules: {

                },
                model: {}
            }
        },
        created() {
            this.show();
        },
        methods: {
            moment,
            show() {
                this.model = Object.assign({}, this.avspObj);
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'siteName', 'broadcastName', 'code', 'licenseKey', 'loginAddress',
                            'province', 'unit', 'unitType', 'unitProperty', 'legal', 'businessRange', 'remark',
                            'businessType', 'businesstypecode', 'playMode', 'isImportant', 'stationId',
                            'isFirstLicensePage', 'licensePage', 'content', 'terminal', 'network', 'range',
                            'avspVersion', 'website', 'mobilesite', 'tvsitetrans', 'iptvtrans', 'iptvcontent',
                            'tvsitecontent', 'updateInfo', 'hiscodeloginaddress')
                    )
                });
            },
            save() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values);
                        formData.updateUser = Vue.ls.get(USER_INFO).userId;
                        if (formData.code && formData.loginAddress) {
                            formData.codeloginaddress = formData.code + formData.loginAddress;
                        }
                        formData.licenseEndDate = moment(formData.licenseEndDate).format('YYYY-MM-DD HH:mm:ss');
                        formData.certDate = moment(formData.certDate).format('YYYY-MM-DD HH:mm:ss');
                        formData.lastcertTime = moment(formData.lastcertTime).format('YYYY-MM-DD HH:mm:ss');
                        formData.lastModifyTime = moment(formData.lastModifyTime).format('YYYY-MM-DD HH:mm:ss');
                        if (this.avspObj.hasOwnProperty('id')) {
                            updateDbAvspBean(formData).then(res => {
                                if (res.success) {
                                    this.$message.success('修改成功！');
                                    this.$emit('back', true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            addDbAvspBean(formData).then(res => {
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