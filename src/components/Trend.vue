<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>▎{{ showTitle }}</span>
      <span
        class="title-icon iconfont"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
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
      showChoice: false,
      choiceType: 'map',
      titleFontSize: 0,
    }
  },
  computed: {
    ...mapState(['theme']),
    selectTypes() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter((item) => item.key !== this.choiceType)
      }
    },
    showTitle() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor,
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px',
        background: this.theme === 'chalk' ? '#232732' : '#ffffff',
      }
    },
  },
  created() {
    this.$socket.registerCallback('trendData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: '',
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallback('trendData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
        },
      }
      this.chartInstance.setOption(initOption)
    },

    async getData(res) {
      // const { data: res } = await this.$http.get('trend')
      this.allData = res
      // console.log(res)

      this.updateChart()
    },
    updateChart() {
      // 半透明颜色值
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)',
      ]
      // 全透明颜色值
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)',
      ]
      const timeArr = this.allData.common.month
      const valueArr = this.allData[this.choiceType].data

      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'map',
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        }
      })
      const legendArr = valueArr.map((item) => item.name)
      // console.log(seriesArr)
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6

      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect(type) {
      // console.log(type)
      this.choiceType = type

      this.updateChart()
      this.showChoice = false
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
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  color: white;
  z-index: 10;
  cursor: pointer;
  .title-icon {
    margin-left: 10px;
  }
  .select-con {
    // margin-left: 10px;
    background-color: #222733;
  }
}
</style>
