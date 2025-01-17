<template>
  <el-form ref="form" :model="model" v-bind="elFormAttrs">
    <el-row>
      <el-col
        v-for="column in columns"
        :key="column.prop"
        :span="column.span ? column.span : 10"
        :offset="column.offset ? column.offset : 0"
      >
        <el-form-item
          v-if="column.itemType !== 'slotout'"
          :label="`${column.label}${column.props && column.props.showColon ? ':' : ''}`"
          v-bind="elFormItemAttrs(column)"
          :rules="getRules(column)"
        >
          <slot slot="label" :name="column.prop + '-label'">
            {{ column.label }}
          </slot>
          <el-input-number
            v-if="column.itemType == 'inputNumber'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请输入${column.label}`"
            @input="column.props && column.props.onlyNumber && inputNumber($event, column)"
          />
          <el-input
            v-if="column.itemType == 'input'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请输入${column.label}`"
            @input="column.props && column.props.onlyNumber && inputNumber($event, column)"
          />
          <pass-input
            v-if="column.itemType == 'passInput'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请输入${column.label}`"
            @input="column.props && column.props.onlyNumber && inputNumber($event, column)"
          />
          <el-select
            v-if="column.itemType == 'select'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :filterable="column.filterable"
            :remote="column.remote"
            :remote-method="column.remoteMethod"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          >
            <el-option
              v-for="item in column.options"
              :key="item[(column.props && column.props.value) || 'value']"
              :label="
                column.props
                  ? (column.props.formatter && item.formatter(item)) ||
                    item[column.props.label || 'label']
                  : item.label
              "
              :disabled="column.props.disabled ? item[column.props.disabled] : false"
              :value="item[(column.props && column.props.value) || 'value']"
            />
          </el-select>
          <el-radio-group
            v-if="column.itemType == 'radio'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          >
            <el-radio
              v-for="item in column.options"
              :key="item[(column.props && column.props.value) || 'value']"
              :label="item[(column.props && column.props.value) || 'value']"
            >
              {{
                column.props
                  ? (column.props.formatter && item.formatter(item)) ||
                    item[column.props.label || 'label']
                  : item.label
              }}
            </el-radio>
          </el-radio-group>
          <el-checkbox-group
            v-if="column.itemType == 'checkbox'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          >
            <el-checkbox
              v-for="item in column.options"
              :key="item[(column.props && column.props.value) || 'value']"
              :label="item[(column.props && column.props.value) || 'value']"
            >
              {{
                column.props
                  ? (column.props.formatter && item.formatter(item)) ||
                    item[column.props.label || 'label']
                  : item.label
              }}
            </el-checkbox>
          </el-checkbox-group>
          <el-cascader
            v-if="column.itemType == 'cascader'"
            v-model="model[column.prop]"
            :options="column.options"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          />

          <el-date-picker
            v-if="column.itemType == 'datePicker'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          />
          <el-time-picker
            v-if="column.itemType == 'timePicker'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          />

          <el-tree-select
            v-if="column.itemType == 'treeSelect'"
            ref="treeSelect"
            v-model="model[column.prop]"
            :select-params="column.props && column.props.selectParams"
            :tree-params="column.props && column.props.treeParams"
            v-bind="itemAttrs(column)"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
            @searchFun="searchTreeFun($event, column.treeKey)"
          />
          <lazy-select
            v-if="column.itemType === 'lazySelect'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
            :option-list.sync="column.optionList"
            :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
          />
          <el-switch
            v-if="column.itemType == 'switch'"
            v-model="model[column.prop]"
            v-bind="itemAttrs(column)"
          />
          <slot v-if="column.itemType == 'slot'" v-bind="itemAttrs(column)" :name="column.prop" />
          <div v-if="column.desc" class="desc">
            {{ column.desc }}
          </div>
        </el-form-item>
        <slot v-if="column.itemType == 'slotout'" v-bind="itemAttrs(column)" :name="column.prop">
        </slot>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { elFormAttrs, elFormItemAttrs, noneItemAttrs, defaultAttrs } from './config'
import LazySelect from '@/components/lazy-select/LazySelect'
import PassInput from '@/components/pass-input/PassInput'
const inputTypes = ['input', 'inputNumber', 'passInput']
export default {
  name: 'CommonForm',
  components: {
    ElTreeSelect: () => import('@/components/el-tree-select/ElTreeSelect'),
    LazySelect,
    PassInput
  },
  props: {
    model: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  computed: {
    _config() {
      return Object.assign(
        {
          labelPosition: 'top',
          size: 'medium'
        },
        this.config
      )
    },
    // el-table组件属性
    elFormAttrs() {
      const copy = {}
      for (const key in this._config) {
        if (elFormAttrs.includes(key)) {
          copy[key] = this._config[key]
        }
      }
      return copy
    }
  },
  mounted() {},
  methods: {
      searchTreeFun(data, treeKey) {
      //   搜索需要指定一个treeKey，拿到对应的component，返回过滤后的值
      this.$refs.treeSelect.map((v, i) => {
        if (v.$attrs.treeKey == treeKey) {
          const searchTarget = _.get(this.$refs, `treeSelect[${i}].$refs.tree`)
          searchTarget.filter(data)
        }
      })
    },
    elFormItemAttrs(column) {
      const copy = {}
      for (const key in column) {
        if (elFormItemAttrs.includes(key)) {
          copy[key] = column[key]
        }
      }
      return copy
    },
    itemAttrs(column) {
      const copy = { ...defaultAttrs[column.itemType] }
      for (const key in column) {
        if (!noneItemAttrs.includes(key)) {
          copy[key] = column[key]
        }
      }

      return copy
    },
    inputNumber(value, column) {
      const REG_VALID_NUMBER = /^(\+|-)?\d*(\.\d*)?$/

      if (REG_VALID_NUMBER.test(value)) {
        value = _.replace(value, '+', '') // 省略正号
        value = _.replace(value, /\.$/, '') // 省略结束的小数点
        this.model[column.prop] = value
      } else {
        this.model[column.prop] = _.replace(value, /[^\d]/, '')
      }
    },

    getRules(column) {
      if (column.required) {
        let rules = [
          {
            required: true,
            message: `请${inputTypes.includes(column.itemType) ? '输入' : '选择'}${column.label}`,
            trigger: `${column.itemType == 'input' ? 'blur' : 'change'}`
          },
          ...(column.rules ? column.rules : [])
        ]
        return rules
      } else {
        return column.rules
      }
    },
    validate(...args) {
      return this.$refs['form'].validate(...args)
    },
    clearValidate() {
      return this.$refs['form'].clearValidate(...arguments)
    },
    resetFields() {
      return this.$refs['form'].resetFields(...arguments)
    },
    validateField() {
      return this.$refs['form'].validateField(...arguments)
    },
    scrollIntoView() {
      this.$refs['form'] &&
        this.$refs['form'].$el &&
        this.$refs['form'].$el.scrollIntoView &&
        this.$refs['form'].$el.scrollIntoView({
          behavior: 'auto',
          block: 'end'
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input,
.el-input-number,
.el-cascader {
  width: 100%;
}

/deep/ .el-select {
  width: 100%;
}
.el-form-item .el-input__inner {
  width: 100%;
}
/deep/ .el-form-item__content {
  min-height: 35px;
}

/deep/.el-input-number input::placeholder {
  text-align: left;
}
/deep/ .el-input-number__decrease,
/deep/.el-input-number__increase {
  right: 1px !important; // overwrite Avue
}

.desc {
  line-height: 18px;
  color: #757c85;
  padding-top: 6px;
  min-height: 36px;
}
</style>
