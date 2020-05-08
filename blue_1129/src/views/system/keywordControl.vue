<template>
  <div style="height:100%;background:#fff">
    <a-row :gutter="24" style="height: 100%;background:#fff">
      <a-col :md="5" :sm="24" class="leftDiv">
        <div style="height: 100%;background: #eee;">
          <div class="treeDiv">
            <a-tree 
              multiple
              :treeData="programTree" 
              :selectedKeys="selectedKeys" 
              @select="onSelect"
              :checkedKeys="checkedKeys"
            />
          </div>
        </div>
      </a-col>
      <a-col :md="19" :sm="24" class="rightDiv">
        <div style="height: 100%;background: white;padding-top:9px">
          <div class="searDiv">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :md="6" :sm="6">
                  <a-form-item
                    label="关键字名称"
                    :label-col="{ span: 10 }"
                    :wrapper-col="{ span: 14 }"
                    style="width: 100%;"
                  >
                    <a-input v-model.trim="search.title" placeholder="请输入..." />
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="6">
                  <a-form-item
                    label="关键字状态"
                    :label-col="{ span: 10 }"
                    :wrapper-col="{ span: 14 }"
                    style="width: 100%;"
                  >
                    <a-select placeholder="请选择..." v-model="search.status">
                      <a-select-option value="0" >未启用</a-select-option>
                      <a-select-option value="1" >启用</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="6">
                  <a-form-item label="优先级" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" style="width: 100%;" >
                    <a-select placeholder="请选择..." v-model="search.level">
                      <a-select-option :value="1" >低</a-select-option>
                      <a-select-option :value="2" >中</a-select-option>
                      <a-select-option :value="3" >高</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="6">
                  <span
                    style="float: left;overflow: hidden;margin-top:4px;"
                    class="table-page-search-submitButtons"
                  >
                    <a-button type="primary" @click="querySearch" icon="search">查询</a-button>
                    <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div>
            <a-button type="primary" @click="queryAdd" icon="plus">添加</a-button>
          </div>

          <a-table
            style="margin-top: 1%;"
            ref="table"
            size="middle"
            rowKey="categoryId"
            bordered
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :scroll="{x: 1500}"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="textCheck, record">
							<a-button @click="editor(record)">编辑</a-button><a-divider type="vertical" />
							<a-button @click="delData(record)">删除</a-button><a-divider type="vertical" />
							<a-button @click="userYes(record)" :disabled="record.status !== '0'">启用</a-button><a-divider type="vertical" />
							<a-button @click="userNo(record)" :disabled="record.status !== '1'">禁用</a-button>
            </span>
          </a-table>
        </div>
      </a-col>
    </a-row>
    <kwordModal ref="kwordModal" @close="close" :propData="propData" />
    <addKwordModal ref="addKwordModal" @close="close" :addData="addData" />
  </div>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getProgramCategroyInfoList, treeData, findDetailData, useOrNot, deleteData, } from "@api/api";
import { hasPerm } from "@/utils/authFilter";
import kwordModal from './modules/kwordModal'
import addKwordModal from './modules/addKwordModal'


