<template>
  <div class="paper-container">
    <div class="paper-header">
      <div class="header-left">
        <i v-if="hasBack" class="iconimage_icon_leftarrow iconfont" @click="goBack" />
        <span class="title">{{ paper.name }}</span>
        <span v-if="!isSuccess" class="content">
          <span>共{{ paper.questionNum }}题，</span>
          <span v-if="paper.totalScore">总分{{ paper.totalScore }}分，</span>
          <span>限定最高分为{{ paper.scopeLimitValue }}分</span>
          <span v-if="paper.reckonTime">，计时{{ paper.reckonTimeValue }}分钟</span>
          <span>（答题不确定时，可用</span>
          <i class="iconimage_icon_help_normal iconfont" />
          <span>标记）</span>
        </span>
      </div>
      <div v-if="!isSuccess" class="header-right">
        <span v-if="paper.reckonTime" class="time" :class="{ 'warning-time': isWarningTimeLine }">
          <span>剩余时间：</span>
          <span>{{ remainingTime }}</span>
        </span>
        <el-button type="primary" size="medium" @click="carryOut">
          交卷
        </el-button>
      </div>
    </div>
    <div v-if="paper.isDecoil == 0" class="close-book">
      <el-alert
        title="本次为闭卷考试，考试期间若切换程序离开考试页面，则自动提交答卷！"
        type="warning"
        effect="dark"
      >
      </el-alert>
    </div>
    <section ref="paperScroll" class="container-section">
      <div class="middle-container">
        <div v-if="!isSuccess" class="paper-main">
          <div class="main-left">
            <div ref="controlScroll" class="left-inner-box">
              <el-card style="margin-bottom: 20px">
                <div class="avatar-card">
                  <el-avatar :size="80" :src="userInfo.avatar_url"></el-avatar>
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
                  <li v-for="(item, index) in questionList" :key="index" class="question-li">
                    <div class="li-title">
                      <span>{{ (index + 1) | number2zhcn }}、</span>
                      <span>{{ item[0].type | typeFilter }}</span>
                    </div>
                    <ul v-if="item[0].type !== QUESTION_TYPE_GROUP" class="list-box">
                      <li
                        v-for="(subItem, subIndex) in item"
                        :key="subItem.id"
                        class="list-li"
                        @click="navTo(subItem, index === subIndex && index === 0)"
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
                    <div v-else class="grounp__ul">
                      <div
                        v-for="(groupItem, gounpIndex) in item"
                        :key="groupItem.id"
                        class="grounp__li"
                      >
                        <span class="grounp__li__title">{{ gounpIndex + 1 }}</span>
                        <div class="list-box grounp__li__content">
                          <div
                            v-for="(subItem, subIndex) in groupItem.subQuestions"
                            :key="subItem.id"
                            class="grounp__li__sub list-li"
                            @click="navTo(subItem, index === subIndex && index === 0)"
                          >
                            <span
                              class="li-content"
                              :class="{
                                'select-li': currentItemIsInSelected(subItem),
                                'doubt-li': currentItemIsInImpeach(subItem)
                              }"
                            >
                              <span>（{{ subIndex + 1 }}）</span>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </el-card>
              <div class="null-box"></div>
            </div>
          </div>
          <el-card class="main-right">
            <!-- 逐卷考试 -->
            <ul v-if="isByPaperMode" class="question-ul">
              <li v-for="(item, index) in questionList" :key="index" class="question-li">
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
                    v-for="(conItem, topicIndex) in item"
                    :id="`id${conItem.paperQuestionId}`"
                    :key="conItem.paperQuestionId"
                    class="content-li"
                  >
                    <answer-by-question
                      :con-item="conItem"
                      :topic-index="topicIndex"
                      @setImpeach="setImpeach"
                    />
                  </li>
                </ul>
              </li>
            </ul>
            <!-- 逐题模式下的右侧答题区 -->
            <ul v-if="!isByPaperMode" class="question-ul">
              <li v-for="(item, index) in byOneQuestionList" :key="index">
                <div v-if="currentQuestion === index" class="question-li">
                  <div class="title-box">
                    <div class="question-li-title">
                      <span>{{ (getByOneIndex(item.id).key + 1) | number2zhcn }}、</span>
                      <span>{{ item.type | typeFilter }}</span>
                      <span>
                        <span>（共{{ _.size(getByOneIndex(item.id).value) }}题</span>
                        <span>, 共{{ getItemTotalScore(getByOneIndex(item.id).value) }}分）</span>
                      </span>
                    </div>
                    <div class="sub-title">
                      {{ item.title }}
                    </div>
                  </div>
                  <ul class="content-box">
                    <li class="content-li">
                      <answer-by-question
                        :disabled="disabledByQuestion"
                        :topic-index="getByOneIndex(item.id).index"
                        :con-item="item"
                        @setImpeach="setImpeach"
                      />
                    </li>
                  </ul>
                </div>
              </li>
              <div class="handle-button-box">
                <el-button size="medium" :disabled="prevButtonDisabled" @click="prevQuestion">
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
                <span
                  v-if="_.get(limitTimeList, `[${currentQuestion}].countDown`)"
                  class="limit-time"
                >
                  <span>本题限时：</span>
                  <span>{{ _.get(limitTimeList, `[${currentQuestion}].countDown`) }}</span>
                </span>
              </div>
            </ul>
          </el-card>
        </div>
        <exam-success v-else />
      </div>
      <the-footer v-if="isByPaperMode" />
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="true">{{ confirmTips }}</el-button>
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
const RETURN_ZERO = '00:00:00'
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
      paperData: this
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
      hasBack: true,
      isAutoEnd: false,
      submitLoading: false, // 提交不许重复
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
      remainingTime: RETURN_ZERO,
      paper: {},
      questionList: [],
      byOneQuestionList: [], //逐题模式下的问题数据
      currentQuestion: 0, // 当前激活的题目
      limitTimeList: [], // 维护每一道题目的限时数据
      byOneTimeId: {}
    }
  },
  computed: {
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP,
    ...mapGetters(['userInfo', 'userId']),
    // 逐题答卷最后一题需要置灰按钮
    nextButtonDisabled() {
      return _.size(this.byOneQuestionList) === this.currentQuestion + 1
    },
    // 逐题答卷的第一题置灰按钮
    prevButtonDisabled() {
      return this.currentQuestion === 0
    },
    currentCountDown() {
      return _.get(this.limitTimeList, `[${this.currentQuestion}].countDown`)
    },
    disabledByQuestion() {
      return this.currentCountDown && this.currentCountDown === RETURN_ZERO
    },
    // 是否是逐卷模式 1逐卷2逐题
    isByPaperMode() {
      return _.get(this.paper, 'answerMode') === 1
    }
  },
  watch: {
    currentCountDown: {
      handler(value) {
        if (value === RETURN_ZERO) {
          this.$message.error('该试题已超过答题时间，不能继续作答')
        }
      },
      deep: true,
      immediate: true
    },
    currentQuestion: {
      handler() {
        this.commonCreateCountdown()
      }
    },
    questionList: {
      handler() {
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initData()
  },
  beforeRouteLeave(from, to, next) {
    if (this.isLeave || this.isSuccess) {
      this.clearIntervalAll()
      this.resetF5Refresh()
      this.clearWatchClose()
      // 关闭闭卷监听
      this.clearWatchCloseBookExam()
      this.isSuccess = false
      next(true)
    } else {
      this.$message.error('禁止使用浏览器原生返回')
      next(false)
    }
  },
  methods: {
    clearIntervalAll() {
      clearInterval(this.dealTimeId)
      clearInterval(this.byOneTimeId)
    },
    prevQuestion() {
      this.currentQuestion -= 1
    },
    nextQuestion() {
      this.currentQuestion += 1
    },
    commonCreateCountdown() {
      if (this.currentCountDown !== RETURN_ZERO) {
        clearInterval(this.byOneTimeId)
        this.createByOneCountdown()
      }
    },
    // 获取逐题的大题
    getByOneIndex(sourceId) {
      let parentObj = { key: -1, value: {} }
      _.each(this.questionList, (parentItem, parentIndex) => {
        _.each(parentItem, (sonItem, sonIndex) => {
          if (sourceId === sonItem.id) {
            parentObj.key = parentIndex
            parentObj.value = parentItem
            parentObj.index = sonIndex
          }
        })
      })
      return parentObj
    },
    changeAutoEndExam() {
      if (!this.isSuccess && !this.isAutoEnd) {
        this.submitTips = '系统检测到您切换屏幕，系统将自动提交答卷'
        this.isAutoEnd = true
        this.autoEndExam(this.submitTips)
        clearInterval(this.dealTimeId)
      }
    },
    goBack() {
      if (!this.isSuccess) {
        this.$confirm('离开考试页面返回列表，即视为放弃本次考试机会。您确定要返回列表？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isLeave = true
          this.$router.push({ path: '/exam/list' })
        })
      } else {
        this.$router.push({ path: '/exam/list' })
      }
    },
    // 点击滚动到对应的题目
    /**
     * data当前题目的数据
     * isFirst: 整卷滚动是否是第一个
     */
    navTo(data, isFirst) {
      if (this.isByPaperMode) {
        // 整卷移动
        const scollHeight = isFirst
          ? 0
          : document.getElementById(`id${data.paperQuestionId}`).offsetTop
        let scrollElement = this.$refs.paperScroll
        scrollElement.scrollTo({
          top: scollHeight,
          behavior: 'smooth'
        })
      } else {
        // 逐题移动
        let targetIndex = 0
        _.each(this.byOneQuestionList, (item, index) => {
          if (item.type === QUESTION_TYPE_GROUP) {
            _.each(item.subQuestions, (sunItem) => {
              if (sunItem.id === data.id) {
                targetIndex = index
              }
            })
          } else {
            if (item.id === data.id) {
              targetIndex = index
            }
          }
        })
        this.currentQuestion = targetIndex
        clearInterval(this.byOneTimeId)
        this.createByOneCountdown()
      }
    },
    // 当前题目是否被做
    currentItemIsInSelected(data) {
      return _.get(data, 'answer')
    },
    // 当前对象是否存在于存疑数据数组
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
            if (parentItem[0].type !== QUESTION_TYPE_GROUP) {
              if (sonItem.id === data.id) {
                this.impeachList.push({
                  key: data.id,
                  value: [parentIndex, sonIndex]
                })
              }
            } else {
              _.each(_.get(sonItem, 'subQuestions'), (subItem, subIndex) => {
                if (subItem.id === data.id) {
                  this.impeachList.push({
                    key: data.id,
                    value: [parentIndex, subIndex]
                  })
                }
              })
            }
          })
        })
      }
    },
    /**
     * 获取试题总分
     */
    getItemTotalScore(data) {
      const addScore = (args) => {
        return args.reduce((prev, curr) => {
          return prev + curr
        })
      }
      const scoreList = _.map(data, (item) => {
        return item.score
      })
      const totalScore = addScore(scoreList)
      return totalScore
    },
    // 交卷逻辑直接跳转检测后交卷逻辑
    carryOut() {
      this.checkSubmit()
    },
    // 获取未答的题目
    /**
     * type：count计算未填写的题目的数值，scroll表示滚动
     */
    getAnswerCount(type) {
      let notAnswerList = []
      let isAnswer = true
      _.each(this.questionList, (que) => {
        _.each(que, (item) => {
          if (item.type === QUESTION_TYPE_GROUP) {
            isAnswer = _.every(item.subQuestions, (subItem) => {
              return this.currentItemIsInSelected(subItem)
            })
          } else {
            isAnswer = this.currentItemIsInSelected(item)
          }
          // 未填的数据才能通过
          if (!isAnswer) {
            notAnswerList.push(item)
          }
        })
      })
      if (!_.isEmpty(notAnswerList) && type !== 'count') {
        let targetItem = {}
        // 试题组
        if (_.get(notAnswerList, '[0].type') === QUESTION_TYPE_GROUP) {
          targetItem = _.get(notAnswerList, '[0].subQuestions[0]')
        } else {
          targetItem = _.get(notAnswerList, '[0]')
        }
        this.navTo(targetItem, false)
      }
      return notAnswerList
    },
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
        const usedTime = moment(new Date()).diff(moment(this.examBeginTime), 'seconds')
        const limitTime = answerBanExamValue * 60
        if (usedTime < limitTime) {
          this.$confirm(`考试开始${answerBanExamValue}分钟内禁止交卷`, '提示', {
            confirmButtonText: '知道了',
            type: 'warning',
            showCancelButton: false,
            center: true
          })
        } else {
          // 到时可以交卷
          this.submitFun()
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
    // 交卷前先处理成后端想要的参数格式
    handleQustions() {
      const questionList = this.isByPaperMode ? this.questionList : this.byOneQuestionList
      const questionsTemp = _.flattenDeep(_.cloneDeep(questionList))
      let questions = []
      const PICK_KEY = ['id', 'answer', 'title', 'type', 'subQuestions', 'paperQuestionId']
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
      if (this.submitLoading) return
      this.submitLoading = true
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
          const { data } = res
          this.successPaper = data
          this.isSuccess = true
          // 提交的时候删除当前存在本地的考试信息
          const hasOffLineExam = !_.isEmpty(localStorage.getItem('offLineExam'))
          if (hasOffLineExam) {
            localStorage.removeItem('offLineExam')
          }
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
          window.console.error(JSON.stringify(params))
        })
    },
    // 考试到时，自动交卷(自动交卷跳过校验逻辑)
    automaticSubmit() {
      this.isAutoEnd = false
      this.submitTips = '考试时间已结束，系统将自动提交答卷'
      this.submitFun()
    },
    async initData() {
      this.paper = await getTakeExam(_.omit(this.$route.query, ['isReNew']))
      // 初始化题目数据处理
      this.initQuestionList()
      // 逐题模式
      this.initAnswerByOne()
      // 初始考试倒计时
      this.initRemainingTime()
      // 开发环境先关闭
      if (process.env.NODE_ENV === 'production') {
        // 开启监听关闭标签页
        this.initWatchClose()
        // 是否有返回权限
        this.initBackAuth()
        // 闭卷监听
        this.initWatchCloseBookExam()
        // 监听联网断网
        this.initWatchNetworks()
        //阻止F5刷新
        this.stopF5Refresh()
      }
    },
    /**
     * 只有开卷，且不限制次数或者还存在剩余参加次数才显示返回按钮
     * isDecoil 1为开卷
     * joinNum false为不限制次数
     * examTimes 最后一次进来应该会返回1
     */
    initBackAuth() {
      const { isDecoil, joinNum, joinNumValue, examTimes } = this.paper
      this.hasBack = isDecoil === 1 && (!joinNum || (joinNum && joinNumValue - examTimes > 1))
    },
    initWatchClose() {
      window.addEventListener('beforeunload', this.watchCloseChrome)
    },
    clearWatchClose() {
      window.removeEventListener('beforeunload', this.watchCloseChrome)
    },
    // 开启闭卷监听
    initWatchCloseBookExam() {
      const { isDecoil } = this.paper
      // isDecoil：0是闭卷，1为开卷
      if (isDecoil === 0) {
        // 切屏触发自动交卷
        window.addEventListener('visibilitychange', this.watchBookExam)
        // 跳转其他页面触发交卷
        window.addEventListener('beforeunload', this.watchBookExam)
      }
    },
    // 关闭闭卷监听
    clearWatchCloseBookExam() {
      const { isDecoil } = this.paper
      // isDecoil：0是闭卷，1为开卷
      if (isDecoil === 0) {
        // 切屏触发自动交卷
        window.removeEventListener('visibilitychange', this.watchBookExam)
        // 跳转其他页面触发交卷
        window.removeEventListener('beforeunload', this.watchBookExam)
      }
    },
    watchBookExam() {
      if (document.visibilityState === 'visible') {
        this.changeAutoEndExam()
      }
    },
    watchCloseChrome(e) {
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '关闭提示'
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '关闭提示'
    },
    initWatchNetworks() {
      const EventUtil = {
        addHandler: function(element, type, handler) {
          if (element.addEventListener) {
            element.addEventListener(type, handler, false)
          } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler)
          } else {
            element['on' + type] = handler
          }
        }
      }
      EventUtil.addHandler(window, 'online', () => {
        this.$notify({
          title: '联网提示',
          type: 'success',
          message: '当前网络环境已重新连接，请继续作答！',
          showClose: false
        })
      })
      EventUtil.addHandler(window, 'offline', () => {
        this.offlineTips()
        const examDataTemp = this.isByPaperMode ? this.questionList : this.byOneQuestionList
        const offLineExam = {
          examId: this.$route.query.examId,
          userId: this.userId,
          examData: JSON.stringify(examDataTemp)
        }
        localStorage.setItem('offLineExam', JSON.stringify(offLineExam))
      })
    },
    offlineTips() {
      this.$notify.error({
        title: '断网提示',
        message: '当前网络环境已失去连接，已为您保存答案在本地！',
        showClose: false
      })
    },
    /**
     * 初始化逐卷考题数据
     * 通过parentSort分组再排序
     * 再在内部排序一次
     */
    initQuestionList() {
      this.questionList = _.chain(_.cloneDeep(this.paper.questions))
        .groupBy('parentSort')
        .sortBy('parentSort')
        .map((item) => {
          return _.sortBy(item, 'sort')
        })
        .value()
      // 判断是否断网重连
      this.reNewExam()
    },
    reNewExam() {
      // 如果是断网后重连，数据需要覆盖一次
      const { isReNew } = this.$route.query
      if (isReNew && isReNew !== 'false') {
        const offLineExamData = JSON.parse(JSON.parse(localStorage.getItem('offLineExam')).examData)
        this.questionList = _.assign(_.cloneDeep(this.questionList), _.cloneDeep(offLineExamData))
      }
    },
    // 逐题模式下的相关初始化
    initAnswerByOne() {
      const { answerMode } = this.paper
      if (answerMode !== 2) return
      // 赋值逐题问卷的数据
      this.byOneQuestionList = _.flatten(this.questionList)
      this.initByOneTime()
    },
    async initByOneTime() {
      const { questionTimeLimit, questionTimeLimitType } = this.paper
      if (questionTimeLimitType === 0) return // 不计时就不显示
      this.limitTimeList = _.map(this.byOneQuestionList, (item, index) => {
        const limit = questionTimeLimitType === 2 ? questionTimeLimit * 60 : item.timeLimit
        let temp = {
          index: index,
          key: item.id,
          limit: limit,
          timeLeft: limit,
          countDown: null
        }
        return temp
      })
      this.createByOneCountdown()
    },
    createByOneCountdown() {
      _.each(this.limitTimeList, (item, index) => {
        if (item.timeLeft) {
          if (this.currentQuestion === index) {
            this.byOneTimeId = setInterval(() => {
              item.timeLeft--
              item.countDown = this.createCountdown(item.timeLeft)
              item.countDown = item.countDown == '-' ? '00:00:00' : item.countDown
              if (item.countDown === '00:00:00') {
                clearInterval(this.byOneTimeId)
              }
            }, 1000)
          } else {
            this.limitTimeList.timeLeft = item.timeLeft
          }
        }
      })
    },
    //阻止F5刷新
    stopF5Refresh() {
      window.addEventListener('keydown', this.preventDefaultFun)
    },
    // 离开重置刷新
    resetF5Refresh() {
      window.removeEventListener('keydown', this.preventDefaultFun)
    },
    preventDefaultFun(e) {
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
    },
    // 初始化考试时间
    initRemainingTime() {
      const { reckonTimeValue, strategy, examEndTime, reckonTime } = this.paper
      // 不计时不需要进行以下步骤
      if (!reckonTime) return
      // 如果考试时长不计时，并且考试策略为true，最后5分钟需要爆红提示。计时就按照计时的算。
      const canUseUpTime = moment(new Date()).add(reckonTimeValue, 'm')
      var examEndTimeMs = moment(examEndTime, 'YYYY-MM-DD HH:mm:ss').valueOf()
      // 考试结束时间与进入时间差
      var timeDeffMs = examEndTimeMs - new Date().getTime()
      // 默认设置时间
      var reckonTimeValueTimeMs = reckonTimeValue * 60 * 1000
      let momentTime = ''
      if (reckonTimeValueTimeMs > timeDeffMs) {
        momentTime = moment(examEndTime)
      } else {
        momentTime = canUseUpTime
      }
      const dealline = strategy ? momentTime : canUseUpTime

      // 考试策略strategy影响考试时长，如果为true，到了考试结束时间就必须交卷，否则可以考满设置的考试时间
      let diffTime = moment(dealline).diff(new Date(), 'seconds')
      this.remainingTime = this.createCountdown(diffTime)
      this.dealTimeId = setInterval(() => {
        diffTime = moment(dealline).diff(new Date(), 'seconds')
        // 5分钟为时间警戒线，经过测试兑换的值为301995
        const WARNING_LINE = 300
        if (diffTime <= WARNING_LINE) {
          this.isWarningTimeLine = true
        }
        this.remainingTime = this.createCountdown(diffTime)
        this.remainingTime = this.remainingTime == '-' ? '00:00:00' : this.remainingTime
        if (this.remainingTime !== RETURN_ZERO) return
        clearInterval(this.dealTimeId)
        // 结束考试
        this.submitTips = '考试时间已结束，系统将自动提交答卷'
        this.autoEndExam(this.submitTips)
      }, 1000)
    },
    /**
     * 入参：差异时间
     * 返回：倒计时
     * 作用：创建一个倒计时
     */
    createCountdown(diffTime) {
      // const hoursTime = moment.duration(diffTime).hours()
      // console.log('hoursTime:',hoursTime)
      // const minutesTime = moment(diffTime).minutes()
      //   console.log('minutesTime:',minutesTime)
      // const secondsTime = moment(diffTime).seconds()
      //  console.log('secondsTime:',secondsTime)
      // const formatHours = `${hoursTime < 10 ? `0${hoursTime}` : hoursTime}`
      // const formatMinutes = `${minutesTime < 10 ? `0${minutesTime}` : minutesTime}`
      // const formatSeconds = `${secondsTime < 10 ? `0${secondsTime}` : secondsTime}`
      // const targetTime = `${formatHours} : ${formatMinutes} : ${formatSeconds}`

      if (!diffTime) {
        return '-'
      }
      let targetTime = ''
      var hour = Math.floor(diffTime / 3600) //时
      var min = Math.floor((diffTime % 3600) / 60) //分
      var second = diffTime % 60 //秒
      if (hour >= 0) {
        targetTime += (hour > 9 ? hour.toString() : '0' + hour.toString()) + ':'
      }
      targetTime += (min > 9 ? min.toString() : '0' + min.toString()) + ':'
      targetTime += second > 9 ? second.toString() : '0' + second.toString()
      return targetTime
    },
    // 考试到时结束考试
    autoEndExam(submitTips) {
      let timeTips = 4
      const autoEndExamTimeId = setInterval(async () => {
        timeTips -= 1
        if (timeTips === 0) {
          clearInterval(autoEndExamTimeId)
          await this.automaticSubmit()
          this.centerDialogVisible = false
        } else {
          this.centerDialogVisible = true
        }
        this.submitTips = submitTips
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
          width: 285px;
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
                .grounp__ul {
                  .grounp__li {
                    display: flex;
                    align-items: flex-start;
                    .grounp__li__title {
                      margin-top: 10px;
                    }
                    .grounp__li__content {
                      flex: 1;
                    }
                    .grounp__li__sub {
                    }
                  }
                }
              }
            }
          }
        }

        .main-right {
          margin-left: 305px;
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
  .handle-button-box {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    .limit-time {
      margin-left: 24px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 550;
    }
  }
}
/deep/ .el-dialog--center .el-dialog__body {
  text-align: center !important;
}
</style>
