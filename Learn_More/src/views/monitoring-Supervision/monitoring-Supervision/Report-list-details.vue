<template>
            <!-- 点击报告列表的详情进入的页面 -->
    <div class="report-list-details">
        <globalheader>
            <div class="over">
                <div style="font-size:18px;font-size: 18px;margin:0px 20px 10px 20px;line-height: 64px;position:relative;background:#fff;padding:0px 5px">
                    违规节目和附件信息
                    <a-button type="primary" style="position: absolute;right: 45px;top: 18px;" @click="backToPrevious">
                        返回
                    </a-button>
                </div>
                <!-- 进入疑似违规数据列表搜索功能 -->
                <div class="search">
                    <a-form>
                        <a-row>
                            <a-col :span="6" v-for="value in programSearchDataList">
                                <a-form-item :label="value.fieldName" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
                                    <a-input ref="searchValue" :placeholder="value.fieldName"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item>
                                    <a-button type="primary" icon="search" @click="search">搜索</a-button>
                                    <a-button style="margin-left:10px" @click="reset">重置</a-button>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
                <suspectedViolationDataList @changePageFather="changePageFather" :pageNo="pageNo"  @programDataSmall="programDataSmall" ref="changeConfirmLoading" @getShowTableListSun="getShowTableList" @selectedData="selectedData" @getShowTableList="getShowTableList">
                    <!-- 这个组件中有手动处理报告和报告列表的功能 -->
                </suspectedViolationDataList>
                <!-- <joinTheReport :selectedDataValue="selectedDataValue" @father="father">
                    加入到报告的按钮组件1
                </joinTheReport> -->
                <addReportRenderingTableViolationDataList ref="name">
                    <!-- 违规数据列表添加报告后渲染的表格 -->
                </addReportRenderingTableViolationDataList>
            </div>
        </globalheader>
        
    </div>
