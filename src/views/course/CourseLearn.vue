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
        :style="`${currentChapter.type == '1' ? 'overflow:hidden;' : ''}`"
      >
        <div class="collapse-btn" @click="collapseLeft()">
          <i v-if="!leftHidden" class="iconimage_icon_Doubleleftarrow iconfont"></i>
          <i v-else class="iconimage_icon_Doublerightarrow iconfont"></i>
        </div>
        <div
          v-if="currentChapter.type == '1'"
          class="detailTitel"
          v-html="_.unescape(_.unescape(currentChapter.localName))"
        ></div>
        <!-- 文章类型 -->
        <div
          v-if="currentChapter.type == '1'"
          class="content--richtext"
          v-html="_.unescape(_.unescape(currentChapter.content))"
        ></div>
        <!-- 课件 -->
        <div v-if="currentChapter.type == '2'" class="content--iframe">
          <div style=" height:100%">
            <!-- <video
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
            ></video> -->
            <div v-if="!isVideo" style=" height:100%">
              <!-- <div v-if="getFileType(currentChapter.content) == 'txt'" ref="currentTXT"></div> -->
              <img
                v-if="
                  /(jpg|png|gif|jpeg|bmp|JPG|PNG|GIF|JPEG|BMP)$/.test(
                    getFileType(currentChapter.content)
                  )
                "
                ref="currentImg"
                :src="currentChapter.content"
                style="display: block;margin: 0 auto;"
              />
              <iframe
                v-if="
                  /(doc|docx|xls|xlsx|ppt|pptx|pdf|txt|rtf|wps|DOC|DOCX|XLS|XLSX|PPT|PPTX|PDF|TXT|RTF|WPS)$/.test(
                    getFileType(currentChapter.content)
                  )
                "
                :src="currentSrc"
                width="100%"
                height="100%"
                frameborder="0"
              ></iframe>
              <!-- <iframe
                v-else
                :src="currentChapter.content"
                width="100%"
                height="100%"
                frameborder="0"
              ></iframe> -->
            </div>
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
            <!-- <a target="_blank" :href="currentChapter.content" > -->
            <el-button type="primary" size="medium" @click="downLoadImg(currentChapter)">立即下载</el-button>
            <!-- </a> -->
          </div>
        </div>
        <!--考试-->
        <div v-if="currentChapter.type == '4'" class="content--test">
          <Task :task-data="currentChapter" @uploadTask="uploadTask" />
        </div>

        <!-- 视频 -->
        <div
          v-if="currentChapter.type == '5'"
          ref="videoBox"
          class="content--richtext"
          :class="{ videoBox: fullScreenBox }"
        >
          <!-- <div
            style="overflow-y:auto;"
            v-html="_.unescape(_.unescape(currentChapter.content))"
          ></div> -->

          <video
            v-if="isVideo"
            ref="videoRef"
            controlslist="nodownload"
            autoplay
            preload
            :src="currentChapter.content"
            :height="contentHeight"
            :width="contentWidth"
            style="width:100%;"
            class="isVideo"
          ></video>

          <div class="myControls">
            <div class="currentBar">
              <el-slider v-model="currentBar" :show-tooltip="false"></el-slider>
            </div>
            <div class="btnS">
              <div class="videoBtn">
                <span
                  v-show="!videoPaused"
                  class="el-icon-video-pause _videoBtn"
                  @click="videoSuspendBtn"
                ></span>
                <span
                  v-show="videoPaused"
                  class="el-icon-video-play _videoBtn"
                  @click="videoPlayBtn"
                ></span>
                <span class="el-icon-refresh-right _videoBtn" @click="videoReplayBtn"></span>
                <span class="playTime">{{ nowDate }}/ {{ wholeDate }} </span>
              </div>
              <div class="parameterBtn">
                <div class="voices">
                  <el-slider v-model="voices" class="slider"></el-slider>
                  <span class="title">音量</span>
                </div>
                <div class="timeS">
                  <ul class="my_option">
                    <li
                      v-for="(item, index) in timesOptions"
                      :key="index"
                      @click="timesVal = item.value"
                    >
                      {{ item.label }}
                    </li>
                  </ul>
                  <div class="my_select">
                    {{ timesVal || '倍速' }} {{ `${timesVal ? 'x' : ''}` }}
                  </div>
                </div>

                <div class="FullScreen" @click="fullScreenBtn">
                  <span class="el-icon-full-screen"></span>
                </div>
                <!-- <div class="suspension" @click="suspensionBtn">[xiao]</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toPercent, getReviewUrl } from '@/util/util'
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
import { downLoadFile } from '@/util/util'
// import { clearInterval } from 'tinymce/themes/silver/theme'
const axios = require('axios/index')

