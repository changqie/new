<!-- 资料中心模块配置 -->
<template>
  <div class="regulatory-repository">
    <panel-header :tabs="tabsList" @activated="showComponent" :active="active"></panel-header>
    <panel-content>
      <transition enter-active-class="" leave-active-class="">
        <components :is="active"></components>
      </transition>
    </panel-content>
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
import Area from './components/Area'
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
    EnterpriseStandardCategory,
    Area
  },
  data () {
    return {
      active: 'StandardClassification',
      tabsList: [ {
        title: '标准/文件性质',
        name: 'StandardClassification'
      }, {
        title: '标准类别',
        name: 'StandardCategory'
      }, {
        title: '国家/地区',
        name: 'NationalArea'
      },
      {
        title: '区域',
        name: 'Area'
      }, {
        // title: '产品类别',
        title: '适用车型',
        name: 'ProductCategory'
      }, {
        // title: '认证类型',
        title: '适用认证',
        name: 'AuthenticationType'
      }, {
        title: '所属专业领域',
        name: 'Category'
      }, {
        title: '能源种类',
        name: 'EnergyTypes'
      }, {
        title: '采标程度',
        name: 'DegreeStandard'
      }, {
        title: '标准/文件状态',
        name: 'FileState'
      }, {
        // title: '企业大类',
        title: '企标大类',
        name: 'EnterpriseCategory'
      }, {
        title: '企业标准类别',
        name: 'EnterpriseStandardCategory'
      }]
    }
  },
  methods: {
    // tabs 切换事件
    showComponent (name) {
      this.active = name
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
