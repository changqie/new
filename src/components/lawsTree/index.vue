<!-- 通用树形组件 -->
<template>
  <div class="laws-tree" :class="{ 'disabledItem': disabled }">
    <div class="content_wrap">
      <div class="input-wrapper">
        <input type="text" :id="searchId" value=""  placeholder="节点快速查找" class="empty" v-if="filterNode" />
      </div>
      <div class="left">
        <div v-if="!hasNode || !zNodes.length" class="has-no-node">暂无匹配数据</div>
        <ul :id="treeDivId" class="ztree"></ul>
      </div>
    </div>
    <div id="rMenu">
      <!-- 需要权限 -->
      <ul v-if="addId !== ''">
        <li class="m_add" @click="rightAdd" v-btn-permission="addId">{{ addTitle }}</li>
        <li class="m_edit" @click="rightEdit" v-btn-permission="editId" v-show="!isRoot">{{ editTitle }}</li>
        <li class="m_del" @click="rightRemove" v-btn-permission="removeId" v-show="!isRoot">{{ removeTitle }}</li>
        <li class="m_copy" @click="rightCopy"  v-show="!isRoot && copyShow">{{ copyTitle }}</li>
      </ul>
      <!-- 不需要权限 -->
      <ul v-else>
        <li class="m_add" @click="rightAdd">{{ addTitle }}</li>
        <li class="m_edit" @click="rightEdit" v-show="!isRoot || root">{{ editTitle }}</li>
        <li class="m_del" @click="rightRemove" v-show="!isRoot || root">{{ removeTitle }}</li>
        <li class="m_copy" @click="rightCopy"  v-show="!isRoot|| root">{{ copyTitle }}</li>
      </ul>
    </div>
    <loading :loading="showLoading">{{ loadingTips }}</loading>
  </div>
</template>

<!--
  treeReady: 树结构加载完成, 返回值: 无
  treeEdit: 节点编辑, 返回值: treeId, treeNode
  treeOnExpand: 节点展开, 返回值: treeId, treeNode
  treeClick: 节点点击, 返回值: treeId, treeNode
  treeRemove: 节点移除, 返回值: treeId, treeNode
  treeAdd: 节点新增, 返回值: treeId, treeNode
-->

