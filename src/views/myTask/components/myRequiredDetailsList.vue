<template>
  <div class="myRequiredDetailsList">
    <section v-if="dataInfo">
      <!-- 一级循环 -->
      <div
        v-for="(external, external_i) in dataInfo"
        :key="external_i + Math.floor(Math.random() * 100000) + 'a'"
        class="Level_1_cycle"
      >
        <div class="Level_2_cycle">
          <div
            v-for="(item, internal_i) in external.list"
            :key="internal_i + Math.floor(Math.random() * 100000) + 'b'"
            class="course"
          >
            <!-- 图片 -->
            <div class="top finger" @click="goCourseDetails(item)">
              <img
                :src="item.coverUrl"
                :alt="item.coverName"
                :onerror="errorImg"
                class="course_img"
              />
              <div class="mask">
                <div v-show="item.status == 2" class="hoverButton finger" @click="goLearn(item)">
                  {{ item.totalPrecent ? '继续学习' : '立即学习' }}
                </div>
              </div>
            </div>
            <!-- 课程信息 -->
            <div class="bottom">
              <!-- 基本信息 -->
              <div class="course_info">
                <ul class="course_info_ul">
                  <li class="course_title finger" @click="goCourseDetails(item)">
                    {{ item.name ? item.name : '--' }}
                  </li>
                  <li class="other">
                    <span class="lecturer">{{ item.teacherName ? item.teacherName : '--' }}</span>
                    <span class="course_date">
                      学习人数:
                      {{ item.studyNum ? item.studyNum : 0 }}
                      人
                    </span>
                  </li>
                  <!-- 进度条 -->
                  <li class="progress">
                    <div class="progress_bar">
                      <div class="outer">
                        <div class="inside" :style="'width:' + item.totalPrecent + '%'"></div>
                      </div>
                    </div>
                    <div class="progress_num">
                      {{ item.totalPrecent ? item.totalPrecent + '%' : '0%' }}
                    </div>
                  </li>
                </ul>
              </div>
              <!-- 考试信息 -->
              <div class="course_exam" @click="handleShowExam(item, internal_i)">
                <div class="label">关联考试：</div>
                <div class="exam_num">{{ item.examList.length }}个</div>
                <i v-show="item.isShow && item.examList.length" class="el-icon-arrow-up"></i>
                <i v-show="!item.isShow && item.examList.length" class="el-icon-arrow-down"></i>
              </div>
            </div>
            <!-- 状态 -->
            <div class="course_status">
              <span v-if="item.status == 1" class="base_status status_1">未开始</span>
              <span v-if="item.status == 2" class="base_status status_6">进行中</span>
              <span v-if="item.status == 3" class="base_status status_5">已结束</span>
            </div>
            <!-- 考试列表 -->
            <div v-show="item.showExam" class="exam_list">
              <!-- 列表内容 -->
              <ul class="exam_list_ul">
                <li
                  v-for="(item, index) in item.examList"
                  :key="index + Math.floor(Math.random() * 100000) + 'd'"
                  class="exam_list_li"
                >
                  <ul class="exam_info">
                    <li class="exam_name">
                      <el-button type="text" :disabled="item.isDisabled" @click="goExam(item)">
                        {{ item.examName }}
                      </el-button>
                    </li>
                    <li class="status">
                      <span v-if="item.isPass == '1'" class="base_status status_1 exam_status">未通过</span>
                      <span v-if="item.isPass == '2'" class="base_status status_2 exam_status">待发布</span>
                      <span v-if="item.isPass == '3'" class="base_status status_3 exam_status">已通过</span>
                      <!-- <span v-if="item.status == '4'" class="base_status status_4 exam_status">缺考</span> -->
                    </li>
                  </ul>
                </li>
              </ul>
              <!-- 三角形 -->
              <div class="arrows" :style="'left:' + triangularPosition + 'px'"></div>
            </div>
          </div>
          <div
            v-for="(item, index) in 4 - external.list.length"
            :key="index + Math.floor(Math.random() * 100000) + 'c'"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import moment from 'moment'
