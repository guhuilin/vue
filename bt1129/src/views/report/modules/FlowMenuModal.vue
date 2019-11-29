<template>
  <a-modal
    :title="title"
    :visible="visible"
    :maskClosable="false"
    :centered="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="分类名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="['typeName',{rules: [{ required: true, message: '请输入分类名称!' }]}]" />
      </a-form-item>
      <a-form-item label="分类描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="['describe',{rules: [{ required: true, message: '请输入分类描述!' }]}]" />
      </a-form-item>
      <a-form-item label="分类编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input-number :min="0" v-decorator="['typeNumber',{rules: [{ required: true, message: '请输入分类编号!' }]}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { updateActInstType, addActInstType } from "@api/api";

export default {
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
    };
  },
  props: {
    title: {
      type: String,
      default: "添加"
    },
    itemList: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    itemList(val) { 
      val && this.setValue(val);
    }
  },
  methods: {
    setValue(val) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          typeName: val.typeName,
          describe: val.describe,
          typeNumber: val.typeNumber,
        })
      })
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if(!err) {
          if(this.title == '添加') {
            addActInstType(values).then(res => {
              if(res.success) {
                this.$message.success('添加成功！')
                this.handleCancel();
              } else {
                this.$message.error('添加失败！')
              }
            })
          } else {
            let param = Object.assign({}, values)
            param.id = this.itemList.id;
            updateActInstType(param).then(res => {
              if(res.success) {
                this.$message.success('编辑成功！')
                this.handleCancel();
              } else {
                this.$message.error('编辑失败！')
              }
            })
          }
        }
      });
    },
    handleCancel() {
      this.form.resetFields();
      this.visible = false;
      this.$emit("close", true);
    },
    show() {
      this.visible = true;
    }
  }
};
</script>
