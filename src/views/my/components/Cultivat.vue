<template>
  <div class="cultivate">
    <div class="search">
      <div class="search_btn">
        <span
          :class="{ pitch: pitch === 0 }"
          @click="showBtn(0)"
        >线上课程</span>
        <span
          :class="{ pitch: pitch === 1 }"
          @click="showBtn(1)"
        >直播课程</span>
      </div>
      <div class="search_bar">
        <el-input
          v-model="searchInput"
          class="searchInput"
          placeholder="信息技术"
          suffix-icon="el-icon-search"
        >
        </el-input>

        <el-button
          v-show="searchInput"
          type="primary"
          size="medium"
        >
          重置
        </el-button>
      </div>
    </div>

    <div class="courselist">
      <div class="floor">
        <div class="floor_title">
          <div class="text">
            <div>java编程培训</div>
            <span class="underway">进行中</span>
            <span class="not">未开始</span>
            <span class="finished">已结办</span>
          </div>
          <div class="btn">
            <el-button
              size="medium"
              type="primary"
            >
              前往学习
            </el-button>
          </div>
        </div>
      </div>
    </div>

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
export default {
  name: 'Cultivate',
  data() {
    return {
      pitch: 0,
      searchInput: '',
      total: 100,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      }
    }
  },
  methods: {
    showBtn(i) {
      this.pitch = i
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.page.pageSize = val
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.page.pageNo = val
    }
  }
}
</script>

<style lang="scss" scoped>
.cultivate {
  margin-bottom: -100%;

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
      background-color: pink;
      margin-top: 20px;
      padding: 24px;
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
    }
  }

  .page {
    position: relative;
    height: 150px;
    .pagination {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
}
</style>
