56<template>
  <div class="task_info">
    <!-- 这里做判断，写三套 -->
    <!-- 考试模块 -->
    <div v-if="attributeData.type === 2" class="exam">
      <div class="status_icon">
        <div v-if="!lastCourse" class="line"></div>
        <div class="icon icon_p">
          <!-- 左边图标，1：未开始：2：进行中；3：已结束 -->
          <!-- <i class="el-icon-video-play"></i> -->
          <i v-if="attributeData.status == 1" class="el-icon-video-play"></i>
          <i v-if="attributeData.status == 2" class="el-icon-time"></i>
          <i v-if="attributeData.status == 3" class="el-icon-circle-check"></i>
        </div>
      </div>
      <section class="content content_detail">
        <div class="course_time f_s_14 course_time_c">
          <p v-if="attributeData.status === 3">
            {{ attributeData.startTime.replace(/-/g, '/') }} -{{
              attributeData.endTime.replace(/-/g, '/')
            }}
          </p>
          <p v-else>{{ attributeData.startTime.replace(/-/g, '/') }}</p>
          <p>{{ status }}</p>
        </div>
        <div class="course_details">
          <div class="course_site">
            <div class="course_title">
              <p>
                <span>【考试】</span>{{ attributeData.name
                }}<span v-if="attributeData.complete == '1'" class="finish">已通过</span><span v-if="attributeData.complete == '2'" class="lack">未通过</span>
              </p>
            </div>
            <div class="info">
              <p>
                <span>考试时间：</span><span>{{ data.startDateTime }} —— {{ data.endDateTime }}</span>
              </p>
            </div>
            <div class="handle" @click="changeHidden">
              <span>详情</span>
              <i v-show="isHidden" class="el-icon-arrow-down"></i>
              <i v-show="!isHidden" class="el-icon-arrow-up"></i>
            </div>
          </div>
          <div v-show="!isHidden" class="exam_info exam_time f_s_14">
            <ul>
              <li>
                题目数量：<b>共{{ attributeData.totalNum }}题</b>
              </li>
              <li>
                参加次数：
                <b>{{
                  attributeData.isLimitedJoinNum
                    ? `${attributeData.examTimes}/${attributeData.joinNumValue}`
                    : '不限'
                }}</b>
              </li>
              <li>
                试卷总分：<b>{{ attributeData.totalScore }}</b>
              </li>
              <li>评分规则：<b>取最高得分最为最终成绩</b></li>
              <li>
                成绩:<b>{{ attributeData.score ? attributeData.score : '--' }}</b>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="attributeData.complete === '1'" class="done_tips">
          <img src="./done.png" />
        </div>
        <el-row class="action">
          <el-button type="primary" :disabled="isGoExam" @click="handleGoExam">去考试</el-button>
        </el-row>
      </section>
    </div>
    <!-- 在线课程模块 -->
    <div v-if="attributeData.type === 3" class="online_courses">
      <div class="status_icon">
        <div v-if="!lastCourse" class="line"></div>
        <div class="icon icon_p">
          <!-- 左边图标，1：未开始：2：进行中；3：已结束 -->
          <i class="el-icon-time"></i>
          <!-- 一直进行中 -->
        </div>
      </div>
      <section class="content content_detail">
        <div class="course_time f_s_14 course_time_c">
          <p v-if="attributeData.status === 3">
            {{ attributeData.startTime.replace(/-/g, '/') }} -
            {{ attributeData.endTime.replace(/-/g, '/') }}
          </p>
          <p v-else>{{ attributeData.startTime.replace(/-/g, '/') }}</p>
          <p>{{ status }}</p>
        </div>
        <div class="course_details">
          <div class="course_site">
            <div class="course_title f_s_16">
              <p>
                <span>【在线课程】</span>
                {{ attributeData.name
                }}{{ `(${attributeData.studyType === 1 ? '选修 ' : '必修'})` }}
                <span v-if="data.complete" class="finish">已完成</span>
                <span v-if="!data.complete" class="lack">未完成</span>
              </p>
            </div>
            <div class="info">
              <p>
                <span>讲师：</span><span>{{ attributeData.teacherName }}</span>
              </p>
              <p>
                <span>课程时间：</span><span>{{ data.startDateTime }} —— {{ data.endDateTime }}</span>
              </p>
            </div>
            <div class="handle" @click="changeHidden">
              <span>详情</span>
              <i v-show="isHidden" class="el-icon-arrow-down"></i>
              <i v-show="!isHidden" class="el-icon-arrow-up"></i>
            </div>
          </div>
          <div v-show="!isHidden" class="exam_info exam_time">
            <ul>
              <li v-for="item in attributeData.content" :key="item.id" @click="goDetails(item)">
                <b>【{{ chapterType(item.type) }}】</b>
                <span>{{ item.name }}</span>
                <i class="exam_info_status">
                  <i v-if="item.percentageComplete == 100" class="el-icon-circle-check"></i>
                  <i
                    v-else-if="item.percentageComplete < 100 && item.percentageComplete > 0"
                    class="el-icon-time"
                  ></i>
                  <i v-else class="el-icon-video-play"></i>
                </i>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="data.complete" class="done_tips">
          <img src="./done.png" />
        </div>
        <el-row class="action">
          <el-button type="primary" :disabled="isGoLearn" @click="handleGoDetails">去学习</el-button>
        </el-row>
      </section>
    </div>
    <!-- 线下/面授模块 -->
    <div v-if="attributeData.type === 1" class="face_to_face_courses">
      <div class="status_icon">
        <div v-if="!lastCourse" class="line"></div>
        <div class="icon icon_p">
          <!-- 左边图标，1：未开始：2：进行中；3：已结束 -->
          <!-- <i class="el-icon-video-play"></i>  -->
          <i v-if="attributeData.status == 1" class="el-icon-video-play"></i>
          <i v-if="attributeData.status == 2" class="el-icon-time"></i>
          <i v-if="attributeData.status == 3" class="el-icon-circle-check"></i>
        </div>
      </div>
      <section class="content content_detail">
        <div class="course_time f_s_14 course_time_c">
          <p v-if="attributeData.status === 3" style="font-size: 13px">
            {{ attributeData.startTime.split('~')[0].replace(/-/g, '/') }} -
            {{ attributeData.startTime.split('~')[1].replace(/-/g, '/') }}
          </p>
          <p v-else>{{ attributeData.startTime.replace(/-/g, '/') }}</p>
          <p>{{ status }}</p>
        </div>
        <div class="course_details">
          <div class="course_site">
            <div class="course_title f_s_16">
              <p>
                <span>
                  {{ attributeData.flag == 1 ? '【面授课程】' : '【线下活动】' }}
                  {{ attributeData.name }}
                </span>
                <span v-if="attributeData.joinStatus === 0" class="lack">请假</span>
                <span v-else-if="attributeData.joinStatus === 2" class="finish">已签到</span>
                <span v-else-if="attributeData.joinStatus === 1" class="lack">缺席</span>
              </p>
            </div>
            <div class="info">
              <p>
                <span>讲师：</span><span>{{ attributeData.teacherName }}</span>
              </p>
              <p>
                <span>教室：</span><span>{{ attributeData.roomName }}</span>
              </p>
              <p>
                <span>教室地址：</span><span>{{ attributeData.roomAddr }}</span>
              </p>
            </div>
          </div>
        </div>
        <div v-if="attributeData.complete == '1'" class="done_tips">
          <img src="./done.png" />
        </div>
        <el-row class="action">
          <!-- 置灰条件：审核中auditStatus为0 -->
          <el-button
            v-if="hasLeaveButton"
            :disabled="attributeData.auditStatus === 0 || trainStatus === 3"
            @click="toLeave"
          >
            {{ leaveText }}
          </el-button>
        </el-row>
      </section>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'FaceToFaceCourses',
  inject: ['arrangement'],
  props: {
    dataInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    lastCourse: {
      type: Boolean
    },
    trainStatus: {
      type: Number
    },
    selectDate: {
      type: String
    }
  },
  data() {
    return {
      isHidden: true,
      data: {
        startTime: '',
        endTime: '',
        status: '',
        content: [],
        complete: true //
      },
      attributeData: {},
      isGoLearn: true, // 是否可去学习
      isGoExam: true // 是否可去考试
    }
  },
  computed: {
    chapterType() {
      return (index) => {
        let type = ''
        switch (+index) {
          case 1:
            type = '文章'
            break
          case 2:
            type = '文档'
            break
          case 3:
            type = '资料下载'
            break
          case 4:
            type = '作业'
            break
          case 5:
            type = '视频'
            break
        }
        return type
      }
    },
    // 是否存在请假按钮
    hasLeaveButton() {
      // 培训开始后，且在这节线下课程结束前，并且审核未通过
      const { auditStatus, startTime } = this.attributeData
      if (this.trainStatus !== 2) return false
      else if (auditStatus === 1) return false
      else if (moment().format('HH:mm:ss') > startTime.split('~')[1]) return false
      else if (this.selectDate < moment(new Date()).format('YYYY-MM-DD')) return false
      else return true
    },
    // 请假按钮的文字
    leaveText() {
      // 培训请假审核状态：空字符串-未提交请假，0-审核中,1-审核通过,2-审核驳回
      const { auditStatus } = this.attributeData
      let text = '请假'
      if (auditStatus === 0) {
        text = '请假审核中'
      }
      return text
    },
    status() {
      if (this.attributeData.status === 1) {
        return '未开始'
      } else if (this.attributeData.status === 2) {
        return '进行中'
      } else if (this.attributeData.status === 3) {
        return '已结束'
      } else {
        return '没数据'
      }
    }
  },
  created() {
    this.attributeData = _.cloneDeep(this.dataInfo)
    this.processData()
  },
  methods: {
    goDetails(v) {
      if (this.isGoLearn) {
        return
      }
      let params = {
        courseId: v.courseId,
        chapterId: v.chapterId
      }
      this.$router.push({ path: '/course/learn', query: params })
    },
    // 请假
    toLeave() {
      this.$confirm('您确定要请假吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/approvalCenter/applyLeave',
            query: { trainOfflineId: this.attributeData.id, trainId: this.$route.query.trainId }
          })
        })
        .catch(() => {
          this.$message.success('取消成功')
        })
    },
    processData() {
      this.data.startDateTime = moment(this.attributeData.startTime).format('YYYY年MM月DD日 HH:mm')
      this.data.endDateTime = moment(this.attributeData.endTime).format('YYYY年MM月DD日 HH:mm')
      if (this.attributeData.type === 2) {
        // 判断在考试时间才显示按钮去考试
        if (
          this.attributeData.status === 2 &&
          (!this.attributeData.isLimitedJoinNum ||
            this.attributeData.examTimes <= this.attributeData.joinNumValue)
        ) {
          // 限制次数 && （已考次数 》= 可用次数
          // (今天时间 》= 开始时间) && (今天时间 《= 结束时间) && （!=已结办）
          this.isGoExam = false
        }
      } else if (this.attributeData.type === 3) {
        // 判断在学习时间才显示按钮去学习
        if (this.attributeData.status === 2) this.isGoLearn = false
      }
      if (this.attributeData.content && this.attributeData.content.length) {
        for (let item of this.attributeData.content) {
          switch (item.type) {
            case '1':
              item.type_name = '文章'
              break
            case '2':
              item.type_name = '课件'
              break
            case '3':
              item.type_name = '资料下载'
              break
            case '4':
              item.type_name = '作业'
              break
            case '5':
              item.type_name = '课前思考内容'
          }
          // 判断是否全部完成
          if (item.percentageComplete != 100) {
            this.data.complete = false
          }
        }
      }
    },
    handleGoDetails() {
      this.$router.push({
        path: '/course/detail',
        query: { id: this.attributeData.id, trainId: this.$route.query.trainId || '' }
      })
    },
    handleGoExam() {
      this.$confirm('您确定现在参加考试吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/exam/paper',
            query: { examId: this.attributeData.id, batchId: this.attributeData.examBatchId }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '考试暂时不开始！'
          })
        })
    },
    changeHidden() {
      this.isHidden = !this.isHidden
    }
  }
}
</script>

