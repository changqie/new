<template>
  <div id="domesticStandardDatabase" :class="{ 'tree-close': sideClose }" class="demo-spin-article" v-class>
    <div class="tree-content" :class="{ 'tree-close': sideClose }">
      <!--    <div class="tree-content" v-if="sideClose">-->
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
        <!--切换折叠样式-->
        <i class="el-icon-arrow-left" v-if="sideClose === false"></i>
        <i class="el-icon-arrow-right" v-if="sideClose === true"></i>
      </div>
    </div>
    <div class="tree-right">
      <table-tools-bar v-model="isAdvancedSearch" @search="getDomesticStandardTableBtn(sarStandardsSearch)"
                       @reset="clearAllSearch('sarStandardsSearch')">
        <div slot="content">
          <el-form :modal="sarStandardsSearch" inline class="label-input-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="标准名称" class="serch-form-item">
                  <el-input v-model="sarStandardsSearch.standName" placeholder="根据标准名称查找" clearable :maxlength="500"
                         @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标准号"  class="serch-form-item">
                  <el-input v-model="sarStandardsSearch.standNumber" placeholder="根据标准号查找" clearable :maxlength="100"
                         @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标准类别"  class="serch-form-item">
                  <search-select
                    v-model="sarStandardsSearch.standSort"
                    placeholder="根据标准类别查找"
                    @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)"
                    :options="standSortOptions"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 15px">
              <el-col :span="8">
                <el-form-item label="所属专业领域"  class="serch-form-item">
                  <search-select
                    v-model="sarStandardsSearch.category"
                    placeholder="根据所属专业领域查找"
                    @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)"
                    :options="categoryOptions"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标准性质"  class="serch-form-item">
                  <el-select v-model="sarStandardsSearch.standNature" placeholder="根据标准性质查找" clearable
                          @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)">
                    <el-option v-for="opt in standNatureOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label}}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="标准状态"  class="serch-form-item">
                  <el-select v-model="sarStandardsSearch.standState" placeholder="根据标准状态查找" clearable
                          @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)">
                    <el-option v-for="opt in standStateOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 15px">
              <el-col :span="8">
                <el-form-item label="内容摘要"  class="serch-form-item">
                  <el-input v-model="sarStandardsSearch.synopsis" placeholder="根据内容摘要查找" clearable :maxlength="100"
                         @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="代替标准号"  class="serch-form-item">
                  <el-input v-model="sarStandardsSearch.replaceStandNum" placeholder="根据代替标准查找" clearable :maxlength="100"
                         @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="适用车型"  class="serch-form-item">
                  <search-select
                    v-model="sarStandardsSearch.applyArctic"
                    placeholder="根据适用车型查找"
                    @keyup.enter.native="getDomesticStandardTableBtn(sarStandardsSearch)"
                    :options="applyArcticOptions"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
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
          </el-form>
        </div>
        <div slot="right" class="rightBtn">
          <el-button  type="primary" class="searchAngNewBtn" @click="selectMoreBtn">高级检索</el-button>
        </div>
      </table-tools-bar>
      <el-divider class="noBottom"></el-divider>
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
                  @click="selectStandardPro(scope.row, 'edit')">编辑</el-button>
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
      <!--导出文件改名字模态框-->
      <el-dialog :visible.sync="exportModelFlag" title="导出文件" width="30%">
        <el-form :inline="true" class="label-input-form">
        <el-form-item label="导出名称" class="serch-form-item">
        <el-input v-model="exportName" placeholder="请输入导出文件名称" :maxlength="30" clearable label="导出名称"/>
        </el-form-item>
        </el-form>
        <span  slot="footer" class="dialog-footer">
          <el-button type="primary" class="searchAngNewBtn" size="mini" @click="exportTestItem">确定</el-button>
          <el-button type="primary" class="searchAngNewBtn" size="mini" @click="cancal">取消</el-button>
        </span>
      </el-dialog>
      <!-- 新增国内标准 -->
      <el-drawer
        :title="modalshowtitle"
        :visible.sync="modalshowflag"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
        size="55%"
      >
<!--        :before-close="handleClose"-->
        <!-- 新增样式 -->
        <div class="el-drawer-form">
          <el-form ref="sarStandardsInfoForm" :model="sarStandardsInfoEO" :rules="sarStandardsInfoRules"
                class="label-input-form">
            <el-row>
              <el-col span="12">
                <el-form-item label="国家/地区" prop="country" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.country" disabled>
                    <el-option v-for="opt in countryOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="标准性质" prop="standNature" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.standNature" :disabled="formdisableflag" placeholder="请选择标准性质"
                          clearable>
                    <el-option v-for="opt in standNatureOptions" :key="opt.value" :value="opt.value === undefined ? '' :opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="标准状态" prop="standState" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.standState" :disabled="formdisableflag" placeholder="请选择标准状态"
                          clearable>
                    <el-option v-for="opt in standStateOptions" :key="opt.value" :value="opt.value === undefined ? '' :opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="标准失效日期" prop="standExpirationTime" label-width="130px" class="add-form-item">
                  <el-date-picker v-model="sarStandardsInfoEO.standExpirationTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择标准失效日期"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="内容摘要" prop="synopsis" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.synopsis" :maxlength="500" show-word-limit type="textarea"
                         :autosize="{minRows: 1,maxRows: 4}" :disabled="formdisableflag" placeholder="请输入内容摘要"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="标准发布文本获得时间（印刷版）" title="标准发布文本获得时间（印刷版）" label-width="130px" prop="issueTextTime"
                              class="add-form-item">
                  <el-date-picker v-model="sarStandardsInfoEO.issueTextTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择标准发布文本获得时间（印刷版）"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="标准修订立项号" prop="revisionProjectNo" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.revisionProjectNo" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入标准修订立项号" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="法规种类" prop="standAttribute" label-width="130px" class="add-form-item">
                  <search-select
                    v-model="sarStandardsInfoEO.standAttribute" :options="standAttributeList" placeholder="请选择法规种类"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="标准文本" prop="standFileList" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standFile" v-show="false"></el-input>
                  <el-button size="small" @click="clickButtonToUpload('standFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.standFile === 'null' || sarStandardsInfoEO.standFile === '' ||
                    sarStandardsInfoEO.standFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <!----------------------------------------------------- 基础信息 ----------------------------------------------------->
            <el-divider content-position="left">基础信息</el-divider>
            <el-row>
              <el-col span="12">
                <el-form-item label="标准类别" prop="standSort" label-width="130px" class="add-form-item">
                  <search-select
                    v-model="sarStandardsInfoEO.standSort" :options="standSortOptions" placeholder="请选择标准类别"/>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="标准编号" prop="standNumber" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standNumber" :disabled="formdisableflag" placeholder="请输入标准编号"
                         clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="标准年份" prop="standYear" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standYear" :disabled="formdisableflag" placeholder="请输入标准年份"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="标准名称" prop="standName" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standName" :disabled="formdisableflag" placeholder="请输入标准名称"
                         clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="标准英文名称" prop="standEnName" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standEnName" :disabled="formdisableflag" placeholder="请输入标准英文名称"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="发布日期" prop="issueTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.issueTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择发布日期"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="实施日期" prop="putTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.putTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择实施日期"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="认证实施时间-CCC新车型" title="认证实施时间-CCC新车型" label-width="130px" prop="cccCertPutTime"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.cccCertPutTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择认证实施时间-CCC新车型"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="认证实施时间-公告新车型" title="认证实施时间-公告新车型" prop="noticeCertPutTime" label-width="130px"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.noticeCertPutTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择认证实施时间-公告新车型"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="认证实施时间-国环" title="认证实施时间-国环" prop="nationCertPutTime" label-width="130px"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.nationCertPutTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择认证实施时间-国环"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="认证实施时间-北环" title="认证实施时间-北环" label-width="130px" prop="northCertPutTime"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.northCertPutTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择认证实施时间-北环"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="发布日期是否明确" title="发布日期是否明确" prop="issueTimeCm" label-width="130px"
                              class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.issueTimeCm" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="新车型实施日期" title="新车型实施日期" prop="newcarPutTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.newcarPutTime" :editable="false" :disabled="formdisableflag" placeholder="请选择新车型实施日期"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="新车型实施日期 是否明确" title="新车型实施日期 是否明确" prop="newcarPutTimeCm" label-width="130px"
                              class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.newcarPutTimeCm" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="在产车实施日期" prop="productPutTime" label-width="130px" class="add-form-item" title="在产车实施日期">
                  <el-datePicker v-model="sarStandardsInfoEO.productPutTime" :editable="false" :disabled="formdisableflag" placeholder="请选择在产车实施日期"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="在产车实施日期 是否明确" title="在产车实施日期 是否明确" prop="productPutTimeCm" label-width="130px"
                              class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.productPutTimeCm" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="未立项—获稿时间" prop="unProjectTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.unProjectTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择未立项—获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="立项—获稿时间" prop="projectTime" label-width="130px" class="add-form-item"
                          title="立项—获稿时间">
                  <el-datePicker v-model="sarStandardsInfoEO.projectTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择立项—获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="适用认证" prop="applyAuth" label-width="130px" class="add-form-item">
                  <search-multiple-select v-model="sarStandardsInfoEO.applyAuth"  :disabled="formdisableflag" placeholder="请选择适用认证" :options="applyAuthOptions">
                    <!--<el-option v-for="opt in applyAuthOptions" :value="opt.value" :key="opt.value">{{ opt.label }}</el-option>-->
                  </search-multiple-select>
                </el-form-item>
              </el-col>
            </el-row>

