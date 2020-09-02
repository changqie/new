<!-- 回到顶部 -->
<template>
  <div class="back-top" v-if="visibleBackTop">
    <i class="el-icon-arrow-up" @click="scrollTop" />
  </div>
</template>

<script>
export default {
  name: 'back-top',
  data () {
    return {
      visibleBackTop: false,
      scrollDom: null
    }
  },
  methods: {
    // 滚动监听
    handleScroll () {
      const scrollTop = this.windowScroll ? document.documentElement.scrollTop : this.scrollDom.scrollTop
      if (scrollTop > 200) {
        this.visibleBackTop = true
      } else {
        this.visibleBackTop = false
      }
    },
    // 回到顶部
    scrollTop () {
      this.scrollAnimation(this.windowScroll ? document.documentElement.scrollTop : this.scrollDom.scrollTop, 0)
    },
    scrollAnimation (currentY, targetY) {
      // 计算需要移动的距离
      let needScrollTop = targetY - currentY
      let _currentY = currentY
      setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 10)
        _currentY += dist
        this.scrollDom.scrollTo(_currentY, currentY)
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 10 || needScrollTop < -10) {
          this.scrollAnimation(_currentY, targetY)
        } else {
          this.scrollDom.scrollTo(_currentY, targetY)
        }
      }, 1)
    }
  },
  components: {},
  props: {
    scrollBind: {
      type: String,
      required: true
    },
    // 全屏滚动监听
    windowScroll: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {},
  mounted () {
    if (!this.windowScroll) {
      this.scrollDom = document.getElementById(this.scrollBind)
    } else {
      this.scrollDom = window
    }
    this.scrollDom.addEventListener('scroll', this.handleScroll)
  },
  unmounted () {
    this.scrollDom.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="less">
  .back-top{
    position: fixed;
    bottom: 20px;
    right: 20px;
    text-align: center;
    font-size: 35px;
    background: #666;
    color: #FFF;
    z-index: 100;
    &:hover{
      cursor: pointer;
      background: #4C4C4C;
    }
  }
</style>
