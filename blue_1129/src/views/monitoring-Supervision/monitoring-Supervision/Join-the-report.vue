<template>
  <!-- 点击报告列表中的详情进入到这个页面中（加入到报告的按钮组件） -->
  <div class="add-report-btn">
    <a-button type="primary" @click="showModal">加入到附件</a-button>
    <a-modal
        :centered="true"
        title="加入到附件"
        v-model="visible"
        :width="800"
        :maskClosable="false"
        :bordered="true"
        :footer="null"
        :closable="false"
    >
        <div v-if="prompt" style="color:#f40;text-align:center;margin-bottom:10px;">*请选择一条节目然后才可以加入到附件</div>
        <div>
            <div>
                <div style="float:left">
                    <div v-for="(item,index) in headerList" class="annex">{{item.title}}：</div>
                </div>
                <div style="position: relative;">
                    <p v-for="item in headerList">
                        <a-select style="width: 150px" @change="handleChange" ref="name">
                            <a-select-option v-for="value in selectedDataValue"  :value="value">{{value}}</a-select-option>
                            <!-- <a-select-option value="lucy">Lucy</a-select-option>
                            <a-select-option value="Yiminghe">yiminghe</a-select-option> -->
                        </a-select>
                        <input ref="selectInputValue" class="select-input" style="position:absolute;height:30px;margin-left:-148.5px;width:125px;margin-top:1px;border:0;padding:2px;" type="text" v-model="text">
                    </p>
                </div>
            </div>
        </div>
        <div style="margin-left:285px;">
            <a-button style="margin-right:10px;" @click="addToAttachmentCancel">取消</a-button>
            <a-button type="primary" @click="addToAttachmentOk">确定</a-button>
        </div>
    </a-modal>
  </div>
</template>
<script>
import bus from "../bus/bus.js";
import {execInsertSql,queryDbAppSoftList,getCustomTableSeqValBySeqName} from '@/api/api.js'
export default {
  data() {
    return {
      // addToAttachment      加入到附件
      visible: false,
      addAnnex: [],
      showAndHide: false,
      selectAttachment: [],
      form: this.$form.createForm(this),
      headerList: [],
      tabCode : "",
      

      text : "",
      prompt : false,
      // websiteList: ['腾讯视频', '百度']
    };
  },
  // props: ["selectedDataValue"],
  components: {
    // joinTheReportPopupLayer
  },
  methods: {
    handleChange(value) {
      this.text = value;
      // console.log(`selected ${value}`);
    },
    changeSelect(value){
      // console.log(value)
      // console.log(value.srcElement.value)
      // this.$refs.inputSelect = 
      // console.log(this.$refs.inputSelect)
    },
    // handleChange(value) {
      // this.$refs.value = value
      // console.log(this.$refs.value,"1212")
      // this.addAnnex = value
      // console.log(value);
      // if( this.addAnnex.length < 0 || this.addAnnex == "--请选择附件--"){
      //     this.showAndHide = false;
      // }else{
      //     this.showAndHide = true
      // }
    // },
    showModal() {
      if(this.selectedDataValue.length <= 0){
          this.prompt = true;
      }else{
          this.prompt = false;
      }
      // console.log(this.headerList.length)
      this.visible = true;
      // bus.$on("listInfo", data => {
      //   // console.log(data);
      // });
      
      // bus.$on("selectedRows",data=>{
      //     console.log(data,"我是选中的数据")
      // })
    },


    addToAttachmentOk(e) {
      // console.log(this.headerList,"666666")
        // console.log(this.tabCode)
        getCustomTableSeqValBySeqName({
            seqName : this.tabCode + "_SEQ"
        }).then((res)=>{
            // console.log(this.$refs.selectInputValue,"获取序列")

            if(res.message === "获取序列成功" && res.result !== "" && res.result !== null){
                let obj = {};
                for(let j = 0 ; j < this.headerList.length ; j ++){
                    for(let i = 0 ; i < this.$refs.selectInputValue.length ; i ++){
                        if(j === i){
                            obj.ID = res.result;
                            obj.tableName = this.tabCode;
                            obj[this.headerList[j].dataIndex] = this.$refs.selectInputValue[i].value;
                        }
                    }
                }
                execInsertSql(obj).then((res)=>{
                    this.visible = false;
                    this.$emit("father")
                    // console.log(res,"我是加入附件的接口")
                })

                // console.log(obj)
            }else{
                alert(res.message)
            }
        })
          execInsertSql().then((res)=>{
            // console.log(res,"我是加入附件的接口")
          })
    },
    addToAttachmentCancel(){
        this.visible = false;
    },
    callback(key) {
      // console.log(key);
    }
  },
  mounted() {
    // bus.$on("attachmentSwitch", data => {
    //   this.selectAttachment = data;
    //   // console.log(data, "tab");
    // });
    // bus.$on("header", data => {
    //   this.headerList = [];
    //   for (let i = 0; i < data.length; i++) {
    //     // console.log(data[i],"1212121");
    //     if (data[i].title !== "操作" && data[i].title !== "编号") {
    //       this.headerList.push(data[i]);
    //     }
    //   }
    //   // console.log(this.headerList, "我也是header");
    // });
    // bus.$on("code",data=>{
    //   this.tabCode = data;
    //   // console.log(data,"DataCode")
    // })
    // bus.$on("updateAfteraddingAttachmentData",data=>{
    //     console.log(data)
    // })
  }
};
</script>
<style lang="scss" scoped>
.add-report-btn {
  // margin: 0 20px;
  button {
    margin-left: 20px;
    
  }
}
.select-input:focus{
    // border-radius: 15px;
    // color:#f40;
  // border: 0;
  // border-color: #f40 !important;
}
.websiteList {
  height: 100px;
  border: 1px solid #d9d9d9;
}
// .ant-modal-body {
//   height: 350px;
//   overflow-y: auto;
// }
.annex {
  
  width: 80px;
  height: 32px;
  margin-bottom: 1em;
  text-align: center;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ant-select-selection-selected-value{
  display: none;
}
  option{
        padding:0;
    }
</style>

<style scoped>

  >>>.ant-select-selection-selected-value{
    display: none;
  }
</style>
