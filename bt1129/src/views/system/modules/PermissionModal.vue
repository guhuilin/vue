<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            :maskClosable="disableSubmit ? true : false"
            :centered="true"
            @ok="handleOk"
            @cancel="handleCancel"
            wrapClassName="ant-modal-cust-warp">
        <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff'}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form">

                    <a-form-item label="菜单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-radio-group @change="onChangeMenuType" v-decorator="['menuType',{'initialValue':0}]">
                            <a-radio :value="0">一级菜单</a-radio>
                            <a-radio :value="1">子菜单</a-radio>
                        </a-radio-group>
                    </a-form-item>

                    <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            :label="menuLabel"
                            hasFeedback>
                        <a-input placeholder="请输入菜单名称" v-decorator="[ 'name', validatorRules.name]"
                                 :readOnly="disableSubmit"/>
                    </a-form-item>


                    <a-form-item
                            v-show="localMenuType!=0"
                            label="上级菜单"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                        <a-tree-select
                                style="width:100%"
                                :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                                :treeData="treeData"
                                v-model="model.parentId"
                                placeholder="请选择父级菜单"
                                :disabled="disableSubmit">
                        </a-tree-select>
                    </a-form-item>

                    <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="菜单路径">
                        <a-input placeholder="请输入菜单路径" v-decorator="[ 'url',{}]" :readOnly="disableSubmit"/>
                    </a-form-item>

                    <a-form-item
                            v-show="show"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="前端组件">
                        <a-input placeholder="请输入前端组件" v-decorator="[ 'component', {}]" :readOnly="disableSubmit"/>
                    </a-form-item>

                    <a-form-item
                            v-show="localMenuType==0"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="默认跳转地址">
                        <a-input placeholder="请输入路由参数 redirect" v-decorator="[ 'redirect',{}]"
                                 :readOnly="disableSubmit"/>
                    </a-form-item>

                    <a-form-item
                            v-show="show"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="菜单图标">
                        <a-input placeholder="点击右侧按钮选择图标" v-model="model.icon" :readOnly="disableSubmit">
                            <a-icon slot="addonAfter" type="setting" @click="selectIcons" v-if="!disableSubmit"/>
                        </a-input>
                    </a-form-item>

                    <a-form-item
                            v-show="show"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="排序">
                        <a-input-number placeholder="请输入菜单排序" style="width: 200px"
                                        v-decorator="[ 'sortNo', {'initialValue':1.0,'rule':validatorRules.sortNo}]"
                                        :disabled="disableSubmit"/>
                    </a-form-item>

                    <a-form-item
                            v-show="show"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="是否路由菜单">
                        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="routeSwitch"
                                  :disabled="disableSubmit"/>
                    </a-form-item>

                    <a-form-item
                            v-show="show"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="隐藏路由">
                        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="menuHidden"
                                  :disabled="disableSubmit"/>
                    </a-form-item>

                    <a-form-item
                            v-show="show"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="聚合路由">
                        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="alwaysShow"
                                  :disabled="disableSubmit"/>
                    </a-form-item>


                </a-form>

                <!-- 选择图标 -->
                <icons @choose="handleIconChoose" @close="handleIconCancel"
                       :iconChooseVisible="iconChooseVisible"></icons>
            </a-spin>
        </div>
    </a-modal>
</template>

<script>
    import { addPermission, editPermission, queryTreeList } from '@/api/api'
    import Icons from './icon/Icons'
    import pick from 'lodash.pick'

    export default {
        name: 'PermissionModal',
        components: {Icons},
        data() {
            return {
                drawerWidth: 700,
                treeData: [],
                treeValue: '0-0-4',
                title: "操作",
                visible: false,
                disableSubmit: false,
                model: {},
                localMenuType: '1',
                alwaysShow: false,//表单元素-聚合路由
                menuHidden: false,//表单元素-隐藏路由
                routeSwitch: true, //是否路由菜单
                show: true,//根据菜单类型，动态显示隐藏表单元素
                menuLabel: '菜单名称',
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },

                confirmLoading: false,
                form: this.$form.createForm(this),
                validatorRules: {
                    name: {rules: [{required: true, message: '请输入菜单标题!'}]},
                    sortNo: {rules: [{validator: this.validateNumber}]},
                },
                iconChooseVisible: false,
            }
        },
        methods: {
            loadTree() {
                queryTreeList().then((res) => {
                    if (res.success) {
                        this.treeData = [];
                        let treeList = res.result.treeList;
                        for (let a = 0; a < treeList.length; a++) {
                            let temp = treeList[a];
                            temp.isLeaf = temp.leaf;
                            this.treeData.push(temp);
                        }
                    }
                });
            },
            add() {
                this.edit({});
            },
            edit(record) {
                this.form.resetFields();
                this.model = Object.assign({}, record);
                //根据菜单类型，动态展示页面字段
                if (record.menuId) {
                    this.alwaysShow = record.alwaysShow === 0 ? false : true;
                    this.menuHidden = record.hidden === 0 ? false : true;
                    this.routeSwitch = record.isRoute === 0 ? false : true;
                    this.show = record.menuType == 2 ? false : true;
                    this.menuLabel = '菜单名称';

                    if (this.model.parentId) {
                        this.localMenuType = 1;
                    } else {
                        this.localMenuType = 0;
                    }
                } else {
                    if (this.model.parentId) {
                        this.localMenuType = 1;
                    } else {
                        this.localMenuType = 0;
                    }
                    this.show = true;
                    this.menuLabel = '菜单名称';
                    this.routeSwitch = true;
                }

                this.visible = true;
                this.loadTree();
                let fieldsVal = pick(this.model, 'name', 'perms', 'component', 'url', 'sortNo', 'menuType', 'status');
                this.$nextTick(() => {
                    this.form.setFieldsValue(fieldsVal)
                });
            },
            close() {
                this.$emit('close');
                this.disableSubmit = false;
                this.visible = false;
            },
            handleOk() {
                const that = this;
                // 触发表单验证
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        this.model.alwaysShow = this.alwaysShow ? 1 : 0;
                        this.model.hidden = this.menuHidden ? 1 : 0;
                        this.model.isRoute = this.routeSwitch ? 1 : 0;
                        let formData = Object.assign(this.model, values);

                        let obj;
                        delete formData.children;
                        if (!this.model.menuId) {
                            obj = addPermission(formData);
                        } else {
                            obj = editPermission(formData);
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
                            that.close();
                        })
                    }
                })
            },
            handleCancel() {
                this.close()
            },
            validateNumber(rule, value, callback) {
                if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
                    callback();
                } else {
                    callback("请输入正整数!");
                }
            },
            onChangeMenuType(e) {
                this.localMenuType = e.target.value
                if (e.target.value == 2) {
                    this.show = false;
                    this.menuLabel = '按钮/权限名称';
                } else {
                    this.show = true;
                    this.menuLabel = '菜单名称';
                }
            },
            selectIcons() {
                this.iconChooseVisible = true
            },
            handleIconCancel() {
                this.iconChooseVisible = false
            },
            handleIconChoose(value) {
                this.model.icon = value
                this.form.icon = value
                this.iconChooseVisible = false
            }
        }
    }
</script>