<template>
  <div id="g2" class="gg" style="width:100%;height:100%;overflow:scroll;border:1px solid #ccc;background:#fff;">
    <div style="width:100%;height:480px;">
      <canvas width="1430" height="770" id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { querySystemMonitorList } from "@api/api";

export default {
  name: "HardwareMonitor",
  data() {
    return {
      dataAll: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      function node(x, y, img) {
        var node = new JTopo.Node();
        node.setImage(img);
        node.setLocation(x, y);
        node.setBound(x,y,50,50)
        node.font = "20px"
        scene.add(node);
        return node;
      }
      function node2(img) {
        var node = new JTopo.Node();
        node.setImage(img);
        node.setBound(50,50)
        scene.add(node);
        node.font = "20px"
        return node;
      }
      function linkNode(nodeA, nodeZ, f) {
        var link;
        if (f) { link = new JTopo.FoldLink(nodeA, nodeZ);
        } else { link = new JTopo.Link(nodeA, nodeZ); }
        link.direction = "vertical";
        scene.add(link);
        return link;
      }

      var canvas = document.getElementById("canvas");
      var stage = new JTopo.Stage(canvas);
      var scene = new JTopo.Scene(stage);

      // stage.eagleEye.visible = true
      stage.wheelZoom = 0.9
      stage.mode = 'drag';

      // 服务器
      var A1 = node(100, 100, require('@assets/flow/fwq.png'));
      A1.text = "服务器A";
      A1.fontColor = "0,0,0";
      var B1 = node(200, 100, require('@assets/flow/fwq.png'));
      B1.text = "服务器B";
      B1.fontColor = "0,0,0";
      var C1 = node(300, 100, require('@assets/flow/fwq.png'));
      C1.text = "服务器C";
      C1.fontColor = "0,0,0";
      var D1 = node(400, 100, require('@assets/flow/fwq.png'));
      D1.text = "服务器D";
      D1.fontColor = "0,0,0";
      var E1 = node(600, 100, require('@assets/flow/sjfwq.png'));
      E1.text = "服务器E";
      E1.fontColor = "0,0,0";
      var H1 = node(700, 100, require('@assets/flow/sjfwq.png'));
      H1.text = "服务器H";
      H1.fontColor = "0,0,0";

      // 路由器
      var L1 = node(150, 210, require('@assets/flow/ly.png'));
      L1.text = "路由器";
      L1.fontColor = "0,0,0";
      var L2 = node(250, 210, require('@assets/flow/ly.png'));
      L2.text = "路由器";
      L2.fontColor = "0,0,0";
      var L3 = node(350, 210, require('@assets/flow/ly.png'));
      L3.text = "路由器";
      L3.fontColor = "0,0,0";
      var L4 = node(550, 210, require('@assets/flow/fhq2.png'));
      L4.text = "防火墙";
      L4.fontColor = "0,0,0";
      var L5 = node(650, 230, require('@assets/flow/ly.png'));
      L5.text = "交换机";
      L5.fontColor = "0,0,0";
      var L6 = node(750, 200, require('@assets/flow/cp.png'));
      L6.text = "数据存储";
      L6.fontColor = "0,0,0";

      // 交换机
      var J1 = node(350, 310, require('@assets/flow/ly.png'));
      J1.text = "交换机";
      J1.fontColor = "0,0,0";
      var J2 = node(550, 310, require('@assets/flow/fhq2.png'));
      J2.text = "防火墙";
      J2.fontColor = "0,0,0";
      var J3 = node(750, 300, require('@assets/flow/cp.png'));
      J3.text = "文件存储";
      J3.fontColor = "0,0,0";
      var J4 = node(50, 240, require('@assets/flow/serv.png'));
      J4.text = "";
      J4.fontColor = "0,0,0";
      var J5 = node(100, 260, require('@assets/flow/serv.png'));
      J5.text = "";
      J5.fontColor = "0,0,0";
      var J6 = node(150, 280, require('@assets/flow/serv.png'));
      J6.text = "";
      J6.fontColor = "0,0,0";
      var J7 = node(200, 300, require('@assets/flow/serv.png'));
      J7.text = "";
      J7.fontColor = "0,0,0";
      linkNode(A1, L1);
      linkNode(B1, L1);
      linkNode(D1, L2);
      linkNode(B1, L2);
      linkNode(C1, L3);
      linkNode(D1, L3);
      linkNode(E1, L5);
      linkNode(H1, L5);
      linkNode(L3, L4);
      linkNode(L4, L5);
      linkNode(L5, L6);
      linkNode(J4, L1);
      linkNode(J5, L1);
      linkNode(J6, L2);
      linkNode(J7, L3);
      linkNode(J2, L5);
      linkNode(L5, J3);
      linkNode(L1, J1);
      linkNode(L2, J1);
      linkNode(L3, J1);
      linkNode(J2, J1);

      // JTopo.layout.layoutNode(scene, r1, true);
    }
  }
};
</script>

<style lang="scss" scoped>
.gg::-webkit-scrollbar {
  display:none;
}
</style>

