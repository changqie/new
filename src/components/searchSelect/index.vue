<!-- 可搜索选择框 -->
<template>
  <el-dropdown
    trigger="custom"
    class="search-select"
    :visible="visible"
    @on-clickoutside="handleClickOutSide"
    @on-click="handleOptionClick">
    <el-input type="hidden" v-model="selectedValue"></el-input>
    <el-input
      :placeholder="placeholder"
      readonly
      :clearable="clearable"
      v-model="selectedLabel"
      :disabled="disabled"
      @click.native="visibleToggle"
      :class="{ 'search-visible': visible }"
      icon="ios-arrow-down"></el-input>
    <el-dropdown-menu slot="dropdown">
      <div class="search-input">
        <el-input
          v-model="searchKey"
          placeholder="要搜索的内容"
          class="input-color"
          clearable />
      </div>
      <div class="search-options">
        <el-dropdown-item v-for="option in filterOptions" :name="option.value || option.id" :title="option.label || option.name" :key="option.value">{{ option.label || option.name }}</el-dropdown-item>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'searchSelect',
  data () {
    return {
      // 显示的label
      selectedLabel: '',
      // 选择的value
      selectedValue: '',
      visible: false,
      // 原始选项数据
      filterOptions: [],
      // 选项匹配词
      searchKey: ''
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
            this.selectedLabel = opt.label || opt.name
            this.selectedValue = val
            this.$emit('input', val)
            this.$emit('on-change', val)
            this.visible = false
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
            if (opt.label !== null && opt.label.indexOf(this.searchKey) !== -1) {
              result.push(opt)
            }
          })
        }
        this.filterOptions = result
      }
    },

    /**
     * @description: 对v-model绑定的值进行匹配
     * @author: chenxiaoxi
     * @date: 2018/12/25 15:23:46
     */
    handleValue () {
      if (this.value && this.value !== '') {
        if (this.options !== '' && this.options !== null) {
          this.options.map((opt) => {
            if (opt.value === this.value || opt.id === this.value) {
              this.selectedLabel = opt.label || opt.name
              this.selectedValue = opt.value || opt.id
            }
          })
        }
      } else {
        this.selectedLabel = ''
        this.selectedValue = ''
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
      type: [String, Number]
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
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  computed: {},
  watch: {
    selectedLabel: {
      deep: true,
      handler (val, oldVal) {
        // 当外层输入框内容清空时, 将selectedValue置为空
        if (val === '') {
          this.selectedValue = ''
        }
      }
    },
    // 监听显示状态
    visible (val) {
      if (val) {
        // 当显示的时候,给选项框外绑定事件
        window.addEventListener('click', function (e) {
          // 点击的是搜索框外
          if ($(e.target).parents('.search-select').length === 0) {
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
    // 监听最终选取的值
    selectedValue (val) {
      if (val === '' || this.selectedLabel === '') {
        this.$emit('input', val)
        this.$emit('on-change', val)
      }
    },
    // 监听v-model变化
    value (val) {
      this.handleValue()
    },
    // 监听options变化
    options (val, oldVal) {
      this.filterOptions = JSON.parse(JSON.stringify(this.options))
      this.handleValue()
    }
  },
  mounted () {
    this.filterOptions = JSON.parse(JSON.stringify(this.options))
    this.handleValue()
  }
}
</script>

<style lang="less">
  @import '~@/assets/styles/mixins';
  @import '~@/assets/styles/style';
  .search-select{
    width: 100%;
    line-height: 0px;
    .search-input{
      padding: 0 5px 5px 5px;
      .ivu-input{
        border-radius: 2px;
      }
    }
    .ivu-icon-ios-arrow-down{
      transition: transform .2s linear;
    }
    .search-visible{
      .ivu-icon-ios-arrow-down{
        transform: rotate(180deg);
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
  }
</style>
