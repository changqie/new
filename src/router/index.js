import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

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
      requireAuth: true,
      title: 'demo'
    },
    children: [
      {
        path: '/demoInfo',
        name: 'DemoInfo',
        component: () => import('@/pages/demo/demoInfo'),
        meta: {
          requireAuth: true,
          title: '国内法规'
        }
      },
      {
        path: '/demoTwo',
        name: 'DemoTwo',
        component: () => import('@/pages/demo/demoTwo'),
        meta: {
          requireAuth: true,
          title: '国外法规'
        }
      }
    ]
  },
  {
    path: '/demoThree3',
    name: 'DemoThree3',
    component: () => import('@/pages/demoThree'),
    meta: {
      requireAuth: true,
      title: '流程中心'
    }
  },
  // 标准法规库
  {
    path: '/regulatoryRepository',
    name: 'RegulatoryRepository',
    redirect: () => {
      return 'dynamicInformation'
    },
    component: () => import('@/pages/regulatoryRepository'),
    meta: {
      requireAuth: true,
      title: '标准法规库'
    },
    children: [
      // 动态&资料
      {
        path: '/dynamicInformation',
        name: 'DynamicInformation',
        component: () => import('@/pages/regulatoryRepository/dynamicInformation'),
        meta: {
          requireAuth: true,
          title: '动态&资料'
        }
      },
      // 本地产品/项目库
      {
        path: '/localProductsOrProjectLibrary',
        name: 'localProductsOrProjectLibrary',
        component: () => import('@/pages/regulatoryRepository/localProductsOrProjectLibrary'),
        meta: {
          requireAuth: true,
          title: '本地产品/项目库'
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

router.beforeEach((to, from, next) => {
  let toName = to.name
  let token = store.state.token
  console.log(toName)
  console.log(token)
  next()
})

export default router
