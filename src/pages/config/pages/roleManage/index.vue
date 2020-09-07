<!-- 配置管理 - 角色管理 -->
<template>
  <div class="role-manage v-class">
    <table-tools-bar>
      <div slot="left">
        <el-form :model="roleSearch" inline class="label-input-form" label-width="70px">
          <el-form-item label="角色名称" prop="roleName" class="serch-form-item">
            <el-input
              v-model="roleSearch.roleName"
              placeholder="请输入角色名称"
              clearable
              :maxlength="100"/>
          </el-form-item>
          <el-form-item label="状态" prop="type" class="serch-form-item">
            <search-select
              v-model="roleSearch.type"
              :options="roleSearch.typeOptions" />
          </el-form-item>
          <el-form-item label="类型" prop="roleTypeOptions" class="serch-form-item">
            <search-select
              v-model="roleSearch.state"
              :options="roleSearch.roleTypeOptions" />
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              icon="el-icon-search"
              type="primary"
              class="searchAngNewBtn"
              @click="selectRoleBtn"
            ></el-button>
          </el-form-item>
          <el-form-item class="serch-form-item btn-box">
            <el-button
              type="primary"
              class="searchAngNewBtn"
              @click="resetRole">清空查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </table-tools-bar>
    <div class="content">
      <div class="action-bar syncUser">
        <el-button type="primary" size="mini" @click="openRoleAddModel" v-btn-permission="'4C796W933W'">新增</el-button>
        <el-button type="primary" size="mini" @click="roleConfigure" v-btn-permission="'SBY9NR5AZ8Q'">配置角色资源</el-button>
        <el-button type="primary" size="mini" @click="roleJurisdiction" v-btn-permission="'NMDGHE78SD'">配置企标细类和资料中心</el-button>
        <el-button type="danger" size="mini" @click="roleBatchDelete" v-btn-permission="'3RTCZ6AJB9'">批量删除</el-button>
      </div>
      <loading :loading="roleDataLoading">数据处理中</loading>
      <!--<Table :columns="roleColumns" :height="tableHeight" :data="roleList" border ref="selections" class="roleTable" @on-selection-change=" handleSelectone"></Table>-->
      <el-table
        border
        ref="selection"
        :height="tableHeight"
        :data="roleList"
        tooltip-effect="dark"
        style="width: 100%;"
        @selection-change="handleSelectone"
        :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="角色描述"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column
          prop="useFlag"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.useFlag === 0">启用</div>
            <div v-else>禁用</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="roleType"
          label="类型"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.roleType === 'LOCAL_USER'">研究院用户</div>
            <div v-else-if="scope.row.roleType === 'OTHER_USER'">非研究院用户</div>
            <div v-else-if="scope.row.roleType === 'CONADMIN'">配置管理员</div>
            <div v-else>暂无</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operUserName"
          label="操作人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="modifyTime"
          label="操作时间"
          width="150"
          align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.modifyTime.substring(0, 10) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              class="opera-btn"
              size="mini"
              type="primary"
              @click="showRole(scope.$index, scope.row)">查看</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="warning"
              v-btn-permission="'ZRVPAQZ85G'"
              :disabled="scope.row.isDefault === 1"
              @click="roleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              class="opera-btn"
              size="mini"
              type="danger"
              v-btn-permission="'AVWDGCV3PA'"
              :disabled="scope.row.isDefault === 1"
              @click="roleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :total="total" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></pagination>
    <el-dialog
      :visible.sync="sysMenu"
      title="系统菜单"
      @close="modalCancel"
      destroy-on-close
    >
      <div class="sysMenuTreeDiv" >
        <laws-tree
          :zNodes="sysMenuTree"
          loadingTips="系统菜单获取中"
          treeDivId="menuTree"
          :editable="false"
          checkEnable
          :chkboxType="menuTreeType"
          ref="menuTree"></laws-tree>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="closeSysMenu">取消</el-button>
        <el-button type="primary" size="mini" @click="saveRoleMenu">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible="jurisdictionModal"
      title="配置企标细类和资料中心"
      @close="jurisdictionModalClose"
      destroy-on-close
    >
      <el-tabs v-model="jurisdictionTabs" @tab-click="jurisdictionTab">
        <el-tab-pane label="企标细类" name="jurisdictionOne">
          <div class="sysMenuTreeDiv" >
            <laws-tree
              :zNodes="jurisdictionTree"
              loadingTips="菜单获取中"
              treeDivId="jurisdictionTree"
              :editable="false"
              checkEnable
              ref="roleTree"></laws-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资料中心" name="jurisdictionTwo">
          <!--<Table  ref="selection" border :columns="jurisdictionColumns" :data="jurisdictionData" @on-selection-change="jurisdictionTableChange"></Table>-->
          <el-table
            border
            :data="jurisdictionData"
            :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center">
            </el-table-column>
            <el-table-column
              prop="moduleName"
              label="参数"
              align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <loading :loading="jurisdictionLoading">正在获取中……</loading>
      <div slot="footer">
        <el-button size="mini" @click="jurisdictionModalClose">取消</el-button>
        <el-button type="primary" size="mini" @click="jurisdictionModalOk">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新建抽屉 -->
    <el-drawer
      :title="roleTitle"
      :wrapperClosable="false"
      :visible.sync="showRoleInfoModal"
      size="400px"
      destroy-on-close
      @close="closeDrawer">
      <div class="demo-drawer__content">
        <el-form
          ref="roleVO"
          :model="roleVO"
          :rules="roleVOFormRules"
          label-position="right"
          class="label-input-form"
          inline
        >
        <input v-model="roleVO.id" v-show="false">
        <el-form-item label="角色名称" prop="name" class="add-form-item">
          <el-input v-model.trim="roleVO.name" placeholder="请输入角色名" clearable/>
        </el-form-item>
        <el-form-item label="角色描述" prop="remarks"  class="add-form-item">
          <el-input v-model.trim="roleVO.remarks" placeholder="请输入角色描述" clearable />
        </el-form-item>
        <el-form-item label="角色类型" prop="roleType" class="add-form-item">
          <search-select
            v-model="roleVO.roleType"
            placeholder="请选择角色类型"
            :options="roleTypeOptions" />
        </el-form-item>
        <el-form-item label="角色状态" prop="useFlag" class="add-form-item">
          <search-select
            v-model="roleVO.useFlag"
            placeholder="请选择角色状态"
            :options="[{
                    label: '启用',
                    value: '0'
                  }, {
                    label: '禁用',
                    value: '1'
                  }]" />
        </el-form-item>
        </el-form>
      </div>
      <div id="roleFormButton" class="demo-drawer-footer">
        <el-button size="mini" @click="closeDrawer">取消</el-button>
        <el-button type="primary" size="mini" @click="saveRoleInfo('roleVO')">提交</el-button>
      </div>
    </el-drawer>
    <!-- 查看抽屉-->
    <el-drawer
      :show-close="true"
      :wrapperClosable="false"
      size="640px"
      title="查看信息"
      :visible.sync="roleInfoModel"
      class="demo-drawer check-draw"
    >
      <div class="demo-drawer__content">
        <div class="check-item-row">
          <div class="check-item-col1">
            <div class="check-item-label">角色名称：</div>
            <div class="check-item-value" :title="roleVO.name">{{roleVO.name}}</div>
          </div>
          <div class="check-item-col1">
            <div class="check-item-label">角色描述：</div>
            <div class="check-item-value" :title="roleVO.remarks">{{roleVO.remarks}}</div>
          </div>
        </div>
        <div class="check-item-row">
          <div class="check-item-col2">
            <div class="check-item-label">角色类型：</div>
            <div class="check-item-value" v-if="this.roleVO.roleType ===  'LOCAL_USER'">研究院用户</div>
            <div class="check-item-value" v-if="this.roleVO.roleType ===  'OTHER_USER'">非研究院用户</div>
            <div class="check-item-value" v-if="this.roleVO.roleType ===  'CONADMIN'">配置管理员</div>
            <div class="check-item-value"  v-if="this.roleVO.roleType ===  'null'">暂无</div>
            <div class="check-item-value"  v-if="this.roleVO.roleType ===  '暂无'">暂无</div>
            <div class="check-item-value"  v-if="this.roleVO.roleType ===  ''">暂无</div>
          </div>
          <div class="check-item-col2">
            <div class="check-item-label">角色状态：</div>
            <div class="check-item-value" :title="roleVO.useFlag === '0' ? '启用':'禁用'">{{roleVO.useFlag === '0' ? '启用':'禁用'}}</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'role-manage',
  data () {
    return {
      jurisdictionTabs: 'jurisdictionOne',
      jurisdictionLoading: false,
      jurisdictionName: '',
      jurisdictionRow: '',
      jurisdictionModal: false,
      roleDataLoading: false,
      roleInfoModel: false,
      total: 0,
      tableHeight: 600,
      roleTitle: '',
      selectNum: '',
      sysMenu: false,
      sysMenuTree: [],
      menuTreeType: "{'Y': 'ps', 'N': 'p'}",
      menuTreeType2: "{'Y': 'ps', 'N': 'ps'}",
      jurisdictionTree: [],
      selectRoleId: '',
      roleSearch: {
        roleName: '',
        type: '',
        state: '',
        typeOptions: [{label: '全部', value: '-1'}, {label: '启用', value: '0'}, {label: '禁用', value: '1'}
        ],
        typeOptions1: [ {label: '正常', value: '0'}, { label: '禁用', value: '1' } ],
        roleTypeOptions: [{ label: '暂无', value: 'null' }, {label: '研究院用户', value: 'LOCAL_USER'}, {label: '非研究院用户', value: 'OTHER_USER'}, {label: '配置管理员', value: 'CONADMIN'}]
        // roleTypeOptions: [{ label: '暂无', value: 'null' }, {label: '广汽研究院用户', value: 'LOCAL_USER'}, {label: '非广汽研究院用户', value: 'OTHER_USER'}, {label: '配置管理员', value: 'CONADMIN'}]
      },
      pageNo: 1,
      pageSize: 10,
      userList: [],
      showRoleInfoModal: false,
      roleVO: {
        id: '',
        name: '',
        remarks: '',
        useFlag: '',
        roleType: ''
      },
      roleVOFormRules: {
        name: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'},
          {type: 'string', max: 20, message: '最多输入20位', trigger: 'blur'}
        ],
        roleType: [
          {required: true, message: '角色类型不能为空', trigger: 'change'}
        ],
        useFlag: [
          {required: true, message: '角色状态不能为空', trigger: 'change'}
        ],
        remarks: [
          {type: 'string', max: 100, message: '最多输入100位', trigger: 'blur'}
        ]
      },
      roleTypeOptions: [{ label: '暂无', value: 'null' }, {label: '研究院用户', value: 'LOCAL_USER'}, {label: '非研究院用户', value: 'OTHER_USER'}, {label: '配置管理员', value: 'CONADMIN'}],
      // roleTypeOptions: [{ label: '暂无', value: 'null' }, {label: '广汽研究院用户', value: 'LOCAL_USER'}, {label: '非广汽研究院用户', value: 'OTHER_USER'}, {label: '配置管理员', value: 'CONADMIN'}],
      roleList: [],
      jurisdictionColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '参数',
          key: 'moduleName',
          align: 'center'
        }
      ],
      jurisdictionData: [],
      parentNode: []
    }
  },
  methods: {
    // 角色配置对话框关闭时清空查询条件
    modalCancel (flag) {
      if (!flag) {
        this.$refs.menuTree.clearSearch()
      }
    },
    // 查询、加载表格
    roleSelectPage () {
      let useFlag = 0
      if (this.roleSearch.type === '-1') {
        useFlag = null
      } else {
        useFlag = this.roleSearch.type
      }
      this.$http.get('sys/role/page',
        {pageNo: this.pageNo, pageSize: this.$store.getters.userInfo.configContent, roleName: this.roleSearch.roleName, useFlag: useFlag, roleType: this.roleSearch.state},
        {
          _this: this,
          loading: 'roleDataLoading'
        },
        res => {
          // let roleList = res.data.list
          // for (let i = 0; i < roleList.length; i++) {
          //   if (roleList[i].isDefault === 1) {
          //   }
          // }
          this.roleList = res.data.list
          this.total = res.data.count
        }, e => {})
      // this.$refs.selections.selectAll(false)
    },
    // 根据条件查询角色信息
    selectRoleBtn () {
      this.pageNo = 1
      this.roleSelectPage()
    },
    // 重置
    resetRole () {
      this.roleSearch.roleName = ''
      this.roleSearch.type = ''
      this.roleSearch.state = ''
      this.roleSelectPage()
    },
    //  全选
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    // 非全选
    handleSelectone (row) {
      this.selectNum = row
    },
    // 对话框
    instance (type, content) {
      const title = '请选择'
      switch (type) {
        case 'info':
          this.$message.info({
            title: title,
            message: content
          })
          break
        case 'success':
          this.$message.success({
            title: title,
            message: content
          })
          break
        case 'warning':
          this.$message.warning({
            title: title,
            message: content
          })
          break
        case 'error':
          this.$message.error({
            title: title,
            message: content
          })
          break
      }
    },
    // 关闭模态框
    closeDrawer () {
      this.showRoleInfoModal = false
      this.$nextTick(() => {
        for (let i in this.roleVO) {
          this.roleVO[i] = ''
        }
      })
    },
    // 添加角色信息
    openRoleAddModel () {
      this.roleVO.id = ''
      this.roleTitle = '添加角色信息'
      this.showRoleInfoModal = true
    },
    // 编辑角色信息
    roleEdit (index, row) {
      let roleInfo = JSON.parse(JSON.stringify(row))
      roleInfo.useFlag = roleInfo.useFlag.toString()
      this.roleVO = roleInfo
      this.roleTitle = '编辑角色信息'
      this.showRoleInfoModal = true
    },
    // 批量删除
    roleBatchDelete () {
      if (this.selectNum === '' || this.selectNum.length === 0) {
        this.instance('warning', '请选择一条数据进行删除')
      } else {
        let delIds = []
        for (let i = 0; i < this.selectNum.length; i++) {
          delIds.push(this.selectNum[i].id)
        }
        delIds = delIds.join(',')
        this.$confirm('确定删除这些数据?', '请选择', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('sys/role/deleteList', {
            ids: delIds
          },
          {
            _this: this
          }, res => {
            if (res.ok) {
              this.roleSelectPage()
              this.selectNum = []
            }
          })
        }).catch(() => {
          this.$refs.selection.clearSelection()
          this.selectNum = []
        })
      }
    },
    // 删除角色
    roleDel (index, row) {
      // 此处需要confirm功能
      this.$confirm('确定删除这一条数据?', '请选择', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('sys/role/' + row.id, {},
          {
            _this: this
          }, res => {
            if (res.ok) {
              this.roleSelectPage()
            }
          })
      }).catch(() => {
      })
    },
    // 保存角色信息
    saveRoleInfo (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let roleInfoVO = JSON.parse(JSON.stringify(this.roleVO))
          if (roleInfoVO.id != null && roleInfoVO.id !== '') {
            // 修改角色信息
            // 此处暂未实现
            this.$http.putData('sys/role', this.roleVO,
              {
                _this: this, loading: 'roleDataLoading'
              }, res => {
                if (res.ok) {
                  this.closeDrawer()
                  this.roleSelectPage()
                } else {
                }
              }
            )
          } else {
            this.$http.postData('sys/role', this.roleVO,
              {
                _this: this,
                loading: 'roleDataLoading'
              }, res => {
                if (res.ok) {
                  this.closeDrawer()
                  this.roleSelectPage()
                } else {
                }
              })
          }
        } else {
        }
      })
    },
    // 查看角色信息
    showRole (index, row) {
      this.roleTitle = '查看角色信息'
      this.roleInfoModel = true
      this.roleVO = JSON.parse(JSON.stringify(row))
      this.roleVO.useFlag = this.roleVO.useFlag.toString()
    },
    jurisdictionTableChange (row) {
      this.jurisdictionRow = row
    },
    // 配置角色信息
    roleConfigure () {
      if (this.selectNum === '' || this.selectNum.length === 0) {
        this.instance('warning', '请选择角色')
      } else if (this.selectNum.length > 1) {
        this.instance('warning', '只能选择一个角色操作！')
      } else {
        let roleId = this.selectNum[0].id
        this.selectRoleId = roleId
        // 此处加载资源列表数据
        this.getSysResource(roleId)
        // 然后获取选中角色ID集合
        // this.getRoleMenuInfo(roleId)
      }
    },
    // 配置企标细类
    roleJurisdiction () {
      if (this.selectNum === '' || this.selectNum.length === 0) {
        this.instance('warning', '请选择角色')
      } else if (this.selectNum.length > 1) {
        this.instance('warning', '只能选择一个角色操作！')
      } else {
        this.jurisdictionModal = true
        let roleId = this.selectNum[0].id
        this.selectRoleId = roleId
        this.selectMenu(roleId)
        this.selectInformation(roleId)
      }
    },
    selectRoleMenu (id, node) {
      this.$http.get('sys/roleSarMenu', {
        roleId: id,
        pageSize: 9999
      }, {
        _this: this
      }, res => {
        for (let i = 0; i < node.length; i++) {
          for (let j = 0; j < res.data.length; j++) {
            if (res.data[j].sarMenuId === node[i].id) {
              node[i].checked = true
            }
          }
        }
        this.jurisdictionTree = node
      }, e => {
      })
    },
    selectInformation (id) {
      this.$http.get('lawss/msgModule/page', {
        page: 1,
        pageSize: 9999
      }, {
        _this: this,
        loading: 'jurisdictionLoading'
      }, res => {
        // this.jurisdictionData = res.data.list
        this.informationCheck(id, res.data.list)
      }, e => {
      })
    },
    informationCheck (id, list) {
      this.$http.get('sys/roleMsgModule', {
        roleId: id,
        pageSize: 9999
      }, {
        _this: this
      }, res => {
        this.jurisdictionData = list

        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < this.jurisdictionData.length; j++) {
            if (res.data[i].msgModuleId === this.jurisdictionData[j].id) {
              this.jurisdictionData[j]._checked = true
            }
          }
        }
      }, e => {
      })
    },
    selectMenu (id) {
      this.$http.get('lawss/sarMenu/selectmenu', {}, {
        _this: this,
        loading: 'jurisdictionLoading'
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
          }
          treeNode[index] = treeItem
          // 记录最外层父节点
          if (treeItem.parentId === '' || treeItem.parentId == null) {
            this.parentNode = treeItem
          }
        })
        // treeNodes = JSON.parse(JSON.stringify(treeNode))

        this.selectRoleMenu(id, JSON.parse(JSON.stringify(treeNode)))
      }, e => {
      })
    },
    // 权限对话框关闭
    jurisdictionModalClose () {
      this.jurisdictionModal = false
      this.jurisdictionTabs = 'jurisdictionOne'
      this.$refs.roleTree.clearSearch()
    },
    // 权限对话框提交
    jurisdictionModalOk () {
      let roleId = this.selectNum[0].id
      if (this.jurisdictionName === 'jurisdictionOne' || this.jurisdictionName === '') {
        let checkRoleMenu = this.$refs.roleTree.getCheckNodes()
        let ids = []
        for (let i = 0; i < checkRoleMenu.length; i++) {
          let id = checkRoleMenu[i].id
          let parentIds = checkRoleMenu[i].parentIds
          if ($.inArray(id, ids) === -1) {
            ids.push(id)
          }
          if (parentIds !== null) {
            let parentIdArray = parentIds.split(',')
            for (let n = 0; n < parentIdArray.length; n++) {
              if ($.inArray(parentIdArray[n], ids) === -1) {
                ids.push(parentIdArray[n])
              }
            }
          }
        }
        this.$http.postData('sys/roleSarMenu/bindRoleSarMenuId', {
          roleId: roleId,
          sarMenuIds: ids
        }, {
          _this: this
        }, res => {
          this.$message.success('配置成功')
          this.jurisdictionModal = false
        })
      } else if (this.jurisdictionName === 'jurisdictionTwo') {
        let ids = []
        for (let i = 0; i < this.jurisdictionRow.length; i++) {
          ids.push(this.jurisdictionRow[i].id)
        }
        this.$http.postData('sys/roleMsgModule/bindRoleMoudleId', {
          roleId: roleId,
          msgModuleIds: ids
        }, {
          _this: this
        }, res => {
          this.$message.success('配置成功')
          this.jurisdictionModal = false
        })
      }
      this.jurisdictionName = ''
    },
    // 标签页切换
    jurisdictionTab (name) {
      this.jurisdictionName = name
    },
    // 获取系统资源
    getSysResource (roleId) {
      this.$http.get('sys/menu', {roleId: roleId}, {_this: this, loading: 'roleDataLoading'}, res => {
        this.sysMenuTree = this.procesMenuData(res.data)
        // this.sysMenuTree = res.data
        // this.getRoleMenuInfo(roleId)
        this.sysMenu = true
      }, e => {})
    },
    // 根据角色ID获取菜单性信息
    getRoleMenuInfo (roleId) {
      this.$http.get('sys/menu/listMenuByUserId/' + roleId, {}, {_this: this, loading: 'roleDataLoading'}, res => {
        let resMenuList = res.data
        if (resMenuList !== null && resMenuList.length > 0) {
          this.sysMenuTree = this.procesMenuData(resMenuList)
          // this.sysMenuTree = resMenuList
          this.sysMenu = true
        } else {
          this.getSysResource()
        }
      }, e => {})
    },
    // 关闭菜单弹出框
    closeSysMenu () {
      // 首先清空树结构内容
      this.sysMenuTree = []
      this.sysMenu = false
      this.selectRoleId = ''
    },
    // 保存角色菜单信息
    saveRoleMenu () {
      let checkMenu = this.$refs.menuTree.getCheckNodes()
      if (checkMenu != null && checkMenu.length > 0) {
        let checkMenuList = []
        for (let i = 0; i < checkMenu.length; i++) {
          checkMenuList.push(checkMenu[i].id)
        }
        this.$http.postData('sys/role/saveRoleMenu', {
          rid: this.selectRoleId,
          menusstr: checkMenuList
        }, {_this: this, loading: 'roleDataLoading'}, res => {
          this.sysMenuTree = []
          this.sysMenu = false
          this.selectRoleId = ''
          this.roleSelectPage()
        })
      } else {
        this.instance('warning', '请选择系统菜单')
        return false
      }
    },
    // 将数据转换为zTree可是识别的格式
    procesMenuData (sysMenuData) {
      if (sysMenuData !== null && sysMenuData.length > 0) {
        let zTreeNodes = []
        for (let index = 0; index < sysMenuData.length; index++) {
          let option = {}
          option.id = sysMenuData[index].id
          option.pId = sysMenuData[index].parentId
          option.parentId = sysMenuData[index].parentId
          option.name = sysMenuData[index].name
          option.parentIds = sysMenuData[index].parentIds
          option.remarks = sysMenuData[index].remarks
          option.href = sysMenuData[index].href
          option.permission = sysMenuData[index].permission
          option.checked = sysMenuData[index].checked
          zTreeNodes.push(option)
        }
        return zTreeNodes
      } else {
        return []
      }
    },
    pageChange (page) {
      this.pageNo = page
      this.roleSelectPage()
    },
    pageSizeChange () {
      this.roleSelectPage()
    }
    // cleanRoleValue () {
    //   this.showRoleInfoModal = false
    //   this.$nextTick(() => {
    //     this.$refs['roleVO'].resetFields()
    //   })
    // },
    // closeDrawer () {
    //   this.cleanRoleValue()
    // }
  },
  // watch: {
  //   showRoleInfoModal (newVal, oldVal) {
  //     if (!newVal) {
  //       this.cleanRoleValue()
  //     }
  //   }
  // },
  mounted () {
    let _this = this
    this.pageNo = 1
    this.roleSearch.roleName = null
    // this.roleSearch.type = '-1'
    this.roleSelectPage()
    this.$nextTick(() => {
      let tableHeight = $('.content').css('height')
      let height = parseInt(tableHeight.substring(0, tableHeight.indexOf('p'))) - 185
      this.tableHeight = height
      window.onresize = function () {
        let tableHeight = $('.content').css('height')
        let height = parseInt(tableHeight.substring(0, tableHeight.indexOf('p'))) - 185
        _this.tableHeight = height
      }
    })
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/mixins';
  .role-manage{
    background: #FFF;
    padding: 0.2rem 0.3rem;
    .table-tools-bar{
      .ivu-form-item{
        margin-right: 0;
      }
    }
    @media screen and (min-width: 1366px) and (max-width: 1920px) {
      .ivu-form-item-content {
        width: 150px;
      }
      .ivu-form-item-content{
        .ivu-select-selection{
          min-width: 0;
        }
      }
      .tools-bar-wrapper{
        .ivu-input-wrapper{
          min-width: 0;
        }
      }
    }

  }
  .modalStyle{
    padding: 14px;
    font-size: 15px;
  }
  .laws-info-item-switch{
    .ivu-form-item-content{
      border: 1px solid #DDD;
      height: 32px;
      line-height: 32px;
      padding-left: 15px;
      .flex();
      align-items: center;
    }
  }
  .sysMenuTreeDiv{
    height: 400px;
    overflow-y: auto;
  }
</style>
