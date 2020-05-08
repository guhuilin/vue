<template>
    <div>
        <div id="header">
            应急搜索任务列表
        </div>
        <!-- 搜索 -->
        <div id="shouldSearch">
            <a-form>
                <a-row>
                    <a-col :span="5">
                        <a-form-item label="任务名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                            <a-input v-model="searchMissioName"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="5">
                        <a-form-item label="创建时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                            <a-range-picker @change="onChange" v-model="clearSearchCreatedDate.startTime" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item label="关键字" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                            <a-input v-model="searchKeyWords"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item label="任务状态" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                            <a-select defaultValue="" @change="handleChange" v-model="taskStatus">
                                <a-select-option value="0">未启动</a-select-option>
                                <a-select-option value="1">已启动</a-select-option>
                                <a-select-option value="2">已完成</a-select-option>
                                <a-select-option value="3">异常</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="4">
                        <a-form-item>
                            <a-button type="primary" icon="search" style="margin-right:10px;" @click="emergencySearch">搜索</a-button>
                            <a-button @click="emergencyReset">重置</a-button>
                        </a-form-item>
                    </a-col>


                    <!-- <a-col :span="6">
                        <div>
                            <span>创建时间：</span>
                            
                        </div>
                    </a-col>
                    <a-col :span="5">
                        <div>
                            <span>关键字：</span>
                            <a-input class="searchInput" v-model="searchKeyWords"></a-input>
                        </div>
                    </a-col>
                    <a-col :span="5">
                        <div>
                            <span>任务状态：</span>
                            <a-select defaultValue="" style="width: 120px" @change="handleChange" v-model="taskStatus">
                                <a-select-option value="0">未启动</a-select-option>
                                <a-select-option value="1">已启动</a-select-option>
                                <a-select-option value="2">已完成</a-select-option>
                                <a-select-option value="3">异常</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :span="3">
                        <div>
                            <a-button type="primary" icon="search" style="margin-right:10px;" @click="emergencySearch">搜索</a-button>
                            <a-button @click="emergencyReset">重置</a-button>
                        </div>
                    </a-col> -->
                </a-row>
            </a-form>
            
        </div>
        <!-- 新建任务 -->
        <div>
            <a-button type="primary" @click="showModal">新建任务</a-button>
            <a-modal
                title="新建任务"
                :visible="visible"
                @ok="handleOk"
                :width="700"
                :maskClosable="false"
                :centered="true"
                @cancel="handleCancel"
            >
                <div style="height:490px;overflow-y: auto;">
                    <div id="emergency-mission">
                        <div>
                            <a-col :span="4">
                                <span>任务名称：</span>
                            </a-col>
                            
                            <a-input placeholder="请输入任务名称" v-model="newTaskName" class="emergency-search"></a-input>
                        </div>
                        <div>
                            <a-col :span="4">
                                <span>关键词：</span>
                            </a-col>
                            <a-input placeholder="请输入关键字" v-model="newTaskKeyword" class="emergency-search"></a-input>
                        </div>
                    </div>
                    <!-- 站内搜索多选区 -->
                    <div id="site-search">
                        <div style="float:left;width:100px;">
                            站内搜索：
                        </div>
                        <div style="float:left;width:500px">
                            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                                <a-checkbox
                                    :indeterminate="siteSearchIndeterminate"
                                    @change="siteOnCheckAllChange"
                                    :checked="siteSearchCheckAll"
                                >
                                    全选
                                </a-checkbox>
                            </div>
                            <a-checkbox-group :options="siteSearchPlainOptions" v-model="siteSearchData" @change="siteSearchOnChange" />
                        </div>
                    </div>

                    <!-- 引擎选择区 -->

                    <!-- selectEngine -->
                    <div id="search-engine">
                        <div style="float:left;width:100px;">
                            搜索引擎：
                        </div>
                        <div style="float:left;width:500px">
                            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                                <a-checkbox
                                    :indeterminate="searchEngineIndeterminate"
                                    @change="searchEngineOnCheckAllChange"
                                    :checked="searchEngineCheckAll"
                                >
                                    全选
                                </a-checkbox>
                            </div>
                            <br />
                            <a-checkbox-group :options="searchEnginePlainOptions" v-model="searchEngineData" @change="searchEngineOnChange" />
                        </div>
                    </div>
                    <!-- 本地搜索范围 -->
                     <div id="local-search-scope">
                         <div style="float:left;width:100px;">
                            本地搜索范围：
                        </div>
                        <div style="float:left;width:500px">
                            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                                <a-checkbox
                                    :indeterminate="localSearchScopeIndeterminate"
                                    @change="localSearchScopeOnCheckAllChange"
                                    :checked="localSearchScopeCheckAll"
                                >
                                    全选
                                </a-checkbox>
                            </div>
                            <br />
                            <a-checkbox-group :options="localSearchScopePlainOptions" v-model="localSearchScopeData" @change="localSearchScopeOnChange" />
                        </div>
                    </div>
                </div>
            </a-modal>
        </div>
        <!-- 表格 -->
        <div id="table">
            <a-spin
                :spinning="emergencySearchLoading"
            >
                <a-table
                    :columns="columns" 
                    :dataSource="data.records"
                    bordered
                    :pagination="false"
                >
                    <!-- <template slot="name" slot-scope="text"> -->
                        <!-- <a href="javascript:;">{{text}}</a> -->
                        <span slot="action" slot-scope="textCheck, record">
                            <a-button @click="emergencyTabDetails(record.id)" icon="snippets">详情</a-button>
                            <a-divider type="vertical"/>
                            <a-dropdown>
                                <a-menu slot="overlay">
                                    <a-menu-item key="1" @click="emergencyTabStartUp(record)">
                                        <!-- <a-icon type="edit"/> -->
                                        <img src="../../assets/Monitor-monitoring-management/end.png" alt="" style="width:30px;height:30px;">
                                        
                                        启动
                                    </a-menu-item>
                                    <a-menu-item key="2" @click="emergencyTabEnd(record)">
                                        <img src="../../assets/Monitor-monitoring-management/start.png" alt="" style="width:30px;height:30px;">
                                        <!-- <a-icon type="key"/> -->
                                        结束 
                                    </a-menu-item>
                                    <a-menu-item key="3" @click="emergencyTabDelete(record)">
                                        <a-icon type="delete"/>
                                        删除
                                    </a-menu-item>
                                </a-menu>
                                <a-button style="margin-left: 8px">
                                    更多
                                    <a-icon type="down"/>
                                </a-button>
                            </a-dropdown>
                        </span>
                    <!-- </template> -->
                </a-table>
            </a-spin>
        </div>
        <!-- 分页 -->
        <div id="pagination">
            <a-pagination 
                size="small" 
                :total="sumTotal" 
                showSizeChanger
                showQuickJumper
                :defaultPageSize="defaultPageSize"
                :pageSizeOptions="pageSizeOptions"
                @change="emergencySearchChange"
                @showSizeChange="emergencySearchShowSizeChange"
                v-model="defaultCurrent"
            />
        </div>
    </div>
