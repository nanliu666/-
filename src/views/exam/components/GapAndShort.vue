<template>
  <div class="view-contain-box">
    <div class="dot-box">
      <div class="dot-content">
        <span class="dot"></span>
        <span>
          <span class="label">标准答案：</span>
          <span class="value is-correct">{{ getCorrect() }}</span>
        </span>
      </div>
    </div>
    <div class="blank-box common-box">
      <div class="blank-top">
        <span class="label">考生答案：</span>
        <span class="value">{{ data.answerUser ? data.answerUser : '考生未作答' }}</span>
      </div>
      <div v-if="_.get(data, 'result', '-1') !== '-1'" class="blank-middle">
        <div>
          <span class="label">评分结果：</span>
          <span class="value">{{ getResult(data) }}</span>
        </div>
        <div>
          <span class="label">得分：</span>
          <span class="value">{{ data.scoreUser }}</span>
        </div>
        <div>
          <span class="label">评卷人：</span>
          <span class="value">{{ data.review }}</span>
        </div>
      </div>
      <div v-if="data.reviewRemark" class="remark-box">
        <span class="label">评语：</span>
        <span class="value">{{ data.reviewRemark }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GapAndShort',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    // 获取正确答案
    getCorrect() {
      // const target = _.chain(this.data.options)
      //   .filter((item) => {
      //     return item.isCorrect
      //   })
      //   .map('isCorrect')
      //   .join(' ')
      //   .value()
      // this.correctContent = target
      // return target
      // TODO: 填空题的标准答案获取
      return _.get(this.data, 'options[0].content', '未设置标椎答案')
    },
    getResult(data) {
      const key = _.get(data, 'result', '-1')
      const RESULT = {
        '-1': '',
        '0': '对',
        '1': '错',
        '2': '部分对'
      }
      return RESULT[key]
    },
    // 获取考生答案
    getAnswerValue() {
      const target = _.chain(this.data.options)
        .find((item) => {
          return item.id === this.data.answerUser
        })
        .get('content', '考生未作答')
        .value()
      return target
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
  .analysis-box {
    margin-top: 8px;
  }
  .common-box {
    padding: 24px;
    background-color: #fafafa;
  }
  .blank-box {
    .blank-top {
    }
    .blank-middle {
      border-top: 1px solid rgba(0, 11, 21, 0.05);
      padding-top: 24px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
    }
    .remark-box {
      margin-top: 24px;
    }
  }
  .dot-box {
    margin: 24px 0 16px 24px;
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
}
</style>
