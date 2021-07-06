<template>
  <div v-loading="loading" class="compulsoryCourses">
    <ul class="items">
      <li
        v-for="(item, index) in listData"
        :key="index"
        class="item"
        :class="{ complete: item.totalPrecent == 100 }"
        @click="goDetail(item)"
      >
        <div class="item_img">
          <img :src="item.coverUrl" />
          <span v-if="item.status == 1" class="span1">未开始</span>
          <span v-if="item.status == 2" class="span2">进行中</span>
          <span v-if="item.status == 3" class="span3">已结束</span>
        </div>

        <div class="item_title">
          {{ item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name }}
        </div>

        <div class="item_submitted">
          作业提交次数<span style="margin-left: 15px">{{ item.jobTimes }}/{{ item.jobNum }}</span>
        </div>

        <div v-if="item.jobPercent == 100" class="item_complete">
          <img src="@/assets/images/my_seal.png" alt="" />
        </div>
      </li>
    </ul>

    <div v-if="total" class="page">
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

    <div v-else style="text-align: center">
      <img src="@/assets/images/nodata.png" />
      <div>暂无数据</div>
    </div>
  </div>
</template>
<script>
import { requiredWorkList } from '@/api/myTask'
export default {
  data() {
    return {
      total: 0,
      page: {
        pageNo: 1, //请求页码
        pageSize: 8 //每页条数
      },
      listData: [],
      loading: false
    }
  },
  created() {
    this.getCompulsoryCoursesg()
  },
  methods: {
    // 跳转详情页
    goDetail(data) {
      this.$router.push({ path: '/myTask/compulsoryDetail', query: { id: data.id } })
    },
    async getCompulsoryCoursesg() {
      let params = {
        ...this.page
      }
      this.loading = true
      await requiredWorkList(params)
        .then((res) => {
          this.listData = res.data
          this.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleSizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getCompulsoryCoursesg()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getCompulsoryCoursesg()
    }
  }
}
</script>

<style scoped lang="scss">
.compulsoryCourses {
  background-color: #f9fafa;
  .items {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 285px;
      height: 282px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      transition-duration: 0.3s;
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
        padding: 16px 16px 10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #000b15;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
      }
      &_submitted {
        opacity: 0.65;
        padding-left: 16px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #000b15;
        line-height: 18px;
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
