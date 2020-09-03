<!-- 标准法规库 - 动态&资料 - 动态信息详情页 -->
<template>
  <div id="dynamicInformationDetails" class="v-class">
    <!--<h2 class="head">{{ information.title }}</h2>-->
    <div class="contentTitle">
      <div class="back" title="返回" @click="back">
        <i class="el-icon-back"></i>
      </div>
      <div class="title" :title="information.title">{{information.title}}</div>
    </div>
    <div class="contentOrigin">
      <span class="spanRight">发布时间:{{ getDate(information.pubTime) }}</span>
      <span class="spanCenter" >发布机构:{{ information.pubOrg }}</span>
      <span>浏览数：{{ countCookie }}</span>
      <span>
        <i class="el-icon-star-off" v-show="collectBtn" @click="collectLawsInfo()" style="margin-right:5px; cursor: pointer"></i>
        <i class="el-icon-star-on" v-show="cancelCollectBtn" @click="cancelCollectLawsInfo()" style="margin-right:5px;cursor: pointer"></i>
        <i class="el-icon-paperclip" style="cursor: pointer" @click="shareStandard()"></i>
      </span>
    </div>
    <loading :loading="loading">页面加载中...</loading>
    <div class="msgContent" v-html="information.content"></div>
    <div class="fileContent" v-if="fileList.length > 0">
      <div class="fileContent" v-for="(item, index) in fileList" :key="index">
        <span>附件{{ index+1 }}：</span>
        <a @click="downloadFile(item.attId)">{{ item.originFileName }}</a>
      </div>
    </div>
    <div class="linkContent">
      <div v-if="linkUri != null && linkUri !== ''">
        <span>相关链接：</span>
        <a @click="openLinkUrl(linkUri)">{{ linkUri }}</a>
      </div>
    </div>
    <el-dialog title="请选择要分享的人" :visible.sync="shareStandardModal" :closable="false" width="360">
      <!--multiple-->
      <el-select v-model="shareStandardSelect" style="width:200px" multiple>
        <el-option v-for="shareUser in shareUserInfoList" :value="shareUser.usid" :key="shareUser.usid">{{
          shareUser.account }}
        </el-option>
      </el-select>
      <div slot="footer">
        <el-button type="text" size="large" @click="shareStandardModal=false">取消</el-button>
        <el-button type="primary" size="large" @click="shareStandardBt">确定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="分享动态信息"
      :visible.sync="drawerModal"
      width="300"
      @close="cancelShareLaws"
    >
      <dept-tree
        treeDivId="drawerModalTree"
        ref="drawerModalTree"
        @treeClick="selcetShareLawsTree"
        allDept
        showUser
        :editable="false"
        style="padding: 0 15px">
      </dept-tree>
      <div class="demo-drawer-footer">
        <el-button style="margin-right: 8px" @click="cancelShareLaws">取消</el-button>
        <el-button type="primary" @click="shareStandardBt">确定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'DynamicInformationDetails',
  data () {
    return {
      // 动态详情
      information: {
        title: '',
        pubUserName: '',
        pubOrg: '',
        pubTime: '',
        content: ''
      },
      linkUri: '',
      uploadPath: 'uploadPath',
      resPk: '',
      fileList: [],
      picList: [],
      shareUserInfoList: [],
      shareStandardSelect: [],
      collectBtn: false,
      cancelCollectBtn: false,
      shareStandardModal: false,
      personCollect: {
        collectResId: '',
        collectTitle: '',
        collectType: ''
      },
      personCookieEO: {
        cookieType: '',
        resTitle: '',
        resId: ''
      },
      // 消息推送保存对象
      personShareEO: {
        id: '',
        recipientId: '',
        shareUserId: '',
        resType: '',
        resId: '',
        resUri: '',
        resTitle: '',
        readFlag: '',
        validFlag: '',
        modifyTime: '',
        creationTime: ''
      },
      countCookie: 0,
      msgDetails: {},
      drawerModal: false,
      loading: false
    }
  },
  methods: {
    // 返回
    back () {
      this.$router.push({
        path: '/queryDynamicInformation',
        query: {
          keywords: this.$store.getters.getDynamicHistory.keyWord,
          startTime: this.$store.getters.getDynamicHistory.openData,
          endTime: this.$store.getters.getDynamicHistory.closeData
        }
      })
    },
    queryMsgDetailsById () {
      let id = this.$route.params.id
      this.$http.get('lawss/msgDynamicInfo/selectByMsgId', {
        id: id
      }, {
        _this: this
      }, res => {
        this.information.title = res.data.title
        this.information.pubTime = res.data.pubTime
        this.information.pubUserName = res.data.pubUserName
        this.information.pubOrg = res.data.pubOrg
        this.information.content = res.data.content
        this.linkUri = res.data.linkUri
        if (res.data.getFileList != null) {
          this.fileList = res.data.getFileList
        }
        if (res.data.getPicList != null) {
          this.picList = res.data.getPicList
        }
        if (res.data.collectId != null && res.data.collectId !== '') {
          this.collectBtn = false
          this.cancelCollectBtn = true
        } else {
          this.collectBtn = true
          this.cancelCollectBtn = false
        }
        // 设置浏览次数
        this.countPageCookie().then(count => {
          this.countCookie = count
          this.msgDetails = res.data
          this.addPersonCookie()
        }, e => {
        })
      }, e => {
      })
    },
    openLinkUrl (linkUri) {
      let getHttp = linkUri.substring(0, 7)
      let getHttps = linkUri.substring(0, 8)
      if (getHttp === 'http://' || getHttps === 'https://') {
        window.open(linkUri)
      } else {
        window.open('https://' + linkUri)
      }
    },
    // 时间截取
    getDate (date) {
      return date !== undefined && date != null ? date.split(' ')[0] : ''
    },
    downloadFile (attId) {
      if (attId != null && attId !== '') {
        window.location.href = '/api/att/attFile/downloadFile?fileId=' + attId
      } else {
        this.$message.error('请选择要下载的文件')
      }
    },
    // 新增浏览记录
    addPersonCookie () {
      this.personCookieEO.cookieType = this.$route.params.pageType
      this.personCookieEO.resTitle = this.information.title
      this.personCookieEO.resId = this.$route.params.id
      this.$http.postData('person/personCookies/create', this.personCookieEO, {
        _this: this
      }, res => {}, e => {
      })
    },
    // 统计浏览总数
    countPageCookie () {
      return new Promise((resolve, reject) => {
        this.$http.get('person/personCookies/countPageCookie', {
          resId: this.$route.params.id
        }, {
          _this: this,
          loading: 'loading'
        }, res => {
          resolve(res.data)
        }, e => {
          reject(e)
        })
      })
    },
    // 收藏动态信息
    collectLawsInfo () {
      this.personCollect.collectResId = this.msgDetails.id
      this.personCollect.collectTitle = this.msgDetails.title
      if (this.msgDetails.msgType === 'INLAND') {
        this.personCollect.collectType = 'INLAND_MSG'
      } else if (this.msgDetails.msgType === 'FOREIGN') {
        this.personCollect.collectType = 'FOREIGN_MSG'
      } else {
        this.personCollect.collectType = 'RESOURCE_MSG'
      }
      this.$http.postData('person/personCollect', this.personCollect, {
        _this: this
      }, res => {
        this.collectBtn = false
        this.cancelCollectBtn = true
        this.msgDetails.collectId = res.data.id
      }, e => {
      })
    },
    // 取消收藏
    cancelCollectLawsInfo () {
      this.$http.put('person/personCollect/updateByUserId', {
        id: this.msgDetails.collectId
      }, {
        _this: this
      }, res => {
        this.collectBtn = true
        this.cancelCollectBtn = false
        this.msgDetails.collectId = ''
      }, e => {
      })
    },
    // 转发
    cancelShareLaws () {
      this.drawerModal = false
      this.$refs.drawerModalTree.treeReload()
    },
    // 树点击
    selcetShareLawsTree (treeId, treeNode) {
      this.shareStandardSelect = treeNode.id
    },
    // 点击分享图标
    shareStandard (item) {
      this.resPk = item
      this.drawerModal = true
      this.$nextTick(() => {
        this.$refs.drawerModalTree.clearSearch()
      })
      this.shareStandardSelect = ''
    },
    shareStandardBt () {
      this.personShareEO.resType = this.$route.params.pageType
      this.personShareEO.resTitle = this.information.title
      this.personShareEO.resId = this.$route.params.id
      this.personShareEO.recipientId = this.shareStandardSelect
      if (this.personShareEO.recipientId == null || this.personShareEO.recipientId === '') {
        this.$message.error('请选择要分享的人!')
      } else {
        this.$http.post('/person/personShare/savePersonShare', this.personShareEO, {
          _this: this
        }, res => {
          this.drawerModal = false
          this.$message.success('消息推送成功!')
          this.$refs.drawerModalTree.treeReload()
        }, e => {
          this.$message.error('消息推送失败!')
        })
      }
    }
  },
  components: {
  },
  props: {},
  computed: {},
  watch: {},
  mounted () {
    //  this.information = JSON.parse(this.$route.params.information)
    this.queryMsgDetailsById()
  }
}

