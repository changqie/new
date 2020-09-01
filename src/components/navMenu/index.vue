<!--左侧导航菜单 liuyan -->
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
      active-text-color="#ffd04b"
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
          <span slot="title">{{ item.title }}</span>
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
            }
          ]
        },
        {
          title: '标准法规库',
          path: '/regulatoryRepository',
          children: [
            {
              title: '动态&资料',
              path: '/dynamicInformation'
            },
            {
              title: '国内外标准法规',
              path: '/demo2One'
            },
            {
              title: '国内政策',
              path: '/demo2One'
            },
            {
              title: '国外政策',
              path: '/demo2One'
            },
            {
              title: '标准制修订管理',
              path: '/demo2One'
            },
            {
              title: '标准法规清单',
              path: '/demo2One'
            },
            {
              title: '试验项目库',
              path: '/demo2One'
            },
            {
              title: '本地产品/项目库',
              path: '/localProductsOrProjectLibrary'
            }
          ]
        },
        {
          title: '流程中心',
          path: '/demoThree3',
          isChildren: true // 判断没有子菜单
        },
        {
          title: '数据报表',
          path: '/',
          isChildren: true // 判断没有子菜单
        }
      ]
    }
  },
  created () {
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
