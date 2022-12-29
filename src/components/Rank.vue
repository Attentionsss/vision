<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timerId: null,
    }
  },

  created() {
    this.$socket.registerCallback('rankData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: '',
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },

  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallback('rankData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)

      const initOption = {
        title: {
          text: '▎地区销售排行',
          top: 20,
          left: 20,
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
        },

        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
          },
        ],
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.setInterval()
      })
    },
    async getData(res) {
      // const { data: res } = await this.$http.get('rank')
      this.allData = res.sort((a, b) => b.value - a.value)

      this.updateChart()
      this.setInterval()
    },
    updateChart() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5'],
      ]
      const cateArr = this.allData.map((item) => item.name)
      const amountArr = this.allData.map((item) => item.value)

      const dataOption = {
        xAxis: {
          data: cateArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: amountArr,

            itemStyle: {
              // barWidth: 66,
              color: (arg) => {
                // console.log(arg)
                const { data } = arg
                let targetColorArr = null
                if (data > 300) {
                  targetColorArr = colorArr[0]
                } else if (data > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ])
              },
            },
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.clientWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    setInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++, this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
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
