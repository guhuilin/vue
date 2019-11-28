<template>
    <div class="add-recording">
        <a-button type="primary" @click="showModal">添加记录</a-button>
        <a-modal
            :centered="true"
            title="添加记录"
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
            :maskClosable="false"
        >
            <div class="addRecordContent">
                <div v-if="addRecordInput" class="add-record-input-prompt">
                    *所有的输入框都不可以为空
                </div>
                <div class="content">
                    <div v-for="value in arr">
                        <span>
                            {{value.title}}:
                        </span>
                    </div>
                </div>
                <div class="add-record-input">
                    <div v-for="value in arr">
                        <a-input ref="name"></a-input>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import { execInsertSql , getCustomTableSeqValBySeqName } from '@/api/api.js'
    export default {
        data() {
            return {
                siteName : "",
                linkAddress : "",
                content : "",
                visible: false,
                confirmLoading: false,
                mode1: 'time',
                value: [],
                recordingTime : "",
                arr : [],
                addId : "",
                addRecordInput : false,
            }
        },
        // 这些都是从父组件来的：
        props : ["attachmentHeaderValue","code","getAttachmentFormInformation","spinning","pageNo"],
        methods: {
            showModal() {
                // this.getAttachmentFormInformation()
                // console.log(this.$parent,"123122")
                // console.log(this.attachmentHeaderValue,"123122")
                this.arr.splice(0);
                for(let i = 0 ; i < this.attachmentHeaderValue.result.length ; i ++){
                    // this.arr.push(this.attachmentHeaderValue.result[i]);
                    // console.log(this.attachmentHeaderValue.result[i],"传过来的值")
                    if(this.attachmentHeaderValue.result[i].title !== "操作" && this.attachmentHeaderValue.result[i].title !=="编号"){
                        this.arr.push(this.attachmentHeaderValue.result[i])
                    }
                    // console.log(this.attachmentHeaderValue.result[i],"传过来的值")
                }
                // console.log(this.arr,"arr")
                // this.arr.pop();
                // this.arr.pop();
                // for(let i = 0 ; i < this.attachmentHeaderValue.result.length ; i ++){
                //     this.arr.push(this.attachmentHeaderValue.result[i]);
                // }
                //     this.arr.pop();
                // console.log(this.attachmentHeader,"虎虎虎")
                this.visible = true;
                // for(let i = 0 ; i < this.attachmentHeader.length ; i ++){
                //     if(this.attachmentHeader[i].title === "操作"){
                //         // alert("ok")
                //         this.attachmentHeader.pop();
                //     }else{
                //         alert("no")
                //     }
                //     console.log(this.attachmentHeader,"我时传过来的数据")
                // }
                // this.attachmentHeader
            },
            handleOk(e) {
                if(this.pageNo <= 0){
                    this.$emit("onChangePageNo")
                }
                getCustomTableSeqValBySeqName({
                    seqName : this.code + "_SEQ"
                }).then((res)=>{
                    this.addId = res.result;
                    let obj = {};
                    for(let j = 0 ; j < this.arr.length ; j ++){
                        for(let i = 0 ; i < this.$refs.name.length ; i ++){
                            if(j === i){
                                obj[this.arr[i].dataIndex] = this.$refs.name[i].$el.value;
                                obj.tableName = this.code;
                                obj.ID = this.addId
                            }else{

                            }
                        }
                    }
                    let str = 0;
                    for(let k in obj){
                        if(obj[k] !== ""){

                        }else{
                            str += 1
                        }
                    }
                    if(str !== 0){
                        this.addRecordInput = true;
                        this.visible = true;
                    }else{
                        execInsertSql(obj).then((data)=>{
                            // console.log(data.message,"我是失败")
                            if(data.message === "操作失败"){
                                // alert("操作失败了")
                                this.$message.error("添加记录"+data.message);
                                this.getAttachmentFormInformation();
                                this.addRecordInput = false;
                                for(let i = 0 ; i < this.$refs.name.length ; i ++){
                                    this.$refs.name[i].$el.value = ""
                                }
                                this.visible = false;
                            }else{
                                this.getAttachmentFormInformation();
                                this.addRecordInput = false;
                                for(let i = 0 ; i < this.$refs.name.length ; i ++){
                                    this.$refs.name[i].$el.value = ""
                                }
                                this.visible = false;
                            }
                        })
                    }
                })
                this.$emit("changeSpinning","啦啦啦")
            },
            handleCancel(e) {
                for(let i = 0 ; i < this.$refs.name.length ; i ++){
                    this.$refs.name[i].$el.value = ""
                }
                // console.log('Clicked cancel button');
                this.visible = false
            },
            onChange(date, dateString) {
                this.recordingTime = dateString;
            }
        },
        mounted(){
            // console.log(this.code,"我是code")
        }
    }
</script>

<style lang="scss" scoped>
    .add-recording{
        // margin:24px 0;
        margin-left: 20px;
    }
    .content{
        float: left;
        >div{
        //   margin:10px 0;
            height:37px;
            line-height: 37px;
            margin-bottom: 10px;
          input{
            width:200px;
          }
        }
    }
    .add-record-input{
        input{
            margin-left: 10px;
            // margin-bottom: 10px;
            width: 150px;
            height:37px;
            margin-bottom: 10px;
        }
    }
    .add-record-input-prompt{
        margin-bottom: 15px;
        text-align: center;
        color: #f40;
    }
    // .addRecordContent{
    //     height:400px;
    //     overflow-y: scroll;
    // }
    .addRecordContent{
        height:300px;
        overflow-y:auto;
    }
</style>