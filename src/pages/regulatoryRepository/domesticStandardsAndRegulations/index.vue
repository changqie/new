<template>
  <div id="domesticStandardDatabase" :class="{ 'tree-close': sideClose }" class="demo-spin-article" v-class>
    <div class="tree-content" :class="{ 'tree-close': sideClose }">
      <div class="tree">
        <laws-tree :zNodes="zNodes"
                   ref="domesticTree"
                   treeDivId="domesticTree"
                   showRMenu
                   deptSelect
                   autoSelect
                   add-id="Q8SLTYESAL"
                   edit-id="94V5KRZUJF"
                   remove-id="5F7U4B2Q24"
                   :drag="hasPermissionDrag"
                   drag-bind=".drag-table .ivu-table-body"
                   drag-dom="drag-row"
                   @treeAdd="(treeId, treeNode) => clickDropMenu('newMenu', treeNode)"
                   @treeEdit="(treeId, treeNode) => clickDropMenu('editMenu', treeNode)"
                   @treeClick="(treeId, treeNode) => treeClick(treeNode)"
                   @treeRightClick="(treeId, treeNode) => treeRightClick(treeNode)"
                   @treeRemove="(treeId, treeNode) => clickDropMenu('deleteMenu', treeNode)"
                   @drag="drag"
        ></laws-tree>
      </div>
      <div class="tree-collapse" @click="treeCollapse" :class="{ 'tree-close': sideClose }">
        <Icon :type="collapseIcon" :size="18"/>
      </div>
    </div>
    <div class="tree-right">
      <table-tools-bar v-model="isAdvancedSearch" @search="getDomesticStandardTableBtn(sarStandardsSearch)"
                       @reset="clearAllSearch('sarStandardsSearch')">
        <div slot="content">
        </div>
        <div slot="left">
          <el-form :modal="standCommonlySearch" inline="true" class="label-input-form" >
            <el-form-item label="标准类别" class="serch-form-item">
              <search-select
                v-model="standCommonlySearch.standSort"
                placeholder="根据标准类别查找"
                @keyup.enter.native="getDomesticStandardTableBtn(standCommonlySearch)"
                :options="standSortOptions"/>
            </el-form-item>
            <el-form-item label="标准号/名称" class="serch-form-item">
              <el-input v-model="standCommonlySearch.standNumber" placeholder="根据标准号/名称查找" clearable :maxlength="100"
                     @keyup.enter.native="getDomesticStandardTableBtn(standCommonlySearch)"></el-input>
            </el-form-item>
            <el-form-item class="serch-form-item btn-box">
              <el-button
                :loading="searching"
                icon="el-icon-search"
                type="primary"
                class="searchAngNewBtn"
                @click="getDomesticStandardTableBtn(standCommonlySearch)">
              </el-button>
            </el-form-item>
            <el-form-item class="serch-form-item btn-box">
            <el-button type="primary" @click="clearAllSearch('standCommonlySearch')" class="searchAngNewBtn">清空查询</el-button>
            </el-form-item>
            <el-form-item class="serch-form-item btn-box">
              <el-button  type="primary" class="searchAngNewBtn" @click="selectMoreBtn">高级检索</el-button>
            </el-form-item>
          </el-form>
        </div>
<!--        <div slot="right" class="rightBtn">-->
<!--          <el-button  type="primary" class="searchAngNewBtn" @click="selectMoreBtn">高级检索</el-button>-->
<!--        </div>-->
      </table-tools-bar>
      <el-divider></el-divider>
      <div class="content">
        <div class="action-bar">
          <el-button type="primary" size="mini" @click="exportStandard('apart')" v-btn-permission="'MP3Y2BAK5V'">导出</el-button>
          <el-button type="primary" size="mini" @click="exportStandard('all')" v-btn-permission="'MKVDFIF89FN'">全部导出</el-button>
          <el-button type="primary" size="mini" @click="addModal" v-btn-permission="'B6KGCGZWKM'">新增</el-button>
          <el-button type="danger" size="mini" @click="deleteStand(2)" v-btn-permission="'UH6NV867E7'">批量删除</el-button>
          <el-button type="primary" size="mini" :loading="searching" @click="uploadImportModal(1)"
                  v-btn-permission="'nDZVPHAg4Y'">模板下载
          </el-button>
          <el-button type="primary" size="mini" :loading="searching" @click="addImportModal(1)"
                  v-btn-permission="'7Y7XX6PXNM'">导入
          </el-button>
          <el-button type="primary" size="mini" @click="configurationStandard" v-btn-permission="'4EN5WW694V'">配置标准
          </el-button>
          <el-button type="primary" size="mini" @click="deleteStandFromKind(2)" v-btn-permission="'DQSXS89BRN'">移除标准
          </el-button>
        </div>
        <div class="table-wrapper">
