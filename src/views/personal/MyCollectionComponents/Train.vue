<template>
  <div class="Train">
    <ul>
      <li v-for="(item, index) in 20" :key="index">
        <div class="title">
          <div>JAVA编辑培训</div>
          <span>进行中</span> <span>已完成</span> <span>未开始</span>
        </div>

        <div class="row">
          <div class="type">
            <span class="type_nth">培训类型：</span>
            <span class="type_">在线</span>
          </div>
          <div class="btn">
            <el-button size="medium" type="primary"> 前往学习 </el-button>
          </div>
        </div>

        <div class="text">
          <div><span>培训时间：</span> <span>2018年10月10日 —2018年11月11日</span></div>
          <div><span>培训讲师：</span> <span>马云</span></div>
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
    li {
      margin-top: 24px;
      position: relative;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      padding: 24px;
      position: relative;
      .title {
        display: flex;
        div {
          font-size: 18px;
          font-weight: bold;
          color: #666;
          height: 40px;
          line-height: 40px;
        }
        span {
          margin-left: 24px;
          margin-top: 9px;
          width: 60px;
          height: 25px;
          line-height: 25px;
          font-size: 12px;
          text-align: center;
          background-color: pink;
          color: #f30;
        }
      }
      .row {
        display: flex;
        justify-content: space-between;
        .type_ {
          color: #207efa;
          margin-left: 10px;
        }
      }
      .text {
        display: flex;
        div {
          width: 50%;
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
