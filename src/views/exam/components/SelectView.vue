<template>
  <div class="view-contain-box">
    <div class="options-box">
      <div class="options-content">
        <div class="dot-box">
          <div class="dot-content">
            <span class="dot"></span>
            <span class="label">选项：</span>
          </div>
        </div>
        <ul class="select-ul value">
          <li
            v-for="(option, index) in data.options"
            :key="index"
            class="select-li"
            :class="{ 'is-correct': getCorrectClass(option), 'is-fault': getFault(option) }"
          >
            <span>
              <span style="margin-right: 4px">{{ QUESTION_PREFACE[index] }}.</span>
              <span>{{ _.unescape(option.content) }}</span>
            </span>
            <question-view v-if="option.url" :url="option.url" />
          </li>
        </ul>
      </div>
      <div v-if="paperData.publicAnswers" class="correct-answer-box">
        <span class="label">正确答案：</span>
        <span class="value is-correct">{{ getCorrect() }}</span>
      </div>
    </div>
    <div class="answer-box common-box">
      <div class="answer">
        <span class="label">考生答案：</span>
        <!-- 有作答并且答案与标准答案一致 -->
        <span
          class="value"
          :class="{
            'is-correct': data.answerUser && data.answerUser === data.answerQuestion,
            'is-fault': data.answerUser && data.answerUser !== data.answerQuestion
          }"
        >{{ getAnswerValue() }}</span>
      </div>
      <div v-if="isViewResults" class="answer">
        <span class="label">得分：</span>
        <span class="value">{{ data.scoreUser }}分</span>
      </div>
    </div>
    <div v-if="data.analysis" class="analysis-box common-box">
      <span class="label">试题分析：</span>
      <span class="value">{{ data.analysis }}</span>
    </div>
  </div>
</template>

<script>
import questionView from './questionView'
import { QUESTION_PREFACE } from '@/const/exam'
export default {
  name: 'SelectView',
  components: {
    questionView
  },
  props: {
    paperData: {
      type: Object,
      default: () => ({})
    },
    isViewResults: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  computed: {
    QUESTION_PREFACE: () => QUESTION_PREFACE
  },
  methods: {
    // 当前选项被选且未错误答案 isCorrect：0为错误答案，1为正确答案
    getFault(item) {
      return this.data.answerUser.includes(item.id) && !item.isCorrect
    },
    // 当前选项被选且正确
    getCorrectClass(item) {
      return this.data.answerUser.includes(item.id) && item.isCorrect == 1
    },
    // 获取正确答案
    getCorrect() {
      let target = []
      _.each(this.data.options, (item, index) => {
        if (_.includes(this.data.answerQuestion, item.id)) {
          target.push(QUESTION_PREFACE[index])
        }
      })
      return !_.isEmpty(target) ? _.join(target, ',') : '暂无正确答案'
    },
    // 获取考生答案
    getAnswerValue() {
      let target = []
      _.each(this.data.options, (item, index) => {
        if (_.includes(this.data.answerUser, item.id)) {
          target.push(QUESTION_PREFACE[index])
        }
      })
      return !_.isEmpty(target) ? _.join(target, ',') : '考生未作答'
    }
  }
}
</script>

<style scoped lang="scss">
.view-contain-box {
  .label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.25);
  }
  .value {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
  }
  .is-correct {
    color: #00b061;
  }
  .is-fault {
    color: #ff4329;
  }
  .options-box {
    margin-top: 24px;
    .options-content {
      display: flex;
      .dot-box {
        .dot-content {
          display: flex;
          align-items: center;
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(0, 11, 21, 0.25);
            margin-right: 6px;
          }
        }
      }
      .select-ul {
        .select-li {
          margin-bottom: 16px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .correct-answer-box {
      margin-top: 16px;
      padding-left: 24px;
    }
  }
  .analysis-box {
    margin-top: 8px;
  }
  .common-box {
    padding: 24px;
    background-color: #fafafa;
  }
  .answer-box {
    margin-top: 16px;
    display: flex;
    justify-content: flex-start;
    .answer {
      margin-right: 70px;
    }
  }
}
</style>
