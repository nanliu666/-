<template>
  <div class="category">
    <div v-if="_.size(selected) > 0" class="category__selected">
      <span class="category__label"> 已选条件： </span>
      <div class="category__selected--wrap">
        <span class="category__selected--title"> 分类： </span>
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
    <div v-show="!_.isEmpty(categoryList)" class="category__list" style="display: flex">
      <span class="category__label">分类：</span>
      <!-- <ul>
        <li
          v-show="!selected.length"
          style="color: #01aafc"
          @click="handleCategoryClick({ name: '全部', id: '' })"
        >
          全部
        </li>
      </ul> -->
      <ul ref="industryRef" style="flex: 1" :class="{ hidde: !bussinessType }">
        <li v-for="item in categoryList" :key="item[valueKey]" @click="handleCategoryClick(item)">
          <div v-if="item[labelKey] == '全部'" style="color: #01aafc">{{ item[labelKey] }}</div>
          <div v-else><span style="color:#ccc">| &nbsp;</span> {{ item[labelKey] }}</div>
        </li>
      </ul>

      <div v-show="industryHeight" class="moreBtn">
        <div class="moreBtn_box" @click="bussinessType = !bussinessType">
          <span class="text">{{ bussinessType ? '收起' : '更多' }}</span>
          <i v-show="!bussinessType" class="el-icon-arrow-down"></i>
          <i v-show="bussinessType" class="el-icon-arrow-up"></i>
        </div>
      </div>
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
      active: {},
      industryHeight: true,
      bussinessType: true
    }
  },

  watch: {
    categoryList: function() {
      this.$nextTick(function() {
        let cur = this.$refs['industryRef']
        if (cur.clientHeight != 30 && cur.clientHeight != 22) {
          // 是否显示btn
          this.industryHeight = true
          // // 是否显示分类
          this.bussinessType = false
        } else {
          this.industryHeight = false
          this.bussinessType = true
        }
      })
    },
    selected: function() {
      this.$nextTick(function() {
        let cur = this.$refs['industryRef']
        if (cur.clientHeight != 30 && cur.clientHeight != 22) {
          // 是否显示btn
          this.industryHeight = true
          // // 是否显示分类
          this.bussinessType = false
        } else {
          this.industryHeight = false
          this.bussinessType = true
        }
      })
    }
  },

  mounted() {
    this.loadCategory(null)
  },
  methods: {
    loadCategory(id) {
      this.load({ id }).then((list) => {
        this.categoryList = list
        if (!this.selected.length) {
          this.categoryList.unshift({ name: '全部', id: '' })
        }
      })
    },
    handleCategoryClick(category) {
      if (category.name == '全部') {
        this.selected = []
      }
      this.selected.push(category)
      this.active = category

      // let ids = []
      // this.selected.forEach((item) => {
      //   if (item.id) ids.push(item.id)
      // })
      // let data = { id: '' }
      // data.id = ids.toString()
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
.moreBtn {
  font-size: 12px;
  color: #01aafc;
  .moreBtn_box {
    border: 1px solid #ccc;
    padding: 0 5px;
    border-radius: 4px;
    cursor: pointer;
  }
  .text {
    margin-left: 5px;
  }
}
.hidde {
  overflow: hidden;
  height: 22px;
}
</style>
