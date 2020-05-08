<template>
    <div style="height: 100%;">
        <div v-if="fileList.length > 0" style="height: 93%;overflow-y: auto;">
            <a-card v-for="(file, index) in fileList" :key="index" style="margin-top: 10px;">
                <fileForm
                        :file="file"
                        :operation="operation"
                        :ref="'fileForm' + index"
                        @addField="updateFieldList"
                        @delFile="delFile"></fileForm>
            </a-card>

            <div style="text-align: center;margin-top: 10px;">
                <a-button type="primary" :loading="btnLoading" @click="addFile" v-if="fileList.length > 0">添加附件</a-button>
            </div>
        </div>

        <div v-else>
            <a-button type="dashed" block style="height: 300px;" @click="addFile">添加附件</a-button>
        </div>

        <div class="btnDiv">
            <a-button type="primary" :loading="btnLoading" @click="back">取消</a-button>
            <a-tooltip>
                <template slot='title'>
                    保存草稿后的模板可进行编辑删除操作
                </template>
                <a-button type="primary" :loading="btnLoading" @click="saveDraft('0')" style="margin-left: 8px;" v-if="fileList.length > 0">保存草稿</a-button>
            </a-tooltip>
            <a-tooltip>
                <template slot='title'>
                    生成后的模板不可进行编辑删除操作
                </template>
                <a-button type="primary" :loading="btnLoading" @click="saveDraft('1')" style="margin-left: 8px;" v-if="fileList.length > 0">生成</a-button>
            </a-tooltip>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {USER_INFO} from "@/store/mutation-types"
    import fileForm from './fileForm'
    import { getReportAppendixIdList, addReportTemplateInfo, saveModifyReportTemplateInfo, getReportAppendixIdAndTableId } from '@api/api'
    import moment from 'moment'

    export default {
        name: 'fileDiv',
        props: ['mouldData', 'fileData', 'operation'],
        components: {
            fileForm
        },
        data() {
            return {
                fileList: [],
                btnLoading: false
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            loadData() {
                if (this.operation === 'edit') {
                    this.fileList = this.fileData;
                }
            },
            addFile() {
                getReportAppendixIdAndTableId({}).then(res => {
                    if (res.success) {
                        let fileObj = {
                            appendixId: res.result.reportAppendixId,
                            tableId: res.result.reportTableId,
                            tableNameCode: '',
                            appendixTypeName: '',
                            used: 'T',
                            fieldTypeList: []
                        };
                        this.fileList.push(fileObj); console.log(this.fileList,'添加')
                    } else {
                        console.log(res.message);
                    }
                });
            },
            delFile(code) { 
                console.log(this.fileList,'aaaaaaaaa')
                // this.fileList = this.fileList.filter(file => { console.log(file.appendixId, code,'1111')
                //    return file.appendixId != code;
                // });
                this.fileList.map((item,index) => { console.log(item.appendixId,index,code,'.........')
                    if(item.appendixId == code) { 
                        console.log('jinru')
                        return this.fileList.splice(index,1)
                    }
                })
                // this.$set(this.fileList, 'b' ,'obj.b')
                console.log(this.fileList,'dddddddddddd')
                this.$message.success('删除成功！');
                // this.fileList.map((item,index) => {
                //     if(item.appendixId == code) { 
                //         return this.fileList.splice(index,1)
                //     }
                // })
                // this.$set(this.fileList)
                // this.$message.success('删除成功！');
            },
            updateFieldList(obj) {
                let fileObj = this.fileList.find(file => {
                    return file.appendixId === obj.appendixId;
                });
                fileObj.fieldTypeList = obj.fieldTypeList;
            },
            backFile(file) {
                this.fileList.push(file);
            },
            back(str) {
                if (str === 'list') {
                    this.$emit('back', 'list');
                } else {
                    this.$emit('back', 'file');
                }
            },
            getFormState(i, saveFlag) {
                this.$refs['fileForm' + i][0].getState().then(str => {
                    if (str === 'success') {
                        if (i != this.fileList.length - 1) {
                            i++;
                            this.getFormState(i, saveFlag);
                        } else {
                            this.save(saveFlag);
                        }
                    }
                });
            },
            saveDraft(str) {
                this.getFileList();
                this.getFormState(0, str);
            },
            getFileList() {
                this.fileList.forEach((file, index) => {
                    let obj = this.$refs['fileForm' + index][0].getFile();
                    file.appendixTypeName = obj.appendixTypeName;
                    file.tableNameCode = obj.tableNameCode;
                    file.used = obj.used;
                });
            },
            save(str) {
                let messageStr = '';
                let flag = true;
                let flagTwo = true;
                for (let i = 0; i < this.fileList.length; i++) {
                    if (!this.fileList[i].fieldTypeList || this.fileList[i].fieldTypeList.length === 0) {
                        flag = false;
                        messageStr = '附件中存在没有关联字段的附件，请确认后再次提交！';
                        break;
                    }
                    for (let j = 0; j < this.fileList.length; j++) {
                        if (this.fileList[i].appendixId != this.fileList[j].appendixId) {
                            if (this.fileList[i].appendixTypeName === this.fileList[j].appendixTypeName) {
                                flag = false;
                                flagTwo = false;
                                messageStr = '附件中存在相同附件名称的附件，请确认后再次提交！';
                                break;
                            }
                            if (this.fileList[i].tableNameCode === this.fileList[j].tableNameCode) {
                                flag = false;
                                flagTwo = false;
                                messageStr = '附件中存在相关附件编码的附件，请确认后再次提交！';
                                break;
                            }
                        }
                    }
                    if (!flagTwo) {
                        break;
                    }
                }
                if (!flag) {
                    this.$message.info(messageStr);
                } else {
                    this.btnLoading = true;
                    let idList = [];
                    getReportAppendixIdList({count: this.fileList.length}).then((res) => {
                        if (res.success) {
                            idList = res.result;
                            let obj = JSON.parse(JSON.stringify(this.mouldData));
                            obj.reportAppendixTypeList = [];
                            this.fileList.forEach(file => {
                                let fileObj = {
                                    reportAppindixTypeInfo: {
                                        id: file.appendixId,
                                        typeName: file.appendixTypeName,
                                        code: file.tableNameCode,
                                        tableId: file.tableId,
                                        createBy: this.operation === 'edit' ? file.createBy : Vue.ls.get(USER_INFO).userName,
                                        createTime: this.operation === 'edit' ? file.createTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                        updateBy: Vue.ls.get(USER_INFO).userName,
                                        updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                    },
                                    reportAppendixTable: {
                                        id: file.tableId,
                                        tableName: file.appendixTypeName,
                                        tableCode: file.tableNameCode,
                                        createBy: this.operation === 'edit' ? file.createBy : Vue.ls.get(USER_INFO).userName,
                                        createTime: this.operation === 'edit' ? file.createTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                        updateBy: Vue.ls.get(USER_INFO).userName,
                                        updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                        dbType: 'oracle',
                                        reportId: obj.reportTableModel.reportTable.id
                                    }
                                };
                                let reportAppendixTableFiledList = [];
                                file.fieldTypeList.forEach((field, index) => {
                                    let fieldObj = {
                                        id: field.fieldId,
                                        tableId: file.tableId,
                                        fieldId: field.id,
                                        createBy: this.operation === 'edit' ? file.createBy : Vue.ls.get(USER_INFO).userName,
                                        createTime: this.operation === 'edit' ? file.createTime : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                        updateBy: Vue.ls.get(USER_INFO).userName,
                                        updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                        queryfield: field.queryfield && field.queryfield != 'F' ? 'T' : 'F',
                                        isPrimaryKey: field.isPrimaryKey && field.isPrimaryKey != 'F' ? 'T' : 'F'
                                    };
                                    reportAppendixTableFiledList.push(fieldObj);
                                });
                                fileObj.reportAppendixTableFiledList = Array.from(reportAppendixTableFiledList);
                                obj.reportAppendixTypeList.push(fileObj);
                            });
                            obj.reportAppendixList = this.getReportAppendixList(obj.reportTableModel.reportTable, obj.reportAppendixTypeList, idList);
                            obj.reportTableModel.reportTable.saveType = str;
                            if (this.operation === 'edit') {
                                saveModifyReportTemplateInfo(obj).then((res) => {
                                    if (res.success) {
                                        this.$message.success(`${str === '0' ? '保存草稿成功！' : '生成成功！'}`);
                                        this.btnLoading = false;
                                        this.back('list');
                                    } else {
                                        console.log(res.message);
                                    }
                                });
                            } else {
                                addReportTemplateInfo(obj).then((res) => {
                                    if (res.success) {
                                        this.$message.success(`${str === '0' ? '保存草稿成功！' : '生成成功！'}`);
                                        this.btnLoading = false;
                                        this.back('list');
                                    } else {
                                        console.log(res.message);
                                    }
                                });
                            }
                        } else {
                            console.log(res.message);
                        }
                    });
                }
            },
            getReportAppendixList(mould, fileList, idList) {
                let arr = [];
                fileList.forEach((file, index) => {
                    let obj = {
                        id: idList[index],
                        reportId: mould.id,
                        appendIxId: file.reportAppindixTypeInfo.id,
                        used: this.fileList[index].used,
                        createBy: this.operation === 'edit' ? file.createBy : Vue.ls.get(USER_INFO).userName,
                        createTime: this.operation === 'edit' ? file.createBy :  moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        updateBy: Vue.ls.get(USER_INFO).userName,
                        updateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    };
                    arr.push(obj);
                });
                return arr;
            }
        }
    }
</script>

<style scoped>
    .btnDiv {
        height: 50px;
        line-height: 50px;
        position: absolute;
        bottom: 0;
        width: 100%;
    }
</style>