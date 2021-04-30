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
        <!-- 临时添加徐工挖掘机组织自定义banner,先通过组织id判断 -->
        <el-carousel-item v-for="item in banner" :key="item.bannerId">
          <a :href="item.linkUrl">
            <div
              class="b_item"
              :style="`background: url(${item.picUrl}) no-repeat; backgroundSize: cover`"
            ></div>
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="homeMain">
      <div class="homeLeft">
        <!-- 我的任务 -->
        <div v-for="item in diyConfig" :key="item.id">
          <component
            :is="diyBaseConfig[item.id] ? diyBaseConfig[item.id].coms : ''"
            v-if="diyBaseConfig[item.id]"
            :my-task-info="myTaskInfo"
            :my-live-data="myLiveData"
            :hot-course-data="hotCourseData"
            :train-list-data="trainListData"
            :news-list-data="newsListData"
          >
          </component>
        </div>
        <!-- <home-my-task ref="myTaskRef" :my-task-info="myTaskInfo" />        
        <home-live :my-live-data="myLiveData"></home-live>
        <home-hot-course :hot-course-data="hotCourseData"></home-hot-course>
        <home-train :train-list-data="trainListData"></home-train>
        <home-news :news-list-data="newsListData"></home-news> -->
        <!-- <h3 class="LMTitle" style="padding-top:46px">
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
                      <span style="font-size: 12px">{{ item.people }}人学习</span>
                    </div>
                  </div>
                </router-link>
              </div>
              <div v-if="i == 0" :key="item.courseId" class="recommendCourse">
                <router-link :to="'/course/detail?id=' + item.courseId">
                  <img
                    :src="item.coverUrl ? item.coverUrl : '/img/autoB.png'"
                    width="590"
                    height="305"
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
                        <span style="font-size: 12px">{{ item.people }}人学习</span>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>              
            </template>
          </div>
        </div> -->

        <!-- <h3 class="LMTitle" style="padding-top:46px">
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
                  <span class="hCWatchNumber iconeyeopen-outlined iconfont">{{ item.hits }}</span>
                  <div class="livePerInfo">
                    <span>{{ item.createTime }}</span>
                  </div>
                </div>
              </router-link>
            </div>           
          </div>
        </div> -->
      </div>
      <div class="homeRight">
        <home-right />
      </div>
    </div>
    <div class="foot">
      <div class="foot2">
        <span style="opacity: 0.35;">v2.1.0_20210410_Release &nbsp; &nbsp; &nbsp;</span>
        <span class="policeLogo"><img src="../../public/img/policeLogo.png" alt="" /></span>
        <span style="opacity: 0.35;"><a href="https://ythzxfw.miit.gov.cn" target="_blank">
          备案号：苏ICP备19010525号-2
        </a></span>
      </div>
    </div>
    <el-backtop />
  </div>
</template>

