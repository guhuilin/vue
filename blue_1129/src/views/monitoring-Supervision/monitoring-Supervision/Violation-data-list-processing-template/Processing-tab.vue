<template>
    <div style="position:relative;height: 100%;overflow-y: auto;">
        <!-- 综合研判的tab切换的功能 -->
        <div class="tab">
            <div style="position: relative;">
                <a-button type="primary" class="returnBtn"  @click="backToPrevious">返回
                    <a-icon type="arrow-right" />
                </a-button>
                <a-button type="primary" class="customAuxiliaryArea" @click="GoToCustomAuxiliaryArea">
                    自定义辅助区
                </a-button>
            </div>
            <a-tabs defaultActiveKey="1" @change="callback">
                <a-tab-pane tab="监听监看辅助区" key="1">
                    
                    <correspondingDataArea></correspondingDataArea>
                    <!-- <div style="height:400px;width:400px;background-color:yellow;">

                    </div> -->
                    <div class="program-information">
                        <div class="program-information-right">
                            <video controls="controls" ref="video">
                                此视频暂无法播放，请稍后再试
                            </video>
                        </div>
                        <div class="program-information-left">
                            <h3 style="color:#5868d9;font-weight: 800;height:55px;line-height:55px;text-align:center;font-size:18px;border-bottom:1px solid rgb(233,239,241);">
                                节目信息
                            </h3>
                            <div style="height:388px;overflow-y: auto;">
                                <div class="left-right-data" style="margin-right:10px;float:left">
                                    <div v-for="value in programInformationLeftData" style="font-size:16px;margin-bottom:5px;width:80px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                                        {{value}}：
                                    </div>
                                </div>
                                <div class="left-right-data" style="float:left">
                                    <div v-for="value in programInformationRightData" style="font-size:16px;margin-bottom:5px;width:200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                                        {{value}}
                                    </div>
                                </div>
                            </div>
                            <div style="margin-left:95px">
                                <a-button type="primary" @click="showModal">保存提交</a-button>
                                <a-modal
                                    title="完成提交"
                                    :visible="visible"
                                    @ok="handleOk"
                                    :confirmLoading="confirmLoading"
                                    @cancel="handleCancel"
                                >
                                <div style="overflow-y: auto;">
                                    <div style="float:left;">
                                        投票结果：
                                    </div>
                                    <div style="float:left;">
                                        6人赞同，3人反对，1人弃权。根据规则，判定该节目违规。
                                    </div>
                                </div>

                                </a-modal>
                            </div>
                        </div>
                    </div>
                    <div id="comprehensiveSearch" ref="comprehensiveSearch" @click="comprehensiveSearch">
                        <!-- <a-button icon="search">综合搜索</a-button> -->
                        <img src="../../../../assets/Monitor-monitoring-management/Comprehensive.png" alt="">
                    </div>
                    <div id="comprehensiveSearchShow" ref="comprehensiveSearchShow">
                        <div style="position:relative">
                            <div style="position:absolute;" class="Collapse" ref="Collapse" @click="Collapse">
                                <a-icon type="close-square" />
                            </div>
                            <div class="search-area">
                                <div style="margin-left:153px;">
                                    <a-input v-model="keyWordInput" style="width:180px;margin-right:5px;" @keyup.enter="comprehensiveSearchBtn"></a-input>
                                    <a-button @click="comprehensiveSearchBtn" >搜索</a-button>
                                </div>
                                <div style="margin-left:116px;margin-top:10px;">
                                    <div :style="{display:'inline-block'}">
                                        <a-checkbox
                                            :indeterminate="comprehensiveSearchCheckAll"
                                            @change="comprehensiveSearchOnCheckAllChange"
                                            :checked="comprehensiveSearchCheckAll"
                                        >
                                            全选
                                        </a-checkbox>
                                    </div>
                                    <a-checkbox-group style="display:inline-block;" :options="comprehensiveSearchPlainOptions" v-model="comprehensiveSearchCheckedList" @change="comprehensiveSearchOnChange" />
                                </div>
                            </div>
                            <a-spin
                                :spinning="spinning"
                            >
                                <div class="comprehensiveSearchContent">
                                    <a-list
                                        itemLayout="horizontal"
                                        :dataSource="comprehensiveSearchData.content"
                                    >
                                        <a-list-item slot="renderItem" slot-scope="item, index">
                                            <a-list-item-meta
                                            
                                            >
                                                <a slot="title" :href="item.titleUrl" target="_blank">{{item.name}}</a>
                                                <a-avatar slot="avatar" :src="item.img" />
                                                    <div slot="title" style="padding-top:10px;">
                                                        <!-- <a-col :span="2"> -->
                                                            <span class="website">{{item.wangzhan}}</span>
                                                        <!-- </a-col> -->
                                                        <!-- <a-col :span="4"> -->
                                                            <span class="webType">{{item.type}}</span>
                                                        <!-- </a-col> -->
                                                        <!-- <a-col :span="6" > -->
                                                            <span style="float:right;margin-right:5px;" class="tim">{{item.createTime}}</span>
                                                        <!-- </a-col> -->
                                                    </div>
                                            </a-list-item-meta>
                                        </a-list-item>
                                    </a-list>
                                </div>
                            </a-spin>
                            <div class="pagination">
                                <a-pagination
                                    :current="current"
                                    showQuickJumper 
                                    :defaultCurrent="defaultCurrent" 
                                    :total="comprehensiveSearchData.totalElements" 
                                    @change="onChange" 
                                />
                            </div>
                        </div>
                    </div>
                    <!-- <comprehensiveResearchEvidenceCollection></comprehensiveResearchEvidenceCollection> -->
                </a-tab-pane>
                <a-tab-pane tab="网络电视辅助区" key="2" forceRender>
                    <internetTvAuxiliaryArea></internetTvAuxiliaryArea>
                </a-tab-pane>
                <a-tab-pane tab="多画面辅助区" key="3">
                    <screenAuxiliaryArea></screenAuxiliaryArea>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>
