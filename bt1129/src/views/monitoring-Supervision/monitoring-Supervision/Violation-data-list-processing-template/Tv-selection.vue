<template>
    <div class="btn">
        <a-button type="primary" @click="showModal">网络电视选择</a-button>
        <a-modal
            title="网络电视选择"
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
        >
        <div>
            <div>
                <a-form>
                    <a-row>
                        <a-col>
                            <a-form-item label="电视厂家" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                                <a-select defaultValue=""  @change="handleChangeTVManufacturer">
                                    <a-select-option :value="value.id" v-for=" value in tVManufacturer" :key="value.id">{{value.manufacturersName}}</a-select-option>
                                    <!-- <a-select-option value="lucy">Lucy</a-select-option>
                                    <a-select-option value="Yiminghe">yiminghe</a-select-option> -->
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col>
                            <a-form-item label="信号" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
                                <a-select defaultValue="" @change="handleChangeTelevisionSignal">
                                    <a-select-option :value="value.id" v-for="value in televisionSignal" :key="value.id">{{value.signalName}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        </a-modal>
    </div>
</template>
<script>
import { addTvmanufacturersModel , queryTvManufacturers , queryTvSignalName } from '@/api/api.js'
export default {
    data() {
        return {
            visible : false,
            confirmLoading : false,
            tVManufacturer : [],//电视厂家的数据
            televisionSignal : [],//电视信号
            TVManufacturerID : "",//电视厂家的ID
            TelevisionSignalName : ""//电视厂家名称
        }
    },
    methods: {


        // 电视厂家的事件
        handleChangeTVManufacturer(value) {
            this.TVManufacturerID = value
            // console.log(`selected ${value}`);
        },
        // 电视信号的事件
        handleChangeTelevisionSignal(value) {
            this.TelevisionSignalName = value;
            // console.log(`selected ${value}`);
        },
        showModal() {
            this.visible = true
        },
        handleOk(e) {
            console.log(this.TVManufacturerID,this.TelevisionSignalName,"id")
            this.confirmLoading = true;
            addTvmanufacturersModel({
                manufacturersId : this.TVManufacturerID,//厂家的ID
                signalNameId : this.TelevisionSignalName,//信号
                dataOrigin : null,//信号源的URL，没有也可以
            }).then((res)=>{
                // console.log(res,11212222)
            })
            setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
            }, 500);
        },
        handleCancel(e) {
            console.log('Clicked cancel button');
            this.visible = false
        },
    },
    mounted(){
        // 电视厂家的接口
        queryTvManufacturers({}).then((res)=>{
            this.tVManufacturer = res.result
            // console.log(res,"我是电视厂家")
        });
        // 信号
        queryTvSignalName({}).then((res)=>{
            this.televisionSignal = res.result
            // console.log(res,"我是信号")
        })
    }
}
</script>

<style lang="scss" scoped>
    .btn{
        // float: left;
        margin:60px 0 0 200px;
    }
    .ant-modal-title{
        text-align: center;
    }
</style>

