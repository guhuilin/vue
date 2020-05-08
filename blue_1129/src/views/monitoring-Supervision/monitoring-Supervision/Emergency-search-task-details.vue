<template>
    <globalLayout>
        <div style="height:100%;overflow-y: auto;">
            <div style="height:60px;font-size:18px;line-height:60px;margin-bottom:10px;background:#fff;position: relative;">
                应急匹配结果
                <a-button type="primary" style="position: absolute;right: 65px;top: 15px;" @click="backToPrevious">
                    返回
                </a-button>
            </div>
            <div id="details-search" style="background:#fff;margin-bottom:10px;padding:0px 10px;">
                <a-form>
                    <a-row>
                        <a-col class="gutter-row" :span="6">
                            <a-form-item label="节目名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-input placeholder="请输入节目名称" v-model="programName"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col class="gutter-row" :span="6">
                            <a-form-item label="搜索来源" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-input placeholder="请输入搜索来源" v-model="searchSource"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col class="gutter-row" :span="8">
                            <a-form-item label="发现时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                                <a-range-picker showTime @change="TimOnChange" v-model="defaultFindTim" />
                            </a-form-item>
                        </a-col>
                        <a-col class="gutter-row" :span="4">
                            <a-form-item>
                                <a-button type="primary" icon="search" style="margin-right:10px;" @click="detailsSearch">搜索</a-button>
                                <a-button @click="detailsReset">重置</a-button>
                            </a-form-item>
                        </a-col>
                        <!-- <a-col class="gutter-row" :span="6">
                            <div>
                                <span>：</span>
                                
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="9">
                            <span>
                                ：
                            </span>
                            
                        </a-col>
                        <a-col class="gutter-row" :span="3">
                            <a-button type="primary" icon="search" style="margin-right:10px;" @click="detailsSearch">搜索</a-button>
                            <a-button @click="detailsReset">重置</a-button>
                        </a-col> -->
                    </a-row>
                </a-form>
            </div>

            <!-- 表格 -->
            <div id="tab">
                <a-spin
                    :spinning="emergencySearchDetailsLoading"
                >
                    <a-table 
                        :columns="columns" 
                        :dataSource="data" 
                        bordered
                        :pagination="false"
                    >
                    <span slot="name" slot-scope="textCheck, record">
                        <span style="display:inline-block;width:100px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                            {{textCheck}}
                        </span>
                    </span>
                    <span slot="playddress" slot-scope="textCheck, record">
                        <span style="display:inline-block;width:180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                            <a :href="textCheck" target="_blank">
                                {{textCheck}}
                            </a>
                        </span>
                    </span>
                    <span slot="programSource" slot-scope="textCheck, record">
                        <span style="display:inline-block;width:100px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                            {{textCheck}}
                        </span>
                    </span>
                    <span slot="findTheTime" slot-scope="textCheck, record">
                        <span style="display:inline-block;width:180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                            {{textCheck}}
                        </span>
                    </span>
                        <span slot="action" slot-scope="textCheck, record">
                            <span>
                                <upload :id="id" :details="textCheck"></upload>
                                <a-divider type="vertical"/>
                                <a-button @click="SetNormalOrNotNormal(textCheck)" icon="snippets" v-if="textCheck.isSetNormal === '不违规' ? true : false">{{textCheck.isSetNormal}}</a-button>
                                <a-button @click="SetNormalOrNotNormal(textCheck)" icon="snippets" v-if="textCheck.isSetNormal === '违规' ? true : false">{{textCheck.isSetNormal}}</a-button>
                            </span>
                        </span>
                    </a-table>
                </a-spin>
            </div>
            <div>
                <a-modal
                    title="备注"
                    :visible="visible"
                    @ok="handleOk"
                    :confirmLoading="confirmLoading"
                    @cancel="handleCancel"
                >
                    <div>
                        <div>
                            <span>
                                请输入备注：
                            </span>
                            <a-input style="width:180px" v-model="remarks"></a-input>
                        </div>
                    </div>
                </a-modal>
            </div>
            <!-- 分页 -->
            <div id="pagination">
                <a-pagination 
                    size="small" 
                    :total="pageSum" 
                    showSizeChanger 
                    showQuickJumper 
                    :defaultPageSize="pageSize"
                    :pageSizeOptions="pageSizeOptions"
                    v-model="defaultCurrent"
                    @change="detailSearchPage"
                    @showSizeChange="showSizeChange"
                />
            </div>
        </div>
    </globalLayout>
