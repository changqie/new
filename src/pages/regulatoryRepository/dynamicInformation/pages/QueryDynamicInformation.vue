<!-- 标准法规库 - 动态&资料 - 本地动态搜索 -->
<template>
  <div id="queryDynamicInformation" class="v-class">
    <div class="query-dynamic-information-left">
      <div class="dynamic-search">
        <div class="dynamic-search-header">
          <div class="back" title="返回" @click="back">
            <i class="el-icon-back"></i>
          </div>
          <h5>本地动态搜索</h5>
        </div>
        <div class="dynamic-search-line"></div>
        <div class="dynamic-search-center">
          <el-form ref="dynamic" :modal="dynamic" class="dynamic-label-input-form">
            <el-form-item label="关键字" prop="keyWord">
              <el-input v-model="dynamic.keyWord" clearable placeholder="请输入查找关键字" :maxlength="100"/>
            </el-form-item>
            <el-form-item label="开始日期" prop="openData">
              <el-date-picker v-model="dynamic.openData" type="date" :editable="false" placeholder="请选择开始时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="closeData" class="top1px">
              <el-date-picker v-model="dynamic.closeData" type="date" :editable="false" placeholder="请选择结束开始"></el-date-picker>
            </el-form-item>
          </el-form>
          <el-button class="search-btn" type="primary" @click="querySearchWords">查询</el-button>
        </div>
      </div>
    </div>
    <div class="query-dynamic-information-right">
      <has-no-data pClass="substance" :tips="substanceTips" v-if="substance.length === 0"></has-no-data>
      <!-- 相关动态 -->
      <div class="substance" v-else>
        <div v-for="(sub, index) in substance" :key="index" @click="informationDetails(sub)">
          <div class="substance-title">
            <i class="el-icon-document-copy"/>
            <span :title="sub.title">{{ sub.title }}</span>
          </div>
          <div class="substance-date">
            <p>{{ sub.contentTxt }}</p>
            <span v-if="sub.pubTime != null && sub.pubTime !== ''">{{ $dateFormat(new Date(sub.pubTime), 'yyyy-MM-dd') }}</span>
          </div>
        </div>
        <loading :loading="loading">正在查找相关动态...</loading>
      </div>
      <pagination :total="total" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'QueryDynamicInformation',
  data () {
    return {
      // 头部搜索框
      dynamic: {
        keyWord: '',
        openData: '',
        closeData: ''
      },
      value11: '',
      substance: [],
      page: 1, // 当前页数
      total: 0, // 总条数
      loading: false,
      queryFlag: false, // 是否查找
      searchFlag: false
    }
  },
  methods: {
    queryKeyWords () {
      // let search = JSON.stringify(this.dynamic)
      let obj = {}
      obj.keyWord = this.dynamic.keyWord
      obj.openData = this.dynamic.openData !== '' ? this.$easyDateFormat(new Date(this.dynamic.openData)) : ''
      obj.closeData = this.dynamic.closeData !== '' ? this.$easyDateFormat(new Date(this.dynamic.closeData)) : ''
      let search = JSON.stringify(obj)
      this.$store.commit('setDynamicSearchHistory', search)
      this.queryFlag = true
      this.$http.get('lawss/msgDynamicInfo/page', {
        pubTime1: this.dynamic.openData !== '' ? this.$easyDateFormat(new Date(this.dynamic.openData)) : '',
        pubTime2: this.dynamic.closeData !== '' ? this.$easyDateFormat(new Date(this.dynamic.closeData)) : '',
        title: this.dynamic.keyWord,
        page: this.page,
        pageSize: this.$store.getters.userInfo.configContent
      }, {
        _this: this,
        loading: 'loading'
      }, res => {
        this.substance = res.data.list
        this.total = res.data.count
      }, e => {
      })
    },
    // 查询
    querySearchWords () {
      // this.page = 1
      this.queryKeyWords()
    },
    /**
     * @description:条件查找动态
     * @author: zhaochunfeng
     * @date: 2018/10/29 11:09:25
     */
    // 页码改变的回调
    pageChange (page) {
      this.page = page
      this.querySearchWords()
    },
    // 每页跳数改变回调
    pageSizeChange () {
      this.querySearchWords()
    },
    // 查看详情
    informationDetails (information) {
      if (information.msgType === 'RESOURCE') {
        this.$http.get('lawss/msgDynamicInfo/showDetailsByRole', {
          id: information.id
        }, {
          _this: this
        }, res => {
          if (res.data != null && res.data.length > 0) {
            this.$store.commit('setDetailMap', this.$route.path)
            this.$router.push({
              name: 'DynamicInformationDetails',
              params: {
                id: information.id,
                pageType: information.msgType + '_MSG'
              }
            })
          } else {
            this.$Message.error('当前角色无权限查看此信息')
          }
        }, e => {
        })
      } else {
        this.$store.commit('setDetailMap', this.$route.path)
        this.$router.push({
          name: 'DynamicInformationDetails',
          params: {
            id: information.id,
            pageType: information.msgType + '_MSG'
          }
        })
      }
    },
    // 返回
    back () {
      this.$router.push('/dynamicInformation')
    }
  },
  components: {},
  props: {},
  computed: {
    ...mapGetters(['getRoleModule']),
    // 查找提示
    substanceTips () {
      return this.queryFlag === true ? '未找到相关动态' : '请输入您的查找条件'
    }
  },
  watch: {
    '$route': {
      deep: true,
      handler (val) {
        this.queryFlag = false
      }
    },
    loading (val) {
      if (val) {
        $('.substance').css('overflow-y', 'hidden')
      } else {
        $('.substance').css('overflow-y', 'auto')
      }
    }
  },
  mounted () {
    this.dynamic.keyWord = this.$route.query.keywords
    this.dynamic.openData = this.$route.query.startTime
    this.dynamic.closeData = this.$route.query.endTime
    // 如果有一个条件不为空,则进行查找
    this.queryKeyWords()
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/styles/style';
  @import '~@/assets/styles/mixins';
  #queryDynamicInformation{
    .flex();
    padding: 15px;
    height: 100%;
    background: #ffffff;
    overflow-y: auto;
    .query-dynamic-information-left{
      .flex();
      justify-content: center;
      margin-right: 10px;
      width: 280px;
      .dynamic-search{
        width: 280px;
        .dynamic-search-header{
          .flex();
          padding-bottom: 5px;
          h5{
            flex: 1;
            padding-left: 5px;
          }
        }
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
      }
    }
    .query-dynamic-information-right{
      flex: 1;
      position: relative;
      height: 100%;
      border: 1px solid #DDD;
      border-radius: 5px;
      overflow-x: auto;
      .substance{
        position: relative;
        width: 100%;
        height: calc(~'100% - 57px');
        padding: 10px;
        font-size: 16px;
        overflow-y: auto;
        & > div{
          .flex();
          justify-content: space-between;
          .substance-title {
            display: flex;
            padding: 10px 5px;
            max-width: 80%;
            & > span{
              display: inline-block;
              margin-left: 3px;
              width: 100%;
              .ellipsis();
            }
          }
          .substance-title:hover{
            cursor: pointer;
            text-decoration: underline;
            color: @baseColor;
          }
        }
      }
    }
  }
</style>
