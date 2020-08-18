// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// vuex
import store from './store'
// 全局样式文件
import '@/assets/styles/common.less'
// 样式重置
import '@/assets/styles/reset.css'
// iconfont字体库
import '@/assets/styles/iconfont.css'
// 左侧菜单样式
import '@/assets/styles/navMenu.less'
// axios
import axios from 'axios'
import $axios from '@/common/axios'
// 自定义全局组件
import components from '@/components'
// 自定义插件
import common from '@/common'
// 自定义按钮显示指令
import btnPermission from '@/common/btnPermission' // eslint-disable-line

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(components)
Vue.use(common)
// 原生axios
Vue.prototype.axios = axios
// 封装后的axios
Vue.prototype.$http = $axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
