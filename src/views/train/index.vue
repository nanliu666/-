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
          类型：
          <span
            class="filter-radio"
            :class="{ selected: !filterForm.trainWay }"
            @click="filterForm.trainWay = ''"
          >全部</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.trainWay === 2 }"
            @click="filterForm.trainWay = 2"
          >面授</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.trainWay === 1 }"
            @click="filterForm.trainWay = 1"
          >在线</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.trainWay === 3 }"
            @click="filterForm.trainWay = 3"
          >混合</span>
        </div>
        <div class="filter-item">
          状态：
          <span
            class="filter-radio"
            :class="{ selected: filterForm.status === '' }"
            @click="filterForm.status = ''"
          >全部</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.status === 1 }"
            @click="filterForm.status = 1"
          >未开始</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.status === 2 }"
            @click="filterForm.status = 2"
          >进行中</span>
          <span
            class="filter-radio"
            :class="{ selected: filterForm.status === 3 }"
            @click="filterForm.status = 3"
          >已结办</span>
        </div>
        <div class="filter-item">
          日期：
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 16px;"
            @click.native="filterList"
          >
            查询
          </el-button>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <ul v-if="data.length" class="train-list">
        <li v-for="item in data" :key="item.id" class="train-item">
          <div class="top-wrap">
            <div class="title">
              <div class="name">
                {{ item.trainName }}
              </div>
              <div
                class="status"
                :class="{
                  doing: item.status === 2,
                  done: item.status === 3,
                  will: item.status === 1
                }"
              >
                {{ item.status === 2 ? '进行中' : item.status === 3 ? '已结办' : '未开始' }}
              </div>
            </div>
            <el-button
              class="study-button"
              :type="item.status !== 2 ? '' : 'primary'"
              size="medium"
              @click.native="toDetail(item)"
            >
              {{ item.status !== 2 ? '查看详情' : '前往学习' }}
            </el-button>
          </div>
          <div class="bottom-wrap">
            <div class="desc-list">
              <div class="desc-item">
                培训类型：
                <span class="text">{{
                  item.trainWay === 2 ? '面授' : item.trainWay === 3 ? '混合' : '在线'
                }}</span>
              </div>
              <div class="desc-item">
                培训时间：
                <span class="text">{{ item.startTime }}-{{ item.endTime }}</span>
              </div>
              <div class="desc-item">
                培训讲师：
                <span class="text">{{ item.lecturerName }}</span>
              </div>
            </div>
            <div class="desc-list">
              <div class="desc-item" style="margin-top: 16px;">
                培训地点：
                <span class="text">{{ item.address }}</span>
              </div>
            </div>
          </div>
          <!-- <div v-if="item.status === 3" class="done-tips"> -->
          <div v-if="item.isPass" class="done-tips">
            <img src="./done.png" />
          </div>
        </li>
      </ul>

      <div v-else class="no-data">
        <i class="el-icon-search"> </i>
        <div class="text">
          无数据
        </div>
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
    Pagination
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
        pageNo: 1,
        pageSize: 10
      },
      data: [],
      total: 0,
      cacheSatus: '',
      cacheTrainWay: ''
    }
  },

  watch: {
    filterForm: {
      handler(val) {
        if (val.status != this.cacheSatus || val.trainWay != this.cacheTrainWay) {
          this.filterList()
          this.cacheTrainWay = val.trainWay
          this.cacheSatus = val.status
        }
      },
      deep: true
    }
  },
  activated() {
    this.filterList()
  },
  methods: {
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
      const { id: trainId, trainName: title, trainWay, userType } = item
      // userType 0:学员,1:讲师
      this.$router.push({ 
        path: '/train/detail', 
        query: { 
          title,
          trainId,
          trainWay,
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
            color: #01aafc;
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
      margin-top: 20px;
      .train-item {
        position: relative;
        background-color: #fff;
        padding: 24px;
        box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
        cursor: default;
        &:not(:first-child) {
          margin-top: 20px;
        }
        .top-wrap {
          position: relative;
          .title {
            display: flex;
            align-items: center;
            font-size: 0;
            .name {
              font-size: 18px;
              color: rgba(0, 11, 21, 0.85);
              margin-right: 16px;
            }
            .status {
              height: 20px;
              line-height: 20px;
              text-align: center;
              width: 52px;
              font-size: 12px;
              border-radius: 4px;
              &.will {
                color: #00b061;
                background-color: #e7ffee;
              }
              &.doing {
                color: #fcba00;
                background-color: #fffce6;
              }
              &.done {
                color: #01aafc;
                background-color: #e7fbff;
              }
            }
          }
          .study-button {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
        .bottom-wrap {
          margin-top: 18px;
          .desc-list {
            display: flex;
            color: rgba(0, 11, 21, 0.45);
            font-size: 14px;
            .desc-item {
              display: flex;
              flex: 1;
              align-items: center;
              .text {
                width: 287px;
                color: rgba(0, 11, 21, 0.85);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        .done-tips {
          position: absolute;
          top: 25.15px;
          right: 149.23px;
          width: 77.54px;
          height: 67.69px;
          img {
            width: 100%;
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
}
</style>
