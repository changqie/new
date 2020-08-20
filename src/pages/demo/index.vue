<!-- demo页面 liuyan -->
<template>
  <div class="demo v-class main">
    <nav-menu></nav-menu>
    <div class="sub-container">
      <com-header></com-header>
      <div class="container-box">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Demo',
  data () {
    return {
      //
    }
  }
}
</script>
<style lang="less" scoped>
  .demo{
  }
</style>
