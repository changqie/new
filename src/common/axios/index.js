/**
 * @description: axios二次封装
 * @author: chenxiaoxi
 * @date: 2018-09-04 11:29:34
 */
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

/**
 * @description: FormData
 * @author: xx
 * @date: 2018-08-14 16:57:48
 */
let formData = (data) => {
  let _formData = new FormData()
  for (let i in data) {
    _formData.append(i, data[i])
  }
  return _formData
}
axios.defaults.timeout = 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
axios.defaults.headers['Content-type'] = 'application/json'
/**
 * @description: axios请求拦截器
 * liuyan
 */
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error.response)
  })
/**
 * @description: axios响应拦截器
 * liuyan
 */
axios.interceptors.response.use(
  res => {
    return res
  },
  error => {
    // 登录超时
    if (error.response.data.path === '/a/login' && store.state.isTimeOut === false) {
      for (let key in store.state) {
        if (key !== 'isTimeOut' && key !== 'laws_urm' && key !== 'laws_prm') {
          store.state[key] = ''
        }
      }
      ElementUI.$message.warning('登录超时,请重新登录')
      router.push('/sign_in')
      store.state.isTimeOut = true
    }
  })
function api () {
  return store.getters.getTypeFlag === 'CloudRepository' ? '/busApi/' : '/api/'
}
export default {
  /**
   * @description: post方法
   * @config: {
   *    _this : this (vue原型)
   *    loading: data中定义的 loading('字符串格式 例如data定义的myloading config:{ _this: this, loading: 'myloading' }')
   * }
   * @author: xx
   * @date: 2018-08-14 16:59:56
   */
  post (url, param, config, thenFun, exeFun) {
    var _formData = formData(param)
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    // 是否显示操作提示
    let showTips = config.showTips === undefined ? true : config.showTips
    if (_this) {
      _this[loading] = true
    }
    axios.post(api() + url + '?' + new Date().getTime(), _formData).then(res => {
      if (_this && loading) { _this[loading] = false }
      if (res.data.ok !== undefined && showTips) {
        let type = res.data.ok ? 'success' : 'warning'
        if (_this) {
          if (res.data.message !== '') {
            _this.$message[type](res.data.message)
          }
        }
      }
      thenFun.call(this, res.data)
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },

  /**
   * @description: post方法(json格式提交)
   * @config: {
   *    _this : this (vue原型)
   *    loading: data中定义的 loading('字符串格式 例如data定义的myloading config:{ _this: this, loading: 'myloading' }')
   * }
   * @author: xx
   * @date: 2018-08-14 16:59:56
   */
  postData (url, param, config, thenFun, exeFun) {
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    // 是否显示操作提示
    let showTips = config.showTips === undefined ? true : config.showTips
    if (_this) {
      _this[loading] = true
    }
    axios.post(api() + url + '?' + new Date().getTime(), param).then(res => {
      if (_this && loading) { _this[loading] = false }
      if (res.data.ok !== undefined && showTips) {
        let type = res.data.ok ? 'success' : 'warning'
        if (_this && res.data.message !== '') {
          _this.$message[type](res.data.message)
        }
      }
      thenFun.call(this, res.data)
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },

  /**
   * @description: $get方法(使用post方法获取数据)
   * @config: {
   *    _this : this (vue原型)
   *    loading: data中定义的 loading('字符串格式 例如data定义的myloading config:{ _this: this, loading: 'myloading' }')
   * }
   * @author: xx
   * @date: 2018-08-14 16:59:56
   */
  $get (url, param, config, thenFun, exeFun) {
    var _formData = formData(param)
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios.post(api() + url + '?' + new Date().getTime(), _formData).then(res => {
      if (_this && loading) { _this[loading] = false }
      thenFun.call(this, res.data)
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },

  /**
   * @description: get方法
   * @config: {
   *    _this : this (vue原型)
   *    loading: data中定义的 loading('字符串格式 例如data定义的myloading config:{ _this: this, loading: 'myloading' }')
   * }
   * @author: xx
   * @date: 2018-08-14 16:59:56
   */
  get (url, param, config, thenFun, exeFun) {
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios.get(api() + url + '?' + new Date().getTime(), { params: param }).then(res => {
      if (_this && loading) { _this[loading] = false }
      // 返回data对象
      if (res.ok !== undefined) {
        if (res.ok) {
          thenFun.call(this, res.data)
        }
      } else {
        // 返回data数组
        thenFun.call(this, res.data)
      }
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },

  /**
   * @description: put方法
   * @author: chenxiaoxi
   * @date: 2018-09-06 13:28:37
   */
  put (url, param, config, thenFun, exeFun) {
    var _formData = formData(param)
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios.put(api() + url, _formData).then(res => {
      if (_this && loading) { _this[loading] = false }
      if (res.data.ok !== undefined) {
        let type = res.data.ok ? 'success' : 'warning'
        if (_this) { if (res.data.message !== '') { _this.$message[type](res.data.message) } }
        if (res.data.ok) {
          thenFun.call(this, res.data)
        }
      }
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },

  /**
   * @description: put方法(json提交)
   * @author: chenxiaoxi
   * @date: 2018-09-06 13:28:37
   */
  putData (url, param, config, thenFun, exeFun) {
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios.put(api() + url + '?' + new Date().getTime(), param).then(res => {
      if (_this && loading) { _this[loading] = false }
      if (res.data.ok !== undefined) {
        let type = res.data.ok ? 'success' : 'warning'
        if (_this && res.data.message !== '') {
          _this.$message[type](res.data.message)
        }
        if (res.data.ok) {
          thenFun.call(this, res.data)
        }
      }
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },
  /**
   * @description: delete方法
   * @author: chenxiaoxi
   * @date: 2018-09-14 09:55:30
   */
  delete (url, param, config, thenFun, exeFun) {
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios.delete(api() + url + '?' + new Date().getTime(), {
      params: param
    }).then(res => {
      if (_this && loading) { _this[loading] = false }
      if (res.data.ok !== undefined) {
        let type = res.data.ok ? 'success' : 'warning'
        if (_this) { if (res.data.message !== '') { _this.$message[type](res.data.message) } }
        thenFun.call(this, res.data)
      }
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },

  /**
   * @description: delete方法(字符串)
   * @author: chenxiaoxi
   * @date: 2018-09-29 16:21:41
   */
  deleteStr (url, param, config, thenFun, exeFun) {
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios.delete(api() + url + '?' + new Date().getTime()).then(res => {
      if (_this && loading) { _this[loading] = false }
      if (res.data.ok !== undefined) {
        let type = res.data.ok ? 'success' : 'warning'
        if (_this) { if (res.data.message !== '') { _this.$message[type](res.data.message) } }
        thenFun.call(this, res.data)
      }
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },

  /**
   * @description: 自定义请求类型
   * @params: type为请求类型
   * @author: chenxiaoxi
   * @date: 2018-09-25 14:51:19
   */
  ajax (type, url, param, config, thenFun, exeFun) {
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios[type](api() + url + '?' + new Date().getTime(), param).then(res => {
      if (_this && loading) { _this[loading] = false }
      if (res.data.ok !== undefined) {
        let type = res.data.ok ? 'success' : 'warning'
        if (_this) { if (res.data.message !== '') { _this.$message[type](res.data.message) } }
        if (res.data.ok) {
          thenFun.call(this, res.data)
        }
      }
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  },
  /**
   * @description: 请求云端动态get方法
   * @config: {
   *    _this : this (vue原型)
   *    loading: data中定义的 loading('字符串格式 例如data定义的myloading config:{ _this: this, loading: 'myloading' }')
   * }
   * @author: xx
   * @date: 2018-08-14 16:59:56
   */
  getMsgDynamicInfo (url, param, config, thenFun, exeFun) {
    // 参数包含this
    let _this = config._this || false
    // 参数包含loading
    let loading = config.loading || false
    if (_this) {
      _this[loading] = true
    }
    axios.get('/busApi/' + url + '?' + new Date().getTime(), { params: param }).then(res => {
      if (_this && loading) { _this[loading] = false }
      // 返回data对象
      if (res.ok !== undefined) {
        if (res.ok) {
          thenFun.call(this, res.data)
        }
      } else {
        // 返回data数组
        thenFun.call(this, res.data)
      }
    }).catch(err => {
      if (_this && loading) {
        _this[loading] = false
        // _this.$Notice.error({
        //   title: '错误',
        //   desc: '网络连接错误'
        // })
      }
      exeFun.call(this, err)
    })
  }
}
