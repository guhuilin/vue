<template>
  <div style="height: 100%;font-size: 150%;">
    <a-form layout="inline" :form="form">
      <!-- 任务名称 父任务 -->
      <a-row :gutter="24" class="formRow">
        <a-col :md="12" :sm="8">
          <a-form-item label="任务名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input placeholder="请输入..." :disabled="disabled" v-decorator="['taskName']"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item label="父任务" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input-search
              placeholder="请选择..."
              size="large"
              :disabled="true"
              v-model="parentObj.taskName"
              @search="selectMould('task')"
            >
              <a-button slot="enterButton" :disabled="disabled">选择</a-button>
            </a-input-search>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 任务量 任务目标 -->
      <a-row :gutter="24" class="formRow">
        <a-col :md="12" :sm="8">
          <a-form-item label="任务量" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input-number
              :min="1"
              :disabled="disabled"
              style="width: 100%;"
              v-decorator="[ 'workload']"
            />
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
              <a-select-option
                v-for="(item,ind) in selectTaskDomain"
                :key="ind"
                :value="item.id"
              >{{item.domainName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item label="任务分类" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select :disabled="disabled" v-decorator="[ 'taskSource']">
              <a-select-option
                v-for="(item,ind) in selectTaskSource"
                :key="ind"
                :value="item.id"
              >{{item.typeName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 关联任务 任务类型 -->
      <a-row :gutter="24" class="formRow">
        <a-col :md="12" :sm="8">
          <a-form-item label="关联业务" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select :disabled="disabled" v-decorator="[ 'taskBusiness']">
              <a-select-option
                v-for="(item,ind) in selectTtaskBusiness"
                :key="ind"
                :value="item.id"
              >{{item.typeName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item label="任务类型" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select :disabled="disabled" v-decorator="[ 'taskType']">
              <a-select-option
                v-for="(item,ind) in taskTypeVal"
                :key="ind"
                :value="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="formRow">
        <a-col :md="24" :sm="8">
          <a-form-item label="是否周期任务" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }">
            <a-radio-group :disabled="disabled" v-model="isCycle">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 是 -->
      <a-row :gutter="24" class="formRow" v-if="isCycle == 1">
        <a-col :md="12" :sm="8">
          <a-form-item label="开始时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              :disabled="disabled"
              format="YYYY-MM-DD HH:mm:ss"
              :showTime="true"
              style="width: 100%;"
              v-decorator="[ 'startTime']"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item label="共：" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input-number :disabled="disabled" :min="1" v-decorator="[ 'taskPeriods']" />期
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item label="任务周期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input-number
              style="width:50%"
              :disabled="disabled"
              :min="1"
              v-decorator="[ 'interval']"
            />
            <a-select style="width:50%" :disabled="disabled" v-decorator="['intervalUnit']">
              <a-select-option
                v-for="(item,ind) in selectTaskPeriods"
                :key="ind"
                :value="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item label="下发时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <!-- <a-select style="width:50%" :disabled="disabled" v-decorator="['taskDownDate']">
              <a-select-option
                v-for="(item,ind) in selectTaskDownDate"
                :key="ind"
                :value="item.id"
              >{{item.name}}</a-select-option>
            </a-select> -->
            <a-time-picker :disabled="disabled" style="width:50%" v-decorator="[ 'taskDownTime']" />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 否 -->
      <a-row :gutter="24" class="formRow" v-else>
        <a-col :md="12" :sm="8">
          <a-form-item label="开始时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              format="YYYY-MM-DD HH:mm:ss"
              :showTime="true"
              :disabled="disabled"
              style="width: 100%;"
              v-decorator="[ 'startTime']"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item label="结束时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker
              format="YYYY-MM-DD HH:mm:ss"
              :showTime="true"
              :disabled="disabled"
              style="width: 100%;"
              v-decorator="[ 'endTime']"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="formRow">
        <a-col :md="24" :sm="8">
          <a-form-item label="任务模式" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
            <a-radio-group :disabled="disabled" v-decorator="['taskMode']">
              <a-radio
                v-for="(item,ind) in taskMode"
                :key="ind"
                :value="item.id"
              >{{item.actInstName}}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 总局下发台站任务 -->
      <a-row :gutter="24" class="formRow" v-if="taskModeId == 2">
        <a-col :md="24" :sm="8">
          <a-form-item label="台站" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
            <a-checkbox-group
              :disabled="disabled"
              v-decorator="[ 'stationIds',{initialValue:arr}]"
            >
              <a-checkbox
                class="checkItem"
                v-for="sta in stationList"
                :value="sta.id"
                :key="sta.id"
              >{{sta.orgCode}}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="formRow">
        <a-table
          ref="table"
          bordered
          size="middle"
          rowKey="id"
          :columns="ideaColumns"
          :dataSource="ideaDataSource"
          :pagination="false"
          :loading="loading"
        >
          <span slot="action" slot-scope="action, record">
          <a @click="view(record)" href="#">查看</a>
          </span>
        </a-table>
    </a-row>
    </a-form>
		<div class="back">
			<a-button slot="tabBarExtraContent" type="primary" @click="back">返回</a-button>
		</div>
  </div>
</template>

<script>
import moment from "moment";
import { hasPerm } from "@/utils/authFilter";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import {
  getTaskVariableByMap,
  getTaskModeInfoList,
  getActInstTypeInfoList,
  getAllReportBusinessInfoList,
  getAllReportDomainInfoList,
  getStationInfoList,
  querySubSystem
} from "@api/api";
  import store from '@/store'

const taskTypeVal = [
  { name: "常规任务", id: 0 },
  { name: "应急任务", id: 1 },
  { name: "专项任务", id: 2 }
]

const selectTaskPeriods = [
  { name: "天", id: 1 },
  { name: "周", id: 2 },
  { name: "月", id: 3 }
];
const selectTaskDownDate = [
  { name: "周一", id: 1 },
  { name: "周二", id: 2 },
  { name: "周三", id: 3 }
];

export default {
  name: "taskLook",
  props: ["taskObj"],
  mixins: [JeecgListMixin],
  data() {
    return {
      taskTypeVal,
      selectTaskPeriods,
      selectTaskDownDate,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      disabled: false,
      parentObj: {
        id: 0,
        taskName: "无父任务"
      },
      ideaColumns: [
        {
        title: "角色",
        align: "center",
        dataIndex: "role"
        },
        {
        title: "时间",
        align: "center",
        dataIndex: "timeNow"
        },
        {
        title: "处理意见",
        align: "center",
        dataIndex: "remark"
        }
      ],
      ideaDataSource: [],
      taskMode: [],
      taskModeId: null,
      form: this.$form.createForm(this),
      isCycle: 1,
      arr: [],
      stationList: [],
      selectTtaskBusiness: [],
      selectTaskDomain: [],
      selectTaskSource: [],
      url: {
        list: "",
      },
    };
  },
  created() {
    this.setFormValue();
    this.getData();
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
    setFormValue() {
      console.log(this.taskObj,'taskObj')
      if (this.taskObj.id) {
        this.disabled = true;
        this.$nextTick(() => {
          this.parentObj = {
            id: this.taskObj.parentId,
            taskName: this.taskObj.parentTaskName
          };
          if (this.taskObj.isCycle) {
            this.isCycle = Number(this.taskObj.isCycle);
          }
          if (this.taskObj.taskMode) {
            this.taskModeId = this.taskObj.taskMode;
					}
					if(this.taskObj.isCycle == 2) {
						this.form.setFieldsValue({
							endTime: moment(this.taskObj.endTime, 'yyyy-MM-dd hh:mm:ss')
						})
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
            // taskDownDate: this.getTaskDownDate(this.taskObj.intervalUnit,this.taskObj.taskDownDate),
            taskDownTime: moment(this.taskObj.taskDownTime, "hh:mm:ss"),
            taskId: this.taskObj.taskId,
            taskMode: Number(this.taskObj.taskMode),
            taskPeriods: this.taskObj.taskPeriods,
            taskSource: this.taskObj.taskSource,
            taskName: this.taskObj.taskName,
            startTime: moment(this.taskObj.startTime, 'YYYY-MM-DD hh:mm:ss'),
            workload: this.taskObj.workload,
            priority: this.taskObj.priority,
            taskId: this.taskObj.taskId,
            priority: this.taskObj.priority,
            taskType: this.taskObj.taskType ? this.taskObj.taskType == '0' ? '常规任务' : (this.taskObj.taskType == '1'? '应急任务': '专项任务') : "",
            stationIds: this.taskObj.stationIds.split(";").map(item => {
              return this.arr.push(parseInt(item));
            })
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
                console.log(unit,date,'valunit,date')
            },
    getData() {
      let obj = {
          processInstanceId: this.taskObj.procInstId,
          variableNameList: [
            'remark','timeNow','role'
          ]
      }
      getTaskVariableByMap(obj).then(res => { console.log(res,'res')
          if(res.success) {
              this.ideaDataSource = res.result
          }
      })
      querySubSystem().then(res => {
        if (res.success) {
          this.systemTask = res.result;
        }
      });
      getAllReportBusinessInfoList().then(res => {
        if (res.success) {
          this.selectTtaskBusiness = res.result;
        }
      });
      getAllReportDomainInfoList().then(res => {
        if (res.success) {
          this.selectTaskDomain = res.result;
        }
      });
      getActInstTypeInfoList().then(res => {
        if (res.success) {
          this.selectTaskSource = res.result;
        }
      });
      getTaskModeInfoList().then(res => {
        if (res.success) {
          this.taskMode = res.result;
        }
      });
      getStationInfoList({}).then(res => {
        if (res.success) {
          this.stationList = res.result;
        } else {
          console.log(res.message);
        }
      });
		},
		back() {
			this.$emit('back');
		}
  }
};
</script>

<style lang="scss" scoped>
.back {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16px;
}
.makesystem {
  height: 40px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  span {
    flex-shrink: 0;
    width: 110px;
  }
  > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
  height: 50%;
  margin-top: 20px;
}

>>> .term {
  padding-bottom: 50px !important;
}
</style>