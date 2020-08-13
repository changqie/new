/**
 * @description: getters
 */
const config = require('../../../config/global.config')
export default {
  userInfo: state => {
    if (state.userInfo === '') {
      return state.userInfo
    } else {
      let userInfo = JSON.parse(state.userInfo)
      if (userInfo.configContent === null || userInfo.configContent === undefined) {
        userInfo.configContent = 10
      }
      parseInt(userInfo.configContent)
      return userInfo
    }
  },
  getDynamicHistory: state => {
    if (state.dynamicSearch === '') {
      return state.dynamicSearch
    } else {
      return JSON.parse(state.dynamicSearch)
    }
  },
  getDynamicTotal: state => {
    if (state.dynamicTotal === '') {
      return 0
    } else {
      return state.dynamicTotal
    }
  },
  getProcessForm: state => {
    if (state.processForm !== '') {
      return JSON.parse(state.processForm)
    } else {
      return ''
    }
  },
  getProcessStandard: state => {
    if (state.processStandard !== '') {
      return JSON.parse(state.processStandard)
    } else {
      return ''
    }
  },
  getProcessState: state => {
    if (state.processState !== '') {
      return parseInt(state.processState)
    } else {
      return 0
    }
  },
  getMenuList: state => {
    if (state.menuList !== '') {
      return JSON.parse(state.menuList)
    } else {
      return ''
    }
  },
  getLastDetailMap: state => {
    if (state.lastDetailMap !== '') {
      return JSON.parse(state.lastDetailMap)
    } else {
      return []
    }
  },
  getSearchInfoEO: state => {
    if (state.searchInfoEO !== '') {
      return JSON.parse(state.searchInfoEO)
    } else {
      return []
    }
  },
  getDynamicsPage: state => {
    if (state.dynamicsPage !== '') {
      return JSON.parse(state.dynamicsPage)
    } else {
      return ''
    }
  },
  getWebSocketList: state => {
    if (state.webSocketMessageList !== '') {
      return state.webSocketMessageList
    } else {
      return []
    }
  },
  getTheme: state => {
    if (state.theme !== '') {
      return state.theme
    } else {
      return config.theme
    }
  },
  getRoleModule: state => {
    if (state.roleModuleList !== '') {
      return JSON.parse(state.roleModuleList)
    } else {
      return []
    }
  },
  // 切换资源库状态
  getTypeFlag: state => {
    if (state.typeFlag !== '') {
      return state.typeFlag
    } else {
      return ''
    }
  },
  getItemList: state => {
    if (state.standItemList !== '') {
      return JSON.parse(state.standItemList)
    } else {
      return []
    }
  },
  getDetails: state => {
    if (state.processLastDetails !== '') {
      return JSON.parse(state.processLastDetails)
    } else {
      return ''
    }
  }
}
