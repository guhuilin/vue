<template>
    <a-modal
            title="执行任务"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            :centered="true"
            @ok="handleSubmit"
            @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item label="处理意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-textarea placeholder="请输入..." :rows="4" v-decorator="['remark']"/>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { claimAndCompleteTask } from '@api/api'
    import Vue from 'vue'
    import { USER_INFO } from "@/store/mutation-types"
    import moment from 'moment'

    export default {
        name: 'allotModal',
        props: ['visible','needData'],
        data() {
            return {
                confirmLoading: false,
                userList: [],
                taskObj: {},
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
                    userName: {
                        rules: [{required: true, message: '请选择用户名称!'}]
                    },
                }
            }
        },
        methods: {
            handleSubmit() {
                this.form.validateFields((err, values) => {
                   if (!err) {
                       let role = Vue.ls.get(USER_INFO).fullName
                       let timeNow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                       let objs = Object.assign(values,this.needData)
                       let obj = {
                           role,
                           timeNow,
                           ...objs
                       }
                       this.confirmLoading = true;
                       claimAndCompleteTask(obj).then(res => {
                           if (res.success) {
                               this.confirmLoading = false;
                               this.$message.success(res.message);
                               this.setFormValue();
                               this.handleCancel();
                           } else {
                               this.$message.error(res.message);
                               this.handleCancel();
                           }
                           this.setFormValue()
                       });
                   }
                });
            },
            setFormValue() {
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        remark: ''
                    });
                });
            },
            handleCancel() {
                this.setFormValue()
                this.$emit('back',true)
            }
        }
    }
</script>

<style scoped>

</style>