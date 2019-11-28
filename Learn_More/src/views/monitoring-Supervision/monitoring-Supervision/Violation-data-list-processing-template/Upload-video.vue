<template>
<!-- 视频上传功能 -->
    <div class="clearfix">
        <a-upload
            :fileList="fileList"
            :remove="handleRemove"
            :beforeUpload="beforeUpload"
        >
            <a-button style="display:inline-block;z-index:10">
                <a-icon type="upload" /> 选择上传的视频
            </a-button>
        </a-upload>
        <span style="float:left;">
            <a-button
                type="primary"
                @click="handleUpload"
                :disabled="fileList.length === 0"
                :loading="uploading"
            >
                {{'上传' ? '上传' : '开始上传' }}
            </a-button>
        </span>
    </div>
</template>
<script>
    // import reqwest from 'reqwest'
    import { fastDFSUpload } from "@/api/api.js"
    import { uploadFile } from '@api/manage'

    export default {
        data () {
            return {
                fileList: [],
                uploading: false,
                file : "",
                headers: {}
            }
        },
        props : ["id","details"],
        methods: {
            // 删除的方法
            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList
            },
            // 上传之前的方法
            beforeUpload(file) {
                this.fileList = [...this.fileList, file];
                return false;
            },
            // 请求ajax上传视频的方法
            handleUpload() {
                this.uploading = true;
                const { fileList } = this;
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append('file', file);
                    console.log(this.fileList,'file-----')
                });
                
                formData.append("taskId",this.id);
                formData.append("resultId",this.details.id);
                uploadFile('/nmmonitor-server-report/fastDFSUpload', formData).then(res => {
                    this.fileList = []
                    this.uploading = false;
                    console.log(res);
                    this.$message.success(res.message, 10);
                })
                .catch(res=>{
                    console.log(res);
                })
            }
        },
        mounted(){
            
        }
    }
</script>

<style lang="scss" scoped>
    // .clearfix{
    //     width:500px;
    //     padding-left:120px;
    //     span{
    //         float: left;
    //         margin-right: 20px;
    //     }
    //     button{
    //         float: left;
    //     }
    // }
    .clearfix{
        // width:230px;
        // display: inline-block;
        float: left;
        >span{
            float: left;
        }
        
    }
    
</style>
<style scoped>
    >>>.ant-upload-list{
            display: none;
        }
    >>>.ant-btn{
        z-index: 10;
    }
</style>


