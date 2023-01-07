import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './assets/css/global.less'
import './assets/font/iconfont.css'
const instance = axios.create({
  baseURL: 'http://43.139.26.63:8889/api/',
})
Vue.prototype.$http = instance

Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

import SocketService from './utils/websocket_server.js'
// console.log(SocketService)
SocketService.Instance.connect()

Vue.prototype.$socket = SocketService.Instance

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
// export default Vue
