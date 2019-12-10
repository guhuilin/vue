<template>
  <div :id="id" :style="echartStyle"></div>
</template>

<script>
import Echarts from 'echarts'

export default {
  props: {
    // 样式
    echartStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    id: {
      type: String,
      default: ''
    },
    // 标题文本
    titleText: {
      type: String,
      default: ''
    },
    // 提示框键名
    tooltipFormatter: {
      type: String,
      default: ''
    },
    // 扇形区域名称
    opinion: {
      type: Array,
      default() {
        return []
      }
    },
    // 提示框标题
    seriesName: {
      type: String,
      default: ''
    },
    // 扇形区域数据
    opinionData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      //
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawPie(this.id)
    })
  },
  methods: {
    // 绘制饼状图
    drawPie(id) {
      this.charts = Echarts.init(document.getElementById(id))

      let xxx = this.charts.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      this.$emit('propData', xxx);

      this.charts.setOption({
        // backgroundColor: '#12cf96',
        title: {
          text: this.titleText, // 标题文本
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/> ' + this.tooltipFormatter + ':{c}'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          bottom: 20,
          data: this.opinion // 扇形区域名称
        },
        series: [
          {
            name: this.seriesName, // 提示框标题
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.opinionData, // 扇形区域数据
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
            }
          }
        ],
        color:[ //自定义的颜色
          'rgb(192,80,77)',
          'rgb(79,128,189)',
          '#C1232B',
          '#B5C334',
          '#FCCE10',
          '#E87C25',
          '#27727B',
          '#FE8463',
          '#9BCA63',
          '#FAD860',
          '#F3A43B',
          '#60C0DD',
          '#D7504B',
          '#C6E579',
          '#F4E001',
          '#F0805A',
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
#myChart {
  
}
</style>
