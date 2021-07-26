<template>
  <div class="train-list">
    <div v-if="data.length || queryLoading" v-loading="queryLoading">
      <div class="card-container">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="card-wrapper"
          @click="toDetail(item)"
        >
          <div class="card">
            <div class="card-banner">
              <img v-if="item.trainWay == 1" :src="item.coverUrl" :onerror="errorImg1" />
              <img v-else-if="item.trainWay == 2" :src="item.coverUrl" :onerror="errorImg2" />
              <img v-else-if="item.trainWay == 3" :src="item.coverUrl" :onerror="errorImg3" />
              <img v-else :src="item.coverUrl" :onerror="errorImg4" />
              <div class="card-cover">
                <div class="card-cover-btn">开始学习</div>
              </div>
            </div>
            <div
              class="card-status process"
              :class="{
                process: item.status === 1,
                pending: item.status === 2,
                done: item.status === 3
              }"
            >
              {{ item.status == 1 ? '未开始' : item.status == 2 ? '进行中' : '已结束' }}
            </div>
            <div class="card-content">
              <div class="card-title">{{ item.menuName }}</div>
              <div class="card-desc">
                <span class="train-type">{{ item.trainWay | trainWayFilter }}</span>
                <span class="train-date">{{
                  item.startTime.split(' ')[0].replace(/-/g, '/') +
                    ' - ' +
                    item.endTime.split(' ')[0].replace(/-/g, '/')
                }}</span>
              </div>

              <div v-if="item.totalPrecent == 100" class="complete-icon">
                <img :src="require('@/assets/images/my_seal.png')" />
              </div>
            </div>

            <div class="card-rate">
              <div v-if="item.trainWay === 4">
                <text-over-tooltip
                  ref-name="testName1"
                  class-name="fs20"
                  :content="item.categoryName"
                ></text-over-tooltip>
              </div>
              <el-rate
                v-else
                v-model="item.composite"
                disabled
                show-score
                score-template="{value}分"
              ></el-rate>
              <span v-if="item.knowledgeSystemName" class="know">
                {{ item.knowledgeSystemName }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <pagination
        style="margin-top: 10px"
        :total="totalNum"
        :limit="query.pageSize"
        :page="query.pageNo"
        @pagination="pagination"
      >
      </pagination>
    </div>

    <div v-else-if="!queryLoading && !data.length" class="empty-tips">
      <img :src="require('@/assets/images/nodata.png')" />
      <div class="empty-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
import Pagination from 'src/components/common-pagination'
import { myCourseCatalog } from '@/api/myTask'
import TextOverTooltip from '../course/components/TextOverTooltip'

export default {
  name: 'TrainList',
  components: { Pagination, TextOverTooltip },
  filters: {
    trainWayFilter(data) {
      const TRAIN_WAY = {
        1: '在线培训',
        2: '面授培训',
        3: '混合培训',
        4: '外训培训'
      }
      return TRAIN_WAY[data]
    }
  },
  data() {
    return {
      data: [],
      totalNum: 0,
      query: {
        pageSize: 10,
        pageNo: 1,
        courseType: '1'
      },
      queryLoading: false,
      errorImg1: 'this.src="' + require('@/assets/images/online.png') + '"',
      errorImg2: 'this.src="' + require('@/assets/images/Offline.png') + '"',
      errorImg3: 'this.src="' + require('@/assets/images/mixin.png') + '"',
      errorImg4: 'this.src="' + require('@/assets/images/outTrain.png') + '"'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    toDetail(card) {
      const { id: trainId, trainWay, userType, menuName: title } = card
      this.$router.push({
        path: '/train/detail',
        query: {
          trainId,
          trainWay,
          userType,
          title
        }
      })
    },
    pagination({ page, limit }) {
      this.query.pageNo = page
      this.query.pageSize = limit
      this.getData()
    },
    getData() {
      this.queryLoading = true
      myCourseCatalog(this.query)
        .then((res) => {
          const { data = [], totalNum = 0 } = res
          this.data = data
          this.totalNum = totalNum
          this.$emit('TrainListNumTotal', res.todoNum)
        })
        .finally(() => (this.queryLoading = false))
    }
  }
}
</script>

<style lang="scss" scoped>
.train-list {
  padding-top: 3px;
  .card-container {
    display: flex;
    flex-wrap: wrap;
    min-height: 297px;
    background-color: #f5f7f7;
    .card-wrapper {
      width: 285px;
      height: 282px;
      margin-bottom: 16px;
      transition-duration: 0.3s;
      background-color: #fff;
      margin-right: 20px;
      &:nth-child(4n) {
        margin-right: 0;
      }
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 9px 12px 0 rgba(0, 63, 161, 0.12);
        .card-cover {
          visibility: visible !important;
        }
      }
      .card {
        position: relative;
        cursor: pointer;
        background-color: #fff;
        width: 285px;
        box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      }
      .card-status {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 52px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 4px;
        font-size: 12px;
        z-index: 99;
        &.process {
          background: #fffee6;
          color: #f5c200;
        }
        &.pending {
          background-color: #f0f9ff;
          color: #2875d4;
        }
        &.done {
          background-color: #f5f5f6;
          color: rgba(0, 11, 21, 0.45);
        }
      }
      .card-banner {
        position: relative;
        height: 166px;
        width: 100%;

        img {
          height: 100%;
          width: 100%;
          border-radius: 4px;
        }
        .card-cover {
          position: absolute;
          visibility: hidden;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.45);
          z-index: 111;
          .card-cover-btn {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 84px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid #ffffff;
            color: #fff;
            border-radius: 4px;
          }
        }
      }
      .card-content {
        position: relative;
        padding: 10px 16px 7px;
        width: 100%;
        height: 71px;
        box-sizing: border-box;
        .complete-icon {
          position: absolute;
          right: 3px;
          bottom: -12px;
          width: 62px;
          height: 54px;
          img {
            width: 100%;
          }
        }
        .card-title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-bottom: 8px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          line-height: 22px;
          font-weight: 600;
        }
        .card-desc {
          display: flex;
          align-items: center;
          opacity: 0.65;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #000b15;
          height: 18px;
          line-height: 18px;
          .train-date {
            width: 0;
            flex: 1;
            margin-left: 17px;
          }
        }
      }
      .card-rate {
        box-sizing: border-box;
        padding: 7px 16px 17px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .know {
          font-size: 12px;
          background-color: #f2f2f2;
          padding: 3px 10px;
          border-radius: 4px;
          color: #999999;
        }
      }
    }
  }
  .empty-tips {
    text-align: center;
    cursor: default;
    img {
      width: 419px;
      height: 391px;
    }
    .empty-text {
      color: #909090;
    }
  }
}
</style>
