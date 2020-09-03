<!-- 流程组织机构树 -->
<template>
  <div class="dept-tree">
    <laws-tree
      ref="deptTree"
      :treeDivId="treeDivId"
      :zNodes="zNodes"
      :expandAll="expandAll"
      :editable="editable"
      :deptSelect="deptSelect"
      :pIdCheck="pIdCheck"
      :loading="loading.treeLoading"
      @treeClick="(treeId, treeNode) => treeClick(treeId, treeNode)"
      @treeOnExpand="(treeId, treeNode) => treeOnExpand(treeId, treeNode)"
      @treeDblClick="(treeId, treeNode) => treeDblClick(treeId, treeNode)"
      @treeReady="treeReady"
    ></laws-tree>
  </div>
</template>

<script>
export default {
  name: 'deptTree',
  data () {
    return {
      dept: [], // 部门节点
      deptUser: [], // 部门人员节点
      projectManagerzNodes: [],
      loading: {
        treeLoading: false
      }
    }
  },
  methods: {
    // 节点点击
    treeClick (treeId, treeNode) {
      this.$emit('treeClick', treeId, treeNode)
    },
    // 节点双击
    treeDblClick (treeId, treeNode) {
      this.$emit('treeDblClick', treeId, treeNode)
    },
    // 节点展开
    treeOnExpand (treeId, treeNode) {
      // this.projectManagerClick(treeNode.id, this.projectManagerzNodes)
      // this.$emit('treeOnExpand', treeId, treeNode)
    },
    // 首次加载完成
    treeReady () {
      this.$emit('treeReady')
    },
    // 节点重新加载
    treeReload () {
      this.$refs.deptTree.lawsTreeInit()
    },
    /**
     * @description: 获取组织到部门
     * @author: chenxiaoxi
     * @date: 2018/10/11 16:29:37
     */
    getDept () {
      this.loading.treeLoading = true
      return new Promise((resolve, reject) => {
        let url = this.allDept ? 'sys/org/getTree' : 'sys/org/getIdsByorgType'
        this.$http.get(url, {}, {
          _this: this
        }, res => {
          if (res.ok) {
            let zNodesDept = []
            res.data.map((item, i) => {
              let zObj = {}
              // 该节点为机构
              zObj.name = item.orgName
              zObj.icon = 'static/images/dept.png'
              // zObj.isParent = true
              zObj.shotName = item.shotName
              zObj.remarks = item.remarks
              zObj.id = item.id
              zObj.pId = item.pId
              zNodesDept[i] = zObj
            })
            this.dept = zNodesDept
            resolve(res.data)
          }
        }, e => {
          reject(e)
        })
      })
    },
    /**
     * @description: 获取所有人员
     * @author: chenxiaoxi
     * @date: 2018/10/11 16:57:33
     */
    getUser (treeNodeList) {
      return new Promise((resolve, reject) => {
        this.$http.get('sys/user', {
          pageNo: 1,
          processFlag: '1'
        }, {
          _this: this
        }, res => {
          if (res.ok) {
            for (let i = 0; i < res.data.list.length; i++) {
              let obj = {}
              for (let key in res.data.list[i]) {
                if (key === 'usid') {
                  obj.id = res.data.list[i][key]
                } else if (key === 'orgId') {
                  obj.pId = res.data.list[i][key]
                } else {
                  obj[key] = res.data.list[i][key]
                }
              }
              treeNodeList.push(obj)
            }
            // 获取组织与人员完毕，开始组装树结构
            let zNodes = []
            for (let i = 0; i < treeNodeList.length; i++) {
              let zObj = {}
              zObj.id = treeNodeList[i].id
              zObj.pId = treeNodeList[i].pId
              // 该节点为人员
              if (treeNodeList[i].uname !== undefined) {
                zObj.name = treeNodeList[i].uname
                zObj.icon = 'static/images/user.png'
                zObj.isParent = false
                zObj.orgName = treeNodeList[i].orgName
              } else {
                // 该节点为机构
                zObj.name = treeNodeList[i].orgName
                zObj.icon = 'static/images/dept.png'
                zObj.isParent = true
              }
              zObj.shotName = treeNodeList[i].shotName
              zObj.remarks = treeNodeList[i].remarks
              if (zObj.pId === null && !zObj.isParent) {
                zObj.pId = ''
                zObj.orgName = '未分配人员'
              }
              zNodes[i] = zObj
            }
            zNodes.push({
              id: '',
              pId: null,
              name: '未分配人员',
              isParent: true,
              icon: 'static/images/dept.png'
            })
            this.deptUser = zNodes
            this.loading.treeLoading = false
          }
          resolve()
        }, e => {
          reject(e)
        })
      })
    },

    /**
     * @description: 选中节点移除
     * @author: chenxiaoxi
     * @date: 2018/10/29 14:42:02
     */
    removeNode (treeNode) {
      this.$refs.deptTree.removeNode(treeNode)
    },

    /**
     * @description: 节点添加
     * @author: chenxiaoxi
     * @date: 2018/10/29 14:53:24
     */
    addNode (treeNode) {
      this.$refs.deptTree.addNode(treeNode)
    },

    /**
     * @description: 节点取消选中
     * @author: chenxiaoxi
     * @date: 2018/10/29 16:09:11
     */
    cancelSelectedNode (treeNode) {
      if (treeNode !== '' && treeNode !== undefined) {
        this.$refs.deptTree.cancelSelectedNode(treeNode)
      } else {
        this.$refs.deptTree.cancelSelectedNode()
      }
    },

    /**
     * @description: 节点选中
     * @author: chenxiaoxi
     * @date: 2018/10/29 16:14:23
     */
    selectNode (treeNode) {
      if (treeNode !== '' && treeNode !== undefined) {
        this.$refs.deptTree.selectNode(treeNode)
      }
    },

    /**
     * @description: 获取选中节点
     * @author: chenxiaoxi
     * @date: 2018/10/29 16:14:23
     */
    getSelectNode (idList) {
      return this.$refs.deptTree.getSelectNode(idList)
    },

    /**
     * @description: 保存打开的节点
     * @author: chenxiaoxi
     * @date: 2018/11/23 16:37:01
     */
    setOpenNodes () {
      this.$refs.deptTree.setOpenNodes()
    },

    /**
     * @description: 清空过滤输入框
     * @author: chenxiaoxi
     * @date: 2018/11/23 16:52:10
     */
    clearSearch () {
      this.$refs.deptTree.clearSearch()
    },
    /**
     * @author liruohao
     * @date 2019/4/24
     * @Description: 获取选中的部门下子子部门
     */
    getDeptChild (list) {
      this.$http.get('sys/org/getChildDept', {
        orgId: list[0]
      }, {
        _this: this
      }, res => {
        if (res.ok) {
          // 获取组织与人员完毕，开始组装树结构
          let zNodes = []
          let treeNodeList = res.data
          for (let i = 0; i < treeNodeList.length; i++) {
            let zObj = {}
            zObj.id = treeNodeList[i].id
            zObj.pId = treeNodeList[i].pId
            // 该节点为机构
            zObj.name = treeNodeList[i].orgName
            zObj.icon = 'static/images/dept.png'
            zObj.isParent = true
            zObj.shotName = treeNodeList[i].shotName
            zObj.remarks = treeNodeList[i].remarks
            zNodes[i] = zObj
          }
          this.projectManagerClick(list[0], zNodes)
        }
      }, e => {
      })
    },
    /**
     * @author liruohao
     * @date 2019/4/23
     * @Description: 根据部门查询项目经理 责任工程师
     */
    projectManagerClick (id, treeNodeList) {
      this.$http.get('sys/org/getTreeByRoleAndOrgId1', {
        roleName: this.department[1],
        orgId: id,
        processFlag: '1'
      }, {
        _this: this
      }, res => {
        if (res.ok) {
          if (res.data.list.length !== 0) {
            for (let i = 0; i < res.data.list.length; i++) {
              let obj = {}
              for (let key in res.data.list[i]) {
                if (key === 'usId') {
                  obj.id = res.data.list[i][key]
                } else if (key === 'userName') {
                  obj.name = res.data.list[i][key]
                } else {
                  obj.icon = 'static/images/user.png'
                  obj.isParent = false
                  obj[key] = res.data.list[i][key]
                }
              }
              treeNodeList.push(obj)
            }
            this.projectManagerzNodes = treeNodeList
          }
        }
      }, e => {
      })
    }
  },
  components: {},
  props: {
    // 是否显示组织下的用户
    showUser: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 部门节点
    zNodesDept: {
      type: Array
    },
    // 部门人员节点
    zNodesDeptUser: {
      type: Array
    },
    // 是否可进行操作
    editable: {
      type: Boolean,
      default: true
    },
    // 部门是否可以被选择
    deptSelect: {
      type: Boolean,
      default: false
    },
    // 树实例Id
    treeDivId: {
      type: String
    },
    // 是否获取所有组织
    allDept: {
      type: Boolean,
      default: false
    },
    // 是否根据责任部门查找经理
    department: {
      type: Array
    },
    // 需要回显的节点
    idList: {
      type: Array,
      required: this.showUser
    },
    // 回显的部门节点
    deptList: {
      type: Array
    },
    // 是否展开全部
    expandAll: {
      type: Boolean,
      default: false
    },
    // 不选中根节点
    pIdCheck: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 节点(给lawsTree传的节点,根据展示的类型传不同的值)
    zNodes () {
      return this.showUser ? (this.zNodesDeptUser || this.deptUser) : (this.projectManagerzNodes.length === 0 ? (this.zNodesDept || this.dept) : this.projectManagerzNodes)
    }
  },
  watch: {
    zNodes (val) {
      this.$nextTick(() => {
        if (this.idList && this.idList.length) {
          let deptUser = this.$refs.deptTree.getSelectNode(this.idList)
          this.$emit('selectNodeUser', deptUser)
        }
      })
    },
    deptList (val) {
      if (val.length) {
        let zNodes = this.showUser ? (this.zNodesDeptUser || this.deptUser) : (this.zNodesDept || this.dept)
        for (let i = 0; i < zNodes.length; i++) {
          val.map((displayNode) => {
            if (zNodes[i].id === displayNode.id) {
              zNodes.splice(i, 1)
            }
          })
        }
      }
    }
  },
  mounted () {
    if (this.department) {
      this.getDeptChild(this.department)
    } else {
      this.getDept().then(res => {
        this.getUser(res)
      }, e => {})
    }
  }
}
</script>

<style lang="less">
  .dept-tree{
    height: 100%;
  }
</style>
