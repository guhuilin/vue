<template>
    <div style="background: white;padding: 20px;font-size: 150%;">
        <a-row>
            <a-col :md="8" :sm="8" offset="1">
                <a-upload
                        listType="picture-card"
                        class="avatar-uploader"
                        :showUploadList="false"
                        :action="url.fileUpload"
                        :data="{'isup':1}"
                        :headers="headers"
                        :beforeUpload="beforeUpload"
                        @change="handleChange"
                >
                    <img v-if="userInfo.avatar" :src="getAvatarView()" alt="avatar" style="height:104px;max-width:300px"/>
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">Upload</div>
                    </div>
                </a-upload>
            </a-col>
        </a-row>

        <a-row style="margin-top: 20px;">
            <a-col :md="4" :sm="8" offset="1">
                帐号: {{userInfo.userName}}
            </a-col>
            <a-col :md="4" :sm="8">
                <a-button type="primary" @click="updatePassword">修改密码</a-button>
            </a-col>
        </a-row>

        <a-row style="margin-top: 20px;">
            <a-col :md="4" :sm="8" offset="1">
                真实姓名: {{userInfo.fullName}}
            </a-col>
            <a-col :md="4" :sm="8">
                角色：123123
            </a-col>
        </a-row>

        <a-row style="margin-top: 20px;">
            <a-col :md="4" :sm="8" offset="1">
                所属部门：123123
            </a-col>
            <a-col :md="4" :sm="8">
                电话: {{userInfo.mobile}}
            </a-col>
        </a-row>

        <user-password ref="userPassword"></user-password>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { ACCESS_TOKEN, USER_INFO } from "@/store/mutation-types"
    import UserPassword from '@comp/tools/UserPassword'
    import { editUser } from '@api/api'

    export default {
        name: 'info',
        components: {
            UserPassword
        },
        data() {
            return {
                userInfo: {},
                headers: {},
                loading: false,
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
                    imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
                }
            }
        },
        created() {
            this.userInfo = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO)));
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token": token};
        },
        methods: {
            beforeUpload(file) {
                if (file.type.includes('image')) {
                    return true;
                } else {
                    return false;
                }
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    let response = info.file.response;
                    if (response.success) {
                        this.userInfo.avatar = response.message;
                        let param = {
                            userId: this.userInfo.userId,
                            avatar: response.message
                        };
                        editUser(param).then(res => {
                            if (res.success) {
                                this.$message.success('头像修改成功！');
                            } else {
                                this.$message.warning(res.message);
                            }
                        });
                    } else {
                        this.$message.warning(response.message);
                    }
                }
            },
            updatePassword(){
                let username = this.userInfo.userName;
                this.$refs.userPassword.show(username);
            },
            getAvatarView() {
                return this.url.imgerver + "/" + this.userInfo.avatar;
            },
        }
    }
</script>

<style scoped>

</style>