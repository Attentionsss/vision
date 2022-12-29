import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screenPage',
  },
  {
    path: '/screenPage',
    component: () => import('../views/ScreenPage.vue'),
  },
  {
    path: '/mapPage',
    component: () => import('../views/MapPage.vue'),
  },
  {
    path: '/rankPage',
    component: () => import('../views/RankPage.vue'),
  },
  {
    path: '/hotPage',
    component: () => import('../views/HotPage.vue'),
  },
  {
    path: '/stockPage',
    component: () => import('../views/StockPage.vue'),
  },
  {
    path: '*',
    component: () => import('../NotFound.vue'),
  },
]

const router = new VueRouter({
  routes,
  // mode: 'history',
  mode: 'hash',
})

export default router
