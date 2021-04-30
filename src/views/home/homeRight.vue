<template>
  <!-- 首页左侧内容 -->
  <div class="homeRightP">
    <!-- <home-side-user-info :home-p-info-data="homePInfoData"></home-side-user-info> -->
    <!-- <div class="homePrivateInfo">
      <div class="homePrivateInfoImg">
        <img
          :src="homePInfoData.url ? homePInfoData.url : '/img/userIconBig.png'"
          width="80"
          height="80"
          alt=""
        />
      </div>
      <h3 class="homePrivateInfoName">
        {{ homePInfoData.name }}
      </h3>
      <span class="homePrivateInfoOrg">{{ homePInfoData.orgCode }}</span>
      <div class="privateInfoCredit">
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.totalScore }}</span>
          <span class="creditType">累计积分</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.totalPeriod }}</span>
          <span class="creditType">累计学时</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.monthlyScore }}</span>
          <span class="creditType">本月积分</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.monthlyPeriod }}</span>
          <span class="creditType">本月学时</span>
        </div>
      </div>
    </div> -->
    <!-- <home-side-learn-course :learning-course-data="learningCourseData"></home-side-learn-course>
    <home-side-rank-integral :monthly-credit-data="monthlyCreditData"></home-side-rank-integral>
    <home-side-rank-hour :monthly-period-data="monthlyPeriodData"></home-side-rank-hour> -->
    <!-- <div class="ranking">
      <div class="homeRightTitle">
        <span>月度积分排行榜</span>        
      </div>
      <div v-for="(item, i) in monthlyCreditData" :key="item.id" class="rankingItem">
        <div :class="['rankingIndex', 'rankingIndex' + i]">0{{ i + 1 }}</div>
        <div class="rankingImg">
          <img :src="item.url ? item.url : '/img/userIconBig.png'" width="40" height="40" alt="" />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">{{ item.name }}</span>
          <span class="rankingInfo2">{{ item.orgCode }}</span>
        </div>
        <div class="score">{{ item.monthlyScore }}分</div>
      </div>      
    </div>
    <div class="ranking">
      <div class="homeRightTitle">
        <span>月度学时排行榜</span>       
      </div>
      <div v-for="(item, i) in monthlyPeriodData" :key="item.id" class="rankingItem">
        <div :class="['rankingIndex', 'rankingIndex' + i]">0{{ i + 1 }}</div>
        <div class="rankingImg">
          <img :src="item.url ? item.url : '/img/userIconBig.png'" width="40" height="40" alt="" />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">{{ item.name }}</span>
          <span class="rankingInfo2">{{ item.orgCode }}</span>
        </div>
        <div class="score">{{ item.monthlyPeriod }}H</div>
      </div>
    </div> -->
    <div v-for="item in diyConfig" :key="item.id">
      <component
        :is="diyBaseConfig[item.id] ? diyBaseConfig[item.id].coms : ''"
        v-if="diyBaseConfig[item.id]"
        :home-p-info-data="homePInfoData"
        :learning-course-data="learningCourseData"
        :monthly-credit-data="monthlyCreditData"
        :monthly-period-data="monthlyPeriodData"
      >
      </component>
    </div>
  </div>
