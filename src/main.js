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
// iconfont字体库
import '@/assets/styles/iconfont.css'
// axios
import axios from 'axios'
import $axios from '@/common/axios'
// 自定义全局组件
import components from '@/components'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(components)
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
