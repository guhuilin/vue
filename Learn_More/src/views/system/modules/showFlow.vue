<template>
  <div :style="{width: '100%',position:'relative',height:'100%',/* height: '-webkit-fill-available',*/ padding: '0px 0px 0px 38px',background: '#fff',}">
    <div class="toolbar" ref="toolbar" style="position:absolute;top:10px;left:-8px;">
      <i
        data-command="zoomIn" 
        style="position:absolute;top:-5px;left:15px;font-size:24px;cursor:pointer"
        class="command iconfont icon-zoom-in-o"
        title="放大"
      ></i>
      <i
        data-command="zoomOut"
        style="position:absolute;top:35px;left:15px;font-size:24px;cursor:pointer"
        class="command iconfont icon-zoom-out-o"
        title="缩小"
      ></i>
    </div>
    
		<div style="width:100%;height:100%" id="flow" class="flow" ref="flow"></div>
	</div>
</template>

<script>
import G6Editor from '@antv/g6-editor'
import '@assets/flow/icon/font.css'
import bus from '../../monitoring-Supervision/bus/bus'
import { setTimeout } from 'timers';

export default {
	name: 'ShowFlow',
  data() { 
		return { 
      page: null,
      flow: null,
      graph: null,
		}
	},
	props: {
    data: Object,
    showId: String,
  },
  mounted() {
    this.initEditor()
  },
  watch: {
    showId(val) { this.showId = val }
  },
  methods: {
		// 初始化编辑器
    initEditor() {
      const editor = new G6Editor()
      G6Editor.track(false)
      this.flow = new G6Editor.Flow({
        graph: { container: this.$refs.flow },
        align: { grid: true },// 网格对齐
        grid: { cell: 10 },// 网孔尺寸
        shortcut: { 
          zoomIn: true,
          zoomOut: true
        }
      })
      // 命令工具
      this.toolbar = new G6Editor.Toolbar({
        container: this.$refs.toolbar
      })
      // 通过editor添加关联
      editor.add(this.flow)
      editor.add(this.toolbar)
      // 流图读取数据
        if(this.showId) {
          this.data.nodes.map(item => {
            if(item.id === this.showId) item.style.stroke = 'red'
            if(this.showId === 'endEventId' && item.label === "结束") item.style.stroke = 'red'
          })
        } else {
          if(this.showId === "undefined") {
            this.data.nodes.map(item => {
              if(item.label === "结束") item.style.stroke = 'red'
            })
          }
        }
      this.data && this.flow.read(this.data)
      // 通过editor添加关联
      editor.add(this.flow)
      // 获取流图的graph示例
      this.graph = this.flow.getGraph()
      // 居中画布中的内容
      this.graph.setFitView('autoZoom')
      // 获取当前页
      this.page = editor.getCurrentPage()
      // 默认关闭网格对齐
      this.page.hideGrid()
      // 修改添加边的模型
      this.page.changeAddEdgeModel({ shape: 'flow-polyline-round' })
      // 自动更新
      this.graph.update()
      this.graph.on('afterchangesize', () => { this.graph.update() })
      this.convertCanvasToImage(this.graph)
    },
    convertCanvasToImage(canvas) { 
      var image = new Image();
      // image.src = canvas.toDataURL("image/png");
      return image;
    }
  }
};
</script>

<style lang="scss" scoped>
.flow {
  width: 100%;
  // height: 322px;
  overflow: hidden;
  .graph-container {
    height: 100%
  }
}

</style>