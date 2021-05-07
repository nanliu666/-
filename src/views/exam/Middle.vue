<template>
  <div>
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />
    <el-card class="middle-card">
      <div class="card-title">
        {{ examInfo.examName }}
      </div>
      <div class="middle__content">
        <ul class="detail-ul">
          <li class="detail-li">
            <span class="li-label">考试来源：</span>
            <span class="li-value">{{ examInfo.examSourceName }}</span>
          </li>
          <li class="detail-li">
            <span class="li-label">考试时间：</span>
            <span class="li-value">
              <span>{{ examInfo.examBeginTime }}</span>
              <span>~</span>
              <span>{{ examInfo.examEndTime }}</span>
            </span>
          </li>
          <li class="detail-li">
            <span class="li-label">考试时长：</span>
            <span class="li-value">{{
              !examInfo.reckonTime || (examInfo.reckonTime && examInfo.reckonTimeValue === 0)
                ? '不限制'
                : `${examInfo.reckonTimeValue}分钟`
            }}</span>
          </li>
          <li class="detail-li">
            <span class="li-label">参加次数：</span>
            <span class="li-value">{{
              !examInfo.joinNum || (examInfo.joinNum && examInfo.joinNumValue === 0)
                ? '不限制'
                : `${examInfo.examTimes}/${examInfo.joinNumValue}`
            }}</span>
          </li>
          <li class="detail-li">
            <span class="li-label">考试模式：</span>
            <span class="li-value">{{
              examInfo.examPattern === 'general' ? '普通考试' : '线下考试'
            }}</span>
          </li>
          <li class="detail-li">
            <span class="li-label">通过条件：</span>
            <span class="li-value">{{
              examInfo.passType === 1 ? `${examInfo.passScope}分` : `${examInfo.passPercentage}%`
            }}以上</span>
          </li>
          <li class="detail-li">
            <span class="li-label">积分：</span>
            <span class="li-value">{{
              examInfo.integral ? `${examInfo.integralValue}积分` : '未开启积分'
            }}</span>
          </li>
        </ul>
        <div class="content__right">
          <div class="score__box">
            <div class="score__content" :class="{ is__hidden: !examInfo.score }">
              <span class="content" :class="[examInfo.isPass === 3 ? 'green' : 'red']">{{
                examInfo.score
              }}</span>
              <span class="text">分</span>
            </div>
            <el-button
              class="content__button"
              type="primary"
              :disabled="joinDisable"
              @click="joinExam"
            >
              {{ buttonText }}
            </el-button>
          </div>
          <svg class="icon icon__box" aria-hidden="true" :class="{ is__hidden: !examInfo.score }">
            <use v-if="examInfo.isPass === 3" xlink:href="#iconyitongguo" />
            <use v-if="examInfo.isPass === 1" xlink:href="#iconbianzu10" />
          </svg>
        </div>
      </div>
    </el-card>
    <el-card class="bottom-card" style="min-height:50vh">
      <div v-if="!_.isEmpty(sessionList)" class="bottom__content">
        <el-timeline class="timeline__top">
          <el-timeline-item v-for="item in sessionList" :key="item.examSessionId" class="timeline">
            <li class="time__li" @mouseenter="overExam(item)" @mouseleave="outExam">
              <div>
                <span class="time__box">{{
                  moment(item.createTime).format('MM/DD HH:mm:ss')
                }}</span>
                <span>得分：{{ item.score ? item.score : '待发布' }}</span>
              </div>
              <el-button
                v-if="examInfo.openAnswerSheet && item.examSessionId === currentExamId"
                size="medium"
                @click="handleView(item)"
              >查看答卷</el-button>
            </li>
          </el-timeline-item>
        </el-timeline>
      </div>
      <common-empty v-else text="当前还没开始考试" />
    </el-card>
  </div>
</template>

