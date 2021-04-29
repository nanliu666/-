<template>
  <div id="course-learn-id" class="course-learn">
    <div class="course-learn__header">
      <i class="iconimage_icon_leftarrow iconfont" @click="goBack()"></i>
      <span class="course-learn__header__title">
        {{ course.name }}
      </span>
    </div>
    <div class="course-learn__main">
      <div :class="['left-bar', { hidden: leftHidden }]">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleMenuChange">
          <el-menu-item index="1">
            目录
          </el-menu-item>
          <el-menu-item index="2">
            笔记
          </el-menu-item>
        </el-menu>
        <div class="left-bar__main">
          <div v-show="activeIndex === '1'" class="chapters">
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
                  <span class="chapters__title">
                    <!-- {{ chapter.name }} -->
                    <text-over-tooltip
                      ref-name="testName1"
                      class-name="fs20"
                      :content="chapter.name"
                    ></text-over-tooltip>
                  </span>
                </div>
                <div class="chapters__handler">
                  <el-progress
                    v-if="!isActive(chapter)"
                    type="circle"
                    :show-text="false"
                    :percentage="calcProcess(chapter)"
                    :width="16"
                    :stroke-width="2"
                  ></el-progress>
                  <i v-else class="iconimage_icon_time1 iconfont"></i>
                  <span class="chapters__status">{{ getChapterStatus(chapter) }}</span>
                </div>
              </li>
            </ul>
          </div>
          <!-- 笔记 -->
          <div v-show="activeIndex === '2'" class="left-bar__notes">
            <!-- <el-input
              v-model="note"
              type="textarea"
              placeholder="记录你的想法吧～"
              maxlength="200"
              show-word-limit
              resize="none"
              :rows="5"
            ></el-input>
            <el-button v-loading="submitting" type="primary" size="medium" @click="submitNote">
              保存
            </el-button>
            <ul class="notes-list">
              <li v-for="item in notes" :key="item.noteId" class="note">
                <div class="note__top">
                  <span class="note__user">
                    <el-avatar :size="24" :src="userInfo.avatar_url || circleUrl"></el-avatar>
                    <span class="note__username">{{ userInfo.nick_name }}</span>
                  </span>
                  <span class="note__time">{{ item.createTime }}</span>
                </div>
                <div class="note__remark">
                  {{ item.remark }}
                </div>
              </li>
            </ul> -->
            <Note :show-add="true" :current-chapter="currentChapter"></Note>
          </div>
        </div>
      </div>

      <div
        ref="content"
        :class="['main-content', { fullwidth: leftHidden }]"
        :style="`${currentChapter.type == '5' ? 'overflow:hidden;' : ''}`"
      >
        <div class="collapse-btn" @click="collapseLeft()">
          <i v-if="!leftHidden" class="iconimage_icon_Doubleleftarrow iconfont"></i>
          <i v-else class="iconimage_icon_Doublerightarrow iconfont"></i>
        </div>
        <!-- <div
          v-if="currentChapter.type != '4'"
          class="detailTitel"
          v-html="_.unescape(_.unescape(currentChapter.localName))"
        ></div> -->
        <!-- 文章类型 -->
        <div
          v-if="currentChapter.type == '1'"
          class="content--richtext"
          v-html="_.unescape(_.unescape(currentChapter.content))"
        ></div>
        <!-- 课件 -->
        <div v-if="currentChapter.type == '2'" class="content--iframe">
          <video
            v-if="isVideo"
            ref="videoRef"
            controlslist="nodownload"
            autoplay
            preload
            controls
            :src="currentChapter.content"
            :height="contentHeight"
            :width="contentWidth"
            style="width:100%;"
          ></video>
          <div v-if="!isVideo" style=" height:100%">
            <div v-if="getFileType(currentChapter.content) == 'txt'" ref="currentTXT"></div>
            <img
              v-else-if="/(jpg|png|gif)$/.test(getFileType(currentChapter.content))"
              ref="currentImg"
              :src="currentSrc"
            />
            <iframe v-else :src="currentSrc" width="100%" height="100%" frameborder="0"></iframe>
          </div>
        </div>
        <!--资料-->
        <div v-if="currentChapter.type == '3'" class="content--download">
          <div class="img-wr">
            <img :src="getFileImageUrl(currentChapter.content)" />
          </div>
          <div class="download-wr">
            <div class="file-name">
              {{ currentChapter.localName }}
            </div>
            <a target="_blank" :href="currentChapter.content">
              <el-button type="primary" size="medium">立即下载</el-button>
            </a>
          </div>
        </div>
        <!--考试-->
        <div v-if="currentChapter.type == '4'" class="content--test">
          <Task :task-data="currentChapter" @uploadTask="uploadTask" />
        </div>

        <!-- 课前思考 -->
        <div v-if="currentChapter.type == '5'" class="content--richtext">
          <div
            style="overflow-y:auto;"
            v-html="_.unescape(_.unescape(currentChapter.content))"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toPercent } from '@/util/util'
