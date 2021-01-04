<template>
  <div class="paper-container">
    <div class="paper-header">
      <div class="header-left">
        <i
          class="iconimage_icon_leftarrow iconfont"
          @click="goBack"
        />
        <span class="title">{{ paper.name }}</span>
        <span
          v-if="!isSuccess"
          class="content"
        >
          <span>共50题，</span>
          <span>总分{{ paper.totalScore }}分，</span>
          <span>限定最高分为100分，</span>
          <span>计时60分钟</span>
          <span>（答题不确定时，可用</span>
          <i class="iconimage_icon_help_normal iconfont" />
          <span>标记）</span>
        </span>
      </div>
      <div
        v-if="!isSuccess"
        class="header-right"
      >
        <span
          class="time"
          :class="{ 'warning-time': isWarningTimeLine }"
        >剩余时间：{{ remainingTime }}</span>
        <el-button
          type="primary"
          size="medium"
          @click="carryOut"
        >
          交卷
        </el-button>
      </div>
    </div>
    <div class="middle-container">
      <div
        v-if="!isSuccess"
        class="paper-main"
      >
        <div class="main-left">
          <el-card style="margin-bottom: 20px">
            <div class="avatar-card">
              <el-avatar
                :size="80"
                :src="circleUrl"
              ></el-avatar>
              <div class="exam-box">
                <div class="name">
                  {{ exam.name }}
                </div>
                <div class="phone">
                  {{ exam.phone }}
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="control-card">
            <ul class="question-ul">
              <li
                v-for="(item, index) in questionList"
                :key="index"
                class="question-li"
              >
                <div class="li-title">
                  <span>{{ (index + 1) | number2zhcn }}、</span>
                  <span>单选题</span>
                </div>
                <ul class="list-box">
                  <li
                    v-for="(subItem, subIndex) in item.list"
                    :key="subItem.id"
                    class="list-li"
                  >
                    <span class="li-content">
                      <span>{{ subIndex + 1 }}</span>
                      <span class="li-tips">
                        <!-- <i class="iconimage_icon_help_hover iconfont "> </i> -->
                        <span class="right"></span>
                      </span>
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </el-card>
        </div>
        <el-card> </el-card>
      </div>
      <exam-success v-else />
    </div>
    <el-dialog
      title="提交"
      :visible.sync="centerDialogVisible"
      width="450px"
      center
      modal-append-to-body
      append-to-body
      lock-scroll
    >
      <span>考试时间已结束，系统将自动提交答卷</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submit"
        >{{ confirmTips }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import examSuccess from './components/Success'
const nzhcn = require('nzh/cn')
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/exam'
import { getTakeExam } from '@/api/exam'
export default {
  filters: {
    typeFilter(data) {
      return QUESTION_TYPE_MAP[data]
    },
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  components: {
    examSuccess
  },
  data() {
    return {
      isSuccess: true,
      confirmTips: '',
      centerDialogVisible: false,
      isWarningTimeLine: false,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      remainingTime: '00 : 00 : 00',
      paper: {
        title: 'EHS应知应会全员考试',
        answerMode: 1 //1或者2， 1-整卷模式   2-逐卷模式
      },
      questionList: [
        {
          type: 'single_choice',
          list: [{}, {}, {}, {}, {}]
        }
      ],
      exam: {
        name: '汪华林',
        phone: '1302645745645'
      }
    }
  },
  computed: {
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  created() {
    this.initRemainingTime()
    // this.initData()
  },
  methods: {
    submit() {
      this.centerDialogVisible = false
    },
    async initData() {
      this.paper = await getTakeExam(this.$route.query)
      this.initRemainingTime()
    },
    goBack() {
      this.$router.go(-1)
    },
    initRemainingTime() {
      const reckonTimeValue = 2
      const dealline = moment(new Date()).add(reckonTimeValue, 's')
      const dealTimeId = setInterval(() => {
        const diffTime = moment(dealline).diff(moment(new Date()))
        // 5分钟为时间警戒线，经过测试兑换的值为301995
        const WARNING_LINE = 301995
        if (diffTime <= WARNING_LINE) {
          this.isWarningTimeLine = true
        }
        const hoursTime = moment.duration(diffTime).hours()
        const minutesTime = moment.duration(diffTime).minutes()
        const secondsTime = moment.duration(diffTime).seconds()
        const formatHours = `${hoursTime < 10 ? `0${hoursTime}` : hoursTime}`
        const formatMinutes = `${minutesTime < 10 ? `0${minutesTime}` : minutesTime}`
        const formatSeconds = `${secondsTime < 10 ? `0${secondsTime}` : secondsTime}`
        this.remainingTime = `${formatHours} : ${formatMinutes} : ${formatSeconds}`
        // 结束考试
        this.endExam(dealTimeId)
      }, 1000)
    },
    endExam(dealTimeId) {
      if (this.remainingTime !== '00 : 00 : 00') return
      clearInterval(dealTimeId)
      let timeTips = 4
      const timeId = setInterval(() => {
        timeTips -= 1
        if (timeTips === 0) {
          clearInterval(timeId)
          this.centerDialogVisible = false
          this.isSuccess = true
        } else {
          this.centerDialogVisible = true
        }
        this.confirmTips = `知道了（${timeTips}s）`
      }, 1000)
    },
    carryOut() {}
  }
}
</script>

<style scoped lang="scss">
.paper-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  height: calc(100vh - 40px);
  .paper-header {
    align-self: flex-start;
    height: 56px;
    background: #ffffff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04), 0 8px 16px 4px rgba(0, 0, 0, 0.04);
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    .header-left {
      .iconimage_icon_leftarrow {
        cursor: pointer;
      }
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 550;
        margin: 0 8px 0 16px;
      }
      .content {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
    }
    .header-right {
      .time {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        margin-right: 16px;
      }
      .warning-time {
        color: #ff4329;
      }
    }
  }
  .middle-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
  }
  .paper-main {
    height: 100vh;
    width: 1200px;
    margin: 20px auto;
    display: flex;
    justify-content: space-between;
    .main-left {
      margin-right: 20px;
      .avatar-card {
        width: 285px;
        display: flex;
        align-items: center;
        .exam-box {
          margin-left: 24px;
          .name {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: rgba(0, 11, 21, 0.85);
            font-weight: 550;
            margin-bottom: 8px;
          }
          .phone {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.45);
          }
        }
      }
      .control-card {
        .question-ul {
          .question-li {
            .li-title {
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: rgba(0, 11, 21, 0.85);
              font-weight: 550;
              margin-bottom: 16px;
            }
            .list-box {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              &::after {
                content: '';
                width: calc(100% / 5);
              }
              .list-li {
                width: calc(100% / 5);
                display: flex;
                align-items: center;
                justify-content: center;
                .li-content {
                  width: 32px;
                  height: 32px;
                  border: 1px solid #d9dbdc;
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: PingFangSC-Regular;
                  font-size: 14px;
                  color: rgba(0, 11, 21, 0.85);
                  position: relative;
                  .li-tips {
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-bottom: 17px solid red;
                    border-left: 17px solid transparent;
                    right: 0;
                    bottom: 0;
                    .iconfont {
                      position: absolute;
                      right: -2px;
                      top: 2px;
                      color: #fff;
                    }
                    .right {
                      position: absolute;
                      right: 3px;
                      top: 7px;
                      width: 3px;
                      height: 6px;
                      border-color: #fff;
                      border-style: solid;
                      border-width: 0 1px 1px 0;
                      transform: rotate(45deg);
                    }
                  }
                }
                .select-li {
                  border-color: #01aafc;
                  .li-tips {
                    border-bottom-color: #01aafc;
                  }
                }
                .doubt-li {
                  border-color: #fcba00;
                  .li-tips {
                    border-bottom-color: #fcba00;
                  }
                }
              }
            }
          }
        }
      }
    }
    .main-right {
    }
  }
}
</style>