<!--          <el-table border :columns="domesticStandColumn" :height="tableHeight" :data="stahndinfoList"-->
<!--                 @on-selection-change="standSelectChange" class="drag-table domestic-standard-database-tables"-->
<!--                 :row-class-name="dragRowClassName"></el-table>-->
          <el-table
            ref="multipleTable"
            :data="stahndinfoList"
            tooltip-effect="dark"
            style="width: 100%"
            border
            :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
            @selection-change="standSelectChange">
            <el-table-column
              type="selection"
              width="55"
              align="center">
            </el-table-column>
            <el-table-column
              prop="standNumber"
              label="标准号"
              width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="standName"
              label="标准名称"
              width="130"
              align="center">
            </el-table-column>
            <el-table-column
              width="130"
              prop="issueTime"
              label="发布日期"
              align="center">
            </el-table-column>
            <el-table-column
              prop="putTime"
              label="实施日期"
              width="130"
              align="center">
            </el-table-column>
            <el-table-column
              width="130"
              prop="standNatureShow"
              label="标准性质"
              align="center">
            </el-table-column>
            <el-table-column
              prop="standStateShow"
              label="标准状态"
              width="130"
              align="center">
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
                  type="primary"
                  @click="handleDelete(scope.$index, scope.row)">更多</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <pagination :page="tableFlag === '' ? sarStandardsSearch.page : tableFlag.page " :total="total"
                  @pageChange="pageChange" @pageSizeChange="pageSizeChange"></pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'domesticStandardsAndRegulations',
  components: {
  },
  data () {
    return {
      sideClose: false, // 边栏收展状态
      isAdvancedSearch: false, // 高级检索窗口是否打开
      // 一般检索搜索
      standCommonlySearch: {
        page: 1,
        pageSize: this.$store.getters.userInfo.configContent,
        standType: 'INLAND',
        validFlag: '0',
        standSort: '',
        standNumber: ''
      },
      searching: false,
      stahndinfoList: [],
      tableFlag: '',
      total: 0,
      sarStandardsSearch: {
        page: 1,
        pageSize: this.$store.getters.userInfo.configContent,
        standType: 'INLAND',
        validFlag: '0',
        menuId: '',
        country: '',
        standNumber: '',
        standName: '',
        standState: '',
        standNature: '',
        issueTime: '',
        applyArctic: '',
        replaceStandNum: '',
        // replaceStandNumCope: '',
        replaceStandNumList: [],
        replacedStandNum: '',
        synopsis: '', // 内容摘要
        category: '', // 所属类别
        standSort: '' // 标准类别
      }, // 分页查询过程中用到的对象
      // 树形结构
      // tree function
      MoveTest: '',
      // tree setting
      setting: '',
      // tree zNodes
      zNodes: [],
      parentNode: {}, // 记录分类最外层的树结构
      // ztree 拖拽标志
      dragFlag: false
    }
  },
  props: {
  },
  watch: {
  },
  methods: {
    treeCollapse () {
      this.sideClose = !this.sideClose
    },
    // 收展按钮
    collapseIcon () {
      return this.sideClose ? 'ios-arrow-forward' : 'ios-arrow-back'
    },
    // 查询二级菜单
    selectMenu () {
      this.$http.get('lawss/sarMenu/selectMenuByRole', {sorDivide: 'INLAND_STAND'}, {
        _this: this
      }, res => {
        let treeNode = []
        this.parentNode = {}
        res.data.map((item, index) => {
          let treeItem = {}
          for (let key in item) {
            if (key === 'parentId') {
              treeItem.pId = item[key]
              treeItem.parentId = item[key]
            } else if (key === 'menuName') {
              treeItem.name = item[key]
            } else {
              treeItem[key] = item[key]
            }
            if (this.initZNode === '' && item.id === '64df1d5522bb49c09af2') { this.initZNode = treeItem }
          }
          treeNode[index] = treeItem
          // 记录最外层父节点
          if (treeItem.parentId === '' || treeItem.parentId == null) {
            this.parentNode = treeItem
          }
        })
        this.zNodes = treeNode
        // 查完左侧目录后，如果没有选中的，设置最外层选中
        if (JSON.stringify(this.selectSarMenu) === '{}') {
          this.selectSarMenu = JSON.parse(JSON.stringify(this.parentNode))
        }
      }, e => {
      })
    },
    // 分页点击后方法
    pageChange (page) {
      if (this.tableFlag !== '') {
        this.tableFlag.page = page
      } else {
        this.sarStandardsSearch.page = page
      }
      this.getDomesticStandardTable(this.tableFlag)
    },
    // 分页每页显示数改变后方法
    pageSizeChange (pageSize) {
      this.sarStandardsSearch.pageSize = this.$store.getters.userInfo.configContent
      this.getDomesticStandardTable(this.tableFlag)
      this.selectConfiguraStand()
      // 此处需要调用接口，修改个人配置
    },
    // 分页查询国内标准
    getDomesticStandardTable (item) {
      if (item !== '' && item !== null && item !== undefined) {
        item.pageSize = this.$store.getters.userInfo.configContent
      }
      this.sarStandardsSearch.pageSize = this.$store.getters.userInfo.configContent
      this.SarExportSearchEo = item || this.sarStandardsSearch
      this.$http.get('lawss/sarStandardsInfo/getSarStandardsInfoPage', item || this.sarStandardsSearch, {
        _this: this, loading: 'loading'
      }, res => {
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].checked = false
          if (res.data.list[i].collectId != null && res.data.list[i].collectId !== '') {
            res.data.list[i].collectBtn = false
            res.data.list[i].cancelCollectBtn = true
          } else {
            res.data.list[i].collectBtn = true
            res.data.list[i].cancelCollectBtn = false
          }
          res.data.list[i].isSubmit = false
        }
        this.stahndinfoList = res.data.list
        this.total = res.data.count
        if ((this.stahndinfoList.length === 0 || this.stahndinfoList === []) && this.sarStandardsSearch.page !== 1) {
          this.pageChange(1)
        }
      }, e => {
      })
    },
    // 查询处于游离态的标准
    selectConfiguraStand () {
      this.sarConfigStandSearch.pageSize = this.$store.getters.userInfo.configContent
      this.$http.get('lawss/sarStandardsInfo/getSarStandardsInfoPage', this.sarConfigStandSearch, {
        _this: this
      }, res => {
        this.configStandList = res.data.list
        this.configStandtotal = res.data.count
        this.selectConfigStand = []
      }, e => {
      })
    }
  },
  computed: {
  },
  mounted () {
    // 进入页面后查询树形结构目录
    this.selectMenu()
    this.getDomesticStandardTable()
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/mixins';
  @import '~@/assets/styles/style';
#domesticStandardDatabase{
  padding: 15px;
  background: #fff;
  display: flex;
  display: -ms-flex;
  height: 100%;
  position: relative;

  .tree-content {
    width: 16%;
    position: relative;

    .tree {
      width: 90%;
      position: absolute;
      left: 0;
    }

    .tree-collapse {
      position: absolute;
      right: 0;
    }
    .tree-close{
      .tree{
        left: -200px !important;
      }
      .tree-right{
        width: calc(~'100% - 15px') !important;
      }
      .side-bar-collapse{
        background: @sideBarColor !important;
        color: #FFF;
      }
    }
  }

  .tree-right {
    padding:10px;
    position: relative;
    width: 100%;
    .table-tools-bar {
      #labelSelect {
        margin-right: 0;
      }
      #labelInput {
        margin-right: 0;
      }
      .rightBtn{
        float: left;
        margin-right: 0;
      }
    }
    .el-divider--horizontal {
      display: block;
      height: 1px;
      width: 100%;
      margin: 2px 0;
    }
    .content{
      display: flex;
      display: -ms-flex;
      display: -moz-flex;
      display: -webkit-flex;
      flex-direction: column;
      width: 100%;
      height: calc(~'100% - 70px')!important;
    }
    .table-wrapper{
      height: calc(~'100% - 130px')!important;
      overflow-y: scroll;
    }
  }
}
</style>
