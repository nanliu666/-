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
    <div
      v-if="paper.isDecoil"
      class="close-book"
    >
      <el-alert
        title="本次为闭卷考试，考试期间若切换程序离开考试页面，则自动提交答卷！"
        type="warning"
        effect="dark"
      >
      </el-alert>
    </div>
    <section
      ref="paperScroll"
      class="container-section"
    >
      <div class="middle-container">
        <div
          v-if="!isSuccess"
          class="paper-main"
        >
          <div class="main-left">
            <div
              ref="controlScroll"
              class="left-inner-box"
            >
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
                        @click="navTo(subItem, index, subIndex)"
                      >
                        <span
                          class="li-content"
                          :class="{
                            'select-li': currentItemIsInSelected(subItem),
                            'doubt-li': currentItemIsInImpeach(subItem)
                          }"
                        >
                          <span>{{ subIndex + 1 }}</span>
                          <span class="li-tips">
                            <i
                              class="iconfont "
                              :class="{
                                iconimage_icon_succeed: currentItemIsInSelected(subItem),
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
              <div class="null-box"></div>
            </div>
          </div>
          <el-card class="main-right">
            <ul
              v-if="paper.answerMode === 1"
              class="question-ul"
            >
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
                    :id="`id${conItem.id}`"
                    :key="conItem.id"
                    class="content-li"
                  >
                    <AnswerByQuestion
                      :con-item="conItem"
                      :con-index="conIndex"
                      @setImpeach="setImpeach"
                    />
                  </li>
                </ul>
              </li>
            </ul>
            <ul
              v-if="paper.answerMode === 2"
              class="question-ul"
            >
              <li
                v-for="(item, index) in tempQuestionList"
                :key="index"
              >
                <div
                  v-if="currentQuestion === index"
                  class="question-li"
                >
                  <div class="title-box">
                    <div class="question-li-title">
                      <span>{{ (getByOneIndex(item).key + 1) | number2zhcn }}、</span>
                      <span>{{ item.type | typeFilter }}</span>
                      <span>（共{{ _.size(getByOneIndex(item).value) }}题)</span>
                    </div>
                    <div class="sub-title">
                      {{ item.title }}
                    </div>
                  </div>
                  <ul class="content-box">
                    <li class="content-li">
                      <AnswerByQuestion
                        :con-item="item"
                        :con-index="index"
                        @setImpeach="setImpeach"
                      />
                    </li>
                  </ul>
                </div>
              </li>
              <div class="handle-button-box">
                <el-button
                  size="medium"
                  :disabled="prevButtonDisabled"
                  @click="prevQuestion"
                >
                  上一题
                </el-button>
                <el-button
                  size="medium"
                  type="primary"
                  :disabled="nextButtonDisabled"
                  @click="nextQuestion"
                >
                  下一题
                </el-button>
              </div>
            </ul>
          </el-card>
        </div>
        <exam-success v-else />
      </div>
      <the-footer v-if="paper.answerMode !== 2" />
    </section>
    <el-dialog
      title="提交"
      :visible.sync="centerDialogVisible"
      width="450px"
      center
      modal-append-to-body
      append-to-body
      lock-scroll
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <span>{{ submitTips }}</span>
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
import TheFooter from '@/page/TheFooter'
import AnswerByQuestion from './components/AnswerByQuestion'
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
  provide() {
    return {
      paper: this
    }
  },
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
    AnswerByQuestion,
    TheFooter
  },
  data() {
    return {
      submitTips: '',
      isLeave: false,
      examBeginTime: new Date(),
      dealTimeId: {},
      impeachList: [], // 存疑数组
      successPaper: {},
      isSuccess: false,
      confirmTips: '',
      centerDialogVisible: false,
      isWarningTimeLine: false,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      remainingTime: '00 : 00 : 00',
      paper: {},
      questionList: [],
      tempQuestionList: [],
      currentQuestion: 0
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
    ...mapGetters(['userInfo']),
    // 逐题答卷最后一题需要置灰按钮
    nextButtonDisabled() {
      return _.size(this.tempQuestionList) === this.currentQuestion + 1
    },
    // 逐题答卷的第一题置灰按钮
    prevButtonDisabled() {
      return this.currentQuestion === 0
    }
  },
  mounted() {
    this.initData()
    //阻止F5刷新
    // this.stopF5Refresh()
  },
  beforeRouteLeave(from, to, next) {
    if (this.isLeave) {
      next(true)
    } else {
      this.$message.error('禁止使用浏览器原生返回')
      next(false)
    }
  },
  // 解决定时器bug
  beforeDestroy() {
    clearInterval(this.dealTimeId)
  },
  methods: {
    prevQuestion() {
      this.currentQuestion -= 1
    },
    nextQuestion() {
      this.currentQuestion += 1
    },
    // 获取逐题的大题
    getByOneIndex(data) {
      let parentObj = { key: -1, value: {} }
      _.each(this.questionList, (parentItem, parentIndex) => {
        _.each(parentItem, (sonItem) => {
          if (data.id === sonItem.id) {
            parentObj.key = parentIndex
            parentObj.value = parentItem
          }
        })
      })
      return parentObj
    },
    // 检测闭卷
    watchCloseBookExam() {
      const { isDecoil } = this.paper
      // isDecoil：0是否，1为真
      if (isDecoil === 1) {
        // 跳转其他页面触发交卷
        window.onbeforeunload = function() {
          this.changeAutoEndExam()
        }
        // 切屏触发自动交卷
        document.addEventListener('visibilitychange', () => {
          this.changeAutoEndExam()
        })
      }
    },
    changeAutoEndExam() {
      if (!this.isSuccess) {
        this.submitTips = '系统检测到您切换屏幕，系统将自动提交答卷'
        this.autoEndExam()
      }
    },
    goBack() {
      this.$confirm('离开考试页面返回列表，即视为放弃本次考试机会。您确定要返回列表？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLeave = true
        this.$router.push({ path: '/exam/list' })
      })
    },
    // 点击滚动到对应的题目
    navTo(data, sonIndex, parentIndex, ref = 'paperScroll') {
      if (this.paper.answerMode === 1) {
        // 整卷移动
        const isFirst = sonIndex === 0 && parentIndex === 0
        const scollHeight = isFirst ? 0 : document.getElementById(`id${data.id}`).offsetTop
        let scrollElement = this.$refs[ref]
        scrollElement.scrollTo({
          top: scollHeight,
          behavior: 'smooth'
        })
      } else {
        // 逐题移动
        this.currentQuestion = _.findIndex(this.tempQuestionList, (item) => {
          return item.id === data.id
        })
      }
    },
    // 当前题目是否被做
    currentItemIsInSelected(data) {
      const getAnswerValue = (value) => {
        return _.get(value, 'answer')
      }
      const byTotal = getAnswerValue(data)
      const byOneIndex = _.findIndex(this.tempQuestionList, (item) => {
        return item.id === data.id && getAnswerValue(item)
      })
      const byOne = byOneIndex > -1
      const isSelected = this.paper.answerMode === 1 ? byTotal : byOne
      return isSelected
    },
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
    // 交卷逻辑直接跳转检测后交卷逻辑
    carryOut() {
      this.checkSubmit()
    },
    getAnswerCount(type) {
      let target = []
      _.each(this.questionList, (que, queIndex) => {
        _.each(que, (item, index) => {
          if (type === 'count') {
            let isAnswer = this.currentItemIsInSelected(item)
            if (!isAnswer) {
              target.push(item)
            }
          } else {
            this.navTo(item, index, queIndex, 'controlScroll')
          }
        })
      })
      if (type === 'count') {
        return target
      }
    },
    // TODO：考试交卷前校验
    // 检测存疑和未作答的题目，页面滚动到相关题目
    checkSubmit() {
      let noAnswerQuestion = this.getAnswerCount('count')
      const impeachTips = `${_.size(this.impeachList)}道试题标记存疑`
      const noAnswerTips = `${_.size(noAnswerQuestion)}道试题未作答`
      const commonTips = '可在答题卡中查看答题状态。'
      let tips = ''
      const isEmptyImpeach = _.isEmpty(this.impeachList)
      const isEmptyAnswer = _.isEmpty(noAnswerQuestion)
      // 两个都是空的，进行下一步过早校验
      if (isEmptyImpeach && isEmptyAnswer) {
        this.checkAdvance()
      } else {
        // 两个都不为空
        if (!isEmptyImpeach && !isEmptyAnswer) {
          tips = `还有${noAnswerTips}, ${impeachTips}，${commonTips}`
        } else if (!isEmptyImpeach) {
          tips = `还有${impeachTips}，${commonTips}`
        } else if (!isEmptyAnswer) {
          tips = `还有${noAnswerTips}，${commonTips}`
        }
        this.$confirm(tips, '提示', {
          confirmButtonText: '继续作答',
          cancelButtonText: '继续交卷',
          type: 'warning',
          distinguishCancelAndClose: true
        })
          .then(() => {
            this.getAnswerCount('scroll')
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.checkAdvance()
            }
          })
      }
    },
    // 不能提前多少分钟交卷，但是如果设置了自动交卷，则可以过滤这个规则
    // 检测提前交卷
    checkAdvance() {
      const { answerBanExam, answerBanExamValue } = this.paper
      if (answerBanExam) {
        // 做了过早限制，并且当前已考时间小于限制时长
        const usedTime = moment(new Date()).diff(moment(this.examBeginTime), 's')
        const limitTime = answerBanExamValue * 60
        if (usedTime < limitTime) {
          this.$confirm(`考试开始${answerBanExamValue}分钟内禁止交卷`, '提示', {
            confirmButtonText: '知道了',
            type: 'warning',
            showCancelButton: false,
            center: true
          })
        }
      } else {
        // 未做过早限制，跳转交卷逻辑
        this.$confirm('你确定要提交答卷吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitFun()
        })
      }
    },
    handleQustions() {
      const questionsTemp = _.flattenDeep(_.cloneDeep(this.questionList))
      let questions = []
      const PICK_KEY = ['id', 'answer', 'title', 'type', 'subQuestions']
      const loop = (data) => {
        _.each(data, (item) => {
          if (!_.isEmpty(item.subQuestions)) {
            const tempSub = _.cloneDeep(item.subQuestions)
            item.subQuestions = _.map(tempSub, (subItem) => {
              return _.pick(subItem, PICK_KEY)
            })
          }
          const pickItem = _.pick(item, PICK_KEY)
          questions.push(pickItem)
        })
      }
      loop(questionsTemp)
      return questions
    },
    // 处理交卷动作
    submitFun() {
      let questions = this.handleQustions()
      const params = {
        batchId: this.$route.query.batchId,
        examId: this.$route.query.examId,
        paperId: this.paper.id,
        totalScore: this.paper.totalScore,
        questions: questions
      }
      postSubmitPaper(params)
        .then((res) => {
          this.successPaper = res
        })
        .catch(() => {
          window.console.error(JSON.stringify(params))
        })
    },
    // 考试到时，自动交卷(自动交卷跳过校验逻辑)
    automaticSubmit() {
      this.centerDialogVisible = false
      this.submitTips = '考试时间已结束，系统将自动提交答卷'
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
      const { answerMode } = this.paper
      // 逐题模式
      if (answerMode === 2) {
        const topicList = _.flatten(_.cloneDeep(this.questionList))
        this.tempQuestionList = topicList
      }
      this.initRemainingTime()
      // 闭卷监听
      this.watchCloseBookExam()
    },
    //阻止F5刷新
    stopF5Refresh() {
      document.onkeydown = (e) => {
        var evt = window.event || e
        var code = evt.keyCode || evt.which
        if (code == 116) {
          if (evt.preventDefault) {
            evt.preventDefault()
          } else {
            evt.keyCode = 0
            evt.returnValue = false
          }
          this.$message.error('考试页面禁止刷新')
        }
      }
    },

    // TODO: 考试时间交卷逻辑需要补充
    initRemainingTime() {
      const { reckonTimeValue, strategy, examEndTime } = this.paper
      // 如果考试时长不计时，并且考试策略为true，最后5分钟需要爆红提示。计时就按照计时的算。
      const canUseUpTime = moment(new Date()).add(reckonTimeValue, 'm')
      // 考试策略strategy影响考试时长，如果为true，到了考试结束时间就必须交卷，否则可以考满设置的考试时间
      const dealline = strategy ? moment(examEndTime) : canUseUpTime
      this.dealTimeId = setInterval(() => {
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
        if (this.remainingTime !== '00 : 00 : 00') return
        clearInterval(this.dealTimeId)
        // 结束考试
        this.autoEndExam()
      }, 1000)
    },
    // 考试到时结束考试
    autoEndExam() {
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
  .close-book {
    margin: 20px auto 0;
    width: 1200px;
  }
  .container-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    .middle-container {
      .paper-main {
        position: relative;
        width: 1200px;
        margin: 20px auto;
        display: flex;
        justify-content: space-between;
        .main-left {
          position: fixed;
          width: 325px;
          overflow: hidden;
          height: calc(90vh);
          .left-inner-box {
            height: calc(100vh - 40px);
            overflow-y: auto;
            &::-webkit-scrollbar {
              width: 0 !important;
            }
          }
          .null-box {
            height: 60px;
            width: 100%;
          }
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
                margin-bottom: 10px;
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
                    margin-bottom: 14px;
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
          margin-left: 355px;
          flex: 1;
          min-height: calc(100vh - 96px);
          .question-ul {
            .question-li {
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
