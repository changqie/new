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
  },
  // demo页
  {
    path: '/demo',
    name: 'Demo',
    redirect: () => {
      return 'demoInfo'
    },
    component: () => import('@/pages/demo'),
    meta: {
      title: 'demo'
    },
    children: [
      {
        path: '/demoInfo',
        name: 'DemoInfo',
        component: () => import('@/pages/demo/demoInfo'),
        meta: {
          title: '国内法规'
        }
      },
      {
        path: '/demoTwo',
        name: 'DemoTwo',
        component: () => import('@/pages/demo/demoTwo'),
        meta: {
          title: '国外法规'
        }
      }
    ]
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
