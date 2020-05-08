<template>
  <div v-if="show">
    <a-modal :title="title" v-model="show" @ok="handleSubmit">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          v-for="(item, ind) in listData"
          :key="ind"
          :label="item.fieldName"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <!-- 普通文本 -->
          <a-input
            v-if="item.fieldValue.type === 'input'"
            placeholder="请输入内容..."
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue}]"
          />
          <!-- 文本域 -->
          <a-textarea
            v-if="item.fieldValue.type === 'textarea'"
            placeholder="请输入内容..."
            :autosize="{ minRows: 1, maxRows: 5 }"
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue}]"
          />
          <!-- 日期时间 -->
          <a-date-picker
            v-if="item.fieldValue.type === 'dateTime'"
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue ? isAllDate(item.initialValue) : null }]"
            show-time
            style="width: 100%"
            format="YYYY-MM-DD HH:mm:ss"
          />
          <!-- 日期选择 -->
          <a-date-picker
            v-if="item.fieldValue.type === 'date'"
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue ? isAllDate(item.initialValue) : null }]"
            style="width: 100%"
          />
          <!-- 时间选择 -->
          <a-time-picker
            v-if="item.fieldValue.type === 'time'"
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue ? isAllDate(item.initialValue) : null }]"
            style="width: 100%"
          />
          <!-- 下拉选框 -->
          <a-select
            placeholder="请选择"
            v-if="item.fieldValue.type === 'select'"
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue}]"
           >
            <a-select-option
              v-for="(item, index) in item.fieldValue.data"
              :key="index"
              :value="item.key"
            >{{item.value}}</a-select-option>
          </a-select>
          <!-- 特殊格式时间  v-model="conversionValue"-->
          <a-select 
            v-if="item.fieldValue.type === 'newTime'" 
            placeholder="请选择"  
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue}]"
            style="width: 150px"
            @dropdownVisibleChange="isShow = true" 
            :open="isShow" 
            :notFoundContent="null">
						<div slot="dropdownRender" slot-scope="menu" style="width:100%;">
							<v-nodes :vnodes="menu" />
							<div style="width:100%;display:flex">
								<a-input-number id="inputNumber" style="flex:1" :min="0" :defaultValue="0" :max="23" :formatter="v => `${v = v > 9 ? v : '0'+v}`" @change="val => timeValue = val" />
								<a-input-number id="inputNumber" style="flex:1" :min="0" :defaultValue="0" :max="59" :formatter="v => `${v = v > 9 ? v : '0'+v}`" @change="val => minuteValue = val" />
								<a-input-number id="inputNumber" style="flex:1" :min="0" :defaultValue="0" :max="59" :formatter="v => `${v = v > 9 ? v : '0'+v}`" @change="val => secondValue = val" />
							</div>
							<div style="width:100%;display:flex;justify-content:space-between">
								<a-button @click="submit(item.fieldValue.componentId)">确定</a-button>
								<a-button @click="isShow = false">取消</a-button>
							</div>
						</div>
					</a-select>
          <!-- 单选框 -->
          <a-radio-group
            v-if="item.fieldValue.type === 'radio'"
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue}]"
            style="width:340px"
            >
            <a-radio
              v-for="(item, index) in item.fieldValue.data"
              :key="index"
              :value="item.key"
            >{{item.value}}</a-radio>
          </a-radio-group>
          <!-- 复选框 -->
          <a-checkbox-group
            v-if="item.fieldValue.type === 'checkbox'"
            v-decorator="[item.fieldValue.componentId,{initialValue:item.initialValue}]"
            >
            <a-row>
              <a-col :span="10" style="width: 100%;">
                <a-checkbox
                  v-for="(item, index) in item.fieldValue.data"
                  :key="index"
                  :value="item.key"
                >{{item.value}}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <!-- 上传 -->
          <div v-if="item.fieldValue.type === 'file' && item.fileName === 'file0'" style="display:flex">
            <a-upload
              :fileList="fileListVideo"
              :remove="handleRemove"
              :beforeUpload="beforeUpload"
            >
              <a-button style="display:inline-block;z-index:10">
                <a-icon type="upload" /> 选择上传
              </a-button>
            </a-upload>
            <span style="margin:0 4px">
              <a-button
                type="primary"
                @click="handleUpload"
                :disabled="fileListVideo.length === 0"
                :loading="uploading"
              >
                {{'上传' ? '上传' : '开始上传' }}
              </a-button>
            </span>
          </div>
          <!-- 防止多个file类型文件 -->
          <div v-if="item.fieldValue.type === 'file' && item.fileName === 'file1'" style="display:flex">
            <a-upload
              :fileList="fileListVideo1"
              :remove="handleRemove1"
              :beforeUpload="beforeUpload1"
            >
              <a-button style="display:inline-block;z-index:10">
                <a-icon type="upload" /> 选择上传
              </a-button>
            </a-upload>
            <span style="margin:0 4px">
              <a-button
                type="primary"
                @click="handleUpload1"
                :disabled="fileListVideo1.length === 0"
                :loading="uploading1"
              >
                {{'上传' ? '上传' : '开始上传' }}
              </a-button>
            </span>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { addZero } from '@/utils/util'
import { isAllDate, dateToString } from '@/utils/validate'
import {
  getFieldComponentList,
  getFieldComponentById,
  getFieldComponentByIds
} from "@api/api";
import { uploadFile } from '@api/manage'
import moment from 'moment'

