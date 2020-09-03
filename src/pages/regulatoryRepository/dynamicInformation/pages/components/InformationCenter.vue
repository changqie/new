<!-- 标准法规库 - 动态&资料 - 资料中心更多 -->
<template>
  <div id="informationCenter">
    <panel-header :tabs="informationList" @activated="showComponent" :active="active" v-if="informationList.length" />
    <panel-content>
      <information-notice :id="active" :moduleName="moduleName"/>
    </panel-content>
  </div>
</template>

<script>
import InformationNotice from './pages/informationCenterPages/InformationNotice'
export default {
  name: 'InformationCenter',
  data () {
    return {
      active: '',
      moduleName: '',
      informationList: [],
      num: ''
    }
  },
  methods: {
    selectPages () {
      this.$http.get('lawss/msgModule/selectMsgModuleByRole', {
        id: this.$store.getters.userInfo.usid
      }, {
        _this: this
      }, res => {
        let array = []
        for (let i = 0; i < res.data.length; i++) {
          let dd = {}
          dd.title = res.data[i].moduleName
          dd.name = res.data[i].id
          array.push(dd)
        }
        this.informationList = array
        if (this.num === '') {
          this.active = array[0].name
        }
        this.moduleName = array[0].title
      }, e => {
      })
    },
    showComponent (id, title) {
      this.active = id
      this.moduleName = title
      this.$router.push({
        name: 'InformationCenter',
        params: {
          id: id
        }
      })
    },
    getCookie (name) {
      // 获取指定名称的cookie值
      // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
      let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
      if (arr != null) {
        return unescape(arr[2])
      }
      return null
    }
  },
  components: {
    InformationNotice
  },
  mounted () {
    this.selectPages()
    if (this.$route.params.id) {
      this.active = this.$route.params.id
      this.num = 1
    }
  }
}
</script>

<style lang="less">
 #informationCenter{
   height: 100%;
 }
</style>
