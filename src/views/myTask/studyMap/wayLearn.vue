<template>
  <div class="wayLearn">
    <el-row type="flex" justify="space-between">
      <div class="title">学习途径</div>
      <div v-if="abilityTemp.length" class="swiper-arrow">
        <i
          class="swiper-arrow-temp swiper-arrow-left"
          :class="{ abilityArrow: alibitySwiperIndex === 0 }"
          @click="swiperPrev"
        ></i>
        <i
          class="swiper-arrow-temp swiper-arrow-right"
          :class="{
            abilityArrow:
              alibitySwiperIndex ===
              (abilityTemp.length % 4 === 0
                ? abilityTemp.length / 4 - 1
                : (abilityTemp.length / 4) | 0)
          }"
          @click="swiperNext"
        ></i>
      </div>
    </el-row>
    <!-- 卡片轮播 -->
    <swiper
      v-if="abilityTemp.length"
      ref="alibitySwiper"
      :options="abilitySwiperOptions"
      class="swiper-no-swiping"
      style="margin-top: 20px"
    >
      <swiper-slide
        v-for="s in abilityTemp.length % 4 === 0
          ? abilityTemp.length / 4
          : (abilityTemp.length / 4 + 1) | 0"
        :key="s"
      >
        <el-row :gutter="24">
          <el-col
            v-for="(ability, a) in abilityTemp.slice((s - 1) * 4, 4 * s)"
            :key="a"
            :span="12"
            style="margin-bottom: 24px"
          >
            <el-card :body-style="{ padding: '0px', width: '335px' }" shadow="hover">
              <!-- 顶部能力等级 -->
              <el-row type="flex" justify="space-between" class="ability-container">
                <div class="ability-level">
                  <span v-if="ability.name.length <= 5">{{ ability.name }}</span>
                  <el-tooltip v-else effect="dark" :content="ability.name" placement="top">
                    <span>{{ ability.name.slice(0, 5) + '...' }}</span>
                  </el-tooltip>
                  <span v-if="ability.levelName.length <= 5">（{{ ability.levelName }}）</span>
                  <el-tooltip v-else effect="dark" :content="ability.levelName" placement="top">
                    <span>（{{ ability.levelName.slice(0, 5) + '...' }}）</span>
                  </el-tooltip>
                </div>
                <span class="ability-completeRate"
                  >完成度：{{ ability.completeRate + '%'
                  }}<i
                    v-if="ability.item.length"
                    class="swiper-arrow-temp swiper-arrow-left"
                    @click="levelSwiperPrev(a + 4 * (s - 1))"
                  ></i>
                  <i
                    v-if="ability.item.length"
                    class="swiper-arrow-temp swiper-arrow-right"
                    @click="levelSwiperNext(a + 4 * (s - 1))"
                  ></i
                ></span>
              </el-row>
              <!-- 底部学习途径 -->
              <swiper v-show="ability.item.length" ref="levelSwiper" :options="levelSwiperOptions">
                <swiper-slide
                  v-for="num in ability.item.length % 4 === 0
                    ? ability.item.length / 4
                    : (ability.item.length / 4 + 1) | 0"
                  :key="num"
                >
                  <el-row class="level-container">
                    <el-col
                      v-for="(route, r) in ability.item.slice((num - 1) * 4, 4 * num)"
                      :key="r"
                      :span="24"
                    >
                      <el-row type="flex" justify="space-between">
                        <div class="levelName">
                          【{{ routeTypeTemp[route.routeType] }}】
                          <span v-if="route.routeName.length <= 18">{{ route.routeName }}</span>
                          <el-tooltip
                            v-else
                            effect="dark"
                            :content="route.routeName"
                            placement="top"
                          >
                            <span>{{ route.routeName.slice(0, 18) + '...' }}</span>
                          </el-tooltip>
                        </div>
                        <div class="levelStatus">
                          <el-tag v-if="route.status == '3'" type="success" size="mini"
                            >已完成</el-tag
                          >
                          <el-popover
                            ref="dcPopover"
                            width="300"
                            trigger="click"
                            :placement="num % 2 === 0 ? 'left-start' : 'right-start'"
                            popper-class="way-learn-popover"
                            v-if="route.routeType == '2'"
                          >
                            <div class="batch-container" v-loading="batchLoading">
                              <div
                                class="batch-container-item"
                                v-for="(item, index) in batchData"
                                :key="index"
                                @click="goExamDetails(item.id)"
                              >
                                {{ item.name }}
                              </div>
                            </div>
                            <i
                              slot="reference"
                              class="swiper-arrow-temp swiper-arrow-right"
                              style="margin: 0px 24px 0 10px"
                              @click="jumpRouteDetails(route)"
                            ></i>
                          </el-popover>
                          <i
                            v-else
                            class="swiper-arrow-temp swiper-arrow-right"
                            style="margin: 0px 24px 0 10px"
                            @click="jumpRouteDetails(route)"
                          ></i>
                        </div>
                      </el-row>
                    </el-col>
                  </el-row>
                </swiper-slide>
              </swiper>
              <div v-if="!ability.item.length" style="text-align: center; height: 144px">
                <img src="@/assets/images/nodata.png" style="max-width: 100px" />
                <div>该能力暂没有学习途径～</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </swiper-slide>
    </swiper>
    <div v-else style="text-align: center">
      <img src="@/assets/images/nodata.png" style="max-width: 300px" />
      <div>该岗位暂没有学习途径~</div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper.scss'
