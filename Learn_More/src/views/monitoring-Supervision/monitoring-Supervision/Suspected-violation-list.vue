<template>
    <div style="float:left;margin-left:20px">
        <!-- <a-button type="primary" @click="suspectedViolationListPopupLayer">疑似违规列表</a-button> -->
        <a-modal
            title="疑似违规列表"
            :visible="suspectedViolationListTabVisible"
            :confirmLoading="confirmLoading"
            :footer="false"
            :width="1100"
            @cancel="suspectedViolationListCancel"
            :maskClosable="false"
        >
            <div>
                <div class="suspectedViolationListTab">
                    <div>
                        <span>
                            节目名称:
                        </span>
                        <a-input v-model="suspectedViolationListTabProgramName" style="width:160px" placeholder="请输入节目名称"></a-input>
                    </div>
                    <div>
                        <span>
                            发现网站:
                        </span>
                        <a-input v-model="suspectedViolationListTabDiscoveryWebsite" style="width:160px" placeholder="请输入发现的网站"></a-input>
                    </div>
                    <div>
                        <a-button type="primary" style="margin-right:10px" @click="suspectedViolationListTabSearch">搜索</a-button>
                        <a-button @click="suspectedViolationListTabReset">重置</a-button>
                    </div>
                </div>
                <!-- :rowSelection="{rowSelection,type:'radio',onChange:onSelectChange}" -->
                <a-table
                    :rowSelection="{rowSelection,type:'radio',onChange:suspectedViolationListTabSelectChange}" 
                    :columns="columns" 
                    :dataSource="suspectedViolationDataList.records"
                    :bordered="true"
                    :pagination="false"
                    :loading="suspectedViolationListTabLoading"
                />
                <!-- :dataSource=""  -->
            </div>
            <div style="margin: 20px 0 20px 550px;">
                <a-pagination 
                    showQuickJumper 
                    :defaultCurrent="suspectedViolationListTabDefaultCurrent" 
                    :total="suspectedViolationListTabPageSum" 
                    @change="onChange"
                    :defaultPageSize="2"
                />
            </div>
            <div style="margin-left:452px;">
                <a-button @click="suspectedViolationListTabCancel">取消</a-button>
                <a-button style="margin-left:10px" type="primary" @click="suspectedViolationListTabOk">确定</a-button>
            </div>




            
            <div>
                <!-- <a-button type="primary" @click="showModal">Open Modal with async logic</a-button> -->
                <a-modal
                    title="添加Title"
                    :visible="suspectedViolationListSelectedAndPassedDataVisible"
                    :confirmLoading="suspectedViolationListSelectedAndPassedDataConfirmLoading"
                    :footer="null"
                    :width="700"
                    @cancel="addProgramHandleCancel"
                >
                <div style="text-align:center;color:#f40" v-if="notSelectedDataPrompt">
                    *请在疑似违规数据的表格中选中一条数据再添加
                </div>
                <div style="text-align:center;color:#f40" v-if="atLeastSelectOne">
                    *至少选择一项才可以加入到节目的列表中
                </div>
                <div style="overflow: hidden;margin-top:20px;">
                    <div style="float:left;">
                        <div v-for="value in suspectedViolationListSelectedAndPassedDataLeft" style="height:32px;margin-bottom:14px;line-height:32px;">
                            {{value}}：
                        </div>
                    </div>
                    <div style="float:left;">
                        <p v-for="value in suspectedViolationListSelectedAndPassedDataLeft">
                            <a-select ref="rightSelect" style="width: 120px" @change="suspectedViolationListSelectedAndPassedDataDropDownBoxSelected">
                                <a-select-option v-for="value in suspectedViolationListSelectedAndPassedDataBox" :value="value">
                                    {{value}}
                                </a-select-option>
                            </a-select>
                        </p>
                    </div>
                </div>
                <div style="margin-left:250px;">
                    <a-button style="margin-right:10px;" @click="suspectedViolationListSelectedAndPassedDataCancel">取消</a-button>
                    <a-button type="primary" @click="suspectedViolationListSelectedAndPassedDataOk">确定</a-button>
                </div>
                </a-modal>
            </div>
            <!-- <index></index> -->
        </a-modal>
    </div>
</template>
<script>
    import { querySuspectVideoListTab , getCustomTableSeqValBySeqName , execInsertSql , updateSuSpectVideoList ,} from '@/api/api.js'

