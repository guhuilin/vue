<template>
    <div>
        <div class="comprehensiveSearch" ref="comprehensiveSearch" @click="comprehensiveSearch">
            <img src="../../../../../assets/Monitor-monitoring-management/comprehensiveSearchIcon_03.png" alt="">
        </div>
        <div class="comprehensiveSearchShow" ref="comprehensiveSearchShow">
            <!-- 上 -->
            <div>
                <div class="search-area">
                    <div style="margin-left: 160px;margin-top: 5px;">
                        <a-input style="width:180px;margin-right:5px;" v-model="keyWordInput"></a-input>
                        <a-button @click="searchAreaBtn" type="primary"  style="margin-right:5px;">
                            <a-icon type="search"></a-icon>
                            搜索
                        </a-button>
                        <a-button @click="resetBtn">
                            重置
                        </a-button>
                        <!-- <a-button > -->
                        <div style="display:inline-block">
                            <a-icon type="close-circle" :style="{ fontSize: '20px' , marginLeft:'50px'}" @click="close" />
                        </div>
                        <!-- </a-button> -->
                        <!-- <div style="display:inline-block;">
                            <a-icon type="close-circle" />
                        </div> -->
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
            </div>
            <!-- 中 -->
            <div style="height:320px;overflow-y: auto;border-bottom:1px solid black;background: #fff;">
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
            </div>
            <!-- 下 -->
            <div style="padding-top: 17px;height: 66px;background: rgb(255, 255, 255);">
                <a-pagination showQuickJumper :defaultCurrent="defaultCurrent" :current="current" :total="totalSum" @change="onChange" />
            </div>
        </div>
    </div>
</template>

