<template>
    <div>
        <a-modal
                :title="title"
                :width="800"
                :visible="visible"
                :confirmLoading="confirmLoading"
                :maskClosable="false"
                :centered="true"
                @ok="handleOk"
                @cancel="close"
                cancelText="关闭">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form">
                    <a-form-item label="报告名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入报告名称" v-decorator="[ 'reportName', validatorRules.reportName]"/>
                    </a-form-item>

                    <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'reportStartTime', validatorRules.reportStartTime]" style="width: 100%;"/>
                    </a-form-item>

                    <a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'reportEndTime', validatorRules.reportEndTime]" style="width: 100%;"/>
                    </a-form-item>

                    <a-form-item label="选择流程" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <span><a>{{flowObj.name}}</a></span>
                        <a-button type="primary" @click="selectMould('flow')" style="margin-left: 20px;">选择</a-button>
                    </a-form-item>

                    <a-form-item label="选择报告" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <span><a @click="showReportView">{{reportObj.reportName}}</a></span>
                        <a-button type="primary" @click="selectMould('report')" style="margin-left: 20px;">选择</a-button>
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-modal>

        <selectModal :modalObj="modalObj" ref="selectModal" @slctModal="slctModal"></selectModal>

        <a-modal
                title="报告详情"
                :width="1500"
                :visible="reportVisible"
                :maskClosable="false"
                :footer="null"
                cancelText="关闭"
                @cancel="cancelReportView"
                wrapClassName="ant-modal-cust-warp">
            <reportView :reportId="reportObj.id" :backBtn="false"></reportView>
        </a-modal>
    </div>
</template>

<script>
    import selectModal from '@/components/selectModal/selectModal'
    import reportView from '@/components/report/reportView'
    import { relatedReport } from '@api/api'
    import { JeecgListMixin } from "@/mixins/JeecgListMixin";
    import moment from 'moment'

    export default {
        name: 'taskJudgesModal',
        mixins: [JeecgListMixin],
        components: {
            selectModal,
            reportView
        },
        data() {
            return {
                title: '',
                visible: false,
                confirmLoading: false,
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
                    reportName: {
                        rules: [{required: true, message: '请输入报告名称!'}]
                    },
                    reportStartTime: {
                        rules: [{required: true, message: '请选择开始时间!'}, {validator: this.validateStartTime}]
                    },
                    reportEndTime: {
                        rules: [{required: true, message: '请选择结束时间!'}, {validator: this.validateEndTime}]
                    },
                },
                taskObj: {},
                reportObj: {reportName:'请选择'},
                flowObj: {},
                modalObj: {},
                queryParam: {},
                reportVisible: false,
                url: {
                    list:
                    "/nmmonitor-server-module-taskScheduling/taskSchedulingV2/getTaskInstanceInfoList"
                },
            }
        },
        methods: {
            validateStartTime(rule, value, callback) {
                let obj = this.form.getFieldsValue(['reportEndTime']);
                if (value && obj.reportEndTime) {
                    if (value === moment.max(value, obj.reportEndTime)) {
                        callback('开始时间不能大于结束时间');
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            validateEndTime(rule, value, callback) {
                let obj = this.form.getFieldsValue(['reportStartTime']);
                if (value && obj.reportStartTime) {
                    if (value === moment.min(value, obj.reportStartTime)) {
                        callback('结束时间不能小于开始时间');
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            add(obj) {
                this.taskObj = Object.assign({}, obj);
                this.form.resetFields();
                this.visible = true;
                this.reportObj = {
                    reportName: this.taskObj.reportTemplateName,
                    id: this.taskObj.reportTemplateId
                }
                this.flowObj = {}
            },
            selectMould(str) {
                if (str === 'report') {
                    this.modalObj = {
                        urlPath: '/nmmonitor-server-moduls-monitor/feign/queryReportTableInfoList',
                        searchForm: [
                            {
                                label: '名称',
                                type: 'input',
                                query: 'reportName'
                            }
                        ],
                        type: str,
                        title: '选择模板',
                        defaultId: this.reportObj.id ? [this.reportObj.id] : []
                    };
                } else {
                    this.modalObj = {
                        // urlPath: '/nmmonitor-server-moduls-monitor/feign/queryDeployedProcessInfoList',
                        urlPath: '/nmmonitor-server-activiti/activiti/queryDeployedProcessInfoList',
                        searchForm: [
                            {
                                label: '名称',
                                type: 'input',
                                query: 'activitiName'
                            }
                        ],
                        type: str,
                        title: '选择工作流',
                        defaultId: this.flowObj.id ? [this.flowObj.id] : []
                    };
                    this.queryParam = {workflowType: '2'};
                }
                this.$refs.selectModal.show(this.queryParam);
            },
            slctModal(arr) {
                if (this.modalObj.type === 'report') {
                    this.reportObj = {
                        reportName: arr[0].reportName,
                        id: arr[0].id
                    };
                } else {
                    this.flowObj = {
                        id: arr[0].id,
                        name: arr[0].name,
                        key: arr[0].key
                    }
                }
            },
            close() {
                this.visible = false;
            },
            handleOk() {
                if (this.flowObj.id) {
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            let obj = {
                                id: this.taskObj.taskInstanceId,
                                reportName: values.reportName,
                                reportStartTime: moment(values.reportStartTime).format('YYYY-MM-DD HH:mm:ss'),
                                reportEndTime: moment(values.reportEndTime).format('YYYY-MM-DD HH:mm:ss'),
                                workflowId: this.flowObj.id,
                                workflowKey: this.flowObj.key,
                                taskId: this.taskObj.id,
                                reportTemplateId: this.reportObj.id,
                            };
                            relatedReport(obj).then(res => {
                                if (res.success) {
                                    this.$message.info('生成报告成功！');
                                    this.close();
                                    this.$emit('refresh')
                                } else {
                                    this.$message.info('生成报告失败！');
                                    this.close();
                                }
                            });
                        }
                    });
                } else {
                    this.$message.info('请选择工作流流程！');
                }
            },
            showReportView() {
                this.reportVisible = true;
            },
            cancelReportView() {
                this.reportVisible = false;
            },
        }
    }
</script>

<style scoped>

</style>