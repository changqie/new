/* 左侧导航菜单 liuyan */
<template>
  <div class="nav-menu v-class">
    <div class="logo">
      <img src="@/assets/images/2.19_logo.png" />
    </div>
    <el-menu
      :unique-opened=true
      :default-active="defaultActive"
      background-color="transparent"
      text-color="#ffffff"
      active-text-color="#ffffff"
      :router=true
    >
      <template v-for="(item, index) in navMenuList">
        <el-submenu
          :key="index"
          :index="item.path"
          v-if="!item.isChildren"
        >
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(children, childrenIndex) in item.children"
            :key="childrenIndex"
            :index="children.path"
          >
            {{ children.title }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          :key="index"
          :index="item.path"
          v-if="item.isChildren"
        >
          <i class="el-icon-location"></i>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'NavMenu',
  data () {
    return {
      defaultActive: null, // 当前激活菜单的 index
      navMenuList: [
        {
          title: '首页',
          path: '/home',
          isChildren: true // 判断没有子菜单
        },
        {
          title: 'demo',
          path: '/demo',
          children: [
            {
              title: '国内法规',
              path: '/demoInfo'
            },
            {
              title: '国外法规',
              path: '/demoTwo'
            },
            {
              title: 'demoThree',
              path: '/demoThree'
            }
          ]
        },
        {
          title: 'demo2',
          path: '/demo2',
          children: [
            {
              title: 'demo2One',
              path: '/demo2One'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    // 获取当前页的path，赋值没左侧菜单，并展开
    this.defaultActive = this.$route.path
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/styles/mixins';
  .nav-menu{
    width: 205px;
    height: 100%;
    .logo{
      text-align: center;
      & > img{
        padding: 15px 0;
        width: 160px;
      }
    }
  }
</style>
