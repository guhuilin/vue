<template>
  <div v-if="show">
    <a-form :form="form">
      <a-form-item label="名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 13 }">
        <a-input
          v-decorator="['actInstName',{initialValue:itemList?itemList.actInstName:'请输入名称',rules: [{ required: true, message: '请输入名称!' }]}]"
        />
      </a-form-item>
      <a-form-item label="选择工作流" :label-col="{ span: 3 }" :wrapper-col="{ span: 13 }">
        <a-input-search placeholder="请选择..." size="large" v-model="flowObj.actReProcdefName" disabled @search="selectMould">
          <a-button slot="enterButton">选择</a-button>
        </a-input-search>
      </a-form-item>
      <a-form-item label="选择工作流" :label-col="{ span: 3 }" :wrapper-col="{ span: 13 }">
        <a-select placeholder="请选择..." v-decorator="[ 'actInstTaskType', {initialValue:itemList?itemList.actInstTaskType:'请输入名称',}]">
          <a-select-option :value="0">总局内部下发任务</a-select-option>
          <a-select-option :value="1">总局下发台站任务</a-select-option>
          <a-select-option :value="2">台站自建任务</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <div style="text-align: center;margin-top: 10px;">
      <a-button type="primary" @click="back">取消</a-button>
      <a-button type="primary" @click="save" style="margin-left: 8px;">保存</a-button>
    </div>
    <selectModal :modalObj="modalObj" ref="selectModal" @slctModal="slctModal"></selectModal>
  </div>
</template>

<script>
import {
  queryReportBusiness,
  updateSuspectProgram,
  updateCustomActProcInstInfo,
  addCustomActProcInst
} from "@api/api";
import selectModal from "@/components/selectModal/selectModal";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import Vue from "vue";

export default {
  data() {
    return {
      queryParam: {},
      flowObj: {},
      modalObj: {},
      form: this.$form.createForm(this),
      list: [],
      url: {
        list: "/nmmonitor-server-module-database/datebase/querySuspectProgram"
      }
    };
  },
  mixins: [JeecgListMixin],
  components: { selectModal },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "处理"
    },
    itemList: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    itemList(newVal) {
      if(newVal) {
        this.flowObj.actReProcdefName = newVal.actReProcdefName
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    selectMould() {
      this.modalObj = {
        urlPath:
          "/nmmonitor-server-moduls-monitor/feign/queryDeployedProcessInfoList",
        searchForm: [
          {
            label: "名称",
            type: "input",
            query: "reportName"
          }
        ],
        type: "flow",
        title: "选择工作流",
        defaultId: []
      };
      this.queryParam = { workflowType: "1" };
      this.$refs.selectModal.show(this.queryParam);
    },
    slctModal(arr) {
      this.flowObj = {
        actReProcdefName: arr[0].name,
        actReProcdefKey: arr[0].key,
        actUserInfoId: arr[0].actUserInfoId
      }
    },
    checkFlow() {},
    getData() {
      queryReportBusiness().then(res => {
        this.list = res.result;
      });
    },
    back() {
      this.$emit("close", false);
    },
    save() {
      this.form.validateFields((err, values) => {
        if(!err) {
          let obj = Object.assign(values,this.flowObj)
          if(!this.itemList.id) {
            addCustomActProcInst(obj).then(res => {
              if(res.success) {
                this.$emit("close", false);
              }
            })
          } else {
            obj.id = this.itemList.id
            updateCustomActProcInstInfo(obj).then(res => {
              if(res.success) {
                this.$emit("close", false);
              }
            })
          }
          
        }
      });
    }
  }
};
</script>
