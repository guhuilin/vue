<template>
<!-- 模板列表 -->
    <div class="selectTemplateList">
        <div>
            
                <a-table
                    :loading="templateLoading"
                    :showHeader="true"
                    :bordered="true"
                    :filterMultiple="false"
                    :rowSelection="{rowSelection,type:'radio',onChange:onSelectChange}"
                    :columns="columns"
                    :dataSource="selectTemplate.records"
                    :pagination="false"
                >
                </a-table>
            
        </div>
            <a-pagination
                showQuickJumper 
                :defaultCurrent="1" 
                :total="selectTemplate.total" 
                @change="onChange" 
                :defaultPageSize="5"
            />
        </div>
</template>
<script>
const columns = [
    {
        title: "名称",
        dataIndex: "reportName"
    },
    {
        title: "创建时间",
        dataIndex: "createTime"
    },
    {
        title: "创建人",
        dataIndex : "createBy"
    },
    {
        title : "报告所属领域",
        dataIndex : "domainTypeName"
    },
    {
      title : "报告业务",
      dataIndex : "businessTypeName"
    },
    {
      title : "报告类型",
      dataIndex : "reportTypeName",
    },
    {
        title: "附件/个",
        dataIndex : "appendixCount"
    },
];
    import bus from '../bus/bus.js';
    export default {
        data() {
            return {
                columns,
                selectedRowKeys: [], // Check here to configure the default column
                pageNo : 1,
                pageSize : 5,
                loading : true,
                selectedRows : null,
                isShow : true,
                // templateLoading : true,
            };
        },
        props : ["selectTemplate","templateLoading"],
        computed: {
          rowSelection() {
            const { selectedRowKeys } = this;
            return {
              selectedRowKeys,
              onChange: this.onSelectChange,
              hideDefaultSelections: true,
              selections: [
                {
                  key: "all-data",
                  text: "Select All Data",
                  onSelect: () => {
                    this.selectedRowKeys = [...Array(46).keys()]; // 0...45
                  }
                },
                {
                  key: "odd",
                  text: "Select Odd Row",
                  onSelect: changableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                      if (index % 2 !== 0) {
                        return false;
                      }
                      return true;
                    });
                    this.selectedRowKeys = newSelectedRowKeys;
                  }
                },
                {
                  key: "even",
                  text: "Select Even Row",
                  onSelect: changableRowKeys => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                      if (index % 2 !== 0) {
                        return true;
                      }
                      return false;
                    });
                    this.selectedRowKeys = newSelectedRowKeys;
                  }
                }
              ],
              onSelection: this.onSelection
            };
          }
        },
        methods: {
            // 单选事件，选中的某一项返回的数据
            
            onSelectChange(selectedRowKeys,selectedRows) {
              this.selectedRows = selectedRows;
              bus.$emit("one",this.selectedRows)
              bus.$emit("show",this.isShow)
            },
            // 当前页发生变化的时候
            onChange(pageNumber,selectedRows) {
              this.$emit("changePage",false)
                bus.$emit("currentPage",pageNumber)
            },
        },
        mounted(){
          // this.selectTemplate = false
          // bus.$on("changeLoading",data=>{
          //   console.log(data,"哦啦啦啦");
          //     this.loading = data;
          // })
        }
    };
</script>

<style lang="scss" scoped>
  .selectTemplateList{
        .pagination{
          float: right;
          margin: 50px 0;
        }
        .pagination::after{
            content : "";
            display : block;
            clear: both;
        }
        .selectTemplate .ant-modal-content{
            background: yellow !important;
        }
        .ant-pagination{
          margin-top:15px;
          margin-left:815px;
        }
    }
</style>

