<template>
  <div style="width:100%;height:100%;display:flex;flex-direction:column;padding:24px;background:#fff">
    <div class="button" style="flex-shrink:0;">
      <div class="tabBtn">
        <a-button type="default" :class="changeClass === index ? 'ant-btn-primary' : 'ant-btn-default'" v-for="(item, index) in tabBtn" :key="index" @click="tabChange(item.id,index)">{{item.name}}</a-button>
      </div>
      <div class="tabBtn">
        <a-button @click="fullToggle($event)">{{this.full ? '全屏显示' : '退出全屏'}}</a-button>
      </div>
      <select-flow v-if="showSelectFlow"
      @cancel="showSelectFlow=false"
      bg-color-tit="#40404C"
      cancel-col="#fff"
      :width="680" />
    </div>
    <keep-alive>
      <component style="flex:1;width:100%;height:100%;" :is="tabView" :id="'c1'"></component>
    </keep-alive>
  </div>
</template>

<script>
import HardwareMonitor from "./modules/hardwareMonitor1.vue";
import ServiceMonitor from "./modules/serviceMonitor1.vue";    
import SelectFlow from '@comp/flow/selectFlow.vue';
import Vue from 'vue';

export default {
  data() {
    return {
      tabBtn: [{id:'Hardware',name:'硬件监控'}, {id:'service',name:'服务监控'}],
      changeClass: 0,
      full: true,
      showSelectFlow: false,
      isShowTestDialog: false,
      graph: 'g2',
      tabView: "HardwareMonitor",
    };
  },
  components: {
    HardwareMonitor,
    ServiceMonitor,
    SelectFlow
  },
  methods: {
    tabChange(type,index) {
      this.changeClass = index
      this.tabView = type + "Monitor";
    },
    fullToggle(e) {
      // this.showSelectFlow = true;
      if(this.tabView === 'hardwareMonitor') {
        let root = document.getElementById('g2');
        root.style.background = '#fff';
        root.webkitRequestFullScreen();
      } else {
        let root = document.getElementById('c1');
        root.style.background = '#fff';
        root.webkitRequestFullScreen();
      }
     
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  .tabBtn {
    > button:last-child {
      margin-left: 24px;
      margin-bottom: 18px;
    }
  }
}
</style>

