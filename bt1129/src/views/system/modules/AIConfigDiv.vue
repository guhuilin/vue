<template>
  <div class="box">
    <a-spin :spinning="spinning">
      <a-row class="planTitle">{{editData.title}}</a-row>

      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
          <a-input
            placeholder="请输入名称"
            v-decorator="['configName', validatorRules.configName]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="启用">
          <a-radio-group
            v-decorator="['configEnable', { initialValue: 0 }]"
          >
            <a-radio :value="0">未启用</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="AI引擎"
        >
          <a-radio-group
            :disabled="disabled"
            v-decorator="['configType', { initialValue: 0 }]"
            @change="radioClick"
          >
            <a-radio
              v-for="item in judgeLevel"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</a-radio
            >
          </a-radio-group>
        </a-form-item>

        <div style="width:100%;background:#eee" v-show="radioVal === 0">
          <a-form :form="form">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="权限"
            >
              <a-input
                placeholder="阿里云配置1"
                v-decorator="['aliAI_accessKeyId']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="秘钥"
            >
              <a-input
                placeholder="阿里云配置2"
                v-decorator="['aliAI_secret']"
              />
            </a-form-item>
          </a-form>
        </div>

        <div style="width:100%;background:#eee" v-show="radioVal === 1">
          <a-form :form="form">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="AppID"
            >
              <a-input
                placeholder="百度配置1"
                v-decorator="['baiduAI_IMG_AppID']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="APIKey"
            >
              <a-input
                placeholder="百度配置2"
                v-decorator="['baiduAI_IMG_APIKey']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="秘钥"
            >
              <a-input
                placeholder="百度配置3"
                v-decorator="['baiduAI_IMG_SecretKey']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="AppID"
            >
              <a-input
                placeholder="百度配置4"
                v-decorator="['baiduAI_BUCKET_APIKey']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="SecretKey"
            >
              <a-input
                placeholder="百度配置5"
                v-decorator="['baiduAI_BUCKET_SecretKey']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="BucketName"
            >
              <a-input
                placeholder="百度配置6"
                v-decorator="['baiduAI_BUCKET_BucketName']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="BJ终端"
            >
              <a-input
                placeholder="百度配置7"
                v-decorator="['baiduAI_BUCKET_BJEndpoint']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="VCR_APIKey"
            >
              <a-input
                placeholder="百度配置8"
                v-decorator="['baiduAI_VCR_APIKey']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="VCR_SecretKey"
            >
              <a-input
                placeholder="百度配置9"
                v-decorator="['baiduAI_VCR_SecretKey']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="VCR_Endpoint"
            >
              <a-input
                placeholder="百度配置10"
                v-decorator="['baiduAI_VCR_Endpoint']"
              />
            </a-form-item>
          </a-form>
        </div>

        <div style="width:100%;background:#eee" v-show="radioVal === 2">
          <a-form :form="form">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="腾讯AppId"
            >
              <a-input
                placeholder="腾讯配置1"
                v-decorator="['tencentAI_AppId']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="腾讯secretId"
            >
              <a-input
                placeholder="腾讯配置2"
                v-decorator="['tencentAI_secretId']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="腾讯secretKey"
            >
              <a-input
                placeholder="腾讯配置3"
                v-decorator="['tencentAI_secretKey']"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="腾讯region"
            >
              <a-input
                placeholder="腾讯配置4"
                v-decorator="['tencentAI_region']"
              />
            </a-form-item>
          </a-form>
        </div>

        <!-- type="editable-card" 添加多项 -->
        <a-tabs v-model="activeKey" @edit="onEdit">  
          <a-tab-pane
            v-for="pane in panes"
            :tab="pane.title"
            :key="pane.key"
            :closable="pane.closable"
          >
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="选择任务"
            >
              <a-select placeholder="请选择" v-decorator="[pane.task]">
                <a-select-option
                  v-for="item in taskList"
                  :key="item.ID"
                  :value="item.ID"
                  >{{ item.TYPENAME }}</a-select-option
                >
              </a-select>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="文本识别"
            >
              <a-textarea
                :rows="4"
                placeholder="..."
                v-decorator="[pane.text]"
              />
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="图像识别"
            >
              <a-checkbox-group v-decorator="[pane.image]">
                <a-checkbox
                  v-for="per in patternRecognition"
                  :value="per.value"
                  :key="per.value"
                  >{{ per.label }}</a-checkbox
                >
              </a-checkbox-group>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="视频识别"
            >
              <a-checkbox-group v-decorator="[pane.video]">
                <a-checkbox
                  v-for="per in videoRecognition"
                  :value="per.value"
                  :key="per.value"
                  >{{ per.label }}</a-checkbox
                >
              </a-checkbox-group>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>

      <div style="text-align: center;margin-top: 1%;">
        <a-button type="primary" @click="back">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="saveClick"
          style="margin-left: 2%;"
          >保存</a-button
        >
      </div>
    </a-spin>
  </div>
