/**
 * 自定义全局组件
 * liuyan
 * */
import Loading from './loading' // loading组件
import NavMenu from './navMenu' // 左侧菜单栏组件
import ComHeader from './comHeader' // header头部组件 面包屑、退出
import LawsTree from './lawsTree' // tree组件
import Pagination from './pagination' // table表格分页组件
import AdcBackTop from './backTop' // 回到顶部组件
import HasNoData from './hasNoData' // 暂无数据组件

const install = function (Vue) {
  Vue.component('loading', Loading)
  Vue.component('navMenu', NavMenu)
  Vue.component('comHeader', ComHeader)
  Vue.component('lawsTree', LawsTree)
  Vue.component('pagination', Pagination)
  Vue.component('adcBackTop', AdcBackTop)
  Vue.component('hasNoData', HasNoData)
}

export default {
  install
}
