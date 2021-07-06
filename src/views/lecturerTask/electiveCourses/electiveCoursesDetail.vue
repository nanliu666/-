<template>
  <div class="course-detail">
    <!-- <common-breadcrumb ref="breadcrumb" :route-list="routeList" /> -->

    <!-- <div class="breadcrumb_top">
      <span class="breadcrumb_title" @click="$router.push({ path: '/course' })">
        <text-over-tooltip
          class="course-detail__info__value"
          style="max-width:700px;"
          ref-name="testName1"
          class-name="fs20"
          :content="courseData.catalogName"
        ></text-over-tooltip>
      </span>
      <span class="breadcrumb_light">
        /
      </span>
      <span class="breadcrumb_text">
        <text-over-tooltip
          style="width:300px;"
          ref-name="testName1"
          class-name="fs20"
          :content="courseData.name"
        ></text-over-tooltip>
      </span>
    </div> -->

    <div class="entry_path">
      <p>
        <span class="especially" @click="$router.go(-1)"> 我的任务 / </span><span class="common">选修课详情 </span>
      </p>
    </div>

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
          <span>
            <text-over-tooltip
              style="width: 500px"
              ref-name="testName1"
              class-name="fs20"
              :content="courseData.name"
            ></text-over-tooltip>
          </span>
          <span class="myRate">
            <el-rate
              :value="+parseFloat(courseData.scope)"
              disabled
              show-score
              text-color="#878c91"
              score-template="{value}分"
            >
            </el-rate>
          </span>
        </div>
        <div v-if="courseData.credit" class="course-detail__info__column">
          <span class="course-detail__info__label"> 分类： </span>

          <text-over-tooltip
            class="course-detail__info__value"
            style="width: 700px"
            ref-name="testName1"
            class-name="fs20"
            :content="courseData.catalogName"
          ></text-over-tooltip>
        </div>
        <div class="course-detail__info__column">
          <span class="course-detail__info__label"> 讲师： </span>
          <span class="course-detail__info__value">
            {{ courseData.teacherName }}
          </span>
        </div>
        <!-- <div v-if="courseData.credit" class="course-detail__info__column">
          <span class="course-detail__info__label"> 积分： </span>
          <span class="course-detail__info__value">
            {{ courseData.credit }}
          </span>
        </div> -->
        <!-- <div v-if="courseData.period" class="course-detail__info__column">
          <span class="course-detail__info__label"> 学时： </span>
          <span class="course-detail__info__value">
            {{ courseData.period + 'h' }}
          </span>
        </div> -->
        <div class="info_number">
          <span> <i class="el-icon-user"></i> {{ courseData.studyPeople || 0 }}人 </span>
          <span> <i class="el-icon-time"></i> {{ courseData.period || 0 }} min </span>
          <span> <i class="el-icon-coin"></i> {{ courseData.credit || 0 }}积分 </span>
        </div>
        <el-button type="primary" size="medium" @click="jumpToLearn(id, null)">
          立即学习
        </el-button>
      </div>
    </div>
    <div class="course-detail--card course-detail__detail">
      <el-tabs v-model="activeName">
        <el-tab-pane v-if="lecturer" label="学习情况" name="study">
          <Study></Study>
        </el-tab-pane>

        <el-tab-pane label="课程介绍" name="first">
          <div
            v-show="courseData.introduction"
            class="introduction"
            v-html="_.unescape(courseData.introduction)"
          />
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
                <span class="course-detail__chapters--title">
                  <text-over-tooltip
                    ref-name="testName1"
                    class-name="fs20"
                    :content="chapter.name"
                  ></text-over-tooltip>

                  <!-- {{ chapter.name }} -->
                </span>
                <!-- <span class="course-detail__chapters--time">{{ getSecondesToHours(chapter) }}</span> -->
              </div>
              <!-- <div class="course-detail__chapters--handler">
                <el-progress
                  type="circle"
                  :show-text="false"
                  :percentage="calcProcess(chapter)"
                  :width="14"
                  :stroke-width="2"
                ></el-progress>
                <span class="course-detail__chapters--status">{{ getChapterStatus(chapter) }}</span>
              </div> -->
              <div class="course-detail__toDetail">查看内容</div>
            </li>
          </ul>

          <!-- 没有数据 -->
          <div v-if="chapters.length === 0" class="noData">
            <img src="../../../assets/images/nodata.png" style="max-width: 100%" />
            <div>暂无数据</div>
          </div>
        </el-tab-pane>
        <!-- 笔记 -->
        <el-tab-pane v-if="!lecturer" :label="`课程笔记(${noteTotalNum})`" name="Note">
          <div style="padding: 0 10px">
            <Note @totalNum="totalNum" />
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="!lecturer" label="学习心得" name="experience">
          <experience :course-name="courseData.name" />
        </el-tab-pane>
        <el-tab-pane label="课程评价" name="third">
          <Comment :load="loadCommentList" :submit="submitComment" name="课程" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import TextOverTooltip from '../../course/components/TextOverTooltip'