</template>

<script>
import selectModal from '@/components/selectModal/selectModal'
import reportView from '@/components/report/reportView'
import pick from 'lodash.pick'
import { delKeys } from '@/utils/util'
import {
  getAITaskInfoList,
  addAIConfigInfo,
  updateAIConfigInfo
} from '@api/api'
const judgeLevel = [
  { value: 0, label: '阿里云' },
  { value: 1, label: '百度云' },
  { value: 2, label: '腾讯云' }
]
const patternRecognition = [
  { value: 0, label: '涉政' },
  { value: 1, label: '涉黑' },
  { value: 2, label: '暴恐' },
  { value: 3, label: '色情' }
]
const videoRecognition = [
  { value: 0, label: '涉政' },
  { value: 1, label: '涉黑' },
  { value: 2, label: '暴恐' },
  { value: 3, label: '色情' }
]
const panes = [
  {
    title: '任务1',
    key: '1',
    task: 'task1',
    text: 'text1',
    video: 'video1',
    image: 'image1',
    closable: false
  }
]

export default {
  name: 'AIConfigDiv',
  props: {
    editData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    selectModal,
    reportView
  },
  data() {
    return {
      judgeLevel,
      patternRecognition,
      videoRecognition,
      taskList: [],
      spinning: false,
      loading: false,
      disabled: false,
      visible: false,
      radioVal: 0,
      editId: 0,
      activeKey: panes[0].key,
      panes,
      newTabIndex: 0,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      form: this.$form.createForm(this),
      validatorRules: {
        configName: {
          rules: [{ required: true, message: '请输入任务名称!' }]
        }
      }
    }
  },
  mounted() {
    this.getAITaskInfoList()
    if(this.editData.params.id) {
      this.setValidate(this.editData.params)
    }
  },
  methods: {
    getAITaskInfoList() {
      this.spinning = true
      getAITaskInfoList().then(res => {
        if (res.success) this.taskList = res.result
        this.spinning = false
      })
    },
    setValidate(record) {
      this.disabled = true;
      let obj = Object.assign({}, record,JSON.parse(record.configParams),JSON.parse(record.configTaskParams))
      this.radioVal = obj.configType
      this.editId = obj.id
      let configTaskParams = obj.list
      delKeys(obj,'configParams','configTaskParams','list','id')
      this.form.setFieldsValue(obj)
      this.form.setFieldsValue(configTaskParams[0])   //  配置多任务的参数
    },
    back(flag) {
      this.$emit('back', flag)
    },
    radioClick(e) {
      this.radioVal = e.target.value
    },
    selectTask() {},
    callback(key) {
      console.log(key)
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    add() {
      const panes = this.panes
      const len = panes.length + 1
      const activeKey = `newTab${this.newTabIndex++}`
      panes.push({
        title: '任务' + len,
        key: len + '',
        task: 'task' + len,
        text: 'text' + len,
        video: 'video' + len,
        image: 'image' + len
      })
      this.panes = panes
      this.activeKey = activeKey
    },
    remove(targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter(pane => pane.key !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key
        } else {
          activeKey = panes[0].key
        }
      }
      this.panes = panes
      this.activeKey = activeKey
    },
    saveClick() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let obj = {list:[]}
          let obj1 = {}
          let paramsObj = {
            configParams: {},
            configTaskParams: '',
            configEnable: values.configEnable,
            configName: values.configName,
            configType: values.configType,
            isEnable: 1      //  保证只启用一个引擎
          }
          for(let i in values) {
            if(i.indexOf('aliAI')==0 && this.radioVal === 0) {
              paramsObj.configParams[i] = values[i]
            }
            if(i.indexOf('baiduAI')==0 && this.radioVal === 1) {
              paramsObj.configParams[i] = values[i]
            } 
            if (i.indexOf('tencentAI')==0 && this.radioVal === 2) {
              paramsObj.configParams[i] = values[i]
            }
            if(i.indexOf('task1')==0 || i.indexOf('video1')==0 || i.indexOf('image1')==0 || i.indexOf('text1')==0) {
              obj1[i] = values[i]
            }
          }
          obj.list.push(obj1)
          paramsObj.configTaskParams = JSON.stringify(obj)
          paramsObj.configParams = JSON.stringify(paramsObj.configParams)
          if(this.editData.params.id) {
            paramsObj.id = this.editId
            updateAIConfigInfo(paramsObj).then(res => {
              if(res.success) {
                this.$message.success('修改成功！')
                this.back();
              }
            })
          } else {
            addAIConfigInfo(paramsObj).then(res => {
              if(res.success) {
                this.$message.success('添加成功！')
                this.back();
              }
            })
          }
        }
      })
    },
    back() {
      this.form.resetFields()
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.planTitle {
  height: 50px;
  line-height: 50px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}
.ant-form > .ant-form-item,
.ant-tabs-tabpane > .ant-form-item {
  margin-bottom: 0;
}
</style>
