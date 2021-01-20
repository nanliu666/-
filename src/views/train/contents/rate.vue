<template>
  <div class="rate">
    <div class="rate-top">
      <div class="rate-list">
        <div class="rate-item">
          培训评分：
        </div>
      </div>
      <div class="rate-list">
        <div class="rate-item">
          <span style="font-size: 16px;color: rgba(0,11,21,0.85); font-weight: 700;">
            培训班整体满意度：
          </span>
          <el-rate
            v-model="rate.composite"
            allow-half
            :disabled="disabled"
            show-score
            text-color="rgba(0,11,21,0.85)"
            score-template="{value}分"
          >
          </el-rate>
        </div>
      </div>
      <div class="rate-list">
        <div class="rate-item">
          内容符合预期：
          <el-rate
            v-model="rate.first"
            allow-half
            class="rate"
            :disabled="disabled"
            show-score
            text-color="rgba(0,11,21,0.85)"
            score-template="{value}分"
          >
          </el-rate>
        </div>
      </div>
      <div class="rate-list">
        <div class="rate-item">
          课程设置合理：
          <el-rate
            v-model="rate.second"
            allow-half
            class="rate"
            :disabled="disabled"
            show-score
            text-color="rgba(0,11,21,0.85)"
            score-template="{value}分"
          >
          </el-rate>
        </div>
      </div>
      <div class="rate-list">
        <div class="rate-item">
          培训有所收获：
          <el-rate
            v-model="rate.third"
            allow-half
            class="rate"
            :disabled="disabled"
            show-score
            text-color="rgba(0,11,21,0.85)"
            score-template="{value}分"
          >
          </el-rate>
        </div>
      </div>
      <div class="rate-list">
        <div class="rate-item">
          教材容易理解：
          <el-rate
            v-model="rate.fourth"
            allow-half
            class="rate"
            :disabled="disabled"
            show-score
            text-color="rgba(0,11,21,0.85)"
            score-template="{value}分"
          >
          </el-rate>
        </div>
      </div>
      <div class="rate-list">
        <div class="rate-item">
          形式利于掌握：
          <el-rate
            v-model="rate.fifth"
            allow-half
            class="rate"
            :disabled="disabled"
            show-score
            text-color="rgba(0,11,21,0.85)"
            score-template="{value}分"
          >
          </el-rate>
        </div>
      </div>
    </div>

    <div class="rate-bottom">
      <div v-for="teacher in rate.teachersEvaluate" :key="teacher.teacherId" class="rate-list">
        <div class="rate-item">
          <span class="rate-teacher"> {{ teacher.teacherName }}（讲师） </span>
          授课质量：
          <el-rate
            v-model="teacher.teacherScore"
            allow-half
            :disabled="disabled"
            show-score
            text-color="rgba(0,11,21,0.85)"
            score-template="{value}分"
          >
          </el-rate>
        </div>
      </div>

      <el-button
        v-if="!disabled"
        style="margin: 24px 0 133px;"
        type="primary"
        size="medium"
        @click.native="addEvaluate"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import { getTrainEvaluate, addEvaluate } from 'src/api/train'
function isEmptyString(value) {
  return value === ''
}
export default {
  name: 'Rate',
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
      rate: {
        composite: 0,
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0,
        teachersEvaluate: []
      },
      teacherName: '',
      disabled: true
    }
  },
  async activated() {
    await this.getTrainEvaluate()
    const composite = this.rate.composite
    this.disabled = this.data.userType === 0 && composite !== '' && !isNaN(composite)
    for (let k in this.rate) {
      if (this.rate[k] === '') {
        this.rate[k] = 0
      }
    }
  },
  methods: {
    addEvaluate() {
      const params = JSON.parse(JSON.stringify(this.rate))
      params.list = params.teachersEvaluate
      delete params.teachersEvaluate
      params.trainId = this.data.trainId
      addEvaluate(params).then(() => {
        this.$message({
          message: '已提交评分',
          type: 'success'
        })
        this.disabled = true
      })
    },
    getTrainEvaluate() {
      const { trainId, trainWay } = this.data
      return getTrainEvaluate({ trainId, trainWay }).then((res) => {
        const data = JSON.parse(JSON.stringify(res))
        if (isEmptyString(data.composite)) {
          const teachersEvaluate = data.teachersEvaluate.map((item) => {
            item.teacherScore = 0
            return item
          })
          this.rate = Object.assign(data, teachersEvaluate)
        } else {
          this.rate = data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rate {
  .rate-top {
    padding-bottom: 32px;
    border-bottom: 1px solid #ebeced;
  }
  .rate-list {
    cursor: default;
    display: flex;
    color: rgba(0, 11, 21, 0.45);
    font-size: 14px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    .rate-item {
      display: flex;
      flex: 1;
      align-items: center;
      line-height: 20px;
      .text {
        width: 287px;
        color: rgba(0, 11, 21, 0.85);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .rate-bottom {
    padding-top: 24px;
    .rate-teacher {
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 700;
      margin-right: 8px;
    }
  }
}
</style>
<style lang="scss">
.rate {
  .el-rate__icon {
    font-size: 20px;
  }
}
</style>
