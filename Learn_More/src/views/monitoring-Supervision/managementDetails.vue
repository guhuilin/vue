<template>
    <!-- 监听监看管理页面中的详情页面 -->
    <div>
        <globalheader>
            <div class="details">
                <div>
                </div>
                <div class="completed-unfinished" style="position:relative">
                    <!-- <a-button>未完成</a-button>
                    <a-button>已完成</a-button>-->
                    <a-tabs defaultActiveKey="2" @change="callback">
                        <a-tab-pane tab="未完成" key="2"></a-tab-pane>
                        <a-tab-pane tab="已完成" key="1"></a-tab-pane>
                        <!-- <a-tab-pane tab="返回"></a-tab-pane> -->
                        
                    </a-tabs>
                    <a-button type="primary" @click="backToPrevious" style="position: absolute;right: 60px;top: 0px;margin-right:40px">返回</a-button>
                </div>
                <ReportComponent :completedUnfinished="completedUnfinished" ref="search">
                  <!-- 报告搜索的功能 -->
                </ReportComponent>
                <div class="addReport">
                    <!-- <a-button type="primary" @click="showModal">+ 添加报告</a-button> -->
                    <a-modal
                        title="添加报告"
                        :centered="true"
                        :visible="addVisible"
                        @cancel="handleCancel"
                        :footer="null"
                        :maskClosable="false"
                        :closable="false"
                    >
                        <div class="addReportBtn">
                            <div>
                                <span>报告名称：</span>
                                <a-input style="width:130px" v-model="inputReportName" placeholder="请输入报告名称" />
                                <span v-if="reportNameShow" class="show-color">*请输入报告名称</span>
                                <span class="show-color" v-if="nameLoog">*输入的名称过长，请输入10个字符以内</span>
                            </div>
                            <selectTemplate @clickIndex="clickIndex">
                              <!-- 选择模板组件 -->
                            </selectTemplate>
                            <TemplatePreview @showColor="showColor" ref="showPemplatePreview">
                              <!-- 模板预览 -->
                            </TemplatePreview>
                            <span
                                v-if="templateShow"
                                class="show-color"
                                style="position: absolute;left: 212px;top: 146px;"
                            >*请选择模板</span>
                            <div>
                                <workflowselect
                                    @selectedWorkflowDataNameShowClick="selectedWorkflowDataNameShowClick"
                                    @workflowSelectedValue="workflowSelectedValue"
                                >
                                  <!-- 工作流 -->
                                </workflowselect>
                                <span
                                    class="selected-workflow-name"
                                    v-if="selectedWorkflowDataNameShow"
                                >工作流的名称：{{selectedWorkflowDataName}}</span>
                                <span class="show-color" v-if="showWorkflow">*请选择工作流</span>
                            </div>
                            <div>
                                <span>开始日期：</span>
                                <a-date-picker v-model="clearStartOnChangeValue.startTime" @change="startOnChange" />
                                <span v-if="showStartOnChangeValue" class="show-color">*请选择开始日期</span>
                            </div>
                            <div v-if="StartBigEnd" class="show-color">
                                *开始时间不可以大于结束时间
                            </div>
                            <div>
                                <span>截至日期：</span>
                                <a-date-picker v-model="clearUpOnChangeValue.startTime" @change="upOnChange" />
                                <span v-if="showUpOnChangeValue" class="show-color">*请选择截止日期</span>
                            </div>
                            <div>
                                <span>期数： &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
                                <a-input style="width:130px" v-model="numberPeriods" placeholder="请输入期数" />
                                <span v-if="showNumberPeriods" class="show-color">请选择期数</span>
                            </div>
                            <span class="show-color" v-if="showTotalNumberPeriodsBig">总期数不可以比期数小或相等</span>
                            <div>
                                <span>总期数： &nbsp&nbsp&nbsp</span>
                                <a-input style="width:130px" v-model="totalNumberPeriods" placeholder="请输入总期数" />
                                <span v-if="showTotalNumberPeriods" class="show-color">请选择总期数</span>
                            </div>
                            <div class="button">
                                <a-button style="margin: 0 50px 0 130px;" @click="addHandleCancel">取消</a-button>
                                <a-button type="primary" @click="addHandleOk">确定</a-button>
                            </div>
                        </div>
                    </a-modal>
                    <div>
                        <a-spin :spinning="loading">
                            <a-table
                                :columns="columns"
                                :bordered="true"
                                :dataSource="report"
                                :pagination="false"
                                class="tab"
                                :scroll="{ x: 1615, y: 500 }"
                            >
                                <a slot="action" slot-scope="text,textCheck" href="javascript:;">
                                    <a-button class="report-list-btn" icon="copy" @click="goDetails(textCheck)">详情</a-button>

                                    <a-divider type="vertical" />

                                    <a-dropdown>
                                        <a-menu slot="overlay">
                                            <a-menu-item
                                                @click="showModalEdit(textCheck,text)"
                                                v-if="text.source === '自建' ? true : false"
                                            >
                                                <a-icon type="edit" />编辑
                                            </a-menu-item>
                                            <a-menu-item @click="deleteReportBtn(text)" v-if="hasPerm('delete')">
                                                <a-icon type="delete" />删除
                                            </a-menu-item>
                                            <a-menu-item @click="handleExportXls(text)">
                                                <a-icon />导出数据
                                            </a-menu-item>
                                            <a-menu-item @click="submitReportBtn(text)" class="report-list-btn">
                                                <a-icon />提交
                                            </a-menu-item>
                                            <a-menu-item @click="auditReportBtn(textCheck)" class="report-list-btn">
                                                <a-icon />审核
                                            </a-menu-item>
                                        </a-menu>
                                        <a-button style="margin-left: 8px">
                                            更多
                                            <a-icon type="down" />
                                        </a-button>
                                    </a-dropdown>
                                </a>
                            </a-table>
                        </a-spin>
                        <div style="display:inline;">
                            <a-modal
                                :centered="true"
                                title="编辑"
                                :visible="visible"
                                @ok="editHandleOk"
                                @cancel="editHandleCancel"
                                :maskClosable="false"
                            >
                                <div class="edit">
                                    <div>
                                        <span>报告名称:</span>
                                        <a-input v-model="editReportName" />
                                    </div>
                                    <div>
                                        <span>报告类型:</span>
                                        <a-input v-model="editReportType" />
                                    </div>
                                    <div>
                                        <span>所属领域:</span>
                                        <a-input v-model="editRepottField" />
                                    </div>
                                    <div>
                                        <span>报告业务:</span>
                                        <a-input v-model="editReportingBusiness" />
                                    </div>
                                    <div>
                                        <span>开始时间:</span>
                                        <a-input v-model="editStartingTime" />
                                    </div>
                                    <div>
                                        <span>结束时间:</span>
                                        <a-input v-model="editReportEndTime" />
                                    </div>
                                    <div>
                                        <span>期&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp数:</span>
                                        <a-input v-model="editNumberPeriods" />
                                    </div>
                                    <div>
                                        <span>审核状态:</span>
                                        <a-input />
                                    </div>
                                </div>
                            </a-modal>
                        </div>

                      <!-- 审核中的弹出层 -->
                        <div>
                            <!-- auditReport -->
                            <a-modal
                                title="审核"
                                :visible="auditReportVisible"
                                :confirmLoading="auditReportConfirmLoading"
                                :footer="null"
                                :width="600"
                                :closable="false"
                            >
                                <!-- 状态备注区 -->
                                <div class="audit-report-status-remark-area">
                                    <div class="audit-report-status">
                                        <span>状态：</span>
                                        <div style="display: inline-block;margin-bottom:15px">
                                            <a-select
                                                style="width: 120px"
                                                @change="auditReportSelectStatus"
                                                v-model="defaultValue"
                                            >
                                                <a-select-option value="true">通过</a-select-option>
                                                <a-select-option value="false">不通过</a-select-option>
                                                <!-- <a-select-option value="Yiminghe">yiminghe</a-select-option> -->
                                            </a-select>
                                        </div>
                                        <span v-if="auditReportSelectStatusPrompt" class="audit-report-prompt">
                                            *请选择状态
                                        </span>
                                    </div>
                                    <div class="audit-report-remark">
                                        <span>备注：</span>
                                        <div style="display:inline-block;">
                                            <a-input
                                                style="width:200px;"
                                                placeholder="请输入备注"
                                                v-model="auditReportRemark"
                                            />
                                        </div>
                                        <span v-if="auditReportRemarksPrompt" class="audit-report-prompt">
                                            *请输入备注
                                        </span>
                                    </div>
                                </div>
                                <!-- 按钮区 -->
                                <div style="margin-left:208px;margin-top:15px;">
                                  <a-button style="margin-right:5px;" @click="auditReportCancel">取消</a-button>
                                  <a-button type="primary" @click="auditReportOk">确定</a-button>
                                </div>
                            </a-modal>
                        </div>


                        <div id="components-pagination-demo-mini">
                            <a-pagination
                                :current="current"
                                size="small"
                                :defaultPageSize="5"
                                :defaultCurrent="pageNo"
                                :total="pageSum"
                                :pageSizeOptions="a"
                                showSizeChanger
                                showQuickJumper
                                @showSizeChange="onShowSizeChange"
                                @change="pageChange"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </globalheader>
    </div>
