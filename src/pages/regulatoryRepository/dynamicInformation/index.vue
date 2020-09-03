<!-- 标准法规库 - 动态&资料 -->
<template>
  <div id="dynamicInformation" class="dynamic-information v-class">
    <div class="dynamic-header">
      <div class="dynamic-header-left">
        <div class="wrapper">
          <el-carousel
            ref="mySwiper"
            v-if="showSwiper"
          >
            <el-carousel-item v-for="(item, index) in imgInformationList" :key="index" :title="item.title">
              <img @click.stop="swiperClick(index)" class="swiper-img" :src="'uploadPath' + item.attPath" />
            </el-carousel-item>
            <div class="swiper-pagination" slot="pagination"></div>
          </el-carousel>
        </div>
      </div>
      <div class="dynamic-header-right">
        <div class="dynamic-search">
          <h5>本地动态搜索</h5>
          <div class="dynamic-search-line"></div>
          <div class="dynamic-search-center">
            <el-form ref="dynamic" :model="dynamic" :rules="dynamicFormRules" class="dynamic-label-input-form">
              <el-form-item label="关键字" prop="keyWord" class="form-content-top1px">
                <el-input
                  v-model="dynamic.keyWord"
                  placeholder="请输入查找关键字"
                  :maxlength="100"
                />
              </el-form-item>
              <el-form-item label="开始日期" prop="openData">
                <el-date-picker
                  v-model="dynamic.openData"
                  type="date"
                  :editable="false"
                  placeholder="请选择开始时间"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="结束日期" prop="closeData">
                <el-date-picker
                  v-model="dynamic.closeData"
                  type="date"
                  :editable="false"
                  placeholder="请选择结束时间"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <el-button class="search-btn" type="primary" @click="queryDynamicInformation('dynamic')">查询</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="dynamic-content">
      <!-- 国内动态 -->
      <div class="dynamic">
        <div class="dynamic-content">
          <h5>国内动态</h5>
          <div class="dynamic-line"></div>
          <span class="more" @click="dynamicDomestic">更多</span>
          <div class="dynamic-loop-container">
            <div class="dynamic-loop" v-for="(item1, index1) in inlandMsgList" :key="index1" @click="showMsgDetails(item1.id, 'INLAND_MSG')">
              <div class="domestic-loop-header">
                <i v-show="isNew (item1.pubTime)" class="newI">new</i>
                <i class="el-icon-notebook-2" />
                <span class="domestic-title" :title="item1.title">{{ item1.title }}</span>
                <span class="time">{{ getDate(item1.pubTime) }}</span>
              </div>
            </div>
            <loading :loading="loading.inlandLoading">正在获取动态...</loading>
          </div>
        </div>
      </div>
      <!-- 国外动态 -->
      <div class="dynamic">
        <div class="dynamic-content">
          <h5>国外动态</h5>
          <div class="dynamic-line"></div>
          <span class="more" @click="dynamicInternational">更多</span>
          <div class="dynamic-loop-container">
            <div class="dynamic-loop" v-for="(item2, index2) in foreignMsgList" :key="index2" @click="showMsgDetails(item2.id, 'FOREIGN_MSG')">
              <div class="domestic-loop-header">
                <i v-show="isNew (item2.pubTime)" class="newI">new</i>
                <i class="el-icon-notebook-2" />
                <span class="domestic-title" :title="item2.title">{{ item2.title }}</span>
                <span class="time">{{ getDate(item2.pubTime) }}</span>
              </div>
            </div>
            <loading :loading="loading.foreignLoading">正在获取动态...</loading>
          </div>
        </div>
      </div>
      <!-- 资料中心 -->
      <div class="dynamic">
        <div class="dynamic-content">
          <h5>资料中心</h5>
          <div class="dynamic-line"></div>
          <span class="more" @click="informationCenter">更多</span>
          <div class="dynamic-loop-container">
            <div class="dynamic-loop" v-for="(item3, index3) in resourceMsgList" :key="index3" @click="showDynmicMsgDetails(item3)">
              <div class="domestic-loop-header">
                <i v-show="isNew (item3.pubTime)" class="newI">new</i>
                <i class="el-icon-notebook-2" />
                <span class="domestic-title" :title="item3.title">{{ item3.title }}</span>
                <span class="time">{{ getDate(item3.pubTime) }}</span>
              </div>
            </div>
            <loading :loading="loading.resourceLoading">正在获取动态...</loading>
          </div>
        </div>
      </div>
      <!-- 实施预警 -->
      <div class="dynamic">
        <div class="dynamic-content">
          <h5>实施预警</h5>
          <div class="dynamic-line"></div>
          <span class="more" @click="dynamicWarning">更多</span>
          <div class="content" style="height: 100%">
            <el-divider content-position="left" class="dynamic-child-title">在产车型预警</el-divider>
            <el-table
              :data="productionVehicleDatas"
              height="200px"
              border
              :resizable="false"
              :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
            >
              <el-table-column
                prop="sortName"
                label="类型"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.sortName === 'BUSINESS_STAND'">企业标准</div>
                  <div v-if="scope.row.sortName === 'FOREIGN_STAND'">国外标准法规</div>
                  <div v-if="scope.row.sortName === 'INLAND_STAND'">国内标准法规</div>
                  <div v-if="scope.row.sortName === 'INLAND_LAWS'">国内政策</div>
                  <div v-if="scope.row.sortName === 'FOREIGN_LAWS'">国外政策</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="standNum"
                label="编号"
                align="center"
              >
                <template slot-scope="scope">
                  <div @click="showStandDetails(scope.row)">{{ scope.row.standNum }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="standName"
                label="标准名称"
                align="center"
              >
                <template slot-scope="scope">
                  <div @click="showStandDetails(scope.row)">{{ scope.row.standName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="putTime"
                label="在产车实施日期"
                align="center"
              ></el-table-column>
            </el-table>
            <el-divider content-position="left" class="dynamic-child-title">新定型车预警</el-divider>
            <el-table
              :data="newTypeDatas"
              height="200px"
              border
              :resizable="false"
              :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
            >
              <el-table-column
                prop="sortName"
                label="类型"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.sortName === 'BUSINESS_STAND'">企业标准</div>
                  <div v-if="scope.row.sortName === 'FOREIGN_STAND'">国外标准法规</div>
                  <div v-if="scope.row.sortName === 'INLAND_STAND'">国内标准法规</div>
                  <div v-if="scope.row.sortName === 'INLAND_LAWS'">国内政策</div>
                  <div v-if="scope.row.sortName === 'FOREIGN_LAWS'">国外政策</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="standNum"
                label="编号"
                align="center"
              >
                <template slot-scope="scope">
                  <div @click="showStandDetails(scope.row)">{{ scope.row.standNum }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="standName"
                label="标准名称"
                align="center"
              >
                <template slot-scope="scope">
                  <div @click="showStandDetails(scope.row)">{{ scope.row.standName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="putTime"
                label="新定型车实施日期"
                align="center"
              ></el-table-column>
            </el-table>
            <el-divider content-position="left" class="dynamic-child-title">新生产车预警</el-divider>
            <el-table
              :data="newProductionDatas"
              height="200px"
              border
              :resizable="false"
              :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
            >
              <el-table-column
                prop="sortName"
                label="类型"
                align="center"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.sortName === 'BUSINESS_STAND'">企业标准</div>
                  <div v-if="scope.row.sortName === 'FOREIGN_STAND'">国外标准法规</div>
                  <div v-if="scope.row.sortName === 'INLAND_STAND'">国内标准法规</div>
                  <div v-if="scope.row.sortName === 'INLAND_LAWS'">国内政策</div>
                  <div v-if="scope.row.sortName === 'FOREIGN_LAWS'">国外政策</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="standNum"
                label="编号"
                align="center"
              >
                <template slot-scope="scope">
                  <div @click="showStandDetails(scope.row)">{{ scope.row.standNum }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="standName"
                label="标准名称"
                align="center"
              >
                <template slot-scope="scope">
                  <div @click="showStandDetails(scope.row)">{{ scope.row.standName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="putTime"
                label="新生产车实施日期"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <adc-back-top scroll-bind="dynamicInformation"></adc-back-top>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'DynamicInformation',
  data () {
    return {
      // 头部搜索框
      dynamic: {
        keyWord: '',
        openData: '',
        closeData: ''
      },
      MsgInterInfoEOPage: {
        msgType: ''
      },
      MsgDynamicInfoEOPage: {
        msgType: ''
      },
      MsgResourceInfoEOPage: {
        msgType: ''
      },
      productionVehicleDatas: [],
      newTypeDatas: [],
      newProductionDatas: [],
      inlandMsgList: [],
      foreignMsgList: [],
      resourceMsgList: [],
      // 轮播图
      carouselValue1: 0,
      // 有图片的动态信息列表
      imgInformationList: [],
      // 轮播图宽度
      carouselImgWidth: 0,
      // loading
      loading: {
        inlandLoading: false,
        foreignLoading: false,
        resourceLoading: false
      },
      roleModuleList: [],
      // 轮播索引
      swiperIndex: -1,
      dynamicFormRules: {
        keyWord: [
          { type: 'string', max: 100, message: '关键字长度不能超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * @author liruohao
     * @date 2019/4/25
     * @Description: 标准跳页
     */
    // showStandDetails (item) {
    //   this.$store.commit('setDetailMap', this.$route.path)
    //   if (item.sortName === 'BUSINESS_STAND') {
    //     let routeUrl = this.$router.resolve({
    //       name: 'OtherBussStandardDetails',
    //       params: {
    //         id: item.sarId,
    //         pageType: item.sortName
    //       }
    //     })
    //     window.open(routeUrl.href, '_blank')
    //   } else if (item.sortName === 'INLAND_STAND' || item.sortName === 'FOREIGN_STAND') {
    //     let routeUrl = this.$router.resolve({
    //       name: 'OtherStandardDetails',
    //       params: {
    //         id: item.sarId,
    //         pageType: item.sortName
    //       }
    //     })
    //     window.open(routeUrl.href, '_blank')
    //   } else if (item.sortName === 'INLAND_LAWS' || item.sortName === 'FOREIGN_LAWS') {
    //     let routeUrl = this.$router.resolve({
    //       name: 'OtherLawsDetails',
    //       params: {
    //         id: item.sarId,
    //         pageType: item.sortName
    //       }
    //     })
    //     window.open(routeUrl.href, '_blank')
    //   }
    // },
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
              this.$message.warning('无权访问')
            }
          } else if (getStandType === 'INLAND_LAWS' || getStandType === 'FOREIGN_LAWS') {
            if (this.$hasPermission('A2HDHMEA6W')) {
              pageTpe = getStandType
              id = getStandId
              routename = 'OtherLawsDetails'
            } else {
              this.$message.warning('无权访问')
            }
          } else if (getStandType === 'BUSSIONESS_STAND') {
            if (this.$hasPermission('YJUHC32R7G')) {
              pageTpe = 'BUSINESS_STAND'
              id = getStandId
              routename = 'OtherBussStandardDetails'
            } else {
              this.$message.warning('无权访问')
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
          this.$message.error(res.message)
        }
      }, e => {
      })
    },
    // 获取国内动态
    queryMsgByPage () {
      this.MsgDynamicInfoEOPage.msgType = 'INLAND'
      this.MsgDynamicInfoEOPage.rowLimit = 10
      this.$http.get('lawss/msgDynamicInfo/page', this.MsgDynamicInfoEOPage, {
        _this: this,
        loading: 'loading.inlandLoading'
      }, res => {
        this.inlandMsgList = res.data.list
      }, e => {
      })
    },
    // 国内动态更多查看
    dynamicDomestic () {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({
        name: 'DomesticDynamics'
      })
    },
    // 国际动态更多查看
    dynamicInternational () {
      this.$router.push({
        name: 'InternationalDynamics'
      })
    },

    // 获取国外动态
    queryForeignMsgByPage () {
      this.MsgInterInfoEOPage.msgType = 'FOREIGN'
      this.MsgInterInfoEOPage.rowLimit = 10
      this.$http.get('lawss/msgDynamicInfo/page', this.MsgInterInfoEOPage, {
        _this: this,
        loading: 'loading.foreignLoading'
      }, res => {
        this.foreignMsgList = res.data.list
      }, e => {
      })
    },
    // 资料中心更多查看
    informationCenter () {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({
        name: 'InformationCenter'
      })
    },
    // 实施预警更多查看
    dynamicWarning () {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({
        name: 'ImplementWarning'
      })
    },
    // 获取资料中心
    queryResourceMsgByPage () {
      this.MsgResourceInfoEOPage.msgType = 'RESOURCE'
      this.MsgResourceInfoEOPage.rowLimit = 10
      this.$http.get('lawss/msgDynamicInfo/page', this.MsgResourceInfoEOPage, {
        _this: this,
        loading: 'loading.resourceLoading'
      }, res => {
        this.resourceMsgList = res.data.list
      }, e => {
      })
    },
    showMsgDetails (id, pageType) {
      this.$store.commit('setDetailMap', this.$route.path)
      this.$router.push({
        name: 'DomesticDynamicsDetails',
        params: {
          id: id,
          pageType: pageType
        }
      })
    },
    showDynmicMsgDetails (item) {
      let isContains = 0
      if (this.roleModuleList != null && this.roleModuleList.length > 0) {
        for (let module in this.roleModuleList) {
          if (this.roleModuleList[module].id === item.msgMode) {
            isContains = 1
            break
          }
        }
        if (isContains === 1) {
          this.$store.commit('setDetailMap', this.$route.path)
          this.$router.push({
            name: 'DomesticDynamicsDetails',
            params: {
              id: item.id,
              pageType: item.msgType + '_MSG'
            }
          })
        } else {
          this.$message.error('当前角色无权限查看此信息')
        }
      } else {
        this.$message.error('当前角色无权限查看此信息')
      }
    },
    queryProductionVehicleByPage () {
      this.$http.get('lawss/msgSarPutTime/page', {
        sarPutType: 'PRODUCT',
        pageSize: 5
      }, {
        _this: this
      }, res => {
        this.productionVehicleDatas = res.data.list
      }, e => {
      })
    },
    queryNewTypeByPage () {
      this.$http.get('lawss/msgSarPutTime/page', {
        sarPutType: 'NEWCAR',
        pageSize: 5
      }, {
        _this: this
      }, res => {
        this.newTypeDatas = res.data.list
      }, e => {
      })
    },
    queryNewProductionByPage () {
      this.$http.get('lawss/msgSarPutTime/page', {
        sarPutType: 'NEWPRODUCT',
        pageSize: 5
      }, {
        _this: this
      }, res => {
        this.newProductionDatas = res.data.list
      }, e => {
      })
    },
    /**
     * @description: 本地动态搜索
     * @author: chenxiaoxi
     * @date: 2018/10/19 15:15:30
     */
    queryDynamicInformation (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push({
            name: 'QueryDynamicInformation',
            query: {
              keywords: this.dynamic.keyWord,
              startTime: this.dynamic.openData !== '' ? this.dateFormat(this.dynamic.openData) : '',
              endTime: this.dynamic.closeData !== '' ? this.dateFormat(this.dynamic.closeData) : ''
            }
          })
        } else {
          this.$message.error('请检查表单是否填写正确')
        }
      })
    },
    // 获取轮播图
    getHorseLantern () {
      this.$http.get('lawss/msgDynamicInfo/queryNewsPic', {
        rowLimit: 5
      }, {
        _this: this
      }, res => {
        this.imgInformationList = res.data.list
      }, e => {
      })
    },

    /**
     * @description: 查看图片信息详情
     * @author: chenxiaoxi
     * @date: 2018/10/26 14:08:38
     */
    imgInformationDetail (information) {
      this.setDetailMap(this.$route.path)
      this.$router.push({
        name: 'DomesticDynamicsDetails',
        params: {
          id: information.id,
          pageType: information.msgType
        }
      })
    },
    isNew (pubTime) {
      if (pubTime != null && pubTime !== '' && pubTime !== undefined) {
        pubTime = pubTime.replace(new RegExp(/-/gm), '/')
        return new Date().getTime() - new Date(pubTime).getTime() < 7 * 24 * 3600 * 1000
      } else {
        return ''
      }
    },
    /**
     * @description: 日期转换
     * @author: chenxiaoxi
     * @date: 2018/11/01 10:20:12
     */
    dateFormat (date) {
      let year = new Date(date).getFullYear()
      let month = new Date(date).getMonth() + 1
      let day = new Date(date).getDate()
      return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
    },
    getDate (date) {
      return date !== undefined && date != null ? date.split(' ')[0] : ''
    },
    /**
     * @description: 轮播点击
     * @author: chenxiaoxi
     * @date: 2018/11/10 13:22:15
     */
    swiperClick (index) {
      if (index === 6 || index === 0) {
        this.imgInformationDetail(this.imgInformationList[0])
      } else {
        this.imgInformationDetail(this.imgInformationList[index - 1])
      }
    },
    // 查询当前登录人拥有的全部模块权限
    showRoleModules () {
      this.$http.get('lawss/msgModule/selectMsgModuleByRole', {}, {_this: this}, res => {
        if (res.data) {
          this.roleModuleList = res.data
        }
      })
    },
    ...mapMutations(['setDetailMap'])
  },
  props: {
    reload: {
      type: Boolean
    }
  },
  computed: {
    showSwiper () {
      return this.imgInformationList.length
    }
  },
  watch: {
  },
  mounted () {
    this.queryMsgByPage()
    this.queryForeignMsgByPage()
    this.queryResourceMsgByPage()
    this.queryProductionVehicleByPage()
    this.queryNewTypeByPage()
    this.queryNewProductionByPage()
    this.showRoleModules()
    this.getHorseLantern()
    for (let key in this.dynamic) {
      this.dynamic[key] = ''
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/style';
  @import '~@/assets/styles/mixins';
  #dynamicInformation{
    padding: 25px;
    width: 100%;
    height: 100%;
    background: #ffffff;
    overflow-y: auto;
    .dynamic-header{
      height: 300px;
      background: @homeSectionBgColor;
      .dynamic-header-left{
        width: 750px;
        height: 100%;
        border-right: 1px solid #DDD;
        float: left;
        background: #EEE;
        .wrapper{
          overflow: hidden;
          width: 100%;
          max-width: 750px;
          margin: 0 auto;
          height: 100%;
          background: #EEE;
          cursor: pointer;
          border: 1px solid #EEE;
          border-right: none;
          .swiper-pagination{
            .swiper-pagination-bullet{
              width: 10px;
              height: 10px;
              outline: none;
              &:hover{
                cursor: pointer;
              }
              &.swiper-pagination-bullet-active{
                background: #FFF;
              }
            }
          }
          .swiper-container{
            height: 100%;
            .swiper-img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .dynamic-header-right{
        padding: 10px;
        float: left;
        .flex();
        justify-content: center;
        align-items: center;
        width: calc(~'100% - 750px');
        height: 100%;
        .dynamic-search{
          width: 300px;
          .dynamic-search-line{
            width: 100%;
            height: 4px;
            background: @boxBgColor;
            margin-bottom: 5px;
          }
          .dynamic-search-center{
            .search-btn{
              padding: 0;
              width: 100%;
              height: 32px;
              font-size: 12px;
            }
          }
          h5{
            font-size: 18px;
            line-height: 30px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-weight: 600;
          }
          .dynamic-label-input-form{
            .el-form-item{
              margin-bottom: 5px;
            }
          }
        }
      }
      @media screen and (min-width: 1920px) {
        .dynamic-header-left{
          width: 1200px;
        }
        .dynamic-header-right{
          width: calc(~'100% - 1200px');
        }
      }
    }
    .dynamic-content{
      width: 100%;
      position: relative;
      .dynamic{
        width: 100%;
        height: 100%;
        .dynamic-content{
          padding: 25px;
          h5{
            margin-left: 20px;
            font-size: 18px;
            line-height: 30px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-weight: 600;
          }
          .dynamic-line{
            width: 100%;
            height: 4px;
            background: @boxBgColor;
            margin-bottom: 5px;
          }
          .more{
            cursor: pointer;
            color: #12508E;
            position: absolute;
            top: 25px;
            right: 25px;
            z-index: 100;
            padding: 5px 10px;
            &:hover{
              color: #FFF;
              background: #12508E;
              transition: all .2s linear;
            }
          }
          .dynamic-loop-container{
            position: relative;
            min-height: 160px;
            .dynamic-loop{
              cursor:pointer;
              width: 100%;
              padding: 5px 18px;
              &:hover{
                .domestic-loop-header{
                  color: @baseColor;
                }
                .loop-content-left{
                  text-decoration: underline;
                  color: @baseColor;
                }
              }
              .domestic-loop-header{
                font-size: 15px;
                height: 20px;
                line-height: 20px;
                .flex();
                align-items: center;
                .domestic-title{
                  max-width: 80%;
                  .ellipsis();
                }
              }
              .newInformation{
                color: #E4393C;
              }
              .time{
                position: absolute;
                right: 0.1rem;
                //top: 0;
              }
              .newI{
                font-style: italic;
                color: #E4393C;
                font-weight: bold;
                margin-right: 5px;
              }
              .domestic-loop-content{
                width: 100%;
                height: 20px;
                line-height: 20px;
                .flex();
                .loop-content-left{
                  padding-left: 30px;
                  flex: 1;
                  overflow: hidden;
                  .left-content{
                    width: 100%;
                    p{
                      .ellipsis()
                    }
                  }
                }
                .loop-content-right{
                  width: 150px;
                  .flex();
                  justify-content: flex-end;
                }
              }
            }
          }
        }
      }
      .dynamic-child-title{
        color: #515a6e;
      }
    }
  }
</style>