export default {
  name: 'MyRequiredDetailsList',
  components: {
    // Task
  },
  props: {
    dataInfo: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      examListData: [], //考试列表
      triangularPosition: 132, // 考试列表三角形位置
      errorImg: 'this.src="' + require('@/assets/images/required_bg.png') + '"'
    }
  },
  created() {},
  methods: {
    // 考试列表切换
    handleShowExam(item, index) {
      this.$set(this.dataInfo[0].list[index], 'isShow', !this.dataInfo[0].list[index].isShow)
      this.$set(this.dataInfo[0].list[index], 'showExam', !this.dataInfo[0].list[index].showExam)
      // this.triangularPosition = 132 + internal_i * 294
      // //只展示当前点击的卡片
      // let currentTab = this.dataInfo[external_i]

      // currentTab.list.forEach(o=>{
      //   o.showExam = o.showExam?o.showExam : false
      //   if(o.id===id){
      //     o.showExam = !o.showExam
      //   }
      // })
      // this.$set(this.dataInfo,external_i,currentTab)
      // for (let i = 0; i < this.dataInfo.length; i++) {
      //   for (let v = 0; v < this.dataInfo[i].list.length; v++) {
      //     if (v == internal_i && i == external_i) {
      //       this.dataInfo[i].list[v].isShow = !this.dataInfo[i].list[v].isShow
      //     } else {
      //       this.dataInfo[i].list[v].isShow = false
      //     }
      //   }
      // }
      // 处理是否可点击进去考试
      if (item.examList.length > 0) {
        let nowTem = new Date().getTime()
        item.examList.forEach((i) => {
          i.isDisabled = true
          if (
            i.status != '1' &&
            i.status != '4' &&
            !(i.status == '3' && i.isPass == '2') &&
            nowTem > new Date(i.examBeginTime).getTime() &&
            nowTem < new Date(i.examEndTime).getTime()
          ) {
            // !未开考 && !缺考 && !(已考试&&待发布考试结果) && （当前时间 > 开始时间） && （当前时间 < 结束时间）
            i.isDisabled = false //可点击
          }
        })
      }
      this.examListData = item.examList
    },
    isStatus(item) {
      if (item.status == 1) {
        this.$message({
          message: '课程暂未开始，无法进行学习，请耐心等待！',
          type: 'warning'
        })
        return true
      } else if (item.status == 3) {
        this.$message({
          message: '本期课程已结束，不支持查看！',
          type: 'warning'
        })
        return true
      }
      return false
    },
    // 去学习
    goLearn(e) {
      if (this.isStatus(e)) return
      this.$router.push({
        path: '/course/learn',
        query: { courseId: e.id, studyPlanId: JSON.parse(this.$route.query.item).id }
      })
      // 阻止冒泡
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    },

    // 去课程详情
    goCourseDetails(item) {
      if (this.isStatus(item)) return
      this.$router.push({
        path: '/course/detail',
        query: { id: item.id, studyPlanId: JSON.parse(this.$route.query.item).id }
      })
    },
    // 考试列表--进去考试
    goExam(item) {
      // console.log('goExam', item)
      /**
       * lateBanExam 是否限制迟到 true 是、 false否
       * lateBanExamValue 允许迟到多少分钟
       * **/
      let promptMessage = '本考试设置了迟到限制，你已迟到不得进入参加考试！'
      let lateMinutes = 0
      if (item.lateBanExamValue) {
        lateMinutes = Math.ceil(
          (new Date().getTime() - new Date(new Date(item.examBeginTime)).getTime()) / 1000 / 60
        )
        if (lateMinutes > item.lateBanExamValue) {
          promptMessage = `本考试设置了迟到限制，你已迟到${lateMinutes}分钟不得进入参加考试！`
        }
      }

      if (item.lateBanExam && item.lateBanExamValue && lateMinutes > item.lateBanExamValue) {
        // 判断是否设置迟到限制
        this.$confirm(promptMessage, '提示', {
          confirmButtonText: '我知道了',
          type: 'warning',
          showCancelButton: false
        })
      } else if (item.joinNum && item.examTimes >= item.joinNumValue) {
        // 判断是否超出考试次数
        promptMessage = `本考试限制${item.joinNumValue}次机会考试，您的考试次数已用完！`
        this.$confirm(promptMessage, '提示', {
          confirmButtonText: '我知道了',
          type: 'warning',
          showCancelButton: false
        })
      } else {
        // if (item.examTimes == 0 || item.isPass == 1) {
        //   promptMessage = '您确定现在参加考试吗？'
        // }
        if (item.isPass == 3) {
          promptMessage = '你已通过考试，重复考试将取成绩最好一次为最终结果。您确定现在参加考试吗？'
        } else {
          promptMessage = '您确定现在参加考试吗？'
        }
        this.$confirm(promptMessage, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push({
              path: '/exam/paper',
              query: { examId: item.examId, batchId: item.batchId }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '考试暂时不开始！'
            })
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$timeHead: rgba(139, 155, 168, 0.65);

.myRequiredDetailsList {
  padding-top: 24px;
  p {
    margin: 0;
  }
  // background: $timeHead;
  .base_status {
    display: inline-block;
    border-radius: 4px;
    height: 20px;
    width: 52px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
  }
  .status_1 {
    color: #f5c200;
    background-color: #fffee6;
  }
  .status_2 {
    background: #fff6f0;
    color: #f5623b;
  }
  .status_3 {
    background: #f3fced;
    color: #50bd35;
  }
  .status_4 {
    background: #fff6f0;
    color: #f5623b;
  }
  .status_5 {
    color: rgba(0, 11, 21, 0.45);
    background-color: #f5f5f6;
  }
  .status_6 {
    color: #2875d4;
    background-color: #f0f9ff;
  }
  .finger {
    cursor: pointer;
  }
  .Level_1_cycle {
    width: 100%;
    background-color: #f7f8f8;
    padding-bottom: 225px;
    padding-left: 5px;
    width: 100%;
    height: 100%;
    .Level_2_cycle {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      .course {
        background-color: #fff;
        width: 280px;
        height: 314px;
        border-radius: 4px;
        box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.08);
        flex-shrink: 0;
        margin-right: 18px;
        margin-bottom: 20px;
        transition: all 0.3s;
        position: relative;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 12px 0 rgba(0, 63, 161, 0.12);
        }

        .top {
          position: relative;
          height: 172px;
          background: #7498fe;
          border-radius: 4px 4px 0 0;
          .course_img {
            height: 100%;
            width: 100%;
            border-radius: 4px 4px 0 0;
          }
          .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.45);
            border-radius: 4px;
            color: #ffffff;
            // 控制显示遮罩
            visibility: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            .hoverButton {
              height: 32px;
              width: 84px;
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid #ffffff;
              border-radius: 4px;
              text-align: center;
              line-height: 32px;
            }
          }
        }
        // 鼠标移上去事件
        .top:hover .mask {
          visibility: visible;
        }
        .bottom {
          height: 126px;
          .course_info {
            height: 100px;
            box-sizing: border-box;
            padding: 10px 16px;
            .course_info_ul {
              display: flex;
              height: 100%;
              flex-direction: column;
              justify-content: space-between;
              .course_title {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                font-size: 14px;
                color: rgba(0, 11, 21, 0.85);
                line-height: 22px;
                font-weight: 600;
              }
              .other {
                opacity: 0.45;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: rgba(0, 11, 21, 0.85);
                line-height: 18px;
                span {
                  margin-right: 17px;
                }
              }
              .progress {
                display: flex;
                .progress_bar {
                  flex: 1;
                  display: flex;
                  align-items: center;
                }
                .progress_num {
                  width: 22px;
                  font-size: 12px;
                  color: rgba(0, 11, 21, 0.45);
                  letter-spacing: 0;
                  line-height: 18px;
                  text-align: right;
                }
                .outer {
                  height: 6px;
                  width: 100%;
                  background: rgba(0, 11, 21, 0.04);
                  border-radius: 2.5px;
                  .inside {
                    height: 100%;
                    width: 0%;
                    background: #2875d4;
                    border-radius: 3px;
                  }
                }
              }
            }
          }
          .course_exam {
            cursor: pointer;
            height: 38px;
            color: rgba(0, 11, 21, 0.65);
            border-top: 1px solid rgba(0, 11, 21, 0.08);
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 16px;
            .exam_num {
              opacity: 0.85;
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: rgba(0, 11, 21, 0.85);
              line-height: 18px;
              margin-right: 5px;
            }
            .label {
              opacity: 0.45;
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: rgba(0, 11, 21, 0.85);
              line-height: 18px;
            }
          }
        }
        .course_status {
          position: absolute;
          top: 8px;
          right: 8px;
        }
      }
      & > div:nth-of-type(4n) {
        margin: 0;
      }
    }
    .exam_list {
      width: 280px;
      max-height: 215px;
      overflow-y: auto;
      position: absolute;
      box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.08);
      top: 318px;
      left: 0px;
      background: #ffffff;
      border-radius: 4px;
      z-index: 1;
      &::-webkit-scrollbar {
        display: none;
      }
      .exam_list_li:last-child {
        border-bottom: 0;
      }
      .exam_info {
        height: 50px;
        display: flex;
        align-items: center;
        padding: 0 32px 0 24px;
        border-bottom: 1px solid #ebeced;
        .exam_name {
          width: 200px;
          display: flex;
          .exam_title {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .exam_status {
            margin-left: 5px;
          }
        }
        .text_button {
          color: rgba(1, 170, 252, 1);
          /deep/ .el-button {
            padding: 0;
            display: inline;
            line-height: 19px;
          }
        }
      }
      .arrows {
        width: 0;
        height: 0;
        border: 10px solid;
        border-color: transparent transparent #ffffff;
        position: absolute;
        top: -20px;
        left: 132px;
      }
    }
  }
}
</style>
