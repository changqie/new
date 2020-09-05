<!-- 配置管理 - 用户管理 -->
<template>
  <div id="user-manage" class="v-class">
    <table-tools-bar>
      <div slot="left">
        <el-form ref="searchForm" :model="search" inline class="label-input-form">
          <el-form-item label="类型" prop="userType" class="serch-form-item">
            <search-select v-model="search.userType" :options="search.userTypeOptions" placeholder="按类型" />
          </el-form-item>
          <el-form-item label="人员姓名" prop="uname" class="serch-form-item">
            <el-input v-model="search.uname" placeholder="按人员姓名" clearable/>
          </el-form-item>
          <el-form-item label="系统账号" prop="account" class="serch-form-item">
            <el-input v-model="search.account" placeholder="按账户" clearable/>
          </el-form-item>
          <el-form-item label="角色" prop="roleId" class="serch-form-item">
            <search-select v-model="search.roleId" :options="search.roleOptions" placeholder="按角色"></search-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="orgName" class="serch-form-item">
            <el-input v-model="search.orgName" v-show="false" />
            <el-input v-model="search.orgId" v-show="false"/>
            <el-popover
              placement="bottom"
              popper-class="user-dept-popper"
              trigger="click"
              :value="false"
            >
              <el-input
                slot="reference"
                v-model="search.orgName"
                placeholder="请选择部门"
                readonly
                clearable
                id="deptBtn1"
                @on-change="inputChange"
              />
              <div class="api">
                <laws-tree
                  :zNodes="zNodesTwo"
                  ref="reloadTree"
                  :editable="false"
                  treeDivId="domesticTree1" deptSelect
                  @treeDblClick="treeDblClick1"
                  class="ztree" style="width: 200px;height: 400px">
                </laws-tree>
              </div>
            </el-popover>
          </el-form-item>
          <el-form-item label="状态" prop="disableFlag" class="serch-form-item">
            <search-select v-model="search.disableFlag" placeholder="按状态" :options="search.disableFlagOptions"></search-select>
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              icon="el-icon-search"
              type="primary"
              class="searchAngNewBtn"
              @click="searchUserPageBtn"></el-button>
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              type="primary"
              class="searchAngNewBtn"
              @click="resetSearch">清空查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </table-tools-bar>
    <div class="content">
      <loading :loading="loading">数据获取中</loading>
      <div class="action-bar syncUser">
        <div>
          <el-button type="primary" size="mini" title="新增" @click="openAddUserModal" v-btn-permission="'KFKJFQ97LC'">新增</el-button>
          <el-button type="danger" size="mini" title="批量删除" @click="batchUserDel" v-btn-permission="'Q2G9W2GCVU'">批量删除</el-button>
          <!--          <Button type="primary" title="同步信息" @click="syncUserInfo" >同步信息</Button>-->
        </div>
        <div>
          <span>同步时间:{{syncInfo}}</span>
        </div>
      </div>
      <el-table
        :data="userList"
        tooltip-effect="dark"
        style="width: 100%"
        :height="tableHeight"
        border
        :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
        @selection-change="handleRowChange"
        ref="selection"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userType"
          label="类型"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.userType === 'GQYJY'">研究院</div>
            <div v-if="scope.row.userType === 'GQJT'">集团</div>
            <div v-if="scope.row.userType === 'OTHER'">其他</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="uname"
          label="人员姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="account"
          label="系统账号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="roleNameList"
          label="角色"
          align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.roleNameList.join(',') }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="所属部门"
          align="center">
        </el-table-column>
        <el-table-column
          prop="disableFlag"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.disableFlag === 0">正常</div>
            <div v-else>禁用</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              class="opera-btn"
              size="mini"
              type="primary"
              @click="showUser(scope.$index, scope.row)">查看</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="warning"
              @click="userEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="danger"
              @click="userDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="pageNo" :total="total" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></pagination>
    </div>
    <div>
      <!-- 新增抽屉-->
      <el-drawer
        :title="userTitle"
        :wrapperClosable="false"
        :visible.sync="showUserModal"
        :destroy-on-close="true"
        size="1000px"
        custom-class="demo-drawer"
        @close="closeDrawer"
      >
        <loading :loading="drawerLoading">正在保存</loading>
        <div class="demo-drawer__content">
          <el-form
            ref="userVO"
            :model="userVO"
            :rules="userVOFormRules"
            label-position="right"
            class="label-input-form"
            auto-complete="new-password"
            inline
          >
            <input v-model="userVO.usid" v-show="false">
            <el-row span="12">
              <el-col :span="12">
                <el-form-item
                  label="用户类型"
                  prop="userType"
                  class="add-form-item"
                >
                  <search-select
                    v-model="userVO.userType"
                    :disabled="usersType === 3"
                    :options="search.userTypeOptions" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="人员姓名"
                  prop="uname"
                  class="add-form-item"
                >
                  <el-input
                    v-model="userVO.uname"
                    :disabled="usersType === 3"
                    placeholder="请输入人员姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="系统账号"
                  prop="account"
                  class="add-form-item"
                >
                  <el-input
                    :disabled="createType"
                    v-model="userVO.account"
                    placeholder="请输入系统账号"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="人员编号"
                  prop="workNum"
                  class="add-form-item"
                >
                  <el-input
                    :disabled="createType"
                    v-model.trim="userVO.workNum"
                    placeholder="请输入人员编号"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="showPWD"
                  label="用户密码"
                  prop="password"
                  class="add-form-item"
                >
                  <el-input
                    type="text"
                    onfocus="this.type='password'"
                    v-model="userVO.password"
                    :disabled="usersType === 3"
                    placeholder="请输入用户密码"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="showPWD"
                  label="再次输入密码"
                  prop="passwordCheck"
                  class="add-form-item"
                >
                  <el-input
                    type="text"
                    onfocus="this.type='password'"
                    v-model="userVO.passwordCheck"
                    :disabled="usersType === 3"
                    placeholder="请再次输入密码"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="角色"
                  prop="roleId"
                  class="add-form-item"
                >
                  <el-select
                    v-model="userVO.roleIdList"
                    multiple
                    placeholder="请选择角色"
                    :filterable="true"
                    class="top1px"
                  >
                    <el-option
                      v-for="item in search.roleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <!--<search-multiple-select-->
                    <!--v-model="userVO.roleIdList"-->
                    <!--:multiple= "true"-->
                    <!--:options="search.roleOptions"-->
                    <!--placeholder="请选择角色"-->
                  <!--/>-->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="手机号码"
                  prop="mobilePhone"
                  class="add-form-item"
                >
                  <el-input
                    v-model="userVO.mobilePhone"
                    :disabled="usersType === 3"
                    placeholder="请输入手机号"
                    class="top1px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="办公电话"
                  prop="officePhone"
                  class="add-form-item"
                >
                  <el-input
                    v-model="userVO.officePhone"
                    :disabled="usersType === 3"
                    placeholder="请输入办公室电话"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="电子邮件"
                  prop="email"
                  class="add-form-item"
                >
                  <el-input
                    v-model="userVO.email"
                    :disabled="usersType === 3"
                    placeholder="请输入电子邮箱"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="用户状态"
                  prop="disableFlag"
                  class="add-form-item"
                >
                  <!--<search-select v-model="userVO.disableFlag" placeholder="请选择状态" :disabled="usersType === 3" :options="search.disableFlagOptions" />-->
                  <el-select
                    v-model="userVO.disableFlag"
                    placeholder="请选择状态"
                    clearable
                  >
                    <el-option
                      v-for="item in search.disableFlagOptions"
                      :value="item.value"
                      :key="item.value"
                      :label="item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- 此处获取组织机构架构图 -->
                <el-form-item
                  label="所属部门"
                  prop="orgName"
                  class="add-form-item"
                >
                  <el-input v-model="userVO.orgName" v-show="false" />
                  <el-input v-model="userVO.orgId" v-show="false" />
                  <el-popover
                    placement="bottom"
                    popper-class="user-dept-popper"
                    trigger="click"
                    :value="false"
                  >
                    <el-input
                      slot="reference"
                      v-model="userVO.orgName"
                      placeholder="请选择部门"
                      readonly
                      clearable
                      id="deptBtn"
                    />
                    <div class="api">
                      <laws-tree
                        :zNodes="zNodes"
                        treeDivId="domesticTree" deptSelect
                        showRMenu
                        @treeDblClick="treeDblClick"
                        class="ztree" style="width: 200px;height: 400px;overflow: auto">
                      </laws-tree>
                    </div>
                  </el-popover>
                  <!--<ul id="orgTree" class="ztree" style="width: 200px;height: 500px;overflow: auto"></ul>-->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div id="roleFormButton" class="demo-drawer-footer" :class="{ 'disappear': usersType === 3 }">
          <el-button size="mini" @click="closeDrawer">取消</el-button>
          <el-button type="primary" size="mini" @click="saveUserInfo('userVO')">提交</el-button>
        </div>
      </el-drawer>
      <!--查看抽屉-->
      <el-drawer
        :wrapperClosable="false"
        size="640px"
        title="用户信息"
        :visible.sync="showUserSeeModal"
        :destroy-on-close="true"
        @close="closeDrawer"
        custom-class="demo-drawer check-draw"
      >
        <div class="demo-drawer__content">
          <div class="check-item-row">
            <div class="check-item-col1">
              <div class="check-item-label">人员姓名：</div>
              <div class="check-item-value">{{ userVO.uname }}</div>
            </div>
            <div class="check-item-col1">
              <div class="check-item-label">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</div>
              <div class="check-item-value">{{ userVO.account }}</div>
            </div>
          </div>
          <div class="check-item-row">
            <div class="check-item-col2">
              <div class="check-item-label">角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色：</div>
              <div class="check-item-value">{{userVO.roleNameList}}</div>
            </div>
            <div class="check-item-col2">
              <div class="check-item-label">用户类型：</div>
              <div class="check-item-value">{{ userVO.userType ==='GQYJY' ? '研究院':userVO.userType ==='GQJT'?'集团':userVO.userType ==='OTHER'?'其他':'' }}</div>
            </div>
          </div>
          <div class="check-item-row">
            <div class="check-item-col1">
              <div class="check-item-label">所属部门：</div>
              <div class="check-item-value" :title="userVO.orgName">{{ userVO.orgName }}</div>
            </div>
            <div class="check-item-col1">
              <div class="check-item-label">手机号码：</div>
              <div class="check-item-value">{{userVO.mobilePhone}}</div>
            </div>
          </div>
          <div class="check-item-row">
            <div class="check-item-col2">
              <div class="check-item-label">用户状态：</div>
              <div class="check-item-value">{{userVO.disableFlag==0? '启用':'禁用'}}</div>
            </div>
            <div class="check-item-col2"></div>
          </div>
        </div>
      </el-drawer>
    </div>

  </div>
