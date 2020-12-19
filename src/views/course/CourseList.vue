<template>
  <div class="course-list">
    <div class="course-list__filter course-list__block">
      <div class="course-list__search">
        <el-input
          v-model="params.courseName"
          class="course-list__input"
          clearable
          placeholder="查找课程"
          suffix-icon="el-icon-search"
        />
        <el-popover
          placement="bottom-start"
          width="412"
          trigger="click"
          popper-class="course-list-filter-pop"
        >
          <div class="course-list-filter-pop__wrap">
            <div class="course-list-filter-pop__label">
              讲师
            </div>
            <lazy-select
              v-model="extraParams.tearchId"
              :load="loadTeacher"
              style="width: 100%"
              placeholder="请选择"
              :option-props="{
                label: 'name',
                value: 'idStr',
                key: 'idStr'
              }"
            ></lazy-select>
            <div class="course-list-filter-pop__footer">
              <el-button
                type="primary"
                size="medium"
                @click="refreshData"
              >
                确定
              </el-button>
              <el-button
                size="medium"
                @click="resetExtraParams"
              >
                重置
              </el-button>
            </div>
          </div>
          <el-button
            slot="reference"
            size="medium"
          >
            高级检索
          </el-button>
        </el-popover>
      </div>
      <div class="course-list__filter-divider"></div>
      <category-select
        :load="loadCategory"
        @change="handleCategoryChange"
      ></category-select>
      <div class="course-list__filter-type">
        <span class="course-list__filter-label">
          类型：
        </span>
        <ul>
          <li
            v-for="item in COURSE_TYPE_LIST"
            :key="item.value"
            :class="{ active: item.value === params.type }"
            @click="handleCourseTypeChange(item.value)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
    <div class="course-list-choice course-list__block">
      <ul>
        <li
          v-for="item in COURSE_CHOICE_LIST"
          :key="item.value"
          :class="{ active: item.value === params.choice }"
          @click="handleCourseChoiceChange(item.value)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <div
      v-loading="loading"
      class="course-list__list"
    >
      <template v-if="!loading && !_.isEmpty(courseList)">
        <ul>
          <li
            v-for="item in courseList"
            :key="item.courseId"
          >
            <div class="course-list__list__img">
              <el-image :src="item.coverUrl">
                <div
                  slot="error"
                  class="image-slot"
                >
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="course-list__list__content">
              <div class="course-list__list__title">
                {{ item.courseName }}
              </div>
              <div class="course-list__list__info">
                <span class="course-list__list__teacher">{{ item.teacherName }}</span>
                <span class="course-list__list__learn">学习：{{ item.people || 0 }}</span>
                <span
                  v-if="COURSE_TYPE_MAP[item.type]"
                  class="course-list__list__tag"
                >{{
                  COURSE_TYPE_MAP[item.type]
                }}</span>
              </div>
            </div>
            <div class="course-list__list__divider"></div>
            <div class="course-list__list__rate">
              各项评分：<el-rate
                :value="calcRate(item.scope)"
                disabled
                show-score
                score-template="{value}"
              >
              </el-rate>
            </div>
          </li>
        </ul>
        <el-pagination
          :current-page="pageNo"
          :page-sizes="[8, 16, 24]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </template>
      <div
        v-if="!loading && _.isEmpty(courseList)"
        class="course-list__empty"
      >
        <img src="../../assets/images/nodata.png" />
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategories, getCourseList, getTeacherList } from '@/api/course'
import CategorySelect from './components/CategorySelect'
import LazySelect from '@/components/lazy-select/LazySelect.vue'
const COURSE_TYPE_MAP = {
  '1': '在线课程',
  '2': '面授课程',
  '3': '直播课程'
}
const COURSE_TYPE_LIST = [
  { label: '全部', value: '' },
  { label: '在线课程', value: '1' },
  { label: '面授课程', value: '2' },
  { label: '直播课程', value: '3' }
]
const COURSE_CHOICE_LIST = [
  { label: '精选推荐', value: '1' },
  { label: '最新课程', value: '2' },
  { label: '热门课程', value: '3' }
]
export default {
  name: 'CourseList',
  components: {
    CategorySelect,
    LazySelect
  },
  data() {
    return {
      params: {
        catalogId: null,
        courseName: '',
        type: '',
        pageSize: 8,
        choice: '1'
      },
      extraParams: {
        tearchId: null
      },
      pageNo: 1,
      totalNum: 0,
      courseList: [],
      loading: false,
      teacherList: []
    }
  },
  computed: {
    COURSE_TYPE_MAP: () => COURSE_TYPE_MAP,
    COURSE_TYPE_LIST: () => COURSE_TYPE_LIST,
    COURSE_CHOICE_LIST: () => COURSE_CHOICE_LIST
  },
  watch: {
    params: {
      handler() {
        this.refreshData()
      },
      deep: true
    }
  },

  activated() {
    this.refreshData()
  },
  methods: {
    handleSizeChange(val) {
      this.params.pageSize = val
      this.refreshData()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.loadCourseList()
    },
    refreshData: _.debounce(function() {
      this.pageNo = 1
      this.loadCourseList()
    }, 300),
    resetExtraParams() {
      this.extraParams = {
        tearchId: null
      }
      this.refreshData()
    },
    loadCourseList() {
      this.loading = true
      getCourseList({ ...this.params, ...this.extraParams })
        .then((res) => {
          this.courseList = res.data
          this.totalNum = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadCategory({ id }) {
      return getCategories({ id })
    },
    loadTeacher(params) {
      return new Promise((resolve, reject) => {
        getTeacherList({
          currentPage: params.pageNo,
          size: params.pageSize,
          likeQuery: params.search
        })
          .then((res) => {
            resolve({ data: res.teacherInfos })
          })
          .catch(reject)
      })
    },
    handleCategoryChange(category) {
      this.params.catalogId = category.id
    },
    handleCourseTypeChange(type) {
      this.params.type = type
    },
    handleCourseChoiceChange(choice) {
      this.params.choice = choice
    },
    calcRate(rate) {
      let res
      res = parseFloat(rate)
      if (isNaN(res)) {
        return 0
      } else {
        return Number(res.toFixed(1))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.course-list__block {
  background: white;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
}
.course-list {
  &__filter {
    margin-top: 20px;
  }
  &__search {
    display: flex;
    margin-bottom: 14px;
  }
  &__input {
    width: 380px;
    margin-right: 16px;
  }
  &__filter-label {
    margin-right: 16px;
    color: rgba($primaryFontColor, 0.85);
  }
  &__filter-type {
    color: rgba($primaryFontColor, 0.85);
    ul {
      display: inline;
      li {
        cursor: pointer;
        display: inline-block;
        margin-right: 16px;
        &.active {
          color: $primaryColor;
        }
      }
    }
  }
  &__filter-divider {
    width: 100%;
    height: 1px;
    background-color: $mainLineGray;
    margin: 16px 0 24px 0;
  }
}
.course-list-choice {
  margin-top: 20px;
  padding: 16px 24px;

  color: rgba($primaryFontColor, 0.85);
  ul {
    display: inline;
    li {
      position: relative;
      cursor: pointer;
      display: inline-block;
      margin-right: 32px;
      &.active {
        color: $primaryColor;
        font-weight: 500;
        &::after {
          content: ' ';
          height: 2px;
          background-color: $primaryColor;
          width: 100%;
          position: absolute;
          bottom: -16px;
          left: 0;
        }
      }
    }
  }
}
.course-list__empty {
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  img {
    display: block;
  }
}
.course-list__list {
  margin-top: 20px;
  min-height: 500px;
  ul {
    display: grid;
    grid-gap: 20px;
    grid-template: repeat(2, 300px) / repeat(4, 1fr);
  }
  li {
    border-radius: 4px;
    overflow: hidden;
    background: white;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }
  &__img {
    height: 170px;
    overflow: hidden;
    /deep/.el-image {
      width: 100%;
      height: 170px;
    }
    /deep/ .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
      font-size: 14px;
      i {
        font-size: 30px;
      }
    }
    img {
      min-height: 170px;
      width: 100%;
    }
  }
  &__content {
    font-size: 12px;
    padding: 16px 16px 0 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  &__title {
    flex-grow: 1;
    color: $primaryFontColor;
    font-size: 14px;
    font-weight: 500;
  }
  &__info {
    color: rgba($primaryFontColor, 0.65);
    margin-top: 8px;
    line-height: 18px;
  }
  &__teacher {
    margin-right: 16px;
  }
  &__tag {
    padding: 2px 8px;
    float: right;
    background-color: #f5f5f6;
  }
  &__divider {
    height: 1px;
    background-color: $mainLineGray;
    margin-top: 9px;
    margin-bottom: 10px;
  }
  &__rate {
    color: rgba($primaryFontColor, 0.45);
    padding: 0 16px;
    padding-bottom: 12px;
  }
  .el-rate {
    display: inline-block;
  }
  /deep/.el-rate__text {
    color: rgba($primaryFontColor, 0.45) !important;
  }
  /deep/.el-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
<style lang="scss">
.course-list-filter-pop {
  &__wrap {
    padding: 12px 4px;
  }
  &__label {
    margin-bottom: 8px;
  }
  &__footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      padding: 9px 13px;
    }
  }
}
</style>
