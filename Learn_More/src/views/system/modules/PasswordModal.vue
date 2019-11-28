<template>
    <a-modal
            title="重新设定密码"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            :centered="true"
            @ok="handleSubmit"
            @cancel="handleCancel"
            cancelText="关闭">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入用户账号" v-decorator="[ 'userName', {}]" :readOnly="true"/>
                </a-form-item>

                <a-form-item label="登陆密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :type="inputType" placeholder="请输入登陆密码" v-decorator="[ 'password', validatorRules.password]">
                        <a-icon slot="suffix" :type="inputType === 'password' ? 'eye' : 'eye-invisible'" @click="showPassword('password')" />
                    </a-input>
                </a-form-item>

                <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :type="inputTypeConfirm" @blur="handleConfirmBlur" placeholder="请重新输入登陆密码"
                             v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]">
                        <a-icon slot="suffix" :type="inputTypeConfirm === 'password' ? 'eye' : 'eye-invisible'" @click="showPassword('confirm')" />
                    </a-input>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import {changPassword} from '@/api/api'

    export default {
        name: "PasswordModal",
        data() {
            return {
                visible: false,
                confirmLoading: false,
                confirmDirty: false,
                validatorRules: {
                    password: {
                        rules: [{
                            required: true, message: '请输入登陆密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    },
                    confirmpassword: {
                        rules: [{
                            required: true, message: '请重新输入登陆密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    },
                },

                model: {},

                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                form: this.$form.createForm(this),
                inputType: 'password',
                inputTypeConfirm: 'password'
            }
        },

        methods: {
            show(username) {
                this.form.resetFields();
                this.visible = true;
                this.model.userName = username;
                this.$nextTick(() => {
                    this.form.setFieldsValue({userName: username});
                });
            },
            close() {
                this.$emit('close');
                this.visible = false;
            },
            handleSubmit() {
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        let formData = Object.assign(this.model, values);
                        changPassword(formData).then((res) => {
                            if (res.success) {
                                this.$message.success(res.message);
                                this.$emit('ok');
                            } else {
                                this.$message.warning(res.message);
                            }
                        }).finally(() => {
                            this.confirmLoading = false;
                            this.close();
                        });
                    }
                })
            },
            handleCancel() {
                this.close()
            },
            validateToNextPassword(rule, value, callback) {
                const form = this.form;
                const confirmpassword = form.getFieldValue('confirmpassword');
                if (value && confirmpassword && value !== confirmpassword) {
                    callback('两次输入的密码不一样！');
                }
                if (value && this.confirmDirty) {
                    form.validateFields(['confirm'], {force: true})
                }
                callback();
            },
            compareToFirstPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue('password')) {
                    callback('两次输入的密码不一样！');
                } else {
                    callback()
                }
            },
            handleConfirmBlur(e) {
                const value = e.target.value
                this.confirmDirty = this.confirmDirty || !!value
            },
            showPassword(str) {
                if (str === 'password') {
                    if (this.inputType === 'password') {
                        this.inputType = 'text';
                    } else {
                        this.inputType = 'password';
                    }
                } else {
                    if (this.inputTypeConfirm === 'password') {
                        this.inputTypeConfirm = 'text';
                    } else {
                        this.inputTypeConfirm = 'password';
                    }
                }
            }
        }
    }
</script>