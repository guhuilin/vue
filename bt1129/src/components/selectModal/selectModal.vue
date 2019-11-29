<template>
    <a-modal
            :title="modalObj.title"
            width="60%"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            :centered="true"
            @ok="handleOk"
            @cancel="close">

        <a-spin :spinning="confirmLoading">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="24">
                        <a-col :md="6" :sm="8" v-for="search in modalObj.searchForm">
                            <a-form-item :label="search.label">
                                <a-input placeholder="请输入..." v-model="queryParam[search.query]" v-if="search.type === 'input'"></a-input>
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="8">
                            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                                <a-button type="primary" @click="loadData" icon="search">查询</a-button>
                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <a-table
                    ref="table"
                    bordered
                    size="middle"
                    rowKey="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio', hideDefaultSelections: true}"
                    @change="handleTableChange">
            </a-table>
        </a-spin>

    </a-modal>
</template>

<script>
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'

    export default {
        name: 'selectModal',
        props: ['modalObj'],
        mixins: [JeecgListMixin],
        data() {
            return {
                columns: [],
                visible: false,
                confirmLoading: false,
                url: {
                    list: ''
                }
            }
        },
        methods: {
            getColumns() {
                switch (this.modalObj.type) {
                    case 'system': {
                        this.columns = [
                            {
                                title: '子系统名称',
                                align: 'center',
                                dataIndex: 'systemName'
                            },
                            {
                                title: '子系统地址',
                                align: 'center',
                                dataIndex: 'serverUrl'
                            },
                        ];
                        break;
                    }
                    case 'report': {
                        this.columns = [
                            {
                                title: '名称',
                                align: 'center',
                                dataIndex: 'reportName'
                            },
                            {
                                title: '创建人',
                                align: 'center',
                                dataIndex: 'createBy'
                            },
                            {
                                title: '附件',
                                align: 'center',
                                dataIndex: 'appendixCount'
                            }
                        ];
                        break;
                    }
                    case 'flow': {
                        this.columns = [
                            {
                                title: '名称',
                                align: 'center',
                                dataIndex: 'name'
                            },
                            {
                                title: '工作流编号',
                                align: 'center',
                                dataIndex: 'key'
                            },
                        ];
                        break;
                    }
                    case 'task': {
                        this.columns = [
                            {
                                title: '任务名称',
                                align: 'center',
                                dataIndex: 'taskName'
                            },
                            {
                                title: '任务期限',
                                align: 'center',
                                dataIndex: 'interval'
                            },
                            {
                                title: '修改时间',
                                align: 'center',
                                dataIndex: 'updateTime'
                            },
                            {
                                title: '任务流程图ID',
                                align: 'center',
                                dataIndex: 'workfolwTemplateId'
                            }
                        ];
                        break;
                    }
                }
            },
            show(obj) {
                console.log(obj,'obj')
                this.queryParam = obj ? obj : {};
                this.visible = true;
                this.$nextTick(() => {
                    console.log(this.modalObj,'modalObj')
                    this.url.list = this.modalObj.urlPath;
                    console.log(this.modalObj.urlPath,this.url.list,'urllist')
                    this.selectedRowKeys = this.modalObj.defaultId && this.modalObj.defaultId.length > 0 ? this.modalObj.defaultId : [];
                    this.getColumns();
                    this.loadData();
                });
            },
            close() {
                this.visible = false;
            },
            onSelectChange(selectedRowKeys, selectionRow) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectionRows = selectionRow;
            },
            handleOk() {
                if (this.selectionRows.length === 0) {
                    this.$message.info('请选择数据！');
                } else {
                    this.$emit('slctModal', this.selectionRows);
                    this.visible = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>