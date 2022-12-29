<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      chartInstance: null,
      data: null,
      currentPage: 1, //当前页，
      totalPage: 0,
      timerId: null,
    }
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
  created() {
    // this.initChart()
    // this.getData()
    this.$socket.registerCallback('sellerData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: '',
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallback('sellerData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)

      const initOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              type: 'solid',

              color: '#2D3443',
            },
          },
        },
        title: {
          text: '▎商家销售统计',

          top: 20,
          left: 20,
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true, // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            type: 'bar',

            label: {
              show: true,
              position: 'right',
              color: '#fff',
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],

              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE',
                },
                {
                  offset: 1,
                  color: '#AB6EE5',
                },
              ]),
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData(res) {
      // const { data: res } = await this.$http.get('seller')

      console.log(res)
      this.data = res
      this.data.sort((a, b) => a.value - b.value)
      const length = this.data.length

      this.totalPage = length % 5 === 0 ? length / 5 : length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    updateChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const currentData = this.data.slice(start, end)
      const sellNames = currentData.map((item) => item.name)
      const sellValues = currentData.map((item) => item.value)
      const option = {
        yAxis: {
          data: sellNames,
        },
        series: [
          {
            data: sellValues,
          },
        ],
      }
      this.chartInstance.setOption(option)
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }

      this.timerId = setInterval(() => {
        // console.log(this.currentPage)
        this.currentPage++
        if (this.currentPage > this.totalPage) this.currentPage = 1

        this.updateChart()
      }, 3000)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.clientWidth / 100) * 3.6
      const adapterOption = {
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
      // console.log(titleFontSize)
    },
  },
}
</script>

<style lang="less" scoped></style>