</template>
<script>
    import globalheader from "@/components/page/GlobalLayout.vue";
    import suspectedViolationDataList from "./Suspected-violation-data-list.vue"
    import joinTheReport from './Join-the-report'//加入到报告的按钮组件
    import addReportRenderingTableViolationDataList from './Add-report-rendering-table-violation-data-list'//违规数据列表添加报告渲染表格
    import { querySuspectVideoList , querySuspectVideoHarmTypeList , exceSelectByMap , queryReportFieldModeljie } from "@api/api";
    import bus from '../bus/bus.js'
    export default {
        name : "reportListDetails",
        data(){
            return{
                clearRecordingTime : {},
                programName : "",//节目名称
                keyWord : "",//关键字
                harmfulType : "",//有害类型下拉框
                recordingTime : "",//记录的时间
                pageNo : 1,//当前页
                pageSize : 5,
                id : "",
                HarmfulTypeBox : [],
                HarmfulTypeDefaultValue : "请选择",
                // 选中的数据
                selectedDataValue : [],
                programCode : "",
                // 节目搜索的数据（不是input框里面的内容，而是后台人员返回搜索的内容）
                programSearchDataList : [],
            }
        },
        // SuspectedViolationDataList
        // 引入的组件
        components : {
            globalheader,
            suspectedViolationDataList,
            joinTheReport,
            addReportRenderingTableViolationDataList
        },
        created(){
            bus.$on("programReportCode",data=>{
                this.programCode = data[0].code;
                // console.log(data,"code值")
                // this.$refs.changeConfirmLoading.confirmLoading = true;
                let that = this;
                setTimeout(function(){
                    that.getShowTableList();
                },10)
            });
            this.getClickDetailsPassed();//获取点击详情传递过来的ID
            this.getProgramSearch();//获取搜索
        },
        methods: {
            backToPrevious(){
                this.$router.push({
                    path: "/managementDetails", //路径
                    query: {
                        // id: value.reportTableId, //点击详情的时候获取id并且传递到详情页面的ID
                        propertyTableId: this.$route.query.propertyTableId,
                        valueTabDomainName : this.$route.query.valueTabDomainName,
                        valueReportTypeName : this.$route.query.valueReportTypeName,
                        itemTypeName : this.$route.query.itemTypeName,
                        itemReportTypeId : this.$route.query.itemReportTypeId,
                        name : this.$route.query.name,
                        management : this.$route.query.management,
                        valueTabId : this.$route.query.valueTabId
                    }
                });
                console.log(this.$route.query.valueTabDomainName,this.$route.query.valueReportTypeName,this.$route.query.itemTypeName,this.$route.query.itemReportTypeId,this.$route.query.name,this.$route.query.management,"---------------------");
            },
            // 这个事件是孙子组件要改变我的pageNo的事件，（要判断在数据只有一条的时候，我将数据删除，
            // 然后我再添加数据的时候出现没有数据的情况的一个函数
            // ）
            changePageFather(){
                // alert("祖先也执行了")
                this.pageNo += 1;
                this.getShowTableList();
            },
            // 获取节目的搜索
            getProgramSearch(){
                queryReportFieldModeljie({
                    id : this.id,
                }).then((res)=>{
                    this.programSearchDataList = res.result;
                    // console.log(res,"我是搜索");
                })
            },
            programDataSmall(){
                // console.log("我执行了吗？？")
                this.pageNo -= 1;
                this.getShowTableList();
            },
            // 获取节目表格中的数据（list）
            getShowTableList(){
                // console.log(this.$refs.searchValue,"搜索66666")
                // if(this.$refs.searchValue !== undefined){
                //     let str = null;
                //     let obj = {};
                //     for(let i = 0 ; i < this.$refs.searchValue.length ; i ++){
                //         for(let j = 0 ; j < this.programSearchDataList.length ; j ++){
                //             if(i === j){
                //                 obj.tableName = this.programCode;
                //                 obj.start = this.pageNo;
                //                 obj.limit = this.pageSize;
                //                 obj[this.programSearchDataList[j].fieldcode] = this.$refs.searchValue[i].$el.value
                //             }
                //         }
                //         if(this.$refs.searchValue[i].$el.value === ""){
                //             str += 1;
                //         }
                //     }
                //     console.log(obj,"-----------------------")
                    if(this.$refs.changeConfirmLoading === undefined){
                        // this.$refs.changeConfirmLoading.confirmLoading = true;
                    }else{
                        this.$refs.changeConfirmLoading.confirmLoading = true;
                    }
                    
                //     exceSelectByMap(obj).then((res)=>{
                //         console.log(res,"========================")
                //         if(str < this.$refs.searchValue.length && res.result.data.length <= 0 && this.pageNo !== 1){
                //             this.pageNo = 1;
                //             this.getShowTableList();
                //         }
                //         if (res.success) {
                //             bus.$emit("programTableList",res)
                //             bus.$emit("currentPage",this.pageNo)
                //         } else {
                //             // 请求超时
                //             // Read timed out executing POST http://nmmonitor-server-report/report/execSelectCount
                            
                //             alert(res.message);
                //         }
                //     })
                // }else{
                //     // this.$message.warning('警告！在没有节目搜索的输入框时，无法展示节目里面的信息，请联系管理员',8);
                //     bus.$emit("programTableListError")
                // }
                let obj = {};
                obj.tableName = this.programCode;
                obj.start = this.pageNo;
                obj.limit = this.pageSize;
                obj.orderColumn='ID';
                obj.orderType='desc';
                // this.$refs.changeConfirmLoading.confirmLoading = false;
                exceSelectByMap(obj).then((res)=>{
                    // if(this.pageNo !== 1){
                    //     this.pageNo = 1;
                    //     this.getShowTableList();
                    // }
                    // this.$refs.changeConfirmLoading.confirmLoading = true;
                    if (res.success) {
                        bus.$emit("programTableList",res)
                        bus.$emit("currentPage",this.pageNo)
                    } else {
                        alert(res.message);
                    }
                })








            },
            selectedData(value){
                this.selectedDataValue = value
                // console.log(value,"我是选中的数据")
            },
            // 获取点击详情传递过来的ID的方法
            getClickDetailsPassed(){
                this.id = this.$route.query.id;
                // this.programReportTableCode = this.$route.query.propertyTableId;
            },
            // 点击重置按钮的事件，清空搜索的数据
            reset(){
                // console.log(this.clearRecordingTime)
                // this.clearRecordingTime = {}
                // this.programName = "",
                // this.keyWord = "",
                // this.harmfulType = null,
                // this.HarmfulTypeDefaultValue = "请选择"
                // console.log(this.clearRecordingTime,this.programName,this.keyWord,this.harmfulType,"呵呵")
                // this.search()
                for(let i = 0 ; i < this.$refs.searchValue.length ; i ++){
                    // console.log(this.$refs.searchValue[i].$el.value);
                    this.$refs.searchValue[i].$el.value = ""
                    // console.log(this.$refs.searchValue[i].$el.value,"重置按钮")
                }
                this.getShowTableList();
                // console.log(this.$refs.searchValue[i].$el.value,"重置按钮")
            },
            // 有害类型下拉框的事件，返回选中的那一项
            handleChange(value) {
                // console.log(value)
                this.harmfulType = value;
            },
            // 记录时间的事件
            onChange(date, dateString) {
                this.recordingTime = dateString;
            },
            // 点击搜索的事件，
            search(){
                // console.log(this.$refs.name.getAttachmentFormInformation)
                this.getShowTableList();
            },
            father(){
                alert("执行了")
                this.clic();
            },
            clic(){
                alert("执行了1")
                this.$refs.name.getAttachmentFormInformation();
            }
        },
        mounted() {
            bus.$on("changeViolationDataListPaging",data=>{
                // console.log(data,"我是当前页");
                this.pageNo = data;
                // console.log(this.pageNo,"当前页");
                // this.search();
                this.getShowTableList();
            });
            bus.$on("changeNumberDisplay",data=>{
                this.pageNo = data[0];
                this.pageSize = data[1];
                this.getShowTableList();
                // this.search();
                // console.log(data,"我是神")
            })
            // console.log(this.$route.query.id)
            querySuspectVideoHarmTypeList({}).then((res)=>{
                // console.log(res,"我是下拉列表");
                this.HarmfulTypeBox = res.result
                if (res.success) {

                } else {
                    console.log(res.message);
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .report-list-details{
        .over{
            overflow-y: auto;
            overflow-x: hidden;
            height: 100%;
        }
        .search{
            // width:100%;
            // height:105px;
            // overflow-y: auto;
            background: #fff;
            margin: 0 20px 0px 20px;
            padding: 15px;
            .ant-input{
                width:200px;
            }
            >div{
                margin:10px 30px;
                // float: left;
            }
        }
        h3{
            font-weight: 500;
            font-size: 20px;
            margin: 0;
            height:50px;
            line-height: 50px;
            margin-left: 20px;
            text-align: center;
        }
    }
</style>
