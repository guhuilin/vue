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
                <a-form-item label="报告领域" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="请选择..." v-decorator="[ 'reportdomainId', validatorRules.domainName]">
                        <a-select-option v-for="type in typeList" :value="type.id" :key="type.id">
                            {{type.domainName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="业务名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入业务名称" v-decorator="[ 'typeName', validatorRules.typeName]"
                             :readOnly="disableSubmit"/>
                </a-form-item>

                <a-form-item label="业务编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入业务编号" :readOnly="disableSubmit"
                             v-decorator="[ 'code', validatorRules.code]"/>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { addReportBusinessInfo, editReportBusinessInfo, getAllReportDomainInfoList } from '@/api/api'

    export default {
        name: 'reportBusinessModal',
        data() {
            return {
                title: '操作',
                visible: false,
                disableSubmit: false,
                confirmLoading: false,
                typeList: [],
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                validatorRules: {
                    typeName: {
                        rules: [{required: true, message: '请输入业务名称!'}]
                    },
                    code: {
                        rules: [{required: true, message: '请输入业务编号!',}]
                    },
                    domainName: {
                        rules: [{required: true, message: '请选择报告领域!'}]
                    },
                },
            }
        },
        created () {
            getAllReportDomainInfoList().then(res => {
                if(res.success) {
                    this.typeList = res.result
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        mounted () {
            
        },
        methods: {
            add() {
                this.edit({});
            },
            edit(record) {
                this.model = Object.assign({}, record);
                this.form.resetFields();
                this.visible = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'typeName', 'code','reportdomainId'));
                });
            },
            close() {
                this.$emit('close');
                this.visible = false;
                this.disableSubmit = false;
            },
            handleOk() {
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        let formData = Object.assign(this.model, values);
                        let obj;
                        if (!this.model.id) {
                            obj = addReportBusinessInfo(formData);
                        } else {
                            obj = editReportBusinessInfo(formData);
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
                    }
                })
            },
        }
    }
</script>