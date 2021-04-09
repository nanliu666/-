<template>
  <div class="compulsoryCourses">
    <ul class="items">
      <li v-for="(item, index) in 12" :key="index" class="item" @click="goDetail(item)">
        <div class="item_img">
          <img :src="require('@/assets/images/photo1.jpg')" />
        </div>

        <div class="item_title">必须课标题必须课标题必须课标题</div>

        <div class="item_time">作业提交次数<span style="margin-left: 15px">15/55</span></div>
      </li>
    </ul>

    <div v-if="!total" class="page">
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
export default {
  data() {
    return {
      total: 0,
      page: {
        pageNo: 1, //请求页码
        pageSize: 12 //每页条数
      },
      listData: []
    }
  },
  created() {
    this.getCompulsoryCoursesg()
  },
  methods: {
    // 跳转详情页
    goDetail() {},
    async getCompulsoryCoursesg() {},

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
  .items {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 273px;
      height: 276px;
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
}
</style>
