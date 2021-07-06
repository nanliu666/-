<template>
  <div>
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />
    <el-card class="middle-card">
      <div class="card-title">
        {{ examInfo.examName }}
      </div>
      <div class="middle__content">
        <ul class="detail__ul">
          <li class="detail-li">
            <span class="li-label">考试来源：</span>
            <span class="li-value">{{ examInfo.examSourceName }}</span>
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
            <span class="li-label">考试时间：</span>
            <span class="li-value">
              <span>{{ examInfo.examBeginTime }}</span>
              <span>~</span>
              <span>{{ examInfo.examEndTime }}</span>
            </span>
          </li>
          <li class="detail-li">
            <span class="li-label">考试模式：</span>
            <span class="li-value">{{ examInfo.isDecoil ? '开卷考试' : '闭卷考试' }}</span>
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
            <span class="li-label">通过条件：</span>
            <span class="li-value">{{
              examInfo.passType === 1 ? `${examInfo.passScope}分` : `${examInfo.passPercentage}%`
            }}以上</span>
          </li>
          <li v-if="examInfo.examPattern !== 'general'" class="detail-li">
            <span class="li-label">考试地点：</span>
            <span class="li-value">
              <span>{{ examInfo.roomAddr }}</span>
              <span> - </span>
              <span>{{ examInfo.roomName }}</span>
            </span>
          </li>
          <li class="detail-li">
            <span class="li-label">积分：</span>
            <span class="li-value">{{
              examInfo.integral ? `${examInfo.integralValue}积分` : '未开启积分'
            }}</span>
          </li>
        </ul>
        <!-- 得分与是否通过考试的显示规则是独立的 -->
        <div
          v-if="examInfo.scoreVisible || (examInfo.answerBeginTime && examInfo.resultVisible)"
          class="content__right"
        >
          <div v-if="examInfo.scoreVisible" class="score__box">
            <div class="content__title">我的得分</div>
            <div class="score__content">
              <span class="content" :class="[examInfo.isPass === 3 ? 'green' : 'red']">{{
                examInfo.score
              }}</span>
            </div>
          </div>
          <!-- 已参加考试并且resultVisible为true需要显示 -->
          <svg
            v-if="examInfo.answerBeginTime && examInfo.resultVisible"
            class="icon"
            :class="[examInfo.scoreVisible ? 'icon__box' : 'not__score']"
            aria-hidden="true"
          >
            <use v-if="examInfo.isPass === 3" xlink:href="#iconic_biaoqian_yitongguo" />
            <use v-if="examInfo.isPass === 1" xlink:href="#iconic_biaoqian_weitongguo" />
          </svg>
        </div>
      </div>
      <div class="handle__button">
        <!-- 显示考试的按钮的规则 -->
        <!-- 必须可以参加考试 -->
        <!-- joinStatus：0-未报名,1-审核中,2-可参加考试，3已驳回 -->
        <el-button
          v-if="examInfo.joinStatus === 2 && examInfo.examPattern !== 'offline'"
          class="content__button"
          type="primary"
          :disabled="joinDisable"
          @click="joinExam"
        >
          {{ buttonText }}
        </el-button>
        <!-- 显示报名的按钮的规则 -->
        <!-- 可以公开报名、未报名或者已报名但审核未通过,或者没有超过报名时间的情况存在报名按钮 -->
        <el-button
          v-if="hasApplyButton"
          class="content__button"
          type="primary"
          :disabled="joinApplyDisable"
          @click="applyExam"
        >
          {{ applyButtonText }}
        </el-button>
      </div>
    </el-card>
    <el-card v-if="examInfo.examPattern === 'general'" class="bottom-card" style="min-height:50vh">
      <div class="record__title">
        <span class="title">考试记录</span>
        <span v-if="examInfo.openResults" class="sub__title">
          <span>（考试结束</span>
          <span>{{
            examInfo.openResultsValue === 0 ? '后一直' : `${examInfo.openResultsValue}天内`
          }}</span>
          <span>可查看成绩）</span>
        </span>
      </div>
      <div v-if="!_.isEmpty(sessionList)" class="bottom__content">
        <common-table
          v-loading="tableLoading"
          :columns="columns"
          :config="tableConfig"
          :data="sessionList"
        >
          <template #handler="{row}">
            <el-button type="text" @click="handleView(row)">查看答卷</el-button>
          </template>
        </common-table>
      </div>
      <common-empty v-else text="当前还没开始考试" />
    </el-card>
  </div>
