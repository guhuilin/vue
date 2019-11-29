<template>
    <!-- 模板预览的组件 -->
    <div v-show="showAndHide">
            <a-button
            type="primary"
            @click="showModal"
            v-for="value in data"
            :key="value.id"
            >模板预览{{value.reportName}}</a-button>

        <a-modal
            :maskClosable="false"
            :centered="true"
            title="模板预览"
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
            :width="1100"
        >
            <div>
                <div v-for="value in data" :key="value.id" class="template-preview-type">
                    <p>
                        <span>模板名称:</span>
                        <span>{{value.reportName}}</span>
                    </p>
                    <p>
                        <span>报告类型：</span>
                        <span>
                            {{value.reportTypeName}}
                        </span>
                    </p>
                    <p>
                        <span>
                            报告所属领域:
                        </span>
                        <span>
                            {{value.domainTypeName}}
                        </span>
                    </p>
                    <p>
                        <span>
                            报告业务:
                        </span>
                        <span>
                            {{value.businessTypeName}}
                        </span>
                    </p>
                </div>
            </div>
                <a-table 
                    :columns="columns" 
                    :dataSource="data" 
                    bordered
                    :pagination="false"    
                >
                    <!-- <template slot="name" slot-scope="text">
                        <a href="javascript:;">{{text}}</a>
                    </template> -->
                    <template slot="operation" slot-scope="text, record">
                        <!-- <a-popconfirm> -->
                            <!-- 删除的提示 -->
                            <!-- v-if="dataSource.length" title="Sure to delete?" -->
                            <!-- <a @click="fn(record)" href="javascript:;">复核通过</a> -->
                            <div @click="fn(record)">复核通过</div>
                        <!-- </a-popconfirm> -->
                    </template>
                </a-table>
                <!-- 附件tab -->
                <div style="margin-top:20px">
                    <a-tabs defaultActiveKey="1" @change="callback">
                        <!-- <a-tab-pane v-for="value in attachmentForm" :tab="value" :key="value.id">
                            {{value}}
                            <annexTabList :attachmentFormList="value.fieldTypeList"></annexTabList>
                        </a-tab-pane> -->
                        <a-tab-pane v-for="value in attachmentForm" :tab="value.appendixTypeName" :key="value.appendixId">
                            <annexTabList :attachmentFormList="value.fieldTypeList"></annexTabList>
                        </a-tab-pane>
                            <!-- <a-tab-pane tab="Tab 2" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
                            <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane> -->
                    </a-tabs>
                </div>
        </a-modal>

    </div>
</template>
<script>
    import bus from "../bus/bus.js";
    import { queryReportTableShowInfomoban } from "@/api/api.js";
    import annexTabList from './Annex-tab-list.vue'
    export default {
        data() {
            return {
                templateTable : [],//模板表格
                attachmentForm : [],//附件表格
                attachmentFormList : [],
                // ModalText: 'Content of the modal',
                visible: false,
                confirmLoading: false,

                showAndHide: false,
                data: null,
                dataSource: [
                    {
                        key: "0",
                        name: "Edward King 0",
                        age: "32",
                        address: "London, Park Lane no. 0"
                    },
                    {
                        key: "1",
                        name: "Edward King 1",
                        age: "32",
                        address: "London, Park Lane no. 1"
                    }
                ],
                count: 2,
                columns: [
                    {
                        title: "报告名称",
                        dataIndex: "reportName",
                        scopedSlots: { customRender: "name" }
                    },
                    {
                        title: "报告周期",
                        // dataIndex: "age"
                    },
                    {
                        title: "创建人",
                        dataIndex: "createBy"
                    },
                    {
                        title: "创建时间",
                        dataIndex: "createTime"
                    },
                    {
                        title: "提交人",
                        dataIndex: "updateBy"
                    },
                    {
                        title: "审核人",
                        // dataIndex: "address"
                    },
                    {
                        title: "审核时间",
                        // dataIndex: "address"
                    },
                    {
                        title: "审核状态",
                        dataIndex: "operation",
                        scopedSlots: { customRender: "operation" }
                    }
                ]
            };
        },
        components : {
            annexTabList
        },
        created(){
            this.$emit("templatepreviewdata",this.showAndHide)
            this.$emit("showColor",this.showAndHide)
        },
        methods: {
            callback (key) {
                // console.log(key)
            },
            onCellChange(key, dataIndex, value) {
                const dataSource = [...this.dataSource];
                const target = dataSource.find(item => item.key === key);
                if (target) {
                    target[dataIndex] = value;
                    this.dataSource = dataSource;
                }
            },
            fn(key) {
                // console.log(key, "我是谁呀!!");
            },
            handleAdd() {
                const { count, dataSource } = this;
                const newData = {
                    key: count,
                    name: `Edward King ${count}`,
                    age: 32,
                    address: `London, Park Lane no. ${count}`
                };
                this.dataSource = [...dataSource, newData];
                this.count = count + 1;
            },
            showModal() {
                this.visible = true;
                queryReportTableShowInfomoban({
                    id: this.data[0].id
                }).then(data => {
                    // console.log(data,11111)
                    this.attachmentForm = data.result.appendixFieldList
                    this.attachmentFormList = data.result.appendixFieldList.fieldTypeList
                    // console.log(this.attachmentForm,"222");
                });
            },
            handleOk(e) {
                this.ModalText = "The modal will be closed after two seconds";
                this.confirmLoading = true;
                setTimeout(() => {
                    this.visible = false;
                    this.confirmLoading = false;
                }, 2000);
            },
            handleCancel(e) {
                // console.log("Clicked cancel button");
                this.visible = false;
            }
        },
        mounted() {
            bus.$on("two", data => {
                // console.log(data[0],"哈哈哈哈");
                this.data = data;
                this.showAndHide = true;
                // console.log(data,"过来啦吗？？")
            });
            bus.$on("cancel",data=>{
                this.showAndHide = data;
                // console.log("隐藏")
            })
            bus.$on("show",data=>{
                this.showAndHide = data;
                // console.log("显示")
            })
            // this.$emit("showColor",this.showAndHide)
            // this.showModal();
        },
        beforeUpdate(){
            // this.$emit("showColor",this.showAndHide)
        }
    };
</script>
<style scoped>
    .template-preview-type p{
            font-size: 18px;
            width:260px;
            float: left;
    }
    .editable-cell {
        position: relative;
    }

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
    padding-right: 24px;
    }

    .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
    }

    .editable-cell-icon {
    line-height: 18px;
    display: none;
    }

    .editable-cell-icon-check {
    line-height: 28px;
    }

    .editable-cell:hover .editable-cell-icon {
    display: inline-block;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
    color: #108ee9;
    }

    .editable-add-btn {
    margin-bottom: 8px;
    }
</style>
