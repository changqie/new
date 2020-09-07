<template>
  <div id="domesticStandardDatabase" :class="{ 'tree-close': sideClose }" class="demo-spin-article">
    <div class="tree-content" :class="{ 'tree-closed': sideClose }">
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
          <el-form :modal="sarStandardsSearch" :inline="true" class="label-input-form">
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
          <el-form :modal="standCommonlySearch" :inline="true" class="label-input-form" >
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
            :row-class-name="dragRowClassName"
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
<!--                <el-button-->
<!--                  class="opera-btn"-->
<!--                  size="mini"-->
<!--                  type="primary"-->
<!--                  @click="handleDelete(scope.$index, scope.row)">更多</el-button>-->
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button type="primary" class="opera-btn" style="margin-left: 10px" size="mini">
                    更多
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
<!--                    <div v-if="this.collectBtn === false">-->
<!--                      <el-dropdown-item :command="beforeHandleCommand(scope.row, '收藏')">收藏</el-dropdown-item>-->
<!--                      <el-dropdown-item :command="beforeHandleCommand(scope.row, '取消收藏')">取消收藏</el-dropdown-item>-->
                    <el-dropdown-item :command="beforeHandleCommand(scope.row, collect)">{{collect}}</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(scope.row, '分享')">分享</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(scope.row, '移除标准')">移除标准</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(scope.row, '删除')">删除</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(scope.row, '流程')">流程</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
        <!-- 新增样式 -->
        <div class="demo-drawer__content">
        <div class="el-drawer-form">
          <el-form ref="sarStandardsInfoForm" :model="sarStandardsInfoEO" :rules="sarStandardsInfoRules"
                class="label-input-form">
            <el-row>
              <el-col :span="12">
                <el-form-item label="区域" prop="region" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.region" disabled>
                    <el-option v-for="opt in regionOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="国家" prop="country" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.country" disabled>
                    <el-option v-for="opt in countryOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准性质" prop="standNature" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.standNature" :disabled="formdisableflag" placeholder="请选择标准性质"
                          clearable>
                    <el-option v-for="opt in standNatureOptions" :key="opt.value" :value="opt.value === undefined ? '' :opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准状态" prop="standState" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.standState" :disabled="formdisableflag" placeholder="请选择标准状态"
                             clearable>
                    <el-option v-for="opt in standStateOptions" :key="opt.value" :value="opt.value === undefined ? '' :opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准失效日期" prop="standExpirationTime" label-width="130px" class="add-form-item">
                  <el-date-picker v-model="sarStandardsInfoEO.standExpirationTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择标准失效日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内容摘要" prop="synopsis" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.synopsis" :maxlength="500" show-word-limit type="textarea"
                            :autosize="{minRows: 1,maxRows: 4}" :disabled="formdisableflag" placeholder="请输入内容摘要"
                            clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准发布文本获得时间（印刷版）" title="标准发布文本获得时间（印刷版）" label-width="130px" prop="issueTextTime"
                              class="add-form-item">
                  <el-date-picker v-model="sarStandardsInfoEO.issueTextTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择标准发布文本获得时间（印刷版）"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准修订立项号" prop="revisionProjectNo" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.revisionProjectNo" :maxlength="200" :disabled="formdisableflag"
                            placeholder="请输入标准修订立项号" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="法规种类" prop="standAttribute" label-width="130px" class="add-form-item">
                  <search-select
                    v-model="sarStandardsInfoEO.standAttribute" :options="standAttributeList" placeholder="请选择法规种类"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="标准类别" prop="standSort" label-width="130px" class="add-form-item">
                  <search-select
                    v-model="sarStandardsInfoEO.standSort" :options="standSortOptions" placeholder="请选择标准类别"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准编号" prop="standNumber" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standNumber" :disabled="formdisableflag" placeholder="请输入标准编号"
                         clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准年份" prop="standYear" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standYear" :disabled="formdisableflag" placeholder="请输入标准年份"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标准名称" prop="standName" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standName" :disabled="formdisableflag" placeholder="请输入标准名称"
                         clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准英文名称" prop="standEnName" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.standEnName" :disabled="formdisableflag" placeholder="请输入标准英文名称"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布日期" prop="issueTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.issueTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择发布日期"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="实施日期" prop="putTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.putTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择实施日期"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="认证实施时间-CCC新车型" title="认证实施时间-CCC新车型" label-width="130px" prop="cccCertPutTime"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.cccCertPutTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择认证实施时间-CCC新车型"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="认证实施时间-公告新车型" title="认证实施时间-公告新车型" prop="noticeCertPutTime" label-width="130px"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.noticeCertPutTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择认证实施时间-公告新车型"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="认证实施时间-国环" title="认证实施时间-国环" prop="nationCertPutTime" label-width="130px"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.nationCertPutTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择认证实施时间-国环"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="认证实施时间-北环" title="认证实施时间-北环" label-width="130px" prop="northCertPutTime"
                              class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.northCertPutTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择认证实施时间-北环"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布日期是否明确" title="发布日期是否明确" prop="issueTimeCm" label-width="130px"
                              class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.issueTimeCm" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="新车型实施日期" title="新车型实施日期" prop="newcarPutTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.newcarPutTime" :editable="false" :disabled="formdisableflag" placeholder="请选择新车型实施日期"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="新车型实施日期 是否明确" title="新车型实施日期 是否明确" prop="newcarPutTimeCm" label-width="130px"
                              class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.newcarPutTimeCm" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="在产车实施日期" prop="productPutTime" label-width="130px" class="add-form-item" title="在产车实施日期">
                  <el-datePicker v-model="sarStandardsInfoEO.productPutTime" :editable="false" :disabled="formdisableflag" placeholder="请选择在产车实施日期"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="在产车实施日期 是否明确" title="在产车实施日期 是否明确" prop="productPutTimeCm" label-width="130px"
                              class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.productPutTimeCm" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="未立项—获稿时间" prop="unProjectTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.unProjectTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择未立项—获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="立项—获稿时间" prop="projectTime" label-width="130px" class="add-form-item"
                          title="立项—获稿时间">
                  <el-datePicker v-model="sarStandardsInfoEO.projectTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择立项—获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="适用认证" prop="applyAuth" label-width="130px" class="add-form-item">
<!--                  <search-multiple-select v-model="sarStandardsInfoEO.applyAuth"  :disabled="formdisableflag" placeholder="请选择适用认证" :options="applyAuthOptions">-->
                    <!--<el-option v-for="opt in applyAuthOptions" :value="opt.value" :key="opt.value">{{ opt.label }}</el-option>-->
<!--                  </search-multiple-select>-->
                  <el-select v-model="sarStandardsInfoEO.applyAuth" multiple placeholder="请选择适用认证" :filterable="true">
                    <el-option
                      v-for="opt in applyAuthOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发布部门" prop="issueUnit" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.issueUnit" :disabled="formdisableflag" placeholder="请输入发布部门"
                            clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
<!--            -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 代替和采标关系 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
            <el-divider content-position="left">代替和采标关系</el-divider>
            <el-row>
              <el-col :span="21">
                <el-form-item label="代替标准号" prop="replaceStandNum"  label-width="130px"  class="add-form-item">
                  <el-input v-model.trim="sarStandardsInfoEO.replaceStandNum" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button  class="searchAngNewBtn" type="primary" size="small" @click="selectStands">手动查找</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="被代替标准号" prop="replacedStandNum" label-width="130px"
                              class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.replacedStandNum" :maxlength="100" show-word-limit
                         :disabled="formdisableflag" type="textarea" :autosize="{minRows: 1,maxRows: 4}"
                         placeholder="请输入被代替标准号" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采用国际标准号" prop="interStandNum" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.interStandNum" :disabled="formdisableflag" placeholder="请输入采用国际标准号"
                            clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="适用车型" prop="applyArctic" label-width="130px" class="add-form-item">
<!--                  <search-multiple-select v-model="sarStandardsInfoEO.applyArctic" :disabled="formdisableflag"-->
<!--                                          placeholder="请选择适用车型" :options="applyArcticOptions">-->
<!--                  </search-multiple-select>-->
                  <el-select v-model="sarStandardsInfoEO.applyArctic" multiple placeholder="请选择适用车型" :filterable="true">
                    <el-option
                      v-for="opt in applyArcticOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="能源种类" prop="emergyKind" label-width="130px" class="add-form-item">
                  <!--                  <search-multiple-select v-model="sarStandardsInfoEO.emergyKind" multiple :disabled="formdisableflag"-->
                  <!--                                          placeholder="请选择能源种类" :options="emergyKindOptions">-->
                  <!--<el-option v-for="opt in emergyKindOptions" :value="opt.value" :key="opt.value">{{ opt.label }}-->
                  <!--</el-option>-->
                  <!--                  </search-multiple-select>-->
                  <el-select v-model="sarStandardsInfoEO.emergyKind" multiple placeholder="请选择能源种类" :filterable="true">
                    <el-option
                      v-for="opt in emergyKindOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="参与起草情况" prop="draftState" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.draftState" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入参与起草情况" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="修订依据" prop="reviseBasis" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.reviseBasis" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入修订依据" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="起草单位" prop="draftingUnit" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.draftingUnit" :disabled="formdisableflag" placeholder="请输入起草单位"
                         clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="起草人" prop="draftUser" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.draftUser" :disabled="formdisableflag" placeholder="请输入起草人"
                         clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
