<!-- 标准法规库 - 动态&资料 - 资料中心更多 - 子组件 -->
<template>
 <div id="informationNotice">
   <table-tools-bar>
     <div slot="left">
       <div class="back" title="返回" @click="back">
         <Icon type="md-arrow-round-back"></Icon>
       </div>
       <span style="font-size: 18px;font-weight: bold">{{moduleName}}</span>
     </div>
     <div slot="right">
       <Form :model="informationCenter" inline class="label-input-form">
         <FormItem label="搜索" prop="internationalName">
           <Input v-model="informationCenter.informationNotice" clearable placeholder="请输入搜索内容" @keyup.enter.native="queryMsgByPageBtn"/>
         </FormItem>
         <Button type="primary" @click="queryMsgByPageBtn" icon="ios-search" title="搜索"></Button>
       </Form>
     </div>
   </table-tools-bar>
   <div class="content">
     <div class="dynamicsContent" v-if="inlandMsgList.length > 0">
       <div v-for="(item, index) in inlandMsgList" :key="index" @click="showMsgDetails(item.id)">
         <ul >
           <li class="title">
             <i v-show="isNew (item.pubTime)" class="i">new</i>
             <Icon type="md-arrow-dropright" />
             <span class="domestic-dynamic-title" :title="item.title">{{ item.title }}</span>
<!--               <div class="time">{{ $dateFormat(new Date(item.pubTime), 'yyyy-MM-dd') }}</div>-->
             <span class="time">{{ getDate(item.pubTime) }}</span>
           </li>
         </ul>
       </div>
     </div>
     <has-no-data pClass="content-detail" v-if="inlandMsgList.length === 0"></has-no-data>
     <loading :loading="loading">数据获取中……</loading>
     <pagination :total="total" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></pagination>
   </div>
 </div>
</template>

<script>
export default {
  name: 'informationNotice',
  data () {
    return {
      loading: false,
      informationCenter: {
        informationNotice: ''
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
    /**
     * @description: 截取日期
     * @author: chenxiaoxi
     * @date: 2018/10/31 09:30:40
     */
    getDate (date) {
      return date != null ? date.substring(0, date.indexOf(' ')) : ''
    },
    isNew (pubTime) {
      if (pubTime != null && pubTime !== '' && pubTime !== undefined) {
        pubTime = pubTime.replace(new RegExp(/-/gm), '/')
        return new Date().getTime() - new Date(pubTime).getTime() < 7 * 24 * 3600 * 1000
      } else {
        return ''
      }
    },
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
    // 搜索
    queryMsgByPageBtn () {
      this.page = 1
      this.queryMsgByPage()
    },
    queryMsgByPage () {
      this.MsgDynamicInfoEOPage.page = this.page
      this.MsgDynamicInfoEOPage.pageSize = this.$store.getters.userInfo.configContent
      this.MsgDynamicInfoEOPage.msgType = 'RESOURCE'
      this.MsgDynamicInfoEOPage.moduleName = this.id
      this.MsgDynamicInfoEOPage.title = this.informationCenter.informationNotice
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
    showMsgDetails (id) {
      if (this.$store.state.detailMap !== '') {
        let lastDetailMap = this.$store.getters.getLastDetailMap
        lastDetailMap.push(this.$store.state.detailMap)
        this.$store.commit('setLastDetailMap', JSON.stringify(lastDetailMap))
      }
      // this.$store.commit('setDetailMap', this.$route.path)
      let routeUrl = this.$router.resolve({
        name: 'DomesticDynamicsDetails',
        params: {
          id: id,
          pageType: 'RESOURCE_MSG'
        }
      })
      window.open(routeUrl.href, '_blank')
      // document.cookie = 'informationType=Infomation_Notice'
      // this.$store.commit('setDetailMap', this.$route.path)
      // this.$router.push({
      //   name: 'DomesticDynamicsDetails',
      //   params: {
      //     id: id,
      //     pageType: 'RESOURCE_MSG'
      //   }
      // })
    },
    // 查找、加载表格
    selectDynamics () {},
    // 分页
    pageChange (page) {
      this.page = page
    },
    pageSizeChange (pageSize) {
      this.rows = pageSize
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    moduleName: {
      type: String,
      required: true
    }
  },
  watch: {
    id (val) {
      this.queryMsgByPage()
    }
  },
  mounted () {
    // this.queryMsgByPage()
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/style';
  @import '~@/assets/styles/mixins';
   #informationNotice{
     padding: 0.2rem 0.3rem;
     .content{
       width: 100%;
       height: calc(~'100% - 120px');
       overflow-x:hidden !important;
       overflow-y: auto !important;
       .dynamicsContent{
         .new{
           position: absolute;
           top: 50%;
           left: 20px;
           color: #FF0000;
           font-style: italic;
           width: 20px;
           height: 20px;
           border-radius: 50%;
           font-size: 12px;
           .flex();
           justify-content: center;
           align-items: center;
           margin-top: -10px;
         }
       }
     }
     .content .content-detail {
       width: 100%;
       height: calc(~'100% - 8px');
       overflow-y: auto;
       padding: 0.1rem;
       background-color: white;
     }
     ul li .time{
       float: right;
       .flex();
       justify-content: flex-end;
     }
     ul li.title{
       line-height: 35px;
       padding-left: 50px;
       padding-right: 100px;
       cursor: pointer;
       position: relative;
       .flex();
       i{
         width: 15px;
         .flex();
         justify-content: center;
         align-items: center;
       }
       .domestic-dynamic-title{
         flex: 1;
         .ellipsis();
       }
     }
     ul li.title:hover{
       color:@baseColor;
       text-decoration:underline;
       font-weight:bold;
     }
     .i{
       font-style: italic;
       color: #E4393C;
       font-weight: bold;
       margin-right: 5px;
     }
     .ivu-form-item{
       margin-right: 0;
     }
   }
</style>
