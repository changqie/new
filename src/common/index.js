/**
 * 自定义插件
 * liuyan
*/
import base64 from './base64'
import dateFormat from './date'
const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  Object.defineProperties(Vue.prototype, {
    // 封装全局加密
    $base64: {
      get () {
        return base64
      }
    },
    $dateFormat: {
      get () {
        return dateFormat
      }
    }
  })
}
export default {
  install
}
