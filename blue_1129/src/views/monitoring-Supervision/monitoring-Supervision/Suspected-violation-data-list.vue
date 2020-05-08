<template>
    <!-- 这个组件中有手动处理报告和报告列表的功能 -->
    <div class="violation-data-list">
        <div class="handProcess">
            <suspectedViolationList v-on="$listeners" :programHeaderList="programHeaderList" :programReportCode="programReportCode"></suspectedViolationList>
            <addAProgramMessage @changePageNoAncestor="changePageNoAncestor" v-bind="$attrs" v-on="$listeners" :programReportCode="programReportCode" :programHeaderList="programHeaderList"></addAProgramMessage>
        </div>
        <a-spin :spinning="confirmLoading">
            <a-table
                :columns="programHeaderList"
                :dataSource="programTableData"
                :hideDefaultSelections="true"
                :pagination="false"
                :bordered="true"
            >
                <!-- <span slot="action" slot-scope="textCheck, record">
                            <a @click="getReportArea(record, 'edit')">处理</a>
                </span>-->
                <span slot="action" slot-scope="textCheck, record">
                    <a-button @click="programTabEdit(record)" icon="edit">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item key="1" @click="programTabDetails(record)">
                                <a-icon type="snippets" />详情
                            </a-menu-item>
                            <!-- <a-menu-item key="2" @click="">
                                <a-icon type="key" />处理
                            </a-menu-item> -->
                            <a-menu-item key="3" @click="programTabDelete(record)">
                                <a-icon type="delete" />删除
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 8px">
                            更多
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </span>
            </a-table>
        </a-spin>
        <div class="pagination">
            <a-pagination
                size="small"
                :defaultPageSize="5"
                :total="pageSum"
                :pageSizeOptions="numberDisplays"
                @change="pageChange"
                showSizeChanger
                @showSizeChange="onShowSizeChange"
                showQuickJumper
                v-model="current"
            />
        </div>
        <div>
            <inputType ref="inputType" :matchId="matchId" @inputVal="inputVal" :list="this.rightInput"></inputType>
        </div>
        <!-- 点击详情的弹出层 -->
        <div>
            <!-- <a-button type="primary" @click="clickDetailPopupLayer">详情</a-button> -->
            <a-modal
                title="查看"
                :visible="DetailPopupLayerVisible"
                :confirmLoading="DetailPopupLayerLoading"
                :footer="null"
                :closable="false"
            >
                <div style="float:left">
                    <p v-for="value in detailPopupLayerLeft" style="margin:0;height:32px;line-height:32px;margin-top:10px;">
                        {{value.title}}：
                    </p>
                </div>
                    
                <div style="display: inline-block;">
                    <a-input :disabled="true" style="width:250px;display:block;margin-top:10px" v-for="value in detailPopupLayerRightInput" :value="value"></a-input>
                </div>
                <div style="margin-left: 165px;margin-top:20px;">
                    <a-button @click="DetailPopupLayerCancel" style="margin-right:5px">取消</a-button>
                    <a-button type="primary" @click="DetailPopupLayerOk">确定</a-button>
                </div>
            </a-modal>
        </div>



        <!-- <a-pagination size="small" :total="50" showSizeChanger showQuickJumper /> -->
    </div>
