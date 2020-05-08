<template>
  <a-modal
    title="查看"
    :visible="show"
    :maskClosable="false"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
  <a-spin :spinning="spinning">
    <div style="max-height:430px;overflow-y:auto">
      <a-form :form="form">
        <a-form-item label="节目名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入信息..." :disabled="disable" v-decorator="[ 'name']"/>
        </a-form-item>
        <a-form-item label="首次发现网站" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入信息..." :disabled="disable" v-decorator="[ 'source']"/>
        </a-form-item>
        <a-form-item label="链接地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入信息..." :disabled="disable" v-decorator="[ 'programUrl']"/>
        </a-form-item>
        <a-form-item label="节目简介" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入信息..." :disabled="disable" v-decorator="[ 'categoryKey']"/>
        </a-form-item>
		<a-form-item label="节目来源" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input placeholder="请输入信息..." :disabled="disable" v-decorator="[ 'insertTime']"/>
        </a-form-item>	
      </a-form>
    </div>
  </a-spin>
  </a-modal>
</template>

<script>

export default {
	name:'stepJudgeDivView2',
  data() {
    return {
			show: false,
      spinning: false,
      disable: true,
			form: this.$form.createForm(this),
		};
	},
  props: {
    item: {
      type: Object,
      default:() => {}
    },
  },
  mounted () {
  },
  methods: {
		showModal(record) { 
			this.show = true;
			this.$nextTick(() => {
				this.form.setFieldsValue({
					name: record.name,
					source: record.source,
					programUrl: record.programUrl,
					categoryKey: record.categoryKey,
					insertTime: record.insertTime,
				})
			})
		},
    handleSubmit(e) {
			this.handleCancel();
    },
    handleCancel() {
			this.form.resetFields();
			this.show = false;
		},
  }
};
</script>

<style lang="scss" scoped>
/deep/.ant-modal-body {
  width:100%;
  height: 430px;
  padding:0;
}
</style>