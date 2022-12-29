<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      timer: null,
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
    this.startInterVal()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    window.clearInterval(this.timer)
    this.chartInstance.off('mouseover')
    this.chartInstance.off('mouseout')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '▎库存销售量',
          top: 20,
          left: 20,
        },
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterVal()
      })
    },
    async getData() {
      const { data: res } = await this.$http.get('/stock')
      this.allData = res
      this.updateChart()
      console.log(res)
    },
    updateChart() {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%'],
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF'],
      ]
      const start = this.currentIndex * 5
      const end = start + 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          name: 'haha',
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false,
          },
          // emphasis: {
          //   label: {
          //     show: false,
          //   },
          // },
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
              label: {
                position: 'center',
                color: colorArr[index][0],
              },
            },
            {
              value: item.stock,
              itemStyle: { color: '#333843' },
            },
          ],
        }
      })
      const dataOption = {
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.stock_ref.clientWidth / 100) * 3.6
      const innerRadius = titleFontSize * 2.8
      const outerRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: 'pie',

            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: 'pie',

            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: 'pie',

            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: 'pie',

            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterVal() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        // if (this.currentIndex === 0) {
        //   this.currentIndex = 1
        // } else {
        //   this.currentIndex = 0
        // }
        this.currentIndex = 1 - this.currentIndex
        this.updateChart()
      }, 5000)
    },
  },
  computed: {
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      // console.log(333)
      this.chartInstance.dispose()
      this.initChart()
      this.updateChart()
      this.screenAdapter()
    },
  },
}
</script>

<style lang="less" scoped></style>
