<template>
  <a-modal
    :title="title"
    :width="800"
    :bodyStyle="bodyStyle"
    :centered="true"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
    :okButtonProps="{ props: {disabled: true} }"
    :cancelButtonProps="{ props: {disabled: true} }"
    wrapClassName="ant-modal-cust-warp"
  >
    <show-flow v-if="visible" :data="data" :showId="showId"></show-flow>
  </a-modal>
</template>

<script>
import ShowFlow from './showFlow'
import bus from '../../monitoring-Supervision/bus/bus'

export default {
  name: "FlowModal",
  data() {
    return {
      data: {},
      flag: 0,
      title: "",
      visible: false,
      showId: '',
      model: {},
      menuLabel: "工作流名称",
      labelCol: { xs: { span: 24 }, sm: { span: 4 }},
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 }},
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: { name: { rules: [{ required: true, message: "请输入菜单标题!" }] }},
      bodyStyle: {
        padding: 0,
        height: '100%'
      }
    };
  },
  components: { ShowFlow },
  methods: {
    add() {
      this.edit({});
    },
    edit(record) {
      this.data = JSON.parse(record.actActivitiDiagramJson).showJson  // 获取showId
      this.showId = JSON.parse(record.actActivitiDiagramJson).taskId
      bus.$emit('dataProp', this.data)
      this.form.resetFields();
      this.model = Object.assign({}, record);

      this.visible = true;
    },
    close() {
      this.$emit("close");
      this.visible = false;
    },
    handleCancel() {
      this.close();
    },
  }
};
</script>

<style lang="scss" scoped>
</style>