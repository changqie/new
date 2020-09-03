<!-- 资料中心模块配置 -->
<template>
  <div class="regulatory-repository v-class">
    <div>
      <el-tabs type="border-card" v-model="rMActiveName" @tab-click="handleClick">
        <el-tab-pane label="标准/文件性质" name="1">用户管理</el-tab-pane>
        <el-tab-pane label="标准类别" name="2">配置管理</el-tab-pane>
        <el-tab-pane label="国家/地区" name="3">角色管理</el-tab-pane>
        <el-tab-pane label="适用车型" name="4">定时任务补偿</el-tab-pane>
        <el-tab-pane label="适用认证" name="5">用户管理</el-tab-pane>
        <el-tab-pane label="所属专业领域" name="6">配置管理</el-tab-pane>
        <el-tab-pane label="采标程度" name="7">角色管理</el-tab-pane>
        <el-tab-pane label="标准/文件状态" name="8">定时任务补偿</el-tab-pane>
        <el-tab-pane label="企标大类" name="9">用户管理</el-tab-pane>
        <el-tab-pane label="企业标准类别" name="10">配置管理</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RegulatoryRepository',
  data () {
    return {
      rMActiveName: '1'
    }
  },
  methods: {
    // tabs 切换事件
    handleClick (tab, event) {
      // 获取到当前是哪个tab激活
      console.log('tab', tab.name)
    }
  }
}
</script>
<style lang="less" scoped>v-class
  .regulatory-repository{
    position: relative;
    height: 100%;
    background-color: #fff;
  }
</style>
