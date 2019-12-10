<template>
    <div style="height: 100%;">
        <a-tabs v-model="tabs" @change="changeTabs">
            <a-tab-pane tab="任务基本信息" key="1"></a-tab-pane>
            <a-tab-pane tab="任务流转信息" key="2" v-if="viewType === 'normal'"></a-tab-pane>
            <a-button slot="tabBarExtraContent" type="primary" @click="back">返回</a-button>
        </a-tabs>

        <div style="height: 80%;font-size: 150%;" v-if="tabs === '1'">
            <a-form layout="inline" :form="form">
                <!-- 任务名称 父任务 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input placeholder="请输入..." :disabled="disabled" v-decorator="[ 'taskName']"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="父任务" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input-search placeholder="请选择..." size="large" :disabled="true" v-model="parentObj.taskName" @search="selectMould('task')">
                                <a-button slot="enterButton" :disabled="disabled">选择</a-button>
                            </a-input-search>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 任务量 任务目标 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务量" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input-number :min="1" :disabled="disabled" style="width: 100%;" v-decorator="[ 'workload']"/>
                        </a-form-item>
                    </a-col>

                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务目标" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input placeholder="请输入..." :disabled="disabled" v-decorator="[ 'description']"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 任务编号 优先级 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务编号" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input placeholder="请输入..." :disabled="disabled" v-decorator="[ 'taskId']"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="优先级" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select :disabled="disabled" v-decorator="[ 'priority']">
                                <a-select-option value="0">高</a-select-option>
                                <a-select-option value="1">中</a-select-option>
                                <a-select-option value="2">低</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 任务所属领域 任务分类 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="所属领域" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select :disabled="disabled" v-decorator="[ 'taskDomain']">
                                <a-select-option v-for="(item,ind) in selectTaskDomain" :key="ind" :value="item.id">{{item.domainName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务分类" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select :disabled="disabled" v-decorator="[ 'taskSource']">
                                <a-select-option v-for="(item,ind) in selectTaskSource" :key="ind" :value="item.id">{{item.typeName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 关联任务 任务类型 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="关联业务" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select :disabled="disabled" v-decorator="[ 'taskBusiness']">
                                <a-select-option v-for="(item,ind) in selectTtaskBusiness" :key="ind" :value="item.id">{{item.typeName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select :disabled="disabled" v-decorator="['taskType']">
                                <a-select-option value="0">常规任务</a-select-option>
                                <a-select-option value="1">应急任务</a-select-option>
                                <a-select-option value="2">专项任务</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="formRow">
                    <a-col :md="24" :sm="8">
                        <a-form-item label="是否周期任务" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
                            <a-radio-group :disabled="disabled" v-model="isCycle">
                                <a-radio :value="1">是</a-radio>
                                <a-radio :value="0">否</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 是 -->
                <a-row :gutter="24" class="formRow" v-show="isCycle == 1">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="开始时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-date-picker
                                    :disabled="disabled"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    :showTime="true"
                                    style="width: 100%;"
                                    v-decorator="[ 'startTime']"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="共：" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input-number :disabled="disabled" :min="1" v-decorator="[ 'taskPeriods']" /> 期
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务周期" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input-number style="width:50%" :disabled="disabled" :min="1" v-decorator="[ 'interval']" />
                            <a-select style="width:50%" :disabled="disabled" v-decorator="['intervalUnit']">
                                <a-select-option v-for="(item,ind) in selectTaskPeriods" :key="ind" :value="item.id">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="下发时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <!-- <a-select style="width:50%" :disabled="disabled" v-decorator="['taskDownDate']">
                                <a-select-option v-for="(item,ind) in selectTaskDownDate" :key="ind" :value="item.id">{{item.name}}</a-select-option>
                            </a-select> -->
                            <a-time-picker :disabled="disabled" style="width:50%" v-decorator="[ 'taskDownTime']" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 否 -->
                <a-row :gutter="24" class="formRow" v-show="isCycle == 0">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="开始时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-date-picker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    :showTime="true"
                                    :disabled="disabled"
                                    style="width: 100%;"
                                    v-decorator="['startTime']"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="结束时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-date-picker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    :showTime="true"
                                    :disabled="disabled"
                                    style="width: 100%;"
                                    v-decorator="['endTime']"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="formRow">
                    <a-col :md="24" :sm="8">
                        <a-form-item label="任务模式" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
                            <a-radio-group :disabled="disabled" v-decorator="['taskMode']">
                                <a-radio v-for="(item,ind) in taskMode" :key="ind" :value="item.id">{{item.actInstName}}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 总局下发台站任务 -->
                <a-row :gutter="24" class="formRow" v-if="actInstTaskType == 1">
                    <a-col :md="24" :sm="8">
                        <a-form-item label="台站" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                            <a-checkbox-group :disabled="disabled" v-decorator="[ 'stationIds',{initialValue:arr}]">
                                <a-checkbox class="checkItem" v-for="sta in stationList" :value="sta.id" :key="sta.id">
                                    {{sta.orgCode}}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <div style="height: 80%;overflow-y: auto;overflow-x: hidden" v-if="tabs === '2' && viewType === 'normal'">
            <a-spin :spinning="spinning" v-if="this.isCycle == 1">
                <a-tabs v-model="stationTabs" @change="changeStationTabs" v-if="this.isCycle == 1">
                    <a-tab-pane v-for="(sta,ind) in stationList2" :tab="'第'+sta.taskCertainPeriods+'期'" :key="ind">
                        <a-tabs v-model="stationTabs2" @change="changeStationTabs2(sta)">
                            <a-tab-pane v-for="val in sta.list" :tab="val.orgCode" :key="val.stationId">
                                 <a-row :gutter="24" class="infoRow">
                                    <a-col :md="21" :sm="8" style="font-size: 120%;">
                                        <a-row :gutter="24" style="text-align: center">
                                            <a-col :md="4" :sm="6">
                                                任务完成情况:
                                            </a-col>
                                            <a-col :md="4" :sm="18">
                                                {{taskCompletionRate}}
                                            </a-col>
                                            <a-col :md="3" :sm="6">
                                                任务执行时间:
                                            </a-col>
                                            <a-col :md="3" :sm="18">
                                                {{taskExecutionTimeMinutes ? getFlowTime(taskExecutionTimeMinutes) : ''}}
                                            </a-col>
                                            <a-col :md="3" :sm="6">
                                                任务剩余时间:
                                            </a-col>
                                            <a-col :md="3" :sm="18">
                                                {{taskRemainTimeMinutes ? getFlowTime(taskRemainTimeMinutes) : ''}}
                                            </a-col>
                                            <a-col :md="3" :sm="6">
                                                任务状态:
                                            </a-col>
                                            <a-col :md="2" :sm="18">
                                                {{taskStatus}}
                                            </a-col>
                                        </a-row>
                                            <a-row :gutter="24" style="text-align: center;margin-top: 20px;">
                                            <a-col :md="3" :sm="6">
                                                任务当前环节:
                                            </a-col>
                                            <a-col :md="4" :sm="18">
                                                {{taskCurrentExecuteUser}}
                                            </a-col>
                                        </a-row>
                                    </a-col>

                                    <a-col :md="1" :sm="8">
                                        <a-col span="4" offset="18">
                                            <a-button type="primary" @click="urge" v-if="hasPerm('enable')">催办</a-button>
                                        </a-col>
                                    </a-col>
                                </a-row>
                                <div class="workflow" v-if="show">
                                    <showFlow :data="imgUrl" :showId="showId"></showFlow>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </a-tab-pane>
                </a-tabs>
                <div style="margin-top: 20px;" v-if="fileList.length > 0">
                    <a-row>
                        <a-tag v-for="file in fileList" :key="file.appendixId" @click="changeTag(file)">{{file.tableName}}</a-tag>

                        <a-table
                                ref="table"
                                bordered
                                size="middle"
                                :columns="columns"
                                :dataSource="dataSource"
                                :pagination="ipagination"
                                :loading="loading"
                                @change="handleTableChange"
                                style="margin-top: 20px;">
                        </a-table>
                    </a-row>
                </div>
            </a-spin>
            <a-spin :spinning="spinning" v-if="this.isCycle == 0">
                <!-- <a-row :gutter="24" class="infoRow">
                    <a-col :md="21" :sm="8" style="font-size: 120%;">
                        <a-row :gutter="24" style="text-align: center">
                            <a-col :md="4" :sm="6">
                                任务完成情况:
                            </a-col>
                            <a-col :md="4" :sm="18">
                                {{taskCompletionRate}}
                            </a-col>
                            <a-col :md="3" :sm="6">
                                任务执行时间:
                            </a-col>
                            <a-col :md="3" :sm="18">
                                {{taskExecutionTimeMinutes ? getFlowTime(taskExecutionTimeMinutes) : ''}}
                            </a-col>
                            <a-col :md="3" :sm="6">
                                任务剩余时间:
                            </a-col>
                            <a-col :md="3" :sm="18">
                                {{taskRemainTimeMinutes ? getFlowTime(taskRemainTimeMinutes) : ''}}
                            </a-col>
                            <a-col :md="3" :sm="6">
                                任务状态:
                            </a-col>
                            <a-col :md="2" :sm="18">
                                {{taskStatus}}
                            </a-col>
                        </a-row>
                            <a-row :gutter="24" style="text-align: center;margin-top: 20px;">
                            <a-col :md="3" :sm="6">
                                任务当前环节:
                            </a-col>
                            <a-col :md="4" :sm="18">
                                {{taskCurrentExecuteUser}}
                            </a-col>
                        </a-row>
                    </a-col>

                    <a-col :md="1" :sm="8">
                        <a-col span="4" offset="18">
                            <a-button type="primary" @click="urge" v-if="hasPerm('enable')">催办</a-button>
                        </a-col>
                    </a-col>
                </a-row> -->
                <a-tabs v-model="stationTabs2" v-for="(sta,ind) in stationList2" :key="ind" @change="changeStationTabs2(sta)">
                    <a-tab-pane v-for="val in sta.list" :tab="val.orgCode" :key="val.stationId">
                        <a-row :gutter="24" class="infoRow">
                            <a-col :md="21" :sm="8" style="font-size: 120%;">
                                <a-row :gutter="24" style="text-align: center">
                                    <a-col :md="4" :sm="6">
                                        任务完成情况:
                                    </a-col>
                                    <a-col :md="4" :sm="18">
                                        {{taskCompletionRate}}
                                    </a-col>
                                    <a-col :md="3" :sm="6">
                                        任务执行时间:
                                    </a-col>
                                    <a-col :md="3" :sm="18">
                                        {{taskExecutionTimeMinutes ? getFlowTime(taskExecutionTimeMinutes) : ''}}
                                    </a-col>
                                    <a-col :md="3" :sm="6">
                                        任务剩余时间:
                                    </a-col>
                                    <a-col :md="3" :sm="18">
                                        {{taskRemainTimeMinutes ? getFlowTime(taskRemainTimeMinutes) : ''}}
                                    </a-col>
                                    <a-col :md="3" :sm="6">
                                        任务状态:
                                    </a-col>
                                    <a-col :md="2" :sm="18">
                                        {{taskStatus}}
                                    </a-col>
                                </a-row>
                                    <a-row :gutter="24" style="text-align: center;margin-top: 20px;">
                                    <a-col :md="3" :sm="6">
                                        任务当前环节:
                                    </a-col>
                                    <a-col :md="4" :sm="18">
                                        {{taskCurrentExecuteUser}}
                                    </a-col>
                                </a-row>
                            </a-col>

                            <a-col :md="1" :sm="8">
                                <a-col span="4" offset="18">
                                    <a-button type="primary" @click="urge" v-if="hasPerm('enable')">催办</a-button>
                                </a-col>
                            </a-col>
                        </a-row>
                        <div class="workflow" v-if="show">
                            <showFlow :data="imgUrl" :showId="showId"></showFlow>
                        </div>
                    </a-tab-pane>
                </a-tabs>
                <div style="margin-top: 20px;" v-if="fileList.length > 0">
                    <a-row>
                        <a-tag v-for="file in fileList" :key="file.appendixId" @click="changeTag(file)">{{file.tableName}}</a-tag>

                        <a-table
                                ref="table"
                                bordered
                                size="middle"
                                :columns="columns"
                                :dataSource="dataSource"
                                :pagination="ipagination"
                                :loading="loading"
                                @change="handleTableChange"
                                style="margin-top: 20px;">
                        </a-table>
                    </a-row>
                </div>
            </a-spin>
        </div>

        <a-modal
                title="报告详情"
                :width="1500"
                :visible="mouldVisible"
                :maskClosable="false"
                :footer="null"
                :centered="true"
                cancelText="关闭"
                @cancel="cancelReportView"
                wrapClassName="ant-modal-cust-warp">
            <reportView :reportId="taskObj.reportTemplateId" :backBtn="false"></reportView>
        </a-modal>

        <flowModal ref="flowModal"></flowModal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {USER_INFO} from "@/store/mutation-types"
    import {
        getTaskInstanceAndStationInfoList,
        getImageJsonByProcessInstanceId,
        getImageJsonByProcessInstanceId2,
        getTableInfoList,
        // getTaskMessageStatistics,
        getTaskMessageStatistics2,
        getTableDataList,
        addTaskUrgentRecordInfo,
        getImageJsonByProcessDefinitionKey,
        getTaskModeInfoList, 
        getActInstTypeInfoList, 
        getAllReportBusinessInfoList, 
        getAllReportDomainInfoList, 
        getStationInfoList, 
        addTaskInfo, 
        updateTaskInfo,
        querySubSystem
    } from '@api/api'
    import reportView from '@/components/report/reportView'
    import showFlow from '../../system/modules/showFlow'
    // import taskModalDiv from './taskModalDiv'
        import moment from 'moment'
    import flowModal from '../../system/modules/FlowModal'
    import { hasPerm } from "@/utils/authFilter"
    import detailList from '@/components/tools/DetailList'
    import store from '@/store'
    const detailListItem = detailList.Item;

    const selectTaskPeriods = [{name:'天',id:1},{name:'周',id:2},{name:'月',id:3}]
    const selectTaskDownDate = [{name:'周一',id:1},{name:'周二',id:2},{name:'周三',id:3}]

    export default {
        name: 'taskModalDiv',
        props: ['taskObj', 'viewType'],
        components: {
            reportView,
            showFlow,
            flowModal,
            detailList,
            detailListItem
        },
        data() {
            return {
                selectTaskPeriods,
                selectTaskDownDate,
                procInstId: '',
                actInstTaskType: '',
                taskCompletionRate: '',
                taskCurrentExecuteTimeMinutes: '',
                taskCurrentExecuteUser: '',
                taskExecutionTimeMinutes: '',
                taskRemainTimeMinutes: '',
                taskStatus: '',
                arr: [],
                selectTtaskBusiness: [],
                selectTaskDomain: [],
                selectTaskSource: [],
                workfolwTemplateId: '',
                systemTask: [],
                endList: [],
                form: this.$form.createForm(this),
                isCycle: 1,
                taskMode: [],
                taskModeId: null,
                selectValue: '',
                addSystem: [],
                disabled: true,
                parentObj: {
                    id: 0,
                    taskName: '无父任务'
                },
                tabs: '1',
                stationTabs: '',
                stationTabs2: '',
                stationList: [],
                stationList2: [],
                mouldVisible: false,
                show: false,
                imgUrl: {},
                labelCol: {span: 6},
                wrapperCol: {span: 15},
                showId: '',
                fileList: [],
                columns: [],
                dataSource: [],
                ipagination: {
                    current: 1,
                    pageSize: 10,
                    pageSizeOptions: ['10', '20', '30'],
                    showTotal: (total, range) => {
                        return range[0] + "-" + range[1] + " 共" + total + "条"
                    },
                    showQuickJumper: true,
                    showSizeChanger: true,
                    total: 0
                },
                loading: false,
                workFlowInfo: {},
                stationObj: {},
                spinning: false,
            }
        },
        computed: {
            getFlowTime(time){
                return function(time){
                    if (time > 0) {
                        if (time > 3600) {
                            return `${parseInt(time / 1440)}天${parseInt(time % 1440 / 60)}小时${time % 3600 % 60}分钟`;
                        } else if (time > 60) {
                            return `${parseInt(time / 60)}小时${time % 60}分钟`;
                        } else {
                            return `${time}分钟`;
                        }
                    } else {
                        return '任务已过期';
                    }
                }
            }

        },
        created() {
            this.getTaskInstanceAndStationInfoList();
            this.getTaskWorkflowImg();
            this.getData();
            this.getTaskBusiness();
            setTimeout(()=>{
                this.setFormValue(); 
            },0)
        },
        methods: {
            hasPerm,
            getTaskBusiness(val) {
                if(val) {
                    store.dispatch('getReportBusiness',val).then(res => {
                        this.selectTtaskBusiness = res;
                    }).then(res => {
                        this.selectTtaskBusiness.map(item => {
                            if(this.taskObj.taskBusiness === item.id) {
                                this.form.setFieldsValue({
                                    taskBusiness: item.typeName
                                })
                                return item.typeName
                            }
                        })
                    });
                }
            },
            setFormValue() {
                console.log(this.taskObj,'taskObj')
                if (this.taskObj.id) {
                    // this.disabled = true;
                    this.$nextTick(() => {
                        // if (this.taskObj.workfolwTemplateId) {
                            this.reportObj = {
                                id: this.taskObj.reportTemplateId,
                                reportName: this.taskObj.reportTemplateName
                            };
                            this.parentObj = {
                                id: this.taskObj.parentId,
                                taskName: this.taskObj.parentTaskName
                            };
                            this.flowObj = {
                                key: this.taskObj.workfolwTemplateId,
                                name: this.taskObj.workflowTemplateName
                            };
                        // }
                        if(this.taskObj.actInstTaskType) {
                            this.actInstTaskType = this.taskObj.actInstTaskType
                        }
                        if(typeof this.taskObj.isCycle === 'number' && !isNaN(this.taskObj.isCycle)) {
                            this.isCycle = Number(this.taskObj.isCycle)
                        }
                        if(this.taskObj.taskMode) {
                            this.taskModeId = this.taskObj.taskMode
                        }
                        this.form.setFieldsValue({
                            description: this.taskObj.description,
                            executeTime: this.taskObj.executeTime,
                            immediateExecute: this.taskObj.immediateExecute,
                            interval: this.taskObj.interval,
                            intervalUnit: this.taskObj.intervalUnit,
                            parentId: this.taskObj.parentId,
                            priority: this.taskObj.priority,
                            pythonParams: this.taskObj.pythonParams,
                            runningStatus: this.taskObj.runningStatus,
                            taskBusiness: this.getTaskBusiness(this.taskObj.taskDomain), //this.getTaskBusiness(this.taskObj.taskDomain)
                            taskDomain: this.taskObj.taskDomain,
                            // taskDownDate: this.getTaskDownDate(this.taskObj.intervalUnit,this.taskObj.taskDownDate),
                            taskDownTime: moment(this.taskObj.taskDownTime, 'hh:mm:ss'),
                            taskId: this.taskObj.taskId,
                            taskMode: this.taskObj.taskMode,
                            taskPeriods: this.taskObj.taskPeriods,
                            taskSource: this.taskObj.taskSource,
                            taskName: this.taskObj.taskName,
                            endTime: moment(this.taskObj.endTime, 'YYYY-MM-DD hh:mm:ss'),
                            startTime: moment(this.taskObj.startTime, 'YYYY-MM-DD hh:mm:ss'),
                            workload: this.taskObj.workload,
                            priority: this.taskObj.priority,
                            taskId: this.taskObj.taskId,
                            priority: this.taskObj.priority,
                            taskType: this.taskObj.taskType ? this.taskObj.taskType == '0' ? '常规任务' : (this.taskObj.taskType == '1'? '应急任务': '专项任务') : "",
                            stationIds: this.taskObj.stationIds && this.taskObj.stationIds.split(';').map(item => {
                                return this.arr.push(parseInt(item));
                            }),
                        });
                    });
                } else {
                    this.disabled = false;
                }
            },
            getTaskDownDate(unit,date) {
                switch(unit) {
                    // case 1: {
                    //     let arr = [{name:'上午',id:1},{name:'下午',id:2}]
                    //     let newVal = arr.filter(item => {
                    //         return item.id === date
                    //     })
                    //     return newVal[0].name
                    //     break;
                    // }
                    case 2: {
                        let arr = [
                            {name:'周一',id:1},{name:'周二',id:2},{name:'周三',id:3},
                            {name:'周四',id:4},{name:'周五',id:5},{name:'周六',id:6},
                            {name:'周日',id:7}
                        ]
                        let newVal = arr.filter(item => {
                            return item.id === date
                        })
                        return newVal[0].name
                        break;
                    }
                    case 3: {
                        let arr = [
                            {name:'一号',id:1},{name:'二号',id:2},{name:'三号',id:3},
                            {name:'四号',id:4},{name:'五号',id:5},{name:'六号',id:6},
                            {name:'七号',id:7},{name:'八号',id:8},{name:'九号',id:9},
                            {name:'十号',id:10},{name:'十一',id:11},{name:'十二',id:12},
                            {name:'十三',id:13},{name:'十四',id:14},{name:'十五',id:15},
                            {name:'十六',id:16},{name:'十七',id:17},{name:'十八',id:18},
                            {name:'十九',id:19},{name:'二十',id:20},{name:'二十一',id:21},
                            {name:'二十二',id:22},{name:'二十三',id:23},{name:'二十四',id:24},
                            {name:'二十五',id:25},{name:'二十六',id:26},{name:'二十七',id:27},
                            {name:'二十八',id:28},{name:'二十九',id:29},{name:'三十',id:30}
                        ]
                        let newVal = arr.filter(item => {
                            return item.id === date
                        })
                        return newVal[0].name
                        break;
                    }
                }
            },
            getData() {
                querySubSystem().then(res => {
                    if(res.success) {
                        this.systemTask = res.result
                    }
                })
                getAllReportBusinessInfoList().then(res => {
                    if(res.success) {
                        this.selectTtaskBusiness = res.result
                    }
                })
                getAllReportDomainInfoList().then(res => {
                    if(res.success) {
                        this.selectTaskDomain = res.result
                    }
                })
                getActInstTypeInfoList().then(res => {
                    if(res.success) {
                        this.selectTaskSource = res.result
                    }
                })
                getTaskModeInfoList().then(res => {
                    if(res.success) {
                        this.taskMode = res.result
                    }
                })
                getStationInfoList({}).then(res => {
                    if (res.success) {
                        this.stationList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getTaskInstanceAndStationInfoList() {
                getTaskInstanceAndStationInfoList({taskId: this.taskObj.id}).then(res => { console.log(res,'res')
                    if (res.success) {
                        this.stationList2 = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            changeTabs(val) {      //大切
                if (val === '2') {
                    // this.spinning = true;
                    if (this.stationList2.length > 0) {
                        this.stationTabs = this.stationList2[0].id;
                        this.changeStationTabs(this.stationTabs);
                    } else {
                        this.$message.info('请下发任务后，查看任务流转信息！');
                        this.spinning = false;
                    }
                } else {
                    this.getTaskInstanceAndStationInfoList();
                    this.getTaskWorkflowImg();
                    this.setFormValue();
                }
            },
            getWorkflowImg() {
                getImageJsonByProcessInstanceId2({processInstanceId: this.procInstId}).then(res => {
                    if (res.success) {
                        this.imgUrl = JSON.parse(res.result.workFlowDiagramJson).showJson;
                        this.showId = res.result.taskId;
                        if(this.showId) this.show = true;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getTaskWorkflowImg() {
                getImageJsonByProcessDefinitionKey({processDefinitionKey: this.taskObj.workfolwTemplateId}).then(res => {
                    if (res.success) {
                        this.imgUrl.actActivitiDiagramJson = res.result.workFlowDiagramJson;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getFiltInfo() {
                if (this.stationObj.rptInstId) {
                    getTableInfoList({rptInsId: this.stationObj.rptInstId}).then(res => {
                        if (res.success) {
                            this.fileList = res.result;
                            this.changeTag(this.fileList[0]);
                        } else {
                            console.log(res.message);
                        }
                    });
                }
            },
            changeStationTabs(val) { 
                this.stationObj = this.stationList2.find(sta => {
                    return sta.id === val;
                });
                // if (!this.stationObj.rptInstId) {
                //     this.$message.info('当前任务未生成报告实例！');
                // }
                this.getWorkflowImg();
                // this.getWorkFlowMessage();
                // this.getFiltInfo();
            },
            changeStationTabs2(val) {     //小切
                let stationId = val.list.find(sta => {
                    return sta.stationId === this.stationTabs2;
                });
                this.procInstId = stationId.procInstId
                let obj = {
                    taskId: stationId.taskId,
                    stationId: this.stationTabs2,
                    taskCurrentPeriods: val.taskCertainPeriods
                }
                getTaskMessageStatistics2(obj).then(res => {
                    if(res.success) {
                        // this.endList = res.result;
                        this.taskCompletionRate = res.result.taskCompletionRate
                        this.taskCurrentExecuteTimeMinutes = res.result.taskCurrentExecuteTimeMinutes
                        this.taskCurrentExecuteUser = res.result.taskCurrentExecuteUser
                        this.taskExecutionTimeMinutes = res.result.taskExecutionTimeMinutes
                        this.taskRemainTimeMinutes = res.result.taskRemainTimeMinutes
                        this.taskStatus = res.result.taskStatus
                    }
                })
                this.getWorkflowImg();
            },
            // getWorkFlowMessage() {
            //     getTaskMessageStatistics({taskId: this.taskObj.id, stationId: this.stationObj.stationId}).then(res => {
            //         if (res.success) {
            //             this.workFlowInfo = res.result;
            //             this.spinning = false;
            //         } else {
            //             console.log(res.message);
            //         }
            //     });
            // },
            changeTag(file) {
                this.loading = true;
                this.columns = [];
                this.fileObj = Object.assign({}, file);
                if (this.fileObj.tableFieldInfoList.length > 0) {
                    this.fileObj.tableFieldInfoList.forEach(field => {
                        let obj = {
                            title: field.fieldName,
                            align: 'center',
                            dataIndex: field.fieldCode
                        };
                        this.columns.push(obj);
                    });
                }
                let param = {
                    tableName: this.fileObj.tableCode,
                    start: 1,
                    limit: 10,
                    rptInsId: this.stationObj.rptInstId ? this.stationObj.rptInstId : '',
                    appendixId: file.appendixId
                };
                getTableDataList(param).then(res => {
                    if (res.success) {
                        this.dataSource = res.result.records;
                        this.ipagination.total = res.result.total;
                        this.loading = false;
                    } else {
                        console.log(res.message);
                    }
                });
                this.loading = false;
            },
            handleTableChange(pagination, filters, sorter) {
                this.ipagination = pagination;
            },
            showReportView() {
                this.mouldVisible = true;
            },
            showFlowImg() {
                this.$refs.flowModal.edit(this.imgUrl);
                this.$refs.flowModal.title = "工作流详情";
                this.$refs.flowModal.disableSubmit = true;
            },
            urge() {
                let param = {
                    taskName: this.taskObj.taskName,
                    fromUser: Vue.ls.get(USER_INFO).userName,
                    procInstId: this.procInstId
                };
                addTaskUrgentRecordInfo(param).then(res => {
                    if (res.success) {
                        this.$message.success('催办成功');
                    } else {
                        console.log(res.message);
                    }
                });
            },
            cancelReportView() {
                this.mouldVisible = false;
            },
            back() {
                this.$emit('back');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .makesystem {
        height:40px;
        border-bottom:1px solid #ccc;
        display:flex;
        align-items: center;
        span {
            flex-shrink:0;
            width:110px;
        }
        >div {
            width: 100%;
            display: flex;
            justify-content:space-between;
        }
    }
    .formRow {
        margin: 20px auto;
    }

    .ant-form-item {
        width: 100%;
    }

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
    .infoRow {
        text-align: center;
        margin-top: 20px;
    }

    .workflow {
        border: 1px solid #000000;
        height: 300px;
        margin-top: 20px;
    }

    >>> .term {
        padding-bottom: 50px !important;
    }
</style>