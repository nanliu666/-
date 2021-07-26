<template>
  <div class="train">
    <div class="top-container">
      <div class="search-wrapper">
        <el-input
          v-model="filterForm.trainName"
          clearable
          size="small"
          class="search-box"
          placeholder="培训名称/讲师"
          suffix-icon="el-icon-search"
          @input="filterList"
        >
        </el-input>
      </div>
      <div class="filter-wrapper">
        <div class="filter-item">
          <knowSelect :filter-form="filterForm" />
        </div>
        <div class="filter-item">
          类型：
          <span
            class="filter-radio"
            :class="{ selected: !filterForm.trainWay && filterForm.trainScope === '' }"
            @click="type(0)"
          >全部</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.trainWay === 2 }"
            @click="type(1)"
          >面授</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.trainWay === 1 }"
            @click="type(2)"
          >在线</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.trainWay === 3 }"
            @click="type(3)"
          >混合</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.trainScope === 'outer' }"
            @click="type(4)"
          >外训</span>
        </div>
        <div class="filter-item">
          状态：
          <span
            class="filter-radio"
            :class="{ selected: filterForm.status === '' }"
            @click="type(5)"
          >全部</span>
          <span class="filter-radio" :class="{ selected: filterForm.status === 1 }" @click="type(6)">未开始</span>
          <span class="filter-radio" :class="{ selected: filterForm.status === 2 }" @click="type(7)">进行中</span>
          <span class="filter-radio" :class="{ selected: filterForm.status === 3 }" @click="type(8)">已结办</span>
        </div>
        <div class="filter-item">
          日期：
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="small"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 16px"
            @click.native="filterList"
          >
            查询
          </el-button>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <ul v-if="data.length > 0" class="train-list">
        <li v-for="item in data" :key="item.id" class="train-item" @click="toDetail(item)">
          <div class="img">
            <img :src="imgSrc(item)" />
            <div
              class="status"
              :class="item.status === 2 ? 'blue' : item.status === 3 ? 'grey' : 'yellow'"
            >
              {{ item.status === 2 ? '进行中' : item.status === 3 ? '已结办' : '未开始' }}
            </div>
          </div>
          <div class="content">
            <p class="title">{{ item.trainName }}</p>
            <p class="info">
              <span>{{
                item.trainWay === 2
                  ? '面授培训'
                  : item.trainWay === 3
                    ? '混合培训'
                    : item.trainWay === 1
                      ? '在线培训'
                      : '外训'
              }}</span>
              <span>{{ item.startTime.split(' ')[0] }} - {{ item.endTime.split(' ')[0] }}</span>
            </p>
            <div v-show="filterForm.trainWay !== 4" class="footer">
              <div class="left">
                <el-rate
                  v-if="item.trainScope === 'inside'"
                  :value="item.composite ? +item.composite : 0"
                  disabled
                  show-score
                  text-color="#ff9900"
                  :score-template="item.composite ? item.composite + '分' : '0分'"
                >
                </el-rate>

                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  :content="item.categoryName"
                  placement="top-start"
                  :disabled="item.categoryName.length < 10"
                >
                  <span>{{ item.categoryName }}</span>
                </el-tooltip>
              </div>
              <div v-if="item.knowledgeSystemName" class="right">
                <span>{{ item.knowledgeSystemName }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div v-else class="no-data">
        <img src="../../assets/images/nodata.png" />
        <div>暂无数据</div>
      </div>
      <div class="pagi-container">
        <pagination
          :total="total"
          :limit="filterForm.pageSize"
          :page="filterForm.pageNo"
          @pagination="pagination"
        >
        </pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from 'src/components/common-pagination'
import { getList } from 'src/api/train'
export default {
  name: 'Train',
  components: {
    Pagination,
    knowSelect: () => import('./components/treeSelect.vue')
  },
  data() {
    return {
      teacherName: '',
      date: [],
      filterForm: {
        trainName: '',
        trainWay: '',
        status: '',
        startTime: '',
        endTime: '',
        trainScope: '',
        knowledgeSystemId: '',
        pageNo: 1,
        pageSize: 10
      },
      data: [],
      total: 0,
      cacheSatus: '',
      cacheTrainWay: '',
      trainScope: 'inside',
      knowList: []
    }
  },
  computed: {
    imgSrc() {
      return (data) => {
        if (data.coverPic) return data.coverPic
        else if (data.trainWay === 1 && data.trainScope === 'inside')
          return require('@/assets/images/online.png')
        else if (data.trainWay === 2 && data.trainScope === 'inside')
          return require('@/assets/images/Offline.png')
        else if (data.trainWay === 3 && data.trainScope === 'inside')
          return require('@/assets/images/mixin.png')
        else if (data.trainWay === 4 && data.trainScope === 'outer')
          return require('@/assets/images/outTrain.png')
      }
    }
  },

  watch: {
    filterForm: {
      handler() {},
      deep: true
    }
  },
  activated() {
    this.filterList()
  },
  methods: {
    type(index) {
      switch (index) {
        case 0:
          this.filterForm.trainWay = ''
          this.filterForm.trainScope = ''
          break
        case 1:
          this.filterForm.trainWay = 2
          this.filterForm.trainScope = 'inside'
          break
        case 2:
          this.filterForm.trainWay = 1
          this.filterForm.trainScope = 'inside'
          break
        case 3:
          this.filterForm.trainWay = 3
          this.filterForm.trainScope = 'inside'
          break
        case 4:
          this.filterForm.trainWay = ''
          this.filterForm.trainScope = 'outer'
          break
        case 5:
          this.filterForm.status = ''
          break
        case 6:
          this.filterForm.status = 1
          break
        case 7:
          this.filterForm.status = 2
          break
        case 8:
          this.filterForm.status = 3
          break
      }
      if (
        this.filterForm.status !== this.cacheSatus ||
        this.filterForm.trainWay !== this.cacheTrainWay ||
        this.filterForm.trainScope !== this.trainScope
      ) {
        this.filterList()
        this.cacheTrainWay = this.filterForm.trainWay
        this.cacheSatus = this.filterForm.status
        this.trainScope = this.filterForm.trainScope
      }
    },
    filterList() {
      this.filterForm.pageNo = 1
      this.filterForm.pageSize = 10
      this.queryList()
    },
    pagination(data) {
      const { page, limit } = data
      this.filterForm.pageNo = page
      this.filterForm.pageSize = limit
      this.queryList()
    },
    queryList() {
      this.date = this.date || []
      const params = Object.assign(this.filterForm, {
        startTime: this.date[0],
        endTime: this.date[1]
      })
      getList(params).then((res) => {
        const { records = [], total = 0 } = res
        this.data = this.sortList(records)
        this.total = total
      })
    },
    toDetail(item) {
      const { id: trainId, userType } = item
      this.$router.push({
        path: '/train/detail',
        query: {
          trainId,
          userType
        }
      })
    },
    sortList(list = []) {
      return list.sort((a, b) => a.status - b.status)
    }
  }
}
</script>

<style lang="scss" scoped>
.train {
  height: 100%;
  .top-container {
    margin-top: 20px;
    padding: 24px;
    background-color: #fff;
    border-bottom: 1px solid #ebeced;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    .search-wrapper {
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(235, 236, 237, 1);
      .search-box {
        width: 380px;
      }
    }
    .filter-wrapper {
      .filter-item {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        margin-top: 16px;
        .filter-radio {
          cursor: pointer;
          margin-right: 24px;
          color: rgba(0, 11, 21, 0.85);
          &.selected {
            color: #2875d4;
            font-weight: 600;
          }
        }
        .el-date-editor {
          width: 388px;
        }
      }
    }
  }
  .bottom-container {
    .train-list {
      display: flex;
      padding-top: 20px;
      flex-wrap: wrap;
      li {
        cursor: pointer;
        flex-direction: 0;
        width: 285px;
        height: 282px;
        margin-bottom: 20px;
        margin-right: 20px;
        background: #ffffff;
        box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
        border-radius: 4px;
        p {
          margin: 0;
        }
        &:nth-of-type(4n) {
          margin-right: 0;
        }
        .img {
          position: relative;
          width: 100%;
          height: 166px;
          border-radius: 4px 4px 0 0;
          img {
            width: 100%;
            height: 100%;
          }
          .status {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 52px;
            height: 20px;
            font-size: 12px;
            text-align: center;
            line-height: 22px;
            font-weight: 400;
            border-radius: 4px;
          }
          .yellow {
            color: #f5c200;
            background-color: #fffee6;
          }
          .grey {
            color: rgba(0, 11, 21, 0.45);
            background-color: #f5f5f6;
          }
          .blue {
            color: #2875d4;
            background-color: #f0f9ff;
          }
        }
        .content {
          background-color: #fff;
          padding: 15px;
          .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            line-height: 22px;
            font-weight: 500;
          }
          .info {
            font-size: 12px;
            margin-top: 8px;
            opacity: 0.45;
            font-family: PingFangSC-Regular;
            color: rgba(0, 11, 21, 0.85);
            span:first-of-type {
              margin-right: 17px;
            }
          }
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 17px;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            .left {
              flex: 1;
              span {
                display: inline-block;
                width: 50%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .right {
              flex-shrink: 0;
              font-size: 12px;
              color: rgba(0, 11, 21, 0.45);
              border-radius: 4px;
              background-color: #f5f5f6;
              padding: 3px 8px;
            }
            /deep/span.el-rate__text {
              font-size: 12px;
              color: rgba(0, 11, 21, 0.45) !important;
              line-height: 18px;
            }
          }
        }
      }
    }
    .no-data {
      color: #ddd;
      text-align: center;
      i {
        font-size: 17px;
        margin-top: 50px;
      }
      .text {
        margin-top: 7px;
      }
    }
  }
  .collapse-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    border-bottom: 1px solid #333;
    .column {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      line-height: 22px;
      text-align: left;
      .pre {
        color: rgba(0, 11, 21, 0.45);
      }
    }
    .time {
      width: 7.3%;
      box-sizing: border-box;
      border-right: 1px solid #ebeced;
    }
    .name {
      flex: 0 0 21%;
    }
    .teacher {
      flex: 0 0 10.4%;
    }
    .place {
      flex: 0 0 13.6%;
    }
    .status {
      flex: 0 0 5.6%;
    }
  }
  .pagi-container {
    margin-top: 16px;
  }
  .train-item {
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    &:hover {
      box-shadow: 0 8px 20px 0 rgba(0, 61, 112, 0.12) !important;
      margin-top: -2px;
    }
  }
  .filter-radio:hover {
    color: #2875d4 !important;
  }
}
</style>
