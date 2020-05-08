<template>
  <a-modal
    :title="title"
    :visible="show"
    :maskClosable="false"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
  <a-spin :spinning="spinning">
    <div style="max-height:430px;overflow-y:auto">
      <!-- <a-form :form="form" @submit="inputSubmit" v-if="defaultId==2 || defaultId==3">
        <a-form-item label="节目基本信息" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入信息..." :disabled="disable" v-decorator="[ 'programInfo',{initialValue:lookVal}]"/>
        </a-form-item>
        <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入..." :disabled="disable" type='textarea' v-decorator="['description']" />
        </a-form-item>
        <a-form-item label="附件" placeholder="请选择..." :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select @change="selectChange" :disabled="disable" v-decorator="['selectVal',{initialValue:tabledesSource}]">
            <a-select-option v-for="item in list" :key="item.id" :value="item.id+'-'+item.code+'-'+item.typename" >
              {{item.typename}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-for="item in reportList" :key="item.fieldCode" :label="item.fieldName" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input ref="report" :disabled="disable" v-decorator="[item.fieldCode,{initialValue:''}]"/>
        </a-form-item>
      </a-form> -->
      <a-form  :form="form" @submit="inputSubmit">  
        <a-form-item label="是否违规" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-radio-group @change="onChange" v-model="radioVal">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入..." type='textarea' v-decorator="['description']" />
        </a-form-item>
      </a-form>
    </div>
  </a-spin>
  </a-modal>
</template>

<script>
import { 
  exceSelectByMapJudge,
  execInsertSqlJudge,
  updatequerySuspectProgramzero,
  queryJudgeList,
  FieldTypeList,
  querySuspectProgram, 
  queryReportBusiness, 
  updateSuspectProgram, 
  addauditVideoHis } from '@api/api'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'

export default {
  data() {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      reportList: [],
      lookVal: '',
      auditAdvice: '',
      userInfo: '',
      radioVal: '',
      tabledesid: '',
      tableName: '',
      tabledesSource: '',
      spinning: false,
      disable: false,
			list: [],
			form: this.$form.createForm(this),
			url: {
        list: '',
      }
		};
	},
	mixins:[JeecgListMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "处理"
    },
    item: {
      type: Object,
      default:{}
    },
    itemList: {
      type: String,
      default:''
    },
    defaultId: {
      default: "1",
      type: String
    },
    reportTemplateId: {
      default: 1,
      type: Number
    }
  },
  watch: {
    reportTemplateId(newVal) {},
    show(newVal) {
      // if(this.defaultId == '2') {
      //   this.getData()
      // }
      if(this.title == '查看') {
        this.disable = true;
        this.lookVal = this.item.name
        this.tabledesSource = this.item.tabledesSource
        let obj = {
          tableName: this.item.tabledesname,
          Id: this.item.tabledesid
        }
        this.spinning = true;
        exceSelectByMapJudge(obj).then(res => {
          if(res.success) {
            let obj1 = { id:this.item.tabledesid }
            queryJudgeList(obj1).then(res => { 
              if(res.success) { this.reportList = res.result }
            })
            this.spinning = false;
          }
        })
      } else {
        this.disable = false;
        this.lookVal = ''     
        this.auditAdvice = ''
        this.tabledesSource = ''
      }
    },
  },
  mounted () {
    this.userInfo = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName));
  },
  methods: {
		// getData() {
    //   FieldTypeList({reportId:this.reportTemplateId}).then(res => {      //  this.reportTemplateId
    //     this.list = res.result 
    //   })
		// },
    onChange() { },
    selectChange(code) {
      this.tabledesid = code.split('-')[0]
      this.tableName = code.split('-')[1]
      this.tabledesSource = code.split('-')[2]
      queryJudgeList({id:this.tabledesid}).then(res => {
        if(res.success) { this.reportList = res.result }
      })
    },
    handleSubmit(e) {
			e.preventDefault();
      this.form.validateFields((err, values) => {
        // // 新增附件数据
        // let xxx = {
        //   tableName:this.tableName,
        //   PRPORT_NAME: "张"
        // }
        // execInsertSqlJudge(xxx).then(res => { console.log(res,'新增附件数据') })
        // // 修改节目名称
        // updatequerySuspectProgramzero({name:values.programInfo}).then(res => { console.log(res,'修改节目名称') })

        values.selectVal = values.selectVal==='请选择' ? 0 : values.selectVal;
        let obj = {
          id: this.item.id,
          status: this.radioVal ? this.radioVal : 0
        }
        // 处理分层研判
        updateSuspectProgram(obj).then(res => {
          if(res.success) {
            this.$message.success('处理成功！')
            this.$emit("close", true);
          } else {
            this.$message.error('错误')
            this.$emit("close", true);
          }
          this.form.resetFields();
          this.reportList = []
        })
        let addObj = {
          auditAdvice: values.description,
          auditResult: this.radioVal,
          auditUser: this.userInfo,
          auditLevel: this.item.levele,
          dataId: this.item.id,
          tabledesSource: this.tabledesSource,
          tabledesid: this.tabledesid,
          tabledesname: this.tableName
        }
        // 新增节目处理历史
        addauditVideoHis(addObj).then(res => { 
          console.log(res,'新增节目处理历史') 
          this.radioVal = ''
        })
      });
    },
    handleCancel() {
      this.radioVal = ''
      this.form.resetFields();
      this.reportList = []
      this.$emit("close", '查看');
		},
		inputSubmit() {
			e.preventDefault();
      this.form.validateFields((err, values) => { });
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/.ant-modal-body {
  width:100%;
  height: 430px;
  padding:0;
}
</style>