import {
  getCourseDetail,
  getLearnRecord,
  getNotesList,
  addNote,
  updateLearnRecord
} from '@/api/course'
import { COURSE_CHAPTER_TYPE_MAP } from './config'
import Task from './components/Task'
import TextOverTooltip from './components/TextOverTooltip'
import Note from './components/Note'
const axios = require('axios/index')

export default {
  name: 'CourseLearn',
  components: { Task, TextOverTooltip, Note },
  data() {
    return {
      currentSrc: '',
      timer: null,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      activeIndex: '1',
      submitting: false,
      course: {},
      chapters: [],
      currentChapter: {},
      notes: [],
      note: '',
      leftHidden: false,
      pageIndex: -1,
      chapterTime: 0 //章节停留时间,
    }
  },
  computed: {
    courseId() {
      return this.$route.query.courseId
    },
    chapterId() {
      return this.$route.query.chapterId
    },
    contentWidth() {
      return this.$refs.content.offsetWidth
    },
    contentHeight() {
      return this.$refs.content.offsetHeight
    },
    isVideo() {
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      return regx.test(this.currentChapter.content)
    },
    COURSE_CHAPTER_TYPE_MAP: () => COURSE_CHAPTER_TYPE_MAP,
    ...mapGetters(['userInfo'])
  },
  watch: {
    currentChapter(newVal, oldVal) {
      if (!this.isVideo) {
        this.getContentUrl(newVal)
      }
      // if (this.isChapterVideo(oldVal) && oldVal.duration) {
      //   this.updateVideoProgress(oldVal)
      //   this.setDuration()
      //   this.$nextTick(() => {
      //     this.videoTimerFn()
      //   })
      // }
      // if (!this.isChapterVideo(newVal) && newVal.type != 4) {
      //   newVal.progress = 100
      // }
      // this.submitLearnRecords()

      if (this.isChapterVideo(oldVal) && oldVal.duration) {
        let videoDom = document.querySelector('video')
        videoDom.onended = () => {
          this.updateVideoProgress()
          this.submitLearnRecords()
        }
      }
      if (!this.isChapterVideo(newVal) && newVal.type != 4) {
        newVal.progress = 100
      }
      if (newVal !== oldVal) {
        clearInterval(this.timer)
        this.chapterTime = 0
        this.timer = setInterval(() => {
          this.chapterTime = 30
          this.updateVideoProgress()
          this.submitLearnRecords()
        }, 30 * 1000)
      }
    }
  },
  mounted() {
    this.cancelRightClick()
  },
  activated() {
    this.reset()
    this.loadCourseDetail()
    this.loadChapters()
    this.loadNoteList()
    this.isFirst = true
    // this.setTimer()
    this.cancelRightClick()
  },
  beforeRouteLeave(from, to, next) {
    this.updateVideoProgress(this.currentChapter)
    this.submitLearnRecords()
    clearInterval(this.timer)
    next()
  },
  methods: {
    getFileType(url) {
      let type = url.split('.')
      type = type[type.length - 1]
      return type
    },
    cancelRightClick() {
      // 取消右击
      document.getElementById('course-learn-id').oncontextmenu = function() {
        return false
      }
    },
    // 上传完作业回调
    uploadTask(contentId) {
      this.$nextTick(() => {
        this.chapters.forEach((item, index) => {
          if (item.contentId == contentId) {
            this.chapters[index].progress = 100
            // console.log(contentId)
            // console.log(this.chapters)
            this.submitLearnRecords()
          }
        })
      })
    },
    /**
     * 更新视频播放进度
     */
    updateVideoProgress() {
      if (!this.$refs.videoRef) {
        return
      }
      // let progress = Number(
      //   ((this.$refs.videoRef.currentTime / this.currentChapter.duration) * 100).toFixed()
      // )  偶现  Infinity

      this.chapters.forEach((val) => {
        if (val.contentId === this.currentChapter.contentId) {
          let progress = 0
          if (this.isChapterVideo(this.currentChapter)) {
            progress = toPercent(this.$refs.videoRef.currentTime, this.currentChapter.duration)
          }
          val.progress = progress > val.progress ? progress : val.progress
        }
      })
      //chapter.progress = progress > chapter.progress ? progress : chapter.progress
    },
    // 下载资料
    getFileImageUrl(url = '') {
      const fileDict = {
        doc: 'word',
        rar: 'rar',
        zip: 'rar',
        xls: 'excel',
        xlsx: 'excel',
        ppt: 'ppt',
        pdf: 'PDF'
      }

      let ext = url.match(/\..+/)[0]
      return `/img/file/image_icon_${fileDict[ext] || 'other'}.png`
    },
    // 非视频课件
    getContentUrl(chapter) {
      const office = /.*\.(doc|docx|xls|xlsx|ppt|pptx)$/
      if (office.test(chapter.content)) {
        this.currentSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURI(
          chapter.content
        )}`
      }

      const officeTxtImg = /.*\.(jpg|png|gif|txt|TXT)$/
      if (officeTxtImg.test(chapter.content)) {
        this.genSrc(chapter.content)
      }
      return chapter.content
    },
    genSrc(url) {
      axios.get(url).then((res) => {
        const { data } = res
        if (/(jpg|png|gif)$/.test(this.getFileType(url))) {
          // img
          this.$nextTick(() => {
            this.currentSrc = url
          })
        } else {
          this.$nextTick(() => (this.$refs.currentTXT.innerHTML = data))
        }
      })
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
          resolve(e.target.result)
        }
        // readAsDataURL
        fileReader.readAsDataURL(blob)
        fileReader.onerror = () => {
          reject(new Error('blobToBase64 error'))
        }
      })
    },
    // 每1分钟收集一下进度
    // setTimer() {
    //   this.timer = setInterval(() => {
    //     this.updateVideoProgress()
    //     this.submitLearnRecords()
    //     // }, 10000)
    //   }, 1 * 60 * 1000)
    // },
    // 视频看完更新一下
    // videoTimerFn() {
    //   if (this.currentChapter.duration) {
    //     this.timer = setInterval(() => {
    //       this.chapters.map((val) => {
    //         if (val.contentId === this.currentChapter.contentId) {
    //           val.progress = 100
    //         }
    //       })

    //       this.updateVideoProgress()
    //       this.submitLearnRecords()
    //     }, this.currentChapter.duration * 1000)
    //   }
    // },
    //  初始化
    reset() {
      this.leftHidden = false
      this.activeIndex = '1'
    },
    collapseLeft() {
      this.leftHidden = !this.leftHidden
    },
    handleMenuChange(index) {
      this.activeIndex = index
    },
    isActive(chapter) {
      return this.currentChapter.contentId === chapter.contentId
    },
    isChapterVideo(chapter) {
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      return regx.test(chapter.content)
    },
    async handleChapterClick(chapter) {
      // this.pageIndex -= 1
      await this.updateVideoProgress()
      await this.submitLearnRecords()
      this.currentChapter = chapter
    },
    // 进度
    calcProcess(chapter) {
      if (!this.isChapterVideo(chapter)) {
        // 兼容旧数据，现在视频以外的类型进度都是100，之前是1
        if (chapter.progress > 0) {
          return 100
        } else {
          return 0
        }
      } else {
        return parseInt(chapter.progress)
      }
    },
    // 进度状态
    getChapterStatus(chapter) {
      if (this.isActive(chapter)) {
        return '正在学'
      }
      if (!this.isChapterVideo(chapter)) {
        if (chapter.progress == 100) {
          return '已学习'
        } else {
          return '未学习'
        }
      } else {
        if (chapter.progress == '0') {
          return '未学习'
        } else if (chapter.progress == 100) {
          return '已学习'
        } else {
          return '学习中'
        }
      }
    },
    // 获取课程信息
    loadCourseDetail() {
      if (!this.courseId) {
        return
      }
      getCourseDetail({ courseId: this.courseId }).then((res) => {
        this.course = res
      })
    },
    //更新学员学习课程记录
    submitLearnRecords() {
      // let period = 5
      // if (this.isFirst) {
      //   period = 0
      //   this.isFirst = false
      // }
      let params = { period: this.chapterTime, courseId: this.courseId }
      params.contentRecords = _.map(
        this.chapters,
        (chapter) => `${chapter.contentId}:${chapter.progress >= 100 ? 100 : chapter.progress}`
      ).join(',')
      if (!params.contentRecords) {
        return
      }
      // console.log(params)
      updateLearnRecord(params)
        .then()
        .catch()
    },
    // 查询学员学习课程记录
    loadChapters() {
      if (!this.courseId) {
        return
      }
      getLearnRecord({ courseId: this.courseId }).then((res) => {
        this.chapters = _.sortBy(res, 'sort')
        _.forEach(this.chapters, (chapter) => {
          if (this.isChapterVideo(chapter)) {
            // chapter.content =
            //   'https://oa-file-dev.bestgrand.com.cn/b8a6256a5a31464fa28a3ae46992e850.mp4'
            this.setDuration(chapter).catch()
          }
          // if (chapter.type == '2') {
          // chapter.content = 'http://ieee802.org:80/secmail/docIZSEwEqHFr.doc'
          // chapter.content =
          //   'https://oa-file-dev.bestgrand.com.cn/7f6c5943b4d14733b61f7efaa7b4ec30.txt'
          // }
          if (chapter.contentId == this.chapterId) {
            this.currentChapter = chapter
          }
          // console.log(this.chapters)
        })
      })
    },
    // 请求七牛云获取视频时长(单位秒)
    setDuration(chapter) {
      return new Promise((resolve, reject) => {
        axios
          .get(chapter.content + '?avinfo')
          .then((res) => {
            const duration = _.get(res, 'data.format.duration', null)
            chapter.duration = parseInt(duration)
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 查询课程笔记
    loadNoteList() {
      if (!this.courseId) {
        return
      }
      getNotesList({ courseId: this.courseId }).then((res) => {
        this.notes = res
      })
    },
    // 添加课程笔记
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
      // 当go(-1)不执行，就执行下面路由跳转
      this.$router.push({ path: '/course/detail', query: { id: this.courseId } })
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
    height: calc(100vh - #{$headerHeight} - 40px);
    .left-bar {
      width: 384px;
      margin-right: 4px;
      display: inline-block;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      border-radius: 4px 0 0 4px;
      background: #ffffff;
      height: 100%;
      overflow: hidden;
      transition: width 0.3s;
      &.hidden {
        width: 0;
        margin-right: 0;
        border: none;
      }
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
        width: 384px;
      }

      .chapters {
        &__title {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 11vw;
        }
        height: 100%;
        ul {
          height: 100%;
          overflow: auto;
        }
        li {
          display: flex;
          align-items: center;
          padding-left: 24px;
          padding-right: 21px;
          min-height: 44px;
          padding-top: 6px;
          padding-bottom: 6px;
          justify-content: space-between;
          cursor: pointer;
          border-bottom: 1px solid $mainLineGray;
          &:hover {
            background-color: rgba($primaryFontColor, 0.02);
          }
          &.is-active {
            color: $primaryColor;
            background-color: rgba($primaryColor, 0.05);
            .chapters__status {
              color: $primaryColor;
            }
          }
        }
        &__wrap {
          line-height: 16px;
          display: flex;
          // align-items: center;
        }
        &__tag {
          font-size: 12px;
          letter-spacing: 0;
          border-radius: 4px;
          padding: 0 4px;
          color: $primaryFontColor;
          border: 1px solid $primaryFontColor;
          margin-right: 8px;
          margin-top: -2px;
        }
        &__status {
          font-size: 12px;
          color: rgba($primaryFontColor, 0.45);
          margin-left: 8px;
        }
        &__handler {
          display: flex;
          width: 60px;
          // align-items: center;
          i {
            font-size: 16px;
            color: $primaryColor;
          }
        }
      }
      &__notes {
        overflow: auto;

        padding: 20px;
        height: 100%;
        //   .el-button {
        //     margin-top: 13px;
        //     float: right;
        //   }
        //   .notes-list {
        //     overflow: auto;
        //     clear: both;
        //     padding-top: 20px;
        //     max-height: calc(100% - 164px);
        //   }
        //   .note {
        //     margin-bottom: 24px;
        //     word-break: break-all;
        //     &__top {
        //       margin-bottom: 16px;
        //       display: flex;
        //       align-items: center;
        //       justify-content: space-between;
        //     }
        //     &__user {
        //       display: flex;
        //       align-items: center;
        //     }
        //     &__username {
        //       margin-left: 8px;
        //     }
        //   }
      }
    }
    .main-content {
      display: inline-block;
      width: calc(100% - 388px);
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      // border-radius: 0 4px 4px 0;
      background: #ffffff;
      height: 100%;
      overflow: auto;
      position: relative;
      transition: width 0.3s;
      &.fullwidth {
        width: 100%;
      }
      .collapse-btn {
        z-index: 10;
        cursor: pointer;
        position: absolute;
        height: 48px;
        width: 24px;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        text-align: center;
        background-color: rgba($primaryFontColor, 0.3);
        border-radius: 0 4px 4px 0;
        i {
          font-size: 14px;
          line-height: 48px;
          color: #fff;
        }
      }
      .content {
        &--richtext {
          padding: 40px;
          overflow-y: auto;
          height: 100%;
        }
        &--test {
          margin: 40px;
        }
        &--download {
          display: flex;
          margin: 40px;
          .img-wr {
            margin-right: 24px;
          }
          .file-name {
            color: $primaryFontColor;
            font-size: 18px;
            margin-bottom: 24px;
          }
        }
        &--iframe {
          height: 100%;
          padding: 25px;
        }
      }

      .detailTitel {
        font-size: 20px;
        font-weight: 700;
        padding-left: 40px;
        padding-top: 20px;
      }
    }
  }
}
</style>