<!--            -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 代替和采标关系 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
            <el-divider content-position="left">代替和采标关系</el-divider>
            <el-row>
              <el-col span="21">
                <el-form-item label="代替标准号" prop="replaceStandNum"  label-width="130px"  class="add-form-item">
                  <el-input v-model.trim="sarStandardsInfoEO.replaceStandNum" ></el-input>
                </el-form-item>
              </el-col>
              <el-col span="3">
                <el-button  class="searchAngNewBtn" type="primary" size="small" @click="selectStands">手动查找</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="24">
                <el-form-item label="被代替标准号" prop="replacedStandNum" label-width="130px"
                              class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.replacedStandNum" :maxlength="100" show-word-limit
                         :disabled="formdisableflag" type="textarea" :autosize="{minRows: 1,maxRows: 4}"
                         placeholder="请输入被代替标准号" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="采用国际标准号" prop="interStandNum" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.interStandNum" :disabled="formdisableflag" placeholder="请输入采用国际标准号"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="采标程度" prop="adoptExtent" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.adoptExtent" :disabled="formdisableflag" placeholder="请选择采标程度"
                          clearable>
                    <el-option v-for="opt in adoptExtentOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
<!--            &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 适用范围 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
            <el-divider content-position="left">适用范围</el-divider>
            <el-row>
              <el-col span="24">
                <el-form-item label="适用车型" prop="applyArctic" label-width="130px" class="add-form-item">
                  <search-multiple-select v-model="sarStandardsInfoEO.applyArctic" :disabled="formdisableflag"
                                          placeholder="请选择适用车型" :options="applyArcticOptions">
                  </search-multiple-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="24">
                <el-form-item label="能源种类" prop="emergyKind" label-width="130px" class="add-form-item">
                  <search-multiple-select v-model="sarStandardsInfoEO.emergyKind" multiple :disabled="formdisableflag"
                                          placeholder="请选择能源种类" :options="emergyKindOptions">
                    <!--<el-option v-for="opt in emergyKindOptions" :value="opt.value" :key="opt.value">{{ opt.label }}-->
                    <!--</el-option>-->
                  </search-multiple-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="是否为新能源专向标准" title="是否为新能源专向标准" prop="isEnergyStand" label-width="130px"
                          class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.isEnergyStand" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
<!--            &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 起草信息 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
            <el-divider content-position="left">起草信息</el-divider>
            <el-row>
              <el-col span="12">
                <el-form-item label="参与起草情况" prop="draftState" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.draftState" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入参与起草情况" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="修订依据" prop="reviseBasis" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.reviseBasis" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入修订依据" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="起草单位" prop="draftingUnit" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.draftingUnit" :disabled="formdisableflag" placeholder="请输入起草单位"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="起草人" prop="draftUser" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.draftUser" :disabled="formdisableflag" placeholder="请输入起草人"
                         clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