</template>
<script>
    import {querynormalSettings , fastDFSUpload , queryEmergencySearchResultInfoList , normalSettings} from '@/api/api.js'
    import { uploadFile } from '@api/manage'
    const columns = [
        {
            title: '节目名称',
            className:'name',
            dataIndex: 'clueTitle',
            // width:150,
            scopedSlots: { customRender: 'name' },
        },
        {
            title: '播放地址',
            className: 'column-money',
            dataIndex: 'clueUrl',
            scopedSlots: { customRender: 'playddress' } 
            // width:150,
        },
        {
            title : '节目来源',
            className :  'source',
            dataIndex : 'clueSource',
            scopedSlots: { customRender: 'programSource' } 
        },
        {
            title : '发现时间',
            className : 'findTim',
            dataIndex : 'insertTime',
            scopedSlots: { customRender: 'findTheTime' } 
            // findTheTime
        },
        // {
        //     title : '研判状态',
        //     className : 'status',
        //     // dataIndex : 'taskResultStatus'
        // },  
        {
            title: '操作',
            className : 'operating',
            scopedSlots: { customRender: 'action' } 
        }
    ];
    import globalLayout from '@/components/page/GlobalLayout.vue'
    import upload from './Violation-data-list-processing-template/Upload-video'
    export default {
        data(){
            return{
                id : "",
                data : [],
                columns,
                pageSizeOptions : ["5","10","15","20"],
                emergencySearchDetailsLoading : true,
                // 搜索的条件
                programName : "",//节目名称
                searchSource : "",//搜索来源
                findTim : [],//发现时间
                startTim : "",
                endTime : "",
                defaultFindTim : [],//默认发现的时间
                researchStatus : "请选择研判状态",//研判状态
                deliveryStation : "请选择下发台站",//下发台站
                // 选中后的数据
                selectedResearchStatus : "",//选中的研判状态
                // selectedDeliveryStation : "",//选中的下发台站
                pageNo : 1,
                pageSize : 5,
                pageSum : 1,
                defaultCurrent : 1,

                headers: {
                    authorization: 'authorization-text',
                },
                fileList : [],


                // 弹出层中的数据
                visible: false,
                confirmLoading: false,
                remarks : "",
                arr : {},
            }
        },
        components : {
            globalLayout,
            upload
        },
        created(){
            // this.getID();
            this.id = this.$route.query.id
            this.detailsSearch();
        },
        methods : {
            // 返回
            backToPrevious(){
                this.$router.push({
                    path : "/monitoring-Supervision/AddTaskEmergency"
                })
            },
            //弹出层中的事件
            SetNormalOrNotNormal(value) {
                this.visible = true;
                //  for(let i in value){
                //     // console.log(value[i])
                //     if(value[i] === "正常"){
                //         value[i] = "T";
                //     }else if(value[i] === "不正常"){
                //         value[i] = "F";
                //     };
                // };
                this.arr = value
            },
            handleOk(e) {
                normalSettings({
                    id : this.arr.id,
                    judgement : this.remarks,
                }).then((res)=>{
                    this.detailsSearch();
                    this.visible = false;
                    this.remarks = "";
                });
                
            },
            handleCancel(e) {
                for(let i in this.arr){
                    // console.log(value[i])
                    if(this.arr[i] === "T"){
                        this.arr[i] = "正常";
                    }else if(this.arr[i] === "F"){
                    this.arr[i] = "不正常";
                    };
                };
                this.remarks = "";
                this.visible = false;
            },
            // 分页
            detailSearchPage(page,pageSize){
                this.pageNo = page;
                this.pageSize = pageSize;
                this.detailsSearch();
            },
            showSizeChange(current, size){
                this.pageNo = current;
                this.pageSize = size;
                this.detailsSearch();
            },
            // 获取当前详情的ID
            // getID(){
            //     this.detailsSearch(this.$route.query.id);
            // },
            // 研判状态
            changeResearchStatus(value) {
                this.selectedResearchStatus = value;
                console.log(value);
            },
            // 日期
            TimOnChange(date, dateString) {
                // this.findTim = dateString;
                this.startTim = date[0]._d.getFullYear() + '-' + (date[0]._d.getMonth() + 1) + '-' + date[0]._d.getDate() + ' ' + date[0]._d.getHours()

                + ':' + date[0]._d.getMinutes() + ':' + date[0]._d.getSeconds();

                this.endTime = date[1]._d.getFullYear() + '-' + (date[1]._d.getMonth() + 1) + '-' + date[1]._d.getDate() + ' ' + date[1]._d.getHours()

                + ':' + date[1]._d.getMinutes() + ':' + date[1]._d.getSeconds();
                // console.log(date[0]._d, dateString);
            },
            // 详情的搜索事件
            detailsSearch(){
                console.log(this.$route.query.id)
                this.emergencySearchDetailsLoading = true;
                queryEmergencySearchResultInfoList({
                    taskId : this.$route.query.id,//传递过来额ID
                    clueTitle : this.programName,//名称
                    clueSource : this.searchSource,
                    startTime : this.startTim,
                    endTime : this.endTime,
                    taskResultStatus : this.selectedResearchStatus,
                    pageNo : this.pageNo,
                    pageSize : this.pageSize,
                }).then((res)=>{
                    console.log(res,"事件")
                    for(let i = 0 ; i < res.result.records.length ; i ++){
                        if(res.result.records[i].isSetNormal === "T"){
                            res.result.records[i].isSetNormal = "不违规";
                        }else if(res.result.records[i].isSetNormal === "F"){
                            res.result.records[i].isSetNormal = "违规";
                        }
                    }
                    this.pageSum = res.result.total;
                    this.data = res.result.records;
                    let that = this;
                    setTimeout(function(){
                        that.emergencySearchDetailsLoading = false;
                    },500)
                    console.log(res,"详情");
                })

                // console.log(id)
                // console.log(this.programName,this.searchSource,this.selectedResearchStatus,this.selectedDeliveryStation,this.findTim)
            },
            // rowClick: record => ({
            //     on: {
            //         click: () => {
            //             window.open(record.clueUrl)
            //             console.log(record, 'record')
            //         },
            //         mouseenter: (event) => {
            //             event.path[0].style.cursor = "pointer";
            //             console.log()
            //         },
            //         doubleclick: (event) => {
            //             console.log(event)
            //         },
            //         contextmenu: (event) => {
            //             console.log(event)
            //         },
            //     }
            // }),
            // 详情的重置事件
            detailsReset(){
                this.programName = "";
                this.searchSource = "";
                this.researchStatus  = "请选择研判状态";
                this.deliveryStation = "请选择下发台站";
                this.selectedResearchStatus = "";
                this.selectedDeliveryStation = "";
                this.startTim = "";
                this.endTime = ""
                this.findTim = [];
                this.defaultFindTim = [];
                this.detailsSearch();
            }
        },
        mounted(){
            let arr = document.querySelectorAll(".column-money");
            console.log(arr);
            // let that = this
            // for(let i = 0 ; i < arr.length ; i ++){
            //     arr[i].onclick = function(){
            //         that.$nextTick(()=>{
            //             alert(this)
            //         })
            //     }
            // }
            // console.log()
        }
    }
