<template>
    <div>
        <div style="background:#fff;padding:10px 0px;">
            <div class="search-area">
                <a-form>
                    <a-row>
                        <!-- <a-col :span="4">
                            <a-form-item label="Note" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                                <a-input/>
                            </a-form-item>
                        </a-col> -->
                        <a-col :span="6">
                            <a-form-item label="节目名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-input v-model="harmfulProgramProgramName" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="信息连接" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-input v-model="harmfulProgramInformationLink" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="主要问题" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-select v-model="harmfulProgramTypeViolationDefaults" style="width: 120px" @change="typeViolationHandleChange">
                                    <a-select-option value="政治有害">政治有害</a-select-option>
                                    <a-select-option value="血腥暴力">血腥暴力</a-select-option>
                                    <a-select-option value="传播暴力">传播暴力</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="上报时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-range-picker @change="reportingTimeChange" style="width:200px;" v-model="harmfulProgramReportingTimeClear.startTime"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="上次核查状态" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-select v-model="harmfulProgramLastCheckStatusDefaults" style="width: 120px" @change="lastCheckStatusHandleChange">
                                    <a-select-option value="T">未下线</a-select-option>
                                    <a-select-option value="F">已下线</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                                <a-button type="primary" icon="search" style="margin-right:10px;" @click="harmfulProgramSearch">搜索</a-button>
                                <a-button @click="harmfulProgramReset">重置</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <div style="margin:10px 0px;">
            <a-button type="primary" @click="handleExportXls">导出数据</a-button>
        </div>
        <div>
            <a-spin
                :spinning="harmfulProgramSpinning"
            >
                <a-table 
                    :columns="columns" 
                    :dataSource="data"
                    :scroll="{ x: 1730 }"
                    :bordered="true"
                    :pagination="false"
                >
                    <span slot="informationConnection" slot-scope="textCheck, record">
                        <span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                            <a :href="textCheck" target="_blank" style="color:#424242">
                                {{textCheck}}
                            </a>
                        </span>

                    </span>
                    <span slot="typeOfViolation" slot-scope="textCheck, record">
                        <span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display:inline-block;width:100px;" >
                            {{textCheck}}
                        </span>

                    </span>
                    <span slot="programName" slot-scope="textCheck, record">
                        <span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display:inline-block;width:150px" >
                            {{textCheck}}
                        </span>
                    </span>
                    <!-- <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a> -->
                </a-table>
            </a-spin>
        </div>
        <div>
            <a-pagination 
                size="small" 
                :total="pageSun" 
                showSizeChanger 
                @change="harmfulProgramOnChange" 
                @showSizeChange="harmfulProgramShowSizeChange" 
                showQuickJumper
                :current="current"
            />
        </div>
    </div>
</template>