<script>
import 'zTree/js/jquery.ztree.core.js'
import 'zTree/js/jquery.ztree.excheck.js'
import 'zTree/js/jquery.ztree.exedit.js'
import 'zTree/js/jquery.ztree.exhide.js'
export default {
  name: 'lawsTree',
  data () {
    return {
      treeId: '', // 当前操作树组件的id
      treeNode: '', // 当前操作的节点
      zTreeObj: '', // 树实例对象
      openNodes: [], // 已经打开的节点
      currentNode: '', // 当前操作节点
      isRoot: false, // 该节点为根节点
      copyShow: false, // 是否显示复制按钮
      nodeName: '', // 节点快速查找
      zNodeBeforeSearch: [], // 搜索前的节点
      searchResult: [], // 快速查找结果
      originalNode: [], // 原始节点
      hasNode: true, // 暂无数据的提示
      keyWordsReset: false, // IE搜索框重置
      leftCheckedNode: '', // 要添加的节点(右移操作)
      treeLoading: false // loading
    }
  },
  methods: {
    /**
     * @description: 树结构渲染
     * @author: chenxiaoxi
     * @date: 2018/10/22 16:44:38
     */
    lawsTreeInit () {
      return new Promise((resolve, reject) => {
        if (!this.loading) {
          this.treeLoading = true
        }
        // 设置title
        this.zNodes.map((node) => {
          node.title = node.oldname || node.name
        })
        if (this.searchResult.length) {
          this.searchNodeLazy($('#' + this.searchId).val())
        } else {
          this.$nextTick(() => {
            let zNodes = JSON.parse(JSON.stringify(this.zNodes))
            if (this.openNodes.length > 0) {
              // 匹配设置打开的节点
              this.openNodes.map((openNode) => {
                zNodes.map((node) => {
                  if (openNode.id === node.id) {
                    node.open = true
                  }
                })
              })
            }
            $.fn.zTree.init($('#' + this.treeDivId), this.setting, zNodes)
            this.treeLoading = false
            this.MoveTest.updateType()
            if (this.filterNode) {
              this.fuzzySearch(this.treeDivId, '#' + this.searchId, null, true)
            }
            // 绑定拖拽元素
            if (this.drag) {
              this.MoveTest.bindDom()
            }
          })
        }
        resolve()
      })
    },

    /**
     * @description: 右键新增
     * @author: chenxiaoxi
     * @date: 2018/10/23 10:18:57
     */
    rightAdd () {
      $('#rMenu').css({'visibility': 'hidden'})
      this.setOpenNodes()
      this.$emit('treeAdd', this.treeId, this.treeNode)
    },

    /**
     * @description: 右键编辑
     * @author: chenxiaoxi
     * @date: 2018/10/23 10:19:14
     */
    rightEdit () {
      $('#rMenu').css({'visibility': 'hidden'})
      this.setOpenNodes()
      this.$emit('treeEdit', this.treeId, this.treeNode)
    },

    /**
     * @description: 右键删除
     * @author: chenxiaoxi
     * @date: 2018/10/23 10:19:24
     */
    rightRemove () {
      $('#rMenu').css({'visibility': 'hidden'})
      this.setOpenNodes()
      this.$emit('treeRemove', this.treeId, this.treeNode)
    },

    /**
     * @description: 右键复制
     * @author: gaoyan
     * @date: 2020/2/6 10:19:24
     */
    rightCopy () {
      $('#rMenu').css({'visibility': 'hidden'})
      this.setOpenNodes()
      this.$emit('treeCopy', this.treeId, this.treeNode)
    },

    /**
     * @description: 节点移除
     * @author: chenxiaoxi
     * @date: 2018/10/29 14:47:49
     */
    removeNode (treeNode) {
      let index = ''
      this.zNodes.map((item, i) => {
        if (treeNode.id === item.id) {
          index = i
        }
      })
      if (index !== '') {
        this.zNodes.splice(index, 1)
      }
    },

    /**
     * @description: 节点添加
     * @author: chenxiaoxi
     * @date: 2018/10/29 14:53:01
     */
    addNode (treeNode) {
      this.zNodes.push(treeNode)
    },

    /**
     * @description: 节点取消选中
     * @author: chenxiaoxi
     * @date: 2018/10/29 16:09:11
     */
    cancelSelectedNode (treeNode) {
      let zTree = $.fn.zTree.getZTreeObj(this.treeDivId)
      if (treeNode !== '' && treeNode !== undefined) {
        zTree.cancelSelectedNode(treeNode)
      } else {
        zTree.cancelSelectedNode()
      }
    },

    /**
     * @description: 节点选中
     * @author: chenxiaoxi
     * @date: 2018/10/29 16:14:23
     */
    selectNode (treeNode) {
      this.$nextTick(() => {
        if (treeNode !== '' && treeNode !== undefined) {
          this.lawsTreeInit()
        }
      })
    },

    /**
     * @description: 获取所选节点
     * @author: chenxiaoxi
     * @date: 2018/10/29 16:14:23
     */
    getSelectNode (idList) {
      let selectNode = []
      idList.map((id, index) => {
        this.zNodes.map((zNodesItem) => {
          if (zNodesItem.id === id) {
            selectNode.push(zNodesItem)
          }
        })
      })
      return selectNode
    },

    /**
     * @description: 获取被勾选的节点集合
     * @author: chenxiaoxi
     * @date: 2018/11/08 19:47:10
     */
    getCheckNodes () {
      let treeObj = $.fn.zTree.getZTreeObj(this.treeDivId)
      let checkNodes = treeObj.getCheckedNodes(true)
      return checkNodes
    },

    /**
     * @description: 获取所有节点
     * @author: chenxiaoxi
     * @date: 2018/11/08 19:47:10
     */
    transformToArray () {
      let treeObj = $.fn.zTree.getZTreeObj(this.treeDivId)
      let treeNodes = treeObj.transformToArray(treeObj.getNodes())
      return treeNodes
    },

    /**
     * @description: 保存展开的节点
     * @author: chenxiaoxi
     * @date: 2018/11/09 16:29:18
     */
    setOpenNodes () {
      let treeObj = $.fn.zTree.getZTreeObj(this.treeDivId)
      let node = treeObj.getNodes()
      let nodes = treeObj.transformToArray(node)
      let openNodes = nodes.filter((item, index) => {
        return item.open === true
      })
      this.openNodes = openNodes
    },

    /**
     * @description: 获取下一个节点
     * @author: chenxiaoxi
     * @date: 2018/11/10 10:51:48
     */
    getNextNode () {
      let treeObj = $.fn.zTree.getZTreeObj(this.treeDivId)
      let sNodes = treeObj.getSelectedNodes()
      if (sNodes.length > 0) {
        return sNodes[0].getNextNode()
      } else {
        return ''
      }
    },

    /**
     * @description: 选取根节点
     * @author: chenxiaoxi
     * @date: 2018/11/10 12:10:31
     */
    selectRootNode () {
      let treeObj = $.fn.zTree.getZTreeObj(this.treeDivId)
      let nodes = treeObj.getNodes()
      if (nodes.length > 0) {
        treeObj.selectNode(nodes[0])
      }
    },

    /**
     * @description: 节点快速查找
     * @author: chenxiaoxi
     * @date: 2018/11/23 14:44:38
     */
    /* eslint-disable */
    fuzzySearch (zTreeId, searchField, isHighLight, isExpand) {
      const _this = this
      var zTreeObj = $.fn.zTree.getZTreeObj(zTreeId)
      var nameKey = zTreeObj.setting.data.key.name
      isHighLight = isHighLight !== false
      isExpand = !!isExpand
      zTreeObj.setting.view.nameIsHTML = isHighLight

      var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'
      var rexMeta = new RegExp(metaChar, 'gi')

      // keywords filter function
      function ztreeFilter (zTreeObj, _keywords, callBackFunc) {
        if (!_keywords) {
          _keywords = ''
        }
        // 节点过滤时,打开没有数据的提示
        _this.hasNode = false
        function filterFunc (node) {
          if (node && node.oldname && node.oldname.length > 0) {
            node[nameKey] = node.oldname
          }
          zTreeObj.updateNode(node)
          if (_keywords.length === 0) {
            zTreeObj.expandNode(node, false)
            return true
          }
          // transform node name and keywords to lowercase
          // 当前节点与已选中的节点做对比
          function isSplitNode (node) {
            if (!_this.spliceNode) {
              return true
            } else {
              // 默认可以展示,如果找到了,就不展示
              let flag = true
              _this.spliceNode.map((spNode) => {
                if (spNode.id === node.id) {
                  flag = false
                }
              })
              return flag
            }
          }
          if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) !== -1 && isSplitNode(node)) {
            if (isHighLight) {
              var newKeywords = _keywords.replace(rexMeta, function (matchStr) {
                return '\\' + matchStr
              })
              node.oldname = node[nameKey]
              var rexGlobal = new RegExp(newKeywords, 'gi')
              node[nameKey] = node.oldname.replace(rexGlobal, function (originalText) {
                var highLightText =
                  '<span style="color: whitesmoke;background-color: darkred;">' +
                  originalText +
                  '</span>'
                return 	highLightText
              })
              zTreeObj.updateNode(node)
              let showNode = zTreeObj.transformToArray(node)
              showNode.map((node) => {
                zTreeObj.showNode(node)
              })
            }
            zTreeObj.showNode(node)
            // 有数据则关闭
            _this.hasNode = true
            return true
          }
          // 判断父节点是否匹配
          let parentNode = node.getParentNode()
          if (parentNode === null || (parentNode[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) === -1 && isSplitNode(parentNode))) {
            zTreeObj.hideNode(node)
          }
          return false
        }

        var nodesShow = zTreeObj.getNodesByFilter(filterFunc)
        processShowNodes(nodesShow, _keywords)
      }
      // 展示前处理
      function processShowNodes (nodesShow, _keywords) {
        if (nodesShow && nodesShow.length > 0) {
          if (_keywords.length > 0) {
            _this.searchResult = nodesShow
            $.each(nodesShow, function (n, obj) {
              var pathOfOne = obj.getPath()
              if (pathOfOne && pathOfOne.length > 0) {
                for (var i = 0; i < pathOfOne.length - 1; i++) {
                  zTreeObj.showNode(pathOfOne[i])
                  zTreeObj.expandNode(pathOfOne[i], true)
                }
              }
            })
          } else {
            _this.searchResult = []
            // 加载所有节点前关闭暂无数据的提示
            _this.hasNode = true
            // 重新加载所有的节点
            let zNodes = JSON.parse(JSON.stringify(_this.zNodes))
            $.fn.zTree.init($('#' + _this.treeDivId), _this.setting, zNodes)
            _this.MoveTest.updateType()
          }
        }
      }
      // listen to change in input element
      $(searchField).bind('input propertychange', function(e) {
        if ($(this).val() !== '') {
          var _keywords = $(this).val();
          searchNodeLazy(_keywords); //call lazy load
          _this.keyWordsReset = true
        } else {
          if (_this.keyWordsReset){
            searchNodeLazy('') //call lazy load
            _this.keyWordsReset = false
          }
        }
      });

      var timeoutId = null
      // excute lazy load once after input change, the last pending task will be cancled
      function searchNodeLazy (_keywords) {
        if (timeoutId) {
          // clear pending task
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(function () {
          ztreeFilter(zTreeObj, _keywords) // lazy load ztreeFilter function
          $(searchField).focus()// focus input field again after filtering
        }, 50)
      }
      _this.searchNodeLazy = function (_keywords) {
        return searchNodeLazy(_keywords)
      }
    },
    // 过滤输入框清空
    clearSearch () {
      $('#' + this.searchId).val('').trigger('propertychange')
    },

    /**
     * @description: 获取当前节点的父级节点
     * @author: chenxiaoxi
     * @date: 2018/12/26 17:30:21
     */
    getParentNode (treeNode) {
      return treeNode.getParentNode()
    },

    /**
     * @description: 是否可新增(权限Id控制)
     * @author: chenxiaoxi
     * @date: 2019/01/25 12:31:41
     */
    hasAddPermission () {
      if (this.addId) {
        let menuList = this.$store.getters.getMenuList
        let flag = false
        menuList.map((item) => {
          if (item.id === this.addId) {
            flag = true
          }
        })
        return flag
      } else {
        return true
      }
    },
    /**
     * @author liruohao
     * @date 2019/6/3
     * @Description: 根据指定id 选取节点
     */
    selectOneNode (id) {
      let treeObj = $.fn.zTree.getZTreeObj(this.treeDivId)
      let node = treeObj.getNodeByParam('id', id)
      treeObj.selectNode(node)
    },
    /**
     * @description: 是否可编辑(权限Id控制)
     * @author: chenxiaoxi
     * @date: 2019/01/25 13:04:08
     */
    hasEditPermission () {
      if (this.editId) {
        let menuList = this.$store.getters.getMenuList
        let flag = false
        menuList.map((item) => {
          if (item.id === this.editId) {
            flag = true
          }
        })
        return flag
      } else {
        return true
      }
    },

    /**
     * @description: 是否可删除(权限Id控制)
     * @author: chenxiaoxi
     * @date: 2019/01/25 13:05:00
     */
    hasRemovePermission () {
      if (this.removeId) {
        let menuList = this.$store.getters.getMenuList
        let flag = false
        menuList.map((item) => {
          if (item.id === this.removeId) {
            flag = true
          }
        })
        return flag
      } else {
        return true
      }
    },
    // TDDO 2019年3月6日  暂时注释掉当前方法，测试反馈结果再决定是否放开，此处可以通过设置chkboxType控制
    // /**
    //  * @description: checkbox选中回调
    //  * @author: chenxiaoxi
    //  * @date: 2019/02/19 15:18:52
    //  */
    // handleOnCheck (e, treeId, treeNode) {
    //   // 递归查找当前节点的所有父级节点,直到找到了根节点,根节点向上查找返回null
    //   let _this = this
    //   let pNodeList = []
    //   function getPNode (node) {
    //     let pNode = _this.getParentNode(node)
    //     if (pNode !== null) {
    //       pNodeList.push(pNode)
    //       getPNode(pNode)
    //     }
    //   }
    //   getPNode(treeNode)
    //   // pNodeList就是所有的父级节点
    //   // 判断所有的父节点下的子节点是不是全部被选中,选中则这个父节点选中
    //   pNodeList.map((node) => {
    //     // 如果有一个节点没选中,父节点就不选中
    //     let flag = true
    //     node.children.map((chiNode) => {
    //       if (!chiNode.checked) {
    //         flag = false
    //       }
    //     })
    //     let zTree = $.fn.zTree.getZTreeObj(this.treeDivId)
    //     let zTreeNodes = zTree.transformToArray(zTree.getNodes())
    //     // 与zNodes渲染后的节点匹配,设置选中后更新节点
    //     zTreeNodes.map((zNode) => {
    //       if (zNode.id === node.id) {
    //         if (flag) {
    //           zNode.checked = true
    //           zTree.updateNode(zNode)
    //         } else {
    //           zNode.checked = false
    //           zTree.updateNode(zNode)
    //         }
    //       }
    //     })
    //   })
    // }
  },
  components: {},
  props: {
    // 新增按钮title
    addTitle: {
      type: String,
      default: '节点新增'
    },
    // 编辑按钮title
    editTitle: {
      type: String,
      default: '节点维护'
    },
    // 移除按钮title
    removeTitle: {
      type: String,
      default: '节点删除'
    },
    // 移除按钮title
    copyTitle: {
      type: String,
      default: '节点复制'
    },
    // 是否显示删除按钮
    showRemoveBtn: {
      type: Boolean,
      default: false
    },
    // 显示编辑按钮
    showEditBtn: {
      type: Boolean,
      default: false
    },
    // 显示复制按钮
    showCopyBtn: {
      type: Boolean,
      default: false
    },
    // 树加载中的提示
    loadingTips: {
      type: String,
      default: '节点加载中'
    },
    // 是否显示右键菜单
    showRMenu: {
      type: Boolean,
      default: false
    },
    // 树dom唯一标识
    treeDivId: {
      type: String,
      required: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否可进行操作
    editable: {
      type: Boolean,
      default: true
    },
    // 机构是否可被选择
    deptSelect: {
      type: Boolean,
      default: false
    },
    // 树结构加载完成
    treeReady: {
      type: Boolean,
      default: false
    },
    // 自动选择根节点
    autoSelect: {
      type: Boolean,
      default: false
    },
    // 是否启用checkbox
    checkEnable: {
      type: Boolean,
      default: false
    },
    chkboxType: {
      type: String,
      default: "{'Y': 'ps', 'N': 'ps'}"
    },
    // 新增权限id
    addId: {
      type: String,
      default: ''
    },
    // 编辑权限id
    editId: {
      type: String,
      default: '123'
    },
    // 删除权限id
    removeId: {
      type: String,
      default: ''
    },
    // 是否开启拖拽
    drag: {
      type: Boolean,
      default: false
    },
    // 拖拽绑定区域
    dragBind: {
      type: String,
      required: this.drag
    },
    // 拖拽节点dom
    dragDom: {
      type: String,
      required: this.drag
    },
    // 是否开启节点过滤
    filterNode: {
      type: Boolean,
      default: true
    },
    // 已经选了的节点
    spliceNode: {
      type: Array
    },
    // 流程左侧选中的节点
    zNodesAddNode: {
      type: [Object, String]
    },
    // 是否为超级权限(根节点可编辑)
    root: {
      type: Boolean,
      default: false
    },
    // 树结构
    zNodes: {
      type: Array,
      required: true
    },
    // 是否展开根节点但是不选中
    expandFirst: {
      type: Boolean,
      default: false
    },
    // 是否展开全部
    expandAll: {
      type: Boolean,
      default: false
    },
    // 不选中根节点
    pIdCheck : {
      type: Boolean,
      default: false
    },
    // loading
    loading: {
      type: Boolean
    },
    // 是否允许节点拖拽
    allowDrag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    searchId () {
      return this.treeDivId + 'key'
    },
    showLoading () {
      return this.loading !== undefined ? this.loading : this.treeLoading
    }
  },
  watch: {
    zNodes: {
      deep: true,
      handler (val, oldVal) {
        this.setOpenNodes()
        this.lawsTreeInit().then(() => {
          this.MoveTest.updateType()
          if (this.expandAll) {
            let zTree = $.fn.zTree.getZTreeObj(this.treeDivId)
            zTree.expandAll(true);
          }
        })
        this.$nextTick(() => {
          if (this.leftCheckedNode !== '') {
            this.treeNode = JSON.parse(JSON.stringify(this.leftCheckedNode))
          }
          if (this.expandFirst && this.treeNode === '' && !this.spliceNode) {
            let zTree = $.fn.zTree.getZTreeObj(this.treeDivId)
            // 选中根节点第一个节点
            let nodes = zTree.getNodes()
            if (nodes.length > 0) {
              zTree.expandNode(nodes[0], true, false, true);
            }
          }
          if (this.autoSelect && this.treeNode === '' && !this.spliceNode) {
            let zTree = $.fn.zTree.getZTreeObj(this.treeDivId)
            // 选中根节点第一个节点
            let nodes = zTree.getNodes()
            if (nodes.length > 0) {
              zTree.selectNode(nodes[0])
              zTree.expandNode(nodes[0], true, false, true);
            }
          } else {
            // 匹配zTree节点
            let zTree = $.fn.zTree.getZTreeObj(this.treeDivId)
            let zTreeNodes = zTree.transformToArray(zTree.getNodes())
            zTreeNodes.map((node) => {
              if (node.id === this.treeNode.id) {
                zTree.selectNode(node)
              }
            })
            if (!this.treeNode.isParent && this.treeNode !== '') {
              let copyNode = JSON.parse(JSON.stringify(val))
              copyNode.map((node) => {
                if (node.id === this.treeNode.pId) {
                  node.open = true
                  function setParentNode (node) {
                    for (let i = 0; i < copyNode.length; i++) {
                      if (copyNode[i].id === node.pId) {
                        copyNode[i].open = true
                        setParentNode(copyNode[i])
                      }
                    }
                  }
                  setParentNode(node)
                }
              })
              copyNode.map((cNode) => {
                this.openNodes.map((oNode) => {
                  if (cNode.id === oNode.id) {
                    cNode.open = true
                  }
                })
              })
              let openList = []
              copyNode.map((node) => {
                if (node.open) {
                  openList.push(node)
                }
              })
              this.leftCheckedNode = ''
              this.treeNode = ''
              $.fn.zTree.init($('#' + this.treeDivId), this.setting, copyNode)
              this.MoveTest.updateType()
              if (!this.spliceNode && this.autoSelect) {
                let zTree = $.fn.zTree.getZTreeObj(this.treeDivId)
                let nodes = zTree.getNodes()
                zTree.selectNode(nodes[0])
              }
            }
            // dom加载完成后取消选中的样式
            this.$nextTick(() => {
              $('#' + this.treeDivId + ' .curSelectedNode').removeClass('curSelectedNode')
            })
          }
        })
      }
    },
    zNodesAddNode (val) {
      this.leftCheckedNode = val
    }
  },
  mounted () {
    let _this = this
    this.lawsTreeInit()
    var MoveTest = {
      errorMsg: '放错了...请选择正确的类别！',
      curTarget: null,
      curTmpTarget: null,
      dragId: null,
      noSel: function () {
        try {
          window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
        } catch (e) {}
      },
      dragTree2Dom: function (treeId, treeNodes) {
        return !treeNodes
      },
      prevTree: function (treeId, treeNodes, targetNode) {
        return !targetNode.isParent && targetNode.parentTId === treeNodes[0].parentTId
      },
      nextTree: function (treeId, treeNodes, targetNode) {
        return !targetNode.isParent && targetNode.parentTId === treeNodes[0].parentTId
      },
      innerTree: function (treeId, treeNodes, targetNode) {
        return targetNode != null && targetNode.isParent && targetNode.tId === treeNodes[0].parentTId
      },
      dragMove: function (e, treeId, treeNodes) {
        let p = null
        let pId = 'dom_' + treeNodes[0].pId
        if (e.target.id === pId) {
          p = $(e.target)
        } else {
          p = $(e.target).parent('#' + pId)
          if (!p.get(0)) {
            p = null
          }
        }

        $('.domBtnDiv .active').removeClass('active')
        if (p) {
          p.addClass('active')
        }
      },
      dropTree2Dom: function (e, treeId, treeNodes, targetNode, moveType) {
        var domId = 'dom_' + treeNodes[0].getParentNode().id
        if (moveType === null && (domId === e.target.id || $(e.target).parents('#' + domId).length > 0)) {
          var zTree = $.fn.zTree.getZTreeObj('treeDemo')
          zTree.removeNode(treeNodes[0])

          var newDom = $('span[domId=' + treeNodes[0].id + ']')
          if (newDom.length > 0) {
            newDom.removeClass('domBtn_Disabled')
            // newDom.addClass('domBtn')
          } else {
            $('#' + domId).append("<span class='domBtn' domId='" + treeNodes[0].id + "'>" + treeNodes[0].name + '</span>')
          }
          MoveTest.updateType()
        } else if ($(e.target).parents('.domBtnDiv').length > 0) {
        }
      },
      dom2Tree: function (e, treeId, treeNode) {
        if (MoveTest.dragId !== null) {
          let dragId = []
          dragId.push(MoveTest.dragId)
          _this.$emit('drag', treeNode, dragId)
          MoveTest.dragId = null
        }
      },
      // 子节点统计
      updateType: function () {
        const zTree = $.fn.zTree.getZTreeObj(_this.treeDivId)
        let nodes = zTree.getNodes()
        let allNodes = zTree.transformToArray(nodes)
        for (var i = 0, l = nodes.length; i < l; i++) {
          var num = nodes[i].children ? nodes[i].children.length : 0
          // nodes[i].name = nodes[i].name.replace(/ \(.*\)/gi, '') + ' (' + allNodes.length + ')'
          nodes[i].name = nodes[i].name.replace(/ \(.*\)/gi, '')
          zTree.updateNode(nodes[i])
        }
      },
      bindDom: function () {
        $(_this.dragBind).bind('mousedown', MoveTest.bindMouseDown)
      },
      bindMouseDown: function (e) {
        var target = e.target
        // 阻止元素触发事件
        const prevent = ['input', 'a', 'span', 'li', 'button']
        const targetTagName = target.localName
        if (prevent.indexOf(targetTagName) !== -1) { return }
        if (target !== null && $(target).parents('tr').hasClass(_this.dragDom)) {
          var doc = $(document)
          target = $(target).parents('tr')
          let className = target[0].className
          let id = className.substring(className.indexOf('id=') + 3)
          id = id.substring(0, id.indexOf(' '))
          MoveTest.dragId = id
          let docScrollTop = doc.scrollTop()
          let docScrollLeft = doc.scrollLeft()
          // target.addClass('domBtn_Disabled')
          target.removeClass(_this.dragDom)
          const curDom = $("<span class='dom_tmp domBtn iconfont'>&#xe64b;</span>")
          curDom.appendTo('body')

          curDom.css({
            'top': (e.clientY + docScrollTop + 3) + 'px',
            'left': (e.clientX + docScrollLeft + 3) + 'px'
          })
          MoveTest.curTarget = target
          MoveTest.curTmpTarget = curDom

          doc.bind('mousemove', MoveTest.bindMouseMove)
          doc.bind('mouseup', MoveTest.bindMouseUp)
          doc.bind('selectstart', MoveTest.docSelect)
        }
        if (e.preventDefault) {
          e.preventDefault()
        }
      },
      bindMouseMove: function (e) {
        MoveTest.noSel()
        const doc = $(document)
        let docScrollTop = doc.scrollTop()
        let docScrollLeft = doc.scrollLeft()
        let tmpTarget = MoveTest.curTmpTarget
        if (tmpTarget) {
          tmpTarget.css({
            'top': (e.clientY + docScrollTop + 3) + 'px',
            'left': (e.clientX + docScrollLeft + 3) + 'px'
          })
        }
        return false
      },
      bindMouseUp: function (e) {
        var doc = $(document)
        doc.unbind('mousemove', MoveTest.bindMouseMove)
        doc.unbind('mouseup', MoveTest.bindMouseUp)
        doc.unbind('selectstart', MoveTest.docSelect)

        let target = MoveTest.curTarget
        let tmpTarget = MoveTest.curTmpTarget
        if (tmpTarget) tmpTarget.remove()

        if ($(e.target).parents(_this.treeDivId).length === 0) {
          if (target) {
            target.removeClass('domBtn_Disabled')
          }
          MoveTest.curTarget = null
          MoveTest.curTmpTarget = null
        }
        MoveTest.dragId = null
      },
      bindSelect: function () {
        return false
      }
    }
    this.MoveTest = MoveTest
    var setting = {
      view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false,
        dblClickExpand: false,
        nameIsHTML: true // 允许name支持html
      },
      edit: {
        enable: _this.editable,
        editNameSelectAll: true,
        showRemoveBtn: _this.showRemoveBtn || showRemoveBtn,
        showRenameBtn: _this.showEditBtn || showRenameBtn,
        renameTitle: _this.editTitle,
        removeTitle: _this.removeTitle,
        drag: {
          prev: true,
          next: true,
          inner: true,
          isCopy: false,
          isMove: true
        }
      },
      data: {
        simpleData: {
          enable: true
        },
        key: {
          title: "title"
        }
      },
      callback: {
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeClick: beforeClick,
        beforeDblClick: beforeDblClick,
        onClick: handleClick,
        onExpand: handleOnExpand,
        onDblClick: handleDblClick,
        beforeRightClick: beforeRightClick,
       //  beforeDrag / onDrag / beforeDrop / onDrop
        onRightClick: this.showRMenu ? OnRightClick : '',
        beforeDrag: this.allowDrag? splitBeforeDrag:MoveTest.dragTree2Dom,
        onDrop: this.allowDrag? splitOnDrop:MoveTest.dropTree2Dom,
        onDragMove: MoveTest.dragMove,
        onMouseUp: MoveTest.dom2Tree,
        onCheck: this.handleOnCheck,

      },
      check: {
        enable: this.checkEnable,
        chkboxType: eval('('+this.chkboxType+')')
      }
    }
    this.setting = setting
    let rMenu = $('#rMenu')
    let className = 'dark'
    function beforeEditName (treeId, treeNode) {
      className = (className === 'dark' ? '' : 'dark')
      let zTree = $.fn.zTree.getZTreeObj(_this.treeDivId)
      zTree.selectNode(treeNode)
      _this.setOpenNodes()
      _this.$emit('treeEdit', treeId, treeNode)
      return false
    }

    /**
     * @description: 树节点点击
     * @author: chenxiaoxi
     * @date: 2018-09-25 16:13:25
     */
    function handleClick (event, treeId, treeNode) {
      let treeNodeOld = JSON.parse(JSON.stringify(treeNode))
      if (treeNodeOld.oldname) {
        treeNodeOld.name = treeNodeOld.oldname
      }
      _this.treeNode = treeNode
      _this.$emit('treeClick', treeId, treeNodeOld)
    }

    /**
     * @author liruohao
     * @date 2019/4/24
     * @Description: 节点展开/折叠事件
     */
    function handleOnExpand (event, treeId, treeNode) {
      let treeNodeExpand = JSON.parse(JSON.stringify(treeNode))
      if (treeNodeExpand.oldname) {
        treeNodeExpand.name = treeNodeExpand.oldname
      }
      _this.treeNode = treeNode
      _this.$emit('treeOnExpand', treeId, treeNodeExpand)
    }
    /**
     * @description: 树节点双击
     * @author: chenxiaoxi
     * @date: 2018/10/24 15:38:14
     */
    function handleDblClick (event, treeId, treeNode) {
      let dblTreeNode = JSON.parse(JSON.stringify(treeNode))
      if (dblTreeNode.oldname) {
        dblTreeNode.name = dblTreeNode.oldname
      }
      _this.treeNode = treeNode
      _this.$emit('treeDblClick', treeId, dblTreeNode)
    }

    /**
     * @description: 树节点删除
     * @author: chenxiaoxi
     * @date: 2018-09-25 14:05:25
     */
    function beforeRemove (treeId, treeNode) {
      className = (className === 'dark' ? '' : 'dark')
      let zTree = $.fn.zTree.getZTreeObj(_this.treeDivId)
      zTree.selectNode(treeNode)
      _this.setOpenNodes()
      _this.$emit('treeRemove', treeId, treeNode)
      return false
    }

    /**
     * @description: 判断哪些节点可被选中
     * @author: chenxiaoxi
     * @date: 2018/10/12 09:51:18
     */
    function beforeClick (treeId, treeNode, clickFlag) {
      if (treeNode.pId === null && treeNode.parentTId === null && _this.pIdCheck) {
        return  !_this.pIdCheck
      } else {
        return (!treeNode.isParent && !_this.disabled) || (_this.deptSelect && !_this.disabled)
      }
    }

    /**
     * @description: 判断哪些节点可被选中
     * @author: chenxiaoxi
     * @date: 2018/10/25 10:12:39
     */
    function beforeDblClick (treeId, treeNode) {
      if (treeNode.pId === null && treeNode.parentTId === null && _this.pIdCheck) {
        return  !_this.pIdCheck
      } else if (treeNode.isParent === undefined || treeNode === null) {
        return _this.deptSelect
      } else {
        return !treeNode.isParent || _this.deptSelect
      }
    }

    /**
     * @description: 判断是否可右击
     * @author: chenxiaoxi
     * @date: 2019/04/10 15:48:41
     */
    function beforeRightClick (treeId, treeNode) {
      return treeNode && treeNode.id !== 'noDepartment'
    }

    // 是否显示移除按钮
    function showRemoveBtn (treeId, treeNode) {
      return (treeNode.pId !== null || _this.root) && !_this.showRMenu && !_this.disabled && _this.editable && _this.hasRemovePermission(_this.removeId)
    }
    function showRenameBtn (treeId, treeNode) {
      return (treeNode.pId !== null || _this.root) && !_this.showRMenu && !_this.disabled && _this.editable && _this.hasEditPermission(_this.editId)
    }
    function addHoverDom (treeId, treeNode) {
      if (_this.showRMenu || _this.disabled || !_this.editable || (_this.addId && _this.hasAddPermission(_this.addId) === false)) { return }
      var sObj = $('#' + treeNode.tId + '_span')
      if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0 || treeNode.id === '404' || treeNode.name === '未分配人员') return
      var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
        "' title='节点新增' onfocus='this.blur();'></span>"
      sObj.after(addStr)
      var btn = $('#addBtn_' + treeNode.tId)
      if (btn) {
        btn.bind('click', function () {
          className = (className === 'dark' ? '' : 'dark')
          var zTree = $.fn.zTree.getZTreeObj(_this.treeDivId)
          this.zTree = zTree
          zTree.selectNode(treeNode)
          _this.setOpenNodes()
          _this.$emit('treeAdd', treeId, treeNode)
          return false
        })
      }
    };
    function removeHoverDom (treeId, treeNode) {
      $('#addBtn_' + treeNode.tId).unbind().remove()
    }
    function OnRightClick (event, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj(_this.treeDivId)
      // 把treeId, treeNode存储到data中
      _this.treeId = treeId
      _this.treeNode = treeNode
      if (!treeNode && event.target.tagName.toLowerCase() !== 'button' && $(event.target).parents('a').length === 0) {
        zTree.cancelSelectedNode()
        showRMenu('root', event.clientX, event.clientY, treeId, treeNode)
        _this.$emit('treeRightClick', treeId, treeNode)
      } else if (treeNode && !treeNode.noR) {
        zTree.selectNode(treeNode)
        showRMenu('node', event.clientX, event.clientY, treeId, treeNode)
        _this.$emit('treeRightClick', treeId, treeNode)
      }
    }

    function showRMenu (type, x, y, treeId, treeNode) {
      if (treeNode.pId !== null && _this.showRMenu && !_this.disabled && _this.editable) {
        _this.isRoot = false
        $('#rMenu ul').show()
        if (type === 'root') {
          $('.m_add').hide()
          $('.m_edit').hide()
          $('.m_del').hide()
          $('.m_copy').hide()
        } else {
          $('.m_add').show()
          $('.m_edit').show()
          $('.m_del').show()
          if(_this.showCopyBtn){
            $('.m_copy').show()
          } else {
            $('.m_copy').hide()
          }
        }
      } else {
        _this.isRoot = true
      }
      y += document.body.scrollTop
      x += document.body.scrollLeft
      rMenu.css({'top': y + 'px', 'left': x + 'px', 'visibility': 'visible'})
      $('body').bind('mousedown', onBodyMouseDown)
    }
    /* eslint-disable */
    function hideRMenu () {
      if (rMenu) rMenu.css({'visibility': 'hidden'})
      $('body').unbind('mousedown', onBodyMouseDown)
    }$
    /* eslint-disable */
    function onBodyMouseDown (event) {
      if (!(event.target.id === 'rMenu' || $(event.target).parents('#rMenu').length > 0)) {
        rMenu.css({'visibility': 'hidden'})
      }
    }

    /**  拖拽前判断节点是否可以拖拽    **/
    function splitBeforeDrag(treeId, treeNodes) {
         return true;
    }
    /**  拖拽后   **/
    function splitOnDrop(event, treeId, treeNodes, targetNode, moveType) {
      _this.$emit('afterDrop', treeNodes, targetNode,moveType)
    }
  }
}
</script>

