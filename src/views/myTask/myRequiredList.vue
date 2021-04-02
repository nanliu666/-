<template>
  <div class="myRequiredList">
    <ul class="items">
      <li
        v-for="(item, index) in listData"
        :key="index"
        class="item"
        :class="{ complete: item.totalPrecent == 100 }"
        @click="goDetail(item)"
      >
        <div class="item_img">
          <img :src="item.coverUrl" alt="" />
          <span v-if="item.status == 1" class="span1">未开始</span>
          <span v-if="item.status == 2" class="span2">进行中</span>
          <span v-if="item.status == 3" class="span3">已结束</span>
        </div>

        <div class="item_title">
          {{ item.menuName }}
        </div>

        <div class="item_time">{{ item.startTime }} ~ {{ item.endTime }}</div>

        <div class="item_Rate">
          <!-- <el-rate
            v-model="valueRate"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate> -->
        </div>

        <div v-if="item.totalPrecent == 100" class="item_complete">
          <img src="@/assets/images/my_seal.png" alt="" />
        </div>
      </li>
    </ul>

    <div class="page">
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
  </div>
</template>
<script>
import { myCourseCatalog } from '@/api/myTask'
export default {
  data() {
    return {
      valueRate: 4.5,
      total: 0,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      },
      listData: []
    }
  },
  created() {
    this.getmyCourseCatalog()
  },
  activated() {
    // this.getmyCourseCatalog()
  },
  methods: {
    // 跳转详情页
    goDetail(item) {
      this.$router.push({ path: '/myRequiredDetails', query: { item: JSON.stringify(item) } })
    },
    async getmyCourseCatalog() {
      let params = {
        courseType: 0,
        studyType: 0,
        ...this.page
      }

      let res = await myCourseCatalog(params)
      this.listData = res.data
      this.total = res.totalNum
    },

    handleSizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getmyCourseCatalog()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getmyCourseCatalog()
    }
  }
}
</script>

<style scoped lang="scss">
.myRequiredList {
  .items {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 273px;
      height: 276px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      transition-duration: 0.1s;
      margin-right: 20px;
      margin-top: 20px;
      position: relative;
      cursor: pointer;
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
      &_img {
        width: 100%;
        height: 172px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .span1 {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #fffce6;
          border-radius: 4px;
          font-size: 10px;
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #fcba00;
          font-style: none;
        }
        .span2 {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #e7ffee;
          border-radius: 4px;
          font-size: 10px;
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #00b061;
          font-style: none;
        }
        .span3 {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #e7fbff;
          border-radius: 4px;
          font-size: 10px;
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #01aafc;
          font-style: none;
        }
      }
      &_title {
        width: 100%;
        padding: 16px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #000b15;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
      }
      &_time {
        padding: 3px 16px;
        opacity: 0.65;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #000b15;
        // border-bottom: 1px solid #ebeced;
        margin-top: -10px;
        line-height: 28px;
      }
      &_Rate {
        padding: 4px 16px;
      }
      &_complete {
        position: absolute;
        bottom: 5px;
        right: 9px;
        overflow: hidden;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .page {
    height: 50px;
    position: relative;
    .pagination {
      position: absolute;
      right: 24px;
      bottom: 0px;
    }
  }
  .complete {
    opacity: 0.6;
  }
}
</style>