<!--            &lt;!&ndash;-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; 文本信息 -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
            <el-divider content-position="left">文本信息</el-divider>
            <el-row>
              <el-col :span="12">
                <el-form-item label="制修订计划完成时间" prop="planCompletionTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.planCompletionTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择制修订计划完成时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预测进入下制修订阶段时间" title="预测进入下制修订阶段时间" label-width="130px" prop="enterNextStageTime"
                          class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.enterNextStageTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择预测进入下制修订阶段时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="初稿" prop="firstDraftFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('firstDraftFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.firstDraftFile === 'null' || sarStandardsInfoEO.firstDraftFile === '' ||
                    sarStandardsInfoEO.firstDraftFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="初稿获稿时间" prop="firstDraftFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.firstDraftFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择初稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="初稿意见反馈" prop="firstDraftFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.firstDraftFileFeedback" :maxlength="100"
                         :disabled="formdisableflag" placeholder="请输入初稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="WTO公示稿获稿时间" prop="wtoPublicFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.wtoPublicFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择WTO公示稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="WTO公示稿意见反馈" prop="wtoPublicFileFeedback" label-width="130px"
                          class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.wtoPublicFileFeedback" :maxlength="100" :disabled="formdisableflag"
                         placeholder="请输入WTO公示稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="预计进入下一阶段时间" title="预计进入下一阶段时间"  prop="estimatedNextTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.estimatedNextTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择报批稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="征求意见稿" prop="opinionFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('opinionFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.opinionFile === 'null' || sarStandardsInfoEO.opinionFile === '' ||
                    sarStandardsInfoEO.opinionFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="征求意见稿获稿时间" prop="opinionFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.opinionFileTime" :editable="false" :disabled="formdisableflag"
                              placeholder="请选择征求意见稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="征求意见稿意见反馈" prop="opinionFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.opinionFileFeedback" :maxlength="100" :disabled="formdisableflag"
                         placeholder="请输入征求意见稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="送审稿获稿时间" prop="sentScreenFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.sentScreenFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择送审稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送审稿意见反馈" prop="sentScreenFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.sentScreenFileFeedback" :maxlength="100"
                         :disabled="formdisableflag" placeholder="请输入送审稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="报批稿" prop="approvalFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('approvalFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.approvalFile === 'null' || sarStandardsInfoEO.approvalFile === '' ||
                    sarStandardsInfoEO.approvalFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报批稿获稿时间" prop="approvalFileTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.approvalFileTime" :editable="false"
                              :disabled="formdisableflag" placeholder="请选择报批稿获稿时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="报批稿意见反馈" prop="approvalFileFeedback" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.approvalFileFeedback" :maxlength="100" :disabled="formdisableflag"
                         placeholder="请输入报批稿意见反馈"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="已收到以下部门适法性确认结果" title="已收到以下部门适法性确认结果" prop="recieveConfirmResult" label-width="130px"
                          class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.recieveConfirmResult" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入已收到以下部门适法性确认结果" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="试验首款车" prop="trialFirstCar" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.trialFirstCar" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入试验首款车" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="领域担当" prop="domainAssume" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.domainAssume" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入领域担当" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预算基准" prop="budgetBenchmark" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.budgetBenchmark" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入预算基准" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="法规解读内容" prop="lawsExplainText" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.lawsExplainText" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入法规解读内容" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法规解读关键字" prop="lawsExplainKeyword" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.lawsExplainKeyword" :maxlength="200" :disabled="formdisableflag"
                         placeholder="请输入法规解读关键字" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="法规解读文件" prop="lawsExplainFile" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.lawsExplainFile" v-show="false"></el-input>
                  <el-button size="small" @click="clickButtonToUpload('lawsExplainFileList')" icon="ios-cloud-upload-outline"
                             :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.lawsExplainFile === 'null' || sarStandardsInfoEO.lawsExplainFile === '' ||
                    sarStandardsInfoEO.lawsExplainFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否结题" prop="isQuestion" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.isQuestion" clearable>
                    <el-option v-for="opt in isList" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结题时间" prop="finalizeTime" label-width="130px" class="add-form-item">
                  <el-datePicker v-model="sarStandardsInfoEO.finalizeTime" :editable="false"
                                 :disabled="formdisableflag" placeholder="请选择结题时间"></el-datePicker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="结题附件" prop="finalizeFile" label-width="130px" class="add-form-item">
                  <el-button size="small" @click="clickButtonToUpload('finalizeFileList')" icon="ios-cloud-upload-outline"
                          :disabled="formdisableflag" class="form-upload-btn">
                    {{ (sarStandardsInfoEO.finalizeFile === 'null' || sarStandardsInfoEO.finalizeFile
                    === '' ||
                    sarStandardsInfoEO.finalizeFile == null) ? '点击上传' : '查看已上传的文件' }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!--<el-form-item label="责任部门" prop="responsibleUnit" class="add-form-item">-->
                <!--<el-input v-model="sarStandardsInfoEO.responsibleUnit" :disabled="formdisableflag"></el-input>-->
                <!--</el-form-item>-->
                <!-- 此处获取组织机构架构图 -->
                <el-form-item label="责任部门" prop="orgName" label-width="130px" class="add-form-item">
                  <el-input v-model="sarStandardsInfoEO.responsibleUnit" v-show="false"/>
                  <el-popover placement="bottom" popper-class="user-dept-popper" trigger="click" :value="false">
                    <el-input slot="reference"
                              v-model="sarStandardsInfoEO.orgName"
                              placeholder="请选择部门"
                              readonly
                              clearable
                              id="deptBtn"
                              @on-change="inputChange"/>
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
              <el-col :span="12">
                <el-form-item label="所属专业领域" prop="category" label-width="130px" class="add-form-item">
                  <!--                  <search-multiple-select-->
                  <!--                    v-if="modalshowflag"-->
                  <!--                    v-model="sarStandardsInfoEO.category"-->
                  <!--                    :options="categoryOptions"-->
                  <!--                    :disabled="formdisableflag"-->
                  <!--                    placeholder="请选择所属专业领域"/>-->
                  <el-select v-model="sarStandardsInfoEO.category" multiple placeholder="请选择所属专业领域" :filterable="true">
                    <el-option
                      v-for="opt in categoryOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总成分类" prop="assemClass" label-width="130px" class="add-form-item">
                  <el-select v-model="sarStandardsInfoEO.assemClass" multiple placeholder="请选择总成分类" :filterable="true">
                    <el-option
                      v-for="opt in assemClassOptions"
                      :key="opt.value"
                      :label="opt.label"
                      :value="opt.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!----------------------------------------------------- 相近标准 ----------------------------------------------------->
                        <el-divider content-position="left">相近标准</el-divider>
            <el-row>
              <el-col :span="24">
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
          <el-button size="small" type="primary" v-if="!formdisableflag" @click="saveOrUpdateStands" :loading="isSubmit"  class="searchAngNewBtn">提交</el-button>
          <el-button size="small" style="margin-right: 8px" type="primary" @click="resetForm"  class="searchAngNewBtn">取消</el-button>
        </div>
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
      <!--代替标准号-->
      <el-dialog title="代替标准号" :visible.sync="replaceStandNumModel" width="875px" :close-on-click-modal="false"  @close="replaceStandNumModelCancel = false">
        <el-form :modal="replaceStandNumForm" :inline="true"  class="label-input-form">
          <el-form-item label="标准号/名称"  class="serch-form-item">
            <el-input v-model="replaceStandNumForm.standNumber" placeholder="根据标准号/名称查找" clearable :maxlength="100"
                   @keyup.enter.native="getDomesticStandardTableBtn(standCommonlySearch)"></el-input>
          </el-form-item>
          <el-button
            :loading="searching"
            icon="el-icon-search"
            type="primary"
            size="mini"
            class="searchAngNewBtn"
            @click="getReplaceStandNumRow(1,replaceStandNumForm.pageSize, 'search')">
          </el-button>
          <el-button type="primary" size="small" @click="getReplaceStandNumRow('')"  class="searchAngNewBtn">清空查询</el-button>
        </el-form>
<!--        <Table border ref="selections" :columns="configStandColumn" :data="replaceStandNumRow" :height="350"-->
<!--               :loading="lawsExplainQuoteFormLoading"-->
<!--               @on-select="(selection, row) =>selectReplaceStandNumRowSelect(selection,'select', row )"-->
<!--               @on-select-cancel="(selection, row) =>selectReplaceStandNumRowSelect(selection, 'cancel', row)"-->
<!--               @on-select-all="(selection) =>selectReplaceStandNumRowSelect(selection, 'all')"-->
<!--               @on-select-all-cancel="(selection) =>selectReplaceStandNumRowSelect(selection, 'allCancel')"-->
<!--               @on-selection-change="selectReplaceStandNumRowChange"></Table>-->
        <el-table
          ref="selections"
          :data="replaceStandNumRow"
          :loading="lawsExplainQuoteFormLoading"
          tooltip-effect="dark"
          style="width: 100%;height:300px; overflow-y: auto;overflow-x: hidden;"
          border
          :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
          @selection-change="selectReplaceStandNumRowChange"
          @select-all="(selection) =>selectReplaceStandNumRowSelect(selection, 'all')"
          @select="(selection, row) =>selectReplaceStandNumRowSelect(selection,'select', row )">
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standNumber"
            label="标准号"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standName"
            label="标准名称"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="issueTime"
            label="发布日期"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="putTime"
            label="实施日期"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standNatureShow"
            label="标准性质"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standStateShow"
            label="标准状态"
            width="130"
            align="center">
          </el-table-column>
        </el-table>
<!--        <pagination :page="replaceStandNumForm.page " :total="replaceStandNumForm.total"-->
<!--                    @pageChange="(val) =>getReplaceStandNumRow(val, replaceStandNumForm.pageSize)"-->
<!--                    @pageSizeChange="(val) => getReplaceStandNumRow(replaceStandNumForm.page, val)"></pagination>-->
        <!--分页-->
        <pagination
          class="tabpagination"
          :page="replacePage"
          :total="replaceTotal"
          @pageChange="pageChangeReplace"
          @pageSizeChange="pageSizeChangeReplace"></pagination>
<!--        <el-divider></el-divider>-->
        <sapn slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="replaceStandNumModelCancel">取消</el-button>
          <el-button size="mini" type="primary" @click="replaceStandNumModelBt">确定</el-button>
        </sapn>
      </el-dialog>
      <!-- 法规解读标准引用-->
      <el-dialog title="法规解读标准引用" :visible.sync="lawsExplainQuoteModel" :close-on-click-modal="false"  width="875px">
        <el-form :modal="lawsExplainQuoteForm" :inline="true" class="label-input-form">
          <el-formItem label="标准号/名称" class="serch-form-item">
            <el-input v-model="lawsExplainQuoteForm.standNumber" placeholder="根据标准号/名称查找" clearable :maxlength="100"
                   @click.native="getDomesticStandardTableBtn(standCommonlySearch)"></el-input>
          </el-formItem>
          <el-button
            :loading="searching"
            icon="el-icon-search"
            type="primary"
            size="mini"
            class="newSearchBtn"
            @click="getLawsExplainQuoteRow(1,lawsExplainQuoteForm.pageSize, 'search')">
          </el-button>
          <el-button type="primary" @click="getLawsExplainQuoteRow('')" size="mini" class="searchAngNewBtn">清空查询</el-button>
        </el-form>
<!--        <Table border ref="selection" :columns="configStandColumn" :data="lawsExplainQuoteRow" :height="350"-->
<!--               :loading="lawsExplainQuoteFormLoading"-->
<!--               @on-select="(selection, row) =>selectLawsExplainQuoteRowSelect(selection,'select', row )"-->
<!--               @on-select-cancel="(selection, row) =>selectLawsExplainQuoteRowSelect(selection, 'cancel', row)"-->
<!--               @on-select-all="(selection) =>selectLawsExplainQuoteRowSelect(selection, 'all')"-->
<!--               @on-select-all-cancel="(selection) =>selectLawsExplainQuoteRowSelect(selection, 'allCancel')"-->
<!--               @on-selection-change="selectLawsExplainQuoteRowChange"></Table>-->
        <el-table
          ref="selections"
          :data="lawsExplainQuoteRow"
          :loading="lawsExplainQuoteFormLoading"
          tooltip-effect="dark"
          style="width: 100%;height:300px; overflow-y: auto;overflow-x: hidden;"
          border
          :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
          @selection-change="selectLawsExplainQuoteRowChange"
          @select="(selection, row) =>selectLawsExplainQuoteRowSelect(selection,'select', row )"
          @select-all="(selection) =>selectLawsExplainQuoteRowSelect(selection, 'all')">
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standNumber"
            label="标准号"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standName"
            label="标准名称"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="issueTime"
            label="发布日期"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="putTime"
            label="实施日期"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standNatureShow"
            label="标准性质"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standStateShow"
            label="标准状态"
            width="130"
            align="center">
          </el-table-column>
        </el-table>
<!--        <pagination :page="lawsExplainQuoteForm.page " :total="lawsExplainQuoteForm.total"-->
<!--                    @pageChange="(val) =>getLawsExplainQuoteRow(val, lawsExplainQuoteForm.pageSize)"-->
<!--                    @pageSizeChange="(val) => getLawsExplainQuoteRow(lawsExplainQuoteForm.page, val)"></pagination>-->
        <!--分页-->
        <pagination
          class="tabpagination"
          :page="page"
          :total="total"
          @pageChange="pageChangeLaws"
          @pageSizeChange="pageSizeChangeLaws"></pagination>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="canle">取消</el-button>
          <el-button type="primary" size="mini" @click="lawsExplainQuoteModelBt">确定</el-button>
        </div>
      </el-dialog>
      <!-- 试验项目-->
      <el-dialog title="试验项目" :visible.sync="testItemsModel" :close-on-click-modal="false"  width="1138px">
        <el-form :modal="testItemsForm" :inline="true"  class="label-input-form">
          <el-formItem label="试验项目名称" class="serch-form-item">
            <el-input v-model="testItemsForm.testItemName" placeholder="按试验项目名称查找" :maxlength="100" clearable
                   @keyup.enter.native="selectTestItemClassBtn"/>
          </el-formItem>
          <el-button
            :loading="searching"
            icon="el-icon-search"
            type="primary"
            size="mini"
            class="newSearchBtn"
            @click="getTestItemRow(1)">
          </el-button>
          <el-button type="primary" @click="getTestItemRow('')" size="mini" class="searchAngNewBtn">清空查询</el-button>
        </el-form>
<!--        <Table border ref="selection2" :columns="testItemTableColumn" :data="testItemTableList" :height="350"-->
<!--               :loading="testItemSearching"-->
<!--               @on-select="(selection, row) =>selectTestItemRowSelect(selection,'select', row )"-->
<!--               @on-select-cancel="(selection, row) =>selectTestItemRowSelect(selection, 'cancel', row)"-->
<!--               @on-select-all="(selection) =>selectTestItemRowSelect(selection, 'all')"-->
<!--               @on-select-all-cancel="(selection) =>selectTestItemRowSelect(selection, 'allCancel')"-->
<!--               @on-selection-change="selectTestItemRowChange"></Table>-->
<!--        <pagination :page="testItemsForm.page " :total="testItemsForm.total"-->
<!--                    @pageChange="(val) =>getTestItemRow(val, testItemsForm.pageSize)"-->
<!--                    @pageSizeChange="(val) => getTestItemRow(testItemsForm.page, val)"></pagination>-->
        <el-table
          ref="selections"
          :data="testItemTableList"
          :loading="testItemSearching"
          tooltip-effect="dark"
          style="width: 100%;height:300px; overflow-y: auto;overflow-x: hidden;"
          border
          :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
          @selection-change="selectTestItemRowChange"
          @select="(selection, row) =>selectTestItemRowSelect(selection,'select', row )"
          @select-all="(selection) =>selectTestItemRowSelect(selection, 'all')">
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column
            prop="testItemCode"
            label="项目代码"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="testObj"
            label="试验对象"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="testItemName"
            label="试验项目名称"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="authTypeShow"
            label="适用认证"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standCode"
            label="标准号"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="standName"
            label="标准名称"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="creationUser"
            label="创建人"
            width="130"
            align="center">
          </el-table-column>
          <el-table-column
            prop="creationTime"
            label="创建日期"
            width="130"
            align="center">
          </el-table-column>
        </el-table>
        <!--分页-->
<!--        <pagination :page="testItemsForm.page " :total="testItemsForm.total"-->
<!--                    @pageChange="(val) =>getTestItemRow(val, testItemsForm.pageSize)"-->
<!--                    @pageSizeChange="(val) => getTestItemRow(testItemsForm.page, val)"></pagination>-->
        <pagination
          class="tabpagination"
          :page="pageItems"
          :total="totalItems"
          @pageChange="pageChangeItems"
          @pageSizeChange="pageSizeChangeItems"></pagination>
        <div slot="footer">
          <el-button @click="testItemsModel=false" size="mini" type="primary">取消</el-button>
          <el-button type="primary" @click="testItemsModellBt" size="mini">确定</el-button>
        </div>
      </el-dialog>
      <!--                  导入模态窗                       -->
      <el-dialog :visible.sync="importModalshowflag" title="导入文件" :z-index="1000" :footer-hide="true">
        <el-upload
          multiple
          drag
          :action="importExcelUrl"
          ref="importfile"
          name="file"
          :max-size="204800"
          :format="importFileFormat"
          :on-format-error="handleFormatError"
          :on-success="importFileSuccess"
          :show-upload-list="showUploadlist">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">点击或拖拽上传文件</div>
        </el-upload>
      </el-dialog>
      <!-- 配置标准 -->
      <el-drawer title="配置标准" :mask-closable="false" :visible.sync="configStandFlag" :width="drawerWidth"  direction="rtl"
              :styles="stylesConfigDrawer"  size="83%" class="domestic-standard-database-config">
        <div class="demo-drawer__content">
          <el-form :model="sarConfigStandSearch" :inline="true" class="label-input-form" style="margin-left: 10px">
            <el-row>
              <el-col :span="6">
                <el-formItem label="标准名称" prop="standName" class="serch-form-item">
                  <el-input v-model="sarConfigStandSearch.standName" @keyup.enter.native="searchConfiguraStand"
                         placeholder="根据标准名称查找" clearable/>
                </el-formItem>
              </el-col>
              <el-col :span="6">
                <el-formItem label="标准号" prop="standNumber" class="serch-form-item">
                  <el-input v-model="sarConfigStandSearch.standNumber" @keyup.enter.native="searchConfiguraStand"
                         placeholder="根据标准号查找" clearable/>
                </el-formItem>
              </el-col>
              <el-col :span="6">
                <el-formItem label="标准类别" prop="standSort" class="serch-form-item">
                  <el-select v-model="sarConfigStandSearch.standSort" placeholder="根据标准类别查找"
                          @keyup.enter.native="searchConfiguraStand" clearable>
                    <el-option v-for="opt in standSortConfigOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-formItem>
              </el-col>
              <el-col :span="6">
                <el-formItem label="所属专业领域" class="serch-form-item">
                  <el-select v-model="sarConfigStandSearch.category" placeholder="根据所属专业领域查找"
                          @keyup.enter.native="searchConfiguraStand" clearable>
                    <el-option v-for="opt in categoryConfigOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-formItem>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-formItem label="标准性质" prop="standNature" class="serch-form-item">
                  <el-select v-model="sarConfigStandSearch.standNature" placeholder="根据标准性质查找"
                          @keyup.enter.native="searchConfiguraStand" clearable>
                    <el-option v-for="opt in standNatureOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-formItem>
              </el-col>
              <el-col :span="6">
                <el-formItem label="内容摘要" prop="synopsis" class="serch-form-item">
                  <el-input v-model="sarConfigStandSearch.synopsis" placeholder="根据内容摘要查找"
                         @keyup.enter.native="searchConfiguraStand" clearable/>
                </el-formItem>
              </el-col>
              <el-col :span="6">
                <el-formItem label="代替标准号" prop="replaceStandNum" class="serch-form-item">
                  <el-input v-model="sarConfigStandSearch.replaceStandNum" placeholder="根据代替标准查找"
                         @keyup.enter.native="searchConfiguraStand" clearable/>
                </el-formItem>
              </el-col>
              <el-col :span="6">
                <el-formItem label="适用车型" prop="applyArctic" class="serch-form-item">
                  <el-select v-model="sarConfigStandSearch.applyArctic" placeholder="根据适用车型查找"
                          @keyup.enter.native="searchConfiguraStand" clearable>
                    <el-option v-for="opt in applyArcticOptions" :value="opt.value === undefined ? '' :opt.value" :key="opt.value">{{ opt.label }}
                    </el-option>
                  </el-select>
                </el-formItem>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" :push="21">
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  class="searchAngNewBtn"
                  :loading="searching"
                  @click="selectConfiguraStand"></el-button>
                <el-button type="primary" size="small"  class="searchAngNewBtn" @click="clearAllSearch(3)">清空查询</el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-divider style="margin:4px 0 10px 0"/>
          <el-table
            ref="selection"
            :data="configStandList"
            tooltip-effect="dark"
            style="width: 100%;padding:0 10px 20px 10px"
            border
            :height="height"
            :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
            @selection-change="selectConfigStandChange">
            <el-table-column
              type="selection"
              width="55"
              align="center">
            </el-table-column>
            <el-table-column
              prop="standNumber"
              label="标准号"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="standName"
              label="标准名称"
              width="200"
              align="center">
            </el-table-column>
            <el-table-column
              prop="issueTime"
              label="发布日期"
              width="200"
              align="center">
            </el-table-column>
            <el-table-column
              prop="putTime"
              label="实施日期"
              width="200"
              align="center">
            </el-table-column>
            <el-table-column
              prop="standNatureShow"
              label="标准性质"
              width="200"
              align="center">
            </el-table-column>
            <el-table-column
              prop="standStateShow"
              label="标准状态"
              width="200"
              align="center">
            </el-table-column>
          </el-table>
          <loading :loading="loading">加载中...</loading>
          <div class="demo-drawer__footer">
            <div style="float: left">
            <pagination
              class="tabpagination"
              :page="configPage"
              :total="configTotal"
              @pageChange="configuraPageChange"
              @pageSizeChange="configuraPageSizeChange"></pagination>
            </div>
            <!--display:flex-->
            <div style="direction: rtl;margin-right: 20px">
              <el-button size="mini" type="primary" @click="saveConfigStand">提交</el-button>
              <el-button size="mini" style="padding-left: 10px" @click="cancelConfigStand">取 消</el-button>
            </div>
          </div>
        </div>
      </el-drawer>
      <!--                树---新增二级菜单模态窗                 -->
      <el-dialog :visible.sync="menuModalFlag" width="400px" :title="menuModalTitle">
        <el-form ref="addMenuForm" :model="sarMenu" :rules="sarMenuRules" class="label-input-form">
          <el-formItem label="名称" prop="menuName"  class="add-form-item" label-width="130px">
            <el-input v-model="sarMenu.menuName" placeholder="请输入名称" style="width: 6rem"></el-input>
          </el-formItem>
          <el-formItem label="序号" prop="displaySeq"  class="add-form-item"  label-width="130px">
            <el-input v-model.number="sarMenu.displaySeq" placeholder="只允许输入正整数" maxlength="2"
                   style="width: 6rem"></el-input>
          </el-formItem>
          <el-formItem label="备注" prop="remarks"  class="add-form-item"  label-width="130px">
            <el-input v-model="sarMenu.remarks" placeholder="请输入备注信息" style="width: 6rem"></el-input>
          </el-formItem>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="resetTreeDialog">取消</el-button>
          <el-button type="primary" size="mini" @click="newMenu">确定</el-button>
        </div>
      </el-dialog>
      <!--   树----删除   -->
      <el-dialog title="确认删除" width="300px"  :visible.sync="deleteMenuModal" @on-ok="sureDeleteSarMenu"
             @on-cancel="deleteMenuModal = false">
        <p>该节点下有记录，是否删除？</p>
      </el-dialog>
      <!--   分享           -->
      <el-drawer title="分享标准" :visible.sync="drawerModal" width="300" :styles="drawerModalstyles">
        <div class="demo-drawer__content" style="height: 90%">
        <dept-tree treeDivId="drawerModalTree"
                   ref="drawerModalTree"
                   @treeClick="selcetTree"
                   allDept
                   showUser
                   :editable="false"
                   style="padding: 0 15px">
        </dept-tree>
        <div class="demo-drawer__footer" style="direction: rtl">
          <el-divider></el-divider>
          <el-button style="margin-right: 8px" type="primary" size="mini" @click="shareStandardBt">确定</el-button>
          <el-button style="margin-right: 8px" size="mini" @click="treeCancel">取消</el-button>
        </div>
        </div>
      </el-drawer>

    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  name: 'domesticStandardsAndRegulations',
  components: {
  },
  data () {
    return {
      // 收藏标准
      personCollect: {
        collectResId: '',
        collectTitle: '',
        collectType: ''
      },
      loading: false,
      spinShow: false,
      isCollapse: true,
      sideClose: false, // 边栏收展状态
      isAdvancedSearch: false, // 高级检索窗口是否打开
      replaceStandNumModel: false,
      lawsExplainQuoteModel: false,
      page: 1,
      total: 0,
      rows: 10,
      replacePage: 1,
      replaceTotal: 0,
      replaceRows: 10,
      pageItems: 1,
      totalItems: 0,
      itemsRows: 10,
      configPage: 1,
      configTotal: 0,
      configRows: 10,
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
      countryOptions: [],
      regionOptions: [], // 区域
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
      assemClassOptions: [], // 总成分类下拉框
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
        region: '东亚',
        issueUnit: '', // 发布部门
        assemClass: '',
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
      modalItemaddShowflag: false, // 新增标准条目显示
      standItemEO: {
        id: '',
        standId: '',
        itemsNum: '',
        itemsName: '',
        parts: '',
        tackTime: '',
        applyArctic: '', // 试用车型
        energyKind: '', // 能源种类
        responsibleUnit: '',
        remarks: '',
        orgName: ''
      }, // 标准条目新增过程中用到对象
      menuModalTitle: '',
      menuModalFlag: false,
      deleteMenuModal: false,
      sarMenu: {
        id: '',
        parentId: '',
        menuName: '',
        sorDivide: 'INLAND_STAND',
        displaySeq: 0,
        parentIds: '',
        remarks: ''
      }, // 二级菜单对象，主要用于新增和修改
      testItemsModel: false,
      formdisableflag: false, // 查看标准不可编辑
      modalshowtitle: '新增国内标准',
      addOrUPdateFlag: 1, // 新增：1， 修改：2
      itemAddOrUPdateFlag: 1, // 新增：1， 修改：2
      menuAddOrUpdateFlag: 1, // 新增：1， 修改：2
      standNumFlag: 1, // 新增：1， 修改：2
      sarMenuRules: {
        menuName: [
          {required: true, message: '目录名称不能为空', trigger: 'blur'},
          {type: 'string', max: 100, message: '目录名称不能超过100个字符', trigger: 'blur'}
          // {type: 'string', validator: this.verify.checkSpecialCharacter2, trigger: 'blur'}
        ],
        displaySeq: [
          {type: 'number', required: true, message: '序号不能为空且为正整数', trigger: 'blur'},
          {type: 'string', validator: this.verify.validStandNumInCompile2, trigger: 'blur'}
        ],
        remarks: [
          {type: 'string', max: 100, message: '备注不能超过100个字符', trigger: 'blur'}
          // {validator: this.verify.checkSpecialCharacter2, trigger: 'blur'}
        ]
      },
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
      },
      // 代替标准号
      replaceStandNumForm: {
        standNumber: '',
        page: 1,
        pageSize: this.$store.getters.userInfo.configContent,
        total: 0,
        standType: 'INLAND',
        quoteIdList: '',
        validFlag: '0'
      },
      replaceStandNumRow: [],
      lawsExplainQuoteRow: [],
      lawsExplainQuoteFormLoading: false,
      testItemTableList: [],
      testItemSearching: false,
      testItemModelNum: [],
      replaceStandNumModelNum: [],
      lawsExplainQuoteModelNum: [],
      selectedListRep: [],
      quoteIdList1: '',
      selectedList1: [],
      selectedList2: [],
      testItemsForm: {
        testItemName: '',
        page: 1,
        pageSize: this.$store.getters.userInfo.configContent,
        total: 0,
        testIdList: ''
      },
      lawsExplainQuoteForm: {
        standNumber: '',
        page: 1,
        pageSize: this.$store.getters.userInfo.configContent,
        total: 0,
        standType: 'INLAND',
        quoteIdList: '',
        validFlag: '0'
      },
      // 提交状态
      isSubmit: false,
      selectSarMenu: {}, // 用来记录当前选中的二级菜单对象
      importModalshowflag: false,
      showUploadlist: true, // 导入过程中新增数据时，如果数据错误，不出现导入列表
      importFileFormat: [],
      importExcelUrl: '', // 导入EXCEL文档
      modalStandItemflag: false, // 标准条目显示
      importFailed: false,
      importForm: {
        content: ''
      },
      standItemSearch: {
        standId: '',
        responsibleUnit: '',
        orgName: '',
        validFlag: '0'
      },
      standItemList: [],
      drawerWidth: 1400,
      // 配置标准相关 开始
      configStandFlag: false, // 控制配置标准表格是否显示
      drawerModal: false, // 分享
      drawerModalstyles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      // start 分享相关的
      shareStandardModal: false,
      shareStandardSelect: [],
      resPk: '', // 分享，消息推送过程中记录要推送的标准
      stylesConfigDrawer: {
        overflow: 'auto',
        position: 'static'
      },
      sarConfigStandSearch: {
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
        replacedStandNum: ''
      }, // 分页查询过程中用到的对象
      configStandList: [],
      height: 430,
      configStandtotal: 0,
      selectConfigStand: [],
      collectBtn: false,
      collect: '收藏'
    }
  },
  props: {
  },
  watch: {
  },
  methods: {
    // 更多
    handleCommand (command) {
      // 可以相对应的进行操作
      console.log('command', command)
      let item = command.index
      this.collectBtn = command.index.collectBtn
      // 收藏、取消收藏---判断
      if (command.index.collectBtn === false) {
        this.collect = '收藏'
      } else {
        this.collect = '取消收藏'
      }
      console.log('让我来康康', this.collectBtn)
      switch (command.row) {
        case '收藏':
          console.log(item) // 收藏
          console.log('collectBtn', command.index.collectBtn) // 收藏-状态
          this.collectStandard(item)
          // this.collectBtn = true
          break
        case '分享':
          console.log(item) // 分享 NO
          this.drawerModal = true
          this.$nextTick(() => {
            this.$refs.drawerModalTree.clearSearch()
          })
          this.resPk = JSON.parse(JSON.stringify(item))
          break
        case '移除标准':
          this.deleteStandFromKind(1, item.id)
          break
        case '删除':
          this.deleteStand(1, item.id)
          break
        case '流程':
          console.log(item) // 流程 NO
          break
        case '取消收藏':
          console.log(item) // 收藏
          console.log('collectBtn', command.index.collectBtn, '取消收藏') // 收藏-状态
          this.cancelCollectStandard(item)
          // this.collectBtn = false
          break
      }
    },
    beforeHandleCommand (index, row, command) {
      console.log('command', command)
      return { index, row, command }
    },
    collectStandard (item) {
      this.spinShow = true
      item.isSubmit = true
      this.personCollect.collectResId = item.id
      if (item.standYear != null && item.standYear !== '') {
        this.personCollect.collectTitle = item.standName + '  ( 编号:' + item.standSort + ' ' + item.standNumber + '-' + item.standYear + ' )'
      } else {
        this.personCollect.collectTitle = item.standName + '  ( 编号:' + item.standSort + ' ' + item.standNumber + ' )'
      }
      this.personCollect.collectType = 'INLAND_STAND'
      this.$http.postData('person/personCollect', this.personCollect, {
        _this: this
      }, res => {
        this.spinShow = false
        item.isSubmit = false
        item.collectBtn = !item.collectBtn
        item.cancelCollectBtn = !item.cancelCollectBtn
        item.collectId = res.data.id
        if (item.collectBtn === false) {
          this.collect = '收藏'
        } else {
          this.collect = '取消收藏'
        }
      }, e => {
        item.isSubmit = false
      })
      // this.collect = '取消收藏'
    },
    // 取消收藏法规
    cancelCollectStandard (item) {
      this.spinShow = true
      item.isSubmit = true
      this.$http.put('person/personCollect/updateByUserId', {
        id: item.collectId
      }, {
        _this: this
      }, res => {
        this.spinShow = false
        item.isSubmit = false
        item.collectBtn = !item.collectBtn
        item.cancelCollectBtn = !item.cancelCollectBtn
        item.collectId = ''
        if (item.collectBtn === false) {
          this.collect = '收藏'
        } else {
          this.collect = '取消收藏'
        }
      }, e => {
        item.isSubmit = false
      })
      // this.collect = '收藏'
    },
    // 查看标准属性
    selectStandardPro (item, state) {
      this.addOrUPdateFlag = 2
      console.log('selectItem', item)
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
      if (this.sarStandardsInfoEO.assemClass != null && !(this.sarStandardsInfoEO.assemClass instanceof Array)) {
        a = item.assemClass.split(',')
        this.sarStandardsInfoEO.assemClass = a // 总成分类
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
        this.sarStandardsSearch.country = ''
        this.sarStandardsSearch.standSort = ''
        this.sarStandardsSearch.standNumber = ''
        this.sarStandardsSearch.standName = ''
        this.sarStandardsSearch.standState = ''
        this.sarStandardsSearch.standNature = ''
        this.sarStandardsSearch.issueTime = ''
        this.sarStandardsSearch.applyArctic = ''
        this.sarStandardsSearch.replaceStandNum = ''
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
        this.sarConfigStandSearch.replaceStandNum = ''
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
      return this.sideClose ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
      // return 'el-icon-arrow-left'
    },
    resetTreeDialog () {
      this.menuModalFlag = false
      this.$refs['addMenuForm'].resetFields()
    },
    // 点击二级菜单新增模态框中的保存
    newMenu () {
      this.$refs['addMenuForm'].validate((valid) => {
        if (valid) {
          if (this.menuAddOrUpdateFlag === 1) {
            this.sarMenu.parentId = this.selectSarMenu.id
            if (this.selectSarMenu.parentIds != null) {
              this.sarMenu.parentIds = this.selectSarMenu.parentIds + ',' + this.selectSarMenu.id
            } else {
              this.sarMenu.parentIds = this.selectSarMenu.id
            }
            this.$http.post('lawss/sarMenu/addSarMenu', this.sarMenu, {
              _this: this, loading: 'loading'
            }, res => {
              this.selectMenu() // 新增成功后，更新二级菜单
              this.menuModalFlag = false
            }, e => {
            })
          } else {
            this.$http.post('lawss/sarMenu/updateSarMenu', this.sarMenu, {
              _this: this, loading: 'loading'
            }, res => {
              this.selectMenu() // 修改成功后，更新二级菜单
              this.selectSarMenu = res.data
              this.menuModalFlag = false
            }, e => {
            })
          }
        } else {
        }
      })
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
    // 树-删除
    sureDeleteSarMenu () {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('lawss/sarMenu/deleteMenuAndChildren', this.selectSarMenu, {
          _this: this, loading: 'loading'
        }, res => {
          this.selectMenu() // 删除成功后，更新二级菜单
          // 获取下一个节点
          let currentNode = this.$refs.domesticTree.getNextNode()
          let nodeId = ''
          // 如果这个节点为null, 本次删除了最后一个节点
          if (currentNode === null) {
            // 选中根节点
            this.$refs.domesticTree.selectRootNode()
          } else {
            nodeId = currentNode.id
          }
          this.getDomesticStandardTable(nodeId)
        }, e => {
        })
      }).catch(() => {
        // 取消删除，清空选择
        // this.$refs.selections.clearSelection()
      })

      // this.$Modal.confirm({
      //   title: '提示',
      //   content: '<p>是否删除?</p>',
      //   onOk: () => {
      //     this.$http.post('lawss/sarMenu/deleteMenuAndChildren', this.selectSarMenu, {
      //       _this: this, loading: 'loading'
      //     }, res => {
      //       this.selectMenu() // 删除成功后，更新二级菜单
      //       // 获取下一个节点
      //       let currentNode = this.$refs.domesticTree.getNextNode()
      //       let nodeId = ''
      //       // 如果这个节点为null, 本次删除了最后一个节点
      //       if (currentNode === null) {
      //         // 选中根节点
      //         this.$refs.domesticTree.selectRootNode()
      //       } else {
      //         nodeId = currentNode.id
      //       }
      //       this.getDomesticStandardTable(nodeId)
      //     }, e => {
      //     })
      //   },
      //   onCancel: () => {
      //   }
      // })
    },
    // 树点击
    selcetTree (treeId, treeNode) {
      this.shareStandardSelect = treeNode.id
    },
    // 取消
    treeCancel () {
      this.drawerModal = false
      this.$refs.drawerModalTree.treeReload()
    },
    // 消息推送
    shareStandardBt () {
      if (this.shareStandardSelect.length === 0) {
        this.$message({
          message: '请选择要分享的人！',
          type: 'warning'
        })
      } else {
        this.personShareEO.resType = 'INLAND_STAND'
        if (this.resPk.standYear != null && this.resPk.standYear !== '') {
          this.personShareEO.resTitle = this.resPk.standName + '  ( 编号 :' + this.resPk.standSort + ' ' + this.resPk.standNumber + '-' + this.resPk.standYear + ' )'
        } else {
          this.personShareEO.resTitle = this.resPk.standName + '  ( 编号 :' + this.resPk.standSort + ' ' + this.resPk.standNumber + ' )'
        }
        this.personShareEO.resId = this.resPk.id
        this.personShareEO.recipientId = this.shareStandardSelect
        this.$http.post('/person/personShare/savePersonShare', this.personShareEO, {
          _this: this
        }, res => {
          this.$message({
            message: '标准分享成功！',
            type: 'success'
          })
          this.shareStandardModal = false
          this.drawerModal = false
          this.shareStandardSelect = []
          this.$refs.drawerModalTree.treeReload()
        }, e => {
          this.$message.error('标准分享失败!')
        })
      }
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
    // 获取拖拽行的id
    dragRowClassName (row, index) {
      return 'drag-row' + ' ' + 'id=' + row.id
    },
    // 拖拽事件
    drag (treeNode, dragId) {
      if (treeNode !== null) {
        let search = {
          menuId: treeNode.id,
          idlist: this.selectedList.length ? this.selectedList : dragId
        }
        this.$http.postData('lawss/sarStandardsInfo/saveStandardsMenu', search, {
          _this: this
        }, res => {
          if (res.ok) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getDomesticStandardTable(this.tableFlag)
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            })
          }
        }, e => {
        })
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
      this.$refs['sarStandardsInfoForm'].resetFields()
    },
    testItemsClick () {
      // if (this.testItemsModel) {
      //   return false
      // }
      this.testItemsModel = true
      // $('#testItems').click()
      // this.selectedList2 = []
      // this.$refs.selection2.selectAll(false)
      this.testItemsForm.testItemName = ''
      this.getTestItemRow('')
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
      // this.$message.error('文件' + file.name + '格式不正确，请上传pdf、doc、docx、ppt、pptx文件')
      this.$message({
        showClose: true,
        message: '文件' + file.name + '格式不正确，请上传pdf、doc、docx、ppt、pptx文件',
        type: 'error'
      })
    },
    // 导入文件大小超出范围
    handleSizeError (file) {
      this.spinShow = false
      // this.$message.error('文件' + file.name + '大小不超过200M')
      this.$message({
        showClose: true,
        message: '文件' + file.name + '大小不超过200M',
        type: 'error'
      })
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
        (
          this.$confirm('确认删除这些数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('lawss/sarStandardsInfo/deleteSarStandards', {ids: itemid}, {
              _this: this
            }, res => {
              this.getDomesticStandardTable(this.tableFlag)
              this.selectedList = []
            }, e => {
            })
          }).catch(() => {
            // 取消删除，清空选择
            this.$refs.multipleTable.clearSelection()
          })
        )
      } else {
        if (this.selectedList.length === 0) {
          this.$confirm('请选择一条数据进行删除?', '提示', {
            showCancelButton: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } else {
          (
            this.$confirm('确认删除这些数据?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post('lawss/sarStandardsInfo/deleteSarStandards', {ids: this.selectedList.join(',')}, {
                _this: this
              }, res => {
                this.getDomesticStandardTable(this.tableFlag)
                this.selectedList = []
              }, e => {
              })
            }).catch(() => {
              // 取消删除，清空选择
              this.$refs.multipleTable.clearSelection()
            })
          )
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
    // 点击导入标准
    addImportModal (flag) {
      // this.$refs.importfile.clearFiles()
      if (flag === 1) {
        let menuId = this.selectSarMenu.id
        if (menuId == null || menuId === '') {
          this.$message({
            showClose: true,
            message: '请选择标准导入的目录',
            type: 'error'
          })
        } else {
          this.importModalshowflag = true
          this.showUploadlist = true
          this.importFileFormat = ['zip']
          this.importExcelUrl = '/api/lawss/sarStandardsInfo/importZipStandardsInfo?standType=INLAND&menuId=' + menuId
        }
      } else {
        this.importModalshowflag = true
        this.importFileFormat = ['xlsx']
        this.importExcelUrl = '/api/lawss/sarStandItems/importSarStandItemsList?standId=' + this.standItemSearch.standId
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
      this.modalshowflag = false
      this.modalItemaddShowflag = false
      this.menuModalFlag = false
      this.sarStandardsInfoEO.orgName = ''
      this.sarStandardsInfoEO.standFile = ''
      this.standItemEO.orgName = ''
      this.sarStandardsInfoEO.testItems = ''
      this.sarStandardsInfoEO.lawsExplainQuote = ''
      // this.$refs.importFileAboutStand.clearFiles()
      this.$refs['sarStandardsInfoForm'].resetFields()
      this.$refs['sarStandardsItemForm'].resetFields()
      this.$refs['addMenuForm'].resetFields()
      $('.ivu-drawer-body').scrollTop(0)
    },
    // 标准号验证
    validateStandNumber (standinfo) {
      return new Promise((resolve, reject) => {
        let obj = JSON.parse(JSON.stringify(standinfo))
        this.$http.post('lawss/sarStandardsInfo/validateStandNumber', obj, {
          _this: this
        }, res => {
          if (res.ok) {
            resolve(true)
          } else {
            /* this.$Modal.error({
                        title: '提示消息',
                        content: res.message
                      }); */
            resolve(false)
          }
        }, e => {
          reject(e)
        })
      })
    },
    // 保存或修改标准
    saveOrUpdateStands () {
      this.isSubmit = true
      this.$refs['sarStandardsInfoForm'].validate((valid) => {
        if (valid) {
          alert(0)
          // 验证标准号是否唯一
          this.validateStandNumber(this.sarStandardsInfoEO).then((flag) => {
            if (flag) {
              // 时间格式修改
              let nowstandinfo = JSON.parse(JSON.stringify(this.sarStandardsInfoEO))
              if (nowstandinfo.issueTime != null && nowstandinfo.issueTime !== '') {
                nowstandinfo.issueTime = this.$dateFormat(this.sarStandardsInfoEO.issueTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.putTime != null && nowstandinfo.putTime !== '') {
                nowstandinfo.putTime = this.$dateFormat(this.sarStandardsInfoEO.putTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.newcarPutTime != null && nowstandinfo.newcarPutTime !== '') {
                nowstandinfo.newcarPutTime = this.$dateFormat(this.sarStandardsInfoEO.newcarPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.standExpirationTime != null && nowstandinfo.standExpirationTime !== '') {
                nowstandinfo.standExpirationTime = this.$dateFormat(this.sarStandardsInfoEO.standExpirationTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.noticeCertPutTime != null && nowstandinfo.noticeCertPutTime !== '') {
                nowstandinfo.noticeCertPutTime = this.$dateFormat(this.sarStandardsInfoEO.noticeCertPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.cccCertPutTime != null && nowstandinfo.cccCertPutTime !== '') {
                nowstandinfo.cccCertPutTime = this.$dateFormat(this.sarStandardsInfoEO.cccCertPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.nationCertPutTime != null && nowstandinfo.nationCertPutTime !== '') {
                nowstandinfo.nationCertPutTime = this.$dateFormat(this.sarStandardsInfoEO.nationCertPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.northCertPutTime != null && nowstandinfo.northCertPutTime !== '') {
                nowstandinfo.northCertPutTime = this.$dateFormat(this.sarStandardsInfoEO.northCertPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.noticeProductPutTime != null && nowstandinfo.noticeProductPutTime !== '') {
                nowstandinfo.noticeProductPutTime = this.$dateFormat(this.sarStandardsInfoEO.noticeProductPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.cccProductPutTime != null && nowstandinfo.cccProductPutTime !== '') {
                nowstandinfo.cccProductPutTime = this.$dateFormat(this.sarStandardsInfoEO.cccProductPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.nationProductPutTime != null && nowstandinfo.nationProductPutTime !== '') {
                nowstandinfo.nationProductPutTime = this.$dateFormat(this.sarStandardsInfoEO.nationProductPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.northProductPutTime != null && nowstandinfo.northProductPutTime !== '') {
                nowstandinfo.northProductPutTime = this.$dateFormat(this.sarStandardsInfoEO.northProductPutTime, 'yyyy-MM-dd hh:mm:ss')
              }

              if (nowstandinfo.issueTextTime != null && nowstandinfo.issueTextTime !== '') {
                nowstandinfo.issueTextTime = this.$dateFormat(this.sarStandardsInfoEO.issueTextTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.registerPutTime != null && nowstandinfo.registerPutTime !== '') {
                nowstandinfo.registerPutTime = this.$dateFormat(this.sarStandardsInfoEO.registerPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.wtoPublicFileTime != null && nowstandinfo.wtoPublicFileTime !== '') {
                nowstandinfo.wtoPublicFileTime = this.$dateFormat(this.sarStandardsInfoEO.wtoPublicFileTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.sentScreenFileTime != null && nowstandinfo.sentScreenFileTime !== '') {
                nowstandinfo.sentScreenFileTime = this.$dateFormat(this.sarStandardsInfoEO.sentScreenFileTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.opinionFileTime != null && nowstandinfo.opinionFileTime !== '') {
                nowstandinfo.opinionFileTime = this.$dateFormat(this.sarStandardsInfoEO.opinionFileTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.approvalFileTime != null && nowstandinfo.approvalFileTime !== '') {
                nowstandinfo.approvalFileTime = this.$dateFormat(this.sarStandardsInfoEO.approvalFileTime, 'yyyy-MM-dd hh:mm:ss')
              }

              if (nowstandinfo.firstDraftFileTime != null && nowstandinfo.firstDraftFileTime !== '') {
                nowstandinfo.firstDraftFileTime = this.$dateFormat(this.sarStandardsInfoEO.firstDraftFileTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.planCompletionTime != null && nowstandinfo.planCompletionTime !== '') {
                nowstandinfo.planCompletionTime = this.$dateFormat(this.sarStandardsInfoEO.planCompletionTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.enterNextStageTime != null && nowstandinfo.enterNextStageTime !== '') {
                nowstandinfo.enterNextStageTime = this.$dateFormat(this.sarStandardsInfoEO.enterNextStageTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.productPutTime != null && nowstandinfo.productPutTime !== '') {
                nowstandinfo.productPutTime = this.$dateFormat(this.sarStandardsInfoEO.productPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.newproductPutTime != null && nowstandinfo.newproductPutTime !== '') {
                nowstandinfo.newproductPutTime = this.$dateFormat(this.sarStandardsInfoEO.newproductPutTime, 'yyyy-MM-dd hh:mm:ss')
              }
              if (nowstandinfo.applyArctic != null && nowstandinfo.applyArctic instanceof Array) {
                nowstandinfo.applyArctic = nowstandinfo.applyArctic.join(',') // 适用车型
              }
              if (nowstandinfo.emergyKind != null && (nowstandinfo.emergyKind instanceof Array)) {
                nowstandinfo.emergyKind = nowstandinfo.emergyKind.join(',') // 能源种类
              }
              if (nowstandinfo.applyAuth != null && (nowstandinfo.applyAuth instanceof Array)) {
                nowstandinfo.applyAuth = nowstandinfo.applyAuth.join(',') // 适用认证
              }
              if (nowstandinfo.category != null && (nowstandinfo.category instanceof Array)) {
                nowstandinfo.category = nowstandinfo.category.join(',') // 所属类别
              }
              if (nowstandinfo.assemClass != null && (nowstandinfo.assemClass instanceof Array)) {
                nowstandinfo.assemClass = nowstandinfo.assemClass.join(',') // 总成分类
              }
              if (nowstandinfo.lawsExplainQuote != null && (nowstandinfo.lawsExplainQuote instanceof Array)) {
                nowstandinfo.lawsExplainQuote = nowstandinfo.lawsExplainQuote.join(',')
              }
              if (nowstandinfo.testItems != null && (nowstandinfo.testItems instanceof Array)) {
                nowstandinfo.testItems = nowstandinfo.testItems.join(',')
              }
              // if (nowstandinfo.replaceStandNum != null) {
              //   nowstandinfo.replaceStandNum = nowstandinfo.replaceStandNum.replace(/，/ig, ',')
              // }
              // 代替标准号
              if (nowstandinfo.replaceStandNum != null && (nowstandinfo.replaceStandNum instanceof Array)) {
                nowstandinfo.replaceStandNum = nowstandinfo.replaceStandNum.join(',')
              }
              if (nowstandinfo.replacedStandNum != null) {
                nowstandinfo.replacedStandNum = nowstandinfo.replacedStandNum.replace(/，/ig, ',')
              }
              // 内容摘要
              if (nowstandinfo.synopsis != null && nowstandinfo.synopsis !== '') {
                nowstandinfo.synopsis = nowstandinfo.synopsis.replace(/\r\n/g, '<br />')
                nowstandinfo.synopsis = nowstandinfo.synopsis === '' ? '' : nowstandinfo.synopsis.replace(/\n/g, '<br />')
              }
              // // 代替标准号
              // if (nowstandinfo.replaceStandNum != null && nowstandinfo.replaceStandNum !== '') {
              //   nowstandinfo.replaceStandNum = nowstandinfo.replaceStandNum.replace(/\r\n/g, '<br />')
              //   nowstandinfo.replaceStandNum = nowstandinfo.replaceStandNum === '' ? '' : nowstandinfo.replaceStandNum.replace(/\n/g, '<br />')
              // }
              // 被代替标准号
              if (nowstandinfo.replacedStandNum != null && nowstandinfo.replacedStandNum !== '') {
                nowstandinfo.replacedStandNum = nowstandinfo.replacedStandNum.replace(/\r\n/g, '<br />')
                nowstandinfo.replacedStandNum = nowstandinfo.replacedStandNum === '' ? '' : nowstandinfo.replacedStandNum.replace(/\n/g, '<br />')
              }
              // 关键词
              if (nowstandinfo.tags != null && nowstandinfo.tags !== '') {
                nowstandinfo.tags = nowstandinfo.tags.replace(/\r\n/g, '<br />')
                nowstandinfo.tags = nowstandinfo.tags === '' ? '' : nowstandinfo.tags.replace(/\n/g, '<br />')
              }
              // 备注
              if (nowstandinfo.remark != null && nowstandinfo.remark !== '') {
                nowstandinfo.remark = nowstandinfo.remark.replace(/\r\n/g, '<br />')
                nowstandinfo.remark = nowstandinfo.remark === '' ? '' : nowstandinfo.remark.replace(/\n/g, '<br />')
              }
              nowstandinfo.certPutTimeList = [
                {
                  timeName: '公告新车型',
                  putTime: nowstandinfo.noticeCertPutTime
                },
                {
                  timeName: 'CCC新车型',
                  putTime: nowstandinfo.cccCertPutTime
                },
                {
                  timeName: '国环受理时间',
                  putTime: nowstandinfo.nationCertPutTime
                },
                {
                  timeName: '北环受理时间',
                  putTime: nowstandinfo.northCertPutTime
                }

              ]
              // addOrUPdateFlag 1:新增 2:修改
              if (this.addOrUPdateFlag === 1) {
                nowstandinfo.menuId = this.selectSarMenu.id // 新建过程中标准所属目录是当前目录
                if (nowstandinfo.replaceStandNum != null && nowstandinfo.standNumber !== '') {
                  nowstandinfo.upReplaceNumFlag = 1
                }
                this.$http.postData('lawss/sarStandardsInfo/addarStandardsInfo', nowstandinfo, {
                  _this: this
                }, res => {
                  this.isSubmit = false
                  if (res.ok) {
                    this.getDomesticStandardTable(this.tableFlag)
                    this.resetForm()
                  }
                }, e => {
                  this.isSubmit = false
                })
              } else {
                this.addOrUPdateFlag = 2
                if (nowstandinfo.replaceStandNum !== this.saveOldReplaceNum) {
                  nowstandinfo.upReplaceNumFlag = 1
                }
                if (nowstandinfo.standNumber !== this.saveOldNum) {
                  nowstandinfo.upNumFlag = 1
                } else if (nowstandinfo.standSort !== this.saveOldSort) {
                  nowstandinfo.upNumFlag = 1
                } else if (nowstandinfo.standYear !== this.saveOldYear) {
                  nowstandinfo.upNumFlag = 1
                }
              }
              this.$http.postData('lawss/sarStandardsInfo/updateSarStandardsInfo', nowstandinfo, {
                _this: this
              }, res => {
                this.isSubmit = false
                if (res.ok) {
                  this.getDomesticStandardTable(this.tableFlag)
                  this.resetForm()
                }
              }, e => {
                this.isSubmit = false
              })
            } else {
              this.isSubmit = false
            }
          }, e => {})
        } else {
          this.isSubmit = false
          this.$message({
            message: '请检查表单是否填写正确',
            type: 'warning'
          })
        }
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
        this.configTotal = res.data.count
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
    },
    inputChange () {
      this.modalshowflag = true
    },
    // 代替标准号搜索
    selectStands () {
      // if (this.standNumFlag === 1) {
      // this.$refs.selections.selectAll(false)
      // }
      this.sarStandardsInfoEO.replaceStandNum = ''
      this.replaceStandNumModel = true
      this.getReplaceStandNumRow('')
    },
    selectReplaceStandNumRowChange (row) {
      this.replaceStandNumModelNum = row
    },
    selectLawsExplainQuoteRowChange (row) {
      this.lawsExplainQuoteModelNum = row
    },
    // 试验项目
    selectTestItemRowChange (row) {
      this.testItemModelNum = row
    },
    selectTestItemRowSelect (selection, flag, row) {
      let index = ''
      if (row) {
        this.selectedList2.map((item, rowIndex) => {
          if (row.id === item.id) {
            index = rowIndex
          }
        })
      }
      if (flag === 'select') {
        this.selectedList2.push(row)
        const newobj = {}
        this.selectedList2 = this.selectedList2.reduce((preVal, curVal) => {
                  newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal) // eslint-disable-line
          return preVal
        }, [])
      }
      if (flag === 'cancel') {
        this.selectedList2.splice(index, 1)
      }
      if (flag === 'all') {
        selection.map((item) => {
          this.selectedList2.push(item)
        })
        const newobj = {}
        this.selectedList2 = this.selectedList2.reduce((preVal, curVal) => {
                  newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal) // eslint-disable-line
          return preVal
        }, [])
      }
      if (flag === 'allCancel') {
        this.testItemTableList.map((item) => {
          this.selectedList2.map((list, index) => {
            if (item.id === list.id) {
              this.selectedList2.splice(index, 1)
            }
          })
        })
      }
    },
    selectLawsExplainQuoteRowSelect (selection, flag, row) {
      let index = ''
      if (row) {
        this.selectedList1.map((item, rowIndex) => {
          if (row.id === item.id) {
            index = rowIndex
          }
        })
      }
      if (flag === 'select') {
        this.selectedList1.push(row)
        const newobj = {}
        this.selectedList1 = this.selectedList1.reduce((preVal, curVal) => {
                  newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal) // eslint-disable-line
          return preVal
        }, [])
      }
      if (flag === 'cancel') {
        this.selectedList1.splice(index, 1)
      }
      if (flag === 'all') {
        selection.map((item) => {
          this.selectedList1.push(item)
        })
        const newobj = {}
        this.selectedList1 = this.selectedList1.reduce((preVal, curVal) => {
                  newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal) // eslint-disable-line
          return preVal
        }, [])
      }
      if (flag === 'allCancel') {
        this.lawsExplainQuoteRow.map((item) => {
          this.selectedList1.map((list, index) => {
            if (item.id === list.id) {
              this.selectedList1.splice(index, 1)
            }
          })
        })
      }
    },
    // 代替标准号
    getReplaceStandNumRow (page = 1, pageSize = this.$store.getters.userInfo.configContent) {
      this.replaceStandNumForm.page = this.replacePage
      this.replaceStandNumForm.pageSize = this.$store.getters.userInfo.configContent
      if (page === '') {
        this.replaceStandNumForm.page = 1
        this.replaceStandNumForm.standNumber = ''
      }
      // this.replaceStandNumForm.quoteIdList = this.quoteIdList1.toString() === '' ? '' : this.quoteIdList1
      if (this.sarStandardsInfoEO.replaceStandNum !== null && this.sarStandardsInfoEO.replaceStandNum !== '') {
        this.replaceStandNumForm.quoteIdList = this.quoteIdList1.toString() === '' ? '' : this.quoteIdList1
      } else {
        this.quoteIdList1 = []
        this.replaceStandNumForm.quoteIdList = ''
      }
      // if (this.sarStandardsInfoEO.replaceStandNumId !== null && this.sarStandardsInfoEO.replaceStandNumId !== '') {
      //   this.replaceStandNumForm.quoteIdList = this.sarStandardsInfoEO.replaceStandNumId.toString()
      //   console.log(this.replaceStandNumForm.quoteIdList)
      // }
      this.$http.get('lawss/sarStandardsInfo/getSarStandardsInfoPage', this.replaceStandNumForm, {
        _this: this
        // loading: 'lawsExplainQuoteFormLoading'
      }, res => {
        this.replaceStandNumRow = res.data.list
        this.replaceTotal = res.data.count
        if (this.selectedListRep.length !== 0) {
          this.selectedListRep.map((list) => {
            this.replaceStandNumRow.map((item) => {
              if (list.id === item.id) {
                item._checked = true
              }
            })
          })
        }
      }, e => {
      })
    },
    /**
       *@desc:代替标准号
       *@author: zhangRui
       *@time: 2020/08/25 11:52:47
       */
    selectReplaceStandNumRowSelect (selection, flag, row) {
      let index = ''
      if (row) {
        this.selectedListRep.map((item, rowIndex) => {
          if (row.id === item.id) {
            index = rowIndex
          }
        })
      }
      if (flag === 'select') {
        this.selectedListRep.push(row)
        const newobj = {}
        this.selectedListRep = this.selectedListRep.reduce((preVal, curVal) => {
                  newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal) // eslint-disable-line
          return preVal
        }, [])
      }
      if (flag === 'cancel') {
        this.selectedListRep.splice(index, 1)
      }
      if (flag === 'all') {
        selection.map((item) => {
          this.selectedListRep.push(item)
        })
        const newobj = {}
        this.selectedListRep = this.selectedListRep.reduce((preVal, curVal) => {
                  newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal) // eslint-disable-line
          return preVal
        }, [])
      }
      if (flag === 'allCancel') {
        this.replaceStandNumRow.map((item) => {
          this.selectedListRep.map((list, index) => {
            if (item.id === list.id) {
              this.selectedListRep.splice(index, 1)
            }
          })
        })
      }
    },
    // 代替标准-取消
    replaceStandNumModelCancel () {
      alert(0)
      this.replaceStandNumModel = false
      this.$refs.selections.selectAll(false)
      this.sarStandardsInfoEO.replaceStandNum = this.saveStandNum
    },
    // 代替标准确定
    replaceStandNumModelBt () {
      if (typeof this.sarStandardsInfoEO.replaceStandNum === 'string') {
        this.sarStandardsInfoEO.replaceStandNum = this.sarStandardsInfoEO.replaceStandNum.split('')
      }
      if (this.sarStandardsInfoEO.replaceStandNum === null) {
        this.sarStandardsInfoEO.replaceStandNum = []
      }
      if (this.selectedListRep.length === 0) {
        return this.$message({
          message: '请先选择数据',
          type: 'warning'
        })
      }
      if (this.selectedListRep.length + this.sarStandardsInfoEO.replaceStandNum.length > 20) {
        return this.$message({
          message: '法规解读标准引用最多选择20项',
          type: 'warning'
        })
      }
      const idArr = []
      this.selectedListRep.map((item) => {
        let texts = ''
        if (item.standYear != null && item.standYear !== '') {
          texts = item.standSortShow + ' ' + item.standNumber + '-' + item.standYear
        } else {
          texts = item.standSortShow + ' ' + item.standNumber
        }
        // if (this.sarStandardsInfoEO.replaceStandNumList === null) {
        //   this.sarStandardsInfoEO.replaceStandNumList = []
        // }
        // console.log(this.sarStandardsInfoEO.replaceStandNum)
        // this.sarStandardsInfoEO.replaceStandNumList.push({
        //   label: texts,
        //   value: item.id
        // })
        this.sarStandardsInfoEO.replaceStandNumId = item.id
        idArr.push(this.sarStandardsInfoEO.replaceStandNumId)
        this.sarStandardsInfoEO.replaceStandNum.push(texts)
        this.sarStandardsInfoEO.replaceStandNum = [...new Set(this.sarStandardsInfoEO.replaceStandNum)]
        this.replaceStandNumModel = false
      })
      this.quoteIdList1 = idArr.toString()
      console.log('this.quoteIdList1', this.quoteIdList1)
      // this.$refs.selections.selectAll(false)
    },
    lawsExplainQuoteModelBt () {
      if (typeof this.sarStandardsInfoEO.lawsExplainQuote === 'string') {
        this.sarStandardsInfoEO.lawsExplainQuote = this.sarStandardsInfoEO.lawsExplainQuote.split('')
      }
      if (this.sarStandardsInfoEO.lawsExplainQuote === null) {
        this.sarStandardsInfoEO.lawsExplainQuote = []
      }
      if (this.selectedList1.length === 0) {
        // return this.$Message.warning('请先选择数据')
        return this.$message({
          message: '请先选择数据',
          type: 'warning'
        })
      }
      if (this.selectedList1.length + this.sarStandardsInfoEO.lawsExplainQuote.length > 20) {
        // return this.$Message.warning('法规解读标准引用最多选择20项')
        return this.$message({
          message: '法规解读标准引用最多选择20项',
          type: 'warning'
        })
      }
      this.selectedList1.map((item) => {
        let texts = ''
        if (item.standYear != null && item.standYear !== '') {
          texts = item.standSortShow + ' ' + item.standNumber + '-' + item.standYear
        } else {
          texts = item.standSortShow + ' ' + item.standNumber
        }
        if (this.sarStandardsInfoEO.lawsExplainQuoteList === null) {
          this.sarStandardsInfoEO.lawsExplainQuoteList = []
        }
        this.sarStandardsInfoEO.lawsExplainQuoteList.push({
          label: texts,
          value: item.id
        })
        // console.log('this.sarStandardsInfoEO.lawsExplainQuoteList', this.sarStandardsInfoEO.lawsExplainQuoteList)
        this.sarStandardsInfoEO.lawsExplainQuote.push(item.id)
        this.sarStandardsInfoEO.lawsExplainQuote = [...new Set(this.sarStandardsInfoEO.lawsExplainQuote)]
        this.lawsExplainQuoteModel = false
      })
    },
    canle () {
      console.log('this.lawsExplainQuoteModel', this.lawsExplainQuoteModel)
      this.lawsExplainQuoteModel = false
    },
    // 法规解读标准引用
    lawsExplainQuoteClick () {
      this.getLawsExplainQuoteRow('')
      this.lawsExplainQuoteModel = true
      if (this.lawsExplainQuoteModel) {
        return false
      }
      this.lawsExplainQuoteModel = true
      $('#lawsExplainQuote').click()
      this.selectedList1 = []
      // this.$refs.selection.selectAll(false)
      this.testItemsForm.standNumber = ''
    },
    pageChangeLaws (page) {
      this.page = page
      this.getLawsExplainQuoteRow()
    },
    pageSizeChangeLaws (pageSize) {
      this.rows = pageSize
      this.getLawsExplainQuoteRow()
    },
    // 法规分页
    pageChangeReplace (page) {
      this.replacePage = page
      this.getReplaceStandNumRow()
    },
    pageSizeChangeReplace (pageSize) {
      this.replaceRows = pageSize
      this.getReplaceStandNumRow()
    },
    // 试验项目分页
    pageChangeItems (page) {
      this.pageItems = page
      this.getTestItemRow()
    },
    pageSizeChangeItems (pageSize) {
      this.itemsRows = pageSize
      this.getTestItemRow()
    },
    testItemsModellBt () {
      if (this.selectedList2.length === 0) {
        return this.$message({
          message: '请先选择数据',
          type: 'warning'
        })
      }
      if (typeof this.sarStandardsInfoEO.testItems === 'string') {
        this.sarStandardsInfoEO.testItems = this.sarStandardsInfoEO.testItems.split('')
      }
      if (this.sarStandardsInfoEO.testItems === null) {
        this.sarStandardsInfoEO.testItems = []
      }
      if (this.selectedList2.length + this.sarStandardsInfoEO.testItems.length > 20) {
        return this.$message({
          message: '试验项目最多选择20项',
          type: 'warning'
        })
      }
      this.selectedList2.map((item) => {
        if (this.sarStandardsInfoEO.testItemsList === null) {
          this.sarStandardsInfoEO.testItemsList = []
        }
        this.sarStandardsInfoEO.testItemsList.push({
          label: item.testItemName,
          value: item.id
        })

        this.sarStandardsInfoEO.testItems.push(item.id)
        this.sarStandardsInfoEO.testItems = [...new Set(this.sarStandardsInfoEO.testItems)]
        this.testItemsModel = false
      })
    },
    getLawsExplainQuoteRow (page = 1, pageSize = this.$store.getters.userInfo.configContent) {
      this.lawsExplainQuoteForm.page = this.page
      this.lawsExplainQuoteForm.pageSize = this.$store.getters.userInfo.configContent
      if (page === '') {
        this.lawsExplainQuoteForm.page = 1
        this.lawsExplainQuoteForm.standNumber = ''
      }
      if (this.sarStandardsInfoEO.lawsExplainQuote !== null && this.sarStandardsInfoEO.lawsExplainQuote !== '') {
        this.lawsExplainQuoteForm.quoteIdList = this.sarStandardsInfoEO.lawsExplainQuote.toString()
      }
      this.$http.get('lawss/sarStandardsInfo/getSarStandardsInfoPage', this.lawsExplainQuoteForm, {
        _this: this,
        loading: 'lawsExplainQuoteFormLoading'
      }, res => {
        this.lawsExplainQuoteRow = res.data.list
        this.total = res.data.count
        if (this.selectedList1.length !== 0) {
          this.selectedList1.map((list) => {
            this.lawsExplainQuoteRow.map((item) => {
              if (list.id === item.id) {
                item._checked = true
              }
            })
          })
        }
      }, e => {
      })
    },
    getTestItemRow (page = 1, pageSize = this.$store.getters.userInfo.configContent) {
      this.testItemsForm.page = this.pageItems
      this.testItemsForm.pageSize = this.$store.getters.userInfo.configContent
      if (page === '') {
        this.testItemsForm.page = 1
        this.testItemsForm.testItemName = ''
      }
      if (this.sarStandardsInfoEO.testItems !== null && this.sarStandardsInfoEO.testItems !== '') {
        this.testItemsForm.testIdList = this.sarStandardsInfoEO.testItems.toString()
      }
      this.$http.get('lawss/sarTestItem/page', this.testItemsForm, {
        _this: this,
        loading: 'testItemSearching'
      }, res => {
        this.testItemTableList = res.data.list
        this.totalItems = res.data.count
        if (this.selectedList2.length !== 0) {
          this.selectedList2.map((list) => {
            this.testItemTableList.map((item) => {
              if (list.id === item.id) {
                item._checked = true
              }
            })
          })
        }
      }, e => {
      })
    },
    // 导入标准文件格式错误执行
    handleFormatError (file) {
      if (this.importFileFormat[0] === 'zip') {
        this.spinShow = false
        this.$message({
          showClose: true,
          message: '文件' + file.name + '格式不正确，请上传ZIP压缩文件',
          type: 'error'
        })
      } else {
        this.$message({
          showClose: true,
          message: '文件' + file.name + '格式不正确，请上传EXCEL文件',
          type: 'error'
        })
      }
    }, // 导入标准数据成功后执行
    importFileSuccess (response, file) {
      if (response.ok) {
        this.showUploadlist = true
        this.spinShow = false
        this.importModalshowflag = false
        this.$message({
          showClose: true,
          message: response.message,
          type: 'success'
        })
        // 使用字条目是否展示模态框判断导入的文件是标准，还是条目modalStandItemflag
        if (this.modalStandItemflag) {
          this.selectSarStandItems(this.standItemSearch.standId)
        } else {
          this.getDomesticStandardTable(this.tableFlag)
        }
      } else {
        this.showUploadlist = false
        this.spinShow = false
        this.importFailed = true
        this.importForm.content = response.message
      }
    },
    // 查看标准条目
    selectSarStandItems (standid) {
      this.modalStandItemflag = true
      this.standItemSearch.standId = standid
      this.$http.get('lawss/sarStandItems/getSarStandItemsList', this.standItemSearch, {
        _this: this, loading: 'loading'
      }, res => {
        this.standItemList = res.data
        // this.standitemTotal = res.data.count // 分页需要
      }, e => {
      })
    },
    // 点击配置标准弹出相应模态框
    configurationStandard () {
      const winWidth = window.screen.width
      if (winWidth > 1920) {
        this.drawerWidth = 1400
      } else {
        this.drawerWidth = winWidth - 200
      }
      let menuId = this.selectSarMenu.id
      if (menuId == null || menuId === '') {
        this.$message({
          showClose: true,
          message: '请选择要配置的目录',
          type: 'error'
        })
      } else {
        if (this.selectSarMenu.parentId == null || this.selectSarMenu.parentId === '') {
          this.$message({
            showClose: true,
            message: '请选择二级及以下目录',
            type: 'error'
          })
        } else {
          this.configStandFlag = true
          this.sarConfigStandSearch.menuId = 'nomenu'
          this.sarConfigStandSearch.page = 1
          this.sarConfigStandSearch.country = ''
          this.sarConfigStandSearch.standNumber = ''
          this.sarConfigStandSearch.standName = ''
          this.sarConfigStandSearch.standState = ''
          this.sarConfigStandSearch.standNature = ''
          this.sarConfigStandSearch.issueTime = ''
          this.sarConfigStandSearch.applyArctic = ''
          this.sarConfigStandSearch.replaceStandNum = ''
          this.sarConfigStandSearch.replacedStandNum = ''
          this.selectConfiguraStand()
        }
      }
    },
    // 取消配置标准
    cancelConfigStand () {
      this.configStandFlag = false
      this.selectConfigStand = []
    },
    // 表对应标准移除分类到
    deleteStandFromKind (flag, item) {
      let search = {}
      // 取最外层目录id
      search.menuId = this.parentNode.id
      search.idlist = []
      if (flag === 1) {
        this.$confirm('确定移除该条标准?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          search.idlist.push(item)
          this.$http.putData('lawss/sarStandMenu/removeStandInfo', search, {
            _this: this
          }, res => {
            this.getDomesticStandardTable(this.tableFlag)
          }, e => {
          })
        }).catch(() => {
          // 取消删除，清空选择
          this.$refs.selection.clearSelection()
        })
      } else {
        if (this.selectedList.length === 0) {
          this.$message.error('请先选择要移除的数据！')
        } else {
          this.$confirm('确认移除选中数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            for (let i = 0; i < this.selectedList.length; i++) {
              search.idlist.push(this.selectedList[i])
            }
            this.$http.postData('lawss/sarStandardsInfo/saveStandardsMenu', search, {
              _this: this
            }, res => {
              // this.$Message.success('取消配置成功!')
              this.$message({
                showClose: true,
                message: '取消配置成功！',
                type: 'success'
              })
              this.getDomesticStandardTable(this.tableFlag)
            }, e => {
            })
          }).catch(() => {
            // 取消删除，清空选择
            this.$refs.selection.clearSelection()
          })
        }
      }
    },
    // 分页点击后方法
    configuraPageChange (page) {
      this.configPage = page
      this.selectConfiguraStand()
    },
    // 分页每页显示数改变后方法
    configuraPageSizeChange (pageSize) {
      this.configRows = this.$store.getters.userInfo.configContent
      this.selectConfiguraStand()
      this.getDomesticStandardTable(this.tableFlag)
      // 此处需要调用接口，修改个人配置
    },
    searchConfiguraStand () {
      this.sarConfigStandSearch.page = 1
      this.selectConfiguraStand()
    },
    selectConfigStandChange (alldata) {
      this.selectConfigStand = []
      for (let i = 0; i < alldata.length; i++) {
        this.selectConfigStand.push(alldata[i].id)
      }
    },
    // 提交配置搜索项
    saveConfigStand () {
      let search = {}
      search.menuId = this.selectSarMenu.id
      if (this.selectConfigStand.length === 0) {
        this.$message({
          showClose: true,
          message: '请至少选择一条标准',
          type: 'warning'
        })
      } else {
        search.idlist = this.selectConfigStand
        this.$http.postData('lawss/sarStandardsInfo/saveStandardsMenu', search, {
          _this: this
        }, res => {
          this.configStandFlag = false
          this.$message({
            showClose: true,
            message: '配置标准成功!',
            type: 'success'
          })
          this.getDomesticStandardTable(this.tableFlag)
        }, e => {
        })
      }
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
      this.regionOptions = res.data.REGION // 区域
      this.standSortOptions = res.data.STANDCLASSIFY
      this.applyArcticOptions = res.data.PRODUCTTYPE // 根据需求文档，产品类别对应标准属性中的“适用车型”
      this.standStateOptions = res.data.STANDSTATE
      this.standNatureOptions = res.data.SARPROPERTY // 标准性质
      this.adoptExtentOptions = res.data.DEGREESTANDARD
      this.emergyKindOptions = res.data.ENERGYTYPES
      this.applyAuthOptions = res.data.PROVETYPE // 适用认证下拉框
      this.categoryOptions = res.data.CATEGORY // 能源种类
      this.assemClassOptions = res.data.ASSEMCLASSIFY // 总成分类
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
    this.beforeHandleCommand()
    this.handleCommand()
  }
}
</script>
<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>

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
    .tree-closed {
      width: 20px !important;
    }
    .noBottom{
      margin-bottom: 0;
    }
    .el-popover{
      height: 200px;
    }
    .tabpagination{
      position: relative;
    }
    .demo-drawer-footer{
      direction: rtl;
      margin: 10px;
    }
  }
</style>
