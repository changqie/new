<!-- loading组件 liuyan -->
<template>
  <div class="loading-box" v-if="loading">
    <div class="loading-content">
      <i class="i-icon icon-icon-loading spin-loading"></i>
      <div class="loading-tips">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'local-loading',
  props: {
    // 是否显示隐藏
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
  .loading-box{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    .loading-content{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #3391CE;
      text-align: center;
      .loading-tips{
        margin-top: 5px;
      }
    }
  }
</style>
