/**
 * 标准法规库 - 动态&资料 - 实施预警更多 js
 */
export default {
  name: 'ImplementWarning',
  data () {
    return {
      productionVehicleDatas: [],
      newTypeDatas: [],
      newProductionDatas: [],
      productTotal: 0, // 抽屉分页的总条数
      newTotal: 0, // 抽屉分页的总条数
      newProductTotal: 0, // 抽屉分页的总条数
      productPage: 1,
      newPage: 1,
      newProducPage: 1,
      productPageSize: 10,
      newPageSize: 10,
      newProducPageSize: 10
    }
  },
  methods: {
    queryProductionVehicleByPage () {
      this.$http.get('lawss/msgSarPutTime/page', {
        sarPutType: 'PRODUCT',
        page: this.productPage,
        pageSize: this.$store.getters.userInfo.configContent
      }, {
        _this: this
      }, res => {
        this.productionVehicleDatas = res.data.list
        this.productTotal = res.data.count
      }, e => {
      })
    },
    // 返回
    back () {
      if (this.$store.state.detailMap !== '') {
        this.$router.push(this.$store.state.detailMap)
        this.$store.commit('setDetailMap', '')
      } else {
        let lastPathList = this.$store.getters.getLastDetailMap
        let lastPath = lastPathList[lastPathList.length - 1]
        this.$router.push(lastPath)
        lastPathList.pop(1)
        this.$store.commit('setLastDetailMap', JSON.stringify(lastPathList))
      }
    },
    queryNewTypeByPage () {
      this.$http.get('lawss/msgSarPutTime/page', {
        sarPutType: 'NEWCAR',
        page: this.newPage,
        pageSize: this.$store.getters.userInfo.configContent
      }, {
        _this: this
      }, res => {
        this.newTypeDatas = res.data.list
        this.newTotal = res.data.count
      }, e => {
      })
    },
    queryNewProductionByPage () {
      this.$http.get('lawss/msgSarPutTime/page', {
        sarPutType: 'NEWPRODUCT',
        page: this.newProducPage,
        pageSize: this.$store.getters.userInfo.configContent
      }, {
        _this: this
      }, res => {
        this.newProductionDatas = res.data.list
        this.newProductTotal = res.data.count
      }, e => {
      })
    },
    // 抽屉分页页码改变回调
    productPageChange (page) {
      this.productPage = page
      this.queryProductionVehicleByPage()
    },
    // 抽屉分页页码改变回调
    newPageChange (page) {
      this.newPage = page
      this.queryNewTypeByPage()
    },
    // 抽屉分页页码改变回调
    newProductPageChange (page) {
      this.newProducPage = page
      this.queryNewProductionByPage()
    },

    productPageSizeChange () {
      this.productPageSize = this.$store.getters.userInfo.configContent
      this.queryProductionVehicleByPage()
    },

    newPageSizeChange () {
      this.newPageSize = this.$store.getters.userInfo.configContent
      this.queryNewTypeByPage()
    },

    newProductPageSizeChange () {
      this.newProducPageSize = this.$store.getters.userInfo.configContent
      this.queryNewProductionByPage()
    },
    showStandDetails (item) {
      let getStandId = item.sarId
      let getStandType = item.sarType
      this.$http.get('lawss/sarMenu/judgeSarMenuByRole', {
        sarId: getStandId,
        sarType: getStandType
      }, {
        _this: this
      }, res => {
        if (res.ok) {
          let pageTpe = ''
          let id = ''
          let routename = ''
          if (getStandType === 'INLAND_STAND' || getStandType === 'FOREIGN_STAND') {
            if (this.$hasPermission('SSA6WR4HV8')) {
              pageTpe = getStandType
              id = getStandId
              routename = 'OtherStandardDetails'
            } else {
              this.$Message.warning('无权访问')
            }
          } else if (getStandType === 'INLAND_LAWS' || getStandType === 'FOREIGN_LAWS') {
            if (this.$hasPermission('A2HDHMEA6W')) {
              pageTpe = getStandType
              id = getStandId
              routename = 'OtherLawsDetails'
            } else {
              this.$Message.warning('无权访问')
            }
          } else if (getStandType === 'BUSSIONESS_STAND') {
            if (this.$hasPermission('YJUHC32R7G')) {
              pageTpe = 'BUSINESS_STAND'
              id = getStandId
              routename = 'OtherBussStandardDetails'
            } else {
              this.$Message.warning('无权访问')
            }
          }
          if (routename !== '') {
            let routeUrl = this.$router.resolve({
              name: routename,
              params: {
                id: id,
                pageType: pageTpe
              }
            })
            window.open(routeUrl.href, '_blank')
          }
        } else {
          this.$Message.error(res.message)
        }
      }, e => {
      })
    }
  },
  components: {},
  props: {},
  computed: {},
  watch: {},
  mounted () {
    this.queryProductionVehicleByPage()
    this.queryNewTypeByPage()
    this.queryNewProductionByPage()
  }
}
