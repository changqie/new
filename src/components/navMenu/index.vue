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
              title: '国内标准法规',
              path: '/domesticStandardsAndRegulations'
            },
            {
              title: '国外标准法规',
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
          title: '配置管理',
          path: '/config',
          children: [
            {
              title: '标准法规属性管理',
              path: '/regulationsManage'
            },
            {
              title: '资料中心模块配置',
              path: '/informationCenterConfig'
            },
            {
              title: '机构管理',
              path: '/MechanismManage'
            },
            {
              title: '角色管理',
              path: '/roleManage'
            },
            {
              title: '用户管理',
              path: '/userManage'
            },
            {
              title: '动态信息管理',
              path: '/dynamicInformationManage'
            },
            {
              title: '预警时间设置',
              path: '/warningTimeSetting'
            },
            {
              title: '意见反馈',
              path: '/opinionFeedback'
            },
            {
              title: '文档转换监控',
              path: '/convertDocView'
            },
            {
              title: '友情链接管理',
              path: '/permissionMenuManage'
            }
          ]
        }
      ]
    }
  },
  created () {
    // 获取当前页的path，赋值没左侧菜单，并展开
    console.log(this.$route.meta.parentPath)
    if (this.$route.meta.parentPath) {
      this.defaultActive = this.$route.meta.parentPath
    } else {
      this.defaultActive = this.$route.path
    }
  },
  watch: {
    // 监听路由 重新渲染面包屑
    $route () {
      // 获取当前页的path，赋值没左侧菜单，并展开
      console.log(this.$route.meta.parentPath)
      if (this.$route.meta.parentPath) {
        this.defaultActive = this.$route.meta.parentPath
      } else {
        this.defaultActive = this.$route.path
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/styles/mixins';
  .nav-menu{
    min-width: 205px;
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
