<template>
    <div class="box">
        <a-row class="planTitle">
            规划报告
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="7" :sm="8">
                    <a-form-item label="报告类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-select placeholder="请选择..." v-model="queryParam.reportTypeId" allowClear>
                            <a-select-option v-for="type in typeList" :value="type.id" :key="type.id">
                                {{type.typeName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item label="所属领域" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-select placeholder="请选择..." v-model="queryParam.domainTypeId" allowClear>
                            <a-select-option v-for="domain in domainList" :value="domain.id" :key="domain.id">
                                {{domain.domainName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item label="报告业务" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-select placeholder="请选择..." v-model="queryParam.businessTypeId" allowClear>
                            <a-select-option v-for="business in businessList" :value="business.id"
                                             :key="business.id">{{business.typeName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item label="报告名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-input placeholder="请输入..." v-decorator="[ 'reportName', validatorRules.reportName]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item label="报告期数" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-input-number :min="1" v-decorator="[ 'reportPeriods', validatorRules.reportPeriods]" style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item label="累计期数" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-input-number :min="1" v-decorator="[ 'reportTotalCount', validatorRules.reportTotalCount]" style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item label="开始时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-date-picker
                                v-decorator="[ 'reportStartTime', validatorRules.reportStartTime]"
                                @change="changePeriod"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item label="结束时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-date-picker
                                :disabled="timeFlag"
                                v-decorator="[ 'reportEndTime', validatorRules.reportEndTime]"
                                @change="changeTime"
                                style="width: 100%;"/>
                    </a-form-item>
                </a-col>

                <a-col :md="7" :sm="8">
                    <a-form-item
                            label="报告周期"
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            extra="(报告结束时间和报告周期两者只能选填一项！)">
                        <span>
                            <a-input-number
                                    :disabled="periodFlag"
                                    :min="1"
                                    v-decorator="[ 'reportPeriod', validatorRules.reportPeriod]"
                                    @change="changePeriod"
                                    style="width: 49%;"/>
                            <a-select
                                    placeholder="请选择..."
                                    :disabled="periodFlag"
                                    allowClear
                                    v-decorator="[ 'periodUnit', validatorRules.periodUnit ]"
                                    @change="changePeriod"
                                    style="margin-left: 2%;width: 49%;">
                                <a-select-option value="M">月</a-select-option>
                                <a-select-option value="W">周</a-select-option>
                                <a-select-option value="D">天</a-select-option>
                            </a-select>
                        </span>
                    </a-form-item>
                </a-col>

                <a-col :md="20" :sm="8">
                    <a-form-item label="报告模板" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <span><a @click="showReportView">{{reportObj.reportName}}</a></span>
                        <a-button type="primary" @click="selectMould('report')" style="margin-left: 20px;">选择</a-button>
                    </a-form-item>
                </a-col>

                <a-col :md="20" :sm="8">
                    <a-form-item label="台站" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <a-checkbox-group v-decorator="[ 'stations', validatorRules.stations]">
                            <a-checkbox class="checkItem" v-for="sta in stationList" :value="sta.id" :key="sta.id">
                                {{sta.orgCode}}
                            </a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                </a-col>

                <a-col :md="20" :sm="8">
                    <a-form-item label="工作流" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <span><a @click="">{{flowObj.name}}</a></span>
                        <a-button type="primary" @click="selectMould('flow')" style="margin-left: 20px;">选择</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <div style="text-align: center;margin-top: 10px;">
            <a-button type="primary" @click="back">取消</a-button>
            <a-button type="primary" @click="save" style="margin-left: 8px;">保存</a-button>
        </div>

        <selectModal :modalObj="modalObj" ref="selectModal" @slctModal="slctModal"></selectModal>

        <a-modal
                title="报告详情"
                width="70%"
                :visible="visible"
                :footer="null"
                :centered="true"
                cancelText="关闭"
                @cancel="cancelReportView"
                wrapClassName="ant-modal-cust-warp">
            <reportView :reportId="reportObj.id" :backBtn="false"></reportView>
        </a-modal>
    </div>
</template>

<script>
    import selectModal from '@/components/selectModal/selectModal'
    import moment from 'moment'
    import { selectReportInstanceSeq, addReportIssued } from '@api/api'
    import Vue from 'vue'
    import { USER_INFO } from '@/store/mutation-types'
    import reportView from '@/components/report/reportView'

    export default {
        name: 'reportPlanView',
        props: ['domainList', 'businessList', 'typeList', 'stationList'],
        components: {
            selectModal,
            reportView
        },
        data() {
            return {
                queryParam: {},
                modalObj: {},
                form: this.$form.createForm(this),
                reportObj: {},
                labelCol: {span: 9},
                wrapperCol: {span: 15},
                flowObj: {},
                timeFlag: false,
                periodFlag: false,
                validatorRules: {
                    reportName: {
                        rules: [{required: true, message: '请输入报告名称!'}]
                    },
                    reportStartTime: {
                        rules: [{required: true, message: '请选择开始时间!'}]
                    },
                    reportPeriods: {
                        rules: [{required: true, message: '请输入报告期数!'}]
                    },
                    reportTotalCount: {
                        rules: [{required: true, message: '请输入累计期数!'}]
                    },
                    reportEndTime: {
                        rules: [{required: true, message: '请选择结束日期，或填写报告周期!'}]
                    },
                    stations: {
                        rules: [{required: true, message: '请选择台站!'}]
                    },
                },
                visible: false
            }
        },
        methods: {
            back() {
                this.$emit('back', false);
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
                        urlPath: '/nmmonitor-server-moduls-monitor/feign/queryDeployedProcessInfoList',
                        searchForm: [
                            {
                                label: '名称',
                                type: 'input',
                                query: 'reportName'
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
            showReportView() {
                this.visible = true;
            },
            cancelReportView() {
                this.visible = false;
            },
            changeTime(val) {
                if (val) {
                    this.periodFlag = true;
                } else {
                    this.periodFlag = false;
                }
            },
            changePeriod(val) {
                if (val) {
                    this.timeFlag = true;
                    this.$nextTick(() => {
                        let obj = this.form.getFieldsValue(['reportStartTime', 'reportPeriod', 'periodUnit']);
                        if (obj.reportStartTime) {
                            let time = '';
                            if (obj.reportPeriod && obj.periodUnit) {
                                switch (obj.periodUnit) {
                                    case 'M': {
                                        time = moment(obj.reportStartTime).add(obj.reportPeriod, 'months');
                                        break;
                                    }
                                    case 'W': {
                                        time = moment(obj.reportStartTime).add(obj.reportPeriod, 'weeks');
                                        break;
                                    }
                                    case 'D': {
                                        time = moment(obj.reportStartTime).add(obj.reportPeriod, 'days');
                                        break;
                                    }
                                }
                                this.form.setFieldsValue({reportEndTime: time});
                            } else {
                                this.timeFlag = false;
                            }
                        } else {
                            this.$message.info('请选择开始时间！');
                        }
                    })
                } else {
                    this.timeFlag = false;
                }
            },
            save() {
                if (this.reportObj.id) {
                    this.form.validateFields((err, values) => {
                        if (!err) {
                            selectReportInstanceSeq({count: values.stations.length}).then(res => {
                                if (res.success) {
                                    let idArr = res.result;
                                    let param = [];
                                    idArr.forEach((id, index) => {
                                        let obj = {
                                            id: idArr[index],
                                            reportName: `${values.reportName}第${values.reportPeriods}期，总${values.reportTotalCount}期`,
                                            reportStartTime: `${moment(values.reportStartTime).format('YYYY-MM-DD')} 00:00:00`,
                                            reportEndTime: `${moment(values.reportEndTime).format('YYYY-MM-DD')} 23:59:59`,
                                            reportCreateUser: Vue.ls.get(USER_INFO).userName,
                                            reportCreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                            reportPeriods: values.reportPeriods,
                                            reportTotalCount: values.reportTotalCount,
                                            reportPeriod: values.reportPeriod,
                                            periodUnit: values.periodUnit,
                                            reportTableId: this.reportObj.id,
                                            stationId: values.stations[index],
                                            workflowId: this.flowObj.id,
                                            workflowKey: this.flowObj.key
                                        };
                                        param.push(obj);
                                    });
                                    addReportIssued(param).then(res => {
                                        if (res.success) {
                                            this.$message.success('新增成功！');
                                            this.$emit('back', true);
                                        } else {
                                            console.log(res.message);
                                        }
                                    });
                                } else {
                                    console.log(res.message);
                                }
                            });
                        }
                    });
                } else {
                    this.$message.info('请选择报告模板！');
                }
            }
        }
    }
</script>

<style scoped>
    .checkItem {
        margin: 10px 20px;
    }

    .planTitle {
        height: 50px;
        line-height: 50px;
        font-size: 25px;
        font-weight: bold;
        text-align: center;
    }
</style>