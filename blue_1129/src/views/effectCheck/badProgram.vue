<template>
    <div>
        <div style="padding: 20px 0px;background: #fff;">
            <div style="background-color:#fff;">
                <a-form>
                    <a-row>
                        <a-col :span="6">
                            <a-form-item label="网站名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-input v-model="undocumentedWebsiteSiteName" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="地区" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-input v-model="undocumentedWebsiteArea" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="上报台站" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-select v-model="undocumentedWebsiteReportingStationDefaults"  @change="reportingStationHandleChange">
                                    <a-select-option value="二四六">二四六</a-select-option>
                                    <a-select-option value="五七三">五七三</a-select-option>
                                    <a-select-option value="二零三">二零三</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="是否传播视听节目" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
                                <a-select v-model="undocumentedWebsiteWhetherToBroadcastAudiovisualProgramsDefaults" @change="audiovisualProgramHandleChange">
                                    <a-select-option value="T">是</a-select-option>
                                    <a-select-option value="F">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="报告通过时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-range-picker @change="reportPassageTimeOnChange" v-model="undocumentedWebsiteReportPassageTimeClear.startTime" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-button style="margin-right:10px;" icon="search" type="primary" @click="undocumentedWebsiteSearch">搜索</a-button>
                            <a-button @click="undocumentedWebsiteReset">重置</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <div style="margin:10px 0px">
            <a-button type="primary" @click="exportData">导出数据</a-button>
        </div>
        <div>
             <a-spin 
                :spinning="undocumentedWebsiteSpinning"
             >
                <a-table 
                    :rowSelection="rowSelection" 
                    :columns="columns" 
                    :dataSource="data" 
                    :bordered="true"
                    :pagination="false"
                >
                    <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
                </a-table>
             </a-spin>
        </div>
        <div>
            <a-pagination size="small" :current="current" :total="pageSum" showSizeChanger showQuickJumper @change="undocumentedWebsiteChange" @showSizeChange="undocumentedWebsiteShowSizeChange"/>
        </div>
    </div>
</template>

