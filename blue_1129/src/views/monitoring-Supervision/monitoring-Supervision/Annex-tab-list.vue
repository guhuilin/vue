<template>
    <div>
        <a-table :columns="columns" :dataSource="attachmentFormList" bordered>
            <template slot="name" slot-scope="text">
                <a href="javascript:;">{{text}}</a>
            </template>
        </a-table>
    </div>
</template>
<script>
const columns = [
    {
        title: "报告名称",
        dataIndex: "fieldName",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "报告周期",
        className: "column-money",
        dataIndex: "money"
    },
    {
        title: "创建人",
        dataIndex: "createby"
    },
    {
        title: "创建时间",
        dataIndex: "createTime"
    },
    {
        title: "提交人",
        // dataIndex: "address"
    },
    {
        title: "审核人",
        // dataIndex: "address"
    },
    {
        title: "审核时间",
        // dataIndex: "address"
    },
    {
        title: "审核状态",
        // dataIndex: "address"
    }
];
const data = [
    {
        appendixId: 224,
        appendixTypeName: "test0704fj",
        tableNameCode: "test0704fjt",
        tableId: 561,
        used: "T",
        reportId: 415,
        fieldTypeList: [
            {
                id: 1,
                fieldName: "编号",
                fieldCode: "ID",
                typeName: "NUMBER",
                defaultValue: null,
                selectId: null,
                createby: "admin",
                createTime: "2019-06-18 13:36:53",
                updateby: "admin",
                updateTime: "2019-06-18 13:37:00",
                dbType: "oracle",
                used: "T",
                queryfield: "T",
                isPrimaryKey: "T"
            },
            {
                id: 3,
                fieldName: "网站名称",
                fieldCode: "WITE_NAME",
                typeName: "VARCHAR2(1024)",
                defaultValue: null,
                selectId: null,
                createby: "admin",
                createTime: "2019-06-20 13:38:25",
                updateby: "admin",
                updateTime: "2019-06-20 13:38:32",
                dbType: "oracle",
                used: "T",
                queryfield: "F",
                isPrimaryKey: "F"
            }
        ]
    },
    {
        appendixId: 225,
        appendixTypeName: "tses0704ft",
        tableNameCode: "test0452fjt",
        tableId: 562,
        used: "T",
        reportId: 415,
        fieldTypeList: [
            {
                id: 1,
                fieldName: "编号",
                fieldCode: "ID",
                typeName: "NUMBER",
                defaultValue: null,
                selectId: null,
                createby: "admin",
                createTime: "2019-06-18 13:36:53",
                updateby: "admin",
                updateTime: "2019-06-18 13:37:00",
                dbType: "oracle",
                used: "T",
                queryfield: "T",
                isPrimaryKey: "T"
            },
            {
                id: 2,
                fieldName: "报告名称",
                fieldCode: "PRPORT_NAME",
                typeName: "VARCHAR2(1024)",
                defaultValue: null,
                selectId: null,
                createby: "admin",
                createTime: "2019-06-18 13:36:56",
                updateby: "admin",
                updateTime: "2019-06-18 13:37:03",
                dbType: "oracle",
                used: "T",
                queryfield: "F",
                isPrimaryKey: "F"
            }
        ]
    }
];

export default {
  data() {
    return {
      // data,
      columns
    };
  },
  props: ["attachmentFormList"]
};
</script>
<style >

</style>
<style lang="scss" scoped>
    th.column-money,
    td.column-money {
        text-align: right !important;
    }
</style>
