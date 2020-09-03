<!-- 资料中心模块配置 -->
<template>
  <div class="regulatory-repository v-class">
    <div>
      <el-tabs type="border-card" v-model="rMActiveName" @tab-click="handleClick">
        <el-tab-pane label="标准/文件性质" name="StandardClassification">
          <StandardClassification></StandardClassification>
        </el-tab-pane>
        <el-tab-pane label="标准类别" name="StandardCategory">配置管理</el-tab-pane>
        <el-tab-pane label="国家/地区" name="NationalArea">角色管理</el-tab-pane>
        <el-tab-pane label="适用车型" name="ProductCategory">定时任务补偿</el-tab-pane>
        <el-tab-pane label="适用认证" name="AuthenticationType">用户管理</el-tab-pane>
        <el-tab-pane label="所属专业领域" name="Category">配置管理</el-tab-pane>
        <el-tab-pane label="能源种类" name="EnergyTypes">配置管理</el-tab-pane>
        <el-tab-pane label="采标程度" name="DegreeStandard">角色管理</el-tab-pane>
        <el-tab-pane label="标准/文件状态" name="FileState">定时任务补偿</el-tab-pane>
        <el-tab-pane label="企标大类" name="EnterpriseCategory">用户管理</el-tab-pane>
        <el-tab-pane label="企业标准类别" name="EnterpriseStandardCategory">配置管理</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import StandardClassification from './components/StandardClassification'
import StandardCategory from './components/StandardCategory'
import NationalArea from './components/NationalArea'
import ProductCategory from './components/ProductCategory'
import AuthenticationType from './components/AuthenticationType'
import Category from './components/Category'
import EnergyTypes from './components/EnergyTypes'
import DegreeStandard from './components/DegreeStandard'
import FileState from './components/FileState'
import EnterpriseCategory from './components/EnterpriseCategory'
import EnterpriseStandardCategory from './components/EnterpriseStandardCategory'
export default {
  name: 'RegulatoryRepository',
  components: {
    StandardClassification,
    StandardCategory,
    NationalArea,
    ProductCategory,
    AuthenticationType,
    Category,
    EnergyTypes,
    DegreeStandard,
    FileState,
    EnterpriseCategory,
    EnterpriseStandardCategory
  },
  data () {
    return {
      rMActiveName: 'StandardClassification'
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
