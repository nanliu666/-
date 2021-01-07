<template>
  <div>
    <common-breadcrumb
      ref="breadcrumb"
      :route-list="routeList"
    />
    <el-card class="top-card">
      <div class="card-header">
        <div class="header-title-box">
          <span class="title">{{ examDetail.examName }}</span>
          <el-tag :type="getStatus(examDetail.status).type">
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
              <span>{{ examDetail.answerBeginTime }}</span>
              <span>{{ examDetail.answerEndTime }}</span>
            </span>
          </li>
          <li class="header-li">
            <span class="li-label">考试用时：</span>
            <span class="li-value">{{
              moment(examDetail.answerEndTime).diff(moment(examDetail.answerBeginTime), 'minutes')
            }}</span>
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
          <li class="header-li">
            <span class="li-label">考试得分：</span>
            <span class="li-value">
              <span>{{ examDetail.score }}分</span>
              <span>（客观题{{ examDetail.objectiveScore }}分），</span>
              <span>（主观题{{ examDetail.subjectiveScore }}分）</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="card-bottom">
        <span class="bottom-title">查看试题范围</span>
        <el-radio-group v-model="searcRadio">
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
    <el-card> </el-card>
  </div>
</template>

<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import { getViewAnswer } from '@/api/exam'
import moment from 'moment'
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
export default {
  components: {
    CommonBreadcrumb
  },
  data() {
    return {
      routeList: [
        {
          path: '/exam',
          title: '考试'
        },
        {
          path: this.$route.path,
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ],
      searcRadio: 0,
      examDetail: {
        title: 'EHS应知应会全员考试',
        status: 0,
        paper: 'EHS应知应会试卷'
      }
    }
  },
  created() {
    getViewAnswer(this.$route.query).then((res) => {
      this.examDetail = res
    })
  },
  methods: {
    moment,
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
</style>
