/**
 * @description: 全局状态
 */
let defaultTheme = ''
let defaultToken = ''
let process = ''
let userInfo = ''
let lawsUrm = ''
let lawsPrm = ''
let detailMap = ''
let dynamicSearch = ''
let dynamicTotal = ''
let processForm = ''
let processStandard = ''
let processState = ''
let menuList = ''
let lastDetailMap = ''
let searchInfoEO = ''
let dynamicsPage = ''
let webSocketMessageList = ''
let JSESSIONID = ''
let localPro = ''
let roleModuleList = ''
let typeFlag = ''
let standItemList = ''
let processLastDetails = ''
try {
  if (localStorage.theme) { defaultTheme = localStorage.theme }
  if (sessionStorage.token) { defaultToken = sessionStorage.token }
  if (sessionStorage.process) { process = sessionStorage.process }
  if (sessionStorage.userInfo) { userInfo = sessionStorage.userInfo }
  if (localStorage.laws_urm) { lawsUrm = localStorage.laws_urm }
  if (localStorage.laws_prm) { lawsPrm = localStorage.laws_prm }
  if (sessionStorage.detailMap) { detailMap = sessionStorage.detailMap }
  if (sessionStorage.dynamicSearch) { dynamicSearch = sessionStorage.dynamicSearch }
  if (sessionStorage.dynamicTotal) { dynamicTotal = sessionStorage.dynamicTotal }
  if (sessionStorage.processForm) { processForm = sessionStorage.processForm }
  if (sessionStorage.processStandard) { processStandard = sessionStorage.processStandard }
  if (sessionStorage.processState) { processState = sessionStorage.processState }
  if (sessionStorage.menuList) { menuList = sessionStorage.menuList }
  if (sessionStorage.lastDetailMap) { lastDetailMap = sessionStorage.lastDetailMap }
  if (sessionStorage.searchInfoEO) { searchInfoEO = sessionStorage.searchInfoEO }
  if (sessionStorage.dynamicsPage) { searchInfoEO = sessionStorage.dynamicsPage }
  if (sessionStorage.JSESSIONID) { JSESSIONID = sessionStorage.JSESSIONID }
  if (sessionStorage.localPro) { localPro = sessionStorage.localPro }
  if (sessionStorage.roleModuleList) { roleModuleList = sessionStorage.roleModuleList }
  if (sessionStorage.typeFlag) { typeFlag = sessionStorage.typeFlag }
  if (sessionStorage.standItemList) { standItemList = sessionStorage.standItemList }
  if (sessionStorage.processLastDetails) { processLastDetails = sessionStorage.processLastDetails }
} catch (e) {}
export default {
  theme: defaultTheme, // 主题
  token: defaultToken, // 登录标识
  process: process, // 待办流程
  userInfo: userInfo, // 用户信息
  isTimeOut: false, // 登录超时
  laws_urm: lawsUrm, // 用户名
  laws_prm: lawsPrm, // 密码
  detailMap: detailMap, // 查看详情路由记录
  dynamicSearch: dynamicSearch, // 动态搜索记录
  dynamicTotal: dynamicTotal, // 未读动态
  processForm: processForm, // 流程表单
  processStandard: processStandard, // 流程相关标准
  processState: processState, // 流程步骤
  menuList: menuList, // 菜单
  lastDetailMap: lastDetailMap, // 上一次的路由记录
  searchInfoEO: searchInfoEO, // 高级检索
  dynamicsPage: dynamicsPage, // 我的动态页码存储
  webSocketMessageList: webSocketMessageList, // webSocket任务列表
  JSESSIONID: JSESSIONID, // JSESSIONID(后台权限验证)
  localPro: localPro, // 本地产品库查看时存储数据
  roleModuleList: roleModuleList, // 本地产品库查看时存储数据
  typeFlag: typeFlag,
  standItemList: standItemList, // 标准团队模块暂存
  processLastDetails: processLastDetails // 流程查流程数据暂存
}
