<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="com-container">
    <div class="com-chart">
      <Trend></Trend>
    </div>
  </div>
</template>

<script>
import Trend from '../components/Trend.vue'
export default {
  components: {
    Trend,
  },
}
</script>

<style lang="less" scoped></style>
