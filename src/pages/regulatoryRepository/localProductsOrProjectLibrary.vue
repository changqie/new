<!--本地产品/项目库 -->
<template>
  <div class="local-products-or-project-library">
    <div class="search-area">
      <el-form :inline="true" :model="localProTableSearch" class="label-input-form">
        <el-form-item label="产品/项目代号" class="serch-form-item">
          <el-input
            v-model="localProTableSearch.prodectCode"
            placeholder="产品/项目代号查找"
            :maxlength="100" clearable 
            @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item label="产品系列" class="serch-form-item">
          <el-input 
            v-model="localProTableSearch.productSet" 
            placeholder="根据产品系列查找" 
            :maxlength="100" 
            clearable 
            @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" class="serch-form-item">
          <el-input 
            v-model="localProTableSearch.productName"
            placeholder="根据产品名称查找"
            :maxlength="100" 
            clearable 
            @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item label="产品品牌" class="serch-form-item">
          <el-input 
            v-model="localProTableSearch.productBrand"
            placeholder="根据产品品牌查找" 
            :maxlength="100" 
            clearable 
            @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item class="serch-form-item btn-box">
          <el-button 
            type="primary" 
            class="searchAngNewBtn" 
            @click="getLocalProductTableBtn">查询</el-button>
        </el-form-item>
        <el-form-item class="serch-form-item btn-box">
          <el-button 
            type="primary" 
            class="searchAngNewBtn" 
            @click="clearAllSearch">清空查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <div class="action-bar">
        <el-button type="primary" size="mini" @click="exportNameSet('apart')" v-btn-permission="'TE8T0OJDHT'">导出</el-button>
        <el-button type="primary" size="mini" @click="exportNameSet('all')" v-btn-permission="'mlsdf87NJLDS'">全部导出</el-button>
        <el-button type="primary" size="mini" @click="addProductModal" v-btn-permission="'M26D4GAGCR'">新增</el-button>
        <el-button type="danger" size="mini" @click="deleteLocalProduct(1)" v-btn-permission="'BUTRW5D3A4'">批量删除</el-button>
        <el-button type="primary" size="mini" @click="standInvolveProject" v-btn-permission="'QYYZRFZEYA'">标准涉及项目</el-button>
        <el-button type="primary" size="mini" @click="exportProductStand">导出项目标准关系</el-button>
      </div>
      <!-- <loading :loading="loading">数据获取中</loading>
      <Table border ref="selection" :columns="localProTableColumn" :data="localProTableList"  @on-selection-change="tableCheckBoxChange"></Table> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'localProductsOrProjectLibrary',
  data () {
    return {
      localProTableSearch: {
        page: 1,
        pageSize: this.$store.getters.userInfo.configContent,
        validFlag: 0,
        prodectCode: '',
        productSet: '',
        productName: '',
        productBrand: ''
      }
    }
  },
  methods: {
    clearAllSearch () {

    },
    getLocalProductTableBtn () {

    }
  }
}
</script>

<style lang="less" scoped>
  .local-products-or-project-library {
    padding: 15px;
    background: #fff;
    .search-area {
      border-bottom: 1px solid #e8eaec;
    }
    .content{
      width: 100%;
      height: calc(~'100% - 115px')!important;
      overflow-y: auto;
      // .action-bar{
      //   width: 100%;
      //   .flex();
      //   align-items: center;
      //   padding: 0 0 10px 0;
      //   .un-select();
      //   .ivu-btn{
      //     margin-right: 5px;
      //     padding: 2px 18px;
      //   }
      // }
    }
  }
</style>
