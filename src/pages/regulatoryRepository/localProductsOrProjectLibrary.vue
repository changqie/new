<!--本地产品/项目库 -->
<template>
  <div class="local-products-or-project-library">
    <div>
      <el-form :inline="true" :model="localProTableSearch" class="label-input-form">
        <el-form-item label="产品/项目代号">
          <el-input
            v-model="localProTableSearch.prodectCode"
            placeholder="产品/项目代号查找"
            :maxlength="100" clearable 
            @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item label="产品系列">
          <el-input v-model="localProTableSearch.productSet" placeholder="根据产品系列查找" :maxlength="100" clearable @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="localProTableSearch.productName" placeholder="根据产品名称查找" :maxlength="100" clearable @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item label="产品品牌">
          <el-input v-model="localProTableSearch.productBrand" placeholder="根据产品品牌查找" :maxlength="100" clearable @keyup.enter.native="getLocalProductTableBtn"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="searchAngNewBtn" @click="getLocalProductTableBtn">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="searchAngNewBtn" @click="clearAllSearch">清空查询</el-button>
        </el-form-item>
      </el-form>
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
  }
</style>
