/**
 * 自定义全局组件
 * liuyan
 * */
import Loading from './loading'

const install = () => {
  Vue.component('loading', Loading)
}

export default install
