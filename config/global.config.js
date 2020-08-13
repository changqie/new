/**
 * @description: 通用配置
 * @author: chenxiaoxi
 * @date: 2018-09-04 17:47:46
 */
// 开发环境配置
// const devIp = 'localhost'
const devIp = '192.168.10.140'
const devInterfacePORT = '8899'
// 云端端口号
const DEV_CLOUD_RES_INTERFACE_PORT = '7777'
const simpleFilePath = 'att/attFile/upload'
const multipleFilePath = 'att/attFile/uploadFiles'
const staticFilePath = '192.168.10.140:10010'
// const staticFilePath = '106.2.13.189:8888'
const staticPDFPath = '192.168.7.140'
const webSocket = '192.168.7.178'
// const enterprise = ''
const enterprise = 'SJZX'
const theme = 'theme-one' // 主题(theme-one浅蓝色,theme-two深蓝色)
/*****************************************************************

<<<<<<<<< 主题修改 >>>>>>>>>

 1. 主题分为theme-one,theme-two两种
 2. 修改assets/styles/style.less文件,注释theme-one/theme-two
 3. 将上方theme改为theme-one/theme-two

*****************************************************************/
// 生产环境配置
const prodIp = 'localhost'
const prodInterfacePORT = '3000'

// 判断环境
const serverIP = process.env.NODE_ENV === 'production' ? prodIp : devIp
const interfacePORT = process.env.NODE_ENV === 'production' ? prodInterfacePORT : devInterfacePORT
const CLOUD_RES_INTERFACE_PORT = process.env.NODE_ENV === 'production' ? DEV_CLOUD_RES_INTERFACE_PORT : DEV_CLOUD_RES_INTERFACE_PORT

module.exports = {
  serverUrl: 'http://' + serverIP, // 服务器IP地址
  interfaceUrl: 'http://' + serverIP + ':' + interfacePORT + '/api/', // 服务器端接口访问地址,
  cloudResInterFaceUrl: 'http://' + serverIP + ':' + interfacePORT + '/busApi/', // 云端资源库服务器端接口访问地址,
  simpleUploadPath: 'api/' + simpleFilePath, // 单文件上传地址
  multipleUploadPath: 'api/' + multipleFilePath, // 多文件上传地址
  staticFilePath: 'http://' + staticFilePath,
  staticPDFPath: 'http://' + staticPDFPath,
  webSocket: webSocket + ':' + devInterfacePORT + '/websocket/socketServer', // webSocket连接
  enterprise: enterprise, // GQ广汽 SJZX数据中心
  theme: theme // 主题
}
