<template>
  <div v-if="rate && userRate">
    <div v-if="!score" class="rate">
      <div class="rate-top">
        <div class="rate-list"></div>
        <div class="rate-list">
          <div class="rate-item">
            <span style="font-size: 16px; color: rgba(0, 11, 21, 0.85); font-weight: 700">
              培训班整体满意度：
            </span>
            <el-rate
              v-model="rate.composite"
              allow-half
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
              disabled
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
            <div class="img">
              <img v-if="teacher.imageUrl" :src="teacher.imageUrl" alt="" />
              <svg v-else class="icon" aria-hidden="true">
                <use xlink:href="#icontouxiang"></use>
              </svg>
            </div>
            <div class="teacher-info">
              <span class="rate-teacher"> {{ teacher.teacherName }}（讲师） </span>
              <span class="class">课程: {{ teacher.courseName }}</span>
            </div>
            <div class="rate">
              授课质量：
              <el-rate
                v-model="teacher.teacherScore"
                allow-half
                disabled
                show-score
                text-color="rgba(0,11,21,0.85)"
                score-template="{value}分"
              >
              </el-rate>
            </div>
          </div>
        </div>
        <el-button
          type="primary"
          size="medium"
          :disabled="data.status === 1"
          @click.native="toScore"
        >
          我要评分
        </el-button>
      </div>
    </div>

    <div v-else class="rate">
      <div v-if="showMyScore" class="my-rate">
        <span style="font-size: 16px; color: rgba(0, 11, 21, 0.85); font-weight: 700">
          我的评分:</span>
        <el-rate
          v-model="userRate.composite"
          allow-half
          disabled
          show-score
          text-color="rgba(0,11,21,0.85)"
          score-template="{value}分"
        >
        </el-rate>
        <el-button
          v-if="userRate.flag === 'init'"
          class="edit"
          type="text"
          @click.stop.prevent="toScore"
        >编辑</el-button>
      </div>
      <div class="rate-top">
        <div class="rate-list"></div>
        <div class="rate-list">
          <div class="rate-item">
            <span style="font-size: 16px; color: rgba(0, 11, 21, 0.85); font-weight: 700">
              培训班整体满意度：
            </span>
            <el-rate
              v-model="userRate.composite"
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
              v-model="userRate.first"
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
              v-model="userRate.second"
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
              v-model="userRate.third"
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
              v-model="userRate.fourth"
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
              v-model="userRate.fifth"
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
        <div
          v-for="teacher in userRate.teachersEvaluate"
          :key="teacher.teacherId"
          class="rate-list"
        >
          <div class="rate-item">
            <div class="img">
              <img v-if="teacher.imageUrl" :src="teacher.imageUrl" alt="" />
              <svg v-else class="icon" aria-hidden="true">
                <use xlink:href="#icontouxiang"></use>
              </svg>
            </div>
            <div class="teacher-info">
              <span class="rate-teacher"> {{ teacher.teacherName }}（讲师） </span>
              <span class="class">课程: {{ teacher.courseName }}</span>
            </div>
            <div class="rate">
              授课质量：
              <el-rate
                v-model="teacher.teacherScore"
                allow-half
                show-score
                text-color="rgba(0,11,21,0.85)"
                score-template="{value}分"
                :disabled="disabled"
              >
              </el-rate>
            </div>
          </div>
        </div>
        <div v-if="!disabled" class="btn">
          <el-button type="info" size="medium" @click.native="cancelScore"> 取消 </el-button>
          <el-button v-if="submitBtn" type="primary" size="medium" @click.native="addEvaluate">
            提交
          </el-button>
          <el-button v-else type="info" size="medium" disabled> 提交 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTrainEvaluate, addEvaluate } from 'src/api/train'
import '@/config/iconfont'
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
      rate: null,
      userRate: null,
      score: false,
      teacherName: '',
      disabled: true,
      showMyScore: false,
      flag: false
    }
  },
  computed: {
    submitBtn() {
      const flag =
        this.userRate &&
        Object.keys(this.userRate).some((item) => {
          if (item === 'teachersEvaluate') {
            return this.userRate[item].teacherScore
          } else {
            return this.userRate[item]
          }
        })
      return flag
    }
  },
  created() {
    this.getTrainEvaluate()
  },
  methods: {
    addEvaluate() {
      const params = JSON.parse(JSON.stringify(this.userRate))
      params.list = params.teachersEvaluate
      delete params.teachersEvaluate
      params.trainId = this.data.trainId
      params.stuld = this.$store.getters.userId
      addEvaluate(params).then(() => {
        this.$message({
          message: '已提交评分',
          type: 'success'
        })
        this.getTrainEvaluate()
      })
    },
    getTrainEvaluate() {
      const { trainId, userType } = this.data
      const creatorId = this.$store.getters.userId
      Promise.all([
        getTrainEvaluate({ trainId, userType }),
        getTrainEvaluate({ trainId, userType, creatorId })
      ]).then((res) => {
        let scoreAll = res[0]
        let scoreUser = res[1]

        for (const key in scoreAll) {
          if (!scoreAll[key]) scoreAll[key] = 0
        }
        scoreAll.teachersEvaluate.forEach((item) => {
          if (!item.teacherScore) item.teacherScore = 0
        })
        this.rate = scoreAll
        for (const key in scoreUser) {
          if (!scoreUser[key]) scoreUser[key] = 0
        }
        scoreUser.teachersEvaluate.forEach((item) => {
          if (!item.teacherScore) item.teacherScore = 0
        })
        this.userRate = scoreUser
        const showMyScore = Object.keys(scoreUser).some((item) => {
          if (item === 'teachersEvaluate') {
            return scoreUser[item].some((value) => {
              return value.teacherScore
            })
          } else {
            return scoreUser[item]
          }
        })
        if (showMyScore) {
          this.showMyScore = true
          this.disabled = true
          this.score = true
          this.flag = true
        } else {
          this.showMyScore = false
          this.disabled = false
          this.flag = false
          this.score = false
        }
      })
    },
    toScore() {
      this.disabled = false
      this.score = true
      this.showMyScore = false
    },
    cancelScore() {
      if (this.flag) {
        this.showMyScore = true
        this.disabled = true
      } else {
        this.score = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rate {
  .my-rate {
    display: flex;
    .edit {
      margin-left: 40px;
      padding: 0;
    }
  }
  .rate-top {
    padding-bottom: 32px;
    border-bottom: 1px solid #ebeced;
  }
  .rate-list {
    cursor: default;
    display: flex;
    color: rgba(0, 11, 21, 0.45);
    font-size: 14px;
    align-items: flex-start;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    .teacher-info {
      span:first-child {
        font-size: 16px;
        color: #000;
      }

      span:last-child {
        font-size: 14px;
        color: #686868;
      }
    }
    .rate-item {
      position: relative;
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
    text-align: center;
    .rate-list {
      display: flex;
      .teacher-info {
        display: flex;
        flex-direction: column;
        text-align: left;
        padding-top: 15px;
        .rate-teacher {
          margin-bottom: 8px;
        }
      }
      .img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
        }
        i {
          font-size: 35px;
          line-height: 50px;
        }
      }
      .rate {
        display: flex;
        align-self: flex-start;
        padding-top: 14px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.rate {
  .el-rate__icon {
    font-size: 20px;
  }
}
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
