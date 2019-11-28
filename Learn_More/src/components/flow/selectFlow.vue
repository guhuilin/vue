<template>
  <div class="alert">
    <div class="alertWrap" style="background:rgba(42, 47, 59, 0.7)">
      <div class="contFlow" :style="[innerWidth]">
        <div class="title" style="background:#fff;border-bottom:1px solid #ccc;">选择工作流</div>
        <!-- 列表选择 -->
        <div style="width:100%;flex:1;overflow:hidden;padding-top:24px;">
          <searchFlow />
          <tableFlow :columns="columns" :rowSelection="{rowSelection,type:'radio',onChange:onSelectChange}" />
        </div>
        <div class="btn">
          <a-button @click="cancel">取消</a-button>
          <a-button @click="handleOk" type="primary">确定</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import tableFlow from '@views/system/modules/TableFlow'
import searchFlow from '@views/system/modules/SearchFlow'
 
export default {
  data() {
    return {
      columns: [
        {
          title: "id",
          align: "center",
          dataIndex: "actUserInfoId"
        },
        {
          title: "流程名称",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "创建人",
          align: "center",
          dataIndex: "createBy"
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        },
      ],
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条";
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 10
      },
    };
  },
  components: {
    tableFlow, searchFlow
  },
  props: {
    bgColor: { default: "#fff" }, // 背景色
    width: { required: true, type: Number }, //宽度
    minWidth: { type: Number, default: 0 }
  },
  computed: {
    ...mapState({
      selectFlow: state => state.dagStore.selectFlow,
    }),
    innerWidth() {
      let dfu = { backgroundColor: this.bgColor };
      this.minWidth > 0 ? (dfu.minWidth = `${this.minWidth}px`) : (dfu.width = `${this.width}px`);
      return dfu;
    },
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelection: this.onSelection
      };
    }
  },
  methods: {
    ...mapActions(['selectFlowData']),
    cancel() {
      this.$emit("cancel");
    },
    handleOk() {
      this.selectFlowData(this.selectedRows);
      console.log(this.selectFlow,'选中的数据，存放于vuex中')
      this.$emit("cancel");
    },
    // 单选事件，选中的某一项返回的数据
    onSelectChange(selectedRowKeys,selectedRows) {
      this.selectedRows = selectedRows[0];
    },
  }
};
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  .alertWrap { width: 100%; height: 100%; }
  .contFlow {
    min-width: 200px;
    max-height: 600px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 4px;
    z-index: 2000;
    .ant-table-wrapper {
      padding: 24px 24px 0 24px;
      height:500px;
      overflow-y: scroll;
    }
    .ant-table-wrapper::-webkit-scrollbar { display:none }
    // /deep/.ant-table { line-height: 0.1; }
    .title {
      width: 100%;
      height: 52px;
      line-height: 52px;
      padding-left: 14px;
      border-radius: 4px 4px 0 0;
    }
  }
  .btn {
    flex-shrink:0;
    display:flex;
    width:100%;
    height:52px;
    align-items:center;
    justify-content:center;
    border-top:1px solid #ccc;
    button { margin: 0 20px; }
  }
}
</style>

