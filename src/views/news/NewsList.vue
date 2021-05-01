<template>
  <div class="newsList">
    <div class="title">
      <div class="search">
        <el-input
          v-model="searchInput"
          class="searchInput"
          placeholder="请输入标题关键字搜索"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div>
      <div class="btnBar">
        <el-button class="btn" :class="{ pitch: pitch === 0 }" type="text" @click="showpitch(0)">
          最新新闻
        </el-button>
        <el-button class="btn" :class="{ pitch: pitch === 1 }" type="text" @click="showpitch(1)">
          热门新闻
        </el-button>
      </div>
    </div>

    <div
      v-for="(item, index) in data"
      :key="index"
      class="list"
      @click="tonewsDetails(item, index)"
    >
      <div class="list_box_l">
        <img :src="item.picUrl" :onerror="errorImg" alt="" />
      </div>
      <div class="list_box_r">
        <div class="list_box_r_title">
          {{ item.title }}
        </div>
        <div class="list_box_r_info">
          <div class="info_box">
            <span class="info_title"> 创建人 :&nbsp;</span>
            <span class="info_val">{{ item.userName }}</span>
          </div>
          <div class="info_box">
            <span class="info_title">创建时间 :&nbsp;</span>
            <span class="info_val">{{ item.createTime }}</span>
          </div>
          <div class="info_box">
            <span class="info_title">阅读量 :&nbsp;</span>
            <span class="info_val">{{ item.hits }}</span>
          </div>
        </div>
        <div v-show="item.isTop && pitch == 0" class="showTop">
          置顶
        </div>
      </div>
    </div>

    <div class="page" v-show="data.length">
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
    <!-- 无数据 -->
    <div v-show="!data.length" class="content">
      <div class="content_box">
        <img src="@/assets/images/my_noData.png" alt="" />
        <div class="text">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { newsList } from '@/api/pressCenter/pressCenter'
export default {
  name: 'NewsList',
  data() {
    return {
      errorImg: 'this.src="' + require('@/assets/images/newsBg.png') + '"',
      searchInput: '',
      pitch: 0,
      total: 0,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      },
      data: []
    }
  },

  watch: {
    searchInput: function() {
      this.isnewsList()
    }
  },
  created() {
    this.isnewsList()
  },

  methods: {
    // 拿数据
    async isnewsList() {
      if (this.searchInput != '') {
        this.page.pageNo = 1
      }
      let params = { ...this.page, isHot: this.pitch, search: this.searchInput }
      let res = await newsList(params)

      this.data = res.data
      this.total = res.totalNum
    },

    tonewsDetails(row, index) {
      // this.$router.push({ path: '/pressDetails' })

      this.$router.push({
        path: '/news/Details',
        query: {
          id: row.id,
          hits: row.hits,
          index,
          total: this.total,
          isHot: this.pitch
        }
      })
    },
    showpitch(i) {
      this.pitch = i
      this.isnewsList()
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.page.pageSize = val
      this.isnewsList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.page.pageNo = val
      this.isnewsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.newsList {
  width: 100%;
  .title {
    width: 1200px;
    height: 145px;
    margin: 20px auto 0;
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
    margin-top: 20px;
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
    margin-top: 20px;
    height: 50px;
    position: relative;
    .pagination {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .content {
    box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
    background: #ffffff;
    border-radius: 4px;
    width: 1200px;
    height: 627px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    .content_box {
      width: 338px;
      height: 290px;
      img {
        width: 100%;
        height: 100%;
      }
      .text {
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
      }
    }
  }
}
</style>
