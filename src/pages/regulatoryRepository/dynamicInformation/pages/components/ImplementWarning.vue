<!-- 标准法规库 - 动态&资料 - 实施预警更多-->
<template>
  <div class="implement-warning v-class">
    <table-tools-bar>
      <div slot="left">
        <div class="back" title="返回" @click="back">
          <i class="el-icon-back"></i>
        </div>
        <span style="font-size: 18px;font-weight: bold">实施预警</span>
      </div>
      <div slot="right"></div>
    </table-tools-bar>
    <div class="content">
      <div class="standards-drawer-table">
        <el-divider content-position="left">在产车型预警</el-divider>
        <el-table
          :data="productionVehicleDatas"
          height="550px"
          border
          :resizable="false"
          :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
        >
          <el-table-column
            prop="sortName"
            label="类型"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.sortName === 'BUSINESS_STAND'">企业标准</div>
              <div v-if="scope.row.sortName === 'FOREIGN_STAND'">国外标准法规</div>
              <div v-if="scope.row.sortName === 'INLAND_STAND'">国内标准法规</div>
              <div v-if="scope.row.sortName === 'INLAND_LAWS'">国内政策</div>
              <div v-if="scope.row.sortName === 'FOREIGN_LAWS'">国外政策</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="standNum"
            label="编号"
            align="center"
          >
            <template slot-scope="scope">
              <div @click="showStandDetails(scope.row)">{{ scope.row.standNum }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="standName"
            label="标准名称"
            align="center"
          >
            <template slot-scope="scope">
              <div @click="showStandDetails(scope.row)">{{ scope.row.standName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="putTime"
            label="在产车实施日期"
            align="center"
          ></el-table-column>
        </el-table>
        <pagination :total="productTotal" @pageChange="productPageChange"
                    @pageSizeChange="productPageSizeChange"></pagination>
      </div>
      <div class="standards-drawer-table">
        <el-divider content-position="left">新定型车预警</el-divider>
        <el-table
          :data="newTypeDatas"
          height="550px"
          border
          :resizable="false"
          :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
        >
          <el-table-column
            prop="sortName"
            label="类型"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.sortName === 'BUSINESS_STAND'">企业标准</div>
              <div v-if="scope.row.sortName === 'FOREIGN_STAND'">国外标准法规</div>
              <div v-if="scope.row.sortName === 'INLAND_STAND'">国内标准法规</div>
              <div v-if="scope.row.sortName === 'INLAND_LAWS'">国内政策</div>
              <div v-if="scope.row.sortName === 'FOREIGN_LAWS'">国外政策</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="standNum"
            label="编号"
            align="center"
          >
            <template slot-scope="scope">
              <div @click="showStandDetails(scope.row)">{{ scope.row.standNum }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="standName"
            label="标准名称"
            align="center"
          >
            <template slot-scope="scope">
              <div @click="showStandDetails(scope.row)">{{ scope.row.standName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="putTime"
            label="新定型车实施日期"
            align="center"
          ></el-table-column>
        </el-table>
        <pagination :total="newTotal" @pageChange="newPageChange" @pageSizeChange="newPageSizeChange"></pagination>
      </div>
      <div class="standards-drawer-table">
        <el-divider content-position="left">新生产车预警</el-divider>
        <el-table
          :data="newProductionDatas"
          height="550px"
          border
          :resizable="false"
          :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
        >
          <el-table-column
            prop="sortName"
            label="类型"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.sortName === 'BUSINESS_STAND'">企业标准</div>
              <div v-if="scope.row.sortName === 'FOREIGN_STAND'">国外标准法规</div>
              <div v-if="scope.row.sortName === 'INLAND_STAND'">国内标准法规</div>
              <div v-if="scope.row.sortName === 'INLAND_LAWS'">国内政策</div>
              <div v-if="scope.row.sortName === 'FOREIGN_LAWS'">国外政策</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="standNum"
            label="编号"
            align="center"
          >
            <template slot-scope="scope">
              <div @click="showStandDetails(scope.row)">{{ scope.row.standNum }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="standName"
            label="标准名称"
            align="center"
          >
            <template slot-scope="scope">
              <div @click="showStandDetails(scope.row)">{{ scope.row.standName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="putTime"
            label="新生产车实施日期"
            align="center"
          ></el-table-column>
        </el-table>
        <pagination :total="newProductTotal" @pageChange="newProductPageChange"
                    @pageSizeChange="newProductPageSizeChange"></pagination>
      </div>
    </div>
  </div>
</template>

<script src="../js/ImplementWarning.js"></script>

<style lang="less">
  .implement-warning {
    padding: 15px;
    height: 100%;
    .standards-drawer-table {
      width: 100%;
      position: relative;
      /*.pagination {*/
        /*position: static;*/
        /*height: 50px;*/
      /*}*/
    }
  }

</style>
