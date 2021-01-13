<template>
  <div class="homeRightP">
    <div class="homePrivateInfo">
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
          <span class="creditType">累计学分</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.totalPeriod }}</span>
          <span class="creditType">累计学时</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.monthlyScore }}</span>
          <span class="creditType">本月学分</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.monthlyPeriod }}</span>
          <span class="creditType">本月学时</span>
        </div>
      </div>
    </div>
    <div class="learningCourse">
      <div class="homeRightTitle">
        <span>学习中的课程</span>
        <!-- <router-link to="">更多</router-link> -->
      </div>
      <div v-for="item in learningCourseData.data" :key="item.id" class="learningCourseItem">
        <img
          :src="item.coverUrl ? item.coverUrl : '/img/autoL.png'"
          width="102"
          height="58"
          alt=""
        />
        <div class="courseText">
          <h3 class="courseTitle">{{ item.name }}</h3>
          <span class="courseTime">时长 00:34:12</span>
          <!--  时长 -->
          <span class="coursePercent">{{ item.totalPrecent }}%</span>
          <el-progress :percentage="item.totalPrecent" :format="format"></el-progress>
        </div>
      </div>
      <!-- <div class="learningCourseItem">
        <img
          src="../../assets/images/photo1.png"
          width="102"
          height="58"
          alt=""
        />
        <div class="courseText">
          <h3 class="courseTitle">
            信息安全十条铁规信息安全十条铁规信息安全十条铁规
          </h3>
          <span class="courseTime">时长 00:34:12</span>
          <span class="coursePercent">76%</span>
          <el-progress
            :percentage="50"
            :format="format"
          ></el-progress>
        </div>
      </div>
      <div class="learningCourseItem">
        <img
          src="../../assets/images/photo1.png"
          width="102"
          height="58"
          alt=""
        />
        <div class="courseText">
          <h3 class="courseTitle">
            信息安全十条铁规信息安全十条铁规信息安全十条铁规
          </h3>
          <span class="courseTime">时长 00:34:12</span>
          <span class="coursePercent">76%</span>
          <el-progress
            :percentage="50"
            :format="format"
          ></el-progress>
        </div>
      </div>
      <div class="learningCourseItem">
        <img
          src="../../assets/images/photo1.png"
          width="102"
          height="58"
          alt=""
        />
        <div class="courseText">
          <h3 class="courseTitle">
            信息安全十条铁规信息安全十条铁规信息安全十条铁规
          </h3>
          <span class="courseTime">时长 00:34:12</span>
          <span class="coursePercent">76%</span>
          <el-progress
            :percentage="50"
            :format="format"
          ></el-progress>
        </div>
      </div> -->
    </div>
    <div class="ranking">
      <div class="homeRightTitle">
        <span>月度学分排行榜</span>
        <!-- <router-link to="">更多</router-link> -->
      </div>
      <div v-for="(item, i) in monthlyCreditData" :key="item.id" class="rankingItem">
        <div :class="['rankingIndex', 'rankingIndex' + i]">01</div>
        <div class="rankingImg">
          <img :src="item.url ? item.url : '/img/userIconBig.png'" width="40" height="40" alt="" />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">{{ item.name }}</span>
          <span class="rankingInfo2">{{ item.orgCode }}</span>
        </div>
        <div class="score">{{ item.monthlyScore }}分</div>
      </div>
      <!-- <div class="rankingItem">
        <div class="rankingIndex rankingIndex2">
          02
        </div>
        <div class="rankingImg">
          <img
            src="/img/userIconBig.png"
            width="40"
            height="40"
            alt=""
          />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">小明</span>
          <span class="rankingInfo2">开发部</span>
        </div>
        <div class="score">
          234分
        </div>
      </div>
      <div class="rankingItem">
        <div class="rankingIndex rankingIndex3">
          03
        </div>
        <div class="rankingImg">
          <img
            src="/img/userIconBig.png"
            width="40"
            height="40"
            alt=""
          />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">小明</span>
          <span class="rankingInfo2">开发部</span>
        </div>
        <div class="score">
          234分
        </div>
      </div>
      <div class="rankingItem">
        <div class="rankingIndex rankingIndexOther">
          04
        </div>
        <div class="rankingImg">
          <img
            src="/img/userIconBig.png"
            width="40"
            height="40"
            alt=""
          />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">小明</span>
          <span class="rankingInfo2">开发部</span>
        </div>
        <div class="score">
          234分
        </div>
      </div>
      <div class="rankingItem">
        <div class="rankingIndex rankingIndexOther">
          05
        </div>
        <div class="rankingImg">
          <img
            src="/img/userIconBig.png"
            width="40"
            height="40"
            alt=""
          />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">小明</span>
          <span class="rankingInfo2">开发部</span>
        </div>
        <div class="score">
          234分
        </div>
      </div> -->
    </div>
    <div class="ranking">
      <div class="homeRightTitle">
        <span>月度学时排行榜</span>
        <!-- <router-link to="">更多</router-link> -->
      </div>
      <div v-for="(item, i) in monthlyCreditData" :key="item.id" class="rankingItem">
        <div :class="['rankingIndex', 'rankingIndex' + i]">01</div>
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
  </div>
