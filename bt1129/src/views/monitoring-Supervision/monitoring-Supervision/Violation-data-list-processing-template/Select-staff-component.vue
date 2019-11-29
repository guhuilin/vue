<template>
<!-- 选择用户的功能 -->
    <a-checkbox-group @change="onChange">
        <a-row>
            <a-col :span="8" v-for="value in allOnlineUser">
                <a-checkbox :value="value">{{value.userName}}</a-checkbox>
            </a-col>
            <!-- <a-col :span="8">
                <a-checkbox value="B">B</a-checkbox>
            </a-col>
            <a-col :span="8">
                <a-checkbox value="C">C</a-checkbox>
            </a-col>
            <a-col :span="8">
                <a-checkbox value="D">D</a-checkbox>
            </a-col>
            <a-col :span="8">
                <a-checkbox value="E">E</a-checkbox>
            </a-col> -->
        </a-row>
    </a-checkbox-group>
</template>
<script>
import {getCurrentLoginUserList} from '@/api/api.js'
import websocket from '../../../../webSocket'
    export default {
        data(){
            return {
                selectedDiscussionGroupStaff : [],
                allOnlineUser : []
            }
        },
        created(){
            // 获取所有在线的用户
            getCurrentLoginUserList({}).then((res)=>{
                for(let i = 0 ; i < res.result.length ; i ++){
                    this.allOnlineUser.push(JSON.parse(res.result[i]))
                }
                
                // this.allOnlineUser = res.result
                console.log(this.allOnlineUser,"在线人员");
            })
        },
        methods: {
            onChange (checkedValues) {
                this.selectedDiscussionGroupStaff = checkedValues
                this.$emit("selectedPerson",this.selectedDiscussionGroupStaff)
                console.log(checkedValues,"我是选中的人员")
            },
            
            
        },
        mounted(){

        }
    }
</script>

<style lang="scss" scoped>
    .ant-col-8{
        width: 80px;
    }
</style>
