<template>
  <div class="editor">
    <div class="top-container">
      <div class="toolbar" ref="toolbar">
        <i title="撤销" data-command="undo" class="command iconfont icon-undo"></i>
        <i title="重做" data-command="redo" class="command iconfont icon-redo disable"></i>
        <span class="separator"></span>
        <i title="放大" data-command="zoomIn" class="command iconfont icon-zoom-in-o"></i>
        <i title="缩小" data-command="zoomOut" class="command iconfont icon-zoom-out-o"></i>
        <span class="separator"></span>
        <i title="层级后置" data-command="toBack" class="command iconfont icon-to-back"></i>
        <i title="层级前置" data-command="toFront" class="command iconfont icon-to-front"></i>
      </div>
      <div class="data-opt">
        <div style="margin-right:15px;">
          <a-button type="default" @click="goBack">取消</a-button>
          <a-modal title="提示" :maskClosable="false" v-model="visible" okText="确认" cancelText="取消" @ok="handleOk" @cancel="cancelOk">
            <p>是否保存当前编辑页？</p>
          </a-modal>
        </div>
        <a-button type="primary" @click="saveFlow">保存</a-button>
      </div>
    </div>
    <div class="bottom-container">
      <!-- 拖拽节点 -->
      <div class="left-pannel">
        <div class="itempannel-container" ref="itempannel">
          <img draggable="false" src="@assets/flow/start.jpg" data-type="node" data-shape="flow-circle" data-size="73*73" data-color="#999999" data-label="开始" class="getItem" />
          <img draggable="false" src="@assets/flow/node.jpg" data-type="node" data-shape="flow-rect" data-color="#1890FF" data-label="环节" class="getItem" />
          <img draggable="false" src="@assets/flow/judge.jpg" data-type="node" data-shape="flow-rhombus" data-color="#F73809" data-label="判断" class="getItem" />
          <img draggable="false" src="@assets/flow/end.jpg" data-type="node" data-shape="flow-circle" data-size="73*73" data-color="#666666" class="getItem" data-label="结束" />
        </div>
      </div>
      <div class="center-pannel">
        <div class="flow" ref="flow"></div>
        <!-- 右键 -->
        <div class="contextmenu" ref="contextmenu" style="position: absolute; z-index: 2;">
          <div data-status="node-selected" class="menu" style="display: none;">
            <div data-command="copy" class="command disable">
              <span>复制</span>
            </div>
            <div data-command="delete" class="command disable">
              <span>删除</span>
            </div>
          </div>
          <div data-status="edge-selected" class="menu" style="display: none;">
            <div data-command="delete" class="command disable">
              <span>删除</span>
            </div>
          </div>
          <div data-status="canvas-selected" class="menu" style="display: block;">
            <div data-command="undo" class="command disable">
              <span>撤销</span>
            </div>
            <div data-command="redo" class="command disable">
              <span>重做</span>
            </div>
            <div data-command="pasteHere" class="command disable">
              <span>粘贴</span>
            </div>
          </div>
          <div data-status="multi-selected" class="menu" style="display: none;">
            <div data-command="copy" class="command disable">
              <span>复制</span>
            </div>
            <div data-command="paste" class="command disable">
              <span>粘贴</span>
            </div>
            <div data-command="delete" class="command disable">
              <span>删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-pannel">
        <div class="detail-pannel">
          <div ref="detailpannel">
            <!-- 点击节点 -->
            <div data-status="node-selected" class="pannel" style="display: none;">
              <div class="pannel-title">节点</div>
              <a-form layout="inline">
                <a-row :gutter="24" style="margin-bottom: 10px;">
                  <a-col :md="29" :sm="50">
                    <a-form-item label="当前名称：">
                      <a-input :disabled="isShow" v-model="nodeName" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <div :class="show ? 'show' : 'hide'">
                  <a-row :gutter="24" style="margin-bottom: 10px;">
                    <a-col :md="29" :sm="50">
                      <a-form-item label="当前角色：">
                        <a-input disabled v-model="nodeRole" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24" style="margin-bottom: 10px;">
                    <a-col :md="29" :sm="50">
                      <a-form-item label="选择角色：">
                        <a-select
                          notFoundContent
                          labelInValue
                          :value="defaultValue"
                          style="width: 140px"
                          @change="handleChange"
                        >
                          <a-select-option
                            v-for="(item, index) in roleInfoList"
                            :key="index"
                            :value="item.roleId"
                          >{{item.roleName}}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
            <!-- 点击边 -->
            <div data-status="edge-selected" class="pannel" id="edge_detailpannel" style="display: none;">
              <div class="pannel-title">边</div>
              <div class="block-container">
                <a-form layout="inline">
                  <a-row :gutter="24" style="margin-bottom: 10px;">
                    <a-col :md="29" :sm="50">
                      <a-form-item label="当前名称：">
                        <a-input v-model="edgeName" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
                <div :class="showSwitch ? 'show' : 'hide'">
                  <span style="color:#000;">连线状态：</span>
                  <a-switch @change="switchChange" defaultChecked :checked="linecheck"/>
                </div>
              </div>
            </div>
            <!-- 点击组 -->
            <div
              data-status="state-selected"
              class="pannel"
              id="state_detailpannel"
              style="display: none;"
            >
              <div class="pannel-title">组</div>
              <div class="block-container">
                <div class="p name">
                  <span>名称：</span>
                  <a-input v-model="nodeName" />
                </div>
                <div class="p name">
                  <span>状态：</span>
                  <a-input v-model="edgeState"></a-input>
                </div>
              </div>
            </div>
            <!-- 网格对齐 -->
            <div
              data-status="canvas-selected"
              class="pannel"
              id="canvas_detailpannel"
              style="display: none;"
            >
              <div class="pannel-title">画布</div>
              <div class="block-container">
                <a-checkbox @change="onChange">网格对齐</a-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="param" style="padding:0 10px">
          <!-- 新建工作流名称和创建人 -->
          <a-form-item label="工作名称：">
            <a-input placeholder="请输入..." v-model="queryParamName"></a-input>
          </a-form-item>
          <a-form-item label="工作类型：">
            <a-select :defaultValue="typeFlow" style="width: 137px" @change="typeChange">
              <a-select-option value="1">任务工作流</a-select-option>
              <a-select-option value="2">报告工作流</a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G6Editor from '@antv/g6-editor'
