<template>
    <div style="height: 100%;">
        <a-spin :spinning="spinning">
            <div v-show="!fileModalShow">
                <a-form :form="form">
                    <a-row :gutter="24">
                        <a-col :md="8" :sm="8">
                            <a-form-item label="报告所属领域" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-select @change="selectDomain" placeholder="请选择..." v-decorator="[ 'domain', validatorRules.domain]">
                                    <a-select-option v-for="domain in domainList" :value="domain.id" :key="domain.id">
                                        {{domain.domainName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="8" :sm="8">
                            <a-form-item label="报告业务" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-select placeholder="请选择..." v-decorator="[ 'business', validatorRules.business]">
                                    <a-select-option v-for="business in businessList" :value="business.id"
                                                     :key="business.id">{{business.typeName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="8" :sm="8">
                            <a-form-item label="报告类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-select placeholder="请选择..." v-decorator="[ 'type', validatorRules.type]">
                                    <a-select-option v-for="type in typeList" :value="type.id" :key="type.id">
                                        {{type.typeName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="24">
                        <a-col :md="8" :sm="8">
                            <a-form-item label="模板名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-input placeholder="请输入模板名称..."
                                         v-decorator="[ 'name', validatorRules.name]"></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="24">
                        <a-col :md="8" :sm="8">
                            <a-form-item label="模板编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                                <a-input placeholder="请输入模板编号..."
                                         v-decorator="[ 'code', validatorRules.code]"></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="24">
                        <a-col :md="24" :sm="8">
                            <a-form-item label="字段" :labelCol="{xs: { span: 5 },sm: { span: 2 }}"
                                         :wrapperCol="{xs: { span: 18 },sm: { span: 22 }}">
                                <a-tag v-for="field in dataSource" :key="field.id" closable
                                       @close="delField($event, field)">{{field.fieldName}}
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
                        rowKey="fieldCode"
                        :columns="columns"
                        :dataSource="fieldDataSource"
                        :loading="loading"
                        :pagination="false"
                        :scroll="{ x: tableScrollWidth }"
                        style="margin-top: 10px;"
                        v-if="columns.length > 0">
                </a-table>

                <div style="text-align: center;margin-top: 10px;">
                    <a-button type="primary" @click="back">取消</a-button>
                    <a-button type="primary" @click="fileShow" style="margin-left: 8px;">添加附件</a-button>
                </div>
            </div>

            <fieldModal ref="fieldModal" :fieldType="2" @slctField="slctField"></fieldModal>
            <fileDiv :mouldData="mouldData" :fileData="fileData" :operation="operation" v-if="fileModalShow" @back="backReport"></fileDiv>
        </a-spin>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {USER_INFO} from "@/store/mutation-types"
    import fieldModal from './fieldModal'
    import fileDiv from './fileDiv'
    import store from '@/store'
    import { differenceBy } from 'lodash'
    import {
        getReportTemplateId,
        getTableDesId,
        getFieldTypeIdList,
        isExistsReportTemplateName,
        isExistsTableCode,
        queryReportTableShowInfo,
        bulkDelFieldInfo,
    } from '@api/api'
    import moment from 'moment'

    export default {
        name: 'reportModal',
        props: ['typeList', 'domainList','domainTypeId','businessLists', 'operation', 'reportId'],
        components: {
            fieldModal,
            fileDiv
        },
        data() {
            return {
                spinning: false,
                reportObj: {},
                businessList: [],
                form: this.$form.createForm(this),
                labelCol: {
                    xs: {span: 5},
                    sm: {span: 6},
                },
                wrapperCol: {
                    xs: {span: 8},
                    sm: {span: 18},
                },
                columns: [],
                dataSource: [],
                fieldDataSource: [],
                loading: false,
                fileModalShow: false,
                validatorRules: {
                    name: {
                        rules: [{required: true, message: '请输入模板名称!'}, {validator: this.validateReportName}]
                    },
                    code: {
                        rules: [{required: true, message: '请输入模板编号!'}, {validator: this.validateCode}]
                    },
                    type: {
                        rules: [{required: true, message: '请选择报告类型!'}], validateTrigger: 'change'
                    },
                    domain: {
                        rules: [{required: true, message: '请选择报告所属领域!'}], validateTrigger: 'change'
                    },
                    business: {
                        rules: [{required: true, message: '请选择报告业务!'}], validateTrigger: 'change'
                    }
                },
                tableId: '',
                mouldId: '',
                mouldData: {},
                fileData: {},
                oldFieldList: [],
                fieldUpdateList: [],
                mouldObj: {},
                tableScrollWidth: 0
            }
        },
        created() {
            if(this.domainTypeId) {
                store.dispatch('getReportBusiness',this.domainTypeId).then(res => {
                    this.businessList = res;
                });
            }
            if (this.operation != 'edit') {
                this.getReportTemplateId();
                this.getTableDesId();
            }
            this.loadData();
        },
        methods: {
            selectDomain(val) {
                if(val) {
                    store.dispatch('getReportBusiness',val).then(res => {
                        this.businessList = res;
                    });
                }
            },
            getReportTemplateId() {
                getReportTemplateId({}).then((res) => {
                    if (res.success) {
                        this.mouldId = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getTableDesId() {
                getTableDesId({}).then((res) => {
                    if (res.success) {
                        this.tableId = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            loadData() {
                if (this.operation === 'edit') {
                    this.form.resetFields();
                    this.spinning = true;
                    queryReportTableShowInfo({id: this.reportId}).then((res) => {
                        if (res.success) {
                            this.mouldObj = res.result.reportTable;
                            this.fileData = res.result.appendixFieldList;
                            this.getColumns(res.result.fieldList);
                            this.dataSource = res.result.fieldList;
                            getFieldTypeIdList({count: this.dataSource.length}).then((res) => {
                                if (res.success) {
                                    this.dataSource.forEach((field, index) => {
                                        field.fieldId = res.result[index];
                                    });
                                    this.oldFieldList = JSON.parse(JSON.stringify(this.dataSource));
                                    this.$nextTick(() => {
                                        this.form.setFieldsValue({
                                            name: this.mouldObj.reportName,
                                            code: this.mouldObj.tableNameCode,
                                            type: this.mouldObj.reportTypeId,
                                            domain: this.mouldObj.domainTypeId,
                                            business: this.mouldObj.businessTypeId
                                        })
                                    });
                                } else {
                                    console.log(res.message);
                                }
                            });
                        } else {
                            console.log(res.message);
                        }
                        this.spinning = false;
                    });
                }
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
            addField() {
                this.$refs.fieldModal.add();
                this.$refs.fieldModal.title = "新增字段";
                this.$refs.fieldModal.selectionRow = Array.from(this.dataSource);
                this.$refs.fieldModal.selectedRowKeys = this.dataSource.map(field => {
                    return field.id;
                });
            },
            delField(e, obj) {
                e.preventDefault();
                if (obj.id) {
                    let self = this;
                    self.$confirm({
                        title: '删除提示',
                        content: '确定删除当前字段?',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                            if (self.operation === 'edit') {
                                let idArr = [
                                    {
                                        fieldId: obj.id,
                                        tableId: self.mouldObj.propertyTableId
                                    }
                                ];
                                bulkDelFieldInfo(idArr).then((res) => {
                                    if (res.success) {
                                        self.$message.success('删除成功！');
                                        self.dataSource = self.dataSource.filter(field => {
                                            return field.id != obj.id;
                                        });
                                        self.getColumns(self.dataSource);
                                        self.$message.success('删除成功！');
                                    } else {
                                        console.log(res.message);
                                    }
                                });
                            } else {
                                self.dataSource = self.dataSource.filter(field => {
                                    return field.id != obj.id;
                                });
                                self.getColumns(self.dataSource);
                                self.$message.success('删除成功！');
                            }
                        },
                        onCancel() {
                            self.$message.info('取消操作！');
                        },
                    });
                } else {
                    this.$message.info('默认字段无法删除！');
                }
            },
            validateReportName(rule, value, callback) {
                let getCode = value
                let param = {
                    templateId: this.operation === 'edit' ? this.mouldObj.id : '',
                    templateName: value
                }; 
                if(param.templateName !== getCode) {
                    isExistsReportTemplateName(param).then((res) => {
                        if (res.result) {
                            callback("存在同名模板！");
                        } else {
                            callback();
                        }
                    });
                } else {
                    callback();
                }
                
            },
            validateCode(rule, value, callback) { 
                let reg = new RegExp(/(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/);
                let getCode = value
                if (reg.test(value)) {
                    let param = {
                        tableId: this.operation === 'edit' ? this.mouldObj.propertyTableId : '',
                        tableCode: value
                    };
                    if(param.tableCode !== getCode) {
                        isExistsTableCode(param).then((res) => {
                            if (res.result) {
                                callback("存在同名模板！");
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
            slctField(arr) {
                if (this.operation === 'edit') {
                    this.fieldUpdateList = differenceBy(arr, this.oldFieldList , 'id');
                    getFieldTypeIdList({count: this.fieldUpdateList.length}).then((res) => {
                        if (res.success) {
                            arr.forEach((field, index) => {
                                field.fieldId = res.result[index];
                            });
                            this.dataSource = arr.concat(this.dataSource.filter(field => {
                                return !field.id;
                            }));
                            this.getColumns(this.dataSource);
                            this.$message.success('新增成功！');
                        } else {
                            console.log(res.message);
                        }
                    });
                } else {
                    getFieldTypeIdList({count: arr.length}).then((res) => {
                        if (res.success) {
                            arr.forEach((field, index) => {
                                field.fieldId = res.result[index];
                            });
                            this.dataSource = Array.from(arr);
                            this.getColumns(this.dataSource);
                            this.$message.success('新增成功！');
                        } else {
                            console.log(res.message);
                        }
                    });
                }
            },
            back() {
                this.$emit('back', 'report');
            },
            fileShow() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.mouldData = {};
                        this.mouldData = {
                            reportTableModel: {
                                reportTable: {
                                    id: this.operation === 'edit' ? this.mouldObj.id : this.mouldId,
                                    domainTypeId: values.domain,
                                    businessTypeId: values.business,
                                    reportId: '',  //暂时没用，不填
                                    reportTypeId: values.type,
                                    propertyTableId: this.operation === 'edit' ? this.mouldObj.propertyTableId : this.tableId,
                                    createBy: this.operation === 'edit' ? this.mouldObj.createBy : Vue.ls.get(USER_INFO).userName,
                                    createTime: this.operation === 'edit' ? this.mouldObj.createTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                    updateBy: Vue.ls.get(USER_INFO).userName,
                                    updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                    reportName: values.name,
                                    appendixCount: 0,
                                    saveType: '0'  //0-草稿，1-非草稿
                                },
                                reportTemplateTable: {
                                    id: this.operation === 'edit' ? this.mouldObj.propertyTableId : this.tableId,
                                    tableName: values.name,
                                    tableCode: values.code,
                                    createBy: this.operation === 'edit' ? this.mouldObj.createBy : Vue.ls.get(USER_INFO).userName,
                                    createTime: this.operation === 'edit' ? this.mouldObj.createTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                    updateBy: Vue.ls.get(USER_INFO).userName,
                                    updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                    dbType: 'oracle',
                                    reportId: this.operation === 'edit' ? this.mouldObj.id : this.mouldId
                                }
                            }
                        };
                        let arr = [];
                        let ergodicArr = [];
                        if (this.operation === 'edit') {
                            ergodicArr = this.dataSource.filter(field => {
                                return field.id;
                            });
                        } else {
                            ergodicArr = this.dataSource;
                        }
                        ergodicArr.forEach(field => {
                            let fieldObj = {
                                id: field.fieldId,
                                tableId: this.operation === 'edit' ? this.mouldObj.propertyTableId : this.tableId,
                                fieldId: field.id,
                                createBy: Vue.ls.get(USER_INFO).userName,
                                createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                updateBy: Vue.ls.get(USER_INFO).userName,
                                updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                queryfield: field.queryfield && field.queryfield != 'F' ? 'T' : 'F',
                                isPrimaryKey: field.isPrimaryKey && field.isPrimaryKey != 'F' ? 'T' : 'F'
                            };
                            arr.push(fieldObj);
                        });
                        this.mouldData.reportTableModel.reportTemplateTableFiledList = arr;
                        this.fileModalShow = true;
                    }
                });
            },
            backReport(str) {
                if (str === 'list') {
                    this.fileModalShow = false;
                    this.back();
                } else {
                    this.fileModalShow = false;
                    this.loadData();
                }
            }
        }
    }
</script>

<style scoped>

</style>