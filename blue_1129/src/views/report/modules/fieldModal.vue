<template>
    <a-modal
            :title="title"
            :width="1000"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="false"
            :centered="true"
            @ok="handleOk"
            @cancel="close"
            cancelText="关闭"
            wrapClassName="ant-modal-cust-warp">

        <a-spin :spinning="confirmLoading">
            <a-table
                    ref="table"
                    bordered
                    size="middle"
                    rowKey="id"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="false"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">

                <span slot="queryfield" slot-scope="textCheck, record">
                    <a-switch checkedChildren="T" unCheckedChildren="F" defaultChecked v-model="record.queryfield"/>
                </span>

                <span slot="isPrimaryKey" slot-scope="textCheck, record">
                    <a-switch checkedChildren="T" unCheckedChildren="F" defaultChecked v-model="record.isPrimaryKey"/>
                </span>

            </a-table>
        </a-spin>

    </a-modal>
</template>

<script>
    import {queryFieldTypeList} from '@api/api'

    export default {
        name: 'fieldModal',
        props: ['fieldType'],
        data() {
            return {
                columns: [
                    {
                        title: 'id',
                        align: 'center',
                        dataIndex: 'id',
                        width: 50
                    },
                    {
                        title: '字段名称',
                        align: 'center',
                        dataIndex: 'fieldName',
                    },
                    {
                        title: '字段编码',
                        align: 'center',
                        dataIndex: 'fieldCode',
                        width: 200
                    },
                    {
                        title: '字段类型',
                        align: 'center',
                        dataIndex: 'typeName',
                        width: 150
                    },
                    {
                        title: '数据库类型',
                        align: 'center',
                        dataIndex: 'dbType',
                        width: 100
                    },
                    {
                        title: '是否可查询',
                        align: 'center',
                        dataIndex: 'queryfield',
                        scopedSlots: {customRender: 'queryfield'},
                        width: 100
                    },
                    {
                        title: '是否为主键',
                        align: 'center',
                        dataIndex: 'isPrimaryKey',
                        scopedSlots: {customRender: 'isPrimaryKey'},
                        width: 100
                    },
                ],
                dataSource: [],
                selectedRowKeys: [],
                selectionRow: [],
                title: '',
                visible: false,
                confirmLoading: false,
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
            }
        },
        created() {
            this.queryFieldTypeList();
        },
        methods: {
            queryFieldTypeList() {
                queryFieldTypeList({fieldType: this.fieldType}).then((res) => {
                    if (res.success) {
                        this.dataSource = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            add() {
                this.visible = true;
            },
            onSelectChange(selectedRowKeys, selectionRow) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectionRow = selectionRow;
            },
            close() {
                this.visible = false;
            },
            handleOk() {
                this.confirmLoading = true;
                let param = Array.from(this.selectionRow);
                this.$emit('slctField', param);
                this.confirmLoading = false;
                this.visible = false;
            }
        }
    }
</script>