<!--            &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 文本信息 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
            <el-divider content-position="left">文本信息</el-divider>
            <el-row>
              <el-col span="12">
                <el-form-item label="制修订计划完成时间" prop="planCompletionTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.planCompletionTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择制修订计划完成时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="预测进入下制修订阶段时间" title="预测进入下制修订阶段时间" label-width="130px" prop="enterNextStageTime"
                          class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.enterNextStageTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择预测进入下制修订阶段时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col span="12">
                <el-form-item label="初稿" prop="firstDraftFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('firstDraftFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.firstDraftFile === 'null' || sarStandardsInfoEO.firstDraftFile === '' ||
                    sarStandardsInfoEO.firstDraftFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="初稿获稿时间" prop="firstDraftFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.firstDraftFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择初稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="初稿意见反馈" prop="firstDraftFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.firstDraftFileFeedback" :maxlength="100"
                         :disabled="formdisableflag" placeholder="请输入初稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="WTO公示稿" prop="wtoPublicFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('wtoPublicFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.wtoPublicFile === 'null' || sarStandardsInfoEO.wtoPublicFile === '' ||
                    sarStandardsInfoEO.wtoPublicFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="WTO公示稿获稿时间" prop="wtoPublicFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.wtoPublicFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择WTO公示稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="WTO公示稿意见反馈" prop="wtoPublicFileFeedback" label-width="130px"
                          class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.wtoPublicFileFeedback" :maxlength="100" :disabled="formdisableflag"
                         placeholder="请输入WTO公示稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="预计进入下一阶段时间" title="预计进入下一阶段时间"  prop="estimatedNextTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.estimatedNextTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择报批稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="草案" prop="draftFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('draftFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.draftFile === 'null' || sarStandardsInfoEO.draftFile === '' ||
                    sarStandardsInfoEO.draftFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="征求意见稿" prop="opinionFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('opinionFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.opinionFile === 'null' || sarStandardsInfoEO.opinionFile === '' ||
                    sarStandardsInfoEO.opinionFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="征求意见稿获稿时间" prop="opinionFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.opinionFileTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择征求意见稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="征求意见稿意见反馈" prop="opinionFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.opinionFileFeedback" :maxlength="100" :disabled="formdisableflag"
                         placeholder="请输入征求意见稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="送审稿" prop="sentScreenFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('sentScreenFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.sentScreenFile === 'null' || sarStandardsInfoEO.sentScreenFile === '' ||
                    sarStandardsInfoEO.sentScreenFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="送审稿获稿时间" prop="sentScreenFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.sentScreenFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择送审稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="送审稿意见反馈" prop="sentScreenFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.sentScreenFileFeedback" :maxlength="100"
                         :disabled="formdisableflag" placeholder="请输入送审稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="报批稿" prop="approvalFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('approvalFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.approvalFile === 'null' || sarStandardsInfoEO.approvalFile === '' ||
                    sarStandardsInfoEO.approvalFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="报批稿获稿时间" prop="approvalFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.approvalFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择报批稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="报批稿意见反馈" prop="approvalFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.approvalFileFeedback" :maxlength="100" :disabled="formdisableflag"
                         placeholder="请输入报批稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="关联文件" prop="relevanceFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('relevanceFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.relevanceFile === 'null' || sarStandardsInfoEO.relevanceFile === '' ||
                    sarStandardsInfoEO.relevanceFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
<!--            &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 内容简介 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
            <el-divider content-position="left">内容简介</el-divider>
            <el-row>
              <el-col span="12">
                <el-form-item label="已收到以下部门适法性确认结果" title="已收到以下部门适法性确认结果" prop="recieveConfirmResult" label-width="130px"
                          class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.recieveConfirmResult" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入已收到以下部门适法性确认结果" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="试验首款车" prop="trialFirstCar" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.trialFirstCar" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入试验首款车" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="领域担当" prop="domainAssume" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.domainAssume" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入领域担当" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="预算基准" prop="budgetBenchmark" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.budgetBenchmark" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入预算基准" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="法规解读内容" prop="lawsExplainText" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.lawsExplainText" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入法规解读内容" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="法规解读关键字" prop="lawsExplainKeyword" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.lawsExplainKeyword" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入法规解读关键字" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="24">
                <el-form-item label="法规解读标准引用" prop="lawsExplainQuote" label-width="130px"
                              class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.lawsExplainQuote" multiple class="new-multiple-select"
                          @click.native="lawsExplainQuoteClick">
                    <el-option v-for="item in sarStandardsInfoEO.lawsExplainQuoteList" :value="item.value === undefined ? '' :item.value"
                            :key="item.value">{{ item.label }}
                    </el-option>
                  </el-select>
                  <el-input v-show="false" id="lawsExplainQuote"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="法规解读文件" prop="lawsExplainFile" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.lawsExplainFile" v-show="false"></el-input>
                  <el-button size="small" @click="clickButtonToUpload('lawsExplainFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.lawsExplainFile === 'null' || sarStandardsInfoEO.lawsExplainFile === '' ||
                    sarStandardsInfoEO.lawsExplainFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="是否结题" prop="isQuestion" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.isQuestion" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="结题时间" prop="finalizeTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.finalizeTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择结题时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col span="12">
                <el-form-item label="结题附件" prop="finalizeFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('finalizeFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.finalizeFile === 'null' || sarStandardsInfoEO.finalizeFile
                    === '' ||
                    sarStandardsInfoEO.finalizeFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <!--<el-form-item label="责任部门" prop="responsibleUnit" class="add-form-item">-->
                <!--<el-input v-model="sarStandardsInfoEO.responsibleUnit" :disabled="formdisableflag"></el-input>-->
                <!--</el-form-item>-->
                <!-- 此处获取组织机构架构图 -->
                <el-form-item label="责任部门" prop="orgName" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.responsibleUnit" v-show="false"/>
                  <el-popover placement="bottom" popper-class="user-dept-popper" trigger="click" :value="false">
                    <el-input v-model="sarStandardsInfoEO.orgName" placeholder="请选择部门" readonly clearable id="deptBtn"/>
                    <div class="api" slot="content">
                      <laws-tree ref="standResponsibleUnit" :zNodes="zNodesS"
                                 treeDivId="zNodesS"
                                 showRMenu
                                 deptSelect
                                 v-if="modalshowflag"
                                 @treeDblClick="treeDblClick"
                                 class="ztree" style="width: 200px;height: 400px;overflow: auto">
                      </laws-tree>
                    </div>
                  </el-popover>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="24">
                <el-form-item label="所属专业领域" prop="category" label-width="130px" class="add-form-item">
                  <search-multiple-select
                    v-if="modalshowflag"
                    v-model="sarStandardsInfoEO.category"
                    :options="categoryOptions"
                    :disabled="formdisableflag"
                    placeholder="请选择所属专业领域"/>
                </el-form-item>
              </el-col>
            </el-row>
            <!----------------------------------------------------- 相近标准 ----------------------------------------------------->
                        <el-divider content-position="left">相近标准</el-divider>
            <el-row>
              <el-col span="24">
                <el-form-item label="试验项目" prop="testItems" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.testItems" multiple class="new-multiple-select"
                          @click.native="testItemsClick">
                    <el-option v-for="item in sarStandardsInfoEO.testItemsList" :value="item.value === undefined ? '' :item.value" :key="item.value">{{
                      item.label }}
                    </el-option>
                  </el-select>
                  <el-input v-show="false" id="testItems"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="demo-drawer-footer">
          <el-button size="small" style="margin-right: 8px" type="primary" @click="resetForm"  class="searchAngNewBtn">取消</el-button>
          <el-button size="small" type="primary" v-if="!formdisableflag" @click="saveOrUpdateStands" :loading="isSubmit"  class="searchAngNewBtn">提交</el-button>
        </div>
      </el-drawer>
<!--      导入-->
      <el-dialog :visible.sync="importModalshowflagtemp" title="导入文件" :footer-hide="true">
        <el-upload
          multiple
          drag
          show-upload-list
          :on-success="uploadSuccess"
          :on-remove="removeOneFile"
          :action="uploadPath"
          :file-list="defaultFileList"
          :format="['PDF','doc','docx','ppt','pptx']"
          :on-format-error="handleAddFormatError"
          :max-size="204800"
          :on-exceeded-size="handleSizeError"
          name="file" ref="importFileAboutStand">
<!--          <div style="padding: 20px 0">-->
            <i class="el-icon-upload"></i>
<!--            <p>点击或拖拽上传文件</p>-->
            <div class="el-upload__text">点击或拖拽上传文件</div>
<!--          </div>-->
        </el-upload>
      </el-dialog>
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
      zNodesS: [], // 责任部门树结构
      zNodesSItem: [],
      searchInlandNodes: [], // 条目部门选择树形结构
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
      tableHeight: 0,
      tableFlag: '',
      total: 0,
      countryOptions: [],
      standSortOptions: [], // 标准类别下拉框
      standSortConfigOptions: [], // 标准类别下拉框
      applyArcticOptions: [], // 适用车型下拉框
      standStateOptions: [], // 标准状态下拉框
      standNatureOptions: [], // 标准性质下拉框
      adoptExtentOptions: [], // 采标程度下拉框
      emergyKindOptions: [], // 能源种类下拉框
      applyAuthOptions: [], // 适用认证下拉框
      categoryOptions: [], // 所属类别下拉框
      categoryConfigOptions: [], // 所属类别下拉框
      standAttributeList: [],
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
      dragFlag: false,
      sarStandardsInfoEO: {
        id: '',
        standType: 'INLAND', // 标准分类
        country: 'CN',
        standSort: '',
        applyArctic: '',
        standNumber: '',
        standYear: '',
        standName: '',
        standEnName: '',
        standState: '',
        standNature: '',
        replaceStandNum: '',
        replaceStandNumId: '',
        // replaceStandNumCope: '',
        replaceStandNumList: [],
        replacedStandNum: '',
        interStandNum: '',
        adoptExtent: '',
        emergyKind: '',
        applyAuth: '',
        issueTime: '',
        putTime: '',
        newcarPutTime: '',
        productPutTime: '',
        newproductPutTime: '',
        draftingUnit: '',
        draftUser: '',
        standFile: '',
        standModifyFile: '',
        draftFile: '',
        opinionFile: '',
        sentScreenFile: '',
        approvalFile: '',
        relevanceFile: '',
        standFileList: [],
        standModifyFileList: [],
        draftFileList: [],
        wtoPublicFileList: [],
        finalizeFileList: [],
        opinionFileList: [],
        sentScreenFileList: [],
        approvalFileList: [],
        relevanceFileList: [],
        firstDraftFileList: [],
        lawsExplainFileList: [],
        tags: '',
        synopsis: '',
        responsibleUnit: '',
        category: '',
        remark: '',
        menuId: '',
        upReplaceNumFlag: 0, // 记录是否修改了代替文件号
        upNumFlag: 0,
        orgName: '', // 部门名称
        registerPutTime: '', // 注册登记车实施日期
        standExpirationTime: '', // 标准失效日期
        issueTextTime: '', //  标准发布文本获得时间（印刷版）
        revisionProjectNo: '', // 标准修订立项号
        recieveConfirmResult: '', // 已收到以下部门适法性确认结果
        trialFirstCar: '', // 试验首款车
        domainAssume: '', // 领域担当
        budgetBenchmark: '', // 预算基准
        planCompletionTime: '', // 制修订计划完成时间
        enterNextStageTime: '', // 预测进入下制修订阶段时间
        firstDraftFile: '', // 初稿
        standAttribute: '', // 法规种类
        isCertiStand: '', // 是否为认证标准
        isNoticeApply: '', //  是否公告适用
        isNationRing: '',
        isNorthRing: '', //  是否北环适用
        isCccApply: '', //  是否CCC适用
        isEnergyStand: '', // 是否为新能源专向标准
        issueTimeCm: '', // 发布日期是否明确
        newcarPutTimeCm: '', // 新车型实施日期 是否明确
        productPutTimeCm: '', // 在产车实施日期 是否明确
        isQuestion: '', // 是否结题
        draftState: '', // 参与起草情况
        reviseBasis: '', // 修订依据
        unProjectTime: '', // 未立项—获稿时间
        projectTime: '', // 立项—获稿时间
        estimatedNextTime: '', // 预计进入下一阶段时间
        finalizeTime: '', // 结题时间
        wtoPublicFile: '',
        finalizeFile: '', // 结题附件
        noticeCertPutTime: '',
        cccCertPutTime: '',
        nationCertPutTime: '',
        northCertPutTime: '',
        noticeProductPutTime: '',
        cccProductPutTime: '',
        nationProductPutTime: '',
        northProductPutTime: '',
        lawsExplainText: '',
        lawsExplainKeyword: '',
        lawsExplainFile: '',
        lawsExplainQuote: '',
        testItems: '',
        lawsExplainQuoteList: [],
        testItemsList: [],
        firstDraftFileTime: '',
        firstDraftFileFeedback: '',
        wtoPublicFileTime: '',
        wtoPublicFileFeedback: '',
        opinionFileTime: '',
        opinionFileFeedback: '',
        sentScreenFileTime: '',
        sentScreenFileFeedback: '',
        approvalFileTime: '',
        approvalFileFeedback: ''
      }, // 标准新增过程中用到的对象
      currentFileList: '', // 当前操作的是哪个FormItem的上传
      importModalshowflagtemp: false,
      isList: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ],
      // 导出文件模态框控制，和文件名称
      saveExportType: '',
      exportModelFlag: false,
      exportName: '',
      uploadPath: 'api/att/attFile/upload',
      defaultFileList: [], // 默认显示
      selectedList: [], // 标准中选中的数据
      modalshowflag: false,
      formdisableflag: false, // 查看标准不可编辑
      modalshowtitle: '新增国内标准',
      addOrUPdateFlag: 1, // 新增：1， 修改：2
      itemAddOrUPdateFlag: 1, // 新增：1， 修改：2
      menuAddOrUpdateFlag: 1, // 新增：1， 修改：2
      standNumFlag: 1, // 新增：1， 修改：2
      sarStandardsInfoRules: {
        standSort: [
          {required: true, message: '标准类别不能为空', trigger: 'change'}
        ],
        applyArctic: [
          // {required: true, type: 'array', message: '适用车型不能为空', trigger: 'change'},
          {type: 'Array', validator: this.verify.valiCategory, trigger: 'change'}
        ],
        standNumber: [
          {required: true, type: 'string', message: '标准编号不能为空', trigger: 'blur'},
          {type: 'string', max: 100, message: '标准编号不能超过100个字符', trigger: 'blur'}
        ],
        standYear: [
          // {required: true, message: '标准年份不能为空', trigger: 'blur'},
          // {required: true, validator: this.verify.valiateStandYear, trigger: 'blur'},
          {type: 'string', max: 100, message: '标准年份不能超过100个字符', trigger: 'blur'},
          {validator: this.verify.checkSpecialCharacter2, trigger: 'blur'}
        ],
        standName: [
          {required: true, message: '标准名称不能为空', trigger: 'blur'},
          {type: 'string', max: 500, message: '标准名称不能超过500个字符', trigger: 'blur'}
        ],
        standEnName: [
          {type: 'string', max: 500, message: '标准英文名称不能超过500个字符', trigger: 'blur'},
          {validator: this.verify.valiateEnName, trigger: 'blur'}
        ],
        standState: [
          {required: true, message: '标准状态不能为空', trigger: 'change'}
        ],
        standNature: [
          {required: true, message: '标准性质不能为空', trigger: 'change'}
        ],
        // replaceStandNum: [
        //   {type: 'string', max: 100, message: '代替标准号不能超过100个字符', trigger: 'blur'}
        //   // {type: 'string', validator: this.validateReplaceStandNum, trigger: 'blur'}
        // ],
        replacedStandNum: [
          {type: 'string', max: 100, message: '被代替标准号不能超过100个字符', trigger: 'blur'}
          /* {type: 'string', validator: this.validateReplacedStandNum, trigger: 'blur'} */
        ],
        interStandNum: [
          {type: 'string', max: 100, message: '采用国际标准号不能超过100个字符', trigger: 'blur'}
        ],
        adoptExtent: [],
        emergyKind: [
          // {required: true, type: 'array', message: '能源种类不能为空', trigger: 'change'},
          {type: 'Array', validator: this.verify.valiCategory, trigger: 'change'}
        ],
        applyAuth: [
          {type: 'Array', validator: this.verify.valiCategory, trigger: 'change'}
        ],
        // issueTime: [
        //   {required: true, type: 'date', message: '发布日期不能为空', trigger: 'change'}
        // ],
        // putTime: [
        //   {required: true, type: 'date', message: '实施日期不能为空', trigger: 'change'}
        // ],
        newcarPutTime: [],
        productPutTime: [],
        newproductPutTime: [],
        draftingUnit: [
          {type: 'string', max: 1000, message: '起草单位不能超过1000个字符', trigger: 'blur'}
          // {validator: this.verify.checkSpecialCharacter, trigger: 'blur'}
        ],
        draftUser: [
          {type: 'string', max: 255, message: '起草人不能超过255个字符', trigger: 'blur'}
          // {validator: this.verify.checkSpecialCharacter, trigger: 'blur'}
        ],
        standFileList: [],
        finalizeFile: [],
        finalizeFileList: [],
        standModifyFile: [],
        draftFile: [],
        opinionFile: [],
        sentScreenFile: [],
        approvalFile: [],
        relevanceFile: [],
        tags: [
          {type: 'string', max: 100, message: '关键词不能超过100个字符', trigger: 'blur'}
          // {validator: this.verify.checkSpecialCharacterOftags, trigger: 'blur'}
        ],
        synopsis: [
          {type: 'string', max: 500, message: '内容摘要不能超过500个字符', trigger: 'blur'}
          // {validator: this.verify.checkSpecialCharacter, trigger: 'blur'} gaoyan 2018-11-07 客户提到特殊符号校验问题
        ],
        responsibleUnit: [
          {type: 'string', max: 100, message: '责任部门不能超过100个字符', trigger: 'change'}
          // {validator: this.verify.checkSpecialCharacter, trigger: 'change'}
        ],
        registerPutTime: [],
        category: [
          {type: 'Array', validator: this.verify.valiCategory, trigger: 'change'}
        ],
        remark: [
          {type: 'string', max: 1000, message: '备注不能超过1000个字符', trigger: 'blur'}
        ]
      }
    }
  },
  props: {
  },
  watch: {
  },
  methods: {
    // 查看标准属性
    selectStandardPro (item, state) {
      this.modalshowtitle = '编辑国内标准'
      this.modalshowflag = true
      // console.log('item', item)
      // 内容摘要
      if (item.synopsis !== null && item.synopsis !== '') {
        item.synopsis = item.synopsis.replace(/<br \/>/g, '\r\n')
        item.synopsis = item.synopsis.replace(/<br \/>/g, '\n')
      }
      // // 代替标准号
      // if (item.replaceStandNum !== null && item.replaceStandNum !== '') {
      //   item.replaceStandNum = item.replaceStandNum.replace(/<br \/>/g, '\r\n')
      //   item.replaceStandNum = item.replaceStandNum.replace(/<br \/>/g, '\n')
      // }
      // 被代替标准号
      if (item.replacedStandNum !== null && item.replacedStandNum !== '') {
        item.replacedStandNum = item.replacedStandNum.replace(/<br \/>/g, '\r\n')
        item.replacedStandNum = item.replacedStandNum.replace(/<br \/>/g, '\n')
      }
      // 关键词
      if (item.tags !== null && item.tags !== '') {
        item.tags = item.tags.replace(/<br \/>/g, '\r\n')
        item.tags = item.tags.replace(/<br \/>/g, '\n')
      }
      // 备注
      if (item.remark !== null && item.tags !== '') {
        item.remark = item.remark.replace(/<br \/>/g, '\r\n')
        item.remark = item.remark.replace(/<br \/>/g, '\n')
      }
      this.sarStandardsInfoEO = JSON.parse(JSON.stringify(item))
      let subClass = item.standSort
      this.changeInlandSubclassVal()
      this.sarStandardsInfoEO.standSort = subClass
      let a = []
      if (this.sarStandardsInfoEO.applyArctic != null && !(this.sarStandardsInfoEO.applyArctic instanceof Array)) {
        a = item.applyArctic.split(',')
        this.sarStandardsInfoEO.applyArctic = a // 适用车型
      }
      if (this.sarStandardsInfoEO.emergyKind != null && !(this.sarStandardsInfoEO.emergyKind instanceof Array)) {
        a = item.emergyKind.split(',')
        this.sarStandardsInfoEO.emergyKind = a // 能源种类
      }
      if (this.sarStandardsInfoEO.lawsExplainQuote != null && !(this.sarStandardsInfoEO.lawsExplainQuote instanceof Array)) {
        a = item.lawsExplainQuote.split(',')
        this.sarStandardsInfoEO.lawsExplainQuote = a
      }
      if (this.sarStandardsInfoEO.replaceStandNum != null && !(this.sarStandardsInfoEO.replaceStandNum instanceof Array)) {
        a = item.replaceStandNum.split(',')
        this.sarStandardsInfoEO.replaceStandNum = a
      }
      if (this.sarStandardsInfoEO.testItems != null && !(this.sarStandardsInfoEO.testItems instanceof Array)) {
        a = item.testItems.split(',')
        this.sarStandardsInfoEO.testItems = a
      }
      if (this.sarStandardsInfoEO.applyAuth != null && !(this.sarStandardsInfoEO.applyAuth instanceof Array)) {
        a = item.applyAuth.split(',')
        this.sarStandardsInfoEO.applyAuth = a // 适用认证
      }
      if (this.sarStandardsInfoEO.category != null && !(this.sarStandardsInfoEO.category instanceof Array)) {
        a = item.category.split(',')
        this.sarStandardsInfoEO.category = a // 所属类别
      }
      if (this.sarStandardsInfoEO.issueTime != null && this.sarStandardsInfoEO.issueTime !== '') {
        this.sarStandardsInfoEO.issueTime = this.sarStandardsInfoEO.issueTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.issueTime = new Date(this.sarStandardsInfoEO.issueTime)
      }
      if (this.sarStandardsInfoEO.putTime != null && this.sarStandardsInfoEO.putTime !== '') {
        this.sarStandardsInfoEO.putTime = this.sarStandardsInfoEO.putTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.putTime = new Date(this.sarStandardsInfoEO.putTime)
      }
      if (this.sarStandardsInfoEO.newcarPutTime != null && this.sarStandardsInfoEO.newcarPutTime !== '') {
        this.sarStandardsInfoEO.newcarPutTime = this.sarStandardsInfoEO.newcarPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.newcarPutTime = new Date(this.sarStandardsInfoEO.newcarPutTime)
      }
      if (this.sarStandardsInfoEO.standExpirationTime != null && this.sarStandardsInfoEO.standExpirationTime !== '') {
        this.sarStandardsInfoEO.standExpirationTime = this.sarStandardsInfoEO.standExpirationTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.standExpirationTime = new Date(this.sarStandardsInfoEO.standExpirationTime)
      }
      if (this.sarStandardsInfoEO.noticeCertPutTime != null && this.sarStandardsInfoEO.noticeCertPutTime !== '') {
        this.sarStandardsInfoEO.noticeCertPutTime = this.sarStandardsInfoEO.noticeCertPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.noticeCertPutTime = new Date(this.sarStandardsInfoEO.noticeCertPutTime)
      }
      if (this.sarStandardsInfoEO.cccCertPutTime != null && this.sarStandardsInfoEO.cccCertPutTime !== '') {
        this.sarStandardsInfoEO.cccCertPutTime = this.sarStandardsInfoEO.cccCertPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.cccCertPutTime = new Date(this.sarStandardsInfoEO.cccCertPutTime)
      }
      if (this.sarStandardsInfoEO.nationCertPutTime != null && this.sarStandardsInfoEO.nationCertPutTime !== '') {
        this.sarStandardsInfoEO.nationCertPutTime = this.sarStandardsInfoEO.nationCertPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.nationCertPutTime = new Date(this.sarStandardsInfoEO.nationCertPutTime)
      }
      if (this.sarStandardsInfoEO.northCertPutTime != null && this.sarStandardsInfoEO.northCertPutTime !== '') {
        this.sarStandardsInfoEO.northCertPutTime = this.sarStandardsInfoEO.northCertPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.northCertPutTime = new Date(this.sarStandardsInfoEO.northCertPutTime)
      }
      if (this.sarStandardsInfoEO.noticeProductPutTime != null && this.sarStandardsInfoEO.noticeProductPutTime !== '') {
        this.sarStandardsInfoEO.noticeProductPutTime = this.sarStandardsInfoEO.noticeProductPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.noticeProductPutTime = new Date(this.sarStandardsInfoEO.noticeProductPutTime)
      }
      if (this.sarStandardsInfoEO.cccProductPutTime != null && this.sarStandardsInfoEO.cccProductPutTime !== '') {
        this.sarStandardsInfoEO.cccProductPutTime = this.sarStandardsInfoEO.cccProductPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.cccProductPutTime = new Date(this.sarStandardsInfoEO.cccProductPutTime)
      }
      if (this.sarStandardsInfoEO.nationProductPutTime != null && this.sarStandardsInfoEO.nationProductPutTime !== '') {
        this.sarStandardsInfoEO.nationProductPutTime = this.sarStandardsInfoEO.nationProductPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.nationProductPutTime = new Date(this.sarStandardsInfoEO.nationProductPutTime)
      }
      if (this.sarStandardsInfoEO.northProductPutTime != null && this.sarStandardsInfoEO.northProductPutTime !== '') {
        this.sarStandardsInfoEO.northProductPutTime = this.sarStandardsInfoEO.northProductPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.northProductPutTime = new Date(this.sarStandardsInfoEO.northProductPutTime)
      }
      if (this.sarStandardsInfoEO.issueTextTime != null && this.sarStandardsInfoEO.issueTextTime !== '') {
        this.sarStandardsInfoEO.issueTextTime = this.sarStandardsInfoEO.issueTextTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.issueTextTime = new Date(this.sarStandardsInfoEO.issueTextTime)
      }
      if (this.sarStandardsInfoEO.registerPutTime != null && this.sarStandardsInfoEO.registerPutTime !== '') {
        this.sarStandardsInfoEO.registerPutTime = this.sarStandardsInfoEO.registerPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.registerPutTime = new Date(this.sarStandardsInfoEO.registerPutTime)
      }
      if (this.sarStandardsInfoEO.wtoPublicFileTime != null && this.sarStandardsInfoEO.wtoPublicFileTime !== '') {
        this.sarStandardsInfoEO.wtoPublicFileTime = this.sarStandardsInfoEO.wtoPublicFileTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.wtoPublicFileTime = new Date(this.sarStandardsInfoEO.wtoPublicFileTime)
      }
      if (this.sarStandardsInfoEO.opinionFileTime != null && this.sarStandardsInfoEO.opinionFileTime !== '') {
        this.sarStandardsInfoEO.opinionFileTime = this.sarStandardsInfoEO.opinionFileTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.opinionFileTime = new Date(this.sarStandardsInfoEO.opinionFileTime)
      }
      if (this.sarStandardsInfoEO.approvalFileTime != null && this.sarStandardsInfoEO.approvalFileTime !== '') {
        this.sarStandardsInfoEO.approvalFileTime = this.sarStandardsInfoEO.approvalFileTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.approvalFileTime = new Date(this.sarStandardsInfoEO.approvalFileTime)
      }
      if (this.sarStandardsInfoEO.sentScreenFileTime != null && this.sarStandardsInfoEO.sentScreenFileTime !== '') {
        this.sarStandardsInfoEO.sentScreenFileTime = this.sarStandardsInfoEO.sentScreenFileTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.sentScreenFileTime = new Date(this.sarStandardsInfoEO.sentScreenFileTime)
      }

      if (this.sarStandardsInfoEO.firstDraftFileTime != null && this.sarStandardsInfoEO.firstDraftFileTime !== '') {
        this.sarStandardsInfoEO.firstDraftFileTime = this.sarStandardsInfoEO.firstDraftFileTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.firstDraftFileTime = new Date(this.sarStandardsInfoEO.firstDraftFileTime)
      }

      if (this.sarStandardsInfoEO.planCompletionTime != null && this.sarStandardsInfoEO.planCompletionTime !== '') {
        this.sarStandardsInfoEO.planCompletionTime = this.sarStandardsInfoEO.planCompletionTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.planCompletionTime = new Date(this.sarStandardsInfoEO.planCompletionTime)
      }
      if (this.sarStandardsInfoEO.enterNextStageTime != null && this.sarStandardsInfoEO.enterNextStageTime !== '') {
        this.sarStandardsInfoEO.enterNextStageTime = this.sarStandardsInfoEO.enterNextStageTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.enterNextStageTime = new Date(this.sarStandardsInfoEO.enterNextStageTime)
      }
      if (this.sarStandardsInfoEO.productPutTime != null && this.sarStandardsInfoEO.productPutTime !== '') {
        this.sarStandardsInfoEO.productPutTime = this.sarStandardsInfoEO.productPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.productPutTime = new Date(this.sarStandardsInfoEO.productPutTime)
      }
      if (this.sarStandardsInfoEO.newproductPutTime != null && this.sarStandardsInfoEO.newproductPutTime !== '') {
        this.sarStandardsInfoEO.newproductPutTime = this.sarStandardsInfoEO.newproductPutTime.replace(new RegExp(/-/gm), '/')
        this.sarStandardsInfoEO.newproductPutTime = new Date(this.sarStandardsInfoEO.newproductPutTime)
      }
      if (this.sarStandardsInfoEO.certPutTimeList.length !== 0) {
        this.sarStandardsInfoEO.certPutTimeList.map((item) => {
          switch (item.timeName) {
            case '公告新车型':
              this.sarStandardsInfoEO.noticeCertPutTime = item.putTime
              break
            case 'CCC新车型':
              this.sarStandardsInfoEO.cccCertPutTime = item.putTime
              break
            case '国环受理时间':
              this.sarStandardsInfoEO.nationCertPutTime = item.putTime
              break
            case '北环受理时间':
              this.sarStandardsInfoEO.northCertPutTime = item.putTime
              break
          }
        })
      }
      if (state === 'show') {
        this.formdisableflag = true
      } else {
        this.addOrUPdateFlag = 2
        this.standNumFlag = 2
        this.formdisableflag = false
        this.saveOldNum = item.standNumber
        this.saveOldSort = item.standSort
        this.saveOldYear = item.standYear
        this.saveOldReplaceNum = item.replaceStandNum
        // let selectNode = this.getTreeNameByid(this.sarStandardsInfoEO.responsibleUnit)
        this.sarStandardsInfoEO.orgName = item.responsibleUnitShow
        // 编辑过程中将resId 替换成  attid
        this.updateResidToAttid('standFile')
        this.updateResidToAttid('standModifyFile')
        this.updateResidToAttid('opinionFile')
        this.updateResidToAttid('sentScreenFile')
        this.updateResidToAttid('approvalFile')
        this.updateResidToAttid('relevanceFile')
        this.updateResidToAttid('draftFile')
        this.updateResidToAttid('firstDraftFile')
        this.updateResidToAttid('wtoPublicFile')
        this.updateResidToAttid('lawsExplainFile')
        this.updateResidToAttid('finalizeFile')
      }
    },
    // 二级菜单新建，编辑，删除
    clickDropMenu (name, treeNode) {
      this.selectSarMenu = JSON.parse(JSON.stringify(treeNode))
      if (undefined !== this.selectSarMenu.id) { // 当前有选中节点
        if (name === 'newMenu') {
          this.menuModalTitle = '新增目录'
          this.menuModalFlag = true
          this.menuAddOrUpdateFlag = 1
          this.sarMenu = {
            id: '',
            parentId: '',
            menuName: '',
            sorDivide: 'INLAND_STAND',
            displaySeq: '',
            parentIds: '',
            remarks: ''
          }
        } else if (name === 'editMenu') {
          this.menuModalTitle = '编辑目录'
          this.menuModalFlag = true
          this.menuAddOrUpdateFlag = 2
          this.sarMenu = JSON.parse(JSON.stringify(this.selectSarMenu)) // 修改过程中直接将sarMenu对象置为当前选中的对象
          for (let i in this.sarMenu) {
            if (this.sarMenu[i] === null) {
              this.sarMenu[i] = ''
            }
          }
          this.sarMenu.menuName = JSON.parse(JSON.stringify(this.selectSarMenu.oldname || this.selectSarMenu.name))
        } else {
          if (this.selectSarMenu.parentId == null) { // 如果父id为null 说明是根目录
            this.$Modal.info({
              title: '提示',
              content: '根目录不可删除！'
            })
          } else {
            // deleteMenu 删除二级菜单，先判断是否选中，选中项目，然后调用删除方法
            // 先判断目录下是否有菜单
            this.$http.post('lawss/sarMenu/judgequeryMenuByPid', this.selectSarMenu, {
              _this: this, loading: 'loading'
            }, res => {
              if (res.data) {
                this.deleteMenuModal = true
              } else {
                this.sureDeleteSarMenu()
              }
            }, e => {
            })
          }
        }
      } else {
        this.$Modal.info({
          title: '提示',
          content: '请选择节点！'
        })
      }
    },
    treeClick (treeNode) {
      this.selectSarMenu = treeNode // 记录当前选中的二级菜单
      this.standCommonlySearch.menuId = treeNode.id
      this.sarStandardsSearch.menuId = treeNode.id // 将当前二级菜单的id传回后台做标准的条件查询
      this.sarStandardsSearch.page = 1
      this.standCommonlySearch.page = 1
      this.getDomesticStandardTable(this.tableFlag) // 根据选中的二级菜单查询对应的标准列表
    },
    treeRightClick (treeNode) {
      this.selectSarMenu = treeNode // 记录当前选中的二级菜单
      this.standCommonlySearch.menuId = treeNode.id
      this.sarStandardsSearch.menuId = treeNode.id
    },
    // 搜索
    getDomesticStandardTableBtn (item) {
      this.tableFlag = item
      item.page = 1
      this.pageChange(1)
      this.getDomesticStandardTable(item)
    },
    // 清空搜索框
    clearAllSearch (flag) {
      if (flag === 'sarStandardsSearch') {
        // 标准搜索
        // this.sarStandardsSearch.country = ''
        this.sarStandardsSearch.standSort = ''
        this.sarStandardsSearch.standNumber = ''
        this.sarStandardsSearch.standName = ''
        this.sarStandardsSearch.standState = ''
        this.sarStandardsSearch.standNature = ''
        this.sarStandardsSearch.issueTime = ''
        this.sarStandardsSearch.applyArctic = ''
        // this.sarStandardsSearch.replaceStandNum = ''
        this.sarStandardsSearch.replacedStandNum = ''
        this.sarStandardsSearch.synopsis = ''
        this.sarStandardsSearch.category = ''
        this.pageChange(1)
        this.getDomesticStandardTable(this.sarStandardsSearch)
      } else if (flag === 'standCommonlySearch') {
        this.standCommonlySearch.standSort = ''
        this.standCommonlySearch.standNumber = ''
        this.pageChange(1)
        this.getDomesticStandardTable(this.standCommonlySearch)
      } else if (flag === 2) {
        // 标准条目搜索
        this.standItemSearch.responsibleUnit = ''
        this.standItemSearch.orgName = ''
      } else {
        // 游离标准搜索清空
        this.sarConfigStandSearch.standSort = ''
        this.sarConfigStandSearch.standNumber = ''
        this.sarConfigStandSearch.standName = ''
        this.sarConfigStandSearch.category = ''
        this.sarConfigStandSearch.standNature = ''
        this.sarConfigStandSearch.synopsis = ''
        this.sarConfigStandSearch.applyArctic = ''
        // this.sarConfigStandSearch.replaceStandNum = ''
        this.selectConfiguraStand()
      }
    },
    // 高级检索
    selectMoreBtn () {
      this.isAdvancedSearch = true
    },
    treeCollapse () {
      console.log(this.sideClose)
      this.sideClose = !this.sideClose
      console.log(this.sideClose)
    },
    // 收展按钮
    collapseIcon () {
      // return this.sideClose ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
      return 'el-icon-arrow-left'
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
    // 导出选中的标准  此处因为复选框没有设置好，所以先设置导出所有数据
    exportStandard (type) {
      // 区别是选择导出还是全部导出
      this.saveExportType = type
      if (type === 'apart') {
        if (this.selectedList.length > 0) {
          this.exportName = ''
          this.exportModelFlag = true
        } else {
          this.$message({
            message: '请先选择要导出的数据',
            type: 'warning'
          })
        }
      } else {
        this.exportName = ''
        this.exportModelFlag = true
      }
    },
    // 修改成表格样式后，选择项勾选改变
    standSelectChange (data) {
      this.selectedList = []
      for (let i = 0; i < data.length; i++) {
        this.selectedList.push(data[i].id)
      }
    },
    // 导出确定功能
    exportTestItem () {
      if (this.saveExportType === 'apart') {
        if (this.selectedList != null && this.selectedList !== '') {
          window.open('/api/lawss/sarStandardsInfo/exportStandardsInfoExcel?exportType=' + this.saveExportType + '&exportContent=' + this.selectedList.join(',') + '&exportName=' + this.exportName)
          this.$Message.success('导出信息成功')
        }
      } else if (this.saveExportType === 'all') {
        let exportEOStr = JSON.stringify(this.SarExportSearchEo)
        exportEOStr = exportEOStr.replace(/""/g, null)
        window.open('/api/lawss/sarStandardsInfo/exportStandardsInfoExcel?exportType=' + this.saveExportType + '&exportContent=' + exportEOStr + '&exportName=' + this.exportName)
        this.$Message.success('导出信息成功')
      }
      this.exportModelFlag = false
    },
    // 导出取消按钮关闭模态、置空
    cancal () {
      this.exportModelFlag = false
    },
    // 点击新增按钮弹出新增模态框
    addModal () {
      this.modalshowflag = true
      this.formdisableflag = false
      this.modalshowtitle = '新增国内标准'
      this.addOrUPdateFlag = 1
      this.standNumFlag = 1
      this.getOrgTreeSource()
      this.changeInlandSubclassVal()
    },
    uploadSuccess (res, file, fileList) {
      if (res.ok) {
        //  修改开始 此处之前是支持选多个文件的，现在已修改成只允许上传一个文件，所以增加置空
        // this.sarStandardsInfoEO[this.currentFileList] = []
        // this.sarStandardsInfoEO[this.currentFile] = ''
        // 修改结束
        // this.sarStandardsInfoEO[this.currentFileList].push(res.data)
        this.sarStandardsInfoEO[this.currentFile] += res.data.id + ','
        this.$message({
          message: '文件上传成功',
          type: 'success'
        })
        // this.importModalshowflagtemp = false
      } else {
        this.$Message.error(res.message)
      }
    },
    removeOneFile (file, fileList) {
      // this.sarStandardsInfoEO[this.currentFileList] = this.removeAaary(this.sarStandardsInfoEO[this.currentFileList], file.response.data)
      let ids = this.sarStandardsInfoEO[this.currentFile].split(',')
      let fileIds = file.response.data.id
      let newIdList = this.removeAaary(ids, fileIds)
      let newStr = ''
      if (newIdList != null && newIdList.length > 0) {
        for (let i = 0; i < newIdList.length; i++) {
          if (newIdList[i] !== '') {
            newStr += newIdList[i] + ','
          }
        }
        this.sarStandardsInfoEO[this.currentFile] = newStr
      } else {
        this.sarStandardsInfoEO[this.currentFile] = ''
      }
    },
    // 删除数组中的某个对象
    removeAaary (_arr, _obj) {
      var length = _arr.length
      for (var i = 0; i < length; i++) {
        if (_arr[i] === _obj) {
          if (i === 0) {
            _arr.shift() // 删除并返回数组的第一个元素
            return _arr
          } else if (i === length - 1) {
            _arr.pop() // 删除并返回数组的最后一个元素
            return _arr
          } else {
            _arr.splice(i, 1) // 删除下标为i的元素
            return _arr
          }
        }
      }
    },
    handleAddFormatError (file) {
      this.$message.error('文件' + file.name + '格式不正确，请上传pdf、doc、docx、ppt、pptx文件')
    },
    // 导入文件大小超出范围
    handleSizeError (file) {
      this.spinShow = false
      this.$message.error('文件' + file.name + '大小不超过200M')
    },
    clickButtonToUpload (current) {
      this.currentFileList = current
      this.currentFile = JSON.parse(JSON.stringify(current).replace('List', ''))
      this.importModalshowflagtemp = true
      this.$refs.importFileAboutStand.clearFiles()
      this.defaultFileList = []
      if (this.sarStandardsInfoEO[this.currentFile] === 'null' || this.sarStandardsInfoEO[this.currentFile] == null) {
        this.sarStandardsInfoEO[this.currentFile] = ''
      }
      let fileList
      if (this.sarStandardsInfoEO[this.currentFile] != null && this.sarStandardsInfoEO[this.currentFile] !== '') {
        let paramefile = this.sarStandardsInfoEO[this.currentFile]
        if (paramefile.charAt(paramefile.length - 1) === ',') {
          paramefile = paramefile.substring(0, paramefile.length - 1)
        }
        this.$http.get('att/attFile/getMultiFileInfos', {
          fileIds: paramefile
        }, {
          _this: this
        }, res => {
          fileList = res.data
          if (fileList != null && fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
              let obj = {name: '', response: {}}
              obj.name = fileList[i].oldFileName
              obj.response.data = fileList[i]
              this.defaultFileList.push(obj)
            }
          }
        }, e => {
        })
      }
    },
    // 删除标准
    deleteStand (flag, itemid) {
      if (flag === 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除该条数据？',
          onOk: () => {
            this.$http.post('lawss/sarStandardsInfo/deleteSarStandards', {ids: itemid}, {
              _this: this
            }, res => {
              this.getDomesticStandardTable(this.tableFlag)
              this.selectedList = []
            }, e => {
            })
          },
          onCancel: () => {
          }
        })
      } else {
        if (this.selectedList.length === 0) {
          this.$Message.error('请先选择要删除的数据！')
        } else {
          this.$Modal.confirm({
            title: '提示',
            content: '确认删除选中数据？',
            onOk: () => {
              this.$http.post('lawss/sarStandardsInfo/deleteSarStandards', {ids: this.selectedList.join(',')}, {
                _this: this
              }, res => {
                this.getDomesticStandardTable(this.tableFlag)
                this.selectedList = []
              }, e => {
              })
            },
            onCancel: () => {
            }
          })
        }
      }
    },
    // 模板下载
    uploadImportModal (flag) {
      if (flag === 1) {
        window.open('/api/att/attFile/uploadModalFile?fileName=国内外标准导入模板.zip')
      } else {
        window.open('/api/att/attFile/uploadModalFile?fileName=标准条目导入模板.xlsx')
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 表单清空
    resetForm () {
      alert(0)
      this.modalshowflag = false
      // this.modalItemaddShowflag = false
      // this.menuModalFlag = false
      this.sarStandardsInfoEO.orgName = ''
      this.sarStandardsInfoEO.standFile = ''
      // this.standItemEO.orgName = ''
      this.sarStandardsInfoEO.testItems = ''
      this.sarStandardsInfoEO.lawsExplainQuote = ''
      // this.$refs.importFileAboutStand.clearFiles()
      // this.$refs['sarStandardsInfoForm'].resetFields()
      // this.$refs['sarStandardsItemForm'].resetFields()
      // this.$refs['addMenuForm'].resetFields()
      // $('.ivu-drawer-body').scrollTop(0)
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
    },
    changeInlandSubclassVal () {
      this.sarStandardsInfoEO.standSort = ''
      this.$http.get('sys/dictype/getDicTypeByParentCode', {
        dicTypeCode: 'CN'
      }, {
        _this: this
      }, res => {
        this.standSortOptions = res.data
        this.standSortConfigOptions = res.data
      }, e => {
      })
    },
    // 获取组织机构数据
    getOrgTreeSource () {
      this.$http.get('sys/org/getTree', {}, {_this: this},
        res => {
          if (res.ok) {
            let treeNode = []
            res.data.map((item, index) => {
              let treeItem = {}
              for (let key in item) {
                if (key === 'orgName') {
                  treeItem.name = item[key]
                } else {
                  treeItem[key] = item[key]
                }
              }
              treeNode[index] = treeItem
            })
            this.zNodesS = JSON.parse(JSON.stringify(treeNode))
            this.zNodesSItem = JSON.parse(JSON.stringify(treeNode))
            this.searchInlandNodes = JSON.parse(JSON.stringify(treeNode))
          }
        }, e => {})
    },
    // 所属部门选取
    treeDblClick (treeId, treeNode) {
      this.sarStandardsInfoEO.responsibleUnit = treeNode.id
      this.sarStandardsInfoEO.orgName = treeNode.name
      $('#deptBtn').click()
    }
  },
  computed: {
    // 是否拥有拖拽权限
    hasPermissionDrag () {
      let has = false
      let permissionList = this.$store.getters.getMenuList
      permissionList.map((menu) => {
        if (menu.id === '4EN5WW694V') {
          has = true
        }
      })
      return has
    }
  },
  mounted () {
    // 进入页面后查询树形结构目录
    this.selectMenu()
    this.treeReload = true
    // 从数据库中查询各下拉框数据
    this.$http.get('sys/dictype/getDicTypeListCode', '', {
      _this: this
    }, res => {
      this.countryOptions = res.data.COUNTRY
      // this.standSortOptions = res.data.STANDCLASSIFY
      this.applyArcticOptions = res.data.PRODUCTTYPE // 根据需求文档，产品类别对应标准属性中的“适用车型”
      this.standStateOptions = res.data.STANDSTATE
      this.standNatureOptions = res.data.SARPROPERTY // 标准性质
      this.adoptExtentOptions = res.data.DEGREESTANDARD
      this.emergyKindOptions = res.data.ENERGYTYPES
      this.applyAuthOptions = res.data.PROVETYPE // 适用认证下拉框
      this.categoryOptions = res.data.CATEGORY
      this.categoryConfigOptions = res.data.CATEGORY
      this.standAttributeList = res.data.RULETYPE
    }, e => {
    })
    this.changeInlandSubclassVal()
    this.getDomesticStandardTable(this.tableFlag)
    // 加载所有的部门
    this.getOrgTreeSource()
    this.tableHeight = $('.table-wrapper').height()
    window.onresize = () => {
      this.tableHeight = $('.table-wrapper').height()
    }
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
    }

    .tree-right {
      overflow-y: hidden;
      padding:10px;
      position: relative;
      width: 100%;
      /*.ivu-form-inline .ivu-form-item {*/
      /*  display: inline-block;*/
      /*  margin-right: 0;*/
      /*  vertical-align: top;*/
      /*}*/
      // 表格
      .content{
        overflow-y: auto;
        height: calc(100% - 7px);
      }
    }
    .content{
      display: flex;
      display: -ms-flex;
      display: -moz-flex;
      display: -webkit-flex;
      flex-direction: column;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      width: 100%;
      /*height: calc(~'100% - 70px')!important;*/
    }
    .table-wrapper{
      height: calc(~'100% - 115px')!important;
      overflow-y: auto;
    }

    .el-drawer-form{
      max-height: 570px;
      overflow-y: auto;
      padding-left: 25px;
    }
    .el-divider--horizontal {
      display: block;
      height: 1px;
      width: 100%;
      margin-bottom: 20px;
    }
    .tree-close{
      .tree{
        left: -200px !important;
      }
      .tree-right{
        width: calc(~'100% - 15px') !important;
      }
      .side-bar-collapse{
        background: #5596CC !important;
        color: #FFF;
      }
    }
    .noBottom{
      margin-bottom: 0;
    }
  }
</style>
