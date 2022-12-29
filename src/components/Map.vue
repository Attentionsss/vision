<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils.js'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {},
    }
  },
  created() {
    this.$socket.registerCallback('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: '',
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },

  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallback('mapData')
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      const { data: res } = await axios.get(
        'http://localhost:8080/static/map/china.json'
      )
      this.$echarts.registerMap('china', res)
      // console.log(res)
      const initOption = {
        title: {
          text: '▎商家分布与销量排行',
          top: '4%',
        },

        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72Bf',
            borderColor: '#333',
          },
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical',
        },
      }
      this.chartInstance.setOption(initOption)

      this.chartInstance.on('click', async (arg) => {
        const { name } = arg

        const { key, path } = getProvinceMapInfo(name)
        // console.log(path)
        if (!this.mapData[key]) {
          const { data: res } = await axios.get(`http://localhost:8080${path}`)
          console.log(res)
          this.mapData[key] = res
          this.$echarts.registerMap(key, res)
        }

        const changeOption = {
          geo: {
            map: key,
          },
        }
        this.chartInstance.setOption(changeOption)
      })
      // this.getData()
    },
    async getData(res) {
      // const { data: res } = await this.$http.get('map')
      this.allData = res
      console.log(res)
      this.updateChart()
    },
    updateChart() {
      const seriesArr = this.allData.map((item) => {
        return {
          name: item.name,
          data: item.children,
          type: 'effectScatter',
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke', //空心
          },
        }
      })
      const legendArr = this.allData.map((item) => item.name)
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },

          top: 20,
          left: 20,
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china',
        },
      }
      this.chartInstance.setOption(revertOption)
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