<script>
    //tab对应的数据区
    import correspondingDataArea from './Corresponding-data-area.vue'
    // 引入综合研判取证上传的功能
    import comprehensiveResearchEvidenceCollection from './Comprehensive-research-evidence-collection.vue'
    // 引入网络电视和网络电视选择遥控器功能
    import internetTvAuxiliaryArea from './Internet-tv-auxiliary-area.vue'
    import screenAuxiliaryArea from './Screen-auxiliary-area.vue'
    import bus from '../../bus/bus.js'
    // const plainOptions = ['互联网', '微信', '微博' , 'app']
    import {queryAllCont} from '@api/api.js'
    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 3',
        },
    ]
    export default {
        data () {
            return {
                programInformationLeftData : null,
                programInformationRightData : null,
                src : null,
                data,
                // comprehensiveSearch
                comprehensiveSearchCheckedList: ['互联网', '微信', '微博' , 'app'],
                comprehensiveSearchIndeterminate: true,
                comprehensiveSearchCheckAll: true,
                comprehensiveSearchPlainOptions : ['互联网', '微信', '微博' , 'app'],
                comprehensiveSearchData : [],//综合搜索返回的所有数据
                page : 1,
                pageSize : 5,
                spinning:true,
                defaultCurrent:1,
                current:1,
                // 输入框中的内容
                keyWordInput : "",




                // ModalText: 'Content of the modal',
                visible: false,
                confirmLoading: false,
            }
        },
        created(){
            this.programInformationLeftData = this.$route.query.leftData;
            this.programInformationRightData = this.$route.query.violationDataDetailsProcessing;
            // this.programInformationLeftData = JSON.stringify(this.$route.query.violationDataDetailsProcessing)
            this.comprehensiveSearchBtn();
        },
        components : {
            correspondingDataArea,
            internetTvAuxiliaryArea,
            comprehensiveResearchEvidenceCollection,
            screenAuxiliaryArea
        },
        methods: {
            showModal() {
            this.visible = true;
      },
      handleOk(e) {
        // this.ModalText = 'The modal will be closed after two seconds';
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false;
      },
            backToPrevious(){
                this.$router.push({
                    path : "/monitoring-Supervision/judget",
                })
            },
            // 去自定义辅助区
            GoToCustomAuxiliaryArea(){
                console.log(this.$router.leftData)
                this.$router.push({
                    // path : "/GoCustomAuxiliaryArea"
                })
            },
            // 分页的事件
            onChange(pageNumber) {
                this.page = pageNumber;
                this.spinning = true;
                this.comprehensiveSearchBtn();
                // console.log('Page: ', pageNumber);
            },
            // 搜索按钮的事件
            comprehensiveSearchBtn(){
                this.spinning = true;
                if(this.comprehensiveSearchCheckedList.length <= 0){
                    this.$message.warning('必须选择以下其中的一项',8);
                    this.spinning = false;
                }else{
                    let arr = [];
                    for(let j = 0 ; j < this.comprehensiveSearchCheckedList.length ; j ++){
                        if(this.comprehensiveSearchCheckedList[j] === "互联网"){
                            arr.push('web');
                        };
                        if(this.comprehensiveSearchCheckedList[j] === "微信"){
                            arr.push("wx");
                        };
                        if(this.comprehensiveSearchCheckedList[j] === "微博"){
                            arr.push("wb");
                        };
                        if(this.comprehensiveSearchCheckedList[j] === "app"){
                            arr.push("app");
                        }
                    }
                    console.log(arr)
                    let str = "";
                    for(let i = 0 ; i < arr.length ; i ++){
                        str += arr[i] + ","
                    };

                    queryAllCont({
                        type: str.substring(0,str.length - 1),
                        keyWord: this.keyWordInput,
                        page: this.page,
                        size: this.pageSize,
                    }).then((res)=>{
                        if(res.result.content.length <= 0 && this.page !== 1 && str.length >= 0 && this.keyWordInput !== ""){
                            this.page = 1;
                            this.comprehensiveSearchBtn();
                            // this.defaultCurrent = 1;
                        }else{
                            this.comprehensiveSearchData = res.result;
                            this.current = res.result.number;
                            let that = this;
                            setTimeout(function(){
                                that.spinning = false;
                                that.keyWordInput = "";
                            },500)
                        }
                    });
                }
            },
            callback (key) {
                console.log(key)
            },
            // 点击综合搜索的按钮事件
            comprehensiveSearch(){
                console.log()
                this.$refs.comprehensiveSearchShow.style.display = "block";
                this.$refs.comprehensiveSearch.style.display = "none";
            },
            // 点击综合搜索中的收起按钮的事件
            Collapse(){
                this.$refs.comprehensiveSearchShow.style.display = "none"
                this.$refs.comprehensiveSearch.style.display = "block";
            },
            comprehensiveSearchOnChange (comprehensiveSearchCheckedList) {
                this.comprehensiveSearchIndeterminate = !!comprehensiveSearchCheckedList.length && (comprehensiveSearchCheckedList.length < this.comprehensiveSearchPlainOptions.length)
                this.comprehensiveSearchCheckAll = comprehensiveSearchCheckedList.length === this.comprehensiveSearchPlainOptions.length
                // console.log(comprehensiveSearchCheckedList)
            },
            comprehensiveSearchOnCheckAllChange (e) {
                Object.assign(this, {
                    comprehensiveSearchCheckedList: e.target.checked ? this.comprehensiveSearchPlainOptions : [],
                    comprehensiveSearchIndeterminate: false,
                    comprehensiveSearchCheckAll: e.target.checked,
                })
                // console.log(this.comprehensiveSearchCheckedList)
            },
        },
        mounted(){
            this.$refs.video.src = this.$route.query.mp4;
            console.log(this.$refs.video,"我是video")
            // bus.$emit("url",this.$route.query.mp4)
            // http://192.168.2.171:5000/violationDataProcessing?n=ws%3A192.168.111.200%3A8088%2FchatSocket%2F76122%2Fadmin7
            // console.log(this.$refs.video)
            // console.log()
            // for(let i in this.$route.params.violationDataDetailsProcessing){
            //     this.programInformationLeftData.push(this.$route.params.violationDataDetailsProcessing[i])
            //     console.log(this.$route.params.violationDataDetailsProcessing[i])
            // }
            // console.log(this.$route.params.violationDataDetailsProcessing)
            // this.programInformationLeftData = JSON.stringify(this.$route.query.violationDataDetailsProcessing)
            // for(let i in JSON.parse(this.programInformationLeftData)){
            //     console.log(this.programInformationLeftData[i])
            // }
            // console.log(JSON.parse(JSON.parse(this.programInformationLeftData)))
            // console.log(this.programInformationLeftData instanceof Array);
            // console.log(JSON.parse(eval(this.programInformationLeftData)))
            // console.log(JSON.stringify(this.$route.query.violationDataDetailsProcessing),"898989")
        }
    }