</template>
<script>
import { homePInfo, homeLearningCourse, homeMonthlyCredit, homeMonthlyPeriod } from '@/api/home'
export default {
  name: 'HomeRight',
  data() {
    return {
      homePInfoData: [],
      learningCourseData: [],
      monthlyCreditData: [],
      monthlyPeriodData: []
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
.homeRightP {
}
.homeRightP .homePrivateInfo {
  width: 285px;
  height: 374px;
  background: #fff url('../../assets/images/icon.png') no-repeat 0 168px;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  border-radius: 4px;
  margin-top: 128px;
  text-align: center;
}
.homeRightP .homePrivateInfoImg {
  padding: 30px 0 0 0;
}
.homeRightP .homePrivateInfoImg img {
  border-radius: 50%;
  margin: aout;
}
.homeRightP .homePrivateInfoName {
  font-size: 16px;
  color: #000b15;
  opacity: 0.85;
  width: 180px;
  height: 32px;
  margin: 20px auto 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.homeRightP .homePrivateInfoOrg {
  font-size: 12px;
  color: #01aafc;
  width: 180px;
  background: #eaf8ff;
  padding: 2px 10px;
  border-radius: 4px;
}
.homeRightP .privateInfoCredit {
  margin: 40px auto 0 auto;
  width: 200px;
  overflow: hidden;
}
.homeRightP .CreditItem {
  float: left;
  width: 100px;
  padding: 0 10px 20px 10px;
}
.homeRightP .CreditItem .credit {
  display: block;
  padding-bottom: 5px;
  font-size: 24px;
}
.homeRightP .CreditItem .creditType {
  display: block;
  font-size: 12px;
  color: #000b15;
  opacity: 0.45;
}

.homeRightP .homeRightTitle {
  overflow: hidden;
  padding: 10px 0 18px 0;
}
.homeRightP .homeRightTitle span {
  font-size: 16px;
  color: #000b15;
  opacity: 0.85;
  font-weight: bold;
  float: left;
}
.homeRightP .homeRightTitle a {
  float: right;
  color: #000b15;
  opacity: 0.45;
  font-size: 12px;
}

.homeRightP .learningCourse {
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  border-radius: 4px;
  overflow: hidden;
  padding: 10px 20px;
  margin-top: 18px;
}

.homeRightP .learningCourseItem {
  display: flex;
  margin-bottom: 18px;
}
.homeRightP .learningCourseItem img {
  width: 102px;
}
.homeRightP .learningCourse .courseText {
  flex: 1;
  width: 140px;
  text-align: left;
  padding-left: 10px;
}
.homeRightP .courseTitle {
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #000b15;
  height: 20px;
  line-height: 20px;
  opacity: 0.85;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.homeRightP .courseTime {
  float: left;
  font-size: 12px;
  opacity: 0.45;
  color: #000b15;
}
.homeRightP .coursePercent {
  float: right;
  font-size: 12px;
  opacity: 0.45;
  color: #000b15;
}
/deep/.el-progress-bar {
  padding-right: 0;
  margin-top: 2px;
}

.homeRightP .ranking {
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  border-radius: 4px;
  overflow: hidden;
  padding: 10px 20px;
  margin-top: 18px;
}
.homeRightP .rankingItem {
  display: flex;
  margin-bottom: 20px;
}
.homeRightP .rankingIndex {
  width: 24px;
  margin: 13px 10px 0 0;
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bolder;
}
.homeRightP .rankingIndex0 {
  color: #fcba00;
}
.homeRightP .rankingIndex1 {
  color: #00d66f;
}
.homeRightP .rankingIndex2 {
  color: #01aafc;
}
.homeRightP .rankingIndexOther {
  color: #000b15;
  opacity: 0.25;
}
.homeRightP .rankingImg {
  width: 40px;
  margin: 0 10px 0 0;
}
.homeRightP .rankingInfo {
  flex: 1;
  text-align: left;
  font-size: 12px;
  color: #000;
  font-family: '微软雅黑';
}
.homeRightP .rankingInfo1 {
  display: block;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
  padding: 1px 0 3px 0;
}
.homeRightP .rankingInfo2 {
  display: block;
  opacity: 0.35;
}
.homeRightP .score {
  width: 60px;
  color: #000;
  opacity: 0.65;
  padding: 10px 0 0 0;
  font-size: 14px;
}
</style>
