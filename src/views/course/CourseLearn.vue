<template>
  <div class="course-learn">
    <div class="course-learn__header">
      <i
        class="iconimage_icon_leftarrow iconfont"
        @click="goBack()"
      ></i>
      <span class="course-learn__header__title">
        {{ course.name }}
      </span>
    </div>
    <div class="course-learn__main">
      <div class="left-bar">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleMenuChange"
        >
          <el-menu-item index="1">
            目录
          </el-menu-item>
          <el-menu-item index="2">
            笔记
          </el-menu-item>
        </el-menu>
        <div class="left-bar__main">
          <div
            v-show="activeIndex === '1'"
            class="chapters"
          >
            <ul>
              <li
                v-for="(chapter, index) in chapters"
                :key="index"
                :class="{ 'is-active': isActive(chapter) }"
                @click="handleChapterClick(chapter)"
              >
                <div class="chapters__wrap">
                  <span
                    class="chapters__tag"
                    :style="{
                      color: _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, ''),
                      'border-color': _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, '')
                    }"
                  >{{ _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.text`, '') }}</span>
                  <span class="chapters__title">{{ chapter.name }}</span>
                </div>
                <div class="chapters__handler">
                  <el-progress
                    type="circle"
                    :show-text="false"
                    :percentage="calcProcess(chapter)"
                    :width="14"
                    :stroke-width="2"
                  ></el-progress>
                  <span class="chapters__status">{{ getChapterStatus(chapter) }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-show="activeIndex === '2'"
            class="left-bar__notes"
          >
            <el-input
              v-model="note"
              type="textarea"
              placeholder="记录你的想法吧～"
              maxlength="200"
              show-word-limit
              resize="none"
              :rows="5"
            ></el-input>
            <el-button
              v-loading="submitting"
              type="primary"
              size="medium"
              @click="submitNote"
            >
              保存
            </el-button>
            <ul class="notes-list">
              <li
                v-for="item in notes"
                :key="item.noteId"
                class="note"
              >
                <div class="note__top">
                  <span class="note__user">
                    <el-avatar
                      :size="24"
                      :src="circleUrl"
                    ></el-avatar>
                    <span class="note__username">{{ 'VIP用户AA' }}</span>
                  </span>
                  <span class="note__time">{{ item.createTime }}</span>
                </div>
                <div class="note__remark">
                  {{ item.remark }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="main-content"></div>
    </div>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import { getCourseDetail, getLearnRecord, getNotesList, addNote } from '@/api/course'
const COURSE_CHAPTER_TYPE_MAP = {
  '1': { text: '文章', color: variables.primaryColor },
  '2': { text: '课件', color: '#FC7C01' },
  '3': { text: '资料下载', color: '#FF4329' },
  '4': { text: '考试', color: '#FCBA00' },
  '5': { text: '视频', color: '#00B061' }
}
export default {
  name: 'CourseLearn',
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      activeIndex: '1',
      submitting: false,
      course: {},
      chapters: [],
      currentChapter: {},
      notes: [],
      note: ''
    }
  },
  computed: {
    courseId() {
      return this.$route.query.courseId
    },
    chapterId() {
      return this.$route.query.chapterId
    },
    COURSE_CHAPTER_TYPE_MAP: () => COURSE_CHAPTER_TYPE_MAP
  },
  activated() {
    this.loadCourseDetail()
    this.loadChapters()
    this.loadNoteList()
    this.activeIndex = '1'
  },
  methods: {
    handleMenuChange(index) {
      this.activeIndex = index
    },
    isActive(chapter) {
      return this.currentChapter.contentId === chapter.contentId
    },
    handleChapterClick(chapter) {
      this.currentChapter = chapter
    },
    calcProcess(chapter) {
      if (chapter.type !== '5') {
        if (chapter.progress == 1) {
          return 100
        } else {
          return 0
        }
      } else {
        return parseInt(chapter.progress)
      }
    },
    getChapterStatus(chapter) {
      if (chapter.progress !== '5') {
        if (chapter.progress == 1) {
          return '已学习'
        } else {
          return '未学习'
        }
      } else {
        if (chapter.progress == '0') {
          return '未学习'
        } else if (chapter.progress == '100') {
          return '已学习'
        } else {
          return '学习中'
        }
      }
    },
    loadCourseDetail() {
      if (!this.courseId) {
        return
      }
      getCourseDetail({ courseId: this.courseId }).then((res) => {
        this.course = res
      })
    },
    loadChapters() {
      if (!this.courseId) {
        return
      }
      getLearnRecord({ courseId: this.courseId }).then((res) => {
        this.chapters = res
        if (this.chapterId) {
          this.currentChapter = _.find(res, (item) => item.contentId === this.chapterId) || {}
        }
      })
    },
    loadNoteList() {
      if (!this.courseId) {
        return
      }
      getNotesList({ courseId: this.courseId }).then((res) => {
        this.notes = res
      })
    },
    submitNote() {
      if (!this.note) {
        return
      }
      this.submitting = true
      addNote({ courseId: this.courseId, remark: this.note })
        .then(() => {
          this.note = ''
          this.loadNoteList()
        })
        .finally(() => {
          this.submitting = false
        })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.course-learn {
  &__header {
    height: 64px;
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    background-color: white;
    line-height: 64px;
    padding-left: 36px;
    color: rgba($primaryFontColor, 0.85);
    display: flex;
    align-items: center;
    font-size: 18px;
    i {
      font-size: 18px;
      cursor: pointer;
      margin-right: 10px;
    }
  }
  &__main {
    margin: 20px;
    height: calc(100vh - 64px - 40px);
    .left-bar {
      width: 384px;
      margin-right: 4px;
      display: inline-block;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      border-radius: 4px 0 0 4px;
      background: #ffffff;
      height: 100%;
      overflow: hidden;
      /deep/ .el-menu {
        display: flex;
        justify-content: center;
      }
      /deep/ .el-menu-item {
        padding: 0;
        margin: 0 20px;
        color: $primaryFontColor;
      }
      /deep/ .el-menu--horizontal > .el-menu-item.is-active {
        color: $primaryColor;
      }
      /deep/ .el-menu.el-menu--horizontal {
        border-bottom: 1px solid $mainLineGray;
      }
      &__main {
        height: calc(100% - 61px);
      }

      .chapters {
        height: 100%;
        ul {
          height: 100%;
          overflow: auto;
        }
        li {
          display: flex;
          height: 44px;
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
        &__tag {
          font-size: 12px;
          letter-spacing: 0;
          line-height: 18px;
          border-radius: 4px;
          padding: 0 4px;
          color: $primaryFontColor;
          border: 1px solid $primaryFontColor;
          margin-right: 8px;
        }
        &__status {
          font-size: 12px;
          color: rgba($primaryFontColor, 0.45);
          margin-left: 8px;
        }
        &__handler {
          display: flex;
          align-items: center;
        }
      }
      &__notes {
        padding: 24px;
        height: 100%;
        .el-button {
          margin-top: 13px;
          float: right;
        }
        .notes-list {
          overflow: auto;
          clear: both;
          padding-top: 20px;
          max-height: calc(100% - 164px);
        }
        .note {
          margin-bottom: 24px;
          &__top {
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          &__user {
            display: flex;
            align-items: center;
          }
          &__username {
            margin-left: 8px;
          }
        }
      }
    }
    .main-content {
      display: inline-block;
      width: calc(100% - 388px);
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      // border-radius: 0 4px 4px 0;
      background: #ffffff;
      height: 100%;
    }
  }
}
</style>
