<template>
  <div class="course-detail">
    <common-breadcrumb ref="breadcrumb" />
    <div class="course-detail--card course-detail__info">
      <div class="course-detail__info__img">
        <el-image :src="courseData.url">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <div class="course-detail__info__right">
        <div class="course-detail__info__name">
          {{ courseData.name }}
        </div>
        <div class="course-detail__info__info">
          <div class="course-detail__info__column">
            <span class="course-detail__info__label">
              讲师：
            </span>
            <span class="course-detail__info__value">
              {{ courseData.teacherName }}
            </span>
          </div>
          <span class="course-detail__info__column">
            <span class="course-detail__info__label">
              学分：
            </span>
            <span class="course-detail__info__value">
              {{ courseData.credit }}
            </span>
          </span>
        </div>
        <div class="course-detail__info__column">
          <span class="course-detail__info__label">
            课程类型：
          </span>
          <span class="course-detail__info__value">
            {{ COURSE_TYPE_MAP[courseData.type] || '' }}
          </span>
        </div>
        <div v-if="courseData.peirod" class="course-detail__info__column">
          <span class="course-detail__info__label">
            学时：
          </span>
          <span class="course-detail__info__value">
            {{ courseData.peirod }}
          </span>
        </div>
        <el-button type="primary" size="medium" @click="jumpToLearn(id, null)">
          立即学习
        </el-button>
      </div>
    </div>
    <div class="course-detail--card course-detail__detail">
      <el-tabs v-model="activeName">
        <el-tab-pane label="课程信息" name="first">
          <div v-show="courseData.introduction" v-html="_.unescape(courseData.introduction)" />
        </el-tab-pane>
        <el-tab-pane label="课程目录" name="second">
          <ul class="course-detail__chapters">
            <li
              v-for="(chapter, index) in chapters"
              :key="index"
              @click="jumpToLearn(id, chapter.contentId)"
            >
              <div class="course-detail__chapters--wrap">
                <span
                  class="course-detail__chapters--tag"
                  :style="{
                    color: _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, ''),
                    'border-color': _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, '')
                  }"
                >{{ _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.text`, '') }}</span>
                <span class="course-detail__chapters--title">{{ chapter.name }}</span>
              </div>
              <div class="course-detail__chapters--handler">
                <el-progress
                  type="circle"
                  :show-text="false"
                  :percentage="calcProcess(chapter)"
                  :width="14"
                  :stroke-width="2"
                ></el-progress>
                <span class="course-detail__chapters--status">{{ getChapterStatus(chapter) }}</span>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="课程评价" name="third">
          <Comment :load="loadCommentList" :submit="submitComment" name="课程" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import {
  getCourseDetail,
  getCommentList,
  addComment,
  getLearnRecord,
  addViewLog
} from '@/api/course'
import Comment from '@/components/common-comment/Comment'
import { COURSE_CHAPTER_TYPE_MAP, COURSE_TYPE_MAP } from './config'
import { mapGetters } from 'vuex'
export default {
  name: 'CourseDetail',
  components: { CommonBreadcrumb, Comment },
  data() {
    return {
      activeName: 'first',
      chapters: [],
      courseData: {
        url: null
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    COURSE_TYPE_MAP: () => COURSE_TYPE_MAP,
    COURSE_CHAPTER_TYPE_MAP: () => COURSE_CHAPTER_TYPE_MAP,
    ...mapGetters(['userInfo'])
  },
  activated() {
    this.loadDetail()
    this.loadChapters()
    this.activeName = 'first'
  },
  methods: {
    calcProcess(chapter) {
      return parseInt(chapter.progress) || 0
    },
    getChapterStatus(chapter) {
      if (chapter.progress == '0') {
        return '未学习'
      } else if (chapter.progress == '100') {
        return '已学习'
      } else {
        return '学习中'
      }
    },
    loadDetail() {
      if (!this.id) {
        return
      }
      getCourseDetail({ courseId: this.id }).then((res) => {
        this.courseData = res
        this.$nextTick(() => {
          this.$refs.breadcrumb.setBreadcrumbTitle(res.name)
        })
      })
    },
    loadChapters() {
      if (!this.id) {
        return
      }
      getLearnRecord({ courseId: this.id }).then((res) => {
        this.chapters = _.sortBy(res, 'sort')
      })
    },
    loadCommentList(params) {
      return getCommentList({ ...params, size: params.pageSize, courseId: this.id })
    },
    submitComment(params) {
      return addComment({ ...params, courseId: this.id })
    },
    jumpToLearn(courseId, chapterId = null) {
      addViewLog({
        coursePlanNo: courseId,
        coursePlanName: this.courseData.name,
        departmentId: this.userInfo.org_id,
        userName: this.userInfo.nick_name,
        tenantId: this.userInfo.tenant_id,
        workNo: this.userInfo.work_no
      })
      this.$router.push({ path: '/course/learn', query: { courseId, chapterId } })
    }
  }
}
</script>

<style lang="scss" scoped>
.course-detail {
  &--card {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 24px;
  }
  &__info {
    display: flex;
    &__img {
      width: 320px;
      .el-image {
        width: 320px;
        height: 180px;
        display: flex;
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
      }
    }
    &__right {
      flex: 1;
      display: block;
      padding-left: 40px;
    }
    &__name {
      font-size: 18px;
      color: $primaryFontColor;
      letter-spacing: 0;
      line-height: 28px;
    }
    &__info {
      margin-top: 8px;
      font-size: 1rem;
    }
    &__column {
      width: 50%;
      display: inline-block;
      text-align: left;
      line-height: 22px;
      margin-top: 8px;
    }
    &__label {
      color: rgba($primaryFontColor, 0.45);
    }
    &__value {
      color: rgba($primaryFontColor, 0.85);
    }
    .el-button {
      margin-top: 24px;
    }
  }
  &__detail {
    min-height: calc(100vh - #{$headerHeight} - 54px - 60px - 228px);
    margin-top: 20px;
    /deep/.el-tabs__item {
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      color: rgba($primaryFontColor, 0.65);
      &.is-active {
        color: $primaryColor;
      }
    }
  }
  &__chapters {
    li {
      display: flex;
      height: 48px;
      align-items: center;
      padding-left: 24px;
      padding-right: 21px;
      justify-content: space-between;
      cursor: pointer;
      border-bottom: 1px solid $mainLineGray;
      &:hover {
        background-color: rgba($primaryFontColor, 0.02);
      }
    }
    &--tag {
      font-size: 12px;
      letter-spacing: 0;
      border-radius: 4px;
      padding: 0 4px;
      color: $primaryFontColor;
      border: 1px solid $primaryFontColor;
      margin-right: 24px;
    }
    &--status {
      font-size: 12px;
      color: rgba($primaryFontColor, 0.45);
      margin-left: 8px;
    }
    &--handler {
      display: flex;
      align-items: center;
    }
  }
}
</style>
