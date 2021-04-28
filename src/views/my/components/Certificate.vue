<template>
  <!-- 大盒子 -->
  <div>
    <div v-show="!shuowItem" class="course">
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

          <el-button v-show="searchInput" type="primary" size="medium">
            重置
          </el-button>
        </div>
      </div>

      <div v-show="certificateData.length" class="courselist">
        <div
          v-for="(item, index) in certificateData"
          :key="index"
          class="course_item"
          @click="clickItem(item)"
        >
          <div class="preview_right_in">
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
            </div>
          </div>

          <div class="text">
            <div class="text_title">
              {{ item.templateName }}
            </div>
          </div>

          <div class="particulars">
            查看详情
          </div>
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
    <certificate-detail v-show="shuowItem" :sondata="sondata" @ChangeBtn="sonBtn">
    </certificate-detail>

    <!-- 无数据 -->
    <div v-show="!certificateData.length" class="contentShow">
      <div class="content_box">
        <img src="@/assets/images/my_noData.png" alt="" />
        <div class="text">
          还没有取得的证书
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { certificateList } from '@/api/my'
export default {
  name: 'Course',
  components: {
    certificateDetail: () => import('./CertificateDetail')
  },
  data() {
    return {
      sondata: '123',
      imgurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608289740056&di=00f8f4b767c42fa1c8548b4e6731e4e8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F23%2F20190123150727_byuwj.jpg',
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
      this.sondata = item
      this.shuowItem = !this.shuowItem
    },
    handleSizeChange(val) {
      this.page.pageSize = val
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
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
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      position: relative;
      cursor: pointer;
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

  border-radius: 4px 4px 0 0;
  .preview_right_box {
    margin-top: 20px;
    transform: scale(0.25);
    // position: relative;
    position: absolute;
    top: -305px;
    left: -436px;
    border: 1px solid #d9dbdc;
    width: 1152px;
    height: 755px;
    .awardAgency {
      position: absolute;
      bottom: 100px;
      left: 500px;
      z-index: 99;
    }
    .bgimg {
      display: block;
      width: 100% !important;
      height: 100% !important;
      z-index: -1;
    }
    .name {
      position: absolute;
      top: 146px;
      left: 50%;
      font-size: 64px;
      color: #ab856a;
      transform: translateX(-50%);
      text-align: center;
      width: 80%;
      font-weight: 600;
    }
    .text {
      position: absolute;
      top: 490px;
      left: 50%;
      transform: translateX(-50%);
      width: 50%;
      height: 28%;
      opacity: 0.65;
      font-size: 18px;
      color: #000b15;
      text-align: auto;
      line-height: 28px;
    }
    .logo {
      position: absolute;
      top: 560px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 80px;
    }
    .studentName {
      position: absolute;
      top: 386px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.85;
      font-size: 40px;
      color: #000b15;
      text-align: center;
    }
    .serial {
      position: absolute;
      right: 117px;
      bottom: 80px;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      line-height: 28px;
    }
  }
}
.contentShow {
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
</style>