</template>
<script>
import { homePInfo, homeLearningCourse, homeMonthlyCredit, homeMonthlyPeriod } from '@/api/home'
import homeSideUserInfo from './side/homeSideUserInfo.vue'
import HomeSideLearnCourse from './side/homeSideLearnCourse'
import HomeSideRankIntegral from './side/homeSideRankIntegral.vue'
import HomeSideRankHour from './side/homeSideRankHour.vue'
import { getStore } from '@/util/store'
export default {
  name: 'HomeRight',
  components: {
    homeSideUserInfo,
    HomeSideLearnCourse,
    HomeSideRankIntegral,
    HomeSideRankHour
  },
  data() {
    return {
      diyBaseConfig: {
        // diyPcL1: { coms: 'HomeMyTask', name: '我的任务' },
        // diyPcL2: { coms: 'HomeLive', name: '最新直播' },
        // diyPcL3: { coms: 'HomeHotCourse', name: '热门课程' },
        // diyPcL4: { coms: 'HomeTrain', name: '培训中心' },
        // diyPcL5: { coms: 'HomeNews', name: '新闻中心' },
        diyPcR1: { coms: 'homeSideUserInfo', name: '个人信息' },
        diyPcR2: { coms: 'HomeSideLearnCourse', name: '学习中的课程' },
        diyPcR3: { coms: 'HomeSideRankIntegral', name: '月度积分排行榜' },
        diyPcR4: { coms: 'HomeSideRankHour', name: '月度学时排行榜' }
      },
      homePInfoData: {},
      learningCourseData: {},
      monthlyCreditData: [],
      monthlyPeriodData: []
    }
  },
  computed: {
    diyConfig: () => {
      let diyInfor = getStore({ name: 'diyInfor' })
      let diyConfig = diyInfor.home && diyInfor.home.length > 0 && JSON.parse(diyInfor.home)
      return diyConfig.side
    }
  },
  mounted() {
    this.getHomePInfo()
    this.getLearningCourse()
    this.getMonthlyCredit()
    this.getMonthlyPeriod()
  },
  methods: {
    format() {
      return '' //percentage === 100 ? '满' : `${percentage}%`;
    },
    learningCourseFn(item) {
      // 我学习中的课程跳转
      this.$router.push({
        path: `/course/detail?id=${item.id}`
      })
    },
    async getHomePInfo() {
      // 获取首页个人信息
      this.homePInfoData = await homePInfo({ pageSize: 3, pageNo: 1 })
    },
    async getLearningCourse() {
      // 学习中的课程
      this.learningCourseData = await homeLearningCourse({ pageSize: 5, pageNo: 1 })
    },
    async getMonthlyCredit() {
      // 月度学分排行榜
      this.monthlyCreditData = await homeMonthlyCredit({ num: 5 })
    },
    async getMonthlyPeriod() {
      // 月度学分排行榜
      this.monthlyPeriodData = await homeMonthlyPeriod({ num: 5 })
    }
  }
}
</script>
<style lang="scss" scoped>
.homeRightP /deep/ .homePrivateInfo {
  width: 285px;
  height: 374px;
  background: #fff url('../../assets/images/icon.png') no-repeat 0 168px;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  border-radius: 4px;
  margin-top: 50px;
  text-align: center;
}
.homeRightP /deep/ .homePrivateInfoImg {
  padding: 30px 0 0 0;
}
.homeRightP /deep/ .homePrivateInfoImg img {
  border-radius: 50%;
  margin: aout;
}
.homeRightP /deep/ .homePrivateInfoName {
  font-size: 16px;
  color: #000b15;
  opacity: 0.85;
  width: 180px;
  height: 30px;
  margin: 13px auto 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.homeRightP /deep/ .homePrivateInfoOrg {
  font-size: 12px;
  color: #01aafc;
  width: 180px;
  background: #eaf8ff;
  padding: 2px 15px;
  border-radius: 10px;
}
.homeRightP /deep/ .privateInfoCredit {
  margin: 47px auto 0 auto;
  width: 200px;
  overflow: hidden;
}
.homeRightP /deep/ .CreditItem {
  float: left;
  width: 100px;
  padding: 0 10px 22px 10px;
}
.homeRightP /deep/ .CreditItem .credit {
  display: block;
  padding-bottom: 5px;
  font-size: 24px;
}
.homeRightP /deep/ .CreditItem .creditType {
  display: block;
  font-size: 12px;
  color: #000b15;
  opacity: 0.45;
}

.homeRightP /deep/ .homeRightTitle {
  overflow: hidden;
  padding: 10px 0 18px 0;
}
.homeRightP /deep/ .homeRightTitle span {
  font-size: 16px;
  color: #000b15;
  opacity: 0.85;
  font-weight: bold;
  float: left;
}
.homeRightP /deep/ .homeRightTitle a {
  float: right;
  color: #000b15;
  opacity: 0.45;
  font-size: 12px;
}

.homeRightP /deep/ .learningCourse {
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  border-radius: 4px;
  overflow: hidden;
  padding: 10px 20px;
  margin-top: 20px;
}

.homeRightP /deep/ .learningCourseItem {
  cursor: pointer;
  display: flex;
  margin-bottom: 18px;
}
.homeRightP /deep/ .learningCourseItem img {
  border-radius: 4px;
  width: 102px;
}
.homeRightP /deep/ .learningCourse .courseText {
  flex: 1;
  width: 140px;
  text-align: left;
  padding-left: 10px;
}
.homeRightP /deep/ .courseTitle {
  font-size: 14px;
  margin: 0 0 5px 0;
  color: #000b15;
  height: 20px;
  line-height: 20px;
  opacity: 0.85;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.homeRightP /deep/ .courseTime {
  float: left;
  font-size: 12px;
  opacity: 0.45;
  color: #000b15;
}
.homeRightP /deep/ .coursePercent {
  float: right;
  font-size: 12px;
  opacity: 0.45;
  color: #000b15;
}
/deep/ .el-progress-bar {
  padding-right: 0;
  margin-top: 2px;
}

.homeRightP /deep/ .ranking {
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  border-radius: 4px;
  overflow: hidden;
  padding: 10px 20px;
  margin-top: 20px;
}
.homeRightP /deep/ .rankingItem {
  display: flex;
  margin-bottom: 20px;
}
.homeRightP /deep/ rankingIndex {
  width: 24px;
  margin: 13px 10px 0 0;
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bolder;
}
.homeRightP /deep/ .rankingIndex0 {
  color: #fcba00;
}
.homeRightP /deep/ .rankingIndex1 {
  color: #00d66f;
}
.homeRightP .rankingIndex2 {
  color: #01aafc;
}
.homeRightP /deep/ .rankingIndexOther {
  color: #000b15;
  opacity: 0.25;
}
.homeRightP /deep/ .rankingImg {
  width: 40px;
  margin: 0 10px 0 0;
}
.homeRightP /deep/ .rankingImg img {
  border-radius: 50%;
}
.homeRightP /deep/ .rankingInfo {
  flex: 1;
  text-align: left;
  font-size: 12px;
  color: #000;
  font-family: '微软雅黑';
}
.homeRightP /deep/ .rankingInfo1 {
  display: block;
  height: 20px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
  padding: 1px 0 3px 0;
}
.homeRightP /deep/ .rankingInfo2 {
  display: block;
  font-size: 12px;
  opacity: 0.35;
}
.homeRightP /deep/ .score {
  width: 60px;
  color: #000;
  opacity: 0.65;
  padding: 10px 0 0 0;
  font-size: 14px;
}
</style>
