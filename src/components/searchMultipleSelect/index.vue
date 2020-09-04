<!-- 可搜索多选框 -->
<template>
  <el-dropdown
    ref="searchMultipleSelectDropdown"
    trigger="click"
    class="search-multiple-select"
    size="medium"
   >
    <div
      class="ivu-select ivu-select-default"
      :class="{ 'search-visible ivu-select-visible': visible }"
      @click="visibleToggle">
      <div class="ivu-select-selection" :class="{ 'disabled': disabled }">
        <div>
          <span class="ivu-select-placeholder" v-if="!selectedList.length">{{ placeholder }}</span>
          <el-tag
            v-for="val in selectedList"
            :key="val"
            closable
            :fade="false"
            @click.native="visibleToggle"
            @on-close="handleRemove(val)">{{ getLabel(val) }}</el-tag>
          <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
        </div>
      </div>
    </div>
    <el-dropdownMenu slot="list">
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
          :key="option.value">{{ option.label || option.name }}</el-dropdownItem>
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
    },

    /**
     * @description: 点击组件之外
     * @author: chenxiaoxi
     * @date: 2019/04/10 14:17:00
     */
    handleClickOutSide () {
      this.visible = false
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
        // this.$nextTick(() => {
        //   let top = $('.search-multiple-select .ivu-select-dropdown').css('top')
        //   if (top.indexOf('px') > -1) {
        //     top = parseInt(top.substring(0, top.indexOf('p')))
        //   }
        //   if (top > 0) {
        //     $('.search-multiple-select .ivu-select-dropdown').css('top', $('.ivu-dropdown-rel').height())
        //   } else {
        //     $('.search-multiple-select .ivu-select-dropdown').css('top', -$('.search-multiple-select .ivu-select-dropdown').height() - 20)
        //   }
        // })
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
    width: 100%;
    position: relative;
    .search-input{
      padding: 0 5px 5px 5px;
      .ivu-input{
        border-radius: 2px;
      }
    }
    .ivu-input{
      padding-right: 7px !important;
      .un-select()
    }
    .search-options{
      max-height: 200px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .input-color{
      .ivu-input{
        border: 1px solid #dcdee2 !important;
      }
    }
    .ivu-select-dropdown{
      max-width: none;
      width: 100%;
      border: 1px solid @baseColor;
    }
    .ivu-dropdown-item{
      position: relative;
      &.ivu-select-item-selected{
        color: @baseColor;
        &::after{
          display: inline-block;
          font-family: Ionicons;
          speak: none;
          font-style: normal;
          font-weight: 400;
          font-variant: normal;
          text-transform: none;
          text-rendering: auto;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          vertical-align: middle;
          font-size: 24px;
          content: "\F171";
          color: rgba(45,140,240,.9);
          position: absolute;
          top: 2px;
          right: 8px;
        }
      }
    }
    .ivu-select-selection{
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
        .ivu-select-arrow{
          color: #CCC;
        }
      }
      .ivu-select-placeholder{
        display: block;
        height: 30px;
        line-height: 30px;
        color: #c5c8ce;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 4px;
        padding-right: 22px;
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