<style lang="scss" scoped>
$info_g_1: rgba(0, 11, 21, 0.65);
$info_o_1: rgba(0, 11, 21, 0.65);
$info_o_2: rgba(0, 11, 21, 0.65);
$info_o_3: #fff7f0;
$info_o_4: #fffbf7;
$info_p_1: #2875d4;
// 公共样式
.task_info {
  .f_s_14 {
    font-size: 14px;
  }
  .f_s_15 {
    font-size: 15px;
  }
  .f_s_16 {
    font-size: 16px;
  }
  .f_s_17 {
    font-size: 17px;
  }
  .f_s_18 {
    font-size: 18px;
  }
  p {
    margin: 0;
  }
  section {
    width: 996px;
  }
  .icon_p {
    position: absolute;
    top: 65px;
    z-index: 1;
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 1);
  }
  .line {
    width: 1px;
    border-left: 1px dashed#D9DBDC;
    position: relative;
    top: 65px;
  }
  .content {
    flex: 1;
    display: flex;
    position: relative;
    margin-bottom: 32px;
    .course_time {
      padding: 20px 0;
      width: 100px;
      margin: 0 10px;
      font-size: 14px;
      p {
        margin-top: 10px;
        font-size: 13px;
      }
    }
  }
  .course_time_c {
    p:first-child {
      font-size: 14px;
      color: rgba(0, 11, 21, 0.65);
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 600;
    }
    p:last-child {
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
    }
  }
  .handle {
    font-size: 14px;
    color: #2875d4;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
    margin-top: 16px;
    span {
      margin-right: 5px;
    }
  }
}
// 下面单独样式
// 考试样式
.exam {
  display: flex;
  .status_icon {
    position: relative;
    width: 40px;
    display: flex;
    justify-content: center;
    .icon {
      i {
        font-size: 16px;
        color: rgba(0, 11, 21, 0.45);
      }
    }
  }
  .content_detail {
    .course_details {
      flex: 1;
      border-radius: 3px;
      .course_site {
        background: $info_o_3;
        padding: 25px 0 25px 25px;
        border-left: 3px solid #f5623b;
        height: 132px;
        .course_title {
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 600;
        }
      }
      .finish {
        color: #e4aa77;
        font-size: 12px;
        margin: 20px;
      }
      .lack {
        color: #e25a80;
        font-size: 12px;
        margin: 20px;
      }
      .info {
        padding-top: 8px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        line-height: 22px;
      }
      .exam_info {
        background: #fff6f0;
        padding: 25px 0 25px 25px;
        color: rgba(0, 11, 21, 0.65);
      }
      .exam_time {
        border-left: 3px solid #f5623b;
        padding: 0 24px;
        ul {
          display: flex;
          border-top: 1px dashed rgba(0, 11, 21, 0.15);
          padding: 16px 0;
          li {
            margin-right: 30px;
          }
        }
      }
    }
    .done_tips {
      position: absolute;
      top: 40px;
      right: 155px;
      width: 65px;
      height: 67.69px;
      img {
        width: 100%;
      }
    }
    .action {
      position: absolute;
      top: 60px;
      right: 60px;
      .el-button {
        padding: 8px 18px;
      }
    }
  }
}
// 在线课程样式
.online_courses {
  display: flex;
  .status_icon {
    position: relative;
    width: 40px;
    display: flex;
    justify-content: center;
    .icon {
      i {
        font-size: 16px;
        color: rgba(0, 11, 21, 0.45);
      }
    }
  }
  .content_detail {
    .course_details {
      flex: 1;
      border-radius: 3px;
      .course_site {
        background: #f0f9ff;
        padding: 25px 0 25px 25px;
        border-left: 3px solid #2875d4;
        height: 132px;
        .course_title {
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 600;
        }
      }
      .finish {
        color: #b382d4;
        font-size: 12px;
        margin: 20px;
      }
      .lack {
        color: #e25a80;
        font-size: 12px;
        margin: 20px;
      }
      .info {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        line-height: 22px;
        font-weight: 400;
        padding-top: 8px;
        display: flex;
        p:first-of-type {
          margin-right: 32px;
        }
      }
      .exam_info {
        background: #fbf7ff;
        padding: 25px 0 25px 25px;
        color: rgba(0, 11, 21, 0.65);
      }
      .exam_time {
        border-left: 3px solid #2875d4;
        padding: 0 24px;
        background-color: #f0f9ff;
        ul {
          border-top: 1px dashed rgba(0, 11, 21, 0.15);
          padding: 16px 0;
          li {
            cursor: pointer;
            margin-top: 8px;
            padding-right: 30px;
            .exam_info_status {
              float: right;
              font-size: 16px;
            }
          }
          li:nth-child(1) {
            margin: 0;
          }
          li:hover {
            color: #2875d4;
          }
        }
      }
    }
    .done_tips {
      position: absolute;
      top: 40px;
      right: 155px;
      width: 65px;
      height: 67.69px;
      img {
        width: 100%;
      }
    }
    .action {
      position: absolute;
      top: 60px;
      right: 60px;
      .el-button {
        padding: 8px 18px;
      }
    }
  }
}
// 线下/面授
.face_to_face_courses {
  display: flex;
  .btn {
    position: absolute;
    top: 60px;
    right: 60px;
    .el-button {
      padding: 8px 18px;
    }
  }
  .status_icon {
    position: relative;
    width: 40px;
    display: flex;
    justify-content: center;
    .icon {
      i {
        font-size: 15px;
        color: rgba(0, 11, 21, 0.45);
      }
    }
  }
  .content_detail {
    .course_time_c {
      color: #9cd1ba;
    }
    .course_details {
      flex: 1;
      border-left: 3px solid #50bd35;
      border-radius: 3px;
      height: 132px;
      .course_site {
        background: #f3fced;
        padding: 25px 0 25px 25px;
        height: 100%;
        .course_title {
          color: #00633d;
        }
      }
      p span:nth-child(1) {
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 600;
      }
      .finish {
        color: #00b061;
        font-size: 12px;
        margin: 20px;
      }
      .lack {
        color: #e25a80;
        font-size: 12px;
        margin: 20px;
      }
      .info {
        padding-top: 8px;
        p {
          display: inline-block;
          span {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.45);
            letter-spacing: 0;
            margin-right: 32px;
          }
        }
      }
    }
    .done_tips {
      position: absolute;
      top: 40px;
      right: 20px;
      width: 65px;
      height: 67.69px;
      img {
        width: 100%;
      }
    }
    .action {
      position: absolute;
      top: 60px;
      right: 60px;
      .el-button {
        padding: 8px 18px;
      }
    }
    .handle {
      position: absolute;
      top: 65px;
      right: 20px;
      font-size: 24px;
      color: $info_o_1;
    }
  }
}
</style>
