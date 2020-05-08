<template>
    <div :id="id"></div>
</template>

<script>
import Echarts from 'echarts'
export default {
  data() {
    return {
      myChart: {}
    }
  },
  props: {
		id: {
			type: String,
			default: ''
		},
    echartObj: {
      type: Object,
      default: {}
    },
	},
  mounted() {
		this.$nextTick(() => {
      this.loadEchart(this.id)
    })
    let _this = this
    window.onresize = function() {
      _this.myChart.resize()
    }
  },
  methods: {
    loadEchart(id) {
      this.myChart = Echarts.init(document.getElementById(id))
      this.myChart.setOption({
        title: {
          text: this.echartObj.title.text
        },
        tooltip: {},
        xAxis: {
          // type: 'value',
          // name: '数量',
          // min: 0,
          // max: 30,
          // interval: 6,
          // axisLabel: {
            // interval :0,
            // fontSize:9
            // formatter: '{value} 包'
          // },
          data: this.echartObj.xAxis.data
        },
        yAxis: {},
        series: this.echartObj.series,
        itemStyle: {
          normal: {
            color: function(params) {
              var colorList = [
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
                '#26C0C0'
              ]
              return colorList[params.dataIndex]
            }
          }
        }
      })
    }
  }
}
</script>

<style>
</style>
