<template>
  <div class="details">
    <div class="details_header">
      <ul>
        <li>审批中心</li>
        <li>/</li>
        <li>待我审批</li>
        <li>/</li>
        <li class="text_color">审批详情</li>
      </ul>
    </div>

    <div class="details_top_bar">
      <div class="details_top_bar_title">{{ processData.processName }}</div>
      <ul>
        <li>
          <span class="details_top_li_text">审批编号：</span> <span>{{ processData.apprNo }}</span>
        </li>
        <li>
          <span class="details_top_li_text">申请人：</span> <span>{{ processData.userName }}</span>
        </li>
        <li>
          <span class="details_top_li_text">申请时间：</span>
          <span>{{ processData.applyTime }}</span>
        </li>
      </ul>
      <div class="details_top_bar_bottom">
        <span class="details_top_bar_bottom_title">状态：</span>
        <span class="details_top_bar_bottom_text" v-show="processData.status == 'Approve'"
          >审批中</span
        >
        <span class="details_top_bar_bottom_text" v-show="processData.status == 'Pass'"
          >已通过</span
        >
        <span class="details_top_bar_bottom_text" v-show="processData.status == 'Reject'"
          >已拒绝</span
        >
        <span class="details_top_bar_bottom_text" v-show="processData.status == 'Corvidae'"
          >待完善</span
        >
        <span class="details_top_bar_bottom_text" v-show="processData.status == 'Cancel'"
          >已撤回</span
        >
      </div>
    </div>

    <div class="details_course">
      <div class="details_course_title">
        <div class="details_course_title_l">课程详情</div>
        <div class="details_course_title_r" @click="showDetailed = !showDetailed">
          <div v-show="!showDetailed"><span>展开</span> <i class="el-icon-arrow-down"></i></div>
          <div v-show="showDetailed"><span>收起</span> <i class="el-icon-arrow-up"></i></div>
        </div>
      </div>

      <div v-show="showDetailed" class="details_course_detailed">
        <div class="details_course_detailed_top">
          <div class="details_course_detailed_img">
            <img :src="courseData.url" alt="" />
          </div>

          <div class="details_course_detailed_r">
            <div class="details_course_detailed_r_title">
              {{ courseData.name }}
            </div>
            <ul>
              <li>
                <span class="text">讲师：</span> <span> {{ courseData.teacherId }} </span>
              </li>
              <li>
                <span class="text">所在分类：</span> <span> {{ courseData.catalogName }} </span>
              </li>
              <li>
                <span class="text">课程类型：</span>
                <span>
                  <span v-show="courseData.type == 1">在线课程</span>
                  <span v-show="courseData.type == 2">面授课程</span>
                  <span v-show="courseData.type == 3">直播课程</span>
                </span>
              </li>
              <li>
                <span class="text">学时（小时）：</span> <span> {{ courseData.period }} </span>
              </li>
              <li>
                <span class="text">学分：</span> <span> {{ courseData.credit }} </span>
              </li>
              <li>
                <span class="text">通过条件：</span>
                <span v-for="(item, index) in courseData.passCondition" :key="index">
                  <span v-show="item == 'a'">教师评定 </span>
                  <span v-show="item == 'b'"
                    >考试通过 {{ courseData.passCondition.split(',').length >= 3 ? ',' : '' }}</span
                  >
                  <span v-show="item == 'c'"
                    >达到课程学时 {{ courseData.passCondition.split(',').length >= 2 ? ',' : '' }}
                  </span>
                </span>
              </li>
              <li>
                <span class="text">选修类型：</span>
                <span>
                  <span v-show="courseData.electiveType == 1">在线课程</span>
                  <span v-show="courseData.electiveType == 2">面授课程</span>
                  <span v-show="courseData.electiveType == 3">直播课程</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="details_course_detailed_bar">
          <span :class="{ pitch: pitch == 1 }" @click="setPitch(1)">详细信息</span>
          <span :class="{ pitch: pitch == 2 }" @click="setPitch(2)">课程内容</span>
        </div>
        <div v-show="pitch == 1" class="details_course_detailed_pitch1">
          <div class="title">
            <i></i>
            <span>课程介绍</span>
          </div>
          <div class="content">
            <div v-html="courseData.introduction"></div>
          </div>
          <div class="title">
            <i></i>
            <span>课前思考</span>
          </div>
          <div class="content">
            <div v-html="courseData.thinkContent"></div>
          </div>
        </div>
        <div v-show="pitch == 2" class="details_course_detailed_pitch2">
          <ul>
            <li v-for="(item, index) in courseData.content" :key="index" @click="jumpToLearn(item)">
              <div>
                <i>{{ index + 1 }}</i> <span>{{ item.name }}</span>
              </div>
              <div class="btn">查看内容</div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="details_process">
      <div class="details_process_box">
        <div class="details_process_box_title">审批流程</div>

        <div class="details_process_box_steps">
          <el-steps :style="{ height: stepsheight }" direction="vertical" :active="2">
            <el-step
              v-for="(item, index) in recordData"
              :key="index"
              icon="iconiconfontdian1 iconfont"
            >
              <template slot="title">
                <div class="title">
                  <span>{{ item.nodeName }}</span> <i>1人审批</i>
                </div>
              </template>

              <template slot="description">
                <div class="course">
                  <div class="img_box">
                    <img :src="item.avatarUrl" alt="" />
                  </div>

                  <div class="name_box">
                    <div>
                      <span class="name">{{ item.userName }}</span>
                      <span class="launch" v-show="item.result == ''">发起审批</span>
                      <span class="conduct" v-show="item.result == 'Approve'">审批中</span>
                      <span class="conduct" v-show="item.result == 'Pass'">已通过</span>
                      <span class="conduct" v-show="item.result == 'Reject'">已拒绝</span>
                      <span class="conduct" v-show="item.result == 'Corvidae'">待完善</span>
                      <span class="conduct" v-show="item.result == 'Cancel'">已撤回</span>
                    </div>
                    <div class="time">
                      <el-button type="text" @click="urgeBtn"> 催一下 </el-button>
                      {{ item.createTime }}
                    </div>
                  </div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>

      <div class="details_comment">
        <div class="details_comment_title">审批意见</div>

        <div class="details_comment_textarea" v-show="centerPitch() == 1">
          <el-input v-model="textarea" type="textarea" :rows="4" placeholder="请输入（必填）">
          </el-input>
        </div>
      </div>
    </div>

    <div class="details_btn">
      <div v-show="centerPitch() == 1">
        <el-tooltip content="拒绝审批后，该审批将终止" placement="top">
          <el-button @click="refuseBtn">拒绝</el-button>
        </el-tooltip>
        <el-tooltip content="同意该审批，审批将继续向下流转" placement="top">
          <el-button type="primary" @click="agreeBtn">同意</el-button>
        </el-tooltip>
      </div>

      <div v-show="centerPitch() == 4">
        <el-tooltip content="已有人审批，无法撤回" placement="top">
          <el-button @click="withdrawBtn">撤回</el-button>
        </el-tooltip>
        <!-- <el-button type="primary"> 重新申请 </el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getTeacherList, getCourseDetail } from '@/api/course'
