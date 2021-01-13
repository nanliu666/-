<template>
  <div class="course">
    <div class="search">
      <div class="search_btn">
        <span
          :class="{ pitch: pitch === 1 }"
          style="cursor:pointer;"
          @click="showBtn(1)"
        >线上课程</span>
        <span
          :class="{ pitch: pitch === 3 }"
          style="cursor:pointer;"
          @click="showBtn(3)"
        >直播课程</span>
      </div>
      <div class="search_bar">
        <el-input
          v-show="pitch === 1"
          v-model="searchInput"
          class="searchInput"
          placeholder="查找我的线上课程"
          suffix-icon="el-icon-search"
        >
        </el-input>
        <el-input
          v-show="pitch === 3"
          v-model="searchInput"
          class="searchInput"
          placeholder="查找我的直播课程"
          suffix-icon="el-icon-search"
        >
        </el-input>

        <el-button
          v-show="searchInput"
          type="primary"
          size="medium"
          @click="searchInput = ''"
        >
          重置
        </el-button>
      </div>
    </div>

    <div
      v-show="formData.length"
      class="courselist"
    >
      <div
        v-for="(item, index) in formData"
        :key="index"
        class="course_item"
        @click="toDetail(item)"
      >
        <img :src="item.url" />
        <div class="text">
          <div class="text_title">
            {{ item.name }}
          </div>
          <el-progress
            :percentage="item.progressData"
            :show-text="false"
          ></el-progress>
          <div class="text_in">
            已学习{{ item.userPeriod || 0 }}/{{ item.period }}课时
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="formData.length"
      class="page"
    >
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
    <div
      v-show="!formData.length"
      class="content"
    >
      <div class="content_box">
        <img
          src="@/assets/images/my_noData.png"
          alt=""
        />
        <div class="text">
          还没有加入的课程
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { courseList } from '@/api/my'
export default {
  name: 'Course',
  data() {
    return {
      formData: [],
      pitch: 1,
      searchInput: '',
      total: 100,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      }
    }
  },
  watch: {
    searchInput: function() {
      this.getInfo()
    }
  },
  activated() {
    this.getInfo()
  },
  created() {
    this.getInfo()
  },
  methods: {
    toDetail(item) {
      this.$router.push({ path: '/course/detail', query: { id: item.id } })
    },
    showBtn(i) {
      this.pitch = i
      this.getInfo()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getInfo()
    },
    async getInfo() {
      let params = {
        name: this.searchInput,
        type: this.pitch //课程类型(1：在线 ；2：面授；3：直播)
      }
      let res = await courseList({ ...params, ...this.page })
      this.formData = res.data
      // progressData
      this.formData.map((item) => {
        item.progressData = (item.userPeriod / item.period) * 100
      })
      this.total = res.totalNum
    }
  }
}
</script>

<style lang="scss" scoped>
.course {
  // margin-bottom: -100%;
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
      cursor: pointer;
      &:nth-child(4n) {
        margin-right: 0;
      }
      img {
        width: 285px;
        height: 172px;
      }
      .text {
        width: 285px;
        height: 114px;
        padding: 16px;
        font-size: 14px;
        color: #000b15;
      }
      .text_in {
        font-size: 12px;
        color: #000b15;
      }
      /deep/.el-progress {
        margin: 10px 0;
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
  .content {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-top: 20px;
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
