<template>
    <div class="add-program">
        <a-button type="primary" @click="showModal">添加节目</a-button>
        <inputType ref="inputType" :matchId="matchId" @inputVal="inputVal"></inputType>
    </div>
</template>
<script>
// add-program
// addProgramCancel
    import inputType from '@/components/input/inputType.vue'
    import {getCustomTableSeqValBySeqName,execInsertSql} from '@/api/api.js'
    export default {
        data(){
            return{
                matchId: '',
                typeIds : [],
                typeKey : [],
            }
        },
        props : ["programHeaderList","programReportCode"],
        components : {
            inputType,
        },
        methods : {
            getShowTableList(){
                this.$listeners.getShowTableList();
            },
            showModal(){
                
                this.getSid();
                console.log(this.typeIds,"66666666")
                this.matchId = this.typeIds   //'1,2,3'
                this.$refs.inputType.init()
            },
            inputVal(value){
                // alert(this.$attrs['pageNo'])
                if(this.$attrs['pageNo'] < 1){
                    this.$emit("changePageNoAncestor")
                }
                let obj = {};
                let arr = [];
                let str = null;
                for(let j in value){
                    arr.push(value[j])
                };
                getCustomTableSeqValBySeqName({
                    seqName : this.programReportCode + "_SEQ"
                }).then((res)=>{
                    str = res.result;
                    // console.log(res.result)
                    for(let i = 0 ; i < this.typeKey.length ; i ++){
                        for(let j = 0 ; j < arr.length ; j ++){
                            if(i === j){
                                obj.ID = str;
                                obj.tableName = this.programReportCode;//code
                                obj[this.typeKey[i].dataIndex] = arr[j];
                            };
                        };
                    };
                    execInsertSql(obj).then((res)=>{
                        console.log(res);
                        this.getShowTableList()
                    })
                })
            },
            getSid(){
                this.typeIds = [];
                // console.log(this.programHeaderList,3)
                for(let i = 0 ; i < this.programHeaderList.length ; i ++){
                    if(this.programHeaderList[i].title !== "操作" && this.programHeaderList[i].title !== "编号"){
                        // console.log("123")
                        this.typeIds.push(this.programHeaderList[i].ids);
                        this.typeKey.push(this.programHeaderList[i])
                    }
                }
            }
        },
        
        mounted(){
            
            
        },
    }
</script>

<style lang="scss" scoped>
    .add-program{
        float: left;
        margin-left:20px;
    }
    .add-program-btn{
        margin-left: 220px;
    }
    .add-program-input{
        content: attr(placeholder);
        margin-bottom: 1em; 
        border: 1px solid #d9d9d9;
        border-radius: 4px;width:200px;
        line-height:32px;
        display: block;
    }
    .add-program-input:hover{
        border-color: #40a9ff !important;
        border-right-width: 1px !important;
    }
    .add-program-input:focus{
        border-color: #40a9ff !important;
        outline: 0;
        -webkit-box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        border-right-width: 1px !important;
    }
</style>