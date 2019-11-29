<template>
  <div style="min-height:100%;">
    <a-spin :spinning="spinning">
      <div>
        <div>
          <span style="font-size:20px">节目处理</span>
        </div>
        <a-divider />
        <div>
          <span style="font-size:15px">采集链接信息</span>
        </div>
        <ul class="backShow">
          <li>
            <span>节目名称：</span>
            <p>{{item.name}}</p>
          </li>
          <li>
            <span>发现网站：</span>
            <p>{{item.source}}</p>
          </li>
          <li>
            <span>节目链接：</span>
            <p>{{item.programUrl}}</p>
          </li>
          <li>
            <span>节目简介：</span>
            <p>{{item.categoryKey}}</p>
          </li>
          <li>
            <span>发现时间：</span>
            <p>{{item.insertTime}}</p>
          </li>
        </ul>

        <a-divider />
        <div>
          <span style="font-size:15px">节目信息</span>
        </div>
        <div class="proInfo">
          <div class="left">
            <a-form :form="form" layout="inline">
              <a-row :gutter="24">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    v-for="(item, ind) in queryFieldtypeModelBeanJudgeList" :key="ind" v-show="item.title !== '编号'"
                    :label="item.title"
                    :label-col="{ span: 10 }"
                    :wrapper-col="{ span: 14 }"
                  >
                    <!-- 普通文本 -->
                    <a-input
                      v-if="item.showType === 'input'"
                      placeholder="请输入内容..."
                      ref="leftVal"
                      :disabled="aboutDisable"
                      :id="item.dataIndex"
                      v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
                    />
                    <!-- 日期选择 -->
                    <a-date-picker
                      v-if="item.showType === 'date'"
                      ref="leftVal"
                      :disabled="aboutDisable"
                      :id="item.dataIndex"
                      v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
                      style="width: 100%"
                    />
                    <!-- 日期时间 -->
                    <a-date-picker
                      v-if="item.showType === 'dateTime'"
                      v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
                      show-time
                      style="width: 100%"
                      ref="leftVal"
                      :disabled="aboutDisable"
                      :id="item.dataIndex"
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                    <!-- 时间选择 -->
                    <a-time-picker
                      v-if="item.showType === 'time'"
                      ref="leftVal"
                      :disabled="aboutDisable"
                      :id="item.dataIndex"
                      v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
                      style="width: 100%"
                    />
                    <!-- 下拉选框 -->
                    <a-select
                      v-if="item.showType === 'select'"
                      ref="leftVal"
                      :disabled="aboutDisable"
                      :id="item.dataIndex"
                      v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
                    >
                      <a-select-option
                        v-for="(item, index) in item.fieldValue.data"
                        :key="index"
                        :value="item.key"
                      >{{item.value}}</a-select-option>
                    </a-select>
                    <!-- 单选框 -->
                    <a-radio-group
                      v-if="item.showType === 'radio'"
                      ref="leftVal"
                      :disabled="aboutDisable"
                      :id="item.dataIndex"
                      v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
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
                      v-if="item.showType === 'checkbox'"
                      ref="leftVal"
                      :disabled="aboutDisable"
                      :id="item.dataIndex"
                      v-decorator="[item.dataIndex,{initialValue:item.initialValue}]"
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
                    <div v-if="item.showType === 'file'" style="display:flex">
                      <a-upload
                        ref="leftVideo"
                        :id="item.dataIndex"
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
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="right">
            <a-form :form="form" layout="inline">
              <a-row :gutter="24">
                <a-input style="float: left;margin-right:15px;width:260px;" v-model="searchData" placeholder="请输入..."></a-input>
                <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button class="searchBtn" type="primary" @click="searchVal" icon="search">查询</a-button>
                  <a-button icon="reload" @click="resetVal" style="margin-left: 8px">重置</a-button>
                </span>
              </a-row>
            </a-form>
            <ul class="searchUl">
              <li v-for="(val,ind) in searchList" :key="ind">
                <span>{{val.PROGRAM_NAME}}</span>
                <div>
                  <span @click="aboutSearch(val)">关联</span><span @click="aboutView(val)">查看</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <a-form>
          <a-row :gutter="24" class="formRow" >
            <a-col :md="24" :sm="8">
              <a-form-item label="原片视频" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                <div style="display:flex">
                  <a-upload
                    :fileList="fileListVideo"
                    :remove="handleRemove"
                    :beforeUpload="beforeUpload"
                  >
                    <a-button style="display:inline-block;z-index:10" :disabled="aboutDisable">
                      <a-icon type="upload" /> 选择上传视频
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
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="8">
              <a-form-item label="判断结果" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
                <a-radio-group v-model="defaultRadio" :disabled="aboutDisable">
                  <a-radio v-for="(item,ind) in judgeRes" :key="ind" :value="item.id">{{item.name}}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <!-- 附件 -->
        <a-divider />
        <div>
          <a-form :form="form" layout="inline">
            <a-row :gutter="24">
              <a-col :md="24" :sm="8">
                <a-form-item label="附件" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                  <a-select @change="selectChange" placeholder="请选择..." style="width:150px;" v-decorator="['selectVal']">
                    <a-select-option v-for="item in list" :key="item.id" :value="item.id+'-'+item.code+'-'+item.typename" >
                      {{item.typename}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="8">
                <a-form-item 
                    v-for="(item, ind) in reportList" :key="ind" v-show="item.fieldName !== '编号'"
                    :label="item.fieldName"
                    :label-col="{ span: 10 }"
                    :wrapper-col="{ span: 14 }"
                  >
                    <!-- 普通文本 -->
                    <a-input
                      v-if="item.showType === 'input' || item.showType === 'select'"
                      placeholder="请输入内容..."
                      ref="reports"
                      :id="item.fieldCode"
                      v-decorator="[item.fieldCode,{initialValue:item.initialValue}]"
                    />
                    <!-- 日期选择 -->
                    <a-date-picker
                      v-if="item.showType === 'date'"
                       ref="reports"
                        :id="item.fieldCode"
                      v-decorator="[item.fieldCode,{initialValue:item.initialValue}]"
                      style="width: 100%"
                    />
                    <!-- 日期时间 -->
                    <a-date-picker
                      v-if="item.showType === 'dateTime'"
                       ref="reports"
                        :id="item.fieldCode"
                      v-decorator="[item.fieldCode,{initialValue:item.initialValue}]"
                      show-time
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                    <!-- 时间选择 -->
                    <a-time-picker
                      v-if="item.showType === 'time'"
                       ref="reports"
                        :id="item.fieldCode"
                      v-decorator="[item.fieldCode,{initialValue:item.initialValue}]"
                      style="width: 100%"
                    />
                  </a-form-item>

                  <div v-show="reportList.length>0" style="display:flex;margin-left:28px;">
                    <a-upload
                      :fileList="fileListPng"
                      :remove="handleRemovePng"
                      :beforeUpload="beforeUploadPng"
                    >
                      <a-button style="display:inline-block;z-index:10">
                        <a-icon type="upload" /> 选择上传
                      </a-button>
                    </a-upload>
                    <span style="margin:0 4px">
                      <a-button
                        type="primary"
                        @click="handleUploadPng"
                        :disabled="fileListPng.length === 0"
                        :loading="uploadingPng"
                      >
                        {{'上传' ? '上传' : '开始上传' }}
                      </a-button>
                    </span>
                  </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
      <div style="text-align: center;margin-top: 1%;">
        <a-button type="primary" @click="back(false)">取消</a-button>
        <a-button type="primary" @click="saveAll" style="margin-left: 2%;">保存</a-button>
      </div>
    </a-spin>
    <inputView ref="inputView" :viewData="[1,2,3]" />
  </div>
</template>

<script>
import inputView from '@comp/input/inputView'
import { 
  execInsertSqlJudge,
  FieldTypeList, 
  addauditVideoHis,
  addDbNetProgamone,
  exceSelectByMap,
  addAppendixVideo,
  updateSuspectProgram, 
  queryFieldtypeModelBeanJudge,
  queryReportAppendTypeModeljieJudge,
  queryJudgeList } from "@api/api";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import Vue from "vue";
import moment from 'moment';
import { USER_INFO } from "@/store/mutation-types";
import { uploadFile } from '@api/manage'
import { isAllDate } from '@/utils/validate'
const judgeRes = [
  { id: 0, name: "无法研判，需要综合研判" },
  { id: 1, name: "违规，不需要综合研判" },
  { id: 2, name: "不违规，直接结束" }
];

export default {
  name: "stepJudgeDiv",
  data() {
    return {
      xxxObj: {},
      judgeRes,
      spinning: false,
      uploading: false,
      uploadingPng: false,
      aboutDisable: false,
      disable: false,
      defaultRadio: 0,
      fileName: '',
      relevanceId: '',
      xxxxxxx: '',
      JudgeTableName: '',
      searchData: '',
      tableName: '',
      tableCode: '',
      userInfo: '',
      idVal: '',
      userInfoId: '',
      newEvidenceVideoName: '',
      newEvidencePngName: '',
      reportList: [],
      list: [],
      searchList: [],
      form: this.$form.createForm(this),
      fileListVideo: [],
      fileListPng: [],
      queryFieldtypeModelBeanJudgeList: [],
      url: {
        list: ""
      }
    };
  },
  mixins: [
    JeecgListMixin
  ],
  props: {
    title: {
      type: String,
      default: "处理"
    },
    ids: {
      default: 0,
      type: Number
    },
    item: {
      type: Object,
      default: {}
    },
    itemList: {
      type: String,
      default: ""
    },
    defaultId: {
      default: "1",
      type: String
    },
    reportTemplateId: {
      default: 1,
      type: Number
    },
    reportid: {
      default: 1,
      type: Number
    },
  },
  components: {
    inputView
  },
  created () {
    this.show();
  },
  mounted () {
    this.userInfo = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userName));  // .fullName
    this.userInfoId = JSON.parse(JSON.stringify(Vue.ls.get(USER_INFO).userId));
  },
  methods: {
    show() {
      if(this.title == '处理') {
        queryFieldtypeModelBeanJudge({id:this.ids}).then(res => {
          res.result.sort((a, b) => {
            return a.ids - b.ids
          })
          this.queryFieldtypeModelBeanJudgeList = res.result
          this.setFormValue();
        })
        queryReportAppendTypeModeljieJudge({propertyTableId: this.reportTemplateId}).then(res => {
          if(res.result) {
            res.result.map(item => {
              this.JudgeTableName = item.code
            })
          }
          let obj = {
            tableName: this.JudgeTableName,
            'PROGRAM_NAME like': '%' + this.item.name + '%'
          }
          exceSelectByMap(obj).then(res => { 
            if(res.success) {
              this.searchList = res.result.data
            }
          })
        })

        FieldTypeList({reportId:this.ids}).then(res => {
          this.list = res.result 
        })
      } else {
        this.disable = false;
      }
    },
    selectChange(code) { 
      this.tabledesid = code.split('-')[0]
      this.tableName = code.split('-')[1]
      this.tableCode = code.split('-')[2]
      queryJudgeList({id:this.tabledesid}).then(res => {
        if(res.success) { 
          this.reportList = res.result 
          this.$nextTick(() => {
            this.setFieldsValueAll(this.reportList);
          })
        } 
      })
    },
    searchVal() {
      let obj = {
        tableName: this.JudgeTableName,
        'PROGRAM_NAME like': '%' + this.searchData + '%'
      }
      exceSelectByMap(obj).then(res => { 
        if(res.success) {
          this.searchList = res.result.data
        }
      })
    },
    resetVal() {
      this.searchData = ''
      this.searchList = []
    },
    aboutView(val) {
      this.$refs.inputView.views(val,this.ids);
    },
    aboutSearch(val) {
      this.relevanceId = val.ID
      this.aboutDisable = true;
      this.defaultRadio = 1;
      let xxx = {}
      Object.keys(val).map(item => {
        this.queryFieldtypeModelBeanJudgeList.map(v => {
          if(item == v.dataIndex) {
            xxx[item] = isAllDate(val[v.dataIndex])
          }
        })
      })

      this.$nextTick(() => {
        this.form.setFieldsValue(xxx);
      });
    },
    handleChangeVideo(info) { 
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      this.fileListVideo = fileList;
    },
    handleChangePng(info) {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileListPng = fileList;
    },
    setFormValue() {
      if (this.item.id) { 
        this.$nextTick(() => {
          this.setFieldsValueAll(this.queryFieldtypeModelBeanJudgeList);
          this.searchData = this.item.name,
          this.defaultRadio = Number(this.item.status)
        });
      } else {
        this.disabled = false;
      }
    },
    setFieldsValueAll(arr) { 
      Array.isArray(arr) && arr.map(item => {
        let obj = {}
        let keyVal = item.dataIndex ? item.dataIndex : item.fieldCode
        if(item.title === '节目名称' || item.fieldName === '节目名称') {
          obj[keyVal] = this.item.name
          this.form.setFieldsValue(obj);
        }
        if(item.title === '节目链接' || item.fieldName === '节目链接') {
          obj[keyVal] = this.item.programUrl
          this.form.setFieldsValue(obj);
        }
        if(item.title === '发现网站' || item.fieldName === '发现网站') {
          obj[keyVal] = this.item.source
          this.form.setFieldsValue(obj);
        }
        if(item.title === '节目简介' || item.fieldName === '节目简介') {
          obj[keyVal] = this.item.categoryKey
          this.form.setFieldsValue(obj);
        }
        if(item.title === '发现时间' || item.fieldName === '发现时间') {
          obj[keyVal] = isAllDate(this.item.insertTime)
          this.form.setFieldsValue(obj);
        }
        if(item.title === '取证文件名称' || item.fieldName === '取证文件名称') {
          obj[keyVal] = this.fileName
          this.form.setFieldsValue(obj);
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
      this.fileListVideo = [...this.fileListVideo, file];
      this.fileListVideo = this.fileListVideo.slice(-1);
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
          if(res.success) {
            this.newEvidenceVideoName = res.result
          }
          this.uploading = false;
          console.log(res,'上传视频');
          this.$message.success(res.message, 10);
        }).catch(res=>{
          console.log(res,'上传视频');
        })
      }
    },
    handleRemovePng(file) {
      const index = this.fileListPng.indexOf(file);
      const newFileList = this.fileListPng.slice();
      newFileList.splice(index, 1);
      this.fileListPng = newFileList
    },
    // 上传之前的方法
    beforeUploadPng(file) {
      this.fileListPng = [...this.fileListPng, file];
      this.fileListPng = this.fileListPng.slice(-1);
      return false;
    },
    handleUploadPng() {
      this.uploadingPng = true;
      const { fileListPng } = this;
      if(fileListPng) {
        const formData = new FormData();
        fileListPng.map((file) => {  
          this.fileName = file.name
          formData.append('file', file);
        });
        uploadFile('/nmmonitor-server-module-database/fastDFSUpload', formData).then(res => {
          if(res.success) {
            this.newEvidencePngName = res.result
            this.setFieldsValueAll(this.reportList);
          }
          this.uploadingPng = false;
          console.log(res,'上传视频');
          this.$message.success(res.message, 10);
        }).catch(res=>{
          console.log(res,'上传视频');
        })
      }
    },
    saveAll() {
      let reportObj = []
      let leftValObj = []
      let addReportObj = {}
      if(this.$refs.leftVal  && !this.relevanceId) {
        let addLeftVal = {}
        this.$refs.leftVal && this.$refs.leftVal.map(val => {
          let xxx = val.$refs.input ? val.$el.id : val.$vnode.data.attrs.id
          let yyy = val.stateValue ? val.stateValue : moment(val.value).format('YYYY-MM-DD')
          reportObj.push({
              [xxx]: yyy
          })
          addLeftVal = reportObj.reduce(function(result, item) {
            let key = Object.keys(item)[0];
            result[key] = item[key];
            return result;
          }, {});
          addLeftVal.tableName = this.JudgeTableName
        })
        execInsertSqlJudge(addLeftVal).then(res => { 
          if(res.success) { 
            this.back(false);
            if(this.fileListVideo[0]) {
              let videoVal = {
                videoName: this.fileListVideo[0].name,  //原片视屏名称
                programId: res.result.result,  //节目id对应DB_NET_PORGRAM的id
                evidencePoster: '',  //视频海报
                createdBy: this.userInfo,  //创建人
                updatedBy: this.userInfo,  //更新人
                insertTimeone: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),  //上传时间
                createdTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),  //创建时间
                updatedTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),  //更新时间
                newEvidenceVideoName: this.newEvidenceVideoName,
                suspectProgramId: this.item.id,
                reportProgramCode: this.JudgeTableName
              }
              addDbNetProgamone(videoVal).then(res => { 
                if(res.success) {
                  console.log('关联成功!')
                } else {
                  this.$message.error('关联失败!')
                }
              })
            }
          } else {
            this.$message.error('新增节目失败!')
          }
        }) 
      }
      // if(this.relevanceId && this.fileListVideo[0]) {  // this.relevanceId && 
      //   this.saveProgramData();
      // }

      this.$refs.reports.map(val => { 
        if(val.$el.id === 'ID') {
          this.idVal = val.stateValue
        }
        let xxx = val.$refs.input ? val.$el.id : val.$vnode.data.attrs.id
        let yyy = val.stateValue ? val.stateValue : moment(val.value).format('YYYY-MM-DD')
        leftValObj.push({ [xxx]: yyy })
        addReportObj = leftValObj.reduce(function(result, item) {
          let key = Object.keys(item)[0];
          result[key] = item[key];
          return result;
        }, {});
      }) 
      addReportObj.ID && Number(addReportObj.ID)
        let xxx = {
          tableName:this.tableName,
          ...addReportObj
        }
        execInsertSqlJudge(xxx).then(res => { 
          if(res.success) {
            this.back(false);
            console.log('新增附件数据!')
          } else {
            this.$message.error('新增附件失败!')
          }
        })    

        if(this.newEvidencePngName) {
          let obj = {
            id: '',//主键id      自增,不需要你传
            videoName: this.fileName,//原视频名
            newEvidenceVideoName: this.newEvidencePngName,//视频转码后的名称转成MP4格式
            insetTime: '',//上传时间 moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            appendixId: this.tabledesid,//所属附件id
            appendixCode: this.tableName,//所属附件CODE
          }
          addAppendixVideo(obj).then(res => {
            console.log(res,'附件关联视频')
          })
        }

        this.form.validateFields((err, values) => { 
          if(!err) {
            let addObj = {
              auditAdvice: '',
              auditResult: this.item.status,
              auditUser: this.userInfo,
              auditLevel: this.item.levele,
              dataId: this.item.id,
              tabledesSource: this.tableCode,
              tabledesid: this.tabledesid,
              tabledesname: this.tableName
            }
            updateSuspectProgram({id: this.item.id, status: this.defaultRadio}).then(res => {
              if(res.success) {
                // console.log(res.message)
              } else {
                this.$message.error('保存失败!')
              }
              // 新增节目处理历史
              addauditVideoHis(addObj).then(res => {  console.log(res,'execInsertSqlJudge')})
            })
          }
        })
    },
    back(flag) {
      this.form.resetFields();
      this.$emit("close", flag);
    },
  }
};
</script>



<style lang="scss" scoped>
.proInfo {
  width: 100%;
  display: flex;
  .left,
  .right {
    width: 50%;
  }
}
.backShow {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  li {
    width: 50%;
    display: flex;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    span {
      font-size: 15px;
    }
    >p {
      padding-right: 5px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
}
.searchUl {
  width: 100%;
  height:200px;
  overflow-y: auto;
  padding-left: 0;
  li {
    height:30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    margin: 0;
    >span {
      width: 70%;
      height:30px;
      line-height:30px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    >div {
      span {
        border:1px solid #ccc;
        padding:2px 4px;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 5px;
      }
    }
  }
}
</style>