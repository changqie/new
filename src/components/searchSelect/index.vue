<!-- 可搜索选择框 -->
<template>
  <el-dropdown
    trigger="click"
    class="search-select"
    size="medium"
  >
    <el-input
      type="text"
      readonly
      :placeholder="placeholder"
      v-model="selectedLabel"
      suffix-icon="el-icon-arrow-down"
      @click.native="visibleToggle"
      :class="{ 'search-visible': visible }"
    ></el-input>
    <el-input
      type="hidden"
      v-model="selectedValue"
      class="el-input-hidden"
    ></el-input>
    <el-dropdown-menu
      slot="dropdown"
      class="search-select-el-dropdown-menu"
    >
      <div class="search-input">
        <el-input
          v-model="searchKey"
          placeholder="要搜索的内容"
          class="input-color"
          clearable />
      </div>
      <div class="search-options">
        <el-dropdown-item
          v-for="option in filterOptions"
          :name="option.value || option.id"
          :title="option.label || option.name"
          :key="option.value"
          @click.native="ondropClick(option)"
        >
          {{ option.label || option.name }}
        </el-dropdown-item>
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
    // 点击下拉选项事件
    ondropClick (option) {
      this.visible = false // 隐藏下拉菜单
      this.selectedValue = option.value
      this.selectedLabel = option.label
      this.$emit('input', option.value) // 赋值给父组件
      this.$emit('on-change', option.value) // 赋值给父组件
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
</style>
