<template>
  <div id="app">
    <router-view v-if="!isBoolean"/>
    <div class="content-box" v-if="isBoolean">
      <nav-menu></nav-menu>
      <div class="sub-container">
        <com-header></com-header>
        <div class="container-box">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      isBoolean: false
    }
  },
  methods: {
    /**
     * @description: 主题设置
     * @author: xx
     * @date: 2018-08-29 14:56:39
     */
    setTheme (theme) {
      document.getElementById('app').className = theme
    }
  },
  computed: {
    ...mapGetters([
      'getWebSocketList', 'getTheme', 'getMenuList'
    ])
  },
  watch: {
    getTheme (val) {
      // 主题修改
      this.setTheme(val)
    },
    // 监听路由 控制isBoolean
    $route () {
      if (this.$route.name !== 'Login' && this.$route.name !== 'Home') {
        this.isBoolean = true
      } else {
        this.isBoolean = false
      }
    }
  },
  mounted () {
    this.setTheme(this.getTheme)
  }
}
</script>

<style lang="less">
  #app {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    & > div{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 100%;
    }
    .content-box{
      display: flex;
      .sub-container{
        flex: 1;
        overflow-x: auto;
        .container-box{
          position: relative;
          height: calc(~'100vh - 50px');
          background: #FFFFFF;
          overflow-y: auto;
        }
      }
    }
  }
</style>
