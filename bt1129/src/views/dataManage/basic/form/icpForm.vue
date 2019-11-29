<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增ICP信息
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="8" :sm="8">
                    <a-form-item label="网站名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="网站域名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="ip地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="网站备案名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="icp备案号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="所属区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select>
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="主办单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="主办单位性质" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select>
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="8" :sm="8">
                    <a-form-item label="发现时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-date-picker style="width: 100%;"/>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <div style="text-align: center;margin-top: 10px;">
            <a-button type="primary" @click="back">取消</a-button>
            <a-button type="primary" @click="" style="margin-left: 8px;">保存</a-button>
        </div>
    </a-card>
</template>

<script>
    export default {
        name: 'icpForm',
        data() {
            return {
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 5},
                    sm: {span: 8},
                },
                wrapperCol: {
                    xs: {span: 8},
                    sm: {span: 16},
                }
            }
        },
        methods: {
            back() {
                this.$emit('back');
            }
        }
    }
</script>

<style scoped>

</style>