export default {
  data() {
    return {
      notfound: '&nbsp;',
      fileListVideo: [],
      uploading: false,
      fileListVideo1: [],
      uploading1: false,
      show: false,
      listData: [],
      isShow : false,
      timeValue : '',
      minuteValue : '',
      secondValue : '',
      conversionValue : undefined,
      form: this.$form.createForm(this)
    };
  },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  props: {
    matchId: {
      required: true,
      default: ""
    },
    title: {
      type: String,
      default: "请选择"
    },
    list: {
      type: Object,
      default: () => {}
    }
  },
  // watch: {
  //   matchId(newVal) {  
  //     if (typeof newVal === "number" || (typeof newVal === "string" && newVal.length > 0)) {  
  //       this.getData({ ids: newVal });
  //     } else if (Array.isArray(newVal) && newVal.length > 0) { 
  //       let str = newVal.join(",");
  //       this.getData({ ids: str });
  //     } else {  
  //       this.getData();
  //     }
  //   },
  // },
  methods: {
    isAllDate(s) { 
      let reg1 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
      let reg2 = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      let reg3 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      if (new RegExp(reg1).test(s)) {
        return moment(s, 'YYYY-MM-DD')
      } else if (new RegExp(reg2).test(s)) {
        return moment(s, 'HH:mm:ss')
      } else if (new RegExp(reg3).test(s)) {
        return moment(s,'YYYY-MM-DD HH:mm:ss')
      } else {
        return s
      }
    },
    init() {
      this.show = true;
      this.$nextTick(() => {
        if (typeof this.matchId === "number" || (typeof this.matchId === "string" && this.matchId.length > 0)) {  
          this.getData({ ids: this.matchId });
        } else if (Array.isArray(this.matchId) && this.matchId.length > 0) { 
          let str = this.matchId.join(",");
          this.getData({ ids: str });
        } else {  
          this.getData();
        }
      })
    },
    // 删除的方法
    handleRemove(file) {
      const index = this.fileListVideo.indexOf(file);
      const newFileList = this.fileListVideo.slice();
      newFileList.splice(index, 1);
      this.fileListVideo = newFileList
    },
    // 上传之前的方法
    beforeUpload(file) {
      this.fileListVideo = [file];
      return false;
    },
    handleUpload() {
      this.uploading = true;
      const { fileListVideo } = this;
      if(fileListVideo) {
        const formData = new FormData();
        fileListVideo.map((file) => {
          formData.append('file', file);
        });
        uploadFile('/nmmonitor-server-module-database/fastDFSUpload', formData).then(res => {
          this.uploading = false;
          console.log(res,'上传视频');
          this.$message.success(res.message, 10);
        }).catch(res=>{
          console.log(res,'上传视频');
        })
      }
    },
		handleSubmit() {
      this.show = true;
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {  
      let obj = Object.values(values).map(item => { 
        if (item) return dateToString(item)
      }); 
        this.$emit("inputVal", obj);
      });
      this.show = false;
    },
    getData(val) { 
      if (!val) { 
        getFieldComponentList().then(res => {
          // res.result && res.result.map(item => {
          //     if (item.fieldValue) item.fieldValue = JSON.parse(item.fieldValue);
          //     if(typeof(item.initialValue)=='string' && item.fieldValue.type == 'date' && item.initialValue !== '') {
          //       item.initialValue = moment(item.initialValue,'YYYY-MM-DD')
          //     } else if(typeof(item.initialValue)=='string' && item.fieldValue.type == 'dateTime' && item.initialValue !== '') {
          //       item.initialValue = moment(item.initialValue,'YYYY-MM-DD HH:mm:ss')
          //     } else if(typeof(item.initialValue)=='string' && item.fieldValue.type == 'time' && item.initialValue !== '') {
          //       item.initialValue = moment(item.initialValue,'HH:mm:ss')
          //     }
          //   });
          this.listData = res.result;
        });
      } else { 
        getFieldComponentByIds(val).then(res => {
          if (res.result[0]) {
            res.result &&
              res.result.map((item,ind) => {
                if (item.fieldValue) item.fieldValue = JSON.parse(item.fieldValue);
                if(typeof(this.list) !== 'undefined') {
                  Object.entries(this.list).map(val => {
                    item.initialValue = Object.entries(this.list)[ind][1]
                  })
                } else {
                  item.initialValue = ''
                }
                if(item.fieldValue.type === 'file') {
                  item.fileName = 'file' + ind
                }
              });
            this.listData = res.result;
          } else {
            this.$message.info("查询ID不存在!");
          }
        });
      }
    },
    submit(label){
      this.conversionValue = addZero(this.timeValue) + '°' + addZero(this.minuteValue) + '′' + addZero(this.secondValue) + '″'
      this.form.validateFields((err, values) => {  
        this.form.setFieldsValue({[label]: this.conversionValue})
      });
      this.isShow = false;
    },

    // 这里感觉可以优化，暂未找到好的方法 . . .
    handleRemove1(file) {
      const index = this.fileListVideo1.indexOf(file);
      const newFileList = this.fileListVideo1.slice();
      newFileList.splice(index, 1);
      this.fileListVideo1 = newFileList
    },
    // 上传之前的方法
    beforeUpload1(file) {
      this.fileListVideo1 = [file];
      return false;
    },
    handleUpload1() {
      this.uploading = true;
      const { fileListVideo1 } = this;
      if(fileListVideo1) {
        const formData = new FormData();
        fileListVideo1.map((file) => {
          formData.append('file', file);
        });
        uploadFile('/nmmonitor-server-module-database/fastDFSUpload', formData).then(res => {
          this.uploading = false;
          console.log(res,'上传视频');
          this.$message.success(res.message, 10);
        }).catch(res=>{
          console.log(res,'上传视频');
        })
      }
    },
  }
};
</script>
