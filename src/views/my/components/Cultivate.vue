<template>
  <div class="cultivate">
    <div class="search">
      <div class="search_btn"></div>
      <div class="search_bar">
        <el-input
          v-model="searchInput"
          class="searchInput"
          placeholder="查找我加入的培训"
          suffix-icon="el-icon-search"
        >
        </el-input>

        <el-button v-show="searchInput" type="primary" size="medium" @click="searchInput = ''">
          重置
        </el-button>
      </div>
    </div>

    <div v-show="listData.length" class="courselist">
      <div v-for="(item, index) in listData" :key="index" class="floor">
        <div class="floor_title">
          <div class="text">
            <div>{{ item.trainName }}</div>
            <span v-show="item.status == 2" class="underway">进行中</span>
            <span v-show="item.status == 1" class="not">未开始</span>
            <span v-show="item.status == 3" class="finished">已结办</span>
          </div>
          <div class="btn">
            <el-button
              v-show="item.status != 3"
              size="medium"
              type="primary"
              @click="toDetail(item.id)"
            >
              前往学习
            </el-button>
            <el-button v-show="item.status == 3" size="medium" @click="toDetail(item.id)">
              查看详情
            </el-button>
          </div>
        </div>
        <div class="floor_type">
          <span class="type_title">培训类型：</span>
          <span v-show="item.trainWay == 1">面授</span>
          <span v-show="item.trainWay == 2">混合</span>
          <span v-show="item.trainWay == 3">在线</span>
        </div>
        <div class="floor_info">
          <div class="info_item">
            <span class="item_title">培训时间：</span>
            <span>{{ item.startTime }}-{{ item.endTime }}</span>
          </div>
          <div class="info_item">
            <span class="item_title">培训讲师：</span>
            <span>{{ item.lecturerName }}</span>
          </div>
          <div class="info_item">
            <span class="item_title">培训地点：</span>
            <span>{{ item.address }}</span>
          </div>
        </div>
        <div v-show="item.status == 3" class="seal">
          <img src="@/assets/images/my_seal.png" alt="" />
        </div>
      </div>
    </div>

    <div v-show="listData.length" class="page">
      <el-pagination
        :page-sizes="[10, 20, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!-- 无数据 -->
    <div v-show="!listData.length" class="content">
      <div class="content_box">
        <img src="@/assets/images/my_noData.png" alt="" />
        <div class="text">
          还没有加入的培训
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { queryTrainList } from '@/api/my'
import { myCourseCatalog } from '@/api/myTask' //查找我参加的培训

export default {
  name: 'Cultivate',
  data() {
    return {
      pitch: 0,
      searchInput: '',
      total: 100,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10, //每页条数
        courseType: '1'
      },
      listData: []
    }
  },
  watch: {
    searchInput: function() {
      this.getInfo()
    }
  },
  activated() {
    this.getInfo()
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 去详情
    toDetail(id) {
      this.$router.push({
        name: 'trainDetail',
        params: {
          trainId: id
        }
      })
    },
    async getInfo() {
      // let res = await queryTrainList({ trainName: this.searchInput, ...this.page })
      // this.listData = res.records
      // this.total = res.total

      let res = await myCourseCatalog({ name: this.searchInput, ...this.page })
      res.data.forEach((elem) => {
        elem.trainName = elem.menuName
      })
      this.listData = res.data || []
      this.total = res.totalNum
    },
    showBtn(i) {
      this.pitch = i
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.cultivate {
  // margin-bottom: -100%;
  .search {
    margin-top: 20px;
    padding: 0 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    .search_btn {
      height: 56px;
      line-height: 56px;
      display: flex;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      letter-spacing: 0;
      span {
        margin-right: 32px;
      }
      .pitch {
        font-weight: bold;
        color: #01aafc;
        border-bottom: 2px solid #01aafc;
      }
    }
    .search_bar {
      padding-top: 11px;
      /deep/.el-input {
        width: 380px;
        margin-right: 16px;
      }
    }
  }
  .courselist {
    width: 1200px;
    .floor {
      height: 118px;
      background: #ffffff;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      border-radius: 4px;
      margin-top: 20px;
      padding: 24px;
      position: relative;
      .floor_title {
        display: flex;
        justify-content: space-between;
        .text {
          display: flex;
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          .underway {
            height: 18px;
            background-color: #fffce6;
            font-size: 12px;
            color: #fcba00;
            text-align: center;
            line-height: 18px;
          }
          .not {
            height: 18px;
            background-color: #e7ffee;
            font-size: 12px;
            color: #00b061;
            text-align: center;
            line-height: 18px;
          }
          .finished {
            height: 18px;
            background-color: #e7fbff;
            font-size: 12px;
            color: #01aafc;
            text-align: center;
            line-height: 18px;
          }
          span {
            margin-top: 5px;
            margin-left: 8px;
            padding: 0 4px;
          }
        }
      }
      .floor_type {
        display: flex;
        font-size: 14px;
        color: #369aff;
        letter-spacing: 0;
        height: 20px;
        .type_title {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
          width: 70px;
        }
      }
      .floor_info {
        // margin-top: 18px;
        display: flex;
        .info_item {
          display: flex;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          span {
            width: 287px;
          }
          .item_title {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.45);
            letter-spacing: 0;
            width: 70px;
          }
        }
      }
      .seal {
        position: absolute;
        top: 25px;
        right: 150px;
        width: 77px;
        height: 77px;
        border-radius: 50%;
        line-height: 77px;
        text-align: center;
        color: #fff;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .page {
    position: relative;
    height: 100px;
    .pagination {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
  .content {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    width: 1200px;
    height: 627px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    .content_box {
      width: 338px;
      height: 290px;
      img {
        width: 100%;
        height: 100%;
      }
      .text {
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
      }
    }
  }
}
</style>
