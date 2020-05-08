<template>
    <div>
        <a-modal
                :title="title"
                :visible="visible"
                :confirmLoading="confirmLoading"
                :maskClosable="false"
                :centered="true"
                @ok="handleOk"
                @cancel="close"
                cancelText="关闭">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form">
                    <a-row :gutter="24">
                        <a-col :md="24" :sm="24">
                            <a-form-item label="一级研判" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-select mode="multiple" style='width: 220px' v-decorator="[ 'judgeOne', validatorRules.judgeOne]">
                                    <a-select-option v-for="item in judgeOneData" :value="item.USERNAME+'-'+item.USERID" :key="item.USERID">
                                        {{item.USERNAME}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="二级研判" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-select mode="multiple" style='width: 220px' v-decorator="[ 'judgeTwo', validatorRules.judgeTwo]">
                                    <a-select-option v-for="item in judgeTwoData" :key="item.USERNAME+'-'+item.USERID">
                                        {{item.USERNAME}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="最终研判" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-select mode="multiple" style='width: 220px' v-decorator="[ 'judgeThree', validatorRules.judgeThree]">
                                    <a-select-option v-for="item in judgeThreeData" :key="item.USERNAME+'-'+item.USERID">
                                        {{item.USERNAME}}
                                    </a-select-option>
                                </a-select> 
                            </a-form-item>
                            <a-form-item label="任务说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-textarea style='width: 220px' placeholder="请输入..." :rows="4" v-decorator="['taskDesc',{initialValue:''}]"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-spin>
        </a-modal>
    </div>
</template>

<script>
    import { getJudgedUserInfoListByJudgedLevel, addJudgedInfoToTask } from '@api/api'
    import moment from 'moment'

    export default {
        name: 'assignTask',
        data() {
            return {
                title: '',
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                labelCol: {span: 6},
                wrapperCol: {span: 15},
                judgeOneData: [],
                judgeTwoData: [],
                judgeThreeData: [],
                validatorRules: {
                    judgeOne: {
                        rules: [{required: true, message: '请选择!'}]
                    },
                    judgeTwo: {
                        rules: [{required: true, message: '请选择!'}]
                    },
                    judgeThree: {
                        rules: [{required: true, message: '请选择!'}]
                    },
                },
                taskObj: {},
                reportObj: {reportName:'请选择'},
                flowObj: {},
                modalObj: {},
                reportVisible: false,
            }
        },
        created() {
            this.getJudgedUserInfoListByJudgedLevel();
        },
        methods: {
            add(obj) {
                this.taskObj = Object.assign({}, obj);
                this.form.resetFields();
                this.visible = true;
                this.reportObj = {
                    reportName: this.taskObj.reportTemplateName,
                    id: this.taskObj.reportTemplateId
                }
            },
            close() {
                this.visible = false;
            },
            handleOk() {
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            let list = []
                            values.judgeOne && values.judgeOne.map(item => {
                                    list.push({
                                    taskId: this.taskObj.id,
                                    taskInstanceId: this.taskObj.taskInstanceId,
                                    judgedLevel: 1,
                                    userId: item.split('-')[1],
                                    userName: item.split('-')[0]
                                })
                            })
                            values.judgeTwo && values.judgeTwo.map(item => {
                                list.push({
                                    taskId: this.taskObj.id,
                                    taskInstanceId: this.taskObj.taskInstanceId,
                                    judgedLevel: 2,
                                    userId: item.split('-')[1],
                                    userName: item.split('-')[0]
                                })
                            })
                            values.judgeThree && values.judgeThree.map(item => {
                                list.push({
                                    taskId: this.taskObj.id,
                                    taskInstanceId: this.taskObj.taskInstanceId,
                                    judgedLevel: 3,
                                    userId: item.split('-')[1],
                                    userName: item.split('-')[0]
                                })
                            })
                            const obj = {
                                taskInstanceId: this.taskObj.taskInstanceId,
                                taskDesc: values.taskDesc,
                                list
                            }
                            addJudgedInfoToTask(obj).then(res => {
                                if (res.success) {
                                    this.$message.info('分配任务成功！');
                                    this.close();
                                    this.$emit('refresh')
                                } else {
                                    this.$message.info('分配任务失败！');
                                    console.log(res.message);
                                    this.close();
                                }
                            });
                        }
                    });
            },
            getJudgedUserInfoListByJudgedLevel() {
                getJudgedUserInfoListByJudgedLevel({judgeLevel:1}).then(res => {console.log(res,'res')
                    if(res.success) {
                        this.judgeOneData = res.result
                    }
                })
                getJudgedUserInfoListByJudgedLevel({judgeLevel:2}).then(res => {
                    if(res.success) {
                        this.judgeTwoData = res.result
                    }
                })
                getJudgedUserInfoListByJudgedLevel({judgeLevel:3}).then(res => {
                    if(res.success) {
                        this.judgeThreeData = res.result
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>