</template>
<script>
    import { queryEmergencySearchInfoList , yjSearchEngine , yjSearchLocal , yjSearchSite , addEmergencySearch , delectEmergencySearch , queryEmergencyTask , endTask } from '@/api/api.js'
    const columns = [
        {
            title: '任务名称',
            dataIndex: 'taskName',
            scopedSlots: { customRender: 'name' },
        }, 
        {
            title: '关键字',
            className: 'column-money',
            dataIndex: 'keyword',
        }, 
        {
            title: '创建时间',
            dataIndex : 'createTime',
        }, 
        {
            title : '创建人',
            dataIndex : 'createor'
        },
        {
            title : '匹配结果',
            dataIndex : 'searchCount',
        },
        {
            title : '任务状态',
            dataIndex : 'tackStatus'
        },
        {
            title: '操作',
            scopedSlots: { customRender: 'action' } 
        }
    ];
    export default {   
        data(){
            return{
                // 应急搜索列表
                searchMissioName : "",//搜索任务名称
                searchCreatedDate : [],//搜索创建时间
                clearSearchCreatedDate : [],
                searchKeyWords : "",//搜索关键词
                searchTaskStatus : "",//搜索任务状态
                taskStatus : "请选择状态",
                checkedTaskStatus : "",//选中的状态
                //表格中的数据
                data : [], 
                columns,
                emergencySearchLoading : true,//表格中的Loading
                // 新建任务弹出层
                visible: false,
                newTaskName : "",//新建任务名称
                newTaskKeyword : "",//新建任务关键词
                // siteSearch
                // 站内搜索的变量
                siteSearchData : [],//选中站内搜索的数据
                siteSearchIndeterminate: true,
                siteSearchCheckAll: false,
                siteSearchPlainOptions : [],
                
                // searchEngine
                // 搜索引擎的变量
                searchEngineData : [],//选中引擎的数据
                searchEngineIndeterminate : true,
                searchEngineCheckAll : false,
                searchEnginePlainOptions : [],
            
                // 本地搜索范围
                // localSearchScope
                localSearchScopeData : [],
                localSearchScopeIndeterminate: true,
                localSearchScopeCheckAll: false,
                localSearchScopePlainOptions : [],
            
                // 分页
                pageSizeOptions : ["5","10","15","20"],
                defaultPageSize : 5,
                pageNo : 1,
                defaultCurrent : 1,
                sumTotal : 1,
                length : "",
            }
        },
        created(){
            this.emergencySearch();
            this.getSearchEngine();
            this.getLocalSearchQuery();
            this.getSiteSearch();
        },
        methods: {
            onChange(date, dateString) {
                this.searchCreatedDate = dateString
                console.log(this.searchCreatedDate);
            },

            // 弹出层的事件
            showModal() {
                this.visible = true
            },
            handleOk(e) {
                console.log(this.siteSearchData,"6666666666")
                if(this.newTaskName === ""){
                    this.$message.warning('警告：任务名称不可为空',8);
                };
                if(this.newTaskKeyword === ""){
                    this.$message.warning('警告：关键字不可以为空',8);
                };
                if(this.siteSearchData.length <= 0){
                    this.$message.warning('警告：站内搜索必须选择一项',8);
                }
                if(this.searchEngineData.length <= 0){
                    this.$message.warning('警告：搜索引擎必须选择一项',8);
                }
                if(this.localSearchScopeData.length <= 0){
                    this.$message.warning('警告：本地搜索范围必须选择一项',8);
                }
                if(this.newTaskName !== "" && this.newTaskKeyword !== "" && this.siteSearchData.length > 0 && this.searchEngineData.length > 0 && this.localSearchScopeData.length > 0){
                    // alert("全部都有数据")
                    // 在此处写ajax
                    let strSiteSearchPlainOptions = "";//站内搜索
                    let strSearchEnginePlainOptions = "";//搜索引擎
                    let strLocalSearchScopePlainOptions = "";//本地范围搜索
                    let currentUser = localStorage.pro__Login_Userinfo;//当前用户
                    console.log(JSON.parse(currentUser).value.userName)
                    // {"value":{"userId":"1","userName":"admin","fullName":"admin666","password":"2f8683f4e35ac061","mobile":null,"email":null,"sex":null,"age":null,"birthday":null,"createTime":"2019-05-31 09:47:28","createBy":null,"salt":"9UGeThx1","status":null,"avatar":"files/20190918/微信截图_20190918131638_1568784180015.png","delFlag":null,"updateBy":null,"updateTime":"2019-09-18 13:23:00","activitiAsync":null,"orgCode":null,"roleId":null,"departId":null},"expire":1570337853173}
                    for(let i = 0 ; i < this.siteSearchData.length ; i ++){
                        strSiteSearchPlainOptions += this.siteSearchData[i] + ",";
                    }
                    console.log(strSiteSearchPlainOptions,this.siteSearchData)
                    for(let i = 0 ; i < this.searchEngineData.length ; i ++){
                        strSearchEnginePlainOptions += this.searchEngineData[i] + ",";
                    }
                    for(let i = 0 ; i < this.localSearchScopeData.length ; i ++){
                        strLocalSearchScopePlainOptions += this.localSearchScopeData[i] + ",";
                    }

                    console.log(strSiteSearchPlainOptions.substring(0,strSiteSearchPlainOptions.length - 1),strSearchEnginePlainOptions.substring(0,strSearchEnginePlainOptions.length - 1),strLocalSearchScopePlainOptions.substring(0,strLocalSearchScopePlainOptions.length - 1),"7777777777777777777")
                    addEmergencySearch({
                        taskName : this.newTaskName,//任务名称
                        keyword : this.newTaskKeyword,//关键字
                        siteRange : strSiteSearchPlainOptions.substring(0,strSiteSearchPlainOptions.length - 1),
                        searchRange : strSearchEnginePlainOptions.substring(0,strSearchEnginePlainOptions.length - 1),
                        searchType : strLocalSearchScopePlainOptions.substring(0,strLocalSearchScopePlainOptions.length - 1),
                        createor :  JSON.parse(currentUser).value.userName,
                    }).then((res)=>{
                        console.log(res)
                        this.emergencySearch();
                        
                    })
                    this.handleCancel();
                }
                // this.visible = false
            },
            // 弹出层中的取消事件
            handleCancel(e){
                this.newTaskName = "";//任务名称
                this.newTaskKeyword = "";//关键字
                //站内搜索
                this.siteSearchData = [];
                this.siteSearchIndeterminate = true;
                this.siteSearchCheckAll = false;
                // 搜索引擎
                this.searchEngineData = [];
                this.searchEngineIndeterminate = true;
                this.searchEngineCheckAll = false;
                //本地搜索范围
                this.localSearchScopeData = [];
                this.localSearchScopeIndeterminate = true;
                this.localSearchScopeCheckAll = false;
                console.log(this.newTaskName,this.newTaskKeyword,this.siteSearchData,this.searchEngineData,this.localSearchScopeData)
                this.visible = false;
            },
            // 表格中的增删改查
            // 详情
            emergencyTabDetails(value){
                console.log(value,"我是value")
                this.$router.push({
                    path: "/emergencySearchTaskDetails",
                    query : {
                        id : value
                    }
                });
            },
            error(startUpAndNotStartUp) {
                if(startUpAndNotStartUp === 1){
                    this.$message.error('当前任务已经启动，无法再次启动');
                }else if(startUpAndNotStartUp === 0){
                    this.$message.error('当前任务已经未启动，无法结束');
                }
                
            },
            // 启动
            emergencyTabStartUp(value){
                if(value.tackStatus === "已启动"){
                    this.error(1);
                }else{
                    queryEmergencyTask({
                        id : value.id
                    }).then((res)=>{
                        this.emergencySearch();
                        console.log(res);
                    })
                }
            },
            // 结束
            emergencyTabEnd(value){
                if(value.tackStatus === "未启动"){
                    this.error(0);
                    
                }else{
                    endTask({
                        id : value.id
                    }).then((res)=>{
                        this.emergencySearch();
                        console.log(res);
                    })
                }
                console.log(value)
                
            },
            // 删除
            emergencyTabDelete(value){
                let that = this;
                this.$confirm({
                        title: '提示',
                        content: '确定要删除这条任务吗？',
                        okText: '确定',
                        cancelText: '取消',
                        okType: 'danger',
                        
                    onOk() {
                        if (that.length <= 1) {
                            that.pageNo --;
                        };
                        delectEmergencySearch({
                            id : value.id
                        }).then((res)=>{
                            // console.log(res);
                            that.emergencySearch();
                        })
                    },
                    onCancel() {
                        // console.log('Cancel');
                    },
                });
            },
            // 分页
            emergencySearchChange(page,pageSize){
                console.log(page)
                this.pageNo = page;//当前页
                this.defaultPageSize = pageSize;//每页显示的条数
                this.emergencySearch();
            },
            // 每页显示的条数发生变化的事件
            emergencySearchShowSizeChange(current,size){
                this.pageNo = current;//当前页
                this.defaultPageSize = size;//每页显示的条数
                this.emergencySearch();
                console.log(current,size)
            },
            // 应急搜索按钮的事件
            emergencySearch(){
                console.log(this.checkedTaskStatus,"选中状态")
                this.emergencySearchLoading = true
                queryEmergencySearchInfoList({
                    taskName : this.searchMissioName,
                    startTime : this.searchCreatedDate[0],
                    endTime : this.searchCreatedDate[1],
                    keyword : this.searchKeyWords,
                    tackStatus : this.checkedTaskStatus,
                    pageNo : this.pageNo,
                    pageSize : this.defaultPageSize
                }).then((res)=>{
                    if(res.success){
                        this.length = res.result.records.length;
                        for(let i = 0 ; i < res.result.records.length ; i ++){
                            if(res.result.records[i].tackStatus === "0"){
                                res.result.records[i].tackStatus = "未启动";
                            }else if(res.result.records[i].tackStatus === "1"){
                                res.result.records[i].tackStatus = "已启动";
                            }else if(res.result.records[i].tackStatus === "2"){
                                res.result.records[i].tackStatus = "已完成";
                            }else if(res.result.records[i].tackStatus === "3"){
                                res.result.records[i].tackStatus = "异常";
                            }
                        };
                        this.data = res.result;
                        this.sumTotal = res.result.total;
                        this.defaultCurrent = res.result.current
                        let that = this;
                        setTimeout(function(){
                            that.emergencySearchLoading = false;
                        },1000)
                        console.log(res,"9999999999");
                    }
                    if(res.result.records.length <= 0){
                        if(this.searchMissioName !== "" || this.searchCreatedDate.length !== 2 || this.searchKeyWords !== "" || this.checkedTaskStatus !== ""){
                            if(this.pageNo !== 1){
                                this.pageNo = 1;
                                this.emergencySearch();   
                            }
                        }      
                    }
                    
                    // console.log(this.emergencySearchLoading,"9999999999999999");
                })
                // console.log(this.data,this.defaultPageSize)
                // console.log(typeof this.searchMissioName,typeof this.searchCreatedDate,typeof this.searchKeyWords,typeof this.checkedTaskStatus)
            },
            // 应急搜索的重置按钮事件
            emergencyReset(){
                this.searchMissioName = "";//任务名称
                this.searchCreatedDate = "";//创建时间
                this.clearSearchCreatedDate = [];
                this.searchKeyWords = "";//关键字
                this.searchTaskStatus = "";//任务状态
                this.taskStatus = "请选择状态";
                this.checkedTaskStatus = "";
                this.emergencySearch();
                console.log(this.searchCreatedDate)
            },
            // 任务状态下拉框
            handleChange(value) {
                this.checkedTaskStatus = value;
                // console.log(value);
            },
            // 搜索引擎
            getSearchEngine(){
                yjSearchEngine().then((res)=>{
                    for(let i = 0 ; i < res.result.length ; i ++){
                        this.searchEnginePlainOptions.push(res.result[i].name)
                    }
                    console.log(res,"我是搜索引擎")
                })
            },
            // 本地搜索范围
            getLocalSearchQuery(){
                yjSearchLocal().then((res)=>{
                    for(let i = 0 ; i < res.result.length ; i ++){
                        this.localSearchScopePlainOptions.push(res.result[i].name)
                    }
                    console.log(res,"我是本地查询");
                })
            },
            // 站内搜索
            getSiteSearch(){
                yjSearchSite().then((res)=>{
                    for(let i = 0 ; i < res.result.length ; i ++){
                        this.siteSearchPlainOptions.push(res.result[i].name)
                    }
                    console.log(res);
                })
            },
            // 站内搜索的事件
            siteSearchOnChange (siteSearchData) {
                console.log(siteSearchData)
                this.siteSearchIndeterminate = !!siteSearchData.length && (siteSearchData.length < this.siteSearchPlainOptions.length)
                this.siteSearchCheckAll = siteSearchData.length === this.siteSearchPlainOptions.length
            },
            siteOnCheckAllChange (e) {
                console.log(e.target.checked)
                Object.assign(this, {
                    siteSearchData: e.target.checked ? this.siteSearchPlainOptions : [],
                    siteSearchIndeterminate: false,
                    siteSearchCheckAll: e.target.checked,
                })
                console.log(this.siteSearchData)
            },
            // 搜索引擎的事件
            searchEngineOnChange (searchEngineData) {
                this.searchEngineIndeterminate = !!searchEngineData.length && (searchEngineData.length < this.searchEnginePlainOptions.length)
                this.searchEngineCheckAll = searchEngineData.length === this.searchEnginePlainOptions.length
                // console.log(searchEngineData)
            },
            searchEngineOnCheckAllChange (e) {
                Object.assign(this, {
                    searchEngineData: e.target.checked ? this.searchEnginePlainOptions : [],
                    searchEngineIndeterminate: false,
                    searchEngineCheckAll: e.target.checked,
                })
                // console.log(this.searchEngineData)
            },
            // 本地搜索范围
            localSearchScopeOnChange (localSearchScopeData) {
                this.localSearchScopeIndeterminate = !!localSearchScopeData.length && (localSearchScopeData.length < this.localSearchScopePlainOptions.length)
                this.localSearchScopeCheckAll = localSearchScopeData.length === this.localSearchScopePlainOptions.length;
                console.log(localSearchScopeData)
            },
            localSearchScopeOnCheckAllChange (e) {
                Object.assign(this, {
                    localSearchScopeData: e.target.checked ? this.localSearchScopePlainOptions : [],
                    localSearchScopeIndeterminate: false,
                    localSearchScopeCheckAll: e.target.checked,
                });
                console.log(this.localSearchScopeData)
            },
        },
    }
