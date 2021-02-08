<template>
  <div class="course">
    <ul
      v-if="(data.trainWay === 1 || data.trainWay === 3) && onlineList.length"
      class="course-list"
    >
      <li v-for="(course, index) in onlineList" :key="index" class="course-item">
        <div class="title">
          {{ course.name }}
        </div>
        <div class="note">
          课程目录
        </div>
        <ul class="chapter-list">
          <li
            v-for="(chapter, idx) in course.content"
            :key="chapter.id || idx"
            class="chapter-item"
          >
            <div
              class="tab video"
              :class="{
                video: chapter.type == 5,
                article: chapter.type == 1,
                point: chapter.type == 3,
                exam: chapter.type == 4,
                course: chapter.type == 2
              }"
            >
              {{ getChapterType(chapter.type) }}
            </div>
            <div class="name">
              {{ chapter.name }}
            </div>
            <div
              v-if="chapter.percentageComplete || chapter.percentageComplete === 0"
              class="progress-wrapper"
            >
              <el-progress
                :width="14"
                type="circle"
                :stroke-width="2"
                :percentage="chapter.percentageComplete"
                :show-text="false"
              ></el-progress>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <ul
      v-if="data.trainWay === 2 || data.trainWay === 3"
      class="course-list"
      :class="{ 'margin-top20': data.trainWay === 3 && onlineList.length }"
    >
      <li class="course-item">
        <div class="title">
          面授课程
        </div>
        <div v-for="(val, key) in offlineList" :key="key">
          <div class="note">
            {{ key }}
          </div>
          <ul class="chapter-list">
            <li v-for="(chapter, index) in val" :key="index" class="o-chapter-item">
              <div class="begin">
                {{ chapter.todoTime }}&nbsp;&nbsp;&nbsp;&nbsp;{{ chapter.course }}
              </div>
              <div class="end">
                讲师：{{ chapter.lecturerName }}&nbsp;&nbsp;地点：{{ chapter.address }}
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getCourseList, getOfflineTodo } from 'src/api/train'
export default {
  name: 'Course',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      onlineList: [],
      offlineList: []
    }
  },
  created() {
    this.getOnlineList()
    this.getOfflineList()
  },
  methods: {
    getChapterType(type) {
      switch (type) {
        case '1':
          return '文章'
        case '2':
          return '普通课件'
        case '3':
          return '知识点'
        case '4':
          return '考试'
        case '5':
          return '视频'
      }
    },
    getOnlineList() {
      getCourseList({ trainId: this.data.trainId }).then((res) => {
        this.onlineList = res.data
        this.onlineList.forEach((course) => {
          course.content.sort((a, b) => {
            return a - b
          })
        })
      })
    },
    getOfflineList() {
      getOfflineTodo({ trainId: this.data.trainId }).then((res) => {
        this.offlineList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.course {
  .course-list {
    .course-item {
      .title {
        border-left: 4px solid rgba(1, 170, 252, 1);
        text-indent: 8px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        margin-bottom: 16px;
      }
      .note {
        padding-left: 24px;
        background: #fafafa;
        height: 48px;
        line-height: 48px;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid rgba(235, 236, 237, 1);
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .chapter-list {
        .chapter-item {
          display: flex;
          align-items: center;
          padding: 0 24px;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(235, 236, 237, 1);
          height: 48px;
          line-height: 48px;
          cursor: default;
          .tab {
            border: 1px solid;
            font-size: 10px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            margin-right: 8px;
            box-sizing: border-box;
            padding: 0 2px;
            &.video {
              color: rgba(0, 176, 97, 1);
            }
            &.article {
              color: #01aafc;
            }
            &.point {
              color: #ff4329;
            }
            &.course {
              color: #fc7c01;
            }
            &.exam {
              color: #fcba00;
            }
          }
          .name {
            flex: 1;
            width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
          }
          .time {
            width: 370px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: rgba(0, 11, 21, 0.45);
          }
          .progress-wrapper {
            margin-top: 5px;
            margin-left: 24px;
          }
        }
        .o-chapter-item {
          display: flex;
          align-items: center;
          cursor: default;
          padding: 13px 24px;
          background: #fff;
          font-size: 14px;
          border-bottom: 1px solid #ebeced;
          .begin {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: rgba(0, 11, 21, 0.85);
            width: 678px;
          }
          .end {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: rgba(0, 11, 21, 0.45);
            width: 364px;
          }
          .button {
            margin-left: 5px;
          }
        }
      }
    }
  }
  .margin-top20 {
    margin-top: 20px;
  }
}
</style>
