<template>
  <div class="exam">
    <ul class="course-list">
      <li v-for="(course, idx) in list" :key="idx" class="course-item">
        <div class="note">
          考试目录
        </div>
        <ul class="exam-list">
          <li v-for="exam in course" :key="exam.examId" class="exam-item">
            <div class="content">
              <div class="exam-detail">
                <div class="name">
                  {{ exam.localName }}
                </div>
                <div class="time">提交时间：{{ exam.examBeginTime }}—{{ exam.examEndTime }}</div>
              </div>
              <div class="exam-result">
                当前得分：
                <span class="text">{{ exam.score }}</span>
              </div>
              <el-button size="medium" type="primary" class="button">
                前往作答
              </el-button>
              <el-link
                :icon="!!exam.isFold ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                :underline="false"
                @click.native="setFold(exam)"
              >
                详情
              </el-link>
            </div>
            <div v-show="!!exam.isFold" class="detail-content">
              <div class="intro-list">
                <div class="intro-item" style="margin-right: 4px;">
                  题目数量：
                  <span class="text" style="width: 100px;">共{{ exam.totalNum }}道题</span>
                </div>
                <div class="intro-item">
                  剩余有效答题次数：
                  <span class="text" style="width: 64px;">{{ exam.surplusParticipatNumber }}</span>
                </div>
                <div class="intro-item">
                  试卷总分：
                  <span class="text" style="width: 32px;">{{ exam.totalScore }}</span>
                </div>
                <div class="intro-item">
                  评分规则：
                  <span class="text" style="width: 240px; white-space: pre-wrap;">{{
                    exam.scoreRule
                  }}</span>
                </div>
              </div>
              <div class="intro-list">
                <div class="intro-item">
                  答题记录：
                </div>
              </div>

              <el-table
                :data="getTableData(exam)"
                border
                :cell-style="cellStyle"
                :header-cell-style="headerCellStyle"
                :fit="false"
              >
                <el-table-column prop="participatNumber" label="次数" width="280">
                </el-table-column>
                <el-table-column prop="examBeginTime" label="提交时间" width="357">
                </el-table-column>
                <el-table-column prop="score" label="得分" width="314"> </el-table-column>
                <el-table-column prop="id" label="操作" width="104">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="toTestPaper(scope.row)">
                      查看答卷
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { queryExamList } from 'src/api/train'
export default {
  name: 'Exam',
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
      list: [],
      isFold: true
    }
  },
  activated() {
    this.queryExamList()
  },
  methods: {
    setFold(exam) {
      exam.isFold = !exam.isFold
      this.$forceUpdate()
    },
    getTableData(exam) {
      return [exam]
    },
    queryExamList() {
      queryExamList({ trainId: this.data.trainId }).then((res) => {
        this.list = res
      })
    },
    toTestPaper(exam) {
      const { examId, batchId } = exam
      this.$router.push({
        path: '/exam/detail',
        params: {
          batchId,
          examId
        }
      })
    },
    cellStyle() {
      return 'background-color: #fafafa'
    },
    headerCellStyle() {
      return 'font-size: 14px; color: rgba(0,11,21,0.45); background-color: #fafafa;font-weight: 500;'
    }
  }
}
</script>

<style lang="scss" scoped>
.exam {
  .course-list {
    .course-item {
      cursor: default;
      .title {
        border-left: 4px solid rgba(1, 170, 252, 1);
        text-indent: 8px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        margin-bottom: 16px;
      }
      .note {
        padding-left: 24px;
        background: #fafafa;
        height: 48px;
        line-height: 48px;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid rgba(235, 236, 237, 1);
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .exam-list {
        .exam-item {
          padding: 16px 24px;
          border-bottom: 1px solid #ebeced;
          .content {
            display: flex;
            align-items: center;
            .exam-detail {
              flex: 1;
              flex-shrink: 0;
              .name {
                font-size: 14px;
                color: rgba(0, 11, 21, 0.85);
              }
              .time {
                margin-top: 4px;
                font-size: 12px;
                color: rgba(0, 11, 21, 0.45);
              }
            }
            .exam-result {
              font-size: 14px;
              color: rgba(0, 11, 21, 0.45);
              margin-right: 80px;
              .text {
                color: rgba(0, 11, 21, 0.85);
              }
            }
            .button {
              margin-right: 24px;
            }
          }
          .detail-content {
            background: #fafafa;
            padding: 17px 24px;
            margin-top: 15px;
            .intro-list {
              display: flex;
              color: rgba(0, 11, 21, 0.45);
              font-size: 14px;
              &:not(:last-child) {
                margin-bottom: 16px;
              }
              .intro-item {
                display: flex;
                align-items: center;
                margin-right: 40px;
                .text {
                  color: rgba(0, 11, 21, 0.85);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
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