</script>
<style lang="scss" scoped>
    .ant-input{
        
    }
    .gutter-row{
        margin:20px 0px;
    }
    th.column-money,
    td.column-money {
        text-align: right !important;
    }
    #tab{
        background: #fff;
        
    }
    #pagination{
        .ant-pagination{
            float: right;
            margin:10px 0px;
        }
    }
    .ant-form-item{
        margin-bottom: 0px;
    }
</style>
<style scoped>
    /* >>>.name,>>>.column-money,>>>.source,>>>.findTim,>>>.status{
        display: inline-block;
        width:150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 95px;
        text-align: left;
        line-height: 66px;

    } */
    /* >>>td{
        display: inline-block;
    }
    >>th{
        display: inline-block;
    } */
    /* >>>.name{
        display: inline-block;
        width:190px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 95px;
        text-align: left;
        line-height: 66px;
    }
    >>>.column-money{
        display: inline-block;
        width:350px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 95px;
        text-align: left;
        line-height: 66px;
    }
    >>>.source{
        display: inline-block;
        width:150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 95px;
        text-align: left;
        line-height: 66px;
    } */
    /* >>>.findTim{
        display: inline-block;
        width:200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 95px;
        text-align: left;
        line-height: 66px;
    } */
    /* >>>.status{
        display: inline-block;
        width:150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 95px;
        text-align: left;
        line-height: 66px;  
    } */
    /* >>>.operating{
        display: inline-block;
        width:385px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 95px;
        text-align: left;
        line-height: 66px;  
        z-index: 10;
    } */
</style>