</template>


<script>
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: 100,
      fixed: "left"
    },
    {
      title: "报告名称",
      dataIndex: "reportName",
      width: 115
      // width: 150
    },

    {
      title: "所属领域",
      dataIndex: "domainTypeName",
      width: 115
    },
    {
      title: "业务报告",
      dataIndex: "businessTypeName",
      width: 115
    },
    {
      title: "报告类型",
      dataIndex: "reportTypeName",
      width: 115
    },
    {
      title: "台站",
      dataIndex: "stationCode",
      width: 115
    },
    {
      title: "开始时间",
      dataIndex: "reportStartTime",
      width: 115
    },
    {
      title: "结束时间",
      dataIndex: "reportEndTime",
      width: 115
    },
    {
      title: "期数",
      dataIndex: "reportPeriods",
      width: 115
    },
    {
      title: "总期数",
      dataIndex: "reportTotalCount",
      width: 115
    },
    {
      title: "审核状态",
      dataIndex: "",
      width: 115
    },
    {
      title : "下发",
      width:115,
      dataIndex : "source"
    },
    {
      title: "操作  ",
      fixed: "right",
      width: 290,
      scopedSlots: { customRender: "action" }
    }
  ];
  import { hasPerm } from "@/utils/authFilter";
  import bus from "./bus/bus.js";
  import {
    addReportInfo,
    queryFindUpReport,
    updateReportInfo,
    deleteReport,
    selectReportInstanceSeqID,
    claimAndCompleteTaskToUserNameByProInstId
  } from "@/api/api.js";
  // import addReportList from "./monitoring-Supervision/Add-report-list.vue"; //添加报告列表
  import selectTemplate from "./monitoring-Supervision/Select-template.vue"; //选择模板
  import TemplatePreview from "./monitoring-Supervision/Template-preview.vue"; //模板预览
  import globalheader from "@/components/page/GlobalLayout.vue"; //引入全局的html
  import DetailsBreadCrumbs from "./monitoring-Supervision/Details-bread-crumbs.vue"; //面包屑组件
  import ReportComponent from "./monitoring-Supervision/Report-component.vue"; //报告搜索的功能
  import workflowselect from "./monitoring-Supervision/workflowselect.vue";
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  export default {
    name: "managementDetails",
    mixins : [JeecgListMixin],
    data() {
      return {
        current: 1,
        addVisible: false,
        // confirmLoading: false,//确定按钮的loading
        inputReportName: "",
        // reportType: null,
        // reportField: null,
        // reportingBusiness: null,
        // reportStatus: null,
        // boxReportType: [], //调取报告类型返回的数据
        // boxReportField: [], //调取所属领域返回的数据
        // boxReportingBusiness: [], //调取报告业务返回的数据
        // boxReportStatus: [], //调取状态返回的数据
         selectedRowKeys: [],
        data: null,
        reportName: "",
        // deadline: null,
        reportNameShow: false,
        templateShow: false,
        templateShowValue: "",
        dataShow: false,
        nameLoog: false,
        clickInde: 0,
        addReportVisible: false,
        showTotalNumberPeriodsBig: false, //期数比总期数大时的提示
        // confirmLoading: false,
        columns,
        report: [],
        pageNo: 1, //当前页
        pageSum: 1, //总页数
        pageSize: 5,
        a: ["5", "10", "20", "30"],
        loading: true,
        ModalText: "Content of the modal",
        visible: false,
        // confirmLoading: false,
        // 对某一条报告进行修改
        editReportName: "", //报告名称
        editReportType: "", //报告类型
        editRepottField: "", //报告所属领域
        editReportingBusiness: "", //报告业务
        editStartingTime: "", //开始时间
        editReportEndTime: "", //结束时间
        editNumberPeriods: "", //期数
        editReportTotalCount: "", //总期数
        editId: "", //id
        // 期数和总期数
        numberPeriods: "",
        totalNumberPeriods: "",
        showNumberPeriods: false,
        showTotalNumberPeriods: false,
        // 开始日期和截至日期
        startOnChangeValue: null,
        upOnChangeValue: null,
        // 开始日期和截至日期的提示（如果开始日期和结束日期为null的时候的提示）
        showStartOnChangeValue: false,
        showUpOnChangeValue: false,
        // 用于清除对开始日期和结束日期里面的数据
        clearStartOnChangeValue: {},
        clearUpOnChangeValue: {},
        // 接收子组件传过来的key和ID
        workflowSelectedValueID: "",
        workflowSelectedValueKey: "",
        length: "",
        // 未选择工作流时的提示
        showWorkflow: false,
        // 单选按钮传递过来的name值
        selectedWorkflowDataName: "",
        // 单选按钮传递过来的name值的显示与隐藏
        selectedWorkflowDataNameShow: false,
        // 已完成未完成
        completedUnfinished: 2,

        // 以下是审核中的数据
        auditReportVisible: false, //控制审核报告显示和隐藏
        auditReportConfirmLoading: false,
        auditReportRemark: "", //审核中的备注的输入框

        // 获取添加报告的ID
        getaddReportID : "",

        // 选中的审核状态
        selectedReviewStatus : "",

        //
        defaultValue : "--请选择--",

        // 在审核中，如果未选择其中一项的提示信息；
        auditReportSelectStatusPrompt : false,
        auditReportRemarksPrompt : false,

        // 开始时间大于结束时间的提示
        StartBigEnd : false,
        // 审核报告的ID
        auditReportId : null,
        url : {
          exportXlsUrl : '/nmmonitor-server-moduls-monitor/monitor/poiExcelByMap'
        },
      };
    },
    // 组件
    components: {
      globalheader,
      DetailsBreadCrumbs,
      ReportComponent,
      // addReportList,
      selectTemplate,
      TemplatePreview,
      workflowselect
      // AddReportBtn
    },
    methods: {
      backToPrevious(){
        this.$router.push({
          path : "/monitoring-Supervision/monitor-Management",
        })
      },
      hasPerm,
      // 提交报告事件
      submitReportBtn(value){
          // console.log(value.id);
          claimAndCompleteTaskToUserNameByProInstId({
              reportId : value.id,
          }).then((res)=>{
            if(res.success === true){
                this.$message.info(res.message,10)
            }else if(res.success === false){
                 this.$message.error(res.message,10);
            }
            
            this.$refs.search.getListReports();
              console.log(res)
          })
      },

      judgingTheStartDate(startDate,endDate){
          let oStartDate = new Date(startDate);
          let oEndDate = new Date(endDate);
          if(oStartDate.getTime() > oEndDate.getTime()){
              // console.log("第一个大");
              this.StartBigEnd = true;
          }else{
              // console.log("第二个大");
              this.StartBigEnd = false;
          }
      },
      // 报告审核的事件
      auditReportBtn(value) {
        // console.log(value, "审核");
        this.auditReportId = value.id
        this.auditReportVisible = true;
      },

      selectedWorkflowDataNameShowClick(value) {
        this.selectedWorkflowDataNameShow = value;
      },
      // 子组件传递过来值的事件
      workflowSelectedValue(value) {
        this.workflowSelectedValueID = value[0].id;
        this.workflowSelectedValueKey = value[0].key;
        this.selectedWorkflowDataName = value[0].name;
        // console.log(value, "我是传过来的单选数据");
      },
      // 已完成，未完成的切换功能
      callback(key) {
        this.completedUnfinished = key;
        let that = this;
        setTimeout(function() {
          that.$refs.search.pageNo = 1;
          that.$refs.search.getListReports();
          // console.log(that.$refs.search)
        }, 1);
        // console.log(key, "123456789");
      },
      // 开始日期
      startOnChange(data, dateString) {
        this.startOnChangeValue = dateString;
        // console.log(dateString, "开始日期");
      },
      // 截至日期
      upOnChange(data, dateString) {
        this.upOnChangeValue = dateString;
        // console.log(dateString,"结束日期")
      },

      changeStatus() {
        if (a.length < 1) {
          showPrise = true;
        }
      },
      // 添加报告
      addReport() {
          // 获取报告的ID
          selectReportInstanceSeqID({}).then((res)=>{
              // console.log(res,"获取报告的ID")
              this.getaddReportID = res.result
              addReportInfo({
                reportName: this.inputReportName,
                reportStartTime: this.startOnChangeValue + " 00:00:00", //开始时间
                reportEndTime: this.upOnChangeValue + " 23:59:59", //截至时间
                reportTableId: this.data[0].id,
                reportPeriods: this.numberPeriods, //期数
                reportTotalCount: this.totalNumberPeriods, //总期数
                source: 2,
                workflowId: this.workflowSelectedValueID,
                workflowKey: this.workflowSelectedValueKey,
                id : this.getaddReportID,
          }).then(res => {
              console.log(res, "执行了吗？？？？");
              this.$refs.search.getListReports();
              this.addVisible = false;
              this.clearStartOnChangeValue = {}; //清除开始日期的数据
              this.clearUpOnChangeValue = {}; //清除结束日期的数据
              this.inputReportName = ""; //清除报告名称
              this.numberPeriods = ""; //清除期数
              this.totalNumberPeriods = ""; //清除总期数
              this.selectedWorkflowDataNameShow = false;
              this.addVisible = false;
              this.$refs.showPemplatePreview.showAndHide = false;
              if (res.success) {
              } else {
                console.log(res.message);
              }
          });
          })
          
        // console.log(this.workflowSelectedValueKey,this.workflowSelectedValueID,this.data[0].id, this.inputReportName,this.startOnChangeValue + " 00:00:00",this.upOnChangeValue + " 23:59:59","哈哈哈哈哈哈");
        // console.log( this.reportName,this.deadline[0],this.deadline[1])
        // addReportInfo({
        //   reportName: this.inputReportName,
        //   reportStartTime: this.startOnChangeValue + " 00:00:00", //开始时间
        //   reportEndTime: this.upOnChangeValue + " 23:59:59", //截至时间
        //   reportTableId: this.data[0].id,
        //   reportPeriods: this.numberPeriods, //期数
        //   reportTotalCount: this.totalNumberPeriods, //总期数
        //   source: 2,
        //   workflowId: this.workflowSelectedValueID,
        //   workflowKey: this.workflowSelectedValueKey
        // }).then(res => {
        //   console.log(res, "执行了吗？？？？");
        //   this.$refs.search.getListReports();
        //   this.addVisible = false;
        //   if (res.success) {
        //   } else {
        //     console.log(res.message);
        //   }
        // });
      },
      showModal() {
        // 点击添加报告按钮的事件
        this.addVisible = true;
      },
      // onChange(date, dateString) {
      //   this.deadline = dateString;
      //   console.log(this.deadline, "88999");
      // },
      // 确定按钮
      addHandleOk(e) {
        // this.data6(this.startOnChangeValue,this.upOnChangeValue);
          this.judgingTheStartDate(this.startOnChangeValue,this.upOnChangeValue)
        // console.log(
        //   this.$refs.showPemplatePreview.showAndHide,
        //   "我是refs222222222"
        // );
        // console.log(this.$refs.search.pageNo,"日期")
        // console.log(this.startOnChangeValue)
        if(this.$refs.search.pageNo === 0){
            this.$refs.search.pageNo ++;
            // alert("我执行了")
        }
        // console.log(this.startOnChangeValue,this.upOnChangeValue,"日期")
        if (this.selectedWorkflowDataNameShow === false) {
          this.showWorkflow = true;
        } else {
          this.showWorkflow = false;
        }
        // 对总期数进行判断
        if (this.totalNumberPeriods === "") {
          this.showTotalNumberPeriods = true;
        } else {
          this.showTotalNumberPeriods = false;
        }
        // 对期数的判断
        if (this.numberPeriods === "") {
          this.showNumberPeriods = true;
        } else {
          this.showNumberPeriods = false;
        }
        // 如果期数和总期数相等并且期数和总期数的提示都为false的时候再次判断期数和总期数是否相等
        if (
          this.totalNumberPeriods < this.numberPeriods ||
          this.totalNumberPeriods === this.numberPeriods
        ) {
          // alert("总期数不可以比期数小")
          if (
            this.showNumberPeriods === false &&
            this.showTotalNumberPeriods === false
          ) {
            this.showTotalNumberPeriodsBig = true;
          }
        } else {
          this.showTotalNumberPeriodsBig = false;
        }
        // 下面的两个if条件是对日期进行判断
        if (this.startOnChangeValue === null || this.startOnChangeValue === "") {
          this.showStartOnChangeValue = true;
        } else {
          this.showStartOnChangeValue = false;
        }
        if (this.upOnChangeValue === null || this.upOnChangeValue === "") {
          this.showUpOnChangeValue = true;
        } else {
          this.showUpOnChangeValue = false;
        }
        // console.log(this.$refs.search.getListReports, "我是啥啊？？");
        // console.log(this.reportName.length,"我是长度")
        if (this.clickInde === 0) {
          this.templateShow = true;
        } else {
          this.templateShow = false;
        }
        // if (this.deadline === undefined) {
        //   // alert("我是undefined")
        //   this.dataShow = true;
        // } else {
        //   this.dataShow = false;
        //   // alert("我不是undefined")
        // }
        // console.log(this.deadline[0].length,"我是按钮")
        if (this.inputReportName === "") {
          this.reportNameShow = true;
        } else if (this.inputReportName.length > 10) {
          this.nameLoog = true;
        } else if (
          this.inputReportName.length < 10 ||
          this.inputReportName !== ""
        ) {
          this.nameLoog = false;
          this.reportNameShow = false;
        } else if (this.templateShow == false) {
          this.templateShow = true;
        } else if (this.templateShowValue === false) {
          this.templateShow = true;
        } else {
          this.templateShow = false;
        }
        if (
          this.templateShow === false &&
          this.showStartOnChangeValue === false && //开始日期的提示为false
          this.showUpOnChangeValue === false && //结束日期的提示为falsex
          this.reportNameShow === false &&
          this.nameLoog === false &&
          this.showNumberPeriods === false &&
          this.showTotalNumberPeriods === false &&
          this.showTotalNumberPeriodsBig === false &&
          this.showWorkflow === false &&
          this.StartBigEnd === false
        ) {
          this.addReport();
          // this.$refs.search.getListReports()
          // console.log("我执行了");
          // this.clearStartOnChangeValue = {}; //清除开始日期的数据
          // this.clearUpOnChangeValue = {}; //清除结束日期的数据
          // this.inputReportName = ""; //清除报告名称
          // this.numberPeriods = ""; //清除期数
          // this.totalNumberPeriods = ""; //清除总期数
          // this.selectedWorkflowDataNameShow = false;
          // this.addVisible = false;
          // this.$refs.showPemplatePreview.showAndHide = false;
        } else {
          // alert("模板出错了");
        }
      },
      // 添加报告中的取消关闭弹窗的事件
      addHandleCancel(e) {
        // this.deadline = []showWorkflow
        this.clearStartOnChangeValue = {}; //清除开始日期的数据
        this.clearUpOnChangeValue = {}; //清除结束日期的数据
        // console.log(this.clearRecordingTime,"日期")
        this.inputReportName = ""; //清除报告名称
        this.numberPeriods = ""; //清除期数
        this.totalNumberPeriods = ""; //清除总期数
        this.startOnChangeValue = null;
        this.reportNameShow = false;
        this.nameLoog = false;
        this.templateShow = false;
        this.dataShow = false;
        this.showNumberPeriods = false;
        this.showTotalNumberPeriods = false;
        this.showWorkflow = false;
        this.showStartOnChangeValue = false; //开始日期的提示变为false
        this.showUpOnChangeValue = false; //结束日期的提示变为false
        this.showTotalNumberPeriodsBig = false; //期数不可以比总期数大的提示变为false
        this.addVisible = false;
        this.$refs.showPemplatePreview.showAndHide = false; //改变子组件中的模板预览的显示和隐藏
        this.selectedWorkflowDataNameShow = false; //改变工作流选中后在弹出层中的显示和隐藏
      },
      showColor(value) {
        // console.log(value, "我是false");
        this.templateShowValue = value;
      },
      clickIndex(value) {
        this.clickInde = value;
      },
      // 删除报告
      deleteReportBtn(value) {
        let that = this
          this.$confirm({
              title: '提示',
              content: '确定要删除这条报告吗？',
              okText: '确定',
              cancelText: '取消',
              okType: 'danger',
                        
              onOk() {
                  console.log(that,"我是length");
                  if (that.length <= 1) {
                    that.$refs.search.pageNo = that.pageNo - 1;
                  }
                  deleteReport({
                    id: value.id
                  }).then(res => {
                    // console.log(res,"25555555555")
                    // if(res.result.records.length <= 0 ){
                    //   this.pageNo = this.pageNo -1;
                    // }
                    // console.log(this.$refs.search,"当前页123")
                    // console.log(this.length,"删除的length2")
                    that.$refs.search.getListReports();
                  });
              },
              onCancel() {
                  // console.log('Cancel');
              },
          });
        // console.log(this.length,"删除的length1")
        // 根据返回过来的当前页数据中的length长度,如果小于或者等于1,那么就改变pageNo,让其减一
        
        // console.log(value,"我是删除")
      },
      // 编辑的弹出层事件和将数据传递到弹出层中的输入框中
      showModalEdit(value,str) {
        // console.log(str,"编辑");
        this.editId = value.id;
        this.editReportName = value.reportName;
        this.editReportType = value.reportTypeName;
        this.editRepottField = value.domainTypeName;
        this.editReportingBusiness = value.businessTypeName;
        this.editStartingTime = value.reportStartTime; //开始时间
        this.editReportEndTime = value.reportEndTime; //结束时间
        this.editReportTotalCount = value.reportTotalCount;
        this.editNumberPeriods = value.reportPeriods;
        this.visible = true;
      },
      // 编辑完成后点击确定的事件
      editHandleOk(e) {
        // console.log(this.editStartingTime,"时间")
        updateReportInfo({
          reportName: this.editReportName, //报告名称
          reportPeriods: this.editNumberPeriods, //期数
          reportTotalCount: this.editReportTotalCount, //总期数
          reportStartTime: this.editStartingTime + " 00:00:00", //开始时间
          reportEndTime: this.editReportEndTime + " 23:59:59", //结束时间
          id: this.editId
        }).then(res => {
          this.$refs.search.getListReports();
          // console.log(res,"呵呵哒");
        });

        // this.confirmLoading = true;

        setTimeout(() => {
          // 第一个解决了1
          this.visible = false;
          // this.confirmLoading = false;
        }, 400);
      },
      handleCancel(e) {
        // console.log("Clicked cancel button123");
        this.addVisible = false;
      },
      editHandleCancel(e) {
        // console.log("Clicked cancel button666666");
        this.visible = false;
        // this.addVisible = false;
      },
      // 点击编辑的方法
      edit(value) {
        // console.log(value);
      },
      // 点击去详情页面的方法
      goDetails(value) {
        // console.log(this.$route.query.valueTabDomainName,this.$route.query.valueReportTypeName,this.$route.query.itemTypeName,this.$route.query.itemReportTypeId,this.$route.query.name,this.$route.query.management,"---------------------");
        this.$router.push({
          path: "/reportListDetails", //路径
          query: {
            id: value.reportTableId, //点击详情的时候获取id并且传递到详情页面的ID
            propertyTableId: value.propertyTableId,
            valueTabDomainName : this.$route.query.valueTabDomainName,
            valueReportTypeName : this.$route.query.valueReportTypeName,
            itemTypeName : this.$route.query.itemTypeName,
            itemReportTypeId : this.$route.query.itemReportTypeId,
            name : this.$route.query.name,
            management : this.$route.query.management,
            valueTabId : this.$route.query.valueTabId
          }
        });
      },
      // 当前页和总页数发生变化的方法
      onShowSizeChange(current, pageSize) {
        // console.log(current, pageSize, "当前页和每页显示的条数");
        this.pageSize = pageSize; //每页显示的条数
        bus.$emit("changePerPagePiecesNumber", [current, pageSize]);
        this.pageNo = current; //当前页
        this.loading = false; //是否加载中
      },
      pageChange(v) {
        // 更改当前页
        this.pageNo = v;
        this.loading = true; //是否加载中
        bus.$emit("changeCurrentPage", this.pageNo); //将当前页传过去，方法名changeCurrentPage
      },  

      // 审核中的事件
      // 点击审核让弹出层显示出来的事件
      // auditReportBtn() {
      //   this.auditReportVisible = true;
      // },

      // 审核中的确定事件
      auditReportOk(e) {
          let str = this.selectedReviewStatus + ""
        // auditReportSelectStatusPrompt
          //判断是否选择了状态 
          // console.log(this.selectedReviewStatus,"审核状态",this.auditReportRemark,"审核中Input里面的值")
          if(this.selectedReviewStatus === "--请选择--" || this.selectedReviewStatus === ""){
              this.auditReportSelectStatusPrompt = true;
          }else{
              this.auditReportSelectStatusPrompt = false;
          };
          // 判断是否输入了备注
          if(this.auditReportRemark === ""){
              this.auditReportRemarksPrompt = true;
          }else{
              this.auditReportRemarksPrompt = false;
          };
          if(this.auditReportSelectStatusPrompt === false && this.auditReportRemarksPrompt ===false){
              claimAndCompleteTaskToUserNameByProInstId({
                  reportId : this.auditReportId,
                  result  : str,
                  auditAdvice : this.auditReportRemark,
              }).then((res)=>{
                  this.$message.info(res.message)
                  this.$refs.search.getListReports();
                  console.log(res.message)
              });

              this.defaultValue = "--请选择--";
              this.auditReportRemark = "";
              this.auditReportVisible = false;
          }
          // if(this.selectedReviewStatus === "--请选择--" || this.selectedReviewStatus === "" || this.auditReportRemark === ""){
          //   // alert("不能是请选择")
          //     // if(){
          //         // alert("不能是空，或者审核的值为空")
          //     // }
          // }else{
          //     this.defaultValue = "--请选择--";
          //     this.selectedReviewStatus = "";
          //     this.auditReportVisible = false;
          // }
          
      },
      // 审核中的取消事件
      auditReportCancel(e) {
        this.auditReportVisible = false;
      },
      // 选中的审核状态
      auditReportSelectStatus(value) {
          this.selectedReviewStatus = value;
          // console.log(`selected ${value}`);
      }
    },
    mounted() {
      // selectReportInstanceSeqID({}).then((res)=>{
      //         console.log(res.result,"获取报告的ID")
      //         // this.getaddReportID = res.result
              
      //     })
      // console.log(this.$refs.search, "当前页123");
      // this.getListReports();
      // this.onChange();
      bus.$on("two", data => {
        this.data = data;
        // console.log(this.data, "过来了吗？？");
        // this.a
        // console.log(data,"过来啦吗？？")
      });
      // 任务下发模式类型（0：总局内部下发，1：总局下发台站，2：台站自建任务）
      bus.$on("reportListData", data => {
        // console.log(data,"数据")
        for(let i = 0 ; i < data.records.length ; i ++){
          // console.log(data.records[i].source,"数据")
            if(data.records[i].source === 0){
              data.records[i].source = "总局内部下发"
            }else if(data.records[i].source === 1){
              data.records[i].source = "总局下发台站"
            }else if(data.records[i].source === 2){
              data.records[i].source = "台站自建任务"
            }
        }
        // console.log(data,"数据")
        this.length = data.records.length;
        this.loading = true;
        this.report = data.records; //请求ajax返回回来的报告数据
        this.pageSum = data.total; //请求Ajax返回回来的总条数
        this.current = data.current;
        let that = this;
        setTimeout(function() {
          that.loading = false;
        }, 300);
      });
      bus.$on("all", data => {
        // console.log(data,"我是方法")
      });
    }
  };
