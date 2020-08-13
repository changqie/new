/**
 * @description: actions
 */
export default {
  // 设置token
  setToken (content, token) {
    content.commit('setToken', token)
  },
  // 退出登录
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('logout')
      resolve()
    })
  },
  // 保存菜单
  setMenu (content, menuList) {
    return new Promise((resolve, reject) => {
      content.commit('setMenu', menuList)
      resolve()
    })
  }
}
