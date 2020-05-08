<template>
            <!-- 报告搜索的功能 -->
    <div class="reportType">
        <a-form>
            <a-row>
                <a-col :span="6">
                    <a-form-item label="报告名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                        <a-input placeholder="请输入报告名称.." v-model="reportName" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="报告所属领域" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                        <a-select defaultValue="" @change="handleChangeTwo" v-model="fieldDefaultValue">
                            <a-select-option v-for="value in boxReportField" :value="value.id" :key="value.id">{{value.domainName}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="报告业务" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                        <a-select defaultValue="" @change="handleChangeThree" v-model="reportingBusinessDefaultValue">
                            <a-select-option v-for="value in boxReportingBusiness" :value="value.id" :key="value.id">{{value.typeName}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="报告类型" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                        <a-select defaultValue="" @change="handleChangeOne" v-model="reportTypeDefaultValue">
                            <a-select-option v-for="value in boxReportType" :value="value.id" :key="value.id" ref="name">{{value.typeName}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="状态" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                        <a-select defaultValue="" @change="handleChangeFour" v-model="statusDefaultValue">
                            <a-select-option value="以通过">已通过</a-select-option>
                            <a-select-option value="未通过">未通过</a-select-option>
                            <a-select-option value="审核中">审核中</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item >
                        <a-button type="primary"  icon="search" @click="searchReport">搜索</a-button>
                        <a-button @click="reset">重置</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script>
    import axios from 'axios';
    import bus from '../bus/bus.js';
    import {
            queryReportTypeSelectList, 
            queryReportBusinessSelectList,
            queryReportDomainSelectList,
            queryReportList
    }from '@api/api'

    export default {
        data(){
            return{
                //http://192.168.2.171:5000/violationDataProcessing?leftData=%E8%8A%82%E7%9B%AE%E5%90%8D%E7%A7%B0&leftData=%E9%A6%96%E6%AC%A1%E5%8F%91%E7%8E%B0%E7%BD%91%E7%AB%99&leftData=%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80&leftData=%E8%8A%82%E7%9B%AE%E7%AE%80%E4%BB%8B&leftData=%E7%8A%B6%E6%80%81&leftData=%E5%A4%87%E6%B3%A8&violationDataDetailsProcessing=%E2%80%9C%E5%B8%81%E5%9C%88%E2%80%9D%E6%9A%B4%E8%B7%8C%E8%83%8C%E5%90%8E%EF%BC%8C%E5%BC%A0%E9%A6%96%E6%99%9F%E4%B9%9F%E8%A2%AB%E5%89%B2%E9%9F%AD%E8%8F%9C%EF%BC%8C%E5%9C%A8%E7%BE%8E%E5%9B%BD%E6%8A%91%E9%83%81%E8%87%AA%E6%9D%80&violationDataDetailsProcessing=https%3A%2F%2Fv.qq.com%2Fx%2Fpage%2Fa0812xw9w4k.html&violationDataDetailsProcessing=http%3A%2F%2Fpuui.qpic.cn%2Fqqvideo_ori%2F0%2Fa0812xw9w4k_228_128%2F0&violationDataDetailsProcessing=%E8%87%AA%E6%9D%80%3B%3B&violationDataDetailsProcessing=3&violationDataDetailsProcessing=%E5%B8%B8%E8%A7%84%E4%BB%BB%E5%8A%A1&mp4=%2F%2F
                token : null,//token值
                reportName : "",
                reportType : "",
                reportField : "",
                reportingBusiness : "",
                reportStatus : "",
                pageNo : 1,
                pageSize : 5,
                boxReportType : [],//调取报告类型返回的数据
                boxReportField : [],//调取所属领域返回的数据
                boxReportingBusiness : [],//调取报告业务返回的数据
                boxReportStatus : [],//调取状态返回的数据
                // 以下4条是下拉框的默认值
                reportTypeDefaultValue : "--请选择--",//报告类型
                fieldDefaultValue : "--请选择--",//
                reportingBusinessDefaultValue : "--请选择--",
                statusDefaultValue : "--请选择--",
                // 以下三条数据是搜索的默认值
                searchReportBusinessDefaults : "",//报告业务默认值
                searchReportTypeDefaultValue : "",//报告类型默认值
                searchReportDomainDefaults : "",//报告所属领域默认值
                // completedUnfinished : "1"
            }
        },
        props : ["completedUnfinished"],
        methods : {
            // 点击重置按钮的事件
            reset(){
                this.reportTypeDefaultValue = "--请选择--",
                this.fieldDefaultValue = "--请选择--",
                this.reportingBusinessDefaultValue = "--请选择--",
                this.statusDefaultValue = "--请选择--"
                this.reportType = "";
                this.reportName = "",
                this.reportType = "",
                this.reportField = "",
                this.reportingBusiness = "",
                this.reportStatus = "",
                
                this.searchReport()
            //    console.log(this.la)
            },
            handleChangeOne(value){
                // console.log(value,"我是选择框")
                if(value === "请选择"){
                    this.reportType = null;
                }else{
                    this.reportType = value;
                }
            },
            // handleChangeTwo(value){
            //     // console.log(value,"222222222")
            //     if(value === "--请选择--"){
            //         this.reportField = null;
            //     }else{
            //         this.reportField = value;
            //     }
            // },
            handleChangeThree(value){
                if(value === "--请选择--"){
                    this.reportingBusiness = null;
                }else{
                    this.reportingBusiness = value;
                }
            },
            handleChangeFour(value){
                if(value === "--请选择--"){
                    this.reportType = null;
                }else{
                    this.reportType = value;
                }
            },
            handleChangeTwo(value){
                this.reportField = value;
                this.getQueryReportBusinessSelectList();
            },
            handleChangeThree(value){
                this.reportingBusiness = value;
            },
            handleChangeFour(value){
                this.reportStatus = value;
                this.queryReportBusinessSelectList()
            },
            // 搜索功能的方法
            getListReports(){
                // console.log(value,"我是传递过来的tab")
                if(this.reportType === undefined){
                    this.reportType = ""
                }
                // console.log(this.pageNo,"当前页")
                // console.log(this.reportType,"报告类型")
                queryReportList({
                    // reportList : null,
                    pageNo : this.pageNo,//当前页
                    pageSize :this.pageSize,//每页显示条数
                    reportTypeId : this.reportType,
                    reportName : this.reportName,//报告名称
                    domainTypeId : this.reportField,//报告领域
                    businessTypeId : this.reportingBusiness,//报告业务
                    // status : this.completedUnfinished,
                    status : this.completedUnfinished,//已完成未完成的状态
                }).then((res)=>{
                    // 根据返回过来的数据，判断其是否有数据，如果没有，并且报告名称中的输入框中有数据，并且当前页不等于1,
                    // 那么我就让当前页等于1；让其再次请求数据
                    // console.log(res.result.records.length,"数据有值吗？？" ,this.reportName,"输入框中的内容",this.pageNo,"当前页")
                    if(res.result.records.length <= 0 && this.reportName !== "" && this.pageNo !== 1){
                        this.pageNo = 1;
                        this.getListReports();
                    }
                    // console.log(res,"我是报告列表中的数据")
                    // this.pageNo = this.pageNo-1
                    
                    if(res.success){
                        bus.$emit("reportListData",res.result)
                    }else{
                        console.log(res.message);
                    }
                })
            },
            searchReport(){
                this.getListReports()
            },
            // valueTabDomainName=互联网视听节目&  valueTabId=1&  valueReportTypeName=持证重点报告&valueId=1
            // 搜索的默认值
            searchDefault(){
                // 报告类型的判断
                if(this.$route.query.itemTypeName === undefined){
                    this.reportTypeDefaultValue = "--请选择--";
                    // this.reportType = "";
                    // console.log(this.reportType,"111111")
                }else{
                    this.reportTypeDefaultValue = this.$route.query.itemTypeName//报告类型
                }
                // 报告领域的判断
                if(this.$route.query.valueTabDomainName === undefined){
                    this.fieldDefaultValue = "--请选择--"
                }else{
                    this.fieldDefaultValue = this.$route.query.valueTabDomainName//报告领域
                }
                // 报告业务
                if(this.$route.query.valueReportTypeName === undefined){
                    this.reportingBusinessDefaultValue = "--请选择--"
                }else{
                    this.reportingBusinessDefaultValue = this.$route.query.valueReportTypeName//报告业务
                }
                // console.log(this.$route.query.itemTypeName,"报告类型")
                // 下面的三条是搜索框中的默认值，是从管理首页传递过来的值
                // this.reportTypeDefaultValue = this.$route.query.itemTypeName//报告类型
                // this.fieldDefaultValue = this.$route.query.valueTabDomainName//报告领域1
                // this.reportingBusinessDefaultValue = this.$route.query.valueReportTypeName//报告业务2
                // 下面的三条数据是搜索框的默认ID，是从管理首页传递过来的值
                this.reportType = this.$route.query.itemReportTypeId;//报告类型
                this.reportField = this.$route.query.valueTabId;//报告领域
                this.reportingBusiness = this.$route.query.valueId;//报告业务
            },
            // 下拉框报告业务
            getQueryReportBusinessSelectList(value){
                console.log(value,this.reportField,"-------------------------")
                if(this.reportField === ""){
                    queryReportBusinessSelectList({
                        reportDomainId : value,
                    }).then((res)=>{
                        this.boxReportingBusiness = res.result;
                        this.reportingBusinessDefaultValue = res.result[0].typeName
                        bus.$emit("reportingBusiness",res.result)
                        if(res.success){

                        }else{
                            console.log(res.message);
                        }
                    });
                }else{
                    // console.log(value,"====================================")
                    // console.log(this.reportField,"-----------------------")
                    queryReportBusinessSelectList({
                        reportDomainId : this.reportField
                    }).then((res)=>{
                        this.boxReportingBusiness = res.result;
                        this.reportingBusinessDefaultValue = res.result[0].typeName
                        bus.$emit("reportingBusiness",res.result)
                        if(res.success){

                        }else{
                            console.log(res.message);
                        }
                    });
                }
                
            }
            

        },
        mounted(){
            this.getQueryReportBusinessSelectList(this.$route.query.valueTabId);
            this.searchDefault();
            this.getListReports();
            // bus.$emit("lalala","我是谁")
            // 下拉框报告类型
            queryReportTypeSelectList({}).then((res) => {
                this.boxReportType = res.result;
                bus.$emit("reportType",res.result)
                if (res.success) {
                    
                } else {
                    console.log(res.message);
                }
            });
            
            // 下拉框查询报告所属领域
            queryReportDomainSelectList({}).then((res)=>{
                this.boxReportField = res.result;
                bus.$emit("reportArea",res.result)
                if(res.success){

                }else{
                    console.log(res.message);
                }
            })
            // 接收当前页的一个方法
            bus.$on("changeCurrentPage",data=>{
                // console.log(data,"我是当前页")
                this.pageNo = data;//将当前页赋值给pageNo
                // console.log(this.pageNo,"我是当前页")
                this.getListReports();//改变当前页后再次调取数据
            })
            bus.$on("changePerPagePiecesNumber",data=>{
                // console.log(data,"我是当前页??")
                this.pageNo = data[0];
                this.pageSize = data[1];
                // console.log(data,"改变每页显示的条数")
                this.getListReports();//改变当前页后再次调取数据
            })
            this.$emit("search",this.getListReports);
        },
    };
</script>

<style lang="scss" scoped>
    .reportType {
        width:100%;
        // margin: 0 42px;
        // height: 100px;
        // background: purple;
        .ant-btn {
            margin-right: 10px;
            float: left;
        }
        > div {
            margin: 10px 30px;
            float: left;
            span {
                margin-right: 20px;
            }
            .ant-select {
                width: 130px;
            }
        }
    }
</style>