import moment from 'moment'
import {
  // getCourseDetail,
  getCommentList,
  addComment,
  getLearnRecord,
  addViewLog,
  addStudyTimes,
  getCourseStudyDetail
} from '@/api/course'
import Comment from './Comment'
import { COURSE_CHAPTER_TYPE_MAP, COURSE_TYPE_MAP } from '../../course/config'
import { mapGetters } from 'vuex'
import Experience from '../../course/components/Experience'
import Note from '../../course/components/Note'
import Study from '../../course/components/Study'
export default {
  name: 'CourseDetail',
  components: { Comment, Experience, Note, TextOverTooltip, Study },
  data() {
    return {
      noteTotalNum: '',
      routeList: [
        {
          path: '/course',
          title: '课程'
        },
        {
          path: '',
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ],
      activeName: 'first',
      chapters: [],
      lecturer: false,
      courseData: {
        url: null
      }
    }
  },
  computed: {
    id() {
      const id = _.get(this.$route, 'query.id', null)
      const route = `${id ? `${this.$route.path}?id=${id}` : `${this.$route.path}`}`
      _.set(this.routeList, '[1].path', route)
      return id
    },
    COURSE_TYPE_MAP: () => COURSE_TYPE_MAP,
    COURSE_CHAPTER_TYPE_MAP: () => COURSE_CHAPTER_TYPE_MAP,
    ...mapGetters(['userInfo'])
  },
  activated() {
    this.loadDetail()
    this.loadChapters()
    this.activeName = this.$route.query.lecturer ? 'study' : 'first'
  },
  mounted() {},
  methods: {
    totalNum(i) {
      this.noteTotalNum = i
    },
    getSecondesToHours(chapter) {
      // 秒变成时分秒
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      let isVideo = regx.test(chapter.content)
      if (!isVideo) {
        return ''
      }
      let timeObj = moment.duration(chapter.duration * 1000, 'milliseconds')._data
      let timeBack = `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds} `
      return timeBack
    },
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
      this.lecturer = this.$route.query.lecturer
      getCourseStudyDetail({ courseId: this.id }).then((res) => {
        res.scope = Number(res.scope).toFixed(1)
        this.courseData = res
        let titleArr = res.catalogName || '课程'
        titleArr = titleArr.split('/')
        let titleStr = titleArr.join(' / ')
        this.routeList[0].title = titleStr
        // this.$nextTick(() => {
        //   this.$refs.breadcrumb.setBreadcrumbTitle(res.name)
        // })
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
      if (!this.$route.query.studyPlanId && !this.$route.query.trainId) {
        // 如果不是 我的任务-必须课 跟 我的任务-培训 才掉这个接口
        addViewLog({
          courseId: courseId,
          courseName: this.courseData.name,
          departmentId: this.userInfo.org_id,
          userName: this.userInfo.nick_name,
          tenantId: this.userInfo.tenant_id,
          workNo: this.userInfo.work_no
        })
      }
      // 记录次数
      addStudyTimes({ courseId: courseId })
      this.$router.push({
        path: '/course/learn',
        query: {
          courseId,
          chapterId,
          studyPlanId: this.$route.query.studyPlanId || '',
          trainId: this.$route.query.trainId || ''
        }
      })
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
      width: 480px;
      height: 270px;
      border-radius: 4px;
      flex-shrink: 0;
      overflow: hidden;
      ::v-deep .el-image {
        width: 480px;
        height: 270px;
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
      padding-left: 24px;
    }
    &__name {
      font-size: 18px;
      color: #000b15;
      letter-spacing: 0;
      line-height: 28px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      .myRate {
        font-size: 12px;
        line-height: 19px;
        color: #878c91;
        flex: 1;
      }
    }

    &__column {
      text-align: left;
      line-height: 22px;
      margin-top: 8px;
      display: flex;
    }
    &__label {
      color: rgba($primaryFontColor, 0.45);
      font-size: 14px;
      letter-spacing: 0;
      line-height: 22px;
      width: 70px;
    }
    &__value {
      font-size: 14px;
      color: #000b15;
      letter-spacing: 0;
      line-height: 22px;
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
      width: 100%;
      display: flex;
      height: 48px;
      align-items: center;
      padding-left: 24px;
      padding-right: 21px;
      justify-content: space-between;
      cursor: pointer;
      border-bottom: 1px solid $mainLineGray;
      .course-detail__toDetail {
        display: none;
        color: #53aafc;
      }
      &:hover {
        background-color: rgba($primaryFontColor, 0.02);
        .course-detail__toDetail {
          display: block;
        }
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
    &--time {
      padding: 0 20px;
      color: $primaryFontColor;
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
  .info_number {
    display: flex;
    margin-top: 24px;
    span {
      margin-right: 24px;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0.5px;
      line-height: 22px;
      vertical-align: text-bottom;
      i {
        color: #8c9196;
      }
    }
  }
}

.course-detail__chapters--title {
  display: inline-block;
  width: 900px;
}
.noData {
  text-align: center;
}
.breadcrumb_top {
  padding: 20px 0 15px;
  display: flex;
  .breadcrumb_title {
    color: #252e37;
    font-weight: bold;
    cursor: pointer;
  }
  .breadcrumb_light {
    line-height: 20px;
    margin: 0 3px;
    color: #252e37;
    font-weight: bold;
  }
  .breadcrumb_text {
    color: #606266;
  }
}
.introduction {
  word-wrap: break-word;
  word-break: break-all;
}
.entry_path {
  // 头部路径标识
  height: 62px;
  display: flex;
  align-items: center;
  .common {
    color: rgba(0, 11, 21, 0.45);
  }
  .especially {
    color: rgba(0, 11, 21, 0.85);
    font-weight: bold;
    cursor: pointer;
  }
}
::v-deep .elInput.el-input.el-input--suffix {
  width: 380px;
  height: 32px;
}
::v-deep input.el-input__inner {
  height: 32px;
}
::v-deep button.el-button.select-btn.el-button--default.el-button--medium.el-popover__reference {
  padding: 8px 20px;
}
</style>
