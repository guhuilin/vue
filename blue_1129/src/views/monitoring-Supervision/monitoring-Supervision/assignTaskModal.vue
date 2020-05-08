<template>
    <a-modal
            title="指派任务"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            :centered="true"
            @ok="handleSubmit"
            @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item label="选择用户" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select placeholder="请选择用户" v-decorator="[ 'userName', validatorRules.userName]">
                        <a-select-option v-for="user in userList" :key="user" :value="user">{{ user }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { getUserNameList, assignTaskToUser } from '@api/api'

    export default {
        name: 'assignTaskModal',
        data() {
            return {
                visible: false,
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
            show(procInstId) {
                this.visible = true;
                this.taskObj.procInstId = procInstId;
                getUserNameList().then(res => {
                    if (res.success) {
                        this.userList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            handleSubmit() {
                this.form.validateFields((err, values) => {
                   if (!err) {
                       this.confirmLoading = true;
                       this.taskObj.userName = values.userName;
                       assignTaskToUser(this.taskObj).then(res => {
                           if (res.success) {
                               this.confirmLoading = false;
                               this.$message.success(res.message);
                               this.handleCancel();
                           } else {
                               console.log(res.message);
                           }
                       });
                   }
                });
            },
            handleCancel() {
                this.visible = false;
            }
        }
    }
</script>

<style scoped>

</style>