</template>

<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import CommonEmpty from '@/components/common-empty/Empty'
import { getViewExamInfo, examSessionList, joinApplyExam } from '@/api/exam'
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
      tableLoading: false,
      columns: [
        {
          label: '考试时间',
          prop: 'createTime',
          formatter: (row) => moment(row.createTime).format('MM/DD HH:mm:ss')
        },
        {
          label: '得分',
          prop: 'score',
          formatter: (row) => (row.scoreVisible ? row.score : '未设置查看分数')
        }
      ],
      tableConfig: {
        handlerColumn: {
          width: 100
        },
        enablePagination: true,
        showHandler: true,
        showIndexColumn: false
      },
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
    // 公开报名，或者今天在报名结束日期之前，并且未可参加考试（0， 1， 3）都存在报名按钮
    hasApplyButton() {
      const { joinStatus, publicFlag, joinEndDate } = this.examInfo
      return joinStatus !== 2 && (publicFlag || moment(new Date()).isSameOrBefore(joinEndDate))
    },
    // 审核中状态需要置灰
    joinApplyDisable() {
      return this.examInfo.joinStatus === 1
    },
    applyButtonText() {
      let text = '立即报名'
      // 报名状态:0-未报名,1-报名审核中,2-可参加考试，3-已拒绝（显示报名按钮）
      if (this.examInfo.joinStatus === 1) {
        text = '审核中'
      }
      return text
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
    // 查看答案
    handleView(data) {
      this.$router.push({
        name: 'ExamDetail',
        query: {
          examSessionId: data.examSessionId,
          examName: this.examInfo.examName,
          examIds: this.$route.query.id
        }
      })
    },
    // 考试报名
    applyExam() {
      const params = {
        batchId: this.examInfo.batchId,
        examId: this.examInfo.examId
      }
      joinApplyExam(params).then(() => {
        this.$message.success('报名成功')
        this.initData()
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
      const { examName, examId, batchId, openAnswerSheet, scoreVisible } = examInfoRes
      this.examInfo = examInfoRes
      _.set(this.routeList, '[1].title', examName)
      _.set(this.queryInfo, 'examId', examId)
      _.set(this.queryInfo, 'batchId', batchId)
      this.$refs.breadcrumb.setBreadcrumbTitle(examName)
      this.getList()
      this.tableConfig.showHandler = openAnswerSheet && scoreVisible
    },
    getList() {
      this.tableLoading = true
      examSessionList(this.queryInfo)
        .then((res) => {
          const { data } = res
          this.sessionList = data
        })
        .finally(() => {
          this.tableLoading = false
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
    font-weight: 550;
  }
  .middle__content {
    display: flex;
    justify-content: space-between;
    .detail__ul {
      display: flex;
      justify-content: flex-start;
      flex: 1;
      flex-wrap: wrap;
      .detail-li {
        font-family: PingFangSC-Regular;
        width: calc(100% / 2);
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
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      position: relative;
      padding: 0 100px;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 28px;
        background-color: #ebeced;
        width: 1px;
        height: 64px;
      }
      .content__title {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 400;
      }
      .score__box {
        display: flex;
        flex-direction: column;
        .score__content {
          padding-top: 8px;
          .content {
            font-family: DINAlternate-Bold;
            font-size: 48px;
            color: rgba(0, 11, 21, 0.85);
            line-height: 48px;
            font-weight: 700;
          }
          .green {
            color: #339900;
          }
          .red {
            color: #d9001b;
          }
        }
      }
      .icon__box {
        position: absolute;
        right: 28px;
        top: -25px;
        font-size: 60px;
      }
      .not__score {
        font-size: 80px;
      }
    }
  }
  .handle__button {
    margin-top: 14px;
    .content__button {
      background-color: #2875d4;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #ffffff;
    }
    .is-disabled {
      background-color: #94baea;
    }
  }
}
.bottom-card {
  margin-top: 20px;
  .record__title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 500;
    }
    .sub__title {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      font-weight: 400;
    }
  }
  /deep/ .has-gutter {
    .cell {
      background-color: #fafafa;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      font-weight: 400;
    }
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