import {
  getSimpleCourse,
  getExamById,
  getTrainDetail,
  getLiveDetail,
  getTestBatch
} from '@/api/studyMap.js'
const nzhcn = require('nzh/cn')
export default {
  name: 'WayLearn',
  filters: {
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      alibitySwiperIndex: 0,
      levelSwiperIndex: '',
      routeTypeTemp: {
        1: '课程',
        2: '考试',
        3: '培训',
        4: '直播',
        5: '能力提升材料'
      },
      abilitySwiperOptions: {
        autoplay: false
      },
      levelSwiperOptions: {
        autoplay: false
      },
      abilityTemp: [],
      batchData: [], // 考试批次弹窗
      batchLoading: false
    }
  },
  methods: {
    // swiper按钮切换
    swiperPrev() {
      this.$refs.alibitySwiper.$swiper.slidePrev()
      this.alibitySwiperIndex = this.$refs.alibitySwiper.$swiper.activeIndex
    },
    swiperNext() {
      this.$refs.alibitySwiper.$swiper.slideNext()
      this.alibitySwiperIndex = this.$refs.alibitySwiper.$swiper.activeIndex
    },
    levelSwiperPrev(index) {
      this.levelSwiperIndex = index
      this.$refs.levelSwiper[index].$swiper.slidePrev()
    },
    levelSwiperNext(index) {
      this.levelSwiperIndex = index
      this.$refs.levelSwiper[index].$swiper.slideNext()
    },
    showConfirm(tip) {
      this.$confirm(tip, '提示', {
        confirmButtonText: '知道了',
        showCancelButton: false,
        type: 'warning'
      })
    },
    // 跳转详情
    async jumpRouteDetails(data) {
      // 晋升路线类型 1-课程,2-考试,3-培训,4-直播,5-能力提升材料
      switch (data.routeType) {
        //  判断课程详情跳转
        case '1':
          this.$router.push({ path: '/course/detail', query: { id: data.bizId } })
          //   await getSimpleCourse({ courseId: data.bizId }).then((res) => {
          //     //   没有数据就是已删除，课程状态（0:审核中； 1：已发布；2：草稿；3：停用）
          //     if (!res || !Object.keys(res).length) {
          //       this.showConfirm('该课程已被删除。')
          //     } else if (res.status === 3) {
          //       this.showConfirm('该课程已被停用。')
          //     } else {
          //       this.$router.push({ path: '/course/detail', query: { id: data.bizId } })
          //     }
          //   })
          break
        //  判断考试详情跳转
        case '2':
          this.batchData = []
          this.batchLoading = true
          await getTestBatch({ examId: data.bizId })
            .then((res) => {
              res.map((v) => {
                this.batchData.push({
                  name: `${
                    data.routeName.length > 15
                      ? data.routeName.slice(0, 15) + '...'
                      : data.routeName
                  }（第${this.$options.filters['number2zhcn'](
                    Number(_.get(v, 'batchNumber', 0)) + 1
                  )}批）`,
                  id: v.id
                })
              })
            })
            .finally(() => {
              this.batchLoading = false
            })
          //   this.$router.push({ path: '/exam/middle', query: { id: data.bizId } })
          //   await getExamById({ id: data.bizId }).then((res) => {
          //     //   没有数据就是已删除，isExpire:1过期 0没过期
          //     if (!res || !Object.keys(res).length) {
          //       this.showConfirm('该考试已被删除。')
          //     } else if (res.isExpire === 1) {
          //       this.showConfirm('该考试已到期。')
          //     } else {
          //       this.$router.push({ path: '/exam/middle', query: { id: data.bizId } })
          //     }
          //   })
          break
        //  判断培训详情跳转
        case '3':
          this.$router.push({
            path: '/train/detail',
            query: { trainId: data.bizId, title: data.routeName }
          })
          //   await getTrainDetail({ trainId: data.bizId }).then((res) => {
          //     //   没有数据就是已删除，status：培训状态（1：未开始；2：进行中；3：已结束
          //     if (!res || !Object.keys(res).length) {
          //       this.showConfirm('该培训已被删除。')
          //     } else if (res.status === 3) {
          //       this.showConfirm('该培训已结束，请后续关注是否会开班下一期。')
          //     } else {
          //       this.$router.push({
          //         path: '/train/detail',
          //         query: { trainId: data.bizId, title: data.routeName }
          //       })
          //     }
          //   })
          break
        //  判断直播详情跳转
        case '4':
          await getLiveDetail({ liveId: data.bizId }).then((res) => {
            //   没有数据就是已删除，isUsed:数据状态：0:禁用； 1:正常
            if (!res || !Object.keys(res).length) {
              this.showConfirm('该直播已被删除。')
            } else if (res.isUsed === 0) {
              this.showConfirm('该直播已被禁用。')
            } else {
              this.$router.push({ path: '/live/Detail', query: { id: data.bizId } })
            }
          })
          break
        //   点击能力材料上报
        case '5':
          this.$emit('reportMaterial', data)
      }
    },
    goExamDetails(id) {
      this.$router.push({ path: '/exam/middle', query: { id: id } })
    }
  }
}
</script>

<style scoped lang="scss">
.wayLearn {
  width: 695px;
  .title {
    font-size: 12px;
  }
  .ability-container {
    height: 40px;
    line-height: 40px;
    background: #fafafa;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    padding: 0 20px;
  }
  .level-container {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.85);
    line-height: 36px;
    height: 144px;
    /deep/ .el-col {
      margin-bottom: 0;
    }
  }
  .swiper-arrow {
    &-temp {
      border: solid #8c9195;
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      border-radius: 2px;
      cursor: pointer;
    }
    &-left {
      transform: rotate(135deg);
      margin-right: 10px;
      margin-left: 16px;
    }
    &-right {
      transform: rotate(-45deg);
    }
  }
  .abilityArrow {
    opacity: 0.5;
  }
}
</style>
<style lang="scss">
.way-learn-popover {
  padding: 0 !important;
  margin-top: -5px;
}
.batch-container {
  min-height: 40px;
  &-item {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  &-item:hover {
    background-color: #f5f7fa;
  }
}
</style>
