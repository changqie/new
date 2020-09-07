<!--企业标准类别-->
<template>
  <div class="enterprise-standard-category v-class">
    <div class="search-area">
      <el-form :inline="true" :model="standardForm"  ref="ruleForm" class="label-input-form">
        <div class="search-area-item">
          <el-form-item label="选项" class="serch-form-item">
            <el-input
              v-model.trim="standardForm.standName"
              placeholder="请输入选项"
              :maxlength="100"
              clearable
              @keyup.enter.native="selectCategoryBtn"></el-input>
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              icon="el-icon-search"
              type="primary"
              class="searchAngNewBtn"
              @click="selectCategoryBtn"></el-button>
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              type="primary"
              class="searchAngNewBtn"
              @click="resetSelect">清空查询</el-button>
          </el-form-item>
        </div>
        <div class="search-area-item">
          <el-form-item class="serch-form-item btn-box">
          <el-button
            type="primary"
            class="searchAngNewBtn"
            @click="classAdd(1, null)"
            v-btn-permission="'CXRPGWHNSF'"
            >新增</el-button>
        </el-form-item>
        <el-form-item class="serch-form-item btn-box">
          <el-button
            type="danger"
            class="searchAngNewBtn"
            @click="classBatchDel"
            v-btn-permission="'R24ALH4Q89'">删除</el-button>
        </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- :reserve-selection="true" -->
    <div class="content">
      <el-table
        ref="selection"
        :data="categoryData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        row-key="id"
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
          width="400"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="describes"
          label="描述"
          width="400"
          align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              class="opera-btn"
              size="mini"
              type="primary"
              @click="classAdd(3, scope.row)">查看</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="warning"
              @click="classAdd(2, scope.row)">编辑</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="danger"
              @click="classDel(scope.row)">删除</el-button>
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
      <loading :loading="loading">数据获取中</loading>
    <!--新增抽屉-->
    <el-drawer
      :title="title"
      :visible.sync="dialogState"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="50%"
      :class="classObject"
      :before-close="handleClose"
      >
      <div class="demo-drawer__content" v-if="this.oprState === 1 || this.oprState === 2">
        <el-form :model="categoryModelAdd" ref="categoryModelAdd" :rules="classRules"  class="label-input-form">
          <el-row>
            <el-col span="12">
              <el-form-item label="选项"
                :label-width="formLabelWidth"
                prop="dicTypeName"
                :disabled = 'this.oprState === 2'
                class="add-form-item">
                <el-input
                  v-model.trim="categoryModelAdd.dicTypeName"
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
                  oninput="if(value.length>5)value=value.slice(0,5)"
                  v-model.number="categoryModelAdd.showIndex"
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
                  v-model.trim="categoryModelAdd.describes"
                  autocomplete="off" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button size="mini" @click="closeModal('categoryModelAdd')">取 消</el-button>
          <el-button size="mini" type="primary" @click="saveCategory('categoryModelAdd')">提交</el-button>
        </div>
      </div>
      <div class="demo-drawer__content" v-else>
        <div class="check-item-row">
          <div class="check-item-col1">
            <div class="check-item-label"> 选项：</div>
            <div class="check-item-value">{{categoryModelAdd.dicTypeName}}</div>
          </div>
          <div class="check-item-col1">
            <div class="check-item-label">排序号：</div>
            <div class="check-item-value">{{categoryModelAdd.showIndex}}</div>
          </div>
        </div>
        <div class="check-item-row">
          <div class="check-item-col2">
              <div class="check-item-label">描述：</div>
              <div class="check-item-value">{{categoryModelAdd.describes}}</div>
          </div>
          <div class="check-item-col2">
            <div class="check-item-label"></div>
              <div class="check-item-value"></div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'EnterpriseStandardCategory',
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
      loading: false,
      // 列表数据
      categoryData: [],
      // 抽屉打开
      dialogState: false,
      // form-item label宽度
      formLabelWidth: '80px',
      // 新增弹窗数据
      categoryModelAdd: {
        // 数据信息
        dicTypeName: '',
        showIndex: '',
        // 数据编码
        dicTypeCode: '',
        // 描述
        describes: '',
        // 唯一辨识
        dicId: 'NGETEMDJDI'
      },
      // 弹窗标题
      title: '',
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
      standCode1: '',
      // 判断是新增or 编辑 or 查看
      oprState: 0,
      // 多选时接收选中行数据
      selectNum: []
    }
  },
  methods: {
    // 条件查询
    selectCategoryBtn () {
      this.standName1 = this.standardForm.standName
      this.describes1 = this.standardForm.describes
      this.standCode1 = this.standardForm.standCode
      this.page = 1
      this.selectCategory()
    },
    // 清空查询
    resetSelect (formName) {
      this.standName1 = ''
      this.standCode1 = ''
      this.describes1 = ''
      this.standardForm.standName = ''
      this.standardForm.standCode = ''
      this.standardForm.describes = ''
      this.page = 1
      this.selectCategory()
    },
    // 分页加载列表
    selectCategory () {
      let DicTypeEOPage = {
        page: this.page,
        pageSize: this.$store.getters.userInfo.configContent,
        dicTypeName: this.standName1,
        dicTypeCode: this.standCode1,
        describes: this.describes1,
        dicId: 'NGETEMDJDI'
      }
      this.$http.get('sys/dictype/page', DicTypeEOPage, {
        _this: this,
        loading: 'loading'
      }, res => {
        this.categoryData = res.data.list
        this.total = res.data.count
      }, e => {
      })
      // this.$refs.selection.selectAll(false)
    },
    // 新增弹窗打开
    classAdd (oprState, row) {
      this.oprState = oprState
      if (this.oprState === 1) {
        this.title = '新增信息'
        this.dialogState = true
      } else if (this.oprState === 2) {
        this.title = '编辑信息'
        this.categoryModelAdd = row
        this.dialogState = true
      } else {
        this.title = '查看信息'
        this.categoryModelAdd = row
        this.dialogState = true
      }
    },
    // 新增弹窗提交
    saveCategory (formName) {
      let data = this.categoryModelAdd
      console.log('data', data)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.oprState === 1) {
            this.categoryModelAdd.dicTypeCode = this.categoryModelAdd.dicTypeName
            this.$http.postData('sys/dictype/create', data, {
              _this: this
            }, res => {
              if (res.ok) {
                this.closeModal()
              } else {
                this.dialogState = true
              }
            }, e => {})
          } else if (this.oprState === 2) {
            this.$http.putData('sys/dictype', data, {
              _this: this
            }, res => {
              if (res.ok) {
                this.closeModal()
              } else {
                this.dialogState = true
              }
            }, e => {
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 查看弹窗关闭
    handleClose () {
      this.page = 1
      this.selectCategory()
      this.categoryModelAdd.dicTypeName = ''
      this.categoryModelAdd.showIndex = ''
      this.categoryModelAdd.describes = ''
      if (this.$refs['categoryModelAdd']) {
        this.$refs['categoryModelAdd'].resetFields()
      }
      this.dialogState = false
    },
    // 新增弹窗关闭
    closeModal (formName) {
      this.page = 1
      this.selectCategory()
      this.categoryModelAdd.dicTypeName = ''
      this.categoryModelAdd.showIndex = ''
      this.categoryModelAdd.describes = ''
      this.$refs['categoryModelAdd'].resetFields()
      this.dialogState = false
    },
    // 批量删除
    classBatchDel () {
      if (this.selectNum === '' || this.selectNum.length === 0) {
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
            let delIds = []
            let delTypeCodes = []
            for (let i = 0; i < this.selectNum.length; i++) {
              delIds.push(this.selectNum[i].id)
              delTypeCodes.push(this.selectNum[i].dicTypeCode)
            }
            delIds = delIds.join(',')
            delTypeCodes = delTypeCodes.join(',')
            let data = {}
            data.ids = delIds
            data.dicTypeCodes = delTypeCodes
            console.log('data', data)
            this.$http.delete('sys/dictype/deleteArr', data, {
              _this: this
            }, res => {
              if (res.ok) {
                this.resetSelect()
              }
            })
          }).catch(() => {
          // 取消删除，清空选择
            this.$refs.selection.clearSelection()
          })
        )
      }
    },
    // 删除
    classDel (row) {
      let data = {}
      data.dicTypeEOId = row.id
      data.dicTypeCode = row.dicTypeCode
      if (data.id !== '' && data.dicTypeCode !== '') {
        this.$confirm('确认删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('sys/dictype/delete', data, {
            _this: this
          }, res => {
            if (res.ok) {
              this.resetSelect()
            } else {
            }
          }).catch(() => {
          })
        })
      }
    },
    // 多选
    handleSelectionChange (val) {
      this.selectNum = val
      console.log('this.selectNum', this.selectNum)
    },
    pageChange (page) {
      this.page = page
      this.selectCategory()
    },
    pageSizeChange (pageSize) {
      this.rows = pageSize
      this.selectCategory()
    }

  },
  mounted () {
    this.selectCategory()
  },
  computed: {
    classObject () {
      return {
        'check-draw': this.oprState === 3
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import 'animate.css';
  .enterprise-standard-category{
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
