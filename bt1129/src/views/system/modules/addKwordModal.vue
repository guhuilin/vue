<template>
  <a-modal
    title="添加"
    :centered="true"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
		<a-form :form="form" @submit="handleOk">
      <a-form-item label="类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input :disabled="true" v-decorator="['categoryId',{rules: [{ required: true, message: '请输入类型名称!' }]}]" />
      </a-form-item>
      <a-form-item label="关键词/分类" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select placeholder="请选择..." @select="selKeyWordOrType" v-decorator="['keyWordOrType',{initialValue: 1,rules: [{ required: true, message: '请输入关键词/分类!' }]}]">
          <a-select-option :value="1">关键词</a-select-option>
          <a-select-option :disabled="addData.table == 'business' || addData.table == 'domain' || addData.table == 'null'" :value="2">分类</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['keyWordName',{rules: [{ required: true, message: '请输入名称!' }]}]" />
      </a-form-item>
      <a-form-item v-if="selVal == 1" label="必须包含" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['mustHas']" />
      </a-form-item>
      <a-form-item v-if="selVal == 1" label="只含其一" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['haveOne']" />
      </a-form-item>
      <a-form-item v-if="selVal == 1" label="不得包含" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['haveNone']" />
      </a-form-item>
      <a-form-item v-if="selVal == 1" label="优先级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select placeholder="请选择..." v-decorator="['keywordLevel',{rules: [{ required: true, message: '请输入优先级!' }]}]">
          <a-select-option v-for="item in leval" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
	</a-modal>
</template>

<script>
domainAndBusiness
import { domainAndBusiness,addKeyWord } from "@api/api";
const leval = [{ id: 1, name: "低" },{ id: 2, name: "中" },{ id: 3, name: "高" }];

export default {
  data() {
    return {
      leval,
      visible: false,
      selVal: 1,
      params: {},
      form: this.$form.createForm(this),
    };
  },
  props: ['addData'],
  methods: {
    selKeyWordOrType(val) {
      this.selVal = val;
    },
		handleCancel() {
      this.visible = false;
      this.form.resetFields();
		},
		handleOk() {
      this.form.validateFields((err, values) => {
        if(!err) {
          let obj = Object.assign({}, values);
          let params = {
            domainId: this.addData.domainId,
            businessId: this.addData.bussinessId,
            codeLevel: this.addData.codeLevel,
            table: this.addData.table,
            ...obj
          }
          params.categoryId = this.addData.id;
          addKeyWord(params).then(res => {
            if (res.success) {
              this.$message.success("添加成功!");
            } else {
              this.$message.error("添加失败!");
            }
            this.form.resetFields();
            this.visible = false;
            this.$emit('close');
          })
        }
      })
		},
    show() {
      domainAndBusiness().then(res => {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            categoryId: this.addData.title
          })
        })
      })
      this.visible = true;
    }
  }
};
</script>