<template>
  <div>
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />
    <el-card class="top-card">
      <div class="card-header">
        <div class="header-title-box">
          <span class="title">{{ examDetail.examName }}</span>
          <el-tag v-if="_.get(examDetail.status)" :type="getStatus(examDetail.status).type">
            {{ getStatus(examDetail.status).text }}
          </el-tag>
        </div>
        <ul class="header-ul">
          <li class="header-li">
            <span class="li-label">考试用卷：</span>
            <span class="li-value">{{ examDetail.paperName }}</span>
          </li>
          <li class="header-li">
            <span class="li-label">考试时间：</span>
            <span class="li-value">
              <span>{{ moment(examDetail.answerBeginTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              <span>至</span>
              <span>{{ moment(examDetail.answerEndTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </span>
          </li>
          <li class="header-li">
            <span class="li-label">考试用时：</span>
            <span class="li-value">
              <span>{{
                Math.ceil(
                  moment(examDetail.answerEndTime).diff(
                    moment(examDetail.answerBeginTime),
                    'minutes',
                    true
                  )
                )
              }}</span>
              <span>分钟</span>
            </span>
          </li>
          <li class="header-li">
            <span class="li-label">试卷总分：</span>
            <span class="li-value">
              <span>{{ examDetail.totalScore }}分</span>
              <span v-if="examDetail.scopeLimit">
                （已限定最高分为{{ examDetail.scopeLimitValue }}分）
              </span>
            </span>
          </li>
          <li v-if="examDetail.scoreVisible" class="header-li">
            <span class="li-label">考试得分：</span>
            <span class="li-value">
              <span>{{ examDetail.score }}分</span>
              <span>（客观题{{ examDetail.objectiveScore }}分，</span>
              <span>主观题{{
                examDetail.subjectiveScore ? `${examDetail.subjectiveScore}分` : ' - - '
              }}）</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="card-bottom">
        <span class="bottom-title">查看试题范围</span>
        <el-radio-group v-model="queryInfo.type">
          <el-radio :label="0">
            全部试题
          </el-radio>
          <el-radio :label="1">
            答对试题
          </el-radio>
          <el-radio :label="2">
            答错试题
          </el-radio>
          <el-radio :label="3">
            未作答试题
          </el-radio>
        </el-radio-group>
      </div>
    </el-card>
    <el-card class="paper-card">
      <ul v-if="!_.isEmpty(questionList)" class="question-ul">
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
          <div class="content-box">
            <ul class="content-ul">
              <li v-for="(conItem, conIndex) in item" :key="conIndex" class="content-li">
                <span>{{ conIndex + 1 }}.</span>
                <QustionPreview
                  v-if="QUESTION_TYPE_GROUP !== conItem.type"
                  :data="conItem"
                  type="view"
                  :is-view-results="examDetail.scoreVisible"
                  :paper-data="examDetail"
                />
                <span v-else>
                  <span class="right-title" v-html="getHTML(conItem.content)"></span>
                  <ul>
                    <li
                      v-for="(paperItem, paperIndex) in conItem.subQuestions"
                      :key="paperIndex"
                      class="paper__li"
                    >
                      <span>({{ paperIndex + 1 }}) </span>
                      <QustionPreview
                        :data="paperItem"
                        :paper-data="examDetail"
                        type="view"
                        :is-view-results="examDetail.scoreVisible"
                      />
                    </li>
                  </ul>
                </span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <common-empty v-else />
    </el-card>
  </div>
</template>

<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import { getViewAnswer, viewAnswerEachSession } from '@/api/exam'
import moment from 'moment'
import QustionPreview from './components/questionPreview'
import CommonEmpty from '@/components/common-empty/Empty'
const STATUS = {
  1: {
    type: 'success',
    text: '已发布'
  },
  2: {
    type: 'danger',
    text: '考试中'
  },
  3: {
    type: 'info',
    text: '已提交'
  },
  4: {
    type: 'warning',
    text: '阅卷中'
  },
  5: {
    type: 'success',
    text: '已阅卷'
  }
}
import { addLine } from '@/util/util'
const nzhcn = require('nzh/cn')
import { QUESTION_TYPE_MAP, QUESTION_TYPE_GROUP } from '@/const/exam'
export default {
  components: {
    CommonBreadcrumb,
    QustionPreview,
    CommonEmpty
  },
  filters: {
    typeFilter(data) {
      return QUESTION_TYPE_MAP[data]
    },
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  data() {
    return {
      routeList: [],
      examDetail: {},
      questionList: [],
      queryInfo: {
        type: 0
      }
    }
  },
  computed: {
    id() {
      return _.get(this.$route, 'query.id', null)
    },
    QUESTION_TYPE_GROUP: () => QUESTION_TYPE_GROUP
  },
  watch: {
    'queryInfo.type': {
      handler() {
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  activated() {
    const examIds = _.get(this.$route, 'query.examIds')
    const noMiddleRoutes = [
      {
        path: '/exam',
        title: '考试'
      },
      {
        path: '',
        title: '查看答卷'
      }
    ]
    let middleRoutes = _.cloneDeep(noMiddleRoutes)
    middleRoutes.splice(1, 0, {
      path: `/exam/middle?id=${this.$route.query.examIds}`,
      title: this.$route.query.examName
    })
    this.routeList = examIds ? middleRoutes : noMiddleRoutes
  },
  methods: {
    getHTML(content) {
      return addLine(content)
    },
    moment,
    async loadData() {
      const loadFun = _.get(this.$route.query, 'examId') ? getViewAnswer : viewAnswerEachSession
      this.examDetail = await loadFun(
        _.assign(this.queryInfo, _.omit(this.$route.query, ['examIds', 'examName']))
      )
      this.initQuestionList()
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
      return totalScore
    },
    initQuestionList() {
      this.questionList = _.chain(_.cloneDeep(this.examDetail.questions))
        .groupBy('parentSort')
        .sortBy('parentSort')
        .map((item) => {
          return _.sortBy(item, 'sort')
        })
        .value()
    },
    getStatus(status) {
      return STATUS[status]
    }
  }
}
</script>

<style scoped lang="scss">
.top-card {
  .card-header {
    padding-bottom: 8px;
    border-bottom: 1px solid #ebeced;
    .header-title-box {
      margin-bottom: 16px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        margin-right: 8px;
      }
    }
    .header-ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      &::after {
        content: '';
        width: calc(100% / 3);
      }
      .header-li {
        width: calc(100% / 3);
        margin-bottom: 16px;
        .li-label {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
        }
        .li-value {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
        }
      }
    }
  }
  .card-bottom {
    padding-top: 24px;
    .bottom-title {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      margin-right: 16px;
    }
    /deep/ .el-radio {
      margin-right: 24px;
    }
  }
}
.paper-card {
  margin-top: 20px;
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
        .paper__li {
          margin: 4px 0 20px;
        }
      }
    }
  }
}
</style>
