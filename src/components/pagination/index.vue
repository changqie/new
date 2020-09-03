<!-- 分页 -->
<template>
  <div class="pagination">
    <el-divider />
    <div class="pagination-slot">
      <slot>
        <el-pagination
          :total="total"
          :current-page="page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          @current-change="pageChange"
          @size-change="pageSizeChange"
          layout="total, prev, pager, next, sizes, jumper"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'pagination',
  methods: {
    // 切换页码
    pageChange (page) {
      this.$emit('pageChange', page)
    },
    pageSizeChange (pageSize) {
      if (this.getTypeFlag === 'CloudRepository') {
        this.userInfo.configContent = pageSize
        this.setUserInfo(JSON.stringify(JSON.parse(JSON.stringify(this.userInfo))))
        this.$emit('pageSizeChange', pageSize)
      } else {
        this.pageConfig(pageSize).then((res) => {
          if (res.ok) {
            this.userInfo.configContent = pageSize
            this.setUserInfo(JSON.stringify(JSON.parse(JSON.stringify(this.userInfo))))
            this.$emit('pageSizeChange', pageSize)
          }
        }, e => {
        })
      }
    },
    /**
     * @description: 每页条数配置
     * @author: chenxiaoxi
     * @date: 2018/10/22 10:50:39
     */
    pageConfig (pageSize) {
      return new Promise((resolve, reject) => {
        this.$http.postData('person/userConfig/createUserConfig', {
          configType: 'PAGE_SIZE',
          configContent: pageSize
        }, {
          loading: 'loading',
          _this: this
        }, res => {
          resolve(res)
        }, e => {
          reject(e)
        })
      })
    },
    ...mapMutations(['setUserInfo'])
  },
  props: {
    total: {
      type: Number
    },
    page: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'getTypeFlag']),
    pageSize () {
      return this.userInfo.configContent === '' || this.userInfo.configContent === undefined || this.userInfo.configContent === null ? 10 : parseInt(this.userInfo.configContent)
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
  .pagination {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    .pagination-slot {
      width: 100%;
      height: 56px;
      line-height: 56px;
      padding: 0 15px;
      box-sizing: border-box;
      .el-pagination{
        padding: 0;
      }
    }
  }
</style>
