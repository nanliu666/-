<template>
  <div class="pressList">
    <div class="title">
      <div class="search">
        <el-input
          v-model="searchInput"
          class="searchInput"
          placeholder="培训名称/讲师"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div>
      <div class="btnBar">
        <el-button
          class="btn"
          :class="{ pitch: pitch === 0 }"
          type="text"
          @click="showpitch(0)"
        >
          最新新闻
        </el-button>
        <el-button
          class="btn"
          :class="{ pitch: pitch === 1 }"
          type="text"
          @click="showpitch(1)"
        >
          热门新闻
        </el-button>
      </div>
    </div>

    <div
      v-for="(item, index) in 10"
      :key="index"
      class="list"
      @click="topressDetails"
    >
      <div class="list_box_l">
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608289740056&di=00f8f4b767c42fa1c8548b4e6731e4e8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F23%2F20190123150727_byuwj.jpg"
          alt=""
        />
      </div>
      <div class="list_box_r">
        <div class="list_box_r_title">
          信息安全在岗考试必要性在企业发展中的重要性
        </div>
        <div class="list_box_r_info">
          <div class="info_box">
            <span class="info_title"> 创建人 :&nbsp;</span>
            <span class="info_val">{{ '撒贝宁' }}</span>
          </div>
          <div class="info_box">
            <span class="info_title">创建时间 :&nbsp;</span>
            <span class="info_val">{{ '2020-02-15 14:00:22' }}</span>
          </div>
          <div class="info_box">
            <span class="info_title">阅读量 :&nbsp;</span>
            <span class="info_val">{{ '112' }}</span>
          </div>
        </div>
        <div class="showTop">
          置顶{{ index }}
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
import { newsList } from '@/api/pressCenter/pressCenter'
export default {
  name: 'PressList',
  data() {
    return {
      searchInput: '',
      pitch: 0,
      total: 100,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      }
    }
  },
  created() {
    // console.log(11111111)
    // this.getInfo()
  },
  methods: {
    topressDetails() {
      this.$router.push({ path: '/pressDetails' })
    },

    async getInfo() {
      let res = await newsList(this.page)
      window.console.log(res)
    },
    showpitch(i) {
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
.pressList {
  width: 100%;
  height: 100vh;
  margin-bottom: -600px;
  .title {
    width: 1200px;
    height: 145px;
    margin: 20px auto;
    padding: 24px 24px 0;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.1);
    border-radius: 4px;
    .search {
      .searchInput {
        width: 380px;
        margin-bottom: 16px;
      }
      border-bottom: 1px solid #ebeced;
    }
    .btnBar {
      padding-top: 25px;
      border-radius: 0;
      .btn {
        border-radius: 0;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
        font-weight: bold;
      }
      .pitch {
        border-bottom: 2px solid #01aafc;
        color: #01aafc;
        font-weight: 600;
      }
    }
  }
  .list {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.1);
    border-radius: 4px;
    width: 1200px;
    height: 134px;
    padding: 24px;
    margin-bottom: 20px;
    display: flex;
    position: relative;
    .list_box_l {
      width: 114px;
      height: 86px;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .list_box_r {
      margin-left: 24px;
      .list_box_r_title {
        font-size: 18px;
        color: #000b15;
        line-height: 28px;
        font-weight: bold;
        padding-top: 10px;
      }
      .list_box_r_info {
        display: flex;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        .info_box {
          margin-right: 24px;
          margin-top: 16px;
        }
      }
    }
    .showTop {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 40px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border: 1px solid #d9dbdc;
      border-radius: 4px;
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
    }
  }
  .page {
    height: 100px;
    position: relative;
    .pagination {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
