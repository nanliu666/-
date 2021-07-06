<template>
  <div ref="chart" class="radarMap" style="width: 430px; height: 430px"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  name: 'RadarMap',
  methods: {
    initCharts(data) {
      let myChart = echarts.init(this.$refs.chart)
      let indicator = [],
        seriesData = []
      // 判断数据的长度，雷达图最少三个，不然成一个点或一条直线
      switch (data.length) {
        case 0:
          for (let i = 0; i < 3; i++) {
            indicator.push({
              name: '',
              min: 0,
              max: 5
            })
            seriesData.push(0)
          }
          break
        case 1:
          data.map((v) => {
            indicator.push({
              name: v.name,
              min: 0,
              max: 5
            })
            seriesData.push(parseInt(v.sort))
          })
          for (let i = 0; i < 2; i++) {
            indicator.push({
              name: '',
              min: 0,
              max: 5
            })
            seriesData.push(0)
          }
          break
        case 2:
          data.map((v) => {
            indicator.push({
              name: v.name,
              min: 0,
              max: 5
            })
            seriesData.push(parseInt(v.sort))
          })
          indicator.push({
            name: '',
            min: 0,
            max: 5
          })
          seriesData.push(0)
          break
        default:
          data.map((v) => {
            indicator.push({
              name: v.name,
              min: 0,
              max: 5
            })
            seriesData.push(parseInt(v.sort))
          })
      }
      // 绘制图表
      myChart.clear()
      myChart.setOption({
        grid: {
          left: '20%',
          right: '20%'
        },
        tooltip: {
          trigger: 'axis',
          extraCssText: 'width:310px;white-space: normal; word-break: break-all;',
          position: 'right',
          //   格式化toolTip提示
          formatter: function(params) {
            let name = '',
              abilityDesc = '',
              completeRate = ''
            data.map((v) => {
              if (
                (v.name.length > 4 && v.name.slice(0, 4) + '...' == params.name) ||
                v.name == params.name
              ) {
                name = `${v.name} ${v.levelName}`
                if (v.abilityDesc) abilityDesc = `·能力描述：${v.abilityDesc}`
                completeRate = v.completeRate
              }
            })
            return `<div class="toolDiv"><div>·${name}</div><div>·能力完成度 ${completeRate}%</div><div>${abilityDesc}</div></div>`
          }
        },
        radar: {
          name: {
            overflow: 'truncate',
            ellipsis: '...',
            formatter: function(value) {
              let result = ''
              if (value.length > 4) {
                result = value.slice(0, 4) + '...'
              } else {
                result = value
              }
              return result
            }
          },
          indicator: indicator,
          triggerEvent: true
        },
        series: [
          {
            type: 'radar',
            areaStyle: { color: 'rgba(77,180,255,0.12)' },
            data: [
              {
                value: seriesData
              }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.toolDiv {
  background: #000000;
}
</style>