</script>

<style lang="less">
  @import '~@/assets/styles/style';
  @import '~@/assets/styles/mixins';
  #dynamicInformationDetails{
    padding: 15px;
    height: 100%;
    font-size: 16px;
    background: #ffffff;
    overflow-y: auto !important;
    .contentTitle{
      .flex();
      align-items: center;
      .title{
        width: calc(~'100% - 50px');
        font-weight: bold;
        font-size: 25px;
        text-align: center;
        padding: 0 20px;
        .ellipsis();
      }
    }
    .spanLeft,.spanRight,.spanCenter{
      display: inline-block;
    }
    .spanLeft{
      float: left;
      span{
        display: inline-block;
        margin-top: 10px;
        margin-left: 5px;
        margin-right: 5px;
        font-weight: bold;
        &:hover{
          color: @baseColor;
          cursor: pointer;
        }
      }
    }
    .spanCenter{
      display: inline-block;
      text-align: center;
      margin-left: 81px;
    }
    .spanRight{
      span{
        display: inline-block;
        margin-top: 10px;
        margin-left: 5px;
        margin-right: 5px;
        font-weight: bold;
      }
    }
    .msgContent{
      margin-bottom: 20px;
      font-size: 16px;
      padding: 10px;
      img{
        max-width: calc(~'100% - 4em') !important;
      }
      p{
        padding: 0 5px !important;
      }
      table {
        width: 100%;
        padding: 0 20px;
      }
    }
    .contentOrigin{
      display: flex;
      justify-content: space-evenly;
      padding: 0 50px;
      margin: 20px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background-color: #d8f1ff;
    }
    .divSpanCenter{
      text-align: center;
      margin-bottom: 20px;
      background-color: #d8f1ff;
      height: 30px;
      line-height: 30px;
    }
    /*hr{*/
      /*clear: both;*/
      /*background-color: #5596CC;*/
      /*height: 3px;*/
    /*}*/
    /*div{*/
      /*.spanTop{*/
        /*margin-top: 50px;*/
      /*}*/
    /*}*/
  }
</style>
