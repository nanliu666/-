<template>
  <div class="Train">
    <ul>
      <li v-for="(item, index) in 18" :key="index">
        <div class="title">
          产品运营十大技巧
        </div>

        <div class="row">
          <span>黄晓萌 </span>
          <span> <i class="el-icon-view"></i> 99 </span>
          <span> <i class="el-icon-sort"></i> 99 </span>
          <span> <i class="el-icon-star-on"></i> 99 </span>
        </div>

        <div class="score">
          <div class="score-r">
            <el-rate
              v-model="scoreValue"
              disabled
              show-score
              text-color="#666"
              score-template="{value}"
            >
            </el-rate>
            分
          </div>
          <div class="score-d">
            <div>12/12</div>
            <div>12:12</div>
          </div>
        </div>

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
      scoreValue: 4.5,
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
      width: 31.66%;
      margin-top: 2.5%;
      margin-right: 2.5%;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      overflow: hidden;
      position: relative;
      &:nth-child(3n) {
        margin-top: 2.5%;
        margin-right: 0;
      }
      .title {
        font-size: 16px;
        color: #666;
        padding: 15px;
      }
      .row {
        padding: 10px 15px;
        color: #999;
        span {
          margin-right: 15px;
        }
      }

      .score {
        border-top: 1px solid #ccc;
        padding: 15px 40px 0px 15px;
        display: flex;
        justify-content: space-between;
        color: #666;
        .score-r {
          display: flex;
          font-size: 12px;
        }
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
