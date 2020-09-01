<!-- 长城项目 首页 -->
<template>
  <div class="home_v3 v-class">
    <div class="header">
      <div class="logo"></div>
      <!-- <span class="time">{{ currentTime }}</span> -->
    </div>
    <div class="home_v3_main">
      <div class="main-item-wrapper">
        <div class="left-wrapper">
          <!-- 搜索栏 -->
          <div class="search-group">
            <div class="search-option main-item">
              <el-select v-model="selectKey" @on-change="selectKeyChange">
                <el-option
                  v-for="opt in fuzzySearchOption"
                  :key="opt.value"
                  :value="opt.value"
                  :label="opt.label">
                </el-option>
              </el-select>
            </div>
            <div class="search-condition main-item">
              <el-input
                type="text"
                v-model="selectValue"
                id="search-input"
                :placeholder="searchRecommend"
                v-if="!searchinputflag"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchCenteric"
                ></el-button>
              </el-input>
            </div>
          </div>
          <!-- 标准动态栏 -->
          <div class="standard-dynamic main-item list-item">
            <div class="title"><span class="more" @click="dynamicMore">MORE</span></div>
            <el-tabs
              value="Cloud"
              :animated="false"
              @on-click="changeTabs"
            >
              <el-tab-pane label="云端动态" name="Cloud">
                <ul>
                  <li v-for="(item) in  cloudList" :key="item.id" :class="{'is-new' : item.newFlag}">
                    <a @click="detailsDynamics(item, 'Cloud')" :title="item.title" :class="{'newInformation' : item.newFlag}">{{ item.title }}</a>
                    <span :class="{'newInformation' : item.newFlag}">{{ getDate(item.pubTime) }}</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="本地动态" name="local">
                <ul>
                  <li v-for="(item) in domesticDynamics" :key="item.id" :class="{'is-new' : item.newFlag}">
                    <a @click="detailsDynamics(item, 'local')" :title="item.title" :class="{'newInformation' : item.newFlag}">{{ item.title }}</a>
                    <span :class="{'newInformation' : item.newFlag}">{{ getDate(item.pubTime) }}</span>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="right-wrapper">
          <div class="top">
            <!-- 国内标准法规 -->
            <div class="stander-top">
              <router-link to="/domesticStandardDatabase" v-btn-permission="'A59EFAQ7AC'" style="margin-bottom: 10px" class="local-standard main-item inStander hover">
                <div class="iconfont">&#xe614;</div>
                <span>国内标准法规</span>
              </router-link>
              <!-- 国外标准法规 -->
              <router-link to="/foreignStandardDatabase" v-btn-permission="'6K8A2RZYRE'" class="local-standard main-item hover">
                <div class="iconfont">&#xe663;</div>
                <span>国外标准法规</span>
              </router-link>
            </div>
            <div class="top-main-item-wrapper">
              <!-- 用户资料面板 -->
              <router-link tag="div" to="/personal" class="user-info-panel main-item hover">
                <el-badge :value="getDynamicTotal" class="avator">
                  <img :src="userAvator">
                </el-badge>
                <div class="user-info">
                  <h3>欢迎您</h3>
                  <div class="user-name">
                    <span>{{uName}}</span>
                  </div>
                </div>
                <div class="user-info-panel-setting" @click.prevent="userInfoVisible = !userInfoVisible">
                  <el-dropdown
                    trigger="custom"
                    :visible="userInfoVisible"
                    @on-click="userInfoOpen"
                    @on-clickoutside="userInfoVisible = false">
                    <div class="iconfont">&#xe633;</div>
                    <el-dropdown-menu slot="list">
                      <el-dropdown-item name="logout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </router-link>
              <!-- 本地工具 -->
              <router-link tag="dl" to="/analyticalTools" v-btn-permission="'3YVZP8R4TC'" class="local-standard main-item hover">
                <div class="iconfont">&#xe803;</div>
                <span>本地工具</span>
              </router-link>
            </div>
          </div>
          <div class="bottom">
            <!-- 企业标准法规 -->
            <router-link
              tag="dl"
              to="/newEnterpriseStandardDatabase"
              v-btn-permission="'3YVZP8R4TC'"
              class="abroad-standard main-item hover"
            >
                <div class="iconfont">&#xe721;</div>
                <span>企业标准法规</span>
                </router-link>
            <div class="bottom-right">
              <!-- 实时预警 -->
              <router-link tag="dl" to="/processCenter" class="advanced-search main-item hover">
                <dt class="iconfont">&#xe607;</dt>
                <dd>流程中心</dd>
              </router-link>
              <!-- 高级检索 -->
              <router-link tag="dl" to="/advancedSearch" class="advanced-search main-item hover">
                <dt class="iconfont">&#xe63b;</dt>
                <dd>高级检索</dd>
              </router-link>
            </div>
          </div>
          <!-- 待办任务 -->
          <div class="main-item list-item to-do-list">
            <div class="title">
              <h3>待办流程</h3>
              <span @click="taskMore">MORE</span>
            </div>
            <ul>
              <li v-for="needTodo in todoList" :key="needTodo.id" @click="processHandling(needTodo)">
                <a :title="'标准制修定流程' +  `（${needTodo.processRealName}  ${needTodo.processNum}  )` ">{{ '标准制修定流程' }}（{{needTodo.processRealName}}  {{ needTodo.processNum }}）</a>
              </li>
            </ul>
          </div>
          <el-dialog v-model="processModal" width="500" :mask-closable="false" footer-hide title="提示">
            <div style="display: flex;justify-content: center;align-items: center">
              计划号20201393-T-491任务距离交稿时间还有<h2 style="color: red;display: inline">3</h2>天，请及时对应！<el-button type="primary" size="small" @click="todoListClick">处理</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <footer class="home-footer">
      <!-- 页尾 -->
      <div class="footer">
        <div class="online-total">
          <span>当前在线人数 {{ currentInline }}</span>
          <span>累计在线人数 {{ totalInline }}</span>
        </div>
        <div class="scorll-box">
          <i class="el-icon-arrow-down" />
        </div>
        <span class="copy-right">&copy; 中国汽车技术研究有限公司</span>
      </div>
      <!-- 友情链接 -->
      <div class="friendshipLink">
        <span>友情链接:</span>
        <ul>
          <li v-for="(link, index) in linkList" :key="index">
            <a @click="openLinkUrl(link.newWebSite)">{{ link.webName }}</a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      selectKey: 'stand', // 搜索类型
      fuzzySearchOption: [
        {value: 'stand', label: '国内外标准法规'},
        {value: 'laws', label: '国内外政策'},
        {value: 'bussstand', label: '企业标准'},
        {value: 'msgdyinfo', label: '动态&资料'}
      ],
      tabFlag: '',
      // 模糊搜索下拉框数据
      searchinputflag: false,
      dateRangeData: [], // 记录时间选择框的前后时间
      selectValue: '',
      searchRecommend: '请输入关键词',
      domesticDynamics: [],
      // 资料中心
      informationData: [],
      cloudList: [],
      inlandMsgList: [],
      cloudMsgList: [],
      DataResourceInfoEOPage: {
        msgType: ''
      },
      DynamicInfoEOPage: {
        msgType: ''
      },
      // 云端动态
      MsgInterInfoEOPage: {
        msgType: ''
      },
      currentTime: '',
      todoList: [], // 待办事项
      processModal: false,
      backlogProcessList: [],
      // 用户面板设置菜单
      userInfoVisible: false,
      // 当前在线人数
      currentInline: '',
      // 累计在线人数
      totalInline: '',
      linkList: []
    }
  },
  methods: {
    // 模糊搜索中下拉框数据改变
    selectKeyChange (keyvalue) {
      if (keyvalue === 'issueTime' || keyvalue === 'putTime') {
        this.searchinputflag = true
        this.dateRangeData = []
      } else {
        this.searchinputflag = false
        this.selectValue = ''
      }
    },
    // input框搜索事件
    searchCenteric () {
      let selevalue = ''
      if (this.selectValue === '') {
        selevalue = 'allvalue'
      } else {
        selevalue = this.selectValue
      }
      this.$router.push({
        name: 'StandardSearch',
        params: {
          selectKey: this.selectKey,
          searchValue: selevalue
        }
      })
    },
    // 动态信息更多 （云端动态、本地动态）
    dynamicMore () {
      if (this.tabFlag === 'Cloud' || this.tabFlag === '') {
        this.$store.commit('setDetailMap', this.$route.path)
        this.$store.commit('setTypeFlag', 'CloudRepository')
        this.$router.push({
          name: 'CloudDynamics'
        })
      } else if (this.tabFlag === 'local') {
        this.$store.commit('setDetailMap', this.$route.path)
        this.$store.commit('setTypeFlag', 'StatuteBank')
        this.$router.push({
          name: 'DynamicInformation'
        })
      }
    },
    // tabs切换标签状态
    changeTabs (name) {
      this.tabFlag = name
    },
    // 动态信息详情页
    detailsDynamics (item, flag) {
      if (flag === 'local') {
        this.$store.commit('setDetailMap', this.$route.path)
        this.$router.push({
          name: 'DomesticDynamicsDetails',
          params: {
            id: item.id,
            pageType: item.msgType
          }
        })
      } else if (flag === 'Cloud') {
        this.$store.commit('setDetailMap', this.$route.path)
        this.$router.push({
          name: 'DomesticDynamicsDetailsCloud',
          params: {
            id: item.id,
            pageType: item.msgType + '_MSG'
          }
        })
      }
    },
    // 点击 代办流程 更多 按钮 事件
    taskMore () {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({
        name: 'processCenter',
        params: {
          type: '1'
        }
      })
    },
    // 点击 代办流程 处理 事件
    todoListClick () {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({ // eslint-disable-line
        name: 'CeshiProcess',
        params: {
          state: this.todoList[0].stage,
          id: this.todoList[0].id
        }
      })
    },
    /**
     * @description: 截取日期
     * @author: chenxiaoxi
     * @date: 2018/10/31 09:30:40
     */
    getDate (date) {
      return date != null ? date.substring(0, date.indexOf(' ')) : ''
    },

    /**        以下是进入页面自动请求加载方法        **/

    // 加载待办任务
    queryProcess () {
      this.$http.get('activiti/busTaskInfo/page', {
        flag: '1'
      }, {
        _this: this
      }, res => {
        this.todoList = res.data.list
        if (this.todoList.some(item => {
          return item.stage === '2' || item.stage === '4'
        })) {
          this.processModal = true
        }
      }, e => {
      })
    },
    // 获取云端国内动态
    queryMsgByPage () {
      return new Promise((resolve, reject) => {
        let obj = {}
        obj.msgType = 'INLAND'
        obj.rowLimit = 8
        this.$http.getMsgDynamicInfo('lawss/msgDynamicInfo/page', obj, {
          _this: this
        }, res => {
          resolve(res.data.list)
        }, e => {
          reject(e)
        })
      })
    },
    // 获取云端国外动态
    queryForeignMsgByPage (list) {
      let obj = {}
      obj.msgType = 'FOREIGN'
      obj.rowLimit = 8
      this.$http.getMsgDynamicInfo('lawss/msgDynamicInfo/page', obj, {
        _this: this
      }, res => {
        res.data.list.map((item) => {
          list.push(item)
        })
        this.cloudList = list
      }, e => {
      })
    },
    /**
     * @description: 获取动态信息(本地)
     * @author: zhaochunfeng
     * @date: 2018/10/18 17:30:30
     */
    getDynamicInformation () {
      let obj = {}
      obj.msgType = 'DYNAMICS'
      obj.rowLimit = 8
      this.$http.get('lawss/msgDynamicInfo/page', obj, {
        _this: this
      }, res => {
        this.domesticDynamics = res.data.list
      }, e => {
      })
    },
    /**
     * @description: 获取累计登录人数
     * @author: chenxiaoxi
     * @date: 2018/10/30 09:21:00
     */
    totalInLine () {
      this.$http.get('sys/loginInfoEO/count', {}, {
        _this: this
      }, res => {
        this.totalInline = res
      }, e => {})
    },
    // 获取当前在线人数在线人数
    getOnlineCount () {
      this.$http.get('/onlineUser', {}, {_this: this}, res => {
        this.currentInline = res.data.userCount
      })
    },
    /**
     * @description: 获取当前时间
     * @author: chenxiaoxi
     * @date: 2018-09-02 10:59:50
     */
    getTime () {
      this.currentTime = this.$dateFormat(new Date(), 'yyyy-MM-dd')
    },
    // 办理流程
    processHandling (row) {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({ // eslint-disable-line
        name: 'CeshiProcess',
        params: {
          state: row.stage,
          id: row.id
        }
      })
    },
    // 查询用户未读动态
    queryByPersonMsg () {
      this.$http.get('/person/personMsg/selectNotRed', {}, {
        _this: this,
        loading: 'loading'
      }, res => {
        this.setDynamicTotal(res.data)
      }, e => {

      })
    },
    /**
     * @description: 用户菜单栏点击
     * @author: chenxiaoxi
     * @date: 2018-09-13 10:03:52
     */
    userInfoOpen (name) {
      switch (name) {
        case 'personal':
          this.$router.push('/personal')
          break
        case 'logout':
          this.$Modal.confirm({
            title: '提示',
            content: '您确认要退出吗？',
            onOk: () => {
              this.userLoginOut()
            },
            onCancel: () => {}
          })
          break
      }
    },
    // 用户退出登录
    userLoginOut () {
      this.$http.get('logout', {}, {
        _this: this
      }, res => {
        this.$store.dispatch('logout')
        this.$router.push('/sign_in')
      }, e => {})
    },
    // 跳转链接
    openLinkUrl (linkUri) {
      let getHttp = linkUri.substring(0, 7)
      let getHttps = linkUri.substring(0, 8)
      if (getHttp === 'http://' || getHttps === 'https://') {
        window.open(linkUri)
      } else {
        window.open('https://' + linkUri)
      }
    },
    getLinkList () {
      this.$http.get('sys/linkInfo/getLinkList', {}, {
        _this: this
      }, res => {
        if (res.data) {
          this.linkList = res.data
        }
      }, e => {})
    },
    // 鼠标滚轮事件
    handleScroll (e) {
      // 该语句可以用来判断滚轮是向上滑动还是向下
      const direction = e.deltaY > 0 ? 'down' : 'up'
      if (direction === 'down') {
        console.log('鼠标滚轮向下滚动')
        // this.$store.commit('setDetailMap', this.$route.path)
        this.$router.push({
          name: 'Demo'
        })
      }
    },
    ...mapMutations(['setProcess', 'setDynamicTotal'])
  },
  components: {},
  props: {},
  computed: {
    // 用户头像
    userAvator () {
      return this.$store.getters.userInfo.avator || require('@/assets/images/avator_default.png')
    },
    uName () {
      return this.$store.getters.userInfo.uName
    },
    ...mapGetters(['getDynamicTotal', 'getMenuList'])
  },
  watch: {},
  mounted () {
    this.getDynamicInformation()
    this.queryProcess()
    this.totalInLine()
    this.getOnlineCount()
    this.getTime()
    this.queryByPersonMsg()
    this.queryMsgByPage().then((data) => {
      this.queryForeignMsgByPage(data)
    })
    this.getLinkList()
    /**
     * 自定义鼠标滚轮事件
     * chrome and ie
     */
    window.addEventListener('mousewheel', this.handleScroll, false)
    // firefox
    window.addEventListener('DOMMouseScroll', this.handleScroll, false)
  },
  destroyed () {
    window.removeEventListener('mousewheel', this.handleScroll, false)
    window.removeEventListener('DOMMouseScroll', this.handleScroll, false)
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/mixins';
  @import '~@/assets/styles/style';
  .home_v3{
    background: url("~@/assets/images/main_bg.png") no-repeat;
    background-size: cover;
    padding: 4.8vh 6vw 9.5vh 6vw;
    .header{
      position: relative;
      .logo{
        width: 480px;
        height: 50px;
        background: url("~@/assets/images/home/logo_home_v3.png") no-repeat;
      }
      .time{
        font-size: 18px;
        color: #FFF;
        letter-spacing: 1px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
      @media screen and (max-width: 1366px) {
        .logo{
          height: 6.5vh;
          background-size: 80%;
          background-position: left top;
        }
      }
    }
    .home_v3_main{
      padding: 10px 0;
      margin-top: 16px;
      height: 73vh;
      border-top: 1px solid #2D84B8;
      border-bottom: 1px solid #2D84B8;
      .main-item-wrapper{
        &:first-child{
          height: 100%;
          .left-wrapper{
            .flex();
            flex-direction: column;
            .search-group{
              .flex();
              margin-bottom: 10px;
              height: 40px;
              .search-option{
                margin-right: 10px;
                width: 160px;
                .el-select{
                  height: 100%;
                  .el-input{
                    .el-input__inner{
                      .flex();
                      align-items: center;
                      justify-content: center;
                      font-size: 12px;
                      color: #FFF;
                      text-align: center;
                      background: transparent;
                      border: none;
                    }
                  }
                }
              }
              .search-condition{
                flex: 1;
                overflow: hidden;
                .el-input{
                  .flex();
                  align-items: center;
                  height: 100%;
                  &:focus-within{
                    i{
                      padding-right: 5px;
                      color: #FFF;
                    }
                  }
                  input{
                    height: 100%;
                    background: transparent;
                    border: none;
                    color: #FFF;
                    font-size: 14px;
                    padding: 0 35px 0 15px;
                  }
                  .el-input-group__append{
                    background: transparent;
                    border: transparent;;
                    .el-button{
                      padding: 0 !important;
                      i{
                        color: #CCC;
                        &:hover{
                          color: #FFF;
                        }
                      }
                    }
                  }
                }
              }
              .main-item{
                height: inherit;
              }
            }
            .standard-dynamic{
              flex: 1;
              .el-tabs__nav-wrap::after{
                height: 1px;
              }
              .el-tabs__item{
                padding: 0 16px;
                color: #ffffff;
                font-size: 18px;
                font-weight: 600;
              }
              .el-tabs__active-bar {
                width: 104px !important;
                margin-left: -16px;
                background-color: #F8B551;
              }
            }
          }
          .right-wrapper{
            .flex();
            flex-direction: column;
            .top{
              height: auto;
              margin-bottom: 10px;
              .flex();
              .local-standard{
                margin-right: 10px;
                .flex();
                flex-direction: column;
                dt{
                  font-size: 80px;
                }
                &:hover{
                  dt{
                    font-size: 76px;
                  }
                }
                @media screen and (min-width: 1920px) {
                  &:hover{
                    dt{
                      font-size: 92px;
                    }
                  }
                  dt{
                    font-size: 100px;
                  }
                  dd{
                    padding-bottom: 20px;
                    font-size: 22px;
                  }
                }
              }
              .stander-top, .top-main-item-wrapper{
                flex: 1;
                .flex();
                flex-direction: column;
                justify-content: end;
                height: 100%;
                .local-standard{
                  margin-right: 10px;
                  flex-direction: row;
                  align-items: center;
                  height: 90px;
                  color: #FFF;
                  &:hover{
                    div{
                      font-size: 56px;
                    }
                  }
                  div{
                    .flex();
                    justify-content: center;
                    padding-left: 10px;
                    width: 7.3vw;
                    font-size: 60px;
                  }
                  span{
                    flex: 1;
                    font-size: 20px;
                  }
                  @media screen and (max-width: 1366px) {
                    &:hover{
                      div{
                        font-size: 38px;
                      }
                    }
                    div{
                      width: 7.3vw;
                      .flex();
                      justify-content: center;
                      font-size: 42px;
                      padding-left: 10px;
                    }
                    span{
                      flex: 1;
                      font-size: 16px;
                    }
                  }
                }
              }
              .top-main-item-wrapper{
                flex: 1;
                .flex();
                flex-direction: column;
                justify-content: end;
                line-height: 1;
                .local-standard{
                  margin-right: 0;
                }
                .user-info-panel{
                  margin-bottom: 10px;
                  flex: 1;
                  .flex();
                  align-items: center;
                  position: relative;
                  padding: 0 25px;
                  .flex();
                  &:hover{
                    .avator{
                      img{
                        transform: scale(1);
                        animation: avator 2s linear alternate;
                        @keyframes avator {
                          0%{
                            transform: rotate(0);
                          }
                          50%{
                            transform: rotate(30deg);
                          }
                          100%{
                            transform: rotate(0);
                          }
                        }
                      }
                    }
                  }
                  .avator{
                    width: 55px;
                    height: 55px;
                    background: rgba(255,255,255,.25);
                    overflow: hidden;
                    border-radius: 50%;
                    img{
                      width: 100%;
                      height: 100%;
                      border-radius: 50%;
                      transform: scale(1.15);
                      transition: all .2s linear;
                    }
                  }
                  @media screen and (min-width: 1920px) {
                    padding: 0 35px;
                    .avator{
                      width: 70px;
                      height: 70px;
                    }
                  }
                  .user-info{
                    flex: 1;
                    .flex();
                    flex-direction: column;
                    color: #FFF;
                    text-align: center;
                    h3{
                      font-size: 14px;
                    }
                    @media screen and (min-width: 1920px) {
                      h3 {
                        font-size: 22px;
                      }
                      .user-name{
                        span{
                          font-size: 24px !important;
                        }
                      }
                    }
                    .user-name{
                      .flex();
                      justify-content: center;
                      span{
                        font-size: 16px;
                        max-width: 8vw;
                        .ellipsis();
                        text-align: center;
                      }
                    }
                  }
                  .user-info-panel-setting{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #CCC;
                    z-index: 100;
                    &:hover{
                      cursor: pointer;
                      color: #FFF;
                    }
                    .ivu-select-dropdown{
                      max-width: 80px;
                      .ivu-dropdown-menu{
                        min-width: 0;
                      }
                    }
                  }
                }
                .buss-standard-dynamic-information-wrapper{
                  .flex();
                  flex: 1;
                  .main-item{
                    flex: 1;
                    .flex();
                    &:hover{
                      dt{
                        font-size: 36px;
                      }
                    }
                    dt{
                      font-size: 42px;
                    }
                    dd{
                      padding-bottom: 10px;
                      font-size: 18px;
                    }
                    @media screen and (max-width: 1366px) {
                      dt{
                        font-size: 36px;
                      }
                      dd{
                        padding-bottom: 5px;
                        font-size: 14px;
                      }
                      &:hover{
                        dt{
                          font-size: 30px;
                        }
                      }
                    }
                  }
                }
              }
            }
            .bottom{
              flex: 1;
              margin-bottom: 10px;
              .flex();
              .abroad-standard{
                flex: 0.96;
                margin-right: 10px;
                color: #FFF;
                .flex();
                align-items: center;
                &:hover{
                  div{
                    font-size: 56px;
                  }
                }
                div{
                  width: 7.3vw;
                  .flex();
                  justify-content: center;
                  font-size: 60px;
                  padding-left: 10px;
                }
                span{
                  flex: 1;
                  font-size: 20px;
                }
                @media screen and (max-width: 1366px) {
                  &:hover{
                    div{
                      font-size: 38px;
                    }
                  }
                  div{
                    width: 7.3vw;
                    .flex();
                    justify-content: center;
                    font-size: 42px;
                    padding-left: 10px;
                  }
                  span{
                    flex: 1;
                    font-size: 16px;
                  }
                }
              }
              .bottom-right{
                .flex();
                flex: 1;
                .main-item{
                  flex: 1;
                  .flex();
                  flex-direction: column;
                  &:first-child{
                    margin-right: 10px;
                  }
                  &:hover{
                    dt{
                      font-size: 36px;
                    }
                  }
                  dt{
                    font-size: 42px;
                  }
                  dd{
                    padding-bottom: 10px;
                    font-size: 18px;
                  }
                  @media screen and (max-width: 1366px) {
                    &:hover{
                      dt{
                        font-size: 26px;
                      }
                    }
                    dt{
                      font-size: 32px;
                    }
                    dd{
                      font-size: 14px;
                      padding-bottom: 5px;
                    }
                  }
                }
              }
            }
            .to-do-list{
              flex: 1;
              ul{
                li{
                  color: #FFF;
                }
              }
            }
          }
        }
        &:last-child{
          height: 98%;
          margin: 10px 0;
        }
        .flex();
        .left-wrapper{
          width: 51.53vw;
          margin-right: 10px;
        }
        .right-wrapper{
          flex: 1;
          max-width: calc(100% - 60vw);
        }
        .main-item{
          border-radius: 4px;
          background: rgba(0,42,98,.22);
          position: relative;
          transition: all .2s linear;
          &.hover{
            cursor: pointer;
            &::after{
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(255,255,255,.15);
              display: none;
              border-radius: 4px;
            }
            &:hover{
              box-shadow: rgba(255,255,255,.15) 0 0 10px 0;
            }
            &:hover::after{
              display: block;
            }
          }
          dt{
            color: #FFF;
            flex: auto;
            .flex();
            justify-content: center;
            align-items: center;
            transition: all .1s ease-in;
          }
          dd{
            color: #FFF;
            font-size: 18px;
            text-align: center;
            padding-bottom: 14px;
          }
          &.list-item{
            .flex();
            flex-direction: column;
            padding: 10px;
            .title{
              color: #FFF;
              h3{
                font-size: 18px;
              }
              span{
                letter-spacing: 1px;
                display: inline-block;
                position: absolute;
                top: 5px;
                right: 5px;
                line-height: 20px;
                padding: 2px 5px;
                border-radius: 4px;
                &:hover{
                  cursor: pointer;
                  background: rgba(0,0,0, .25);
                }
              }
              .more{
                z-index: 99;
                position: absolute;
                top: 18px;
              }
            }
            ul{
              flex: auto;
              overflow-y: auto;
              max-height: 50vh;
              li{
                .flex();
                margin-bottom: 5px;
                font-size: 14px;
                &:hover{
                  cursor: pointer;
                  a{
                    color: #F8B551;
                    text-decoration: underline;
                  }
                }
                &:first-child{
                  margin-top: 5px;
                }
                &.is-new{
                  font-style: italic;
                  color: #F8B551;
                  a{
                    color: #F8B551;
                  }
                  span{
                    color: #F8B551;
                  }
                }
                a{
                  flex: 1;
                  padding: 3px 0;
                  color: #FFF;
                  .ellipsis();
                }
              }
            }
          }
          &.standard-dynamic{
            ul{
              li{
                span{
                  color: #FFF;
                  padding: 0 10px;
                }
              }
            }
          }
          &.data-center{
            ul{
              li{
                color: #FFF;
                .flex();
                .res-type-content{
                  flex: 1;
                  overflow: hidden;
                  .flex();
                  a{
                    flex: 1;
                    padding-right: 10px;
                  }
                }
                .time{
                  padding: 0 5px;
                }
              }
            }
          }
        }
      }
    }
    @media screen and (max-width: 1366px) {
      .home_v3_main{
        margin-top: 2vh;
      }
    }
    .home-footer{
      color: #ffffff;
    /*  background: @homeSectionBgColor;*/
      height: calc(~'100% - 9.9% - 77.2%');
      .flex();
      flex-wrap: wrap;
      .friendshipLink{
        width: 100%;
        margin: 0 auto;
        display: flex;
        display: -ms-flex;
        position: relative;
        bottom: 8px;
        span{
          color: #FFF;
          display: inline-flex;
          display: -ms-inline-flexbox;
          align-items: center;
          text-align: center;
          font-size: 0.28rem;
          font-weight: bold;
        }
        ul{
          display: flex;
          display: -ms-flex;
          flex: 1;
          align-items: center;
          /*padding-left: 0.3rem;*/
          justify-content: space-between;
          li{
            float: left;
            display: flex;
            display: -ms-flex;
            align-items: center;
            justify-content: space-between;
            a{
              color: #FFF;
              font-size: 13px;
              &:hover{
                color: @baseColor;
                text-decoration: underline;
              }
            }
          }
        }
      }
    .footer{
      width: 100%;
      color: #FFF;
      .flex();
      justify-content: space-between;
      padding: 15px 0 0 0;
      margin: 0 auto;
      .online-total{
        font-size: 14px;
        span{
          margin-right: 5px;
        }
        &:last-child{
          margin-right: 0;
        }
      }
      .scorll-box{
        font-size: 30px;
      }
      .copy-right{
        font-size: 14px;
        letter-spacing: 1px;
      }
    }
    }
  }
  .dis-process{
    display: none;
  }
</style>
