<template>
  <div id="c1" style="width:100%;height:100%;overflow:scroll;border:1px solid #ccc;position:relative;background:#fff;">
    <div style="width:100%;height:480px;">
      <ul
        :class="show ?'block':'none'"  v-for="(item, ind) in list" :key="ind"
        v-bind:style="{position:'fixed',top:top+'px',left:left+'px'}"
      >
        <li>CPU:{{item.cpuUsage}}</li><li>地址:{{item.serverAddress}}</li>
        <li>序列:{{item.serverName}}</li><li>服务:{{item.serviceName}}</li>
      </ul>
      <canvas id="canvas" width="1911" height="795"></canvas>
    </div>
  </div>
</template>

<script>
import { querySystemMonitorList } from "@api/api";

export default {
  name: "ServiceMonitor",
  data() {
    return { dataAll: [], 
    show: false, 
    top: 150,
    left: 150,
    list:[] 
    };
  },
  computed: { },
  mounted() {
    this.initTopo();
  },
  methods: {
    initTopo() {
      let listArr = [];
      querySystemMonitorList({}).then(res => {
        if (res.success) {
          this.dataAll = res.result;
          this.dataAll.map((item, ind) => {
            for (let i = 0; i < listArr.length; i++) {
              if (listArr[i].pid === item.pid) {
                listArr[i].listInfo.push({
                  cpuUsage: item.cpuUsage,
                  groupLevel: item.groupLevel,
                  id: item.id,
                  memoryUsage: item.memoryUsage,
                  pid: item.pid,
                  serverAddress: item.serverAddress,
                  serverName: item.serverAddress,
                  serverState: item.serverState,
                  serverType: item.serverType,
                  serviceName: item.serviceName
                });
                return;
              }
            }
            listArr.push({
              pid: item.pid,
              listInfo: [
                {
                  cpuUsage: item.cpuUsage,
                  groupLevel: item.groupLevel,
                  id: item.id,
                  memoryUsage: item.memoryUsage,
                  pid: item.pid,
                  serverAddress: item.serverAddress,
                  serverName: item.serverAddress,
                  serverState: item.serverState,
                  serverType: item.serverType,
                  serverType: item.serverType,
                  serviceName: item.serviceName
                }
              ]
            });
          });
        }
        
        listArr = listArr.slice(0,4);

        function linkNode(nodeA, nodeZ, f) {
          var link;
          if (f) {
            link = new JTopo.FoldLink(nodeA, nodeZ);
          } else {
            link = new JTopo.FoldLink(nodeA, nodeZ);
          }
          link.direction = "vertical";
          scene.add(link);
          return link;
        }

        var canvas = document.getElementById("canvas");
        var stage = new JTopo.Stage(canvas);
        var scene = new JTopo.Scene(stage);

        // stage.eagleEye.visible = true
        stage.wheelZoom = 0.9

        var r1 = new JTopo.Node();
        r1.setImage(require("@assets/flow/yy.png"));
        r1.setBound(50, 30, 90, 50);
        r1.text = "网络";
        r1.setLocation(10, 50);
        r1.textPosition = "Middle_Center";
        //使用树形拓扑时，根节点要做如下赋值
        r1.layout = { type: "tree", width: 200, height: 100 };

        // 遍历数组
        listArr.map((item, ind) => {
          var head = new JTopo.Node();
          head.setImage(require("@assets/flow/yy.png"));
          head.setBound(50, 30, 90, 50);
          head.text = "网络";
          head.dragable = false;
          head.setLocation(10, 50);
          head.textPosition = "Middle_Center";
          head.fontColor = "255,255,255";
          scene.add(head);

          var node = "child" + item.pid;
          node = new JTopo.Node();
          node.setImage(require("@assets/dataBase/dataBase.png"));
          node.setBound(100, 170+110*ind, 30, 30);
          node.setLocation(100, 170+110*ind);
          node.text = "路由器" + item.pid;
          node.fontColor = "0,0,0";
          node.dragable = false;
          scene.add(node);
          item.listInfo.map((k, v) => {
            if(item.pid == 3) {
              var nodeChild1 = "孙" + 43;
              nodeChild1 = new JTopo.Node();
              nodeChild1.setBound(700, 170, 30, 30);
              nodeChild1.fillColor = '255,255,255'
              nodeChild1.setLocation(900, 170);
              nodeChild1.fontColor = "0,0,0";
              nodeChild1.dragable = false;
              scene.add(nodeChild1);

              linkNode(node, nodeChild1);
              var nodeChild = "child" + k.id; 
              nodeChild = new JTopo.Node();
              nodeChild.setImage(require("@assets/dataBase/dataBase.png"));
              nodeChild.setBound(180+40*v, 140+(v%2==0?0:60), 30, 30);
              nodeChild.setLocation(180+40*v, 140+(v%2==0?0:60));
              nodeChild.text = k.serviceName;
              nodeChild.fontColor = "0,0,0";
              nodeChild.dragable = false;
              nodeChild.mouseover((event) => {
                this.show = true;
                this.list = [{
                  cpuUsage:k.cpuUsage,
                  serverAddress: k.serverAddress,
                  serverName: k.serverName,
                  serviceName: k.serviceName
                }]
                this.top = event.pageY-130;
                this.left = event.pageX-140;
              });

              nodeChild.mouseout(() => {
                this.show = false;
              });
              scene.add(nodeChild);
              linkNode(nodeChild, nodeChild1);
            } else if(item.pid == 1){
              var nodeChild1 = "孙" + 44;
              nodeChild1 = new JTopo.Node();
              nodeChild1.setBound(700, 180, 30, 30);
              nodeChild1.fillColor = '255,255,255'
              nodeChild1.setLocation(900, 280);
              nodeChild1.fontColor = "0,0,0";
              nodeChild1.dragable = false;
              scene.add(nodeChild1);

              linkNode(node, nodeChild1);
              var nodeChild = "child" + k.id; 
              nodeChild = new JTopo.Node();
              nodeChild.setImage(require("@assets/dataBase/dataBase.png"));
              nodeChild.setBound(180+40*v, 250+(v%2==0?0:60), 30, 30);
              nodeChild.setLocation(180+40*v, 250+(v%2==0?0:60));
              nodeChild.text = k.serviceName;
              nodeChild.fontColor = "0,0,0";
              nodeChild.dragable = false;
              nodeChild.mouseover((event) => {
                this.show = true;
                this.list = [{
                  cpuUsage:k.cpuUsage,
                  serverAddress: k.serverAddress,
                  serverName: k.serverName,
                  serviceName: k.serviceName
                }]
                this.top = event.pageY-130;
                this.left = event.pageX-140;
              });

              nodeChild.mouseout(() => {
                this.show = false;
              });
              scene.add(nodeChild);
              linkNode(nodeChild, nodeChild1);
            } else if(item.pid == 2){
              var nodeChild1 = "孙" + 45;
              nodeChild1 = new JTopo.Node();
              nodeChild1.setBound(700, 190, 30, 30);
              nodeChild1.fillColor = '255,255,255'
              nodeChild1.setLocation(900, 390);
              nodeChild1.fontColor = "0,0,0";
              nodeChild1.dragable = false;
              scene.add(nodeChild1);

              linkNode(node, nodeChild1);
              var nodeChild = "child" + k.id; 
              nodeChild = new JTopo.Node();
              nodeChild.setImage(require("@assets/dataBase/dataBase.png"));
              nodeChild.setBound(180+40*v, 360+(v%2==0?0:60), 30, 30);
              nodeChild.setLocation(180+40*v, 360+(v%2==0?0:60));
              nodeChild.text = k.serviceName;
              nodeChild.fontColor = "0,0,0";
              nodeChild.dragable = false;
              nodeChild.mouseover((event) => {
                this.show = true;
                this.list = [{
                  cpuUsage:k.cpuUsage,
                  serverAddress: k.serverAddress,
                  serverName: k.serverName,
                  serviceName: k.serviceName
                }]
                this.top = event.pageY-130;
                this.left = event.pageX-140;
              });

              nodeChild.mouseout(() => {
                this.show = false;
              });
              scene.add(nodeChild);
              linkNode(nodeChild, nodeChild1);
            } else if(item.pid == 4){
              var nodeChild1 = "孙" + 47;
              nodeChild1 = new JTopo.Node();
              nodeChild1.setBound(700, 200, 30, 30);
              nodeChild1.fillColor = '255,255,255'
              nodeChild1.setLocation(900, 500);
              nodeChild1.fontColor = "0,0,0";
              nodeChild1.dragable = false;
              scene.add(nodeChild1);

              linkNode(node, nodeChild1);
              var nodeChild = "child" + k.id; 
              nodeChild = new JTopo.Node();
              nodeChild.setImage(require("@assets/dataBase/dataBase.png"));
              nodeChild.setBound(180+40*v, 470+(v%2==0?0:60), 30, 30);
              nodeChild.setLocation(180+40*v, 470+(v%2==0?0:60));
              nodeChild.text = k.serviceName;
              nodeChild.fontColor = "0,0,0";
              nodeChild.dragable = false;
              nodeChild.mouseover((event) => {
                this.show = true;
                this.list = [{
                  cpuUsage:k.cpuUsage,
                  serverAddress: k.serverAddress,
                  serverName: k.serverName,
                  serviceName: k.serviceName
                }]
                this.top = event.pageY-130;
                this.left = event.pageX-140;
              });

              nodeChild.mouseout(() => {
                this.show = false;
              });
              scene.add(nodeChild);
              linkNode(nodeChild, nodeChild1);
            }
            
          })

          linkNode(head, node);
          JTopo.layout.layoutNode(scene, head, true);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#c1::-webkit-scrollbar {
  display: none;
}
ul {
  width: 130px;
  height:120px;
  border: 1px solid #aaa;
  border-radius:5px;
  background: #eee;  
  position: absolute;  
  list-style: none;  
  margin: 0;  
  padding: 4px; 
  z-index:999;
  li {
    list-style: none;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
}
.block {
  display: block;
}
.none {
  display: none;
}
</style>