</script>

<style lang="scss" scoped>
    
    .tab{
        height: 100%;
        overflow-y: auto;
        // position: relative;
        .program-information{
            width:1260px;
            height:525px;
            background: #fff;
            .program-information-left{
                width:320px;
                height:525px;
                padding:10px;
                // background: purple;
                padding: 15px;
                background: #fff;
                float:left;
                margin-left:20px;
                // .left-right-data{
                //     float: left;
                //     // display: inline-block;
                // }
            }
            .program-information-right{
                float: left;
                padding: 10px;
                background: #fff;
                video{
                    width:900px;
                    height:500px;
                    outline:none;
                }
            }
        }
    }
    // 综合搜索
    #comprehensiveSearch{
        width: 50px;
        height:50px;
        position: fixed;
        left: 1480px;
        top: 284px;
        img{
            width:100%;
            height:100%;
        }
    }
    #comprehensiveSearch:hover{
        cursor: pointer;
    }
    #comprehensiveSearchShow{
        width: 592px;
        height:468px;
        background: #fff;
        position: fixed;
        left: 943px;
        top: 285px;
        // display: block;
        display: none;
        .Collapse{
            width: 50px;
            height:40px;
            // background: #ccc;
            position: absolute;
            left:535px;
            text-align: center;
            line-height: 40px;
            z-index: 50;
            .anticon{
                font-size: 25px;
                color:#ccc;
            }
        }
        .Collapse:hover{
            cursor: pointer;
        }
        .search-area{
            height: 80px;
            padding: 5px;
            // background: purple;
            background: url(../../../../assets/converge/searchBack.png) no-repeat;
            background-size:100% 100%;
        }
        .comprehensiveSearchContent{
            height:290px;
            background: #fff;
            overflow: hidden;
            .ant-list{
                width:607px;
                height:290px;
                overflow-y: auto;
            }
        }
        .pagination{
            border-top:1px solid #ccc;
            .ant-pagination{
                padding-top:15px;
                padding-left:15px;
            }
        }
    }
    .ant-list-item-meta-title{
        >a{
            display: block;
            width:500px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .ant-list-item-meta-description{
        display: block;
        width:500px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .ant-avatar{
        width: 50px;
        height:50px;
    }
    .website{
        display:inline-block;
        color:#fff;
        background-color:red;
        opacity: 0.5;
        font-size: 12px;
        border-radius: 3px;
        margin-right:10px;
    }
    .webType{
        display:inline-block;
        color:#fff;
        background-color:red;
        opacity: 0.5;
        font-size: 12px;
        border-radius: 3px;
    }
    .tim{
        // margin-left: 285px;
    }
    .returnBtn{
        float: right;
        z-index: 100;
        position: absolute;
        right:0px;
        top:23px;
        border-radius: 20px;
        // position: absolute;
        // top:60px;
        // right:3em; 
    }
    .customAuxiliaryArea{
        float: right;
        position: absolute;
        right:100px;
        top: 23px;
        z-index: 100;
        border-radius: 20px;
    }
    .customAuxiliaryArea::after{
        content: "";
        display: block;
        clear: both;
    }
    .returnBtn::after{
        content : "";
        display: block;
        clear: both;
    }
    .ant-tabs{
        overflow: hidden;
    }
</style>

<style scoped>
    >>>.ant-tabs-nav .ant-tabs-tab:hover{
        color: black !important;
    }
    >>>.ant-tabs-tab-active{
        color: black;
    }
    >>>.ant-checkbox + span{
        color:#fff;
    }
    >>>.ant-tabs-tab-active{
        background: #5868d9;
        /* border-radius: 10px; */
    }
    >>>.ant-tabs-ink-bar{
        bottom: 0px !important;
        height:0px;
    }
    >>>.ant-tabs-nav-wrap{
        margin-bottom:0px;
    }
    >>>.ant-tabs-tab{
        border: 1px solid #5868d9;
        color:#5868d9;
    }
    >>>.ant-tabs-nav-wrap .ant-tabs-nav-scroll .ant-tabs-nav .ant-tabs-tab:hover{
        color:#5868d9 !important;
    }
    >>>.ant-tabs-tab-active{
        color:#fff;
    }
    >>>.ant-tabs-nav-wrap .ant-tabs-nav-scroll .ant-tabs-nav .ant-tabs-tab-active:hover{
        color:#fff !important;
    }
    >>>.ant-tabs-bar{
        background: #fff;
    }
    >>>.ant-tabs-nav{
        margin:10px;
    }
</style>


