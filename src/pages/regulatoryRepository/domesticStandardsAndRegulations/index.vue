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
  name: 'domesticStandardsAndRegulations'
}
</script>

<style scoped>

</style>