import { detail, record, urge, pass, reject, cancel } from '@/api/approvalCenter'
export default {
  data() {
    return {
      pitch: 1,
      showDetailed: false,
      textarea: '',
      stepsheight: '100px',
      // 最上面的审核数据
      processData: {},
      // 课程详情
      courseData: {},
      // 审批记录
      recordData: []
    }
  },
  activated() {
    this.getCourseData()
    this.getdetail()
    this.getrecord()
  },
  methods: {
    id() {
      return this.$route.query.id
    },
    apprNo() {
      return this.$route.query.apprNo
    },
    centerPitch() {
      return this.$route.query.pitch
    },
    // 催一下
    urgeBtn() {
      urge({ processInstanceId: this.processData.processInstanceId, apprNo: this.apprNo() }).then(
        () => {
          this.$message({
            message: '催办成功',
            type: 'success'
          })
        }
      )
    },
    // 同意
    agreeBtn() {
      pass({
        userId: this.processData.userId,
        taskId: this.recordData[0].taskId,
        processInstanceId: this.processData.processInstanceId,
        comment: this.textarea
      }).then(() => {
        setTimeout(() => {
          this.goBack()
        }, 2000)
        this.$message({
          message: `你已同意${this.processData.userName}的课程审批申请`,
          type: 'success'
        })
      })
    },
    // 拒绝
    refuseBtn() {
      reject({
        userId: this.processData.userId,
        taskId: this.recordData[0].taskId,
        processInstanceId: this.processData.processInstanceId,
        comment: this.textarea
      }).then(() => {
        setTimeout(() => {
          this.goBack()
        }, 2000)
        this.$message({
          message: `你已拒绝${this.processData.userName}的课程审批申请`,
          type: 'success'
        })
      })
    },
    // 撤回
    withdrawBtn() {
      this.$confirm('确定撤销申请吗？撤销后可重新提交', '撤销申请', {
        confirmButtonText: '撤销',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          cancel({
            processInstanceId: this.processData.processInstanceId
          }).then(() => {
            setTimeout(() => {
              this.goBack()
            }, 2000)
            this.$message({
              message: '撤回成功',
              type: 'success'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回'
          })
        })
    },
    // 最上面的审核数据
    async getdetail() {
      let res = await detail({ apprNo: this.apprNo() })
      this.processData = res
    },
    // 流程节点
    async getrecord() {
      let res = await record({ apprNo: this.apprNo() })
      this.recordData = res.data
    },
    // 拿e课程信息
    async getCourseData() {
      let res = await getCourseDetail({ courseId: this.id() })
      res.introduction = _.unescape(res.introduction)
      res.thinkContent = _.unescape(res.thinkContent)
      this.courseData = res
      // 讲师
      getTeacherList({ currentPage: 1, size: 9999 }).then((teacherRes) => {
        teacherRes.teacherInfos.map((item) => {
          if (this.courseData.teacherId == item.user_id_str) this.courseData.teacherId = item.name
        })
      })
    },
    // 查看内容
    jumpToLearn(item) {
      this.$router.push({
        path: '/approvalCenter/chapter',
        query: { courseId: item.courseId, chapterId: item.id }
      })
    },
    setPitch(i) {
      this.pitch = i
    },
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  &_header {
    height: 57px;
    line-height: 57px;
    ul {
      display: flex;
      li {
        margin-right: 5px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .text_color {
        color: rgba(0, 11, 21, 0.85);
      }
    }
  }
  &_top_bar {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    height: 156px;
    padding: 24px;
    &_title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 28px;
      font-weight: bold;
    }
    ul {
      display: flex;
      margin-top: 18px;
      li {
        width: 33.3%;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        .details_top_li_text {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
        }
      }
    }
    &_bottom {
      margin-top: 16px;
      &_title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
      }
      &_text {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        margin-right: 10px;
      }
    }
  }
  &_course {
    margin-top: 20px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    &_title {
      display: flex;
      justify-content: space-between;
      padding: 24px;
      &_l {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 22px;
      }
      &_r {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        line-height: 22px;
        cursor: pointer;
        span {
          margin-right: 8px;
        }
      }
    }
    &_detailed {
      padding: 0 24px 24px;
      &_top {
        display: flex;
      }
      &_img {
        width: 320px;
        height: 180px;
        border-radius: 4px;
        background-color: #1e8cff;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &_r {
        flex: 1;
        margin-left: 40px;
        &_title {
          font-size: 18px;
          color: #000b15;
          letter-spacing: 0;
        }
        ul {
          li {
            width: 50%;
            float: left;
            margin-top: 16px;
            opacity: 0.85;
            font-size: 14px;
            color: #000b15;
            letter-spacing: 0;
            .text {
              opacity: 0.45;
            }
          }
        }
      }
      &_bar {
        margin-top: 40px;
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
        display: flex;
        border-bottom: 1px solid #ebeced;
        .pitch {
          color: #01aafc;
          border-bottom: 1px solid #01aafc;
        }
        span {
          margin-right: 40px;
          cursor: pointer;
        }
      }
      &_pitch1 {
        .title {
          margin-top: 24px;
          display: flex;
          i {
            display: inline-block;
            background: #01aafc;
            width: 4px;
            height: 16px;
            margin-right: 8px;
          }
          span {
            opacity: 0.85;
            font-size: 14px;
            color: #000b15;
            margin-top: -2px;
          }
        }
        .content {
          margin-top: 16px;
        }
      }
      &_pitch2 {
        ul {
          margin-top: 24px;
          li {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ebeced;
            height: 48px;
            line-height: 48px;
            opacity: 0.85;
            font-size: 14px;
            color: #000b15;
            letter-spacing: 0;
            i {
              font-style: normal;
              margin-left: 24px;
            }
            span {
              margin-left: 27px;
            }
            .btn {
              opacity: 0.85;
              font-size: 14px;
              color: #01aafc;
              letter-spacing: 0;
              margin-right: 24px;
              cursor: pointer;
              display: none;
            }
            &:nth-child(1) {
              border-top: 1px solid #ebeced;
            }
            &:hover {
              background-color: #f0fafe;
              .btn {
                display: block;
              }
            }
          }
        }
      }
    }
  }
  &_process {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    padding: 24px;
    &_box {
      height: 400px;
      &_title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
      &_steps {
        padding: 16px;
        .title {
          span {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
          }
          i {
            font-style: normal;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.25);
            display: inline-block;
            margin-left: 8px;
          }
        }
        .course {
          padding: 18px;
          display: flex;
          .img_box {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: pink;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .name_box {
            margin-left: 16px;
            .name {
              font-size: 14px;
              color: rgba(0, 11, 21, 0.85);
            }
            .launch {
              font-size: 12px;
              color: #01aafc;
              display: inline-block;
              padding: 1px 8px;
              background: #e7fbff;
              border-radius: 4px;
              margin-left: 8px;
            }
            .conduct {
              font-size: 12px;
              color: #00b061;
              display: inline-block;
              padding: 1px 8px;
              background: #e7ffee;
              border-radius: 4px;
              margin-left: 8px;
            }
            .time {
              margin-top: 10px;
              font-size: 14px;
              color: rgba(0, 11, 21, 0.45);
            }
          }
        }
      }
    }
  }
  &_comment {
    &_title {
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      margin-top: 24px;
    }
    &_textarea {
      margin-top: 16px;
      margin-bottom: 180px;
    }
  }
  &_btn {
    background: #ffffff;
    box-shadow: 0 -2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 16px;
    display: flex;
    justify-content: center;
  }
}
</style>
