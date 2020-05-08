<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="disableSubmit ? true : false"
            :centered="true"
            @ok="handleSubmit"
            @cancel="handleCancel"
            wrapClassName="ant-modal-cust-warp">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">

                <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入用户账号" v-decorator="[ 'userName', validatorRules.userName]"
                             :readOnly="!!model.userId"/>
                </a-form-item>

                <template v-if="!model.userId">
                    <a-form-item label="登陆密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input :type="inputType" placeholder="请输入登陆密码"
                                 v-decorator="[ 'password', validatorRules.password]">
                            <a-icon slot="suffix" :type="inputType === 'password' ? 'eye' : 'eye-invisible'" @click="showPassword('password')" />
                        </a-input>
                    </a-form-item>

                    <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input :type="inputTypeConfirm" @blur="handleConfirmBlur" placeholder="请重新输入登陆密码"
                                 v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]">
                            <a-icon slot="suffix" :type="inputTypeConfirm === 'password' ? 'eye' : 'eye-invisible'" @click="showPassword('confirm')" />
                        </a-input>
                    </a-form-item>
                </template>

                <a-form-item label="用户名字" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入用户名称" :readOnly="disableSubmit"
                             v-decorator="[ 'fullName', validatorRules.fullName]"/>
                </a-form-item>
                <template>
                    <a-form-item label="角色分配" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select
                                mode="multiple"
                                style="width: 100%"
                                placeholder="请选择用户角色"
                                v-decorator="[ 'selectedroles', validatorRules.selectedroles]"
                                :disabled="disableSubmit">
                            <a-select-option v-for="(role,roleindex) in roleList" :key="roleindex.toString()"
                                             :value="role.roleId">
                                {{ role.roleName }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </template>
                <!--部门分配-->
                <a-form-item label="部门分配" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input-search
                            placeholder="点击右侧按钮选择部门"
                            v-model="checkedDepartNameString"
                            disabled
                            @search="onSearch">
                        <a-button slot="enterButton" icon="search">选择</a-button>
                    </a-input-search>
                </a-form-item>
                <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row>
                        <a-col span="12">
                            <a-upload
                                    listType="picture-card"
                                    class="avatar-uploader"
                                    :showUploadList="false"
                                    :action="uploadAction"
                                    :data="{'isup':1}"
                                    :headers="headers"
                                    :beforeUpload="beforeUpload"
                                    @change="handleChange"
                                    :disabled="disableSubmit"
                            >
                                <img v-if="picUrl" :src="getAvatarView()" alt="头像" style="height:150px;width:150px"/>
                                <div v-if="picUrl" class="imgBtnDiv">
                                    <a-icon type="eye" style="position: relative;right: 10px;" @click="imgView($event)"></a-icon>
                                    <a-icon type="delete" style="position: relative;left: 10px;" @click="delImg($event)"></a-icon>
                                </div>
                                <div v-if="!picUrl">
                                    <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
                                    <div class="ant-upload-text">上传</div>
                                </div>
                                <a-modal :visible="previewVisible" :footer="null" @cancel="cancelImg">
                                    <img alt="example" style="width: 100%" :src="getAvatarView()" />
                                </a-modal>
                            </a-upload>
                        </a-col>
                        <a-col span="12">
                            (建议图片大小：150 * 150)
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-date-picker
                            style="width: 100%"
                            placeholder="请选择生日"
                            :disabled="disableSubmit"
                            v-decorator="['birthday', {initialValue:!model.birthday ? null : moment(model.birthday, dateFormat)}]"/>
                </a-form-item>

                <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select v-decorator="[ 'sex', {}]" placeholder="请选择性别" :disabled="disableSubmit">
                        <a-select-option :value="1">男</a-select-option>
                        <a-select-option :value="2">女</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入邮箱" :readOnly="disableSubmit"
                             v-decorator="[ 'email', validatorRules.email]"/>
                </a-form-item>

                <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入手机号码" :readOnly="disableSubmit"
                             v-decorator="[ 'mobile', validatorRules.mobile]"/>
                </a-form-item>

            </a-form>
        </a-spin>

        <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import moment from 'moment'
    import Vue from 'vue'
    import departWindow from './DepartWindow'
    import { getAction, httpAction } from '@/api/manage'
    import { ACCESS_TOKEN } from "@/store/mutation-types"
    import { addUser, editUser, queryall, checkUsername } from '@/api/api'

    export default {
        name: 'UserModal',
        components: {
            departWindow,
        },
        data() {
            return {
                confirmDirty: false,
                userId: "", //保存用户id
                disableSubmit: false,
                dateFormat: "YYYY-MM-DD",
                selectedDepartKeys: [],
                checkedDepartKeys: [],
                checkedDepartNames: [],
                checkedDepartNameString: "",
                userDepartModel: {userId: '', departIdList: []},
                validatorRules: {
                    userName: {
                        rules: [{
                            required: true, message: '请输入用户账号!'
                        }, {
                            validator: this.validateUsername,
                        }]
                    },
                    password: {
                        rules: [{
                            required: true, message: '请输入密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    },
                    confirmpassword: {
                        rules: [{
                            required: true, message: '请重新输入登陆密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    },
                    fullName: {rules: [{required: true, message: '请输入用户名称!'}]},
                    mobile: {rules: [{validator: this.validatePhone}]},
                    email: {rules: [{type: 'email', message: '请输入正确格式的电子邮箱!',}]},
                    selectedroles: {rules: [{required: true, message: '请选择用户角色!'}], validateTrigger: 'change'}
                },
                title: '操作',
                visible: false,
                model: {},
                roleList: [],
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                uploadLoading: false,
                confirmLoading: false,
                headers: {},
                form: this.$form.createForm(this),
                picUrl: '',
                url: {
                    fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
                    imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
                    userWithDepart: '/nmmonitor-server/user/userDepartList',
                    addUDepartIds: '/nmmonitor-server/user/addUDepartIds',
                    editUDepartIds: '/nmmonitor-server/user/editUDepartIds',
                },
                inputType: 'password',
                inputTypeConfirm: 'password',
                previewVisible: false
            }
        },
        created() {
            const token = Vue.ls.get(ACCESS_TOKEN);
            this.headers = {"X-Access-Token": token};
        },
        computed: {
            uploadAction: function () {
                return this.url.fileUpload;
            }
        },
        methods: {
            moment,
            initialRoleList() {
                queryall().then((res) => {
                    if (res.success) {
                        this.roleList = res.result;
                    } else {
                        console.log(res.message);
                    }
                });
            },
            refresh() {
                this.userId = "";
                this.checkedDepartNameString = "";
                this.selectedDepartKeys = [];
                this.checkedDepartKeys = [];
                this.checkedDepartNames = [];
            },
            add() {
                this.picUrl = "";
                this.refresh();
                this.edit({});
            },
            edit(record) {
                this.model = Object.assign({}, record);
                this.checkedDepartNameString = "";
                if (record.hasOwnProperty("userId") && record.avatar) {
                    this.picUrl = "Has no pic url yet";
                }
                this.initialRoleList();
                this.form.resetFields();
                this.userId = record.userId;
                this.visible = true;
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'userName', 'sex', 'fullName', 'email', 'mobile', 'selectedroles'))
                });
                // 调用查询用户对应的部门信息的方法
                this.checkedDepartKeys = [];
                this.loadCheckedDeparts();
            },
            loadCheckedDeparts() {
                let that = this;
                if (!that.userId) {
                    return
                }
                getAction(that.url.userWithDepart, {userId: that.userId}).then((res) => {
                    that.checkedDepartNames = [];
                    if (res.success) {
                        for (let i = 0; i < res.result.length; i++) {
                            that.checkedDepartNames.push(res.result[i].title);
                            this.checkedDepartNameString = this.checkedDepartNames.join(",");
                            that.checkedDepartKeys.push(res.result[i].key);
                        }
                    } else {
                        console.log(res.message);
                    }
                })
            },
            close() {
                this.$emit('close');
                this.visible = false;
                this.disableSubmit = false;
                this.checkedDepartNames = [];
                this.userDepartModel = {};
            },
            handleSubmit() {
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        let avatar = that.model.avatar;
                        if (!values.birthday) {
                            values.birthday = '';
                        } else {
                            values.birthday = values.birthday.format(this.dateFormat);
                        }
                        let formData = Object.assign(this.model, values);
                        formData.avatar = avatar;
                        formData.selectedroles = formData.selectedroles.length > 0 ? formData.selectedroles.join(",") : '';

                        that.addDepartsToUser(that, formData); // 调用根据当前用户添加部门信息的方法

                        let obj;
                        if (!this.model.userId) {
                            formData.userId = this.userId;
                            obj = addUser(formData);
                        } else {
                            obj = editUser(formData);
                        }
                        obj.then((res) => {
                            if (res.success) {
                                that.$message.success(res.message);
                                that.$emit('ok');
                            } else {
                                that.$message.warning(res.message);
                            }
                        }).finally(() => {
                            that.confirmLoading = false;
                            that.checkedDepartNames = [];
                            that.close();
                        })

                    }
                })
            },
            handleCancel() {
                this.close()
            },
            // 根据当前用户添加部门信息的方法
            addDepartsToUser(that, formData) {
                let httpurl = '';
                let method = '';
                if (this.userDepartModel.userId != formData.id) {
                    httpurl += this.url.addUDepartIds;
                    method = 'post';
                } else {
                    httpurl += this.url.editUDepartIds;
                    method = 'put';
                }
                httpAction(httpurl, this.userDepartModel, method).then((res) => {
                    if (res.success) {
                        this.userDepartModel = {};
                    } else {
                        that.$message.warning(res.message);
                    }
                })
            },
            validateToNextPassword(rule, value, callback) {
                const form = this.form;
                const confirmpassword = form.getFieldValue('confirmpassword');
                if (value && confirmpassword && value !== confirmpassword) {
                    callback('两次输入的密码不一样！');
                }
                if (value && this.confirmDirty) {
                    form.validateFields(['confirm'], {force: true})
                }
                callback();
            },
            compareToFirstPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue('password')) {
                    callback('两次输入的密码不一样！');
                } else {
                    callback()
                }
            },
            validatePhone(rule, value, callback) {
                if (!value || new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/).test(value)) {
                    callback();
                } else {
                    callback("请输入正确格式的手机号码!");
                }
            },
            validateUsername(rule, value, callback) {
                var params = {
                    userId: this.model.userId,
                    userName: value
                };
                checkUsername(params).then((res) => {
                    if (res.success) {
                        callback();
                    } else {
                        callback("用户账号已存在！");
                    }
                });
            },
            handleConfirmBlur(e) {
                const value = e.target.value
                this.confirmDirty = this.confirmDirty || !!value
            },
            beforeUpload(file) {
                let fileType = file.type;
                if (fileType.indexOf('image') < 0) {
                    this.$message.warning('请上传图片');
                    return false;
                }
                if (file.size > 500000) {
                    this.$message.warning('上传图片不能超过500K！');
                    return false;
                }
            },
            handleChange(info) {
                this.picUrl = "";
                if (info.file.status === 'uploading') {
                    this.uploadLoading = true
                    return
                }
                if (info.file.status === 'done') {
                    let response = info.file.response;
                    this.uploadLoading = false;
                    if (response.success) {
                        this.model.avatar = response.message;
                        this.picUrl = "Has no pic url yet";
                    } else {
                        this.$message.warning(response.message);
                    }
                }
            },
            imgView(event) {
                event.stopPropagation();
                this.previewVisible = true;
            },
            delImg(event) {
                event.stopPropagation();
                this.model.avatar = '';
                this.picUrl = '';
            },
            cancelImg() {
                this.previewVisible = false;
            },
            getAvatarView() {
                return this.url.imgerver + "/" + this.model.avatar;
            },
            // 搜索用户对应的部门API
            onSearch() {
                this.$refs.departWindow.add(this.checkedDepartKeys, this.userId);
            },
            // 获取用户对应部门弹出框提交给返回的数据
            modalFormOk(formData) {
                this.checkedDepartNames = [];
                this.selectedDepartKeys = [];
                this.userId = formData.userId;
                this.userDepartModel.userId = formData.userId;
                for (let i = 0; i < formData.departIdList.length; i++) {
                    this.selectedDepartKeys.push(formData.departIdList[i].key);
                    this.checkedDepartNames.push(formData.departIdList[i].title);
                    this.checkedDepartNameString = this.checkedDepartNames.join(",");
                }
                this.userDepartModel.departIdList = this.selectedDepartKeys;
            },
            showPassword(str) {
                if (str === 'password') {
                    if (this.inputType === 'password') {
                        this.inputType = 'text';
                    } else {
                        this.inputType = 'password';
                    }
                } else {
                    if (this.inputTypeConfirm === 'password') {
                        this.inputTypeConfirm = 'text';
                    } else {
                        this.inputTypeConfirm = 'password';
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader > .ant-upload {
        width: 104px;
        height: 104px;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }

    .ant-table-tbody .ant-table-row td {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .drawer-bootom-button {
        position: absolute;
        bottom: -8px;
        width: 100%;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        left: 0;
        background: #fff;
        border-radius: 0 0 2px 2px;
    }

    .imgBtnDiv {
        height: 50px;
        width: 150px;
        position: absolute;
        bottom: 0;
        font-size: 25px;
        background-color: #ffffffaa;
        z-index: 1000;
    }
</style>