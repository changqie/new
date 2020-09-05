<!-- 可搜索多选框 -->
<template>
  <el-dropdown
    ref="searchMultipleSelectDropdown"
    trigger="click"
    class="search-multiple-select"
    size="medium"
   >
    <div
      class="search-input-box"
      :class="{ 'search-visible ivu-select-visible': visible }"
      @click="visibleToggle">
      <div class="v-select-selection" :class="{ 'disabled': disabled }">
        <div>
          <span class="v-select-placeholder" v-if="!selectedList.length">{{ placeholder }}</span>
          <el-tag
            v-for="val in selectedList"
            :key="val"
            closable
            :fade="false"
            @click.native="visibleToggle"
            @on-close="handleRemove(val)">{{ getLabel(val) }}</el-tag>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </div>
    <el-dropdownMenu slot="dropdown" class="search-select-el-dropdown-menu">
      <div class="search-input">
        <el-input
          v-model="searchKey"
          placeholder="要搜索的内容"
          class="input-color"
          type="text"></el-input>
      </div>
      <div class="search-options">
        <el-dropdownItem
          v-for="option in filterOptions"
          :class="[{'ivu-select-item-selected': isSelected(option.value), 'ivu-select-item-focus': focusItem === option.value}]"
          :name="option.value || option.id"
          :key="option.value"
          @click.native="handleOptionClick(option.value)"
        >
          {{ option.label || option.name }}
        </el-dropdownItem>
      </div>
    </el-dropdownMenu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'searchMultipleSelect',
  data () {
    return {
      // 选择的value
      selectedList: [],
      visible: false,
      // 原始选项数据
      filterOptions: [],
      // 选项匹配词
      searchKey: '',
      // 当前点击项
      focusItem: ''
    }
  },
  methods: {
    /**
       * @description: 切换显示状态
       * @author: chenxiaoxi
       * @date: 2018/12/25 10:38:54
       */
    visibleToggle () {
      if (!this.disabled) {
        this.visible = !this.visible
      }
    },

    /**
       * @description: 选取
       * @author: chenxiaoxi
       * @date: 2018/12/25 10:39:08
       */
    handleOptionClick (val) {
      console.log(val)
      if (this.options !== '' && this.options !== null) {
        this.options.map((opt) => {
          // 用value去匹配label,输入框最终显示的是label
          if (opt.value === val) {
            let index = this.selectedList.indexOf(val)
            if (index === -1) {
              this.selectedList.push(val)
            } else {
              this.selectedList.splice(index, 1)
            }
            this.focusItem = val
            this.$emit('input', this.selectedList)
            this.$emit('on-change', this.selectedList)
          }
        })
      }
    },

    /**
       * @description: 选项过滤
       * @author: chenxiaoxi
       * @date: 2018/12/25 10:44:38
       */
    handleFilterOptions () {
      // 匹配项来源
      if (this.searchKey === '') {
        this.filterOptions = this.options
      } else {
        let result = []
        // 用原始数据进行匹配
        if (this.options !== '' && this.options !== null) {
          this.options.map((opt) => {
            if (opt.label.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1) {
              result.push(opt)
            }
          })
        }
        this.filterOptions = result
      }
      this.$nextTick(() => {
        let top = $('.search-multiple-select .ivu-select-dropdown').css('top')
        if (top.indexOf('px') > -1) {
          top = parseInt(top.substring(0, top.indexOf('p')))
        }
        if (top > 0) {
          $('.search-multiple-select .ivu-select-dropdown').css('top', $('.ivu-dropdown-rel').height())
        } else {
          $('.search-multiple-select .ivu-select-dropdown').css('top', -$('.search-multiple-select .ivu-select-dropdown').height() - 20)
        }
      })
    },

    /**
     * @description: 对v-model绑定的值进行匹配
     * @author: chenxiaoxi
     * @date: 2018/12/25 15:23:46
     */
    handleValue () {
      if (this.value && this.value !== null && this.value !== '' && this.value.length && this.value[0] !== '') {
        this.selectedList = this.value
      } else {
        this.selectedList = []
      }
    },

    /**
     * @description: 当前选项是否被选中
     * @author: chenxiaoxi
     * @date: 2019/02/25 11:52:00
     */
    isSelected (val) {
      return this.selectedList.indexOf(val) !== -1
    },

    /**
     * @description: 根据选项值获取选项名
     * @author: chenxiaoxi
     * @date: 2019/02/25 14:16:07
     */
    getLabel (val) {
      let label = ''
      this.options.map((opt) => {
        if (opt.value === val) {
          label = opt.label
        }
      })
      return label
    },

    /**
     * @description: 选项移除
     * @author: chenxiaoxi
     * @date: 2019/02/25 14:21:01
     */
    handleRemove (val) {
      if (!this.disabled) {
        this.selectedList.splice(this.selectedList.indexOf(val), 1)
      }
    }
  },
  components: {},
  props: {
    value: {
      type: [String, Array]
    },
    options: {
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {
    // 监听显示状态
    visible (val) {
      if (val) {
        // 当显示的时候,给选项框外绑定事件
        window.addEventListener('click', function (e) {
          // 点击的是搜索框外
          if ($(e.target).parents('.search-multiple-select').length === 0) {
            this.visible = false
          }
        }.bind(this))
      } else {
        this.searchKey = ''
      }
    },
    // 监听关键词的变化,代替keyup事件
    searchKey (val) {
      this.handleFilterOptions()
    },
    // 监听v-model变化
    value (val) {
      this.handleValue()
    },
    // 监听options变化
    options (val, oldVal) {
      this.filterOptions = JSON.parse(JSON.stringify(this.options))
      this.handleValue()
    },
    // 修改定位
    selectedList (val) {
      if (val.length) {
        this.handleValue()
      }
    }
  },
  mounted () {
    this.handleValue()
    this.filterOptions = JSON.parse(JSON.stringify(this.options))
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/mixins';
  @import '~@/assets/styles/style';
  .search-multiple-select{
    .v-select-selection{
      padding: 0 24px 0 4px;
      &.disabled{
        background-color: #f3f3f3;
        opacity: 1;
        cursor: not-allowed;
        color: #ccc;
        .ivu-tag{
          background-color: #f2f2f2;
          cursor: not-allowed;
        }
      }
      .ivu-tag{
        height: 24px;
        line-height: 22px;
        margin: 3px 4px 3px 0;
        max-width: 99%;
        position: relative;
      }
    }
  }
</style>
