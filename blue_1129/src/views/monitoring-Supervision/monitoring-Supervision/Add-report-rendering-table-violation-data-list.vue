<template>
<!-- 附件 -->
    <div class="tab">
        <a-tabs  @change="callback" type="card" >
            <a-tab-pane style="" v-for="value in attachmentSwitch" :tab="value.typeName" :key="value.id">
                <!-- 搜索功能 -->
                <div class="attachment-table">
                    <div class="search">
                        <a-form>
                            <a-row>
                                <a-col :span="6" v-for="value in serachValue">
                                    <a-form-item :label="value.fieldName" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                                        <a-input  class="searchInput" ref="searchInput" type="text"></a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="6">
                                    <a-form-item>
                                        <a-button type="primary" icon="search" @click="serach">搜索</a-button>
                                        <a-button style="margin-left:20px" @click="reset">重置</a-button>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>
                </div>
                <div style="height: 60px;background: #fff;">
                    
                    <violationListAddReport @onChangePageNo="onChangePageNo" @changeSpinning="changeSpinning" :pageNo="pageNo" :spinning="spinning" :getAttachmentFormInformation="getAttachmentFormInformation" ref="addReport" :attachmentHeaderValue="attachmentHeaderValue" :code="code">
                        <!--添加纪录模块 -->
                    </violationListAddReport>
                </div>
                <div class="annex">
                        <a-spin 
                            :spinning="spinning"
                        >
                            <a-table :pagination="false" :bordered="true" :columns="attachmentHeader" :dataSource="attachmentInformation">
                                <span slot="action" slot-scope="textCheck, record">
                                    <a-button @click="handleEdit(record, 'edit')" icon="edit">编辑</a-button>
                                    <a-divider type="vertical"/>
                                    <a-dropdown>
                                        <a-menu slot="overlay">
                                            <a-menu-item key="1" @click="">
                                                <a-icon type="snippets"/>
                                                详情
                                            </a-menu-item>
                                            <a-menu-item key="2" @click="">
                                                <a-icon type="key"/>
                                                处理
                                            </a-menu-item>
                                            <a-menu-item key="3" @click="handleDelete(record)">
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
                                
                            </a-table>
                        </a-spin>
                    
                        <div>
                            <a-modal
                                :centered="true"
                                title="编辑"
                                :visible="visible"
                                @ok="handleOk"
                                :confirmLoading="confirmLoading"
                                @cancel="handleCancel"
                                :maskClosable="false"
                            >
                                <div class="contant">
                                    <div style="float:left">
                                        <p v-for="value in attachmentHeaderOne" style="height:36px;line-height:36px">
                                        <span>
                                            {{value.title}}：
                                        </span>
                                        <!-- <a-input :value="value" v-for="value in modifyAttachmentInformation"/> -->
                                    </p>
                                    </div>
                                    
                                    <div style="float:left">
                                        <div v-for="value in dataArr">
                                            <!-- <div contenteditable="true" ref="editValue" style="content: attr(placeholder);margin-bottom: 1em; border: 1px solid #d9d9d9;border-radius: 4px;width:200px;line-height:32px">
                                                {{value}}
                                            </div> -->
                                            <input class="attachment-editing-popup-layer" type="text" :value="value"  ref="editValue">
                                            <!-- <a-input ref="editValue" :value="value"/> -->
                                        </div>
                                    </div>
                                    
                                </div>
                            </a-modal>
                        </div>
                    <div style="height:60px;margin:14px;">
                        <a-pagination
                        style="float:right;"
                        v-model="annexCurrent"
                        size="small"
                        :defaultPageSize="5"
                        :defaultCurrent="pageNo" 
                        :total="pageSum" 
                        :pageSizeOptions="a"
                        showSizeChanger 
                        showQuickJumper
                        @showSizeChange="onShowSizeChange"
                        @change="pageChange"/>  
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import {queryReportFieldModel,execUpdateSql,execSelectOne , execDeleteSql , queryReportAppendTypeModelBean , exceSelectByMap, queryReportTableInfoListtype,queryFieldTypeListvoe,queryReportTableShowInfomoban,queryReportAppendTypeModel} from '@/api/api'
    import violationListAddReport from './Violation-list-add-report'//添加纪录模块

    // import index from './index.vue'

    import bus from '../bus/bus.js'
    const columns = [
        {
            title: 'id',
            dataIndex: 'name',
            // key: 'name' 
        },
        {
            title: '网站名称',
            // dataIndex: 'age',
            // key: 'age' 
        },
        {
            title: '境外内容',
            // dataIndex: 'address',
            // key: 'address' 
        },
        {
            title: '传播时政新闻',
        },
        {
            title: '低俗', 
        },
        {
            title: '发布时间', 
        },
        {
            title: '超出范围', 
        },
        {
            title: '取证', 
        },
        {
            title: '状态', 
        },
        {
            title: '操作', 
            scopedSlots: { customRender: 'action' } 
        },
    ];

    const data = [
        {
            key: 1,
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' 
        },
        {
            key: 2,
            name: 'Jim Green',
            age: 42, address: 'London No. 1 Lake Park',
            description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' 
        },
        {
            key: 3,
            name: 'Joe Black',
            age: 32, address: 'Sidney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' 
        },
    ];
    export default {
        data () {
            return {
                annexCurrent : 1,
                attachmentNumber : "",//编辑附件中的ID
                attachmentNumberValue : "",//编辑附件中的ID里面的值
                id : "",
                clearRecordingTime : {},
                programTitle : "",//请输入节目名称绑定
                keyWord : "",//请输入关键字绑定
                data,
                columns,
                recordingTime : null,//记录时间
                pageNo : 1,
                pageSize : 5,
                a : ['5', '10', '20', '30'],
                pageSum : 1,
                listInfo : [],
                value : "",
                attachmentSwitch : [],//tab切换的数据
                headerID : null,//tab切换的ID
                attachmentHeader : [],//附件表头的列表
                attachmentHeaderValue : [],//这个也是附件的表头
                headerName : "",
                code : "",
                attachmentInformation : [],//附件里面的信息
                //附件弹出层
                ModalText: 'Content of the modal',
                visible: false,
                confirmLoading: false,
                // 修改附件信息
                modifyAttachmentInformation : [],
                spinning : true,//加载中
                attachmentHeaderOne : [],
                str : "",
                dataArr : [],
                dataStr : "",
                value : [],

                // 搜索的信息
                serachValue : [],
                serachTitle : [],
                obj : {
                    
                },

                attachmentInformationObj : {

                },

                // annexCurrent : 1,
            }
        },
        components : {
            violationListAddReport,
            // index,
        },
        created(){
            this.id = this.$route.query.id;
        },
        methods: {
            onChangePageNo(){
                this.pageNo = 1;
                this.annexCurrent = 1;
            },
            changeSpinning(){
                this.spinning = true;
            },
            // 编辑事件
            handleEdit(value) {
                // console.log(value,"编辑")
                this.attachmentNumberValue = value.ID;
                this.value = value;
                // console.log(Object.keys(this.value)[0],"6666")
                this.attachmentHeaderOne.splice(0);
                this.str = "";
                this.dataArr = [];
                this.dataStr = ""
                for(let i = 0 ; i < this.attachmentHeader.length ; i++){
                    if(this.attachmentHeader[i].title === "编号"){
                        // console.log(this.attachmentHeader[i],"编号");
                        this.attachmentNumber = this.attachmentHeader[i].dataIndex;
                    }
                    if(this.attachmentHeader[i].title !== "操作" && this.attachmentHeader[i].title !== "编号"){
                        this.attachmentHeaderOne.push(this.attachmentHeader[i])
                    }
                    // console.log(this.attachmentHeaderOne,"one")
                }
                // console.log(this.attachmentHeaderOne,"one")
                for(let i = 0 ; i < this.attachmentHeaderOne.length ; i ++){
                    this.str += this.attachmentHeaderOne[i].dataIndex + ","
                    // this.dataStr += this.str.substring(0,this.str.length-1)
                    
                }
                execSelectOne({
                    tableName : this.code,
                    queryColumns : this.str.substring(0,this.str.length-1),
                    ID : value.ID
                }).then((res)=>{
                    delete res.result.ID;
                    this.dataArr = res.result;
                    // console.log(res,"数据有吗？？")
                })
                // console.log(this.code,this.dataStr,value.ID,"传过去的数据",this.value)
                this.visible = true
            },
            // 点击确定后的事件
            handleOk(e) {
                // console.log(this.attachmentNumberValue,"ID里面的值")
                this.spinning = true;
                let obj = {};
                for(let i = 0 ; i < this.$refs.editValue.length ; i ++){
                    // console.log(this.$refs.editValue[i],"isShow")
                }
                // console.log(this.$refs.editValue)
                for(let j = 0 ; j < this.attachmentHeaderOne.length ; j ++){
                    // console.log(this.attachmentHeaderOne[j].dataIndex)
                    for(let i = 0 ; i < this.$refs.editValue.length ; i ++){
                        // console.log(this.$refs.editValue[i].value);
                        if(j === i){
                            obj.PRIMARYKEY = Object.keys(this.value)[0]
                            obj[this.attachmentHeaderOne[j].dataIndex] = this.$refs.editValue[i].value
                            obj.tableName = this.code
                            obj[this.attachmentNumber] = this.attachmentNumberValue;
                        }
                    }
                }
                // console.log(obj,"我是obj")
                // console.log(this.$refs.editValue)
                execUpdateSql(obj).then((res)=>{
                    // console.log(res);
                    this.getAttachmentFormInformation()
                    this.visible = false;
                })
            },
            handleCancel(e) {
                // console.log('Clicked cancel button');
                this.visible = false
            },
            // 删除功能
            handleDelete(value){
                // console.log(this)\
                let that = this;
                this.$confirm({
                        title: '提示',
                        content: '确定要删除这条附件吗？',
                        okText: '确定',
                        cancelText: '取消',
                        okType: 'danger',
                        
                    onOk() {
                        // console.log(that);
                        that.spinning = true;
                        // this.pageNo = 1;
                        if(that.attachmentInformation.length <= 1){
                            that.pageNo --;
                        }
                        // console.log(this.pageNo,this.attachmentInformation,"当前页")
                        // console.log( value ,this.code,Object.keys(value)[0],value.ID,"呵呵")
                        execDeleteSql({
                            tableName : that.code,
                            PRIMARYKEY : Object.keys(value)[0],
                            ID : value.ID
                        }).then((res)=>{
                            
                            // console.log(res,"我是删除")
                            that.getAttachmentFormInformation();
                            // this.annexCurrent = 1
                            that.spinning = false;
                            that.annexCurrent =that.pageNo;
                        })
                    },
                    onCancel() {
                        // console.log('Cancel');
                    },
                });
                // this.spinning = true;
                // // this.pageNo = 1;
                // if(this.attachmentInformation.length <= 1){
                //     this.pageNo --;
                // }
                // // console.log(this.pageNo,this.attachmentInformation,"当前页")
                // // console.log( value ,this.code,Object.keys(value)[0],value.ID,"呵呵")
                // execDeleteSql({
                //     tableName : this.code,
                //     PRIMARYKEY : Object.keys(value)[0],
                //     ID : value.ID
                // }).then((res)=>{
                    
                //     // console.log(res,"我是删除")
                //     this.getAttachmentFormInformation();
                //     // this.annexCurrent = 1
                //     this.spinning = false;
                //     this.annexCurrent = this.pageNo;
                // })
                // console.log(value,"我是删除")
            },
            // 附件编辑功能
            // handleEdit(value){
            //     console.log(value)
            // },
            // 重置按钮事件
            reset(){
                for(let j = 0 ; j < this.serachValue.length ; j ++){
                    // console.log(this.serachValue[j].fieldcode,"我是什么呢？？？")
                    for(let i = 0 ; i < this.$refs.searchInput.length ; i ++){
                        this.$refs.searchInput[i].value = ""
                        if(j === i){
                            this.attachmentInformationObj[this.serachValue[j].fieldcode] = this.$refs.searchInput[i].value
                        }
                    }
                }
            },
            // 当前页
            pageChange(v){
                this.spinning = true;
                this.pageNo = v;
                this.annexCurrent = v;
                // console.log(v,"dang")
                this.getAttachmentFormInformation()
            },
            // 更改每页显示的条数
            onShowSizeChange(current, pageSize) {
                this.spinning = true;                
                this.pageNo = current;
                this.pageSize = pageSize;
                this.annexCurrent = current;
                this.getAttachmentFormInformation();
                //  console.log(current, pageSize,"当前页与每页显示的条数")
            },
            // 获取搜索的功能
            getSearch(){
                // console.log(this.obj,"5555555555")
                queryReportFieldModel(this.obj).then((res)=>{
                    this.serachValue = res.result;
                    // console.log(res,"我是搜索")
                })
            },
            // 点击搜索的功能
            serach(){
                // console.log(this.$refs.searchInput)
                let str = "";
                for(let k = 0 ; k < this.$refs.searchInput.length ; k ++){
                    // console.log(this.$refs.searchInput[k].value,"搜索的input")
                    if(this.$refs.searchInput[k].value === ""){
                        // console.log("1111")
                        str++;
                    }
                }
                if(str !== this.$refs.searchInput.length){
                    // alert("有一个里面有数据")
                }else{
                    // alert("都没有数据")
                }
                // console.log(str,"str",this.$refs.searchInput.length,"length");
                this.spinning = true;
                for(let i = 0 ; i < this.serachValue.length ; i ++){
                    // console.log(this.serachValue[i].fieldcode)
                    for(let j = 0 ; j < this.$refs.searchInput.length ; j ++){
                        // console.log(this.$refs.searchInput[j].value);
                        // if(this.$refs.searchInput[j].value === ""){
                        //     this.$refs.searchInput[j].value = null;
                        //     console.log("1")
                        // }
                        if( i === j ){
                            this.obj[this.serachValue[i].fieldcode] = this.$refs.searchInput[j].value;
                            this.attachmentInformationObj[this.serachValue[i].fieldcode] = this.$refs.searchInput[j].value
                        }
                    }
                }
                // console.log(this.attachmentInformationObj,1)
                this.getAttachmentFormInformation();
                // this.getSearch();
            },





            
            callback (key) {
                this.spinning = true;
                this.headerID = key;
                this.pageNo = 1;
                // console.log(this.code,"我是code")
                this.getHeaderOfTheAttachment();
                this.getTheSwitchedCode();
                // this.getAttachmentFormInformation()
            },
            onChange(date, dateString) {
                this.recordingTime = dateString
                // console.log(date, dateString);
            },
            // 获取附件的表头
            getHeaderOfTheAttachment(){
                // console.log(this.headerID,"我是ID??????")
                queryFieldTypeListvoe({
                    id : this.headerID,
                }).then((res)=>{
                    this.attachmentHeaderValue = res
                    // console.log(res,"我才是附件的表头")
                    this.attachmentHeader = res.result;
                    this.serachTitle = res.result;
                    // for(let i = 0 ; i < this.attachmentHeader.length ; i ++){
                    //     this.attachmentHeader[i].width = 200
                    // }
                    this.attachmentHeader.push({
                        title : "操作",
                        scopedSlots: { customRender: 'action' },
                        width:280
                     })
                    //  console.log(res.result,"我才是附件的表头")
                    //  bus.$emit("header",res.result)
                    // console.log(this.attachmentHeaderValue,"我是附件表头");
                    for(let i = 0 ; i < this.serachTitle.length ; i ++){
                        if(this.serachTitle[i].title === "操作"){
                            // this.serachTitle.pop();
                        }
                        // console.log(this.serachTitle[i].title,"我是附件的表头")
                    }
                    // this.getAttachmentFormInformation();
                })
            },
            // 获取附件里面的code
            getTheSwitchedCode(){
                // console.log(this.headerID,"我是真正的ID")
                queryReportAppendTypeModelBean({
                   id : this.headerID
                }).then((res)=>{
                    this.code = res.result[0].code;
                    this.getAttachmentFormInformation();
                    // 将这个code值传递到join-the-report.vue中
                    // bus.$emit("code",this.code);
                    // console.log(this.code,"我是code")
                })
            },
            // 根据code获取附件里面的信息
            getAttachmentFormInformation(){
                this.spinning = true;
                // console.log(this.attachmentHeader,"我是code222222222222")
                // let str = ""
                // for(let i = 0 ;i < this.attachmentHeader.length ; i ++){
                //     str += this.attachmentHeader
                // }
                // console.log(this.headerName,"啊哈哈哈哈")
                // console.log(this.pageNo,"NO")
                // this.annexCurrent = 1
                this.attachmentInformationObj.start = this.pageNo;
                this.attachmentInformationObj.limit = this.pageSize;
                this.attachmentInformationObj.tableName = this.code;
                exceSelectByMap(this.attachmentInformationObj).then((res)=>{
                    if(res.result !== null){
                        // console.log(res,"我是附件信息"); 
                        this.pageSum = res.result.count;
                        this.attachmentInformation = res.result.data;  
                        this.spinning = false;
                        // console.log(res,"我是附件信息"); 
                    }else{
                        this.spinning = false;
                    }
                    
                })
                this.annexCurrent = 1;
            }
            
        },
        mounted(){
            queryReportAppendTypeModel({
                reportId : this.id
            }).then((res)=>{
                // console.log(res,"我是")
                // bus.$emit("attachmentSwitch",res.result)
                this.attachmentSwitch = res.result
                this.headerID = res.result[0].id
                // this.code = res.result[0].code
                this.obj.id = res.result[0].id
                this.headerName = res.result[0].typeName
                this.getSearch();
                this.getTheSwitchedCode();
                this.getHeaderOfTheAttachment();
                
                this.getAttachmentFormInformation();
                
                
            })
        },
    }
