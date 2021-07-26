<template>
  <!-- 大盒子 -->
  <div>
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />

    <div v-show="!shuowItem" class="course">
      <div class="search">
        <div class="search_bar">
          <el-input
            v-model.trim="searchInput"
            class="searchInput"
            placeholder="输入证书名称搜索"
            suffix-icon="el-icon-search"
          >
          </el-input>
          <!-- 
          <el-button v-show="searchInput" type="primary" size="medium">
            重置
          </el-button> -->
        </div>
      </div>

      <div v-show="certificateData.length" class="courselist">
        <div
          v-for="(item, index) in certificateData"
          :key="index"
          class="course_item"
          @click="clickItem(item)"
        >
          <!-- <div class="preview_right_in">
            <div class="preview_right_box">
              <img :src="item.backUrl" alt="" class="bgimg" />
              <div class="name">
                {{ item.templateName }}
              </div>
              <div class="text">
                {{ item.text }}
              </div>
              <div class="awardAgency">
                {{ item.awardAgency }}
              </div>
              <img :src="item.logoUrl" alt="" class="logo" />
              <div class="studentName">
                {{ item.stuName }}
              </div>
              <div class="serial">
                <div>证书编号:</div>
                <div>{{ item.certificateNo }}</div>
                <div>{{ item.grantTime }}</div>
              </div>
              <span v-if="item.status == 3" class="status">
                已失效
              </span>
            </div>
          </div> -->
          <div class="preview_right_in">
            <CertificateComponents
              class="CertificateComponents"
              :certificate-data="item"
            ></CertificateComponents>
          </div>

          <div class="text">
            <div class="text_title">
              {{ item.templateName }}
            </div>
          </div>

          <div class="particulars">查看详情</div>
        </div>
      </div>

      <div v-show="certificateData.length" class="page">
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

    <!-- 无数据 -->
    <div v-show="!certificateData.length" class="contentShow">
      <div class="content_box">
        <img src="@/assets/images/my_noData.png" alt="" />
        <div class="text">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { certificateList } from '@/api/my'
import CertificateComponents from './CertificateComponents'
export default {
  name: 'Course',
  components: {
    CertificateComponents,
    CommonBreadcrumb: () => import('@/components/common-breadcrumb/Breadcrumb')
  },
  data() {
    return {
      routeList: [
        {
          path: '/personal',
          title: '我的档案'
        },
        {
          path: '',
          title: '证书'
        }
      ],
      sondata: {},
      pitch: 0,
      searchInput: '',
      total: 100,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      },
      shuowItem: false,
      certificateData: []
    }
  },
  watch: {
    searchInput: function() {
      this.page.pageNo = 1
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
    async getInfo() {
      let res = await certificateList({ name: this.searchInput, ...this.page })
      this.certificateData = res.data
      this.total = res.totalNum
    },
    sonBtn(br) {
      this.shuowItem = !br
    },
    clickItem(item) {
      this.$router.push({ path: '/CertificateDetail', query: { item: JSON.stringify(item) } })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getInfo()
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

    // height: 60px;
    .search_bar {
      padding: 24px 0;
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
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 20px;
      margin-right: 20px;

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
        height: 60px;
        font-size: 14px;
        color: #000b15;
        line-height: 60px;
        padding-left: 16px;
        .text_title {
          padding-top: 10px;
        }
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
        height: 187px;
        background: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        color: #ffffff;
        line-height: 187px;
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
.preview_right_in {
  //   padding-left: 50px;
  //   padding-top: 20px;
  width: 285px;
  height: 166px;
  position: relative;
  .CertificateComponents {
    position: absolute;
    top: -260px;
    left: -357px;
    transform: scale(0.28, 0.27);
  }

  border-radius: 4px 4px 0 0;
}
.contentShow {
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  width: 100%;
  height: 500px;
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
</style>
