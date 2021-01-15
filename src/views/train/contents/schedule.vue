<template>
  <div class="schedule">
    <ul v-show="!detailVisible" class="schedule-list">
      <li class="schedule-item">
        <div class="title">
          线下日程
        </div>
        <div v-for="(val, key) in offLineData" :key="key">
          <div class="note" @click="setFold(val)">
            <i
              :class="!val.isFold ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"
              style="font-weight: 700; color: rgba(0,11,21,0.85);"
            ></i>
            {{ key }}
          </div>
          <ul v-show="!!val.isFold" class="chapter-list">
            <li v-for="chapter in val" :key="chapter.course" class="chapter-item">
              <div class="time">
                <span class="text">{{ chapter.todoTime }}</span>
              </div>
              <div class="name">
                <span class="text">{{ chapter.course }}</span>
              </div>
              <div class="lecturer">
                讲师：
                <span class="text">{{ chapter.lecturerName }}</span>
              </div>
              <div class="place">
                地点：
                <span class="text">{{ chapter.address }}</span>
              </div>
              <div class="status">
                状态：
                <span class="text">{{
                  chapter.status === 1 ? '未开始' : chapter.status === 2 ? '进行中' : '已结束'
                }}</span>
              </div>
            </li>
          </ul>
        </div>
      </li>

      <li class="schedule-item">
        <div class="title" style="margin-top: 24px;">
          在线课程
        </div>
        <el-table :data="onLineData" style="width: 100%">
          <el-table-column prop="classTime" label="上课日期"> </el-table-column>
          <el-table-column prop="course" label="关联课程" width="270"> </el-table-column>
          <el-table-column prop="lecturer" label="讲师"> </el-table-column>
          <el-table-column prop="type" label="修读类型">
            <template slot-scope="scope">
              {{ scope.row.type === 0 ? '必修' : '选修' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              {{ scope.row.status === 1 ? '已结束' : scope.row.status === 2 ? '进行中' : '未开始' }}
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li class="schedule-item">
        <div class="title" style="margin-top: 24px;">
          考试安排
        </div>
        <el-table :data="examData" style="width: 100%">
          <el-table-column prop="examTime" label="考试日期"> </el-table-column>
          <el-table-column prop="testPaper" label="关联考试" width="270"> </el-table-column>
          <el-table-column prop="period" label="考试时间（分钟）"> </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{ scope.row.type === 1 ? '未开始' : scope.row.type === 2 ? '进行中' : '已结束' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toExamDetail(scope.row.id)">
                考试详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>

    <div v-show="detailVisible" class="schedule-detail">
      <el-button icon="el-icon-back" size="medium" @click.native="setDetailVisible(false)">
        返回上一级
      </el-button>

      <div class="train-intro">
        <div class="title">
          <div class="name">
            {{ examDetailData.examName }}
          </div>
          <div
            class="status"
            :class="{
              will: examDetailData.status === 1,
              doing: examDetailData.status === 2,
              done: examDetailData.status === 3
            }"
          >
            {{
              examDetailData.status === 1 ? '未开始' : examDetailData === 2 ? '进行中' : '已结束'
            }}
          </div>
        </div>
        <div class="intro-list">
          <div class="intro-item">
            考试日期：
            <span class="text">{{ examDetailData.examTime }}</span>
          </div>
          <div class="intro-item">
            考试时间：
            <span class="text">{{ examDetailData.period }}</span>
          </div>
          <div class="intro-item">
            关联用卷：
            <span class="text">{{ examDetailData.testPaper }}</span>
          </div>
        </div>
        <div class="intro-list">
          <div class="intro-item">
            评卷人：
            <span class="text">{{ examDetailData.reviewer }}</span>
          </div>
        </div>
      </div>
      <div
        style="margin-bottom: 16px; font-family: PingFangSC-Medium;font-size: 14px; color: rgba(0,11,21,0.85); font-weight: 600;"
      >
        考生列表
      </div>
      <el-table :data="studentList" style="width: 100%" height="431">
        <el-table-column prop="stuName" label="姓名" width="180"> </el-table-column>
        <el-table-column prop="phone" label="手机号" width="180"> </el-table-column>
        <el-table-column prop="deptName" label="所属部门"> </el-table-column>
        <el-table-column prop="examStatus" label="状态">
          <template slot-scope="scope">
            {{
              scope.row.examStatus === 2
                ? '已通过'
                : scope.row.examStatus === 2
                  ? '已通过'
                  : '未通过'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="examTime" label="考试时间"> </el-table-column>
        <el-table-column prop="examScore" label="成绩"> </el-table-column>
        <el-table-column prop="examPass" label="是否通过">
          <template slot-scope="scope">
            {{ scope.row.examPass === 1 ? '已通过' : '未通过' }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        layout="prev, pager, next"
        :total="studentTotal"
        :limit="studentQueryParams.pageSize"
        :page="studentQueryParams.pageNo"
        @pagination="pagination"
      >
      </pagination>
    </div>
  </div>
</template>

<script>
import Pagination from 'src/components/common-pagination'
import {
  getOfflineTodo,
  getOnlineCourse,
  getTrainExamList,
  getExamDetail,
  examResult
} from 'src/api/train'

export default {
  name: 'Schedule',
  components: {
    Pagination
  },
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
      detailVisible: false,
      offLineData: [],
      onLineData: [],
      examData: [],
      examDetailData: {},
      studentList: [],
      studentQueryParams: {
        pageNo: 1,
        pageSize: 10,
        trainId: '',
        examId: ''
      },
      studentTotal: 0
    }
  },
  activated() {
    this.getData(this.data.trainId)
    this.setDetailVisible(false)
  },
  methods: {
    pagination(data) {
      const { page, limit } = data
      this.studentQueryParams.pageNo = page
      this.studentQueryParams.pageSize = limit
      this.getStudentList()
    },
    setFold(val) {
      val.isFold = !val.isFold
      this.$forceUpdate()
    },
    getData(trainId) {
      this.getOfflineTodo(trainId)
      this.getTrainExamList(trainId)
      this.getOnlineCourse(trainId)
    },
    async toExamDetail(id) {
      this.examId = id
      await this.getExamDetail(id)
      await this.getStudentList()
      this.setDetailVisible(true)
    },
    getStudentList() {
      return examResult({ trainId: this.data.trainId, examId: this.examId }).then((res) => {
        this.studentList = res.data
      })
    },
    setDetailVisible(visible) {
      this.detailVisible = visible
    },
    getOfflineTodo(trainId) {
      getOfflineTodo({ trainId }).then((res) => {
        this.offLineData = res
      })
    },
    getOnlineCourse(trainId) {
      getOnlineCourse({ trainId }).then((res) => {
        this.onLineData = res
      })
    },
    getTrainExamList(trainId) {
      getTrainExamList({ trainId }).then((res) => {
        this.examData = res
      })
    },
    getExamDetail(examId) {
      return getExamDetail({ examId }).then((res) => {
        this.examDetailData = res[0]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule {
  .schedule-list {
    .schedule-item {
      .title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        margin-bottom: 16px;
        font-weight: 600;
      }
      .note {
        cursor: pointer;
        padding-left: 24px;
        background: #fafafa;
        height: 48px;
        line-height: 48px;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid rgba(235, 236, 237, 1);
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
      .chapter-list {
        .chapter-item {
          cursor: default;
          display: flex;
          align-items: center;
          padding: 13px 24px;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(235, 236, 237, 1);
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .text {
            color: rgba(0, 11, 21, 0.85);
          }
          .time {
            padding-right: 24px;
            box-sizing: border-box;
            border-right: 1px solid #ebeced;
            width: 117px;
          }
          .name {
            width: 379px;
            padding-left: 24px;
          }
          .lecturer {
            width: 238px;
          }
          .place {
            width: 261px;
          }
          .status {
            width: 84px;
          }
        }
      }
    }
  }

  .schedule-detail {
    .train-intro {
      cursor: default;
      margin-bottom: 40px;
      .title {
        display: flex;
        align-items: center;
        font-size: 0;
        margin-top: 42px;
        margin-bottom: 18px;
        .name {
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          margin-right: 16px;
        }
        .status {
          height: 20px;
          line-height: 20px;
          text-align: center;
          width: 52px;
          font-size: 12px;
          border-radius: 4px;
          margin-top: 2px;
          &.will {
            color: #00b061;
            background-color: #e7ffee;
          }
          &.doing {
            color: #fcba00;
            background-color: #fffce6;
          }
          &.done {
            color: #01aafc;
            background-color: #e7fbff;
          }
        }
      }

      .intro-list {
        display: flex;
        color: rgba(0, 11, 21, 0.45);
        font-size: 14px;
        &:not(:last-child) {
          margin-bottom: 16px;
        }
        .intro-item {
          display: flex;
          flex: 1;
          align-items: center;
          .text {
            width: 287px;
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
</style>
