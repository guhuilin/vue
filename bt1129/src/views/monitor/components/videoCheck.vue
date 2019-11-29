<template>
    <div style="height: 92%;">
        <a-row :gutter="24" style="height: 94%;margin-top: 1%;">
            <a-col :md="15" :sm="10" class="leftCol">
                <div style="height: 100%;background: white;">
                    <div class="table-page-search-wrapper uploadDiv">
                        <a-form layout="inline">
                            <a-form-item label="视频上传" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                <a-upload
                                        class="avatar-uploader"
                                        :action="uploadAction"
                                        :showUploadList="false"
                                        :headers="headers"
                                        :beforeUpload="beforeUpload"
                                        @change="handleChange">
                                    <a-button>
                                        <a-icon type="upload"/>
                                        Upload
                                    </a-button>
                                </a-upload>
                            </a-form-item>
                        </a-form>
                    </div>

                    <a-row style="height: 50px;border-bottom: 1px solid #e8e8e8;">
                        <a-col :md="1" :sm="10"
                               style="height: 100%;display: flex;align-items: center;justify-content: center;">
                            <a-icon type="caret-left" style="cursor: pointer;" @click="changeProgram('left')"/>
                        </a-col>
                        <a-col :md="22" :sm="10" class="fileList">
                            <div class="file" v-for="(file, ind) in fileListChild" :key="ind">
                                <div>
                                    <img src="../../../assets/upload.png"/>
                                    <a @click="getVideoObj(file)">
                                        <a-tooltip placement="topLeft">
                                            <template slot="title">
                                                <span v-html="file.program_name"></span>
                                            </template>
                                            {{file.program_name.length > 10 ? `${file.program_name.substring(0, 10)}...` :
                                            file.program_name}}
                                        </a-tooltip>
                                    </a>
                                    &nbsp;&nbsp;<a style="color: red;" v-if="hasPerm('delete')">删除</a>
                                </div>
                            </div>
                        </a-col>
                        <a-col :md="1" :sm="10"
                               style="height: 100%;display: flex;align-items: center;justify-content: center;">
                            <a-icon type="caret-right" style="cursor: pointer;" @click="changeProgram('right')"/>
                        </a-col>
                    </a-row>

                    <video :src="`http://192.168.111.200/${videoObj.video_local_url}`"
                           controls class="videoDiv" id="videoDiv" preload></video>
                </div>
            </a-col>

            <a-col :md="9" :sm="10" class="rightCol">
                <div style="height: 100%;background: white;">
                    <a-row class="rightTitle">
                        违规监测
                    </a-row>

                    <a-row class="rightCheck">
                        <a-col :md="16" :sm="10" offset="1">
                            <a-checkbox-group :options="videoOptions" v-model="checkedList"/>
                        </a-col>
                        <a-col :md="4" :sm="10" offset="2">
                            <a-button type="primary" @click="uploadVideo" v-if="hasPerm('submit')">违规识别</a-button>
                        </a-col>
                    </a-row>

                    <a-row class="rightResult">
                        <a-row style="font-size: 15px;">
                            识别结果
                        </a-row>
                        <!--          <a-row style="width: 90%;">-->
                        <!--            <a-progress :percent="60" :successPercent="30" :format="percent => `${Math.floor(time / 3600).toString().padStart(2, '0')}:${Math.floor(time % 3600 / 60).toString().padStart(2, '0')}:${Math.floor(time % 60).toString().padStart(2, '0')}`"/>-->
                        <!--          </a-row>-->
                    </a-row>

                    <div class="picBody" v-if="imgListChild.length > 0">
                        <div class="picDiv" v-for="img in imgListChild" :key="img.id"
                             @click="playVideo(img)">
                            <img :src="img.img_local_url" v-if="videoObj.type"/>
                            <img :src="'http://192.168.111.200' + img.img_local_url" v-else/>
                            <a-row class="program">
                                <a-col :md="5" :sm="10" offset="9">{{`${Math.floor(img.image_current_time /
                                    3600).toString().padStart(2, '0')}:${Math.floor(img.image_current_time % 3600 /
                                    60).toString().padStart(2, '0')}:${Math.floor(img.image_current_time %
                                    60).toString().padStart(2, '0')}`}}
                                </a-col>
                                <a-col :md="4" :sm="10">
                                    <a-tag color="#f50">{{img.violate_type_name}}</a-tag>
                                </a-col>
                            </a-row>
                        </div>
                    </div>

                    <a-pagination
                            class="page"
                            :total="total"
                            :showTotal="total => `${(pageSize * (page - 1)) + 1}-${total < pageSize ? total : pageSize * page} 共${total}条`"
                            :pageSize="pageSize"
                            :defaultCurrent="page"
                            showQuickJumper
                            @change="changePage"/>
                </div>
            </a-col>
        </a-row>

        <discernResultModal discernType="video" ref="discernResultModal"></discernResultModal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { ACCESS_TOKEN } from "@/store/mutation-types"
    import { getViolateVideoInfoList, getVideoTaskId, getVideoViolateResult } from '@api/api'
    import { hasPerm } from "@/utils/authFilter";
    import discernResultModal from '@/components/jeecg/discernResultModal'

    export default {
        name: 'videoCheck',
        components: {
            discernResultModal
        },
        data() {
            return {
                time: 12531,
                total: 0,
                pageSize: 8,
                page: 1,
                headers: {},
                fileList: [],
                fileListChild: [],
                fileNum: 1,
                videoObj: {},
                videoOptions: [
                    {
                        label: '色情分析',
                        value: 'porn'
                    },
                    {
                        label: '暴恐分析',
                        value: 'terrorism'
                    },
                    {
                        label: '敏感人物',
                        value: 'sface'
                    }
                ],
                checkedList: [],
                imgList: [],
                imgListChild: [],
                interVal: '',
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/program/uploadVideo',
                }
            }
        },
        created() {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token": token};
            this.getViolateVideoInfoList();
        },
        computed: {
            uploadAction: function () {
                return this.url.fileUpload;
            }
        },
        methods: {
            hasPerm,
            getViolateVideoInfoList() {
                let param = {
                    pageNo: this.page,
                    pageSize: this.pageSize
                };
                getViolateVideoInfoList(param).then((res) => {
                    if (res.success) {
                        this.fileList = res.result.records;
                        this.fileListChild = this.fileList.slice(0, 3);
                        this.videoObj = this.fileList[0];
                        this.imgList = this.videoObj.list;
                        this.total = this.imgList.length;
                        this.imgListChild = this.imgList.slice(0, 8);
                    } else {
                        console.log(res.message);
                    }
                });
            },
            beforeUpload: function (file) {
                let fileType = file.type;
                if (fileType.indexOf('video') < 0) {
                    this.$message.warning('请上传视频');
                    return false;
                }
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    return
                }
                if (info.file.status === 'done') {
                    let response = info.file.response;
                    if (response.success) {
                        this.$message.success('上传成功');
                        let obj = {
                            program_name: response.message.split('/')[2],
                            video_local_url: response.message,
                            type: 'upload'
                        };
                        this.fileList.push(obj);
                        if (this.fileListChild.length != 3) {
                            this.fileListChild.push(obj);
                        } else {
                            this.fileNum = this.fileList.length - 2;
                            this.fileListChild = this.fileList.slice(this.fileList.length - 3, this.fileList.length);
                        }
                    } else {
                        this.$message.warning(response.message);
                    }
                }
            },
            getVideoObj(obj) {
                this.videoObj = Object.assign(obj);
                if (this.videoObj.type) {
                    this.imgList = [];
                    this.imgListChild = [];
                    this.total = 0;
                } else {
                    this.imgList = this.videoObj.list;
                    this.imgListChild = this.imgList.slice(0, 8);
                    this.total = this.imgList.length;
                }
                console.log(JSON.stringify(this.videoObj));
            },
            uploadVideo() {
                if (this.videoObj.type) {
                    let param = {
                        fileName: `${this.videoObj.video_local_url.split('/')[1]}/${this.videoObj.video_local_url.split('/')[2]}`,
                        scenes: this.checkedList.join(',')
                    };
                    this.$refs.discernResultModal.show();
                    // this.$emit('changeSpin', true);
                    getVideoTaskId(param).then((res) => {
                        if (res.success) {
                            this.interVal = setInterval(() => {
                                getVideoViolateResult({taskIds: res.result[0]}).then((res) => {
                                    if (res.success) {
                                        if (res.code === 200) {
                                            this.imgList = [];
                                            let list = JSON.parse(res.result).data[0].results;
                                            let i = 0;
                                            list.forEach(img => {
                                                if (img.frames) {
                                                    img.frames.forEach(g => {
                                                        let obj = {
                                                            id: i++,
                                                            img_local_url: g.url,
                                                            image_current_time: g.offset,
                                                            violate_type_name: g.label
                                                        };
                                                        this.imgList.push(obj);
                                                    });
                                                }
                                            });
                                            this.total = this.imgList.length;
                                            this.imgListChild = this.imgList.slice(0, 8);
                                            // this.$emit('changeSpin', false);
                                            this.$refs.discernResultModal.getResult('video');
                                            window.clearInterval(this.interVal);
                                        }
                                    } else {
                                        console.log(res.message);
                                    }
                                });
                            }, 30000);
                        } else {
                            console.log(res.message);
                        }
                    });
                } else {
                    this.$message.info('当前视频已经检测完成，无需违规识别！');
                }
            },
            changePage(page) {
                this.page = page;
                this.imgListChild = this.imgList.slice(this.pageSize * (page - 1), this.pageSize * page);
            },
            changeProgram(str) {
                if (this.fileNum != 1 && str === 'left') {
                    this.fileNum--;
                    this.fileListChild = this.fileList.slice(this.fileNum - 1, this.fileNum + 2);
                } else if (this.fileNum + 2 != this.fileList.length && str === 'right') {
                    this.fileNum++;
                    this.fileListChild = this.fileList.slice(this.fileNum - 1, this.fileNum + 2);
                }
            },
            playVideo(img) {
                let myVid = document.getElementById("videoDiv");
                myVid.currentTime = img.image_current_time;
            }
        },
        destroyed() {
            window.clearInterval(this.interVal);
        }
    }
