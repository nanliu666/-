<template>
  <div class="task_info">
    <!-- 这里做判断，写三套 -->
    <!-- 考试模块 -->
    <div v-if="dataInfo.type === 2" class="exam">
      <div class="status_icon">
        <div v-if="!lastCourse" class="line"></div>
        <div class="icon icon_p">
          <!-- 左边图标，1：未开始：2：进行中；3：已结束 -->
          <!-- <i class="el-icon-video-play"></i> -->
          <i v-if="dataInfo.status == 1" class="el-icon-video-play"></i>
          <i v-if="dataInfo.status == 2" class="el-icon-time"></i>
          <i v-if="dataInfo.status == 3" class="el-icon-circle-check"></i>
        </div>
      </div>
      <section class="content content_detail">
        <div class="course_time f_s_14 course_time_c">
          <!-- <p>{{ data.startTime }}~{{ data.endTime }}</p> -->
          <p>{{ data.startTime }}</p>
          <p>{{ data.status }}</p>
        </div>
        <div class="course_details">
          <div class="course_site">
            <div class="course_title f_s_16">
              <p>
                <span>【考试】</span>{{ dataInfo.name
                }}<span v-if="dataInfo.complete == '1'" class="finish">已通过</span><span v-if="dataInfo.complete == '2'" class="lack">未通过</span>
              </p>
            </div>
            <div class="info">
              <p>
                <span>考试时间：</span><span>{{ data.startDateTime }} —— {{ data.endDateTime }}</span>
              </p>
            </div>
          </div>
          <div v-show="!isHidden" class="exam_info exam_time f_s_14">
            <ul>
              <li>题目数量：共{{ dataInfo.totalNum }}题</li>
              <li>剩余有效答题次数：{{ dataInfo.surplusParticipatNumber }}</li>
              <li>试卷总分：{{ dataInfo.totalScore }}</li>
              <li>评分规则：取最高得分最为最终成绩</li>
              <li>成绩:{{ dataInfo.score? dataInfo.score: '-' }}</li>
            </ul>
          </div>
        </div>
        <div v-if="dataInfo.complete == '1'" class="done_tips">
          <img src="./done.png" />
        </div>
        <el-row class="action">
          <el-button type="primary" :disabled="isGoExam" @click="handleGoExam">去考试</el-button>
        </el-row>
        <div class="handle" @click="changeHidden">
          <i v-show="isHidden" class="el-icon-arrow-down"></i>
          <i v-show="!isHidden" class="el-icon-arrow-up"></i>
        </div>
      </section>
    </div>
    <!-- 在线课程模块 -->
    <div v-if="dataInfo.type === 3" class="online_courses">
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
          <p>00:00～24:00</p>
          <!-- <p>{{data.status}}</p> -->
          <p>进行中</p>
        </div>
        <div class="course_details">
          <div class="course_site">
            <div class="course_title f_s_16">
              <p>
                <span>【在线课程】</span>{{ dataInfo.name
                }}<span v-if="data.complete" class="finish">已完成</span><span v-if="!data.complete" class="lack">未完成</span>
              </p>
            </div>
            <div class="info">
              <p>
                <span>讲师：</span><span>{{ dataInfo.teacherName }}</span>
              </p>
              <p>
                <span>课程时间：</span><span>{{ data.startTime }} —— {{ data.endTime }}</span>
              </p>
            </div>
          </div>
          <div v-show="!isHidden" class="exam_info exam_time">
            <ul>
              <!-- <li v-for="item in dataInfo.content" :key="item.id"  @click="goDetails(item)">【{{item.type}}】章节{{item.sort}} {{item.name}}<i class="exam_info_status"><i :class="item.typeClass"></i></i></li> -->
              <li v-for="item in dataInfo.content" :key="item.id" @click="goDetails(item)">
                【{{ item.type }}】{{ item.name }}
                <i class="exam_info_status">
                  <i v-if="item.percentageComplete == 100" class="el-icon-circle-check"></i>
                  <i
                    v-else-if="item.percentageComplete < 100 && item.percentageComplete > 0"
                    class=" el-icon-time"
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
        <div class="handle" @click="changeHidden">
          <i v-show="isHidden" class="el-icon-arrow-down"></i>
          <i v-show="!isHidden" class="el-icon-arrow-up"></i>
        </div>
      </section>
    </div>
    <!-- 线下/面授模块 -->
    <div v-if="dataInfo.type === 1" class="face_to_face_courses">
      <!-- <div class="face_to_face_courses"> -->
      <div class="status_icon">
        <div v-if="!lastCourse" class="line"></div>
        <div class="icon icon_p">
          <!-- 左边图标，1：未开始：2：进行中；3：已结束 -->
          <!-- <i class="el-icon-video-play"></i>  -->
          <i v-if="dataInfo.status == 1" class="el-icon-video-play"></i>
          <i v-if="dataInfo.status == 2" class="el-icon-time"></i>
          <i v-if="dataInfo.status == 3" class="el-icon-circle-check"></i>
        </div>
      </div>
      <section class="content content_detail">
        <div class="course_time f_s_14 course_time_c">
          <p>{{ dataInfo.startTime }}</p>
          <p>{{ data.status }}</p>
        </div>
        <div class="course_details">
          <div class="course_site">
            <div class="course_title f_s_16">
              <!-- <p>线下活动】挖掘机技能传授<span style="display: inline-block;float: right;">已签到</span></p> -->
              <p>
                <span>{{ dataInfo.flag == 1 ? '【面授课程】' : '【线下活动】' }}</span>{{ dataInfo.name }}<span v-if="dataInfo.sign == '1'" class="finish">已签到</span><span v-if="dataInfo.sign == '2'" class="lack">缺席</span>
              </p>
            </div>
            <div class="info">
              <p>
                <span>讲师：</span><span>{{ dataInfo.teacherName }}</span>
              </p>
              <p>
                <span>教室：</span><span>{{ dataInfo.roomName }}</span>
              </p>
              <p>
                <span>教室地址：</span><span>{{ dataInfo.roomAddr }}</span>
              </p>
            </div>
          </div>
        </div>
        <div v-if="dataInfo.complete == '1'" class="done_tips">
          <img src="./done.png" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'FaceToFaceCourses',
  props: {
    dataInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    lastCourse: {
      type: Boolean
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
      isGoLearn: true, // 是否可去学习
      isGoExam: true // 是否可去考试
    }
  },
  created() {
    this.getData()
    this.getList()
    this.processData()
  },
  methods: {
    getData() {},
    getList() {},
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
    processData() {
      if (this.dataInfo.type === 2) {
        this.data.startDateTime = moment(this.dataInfo.startTime).format('YYYY年MM月DD日 HH:mm')
        this.data.endDateTime = moment(this.dataInfo.endTime).format('YYYY年MM月DD日 HH:mm')
        this.data.startTime = moment(this.dataInfo.startTime).format('HH:mm')
        this.data.endTime = moment(this.dataInfo.endTime).format('HH:mm')
        // 判断在考试时间才显示按钮去考试
        if (new Date().getTime() >= new Date(this.dataInfo.startTime).getTime() && new Date().getTime() <= new Date(this.dataInfo.endTime).getTime() && this.dataInfo.status != 3) {
          // (今天时间 》= 开始时间) && (今天时间 《= 结束时间) && （!=已结办）
          this.isGoExam = false
        }
      }
      if (this.dataInfo.type === 3) {
        this.data.startTime = moment(this.dataInfo.startTime).format('YYYY年MM月DD日')
        this.data.endTime = moment(this.dataInfo.endTime).format('YYYY年MM月DD日')
        // 判断在学习时间才显示按钮去学习
        let today = new Date(moment().format('YYYY-MM-DD'))
        let startDate = new Date(moment(this.dataInfo.startTime).format('YYYY-MM-DD'))
        let endDate = new Date(moment(this.dataInfo.endTime).format('YYYY-MM-DD'))
        if (today >= startDate && today <= endDate && this.dataInfo.status != 3) {
          // (今天日期 》= 开始日期) && (今天日期 《= 结束日期) && （!=已结办）
          this.isGoLearn = false
          // console.log('this.isGoLearn', this.isGoLearn)
        }
      }
      // console.log('this.dataInfo', this.dataInfo)
      if (this.dataInfo.status === 1) {
        this.data.status = '未开始'
      } else if (this.dataInfo.status === 2) {
        this.data.status = '进行中'
      } else if (this.dataInfo.status === 3) {
        this.data.status = '已结束' // 表示已结办
      } else {
        this.data.status = '没数据'
      }
      if (this.dataInfo.content && this.dataInfo.content.length) {
        for (let item of this.dataInfo.content) {
          // console.log('sfasfadf---',item.percentageComplete)
          switch (item.type) {
            case '1':
              item.type = '文章'
              break
            case '2':
              item.type = '课件'
              break
            case '3':
              item.type = '资料下载'
              break
            case '4':
              item.type = '作业'
              break
            case '5':
              item.type = '课前思考内容'
          }
          // 判断是否全部完成
          if (item.percentageComplete != 100) {
            this.data.complete = false
          }
        }
      }
    },
    handleGoDetails() {
      this.$router.push({ path: '/course/detail', query: { id: this.dataInfo.id } })
    },
    handleGoExam() {
      this.$confirm(`您确定现在参加考试吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.$router.push({ path: '/exam/paper', query: { examId: this.dataInfo.id, batchId: this.dataInfo.examBatchId} })
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
$info_g_1: rgba(0, 214, 111, 1);
$info_o_1: rgba(252, 124, 1, 1);
$info_o_2: rgba(176, 73, 0, 0.45);
$info_o_3: #fff7f0;
$info_o_4: #fffbf7;
$info_p_1: rgba(145, 1, 252, 1);
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
    padding: 20px 0;
    display: flex;
    position: relative;
    .course_time {
      padding: 20px 0;
      width: 100px;
      margin: 0 10px;
      font-size: 14px;
      p {
        margin-top: 10px;
      }
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
        font-size: 15px;
        color: $info_o_1;
      }
    }
  }
  .content_detail {
    .course_time_c {
      color: $info_o_2;
    }
    .course_details {
      flex: 1;
      border-left: 3px solid $info_o_1;

      border-radius: 3px;
      .course_site {
        background: $info_o_3;
        padding: 25px 0 25px 25px;
        .course_title {
          color: rgba(138, 53, 1, 1);
        }
      }
      p span:nth-child(1) {
        font-weight: bold;
      }
      // p span:nth-child(3){
      //   padding: 5px;
      //   color: crimson;
      //   margin-left: 10px;
      //   border-radius: 5px;
      // }
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
        padding-top: 20px;
        p {
          font-size: 14px;
          span:nth-child(1) {
            color: rgba(176, 73, 0, 0.6);
          }
          span:nth-child(2) {
            color: rgba(176, 73, 0, 1);
          }
        }
      }
      .exam_info {
        background: $info_o_4;
        padding: 25px 0 25px 25px;
        color: rgba(0, 11, 21, 0.65);
      }
      .exam_time {
        ul {
          display: flex;
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
    .handle {
      position: absolute;
      top: 65px;
      right: 20px;
      font-size: 24px;
      color: $info_o_1;
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
        font-size: 15px;
        color: #9101fc;
      }
    }
  }
  .content_detail {
    .course_time_c {
      color: rgba(88, 0, 176, 0.45);
    }
    .course_details {
      flex: 1;
      border-left: 3px solid #9101fc;

      border-radius: 3px;
      .course_site {
        background: #f9f0ff;
        padding: 25px 0 25px 25px;
        .course_title {
          color: #40018a;
        }
      }
      p span:nth-child(1) {
        font-weight: bold;
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
        padding-top: 20px;
        p {
          display: inline-block;
          margin-right: 20px;
          font-size: 14px;
          span:nth-child(1) {
            color: #9f6ad3;
          }
          span:nth-child(2) {
            color: #6b1cb9;
          }
        }
      }
      .exam_info {
        background: #fbf7ff;
        padding: 25px 0 25px 25px;
        color: rgba(0, 11, 21, 0.65);
      }
      .exam_time {
        ul {
          // display: flex;
          li {
            // margin-right: 30px;
            // margin: 6px 30px 6px 0px;
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
    .handle {
      position: absolute;
      top: 65px;
      right: 20px;
      font-size: 24px;
      color: #9101fc;
    }
  }
}
// 线下/面授
.face_to_face_courses {
  display: flex;
  .status_icon {
    position: relative;
    width: 40px;
    display: flex;
    justify-content: center;
    .icon {
      i {
        font-size: 15px;
        color: #00d66f;
      }
    }
  }
  .content_detail {
    .course_time_c {
      color: #9cd1ba;
    }
    .course_details {
      flex: 1;
      border-left: 3px solid #00d66f;

      border-radius: 3px;
      .course_site {
        background: #f1fdf7;
        padding: 25px 0 25px 25px;
        .course_title {
          color: #00633d;
        }
      }
      p span:nth-child(1) {
        font-weight: bold;
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
        padding-top: 20px;
        p {
          display: inline-block;
          margin-right: 20px;
          font-size: 14px;
          span:nth-child(1) {
            color: #58b38c;
          }
          span:nth-child(2) {
            color: #199560;
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
