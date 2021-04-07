<template>
  <div class="myRequiredDetailsList">
    <section v-if="dataInfo">
      <!-- 一级循环 -->
      <div class="Level_1_cycle" v-for="(external,external_i) in dataInfo" :key="external_i + Math.floor(Math.random() * 100000) + 'a'">
        <div class="Level_2_cycle">
          <div class="course" v-for="(item,internal_i) in external.list" :key="internal_i + Math.floor(Math.random() * 100000) + 'b'">
            <!-- 图片 -->
            <div class="top finger" @click="goCourseDetails(item.id)">
              <img :src="item.coverUrl" :alt="item.coverName" class="course_img">
              <!-- <div class="mask" v-show="showExam"> -->
              <div class="mask">
                <div class="hoverButton finger"  v-show="item.status == 2" @click="goLearn(item)">
                  {{item.totalPrecent? '继续学习': '立即学习'}}
                </div>
              </div>
            </div>
            <!-- 课程信息 -->
            <div class="bottom">
              <!-- 基本信息 -->
              <div class="course_info">
                <ul class="course_info_ul">
                  <li class="course_title finger" @click="goCourseDetails(item.id)">{{item.name? item.name: '--'}}</li>
                  <li class="other">
                    <span class="lecturer">{{item.teacherName? item.teacherName: '--'}}</span>
                    <span class="i">|</span>
                    <span class="course_date">{{item.startDate? item.startDate: '--'}} - {{item.entDate? item.entDate: '--'}}</span>
                  </li>
                  <!-- 进度条 -->
                  <li class="progress">
                    <div class="progress_bar">
                      <div class=" outer">
                        <div class="inside" :style="'width:'+item.totalPrecent+'%'"></div>
                      </div>
                    </div>
                    <div class="progress_num">{{item.totalPrecent? item.totalPrecent + '%': '0%'}}</div>
                  </li>
                </ul>
              </div>
              <!-- 考试信息 -->
              <div class="course_exam" @click="handleShowExam(item, item.id, external_i, internal_i)">
                <div>关联考试：</div>
                <div class="exam_num">{{item.examList.length}}个</div>
                <i v-show="item.isShow && item.examList.length" class="el-icon-arrow-down"></i>
                <i v-show="!item.isShow && item.examList.length" class="el-icon-arrow-up"></i>
              </div>
            </div>
            <!-- 状态 -->
            <div class="course_status">
              <span v-if="item.status == 1" class="base_status status_1">未开始</span>
              <span v-if="item.status == 2" class="base_status status_2">进行中</span>
              <span v-if="item.status == 3" class="base_status status_3">已结束</span>
            </div>
          </div>
          <div v-for="(item,index) in (4 - external.list.length)" :key="index + Math.floor(Math.random() * 100000) + 'c'"></div>
        </div>
        <!-- 考试列表 -->
        <div class="exam_list" v-show="external.showExam">
          <!-- 列表内容 -->
          <ul class="exam_list_ul">
            <li class="exam_list_li" v-for="(item,index) in examListData" :key="index + Math.floor(Math.random() * 100000) + 'd'">
              <ul class="exam_info">
                <li class="exam_name">
                  <span class="exam_info_c2 exam_title">{{item.examName}}</span>
                  <span v-if="item.status == '1'" class="base_status status_1 exam_status">未开始</span>
                  <span v-if="item.status == '2' || (item.isPass == 1 && item.status == '3')" class="base_status status_4 exam_status">未通过</span>
                  <span v-if="item.status == '3' && item.isPass == 3" class="base_status status_3 exam_status">已通过</span>
                  <span v-if="item.status == '4'" class="base_status status_5 exam_status">缺考</span>
                </li>
                <li class="exam_date_time"><span class="exam_info_c1">考试时间：</span><span class="exam_info_c2">{{item.examBeginTime}}~{{item.examEndTime}}</span></li>
                <li class="time_long"><span class="exam_info_c1">考试时长：</span><span class="exam_info_c2">{{item.reckonTimeValue? item.reckonTimeValue + '分钟': '不限时'}}</span></li>
                <li class="achievement"><span class="exam_info_c1">成绩：</span><span class="exam_info_c2">{{item.score?item.score:'--'}}</span></li>
                <!-- <li class="text_button" @click="goExam(item)">进入考试</li> disabled-->
                <li class="text_button"><el-button type="text" :disabled="item.isDisabled"  @click="goExam(item)">进入考试</el-button></li>
              </ul>
            </li>
          </ul>
          <!-- 三角形 -->
          <div class="arrows" :style="'left:'+triangularPosition+'px'"></div>
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
      temId: null,
      examListData: [], //考试列表
      triangularPosition: 132 // 考试列表三角形位置
    }
  },
  created() {
  },
  methods: {
    // 考试列表切换
    handleShowExam(item, id, external_i, internal_i) {

      // 计算考试列表三角形位置
      this.triangularPosition = 132 + (internal_i*273)

      for (let i = 0; i < this.dataInfo.length; i++) {
        // 处理考试列表展示
        if ((i == external_i && id == this.temId) || (i == external_i && this.temId == null)) {
          this.dataInfo[i].showExam = !this.dataInfo[i].showExam
        } else if (i == external_i) {
          this.dataInfo[i].showExam = true
        } else {
           this.dataInfo[i].showExam = false
        }
        if (item.examList.length == 0) {
          this.dataInfo[i].showExam = false
        }
        // debugger
        // 处理考试列表图标方向
        for(let v = 0; v < this.dataInfo[i].list.length; v++) {
          if (v == internal_i && i == external_i) {
            this.dataInfo[i].list[v].isShow = !this.dataInfo[i].list[v].isShow
          } else {
            this.dataInfo[i].list[v].isShow = false
          }
        }
      }
      this.temId = id
      // 处理是否可点击进去考试
      if (item.examList.length > 0) {
        item.examList.forEach(i => {
          i.isDisabled = true
          if (i.status != '1' && i.status != '4' && !(i.status == '3' && i.isPass == '2')) {
            // !未开考 && !缺考 && !(已考试&&待发布考试结果)
            i.isDisabled = false //可点击
          }
        });
      }
      this.examListData = item.examList
    },
    // 去学习
    goLearn(e) {
      this.$router.push({ path: '/course/learn', query: { courseId: e.id } })
      // 阻止冒泡
      window.event? window.event.cancelBubble = true : e.stopPropagation();
    },
    // 去课程详情
    goCourseDetails(id) {
      this.$router.push({ path: '/course/detail', query: { id: id } })
    },
    // 考试列表--进去考试
    goExam(item) {
      // console.log('goExam', item)
      let promptMessage = '本考试设置了迟到限制，你已迟到不得进入参加考试！'
      let lateMinutes = 0
      if (item.lateBanExamValue){
        lateMinutes = Math.ceil((new Date().getTime() - new Date(new Date(item.examBeginTime)).getTime()) /1000/60)
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
          this.$router.push({ path: '/exam/paper', query: { examId: item.examId, batchId: item.batchId} })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '考试暂时不开始！'
          })
        })
      }
    },
    
  }
}
</script>