</script>

<style lang="scss" scoped>
    .leftCol {
        height: 100%;

        .uploadDiv {
            height: 50px;
            display: flex;
            justify-content: center;
            padding-top: 5px;
            border-bottom: 1px solid #e8e8e8;
        }

        .fileList {
            height: 100%;
            display: flex;
            align-items: center;

            .file {
                height: 80%;
                width: 31%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .videoDiv {
            height: 80%;
            width: 96%;
            margin: 4% 2% 0 2%;
        }
    }

    .rightCol {
        height: 100%;

        .rightTitle {
            height: 50px;
            font-size: 15px;
            padding-left: 15px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e8e8e8;
        }

        .rightCheck {
            height: 50px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e8e8e8;
        }

        .rightResult {
            height: 3%;
            padding-left: 15px;
            margin-top: 1%;
        }

        .picBody {
            height: 75%;
            padding: 0 1% 0 1%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: flex-start;

            .picDiv {
                height: 23%;
                width: 49%;
                margin-top: 1%;

                img {
                    height: 80%;
                    width: 100%;
                }

                .program {
                    height: 20%;
                    display: flex;
                    align-items: center;
                    background-color: white;
                }
            }
        }
    }

    .page {
        height: 5%;
        margin-top: 10px;
        text-align: center;
    }
</style>