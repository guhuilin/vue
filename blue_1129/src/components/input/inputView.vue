<template>
  <a-modal
    title="查看"
    :visible="visible"
    :maskClosable="true"
    :centered="true"
    @cancel="handleCancel"
    :okButtonProps="{ props: {disabled: true} }"
    :cancelButtonProps="{ props: {disabled: true} }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item
          v-for="(item, ind) in queryList" :key="ind" v-show="item.title !== '编号'"
          :label="item.title"
          :labelCol="labelCol" 
          :wrapperCol="wrapperCol"
        >
          <!-- 普通文本 -->
          <a-input
            placeholder="请输入内容..."
            ref="leftVal"
            :disabled="true"
            :id="item.dataIndex"
            v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
          />
        <!-- <a-form-item label="虚拟查看" :labelCol="labelCol" :wrapperCol="wrapperCol">

          <a-input :disabled="true" placeholder="请输入...." v-decorator="['userName']" /> -->

          <!-- <a-checkbox-group v-decorator="[ 'rolePermissions',]">
            <a-checkbox v-for="{val, ind} in permissionList" :value="val.value" :key="ind">
              {{val.label}}
            </a-checkbox>
          </a-checkbox-group>

          <a-radio-group v-decorator="['judgeLevel',]">
            <a-radio v-for="{val,ind} in judgeLevel" :value="val.value" :key="ind">{{val.label}}</a-radio>
          </a-radio-group> -->
        </a-form-item>
      </a-form>
    </a-spin>
    
  </a-modal>
</template>

<script>
import { queryFieldtypeModelBeanJudge } from '@api/api'
import { isAllDate } from '@/utils/validate'

export default {
  data() {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this),
      queryList:[],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
  },
  props: ["viewData"],
  methods: {
    views(record, ids) {
      this.visible = true;
      this.loading = true;
      queryFieldtypeModelBeanJudge({id:ids}).then(res => {
        this.loading = false;
        res.result.sort((a, b) => {
          return a.ids - b.ids
        })
        this.queryList = res.result
        let xxx = {}
        Object.keys(record).map(item => {
          this.queryList.map(v => {
            if(item == v.dataIndex) {
              xxx[item] = record[v.dataIndex]
            }
          })
        })

        this.$nextTick(() => {
          this.form.setFieldsValue(xxx);
        });
      })
    },
    handleCancel() {
			this.visible = false;
		}
  }
};
</script>