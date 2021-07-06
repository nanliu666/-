<template>
  <!-- 首页我的任务 -->
  <div>
      <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">我的任务</span>
      <span class="span2">待完成任务{{ myTaskInfo.nub }}项</span>
      <router-link to="/myTask/myLearn">
        查看更多
      </router-link>
    </h3>
    <div v-if="myMissions && myMissions.length > 0" class="homeMyTask">
      <div v-for="item in myMissions" :key="item.id" style="margin-right:20px">
            <div
              :class="['homeMyTaskItem', item.type == 1 ? 'myTaskItemTrain' : 'myTaskItemExam']"
              @click="myTaskToDetaill(item)"
            >
                <span :class="['texttype', item.type == 1 ? 'traintype' : 'examtype']">{{item.type == 1 ? '培训' : '考试'}}</span>
              <h3 class="homeMyTaskItemTitle">
                <span
                  :class="['homeMyTaskItemTitleIcon', item.type == 1 ? 'trainIcon' : 'examIcon']"
                ></span>
                <span class="homeMyTaskItemTitle2" :title="item.name">{{ item.name }}</span>
                <!-- <span class="homeMyTaskType">{{ myMissionsType[item.type] }}</span> -->
              </h3>
              <div class="homeMyTaskItemText">
                <div class="homeMyTaskItemTextItem">
                  <span class="homeMyTaskItemTextItem2" :title="`${item.time}-${item.endTime}`">时间：{{ item.time }}-{{ item.endTime }}</span>
                </div>
                <div v-if="item.type == 1" class="homeMyTaskItemTextItem">
                  <span class="homeMyTaskItemTextItem2" :title="item.address">地址：{{ item.address }}</span>
                </div>
                <div v-if="item.type == 1" class="homeMyTaskItemTextItem">
                  <span class="homeMyTaskItemTextItem2">项目经理：{{ item.lecturer }}</span>
                </div>
                <div v-if="item.type == 0" class="homeMyTaskItemTextItem">
                  <span class="homeMyTaskItemTextItem2">考试来源：{{ examTypeShow(item.examType) }}</span>
                </div>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { queryMyMission } from '@/api/user'
// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css'

// import style (<= Swiper 5.x)
// import 'swiper/css/swiper.css'

export default {
  name: 'HomeMyTask',
  components: {
    Swiper,
    SwiperSlide
  },
  props: ['myTaskInfo'],
  data() {
    return {
      myMissions: [], //我的任务数据
      myMissionsType: { 0: '考试', 1: '培训' },
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  // directives: {
  //   swiper: directive
  // },
  mounted() {
    this.getMyMission()
    //this.swiper.slideTo(3, 1000, false)
  },
  methods: {
    examTypeShow(i) {
      const type = {
        CurrencyExam: '通用考试',
        CourseExam: '课程考试',
        TrainExam: '培训班考试',
        LiveExam: '直播考试'
      }
      return type[i] || '--'
    },
    myTaskToDetaill(item) {
      const { id: trainId, name: title, type: userType } = item
      // type 0:考试,1:培训
      if (item.type == 1) {
        this.$router.push({
          name: 'trainDetail',
          query: {
            title,
            trainId,
            trainWay: 3,
            userType
          }
        })
      } else {
        this.$router.push({
          name: 'ExamList'
        })
      }

      //:to="item.type==1?'/exam/list':'/exam/list'"
    },
    prev() {
      // 我的任务前进
      this.$nextTick(() => {
        this.swiper.activeIndex == 0
          ? (this.swiperFistPrevBt = false)
          : (this.swiperFistPrevBt = true)
      })
      this.$refs.mySwiper.$swiper.slidePrev()
    },
    next() {
      // 我的任务后退
      this.swiperFistPrevBt = true
      this.$refs.mySwiper.$swiper.slideNext()
    },
    async getMyMission() {
      // 我的任务
      this.myMissions
      let backData = await queryMyMission({ pageSize: 3, pageNo: 1 })
      this.myTaskInfo.nub = backData.data.length
      if (backData && backData.data) {
        this.myMissions = backData.data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.homeMyTask {
  border-radius: 4px;
  width: 897px;
  display: flex;
  // justify-content: space-between;
}
.homeMyTaskItem {
  cursor: pointer;
  width: 285px;
  height: 162px;
  text-align: left;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  background: url('/img/bgicon.png') repeat-x 0px 0px #fff
}
.homeMyTaskItem:hover {
  border-bottom: #2875D4 4px solid;
}
.myTaskItemExam {
  //border-bottom: #7feab7 4px solid;
  position: relative;
  padding: 16px;
}
.myTaskItemTrain {
  // border-bottom: #80d4fd 4px solid;
  position: relative;
  padding: 16px;
}
.homeMyTaskItemText{
    padding-left: 40px;
}
.homeMyTaskItem .homeMyTaskItemTitle {
  height: 16px;
  font-size: 14px;
  font-weight: normal;
}
.texttype{
    position: absolute;
    top: 30px;
    right: 16px;
    font-size: 12px;
    color: #2875D4;
    background: #F0F9FF;
    border-radius: 4px;
    padding: 1px 8px;
}
.examtype{
    background: #FFFEE6;
    color: #F5C200;
}
.traintype{
     color: #2875D4;
    background: #F0F9FF;
}
.homeMyTaskItem .homeMyTaskItemTitleIcon {
  float: left;
  display: block;
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
.homeMyTaskItem .trainIcon {
  background: url('/img/bgicon.png') repeat-x -5px -178px #fff;
}
.homeMyTaskItem .examIcon {
  background: url('/img/bgicon.png') repeat-x -30px -178px #fff;
}
.homeMyTaskItem .homeMyTaskItemTitle2 {
  color: #000b15;
  display: block;
  font-size: 15px;
  width: 175px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  white-space: nowrap;
  float: left;
}
.homeMyTaskItem .homeMyTaskType {
  padding: 1px 5px;
  float: right;
  font-size: 12px;
  margin: 17px 0 0 0;
  color: #fff;
  border-radius: 4px;
}
.myTaskItemExam .homeMyTaskType {
  background: #00d66f;
}
.myTaskItemTrain .homeMyTaskType {
  background: #01aafc;
}
.homeMyTaskItem .homeMyTaskItemTextItem {
  color: #73797f;
  display: block;
  overflow: hidden;
  padding: 10px 15px 0 0px;
}
.homeMyTaskItem .homeMyTaskItemTextItem img {
  border-radius: 50%;
  float: left;
  margin: 0 5px 0 0;
}

// .homeMyTaskItem .traingIcon{font-size: 12px;float: left;margin: 1px 5px 0 0;}
.homeMyTaskItem .homeMyTaskItemTextItem2 {
  float: left;
  font-size: 12px;
  width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.homeMyTaskItem .homeMyTaskItemTextItem2::before {
  font-size: 12px;
  margin: 1px 5px 0 0;
}
// /deep/ .homeMyTaskItemNext{}
// /deep/ .homeMyTaskItemNext::after{background: #fff;right: -20px;position: relative;z-index: 10000;}
</style>
<style></style>
