/*header头部 面包屑、退出*/
<template>
  <div class="com-header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in routerList"
          :key="index"
        >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-dropdown
        trigger="click"
        @command="handleCommand"
      >
        <div class="user-box">
          <img :src="userAvator">
          <span>欢迎您，{{ this.$store.getters.userInfo.uName }}</span>
          <i class="el-icon-arrow-down"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="loginOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ComHeader',
  data () {
    return {
      routerList: [] // 面包屑数组
    }
  },
  created () {
    this.routerList = this.$route.matched
  },
  computed: {
    // 获取用户头像
    userAvator () {
      return this.$store.getters.userInfo.avator || require('@/assets/images/avator_default.png')
    }
  },
  methods: {
    // 点击下拉选项事件
    handleCommand (command) {
      // 退出登录
      if (command === 'loginOut') {
        this.$confirm('您确认要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('setTypeFlag', 'loginOut')
          this.$http.get('logout', {}, {
            _this: this
          }, res => {
            this.$store.dispatch('logout')
            this.$router.push('/login')
          }, e => {})
        }).catch(() => {
        })
      }
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
  .com-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 50px;
    background: #ffffff;
    border-bottom: 1px solid #e5e5e5;
    .header-right{
      .el-dropdown{
        .user-box{
          & > img{
            width: 25px;
          }
        }
        .user-box:hover{
          cursor: pointer;
        }
      }
    }
  }
</style>
