<template>
  <div class="Train">
    <ul>
      <li v-for="(item, index) in 20" :key="index">
        <div class="img">
          <img :src="require('@/assets/images/required_bg.png')" alt="" />
        </div>

        <div class="title">
          直播标题直播标题直播标题直播标题直播标题直播标题
        </div>

        <div class="rog">
          研发能力中心 > UCD中心
        </div>

        <div class="row">
          <div class="name">赵老师</div>
          <div class="tate">每月1号/15号08:00:00</div>
        </div>
        <span class="type"> 未开始 </span>
        <span class="star" @click="Collection">
          <i class="el-icon-star-on"> </i>
        </span>
      </li>
    </ul>

    <div class="page">
      <el-pagination
        :current-page="page.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        pageSize: 20,
        totalNum: 0,
        pageNo: 1
      }
    }
  },
  methods: {
    Collection() {
      this.$confirm('确定要取消收藏该课程吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '已操作成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.refreshData()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.loadCourseList()
    }
  },
  loadCourseList() {}
}
</script>

<style lang="scss" scoped>
.Train {
  ul {
    display: flex;
    flex-wrap: wrap-reverse;
    li {
      width: 23%;
      margin-top: 2.5%;
      margin-right: 2.5%;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      position: relative;
      &:nth-child(4n) {
        margin-right: 0;
      }
      .img {
        width: 100%;
        img {
          width: 100%;
        }
      }
      .title {
        font-size: 14px;
        color: #666;
        font-weight: bold;
        padding: 5px 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .rog {
        font-size: 14px;
        color: #999;
        padding: 5px 10px;
      }
      .row {
        font-size: 14px;
        color: #999;
        display: flex;
        padding: 5px 10px;
        justify-content: space-between;
      }
      .type {
        position: absolute;
        top: 0;
        right: 0;
        width: 55px;
        height: 22px;
        background-color: rgba(187, 91, 91, 0.548);
        text-align: center;
        color: #fff;
        font-size: 12px;
        line-height: 22px;
      }
      .star {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 22px;
        color: red;
        cursor: pointer;
      }
    }
  }
  .page {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