<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import CommonEmpty from '@/components/common-empty/Empty'
import { getViewExamInfo, examSessionList } from '@/api/exam'
import examUtils from './examUtils'
import moment from 'moment'
export default {
  name: 'ExamInfo',
  components: {
    CommonBreadcrumb,
    CommonEmpty
  },
  data() {
    return {
      currentExamId: '',
      routeList: [
        {
          path: '/exam/list',
          title: '考试'
        },
        {
          path: '',
          title: ''
        }
      ],
      queryInfo: {
        pageNo: 1,
        pageSize: 200
      },
      examInfo: {},
      sessionList: []
    }
  },
  computed: {
    joinDisable() {
      return examUtils.JoinDisabled(this.examInfo)
    },
    buttonText() {
      const { status, examEndTime } = this.examInfo
      let target = '开始考试'
      if (status === '') {
        target = '服务丢失状态'
      } else if (status === 1) {
        target = '未开考'
      } else if (moment(moment(examEndTime)).diff(new Date(), 'seconds') < 0) {
        target = '考试结束'
      }
      return target
    },
    id() {
      const id = _.get(this.$route, 'query.id', null)
      return id
    }
  },
  activated() {
    this.initData()
  },
  methods: {
    moment,
    overExam(item) {
      this.currentExamId = item.examSessionId
    },
    outExam() {
      this.currentExamId = ''
    },
    // 查看答案
    handleView(data) {
      this.$router.push({
        name: 'ExamDetail',
        query: { examSessionId: data.examSessionId }
      })
    },
    // 参加考试
    joinExam() {
      const { examId, batchId } = this.examInfo
      const { tips, isReNew, isShowConfirm } = examUtils.getJoinExamTips(this.examInfo)
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showConfirmButton: isShowConfirm,
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'ExamPaper',
          query: { examId: examId, batchId: batchId, isReNew: isReNew }
        })
      })
    },
    async initData() {
      const examInfoRes = await getViewExamInfo({ id: this.id })
      const { examName, examId, batchId } = examInfoRes
      this.examInfo = examInfoRes
      _.set(this.routeList, '[1].title', examName)
      _.set(this.queryInfo, 'examId', examId)
      _.set(this.queryInfo, 'batchId', batchId)
      this.$refs.breadcrumb.setBreadcrumbTitle(examName)
      this.getList()
    },
    getList() {
      examSessionList(this.queryInfo).then((res) => {
        const { data } = res
        this.sessionList = data
      })
    }
  }
}
</script>

<style scoped lang="scss">
.image-ul {
  display: flex;
  align-items: center;
}

.middle-card {
  .card-title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    margin-bottom: 18px;
  }
  .middle__content {
    display: flex;
    justify-content: space-between;
    .detail-ul {
      display: flex;
      justify-content: flex-start;
      flex: 1;
      margin-bottom: 18px;
      flex-wrap: wrap;
      .detail-li {
        font-family: PingFangSC-Regular;
        padding-right: 40px;
        width: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .li-label {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
        }
        .li-value {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
        }
      }
    }
    .content__right {
      width: 300px;
      display: flex;
      .is__hidden {
        visibility: hidden;
      }
      .score__box {
        display: flex;
        flex-direction: column;
        .score__content {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-bottom: 4px;
          .content {
            font-size: 40px;
            font-weight: 550;
            display: flex;
          }
          .green {
            color: #339900;
          }
          .red {
            color: #d9001b;
          }
          .text {
            margin-bottom: 6px;
          }
        }
      }

      .content__button {
        align-self: flex-end;
      }
      .icon__box {
        margin-left: 20px;
        font-size: 100px;
      }
    }
  }
}
.bottom-card {
  margin-top: 20px;
  /deep/ .el-card__body {
    // height: 50vh;
    margin-top: -24px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #ebeced !important;
  }
  /deep/ .el-timeline-item {
  }
  /deep/ .el-timeline-item__wrapper {
    padding-left: 10px;
  }
  /deep/ .el-timeline-item__node--normal {
    // left: -10px;
    top: 20px;
  }
  /deep/ .el-timeline-item__tail {
    top: 20px;
  }
  .bottom__content {
    height: 100%;
    .timeline__top {
      height: 90%;
      margin-top: 20px;
      overflow: auto;
      .timeline {
        .time__li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          padding: 0 60px 0 10px;
          &:hover {
            background-color: #f7f8fa;
          }
        }
        .time__box {
          margin-right: 60px;
        }
      }
    }
  }
}
</style>
