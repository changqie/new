<!-- demoinfo页 liuyan -->
<template>
  <div class="demo-info v-class">
    <div class="tree-content" :class="{'tree-closed' : sideClose}">
      <div class="tree">
        <laws-tree
          :zNodes="zNodes"
          ref="foreignStandardTree"
          treeDivId="foreignStandardTree"
          deptSelect
          showRMenu
          autoSelect
          add-id="QE4VD4BUQY"
          edit-id="NR9VRJ3VY3"
          remove-id="NTUFYC8TCC"
          :drag="hasPermissionDrag"
          drag-bind=".drag-table .ivu-table-body"
          drag-dom="drag-row"
          v-if="treeReload"
          @treeAdd="(treeId, treeNode) => clickDropMenu('newMenu', treeNode)"
          @treeEdit="(treeId, treeNode) => clickDropMenu('editMenu', treeNode)"
          @treeClick="(treeId, treeNode) => treeClick(treeNode)"
          @treeRightClick="(treeId, treeNode) => treeRightClick(treeNode)"
          @treeRemove="(treeId, treeNode) => clickDropMenu('deleteMenu', treeNode)"
          @drag="drag"
        ></laws-tree>
      </div>
      <div class="tree-collapse" @click="treeCollapse" :class="{ 'tree-close': sideClose }">
        <i :class="collapseIcon" />
      </div>
    </div>
    <div class="tree-right-content">
      {{ $t('m.statuteBank') }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'DemoInfo',
  data () {
    return {
      zNodes: [],
      parentNode: [],
      sideClose: false, // 边栏收展状态
      // keep-alive重新加载树组件
      treeReload: false
    }
  },
  computed: {
    // 是否拥有拖拽权限
    hasPermissionDrag () {
      let has = false
      let permissionList = this.$store.getters.getMenuList
      permissionList.map((menu) => {
        if (menu.id === 'VR7ND88UDT') {
          has = true
        }
      })
      return has
    },
    // 收展按钮
    collapseIcon () {
      return this.sideClose ? 'el-icon-arrow-right' : 'el-icon-arrow-left'
    }
  },
  methods: {
    // 查询二级菜单
    selectMenu () {
      this.$http.get('lawss/sarMenu/selectMenuByRole', {sorDivide: 'FOREIGN_STAND'}, {
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
    // 拖拽事件
    drag (treeNode, dragId) {
      if (treeNode !== null) {
        let search = {}
        search.menuId = treeNode.id
        search.idlist = this.selectedList.length ? this.selectedList : dragId
        this.$http.postData('lawss/sarBussionessStand/saveStandardsMenu', search, {
          _this: this
        }, res => {
          if (res.ok) {
            this.$Message.success('配置标准成功!')
            this.selectedList = []
            this.getBussionStandTable(this.tableFlag)
          } else {
            this.$Message.warning(res.message)
          }
        }, e => {
        })
      }
    },
    treeCollapse () {
      this.sideClose = !this.sideClose
    }
  },
  mounted () {
    this.selectMenu()
    this.treeReload = true
  }
}
</script>
<style lang="less" scoped>
  .demo-info{
  }
</style>
