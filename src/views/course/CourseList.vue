<template>
  <div class="course-list">
    <div class="course-list__filter">
      <category-select
        :load="loadCategory"
        @change="handleCategoryChange"
      ></category-select>
    </div>
  </div>
</template>

<script>
import { getCategories } from '@/api/course'
import CategorySelect from './components/CategorySelect'
export default {
  name: 'CourseList',
  components: {
    CategorySelect
  },
  data() {
    return {
      params: {
        catalogId: null
      }
    }
  },
  methods: {
    loadCategory(id) {
      return getCategories({ id })
    },
    handleCategoryChange(category) {
      this.params.catalogId = category.id
    }
  }
}
</script>

<style lang="scss" scoped>
.course-list {
  &__filter {
    margin-top: 24px;
    background: white;
    padding: 24px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  }
}
</style>
