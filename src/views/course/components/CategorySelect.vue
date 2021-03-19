<template>
  <div class="category">
    <div v-if="_.size(selected) > 0" class="category__selected">
      <span class="category__label">
        已选条件：
      </span>
      <div class="category__selected--wrap">
        <span class="category__selected--title">
          分类：
        </span>
        <ul>
          <li v-for="(item, index) in selected" :key="item[valueKey]">
            <span class="category__selected--label">
              {{ item[labelKey] }}
            </span>
            <i class="el-icon-close close" @click="handleDelete(index, item)"></i>
            <i v-if="index !== selected.length - 1" class="el-icon-arrow-right arrow"></i>
          </li>
        </ul>
      </div>
      <i v-if="$scopedSlots.selected" class="el-icon-arrow-right arrow"></i>
      <slot name="selected"></slot>
    </div>
    <div v-show="!_.isEmpty(categoryList)" class="category__list">
      <span class="category__label">
        分类：
      </span>
      <ul>
        <li @click="handleCategoryClick({ name: '全部', id: '' })">全部</li>
        <li v-for="item in categoryList" :key="item[valueKey]" @click="handleCategoryClick(item)">
          {{ item[labelKey] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    // 加载方法,返回Promise对象
    load: {
      type: Function,
      default: () => []
    },
    // 数据唯一key
    valueKey: {
      type: String,
      default: 'id'
    },
    // 展示用字段
    labelKey: {
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      categoryList: [],
      selected: [],
      active: {}
    }
  },
  mounted() {
    this.loadCategory(null)
  },
  methods: {
    loadCategory(id) {
      this.load({ id }).then((list) => {
        this.categoryList = list
      })
    },
    handleCategoryClick(category) {
      this.selected.push(category)
      this.active = category
      this.$emit('change', category)
      this.loadCategory(category[this.valueKey])
    },
    handleDelete(index) {
      this.selected = this.selected.slice(0, index)
      this.active = _.last(this.selected) || {}
      this.loadCategory(this.active[this.valueKey])
      this.$emit('change', this.active)
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  color: rgba($primaryFontColor, 0.85);
  line-height: 22px;
  &__label {
    margin-right: 16px;
  }
  &__selected {
    margin-bottom: 16px;
    &--wrap {
      background: #f5f5f6;
      font-size: 12px;
      height: 24px;
      display: inline-block;
      padding: 0 8px;
      line-height: 24px;
      border-radius: 4px;
    }
    &--title {
      color: rgba($primaryFontColor, 0.45);
    }
    &--label {
      color: $primaryColor;
    }
    ul {
      display: inline;
      li {
        display: inline;
        line-height: 24px;

        i.close {
          color: $primaryColor;
          font-size: 8px;
          margin-left: 4px;
          cursor: pointer;
        }
        i.arrow {
          margin: 0 8px;
          color: rgba($primaryFontColor, 0.45);
        }
      }
    }
  }
  &__list {
    margin-bottom: 8px;
    ul {
      display: inline;
      li {
        cursor: pointer;
        display: inline-block;
        margin-right: 16px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
