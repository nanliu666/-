<template>
  <div class="train-list">
    <div v-if="data.length || queryLoading" v-loading="queryLoading.body" class="card-container">
      <div v-for="(item, index) in data" :key="index" class="card-wrapper" @click="toDetail(item)">
        <div class="card">
          <div class="card-banner">
            <img :src="item.coverUrl" />
          </div>
          <div class="card-content">
            <div class="card-title">
              {{ item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name }}
            </div>
            <div class="card-submitted">
              作业提交次数<span style="margin-left: 15px">{{ item.jobTimes }}/{{ item.jobNum }}</span>
            </div>

            <div v-if="item.jobPercent == 100" class="complete-icon">
              <img :src="require('@/assets/images/my_seal.png')" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!queryLoading && !data.length" class="empty-tips">
      <img :src="require('@/assets/images/nodata.png')" />
      <div class="empty-text">暂无数据</div>
    </div>
    <pagination
      v-if="data.length || queryLoading"
      style="margin-top: 10px"
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
import { trainWorkList } from '@/api/myTask'

export default {
  name: 'TrainList',
  components: { Pagination },
  data() {
    return {
      data: [],
      totalNum: 0,
      query: {
        pageSize: 8,
        pageNo: 1
      },
      queryLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    toDetail(data) {
      this.$router.push({ path: '/myTask/trainingDetail', query: { id: data.id } })
    },
    pagination({ page, limit }) {
      this.query.pageNo = page
      this.query.pageSize = limit
      this.getData()
    },
    async getData() {
      this.queryLoading = true
      await trainWorkList(this.query)
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
    min-height: 297px;
    .card-wrapper {
      margin-bottom: 16px;
      width: 285px;
      height: 282px;
      margin-right: 20px;
    }
    .card-wrapper:nth-child(4n) {
      margin-right: 0;
    }
    .card {
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
      width: 285px;
      height: 282px;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      transition-duration: 0.3s;
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px 0 rgba(0, 61, 112, 0.12);
        .card-cover {
          visibility: visible !important;
        }
      }
      .card-banner {
        position: relative;
        height: 166px;
        width: 285px;
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
        box-sizing: border-box;
        .complete-icon {
          position: absolute;
          right: 3px;
          bottom: 15px;
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
          margin-bottom: 8px;
          line-height: 22px;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 600;
        }
        .card-submitted {
          opacity: 0.65;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #000b15;
          line-height: 18px;
        }
      }
    }
  }
  .card-container:nth-of-type(4n) {
    margin-right: 0;
  }
  .empty-tips {
    text-align: center;
    cursor: default;
    .empty-text {
      color: #909090;
    }
  }
}
</style>
