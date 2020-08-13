/**
 * @description: mutations
 */
export default {
  // state退出重置
  logout (state) {
    for (let key in state) {
      if (key !== 'laws_urm' && key !== 'laws_prm') {
        state[key] = ''
        sessionStorage.clear()
      }
    }
  },
  // 主题
  setTheme (state, theme) {
    state.theme = theme
    try {
      localStorage.theme = theme
    } catch (e) {}
  },
  // 设置token
  setToken (state, token) {
    state.token = token
    try {
      sessionStorage.token = token
    } catch (e) {}
  },
  // 设置当前操作的流程
  setProcess (state, process) {
    state.process = process
    try {
      sessionStorage.process = process
    } catch (e) {}
  },
  // 设置用户信息
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
    try {
      sessionStorage.userInfo = userInfo
    } catch (e) {}
  },
  // 登录超时
  isTimeOut (state) {
    state.isTimeOut = true
  },
  // 超时重置
  resetTime (state) {
    state.isTimeOut = false
  },
  // 记住密码
  rememberPwd (state, user) {
    state.laws_urm = user.username
    state.laws_prm = user.password
    try {
      localStorage.laws_urm = user.username
      localStorage.laws_prm = user.password
    } catch (e) {}
  },
  // 详情跳转记录
  setDetailMap (state, path) {
    state.detailMap = path
    try {
      sessionStorage.detailMap = path
    } catch (e) {}
  },
  // 详情跳转记录上一次
  setLastDetailMap (state, path) {
    state.lastDetailMap = path
    try {
      sessionStorage.lastDetailMap = path
    } catch (e) {}
  },
  // 保存动态搜索记录
  setDynamicSearchHistory (state, search) {
    state.dynamicSearch = search
    try {
      sessionStorage.dynamicSearch = search
    } catch (e) {}
  },
  // 保存未读动态
  setDynamicTotal (state, total) {
    state.dynamicTotal = total
    try {
      sessionStorage.dynamicTotal = total
    } catch (e) {}
  },
  // 流程表单暂存
  setProcessForm (state, processForm) {
    state.processForm = processForm
    try {
      sessionStorage.processForm = processForm
    } catch (e) {}
  },
  // 流程相关标准暂存
  setProcessStandard (state, processStandard) {
    state.processStandard = processStandard
    try {
      sessionStorage.processStandard = processStandard
    } catch (e) {}
  },
  // 流程步骤暂存
  setProcessState (state, processState) {
    state.processState = processState
    try {
      sessionStorage.processState = processState
    } catch (e) {}
  },
  // 保存菜单
  setMenu (state, menuList) {
    state.menuList = menuList
    try {
      sessionStorage.menuList = menuList
    } catch (e) {}
  },
  // 高级检索暂存
  setSearchInfoEO (state, searchInfoEO) {
    state.searchInfoEO = searchInfoEO
    try {
      sessionStorage.searchInfoEO = searchInfoEO
    } catch (e) {}
  },
  //  我的动态暂存
  setDynamicsPage (state, dynamicsPage) {
    state.dynamicsPage = dynamicsPage
    try {
      sessionStorage.dynamicsPage = dynamicsPage
    } catch (e) {}
  },
  // 办理webSocket任务
  setWebSocketTask (state, taskId) {
    if (state.webSocketMessageList === '') {
      state.webSocketMessageList = []
      state.webSocketMessageList.push(taskId)
    } else {
      if (state.webSocketMessageList.indexOf(taskId) === -1) {
        state.webSocketMessageList.push(taskId)
      } else {
        state.webSocketMessageList.splice(state.webSocketMessageList.indexOf(taskId), 1)
      }
    }
  },
  // 存储JSESSIONID
  setJESSCookie (state, JSESSIONID) {
    state.JSESSIONID = JSESSIONID
    try {
      sessionStorage.JSESSIONID = JSESSIONID
    } catch (e) {}
  },
  // 本地产品库查看存储数据
  setLocalProData (state, localData) {
    state.localPro = localData
    try {
      sessionStorage.localPro = localData
    } catch (e) {}
  },
  // 查询当前角色权限模块
  setRoleModule (state, roleModule) {
    state.roleModuleList = JSON.stringify(roleModule)
    try {
      sessionStorage.roleModuleList = JSON.stringify(roleModule)
    } catch (e) {}
  },
  setTypeFlag (state, path) {
    state.typeFlag = path
    try {
      sessionStorage.typeFlag = path
    } catch (e) {}
  },
  setStandItem (state, list) {
    state.standItemList = list
    try {
      sessionStorage.standItemList = list
    } catch (e) {}
  },
  setDetails (state, list) {
    state.processLastDetails = list
    try {
      sessionStorage.processLastDetails = list
    } catch (e) {}
  }
}
