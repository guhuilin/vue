<template>
    <a-modal
            :title="title"
            :width="modalWidth"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            @ok="handleOk"
            @cancel="handleCancel"
            cancelText="关闭"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="旧密码">
                    <a-input :type="inputTypeOld" placeholder="请输入旧密码"
                             v-decorator="[ 'oldpassword', validatorRules.oldpassword]">
                        <a-icon slot="suffix" :type="inputTypeOld === 'password' ? 'eye' : 'eye-invisible'" @click="showPassword('oldPassword')" />
                    </a-input>
                </a-form-item>

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="新密码">
                    <a-input :type="inputTypeNew" placeholder="请输入新密码" v-decorator="[ 'password', validatorRules.password]">
                        <a-icon slot="suffix" :type="inputTypeNew === 'password' ? 'eye' : 'eye-invisible'" @click="showPassword('newPassword')" />
                    </a-input>
                </a-form-item>

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="确认新密码">
                    <a-input :type="inputTypeConfirm" @blur="handleConfirmBlur" placeholder="请确认新密码"
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
        name: 'UserPassword',
        data() {
            return {
                title: '修改密码',
                modalWidth: 800,
                visible: false,
                confirmLoading: false,
                validatorRules: {
                    oldpassword: {
                        rules: [{
                            required: true, message: '请输入旧密码!',
                        }],
                    },
                    password: {
                        rules: [{
                            required: true, message: '请输入新密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    },
                    confirmpassword: {
                        rules: [{
                            required: true, message: '请确认新密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    }
                },
                confirmDirty: false,
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                form: this.$form.createForm(this),
                userName: '',
                inputTypeOld: 'password',
                inputTypeNew: 'password',
                inputTypeConfirm: 'password'
            }
        },
        methods: {
            show(uname) {
                if (!uname) {
                    this.$message.warning("当前系统无登陆用户!");
                    return;
                } else {
                    this.userName = uname;
                    this.form.resetFields();
                    this.visible = true;
                }
            },
            handleCancel() {
                this.close()
            },
            close() {
                this.$emit('close');
                this.visible = false;
            },
            handleOk() {
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        let params = Object.assign({userName: this.userName}, values);
                        changPassword(params).then((res) => {
                            if (res.success) {
                                that.$message.success(res.message);
                                that.close();
                            } else {
                                that.$message.warning(res.message);
                            }
                        }).finally(() => {
                            that.confirmLoading = false;
                        })
                    }
                })
            },
            validateToNextPassword(rule, value, callback) {
                const form = this.form;
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
                const value = e.target.value;
                this.confirmDirty = this.confirmDirty || !!value
            },
            showPassword(str) {
                if (str === 'oldPassword') {
                    if (this.inputTypeOld === 'password') {
                        this.inputTypeOld = 'text';
                    } else {
                        this.inputTypeOld = 'password';
                    }
                } else if (str === 'confirm') {
                    if (this.inputTypeConfirm === 'password') {
                        this.inputTypeConfirm = 'text';
                    } else {
                        this.inputTypeConfirm = 'password';
                    }
                } else {
                    if (this.inputTypeNew === 'password') {
                        this.inputTypeNew = 'text';
                    } else {
                        this.inputTypeNew = 'password';
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>

