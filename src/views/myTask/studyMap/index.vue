<template>
  <div class="studyMap">
    <div v-if="noPosition" class="main-container">
      <!-- 顶部 -->
      <el-row type="flex" justify="space-between" style="align-items: center">
        <div class="header-title">岗位晋升路线</div>
        <div class="header-route">
          <el-dropdown trigger="click" @command="dropRoute">
            <el-button type="text"> 切换晋升路线 </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in switchRoutesTemp"
                :key="index"
                :class="{
                  'studyMap-dropdown-menu-item-selected':
                    item.fullUserRoutePositionId == dropMenuSelected
                }"
                :command="item"
              >
                {{ item.fullUserRoute }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-row>
      <el-divider></el-divider>
      <div v-loading="routeLoading" class="routeBar">
        <!-- swiper切换按钮 -->
        <div class="swiper-prev swiper-arrow" @click="swiperPrev">
          <i class="swiper-arrow-temp swiper-arrow-left"></i>
        </div>
        <div class="swiper-next swiper-arrow" @click="swiperNext">
          <i class="swiper-arrow-temp swiper-arrow-right"></i>
        </div>
        <!-- swiper走马灯 -->
        <swiper ref="mySwiper" :options="swiperOptions" style="width: 784px; margin: 0 auto">
          <swiper-slide
            v-for="(route, index) in routeBarTemp"
            :key="index"
            class="carousel-router"
            :class="{ 'swiper-isActive': positionId == route.value }"
            :style="{
              height: 20 * (index + 2) + 'px',
              lineHeight: 20 * (index + 2) + 'px'
            }"
            @click.native="hanlderPosition(route.value)"
            >{{ route.label }}
          </swiper-slide>
        </swiper>
        <!-- 当前岗位 -->
        <div v-if="routeBarTemp.length" class="map-position">
          <transition name="el-fade-in-linear">
            <div class="map-tip" :style="{ left: mapPosition + 'px' }">
              <img src="../../../../public/img/map-position.svg" />
              <p>当前岗位</p>
            </div>
          </transition>
        </div>
      </div>
      <!-- 岗位胜任情况 -->
      <div v-loading="competentLoading" class="competent-situation">
        <div class="sub-title"><i></i>岗位胜任情况</div>
        <el-row style="margin-top: 20px">
          <el-col :span="6"
            >岗位名称：<span class="tip">{{ competentInfo.positionName }}</span></el-col
          >
          <el-col :span="18"
            >岗位整体胜任度：<span class="tip">{{ overallCompetency + '%' }}</span></el-col
          >
          <el-col v-if="competentInfo.positionDesc" :span="24"
            >岗位描述：<span class="tip">{{ competentInfo.positionDesc }}</span></el-col
          >
        </el-row>
      </div>
      <!-- 岗位能力图谱 -->
      <div v-loading="abilityLoading" class="ability-map">
        <div class="sub-title"><i></i>岗位能力图谱</div>
        <el-row
          v-if="abilityMapTemp.length"
          type="flex"
          justify="space-between"
          style="margin-top: 20px"
        >
          <!-- 雷达图 -->
          <div class="radar-map"><radar-map ref="radarMap"></radar-map></div>
          <!-- 学习途径 -->
          <div class="wayLearn">
            <way-learn ref="wayLearn" @reportMaterial="reportMaterial"></way-learn>
          </div>
        </el-row>
        <div v-else style="text-align: center">
          <img src="@/assets/images/nodata.png" style="max-width: 300px" />
          <div>该岗位目前没有绑定能力～</div>
        </div>
      </div>
      <!-- 能力提升上报材料 -->
      <report-material
        ref="reportMaterial"
        @refreshConfirm="initAbilityMap(positionId)"
      ></report-material>
    </div>
    <!-- 暂无岗位 -->
    <div v-else style="text-align: center">
      <img src="@/assets/images/nodata.png" style="max-width: 300px" />
      <div>您没有岗位～</div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import radarMap from './radarMap'
