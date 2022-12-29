import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
  state: {
    theme: 'chalk',
  },
  mutations: {
    changeTheme(state) {
      const { theme } = state
      state.theme = theme === 'chalk' ? 'vintage' : 'chalk'
      console.log(theme)
    },
  },
})

export default store
