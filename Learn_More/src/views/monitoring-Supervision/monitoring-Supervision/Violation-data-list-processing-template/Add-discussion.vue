<template>
                            <!-- 添加讨论组人员的弹出层组件 -->
    <div>
        <a-button type="primary" @click="showModal">选择添加讨论人员</a-button>
            <a-modal
                title="讨论组人员"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel"
            >
            <selectStaffComponent @selectedPerson="selectedPerson"></selectStaffComponent>
        </a-modal>
    </div>
</template>
<script>
    //引入选择人员的组件 
    import selectStaffComponent from './Select-staff-component.vue'
    export default {
        data() {
            return {
                visible: false,
                confirmLoading: false,
                selectedPersonData : []
            }
        },
        components : {
            selectStaffComponent
        },
        methods: {
            selectedPerson(selectedPerson){
                this.selectedPersonData = selectedPerson
                console.log(this.selectedPersonData,"我才是选中的人员")
            },
            showModal() {
                this.visible = true
            },
            handleOk(e) {
                this.$emit("selectedPersonData",this.selectedPersonData)
                this.visible = false;
            },
            handleCancel(e) {
                this.$emit("selectedPersonData",this.selectedPersonData)
                this.visible = false
            },
        }
    }
</script>
