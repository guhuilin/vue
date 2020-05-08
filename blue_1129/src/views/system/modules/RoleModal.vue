<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            :centered="true"
            @ok="handleOk"
            @cancel="handleCancel"
            cancelText="关闭"
            wrapClassName="ant-modal-cust-warp">

        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="角色名称">
                    <a-input placeholder="请输入角色名称" v-decorator="[ 'roleName', validatorRules.roleName]"/>
                </a-form-item>

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        required
                        label="控制权限">
                    <a-checkbox-group v-decorator="[ 'rolePermissions', validatorRules.rolePermissions]">
                        <a-checkbox v-for="per in permissionList" :value="per.value" :key="per.value">
                            {{per.label}}
                        </a-checkbox>
                    </a-checkbox-group>
                </a-form-item>

                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="研判级别">
                    <a-radio-group v-decorator="[ 'judgeLevel', {}]">
                        <a-radio v-for="item in judgeLevel" :value="item.value" :key="item.value">{{item.label}}</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="描述">
                  <a-textarea :rows="5" placeholder="..." v-decorator="[ 'roleDesc']" />
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import { addRole, editRole } from '@/api/api'

    export default {
        name: 'RoleModal',
        data() {
            return {
                title: '操作',
                visible: false,
                model: {},
                judgeLevel: [
                    {value:1,label:'初级研判'},
                    {value:2,label:'复核研判'},
                    {value:3,label:'最终研判'},
                ],
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                validatorRules: {
                    roleName: {rules: [{required: true, message: '请输入角色名称!'}]},
                    rolePermissions: {rules: [{validator: this.validatePer}]},
                },
                permissionList: [
                    {
                        label: '新增',
                        value: 'add'
                    },
                    {
                        label: '编辑',
                        value: 'edit'
                    },
                    {
                        label: '删除',
                        value: 'delete'
                    },
                    {
                        label: '查询',
                        value: 'query'
                    },
                    {
                        label: '提交',
                        value: 'submit'
                    },
                    {
                        label: '审核',
                        value: 'approve'
                    },
                    {
                        label: '细颗粒度',
                        value: 'enable'
                    },
                    {
                        label: '特殊权限',
                        value: 'special'
                    },
                ]
            }
        },
        methods: {
            validatePer(rule, value, callback) {
                if (value && value.length > 0) {
                    callback();
                } else {
                    callback('请选择控制权限！');
                }
            },
            add() {
                this.edit({});
            },
            edit(record) {
                if (record.rolePermissions && record.rolePermissions != ' ') {
                    record.rolePermissions = JSON.parse(record.rolePermissions);
                } else {
                    record.rolePermissions = [];
                }
                this.form.resetFields(['roleName', 'roleDesc','judgeLevel']);
                this.model = Object.assign({}, record);
                this.visible = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'roleName', 'roleDesc', 'rolePermissions','judgeLevel'))
                });
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
                        let formData = Object.assign(this.model, values);
                        formData.rolePermissions = JSON.stringify(formData.rolePermissions);
                        formData.judgeLevel = JSON.stringify(formData.judgeLevel);
                        let obj;
                        if (!this.model.roleId) {
                            obj = addRole(formData);
                        } else {
                            obj = editRole(formData);
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
            handleCancel() {
                this.close()
            }
        }
    }
</script>