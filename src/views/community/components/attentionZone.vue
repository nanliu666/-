<template>
  <!-- 关注的专区 -->
  <div class="focuson">
    <el-row type="flex" justify="space-between" style="padding: 0 25px; align-items: center">
      <div class="common-title" style="padding: 10px 0">
        <span class="tip"></span>关注的专区<span>（{{ attentionZone.length }}）</span>
      </div>
      <!-- 轮播按钮 -->
      <div v-if="attentionZone.length > 10" class="swiper-arrow">
        <el-row type="flex">
          <div
            class="swiper-arrow-prev swiper-arrow-common"
            :class="{ activeArrow: swiperActiveIndex === 0 }"
            @click="swiperPrev"
          >
            <i class="iconimage_icon_leftarrow iconfont"></i>
          </div>
          <div
            class="swiper-arrow-next swiper-arrow-common"
            :class="{
              activeArrow:
                swiperActiveIndex ===
                (attentionZone.length <= 10
                  ? 0
                  : attentionZone.length % 2 === 0
                  ? attentionZone.length / 2 - 5
                  : ((attentionZone.length / 2) | 0) - 4)
            }"
            @click="swiperNext"
          >
            <i class="iconimage_icon_Rightarrow iconfont"></i>
          </div>
        </el-row>
      </div>
    </el-row>
    <el-divider></el-divider>
    <!-- swiper轮播 -->
    <swiper
      v-if="attentionZone.length"
      ref="swiper"
      v-loading="zoneLoading"
      :options="swiperOptions"
      @slideChangeTransitionEnd="slideChangeTransitionEnd"
    >
      <swiper-slide v-for="(temp, index) in attentionZone" :key="index" style="height: 56px"
        ><div class="carousel-content" @click="clickFlag && goZoneHome(temp)">
          <el-avatar
            shape="square"
            :size="32"
            :src="temp.headImg"
            style="vertical-align: middle; margin-right: 5px"
          ></el-avatar>
          {{ temp.name.length > 8 ? temp.name.slice(0, 8) : temp.name }}
        </div></swiper-slide
      >
    </swiper>
    <!-- 没有专区 -->
    <div v-else v-loading="zoneLoading" class="empty-tips">
      <img src="@/assets/images/empty.png" class="empty-img" />
      <div class="empty-text">
        <span>还没有关注专区，马上</span>
        <el-button type="text" style="font-size: 12px; margin-left: 5px" @click="goAllZone"
          >去看看</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper' // swiper轮播
import 'swiper/swiper.scss'
import { queryFocus } from '@/api/community'
export default {
  name: 'AttentionZone',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    requestParameters: {
      // 请求参数
      type: Object,
      default: () => ({})
    },
    clickFlag: {
      // 判断专区是否可以跳转
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      attentionZone: [], // 关注专区列表
      zoneLoading: false,
      swiperActiveIndex: 0, // swiper当前索引
      swiperOptions: {
        // swiper 配置
        slidesPerView: 5,
        spaceBetween: 18,
        slidesPerGroup: 1,
        slidesPerColumn: 2,
        autoplay: false,
        slidesPerColumnFill: 'row'
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.swiper.$swiper
    }
  },
  mounted() {
    this.initQueryFocus()
  },
  methods: {
    //   swiper鼠标拖动判断当前索引
    slideChangeTransitionEnd() {
      this.swiperActiveIndex = this.swiper.activeIndex
    },
    // swiper按钮切换
    swiperPrev() {
      this.swiper.slidePrev()
      this.swiperActiveIndex = this.swiper.activeIndex
    },
    swiperNext() {
      this.swiper.slideNext()
      this.swiperActiveIndex = this.swiper.activeIndex
    },
    // 获取关注的专区
    async initQueryFocus() {
      let params = Object.assign({}, this.requestParameters)
      this.zoneLoading = true
      await queryFocus(params)
        .then((res) => {
          this.attentionZone = res.data
        })
        .finally(() => {
          this.zoneLoading = false
        })
    },
    // 跳转专区区主页
    goZoneHome(item) {
      this.$router.push({ path: '/community/zoneHomePage', query: { areaId: item.id } })
    },
    // 跳转到专区列表
    goAllZone() {
      this.$router.push({ path: '/community/recommended', query: { tagName: 'allZone' } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './commonTitle.scss';
.focuson {
  position: relative;
  .swiper-arrow {
    &-common {
      width: 26px;
      height: 26px;
      border-radius: 5px;
      border: 1px solid #d9dbdc;
      cursor: pointer;
      text-align: center;
    }
    &-next {
      margin-left: 10px;
    }
    .iconfont {
      font-size: 18px;
      line-height: 24px;
    }
    .activeArrow {
      opacity: 0.5;
    }
  }
  .swiper-container {
    height: 130px;
    margin-top: 20px;
    width: 1150px;
  }
  .carousel-content {
    width: 215.6px;
    height: 56px;
    background: rgba(0, 11, 21, 0.02);
    border-radius: 4px;
    font-size: 14px;
    padding: 12px 0 12px 14px;
    color: #000b15;
    cursor: pointer;
    word-break: break-all;
  }
  .empty-tips {
    padding: 30px 0;
    text-align: center;
    .empty-img {
      width: 160px;
      height: 160px;
    }
    .empty-text {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.25);
    }
  }
}
</style>
