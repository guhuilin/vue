<template>
    <div>
        <a-form :form="form">
            <a-row>
                <a-col :md="23" :sm="8">
                    <a-form-item label="附件名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input v-decorator="['appendixTypeName', {rules: [{required: true, message: '请输入附件名称!'}]}]"></a-input>
                    </a-form-item>
                </a-col>

                <a-col :md="1" :sm="8">
                    <a-form-item label="">
                        <a-button type="danger" @click="delFile($event)">删除</a-button>
                    </a-form-item>
                </a-col>

                <a-col :md="23" :sm="8">
                    <a-form-item label="附件编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input v-decorator="['tableNameCode', {rules: [{required: true, message: '请输入附件编码!'}, {validator: validateCode}]}]"></a-input>
                    </a-form-item>
                </a-col>

                <a-col :md="23" :sm="8">
                    <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-radio-group :options="['是', '否']" v-decorator="['used', { initialValue: '是' }]"/>
                    </a-form-item>
                </a-col>

                <a-col :md="23" :sm="8">
                    <a-form-item label="字段" :labelCol="labelCol" :wrapperCol="{xs: { span: 18 },sm: { span: 18 }}">
                        <a-tag v-for="field in fileObj.fieldTypeList" :key="field.id" closable @close="delField($event, field)">
                            {{field.fieldName}}
                        </a-tag>
                        <a-tag @click="addField" style="background: #fff; borderStyle: dashed;">
                            <a-icon type="plus"/>
                            新增字段
                        </a-tag>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <a-table
                ref="table"
                bordered
                size="middle"
                rowKey="id"
                :columns="columns"
                :dataSource="dataSource"
                :loading="loading"
                :pagination="false"
                :scroll="{ x: tableScrollWidth }"
                style="margin-top: 10px;"
                v-if="columns.length > 0">
        </a-table>

        <fieldModal ref="fieldModal" :fieldType="1" @slctField="slctField"></fieldModal>
    </div>
</template>

<script>
    import fieldModal from './fieldModal'
    import { getFieldTypeIdList, isExistsTableCode } from '@api/api'
    import { differenceBy } from 'lodash'

    export default {
        name: 'fileForm',
        props: ['file', 'operation'],
        components: {
            fieldModal
        },
        data() {
            return {
                fileObj: {},
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 5},
                    sm: {span: 2},
                },
                wrapperCol: {
                    xs: {span: 8},
                    sm: {span: 4},
                },
                columns: [],
                dataSource: [],
                oldFieldList: [],
                fieldUpdateList: [],
                loading: false,
                fieldIdList: [],
                tableScrollWidth: 0
            }
        },
        mounted() {
            this.fileObj = Object.assign({}, this.file);
            this.loadData();
        },
        methods: {
            loadData() {
                this.loading = true;
                if (this.operation === 'edit') {
                    this.oldFieldList = JSON.parse(JSON.stringify(this.fileObj.fieldTypeList));
                }
                this.getColumns(this.fileObj.fieldTypeList);
                if (this.fileObj.fieldTypeList.length > 0) {
                    getFieldTypeIdList({count: this.fileObj.fieldTypeList.length}).then((res) => {
                        if (res.success) {
                            let fieldIdList = res.result;
                            this.fileObj.fieldTypeList.forEach((field, index) => {
                                field.fieldId = fieldIdList[index];
                            });
                            this.$emit('addField', this.fileObj);
                        } else {
                            console.log(res.message);
                        }
                    });
                }
                this.form.setFieldsValue(
                    {
                        appendixTypeName: this.fileObj.appendixTypeName,
                        tableNameCode: this.fileObj.tableNameCode,
                        used: this.fileObj.used === 'T' ? '是' : '否'
                    }
                );
                this.loading = false;
            },
            getColumns(arr) {
                this.columns = [];
                arr.forEach(field => {
                    let obj = {
                        title: field.fieldName,
                        align: 'center',
                        dataIndex: field.fieldCode,
                        width: 200
                    };
                    this.columns.push(obj);
                });
                this.tableScrollWidth = this.columns.length * 200;
            },
            validateCode(rule, value, callback) {
                let reg = new RegExp(/(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/);
                let getCode = value
                if (reg.test(value)) {
                    let param = {
                        tableId: this.operation === 'edit' ? this.file.tableId : '',
                        tableCode: value
                    };
                    if(param.tableCode !== getCode) {
                        isExistsTableCode(param).then((res) => {
                            if (res.result) {
                                callback("存在编码同名附件！");
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                } else {
                    callback("请以字母或下划线开头，并且不存在中文！");
                }
            },
            addField() {
                this.$refs.fieldModal.add();
                this.$refs.fieldModal.title = "新增字段";
                this.$refs.fieldModal.selectionRow = Array.from(this.fileObj.fieldTypeList);
                this.$refs.fieldModal.selectedRowKeys = this.fileObj.fieldTypeList.map(field => {
                    return field.id;
                });
            },
            slctField(arr) {
                if (this.operation === 'edit') {
                    this.fieldUpdateList = differenceBy(arr, this.oldFieldList, 'id');
                }
                getFieldTypeIdList({count: arr.length}).then((res) => {
                    if (res.success) {
                        this.fieldIdList = res.result;
                        this.fileObj.fieldTypeList = arr;
                        this.fileObj.fieldTypeList.forEach((field, index) => {
                            field.fieldId = this.fieldIdList[index];
                        });
                        this.getColumns(this.fileObj.fieldTypeList);
                        this.$emit('addField', this.fileObj);
                        this.$message.success('新增成功！');
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getFile() {
                let obj = this.form.getFieldsValue(['appendixTypeName', 'tableNameCode', 'used']);
                this.fileObj.appendixTypeName = obj.appendixTypeName;
                this.fileObj.tableNameCode = obj.tableNameCode;
                this.fileObj.used = obj.used === '是' ? 'T' : 'F';
                return this.fileObj;
            },
            delField(e, obj) {
                e.preventDefault();
                let self = this;
                self.$confirm({
                    title: '删除提示',
                    content: '确定删除当前字段?',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        self.fileObj.fieldTypeList = self.fileObj.fieldTypeList.filter(field => {
                            return field.id != obj.id;
                        });
                        self.getColumns(self.fileObj.fieldTypeList);
                        self.$emit('addField', self.fileObj);
                        self.$message.success('删除成功！');
                    },
                    onCancel() {
                        self.$message.info('取消操作！');
                    },
                });
            },
            delFile(e) {
                e.preventDefault();
                let self = this;
                self.$confirm({
                    title: '删除提示',
                    content: '确定删除当前附件?',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        self.$emit('delFile', self.fileObj.appendixId);
                    },
                    onCancel() {
                        self.$message.info('取消操作！');
                    },
                });
            },
            getState() {
                return new Promise((resolve, reject) => {
                    this.form.validateFields((err, values) => {
                        if (err) {
                            resolve('fail');
                        } else {
                            resolve('success');
                        }
                    });
                })
            }
        }
    }
</script>

<style scoped>

</style>