// suspectedViolationListTab
    const columns = [
        {
            title: '节目名称',
            dataIndex: 'title',
        }, 
        {
            title: '发现网站',
            dataIndex: 'ip',
        }, 
        {
            title: '链接地址',
            dataIndex: 'programUrl',
        },
        {
            title : '节目简介',
            dataIndex : ""
        }
    ];

    const data = [];
    for (let i = 0; i < 6; i++) {
        data.push({
            key: i,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        });
    }
    export default {
        data() {
            return {
                suspectedViolationListTabDefaultCurrent : 1,//疑似违规数据列表的分页中的默认当前页
                ModalText: 'Content of the modal',
                suspectedViolationListTabVisible: false,
                confirmLoading: false,
                suspectedViolationListTabLoading : false,
                // data,
                columns,
                selectedRowKeys: [], // Check here to configure the default column
                // 选中后将选中的数据赋值给下面的这个数组中
                suspectedViolationListTabSelectedData : [],
                pageNo : 1,
                pageSize : 2,
                suspectedViolationDataList : [],//表格中的数据
                suspectedViolationListTabPageSum : 1,
                // 节目的名称
                suspectedViolationListTabProgramName : "",
                // 发现网站
                suspectedViolationListTabDiscoveryWebsite : "",


                // 下面的数据都是选中后的数据
                // suspectedViolationListSelectedAndPassedData
                // 疑似违规列表选中后传递数据
                suspectedViolationListSelectedAndPassedDataVisible: false,
                suspectedViolationListSelectedAndPassedDataConfirmLoading: false,
                suspectedViolationListSelectedAndPassedDataBox : [],
                // 左侧的数据
                suspectedViolationListSelectedAndPassedDataLeft : [],
                suspectedViolationListSelectedAndPassedDataLeftDataIndex : [],
                // 未选择数据的提示
                notSelectedDataPrompt : false,
                // 加入到节目的参数
                parametersAddedProgram : {},
                // 一项都没有选择的提示
                atLeastSelectOne : false,
                // 选中疑似违规数据列表数据的ID
                selectSuspectedViolationDataListID : "",
            }
        },
        props : ["programHeaderList","programReportCode"],
        components : {
            
        },
        created(){
            this.getListSuspectedViolationsTabList();
        },
        computed: {
            rowSelection() {
                const { selectedRowKeys } = this;
                return {
                    selectedRowKeys,
                    hideDefaultSelections: true,
                    selections: [
                        {
                            key: 'all-data',
                            text: 'Select All Data',
                            onSelect: () => {
                                this.selectedRowKeys = [...Array(46).keys()]; // 0...45
                            },
                        }, 
                        {
                            key: 'odd',
                            text: 'Select Odd Row',
                            onSelect: (changableRowKeys) => {
                                let newSelectedRowKeys = [];
                                newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                                    if (index % 2 !== 0) {
                                        return false;
                                    }
                                    return true;
                                });
                                this.selectedRowKeys = newSelectedRowKeys;
                            },
                        }, 
                        {
                            key: 'even',
                            text: 'Select Even Row',
                            onSelect: (changableRowKeys) => {
                                let newSelectedRowKeys = [];
                                newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                                    if (index % 2 !== 0) {
                                        return true;
                                    }
                                    return false;
                                });
                                this.selectedRowKeys = newSelectedRowKeys;
                            },
                        }
                    ],
                    onSelection: this.onSelection,
                }
            }
        },
        methods: {
            // 右上角关闭按钮的事件
            addProgramHandleCancel(){
                this.suspectedViolationListSelectedAndPassedDataVisible = false;
                // this.suspectedViolationListTabVisible = false;
            },

            suspectedViolationListCancel(){
                // alert("123")
                this.suspectedViolationListTabVisible = false;
            },
            onChange(pageNumber) {
                this.pageNo = pageNumber;
                this.getListSuspectedViolationsTabList();
                // console.log('Page: ', pageNumber);
            },
            // 点击疑似违规数据的按钮的弹出层的事件,让弹出层显示出来
            suspectedViolationListPopupLayer() {
                // if(this.programHeaderList)
                // for(let k = 0 ; k < this.programHeaderList.length ; k ++){
                //     if(this.programHeaderList[k].title === "编号" && this.programHeaderList[k].title === "操作" && this.programHeaderList.length === 2){
                //         this.$message.warning('警告！节目列表中只有编号和操作，无法将疑似违规数据添加到节目中，请联系管理员');
                //     }else{

                //     }
                // }
                // alert("666")
                // console.log(this.programHeaderList)
                this.suspectedViolationListSelectedAndPassedDataLeft = [];//点击疑似违规数据的按钮的弹出层时清空左侧的left数据
                for(let i = 0 ; i < this.programHeaderList.length ; i ++){
                    // console.log(this.programHeaderList[i])
                    // if()
                    if(this.programHeaderList[i].title !== "操作" && this.programHeaderList[i].title !== "编号"){
                        this.suspectedViolationListSelectedAndPassedDataLeftDataIndex.push(this.programHeaderList[i]);
                        this.suspectedViolationListSelectedAndPassedDataLeft.push(this.programHeaderList[i].title);
                    };
                    
                    // alert(this.programHeaderList[i],"left")
                    // console.log(this.suspectedViolationListSelectedAndPassedDataLeft,"left")
                }
                this.suspectedViolationListTabVisible = true;
                // if(this.suspectedViolationListSelectedAndPassedDataLeft.length <= 0){
                //     // alert("错误，length为0")
                //     // this.$message.warning('节目表格中没有可以添加的字段，无法打开疑似违规的列表，请联系管理员',8);
                //     this.suspectedViolationListTabVisible = false;
                // }else{
                //     this.suspectedViolationListTabVisible = true;
                // }
            },
            // 疑似违规数据列表中的搜索按钮的事件
            suspectedViolationListTabSearch(){
                // 点击搜索的时候再次调取一下获取疑似违规数据列表弹出层中的表格里面的数据
                this.getListSuspectedViolationsTabList();
            },
            // 疑似违规数据列表中的重置按钮的事件
            suspectedViolationListTabReset(){
                // 将节目名称和发现网站中的输入框中的内容清空
                this.suspectedViolationListTabProgramName = "";
                this.suspectedViolationListTabDiscoveryWebsite = "";
                this.getListSuspectedViolationsTabList();
            },
            // 疑似违规数据列表中的弹出层中的确定事件
            suspectedViolationListTabOk(e) {
                // 判断右侧数据是不是空
                
                console.log(this.suspectedViolationListTabSelectedData)
                if(this.suspectedViolationListTabSelectedData.length <= 0){
                    // alert("数据为空")
                    this.suspectedViolationListSelectedAndPassedDataVisible = true;
                    this.notSelectedDataPrompt = true;
                }else{
                    this.notSelectedDataPrompt = false;
                    this.selectSuspectedViolationDataListID = this.suspectedViolationListTabSelectedData[0].id
                    this.suspectedViolationListSelectedAndPassedDataBox = [];//对右侧的select清空数据
                    for(let i = 0 ; i < this.suspectedViolationListTabSelectedData.length ; i ++){
                        for(let k in this.suspectedViolationListTabSelectedData[i]){
                            if(k === "title" || k === "ip" || k === "programUrl"){
                                this.suspectedViolationListSelectedAndPassedDataBox.push(this.suspectedViolationListTabSelectedData[i][k])
                            }
                            // console.log(k)
                            // console.log(this.suspectedViolationListTabSelectedData[i])
                            // if(this.suspectedViolationListTabSelectedData[i][k] === ""){
                            //     this.suspectedViolationListSelectedAndPassedDataBox.push(this.suspectedViolationListTabSelectedData[i][k])
                            // };
                        };
                    };
                    this.suspectedViolationListSelectedAndPassedDataVisible = true;
                };
                
            },
            // 疑似违规数据列表中的弹出层中的取消事件
            suspectedViolationListTabCancel(e) {
                this.suspectedViolationListTabVisible = false;
            },
            // 获取疑似违规数据列表弹出层中的表格里面的数据
            getListSuspectedViolationsTabList(){
                // console.log("被执行了")
                // console.log(this.pageNo,"我是当前页")
                // this.suspectedViolationListTabLoading = true;
                // querySuspectVideoListTab({
                //     pageNo : this.pageNo,
                //     pageSize : this.pageSize,
                //     name : this.suspectedViolationListTabProgramName,
                //     ip : this.suspectedViolationListTabDiscoveryWebsite,
                // }).then((res)=>{
                //     console.log(res,"================")
                //     // if(res.result.records === true && res.result.records.length <= 0){
                //         // alert("数据为空")
                //         this.suspectedViolationListTabLoading = false;
                //     // }else{
                //         // console.log(res.result,55555)
                //         // alert("数据不为空")
                //         this.suspectedViolationDataList = res.result;
                //         this.suspectedViolationListTabPageSum = res.result.total;
                //         this.suspectedViolationListTabLoading = false;
                //         // console.log(res,"获取疑似违规数据列表弹出层中的表格里面的数据")
                //     // }
                // })
            },
            // 在点击疑似违规数据列表的表格中的某一条数据的时候的事件
            suspectedViolationListTabSelectChange(selectedRowKeys,selectionRow){
                this.suspectedViolationListTabSelectedData = selectionRow;
                // console.log(this.suspectedViolationListTabSelectedData)
            },



            // !!!!!!!!!下面的事件都是在选中某一条数据的时候的事件!!!!!!!!!!!
            // 点击确定的事件
            suspectedViolationListSelectedAndPassedDataOk(e) {
                getCustomTableSeqValBySeqName({
                    seqName : this.programReportCode + "_SEQ"
                }).then((res)=>{
                    // console.log(res.result,"获取的ID")
                    if(res.result === "" || res.result === null){
                        alert("获取ID失败，请联系开发人员")
                    }else{
                        let str = 0;
                        for(let i = 0 ; i < this.suspectedViolationListSelectedAndPassedDataLeftDataIndex.length ; i ++){
                            for(let j = 0 ; j < this.$refs.rightSelect.length ; j ++){
                                if(i === j){
                                    this.parametersAddedProgram.ID = res.result;
                                    this.parametersAddedProgram.tableName = this.programReportCode;
                                    this.parametersAddedProgram[this.suspectedViolationListSelectedAndPassedDataLeftDataIndex[i].dataIndex] = this.$refs.rightSelect[j].$el.innerText
                                };
                                if(this.$refs.rightSelect[j].$el.innerText === ""){
                                    str ++;
                                }
                                // console.log(this.$refs.rightSelect[j].$el.innerText)
                                // console.log(this.$refs.rightSelect.length,"长度",this.$refs.rightSelect[j].$el.innerText,"内容")
                            };
                            // if()
                            // /monitor/updateSuSpectVideoList
                        };
                        if(str/2 >= this.$refs.rightSelect.length){
                            // alert("都没有数据")
                            this.atLeastSelectOne = true;
                        }else{
                            this.suspectedViolationListSelectedAndPassedDataVisible = false;
                            this.suspectedViolationListTabVisible = false;
                            // console.log(this.$listeners.getShowTableList,"666666")
                            // console.log(this.parametersAddedProgram,"加入到节目的参数",str/2,"没有数据的");
                            execInsertSql(this.parametersAddedProgram).then((res)=>{
                                console.log(res,"我是加入附件的接口")
                                // this.getListSuspectedViolationsTabList();
                                this.clickOkSuspectedViolationTabDataNotReturning();
                                this.$listeners.getShowTableList();
                            })
                            // this.suspectedViolationListSelectedAndPassedDataVisible = false;
                            // setTimeout(function(){
                                
                            // },10)
                        }
                        // console.log(this.parametersAddedProgram,"加入到节目的参数",str/2,"没有数据的");
                        // execInsertSql(this.parametersAddedProgram).then((res)=>{
                        //     console.log(res,"我是加入附件的接口")
                        // })
                        
                        setTimeout(function(){

                        },10)
                    }
                })
                
            },
            // 点击确定后将疑似违规数据表格里面的这条数据不返回给我
            clickOkSuspectedViolationTabDataNotReturning(){
                // console.log(typeof this.selectSuspectedViolationDataListID,"this.selectSuspectedViolationDataListID")
                updateSuSpectVideoList({
                    id : this.selectSuspectedViolationDataListID,
                }).then((res)=>{
                    this.getListSuspectedViolationsTabList();
                    console.log(res,"不返回了吗？？");
                })
            },
            // 点击取消的事件
            suspectedViolationListSelectedAndPassedDataCancel(e) {
                // 在点击取消的时候不光让当前的弹出层关闭,还要让疑似违规数据列表的弹出层关闭
                this.suspectedViolationListSelectedAndPassedDataVisible = false;
                let that = this;
                setTimeout(function(){
                    that.suspectedViolationListTabVisible = false;
                },10)
            },
            // 下拉框选中的事件
            suspectedViolationListSelectedAndPassedDataDropDownBoxSelected(value) {
                // console.log(`selected ${value}`);
            },
        },
    }
</script>

<style lang="scss" scoped>
    .suspectedViolationListTab{
        >div{
            // float: left;
            display: inline-block;
            margin-right:50px;
            margin-bottom: 24px;
        }
    }
</style>