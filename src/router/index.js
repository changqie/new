import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'

Vue.use(Router)

const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login')
  },
  // 首页
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home'),
    meta: {
      requireAuth: true,
      title: '首页',
      menuId: 'G72J4WNFM8'
    }
  }
]

const router = new Router({
  routes,
  mode: 'hash', // default: hash ,history
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

export default router