</script>

<style lang="scss" scoped>
    #header{
        height: 60px;
        background: #fff;
        line-height: 60px;
        font-size: 18px;
        margin-bottom: 20px;
    }
    #shouldSearch{
        padding: 20px 0px;
        background: #fff;
        margin-bottom: 20px;
    }
    // #shouldSearch{
    //     // height: 124px;
    //     background: #fff;
    //     margin-bottom: 20px;
        .searchInput{
            width:180px;
            // display: inline-block;
        }
    //     >div{
    //         // float: left;
    //         display: inline-block;
    //         margin:0 10px;
    //         margin-top:24px;
    //     }
    // }
    #table{
        background : #fff;
    }
    #emergency-mission{
        >div{
            margin:10px 0px;
        }
        .emergency-search{
            width:180px;
        }
    }   
    #site-search{
        // height:240px;
        background: #fff;
        float: left;
        margin-bottom: 30px;
        // .ant-checkbox-group{
        //     height:240px;
        //     overflow-y: auto;
        // }
    }
    #search-engine{
        // height:200px;
        background:#fff;
        float: left;
        margin-bottom: 30px;
        // .ant-checkbox-group{
        //     height:240px;
        //     overflow-y: auto;
        // }
    }
    #local-search-scope{
        // height:200px;
        float: left;
        background:#fff;
        // margin-bottom: 30px;
        // .ant-checkbox-group{
        //     height:240px;
        //     overflow-y: auto;
        // }
    }
    th.column-money,
    td.column-money {
        text-align: right !important;
    }
    #components-pagination-demo-mini .ant-pagination:not(:last-child) {
        margin-bottom: 24px;
    }
    #pagination{
        .ant-pagination{
            margin: 20px 20px 0 0 ;
            float: right;
        }
    }
    .ant-form-item{
        margin-bottom: 0px;
    }
</style>

<style scoped>
    >>>.ant-checkbox-group-item{
        width:120px;
        margin:10px 0px;
    }
    /* >>>.ant-row{
        margin:0px !important;
        float: left;
    } */
    >>>.ant-modal-body{
        height:580px;
        overflow-y: auto;
    }
</style>