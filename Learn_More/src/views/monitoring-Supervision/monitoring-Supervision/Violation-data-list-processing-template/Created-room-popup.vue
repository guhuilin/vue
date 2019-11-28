<template>
    <div>
        <a-button type="primary" @click="showModal">创建房间</a-button>
        <a-modal
            title="Title"
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
        >
        <p>
            <!-- <span>请输入房间名称：</span>
            <a-input style="width:200px;" v-model="roomName"></a-input> -->
        </p>
        </a-modal>
    </div>
</template>
<script>
export default {
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      roomName : "",//房间名称
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
    //   this.ModalText = 'The modal will be closed after two seconds';
    //   this.confirmLoading = true;
    //   setTimeout(() => {
    //     this.visible = false;
    //     this.confirmLoading = false;
    //   }, 2000);

        // this.visible = false;
    },
    handleCancel(e) {
      console.log('Clicked cancel button');
      this.visible = false
    },
  }
}
</script>