</script>

<style lang="scss" scoped>
    .searchInput{
        border: 1px solid #ccc;
        border-radius: 4px;
        height: 32px;
        padding: 4px 11px;
    }
    .searchInput:hover{
        border-color: #40a9ff;
        border-right-width: 1px !important;
    }
    .searchInput:focus {
        border-color: #40a9ff;
        outline: 0;
        -webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        border-right-width: 1px !important;
    }
    .contant{
        height: 400px;
        overflow-y: auto;
    }
    .ant-tabs-nav-scroll{
        height: 600px;
    }
    $margin:20px 20px;
    .tab{
        margin: $margin;
        .attachment-table{
            padding: 15px;
            background: #fff;
            // height: 50px;
            // border-bottom: 1px solid #ccc;
            .search{
                // height:100%;
                // >div{
                //     float: left;
                //     margin:0 30px;
                // }
            }
        }
        .annex{
            background: #fff;
            >ul{
                margin:20px 0;
                float: right;
                margin-right: 30px;
            }
        }
    }
    .attachment-editing-popup-layer{
        content: attr(placeholder);
        margin-bottom: 1em;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        width:200px;
        line-height:32px;
    }
    .attachment-editing-popup-layer:hover{
        // border-color: #40a9ff !important;
        border-right-width: 1px !important;
    }
    .attachment-editing-popup-layer:focus{
        border-color: #40a9ff !important;
        outline: 0;
        -webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        border-right-width: 1px !important;
    }
</style>

<style scoped>
    >>>.ant-tabs.ant-tabs-card .ant-tabs-tab-active{
        background: rgb(88,104,217) !important;
        color: #ffffff;
    }

    >>>.ant-tabs-nav .ant-tabs-tab:hover{
        /* color:black !important; */
        color:"";
    }
    >>>.ant-tabs{
        /* background: #fff; */
    }
    >>>.ant-table-body{
        overflow-x: auto;
    }
    >>>.ant-tabs-nav-container{
        margin:0;
    }
    >>>.ant-tabs-bar{
        border:0;
        margin:0;
    }
</style>