<style lang="less">
  @import '../../assets/zTree/css/zTreeStyle/zTreeStyle.css';
  @import '~@/assets/styles/mixins';
  .laws-tree{
    position: relative;
    width: 100%;
    height: 100%;
    .content_wrap{
      width: 100%;
      height: 100%;
      .input-wrapper{
        padding: 15px 5px 0 5px;
        input{
          display: inline-block;
          width: 100%;
          height: 32px;
          line-height: 1.5;
          padding: 4px 28px 4px 7px;
          font-size: 12px;
          border-radius: 4px;
          color: #515a6e;
          background-color: #fff;
          background-image: none;
          position: relative;
          cursor: text;
          font-family: inherit;
          border: 1px solid #DDD;
        }
      }
    }
    .ztree li span.button.add {margin-left:2px; margin-right: -1px; background-position:-144px 0; vertical-align:top; *vertical-align:middle}
    div#rMenu {position:absolute; visibility:hidden; top:0;text-align: left;padding: 2px;}
    div#rMenu ul {
      li{
        padding: 0 15px;
        cursor: pointer;
        list-style: none;
        border: 1px solid #888;
        border-bottom: 1px solid transparent;
        background: #FFEBC0;
        &:last-child{
          border-bottom: 1px solid #888;
        }
        &:hover{
          background: #FFC774;
        }
      }
    }
    #rMenu{
      position: fixed !important;
      z-index: 1000;
    }
    .ztree li span.button.edit:hover{
      background-position: -110px -48px;
    }
    .ztree li span.button.remove:hover{
      background-position: -110px -64px !important;
    }
    .left{
      width: 100%;
      height: calc(~'100% - 47px');
      overflow-y: auto;
      .ztree{
        width: 100% !important;
        height: 100% !important;
      }
    }
    .has-no-node{
      float: left;
      width: 100%;
      height: 100%;
      .flex();
      justify-content: center;
      align-items: center;
      color: rgb(204,204,204);
    }
  }
  .dom_line {margin:2px;border-bottom:1px gray dotted;height:1px}
  .domBtnDiv {display:block;padding:2px;border:1px gray dotted;background-color:powderblue}
  .categoryDiv {display:inline-block; width:335px}
  .domBtn {display:inline-block;cursor:pointer}
  .domBtn_Disabled {background-color:#DFDFDF;color:#999999}
  .dom_tmp {position:absolute;font-size:50px;}
</style>
