/**
 * 自定义全局组件
 * liuyan
 * */
import Loading from './loading' // loading组件
import NavMenu from './navMenu' // 左侧菜单栏组件
import ComHeader from './comHeader' // header头部组件 面包屑、退出
import LawsTree from './lawsTree' // tree组件

const install = function (Vue) {
  Vue.component('loading', Loading)
  Vue.component('navMenu', NavMenu)
  Vue.component('comHeader', ComHeader)
  Vue.component('lawsTree', LawsTree)
}

export default {
  install
}