<script>
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            // fixed: 'left',
            // width : 100,
            // scopedSlots: { customRender: 'name' },
        },
        {
            title: '网站名称',
            // fixed: 'left',
            // width : 100,
            dataIndex: 'name',
        },
        {
            title: '域名',
            // width : 150,
            dataIndex: 'domain',
        },
        {
            title: '地区',
            // width : 150,
            dataIndex: 'locationName',
        },
        {
            title : "网站类型",
            // width : 150,
            dataIndex : 'isMobile',
        },
        {
            title: '报告通过时间',
            // width : 200,
            dataIndex: 'insertTime1',
        },
        {
            title: '是否传播视听节目',
            // width : 100,
            dataIndex: 'isContainsVideo',
        },
        {
            title : "上报台站",
            dataIndex : 'orgCode'
            // width : 100,
            // fixed : 'right'
        },
  ];
    import axios from 'axios'
    export default {
        data(){
            return{
                // 无证网站
                // undocumentedWebsite
                undocumentedWebsiteSiteName : "",//网站名称
                undocumentedWebsiteDomainName : "",//域名
                undocumentedWebsiteArea : "",//地区
                undocumentedWebsiteCertificateNumber : "",//备案/证号
                undocumentedWebsiteReportId : "",//报告ID
                undocumentedWebsiteReportingStation : "",//上报台站
                undocumentedWebsiteFirstCheckStatus : "",//首次核查状态
                undocumentedWebsiteWhetherToBroadcastAudiovisualPrograms : "",//是否传播视听节目
                undocumentedWebsiteReportPassageTime : [],//报告通过时间
                undocumentedWebsiteFirstCheckTime : [],//首次核查时间
                undocumentedWebsiteUploadCheckTime : [],//上传核查时间


                // 搜索条件中的默认值
                // Defaults
                undocumentedWebsiteReportingStationDefaults : "请选择上报台站",//上报台站
                undocumentedWebsiteWhetherToBroadcastAudiovisualProgramsDefaults : "请选择是否",//是否传播视听节目
                undocumentedWebsiteFirstCheckStatusDefaults : "请选择核查状态",//核查状态
                
                //清空搜索条件中的日期选择框中的数据
                // clear
                undocumentedWebsiteReportPassageTimeClear : [],//报告通过时间
                undocumentedWebsiteFirstCheckTimeClear : [],//首次核查时间
                undocumentedWebsiteUploadCheckTimeClear : [],//上传核查时间   


                // 表格里面的数据
                data : [],
                columns,

                // 加载中
                undocumentedWebsiteSpinning : true,


                // 分页的数据
                pageSize : 10,
                pageNo : 1,
                pageSum : 0,
                current : 1,

            }
        },
        computed: {
            rowSelection() {
                const { selectedRowKeys } = this;
                return {
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    },
                    // getCheckboxProps: record => ({
                    //     props: {
                    //         disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    //         name: record.name,
                    //     },
                    // }),
                };
            },
        },
        created(){
            this.undocumentedWebsiteSearch();
        },
        methods : {
            // 导出数据
            exportData(){
                if(this.undocumentedWebsiteReportPassageTime[0] === undefined && this.undocumentedWebsiteReportPassageTime[1] === undefined){
                    this.undocumentedWebsiteReportPassageTime[0] = "";
                    this.undocumentedWebsiteReportPassageTime[1] = "";
                }
                let url = "/programcheck/wzwebsite/exportData";
                axios.get(url,{
                    params : {
                        name : this.undocumentedWebsiteSiteName,//网站名称
                        domain : this.undocumentedWebsiteDomainName,//域名
                        locationName : this.undocumentedWebsiteArea,//地区
                        orgCode : this.undocumentedWebsiteReportingStation,//上报台站
                        isContainsVideo : this.undocumentedWebsiteWhetherToBroadcastAudiovisualPrograms,//是否传播视听节目
                        startTime : "",//开始时间
                        endTime : "",//结束时间
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
            //上报台站下拉框
            reportingStationHandleChange(value){
                // console.log(value)
                this.undocumentedWebsiteReportingStation = value;
            },
            // 是否传播视听节目下拉框
            audiovisualProgramHandleChange(value){
                this.undocumentedWebsiteWhetherToBroadcastAudiovisualPrograms = value;
                console.log(value);
            },
            // 首次核查状态
            verificationStatusHandleChange(value){
                console.log(value);
            },
            // 报告通过时间
            reportPassageTimeOnChange(date, dateString){
                this.undocumentedWebsiteReportPassageTime = dateString;
                // console.log(date, dateString);
            },
            // 首次核查时间
            firstCheckTimeOnChange(date, dateString){
                this.undocumentedWebsiteFirstCheckTime = dateString;
                // console.log(date, dateString);
            },
            // 上传核查时间
            uploadCheckTimeOnChange(date, dateString){
                this.undocumentedWebsiteUploadCheckTime = dateString;
                // console.log(date, dateString);
            },
            // 无证网站搜索按钮的事件
            undocumentedWebsiteSearch(){
                console.log(this.undocumentedWebsiteSiteName,"无证网站");
                console.log(this.undocumentedWebsiteDomainName,"域名");
                console.log(this.undocumentedWebsiteArea,"地区");
                // console.log(this.undocumentedWebsiteCertificateNumber,"备案/证号");
                // console.log(this.undocumentedWebsiteReportId,"报告ID");0
                console.log(this.undocumentedWebsiteReportingStation,"上报台站");
                console.log(this.undocumentedWebsiteWhetherToBroadcastAudiovisualPrograms,"是否传播视听节目");
                console.log(this.undocumentedWebsiteReportPassageTime,"报告通过时间");
                // console.log(this.undocumentedWebsiteFirstCheckTime,"首次核查时间");
                // console.log(this.undocumentedWebsiteUploadCheckTime,"上传核查时间")
                this.getUndocumentedWebsiteTabInformation();
            },
            // 获取无证网站表格里面的信息
            getUndocumentedWebsiteTabInformation(){
                this.undocumentedWebsiteSpinning = true;
                if(this.undocumentedWebsiteReportPassageTime.length < 2){
                    this.undocumentedWebsiteReportPassageTime[0] = "";
                    this.undocumentedWebsiteReportPassageTime[1] = "";
                }
                console.log(this.undocumentedWebsiteReportPassageTime)
                axios.get("/programcheck/wzwebsite/getPageWzWebsite",{
                    params : {
                        pageNum : this.pageNo,//当前页
                        pageSize : this.pageSize,//每页显示的条数
                        name : this.undocumentedWebsiteSiteName,//网站名称
                        domain : this.undocumentedWebsiteDomainName,//域名
                        locationName : this.undocumentedWebsiteArea,//地区
                        isContainsVideo : this.undocumentedWebsiteWhetherToBroadcastAudiovisualPrograms,//是否传播视听节目
                        startTime : this.undocumentedWebsiteReportPassageTime[0],
                        endTime : this.undocumentedWebsiteReportPassageTime[1],
                        orgCode : this.undocumentedWebsiteReportingStation,
                    }
                }).then((res)=>{
                    if(res.data.result.records.length <= 0 && this.pageNo !== 1){
                        if(this.undocumentedWebsiteSiteName !== "" || this.undocumentedWebsiteDomainName !== "" || this.undocumentedWebsiteArea !== "" || this.undocumentedWebsiteWhetherToBroadcastAudiovisualPrograms !== "" || this.undocumentedWebsiteReportPassageTime.length !== 2){
                            this.pageNo = 1;
                            this.getUndocumentedWebsiteTabInformation();
                        }
                    }else{
                        for(let i = 0 ; i < res.data.result.records.length ; i ++){
                            if(res.data.result.records[i].isContainsVideo === "F"){
                                res.data.result.records[i].isContainsVideo = "否"
                            }else if(res.data.result.records[i].isContainsVideo === "T"){
                                res.data.result.records[i].isContainsVideo = "是"
                            }
                        };
                        for(let i = 0 ; i < res.data.result.records.length ; i ++){
                            if(res.data.result.records[i].isMobile === "F"){
                                res.data.result.records[i].isMobile = "非移动互联网"
                            }else if(res.data.result.records[i].isMobile === "T"){
                                res.data.result.records[i].isMobile = "是移动互联网"
                            }
                        }
                        this.data = res.data.result.records;
                        this.pageSum = res.data.result.total;
                        this.current = res.data.result.current;
                        let that = this;
                        setTimeout(function(){
                            that.undocumentedWebsiteSpinning = false;
                        },400)
                    }
                })
            },
            // 无证网站重置按钮的事件
            undocumentedWebsiteReset(){
                // input输入框
                this.undocumentedWebsiteSiteName = "";//网站名称
                this.undocumentedWebsiteDomainName = "";//域名
                this.undocumentedWebsiteArea = "";//地区
                this.undocumentedWebsiteCertificateNumber = "";//备案/证号
                this.undocumentedWebsiteReportId = "";//报告ID
                // 日期选择框
                this.undocumentedWebsiteReportPassageTimeClear = [];//报告通过时间
                this.undocumentedWebsiteReportPassageTime = [];//报告通过时间
                this.undocumentedWebsiteFirstCheckTimeClear = [];//首次核查时间
                this.undocumentedWebsiteFirstCheckTime = [];//首次核查时间
                this.undocumentedWebsiteUploadCheckTimeClear = [];//上传核查时间
                this.undocumentedWebsiteUploadCheckTime = [];//上传核查时间
                // 下拉框
                this.undocumentedWebsiteReportingStation = "";//上报台站
                this.undocumentedWebsiteReportingStationDefaults = "请选择上报台站";//上报台站
                this.undocumentedWebsiteWhetherToBroadcastAudiovisualPrograms = "";//是否传播视听节目
                this.undocumentedWebsiteWhetherToBroadcastAudiovisualProgramsDefaults = "请选择是否";//是否传播是同节目
                this.getUndocumentedWebsiteTabInformation();
            },

            // 分页事件
            // 当前页发生变化
            undocumentedWebsiteChange(page, pageSize){
                console.log(page, pageSize)
                this.pageNo = page;
                this.pageSize = pageSize;
                this.getUndocumentedWebsiteTabInformation();
            },
            // 每页展示的条数发生变化
            undocumentedWebsiteShowSizeChange(current, size){
                this.pageNo = current;
                this.pageSize = size;
                this.getUndocumentedWebsiteTabInformation();
                console.log(current, size)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .a-input{
        width:190px;
    }
    .date{
        display: inline-block;
        width:250px;
    }
    .ant-row{
        margin-bottom:15px;
    }
    .ant-table-wrapper{
        background: #fff;
    }
    #components-pagination-demo-mini .ant-pagination:not(:last-child) {
        margin-bottom: 24px;
    }
    .ant-pagination{
        float: right;
        margin:15px;
    }
    .ant-form-item{
        margin-bottom: 0px;
    }
</style>