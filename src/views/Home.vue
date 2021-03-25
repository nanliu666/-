<template>
  <!-- 首页 -->
  <div class="home">
    <div class="homeMenu">
      <div class="homeMenu2">
        <the-header />
      </div>
    </div>
    <div class="banner">
      <el-carousel :interval="5000" height="536px" arrow="always">
        <el-carousel-item v-for="item in banner" :key="item.id">
          <div class="b_item" :style="item.css"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="homeMain">
      <div class="homeLeft">
        <h3 class="LMTitle">
          <span class="span1">我的任务</span>
          <span class="span2">待完成任务{{ myTaskInfo.nub }}项</span>
        </h3>
        <!-- 我的任务 -->
        <div style="clear: both; ">
          <home-my-task :my-task-info="myTaskInfo" />
        </div>
        <h3 class="LMTitle">
          <span class="span1">最新直播</span>
          <router-link :to="{ path: '/live/list' }">
            更多
          </router-link>
        </h3>
        <div class="LModule">
          <div class="LModule2">
            <div v-for="item in myLiveData" :key="item.liveId" class="homeCourse">
              <router-link :to="{ path: '/live/Detail', query: { id: item.liveId } }">
                <div class="homeCourseImg">
                  <img
                    :src="item.coverImageUrl ? item.coverImageUrl : '/img/autoL.png'"
                    width="285"
                    height="168"
                    alt=""
                  />
                </div>
                <div class="homeCourseText">
                  <span class="homeCourseTitle">{{ item.channelName }}</span>
                  <span class="homeCourseTime">{{ item.startTime }}</span>
                  <div class="livePerInfo">
                    <img
                      :src="item.avatarUrl ? item.avatarUrl : '/img/userIconBig.png'"
                      width="24"
                      height="24"
                      alt=""
                    />
                    <span>{{ item.lecturerName }}</span>
                  </div>
                </div>
              </router-link>
            </div>
            <!-- <div class="homeCourse">
              <router-link to="">
                <div class="homeCourseImg">
                  <img src="../assets/images/photo1.png" width="285" height="168" alt="" />
                </div>
                <div class="homeCourseText">
                  <span class="homeCourseTitle">信息业发展中的重要性信息考试必要</span>
                  <span class="homeCourseTime">今天 20:00</span>
                  <div class="livePerInfo">
                    <img src="/img/userIconBig.png" width="24" height="24" alt="" />
                    <span>陆小曼</span>
                  </div>
                </div>
              </router-link>
            </div>
            <div class="homeCourse">
              <router-link to="">
                <div class="homeCourseImg">
                  <img src="../assets/images/photo1.png" width="285" height="168" alt="" />
                </div>
                <div class="homeCourseText">
                  <span class="homeCourseTitle">信息安全在岗考试必要性在企业发展中的重要性信息安全在</span>
                  <span class="homeCourseTime">今天 20:00</span>
                  <div class="livePerInfo">
                    <img src="/img/userIconBig.png" width="24" height="24" alt="" />
                    <span>陆小曼</span>
                  </div>
                </div>
              </router-link>
            </div> -->
          </div>
        </div>
        <h3 class="LMTitle" style="padding-top:46px">
          <span class="span1">热门课程</span>
          <router-link :to="'/course/list'">
            更多
          </router-link>
        </h3>
        <div class="LModule">
          <div class="LModule2">
            <template v-for="(item, i) in hotCourseData">
              <div v-if="i > 0" :key="item.courseId" class="homeCourse">
                <router-link :to="'/course/detail?id=' + item.courseId">
                  <div class="homeCourseImg">
                    <img
                      :src="item.coverUrl ? item.coverUrl : '/img/autoL.png'"
                      width="285"
                      height="168"
                      alt=""
                    />
                  </div>
                  <div class="homeCourseText">
                    <span class="homeCourseTitle" to="">{{ item.courseName }}</span>
                    <div class="grade">
                      <el-rate
                        v-model="item.scope"
                        disabled
                        show-score
                        text-color="#72787E"
                        disabled-void-color="#ccc"
                        score-template="{value}"
                      ></el-rate>
                    </div>
                    <div class="livePerInfo">
                      <span class="iconimage_icon_user iconfont userIcon"></span>
                      <span>{{ item.people }}人学习</span>
                    </div>
                  </div>
                </router-link>
              </div>
              <div v-if="i == 0" :key="item.courseId" class="recommendCourse">
                <router-link :to="'/course/detail?id=' + item.courseId">
                  <img
                    :src="item.coverUrl ? item.coverUrl : '/img/autoB.png'"
                    width="590"
                    height="276"
                    alt=""
                    style="border-radius: 4px;"
                  />
                  <div class="recommendCourseTextP">
                    <div class="recommendCourseText">
                      <span class="recommendCourseTitle">{{ item.courseName }}</span>
                      <div class="recommendGrade">
                        <el-rate
                          v-model="item.scope"
                          disabled
                          show-score
                          text-color="#72787E"
                          score-template="{value}"
                        >
                        </el-rate>
                      </div>
                      <div class="learnNub">
                        <span class="iconimage_icon_user iconfont userIcon"></span>
                        <span>{{ item.people }}人学习</span>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
              <!-- 
              <div class="homeCourse">
                <router-link to="">
                  <div class="homeCourseImg">
                    <img src="../assets/images/photo1.png" width="285" height="168" alt="" />
                  </div>
                  <div class="homeCourseText">
                    <span class="homeCourseTitle" to=""
                      >信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性</span
                    >
                    <div class="grade">
                      <el-rate
                        v-model="value"
                        disabled
                        show-score
                        text-color="#72787E"
                        disabled-void-color="#ccc"
                        score-template="{value}"
                      >
                      </el-rate>
                    </div>
                    <div class="livePerInfo">
                      <span class="iconimage_icon_user iconfont userIcon"></span>
                      <span>6人学习</span>
                    </div>
                  </div>
                </router-link>
              </div> -->
            </template>
          </div>
        </div>
        <h3 class="LMTitle" style="padding-top:46px">
          <span class="span1">培训中心</span>
          <router-link to="/train/index">
            更多
          </router-link>
        </h3>
        <div class="LModule">
          <div class="LModule2">
            <div
              v-for="item in trainListData"
              :key="item.id"
              class="homeTrain"
              @click="toTrainDetaill(item)"
            >
              <h3 class="homeTrainTitle">
                {{ item.trainName }}
              </h3>
              <div class="homeTrainText">
                <div class="homeTrainTextItem">
                  <span class="iconimage_icon_address iconfont traingIcon"></span>
                  <span class="homeTrainTextItem2">{{ item.address }}</span>
                </div>
                <div class="homeTrainTextItem">
                  <span class="iconimage_icon_time iconfont traingIcon"></span>
                  <span class="homeTrainTextItem2">{{ item.startTime }}</span>
                </div>
                <div class="homeTrainTextItem">
                  <img
                    :src="item.avatarUrl ? item.avatarUrl : '/img/userIconBig.png'"
                    width="24"
                    height="24"
                    alt=""
                  />
                  <span class="homeTrainTextItem2">{{ item.lecturerName }}</span>
                  <span
                    :class="[item.status ? trainStatus[item.status].class : '', homeTraining]"
                  >{{ trainStatus[item.status].text }}</span>
                </div>
              </div>
            </div>
            <!-- 
            <div class="homeTrain">
              <router-link to="">
                <h3 class="homeTrainTitle">
                  职场礼仪职场礼仪职场礼仪职场礼仪职场礼仪职场礼仪
                </h3>
                <div class="homeTrainText">
                  <div class="homeTrainTextItem">
                    <span class="iconimage_icon_address iconfont traingIcon"></span>
                    <span class="homeTrainTextItem2">环普产业园G1座</span>
                  </div>
                  <div class="homeTrainTextItem">
                    <span class="iconimage_icon_time iconfont traingIcon"></span>
                    <span class="homeTrainTextItem2">2020-09-12 14:30</span>
                  </div>
                  <div class="homeTrainTextItem">
                    <img src="../assets/images/welcome.png" width="24" height="24" alt="" />
                    <span class="homeTrainTextItem2">老周</span>
                    <span class="homeTraining future">进行中</span>
                  </div>
                </div>
              </router-link>
            </div> -->
          </div>
        </div>
        <h3 class="LMTitle" style="padding-top:46px">
          <span class="span1">新闻中心</span>
          <router-link to="/news/list">
            更多
          </router-link>
        </h3>
        <div class="LModule">
          <div class="LModule2">
            <div v-for="item in newsListData" :key="item.id" class="homeCourse">
              <router-link :to="`/news/Details?id=${item.id}&hits=${item.hits}&isHot=1`">
                <div class="homeCourseImg">
                  <img
                    :src="item.picUrl ? item.picUrl : '/img/autoL.png'"
                    width="285"
                    height="168"
                    alt=""
                  />
                </div>
                <div class="homeCourseText">
                  <span class="homeCourseTitle">{{ item.title }}</span>
                  <span class="homeCourseTime iconeyeopen-outlined iconfont">{{ item.hits }}</span>
                  <div class="livePerInfo">
                    <span>{{ item.createTime }}</span>
                  </div>
                </div>
              </router-link>
            </div>
            <!-- 
            <div class="homeCourse">
              <router-link to="">
                <div class="homeCourseImg">
                  <img src="../assets/images/photo1.png" width="285" height="168" alt="" />
                </div>
                <div class="homeCourseText">
                  <span class="homeCourseTitle"
                    >信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性信息安全在岗考试必要性在企业发展中的重要性</span
                  >
                  <span class="homeCourseTime iconeyeopen-outlined iconfont">11</span>
                  <div class="livePerInfo">
                    <span>2020-10-30</span>
                  </div>
                </div>
              </router-link>
            </div> -->
          </div>
        </div>
      </div>
      <div class="homeRight">
        <home-right />
      </div>
    </div>
  </div>
