<template>
    <div style="height: 94%;background: white;">
        <div class="searchDiv">
            <a-form layout="inline">
                <a-row :gutter="24">
                    <a-col :md="5" :sm="10">
                        <a-form-item label="节目名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }"
                                     style="width: 100%;">
                            <a-input v-model="queryParam.programName" placeholder="请输入..."/>
                        </a-form-item>
                    </a-col>

                    <a-col :md="5" :sm="10">
                        <a-form-item label="所属站点" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }"
                                     style="width: 100%;">
                            <a-select v-model="queryParam.source">
                                <a-select-option v-for="web in website" :value="web.site_id" :key="web.site_id">
                                    {{web.site_name}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>

                    <a-col :md="9" :sm="10">
                        <a-form-item label="发布时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}"
                                     style="width: 100%;">
                            <j-date v-model="queryParam.startTime" :showTime="true" date-format="YYYY-MM-DD"
                                    style="width:45%" placeholder="请选择开始时间"></j-date>
                            <span style="width: 10px;">~</span>
                            <j-date v-model="queryParam.endTime" :showTime="true" date-format="YYYY-MM-DD"
                                    style="width:45%" placeholder="请选择结束时间"></j-date>
                        </a-form-item>
                    </a-col>

                    <a-col :md="5" :sm="8" v-if="hasPerm('query')">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                            <a-button type="primary" icon="search" style="background-color: #43d457;border: none;" @click="search">查询</a-button>
                            <a-button type="primary" icon="reload" style="background-color: #ffae00;border: none;margin-left: 8px" @click="reset">重置</a-button>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="picBody">
            <div class="picDiv" v-for="img in imgList" :key="img.id" @mouseenter="showBtn(img.id)">
                <img :src="'http://192.168.111.200' + img.img_local_url"/>
                <a-row class="program" style="font-weight: bold;">{{img.program_name}}</a-row>
                <a-row class="program">
                    <a-col :md="10" :sm="10" offset="2">{{img.site_name}}</a-col>
                    <a-col :md="10" :sm="10">{{img.violate_type_name}}</a-col>
                </a-row>
                <div class="btnDiv" v-if="btnShow && picId === img.id" @mouseleave="hiddenBtn">
                    <a-button type="primary" @click="showUrl(img.program_url)">查看</a-button>
                    <a-button type="primary" style="margin-left: 10px;" @click="getViolateImageResultJson(img.img_local_url)" v-if="hasPerm('submit')">检测
                    </a-button>
                </div>
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
        <discernResultModal discernType="pic" ref="discernResultModal"></discernResultModal>
    </div>
</template>

<script>
    import JDate from '@/components/jeecg/JDate'
    import { getImageWebSiteInfoList, getViolateImageInfoList, getViolateImageResultJson } from '@api/api'
    import { hasPerm } from "@/utils/authFilter";
    import discernResultModal from '@/components/jeecg/discernResultModal'

    export default {
        name: 'picCheck',
        components: {
            JDate,
            discernResultModal
        },
        data() {
            return {
                page: 1,
                total: 0,
                pageSize: 15,
                queryParam: {},
                website: [],
                imgList: [],
                picId: '',
                btnShow: false
            }
        },
        created() {
            this.getImageWebSiteInfoList();
            this.getViolateImageInfoList();
        },
        methods: {
            hasPerm,
            getImageWebSiteInfoList() {
                getImageWebSiteInfoList({}).then((res) => {
                    if (res.success) {
                        this.website = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            getViolateImageInfoList() {
                let param = {
                    programName: this.queryParam.programName,
                    siteId: this.queryParam.source,
                    startTime: this.queryParam.startTime,
                    endTime: this.queryParam.endTime,
                    pageNo: this.page,
                    pageSize: this.pageSize
                };
                getViolateImageInfoList(param).then((res) => {
                    if (res.success) {
                        this.imgList = res.result.records;
                        this.total = res.result.total;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            changePage(page) {
                console.log(page);
            },
            search() {
                this.page = 1;
                this.getViolateImageInfoList();
            },
            reset() {
                this.queryParam.programName = '';
                this.queryParam.source = '';
                this.queryParam.startTime = '';
                this.queryParam.endTime = '';
                this.page = 1;
                this.getViolateImageInfoList();
            },
            showBtn(id) {
                this.picId = id;
                this.btnShow = true;
            },
            hiddenBtn() {
                this.picId = '';
                this.btnShow = false;
            },
            showUrl(url) {
                window.open(url);
            },
            getViolateImageResultJson(url) {
                this.$refs.discernResultModal.show();
                getViolateImageResultJson({imageFileName: url}).then((res) => {
                    if (res.success) {
                        let result = JSON.parse(res.result).data[0].results;
                        let str = '';
                        result.forEach(rst => {
                            str += `类型：${rst.label}    建议：${rst.suggestion}，`;
                        });
                        this.$refs.discernResultModal.getResult('pic', str.substring(0, str.length - 1));
                    } else {
                        console.log(res.message);
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .searchDiv {
        height: 50px;
        padding: 7px;
    }

    .picBody {
        height: 80%;
        padding: 0 1% 0 1%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;

        .picDiv {
            height: 30%;
            width: 18%;
            margin: 1%;

            img {
                height: 70%;
                width: 100%;
            }

            .program {
                height: 15%;
                text-align: center;
            }
        }

        .btnDiv {
            height: 100%;
            width: 100%;
            position: relative;
            bottom: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #333333aa;
        }
    }

    .page {
        height: 5%;
        margin-top: 3%;
        text-align: center;
    }
</style>