<style lang="scss" scoped>
$timeHead: rgba(139, 155, 168, 0.65);

.myRequiredDetailsList{
  margin-top: 24px;
  p{
    margin: 0;
  }
  // background: $timeHead;
  .base_status{
    display: inline-block;
    border-radius: 4px;
    height: 20px;
    width: 52px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
  }
  .status_1{
    background: #E7FFEE;
    color: #00B061;
  }
  .status_2{
    background: #FFFCE6;
    color: #FCBA00;
  }
  .status_3{
    background: #E7FBFF;
    color: #01AAFC;
  }
  .status_4{
    background: #FFF4F0;
    color: #D92919;
  }
  .status_5{
    background: #F5F5F6;
    color: rgba(0,11,21,0.45);
  }
  .finger{
    cursor:pointer;
  }
  .Level_1_cycle{
    margin-bottom: 24px;
    .Level_2_cycle>div{
      width: 273px;
      margin: 0 10px;
    }
    .Level_2_cycle{
      display: flex;
      justify-content: space-between;
      .course{
        height: 298px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
        // background: $timeHead;
        position: relative;
        .top{
          position: relative;
          height: 172px;
          background:#7498fe;
          border-radius: 4px 4px 0 0;
          .course_img{
            height: 100%;
            width: 100%;
            border-radius: 4px 4px 0 0;
          }
          .mask{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.45);
            border-radius: 4px;
            color: #ffffff;
            // 控制显示遮罩
            opacity: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            .hoverButton{
              height: 32px;
              width: 84px;
              background: rgba(255,255,255,0.20);
              border: 1px solid #FFFFFF;
              border-radius: 4px;
              text-align: center;
              line-height: 32px;
            }
          }
        }
        // 鼠标移上去事件
        .top:hover .mask{
          opacity: 1;
        }
        .bottom{
          height: 126px;
          .course_info{
            height: 87px;
            box-sizing:border-box;
            padding: 10px 16px;
            .course_info_ul{
              display: flex;
              height: 100%;
              flex-direction: column;
              justify-content: space-between;
              .course_title{
                display: -webkit-box;
                -webkit-box-orient: vertical; 
                -webkit-line-clamp: 1; 
                overflow: hidden;
                color: #000B15;
                // font-weight: bold;
              }
              .other{
                opacity: 0.65;
                font-size: 12px;
                color: #000B15;
                .i{
                  margin: 0 8px;
                  position: relative;
                  top: -1px;
                }
              }
              .progress{
                display: flex;
                .progress_bar{
                  flex: 1;
                  display: flex;
							    align-items: center;
                }
                .progress_num{
                  width: 35px;
                  margin-left: 16px;
                  color: rgba(1,170,252,1);
                }
                .outer{
                  height: 6px;
                  width: 100%;
                  background: rgba(1,170,252,0.11);
                  border-radius: 3px;
                  .inside{
                    height: 100%;
                    width: 0%;
                    background: #01AAFC;
                    border-radius: 3px;
                  }
                }
              }
              
            }
          }
          .course_exam{
            cursor:pointer;
            height: 38px;
            color: rgba(0,11,21,0.65);
            border-top: 1px solid rgba(0,11,21,0.08);
            display: flex;
            align-items: center;
            box-sizing:border-box;
            padding: 0 16px;
            .exam_num{
              color: rgba(0,11,21,1);
              margin-right: 5px;
            }
          }
        }
        .course_status{
          position: absolute;
          top: 8px;
          right: 8px;
          // span{
          //   display: inline-block;
          //   border-radius: 4px;
          //   height: 20px;
          //   width: 52px;
          //   font-size: 12px;
          //   text-align: center;
          //   line-height: 20px;
          // }
        }
      }
    }
    .exam_list{
      position: relative;
      margin: 20px 12px;
      // width: 100%;
      background: #FFFFFF;
      box-shadow: 0px 4px 12px 5px rgba(0,63,161,0.1);
      border-radius: 4px;
      .exam_list_ul{
        padding: 0 24px;
      }
      .exam_list_li{
        padding: 13px 0;
        border-bottom: 1px solid #EBECED;
      }
      .exam_list_li:last-child{
        border-bottom: 0;
      }
      .exam_info{
        display: flex;
        justify-content: space-between;
        
        .exam_info_c1{
          color: rgba(0,11,21,0.65);
        }
        .exam_info_c2{
          color: rgba(0,11,21,0.85);
        }
        .exam_name{
          width: 200px;
          display: flex;
          .exam_title{
            flex: 1;
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .exam_status{
            margin-left: 5px;
          }
        }
        .exam_date_time{
          width: 350px;
        }
        .time_long{
          width: 150px;
        }
        .achievement{
          width: 100px;
        }
        .text_button{
          // width: 100px;
          color: rgba(1,170,252,1);
          // cursor:pointer;
          /deep/ .el-button{
            padding: 0;
            display: inline;
            line-height: 19px;
          }
        }
      }
      .arrows{
        width: 0;
        height: 0;
        border: 10px solid;
        // border-color: transparent transparent #FFFFFF;
        border-color: transparent transparent #FFFFFF;
        // box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
        position: absolute;
        top: -20px;
        left: 132px;
      }
    }
  }
}
</style>
