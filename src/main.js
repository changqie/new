// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// jQuery
import $ from 'jquery'
// vuex
import store from './store'
// 全局样式文件
import '@/assets/styles/common.less'
// 样式重置
import '@/assets/styles/reset.css'
// iconfont字体库
import '@/assets/styles/iconfont.css'
// axios
import axios from 'axios'
import $axios from '@/common/axios'
// 自定义全局组件
import components from '@/components'
// 自定义插件
import common from '@/common'
// 自定义按钮显示指令
import btnPermission from '@/common/btnPermission' // eslint-disable-line
import VueI18n from 'vue-i18n' // 国际化

Vue.config.productionTip = false
// jquery
Vue.prototype.$ = $
Vue.use(ElementUI)
Vue.use(common)
Vue.use(components)
Vue.use(VueI18n)
// 原生axios
Vue.prototype.axios = axios
// 封装后的axios
Vue.prototype.$http = $axios
// 国际化
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'en', // 使用localStorage缓存到本地，当下次使用时可默认当前使用语言
  messages: {
    'zh': require('@/assets/languages/cn'),
    'en': require('@/assets/languages/en')
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
