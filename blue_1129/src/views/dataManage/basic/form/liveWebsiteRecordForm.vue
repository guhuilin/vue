<template>
    <a-card :bordered="false" style="height: 100%;">
        <a-row class="formTitle">
            新增直播网站
        </a-row>

        <a-form :form="form">
            <a-row :gutter="24">
                <a-col :md="10" :sm="8">
                    <a-form-item label="网站名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="域名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="地点" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="ICP备案证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="开办单位类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select>
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="网站类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select>
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="Alex排名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input placeholder="请输入..."/>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="是否提供网络直播" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select>
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="节目更新情况" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select>
                            <a-select-option value="test">测试</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :md="10" :sm="8">
                    <a-form-item label="记录时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
        name: 'shortVideoWebsiteRecordForm',
        data() {
            return {
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 5},
                    sm: {span: 6},
                },
                wrapperCol: {
                    xs: {span: 8},
                    sm: {span: 18},
                },
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