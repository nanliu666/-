<template>
  <div class="arrange">
    <p class="offline_title">
      线下日程
      <span v-if="isOfflineTodo.length" style="font-size: 12px">
        共{{
          isOfflineTodo.reduce((total, todo) => {
            return (total += todo.data.length)
          }, 0)
        }}项 &nbsp; 共{{ offlineTodoTime }}课时</span>
    </p>
    <el-collapse v-if="isOfflineTodo.length" v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(todo, index) in isOfflineTodo" :key="index" :name="index + 1">
        <template slot="title">
          <span class="offline-date">
            第{{ index + 1 }}天 &nbsp;&nbsp;{{ todo.date.replace(/-/g, '/') }}
          </span>
        </template>

        <div v-for="(item, i) in todo.data" :key="i" class="arrange_schedule_i">
          <span>{{ item.todoTime }}</span>
          <span v-if="item.type === 1">【面授课程】 {{ item.courseName }}</span>
          <span v-else>【活动】 {{ item.theme }}</span>
          <span>
            <span v-if="item.type === 1"><span class="gray">讲师：</span></span><span v-else><span class="gray">主持人：</span></span> {{ item.lecturerName }}</span>

          <span> <span class="gray">地点：</span> {{ item.address }}</span>

          <!-- 状态（1：已结束；2：进行中；3：未开始） -->
          <span>
            <span class="gray">状态：</span>
            <span v-if="item.status === 1">未开始</span>
            <span v-if="item.status === 2">进行中</span><span v-if="item.status === 3">已结束</span></span>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div v-else>暂无培训安排信息</div>

    <p class="course_title offline_title">
      在线课程
      <span style="font-size: 12px">共{{ showOnlineCourse.length }}项 &nbsp; 共{{ periodShow(showOnlineCourse) }}课时
      </span>
    </p>
    <el-table :data="showOnlineCourse" style="width: 100%">
      <el-table-column prop="classTime" label="上课日期" width="180"> </el-table-column>
      <el-table-column prop="courseName" show-overflow-tooltip label="关联课程" width="180">
      </el-table-column>
      <el-table-column prop="lecturerName" label="讲师"> </el-table-column>
      <el-table-column prop="studyType" label="修读类型">
        <template slot-scope="{ row }">
          <span v-if="row.studyType === 1">选修</span>
          <span v-else> 必修 </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <!-- status	状态（1：未开始；2：进行中；3：已结束） -->
          <span v-if="row.status == 1">未开始</span>
          <span v-else-if="row.status == 2">进行中</span>
          <span v-else-if="row.status == 3">已结束</span>
        </template>
      </el-table-column>
    </el-table>
    <p class="course_title offline_title">
      考试安排 <span style="font-size: 12px">共{{ showExamList.length }}项</span>
    </p>
    <el-table :data="showExamList" style="width: 100%">
      <el-table-column prop="examTime" label="考试时间" show-overflow-tooltip width="250">
        <template slot-scope="{ row }">
          <!-- {{ shijiantime(row.examTime) }} -->
          {{ shijiantime(row.examTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="examName" label="考试名称" width="210"> </el-table-column>
      <el-table-column prop="period" label="考试时间(分钟)" width="200"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <!-- status	状态（1：已结束；2：进行中；3：未开始） -->
          <span v-if="row.status == 1">未开始</span>
          <span v-else-if="row.status == 2">进行中</span>
          <span v-else-if="row.status == 3">已结束</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- <el-table-column v-if="$route.query.status" label="操作"> -->
        <template slot-scope="{ row }">
          <el-button type="text" @click="toexamDetail(row)"> 考试详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  queryTrainOfflineTodoList,
  queryTrainOnlineCourseList,
  queryExamList
} from '@/api/lecturerTask'
export default {
  data() {
    return {
      isOfflineTodo: '',
      // 线下日程表格
      activeNamesTableData: [],

      // 线下日程
      activeNames: 1,
      // 查询培训线上课程  在线课程
      showOnlineCourse: [],
      showExamList: []
    }
  },
  computed: {
    offlineTodoTime() {
      const list = this.isOfflineTodo
      let hours = 0
      list.forEach((item) => {
        item.data.forEach((a) => {
          let [start, end] = a.todoTime.split('~')
          start = start.split(':').slice(0, 2)
          end = end.split(':').slice(0, 2)
          start = start[0] * 3600000 + start[1] * 60000
          end = end[0] * 3600000 + end[1] * 60000
          let hour = (end - start) / 3600000
          hour = hour.toFixed(1)
          hours += Number(hour)
        })
      })
      return hours
    }
  },
  created() {
    this.isExamList()
    this.isGetOnlineCourse()
    this.isGetOfflineTodo()
  },
  methods: {
    periodShow(i) {
      let periodData = 0
      i.forEach((item) => {
        periodData += item.period
      })
      return periodData / 3600
    },
    shijiantime(times) {
      let timearr = times
        .replace(' ', ':')
        .replace(/:/g, '-')
        .split('-')
      let timestr =
        '' +
        timearr[0] +
        '-' +
        timearr[1] +
        '-' +
        timearr[2] +
        '~' +
        timearr[5] +
        '-' +
        timearr[6] +
        '-' +
        timearr[7]
      return timestr
    },
    // 跳转考试详情
    toexamDetail(row) {
      this.$router.push({ path: '/examinationDetail', query: { id: row.id } })
    },

    // 查询培训考试安排
    isExamList() {
      let id = this.$route.query.id
      queryExamList({ trainId: id }).then((res) => {
        this.showExamList = res
      })
    },
    // 查询培训线上课程
    isGetOnlineCourse() {
      let id = this.$route.query.id
      queryTrainOnlineCourseList({ trainId: id }).then((res) => {
        this.showOnlineCourse = res
      })
    },
    //获取今天日期，格式YYYY-MM-DD
    getNowFormatDate() {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    // 线下日程
    handleChange() {},
    // 查询培训线下日程
    isGetOfflineTodo() {
      let id = this.$route.query.id
      queryTrainOfflineTodoList({ trainId: id }).then((res) => {
        let list = (this.isOfflineTodo = [])
        Object.keys(res).forEach((key) => {
          list.push({
            date: key,
            data: res[key]
          })
        })
        list = list.sort((a, b) => {
          return new Date(a.date) > new Date(b.date) ? 1 : -1
        })

        let index = 1
        for (const key in res) {
          ++index
          if (key == this.getNowFormatDate()) {
            this.activeNames = index
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.arrange {
  .offline_title {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    line-height: 22px;
    font-weight: 600;
    span {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      line-height: 18px;
    }
  }
  .offline-date {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    line-height: 22px;
    padding-left: 48px;
  }
  .arrange_schedule_i {
    border-top: 1px solid #ebeced;
    display: flex;
    padding: 13px 48px;
    .gray {
      color: rgba(0, 11, 21, 0.45);
    }
    span {
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 22px;
      p {
        display: inline-block;
        margin: 0;
      }
      &:nth-child(1) {
        // padding-left: 20px;
        width: 15%;
      }
      &:nth-child(2) {
        width: 30%;
      }
      &:nth-child(3) {
        width: 20%;
      }
      &:nth-child(4) {
        width: 20%;
      }
      &:nth-child(5) {
        width: 20%;
      }
    }
  }
  .course_title {
    margin-top: 45px;
  }
}
/deep/.el-collapse-item__header {
  background-color: #f7f8fa;
}
::v-deep .el-collapse-item__content {
  padding: 0;
}
</style>
