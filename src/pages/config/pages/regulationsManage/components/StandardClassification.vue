<!-- 标准/文件性质 -->
<template>
  <div class="standard-classification v-class">
    <div class="search-area">
      <el-form :inline="true" :model="standardForm"  ref="ruleForm" class="label-input-form">
        <div class="search-area-item">
          <el-form-item label="选项" class="serch-form-item">
            <el-input
              v-model.trim="standardForm.standName"
              placeholder="请输入选项"
              :maxlength="100"
              clearable
              @keyup.enter.native="selectClassBtn"></el-input>
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              icon="el-icon-search"
              type="primary"
              class="searchAngNewBtn"
              @click="selectClassBtn"></el-button>
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              type="primary"
              class="searchAngNewBtn"
              @click="resetSelect('ruleForm')">清空查询</el-button>
          </el-form-item>
        </div>
        <div class="search-area-item">
          <el-form-item class="serch-form-item btn-box">
          <el-button
            type="primary"
            class="searchAngNewBtn"
            @click="classAdd"
            v-btn-permission="'SDXRQ8LV6K'"
            >新增</el-button>
        </el-form-item>
        <el-form-item class="serch-form-item btn-box">
          <el-button
            type="danger"
            class="searchAngNewBtn"
            @click="classBatchDel"
            v-btn-permission="'ATBANPLHCM'">删除</el-button>
        </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="content">
      <el-table
        ref="selection"
        :data="classData"
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
          prop="dicTypeName"
          label="选项"
          width="130"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="describes"
          label="描述"
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
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <pagination
      class="tabpagination"
      :page="page"
      :total="total"
      @pageChange="pageChange"
      @pageSizeChange="pageSizeChange"></pagination>
    <!--新增抽屉-->  
    <el-drawer
      title="新增信息"
      :visible.sync="dialogState"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="50%"
      >
      <div class="demo-drawer__content">
        <el-form :model="classModelAdd" ref="classModelAdd" :rules="classRules"  class="label-input-form">
          <el-row>
            <el-col span="12">
              <el-form-item label="选项"
                :label-width="formLabelWidth"
                prop="dicTypeName"
                class="add-form-item">
                <el-input
                  v-model.trim="classModelAdd.dicTypeName"
                  autocomplete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="排序号"
                prop="showIndex"
                :label-width="formLabelWidth"
                class="add-form-item">
                <el-input
                  type="number"
                  v-model.number="classModelAdd.showIndex"
                  @mousewheel.native.prevent
                  autocomplete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="描述"
                prop="describes"
                :label-width="formLabelWidth"
                class="add-form-item">
                <el-input
                  v-model.trim="classModelAdd.describes"
                  autocomplete="off" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="closeModal('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="saveClass('ruleForm')">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'standardClassification',
  data () {
    return {
      // 查询条件
      standardForm: {
        // 选项
        standName: '',
        // 数据编码
        standCode: '',
        // 描述
        describes: ''
      },
      total: 0,
      page: 1,
      rows: 10,
      // 列表数据
      classData: [],
      // 抽屉打开
      dialogState: false,
      // form-item label宽度
      formLabelWidth: '80px',
        // 新增弹窗数据
      classModelAdd: {
        // 数据信息
        dicTypeName: '',
        showIndex: '',
        // 数据编码
        dicTypeCode: '',
        // 描述
        describes: '',
        // 唯一辨识
        dicId: 'FDFDFDVFTGR'
      },
       //  表单验证
      classRules: {
        dicTypeName: [
          {required: true, message: '选项不能为空', trigger: 'blur'},
          {type: 'string', max: 100, message: '最多输入100位', trigger: 'blur'}
        ],
        showIndex: [
          {required: true, message: '排序号不能为空且为正整数', trigger: 'blur'},
          {type: 'string', validator: this.verify.validStandNumInCompile2, trigger: 'blur'}
        ],
        describes: [
          {type: 'string', max: 500, message: '最多输入500位', trigger: 'blur'}
        ]
      },
      // 中间变量
      standName1: '',
      describes1: '',
      standCode1: ''
    }
  },
  methods: {
    // 条件查询
    selectClassBtn () {
      this.standName1 = this.standardForm.standName
      this.describes1 = this.standardForm.describes
      this.standCode1 = this.standardForm.standCode
      this.page = 1
      this.selectClass()

    },
    // 清空查询
    resetSelect (formName) {
      this.standName1 = ''
      this.standCode1 = ''
      this.describes1 = ''
      this.standardForm.standName = ''
      this.standardForm.standCode = ''
      this.standardForm.describes = ''
      this.$refs[formName].resetFields();
      this.selectClass()
    },
    // 分页加载列表
    selectClass () {
      let DicTypeEOPage = {
        page: this.page,
        pageSize: this.$store.getters.userInfo.configContent,
        dicTypeName: this.standName1,
        dicTypeCode: this.standCode1,
        describes: this.describes1,
        dicId: 'FDFDFDVFTGR'
      }
      this.$http.get('sys/dictype/page', DicTypeEOPage, {
        _this: this,
        loading: 'loading'
      }, res => {
        this.classData = res.data.list
        this.total = res.data.count
      }, e => {
      })
      // this.$refs.selection.selectAll(false)
    },
    // 新增弹窗打开
    classAdd () {
      this.dialogState = true
    },
    // 新增弹窗提交
    saveClass (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新增弹窗关闭
    closeModal (formName) {

    },
    // 删除
    classBatchDel () {

    },
    // 多选
    handleSelectionChange () {

    },
    pageChange (page) {
      this.page = page
      this.selectClass()
    },
    pageSizeChange (pageSize) {
      this.rows = pageSize
      this.selectClass()
    }

  },
  mounted () {
    this.selectClass()
  }
} 
</script>

<style lang="less" scoped>
  @import 'animate.css';
  .standard-classification{
    position: relative;
    height: 100%;
    padding: 15px;
    background: #fff;
    .label-input-form {
      display: flex;
      justify-content: space-between;
    }
    .content{
      // height: 540px;
      margin-top: 10px;
      width: 100%;
      // height: calc(~'100% - 115px')!important;
      overflow-y: auto;
    }
    .tabpagination{
      position: relative;
    }
    .demo-drawer__content{
      // border: 1px solid #ccc;
      padding: 0 15px;
    }
  }
</style>