</template>

<script>
import TheHeader from '@/page/TheHeader'
import HomeMyTask from '@/views/home/homeMyTask'
import HomeRight from '@/views/home/homeRight'
import { queryCourseList } from '@/api/course'
import { homeQueryTrainList, homeNewsList, homeMyLiveList } from '@/api/home'

export default {
  name: 'Home',
  components: {
    TheHeader,
    HomeMyTask,
    HomeRight
  },
  data() {
    return {
      myTaskInfo: {
        nub: 0
      },
      value: 3.7,
      trainStatus: {
        1: {
          class: 'future',
          text: '未开始'
        },
        2: {
          class: 'ing',
          text: '进行中'
        }
      },
      homeTraining: 'homeTraining',
      hotCourseData: [], // 热门课程
      trainListData: [], // 培训中心
      newsListData: [], // 新闻
      myLiveData: [], // 我的直播
      banner: [
        {
          css: {
            backgroundImage: 'url(' + require('../assets/images/banner2.jpg') + ')',
            backgroundRepeat: 'no-repeat'
          },
          id: '11'
        },
        {
          css: {
            backgroundImage: 'url(' + require('../assets/images/banner3.jpg') + ')',
            backgroundRepeat: 'no-repeat'
          },
          id: '22'
        },
        {
          css: {
            backgroundImage: 'url(' + require('../assets/images/banner4.jpg') + ')',
            backgroundRepeat: 'no-repeat'
          },
          id: '33'
        }
      ]
    }
  },
  mounted() {
    this.getHotCourse()
    this.getTrainList()
    this.getNewsList()
    this.getHomeMyLive()
  },
  methods: {
    toTrainDetaill(item) {
      const { id: trainId, trainName: title, trainWay, userType } = item
      this.$router.push({
        name: 'trainDetail',
        params: {
          title,
          trainId,
          trainWay,
          userType
        }
      })
    },
    async getHomeMyLive() {
      // 我的直播
      let res = await homeMyLiveList({ pageSize: 3, pageNo: 1 })
      this.myLiveData = res.data
    },
    async getHotCourse() {
      // 热门课程
      let res = await queryCourseList({ pageSize: 5, pageNo: 1, type: 1 })
      this.hotCourseData = res.data
    },
    async getTrainList() {
      // 培训中心
      let res = await homeQueryTrainList({ pageSize: 3, pageNo: 1 })
      this.trainListData = res.records
    },
    async getNewsList() {
      // 获取新闻列表
      let res = await homeNewsList({ pageSize: 3, pageNo: 1 })
      this.newsListData = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  text-align: center;
  color: #000b15;
  font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  background: rgb(251, 250, 250);
}
.home a {
  font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
}
// .homeMenu {
//   position: absolute;
//   width: 100%;
// }
// .homeMenu2 {
//   position: relative;
//   z-index: 100;
// }
// /deep/ .homeMenu2 .header {
//   background: none;
// }
.banner {
  height: 536px;
}
/deep/ .banner .el-carousel__arrow {
  border-radius: 4px;
  width: 32px;
  height: 60px;
  background: rgba(0, 11, 21, 0.5);
}
/deep/ .banner .el-carousel__arrow i {
  font-size: 40px;
}
/deep/ .banner .el-icon-arrow-right:before {
  margin-left: -2px;
}
.banner .b_item {
  height: 536px;
  background-position: center 0;
}
.homeMain {
  margin: auto;
  display: flex;
  width: 1200px;
}
.homeLeft {
  width: 897px;
}
.LMTitle {
  float: left;
  padding: 66px 0 37px 0;
  clear: both;
  width: 100%;
  margin: 0;
}
.LMTitle .span1 {
  font-size: 30px;
  font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  color: #000b15;
  font-weight: normal;
  padding-right: 10px;
  float: left;
}
.LMTitle .span2 {
  font-size: 18px;
  font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  color: #000b15;
  font-weight: normal;
  opacity: 0.45;
  float: left;
  padding: 8px 0 0 8px;
}
.LMTitle a {
  font-size: 18px;
  font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  color: #000b15;
  font-weight: normal;
  opacity: 0.45;
  float: right;
  padding-top: 10px;
}

.LModule {
  width: 897px;
  overflow-x: hidden;
}
.LModule2 {
  width: 920px;
}
.homeCourse {
  float: left;
  width: 285px;
  height: 283px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  margin: 0 20px 20px 0;
  border-radius: 4px;
}
.homeCourse .homeCourseTitle {
  text-align: left;
  font-size: 14px;
  height: 55px;
  margin: 10px 0 10px 0;
  line-height: 180%;
  color: #000b15;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-weight: bold;
}

.homeCourseText {
  padding: 0 15px;
  overflow: hidden;
}
.homeCourse .homeCourseTime {
  float: left;
  font-size: 12px;
  color: #000b15;
  opacity: 0.65;
}
.homeCourse .homeCourseTime:before {
  padding-right: 5px;
}
.homeCourse .livePerInfo {
  float: right;
}
.homeCourse .grade {
  float: left;
  transform: scale(0.8);
  margin: 3px 0 0 -14px;
}
.homeCourse .livePerInfo img {
  border-radius: 50%;
  float: left;
}
.homeCourse .livePerInfo span {
  float: left;
  padding: 4px 0 0 4px;
  font-size: 12px;
  color: #000b15;
  opacity: 0.65;
}
.homeCourse .livePerInfo .userIcon {
  padding: 5px 0 0 0;
}

.recommendCourse {
  width: 590px;
  height: 276px;
  float: left;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  margin: 0 20px 20px 0;
  border-radius: 4px;
}
.recommendCourse .recommendCourseTextP {
  position: absolute;
}
.recommendCourse .recommendCourseText {
  border-radius: 0 0 4px 4px;
  position: relative;
  z-index: 10;
  bottom: 64px;
  left: 0;
  width: 590px;
  height: 64px;
  text-align: left;
  color: #fff;
  font-size: 14px;
  background: #000;
  opacity: 0.55;
  padding: 10px 15px;
  box-sizing: border-box;
}
.recommendCourse .recommendCourseTitle {
  display: block;
  font-size: 14px;
}
.recommendCourse .recommendGrade {
  float: left;
  transform: scale(0.8);
  margin: 10px 0 0 -14px;
}
.recommendCourse .learnNub {
  float: right;
}
.recommendCourse .userIcon {
  font-size: 12px;
  padding: 0 9px 0 0;
}

.homeTrain {
  cursor: pointer;
  width: 285px;
  height: 172px;
  text-align: left;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  margin: 0 20px 20px 0;
  border-radius: 4px;
  float: left;
}
.homeTrain .homeTrainTitle {
  width: 285px;
  height: 54px;
  font-size: 14px;
  font-weight: normal;
  line-height: 54px;
  padding: 0 15px;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: url('../assets/images/icon.png') no-repeat 0 -206px;
  color: #fff;
}
.homeTrain .homeTrainTextItem {
  color: #73797f;
  display: block;
  overflow: hidden;
  padding: 10px 15px 0 15px;
}
.homeTrain .homeTrainTextItem img {
  border-radius: 50%;
  float: left;
  margin: 0 5px 0 0;
}

.homeTrain .homeTraining {
  float: right;
  padding: 2px 6px;
  border-radius: 4px;
}
.homeTrain .ing {
  background: #e7fbff;
  color: #01aafc;
}
.homeTrain .future {
  background: #e7ffee;
  color: #00b061;
}
.homeTrain .traingIcon {
  font-size: 12px;
  float: left;
  margin: 1px 5px 0 0;
}
.homeTrain .homeTrainTextItem2 {
  float: left;
}

.homeRight {
  width: 285px;
  margin-left: 35px;
}
</style>
<style>
.home .banner .el-carousel__indicators--horizontal {
  bottom: 20px;
}
.home .banner .el-carousel__indicator--horizontal {
  padding: 12px 10px;
}
.home .banner .el-carousel__button {
  opacity: 0.6;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}
.home .banner .el-carousel__indicator.is-active button {
  background: #01aafc;
  opacity: 1;
}
</style>