</template>
<script>
    import bus from "../bus/bus.js";
    import {
        querySuspectVideoList,
        queryFieldtypeModelBean,
        queryReportAppendTypeModeljie,
        exceSelectByMapjie,
        execDeleteSql,
        execSelectOne,
        execUpdateSql
    } from "@api/api";
    import suspectedViolationList from './Suspected-violation-list.vue'
    import addAProgramMessage from './Add-a-program-message.vue'
    import inputType from '@/components/input/inputType.vue'
    export default {
        data() {
            return {
                // loading: true,
                pageSum: 1, //总条数
                // pageNo : 2,//当前页
                // data,
                // columns,
                disabled: true,
                numberDisplays: ["5", "10", "20", "30"],
                suspectedViolationDataList: [],
                programReportId: "", //报告ID
                programReportTableCode: "", //节目的ID
                // programReportCode : "",
                programHeaderList: [], //节目的表头list
                programTableData: [], //节目表格中的数据

                visible: false,
                confirmLoading: false,//节目表格中的loading
                
                programLeftShowTextList : [],// 编辑左侧显示的文字列表

                programStr : "",
                programReportCode : "",
                // 节目表格中的数据的length；
                programDataLength : "",
                //默认选中的当前页
                current: 1,
                // 右侧的input里面的值
                rightInput : {},
                programEditorID : "",//点击后一条数据中的编辑的ID
                programEditorValue : "",

                // 
                programTabEditValue : [],
                // 详情弹出层左侧的数据
                detailPopupLayerLeft : [],
                // 详情弹出层右侧的数据
                detailPopupLayerRightInput : [],
                // 详情里面的数据
                DetailPopupLayerVisible: false,//让弹出层显示
                DetailPopupLayerLoading: false,

                // 编辑
                editTypeIds : [],
                matchId: '',
                valueID : null,
            };
        },
        components: {
            suspectedViolationList,
            addAProgramMessage,
            inputType
        },
        computed: {
            
        },
        created() {
            this.getReportId();
            
        },
        methods: {
            // 点击详情让弹出层显示出来
            clickDetailPopupLayer() {
                this.DetailPopupLayerVisible = true
            },
            // 详情弹出层的确定事件
            DetailPopupLayerOk(e) {
                this.DetailPopupLayerVisible = false;
            },
            // 详情弹出层的取消事件
            DetailPopupLayerCancel(e) {
                this.DetailPopupLayerVisible = false
            },
            changePageNoAncestor(){
                // alert("父组件执行了")
                this.$emit("changePageFather")
            },
           

            getSid(){
                this.editTypeIds = [];
                this.programLeftShowTextList = [];
                // console.log(this.programHeaderList,3)
                for(let i = 0 ; i < this.programHeaderList.length ; i ++){
                    if(this.programHeaderList[i].title !== "操作" && this.programHeaderList[i].title !== "编号"){
                        // console.log("123")
                        this.editTypeIds.push(this.programHeaderList[i].ids);
                        this.programLeftShowTextList.push(this.programHeaderList[i])
                    }
                    if(this.programHeaderList[i].title === "编号"){
                        this.programEditorValue = this.programHeaderList[i].dataIndex
                        // console.log(this.programEditorValue,"编号")
                    }
                };
                for(let i = 0 ; i < this.programLeftShowTextList.length ; i ++){
                    this.programStr += this.programLeftShowTextList[i].dataIndex + ','
                };
                execSelectOne({
                    tableName : this.programReportCode,
                    ID : this.valueID,
                    queryColumns : this.programStr.substring(0,this.programStr.length-1),
                }).then((res)=>{
                    if(res.success) {
                        this.rightInput = res.result;
                        this.matchId = this.editTypeIds
                        this.$refs.inputType.init();
                    }
                    
                    // console.log(res,'resres')
                    
                })
                // console.log(this.programLeftShowTextList,66666666)
            },
            inputVal(value){
                console.log(this.programEditorValue,"编号")
                let arr = [];
                let obj = {};
                for(let j in value){
                    arr.push(value[j])
                }
                for(let i = 0 ; i < this.programLeftShowTextList.length ; i ++){
                    for(let j = 0 ; j < arr.length ; j ++){
                        if(i === j){
                            obj.tableName = this.programReportCode;
                            obj.PRIMARYKEY = Object.keys(this.programTabEditValue)[0];
                            obj[this.programLeftShowTextList[i].dataIndex] = arr[j];
                            obj[this.programEditorValue] = this.valueID
                        }
                    }
                }
                execUpdateSql(obj).then((res)=>{
                    this.$emit("getShowTableList")
                    this.visible = false;
                })
                console.log(obj,"啦啦啦啦啦")
            },
            // 节目表格中的编辑事件
            programTabEdit(value){
                this.detailPopupLayerLeft = [];
                this.valueID = value.ID
                for(let i in value){
                    if(i !== "ID" && i !== 'RN'){
                        this.detailPopupLayerLeft.push(i)
                    };
                };
                this.getSid()
                this.programTabEditValue = value;
                
                // this.$refs.inputType.init();
            },
            // 节目表格中的详情事件
            programTabDetails(value){
                this.detailPopupLayerLeft = [];
                for(let i = 0 ; i < this.programHeaderList.length ; i ++){
                    // console.log(this.programHeaderList[i]);
                    if(this.programHeaderList[i].title !== "操作"){
                        this.detailPopupLayerLeft.push(this.programHeaderList[i]);
                    }
                }
                this.clickDetailPopupLayer();
                // console.log(value);
                // console.log(this.detailPopupLayerLeft,566666);
                let str = ""
                for(let k = 0 ; k < this.detailPopupLayerLeft.length ; k ++){
                    // console.log(this.detailPopupLayerLeft[k].title,655656565)
                    str += this.detailPopupLayerLeft[k].dataIndex + ","
                }
                // console.log(this.programReportCode,value.ID,str.substring(0,str.length-1),"传递过去的数据")
                execSelectOne({
                    tableName : this.programReportCode,
                    ID : value.ID,
                    queryColumns : str.substring(0,str.length-1),
                }).then((res)=>{
                    this.detailPopupLayerRightInput = res.result;
                    // console.log(res,"点击事件中获取右侧input里面的值")
                })
            },
            // 节目表格中的删除事件
            programTabDelete(value){
                let that = this;
                this.$confirm({
                    title: '提示',
                    content: '确定要删除当前节目吗？？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        that.confirmLoading = true;
                        if(that.programDataLength <= 1){
                            that.$emit('programDataSmall')
                        }
                        execDeleteSql({
                            tableName : that.programReportCode,
                            ID : value.ID,
                            PRIMARYKEY : Object.keys(value)[0],
                        }).then((res)=>{
                            that.$emit("getShowTableList")
                        })
                    },
                    onCancel() {
                        // console.log('Cancel');
                    },
                });
            },
            // 获取从报告中传过来的ID
            getReportId() {
                this.programReportId = this.$route.query.id;
                this.programReportTableCode = this.$route.query.propertyTableId;
                this.getShowHeader();
                this.getShowCode();
            },
            // 获取节目表格的title
            getShowHeader() {
                queryFieldtypeModelBean({
                    id: this.programReportId
                }).then(res => {
                    this.programHeaderList = res.result;
                    // this.programLeftShowTextList = res.result;
                    this.programHeaderList.push({
                        title: "操作",
                        dataIndex: "action",
                        scopedSlots: { customRender: "action" },
                        align: "center"
                    });
                });
            },
            // 获取节目名称的code
            getShowCode() {
                queryReportAppendTypeModeljie({
                    propertyTableId: this.programReportTableCode
                }).then(res => {
                    this.programReportCode = res.result[0].code;
                    bus.$emit("programReportCode", res.result);
                });
            },
            // 点击处理的事件，进入研判区
            programTabProcess(record, name) {
                console.log(this.programHeaderList instanceof Array)
                let arr = [];
                let ary = [];
                for(let i in record){
                    // if(record)
                    delete record.RN
                    arr.push(record[i])
                }
                for(let i = 0 ; i < this.programHeaderList.length ; i ++){
                    if(this.programHeaderList[i].title !== "操作"){
                        ary.unshift(this.programHeaderList[i].title)
                    }
                }
                // console.log(arr,"我是arr",ary,"我是ary")
                this.$router.push({
                    path: "/violationDataProcessing",
                    query: {
                        leftData : ary,
                        violationDataDetailsProcessing: arr,
                        mp4 : "http://gslb.miaopai.com/stream/zbl5-17MSlsiD5vl7oeKTK7RqowfEZE3k63VNw__.mp4?vend=miaopai&ssig=96ea6f1f6897b7b143ae91deb4254038&time_stamp=1566639990751&mpflag=32"

                    }
                });
                // console.log(record, name);
            },
            pageChange(value) {
                
              // console.log(v,"我是当前页");
                bus.$emit("changeViolationDataListPaging", value);
            },
            // 每页显示的条数发生变化的时候的事件
            onShowSizeChange(current, pageSize) {
                // console.log(current, pageSize);
                bus.$emit("changeNumberDisplay", [current, pageSize]);
            }
        },
        mounted() {
            bus.$on("programTableList", data => {
                // console.log(data,"我是数据")
                if(data.result.data !== null && data.result.count !== null){
                    this.programTableData = data.result.data;
                    this.pageSum = data.result.count;
                    this.programDataLength = data.result.data.length;
                    this.confirmLoading = false;
                }
                
                // console.log(this.programTableData,this.programDataL  ength,data.result.count, "节目中的数据111111");
            });
            bus.$on("programTableListError",()=>{
                // alert("我执行了")
                this.confirmLoading = false;
            })
            // console.log(this.$emit('getShowTableList'),"这是什么事件")
            bus.$on("currentPage",data=>{
                this.current = data;
                // console.log(this.current,"我是当前页1111111111111111")
            })
            // console.log(this.programHeaderList,"44444444444444444444")
        }
    };
</script>

<style lang="scss" scoped>
    .violation-data-list {
        margin: 0px 20px 0px 20px;
        background: #fff;
        .handProcess {
            height: 60px;
            button {
                margin: 20px 0 0 55px;
            }
        }
        .pagination {
            height: 65px;
            margin: 15px 0 0 0;
            ul {
                float: right;
                margin-top: 20px;
                margin-right: 30px;
            }
        }
    }
    .program-editor{
        content: attr(placeholder);
        margin-bottom: 1em;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        width: 200px;
        line-height: 32px;
        display: block;
    }
    .program-editor:focus{
        border-color: #40a9ff !important;
        outline: 0;
        -webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        border-right-width: 1px !important;
    }
</style>