</template>

<script>
import 'zTree/js/jquery.ztree.core.js'
export default {
  name: 'UserManage',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入您的密码！'))
      } else {
        let tel = /^.*[^\d].*$/
        let tel2 = /^.{6,20}$/
        let tel3 = /^\S*$/
        if (!value.match(tel)) {
          return callback(new Error('密码不能为纯数字！'))
        } else if (!value.match(tel2)) {
          return callback(new Error('密码长度为6-20位'))
        } else if (!value.match(tel3)) {
          return callback(new Error('密码不能有空格'))
        }
      }callback()
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('再次输入密码不能为空！'))
      } else if (value !== this.userVO.password) {
        callback(new Error('再次输入密码与用户密码不匹配！'))
      } else {
        let tel = /^.*[^\d].*$/
        let tel2 = /^.{6,20}$/
        let tel3 = /^\S*$/
        if (!value.match(tel)) {
          return callback(new Error('密码不能为纯数字'))
        } else if (!value.match(tel2)) {
          return callback(new Error('密码长度为6-20位'))
        } else if (!value.match(tel3)) {
          return callback(new Error('密码不能有空格'))
        }
      }callback()
    }

    return {
      // 搜索框
      search: {
        userType: '',
        account: '',
        userTypeOptions: [{
          label: '研究院',
          // label: '广汽研究院',
          value: 'GQYJY'
        }, {
          label: '集团',
          // label: '广汽集团',
          value: 'GQJT'
        }, {
          label: '其他',
          value: 'OTHER'
        }],
        uname: '',
        roleId: '',
        orgId: '',
        orgName: '',
        roleOptions: [],
        disableFlag: '',
        disableFlagOptions: [{
          label: '正常',
          value: '0'
        }, {
          label: '禁用',
          value: '1'
        }],
        searching: false
      },
      usersType: '',
      createType: true,
      // 总数
      total: 0,
      // 当前页数
      pageNo: 1,
      // 单页数量
      pageSize: 10,
      // 加载状态
      loading: false,
      // 抽屉loading
      drawerLoading: false,
      // 用户模态框标题
      userTitle: '',
      // 用户状态
      showUserModal: false,
      // 显示密码
      showPWD: true,
      // 账户禁用
      accountState: false,
      // 用户查看模态框
      userInfoModel: false,
      // 表格高度
      tableHeight: 600,
      // 用户信息
      userVO: {
        usid: '',
        account: '',
        password: '',
        passwordCheck: '',
        uname: '',
        roleId: '',
        roleName: '',
        userType: '',
        mobilePhone: '',
        officePhone: '',
        workNum: '',
        email: '',
        disableFlag: '',
        orgName: '',
        orgId: '',
        roleIdList: [],
        roleNameList: []
      },
      userVOFormRules: {
        account: [
          {required: true, type: 'string', validator: this.verify.checkUsername2, trigger: 'blur'},
          {type: 'string', min: 2, message: '最少输入2位', trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}
        ],
        uname: [{required: true, message: '人员姓名不能为空', trigger: 'blur'},
          {type: 'string', validator: this.verify.checkSpecialCharacter2, trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}],
        workNum: [
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}
        ],
        mobilePhone: [{
          required: true, type: 'string', validator: this.verify.checkMobilePhone, trigger: 'blur'
        }],
        officePhone: [
          {type: 'string', max: 50, message: '最多输入50位，且必须为数字', trigger: 'blur'},
          { type: 'string', validator: this.verify.checkFaxAddress, trigger: 'blur' }
        ],
        email: [
          {required: true, message: '邮箱不能为空', trigger: 'blur'},
          {type: 'string', max: 50, message: '最多输入50位', trigger: 'blur'},
          {type: 'email', message: '电子邮箱格式不正确', trigger: 'blur'}],
        disableFlag: [
          {required: true, message: '用户状态不能为空', trigger: 'change'}
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ],
        orgName: [{
          required: true, message: '所属部门不能为空', trigger: 'change'
        }]
        // 此处需要两次输入的密码是否一致
      },
      // 用户列表数据
      userList: [],
      clickUserList: [],
      // 组织机构
      orgList: [],
      zNodes: [],
      zNodesTwo: [],
      orgTree: {},
      showUserSeeModal: false,
      syncInfo: '无',
      clearFlag: false
    }
  },
  methods: {
    // 搜索所属部门
    inputChange () {
      this.search.orgId = ''
      this.getOrgTreeSource()
    },
    // 搜索
    searchUserPageBtn () {
      this.pageNo = 1
      this.searchUserPage()
    },
    // 用户信息分页查询
    searchUserPage () {
      this.$http.get('sys/user/',
        {
          pageNo: this.pageNo,
          pageSize: this.$store.getters.userInfo.configContent,
          userType: this.search.userType,
          uname: this.search.uname,
          roleId: this.search.roleId,
          disableFlag: this.search.disableFlag,
          account: this.search.account,
          orgId: this.search.orgId
        },
        {_this: this, loading: 'loading'},
        res => {
          if (res.ok) {
            this.userList = res.data.list
            if (this.userList.length === 0 && this.pageNo !== 1) {
              this.pageNo = 1
              this.searchUserPage()
            }
            this.total = res.data.count
          }
        }, e => {})
      // this.$refs.selection.selectAll(false)
    },
    // 获取角色列表
    selectRoleList () {
      this.$http.get('sys/role/findAll', {}, {_this: this}, res => {
        let roleList = res.data
        let roleOpList = []
        for (let index = 0; index < roleList.length; index++) {
          let role = roleList[index]
          let roleOption = {}
          roleOption.label = role.name
          roleOption.value = role.id
          roleOpList.push(roleOption)
        }
        this.search.roleOptions = roleOpList
      }, e => {})
    },
    //  打开新增用户模态框
    openAddUserModal () {
      this.usersType = 1
      this.userTitle = '新增用户'
      this.showPWD = true
      this.accountState = false
      this.createType = false
      this.getOrgTreeSource()
      // this.$refs['userVO'].resetFields()
      this.showUserModal = true
      this.userVO.roleIdList = []
      this.userVO.roleNameList = ''
    },
    // 所属部门选取
    treeDblClick (treeId, treeNode) {
      this.userVO.orgId = treeNode.id
      this.userVO.orgName = treeNode.name
      $('#deptBtn').click()
    },
    treeDblClick1 (treeId, treeNode) {
      this.search.orgId = treeNode.id
      this.search.orgName = treeNode.name
      $('#deptBtn1').click()
    },
    // 保存用户信息
    saveUserInfo (name) {
      // 解决因清空表单时导致数组变成字符串
      if (this.userVO.roleNameList === '') {
        this.userVO.roleNameList = []
      }
      if (this.userVO.roleIdList === '') {
        this.userVO.roleIdList = []
      }
      if (this.userVO.roleEOList === '') {
        this.userVO.roleEOList = []
      }
      if (this.userVO.orgIdList === '') {
        this.userVO.orgIdList = []
      }
      if (this.userVO.orgEOList === '') {
        this.userVO.orgEOList = []
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 加密用户信息
          let userEOStr = JSON.stringify(this.userVO)
          userEOStr = this.$base64(userEOStr)
          // 更新
          if (this.userVO.usid !== null && this.userVO.usid !== '') {
            this.$http.put('sys/user/updateUser', {
              userStr: userEOStr
            },
            {_this: this, loading: 'drawerLoading'},
            res => {
              if (JSON.parse(JSON.stringify(this.$store.getters.userInfo)).userId === this.userVO.usid) {
                let obj = {}
                obj = JSON.parse(JSON.stringify(this.$store.getters.userInfo))
                obj.orgName = this.userVO.orgName
                obj.uName = this.userVO.uname
                obj.mobilePhone = this.userVO.mobilePhone
                obj.officePhone = this.userVO.officePhone
                obj.account = this.userVO.account
                obj.email = this.userVO.email
                obj.faxAddress = this.userVO.faxAddress
                this.setUserInfo(JSON.stringify(obj))
              }
              this.closeDrawer()
              this.searchUserPage()
            }, e => {})
          } else {
            // 新增
            this.$http.post('sys/user/addUser', {
              userStr: userEOStr
            },
            {_this: this, loading: this.loading},
            res => {
              if (res.ok) {
                // this.executeSuccess('保存用户成功！')
                this.showUserModal = false
                this.closeDrawer()
                this.searchUserPage()
              }
            }, e => {})
          }
          this.searchUserPage()
        } else {
        }
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
            this.zNodes = treeNode
            this.zNodesTwo = treeNode
          }
        }, e => {})
    },
    // 用户编辑
    userEdit (index, row) {
      this.userTitle = '编辑用户'
      this.usersType = 2
      this.createType = true
      this.showPWD = false
      this.accountState = true
      this.userVO = JSON.parse(JSON.stringify(row))
      this.userVO.disableFlag = this.userVO.disableFlag.toString()
      this.getOrgTreeSource()
      this.showUserModal = true
    },
    // 用户删除
    userDel (index, row) {
      const h = this.$createElement
      this.$msgbox({
        title: '消息',
        message: h('p', null, [
          h('span', null, '您确认要删除 '),
          h('i', { style: 'color: #E4393C' }, row.uname),
          h('span', null, '吗？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('sys/user/' + row.usid, {},
          {
            _this: this
          }, res => {
            if (res.ok) {
              this.searchUserPage() // 调用分页方法
            }
          }
        )
      }).catch(() => {
      })
    },
    // 批量删除
    batchUserDel () {
      // 此处获取选中的数据
      if (this.clickUserList.length > 0) {
        let userIds = []
        for (let i = 0; i < this.clickUserList.length; i++) {
          let userId = this.clickUserList[i].usid
          userIds.push(userId)
        }
        let userIdsStr = userIds.join(',')
        this.$confirm('确定删除这些数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('sys/user/' + userIdsStr, {},
            { _this: this
            }, res => {
              if (res.ok) {
                this.searchUserPage()
                this.clickUserList = []
              }
            })
        }).catch(() => {
          this.$refs.selection.clearSelection()
          this.clickUserList = []
        })
      } else {
        this.$message({
          message: '请选择一条数据进行删除',
          type: 'warning'
        })
      }
    },
    // 用户查看
    showUser (index, row) {
      this.showUserSeeModal = true
      this.userVO = JSON.parse(JSON.stringify(row))
      this.userVO.disableFlag = this.userVO.disableFlag.toString()
      let obj = ''
      obj = this.userVO.roleNameList.join(',')
      this.userVO.roleNameList = obj
    },
    /**
     * @description: 搜索框重置
     * @author: chenxiaoxi
     * @date: 2018-09-10 14:18:19
     */
    resetSearch () {
      this.search.userType = ''
      this.search.uname = ''
      this.search.roleId = ''
      this.search.disableFlag = ''
      this.search.account = ''
      this.search.orgName = ''
      this.search.orgId = ''
      this.getOrgTreeSource()
      this.searchUserPage()
    },
    pageChange (page) {
      this.pageNo = page
      this.searchUserPage()
    },
    pageSizeChange (pageSize) {
      this.searchUserPage()
    },
    // 关闭抽屉
    closeDrawer () {
      this.$nextTick(() => {
        // 清空新增和编辑的form表单内容
        for (let i in this.userVO) {
          this.userVO[i] = ''
        }
      })
    },
    handleRowChange (selection) {
      this.clickUserList = selection
    },
    /**
     * @description: 部门节点回显
     * @author: chenxiaoxi
     * @date: 2018/10/24 15:47:23
     */
    selectDeptNode () {
      // 当前节点id this.userVO.orgId
    },
    syncUserInfo: function () {
      this.$http.get('sys/user/syncUserInfo', {}, {
        _this: this, loading: 'loading'
      }, res => {
        this.$Message.success(res.message)
      }, e => {})
    },
    getLastSyncTime () {
      this.$http.get('sys/otSyncInfo/getLastSync', {syncType: 'ACCOUNT'}, {
        _this: this, loading: 'loading'
      }, res => {
        if (res.data !== null || res.data !== undefined) {
          let sync = res.data
          this.syncInfo = sync.syncTime
        }
      }, e => {})
    },
    resetPassword (id) {
      let userId = this.$base64(id)
      this.$http.post('sys/user/resetPassword', {userId: userId}, {
        _this: this
      }, res => {
        if (res.ok) {
          // this.$Message.success('密码重置为：123456a')
        }
      }, e => {})
    }
  },
  components: {},
  watch: {},
  mounted () {
    let _this = this
    this.selectRoleList()
    this.searchUserPage()
    this.getOrgTreeSource()
    this.getLastSyncTime()
    this.$nextTick(() => {
      let tableHeight = $('.content').css('height')
      let height = parseInt(tableHeight.substring(0, tableHeight.indexOf('p'))) - 155
      this.tableHeight = height
      window.onresize = function () {
        let tableHeight = $('.content').css('height')
        let height = parseInt(tableHeight.substring(0, tableHeight.indexOf('p'))) - 155
        _this.tableHeight = height
      }
    })
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/mixins';
  #user-manage{
    padding: 0.2rem 0.3rem;
    height: 100%;
    background: #FFF;
    .table-tools-bar .tools-bar-wrapper .label-select-content {
      min-width: 0 !important;
      width: auto !important;
    }
    .content{
      height: calc(~'100% - 150px');
    }
    // 同步信息样式
    .syncUser{
      .flex();
      flex: 1;
      justify-content: space-between;
      align-items: center;
    }
    .disappear{
      display: none;
    }
    .demo-drawer-footer{
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      border-top: 1px solid #e8e8e8;
      padding: 10px 16px;
      text-align: right;
      background: #fff;
    }
  }
  .roleSee{
    font-size: 14px;
    .role-see-row{
      .flex();
      margin-bottom: 10px;
      &:last-child{
        margin-bottom: 0;
      }
      .role-see-col{
        flex: 1;
        .flex();
        .role-see-col-label{
          min-width: 70px;
          text-align: right;
          font-weight: 600;
        }
        .role-see-col-value{
          color: #909bb3;
        }
      }
    }
  }
</style>
