<!-- 配置管理 - 机构管理 -->
<template>
  <div id="mechanism-manage" class="v-class">
    <!--<loading :loading="treeModalLoading">正在保存...</loading>-->
    <div class="mechanism-manage-left">
      <!-- 组织机构图 -->
      <!--<ul id="treeDemo" class="ztree" v-show="zNodes.length > 0"></ul>-->
      <!--<loading :loading="treeLoading">{{ treeLoadingTips }}</loading>-->
      <laws-tree
        ref="mechanismManage"
        treeDivId="mechanismManage"
        v-if="zNodes.length"
        :zNodes="zNodes"
        autoSelect
        deptSelect
        showRMenu
        add-id="SSSSE8FGMP"
        edit-id="7EKKPBU65W"
        remove-id="XL4CJXWB8M"
        @treeClick="(treeId, treeNode) => handleClick(treeId, treeNode)"
        @treeAdd="(treeId, treeNode) => handleAdd(treeId, treeNode)"
        @treeEdit="(treeId, treeNode) => handleEdit(treeId, treeNode)"
        @treeRightClick="(treeId, treeNode) => treeRightClick(treeId, treeNode)"
        @treeRemove="(treeId, treeNode) => handleBeforeRemove(treeId, treeNode)"
      ></laws-tree>
      <!-- 节点新增、节点维护 -->
      <el-dialog
        :visible.sync="view.treeView"
        @on-visible-change="treChange"
        :close-on-click-modal="false"
        width="360px"
        :title="treeTitle"
      >
        <div class="form-content">
          <el-form
            ref="treeForm"
            :model="treeForm"
            :rules="treeFormRules"
            class="label-input-form"
            label-width="80px"
            inline
          >
            <el-form-item label="所属上级" prop="pNodeName" class="add-form-item">
              <el-input v-model="treeForm.pNodeName" disabled class="top1px" />
            </el-form-item>
            <el-form-item label="部门名称" prop="orgName" class="add-form-item">
              <el-input v-model="treeForm.orgName" placeholder="请输入部门名称" clearable />
            </el-form-item>
            <el-form-item label="部门简称" prop="shotName" class="add-form-item">
              <el-input v-model="treeForm.shotName" placeholder="请输入部门简称" clearable class="top1px" />
            </el-form-item>
            <el-form-item label="部门类型" prop="orgType" class="add-form-item">
              <search-select v-model="treeForm.orgType" :options="[{
                label: '室',
                value: 'ROOM'
              }, {
                label: '科',
                value: 'FAMILY'
              }, {
                label: '部门',
                value: 'DEPART'
              }]" placeholder="请选择部门类型" />
            </el-form-item>
            <el-form-item label="部门简介" prop="remarks" class="add-form-item">
              <el-input
                v-model="treeForm.remarks"
                :maxlength="100"
                type="textarea"
                :autosize="{minRows: 1,maxRows: 5}"
                placeholder="请输入部门描述"
                class="top1px"
                clearable />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button size="mini" @click="treeCancel">取消</el-button>
          <el-button type="primary" size="mini" @click="treeOk">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="mechanism-manage-right">
      <!-- 查询条件 -->
      <el-form
        ref="mechanismSearch"
        :model="mechanismSearch"
        inline
        class="label-input-form"
        label-width="70px"
      >
        <el-form-item prop="userName" label="人员姓名" class="serch-form-item">
          <el-input v-model="mechanismSearch.uname" placeholder="按人员姓名" clearable />
        </el-form-item>
        <el-form-item prop="roleName" label="角色" class="serch-form-item">
          <search-select
            v-model="mechanismSearch.roleId"
            placeholder="按角色"
            :options="roleList" />
        </el-form-item>
        <el-form-item label="状态" prop="state" class="serch-form-item">
          <search-select v-model="mechanismSearch.disableFlag" placeholder="按状态" :options="mechanismSearch.disableFlagOptions"></search-select>
        </el-form-item>
        <el-form-item class="serch-form-item btn-box">
          <el-button
            icon="el-icon-search"
            type="primary"
            class="searchAngNewBtn"
            @click="findByOrgBtn"
            :loading="mechanismSearch.searching"
          ></el-button>
        </el-form-item>
        <el-form-item class="serch-form-item btn-box">
          <el-button
            type="primary"
            class="searchAngNewBtn"
            @click="resetSearch">清空查询</el-button>
        </el-form-item>
        <el-divider class="el-divider-marginTop"></el-divider>
      </el-form>

      <div class="content">
        <div class="action-bar syncUser">
          <el-button type="primary" size="mini" title="设置角色" @click="setRole">设置角色</el-button>
          <el-button type="danger" size="mini" title="批量删除" @click="delUserList" v-btn-permission="'MABV68Z6DY'" v-if="deptEmpData.length">批量删除</el-button>
        </div>
        <el-table
          border
          ref="selection"
          :height="tableHeight"
          :data="deptEmpData"
          tooltip-effect="dark"
          style="width: 100%;"
          v-if="deptEmpData.length"
          @selection-change="handleSelect"
          :header-cell-style="{background: '#f8f8f9', color: '#515a6e'}"
        >
          <el-table-column
            type="selection"
            width="55"
            fixed
            align="center">
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="组织机构类型"
            width="150"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.userType === 'ROOM'">室级</div>
              <div v-if="scope.row.userType === 'DEPART'">部级</div>
              <div v-if="scope.row.userType === 'FAMILY'">科级</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="uname"
            label="人员姓名"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="account"
            label="系统账号"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="workNum"
            label="人员编号"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="roleNameList"
            label="角色"
            width="150"
            align="center">
            <template slot-scope="scope">
              {{ scope.row.roleNameList.join(',') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="所属部门"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="email"
            label="电子邮件"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="officePhone"
            label="办公电话"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="mobilePhone"
            label="手机号码"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="faxAddress"
            label="传真"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="通讯地址"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="disableFlag"
            label="状态"
            width="150"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.disableFlag === 0">正常</div>
              <div v-else>禁用</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="modifyTime"
            label="修改时间"
            width="150"
            align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.modifyTime !== null ? scope.row.modifyTime.split(' ')[0] : '' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                class="opera-btn"
                size="mini"
                type="primary"
                @click="showUsersInfo(scope.$index, scope.row)">查看</el-button>
              <el-button
                class="opera-btn"
                size="mini"
                type="danger"
                v-btn-permission="'MABV68Z6DY'"
                @click="delUser(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <hasNoData pClass="content" :tips="hasNoDataTips" v-else></hasNoData>
        <loading :loading="loading">正在获取人员列表</loading>
      </div>
      <pagination :page="page" :total="total" @pageChange="pageChange" @pageSizeChange="pageSizeChange"></pagination>
    </div>

    <el-dialog
      :visible.sync="visibleSetRole"
      title="设置角色"
      @close="closeModal"
      :loading="roleSaveLoading"
      width="400px"
    >
      <div style="padding: 0.2rem">
        <el-form
          ref="roleForm"
          :model="roleForm"
          :rules="roleRules"
          class="label-input-form"
          label-width="100px"
          inline
        >
          <el-form-item label="角色" prop="roleIdList" class="add-form-item">
            <el-select v-model="roleForm.roleIdList" multiple>
              <el-option v-for="item in roleList" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="closeModal">取消</el-button>
        <el-button type="primary" size="mini" @click="saveModal">确认</el-button>
      </div>
    </el-dialog>

    <!-- 查看 -->
    <el-drawer
      title="用户信息"
      :wrapperClosable="false"
      :visible.sync="view.showUserDrawer"
      :destroy-on-close="true"
      size="750px"
      class="demo-drawer check-draw"
    >
      <div class="demo-drawer__content">
        <div class="check-item-row">
          <div class="check-item-col1">
            <div class="check-item-label">机构类型：</div>
            <div class="check-item-value">{{ userInfo.txets || '--' }}</div>
          </div>
          <div class="check-item-col1">
            <div class="check-item-label"> 人员姓名：</div>
            <div class="check-item-value">{{ userInfo.uname }}</div>
          </div>
        </div>
        <div class="check-item-row">
          <div class="check-item-col2">
            <div class="check-item-label"> 系统账号：</div>
            <div class="check-item-value">{{ userInfo.account }}</div>
          </div>
          <div class="check-item-col2">
            <div class="check-item-label"> 人员编号：</div>
            <div class="check-item-value">{{ userInfo.workNum || '--'}}</div>
          </div>
        </div>
        <div class="check-item-row">
          <div class="check-item-col1">
            <div class="check-item-label">角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色：</div>
            <div class="check-item-value">{{ userInfo.roleNameList || '暂无' }}</div>
          </div>
          <div class="check-item-col1">
            <div class="check-item-label">所属部门：</div>
            <div class="check-item-value">{{ userInfo.orgName || '暂无' }}</div>
          </div>
        </div>
        <div class="check-item-row">
          <div class="check-item-col2">
            <div class="check-item-label">电子邮箱：</div>
            <div class="check-item-value">{{ userInfo.email || '--' }}</div>
          </div>
          <div class="check-item-col2">
            <div class="check-item-label">办公电话：</div>
            <div class="check-item-value">{{ userInfo.officePhone || '--' }}</div>
          </div>
        </div>
        <div class="check-item-row">
          <div class="check-item-col1">
            <div class="check-item-label"> 手机号码：</div>
            <div class="check-item-value">{{ userInfo.mobilePhone || '--' }}</div>
          </div>
          <!-- <div class="check-item-col">
            <div class="check-item-label">传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;真：</div>
            <div class="check-item-value" :title="userInfo.faxAddress || '&#45;&#45;'">{{ userInfo.faxAddress || '&#45;&#45;' }}</div>
          </div>
        </div>
        <div class="check-item-row">
          <div class="check-item-col">
            <div class="check-item-label">通讯地址：</div>
            <div class="check-item-value" :title="userInfo.address || '&#45;&#45;'">
              {{ userInfo.address || '&#45;&#45;' }}
            </div>
          </div> -->
          <div class="check-item-col1">
            <div class="check-item-label">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</div>
            <div class="check-item-value">{{ userInfo.disableFlag === 0 ? '正常' : '禁用' }}</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import 'zTree/js/jquery.ztree.core.js'
import 'zTree/js/jquery.ztree.excheck.js'
import 'zTree/js/jquery.ztree.exedit.js'
export default {
  name: 'MechanismManage',
  data () {
    return {
      orgFlag: '',
      orgObject: {},
      orgNew: '',
      // 搜索组
      mechanismSearch: {
        userType: '',
        uname: '',
        roleId: '',
        disableFlag: '',
        typeOptions: [
          {
            label: '类型1',
            value: 1
          }, {
            label: '类型2',
            value: 2
          }
        ],
        roleOptions: [
          {
            label: '管理员',
            value: 1
          },
          {
            label: '普通用户',
            value: 2
          }
        ],
        disableFlagOptions: [{
          label: '正常',
          value: '0'
        }, {
          label: '禁用',
          value: '1'
        }],
        searching: false
      },
      // 显示条件
      view: {
        treeView: false,
        treeFlag: 1, // 1新增 2编辑
        treeLoadingFlag: 1, // 获取为1 操作为2
        showUserDrawer: false // 显示用户信息抽屉
      },
      zTree: '',
      zNodes: [],
      setting: '',
      // 组织机构表单
      treeForm: {
        id: '',
        orgName: '',
        pNodeName: '',
        pId: '',
        remarks: '',
        shotName: '',
        parentIds: '',
        orgType: ''
      },
      // 组织机构表单规则
      treeFormRules: {
        pNodeName: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' },
          {type: 'string', max: 20, message: '最多输入20字符', trigger: 'blur'},
          {type: 'string', validator: this.verify.checkSpecialCharacter, trigger: 'blur'}
        ],
        orgName: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {type: 'string', max: 20, message: '最多输入20字符', trigger: 'blur'},
          {type: 'string', validator: this.verify.checkSpecialCharacter, trigger: 'blur'}
        ],
        shotName: [
          { required: true, message: '部门简称不能为空', trigger: 'blur' },
          {type: 'string', max: 20, message: '最多输入20字符', trigger: 'blur'},
          {type: 'string', validator: this.verify.checkSpecialCharacter, trigger: 'blur'}
        ],
        remarks: [
          {type: 'string', max: 100, message: '最多输入100字符', trigger: 'blur'},
          {type: 'string', validator: this.verify.checkSpecialCharacter, trigger: 'blur'}
        ],
        orgType: [
          {type: 'string', required: true, message: '部门类型不能为空', trigger: 'change'}
        ]
      },
      deptEmpData: [], // 组织下的员工列表
      loading: false,
      syncInfo: '无',
      treeModalLoading: false, // 新增、删除弹窗loading
      treeLoading: false,
      orgId: '', // 组织机构id
      page: 1,
      pageSize: 30,
      total: 0,
      tableHeight: 600,
      selectionList: [],
      treeReady: false,
      roleList: [], // 角色列表
      userInfo: '', // 用户信息
      openNodes: [], // 展开的节点
      currentNode: '', // 当前节点
      visibleSetRole: false, // 角色配置对话框
      roleForm: {
        roleId: '',
        roleIdList: []
      },
      roleRules: {
        // roleIdList: [
        //   { required: true, type: 'array', message: '角色不能为空', trigger: 'change' }
        // ]
      },
      roleSaveLoading: false, // 角色保存loading
      unassigned: false // 未分配人员查询标志
    }
  },
  methods: {
    /**
       * @author liruohao
       * @date 2019/6/3
       * @Description: 右击事件
       */
    treeRightClick (treeId, treeNode) {
      this.orgObject = treeNode
      this.orgNew = treeNode.id
      this.orgId = treeNode.id
    },
    treChange (type) {
      if (!type) {
        this.$refs['treeForm'].resetFields()
        for (let i in this.treeForm) {
          this.treeForm[i] = ''
        }
        this.orgNew = ''
      }
    },
    // 点击table表格查看按钮事件
    showUsersInfo (index, row) {
      this.view.showUserDrawer = true
      this.userInfo = JSON.parse(JSON.stringify(row))
      switch (this.userInfo.orgType) {
        case 'ROOM' :
          this.userInfo.txets = '室级'
          break
        case 'DEPART' :
          this.userInfo.txets = '部级'
          break
        case 'FAMILY' :
          this.userInfo.txets = '科级'
          break
        default :
          break
      }
      let obj = ''
      obj = this.userInfo.roleNameList.join(',')
      this.userInfo.roleNameList = obj
    },
    /**
       * @description: 获取组织结构树结构
       * @author: chenxiaoxi
       * @date: 2018-09-21 09:27:27
       */
    getTree () {
      return new Promise((resolve, reject) => {
        this.$http.get('sys/org/getTree', {}, {
          _this: this,
          loading: 'treeLoading'
        }, res => {
          if (res.ok) {
            this.orgId = ''
            let zNodes = []
            for (let i = 0; i < res.data.length; i++) {
              let zObj = {}
              zObj.id = res.data[i].id
              zObj.pId = res.data[i].pId
              zObj.name = res.data[i].orgName
              zObj.shotName = res.data[i].shotName
              zObj.orgType = res.data[i].orgType
              zObj.remarks = res.data[i].remarks
              zObj.parentIds = res.data[i].parentIds
              if (res.data[i].pId === null && this.orgId === '') {
                this.orgId = res.data[i].id
                zObj.open = false
                zNodes[i] = zObj
              } else {
                zNodes[i] = zObj
              }
              if (res.data[i].parentIds !== null) {}
            }
            zNodes.push({
              id: 'noDepartment',
              pId: null,
              name: '未分配人员',
              shotName: '',
              remarks: '',
              orgType: '',
              isParent: true
            })
            if (this.openNodes.length > 0) {
              this.openNodes.map((openNode) => {
                zNodes.map((node) => {
                  if (openNode.id === node.id) {
                    node.open = true
                  }
                })
              })
            }
            this.zNodes = zNodes
          }
          resolve()
        }, e => {
          reject(e)
        })
      })
    },
    /**
       * @description: 组织结构树弹窗确认
       * @author: chenxiaoxi
       * @date: 2018-09-21 09:17:04
       */
    treeOk () {
      this.$refs['treeForm'].validate((valid) => {
        if (valid) {
          this.$http[this.view.treeFlag === 1 ? 'postData' : 'putData']('sys/org', this.treeForm, {
            _this: this,
            loading: 'treeModalLoading'
          }, res => {
            if (res.ok) {
              this.getTree().then(() => {
                setTimeout(() => {
                  this.findByOrg(res.data === '' ? this.orgNew : res.data.id)
                  this.unassigned = false
                  this.orgNew = this.treeForm.id
                  this.$refs.mechanismManage.selectOneNode(res.data === '' ? this.orgNew : res.data.id)
                  this.treeFormReset()
                  this.view.treeFlag = 1
                  this.view.treeView = false
                })
              })
            }
          }, e => {})
        } else {
        }
      })
    },
    /**
       * @description: 组织结构树取消
       * @author: chenxiaoxi
       * @date: 2018-09-21 09:17:27
       */
    treeCancel () {
      this.treeFormReset()
      this.view.treeView = false
    },
    /**
       * @description: 组织结构表单重置
       * @author: chenxiaoxi
       * @date: 2018-09-21 09:17:36
       */
    treeFormReset () {
      this.$refs['treeForm'].resetFields()
    },
    /**
       * @description: 根据组织机构id查看员工列表
       * @author: chenxiaoxi
       * @date: 2018-09-25 15:59:40
       */
    // 搜索
    findByOrgBtn () {
      this.page = 1
      // if (this.mechanismSearch.disableFlag === '0') {
      //   this.mechanismSearch.disableFlag = 0
      // }
      if (!this.unassigned) {
        this.findByOrg()
      } else {
        this.findUnassigned()
      }
      // this.$refs.selection.selectAll(false)
    },
    findByOrg (id) {
      this.selectionList = []
      this.deptEmpData = []
      this.total = 0
      this.$http.get('sys/user/findByOrg', {
        orgId: id || this.orgId,
        page: this.page,
        pageSize: this.$store.getters.userInfo.configContent,
        uname: this.mechanismSearch.uname,
        roleId: this.mechanismSearch.roleId,
        disableFlag: this.mechanismSearch.disableFlag
      }, {
        _this: this,
        loading: 'loading'
      }, res => {
        this.deptEmpData = res.data.list
        this.total = res.data.count
      }, e => {})
    },
    /**
       * @description:搜索框重置
       * @author: zhaochunfeng
       * @date: 2018/10/31 10:44:10
       */
    resetSearch () {
      this.mechanismSearch.uname = ''
      this.mechanismSearch.roleId = ''
      this.mechanismSearch.disableFlag = ''
      if (!this.unassigned) {
        this.findByOrg()
      } else {
        this.findUnassigned()
      }
    },
    /**
       * @description: 页码改变
       * @author: chenxiaoxi
       * @date: 2018-09-29 14:24:51
       */
    pageChange (page) {
      this.page = page
      if (!this.unassigned) {
        this.findByOrg()
      } else {
        this.findUnassigned()
      }
      this.$refs.selection.selectAll(false)
    },
    /**
       * @description: 每页条数改变
       * @author: chenxiaoxi
       * @date: 2018-09-29 14:25:57
       */
    pageSizeChange (rows) {
      if (!this.unassigned) {
        this.findByOrg()
      } else {
        this.findUnassigned()
      }
    },
    /**
       * @description: 删除用户与组织机构的关联
       * @author: chenxiaoxi
       * @date: 2018-09-29 14:39:42
       */
    delUser (index, row) {
      if (this.orgId === '') {
        this.$message.warning('用户未关联组织机构')
      } else if (this.orgId === 'noDepartment') {
        this.$message.warning('未分配人员不可删除用户与组织机构的关系')
      } else {
        const h = this.$createElement
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '您确认要删除 '),
            h('i', { style: 'color: #E4393C' }, row.uname),
            h('span', null, '的组织关系吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('sys/org/deleteList/' + row.usid, {}, {
            _this: this
          }, res => {
            if (res.ok) {
              if (!this.unassigned) {
                this.findByOrg()
              } else {
                this.findUnassigned()
              }
            }
          })
        }).catch(() => {
        })
      }
    },
    /**
       * @description: 批量删除用户关联
       * @author: chenxiaoxi
       * @date: 2018-09-29 17:14:23
       */
    delUserList () {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选选择您要删除组织的用户')
      } else {
        this.$confirm('您确认要删除选中用户的组织关系吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = this.selectionList.join(',')
          this.$http.delete('sys/org/deleteList/' + ids, {}, {
            _this: this
          }, res => {
            if (res.ok) {
              if (!this.unassigned) {
                this.findByOrg()
              } else {
                this.findUnassigned()
              }
            }
          })
        }).catch(() => {
          this.$refs.selection.clearSelection()
          this.selectionList = []
        })
      }
    },
    // 选项发生改变回调
    handleSelect (selection) {
      let selectionList = []
      for (let i = 0; i < selection.length; i++) {
        selectionList.push(selection[i].usid)
      }
      this.selectionList = selectionList
    },

    /**
       * @description: 获取角色列表
       * @author: chenxiaoxi
       * @date: 2018/10/16 15:43:04
       */
    queryRoleList () {
      this.$http.get('sys/role', {
        pageNo: 1,
        pageSize: 999
      }, {
        _this: this
      }, res => {
        let roleList = res.data.map(function (item, key, ary) {
          let role = {}
          role.label = item.name
          role.value = item.id
          return role
        })
        this.roleList = roleList
      }, e => {})
    },

    /**
       * @description: 保存展开的节点
       * @author: chenxiaoxi
       * @date: 2018/11/09 16:29:18
       */
    setOpenNodes () {
      let treeObj = $.fn.zTree.getZTreeObj('treeDemo')
      let node = treeObj.getNodes()
      let nodes = treeObj.transformToArray(node)
      let openNodes = nodes.filter((item, index) => {
        return item.open === true
      })
      this.openNodes = openNodes
    },
    /**
       * @description: 角色配置
       * @author: chenxiaoxi
       * @date: 2018/11/11 11:27:23
       */
    setRole () {
      if (this.selectionList.length === 0) {
        this.$message.warning('请至少选择一个用户进行配置')
      } else {
        this.visibleSetRole = true
      }
    },
    // 同步SSO组织机构数据
    syncOrg () {
      this.$http.get('sys/org/syncOrgInfo', {}, {
        _this: this, loading: 'loading'
      }, res => {
        this.$message.success(res.message)
      })
    },
    getLastSyncTime () {
      this.$http.get('sys/otSyncInfo/getLastSync', {syncType: 'ORG'}, {
        _this: this, loading: 'loading'
      }, res => {
        if (res.data !== null || res.data !== undefined) {
          let sync = res.data
          this.syncInfo = sync.syncTime
        }
      }, e => {})
    },
    /**
       * @description: 查找未分配人员
       * @author: chenxiaoxi
       * @date: 2018/11/11 13:50:20
       */
    findUnassigned () {
      this.selectionList = []
      this.deptEmpData = []
      this.total = 0
      this.$http.get('sys/user/findBySetOrg', {
        page: this.page,
        pageSize: this.$store.getters.userInfo.configContent,
        uname: this.mechanismSearch.uname,
        roleId: this.mechanismSearch.roleId,
        disableFlag: this.mechanismSearch.disableFlag
      }, {
        _this: this,
        loading: 'loading'
      }, res => {
        this.deptEmpData = res.data.list
        this.total = res.data.count
      }, e => {})
    },
    // 关闭模态
    closeModal () {
      this.visibleSetRole = false
      this.$refs['roleForm'].resetFields()
    },
    // 保存模态
    saveModal () {
      let configUser = {
        usid: this.selectionList.join(','),
        // roleId: this.roleForm.roleId,
        orgId: this.orgId,
        roleIdList: this.roleForm.roleIdList
      }
      this.$http.postData('sys/user/saveUserRole', configUser, {
        _this: this,
        loading: 'roleSaveLoading'
      }, res => {
        if (res.ok) {
          this.visibleSetRole = false
          this.findByOrg()
        }
      }, e => {})
    },

    /**
       * @description: 树节点点击
       * @author: chenxiaoxi
       * @date: 2018-09-25 16:13:25
       */
    handleClick (treeId, treeNode) {
      this.orgId = treeNode.id
      if (this.orgId !== 'noDepartment') {
        this.findByOrg()
        this.unassigned = false
        this.orgFlag = ''
      } else {
        this.findUnassigned()
        this.unassigned = true
        this.orgFlag = 1
      }
    },

    /**
       * @description: 树节点添加
       * @author: chenxiaoxi
       * @date: 2018/12/26 15:39:22
       */
    handleAdd (treeId, treeNode) {
      this.view.treeView = true
      this.view.treeFlag = 1
      this.treeForm.pId = treeNode.id
      this.treeForm.pNodeName = treeNode.oldname || treeNode.name
      this.treeForm.orgName = treeNode.orgName
      this.treeForm.parentIds = treeNode.parentIds
    },

    /**
       * @description: 树节点删除
       * @author: chenxiaoxi
       * @date: 2018-09-25 14:05:25
       */
    handleBeforeRemove (treeId, treeNode) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '您确认要删除机构 '),
          h('i', { style: 'color: #E4393C' }, treeNode.name),
          h('span', null, '吗？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('sys/org', {
          id: treeNode.id
        }, {
          _this: this,
          loading: 'treeLoading'
        }, res => {
          this.getTree().then(() => {
            setTimeout(() => {
              this.findByOrg(this.orgObject.pId)
              this.$refs.mechanismManage.selectOneNode(this.orgObject.pId)
            })
          })
        })
      }).catch(() => {
      })
    },

    /**
       * @description: 节点编辑
       * @author: chenxiaoxi
       * @date: 2018/12/26 15:29:46
       */
    handleEdit (treeId, treeNode) {
      this.view.treeView = true
      this.view.treeFlag = 2
      let pNode = this.$refs.mechanismManage.getParentNode(treeNode)
      this.treeForm.pNodeName = pNode.oldname || pNode.name
      this.treeForm.pId = treeNode.pId
      this.treeForm.orgName = treeNode.oldname || treeNode.name
      this.treeForm.shotName = treeNode.shotName
      this.treeForm.orgType = treeNode.orgType
      this.treeForm.remarks = treeNode.remarks
      this.treeForm.id = treeNode.id
    }
  },
  props: {
    sideClose: {
      type: Boolean
    }
  },
  computed: {
    treeTitle () {
      return this.view.treeFlag === 1 ? '组织机构节点新增' : '组织机构节点维护'
    },
    treeLoadingTips () {
      return this.view.treeLoadingFlag === 1 ? '组织机构获取中...' : '节点保存中...'
    },
    // 没有数据的提示
    hasNoDataTips () {
      return this.deptEmpData.length === 0 && this.treeReady ? '该组织下暂无人员' : '未获取到组织机构'
    }
  },
  watch: {
    orgFlag: {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal === 1) {
          let roleCopyList = []
          for (let i = 0; i < this.roleList.length; i++) {
            if (this.roleList[i].value !== 'GQSBB2N3KURYYC6AUFER' && this.roleList[i].value !== 'YK5P33FZ29TPN2VPDP6E') {
              roleCopyList.push(this.roleList[i])
            }
          }
          this.roleList = roleCopyList
        } else {
          this.queryRoleList()
        }
      }
    }
  },
  mounted () {
    let _this = this
    // this.findByOrgBtn()
    this.queryRoleList()
    this.$nextTick(() => {
      let tableHeight = $('.content').css('height')
      let height = parseInt(tableHeight.substring(0, tableHeight.indexOf('p'))) - 170
      this.tableHeight = height
      window.onresize = function () {
        let tableHeight = $('.content').css('height')
        let height = parseInt(tableHeight.substring(0, tableHeight.indexOf('p'))) - 170
        _this.tableHeight = height
      }
    })
    // 获取组织结构树
    this.getTree()
    this.getLastSyncTime()
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/mixins';
  #mechanism-manage{
    .flex();
    height: 100%;
    .mechanism-manage-left{
      width: 240px;
      height: 100%;
      border-right: 1px solid #DDD;
      position: relative;
      overflow-x: auto;
      padding: 5px;
      .node_name{
        display: inline-block;
        max-width: 200px;
        .ellipsis();
      }
    }
    .mechanism-manage-right{
      width: calc(~'100% - 240px');
      display: inline-block;
      height: 100%;
      padding: 10px;
      position: relative;
      .content{
        width: 100%;
        height: calc(~'100% - 150px');
        .hasNoData{
          background: #FFF;
          width: 100%;
          height: 100%;
          .no-data-icon{
            width: 150px;
          }
        }
      }
    }
    .hasNoData{
      background: #FFF;
      .no-data-icon{
        width: 85px;
      }
    }
  }
</style>
