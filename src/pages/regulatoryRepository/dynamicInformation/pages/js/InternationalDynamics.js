/**
 * 标准法规库 - 动态&资料 - 国外动态更多 JS文件
 * */
export default {
  name: 'InternationalDynamics',
  data () {
    return {
      loading: false,
      dynamics: {
        internationalName: ''
      },
      MsgDynamicInfoEOPage: {
        msgType: ''
      },
      // 分页
      total: 0,
      page: 1,
      rows: 10,
      inlandMsgList: []
    }
  },
  methods: {
    // 搜索
    queryMsgByPageBtn () {
      this.page = 1
      this.queryMsgByPage()
    },
    queryMsgByPage () {
      this.MsgDynamicInfoEOPage.page = this.page
      this.MsgDynamicInfoEOPage.pageSize = this.$store.getters.userInfo.configContent
      this.MsgDynamicInfoEOPage.msgType = 'FOREIGN'
      this.MsgDynamicInfoEOPage.title = this.dynamics.internationalName
      // this.MsgDynamicInfoEOPage.rowLimit = 3
      this.$http.get('lawss/msgDynamicInfo/page', this.MsgDynamicInfoEOPage, {
        _this: this,
        loading: 'loading'
      }, res => {
        this.inlandMsgList = res.data.list
        this.total = res.data.count
      }, e => {
      })
    },
    // 返回
    back () {
      this.$router.push({
        path: '/dynamicInformation'
      })
    },
    showMsgDetails (id) {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({
        name: 'DomesticDynamicsDetails',
        params: {
          id: id,
          pageType: 'FOREIGN_MSG'
        }
      })
    },
    // 查找、加载表格
    selectDynamics () {},
    // 分页
    pageChange (page) {
      this.page = page
    },
    pageSizeChange (pageSize) {
      this.rows = pageSize
    },
    /**
     * @description: 截取日期
     * @author: chenxiaoxi
     * @date: 2018/10/31 09:30:40
     */
    getDate (date) {
      return date != null ? date.substring(0, date.indexOf(' ')) : ''
    },
    /**
     * @description: 是否显示最新(7天内发布)
     * @author: chenxiaoxi
     * @date: 2018/11/10 13:39:32
     */
    isNew (pubTime) {
      if (pubTime != null && pubTime !== '' && pubTime !== undefined) {
        pubTime = pubTime.replace(new RegExp(/-/gm), '/')
        return new Date().getTime() - new Date(pubTime).getTime() < 7 * 24 * 3600 * 1000
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.queryMsgByPage()
  }
}