export default {
  name: "textCheck",
  mixins: [JeecgListMixin],
  components: {
    kwordModal, addKwordModal
  },
  data() {
    return {
      checkPagination: false,
      arrId: [],
      checkedKeys: [],
      propData: {},
      addData: {},
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      search: {
        status: "",
        title: "",
        level: ""
      },
      queryParam: {
        id: [],
        table: "",
        bussinessId: ""
      },
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      programTree: [],
      selectedKeys: [],
      columns: [
        {
          title: "名称",
          dataIndex: "keyWordName",
          align: "center",
					width: 200,
					customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "必须包含",
          dataIndex: "mustHas",
          align: "center",
          width: 100,
					customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "只含其一",
          dataIndex: "haveOne",
          align: "center",
          width: 100,
					customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "不得包含",
          dataIndex: "haveNone",
          align: "center",
          width: 100,
					customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "优先级",
          dataIndex: "keywordLevel",
          align: "center",
          customRender: function(t, r, index) {
            switch (t) {
              case "1": {
                return "低";
              }
              case "2": {
                return "中";
              }
              case "3": {
                return "高";
              }
            }
          }
        },
        {
          title: "领域",
          dataIndex: "domain",
          align: "center",
          width: 100,
					customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "业务",
          dataIndex: "business",
          align: "center",
          width: 100,
					customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "类型",
          dataIndex: "type",
          align: "center",
					customRender: function (t, r, index) {
            return t ? t : '--';
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
          fixed: "right",
          width: 350,
        }
      ],
      url: {
        list: "/nmmonitor-server-keyword/keyWord/findDetailData"
      }
    };
  },
  created() {
    this.getProgramCategroyInfoList();
  },
  methods: {
    hasPerm,
    querySearch() {
      this.loading = true;
      findDetailData(this.search).then(res => {
          if (res.success) { console.log(res.result,'....')
            this.dataSource = res.result;
          } else {
            this.$message.error('查询失败!');
          }
          this.loading = false;
      });
    },
    searchReset() {
      this.search = {};
      if(Number(this.addData.id) > 1 && this.addData.table == "program") {
        this.treeData(this.queryParam);
      } else {
        this.querySearch();
      }
    },
    getProgramCategroyInfoList() {
      this.loading = true; 
      getProgramCategroyInfoList({}).then(res => {
        if (res.success) { 
          this.loading = false; 
          this.programTree = res.result.children;
        } else {
          console.log(res.message);
        }
      });
    },
    mapArr(val) {
      if (val.children) {
        val.children.map(item => {
          this.arrId.push(item.id);
        });
      }
    },
    onSelect(selectedKeys, e) {
      let record = e.node.dataRef;
      this.addData = record;
      this.arrId = [];
      this.arrId.push(record.id);
      if (record.children) {
        this.mapArr(record);
      }
      if (Number(record.id) > 1 && record.table == "program") {
        let obj = {
          id: this.arrId, // 数组
          table: record.table,
          bussinessId: record.bussinessId,
          typeName: record.title
        };
        this.selectedKeys = [record.key];
        this.getListData(obj);
      }
    },
    getListData(obj) { 
      if (obj.table === "program") {
        let xxx = this.arrId.join(",");
        this.queryParam.id = xxx;
        this.queryParam.typeName = obj.typeName;
        this.queryParam.table = obj.table ? obj.table : " ";
        this.queryParam.bussinessId = obj.bussinessId ? obj.bussinessId : " ";
        this.treeData(this.queryParam);
      }
    },
    treeData(obj) {
      let objs = Object.assign({}, obj)
      objs.pageNo = this.ipagination.current;
      objs.pageSize = this.ipagination.pageSize;
      this.loading = true; 
      treeData(objs).then(res => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        } else {
          this.$message.error(res.message);
        }
        this.loading = false;
      });
    },
    handleTableChange(pagination, filters, sorter) {
      // if(!this.checkPagination) {
      //   this.loadData();
      // } else {
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.treeData(this.queryParam);
      // }
      
    },
		userYes(obj) {
			useOrNot({status: 1,categoryId:obj.categoryId}).then(res => {
				if (res.success) {
          this.$message.success("启用成功！"); 
          this.checkGet();
				} else {
					this.$message.error(res.message);
				}
			})
		},
		userNo(obj) {
			useOrNot({status: 0,categoryId:obj.categoryId}).then(res => {
				if (res.success) {
					this.$message.success("禁用成功！");
					this.checkGet();
				} else {
					this.$message.error(res.message);
				}
			})
    },
    queryAdd() {
      if(this.addData.leafs == '1' || typeof(this.addData.leafs) == 'object') { 
        this.$message.warning("禁止添加！");
      } else if(typeof(this.addData.id) == 'undefined' || this.addData.table == 'domain'){
        this.$message.info("请选择！");
      }else {
        this.$refs.addKwordModal.show();
      }
    },
    editor(record) {
      this.propData = record;
      this.$refs.kwordModal.show(record);
    },
    delData(record) { 
			let that = this;
      this.$confirm({
        title: "提示",
        content: "确定要删除此条记录么？",
        onOk() {
          deleteData({categoryId: record.categoryId}).then(res => {
            if (res.success) {
              that.$message.success("删除成功！");
              that.treeData(that.queryParam);
              that.getProgramCategroyInfoList();
            } else {
              that.$message.error(res.message);
            }
          });
        },
        onCancel() {}
      });
    },
    checkGet() {
      if(Number(this.addData.id) > 1 && this.addData.table == "program") {
        this.treeData(this.queryParam);
      } else {
        this.querySearch();
      }
    },
    close() {
      // this.treeData(this.queryParam);
      if(Number(this.addData.id) > 1 && this.addData.table == "program") {
        this.treeData(this.queryParam);
        this.getProgramCategroyInfoList()
      } else {
        this.querySearch();
        this.getProgramCategroyInfoList()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  height: 5%;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 15px;
  font-weight: bold;
}

.leftDiv {
  height: 100%;

  .treeDiv {
    height: 95%;
    overflow: auto;
  }
}

.rightDiv {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .searDiv {
    padding-left: 15px;
  }

  .titleSpan {
    display: inline-block;
    white-space: nowrap;
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>