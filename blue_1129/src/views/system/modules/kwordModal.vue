<template>
  <a-modal
    :title="title"
    :centered="true"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
    wrapClassName="ant-modal-cust-warp"
  >
    <a-form :form="form" @submit="handleOk">
      <a-form-item label="领域" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input :disabled="true" v-decorator="['domain',{rules: [{ required: true, message: '请输入领域名称!' }]}]" />
      </a-form-item>
      <a-form-item label="业务" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input :disabled="true" v-decorator="['business',{rules: [{ required: true, message: '请输入业务名称!' }]}]" />
      </a-form-item>
      <!-- <a-form-item label="关键词/分类" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input :disabled="true" v-decorator="['keyWordOrType',{rules: [{ required: true, message: '请输入关键词/分类!' }]}]" />
      </a-form-item>
      <a-form-item label="类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input :disabled="true" v-decorator="['categoryId',{rules: [{ required: true, message: '请输入类型名称!' }]}]" />
      </a-form-item> -->
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['keyWordName',{rules: [{ required: true, message: '请输入名称!' }]}]" />
      </a-form-item>
      <a-form-item label="必须包含" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['mustHas']" />
      </a-form-item>
      <a-form-item label="只含其一" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['haveOne']" />
      </a-form-item>
      <a-form-item label="不得包含" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input placeholder="请输入..." v-decorator="['haveNone']" />
      </a-form-item>
      <a-form-item label="优先级" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select placeholder="请选择..." v-decorator="['keywordLevel',{rules: [{ required: true, message: '请输入优先级!' }]}]">
          <a-select-option v-for="item in leval" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { editKeyWord, addKeyWord } from '@api/api';
const leval = [{ id: 1, name: "低" },{ id: 2, name: "中" },{ id: 3, name: "高" }];
const status = [{ id: 0, name: "未启用" }, { id: 1, name: "启用" }];

export default {
  data() {
    return {
      leval,
      status,
      visible: false,
      title: "编辑",
      form: this.$form.createForm(this),
    };
  },
  props: {
    propData: {
      type: Object,
      default: () => {}
    }
  },  
  methods: {
    setVal(record) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          domain: record.domain,
          business: record.business,
          keyWordName: record.keyWordName,
          mustHas: record.mustHas,
          haveOne: record.haveOne,
          haveNone: record.haveNone,
          keywordLevel: Number(record.keywordLevel),
        })
      })
    },
    show(record) {
      this.visible = true;
      this.setVal(record);
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if(!err) {
          let param = Object.assign({}, values);
          param.categoryId = this.propData.categoryId
          param.domainId = this.propData.domainId
          param.businessId = this.propData.businessId
          editKeyWord(param).then(res => {
            if(res.success) {
              this.$message.success('成功！')
              this.$emit('close');
              this.handleCancel();
            } else {
              this.$message.error('失败！')
              this.handleCancel();
            }
          })
        }
      })
      
    },
    handleCancel() {
      this.visible = false;
      this.form.resetFields();
    }
  }
};
</script>