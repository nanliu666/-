<template>
  <!-- 大盒子 -->
  <div>
    <div class="course">
      <div class="search">
        <div class="search_btn"></div>
        <div class="search_bar">
          <el-input
            v-model="searchInput"
            class="searchInput"
            placeholder="查找我的证书"
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
        <div
          v-for="(item, index) in 5"
          :key="index"
          class="course_item"
        >
          <img
            :src="imgurl"
            alt=""
          />
          <div class="text">
            <div class="text_title">
              信息安全在岗考试必要性在企业发展中
            </div>
          </div>

          <div class="particulars">
            查看详情
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
  </div>
</template>

<script>
export default {
  name: 'Course',
  data() {
    return {
      imgurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608289740056&di=00f8f4b767c42fa1c8548b4e6731e4e8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F23%2F20190123150727_byuwj.jpg',
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
.course {
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
    display: flex;
    flex-wrap: wrap;
    .course_item {
      width: 285px;
      background: #fff;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 20px;
      margin-right: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      position: relative;
      &:nth-child(4n) {
        margin-right: 0;
      }
      img {
        width: 285px;
        height: 166px;
      }
      .text {
        width: 285px;
        height: 54px;
        font-size: 14px;
        color: #000b15;
        line-height: 54px;
        padding-left: 16px;
      }
      .text_in {
        font-size: 12px;
        color: #000b15;
      }
      /deep/.el-progress {
        margin: 10px 0;
      }
      .particulars {
        position: absolute;
        top: 0;
        left: 0;
        width: 285px;
        height: 166px;
        background: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        color: #ffffff;
        line-height: 166px;
        text-align: center;
        display: none;
      }
    }
    .course_item:hover .particulars {
      display: block;
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
}
</style>
