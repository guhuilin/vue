<template>
  <a-row :gutter="10">
    <a-col :md="12" :sm="24">
      <a-card :bordered="false">
        <!-- 按钮操作区域 -->
        <a-row style="margin-left: 14px">
          <a-button @click="handleAdd" type="primary" v-if="hasPerm('add')">添加</a-button>
          <a-button title="删除多条数据" @click="batchDel" type="danger" v-if="hasPerm('delete')" style="margin-left: 20px;">删除</a-button>
        </a-row>
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <!-- 树-->
          <a-col :md="10" :sm="24">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
                <span style="user-select: none">
                  <a-tree
                    checkable
                    multiple
                    @select="onSelect"
                    @check="onCheck"
                    @rightClick="rightHandle"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :treeData="departTree"
                    :checkStrictly="true"
                    :expandedKeys="iExpandedKeys"
                    :autoExpandParent="autoExpandParent"
                    @expand="onExpand"
                  />
                </span>
                <!--新增右键点击事件,和增加添加和删除功能-->
                <!-- <a-menu slot="overlay">
                  <a-menu-item @click="handleAdd(3)" key="1" v-if="hasPerm('add')">添加</a-menu-item>
                  <a-menu-item @click="handleDelete" key="2" v-if="hasPerm('delete')">删除</a-menu-item>
                  <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
                </a-menu> -->
              </a-dropdown>
            </template>
          </a-col>
        </div>
      </a-card>
    </a-col>
    <a-col :md="12" :sm="24">
      <a-card :bordered="false">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构名称">
            <a-input
              placeholder="请输入机构/部门名称"
              v-decorator="['departName', validatorRules.departName ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门">
            <a-tree-select
              style="width:100%"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="treeData"
              :disabled="disable"
              v-model="model.parentId"
              placeholder="无"
            ></a-tree-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构编码">
            <a-input
              placeholder="请输入机构编码"
              v-decorator="['orgCode', validatorRules.orgCode ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number v-decorator="[ 'departOrder',{'initialValue':0}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
            <a-input placeholder="请输入手机号" v-decorator="['mobile', {'initialValue':''}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
            <a-input placeholder="请输入地址" v-decorator="['address', {'initialValue':''}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-textarea placeholder="请输入备注" v-decorator="['memo', {'initialValue':''}]" />
          </a-form-item>
        </a-form>
        <div class="anty-form-btn" v-if="hasPerm('edit')">
          <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
          <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">修改并保存</a-button>
        </div>
      </a-card>
    </a-col>
    <depart-modal ref="departModal" @ok="loadTree"></depart-modal>
  </a-row>
</template>
<script>
import DepartModal from "./modules/DepartModal";
import pick from "lodash.pick";
import {
  queryDepartTreeList,
  searchByKeywords,
  deleteByDepartId
} from "@/api/api";
import { httpAction, deleteAction } from "@/api/manage";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { hasPerm } from "@/utils/authFilter";

export default {
  name: "DepartList",
  mixins: [JeecgListMixin],
  components: {
    DepartModal
  },
  data() {
    return {
      iExpandedKeys: [],
      loading: false,
      autoExpandParent: true,
      currFlowId: "",
      currFlowName: "",
      disable: true,
      treeData: [],
      visible: false,
      departTree: [],
      rightClickSelectedKey: "",
      hiding: true,
      model: {},
      dropTrigger: "",
      depart: {},
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      autoIncr: 1,
      currSelected: {},
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      graphDatasource: {
        nodes: [],
        edges: []
      },
      validatorRules: {
        departName: {
          rules: [{ required: true, message: "请输入机构/部门名称!" }]
        },
        orgCode: { rules: [{ required: true, message: "请输入机构编码!" }] },
        mobile: { rules: [{ validator: this.validateMobile }] }
      },
      url: {
        edit: "/nmmonitor-server/department/editDepart",
        deleteBatch: "/nmmonitor-server/department/delDepartBatch"
      }
    };
  },
  methods: {
    hasPerm,
    loadData() {
      this.refresh();
    },
    loadTree() {
      this.treeData = [];
      this.departTree = [];
      queryDepartTreeList().then(res => { 
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i];
            this.treeData.push(temp);
            this.departTree.push(temp);
            this.setThisExpandedKeys(temp);
          }
          this.loading = false;
        }
      });
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key);
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a]);
        }
      }
    },
    refresh() {
      this.loading = true;
      this.loadTree();
    },
    // 右键操作方法
    rightHandle(node) {
      this.dropTrigger = "contextmenu";
      this.rightClickSelectedKey = node.node.eventKey;
    },
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = "";
      }
    },
    // 右键店家下拉关闭下拉框
    closeDrop() {
      this.dropTrigger = "";
    },
    batchDel: function() {
      if (this.checkedKeys.length <= 0) {
        this.$message.warning("请选择一条记录！");
      } else {
        let ids = "";
        for (let a = 0; a < this.checkedKeys.length; a++) {
          ids += this.checkedKeys[a] + ",";
        }
        let that = this;
        this.$confirm({
          title: "确认删除",
          content: "确定要删除所选中的 " + this.checkedKeys.length + " 条数据?",
          onOk: function() {
            deleteAction(that.url.deleteBatch, { ids: ids }).then(res => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadTree();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            });
          }
        });
      }
    },
    onSearch(value) {
      let that = this;
      if (value) {
        searchByKeywords({ keyword: value }).then(res => {
          if (res.success) {
            that.departTree = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.departTree.push(temp);
            }
          } else {
            that.$message.warning(res.message);
          }
        });
      } else {
        that.loadTree();
      }
    },
    onCheck(checkedKeys, info) {
      this.hiding = false;
      this.checkedKeys = checkedKeys.checked;
    },
    onSelect(selectedKeys, e) {   
      this.hiding = false;
      let record = e.node.dataRef;
      this.currSelected = Object.assign({}, record);
      this.model = this.currSelected;
      this.selectedKeys = [record.key];
      this.model.parentId = record.parentId;
      this.setValuesToForm(record);
    },
    // 触发onSelect事件时,为部门树右侧的form表单赋值
    setValuesToForm(record) {
      this.form.getFieldDecorator("fax", { initialValue: "" });
      this.form.setFieldsValue(
        pick(
          record,
          "departName",
          "orgCode",
          "departOrder",
          "mobile",
          "fax",
          "address",
          "memo"
        )
      );
    },
    getCurrSelectedTitle() {
      return !this.currSelected.title ? "" : this.currSelected.title;
    },
    onClearSelected() {
      this.hiding = true;
      this.checkedKeys = {};
      this.currSelected = {};
      this.form.resetFields();
      this.selectedKeys = [];
    },
    submitCurrForm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.currSelected.id) {
            this.$message.warning("请点击选择要修改部门!");
            return;
          }
          let formData = Object.assign(this.currSelected, values);
          httpAction(this.url.edit, formData, "put").then(res => {
            if (res.success) {
              this.$message.success("保存成功!");
              this.loadTree();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    emptyCurrForm() {
      this.form.resetFields();
    },
    handleAdd(e) {
      if(this.selectedKeys[0]) {
        this.$refs.departModal.add(this.selectedKeys);
        this.$refs.departModal.title = "新增";
      } else {
        this.$refs.departModal.add();
        this.$refs.departModal.title = "新增";
      }
    },
    handleDelete() {
      deleteByDepartId({ id: this.rightClickSelectedKey }).then(resp => {
        if (resp.success) {
          this.$message.success("删除成功!");
          this.loadTree();
        } else {
          this.$message.warning("删除失败!");
        }
    
            })
    }}
    };
</script>

<style scoped>
    .ant-card-body .table-operator {
        margin: 15px;
    }

    .anty-form-btn {
        width: 100%;
        text-align: center;
    }

    .anty-form-btn button {
        margin: 0 5px;
    }

    .anty-node-layout .ant-layout-header {
        padding-right: 0;
    }

    .header {
        padding: 0 8px;
    }

    .header button {
        margin: 0 3px;
    }

    .ant-modal-cust-warp {
        height: 100%;
    }

    .ant-modal-cust-warp .ant-modal-body {
        height: calc(100% - 110px) !important;
        overflow-y: auto;
    }

    .ant-modal-cust-warp .ant-modal-content {
        height: 90% !important;
        overflow-y: hidden;
    }

    #app .desktop {
        height: auto !important;
    }

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}
</style>