import wayLearn from './wayLearn'
import reportMaterial from './reportMaterial'
import 'swiper/swiper.scss'
import {
  getPromotionRoute,
  getCompetentSituation,
  getAbilityMap,
  switchRoutes
} from '@/api/studyMap.js'
export default {
  name: 'StudyMap',
  components: {
    Swiper,
    SwiperSlide,
    radarMap,
    wayLearn,
    reportMaterial
  },
  data() {
    return {
      activeIndex: 0,
      dropMenuSelected: '', // 下拉菜单高亮
      positionId: '', // 岗位id
      routeLoading: false,
      competentLoading: false,
      abilityLoading: false,
      competentInfo: {}, // 岗位胜任情况
      switchRoutesTemp: [], // 切换晋升岗位
      routeBarTemp: [], // 岗位柱状图
      abilityMapTemp: [], // 能力图谱信息
      swiperOptions: {
        // swiper 配置信息
        slidesPerView: 7,
        slidesPerGroup: 1,
        autoplay: false
      },
      overallCompetency: 0,
      noPosition: true // 判断用有没有绑定岗位
    }
  },
  computed: {
    // 计算当前岗位icon的位移
    mapPosition() {
      let result = 0
      this.routeBarTemp.map((v, i) => {
        if (this.positionId == v.value) {
          result = (i - this.activeIndex) * 112 + 28
        }
      })
      return result
    }
  },
  async mounted() {
    await this.initPromotionRoute()
    this.initCompetentSituation(this.positionId)
    this.initAbilityMap(this.positionId)
  },
  methods: {
    // 切换路线下拉菜单回调
    async dropRoute(val) {
      if (this.dropMenuSelected != val.fullUserRoutePositionId) {
        this.routeBarTemp = []
        let fullUserRouteTemp = val.fullUserRoute.split('——'),
          fullUserRoutePositionIdTemp = val.fullUserRoutePositionId.split(',')
        fullUserRouteTemp.map((o, i) => {
          this.routeBarTemp.push({
            value: fullUserRoutePositionIdTemp[i],
            label: o
          })
        })
        this.positionId = this.routeBarTemp[0].value
        this.initCompetentSituation(this.positionId)
        this.initAbilityMap(this.positionId)
        await switchRoutes({ userRoteId: val.userRouteId })
        this.dropMenuSelected = val.fullUserRoutePositionId
      }
    },
    // 点击岗位切换
    hanlderPosition(positionId) {
      this.positionId = positionId
      this.initCompetentSituation(positionId)
      this.initAbilityMap(positionId)
    },
    // swiper按钮切换
    swiperPrev() {
      this.$refs.mySwiper.$swiper.slidePrev()
      this.activeIndex = this.$refs.mySwiper.$swiper.activeIndex
    },
    swiperNext() {
      this.$refs.mySwiper.$swiper.slideNext()
      this.activeIndex = this.$refs.mySwiper.$swiper.activeIndex
    },
    // 获取用户晋升路线
    async initPromotionRoute() {
      // 判断用户是否绑定岗位
      let userInfo = JSON.parse(localStorage.getItem('elearning-userInfo'))
      if (!userInfo.content.position_id) {
        this.noPosition = false
        return
      }
      this.routeLoading = true
      this.competentLoading = true
      this.abilityLoading = true
      await getPromotionRoute()
        .then((res) => {
          this.switchRoutesTemp = res
          this.switchRoutesTemp.forEach((v) => {
            v.fullUserRoute = v.fullUserRoute.replace(/,/g, '——')
            //   active =0,代表默认路线
            if (!v.active) {
              let fullUserRouteTemp = v.fullUserRoute.split('——'),
                fullUserRoutePositionIdTemp = v.fullUserRoutePositionId.split(',')
              this.dropMenuSelected = v.fullUserRoutePositionId
              fullUserRouteTemp.map((o, i) => {
                this.routeBarTemp.push({
                  value: fullUserRoutePositionIdTemp[i],
                  label: o
                })
              })
            }
          })
          this.positionId = this.routeBarTemp[0].value
        })
        .finally(() => {
          this.routeLoading = false
        })
    },
    // 获取岗位胜任情况
    async initCompetentSituation(positionId) {
      this.competentLoading = true
      getCompetentSituation({ positionId: positionId })
        .then((res) => {
          this.competentInfo = res
        })
        .finally(() => {
          this.competentLoading = false
        })
    },
    // 获取岗位能力图谱
    async initAbilityMap(positionId) {
      this.abilityLoading = true
      await getAbilityMap({ positionId: positionId })
        .then((res) => {
          this.overallCompetency = res.competence
          this.abilityMapTemp = res.ability
          if (this.abilityMapTemp.length) {
            this.$nextTick(() => {
              this.$refs.radarMap.initCharts(this.abilityMapTemp)
              this.$refs.wayLearn.abilityTemp = this.abilityMapTemp
            })
          }
        })
        .finally(() => {
          this.abilityLoading = false
        })
    },
    // 点击材料上报
    reportMaterial(val) {
      this.$refs.reportMaterial.visible = true
      this.$refs.reportMaterial.initMaterialReport(val)
    }
  }
}
</script>

<style scoped lang="scss">
.studyMap {
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  margin-top: 16px;
  padding: 24px;
  .header-title {
    font-size: 16px;
    font-weight: bold;
  }
  .routeBar {
    position: relative;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.85);
    margin-top: 50px;
    .map-position {
      position: absolute;
      background: url(../../../../public/img/map-line.png) top left no-repeat;
      width: 796px;
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
      bottom: -20px;
      color: #2875d4;
      font-size: 14px;
      background-size: contain;
      height: 12px;
      margin-left: 6px;
      .map-tip {
        position: absolute;
        text-align: center;
        top: -2px;
        p {
          margin: 0;
          font-weight: bold;
        }
      }
    }
    .swiper-arrow {
      position: absolute;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid #ebeced;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 16px;
      text-align: center;
      line-height: 18px;
      &.swiper-prev {
        left: 115px;
      }
      &.swiper-next {
        right: 115px;
      }
      &-temp {
        border: solid #8c9195;
        border-width: 0 2px 2px 0;
        display: inline-block;
        padding: 3px;
        border-radius: 2px;
      }
      &-left {
        transform: rotate(135deg);
        margin-left: 3px;
      }
      &-right {
        transform: rotate(-45deg);
        margin-right: 3px;
      }
    }
    /deep/ .swiper-wrapper {
      align-items: flex-end;
      //   justify-content: center;
    }
    .carousel-router {
      position: relative;
      padding: 0 20px;
      cursor: pointer;
      text-align: center;
      background-image: linear-gradient(270deg, rgba(245, 245, 246, 0.5) 0%, #e2e2e2 100%);
      &.swiper-isActive {
        background: #2875d4;
        color: #ffffff;
      }
    }
  }
  .competent-situation {
    color: rgba(0, 11, 21, 0.45);
    line-height: 22px;
    margin-top: 100px;
    padding: 25px 0;
    border-top: 1px dashed #eeeff0;
    border-bottom: 1px dashed #eeeff0;
    span.tip {
      color: rgba(0, 11, 21, 0.85);
    }
  }
  .ability-map {
    margin-top: 25px;
  }
  .sub-title {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: bold;
    i {
      width: 4px;
      height: 14px;
      background: #2875d4;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .radar-map {
    margin: 35px 0 0 0;
  }
}
.studyMap-dropdown-menu-item-selected {
  background-color: #e6f7ff;
  color: #34bbfd;
}
</style>
