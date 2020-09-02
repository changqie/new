<!--本地产品/项目库 -->
<template>
  <div class="local-products-or-project-library" v-class>
    <div class="search-area">
      <el-form :inline="true" :model="localProTableSearch" class="label-input-form">
        <el-form-item label="产品/项目代号" class="serch-form-item">
          <el-input
            v-model="localProTableSearch.prodectCode"
            placeholder="产品/项目代号查找"
            :maxlength="100"
            clearable
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
            icon="el-icon-search"
            type="primary"
            class="searchAngNewBtn"
            @click="getLocalProductTableBtn"></el-button>
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
      <el-table
        ref="multipleTable"
        :data="localProTableList"
        tooltip-effect="dark"
        style="width: 100%"
        border
        :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          prop="prodectCode"
          label="产品/项目代号"
          width="130"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="productSet"
          label="产品系列"
          width="130"
          align="center">
        </el-table-column>
        <el-table-column
          width="130"
          prop="productName"
          label="产品名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="productTypeShow"
          label="适用车型"
          width="130"
          align="center">
        </el-table-column>
        <el-table-column
          width="130"
          prop="energyKindShow"
          label="能源种类"
          align="center">
        </el-table-column>
        <el-table-column
          prop="creationUser"
          label="创建人"
          width="130"
          align="center">
        </el-table-column>
        <el-table-column
          width="130"
          prop="creationTime"
          label="创建日期"
          align="center">
          <template slot-scope="scope">{{ (scope.row.creationTime).split(' ')[0] }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              class="opera-btn" 
              size="mini"
              type="primary"
              @click="handlePreview(scope.$index, scope.row)">查看</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :page="localProTableSearch.page"
      :total="total"
      @pageChange="pageChange"
      @pageSizeChange="pageSizeChange"></pagination>
  </div>
</template>

<script>
export default {
  name: 'localProductsOrProjectLibrary',
  data () {
    return {
      // 查询条件
      localProTableSearch: {
        page: 1,
        pageSize: this.$store.getters.userInfo.configContent,
        validFlag: 0,
        prodectCode: '',
        productSet: '',
        productName: '',
        productBrand: ''
      },
      // 列表数据
      localProTableList: []
    }
  },
  methods: {
    // 清空条件查询
    clearAllSearch () {

    },
    // 条件分页查询
    getLocalProductTableBtn () {
      this.localProTableSearch.page = 1
      this.getLocalProductTable()
    },
    // 查询本地产品
    getLocalProductTable () {
      this.SarExportSearchEo = this.localProTableSearch
      this.$http.get('lawss/sarProductInfo/getProductInfoPage', this.localProTableSearch, {
        _this: this, loading: 'loading'
      }, res => {
        this.localProTableList = res.data.list
        this.total = res.data.count
        // if ((this.localProTableList.length === 0 || this.localProTableList === []) && this.localProTableSearch.page !== 1) {
        //   this.pageChange(1)
        // }
      }, e => {
      })
      this.$refs.selection.selectAll(false)
    },
    // 列表多选变化
    handleSelectionChange () {

    },
    // 查看
    handlePreview (index, row) {

    },
    // 编辑
    handleEdit (index, row) {

    },
    // 删除
    handleDelete (index, row) {

    },
    // 分页点击后方法
    pageChange (page) {
      this.localProTableSearch.page = page
      this.getLocalProductTable()
    },
    // 分页每页显示数改变后方法
    pageSizeChange (pageSize) {
      this.localProTableSearch.pageSize = pageSize
      this.getLocalProductTable()
      // 此处需要调用接口，修改个人配置
    }
  },
  mounted () {
    // 加载分页列表
    this.getLocalProductTable()
  }
}
</script>

<style lang="less" scoped>
  .local-products-or-project-library {
    position: relative;
    height: 100%;
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
