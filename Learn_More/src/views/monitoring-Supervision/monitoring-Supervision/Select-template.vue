<template>
    <div>
        <!-- 选择模板的组件 -->
        <span>选择模板：</span>
        <a-button type="primary" @click="showModal">请选择模板</a-button>
        <a-modal
            :centered="true"
            title="模板列表"
            :visible="visible"
            :confirmLoading="confirmLoading"
            class="selectTemplate"
            :maskClosable="false"
            :width="1100"
            @cancel="templateListHandleCancel"
            :footer="null"
        >
            <div class="search">
                <div class="name-coding">
                    <span >名称：</span>
                    <a-input v-model="enterName" placeholder="请输入名称" />
                </div>
                <div>
                    <span>报告类型：</span>
                    <a-select class="dropDownDoxwIDTH" v-model="reportTypeDefaultValue" defaultValue="" @change="handleChangeReportType" >
                        <!-- <a-select-option value="--请选择--">--请选择--</a-select-option> -->
                        <a-select-option  v-for="value in boxReportType" :key="value.id" :value="value.id">{{value.typeName}}</a-select-option>
                    </a-select>
                </div>
                <div v-if="reportDomainDefaultInformationShow">
                    <span>报告所属领域：</span>
                    <a-select class="dropDownDoxwIDTH" defaultValue="" v-model="reportDomainDefaultInformation" @change="handleChangeReportField">
                        <!-- <a-select-option value="--请选择--">--请选择--</a-select-option> -->
                        <a-select-option
                            v-for="value in boxReportField"
                            :value="value.id"
                            :key="value.id"
                        >{{value.domainName}}</a-select-option>
                    </a-select>
                </div>
                <div>
                    <span>报告业务：</span>
                    <a-select class="dropDownDoxwIDTH" v-model="reportingBusinessValue" defaultValue="" @change="handleChangeReportBusiness">
                        <!-- <a-select-option value="--请选择--">--请选择--</a-select-option> -->
                        <a-select-option
                            v-for="value in boxReportingBusiness"
                            :value="value.id"
                            :key="value.id"
                            >{{value.typeName}}</a-select-option>
                    </a-select>
                </div>
                <a-button type="primary" icon="search" @click="searchNameCode">搜索</a-button>
                <a-button type="primary" @click="searchReset">重置</a-button>
            </div>
            <TemplateListForm @changePage="changePage" ref="selectTemplateTab" :selectTemplate="selectTemplate" :templateLoading="templateLoading">
                <!-- 选择模板列表组件（表格） -->
            </TemplateListForm>
            <div class="confirm-cancellation-btn">
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" @click="handleOk">确定</a-button>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import TemplateListForm from "./Template-list-form.vue";
    import bus from "../bus/bus.js";
    import {
        queryReportTableInfoList,
        queryReportTypeSelectList,
        queryReportBusinessSelectList,
        queryReportDomainSelectList
    } from "@/api/api.js";
    export default {
        data() {
            return {
                visible: false,
                confirmLoading: false,
                selectTemplate: [],
                enterName: "", //名称
                pageNo: 1,
                pageSize: 5,
                one: [],
                // loading : true,
                data: null,
                boxReportType: [], //调取报告类型返回的数据
                boxReportField: [], //调取所属领域返回的数据
                boxReportingBusiness: [], //调取报告业务返回的数据
                cancel : false,
                isShow : true,
                clickIndex : 0,
                // 下面三条数据是选择下拉框时选中的数据（ID）
                reportTypeDropDownBoxValue : "",//报告类型
                reportAreaValue : "",//报告所属领域
                reportingBusiness : "",//报告业务
                //下面的三条数据是下拉框中的默认信息（name名称）
                reportTypeDefaultInformation : "",//报告类型的默认信息
                reportDomainDefaultInformation : "",//报告所属领域默认信息
                reportBusinessDefaultInformation : "",//报告业务的默认信息
                // 下面的三条数据是下拉框的默认信息的ID
                reportTypeDefaultInformationID : "",//报告类型的默认信息ID
                reportDomainDefaultInformationID : "",//报告所属领域默认信息ID
                reportBusinessDefaultInformationID : "",//报告业务的默认信息ID
                // 下面的三条数据是控制页面中的下拉框显示与隐藏的
                reportTypeDefaultInformationShow : "",//报告类型的
                reportDomainDefaultInformationShow : true,//报告所属领域的
                reportBusinessDefaultInformationShow : true,//报告业务的
                // 
                reportTypeDefaultValue : "--请选择--",
                reportingBusinessValue : "--请选择--",
                a : {},
                templateLoading : true,
            };
        },
        components: {
            TemplateListForm
        },
        // /monitor/queryReportDomainSelectList  /monitor/queryReportTypeSelectList
        // /nmmonitor-server-moduls-monitor
        methods: {
            templateListHandleCancel(){
                this.visible = false;
            },
            changePage(){
                this.templateLoading = true;
            },
            // 重置按钮的事件
            searchReset(){
                this.templateLoading = true;
                this.enterName = "";//清空名称的输入框
                this.reportTypeDefaultValue = "--请选择--"
                this.reportTypeDropDownBoxValue = null;
                this.reportingBusinessValue = "--请选择--"
                this.reportingBusiness = null;
                this.getSelectTemplate();
            },
            // 报告类型下拉框
            handleChangeReportType(value) {
                this.reportTypeDropDownBoxValue = value;
            },
            // 报告所属领域
            handleChangeReportField(value){
                
                this.reportAreaValue = value;
                // console.log(this.reportAreaValue,"所属领域ID")
            },
            // 报告业务
            handleChangeReportBusiness(value){
                this.reportingBusiness = value;
                // console.log(this.reportingBusiness)
            },
            // 搜索按钮事件
            searchNameCode() {
                this.templateLoading = true;
                this.getSelectTemplate();
            },
            // 获取搜索模板的方法
            getSelectTemplate() {
                // console.log(this.$refs,"模板的ref")
                // console.log(this.reportAreaValue,"所属领域ID",this.reportingBusiness,"所属业务ID",this.reportTypeDropDownBoxValue,"报告类型ID")
                queryReportTableInfoList({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    reportName: this.enterName,
                    domainTypeId : this.reportAreaValue,//所属领域ID
                    businessTypeId : this.reportingBusiness,//所属业务ID
                    reportTypeId : this.reportTypeDropDownBoxValue//报告类型ID
                }).then(res => {
                    this.selectTemplate = res.result;
                    this.templateLoading = false;
                    // if(this.$refs.selectTemplateTab !== undefined){
                    //     console.log("不包错")
                    //     this.$refs.selectTemplateTab.loading = false;
                    // }
                    // console.log(this.$refs.selectTemplateTab.loading,"模板")
                    // this.$refs.selectTemplateTab.loading = false;
                    // console.log(this.$refs.selectTemplateTab.loading,"模板的ref")
                    // this.loading = false;
                    // bus.$emit("changeLoading",this.loading)
                    if (res.success) {
                        // this.$refs.selectTemplateTab.loading = false;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            // 点击选择模板的事件
            showModal() {
                this.getSelectTemplate();
                this.visible = true;
                this.clickIndex += 1;
                this.$emit("clickIndex",this.clickIndex);
                // console.log(this.$refs.propertyIsEnumerable("selectTemplateTab"))
                // this.a = this.$refs;
                // console.log(this.$refs instanceof Object);
                // console.log(typeof JSON.stringify(this.a.__ob__.value))
                // console.log(JSON.parse(JSON.stringify(this.$refs)),"ref");
                // console.log(JSON.parse(JSON.stringify(this.a.__ob__.value)),"ref")
                // this.$refs.selectTemplateTab.loading = false;
            },
            // 点击确定按钮的事件
            handleOk(e) {
                // this.ModalText = "The modal will be closed after two seconds";
                this.confirmLoading = true;
                // setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
                // }, 2000);
                bus.$emit("show",this.isShow)
            },
            handleCancel(e) {
                this.data = null;
                this.clickIndex = 0;
                this.$emit("clickIndex",this.clickIndex)
                this.visible = false;
                bus.$emit("cancel",this.cancel)
            },
            // 默认信息,是否显示与隐藏
            defaultInformation(){
                // 报告业务的判断
                // console.log(this.$route.query.valueReportTypeName,"报告业务的判断")
                // if(this.$route.query.valueReportTypeName !== undefined ){
                //     this.reportBusinessDefaultInformation = this.$route.query.valueReportTypeName;
                //     this.reportBusinessDefaultInformationID = this.$route.query.valueId;
                //     // this.reportingBusiness = this.reportBusinessDefaultInformationID;
                //     this.reportBusinessDefaultInformationShow = false;
                //     // this.getSelectTemplate();
                // }else{
                //     this.reportBusinessDefaultInformationShow = true;
                // }
                // 报告所属领域的判断
                if(this.$route.query.valueTabDomainName !== undefined){
                    this.reportDomainDefaultInformation = this.$route.query.valueTabDomainName;
                    this.reportDomainDefaultInformationID = this.$route.query.valueTabId;
                    this.reportAreaValue = this.reportDomainDefaultInformationID;
                    this.reportDomainDefaultInformationShow = false;
                    // this.getSelectTemplate();
                }else{
                    this.reportDomainDefaultInformationShow = true;
                }
                this.getSelectTemplate();
            }
        },
        mounted() {
            // console.log(this.$refs,"11111111")
            // this.getSelectTemplate();
            this.defaultInformation()
            this.$emit("clickIndex",this.clickIndex)
            // this.getSelectTemplate();
            bus.$on("currentPage", data => {
                this.pageNo = data;
                this.getSelectTemplate();
            });

            bus.$on("one", data => {
                this.data = data;
                bus.$emit("two", this.data);
            });
            
            // 下拉框报告类型
            queryReportTypeSelectList({}).then(res => {
                this.boxReportType = res.result;
                bus.$emit("reportType", res.result);
                if (res.success) {

                } else {
                    console.log(res.message);
                }
            });
            // 下拉框报告业务
            queryReportBusinessSelectList({}).then(res => {
                this.boxReportingBusiness = res.result;
                bus.$emit("reportingBusiness", res.result);
                if (res.success) {

                } else {
                    console.log(res.message);
                }
            });
            // 下拉框查询报告所属领域
            queryReportDomainSelectList({}).then(res => {
                this.boxReportField = res.result;
                bus.$emit("reportArea", res.result);
                if (res.success) {

                } else {
                    console.log(res.message);
                }
            });
            
        }
    };
</script>
<style lang="scss" scoped>
    .ant-modal-body {
        .ant-input {
            width: 150px;
        }
    }
    .search{
        >div{
            float: left;
            margin:5px 33px;
        }
        .dropDownDoxwIDTH{
            width:110px;
        }
        button{
            margin:5px 20px;
        }
    }
    .confirm-cancellation-btn{
        margin-left: 437px;
        >button{
            margin-right: 10px;
        }
    }
</style>

