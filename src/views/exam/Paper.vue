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
          <span>共{{ paper.questionNum }}题，</span>
          <span v-if="paper.totalScore">总分{{ paper.totalScore / 10 }}分，</span>
          <span>限定最高分为100分</span>
          <span v-if="paper.reckonTime">，计时{{ paper.reckonTimeValue }}分钟</span>
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
    <section class="container-section">
      <div
        v-loading="containerLoad"
        class="middle-container"
      >
        <div
          v-if="!isSuccess"
          class="paper-main"
        >
          <div class="main-left">
            <el-card style="margin-bottom: 20px">
              <div class="avatar-card">
                <el-avatar
                  :size="80"
                  :src="userInfo.avatar_url || circleUrl"
                ></el-avatar>
                <div class="exam-box">
                  <div class="name">
                    {{ userInfo.nick_name }}
                  </div>
                  <div class="phone">
                    {{ userInfo.account }}
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
                    <span>{{ item[0].type | typeFilter }}</span>
                  </div>
                  <ul class="list-box">
                    <li
                      v-for="(subItem, subIndex) in item"
                      :key="subItem.id"
                      class="list-li"
                    >
                      <span
                        class="li-content"
                        :class="{
                          'select-li': subIndex === 0,
                          'doubt-li': currentItemIsInImpeach(subItem)
                        }"
                      >
                        <span>{{ subIndex + 1 }}</span>
                        <span class="li-tips">
                          <i
                            class="iconfont "
                            :class="{
                              iconimage_icon_succeed: subIndex === 0,
                              iconimage_icon_query: currentItemIsInImpeach(subItem)
                            }"
                          />
                        </span>
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </el-card>
          </div>
          <el-card class="main-right">
            <ul class="question-ul">
              <li
                v-for="(item, index) in questionList"
                :key="index"
                class="question-li"
              >
                <div class="title-box">
                  <div class="question-li-title">
                    <span>{{ (index + 1) | number2zhcn }}、</span>
                    <span>{{ item[0].type | typeFilter }}</span>
                    <span>（共{{ _.size(item) }}题, 共{{ getItemTotalScore(item) }}分)</span>
                  </div>
                  <div class="sub-title">
                    {{ item[0].title }}
                  </div>
                </div>
                <ul class="content-box">
                  <li
                    v-for="(conItem, conIndex) in item"
                    :key="conItem.id"
                    class="content-li"
                  >
                    <div class="li-main">
                      <div class="li-main-left">
                        <i
                          class="iconfont"
                          :class="
                            `icon${
                              currentItemIsInImpeach(conItem)
                                ? 'image_icon_help_press'
                                : 'image_icon_help_normal'
                            }`
                          "
                          @click="setImpeach(conItem)"
                        />
                      </div>
                      <div class="li-main-right">
                        <span>{{ conIndex + 1 }}.</span>
                        <span>（{{ conItem.score / 10 }}分）</span>
                        <QustionPreview
                          v-if="QUESTION_TYPE_GROUP !== conItem.type"
                          :data="conItem"
                        />
                        <span v-else>
                          <span v-html="_.unescape(conItem.content)"></span>
                          <ul>
                            <li
                              v-for="(paperItem, paperIndex) in conItem.subQuestions"
                              :key="paperIndex"
                              class=""
                            >
                              <span>{{ paperIndex + 1 }}</span>
                              <QustionPreview :data="paperItem" />
                            </li>
                          </ul>
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </el-card>
        </div>
        <exam-success v-else />
      </div>
      <the-footer />
    </section>
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
          @click="automaticSubmit"
        >{{ confirmTips }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import examSuccess from './components/Success'
import QustionPreview from './components/questionPreview'
import TheFooter from '@/page/TheFooter'
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
import { getTakeExam, postSubmitPaper } from '@/api/exam'
import { mapGetters } from 'vuex'
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
    examSuccess,
    QustionPreview,
    TheFooter
  },
  data() {
    return {
      impeachList: [], // 存疑数组
      containerLoad: false,
      successPapeer: {},
      isSuccess: false,
      confirmTips: '',
      centerDialogVisible: false,
      isWarningTimeLine: false,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      remainingTime: '00 : 00 : 00',
      paper: {
        title: 'EHS应知应会全员考试',
        answerMode: 1 //1或者2， 1-整卷模式   2-逐卷模式
      },
      questionList: [],
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
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP,
    ...mapGetters(['userInfo'])
  },
  created() {
    this.initData()
  },
  methods: {
    // 当前对象是否存在于存疑数据
    currentItemIsInImpeach(data) {
      return _.some(this.impeachList, (item) => {
        return item.key === data.id
      })
    },
    // 维护存疑数组
    setImpeach(data) {
      const inpeachIndex = _.findIndex(this.impeachList, (item) => {
        return item.key === data.id
      })
      if (inpeachIndex > -1) {
        this.impeachList.splice(inpeachIndex, 1)
      } else {
        // 基于题目数组数据结构为二维数组
        _.each(this.questionList, (parentItem, parentIndex) => {
          _.each(parentItem, (sonItem, sonIndex) => {
            if (sonItem.id === data.id) {
              this.impeachList.push({
                key: data.id,
                value: [parentIndex, sonIndex]
              })
            }
          })
        })
      }
    },
    addScore(args) {
      return args.reduce((prev, curr) => {
        return prev + curr
      })
    },
    getItemTotalScore(data) {
      const scoreList = _.map(data, (item) => {
        return item.score
      })
      const totalScore = this.addScore(scoreList)
      return totalScore / 10
    },
    // 交卷逻辑
    carryOut() {
      if (!this.checkSubmit()) return
      this.submitFun()
    },
    // TODO：考试交卷前校验
    // 不能提前多少分钟交卷，但是如果设置了自动交卷，则可以过滤这个规则
    checkSubmit() {},
    // 处理交卷动作
    submitFun() {
      this.containerLoad = true
      const params = {
        batchId: this.$route.query.batchId,
        examId: this.$route.query.examId,
        paperId: this.paper.id,
        totalScore: this.paper.totalScore,
        questions: this.paper.questions
      }
      postSubmitPaper(params)
        .then((res) => {
          this.successPapeer = res
        })
        .finally(() => {
          this.containerLoad = false
        })
    },
    // 考试到时，自动交卷
    automaticSubmit() {
      this.centerDialogVisible = false
      this.submitFun()
    },
    async initData() {
      this.paper = await getTakeExam(this.$route.query)
      this.questionList = _.chain(_.cloneDeep(this.paper.questions))
        .groupBy('parentSort')
        .sortBy('parentSort')
        .map((item) => {
          return _.sortBy(item, 'sort')
        })
        .value()
      // console.log('this.questionList==', this.questionList)
      this.initRemainingTime()
    },
    goBack() {
      this.$router.go(-1)
    },
    // TODO: 考试时间交卷逻辑需要补充
    initRemainingTime() {
      const { reckonTimeValue, strategy, examEndTime } = this.paper
      // 如果考试时长不计时，并且考试策略为true，最后5分钟需要爆红提示。计时就按照计时的算。
      const canUseUpTime = moment(new Date()).add(reckonTimeValue, 'm')
      // 考试策略strategy影响考试时长，如果为true，到了考试结束时间就必须交卷，否则可以考满设置的考试时间
      const dealline = strategy ? moment(examEndTime) : canUseUpTime
      const dealTimeId = setInterval(() => {
        const diffTime = moment(dealline).diff(new Date())
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
    // 考试到时结束考试
    endExam(dealTimeId) {
      if (this.remainingTime !== '00 : 00 : 00') return
      clearInterval(dealTimeId)
      let timeTips = 4
      const timeId = setInterval(async () => {
        timeTips -= 1
        if (timeTips === 0) {
          clearInterval(timeId)
          await this.automaticSubmit()
          this.centerDialogVisible = false
          this.isSuccess = true
        } else {
          this.centerDialogVisible = true
        }
        this.confirmTips = `知道了（${timeTips}s）`
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
$activeColor: #01aafc;
$selctColor: #fcba00;
.paper-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  height: calc(100vh);
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
  .container-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    .middle-container {
      .paper-main {
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
                margin-bottom: 24px;
                &:last-child {
                  margin-bottom: 0;
                }
                .li-title {
                  font-family: PingFangSC-Medium;
                  font-size: 16px;
                  color: rgba(0, 11, 21, 0.85);
                  font-weight: 550;
                  margin-bottom: 16px;
                }
                .list-box {
                  display: flex;
                  justify-content: flex-start;
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
                      cursor: pointer;
                      border: 1px solid #d9dbdc;
                      border-radius: 4px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-family: PingFangSC-Regular;
                      font-size: 14px;
                      color: rgba(0, 11, 21, 0.85);
                      position: relative;
                      &:hover {
                        color: $activeColor;
                        border-color: $activeColor;
                      }
                      .li-tips {
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-bottom: 17px solid transparent;
                        border-left: 17px solid transparent;
                        right: 0;
                        bottom: 0;
                        .iconfont {
                          position: absolute;
                          right: -2px;
                          top: 4px;
                          color: #fff;
                          font-size: 10px;
                        }
                      }
                    }
                    .select-li {
                      border-color: $activeColor;
                      .li-tips {
                        border-bottom-color: $activeColor;
                      }
                    }
                    .doubt-li {
                      border-color: $selctColor;
                      .li-tips {
                        border-bottom-color: $selctColor;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .main-right {
          flex: 1;
          .question-ul {
            .question-li {
              padding-bottom: 8px;
              .title-box {
                margin-bottom: 24px;
                .question-li-title {
                  font-family: PingFangSC-Medium;
                  font-size: 16px;
                  color: rgba(0, 11, 21, 0.85);
                  font-weight: 550;
                  margin-bottom: 4px;
                }
                .sub-title {
                  font-family: PingFangSC-Regular;
                  font-size: 12px;
                  color: rgba(0, 11, 21, 0.25);
                }
              }
              .content-box {
                .content-li {
                  margin-bottom: 32px;
                  .li-main {
                    display: flex;
                    justify-content: flex-start;
                    .li-main-left {
                      margin-top: 2px;
                      margin-right: 8.8px;
                      .iconfont {
                        &:hover {
                          color: $activeColor;
                          cursor: pointer;
                        }
                      }
                      .iconimage_icon_help_press {
                        color: $selctColor;
                      }
                    }
                    .li-main-right {
                      flex: 1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