<script>
    // harmfulProgram
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            fixed: 'left',
            width : 100,
        },
        {
            title: '节目名称',
            dataIndex: 'programName',
            fixed: 'left',
            width : 150,
            scopedSlots: { customRender: 'programName' },
        },
        {
            title: '信息链接',
            dataIndex: 'programUrl',
            width : 300,
            scopedSlots: { customRender: 'informationConnection' },
        },
        {
            title : '主要问题',
            width : 100,
            dataIndex : 'problem',
            scopedSlots: { customRender: 'typeOfViolation' },
            // Type of violation
        },
        {
            title : '来源网站',
            width : 150,
            dataIndex : 'websiteName',
        },
        {
            title : '上报时间',
            width : 200,
            dataIndex : 'reportTime1',
        },
        {
            title : '上次核查时间',
            width : 200,
            dataIndex : 'latestCheckTime1',
        },
        {
            title : '首次封堵时间',
            width : 100,
            dataIndex : 'firstEffectTime1',
        },
        {
            title : '首次验证时间',
            width : 200,
            dataIndex : 'firstCheckTime1',
        },
        {
            title : '上次核查状态',
            width : 200,
            fixed: 'right',
            dataIndex : 'latestCheckStatus',
        }
    ];
    import {downFile} from '@/api/manage'

    import axios from 'axios'
    export default {
        data(){
            return{
                // 搜索的条件
                harmfulProgramProgramName : "",//节目名称
                harmfulProgramInformationLink : "",//信息连接
                harmfulProgramTypeViolation : "",//违规类型
                harmfulProgramReportingTime : [],//上报时间
                harmfulProgramLastCheckStatus : "",//上次核查状态
                // 下拉框中的默认值
                harmfulProgramTypeViolationDefaults : "请选择违规类型",//违规类型
                harmfulProgramLastCheckStatusDefaults : "请选择核查状态",//核查状态
                // 清空日期
                harmfulProgramReportingTimeClear : [],

                data : [],
                columns,
                harmfulProgramSpinning : true,

                // 分页
                page : 1,//当前页
                pageSize : 10,//每页显示条数
                pageSun : 0,//总条数
                current : 1,
            }
        },
        methods : {
            handleExportXls(){
                if(this.harmfulProgramReportingTime[0] === undefined && this.harmfulProgramReportingTime[1] === undefined){
                    this.harmfulProgramReportingTime[0] = "";
                    this.harmfulProgramReportingTime[1] = "";
                }
                let url = "/programcheck/harmvideo/exportData";
                axios.get(url,{
                    params : {
                        programUrl : this.harmfulProgramInformationLink,//信息连接
                        programName : this.harmfulProgramProgramName,//节目名称
                        problem : this.harmfulProgramTypeViolation,//主要问题
                        startTime : this.harmfulProgramReportingTime[0],//开始时间
                        endTime : this.harmfulProgramReportingTime[1],//结束时间
                        status : this.harmfulProgramLastCheckStatus,//核查状态
                    },
                    responseType: 'blob',
                }).then((res)=>{
                    const downloadElement = document.createElement('a');
                    const href = res.request.responseURL;
                    downloadElement.href = href;
                    downloadElement.download = 'excel.xlsx';
                    document.body.appendChild(downloadElement);
                    downloadElement.click();
                    document.body.removeChild(downloadElement); // 下载完成移除元素
                    window.URL.revokeObjectURL(href); // 释放掉blob对象
                })
            },
                
            harmfulProgramOnChange(page, pageSize){
                // console.log(page, pageSize)
                this.page = page;
                this.pageSize = pageSize;
                this.harmfulProgramSearch();
            },
            harmfulProgramShowSizeChange(current, size){
                this.page = current;
                this.pageSize = size;
                this.harmfulProgramSearch();
                console.log(current, size)
            },
            // 违规类型下拉框
            typeViolationHandleChange(value){
                this.harmfulProgramTypeViolation = value;
                console.log(value)
            },
            // 上次核查状态下拉框
            lastCheckStatusHandleChange(value){
                this.harmfulProgramLastCheckStatus = value
                console.log(value)
            },
            // 上报时间选择
            reportingTimeChange(date, dateString){
                this.harmfulProgramReportingTime = dateString;
                console.log(date, dateString)
            },
            //搜索按钮的事件
            harmfulProgramSearch(){
                // console.log(this.harmfulProgramProgramName,"节目名称");
                // console.log(this.harmfulProgramInformationLink,"信息连接");
                // console.log(this.harmfulProgramTypeViolation,"违规类型");
                // console.log(this.harmfulProgramLastCheckStatus,"上次核查");
                if(this.harmfulProgramReportingTime[0] === undefined && this.harmfulProgramReportingTime[1] === undefined){
                    this.harmfulProgramReportingTime[0] = ""
                    this.harmfulProgramReportingTime[1] = ""
                    // console.log(this.harmfulProgramReportingTime,"上报时间")
                }else{
                    // console.log(this.harmfulProgramReportingTime)
                }
                this.getHarmfulProgramTabData();
            },
            // 搜索按钮的重置事件
            harmfulProgramReset(){
                this.harmfulProgramProgramName = "";//节目名称
                this.harmfulProgramInformationLink = "";//信息连接
                this.harmfulProgramTypeViolation = "";//违规类型
                this.harmfulProgramTypeViolationDefaults = "请选择违规类型";//违规类型默认值
                
                this.harmfulProgramLastCheckStatus = "";//上次核查状态
                this.harmfulProgramLastCheckStatusDefaults = "请选择核查状态";//上次核查状态
                this.harmfulProgramReportingTime = [];//上报时间
                this.harmfulProgramReportingTimeClear = [];
                this.harmfulProgramSearch();
            },
            getHarmfulProgramTabData(){
                this.harmfulProgramSpinning = true;
                // console.log(this.harmfulProgramProgramName);
                // console.log(this.harmfulProgramInformationLink)
                // console.log(this.harmfulProgramReportingTime[0])
                // console.log(this.harmfulProgramReportingTime[1])
                // console.log(this.harmfulProgramLastCheckStatus)
                axios.get("/programcheck/harmvideo/getPageHarmVideo",{
                    params : {
                        pageNum : this.page,
                        pageSize : this.pageSize,
                        problem : this.harmfulProgramTypeViolation,
                        programName : this.harmfulProgramProgramName,//节目名称
                        programUrl : this.harmfulProgramInformationLink,//信息连接
                        startTime : this.harmfulProgramReportingTime[0],//开始时间
                        endTime : this.harmfulProgramReportingTime[1],//结束时间
                        status : this.harmfulProgramLastCheckStatus,
                    }
                }).then((res)=>{
                    // console.log(res.data.result.records.length);
                    if(res.data.result.records.length <= 0 && this.page !== 1){
                        if(this.harmfulProgramProgramName !== "" || this.harmfulProgramInformationLink !== "" || this.harmfulProgramReportingTime.length === 2 || this.harmfulProgramLastCheckStatus !== ""){
                            this.page = 1;
                            this.getHarmfulProgramTabData();
                        }
                    }else{
                        for(let i = 0 ; i < res.data.result.records.length ; i ++){
                            if(res.data.result.records[i].latestCheckStatus === 'T'){
                                res.data.result.records[i].latestCheckStatus = "未下线"
                            }else if(res.data.result.records[i].latestCheckStatus === 'F'){
                                res.data.result.records[i].latestCheckStatus = "已下线"
                            }
                        };
                        this.data = res.data.result.records;
                        this.pageSun = res.data.result.total;
                        this.current = res.data.result.current;
                        let that = this;
                        setTimeout(function(){
                            that.harmfulProgramSpinning = false;
                        },400)
                        // console.log(res);
                    }
                })
            }
        },
        // computed: {
        //     rowSelection() {
        //         const { selectedRowKeys } = this;
        //         return {
        //             onChange: (selectedRowKeys, selectedRows) => {
        //                 console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRowKeys);
        //             },
        //         };
        //     },
        // },
        mounted(){
            this.harmfulProgramSearch();
        }
    }
</script>

<style lang="scss" scoped>
    .harmfulProgram-input{
        width:200px;
    }
    .ant-select{
        width:200px !important;
    }
    .search-area{
        margin-bottom: 10px;
    }
    .ant-table-wrapper{
        background: #fff;
    }
    #components-pagination-demo-mini .ant-pagination:not(:last-child) {
        margin-bottom: 24px;
    }
    .ant-pagination{
        float: right;
        padding: 15px;
    }
    .ant-form-item{
        margin-bottom: 0px;
    }
</style>