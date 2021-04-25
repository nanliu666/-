<template>
  <div class="Course">
    <ul>
      <li v-for="(item, index) in 20" :key="index">
        <div class="img"><img :src="imgUrl" alt="" /></div>
        <div class="title">课程标题课程标题课程标题</div>
        <div class="info">
          <span class="name"> 李晓明 </span>
          <span class="study"> <i class="el-icon-bell"></i> 学习 30</span>
        </div>
        <div class="score">
          <el-rate
            v-model="scoreValue"
            disabled
            show-score
            text-color="#666"
            score-template="{value}"
          >
          </el-rate>
          <span> 分 </span>
        </div>
        <span class="btn" @click="Collection">
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
      scoreValue: 4,
      imgUrl: require('@/assets/images/required_bg.png'),

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
.Course {
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
      }
      .info {
        padding: 0 10px;
        font-size: 12px;
        color: #999;
      }
      .score {
        display: flex;
        padding: 5px 10px;
        border-top: 1px solid #ccc;
        margin-top: 10px;
        span {
          color: #666;
          font-size: 12px;
        }
      }
      .btn {
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        color: #ff3040;
        font-size: 30px;
      }
    }
  }
  .page {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
