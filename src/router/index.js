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
        component: () => import('@/pages/regulatoryRepository/dynamicInformation/index'),
        meta: {
          requireAuth: true,
          title: '动态&资料'
        }
      },
      // 国内标准法规
      {
        path: '/domesticStandardsAndRegulations',
        name: 'domesticStandardsAndRegulations',
        component: () => import('@/pages/regulatoryRepository/domesticStandardsAndRegulations/index'),
        meta: {
          requireAuth: true,
          title: '国内标准法规'
        }
      },
      // 本地动态搜索
      {
        path: '/queryDynamicInformation/:keywords?/:startTime?/:endTime?',
        name: 'QueryDynamicInformation',
        component: () => import('@/pages/regulatoryRepository/dynamicInformation/pages/QueryDynamicInformation'),
        meta: {
          requireAuth: true,
          title: '本地动态搜索'
        }
      },
      {
        path: '/dynamicInformationDetails/:id',
        name: 'DynamicInformationDetails',
        component: () => import('@/pages/regulatoryRepository/dynamicInformation/pages/DynamicInformationDetails'),
        meta: {
          requireAuth: true,
          title: '本地动态详情'
        }
      },
      // 本地产品/项目库
      {
        path: '/localProductsOrProjectLibrary',
        name: 'localProductsOrProjectLibrary',
        component: () => import('@/pages/regulatoryRepository/localProductsOrProjectLibrary/index'),
        meta: {
          requireAuth: true,
          title: '本地产品/项目库'
        }
      }
    ]
  },
  // 配置管理
  {
    path: '/config',
    name: 'Config',
    redirect: () => {
      return getRedirectPath('95KGANGWCV') || '/regulationsManage'
    },
    component: () => import('@/pages/config'),
    meta: {
      title: '配置',
      menuId: '95KGANGWCV'
    },
    children: [
      {
        path: '/regulationsManage',
        name: 'RegulationsManage',
        component: () => import('@/pages/config/pages/regulationsManage/index'),
        meta: {
          requireAuth: true,
          title: '法规属性',
          menuId: 'C5VHBSYRMA'
        }
      },
      {
        path: '/informationCenterConfig',
        name: 'informationCenterConfig',
        component: () => import('@/pages/config/pages/informationCenterConfig/index'),
        meta: {
          requireAuth: true,
          title: '资料中心',
          menuId: '6V2QZ9STRZ'
        }
      },
      {
        path: '/mechanismManage',
        name: 'MechanismManage',
        component: () => import('@/pages/config/pages/mechanismManage/index'),
        meta: {
          requireAuth: true,
          title: '机构管理',
          menuId: '7MWCQK6NNH'
        }
      },
      {
        path: '/roleManage',
        name: 'RoleManage',
        component: () => import('@/pages/config/pages/roleManage/index'),
        meta: {
          requireAuth: true,
          title: '角色管理',
          menuId: 'NVU76EMB7N'
        }
      },
      {
        path: '/userManage',
        name: 'UserManage',
        component: () => import('@/pages/config/pages/userManage/index'),
        meta: {
          requireAuth: true,
          title: '用户管理',
          menuId: 'YRJUEVJVUJ'
        }
      },
      {
        path: '/dynamicInformationManage',
        name: 'DynamicInformationManage',
        component: () => import('@/pages/config/pages/dynamicInformationManage/index'),
        meta: {
          requireAuth: true,
          title: '动态信息',
          menuId: '3C87BSHJUF'
        }
      },
      {
        path: '/dynamicInformationManage/dynamicInfomationPage/:id?',
        name: 'dynamicInfo',
        component: () => import('@/pages/config/pages/regulationsManage/index'),
        meta: {
          requireAuth: true,
          title: '动态信息维护',
          parentPath: '/dynamicInformationManage'
        }
      },
      {
        path: '/domesticDynamicsDetails/:id/:pageType',
        name: 'DomesticDynamicsDetails',
        component: () => import('@/pages/config/pages/regulationsManage/index'),
        meta: {
          requireAuth: true,
          title: '国内动态详情',
          parentPath: '/dynamicInformationManage',
          menuId: 'RSCA2MWTBN'
        }
      },
      {
        path: '/warningTimeSetting',
        name: 'WarningTimeSetting',
        component: () => import('@/pages/config/pages/warningTimeSetting/index'),
        meta: {
          requireAuth: true,
          title: '预警时间',
          menuId: 'H2KC6P3PPM'
        }
      },
      {
        path: '/opinionFeedback',
        name: 'OpinionFeedback',
        component: () => import('@/pages/config/pages/opinionFeedback/index'),
        meta: {
          requireAuth: true,
          title: '意见反馈',
          menuId: '3A6A562XGQ'
        }
      },
      {
        path: '/convertDocView',
        name: 'ConvertDocView',
        component: () => import('@/pages/config/pages/convertDocView/index'),
        meta: {
          requireAuth: true,
          title: '文档转换监控',
          menuId: '3F52K25546'
        }
      },
      {
        path: '/permissionMenuManage',
        name: 'PermissionMenuManage',
        component: () => import('@/pages/config/pages/permissionMenuManage/index'),
        meta: {
          requireAuth: false,
          title: '权限管理'
        }
      },
      {
        path: '/linkManage',
        name: 'LinkManage',
        component: () => import('@/pages/config/pages/linkManage/index'),
        meta: {
          requireAuth: true,
          title: '友情链接管理',
          menuId: 'NODIHFDHFL'
        }
      }
    ]
  },
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