<script>
    import {queryAllCont} from '@api/api.js'
    export default {
        data(){
            return{
                keyWordInput : "",


                comprehensiveSearchCheckedList: ['互联网', '微信', '微博' , 'app'],
                comprehensiveSearchIndeterminate: true,
                comprehensiveSearchCheckAll: true,
                comprehensiveSearchPlainOptions : ['互联网', '微信', '微博' , 'app'],
                comprehensiveSearchData : [],//综合搜索返回的所有数据

                // 分页
                page : 1,
                pageSize : 5,
                totalSum : 0,
                defaultCurrent:1,
                current : 1,
                // 加载中
                spinning:true,
                // obj : {"value":{"userId":"ad62d47de00d49d6b9becda9ad716b0b","userName":"admin6","fullName":"白 蓉","password":"eb9ea5458fafe3e7","mobile":null,"email":null,"sex":null,"age":null,"birthday":null,"createTime":"2019-07-31 09:38:36","createBy":null,"salt":"zoGXMW0E","status":1,"avatar":null,"delFlag":"1","updateBy":null,"updateTime":"2019-10-21 14:22:17","activitiAsync":null,"orgCode":null,"roleId":null,"departId":null,"roleName":null,"departName":null},"expire":1572843380809}
            }
        },
        created(){
            this.searchAreaBtn();
        },
        methods : {
            // 关闭按钮的事件
            close(){
                this.$refs.comprehensiveSearchShow.style.display = "none";
                this.$refs.comprehensiveSearch.style.display = "block";
            },
            // 重置
            resetBtn(){
                this.keyWordInput = "";
                this.page = 1;
                this.searchAreaBtn();
            },
            // 分页
            onChange(pageNumber) {
                this.page = pageNumber;
                this.searchAreaBtn();
            },


            comprehensiveSearchOnCheckAllChange (e) {
                Object.assign(this, {
                    comprehensiveSearchCheckedList: e.target.checked ? this.comprehensiveSearchPlainOptions : [],
                    comprehensiveSearchIndeterminate: false,
                    comprehensiveSearchCheckAll: e.target.checked,
                })
                // console.log(this.comprehensiveSearchCheckedList)
            },
            comprehensiveSearchOnChange (comprehensiveSearchCheckedList) {
                this.comprehensiveSearchIndeterminate = !!comprehensiveSearchCheckedList.length && (comprehensiveSearchCheckedList.length < this.comprehensiveSearchPlainOptions.length)
                this.comprehensiveSearchCheckAll = comprehensiveSearchCheckedList.length === this.comprehensiveSearchPlainOptions.length
                // console.log(comprehensiveSearchCheckedList)
            },
            comprehensiveSearch(){
                this.$refs.comprehensiveSearchShow.style.display = "block";
                this.$refs.comprehensiveSearch.style.display = "none";
            },
            searchAreaBtn(){
                this.spinning = true;
                if(this.comprehensiveSearchCheckedList.length <= 0){
                    this.$message.warning('必须选择以下其中的一项',8);
                }else{
                    let arr = [];
                    for(let i = 0 ; i < this.comprehensiveSearchCheckedList.length ; i ++){
                        if(this.comprehensiveSearchCheckedList[i] === "互联网"){
                            arr.push('web');
                        };
                        if(this.comprehensiveSearchCheckedList[i] === "微信"){
                            arr.push("wx");
                        };
                        if(this.comprehensiveSearchCheckedList[i] === "微博"){
                            arr.push("wb")
                        };
                        if(this.comprehensiveSearchCheckedList[i] === "app"){
                            arr.push('app');
                        }
                    };
                    let str = '';
                    for(let i = 0 ; i < arr.length ; i ++){
                        str += arr[i] + ',';
                    }
                    queryAllCont({
                        type: str.substring(0,str.length - 1),
                        keyWord: this.keyWordInput,
                        page: this.page,
                        size: this.pageSize,
                    }).then((res)=>{
                        if(res.result.content.length <= 0 && this.page !== 1 && str.length >= 0 && this.keyWordInput !== ""){
                            this.page = 1;
                            this.searchAreaBtn();
                        }else{
                            this.comprehensiveSearchData = res.result;
                            this.totalSum = res.result.totalElements;
                            this.current = res.result.number;
                            setTimeout(()=>{
                                this.spinning = false;
                            },500)
                        }
                        
                        // this.spinning = false;
                        // console.log(res);
                    })
                }
                // for(let i = 0 ; i < this.comprehensiveSearchCheckedList.length ; i ++){
                //     // if()
                // }
                // console.log(this.comprehensiveSearchCheckedList)
                // this.spinning = true;
                // if(this.comprehensiveSearchCheckedList.length <= 0){
                //     this.$message.warning('必须选择以下其中的一项',8);
                //     this.spinning = false;
                // }else{
                //     let arr = [];
                //     for(let j = 0 ; j < this.comprehensiveSearchCheckedList.length ; j ++){
                //         if(this.comprehensiveSearchCheckedList[j] === "互联网"){
                //             arr.push('web');
                //         };
                //         if(this.comprehensiveSearchCheckedList[j] === "微信"){
                //             arr.push("wx");
                //         };
                //         if(this.comprehensiveSearchCheckedList[j] === "微博"){
                //             arr.push("wb");
                //         };
                //         if(this.comprehensiveSearchCheckedList[j] === "app"){
                //             arr.push("app");
                //         }
                //     }
                //     let str = "";
                //     for(let i = 0 ; i < arr.length ; i ++){
                //         str += arr[i] + ","
                //     };

                //     queryAllCont({
                //         type: str.substring(0,str.length - 1),
                //         keyWord: this.keyWordInput,
                //         page: this.page,
                //         size: this.pageSize,
                //     }).then((res)=>{
                //         if(res.result.content.length <= 0 && this.page !== 1 && str.length >= 0 && this.keyWordInput !== ""){
                //             this.page = 1;
                //             // this.comprehensiveSearchBtn();
                //             // this.defaultCurrent = 1;
                //         }else{
                //             this.comprehensiveSearchData = res.result;
                //             // this.current = res.result.number;
                //             let that = this;
                //             setTimeout(function(){
                //                 // that.spinning = false;
                //                 that.keyWordInput = "";
                //             },500)
                //         }
                //     });
                // }
                // console.log(this.keyWordInput)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .comprehensiveSearch{
        width: 50px;
        height:50px;
        position: fixed;
        right: 20px;
        top: 350px;
        img{
            width: 100%;
            height:100%;
        }
    }
    .comprehensiveSearch:hover{
        cursor: pointer;
    }
    .comprehensiveSearchShow{
        width: 592px;
        height:468px;
        // background: #fff;
        position: absolute;
        right: 25px;
        top: 175px;
        border: 1px solid black;
        display: none;
        z-index: 20;
        .search-area{
            overflow: hidden;
            height: 80px;
            background: url(../../../../../assets/converge/searchBack.png) no-repeat;
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
    .ant-list-item:hover{
        background: #ccc;
    }
    // .ant-checkbox-group{
    //     color:#fff;
    // }
    .ant-checkbox-wrapper{
        // color:#fff;
    }
    
</style>

<style scoped>
    >>>.ant-checkbox-wrapper{
        color:#fff;
    }
</style>