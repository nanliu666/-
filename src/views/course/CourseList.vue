<template>
  <div class="course-list">
    <div class="course-list__filter course-list__block">
      <div class="course-list__search">
        <div>
          <el-input
            v-model="params.courseName"
            class="course-list__input"
            clearable
            placeholder="查找课程"
            suffix-icon="el-icon-search"
          />
        </div>

        <div class="course-list-filter-pop__wrap">
          <div class="course-list-filter-pop__label">讲师：</div>
          <div>
            <lazy-select
              v-model="extraParams.teacherId"
              :load="loadTeacher"
              style="width: 100%"
              placeholder="请选择"
              searchable
              :remote-method="loadTeacher"
              :option-props="{
                label: 'name',
                value: 'idStr',
                key: 'idStr'
              }"
              popper-class="father"
            ></lazy-select>
          </div>
          <div class="course-list-filter-pop__footer">
            <el-button type="primary" size="mini" @click="refreshData"> 确定 </el-button>
            <el-button class="Reset" size="mini" @click="resetExtraParams"> 重置 </el-button>
          </div>
        </div>
      </div>
      <div class="course-list__filter-divider"></div>
      <category-select :load="loadCategory" @change="handleCategoryChange"></category-select>
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
    <div v-loading="loading" class="course-list__list">
      <template v-if="!loading && !_.isEmpty(courseList)">
        <ul>
          <li v-for="item in courseList" :key="item.courseId" @click="handleCourseClick(item)">
            <div class="course-list__list__img">
              <el-image :src="item.coverUrl">
                <div slot="error" class="image-slot">
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
                <span v-if="COURSE_TYPE_MAP[item.type]" class="course-list__list__tag">{{
                  COURSE_TYPE_MAP[item.type]
                }}</span>
              </div>
            </div>

            <div class="course-list__list__rate">
              <span class="textLable">各项评分：</span>              
              <el-rate
                :value="calcRate(item.scope)"
                style="float:left;"
                disabled
                show-score
                score-template="{value}"
              >
              </el-rate>
              <span class="knowledgeSystemName" :title="item.knowledgeSystemName">{{ item.knowledgeSystemName }}</span>
            </div>
          </li>
        </ul>
        <el-pagination
          :current-page="pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </template>
      <div v-if="!loading && _.isEmpty(courseList)" class="course-list__empty">
        <img src="../../assets/images/nodata.png" />
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCategories, getCourseList, listForegroundTeacherComboBox } from '@/api/course'
import CategorySelect from './components/CategorySelect'
import LazySelect from '@/components/lazy-select/LazySelect.vue'
import { COURSE_TYPE_MAP } from './config'

const COURSE_TYPE_LIST = [
  { label: '全部', value: '' },
  { label: '在线课程', value: '1' },
  { label: '面授课程', value: '2' },
  { label: '直播课程', value: '3' }
]
const COURSE_CHOICE_LIST = [
  { label: '精选推荐', value: '1' },
  { label: '最新课程', value: '2' },
  { label: '全部课程', value: '3' }
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
        // 查询课程列表初始化参数
        catalogId: null,
        courseName: '',
        knowledgeSystemId:'',
        type: 1,
        pageSize: 20,
        choice: '1'
      },
      extraParams: {
        teacherId: null
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
    handleCourseClick(item) {
      this.$router.push({ path: '/course/detail', query: { id: item.courseId } })
    },
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
    delExtraParams() {
      this.extraParams = {
        teacherId: null
      }
    },
    resetExtraParams() {
      this.extraParams = {
        teacherId: null
      }
      this.refreshData()
    },
    loadCourseList() {
      // 查询课程列表
      this.loading = true
      getCourseList({ ...this.params, ...this.extraParams, pageNo: this.pageNo })
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
    loadTeacher(i) {
      return new Promise((resolve, reject) => {
        listForegroundTeacherComboBox({
          pageNo: 1,
          pageSize: 10,
          name: i.search
          // likeQuery: params.search
        })
          .then((res) => {
            resolve({ data: res })
          })
          .catch(reject)
      })
    },
    handleCategoryChange(res) {
      this.params.catalogId = res.category.id
      this.params.knowledgeSystemId = res.knowledge.idStr
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
    /deep/.el-input__icon {
      line-height: 32px;
    }
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
  padding: 20px 24px;

  color: #000b15;
  opacity: 0.85;
  ul {
    display: inline;
    li {
      position: relative;
      cursor: pointer;
      display: inline-block;
      margin-right: 32px;
      &.active {
        color: #2875d4;
        font-weight: 500;
        &::after {
          content: ' ';
          height: 2px;
          background-color: #2875d4;
          width: 100%;
          position: absolute;
          bottom: -20px;
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
    grid-template: repeat(2, 280px) / repeat(4, 1fr);
  }
  li {
    border-radius: 4px;
    overflow: hidden;
    background: white;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition-duration: 0.3s;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0px 9px 12px 2px rgba(0.1, 63, 161, 0.12);
      .card-cover {
        visibility: visible !important;
      }
    }
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
    // flex-grow: 1;
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

  &__rate {
    margin-top: 16px;
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
.course-list__list__rate .textLable{float: left;}
.course-list__list__rate /deep/ .el-rate__item{transform:scale(0.7);}
.course-list__list__rate /deep/ .el-rate__icon{margin-right: 0px;}
.course-list__list__rate .knowledgeSystemName{float: right;display: block;width: 72px;overflow: hidden;text-overflow: ellipsis;word-wrap: inherit;text-align: right;}
.course-list-filter-pop {
  &__wrap {
    display: flex;
    padding: 0;
  }
  &__label {
    width: 85px;
    text-align: right;
    padding-top: 7px;
  }
  &__footer {
    margin-top: 0;
    margin-left: 24px;
    display: flex;
    justify-content: flex-end;
    height: 32px;
    .Reset {
      margin-left: 16px;
    }
  }
}
/deep/.el-input__inner {
  height: 32px;
}
</style>
<style lang="sass">
.father
  .el-scrollbar__thumb
    display: none
</style>
