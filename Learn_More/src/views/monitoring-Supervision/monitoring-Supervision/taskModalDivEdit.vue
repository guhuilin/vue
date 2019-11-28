<template>
    <div class="box">
        <a-spin :spinning="spinning">
            <a-row class="planTitle">编辑任务</a-row>

            <a-form layout="inline" :form="form">
                <!-- 任务名称 父任务 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input placeholder="请输入..." v-decorator="[ 'taskName', validatorRules.taskName]"></a-input>
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
                            <a-input-number placeholder="请输入..." :min="1" style="width: 100%;" v-decorator="[ 'workload']"/>
                        </a-form-item>
                    </a-col>

                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务目标" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input placeholder="请输入..." v-decorator="[ 'description']"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 任务编号 优先级 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务编号" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input placeholder="请输入..." v-decorator="[ 'taskId']"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="优先级" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select placeholder="请选择..." v-decorator="[ 'priority', validatorRules.priority]">
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
                            <a-select placeholder="请选择..." @change="selectTaskVal" v-decorator="[ 'taskDomain', validatorRules.taskDomain]">
                                <a-select-option v-for="(item,ind) in selectTaskDomain" :key="ind" :value="item.id">{{item.domainName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务分类" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select placeholder="请选择..." v-decorator="[ 'taskSource', validatorRules.taskSource]">
                                <a-select-option v-for="(item,ind) in selectTaskSource" :key="ind" :value="item.id">{{item.typeName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 关联任务 任务类型 -->
                <a-row :gutter="24" class="formRow">
                    <a-col :md="12" :sm="4">
                        <a-form-item label="关联业务" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select placeholder="请选择..." v-decorator="[ 'taskBusiness', validatorRules.taskBusiness]">
                                <a-select-option v-for="(item,ind) in selectTtaskBusiness" :key="ind" :value="item.id">{{item.typeName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select placeholder="请选择..." v-decorator="[ 'taskType']">
                                <a-select-option v-for="(item,ind) in taskTypes" :key="ind" :value="item.id">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="formRow">
                    <a-col :md="24" :sm="8">
                        <a-form-item label="是否周期任务" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
                            <a-radio-group @change="onChangeRadio" v-model="isCycle">
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
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style="width: 100%;"
                                    v-decorator="['startTime']"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="共：" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input-number placeholder="请输入..." :min="1" v-decorator="[ 'taskPeriods',isCycle == 1?validatorRules.taskPeriods:{}]" /> 期
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="任务周期" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-input-number placeholder="请输入..." style="width:50%" :min="1" v-decorator="[ 'interval']" />
                            <a-select placeholder="请选择..." style="width:50%" @change="onChangeSelectTaskPeriods" v-decorator="['intervalUnit']">
                                <a-select-option v-for="(item,ind) in selectTaskPeriods" :key="ind" :value="item.id">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="下发时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-select v-if="selectTaskDownDate && selectTaskDownDate.length > 0" style="width:50%" @change="onChangeSelectTaskDownDate" v-decorator="['taskDownDate']">
                                <a-select-option v-for="(item,ind) in selectTaskDownDate" :key="ind" :value="item.id">{{item.name}}</a-select-option>
                            </a-select>
                            <a-time-picker style="width:50%" v-decorator="[ 'taskDownTime']" @change="onChangeTaskDownTime" />
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
                                    style="width: 100%;"
                                    v-decorator="[ 'startTime', isCycle == 0?validatorRules.startTime:{}]"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item label="结束时间" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <a-date-picker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    :showTime="true"
                                    style="width: 100%;"
                                    v-decorator="[ 'endTime', isCycle == 0?validatorRules.endTime:{}]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" class="formRow">
                    <a-col :md="24" :sm="8">
                        <a-form-item label="任务模式" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
                            <a-radio-group @change="onChangeTask" v-decorator="['taskMode', validatorRules.taskMode]">
                                <a-radio v-for="(item,ind) in taskMode" :key="ind" :value="item.id">{{item.actInstName}}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!-- 总局下发台站任务 -->
                <a-row :gutter="24" class="formRow" v-if="actInstTaskType == 1">
                    <a-col :md="24" :sm="8">
                        <a-form-item label="台站" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
                            <a-checkbox-group v-decorator="[ 'stationIds',{initialValue:arr}]">
                                <a-checkbox class="checkItem" v-for="sta in stationList" :value="sta.id" :key="sta.id">
                                    {{sta.orgCode}}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>

            <div style="text-align: center;margin-top: 1%;">
                <a-button type="primary" @click="back(false)">取消</a-button>
                <a-button type="primary" :loading="loading" @click="commitTask" style="margin-left: 2%;">保存</a-button>
            </div>
        </a-spin>

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
    import reportView from '@/components/report/reportView'
    import { getTaskModeInfoList, getActInstTypeInfoList, getAllReportBusinessInfoList, getAllReportDomainInfoList, getStationInfoList, addTaskInfo, updateTaskInfo,querySubSystem } from '@api/api'
    import Vue from 'vue'
    import { pick } from 'lodash'
    import { USER_INFO } from "@/store/mutation-types"
    import moment from 'moment'
    import store from '@/store'

    const selectTaskPeriods = [{name:'天',id:1},{name:'周',id:2},{name:'月',id:3}]
    const taskTypes = [{name:'常规任务',id:0},{name:'应急任务',id:1},{name:'专项任务',id:2}]

    export default {
        name: 'taskModalDivEdit',
        props: ['taskObj'],
        components: {
            selectModal,
            reportView
        },
        data() {
            return {
                selectTaskPeriods,
                taskTypes,
                selectTaskDownDate: [],
                selectTtaskBusiness: [],
                selectTaskDomain: [],
                selectTaskSource: [],
                actInstTaskType: '',
                spinning: false,
                loading: false,
                disabled: false,
                labelCol: {span: 6},
                wrapperCol: {span: 15},
                workfolwTemplateId: '',
                stationList: [],
                systemTask: [],
                form: this.$form.createForm(this),
                isCycle: 1,
                taskMode: [],
                taskModeId: null,
                selectValue: '',
                arr: [],
                addSystem: [],
                validatorRules: {
                    taskName: {
                        rules: [{required: true, message: '请输入任务名称!'}]
                    },
                    taskBusiness: {
                        rules: [{required: true, message: '请选择关联业务!'}]
                    },
                    taskMode: {
                        rules: [{required: true, message: '请选择任务模式!'}]
                    },
                    taskSource: {
                        rules: [{required: true, message: '请选择任务分类!'}]
                    },
                    priority: {
                        rules: [{required: true, message: '请选择优先级!'}]
                    },
                    startTime: {
                        rules: [{required: true, message: '请选择开始时间!'}, {validator: this.validateStartTime}]
                    },
                    startTime1: {
                        rules: [{required: true, message: '请选择开始时间!'}]
                    },
                    endTime: {
                        rules: [{required: true, message: '请选择结束时间!'}, {validator: this.validateEndTime}]
                    },
                    taskPeriods: {
                        rules: [{required: true, message: '请选择期数!'}]
                    },
                    taskDomain: {
                        rules: [{required: true, message: '请选择所属领域!'}]
                    }
                },
                reportObj: {},
                systemObj: {},
                parentObj: {
                    id: 0,
                    taskName: '无父任务'
                },
                flowObj: {},
                visible: false,
                modalObj: {},
            }
        },
        created() {
            this.getStationInfoList();
            this.setFormValue();
            this.getData();
            this.getTaskBusiness();
        },
        methods: {
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
            setTaskBusiness(val) {
                this.selectTtaskBusiness.map(item => {
                    if(val === item.id) {
                        return item.id
                    }
                })
            },  
            selectTaskVal(val) {
                if(val) {
                    this.form.setFieldsValue({
                        taskBusiness: ''
                    })
                    store.dispatch('getReportBusiness',val).then(res => {
                        this.selectTtaskBusiness = res;
                    });
                }
            },
            onChangeRadio(val) {
                this.isCycle = val.target.value
            },
            onChangeTask(val) {
                let newVal = this.taskMode.filter(item => {
                    return item.id === val.target.value
                })
                this.taskModeId = newVal[0].id
                this.actInstTaskType = newVal[0].actInstTaskType
            },
            onChangeSelect(val) {
                this.selectValue = val
            },
            onChangeSelectTaskDownDate() {},
            onChangeSelectTaskPeriods(val) {
                if(val) {
                    this.form.setFieldsValue({
                        taskDownDate: ''
                    })
                }
                switch(val) {
                    case 1: {
                        this.selectTaskDownDate = []
                        break;
                    }
                    case 2: {
                        this.selectTaskDownDate = [
                            {name:'周一',id:1},{name:'周二',id:2},{name:'周三',id:3},
                            {name:'周四',id:4},{name:'周五',id:5},{name:'周六',id:6},
                            {name:'周日',id:7}
                        ]
                        break;
                    }
                    case 3: {
                        this.selectTaskDownDate = [
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
                        break;
                    }
                }
            },
            onChangeTaskDownTime(val) {
                // this.val = 
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
            },
            addSystems() {
                let len = this.addSystem.length + 1
                let systemWord = 'systemWord'+len
                let systemVal = 'systemVal'+len
                this.addSystem.push({
                    systemWord: '',
                    systemVal: '',
                    id: len -1 
                })
            },
            validateStartTime(rule, value, callback) {
                let obj = this.form.getFieldsValue(['endTime']);
                if (value && obj.endTime) {
                    if (value === moment.max(value, obj.endTime)) {
                        callback('开始时间不能大于结束时间');
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            validateEndTime(rule, value, callback) {
                let obj = this.form.getFieldsValue(['startTime']);
                if (value && obj.startTime) {
                    if (value === moment.min(value, obj.startTime)) {
                        callback('结束时间不能小于开始时间');
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            },
            setFormValue() {
                if (this.taskObj.id) {console.log(this.taskObj,'objpobjobj')
                    this.$nextTick(() => {
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
                        if(typeof this.taskObj.isCycle === 'number' && !isNaN(this.taskObj.isCycle)) {
                            this.isCycle = Number(this.taskObj.isCycle)
                        }
                        if(this.taskObj.actInstTaskType) {
                            this.actInstTaskType = this.taskObj.actInstTaskType
                        }
                        if(this.taskObj.taskMode) {
                            this.taskModeId = Number(this.taskObj.taskMode)
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
                            taskBusiness: this.getTaskBusiness(this.taskObj.taskDomain),
                            taskDomain: this.taskObj.taskDomain,
                            taskDownTime: this.taskObj.taskDownTime && moment(this.taskObj.taskDownTime, 'hh:mm:ss'),
                            taskId: this.taskObj.taskId,
                            taskMode: Number(this.taskObj.taskMode),
                            taskPeriods: this.taskObj.taskPeriods,
                            taskSource: this.taskObj.taskSource,
                            taskName: this.taskObj.taskName,
                            endTime: moment(this.taskObj.endTime, 'YYYY-MM-DD hh:mm:ss'),
                            startTime: moment(this.taskObj.startTime, 'YYYY-MM-DD hh:mm:ss'),
                            workload: this.taskObj.workload,
                            priority: this.taskObj.priority,
                            taskId: this.taskObj.taskId,
                            priority: this.taskObj.priority,
                            taskType: this.taskObj.taskType, // 
                            stationIds: this.taskObj.stationIds && this.taskObj.stationIds.split(';').map(item => {
                                return this.arr.push(parseInt(item));
                            }),
                        });
                    });
                }
            },
            getTaskDownDate(unit,date) {
                switch(unit) {
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
            getStationInfoList() {
                this.spinning = true;
                getStationInfoList({}).then(res => {
                    if (res.success) {
                        this.stationList = res.result;
                        this.spinning = false;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            back(flag) {
                this.$emit('back', flag);
            },
            selectMould(str) {
                let query = {};
                switch (str) {
                    case 'system': {
                        this.modalObj = {
                            urlPath: '/nmmonitor-server-module-database/datebase/querySubSystempage',
                            searchForm: [{
                                label: '名称',
                                type: 'input',
                                query: 'systemName'
                            }],
                            type: str,
                            title: '配置子系统任务',
                            defaultId: this.systemObj.id ? [this.systemObj.id] : []
                        }
                        break;
                    }
                    case 'report': {
                        this.modalObj = {
                            urlPath: '/nmmonitor-server-module-taskScheduling/taskScheduling/queryReportTableInfoList',
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
                        break;
                    }
                    case 'task': {
                        this.modalObj = {
                            urlPath: '/nmmonitor-server-module-taskScheduling/taskScheduling/queryTaskInfoList',
                            searchForm: [
                                {
                                    label: '名称',
                                    type: 'input',
                                    query: 'taskName'
                                }
                            ],
                            type: str,
                            title: '选择父任务',
                            defaultId: this.parentObj.id ? [this.parentObj.id] : []
                        };
                        break;
                    }
                    case 'flow': {
                        this.modalObj = {
                            urlPath: '/nmmonitor-server-module-taskScheduling/taskScheduling/queryDeployedProcessInfoList',
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
                        query = {workflowType: '1'};
                        break;
                    }
                }
                this.$refs.selectModal.show();
            },
            slctModal(arr) {
                switch (this.modalObj.type) {
                    case 'system': {
                        this.systemObj = {
                            id: arr[0].id,
                            name: arr[0].systemName,
                            serverUrl: arr[0].serverUrl
                        }
                    }
                    case 'report': {
                        this.reportObj = {
                            reportName: arr[0].reportName,
                            id: arr[0].id
                        };
                        break;
                    }
                    case 'task': {
                        this.parentObj = {
                            taskName: arr[0].taskName,
                            id: arr[0].id
                        };
                        break;
                    }
                    case 'flow': {
                        this.flowObj = {
                            id: arr[0].id,
                            name: arr[0].name,
                            key: arr[0].key
                        };
                        break;
                    }
                }
            },
            showReportView() {
                this.visible = true;
            },
            cancelReportView() {
                this.visible = false;
            },
            // 保存
            commitTask() { 
                this.loading = true;
                this.taskMode.map(item => {
                    if(this.taskModeId && this.taskModeId == item.id) {
                        this.workfolwTemplateId = item.actReProcdefKey
                    }
                })
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let param = Object.assign({}, values);
                        if(this.isCycle == 0) {
                            param.startTime = moment(param.startTime).format('YYYY-MM-DD HH:mm:ss');
                            param.endTime = moment(param.endTime).format('YYYY-MM-DD HH:mm:ss');
                        }
                        if(this.isCycle == 1) {
                            param.startTime = moment(param.startTime).format('YYYY-MM-DD HH:mm:ss');
                            param.endTime = null;
                        }
                        param.taskBusiness = typeof(values.taskBusiness) == 'number' ? values.taskBusiness : this.setTaskBusiness(values.taskBusiness);
                        param.taskStatus = 'E';
                        param.parentId = this.parentObj.id;
                        param.createBy = Vue.ls.get(USER_INFO).userName;
                        param.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                        param.updateBy = Vue.ls.get(USER_INFO).userName;    //xo
                        param.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');   //xc
                        param.stationIds = typeof(param.stationIds) !== 'undefined' ? param.stationIds.join(';') : undefined
                        param.runningStatus = '1';  // 默认运行
                        param.isCycle = this.isCycle;
                        param.taskMode = this.taskModeId;
                        param.workfolwTemplateId = this.workfolwTemplateId;
                        param.taskDownTime = moment(param.taskDownTime).format('HH:mm:ss');
                        console.log(param,'param')
                        if (this.taskObj.id) {
                            param.id = this.taskObj.id;
                            updateTaskInfo(param).then(res => {
                                if (res.success) {
                                    this.loading = false;
                                    this.$message.success('修改成功！');
                                    this.back(true);
                                } else {
                                    console.log(res.message);
                                }
                            });
                        }
                    } else {
                        this.loading = false;
                    }
                });
            },
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
</style>