<script>
import TheHeader from '@/page/TheHeader'
import HomeMyTask from '@/views/home/homeMyTask'
import HomeRight from '@/views/home/homeRight'
import HomeLive from '@/views/home/homeLive'
import HomeHotCourse from '@/views/home/homeHotCourse'
import HomeTrain from '@/views/home/homeTrain'
import HomeNews from '@/views/home/homeNews'
import { queryCourseList } from '@/api/course'
import { homeQueryTrainList, homeNewsList, homeMyLiveList, getBanners } from '@/api/home'
import { getStore } from '@/util/store'
// import { mapGetters } from 'vuex'
// import HomeLive from './home/homeLive.vue'
export default {
  name: 'Home',
  components: {
    TheHeader,
    HomeMyTask,
    HomeRight,
    HomeLive,
    HomeHotCourse,
    HomeTrain,
    HomeNews
  },
  data() {
    return {
      // isOrgIdE: false,
      myTaskInfo: {
        nub: 0
      },
      diyBaseConfig: {
        diyPcL1: { coms: 'HomeMyTask', name: '我的任务' },
        diyPcL2: { coms: 'HomeLive', name: '最新直播' },
        diyPcL3: { coms: 'HomeHotCourse', name: '热门课程' },
        diyPcL4: { coms: 'HomeTrain', name: '培训中心' },
        diyPcL5: { coms: 'HomeNews', name: '新闻中心' }
        // diyPcR1: { coms: 'HomeNews', name: '个人信息' },
        // diyPcR2: { coms: 'HomeNews', name: '学习中的课程' },
        // diyPcR3: { coms: 'HomeNews', name: '月度积分排行榜' },
        // diyPcR4: { coms: 'HomeNews', name: '月度学时排行榜' }
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
        // {
        //   css: {
        //     backgroundImage: 'url(' + require('../assets/images/banner.jpg') + ')',
        //     backgroundRepeat: 'no-repeat',
        //     backgroundSize: 'cover'
        //   },
        //   id: '11'
        // },
        // {
        //   css: {
        //     backgroundImage: 'url(' + require('../assets/images/banner3.jpg') + ')',
        //     backgroundRepeat: 'no-repeat',
        //     backgroundSize: 'cover'
        //   },
        //   id: '22'
        // },
        // {
        //   css: {
        //     backgroundImage: 'url(' + require('../assets/images/banner4.jpg') + ')',
        //     backgroundRepeat: 'no-repeat',
        //     backgroundSize: 'cover'
        //   },
        //   id: '33'
        // }
      ],
      bannerExcavator: [
        {
          css: {
            backgroundImage: 'url(' + require('../assets/images/bannerE1.jpg') + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          },
          id: '11'
        },
        {
          css: {
            backgroundImage: 'url(' + require('../assets/images/bannerE2.jpg') + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          },
          id: '22'
        },
        {
          css: {
            backgroundImage: 'url(' + require('../assets/images/bannerE3.jpg') + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          },
          id: '33'
        }
      ]
    }
  },
  computed: {
    // ...mapGetters(['orgIds']),
    diyConfig: () => {
      let diyInfor = getStore({ name: 'diyInfor' })
      let diyConfig = diyInfor.home && diyInfor.home.length > 0 && JSON.parse(diyInfor.home)
      return diyConfig.content
    }
  },
  watch: {
    // orgIds(val) {
    //   this.isOrgIdE = val.indexOf('5263') !== -1 ? true : false
    // }
  },
  mounted() {
    this.getBannersFn()
    this.getHotCourse()
    this.getTrainList()
    this.getNewsList()
    this.getHomeMyLive()
    // this.isOrgIdEFn()
  },
  methods: {
    // isOrgIdEFn() {
    //   // 判断是否是挖机组织
    //   // 获取用户的组织id（包括当前和当前以上的），存放在localstore，vuex
    //   let orgIdsVuex = this.orgIds
    //   this.orgIdsD = orgIdsVuex || getStore({ name: 'orgIds' })
    //   this.isOrgIdE = this.orgIdsD.indexOf('5263') !== -1 ? true : false
    // },
    // myTaskPrevFn() {
    //   this.$refs.myTaskRef.prev()
    // },
    // myTaskNextFn() {
    //   this.$refs.myTaskRef.next()
    // },
    // toTrainDetaill(item) {
    //   // 调转到培训详情
    //   const { id: trainId, trainName: title, trainWay, userType } = item
    //   this.$router.push({
    //     name: 'trainDetail',
    //     params: {
    //       title,
    //       trainId,
    //       trainWay,
    //       userType
    //     }
    //   })
    // },

    async getBannersFn() {
      // 查询banner
      let res = await getBanners({ deviceType: 'PC' })
      this.banner = res
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
/deep/ .LMTitle {
  float: left;
  padding: 46px 0 21px 0;
  clear: both;
  width: 100%;
  margin: 0;
}
/deep/ .LMTitle .span1 {
  font-size: 22px;
  // font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  color: #000b15;
  font-weight: normal;
  padding-right: 8px;
  float: left;
}
/deep/ .LMTitle .span2 {
  font-size: 14px;
  // font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  color: #000b15;
  font-weight: normal;
  opacity: 0.45;
  float: left;
  padding: 8px 0 0 8px;
}
/deep/ .LMTitle .myTaskChange {
  float: right;
  padding-top: 7px;
}
/deep/ .LMTitle .myTaskPrev {
  width: 20px;
  height: 20px;
  display: block;
  float: left;
  background: url('/img/bgicon.png') repeat-x -60px -172px;
  cursor: pointer;
  margin: 0 22px 0 0;
}
/deep/ .LMTitle .myTaskNext {
  width: 20px;
  height: 20px;
  display: block;
  float: left;
  background: url('/img/bgicon.png') repeat-x -85px -172px;
  cursor: pointer;
}
/deep/ .LMTitle a {
  font-size: 14px;
  // font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  color: #000b15;
  font-weight: normal;
  opacity: 0.45;
  float: right;
  padding-top: 10px;
}

/deep/ .LModule {
  width: 897px;
  overflow-x: hidden;
}
/deep/ .LModule2 {
  width: 920px;
}
/deep/ .homeCourse {
  float: left;
  width: 285px;
  height: 306px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  margin: 0 20px 20px 0;
  border-radius: 4px;
}
/deep/ .homeCourse .homeCourseTitle {
  text-align: left;
  font-size: 14px;
  height: 55px;
  margin: 23px 0 10px 0;
  line-height: 180%;
  color: #000b15;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-weight: bold;
}
/deep/ .homeCourseImg {
  height: 168px;
}
/deep/ .homeCourseText {
  padding: 0 15px;
  overflow: hidden;
}
/deep/ .homeCourse .hCWatchNumber {
  float: left;
  font-size: 12px;
  color: #000b15;
  opacity: 0.65;
}
/deep/ .homeCourse .homeCourseTime {
  padding-top: 5px;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  float: left;
  font-size: 12px;
  color: #000b15;
  opacity: 0.65;
}
/deep/ .homeCourse .homeCourseTime:before {
  padding-right: 5px;
}
/deep/ .homeCourse .livePerInfo {
  float: right;
}
/deep/ .homeCourse .grade {
  float: left;
  transform: scale(0.8);
  margin: 3px 0 0 -14px;
}
/deep/ .homeCourse .livePerInfo img {
  border-radius: 50%;
  margin-right: 4px;
  float: left;
}
/deep/ .homeCourse .livePerInfo span {
  float: left;
  padding: 4px 0 0 4px;
  font-size: 12px;
  color: #000b15;
  opacity: 0.65;
}
/deep/ .homeCourse .livePerInfo .userIcon {
  padding: 5px 0 0 0;
}

/deep/ .recommendCourse {
  width: 590px;
  height: 276px;
  float: left;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  margin: 0 20px 20px 0;
  border-radius: 4px;
}
/deep/ .recommendCourse .recommendCourseTextP {
  position: absolute;
}
/deep/ .recommendCourse .recommendCourseText {
  border-radius: 0 0 4px 4px;
  position: relative;
  z-index: 10;
  bottom: 67px;
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
/deep/ .recommendCourse .recommendCourseTitle {
  display: block;
  font-size: 14px;
}
/deep/ .recommendCourse .recommendGrade {
  float: left;
  transform: scale(0.8);
  margin: 10px 0 0 -14px;
}
/deep/ .recommendCourse .learnNub {
  float: right;
}
/deep/ .recommendCourse .userIcon {
  font-size: 12px;
  padding: 0 9px 0 0;
}

/deep/ .homeTrain {
  cursor: pointer;
  width: 285px;
  height: 172px;
  text-align: left;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  margin: 0 20px 20px 0;
  border-radius: 4px;
  float: left;
  background: url('/img/bgicon.png') repeat-x 0px 0px #fff;
}
/deep/ .homeTrain .homeTrainTitle {
  width: 285px;
  font-size: 16px;
  font-weight: normal;
  padding: 0 15px;
  margin: 30px 0 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // background: url('../assets/images/icon.png') no-repeat 0 -206px;
  color: #000b15;
}
/deep/ .homeTrain .homeTrainTitle::before {
  float: left;
  content: '';
  display: block;
  width: 30px;
  height: 30px;
  margin: 1px 15px 0 0;
  background: url('/img/bgicon.png') repeat-x 0px -178px #fff;
}
/deep/ .homeTrain .homeTrainTextItem {
  color: #73797f;
  display: block;
  overflow: hidden;
  padding: 10px 15px 0 62px;
  font-size: 12px;
}
/deep/ .homeTrain .homeTrainTextItem img {
  border-radius: 50%;
  float: left;
  margin: 0 5px 0 0;
}

/deep/ .homeTrain .homeTraining {
  float: right;
  padding: 2px 6px;
  border-radius: 4px;
}
/deep/ .homeTrain .ing {
  background: #e7fbff;
  color: #01aafc;
}
/deep/ .homeTrain .future {
  background: #e7ffee;
  color: #00b061;
}
/deep/ .homeTrain .traingIcon {
  font-size: 12px;
  float: left;
  margin: 1px 5px 0 0;
}
/deep/ .homeTrain .homeTrainTextItem2 {
  float: left;
  overflow: hidden;
  display: block;
  width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .homeRight {
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
.foot {
  height: 124px;
  background: #475461;
  text-align: center;
  margin-top: 27px;
}
.foot2 {
  width: 1200px;
  margin: auto;
  color: #fff;

  font-size: 12px;
  display: inline-table;
  text-align: left;
  display: flex;
  padding: 50px 0;
}
.foot2 span {
  line-height: 25px;
  /* opacity: 0.35; */
}
.foot2 span img {
  opacity: 1;
  z-index: 999;
}
.policeLogo {
  margin-right: 10px;
  height: 28px;
}

.foot2 a {
  color: #fff;
}
</style>