</script>
<style lang="scss" scoped>
    .show-color {
        color: #f00;
    }
    .details {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        > div:nth-child(2) {
            width: 100%;
            height: 70px;
            margin: 0 70px;
            // background: yellow;
            > button {
              margin-top: 18px;
              margin-right: 18px;
            }
        }
        .ant-input {
          width: 200px;
        }
        .addReport {
            content: "";
            display: block;
            clear: both;
            margin: 0 20px;
            > .ant-btn {
                margin: 20px 0;
            }
        }
    }



.ant-modal-content {
  .addReportBtn {
    > div {
      margin: 15px;
    }
    .button {
      > input {
        width: 80px;
        height: 30px;
      }
    }
  }
}
#components-pagination-demo-mini {
  margin: 20px 0;
  > ul {
    float: right;
  }
  ul::before {
    content: "";
    display: block;
    clear: both;
  }
  .report-list-btn {
    margin: 0 5px !important;
  }
}
#components-pagination-demo-mini::after {
  content: "";
  display: block;
  clear: both;
}
.edit {
  > div {
    margin: 10px 0;
    input {
      width: 150px;
    }
    span {
      font-size: 16px;
      margin-right: 10px;
    }
  }
}
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 16px 10px;
}
.ant-table-tbody > tr > td {
  padding: 16px 10px;
}
.selected-workflow-name {
  display: block;
  height: 35px;
  line-height: 35px;
  width: 256px;
  background-color: #f5f5f5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ant-select{
  width:140px !important;
}
.audit-report-prompt{
    color:#f40;
}
</style>





<style scoped>
  >>> .ant-tabs-bar {
    border-bottom: 0;
  }
</style>