export default {
  name: 'CourseLearn',
  components: { Task, TextOverTooltip, Note },
  data() {
    return {
      sliderData: 0,
      contentWidth: '100%',
      contentHeight: '100%',
      videoPaused: false,
      isFullScreen: 0,
      fullScreenBox: true,
      voices: 50,
      videoCurrentTime: '',
      currentSrc: '',
      timer: null,
      videoTimer: null,
      nowDate: '',
      wholeDate: '',
      currentBar: 0,
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
      chapterTime: 0, //章节停留时间,
      timesOptions: [
        { label: '0.5x', value: 0.5 },
        { label: '0.75x', value: 0.75 },
        { label: '1x', value: 1 },
        { label: '1.25x', value: 1.25 },
        { label: '1.5x', value: 1.5 },
        { label: '2x', value: 2 }
      ],
      timesVal: ''
    }
  },
  computed: {
    courseId() {
      return this.$route.query.courseId
    },
    chapterId() {
      return this.$route.query.chapterId
    },
    // contentWidth() {
    //   return this.$refs.content.offsetWidth
    // },
    // contentHeight() {
    //   return this.$refs.content.offsetHeight
    // },
    isVideo() {
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov|AVI|WMV|MP4|3GP|RM|RMVB|MOV)$/
      return regx.test(this.currentChapter.content)
    },
    COURSE_CHAPTER_TYPE_MAP: () => COURSE_CHAPTER_TYPE_MAP,
    ...mapGetters(['userInfo'])
  },
  watch: {
    // 视频倍速播放
    timesVal(newVal) {
      let videoRef = this.$refs.videoRef
      if (videoRef) videoRef.playbackRate = newVal
    },
    // 让视频只能往后拖
    currentBar(newVal) {
      let vd = this.$refs.videoRef
      // 现在视频的播放时间
      // (vd.currentTime)
      // 视频总时长
      // (vd.duration)
      // 当前百分比

      let currentBar = parseInt((vd.currentTime / vd.duration) * 100)
      if (newVal < currentBar) {
        let tade = (newVal / 100) * vd.duration
        this.currentChapter.period = parseInt(tade)
        vd.currentTime = parseInt(tade)
        this.videoplayInit()
        this.videoPlayBtn()
      }
    },
    // 视频音量
    voices(newVal) {
      let videoRef = this.$refs.videoRef
      if (videoRef) videoRef.volume = newVal / 100
    },
    currentChapter(newVal, oldVal) {
      if (!this.isVideo) {
        this.getContentUrl(newVal)
      }
      this.videoplayInit()
      // 进入页面判断是否视频，断点续放
      this.breakpoint(newVal)

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
      if (newVal.type == 3) {
        newVal.progress = 100
      }

      if (this.isChapterVideo(oldVal) && oldVal.duration) {
        let videoDom = document.querySelector('video')
        this.chapters.forEach((item, index) => {
          if (oldVal.contentId == item.contentId) {
            this.chapters[index].period = parseInt(videoDom.currentTime)
            // console.log(this.chapters[index].period);
            // console.log(oldVal);
          }
        })

        videoDom.onended = () => {
          this.updateVideoProgress()
          this.submitLearnRecords()
        }
      }
      if (!this.isChapterVideo(newVal) && newVal.type != 4) {
        newVal.progress = 100
      }

      if (newVal !== oldVal) {
        // if (this.timer) clearInterval(this.timer)
        this.chapterTime = 0
        this.coundown()

        // this.timer = setInterval(() => {
        //   this.chapterTime = 30
        //   this.updateVideoProgress()
        //   this.submitLearnRecords()
        // }, 30 * 1000)
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
    this.videoplayInit()
  },
  // deactivated() {
  //   this.updateVideoProgress(this.currentChapter)
  //   this.submitLearnRecords()
  //   //  清除定时器两个定时
  //   if (this.timer) clearTimeout(this.timer)
  //   this.timer = null
  //   if (this.videoTimer) clearInterval(this.videoTimer)
  //   this.clearIntervalFn()
  // },
  beforeRouteLeave(from, to, next) {
    this.updateVideoProgress(this.currentChapter)
    this.submitLearnRecords()
    //  清除定时器两个定时
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    if (this.videoTimer) clearInterval(this.videoTimer)
    this.clearIntervalFn()
    next()
  },
  methods: {
    coundown() {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.chapterTime = 30
        this.updateVideoProgress()
        this.submitLearnRecords()
        this.coundown()
      }, 30 * 1000)
    },
    //  清除定时器
    clearIntervalFn() {
      //这里停止了定时器
      if (this.videoTimer) {
        for (let i = 1; i <= this.videoTimer; i++) {
          clearInterval(this.videoTimer)
        }
      }
    },

    downLoadImg(data) {
      // 下载
      downLoadFile(data)
    },
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
    async getContentUrl(chapter) {
      const office = /.*\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf|wps|jpg|png|gif|DOC|DOCX|XLS|XLSX|PPT|PPTX|TXT|RTF|WPS|JPG|PNG|GIF)$/
      const isPdf = /.*\.(PDF|pdf)$/
      if (office.test(chapter.content) || isPdf.test(chapter.content)) {
        // this.currentSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURI(
        //   chapter.content
        // )}`;
        let { data } = await getReviewUrl({
          isDownloa: 0,
          isShowTitle: 0,
          isPrint: 0,
          isCopy: 1,
          htmlName: chapter.localName,
          convertType: office.test(chapter.content) ? 0 : 20,
          fileUrl: chapter.content
        })
        this.currentSrc = data.data.viewUrl
      }

      const officeTxtImg = /.*\.(jpg|png|gif|jpeg|txt|JPG|PNG|GIF|JPEG|TXT)$/
      if (officeTxtImg.test(chapter.content)) {
        this.genSrc(chapter.content)
      }
      return chapter.content
    },
    genSrc(url) {
      axios.get(url).then((res) => {
        const { data } = res
        if (/(jpg|png|gif|jpeg|JPG|PNG|GIF|JPEG)$/.test(this.getFileType(url))) {
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
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov|AVI|WMV|MP4|3GP|RM|RMVB|MOV)$/
      return regx.test(chapter.content)
    },
    async handleChapterClick(chapter) {
      // this.pageIndex -= 1
      // this.timesVal = ''
      // this.$nextTick(() => {
      //   let videoRef = this.$refs.videoRef
      //   if (!videoRef) return
      //   videoRef.addEventListener('play', function() {
      //     videoRef.currentTime = chapter.period
      //     this.videoCurrentTime = videoRef.currentTime
      //     videoRef.playbackRate = 1
      //   })
      // })

      this.breakpoint(chapter)

      await this.updateVideoProgress()
      await this.submitLearnRecords()
      // await this.loadCourseDetail()
      this.currentChapter = null
      this.currentChapter = chapter
    },
    // 进度
    calcProcess(chapter) {
      let progressData = chapter.progress
      if (progressData > 98) progressData = 100
      return progressData

      // if (!this.isChapterVideo(chapter)) {
      //   // 兼容旧数据，现在视频以外的类型进度都是100，之前是1
      //   if (chapter.progress > 0) {
      //     return 100
      //   } else {
      //     return 0
      //   }
      // } else {
      //   return parseInt(chapter.progress) || 0
      // }
    },
    // 进度状态
    getChapterStatus(chapter) {
      if (this.isActive(chapter)) {
        return '正在学'
      }
      if (!this.isChapterVideo(chapter)) {
        if (chapter.progress > 98) {
          return '已学习'
        } else {
          return '未学习'
        }
      } else {
        if (chapter.progress == '0') {
          return '未学习'
        } else if (chapter.progress > 98) {
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
      let params = {
        contentPeriods: '',
        period: this.chapterTime,
        courseId: this.courseId,
        studyPlanId: this.$route.query.studyPlanId || '',
        trainId: this.$route.query.trainId || ''
      }
      params.contentRecords = _.map(
        this.chapters,
        (chapter) => `${chapter.contentId}:${chapter.progress >= 100 ? 100 : chapter.progress}`
      ).join(',')

      if (!params.contentRecords) {
        return
      }
      params.contentPeriods = _.map(
        this.chapters,
        (chapter) =>
          `${chapter.contentId}:${chapter.duration !== '' ? this.TiemToFixed(chapter) : 0}`
        //  (chapter) => console.log(chapter)
      ).join(',')
      // console.log(params);
      // return
      updateLearnRecord(params)
        .then()
        .catch()
    },

    TiemToFixed(chapter) {
      let durationNum = chapter.duration || 0
      let Tiem = chapter.progress / 100 >= 1 ? durationNum : durationNum * (chapter.progress / 100)
      return Tiem.toFixed(0)
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
            chapter.duration = parseInt(duration) || chapter.duration
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
      if (this.timer) clearTimeout(this.timer)
      this.clearIntervalFn()
      this.$router.push({
        path: '/course/detail',
        query: {
          id: this.courseId,
          studyPlanId: this.$route.query.studyPlanId || '',
          trainId: this.$route.query.trainId || ''
        }
      })
    },

    // 视频播放控件
    // 获取视频播发时间  ： 总时间&播发时间
    // 视频进度条
    videoplayInit() {
      clearInterval(this.videoTimer)
      this.videoTimer = setInterval(() => {
        let vd = this.$refs.videoRef
        if (!vd) return
        this.nowDate = this.formatSeconds(vd.currentTime)
        this.wholeDate = this.formatSeconds(vd.duration)
        this.currentBar = parseInt((vd.currentTime / vd.duration) * 100)
        let pausedData = vd.paused
        this.videoPaused = pausedData
      }, 500)
    },

    // 断点
    breakpoint(chapter) {
      this.timesVal = ''
      this.$nextTick(() => {
        let videoRef = this.$refs.videoRef
        if (!videoRef) return
        videoRef.addEventListener('play', () => {
          videoRef.currentTime = chapter.period
          this.videoCurrentTime = videoRef.currentTime
          videoRef.playbackRate = 1
        })
      })
    },

    // 视频暂停
    videoSuspendBtn() {
      let vd = this.$refs.videoRef
      this.currentChapter.period = vd.currentTime
      vd.pause()
    },
    // 视频播放
    videoPlayBtn() {
      let vd = this.$refs.videoRef
      this.$nextTick(() => {
        setTimeout(() => {
          vd.play()
        }, 500)
      })
    },

    // 视频重新播放
    videoReplayBtn() {
      let vd = this.$refs.videoRef
      this.currentChapter.period = 0
      vd.currentTime = 0
      this.videoPlayBtn()
    },
    // 视频全屏
    fullScreenBtn() {
      if (this.isFullScreen) {
        // Webkit
        document.webkitCancelFullScreen() //退出全屏
        // // Firefox
        // document.mozCancelFullScreen()
        // // W3C
        // document.exitFullscreen()
        this.isFullScreen = 0
      } else {
        let vd = this.$refs.videoBox
        vd.webkitRequestFullScreen() // Webkit
        // vd.mozRequestFullScreen() // Firefox
        // vd.requestFullscreen() // W3C
        this.isFullScreen = 1
      }
    },

    videoplayOln() {},

    // 秒转换成时间
    formatSeconds(value) {
      let theTime = parseInt(value) // 秒
      let middle = 0 // 分
      let hour = 0 // 小时

      if (theTime > 60) {
        middle = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (middle > 60) {
          hour = parseInt(middle / 60)
          middle = parseInt(middle % 60)
        }
      }
      let result = '' + (parseInt(theTime) || 0) + '秒'
      if (middle > 0) {
        result = '' + parseInt(middle) + '分' + result
      }
      if (hour > 0) {
        result = '' + parseInt(hour) + '小时' + result
      }
      return result
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
          // padding: 40px;
          overflow-y: auto;
          height: 100%;
          position: relative;
        }
        &--test {
          margin: 40px;
        }
        &--download {
          display: flex;
          margin: 40px;
          .img-wr {
            margin-right: 24px;
            img {
              margin: 0 auto;
            }
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
.content--iframe {
  /deep/ body img {
    display: block;
    margin: 0 auto;
  }
}
// /deep/.el-input__inner {
//   background-color: rgba(0, 0, 0, 0.474) !important;
//   border: none;
//   color: #fff;
// }
// /deep/ .el-select-dropdown .el-popper {
//   background-color: pink;
//   border: none;
// }
.isVideo {
  margin: 0;
  padding: 0;
}
.myControls {
  width: 100%;
  height: 80px;
  background: linear-gradient(rgba(0, 0, 0, 0.212), rgb(0, 0, 0));
  position: absolute;
  left: 0;
  bottom: 0;
  // display: none;
  opacity: 0;
  transition: all 0.8s;
  &:hover {
    opacity: 1;
  }
  .currentBar {
    padding: 0 24px;
  }
  .btnS {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;

    .videoBtn {
      width: 200px;
      display: flex;
      justify-content: space-between;
      font-size: 30px;
      color: #a0a8ae;
      cursor: pointer;
      ._videoBtn {
        border-radius: 50%;
      }
      ._videoBtn:hover {
        box-shadow: 0px 2px 8px #000000;
      }
      ._videoBtn:active {
        color: #01aafc;
      }

      .playTime {
        font-size: 12px;
        width: 120px;
        text-align: right;
        line-height: 30px;
        cursor: default;
      }
    }
    .parameterBtn {
      display: flex;
      justify-content: space-between;
      .timeS {
        position: relative;
        padding: 15px 0;
        margin-top: -15px;
        cursor: pointer;
        &:hover {
          .my_option {
            display: block;
          }
        }
        .my_select {
          width: 60px;
          margin-top: 1px;
          background-color: rgba(255, 255, 255, 0);
          border: none;
          color: #a0a8ae;
          text-align: center;
        }
        .my_option {
          background-color: rgba(0, 0, 0, 0.678);
          position: absolute;
          left: 0;
          top: -165px;
          color: rgba(255, 255, 255, 0.849);
          border-radius: 3px;
          padding: 5px 0;
          li {
            padding: 5px 10px;
          }
          display: none;
        }
      }

      .voices {
        width: 180px;
        margin-top: -6px;
        display: flex;
        .title {
          width: 60px;
          color: #a0a8ae;
          text-align: center;
          line-height: 36px;
        }
        .slider {
          flex: 1;
        }
      }
      .FullScreen,
      .suspension {
        color: #a0a8ae;
        font-size: 18px;
        width: 50px;
        text-align: right;
        cursor: pointer;
      }
    }
  }
}
video::-webkit-media-controls {
  display: none !important;
}
select,
option {
  /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/
  border: none;
  outline: none;
  /*很关键：将默认的select选择框样式清除*/
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  /*将背景改为红色*/
  background: #fff;
  /*加padding防止文字覆盖*/
  padding-right: 14px;
}
</style>