import { mapActions, mapState } from "vuex"
import { createBpnmModel, getRoleInfoList, updateBpnmModel, queryDeployedProcessInfoList } from '@api/api';


export default {
  name: 'HomePage',
  props: {
    data: Object, // 传入数据
    initObj: Object,
    ids: String,
  },
  data() {
    return {
      visible: false,
      editId: '',
      show: true,
      showSwitch: false,
      linecheck: false,
      page: null,
      flow: null,
      graph: null,
      isShow: null,
      queryParamName:'',
      typeFlow: '1',
      nodeId: null,
      nodeName: null,
      nodeRole: '采集员',
      defaultValue: {key:'采集员'},
      edgeState: null,
      nodeKey: null,
      roleInfoList: [],
      stateId: null,
      stateName: null,
      edgeId: null,
      edgeName: null,
      gridCheck: false,
      zoomRatio: 100
    }
  },
  created() {
    // 获取角色信息
    getRoleInfoList({}).then(res => { if(res.success) { this.roleInfoList = res.result } })
    if(this.initObj.process) {
      this.queryParamName = this.initObj.process.name ? this.initObj.process.name : ''
      this.editId = this.initObj.process.id;
    }
    if(this.initObj.actUserInfo) {
      this.typeFlow = this.initObj.actUserInfo.workflowType ? this.initObj.actUserInfo.workflowType : '1'
    }
  },
  mounted() { this.initEditor() },
  watch: {
    nodeName(newValue) { this.flow.update(this.nodeId, { label: newValue }) },
    nodeRole(newValue) { this.flow.update(this.nodeId, { role: newValue }) },
    nodeKey(newValue) { this.flow.update(this.nodeId, { rolekey: newValue }) },
    edgeName(newValue) { if (newValue === null) return; this.flow.update(this.edgeId, { label: { text: newValue } })},
    linecheck(newValue) { 
      if (newValue === 'undefined') { this.flow.update(this.edgeId, { check: false })}; 
      this.flow.update(this.edgeId, { check: newValue })},
    edgeState(newValue) { if (newValue === null) return; this.flow.update(this.edgeId, { state: newValue }) },
    stateName(newValue) { if (newValue === null) return; this.flow.update(this.stateId, { label: newValue }) },
    gridCheck(newValue) { newValue ? this.page.showGrid() : this.page.hideGrid() },
    zoomRatio(newValue) { this.graph.zoom(newValue / 100) }
  },
  methods: {
    handleOk() { this.visible = false;this.saveFlow()},
    cancelOk() { this.visible = false;this.$emit('back',true); },
    goBack() { this.visible = true; },
    switchChange(checked){ this.linecheck = checked; },
    typeChange(item) { this.typeFlow = item +'' },
    handleChange(item) { this.nodeRole = item.label; this.nodeKey = item.key ;},
    onChange(e) { this.gridCheck = e.target.checked; },
    // 初始化编辑器
    initEditor() {
      const editor = new G6Editor()
      // 关闭追踪反馈
      G6Editor.track(false)
      // 基础流程图
      this.flow = new G6Editor.Flow({
        graph: { container: this.$refs.flow },
        align: { grid: true },// 网格对齐
        grid: { cell: 10 },// 网孔尺寸
        shortcut: {
          zoomIn: true, // 开启放大快捷键
          zoomOut: true // 开启视口缩小快捷键
        }
      })
      // 流程图图类
      this.itempannel = new G6Editor.Itempannel({ container: this.$refs.itempannel })
      // 命令工具
      this.toolbar = new G6Editor.Toolbar({ container: this.$refs.toolbar })
      // 右键菜单
      this.contextmenu = new G6Editor.Contextmenu({ container: this.$refs.contextmenu })
      // 详细信息面板
      this.detailpannel = new G6Editor.Detailpannel({ container: this.$refs.detailpannel })
      // 通过editor添加关联
      editor.add(this.flow)
      editor.add(this.itempannel)
      editor.add(this.toolbar)
      editor.add(this.contextmenu)
      editor.add(this.detailpannel)
      if(this.initObj.type !== 'add') {
        // 流图读取数据
        this.data && this.flow.read(this.data)
      }
      
      // 获取流图的graph示例
      this.graph = this.flow.getGraph()
      // 居中画布中的内容
      this.graph.setFitView('cc')
      // 节点形状
      this.graph.node({ style: { }})
      // 边形状映射
      this.graph.edge({ style: { stroke: '#79838e' }, shape: 'flow-polyline-round', labelRectStyle: { fill: '#ffffff' }})
      // 获取当前页
      this.page = editor.getCurrentPage()
      // 默认关闭网格对齐
      this.page.hideGrid()
      // 修改添加边的模型
      this.page.changeAddEdgeModel({ shape: 'flow-polyline-round' })
      // 鼠标按下事件
      this.graph.on('mousedown', (ev)=>{ this.defaultValue = { key: '采集员'} });
      // 选中数据处理
      this.page.on('afteritemselected', ev => {
        // 判断数据类型
        switch (ev.item.type) {
          case 'node':
            if(ev.item.model.label === '开始' || ev.item.model.label === '结束' ) {
              this.show = false
              this.isShow = true
              this.nodeId = ev.item.model.label === '开始' ? 'startEventId' : 'endEventId'
              this.nodeName = ev.item.model.label === '开始' ? '开始' : '结束'
            } else if (ev.item.model.label === '判断') {
              this.show = false
              this.nodeId = ev.item.model.id
              this.nodeName = ev.item.model.label
            } else {
              this.show = true
              this.isShow = false
              this.nodeId = ev.item.model.id
              this.nodeName = ev.item.model.label
              this.nodeRole = ev.item.model.role
              this.nodeKey = ev.item.model.rolekey
              // ev.item.model.rolekey = this.nodeKey     //  
            }
            break
          case 'edge':
            this.showSwitch = ev.item.getSource().shapeObj.type === 'flow-rhombus' ? true : false
            if(this.showSwitch) {
              if(ev.item.model.check === undefined) {
                ev.item.model.check=false;
                this.linecheck = false
              } else {
                this.linecheck = ev.item.model.check
              }
            }
            this.edgeId = ev.item.model.id
            this.edgeName = typeof(ev.item.model.label) == 'undefined' ? null : ev.item.model.label.text
            this.edgeState = ev.item.model.state
            break
          case 'state':
            this.stateId = ev.item.model.id
            this.stateName = ev.item.model.label ? ev.item.model.label : null
            break
          default:
            break
        }
      })
      // 自动更新
      this.graph.on('afterchangesize', () => { this.graph.update() })
    },
    // 保存流图数据
    saveFlow() {
      const canvas = this.$refs.flow.childNodes[0].childNodes[0]
      const imgData = canvas.toDataURL('image/png',1) // 转成图片

      let data = this.flow.save();   
      let start = {} // 开始节点
      let end = {}   // 结束节点
      let nodes = [] // 节点数据
      let nodesMap = new Map();
      let edges = [] // 线条数据
      let allEdges = [] // 线条
      let allNodes = []
      let jadgeMap = new Map()
      let jadge = [] // 判断类型
      let jadgeItem = [] // 类型为判断的节点
      data.nodes && data.nodes.map(item => {
        item.id = 'id' + item.id
      })

      data.edges && data.edges.map( item => {
        item.source = 'id' + item.source
        item.target = 'id' + item.target
        if(item.check !== undefined) {
          edges.push({ 
            conditionExpression:"${result=="+ item.check +"}",
            from: item.source, 
            name: typeof(item.label) == 'undefined' ? '' : item.label.text, 
            to: item.target, 
            x: '', 
            y: '' 
          })
        } else {
          edges.push({
            from: item.source, 
            name: typeof(item.label) == 'undefined' ? '' : item.label.text, 
            to: item.target, 
            x: '', 
            y: '' 
          })
        }
        
        data.nodes && data.nodes.map(val => {
          if(val.label === '开始') {
            start = { 
              candidateGroups:"startEventId",
              id: val.id,
              name:"开始",
              x:val.x,
              y:val.y
            }
          }
          if(val.label === '结束') {
            end = {
              candidateGroups:"endEventId",
              id: val.id,
              name:"结束",
              x:val.x,
              y:val.y
            }
          }
          if(val.shape === 'flow-rect') { 
            nodesMap.set('id'+val.id,{
              candidateGroups: val.rolekey,
              id: val.id,
              name:val.label,
              x:val.x,
              y:val.y
            })
          }
          if(val.label === '判断') { 
            jadgeMap.set('id'+val.id,{
              id: val.id,
              name:val.label,
              x:val.x,
              y:val.y
            })
          }
        })
      })
      for(let val of nodesMap.values()) { nodes.push(val); }
      for(let val of jadgeMap.values()) { jadge.push(val); }
   
      const obj = {
        process:(this.initObj.type !== 'add'?{ name: this.queryParamName,id: this.editId }:{ name: this.queryParamName }),
        startEvent: start,
        endEvent: end, 
        userTaskList: nodes,  // 角色，id，用户名   bug
        exclusiveGatewayList: jadge,   // 网关     bug
        sequenceFlowList: edges, // 线条文字，坐标  bug
        showJson: data,
        actUserInfo: { workflowType: this.typeFlow }
      }
      console.log(JSON.stringify(obj),'传递obj')
      if(!this.queryParamName) {
        this.$message.error('工作流名称不能为空 ！');
      } else if(nodes.length<=0) { 
        this.$message.error('至少包含一个内容（除开始结束）！');
      } else {
        if(this.initObj.type !== 'add') {
          obj.process.id = this.ids;
          updateBpnmModel(JSON.stringify(obj)).then(res=> { 
            if(res.success) {
              this.$message.success('工作流修改成功！')
              this.$emit('back',true); 
            }
          })
        } else {
          createBpnmModel(JSON.stringify(obj)).then(res=> { 
            if(res.success) {
              this.$message.success('工作流添加成功！')
              this.$emit('back',true); 
            }
          })
        }
      }
    },
    // 格式化
    formatTooltip(val) { return `${val}%` }
  }
}
</script>

