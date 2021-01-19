<template>
  <!-- 首页我的任务 -->
  <div v-if="myMissions && myMissions.length > 0" class="homeMyTask">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="item in myMissions" :key="item.id">
        <div class="homeMyTaskItem" @click="myTaskToDetaill(item)">
          <h3 class="homeMyTaskItemTitle">
            <span class="homeMyTaskItemTitle2">{{ item.name }}</span>
            <span class="homeMyTaskType">{{ myMissionsType[item.type] }}</span>
          </h3>
          <div class="homeMyTaskItemText">
            <div class="homeMyTaskItemTextItem">
              <span class="homeMyTaskItemTextItem2 iconimage_icon_address iconfont">{{
                item.address
              }}</span>
            </div>
            <div class="homeMyTaskItemTextItem">
              <span class="homeMyTaskItemTextItem2 iconimage_icon_time iconfont">{{
                item.time
              }}</span>
            </div>
            <div class="homeMyTaskItemTextItem">
              <span class="homeMyTaskItemTextItem2 iconimage_icon_user iconfont">{{
                item.lecturer
              }}</span>
            </div>
          </div>
        </div>
      </swiper-slide>
      <!-- <swiper-slide>
        <div class="homeMyTaskItem">
          <router-link to="">
            <h3 class="homeMyTaskItemTitle">
              <span
                class="homeMyTaskItemTitle2"
              >1职场礼仪职场礼仪职场礼仪职场礼仪职场礼仪职场礼仪</span>
              <span class="homeMyTaskType">培训</span>
            </h3>
            <div class="homeMyTaskItemText">
              <div class="homeMyTaskItemTextItem">
                <span
                  class="homeMyTaskItemTextItem2 iconimage_icon_address iconfont"
                >环普产业园G1座</span>
              </div>
              <div class="homeMyTaskItemTextItem">
                <span
                  class="homeMyTaskItemTextItem2 iconimage_icon_time iconfont"
                >2020-09-12 14:30</span>
              </div>
              <div class="homeMyTaskItemTextItem">
                <span class="homeMyTaskItemTextItem2 iconimage_icon_user iconfont">老周</span>
              </div>
            </div>
          </router-link>
        </div>
      </swiper-slide>       -->
      <div
        v-show="swiperFistPrevBt"
        slot="button-prev"
        class="swiper-button-prev"
        @click="prev"
      ></div>
      <div slot="button-next" class="swiper-button-next homeMyTaskItemNext" @click="next"></div>
      <!-- <div class="swiper-pagination" slot="pagination"></div>       -->
    </swiper>
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
  data() {
    return {
      myMissions: [], //我的任务数据
      myMissionsType: { 0: '考试', 1: '培训' },
      swiperFistPrevBt: false, // 显示隐藏我的任务左边前进后退按钮
      swiperOptions: {
        initialSlide: 0,
        slidesPerView: 3,
        slidesPerGroup: 3,
        autoplay: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: false
        },
        on: {
          init: function() {
            //Swiper初始化了
            // console.log('当前的slide序号是' + this.activeIndex) //或者swiper.activeIndex，swiper与this都可指代当前swiper实例
            //this.emit('transitionEnd');//在初始化时触发一次transitionEnd事件，需要先设置transitionEnd
          },
          slideChangeTransitionStart: function() {
            // console.log('slideChangeTransitionStart2', this.activeIndex)
            // this.$nextTick(()=>{
            //   this.swiperFistPrevBt = false
            //   //this.activeIndex == 0 ? (this.swiperFistPrevBt = false) : (this.swiperFistPrevBt = true)
            // })
            // console.log('slideChangeTransitionStart', this)
            //alert(this.activeIndex);
          },
          slideChangeTransitionEnd: function() {
            // this.swiperFistPrevBt = false
            // console.log('slideChangeTransitionEnd', this)
            // if(this.isEnd){
            //   this.navigation.$nextEl.css('display','none');
            // }else{
            //   this.navigation.$nextEl.css('display','block');
            // }
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: false
        }
      }
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
    myTaskToDetaill(item) {
      const { id: trainId, name: title, type: userType } = item
      // type 0:考试,1:培训
      if (item.type == 1) {
        this.$router.push({
          name: 'trainDetail',
          params: {
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
      let backData = await queryMyMission({ pageSize: 100, pageNo: 1 })
      if (backData && backData.data) {
        this.myMissions = backData.data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
//.homeMyTask{width: 837px;}
.homeMyTaskItem {
  cursor: pointer;
  width: 265px;
  height: 153px;
  text-align: left;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  border-radius: 4px;
  float: left;
  border-bottom: #80d4fd 4px solid;
}
.homeMyTaskItem .homeMyTaskItemTitle {
  height: 55px;
  font-size: 14px;
  font-weight: normal;
  margin: 0 15px 5px 15px;
  border-bottom: #f1f8fb solid 1px;
}
.homeMyTaskItem .homeMyTaskItemTitle2 {
  color: #000b15;
  display: block;
  font-size: 14px;
  width: 185px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
  margin: 17px 0 0 0;
}
.homeMyTaskItem .homeMyTaskType {
  background: #01aafc;
  padding: 1px 5px;
  float: right;
  font-size: 12px;
  margin: 17px 0 0 0;
  color: #fff;
  border-radius: 4px;
}
.homeMyTaskItem .homeMyTaskItemTextItem {
  color: #73797f;
  display: block;
  overflow: hidden;
  padding: 10px 15px 0 15px;
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
}
.homeMyTaskItem .homeMyTaskItemTextItem2::before {
  font-size: 12px;
  margin: 1px 5px 0 0;
}
// /deep/ .homeMyTaskItemNext{}
// /deep/ .homeMyTaskItemNext::after{background: #fff;right: -20px;position: relative;z-index: 10000;}
</style>
<style></style>
