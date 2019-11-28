<template>
    <div>
        <span>工作流： &nbsp&nbsp&nbsp</span>
        <a-button type="primary" @click="showModal">请选择工作流</a-button>
        <a-modal
            :centered="true"
            title="工作流"
            :visible="visible"
            :width="800"
            :footer="null"
            @cancel="workflowHandleCancelRight"

        >
        <!-- <p>{{ModalText}}</p> -->
            <div>
                <div>
                    <span>工作流名称：</span>
                    <a-input v-model="workflowValue" style="width:150px;margin-right:40px" placeholder="请输入工作流名称"/>
                    <a-button type="primary" style="margin-right:20px" @click="searchWorkflow">搜索</a-button>
                    <a-button @click="resetWorkflow">重置</a-button>
                </div>
                <div style="margin-top:30px">
                    <a-table 
                        :loading="workflowLoading"
                        :columns="columns" 
                        :bordered="true"
                        :pagination="false"
                        :dataSource="workflowTab.records"
                        :rowSelection="{type : 'radio', onChange}"
                    >
                        <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>
                    </a-table>
                </div>
                <div style="margin-top:20px;margin-left:360px">
                    <a-pagination 
                        :current="current"
                        :defaultPageSize="5"
                        class="pagination" 
                        size="small" 
                        :total="total"  
                        showSizeChanger
                        showQuickJumper
                        :pageSizeOptions="pageSizeOptions"
                        @change="workflowChange"
                        @showSizeChange="workflowShowSizeChange"
                    />
                </div>
            </div>
            <div style="margin-left:275px;margin-top:20px">
                <a-button style="margin-right:20px" @click="WorkflowHandleCancel">取消</a-button>
                <a-button type="primary" @click="WorkflowHandleOk">确定</a-button>
            </div>  
        </a-modal>
        
    </div>
</template>
<script>
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' },
        },
        {
            title: '工作流编号',
            dataIndex: 'key',
        }, 
    ];
    import {inquireQueryDeployedProcessInfoList} from '@/api/api.js'
    export default {
        data() {
            return {
                // workflow
                visible: false,
                confirmLoading: false,
                // data,
                columns,
                workflowValue : "",//工作流的输入框的值
                pageNo: 1, //当前页
                pageSize: 5,//每页显示的条数
                total : 1,//总条数
                workflowTab : [],
                pageSizeOptions : ["5","10","15","20"],
                workflowLoading : true,//加载中
                current : 1,
                workflowSelectedData : [],//单选事件选中的数据
                selectedWorkflowDataNameShow : false,// 单选按钮传递过来的name值的显示与隐藏
            };
        },
        created(){
            this.searchWorkflow();
            
        },
        methods: {
            workflowHandleCancelRight(){
                this.visible = false;
            },
            // current: 3
            // pages: 1
            // 点击搜索的事件
            searchWorkflow(){
                this.workflowLoading = true;
                // this.pageNo = 1
                // console.log(this.pageNo,"当前页",this.pageSize,"每页显示的条数")
                inquireQueryDeployedProcessInfoList({
                    activitiName : this.workflowValue,
                    pageNo : this.pageNo,
                    pageSize : this.pageSize,
                    workflowType : "2"
                }).then((res)=>{
                    this.workflowTab = res.result
                    this.total = res.result.total
                    this.current = res.result.current
                    this.workflowLoading = false;
                    this.pageNo = 1
                    // if(this.current > res.result.pages){
                    //     // this.current = 1
                    //     console.log("121212")
                    // }
                    // console.log(res.result,"我是工作流")
                    // console.log(res,"1212");
                    if (res.success) {
                    } else {
                        console.log(res.message);
                    }
                })
                // console.log(this.workflowValue,"我是输入框")
            },
            // 点击重置的事件
            resetWorkflow(){
                this.workflowValue = "";
                this.searchWorkflow();
            },
            // 单选选中的数据
            onChange(pageNumber,selectedRows){
                this.workflowSelectedData = selectedRows
                this.$emit("workflowSelectedValue",this.workflowSelectedData)
                // console.log(pageNumber,selectedRows,"这是什么？？")
            },
            // 点击请选择工作流的弹出层的事件
            showModal() {
                this.visible = true;
            },
            // 点击确定后的事件
            WorkflowHandleOk(e) {
                this.selectedWorkflowDataNameShow = true;
                this.$emit("selectedWorkflowDataNameShowClick",this.selectedWorkflowDataNameShow)
                this.visible = false;
            },
            // 点击取消的事件
            WorkflowHandleCancel(e) {
                this.selectedWorkflowDataNameShow = false;
                // console.log("Clicked cancel button");
                this.visible = false;
                this.$emit("selectedWorkflowDataNameShowClick",this.selectedWorkflowDataNameShow)
            },
            // 当前页发生改变的时候
            workflowChange(e){
                this.pageNo = e;
                this.searchWorkflow();
                // console.log(e);
            },
            // 每页显示的条数发生变化时的事件
            workflowShowSizeChange(current, size){
                this.pageNo = current;//当前页
                this.pageSize = size;//每页显示的条数
                this.searchWorkflow()
                // console.log(current,size)
            }
        },
        mounted(){
            
        }
    };
</script>
<style lang="scss" scoped>
    .pagination{
        content: "";
        display: block;
        clear: both;
    }
</style>