<style lang="scss" scoped>
/deep/.ant-form-item-label {
  width: 80px;
}
.show {
  display: block;
}
.hide {
  display: none;
}
.ant-form-item {
  display: flex;
}
.input {
  width: 300px;
}
.editor {
  position: relative;
  width: 100%;
  height: 100%;
  .top-container {
    position: absolute;
    padding: 5px 20px;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    height: 42px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
    .toolbar {
      height: 100%;
      width: 80%;
      .command {
        width: 27px;
        height: 27px;
        margin: 0px 6px;
        border-radius: 2px;
        padding-left: 4px;
        display: inline-block;
        border: 1px solid rgba(2, 2, 2, 0);
      }
      .disable {
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .data-opt {
      min-width:30%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      text-align: right;
    }
  }
  .bottom-container {
    padding-top: 41px;
    width: 100%;
    height: 100%;
    display: flex;
    background: #f7f9fb;
    justify-content: space-around;
    .title {
      display: flex;
      width: 100%;
      align-items: center;
      height: 34px;
      font-weight: 600;
      font-size: 16px;
      padding: 0 20px;
      background: #cfd4d9;
    }
    .left-pannel {
      width: 15%;
      min-width: 150px;
      height: 100%;
      padding: 20px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      .itempannel-container {
        width: 199px;
        height: 192px;
        display: flex;
        align-items: center;
        flex-direction: column;
        img {
          width: 92px;
          height: 96px;
          padding: 4px;
          margin-left: 4px;
          border-radius: 2px;
          border: 1px solid rgba(0, 0, 0, 0);
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
    .center-pannel {
      background: #ffffff;
      display: inline-block;
      width: 70%;
      height: 100%;
      border: 1px solid #dedbe2;
      .flow {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .contextmenu {
        margin: 0px;
        width: 200px;
        background: white;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        color: #000;
        font-size: 12px;
        display: none;
        .command {
          height: 12px;
          padding: 8px;
          box-sizing: content-box;
        }
        .command:hover {
          cursor: pointer;
          background: #e6f7ff;
        }
        .disable {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
    .right-pannel {
      width: 15%;
      min-width: 220px;
      height: 100%;
      display: inline-flex;
      flex-direction: column;
      .detail-pannel {
        width: 100%;
        height: 70%;
        background: #f7f9fb;
        border-left: 1px solid #e6e9ed;
        font-size: 13px;
        .pannel-title {
          height: 32px;
          border-top: 1px solid #dce3e8;
          border-bottom: 1px solid #dce3e8;
          background: #ebeef2;
          color: #000;
          line-height: 28px;
          padding-left: 12px;
        }
        .block-container {
          padding: 16px 8px;
          .p {
            margin-bottom: 12px;
          }
          .p.name {
            .el-input {
              width: 60%;
              padding: 0 10px;
            }
          }
          .p.size {
            .el-input {
              width: 30%;
              padding: 0 10px;
            }
          }
          .p.color {
            .el-color-picker {
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
}
</style>

