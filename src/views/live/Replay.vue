<template>
  <div class="course-learn">
    <div class="course-learn__header">
      <i class="iconimage_icon_leftarrow iconfont" @click="goBack()"></i>
      <span class="course-learn__header__title"> 直播回放：{{ currentChapter.channelName }} </span>
    </div>
    <div class="course-learn__main">
      <div :class="['left-bar', { hidden: leftHidden }]">
        <div class="left-bar__main">
          <div class="chapters">
            <ul>
              <li
                v-for="(chapter, index) in chapters"
                :key="index"
                :class="{ 'is-active': isActive(chapter) }"
                @click="handleChapterClick(chapter)"
              >
                <div class="chapters__wrap">
                  <!--<span-->
                  <!--class="chapters__tag"-->
                  <!--:style="{-->
                  <!--color: _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, ''),-->
                  <!--'border-color': _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.color`, '')-->
                  <!--}"-->
                  <!--&gt;{{ _.get(COURSE_CHAPTER_TYPE_MAP, `${chapter.type}.text`, '') }}</span>-->
                  <span class="chapters__title">直播回放：{{ chapter.channelName }}</span>
                </div>
                <!--<div class="chapters__handler">-->
                <!--<el-progress-->
                <!--v-if="!isActive(chapter)"-->
                <!--type="circle"-->
                <!--:show-text="false"-->
                <!--:percentage="calcProcess(chapter)"-->
                <!--:width="16"-->
                <!--:stroke-width="2"-->
                <!--&gt;</el-progress>-->
                <!--<i v-else class="iconimage_icon_time1 iconfont"></i>-->
                <!--<span class="chapters__status">{{ getChapterStatus(chapter) }}</span>-->
                <!--</div>-->
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div ref="content" :class="['main-content', { fullwidth: leftHidden }]">
        <div class="collapse-btn" @click="collapseLeft()">
          <i v-if="!leftHidden" class="iconimage_icon_Doubleleftarrow iconfont"></i>
          <i v-else class="iconimage_icon_Doublerightarrow iconfont"></i>
        </div>
        <!-- 文章类型 -->
        <!--<div-->
        <!--v-if="currentChapter.type == '1'"-->
        <!--class="content&#45;&#45;richtext"-->
        <!--v-html="_.unescape(_.unescape(currentChapter.content))"-->
        <!--&gt;</div>-->
        <!-- 课件 -->
        <div ref="content--iframe" class="content--iframe">
          <video
            ref="video"
            preload
            controls
            controlsList="nodownload"
            :src="currentChapter.localUrl"
            @contextmenu.prevent
          ></video>
        </div>
        <!--&lt;!&ndash;资料&ndash;&gt;-->
        <!--<div v-if="currentChapter.type == '3'" class="content&#45;&#45;download">-->
        <!--<div class="img-wr">-->
        <!--<img :src="getFileImageUrl(currentChapter.content)" />-->
        <!--</div>-->
        <!--<div class="download-wr">-->
        <!--<div class="file-name">-->
        <!--{{ currentChapter.localName }}-->
        <!--</div>-->
        <!--<a target="_blank" :href="currentChapter.content">-->
        <!--<el-button type="primary" size="medium">立即下载</el-button>-->
        <!--</a>-->
        <!--</div>-->
        <!--</div>-->
        <!--&lt;!&ndash;考试&ndash;&gt;-->
        <!--<div v-if="currentChapter.type == '4'" class="content&#45;&#45;test">-->
        <!--<el-button type="primary" size="medium">-->
        <!--前往考试-->
        <!--</el-button>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { liveReplayList } from '@/api/live'

export default {
  name: 'Replay',
  data() {
    return {
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
      isVideo: true
    }
  },
  computed: {
    id() {
      return _.get(this.$route, 'query.id')
    },
    courseId() {
      return this.$route.query.courseId
    },
    chapterId() {
      return this.$route.query.chapterId
    },
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 更新视频播放进度
     */
    updateVideoProgress(chapter) {
      if (!this.isChapterVideo(chapter) || !chapter.duration) {
        return
      }
      let progress = Number(((this.$refs.video.currentTime / chapter.duration) * 100).toFixed())
      chapter.progress = progress > chapter.progress ? progress : chapter.progress
    },
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
    getContentUrl(chapter) {
      const office = /.*\.(doc|xls|xlsx|ppt|pptx)$/
      if (office.test(chapter.content)) {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURI(chapter.content)}`
      }
      return chapter.content
    },
    setTimer() {
      this.timer = setInterval(() => {
        this.submitLearnRecords()
      }, 5 * 60 * 1000)
    },
    getList() {
      this.leftHidden = false
      liveReplayList({
        livePlanId: this.id,
        sourceType: 1,
        ...this.page
      }).then((res) => {
        let idx = res.result.data.findIndex((item) => item.id === this.$route.query.liveId)
        let first = res.result.data.splice(idx, 1)
        this.chapters = [...first, ...res.result.data]
      })
    },
    collapseLeft() {
      this.leftHidden = !this.leftHidden
    },
    isActive(chapter) {
      return this.currentChapter.id === chapter.id
    },
    isChapterVideo(chapter) {
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      return regx.test(chapter.content)
    },
    handleChapterClick(chapter) {
      this.currentChapter = chapter
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
    margin: 20px 0;
    height: calc(100vh - #{$headerHeight} - 40px);
    display: flex;
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
          // display: flex;
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
      /*width: calc(100% - 388px);*/
      flex: 1;
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
          video {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
