<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
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
    & > div{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
