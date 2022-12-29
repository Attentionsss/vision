<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
import { getThemeValue } from '@/utils/theme_utils'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0,
    }
  },
  computed: {
    ...mapState(['theme']),
    catName() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor,
      }
    },
  },
  created() {
    this.$socket.registerCallback('hotData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: '',
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallback('hotData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: '▎热销商品销售金额占比统计',
          top: 20,
          left: 20,
        },
        tooltip: {
          formatter: (arg) => {
            const {
              data: { children },
            } = arg
            let total = 0
            children.forEach((item) => {
              total += item.value
            })
            console.log(total)
            let str = ''
            children.forEach((item) => {
              str += `${item.name}: ${parseInt(
                (item.value / total) * 100
              )}%<br/>`
            })
            return str
          },
        },
        legend: {
          top: '15%',
          icon: 'circle',
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
    },
    async getData(res) {
      // const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      console.log(res)
      this.updateChart()
    },
    updateChart() {
      const dataOption = {
        series: [
          {
            data: this.allData[this.currentIndex].children,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.clientWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '55%'],
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight() {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    },
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

<style lang="less" scoped>
.arr-left {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  bottom: 5%;
  right: 10%;
  color: white;
}
</style>
