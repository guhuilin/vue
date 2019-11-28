<template>
    <div style="height: 100%;">
        <a-spin :spinning="spinning">
            <a-row :gutter="24">
                <a-col :md="6" :sm="8">
                    模板名称：{{reportObj.reportName}}
                </a-col>
                <a-col :md="6" :sm="8">
                    报告类型：{{reportObj.reportTypeName}}
                </a-col>
                <a-col :md="6" :sm="8">
                    报告所属领域：{{reportObj.domainTypeName}}
                </a-col>
                <a-col :md="6" :sm="8">
                    报告业务：{{reportObj.businessTypeName}}
                </a-col>
            </a-row>

            <a-table
                    ref="table"
                    bordered
                    size="middle"
                    rowKey="fidleCode"
                    :columns="reportFieldColumns"
                    :dataSource="reportData"
                    :loading="reportLoading"
                    :pagination="false"
                    :scroll="{x: reportWidth}"
                    style="margin-top: 10px;">
            </a-table>

            <a-row :gutter="24" style="margin-top: 10px;">
                <a-tag
                        v-for="file in fileList"
                        :key="file.appendixId"
                        :style="{background: file.appendixId === fileObj.appendixId ? '#2db7f5' : ''}"
                        @click="changeTag(file)">{{file.appendixTypeName}}
                </a-tag>
            </a-row>

            <a-table
                    ref="table"
                    bordered
                    size="middle"
                    rowKey="fidleCode"
                    :columns="fieldColumns"
                    :dataSource="fieldData"
                    :loading="fileLoading"
                    :pagination="false"
                    :scroll="{x: fileWidth}"
                    style="margin-top: 10px;">
            </a-table>

            <div style="text-align: center;margin-top: 10px;" v-if="backBtn">
                <a-button type="primary" @click="back">返回</a-button>
            </div>
        </a-spin>
    </div>
</template>

<script>
    import {queryReportTableShowInfo} from '@api/api'

    export default {
        name: 'reportView',
        props: ['reportId', 'backBtn'],
        data() {
            return {
                spinning: false,
                reportColumnData: [],
                reportFieldColumns: [],
                reportData: [],
                reportObj: {},
                reportLoading: false,
                fileList: [],
                fieldColumns: [],
                fieldColumnData: [],
                fieldData: [],
                fileLoading: false,
                fileObj: {},
                reportWidth: 0,
                fileWidth: 0

            }
        },
        created() {
            this.loadData();
        },
        methods: {
            loadData() {
                this.spinning = true;
                queryReportTableShowInfo({id: this.reportId}).then((res) => {
                    if (res.success) {
                        this.reportObj = res.result.reportTable;
                        this.reportColumnData = res.result.fieldList;
                        this.fileList = res.result.appendixFieldList;
                        this.fileObj = this.fileList[0];
                        this.fieldColumnData = this.fileObj.fieldTypeList;
                        this.getColumns();
                        this.getFileColumns(this.fieldColumnData);
                        this.spinning = false;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getColumns() {
                this.reportWidth = this.reportColumnData.length * 220;
                this.reportColumnData.forEach(report => {
                    let obj = {
                        title: report.fieldName,
                        align: 'center',
                        dataIndex: report.fieldCode,
                        width: 220
                    };
                    this.reportFieldColumns.push(obj);
                });
            },
            getFileColumns(arr) {
                this.fieldColumns = [];
                this.fileWidth = arr.length * 200;
                arr.forEach(field => {
                    let obj = {
                        title: field.fieldName,
                        align: 'center',
                        dataIndex: field.fieldCode,
                        width: 200
                    };
                    this.fieldColumns.push(obj);
                });
            },
            back() {
                this.$emit('back', 'view')
            },
            changeTag(file) {
                this.fileObj = Object.assign({}, file);
                this.getFileColumns(this.fileObj.fieldTypeList);
            }
        }
    }
</script>

<style scoped>

</style>