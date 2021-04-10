<template>
  <div class="train-list">
    <div v-if="data.length || queryLoading" v-loading="queryLoading" class="card-container">
      <div v-for="(item, index) in data" :key="index" class="card-wrapper" @click="toDetail(item)">
        <div class="card">
          <div class="card-banner">
            <img :src="item.coverUrl" :onerror="errorImg" />

            <div
              class="card-status process"
              :class="{
                process: item.status === 2,
                pending: item.status === 1,
                done: item.status === 3
              }"
            >
              {{ item.status == 1 ? '未开始' : item.status == 2 ? '进行中' : '已结束' }}
            </div>

            <div class="card-cover">
              <div class="card-cover-btn">开始学习</div>
            </div>
          </div>

          <div class="card-content">
            <div class="card-title">{{ item.menuName }}</div>
            <div class="card-desc">
              <span class="train-type">{{
                item.trainWay == 1 ? '在线' : item.trainWay == 2 ? '面授' : '混合'
              }}</span>
              <span class="desc-divider"></span>
              <span class="train-date">{{ item.startTime + ' - ' + item.endTime }}</span>
            </div>

            <div v-if="item.totalPrecent == 100" class="complete-icon">
              <img :src="require('@/assets/images/my_seal.png')" />
            </div>
          </div>

          <div class="card-rate">
            <el-rate
              v-model="item.composite"
              disabled
              show-score
              score-template="{value}分"
            ></el-rate>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!queryLoading && !data.length" class="empty-tips">
      <img :src="require('@/assets/images/nodata.png')" />
      <div class="empty-text">暂无数据</div>
    </div>
    <pagination
      style="margin-top: 10px;"
      :total="totalNum"
      :limit="query.pageSize"
      :page="query.pageNo"
      @pagination="pagination"
    >
    </pagination>
  </div>
</template>

<script>
import Pagination from 'src/components/common-pagination'
import { myCourseCatalog } from '@/api/myTask'

export default {
  name: 'TrainList',
  components: { Pagination },
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
      errorImg: 'this.src="' + require('@/assets/images/required_bg.png') + '"'
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
        })
        .finally(() => (this.queryLoading = false))
    }
  }
}
</script>

<style lang="scss" scoped>
.train-list {
  .card-container {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
    min-height: 297px;
    .card-wrapper {
      padding: 0 10px;
      margin-bottom: 16px;
    }
    .card {
      cursor: pointer;
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
      width: 273px;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      transition-duration: 0.3s;
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 9px 12px 0 rgba(0, 63, 161, 0.12);
        .card-cover {
          visibility: visible !important;
        }
      }
      .card-banner {
        position: relative;
        height: 172px;
        width: 273px;
        img {
          height: 100%;
          width: 100%;
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
          &.process {
            background-color: #fffce6;
            color: #fcba00;
          }
          &.pending {
            background-color: #e7ffee;
            color: #00b061;
          }
          &.done {
            background-color: #e7fbff;
            color: #01aafc;
          }
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
        border-bottom: 1px solid #ebeced;
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
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #000b15;
          margin-bottom: 8px;
          line-height: 22px;
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
          .desc-divider {
            flex: 0 0 1;
            height: 12px;
            width: 1px;
            background-color: rgba(0, 11, 21, 0.3);
            margin: 0 8px;
          }
          .train-date {
            width: 0;
            flex: 1;
          }
        }
      }
      .card-rate {
        box-sizing: border-box;
        padding: 7px 16px;
      }
    }
  }
  .empty-tips {
    text-align: center;
    height: 297px;
    cursor: default;
    img {
      width: 220px;
      height: 220px;
    }
    .empty-text {
      color: #909090;
    }
  }
}
</style>
