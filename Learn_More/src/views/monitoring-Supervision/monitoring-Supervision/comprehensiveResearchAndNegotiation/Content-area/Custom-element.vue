<template>
    <div>
        <div style="position:absolute;top:110px;right:120px;">
            <a-button type="primary" style="margin-right:10px;" @click="showModal">添加自定义元素</a-button>
            <a-button type="primary" @click="save" style="margin-right:10px;">保存</a-button>
            <a-button type="primary" @click="returnUpperLevel">返回</a-button>
            <a-modal
                title="添加自定义元素"
                :visible="visible"
                :maskClosable="false"
                @ok="handleOk"
                @cancel="handleCancel"
            >
                <div>
                    <div :style="{ borderBottom: '1px solid #E9E9E9' }">
                        <a-checkbox
                            :indeterminate="indeterminate"
                            @change="onCheckAllChange"
                            :checked="checkAll"
                        >全选</a-checkbox>
                    </div>
                    <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />
                </div>
            </a-modal>
        </div>
    </div>
</template>
<script>
    import { queryCustomAreaCodeone  , quertCustomAreaConfig} from '@/api/api.js';
    import bus from '../../../bus/bus.js'
    export default {
        data() {
            return {
                arr: [],
                visible: false,
                checkedList: [],//已经添加的元素
                indeterminate: true,
                checkAll: false,
                plainOptions : [],//所有元素
                userName : "",
                userId : "",

                length : 0,
            };
        },
        methods: {
            returnUpperLevel(){
                // console.log(this.$route.query.violationDataDetailsProcessing)
                // console.log(this.$route.query.leftData)
                // console.log(this.$route.query.mp4)
                this.$router.push({
                    path : "/violationDataProcessing",
                    query : {
                        violationDataDetailsProcessing : this.$route.query.violationDataDetailsProcessing,
                        leftData : this.$route.query.leftData,
                        mp4 : this.$route.query.mp4,
                    }
                })
            },
            // 保存按钮的事件
            save(){
                // console.log(this.length,"我是a")
                this.$emit('save')
            },
            // 弹窗里面的事件
            showModal() {
                this.checkedList = [];
                this.plainOptions = [];
                this.visible = true;
                this.getUserAddableElements();
            },
            // 获取用户可以添加的元素
            getUserAddableElements(){
                quertCustomAreaConfig({
                    userName : this.userName,
                }).then((res)=>{
                    for(let i = 0 ; i < res.result.length ; i ++){
                        if(res.result[i].isChecked === 1){
                            // 选中的
                            this.checkedList.push(res.result[i].configName);
                            this.length ++;
                        }
                        // 所有的数据
                        this.plainOptions.push(res.result[i].configName)
                    }
                    // for(let i = 0 ; i < res.result.quertCustomAreaCodeorderby.length ; i ++){
                    //     res.result.quertCustomAreaCodeorderby[i].disabled = false
                    //     this.plainOptions.push(res.result.quertCustomAreaCodeorderby[i].areaCode)
                    //     // console.log(this.plainOptions,"7777777")
                    // }
                    // for(let i = 0 ; i < res.result.list.length ; i ++){
                    //     this.checkedList.push(res.result.list[i].areaCode)
                    // }
                    // this.length = res.result.list.length;
                    // console.log(res,"我是res")
                })
            },
            // 弹窗的确定事件
            handleOk(e) {
                console.log(this.checkedList)
                this.arr = [];
                let obj = {};
                let oContent = document.querySelectorAll(".content");
                for (let i = 0; i < this.checkedList.length; i++) {
                    let obj = new Object();
                    obj.width = "100";
                    obj.height = "100";
                    obj.left = "100";
                    obj.top = "100";
                    obj.userName = this.userName;
                    obj.areaCode = this.checkedList[i];
                    obj.userId = this.userId;
                    this.arr.push(obj);
                }
                bus.$emit("createdElement",this.arr);
                // console.log(this.arr,"我是arr")
                this.visible = false;
            },
            handleCancel(e) {
                this.checkedList = [];
                this.plainOptions = [];
                console.log(this.checkedList);
                this.getUserAddableElements();
                this.visible = false;
            },
            // 弹窗里面选中的事件
            onChange(checkedList) {
                this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length;
                this.checkAll = checkedList.length === this.plainOptions.length;
                console.log(this.checkedList);
            },
            onCheckAllChange(e) {
                Object.assign(this, {
                    checkedList: e.target.checked ? this.plainOptions : [],
                    indeterminate: false,
                    checkAll: e.target.checked
                });
                console.log(this.checkedList);
            }
        },
        created() {
            // console.log()
            this.userName = JSON.parse(localStorage.pro__Login_Userinfo).value.userName;
            this.userId = JSON.parse(localStorage.pro__Login_Userinfo).value.userId
            this.getUserAddableElements();
            // console.log(this.userName)
        }
    };
</script>
