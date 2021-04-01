<template>
  <div class="myRequiredDetailsList">
    <section class="">
      <!-- 一级循环 -->
      <div class="Level_1_cycle">
        <div class="Level_2_cycle">
          <div class="course">
            <!-- 图片 -->
            <div class="top finger" @click="goCourseDetails">
              <!-- <img src="./test.png" alt="" class="course_img"> -->
              <!-- <div class="mask" v-show="showExam"> -->
              <div class="mask">
                <div class="hoverButton finger"  v-show="showExam" @click="goLearn">
                  立即学习
                </div>
              </div>
            </div>
            <!-- 课程信息 -->
            <div class="bottom">
              <!-- 基本信息 -->
              <div class="course_info">
                <ul class="course_info_ul">
                  <li class="course_title finger" @click="goCourseDetails">这是一个大标题中的小标题哈哈哈哈或或或</li>
                  <li class="other"><span class="lecturer">赵老师</span><span class="i">|</span><span class="course_date">2021/02/04 - 2021/02/08</span></li>
                  <!-- 进度条 -->
                  <li class="progress">
                    <div class="progress_bar">
                      <div class=" outer">
                        <!-- <div class="inside" :style="'width:'+item.totalPrecent+'%'"></div> -->
                        <div class="inside"></div>
                      </div>
                    </div>
                    <div class="progress_num">100%</div>
                  </li>
                </ul>
              </div>
              <!-- 考试信息 -->
              <div class="course_exam" @click="handleShowExam">
                <div>关联考试：</div>
                <div class="exam_num">3个</div>
                <i class="el-icon-arrow-down"></i>
                <!-- <i class="el-icon-arrow-up"></i> -->
              </div>
            </div>
            <!-- 状态 -->
            <div class="course_status">
              <!-- <span class="base_status status_1">未开始</span> -->
              <!-- <span class="base_status status_2">进行中</span> -->
              <span class="base_status status_3">已结束</span>
            </div>
          </div>
          <div class="course">
            <!-- 图片 -->
            <div class="top finger" @click="goCourseDetails">
              <!-- <img src="./test.png" alt="" class="course_img"> -->
              <!-- <div class="mask" v-show="showExam"> -->
              <div class="mask">
                <div class="hoverButton finger"  v-show="showExam" @click="goLearn">
                  立即学习
                </div>
              </div>
            </div>
            <!-- 课程信息 -->
            <div class="bottom">
              <!-- 基本信息 -->
              <div class="course_info">
                <ul class="course_info_ul">
                  <li class="course_title finger" @click="goCourseDetails">这是一个大标题中的小标题哈哈哈哈或或或</li>
                  <li class="other"><span class="lecturer">赵老师</span><span class="i">|</span><span class="course_date">2021/02/04 - 2021/02/08</span></li>
                  <!-- 进度条 -->
                  <li class="progress">
                    <div class="progress_bar">
                      <div class=" outer">
                        <!-- <div class="inside" :style="'width:'+item.totalPrecent+'%'"></div> -->
                        <div class="inside"></div>
                      </div>
                    </div>
                    <div class="progress_num">100%</div>
                  </li>
                </ul>
              </div>
              <!-- 考试信息 -->
              <div class="course_exam" @click="handleShowExam">
                <div>关联考试：</div>
                <div class="exam_num">3个</div>
                <i class="el-icon-arrow-down"></i>
                <!-- <i class="el-icon-arrow-up"></i> -->
              </div>
            </div>
            <!-- 状态 -->
            <div class="course_status">
              <!-- <span class="base_status status_1">未开始</span> -->
              <!-- <span class="base_status status_2">进行中</span> -->
              <span class="base_status status_3">已结束</span>
            </div>
          </div>
          <div class="course">
            <!-- 图片 -->
            <div class="top finger" @click="goCourseDetails">
              <!-- <img src="./test.png" alt="" class="course_img"> -->
              <!-- <div class="mask" v-show="showExam"> -->
              <div class="mask">
                <div class="hoverButton finger"  v-show="showExam" @click="goLearn">
                  立即学习
                </div>
              </div>
            </div>
            <!-- 课程信息 -->
            <div class="bottom">
              <!-- 基本信息 -->
              <div class="course_info">
                <ul class="course_info_ul">
                  <li class="course_title finger" @click="goCourseDetails">这是一个大标题中的小标题哈哈哈哈或或或</li>
                  <li class="other"><span class="lecturer">赵老师</span><span class="i">|</span><span class="course_date">2021/02/04 - 2021/02/08</span></li>
                  <!-- 进度条 -->
                  <li class="progress">
                    <div class="progress_bar">
                      <div class=" outer">
                        <!-- <div class="inside" :style="'width:'+item.totalPrecent+'%'"></div> -->
                        <div class="inside"></div>
                      </div>
                    </div>
                    <div class="progress_num">100%</div>
                  </li>
                </ul>
              </div>
              <!-- 考试信息 -->
              <div class="course_exam" @click="handleShowExam">
                <div>关联考试：</div>
                <div class="exam_num">3个</div>
                <i class="el-icon-arrow-down"></i>
                <!-- <i class="el-icon-arrow-up"></i> -->
              </div>
            </div>
            <!-- 状态 -->
            <div class="course_status">
              <!-- <span class="base_status status_1">未开始</span> -->
              <!-- <span class="base_status status_2">进行中</span> -->
              <span class="base_status status_3">已结束</span>
            </div>
          </div>
          <div class="course">
            <!-- 图片 -->
            <div class="top finger" @click="goCourseDetails">
              <!-- <img src="./test.png" alt="" class="course_img"> -->
              <!-- <div class="mask" v-show="showExam"> -->
              <div class="mask">
                <div class="hoverButton finger"  v-show="showExam" @click="goLearn">
                  立即学习
                </div>
              </div>
            </div>
            <!-- 课程信息 -->
            <div class="bottom">
              <!-- 基本信息 -->
              <div class="course_info">
                <ul class="course_info_ul">
                  <li class="course_title finger" @click="goCourseDetails">这是一个大标题中的小标题哈哈哈哈或或或</li>
                  <li class="other"><span class="lecturer">赵老师</span><span class="i">|</span><span class="course_date">2021/02/04 - 2021/02/08</span></li>
                  <!-- 进度条 -->
                  <li class="progress">
                    <div class="progress_bar">
                      <div class=" outer">
                        <!-- <div class="inside" :style="'width:'+item.totalPrecent+'%'"></div> -->
                        <div class="inside"></div>
                      </div>
                    </div>
                    <div class="progress_num">100%</div>
                  </li>
                </ul>
              </div>
              <!-- 考试信息 -->
              <div class="course_exam" @click="handleShowExam">
                <div>关联考试：</div>
                <div class="exam_num">3个</div>
                <i class="el-icon-arrow-down"></i>
                <!-- <i class="el-icon-arrow-up"></i> -->
              </div>
            </div>
            <!-- 状态 -->
            <div class="course_status">
              <!-- <span class="base_status status_1">未开始</span> -->
              <!-- <span class="base_status status_2">进行中</span> -->
              <span class="base_status status_3">已结束</span>
            </div>
          </div>
        </div>
        <!-- 考试列表 -->
        <div class="exam_list" v-show="showExam">
          <!-- 列表内容 -->
          <ul class="exam_list_ul">
            <li class="exam_list_li">
              <ul class="exam_info">
                <li class="exam_name"><span class="exam_info_c2 exam_title">企业文化考试企业文化考试企业文化考试</span><span class="base_status status_1 exam_status">未开始</span></li>
                <li class="exam_date_time"><span class="exam_info_c1">考试时间：</span><span class="exam_info_c2">2021-02-03 14:25:56~2021-02-03 14:25:56</span></li>
                <li class="time_long"><span class="exam_info_c1">考试时长：</span><span class="exam_info_c2">60分钟</span></li>
                <li class="achievement"><span class="exam_info_c1">成绩：</span><span class="exam_info_c2">--</span></li>
                <li class="text_button" @click="goExam">进入考试</li>
              </ul>
            </li>
            <li class="exam_list_li">
              <ul class="exam_info">
                <li class="exam_name"><span class="exam_info_c2 exam_title">企业文化考试</span><span class="base_status status_4 exam_status">未通过</span></li>
                <li class="exam_date_time"><span class="exam_info_c1">考试时间：</span><span class="exam_info_c2">2021-02-03 14:25:56~2021-02-03 14:25:56</span></li>
                <li class="time_long"><span class="exam_info_c1">考试时长：</span><span class="exam_info_c2">60分钟</span></li>
                <li class="achievement"><span class="exam_info_c1">成绩：</span><span class="exam_info_c2">--</span></li>
                <li class="text_button" @click="goExam">进入考试</li>
              </ul>
            </li>
            <li class="exam_list_li">
              <ul class="exam_info">
                <li class="exam_name"><span class="exam_info_c2 exam_title">企业文化考试</span><span class="base_status status_5 exam_status">缺考</span></li>
                <li class="exam_date_time"><span class="exam_info_c1">考试时间：</span><span class="exam_info_c2">2021-02-03 14:25:56~2021-02-03 14:25:56</span></li>
                <li class="time_long"><span class="exam_info_c1">考试时长：</span><span class="exam_info_c2">60分钟</span></li>
                <li class="achievement"><span class="exam_info_c1">成绩：</span><span class="exam_info_c2">--</span></li>
                <li class="text_button" @click="goExam">进入考试</li>
              </ul>
            </li>
          </ul>
          <!-- 三角形 -->
          <div class="arrows"></div>
        </div>
      </div>
      <!-- <div class="Level_1_cycle">
        <div class="Level_2_cycle">
          <div class="course">1</div>
          <div class="course">1</div>
          <div class="course">1</div>
          <div class="course">1</div>
        </div>
        <div class="exam_list">
          考试列表
        </div>
      </div> -->
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
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showExam: false
    }
  },
  created() {
    // this.handleDefault()
  },
  methods: {
    // 考试列表切换
    handleShowExam() {
      console.log('handleShowExam')
      this.showExam = !this.showExam
    },
    // 去学习
    goLearn(e) {
      console.log('goLearn')
      // 阻止冒泡
      e.stopPropagation();
    },
    // 去课程详情
    goCourseDetails() {
      console.log('goCourseDetails')
    },
    // 考试列表--进去考试
    goExam() {
      console.log('goExam')
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
                    width: 50%;
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
      box-shadow: 0 9px 12px 0 rgba(0,63,161,0.12);
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
          // width: 100px;
        }
        .time_long{
          // width: 100px;
        }
        .achievement{
          // width: 100px;
        }
        .text_button{
          // width: 100px;
          color: rgba(1,170,252,1);
          cursor:pointer;
        }
      }
      .arrows{
        width: 0;
        height: 0;
        border: 10px solid;
        // border-color: transparent transparent #FFFFFF;
        border-color: transparent transparent #f7f3f3;
        // box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
        position: absolute;
        top: -20px;
        left: 100px;
      }
    }
  }
}
</style>
