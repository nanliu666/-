<template>
  <div class="MyFiles">
    <div class="top_box">
      <div class="item_box">
        <div class="item_top">
          <span class="left_">总积分</span> <span class="right_">超过99.99%的人</span>
        </div>
        <div class="item_bottom">
          <span class="left_num">9999</span>
          <el-button size="mini" @click="toIntegralDetail"> 查看详情 </el-button>
        </div>
      </div>
      <div class="item_box">
        <div class="item_top">
          <span class="left_">总学时</span> <span class="right_">超过99.99%的人</span>
        </div>
        <div class="item_bottom">
          <span class="left_num">9999</span>
        </div>
      </div>
      <div class="item_box">
        <div class="item_top">
          <span class="left_">证书</span> <span class="right_">超过99.99%的人</span>
        </div>
        <div class="item_bottom">
          <span class="left_num">9999</span>
          <el-button size="mini" @click="toCertificateDetail"> 查看详情 </el-button>
        </div>
      </div>
    </div>

    <div class="bottom_box">
      <div class="item_box_b">
        <div class="title">
          <i class="el-icon-s-opportunity"></i>
          <span>学习情况</span>
        </div>
        <div class="bottom">
          <ul>
            <li><span class="left_">参加培训 </span> <span class="num">999</span></li>
            <li><span class="left_">参加必修课</span> <span class="num">999</span></li>
            <li><span class="left_">学习选修课</span> <span class="num">999</span></li>
            <li><span class="left_">观看直播</span> <span class="num">999</span></li>
          </ul>
        </div>
      </div>

      <div class="item_box_b">
        <div class="title">
          <i class="el-icon-s-opportunity"></i>
          <span>考试情况</span>
        </div>
        <div class="bottom">
          <ul>
            <li><span class="left_">参加考试 </span> <span class="num">999</span></li>
            <li><span class="left_">通过</span> <span class="num">999</span></li>
          </ul>
        </div>
      </div>

      <div class="item_box_b">
        <div class="title">
          <i class="el-icon-s-opportunity"></i>
          <span>作业情况</span>
        </div>
        <div class="bottom">
          <ul>
            <li><span class="left_">提交作业 </span> <span class="num">999</span></li>
            <li><span class="left_">提交上报材料</span> <span class="num">999</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    toIntegralDetail() {
      this.$router.push({ path: '/Integral' })
    },
    toCertificateDetail() {
      this.$router.push({ path: '/Certificate' })
    }
  }
}
</script>

<style lang="scss" scoped>
.MyFiles {
  .top_box {
    display: flex;
    justify-content: space-between;
    .item_box {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      width: 32%;
      padding: 24px;
      .item_top {
        .left_ {
          font-size: 18px;
        }
        .right_ {
          color: #333;
          margin-left: 24px;
        }
      }
      .item_bottom {
        margin-top: 44px;
        display: flex;
        justify-content: space-between;
        .left_num {
          font-size: 18px;
          font-weight: bold;
          color: #207efa;
        }
      }
    }
  }
  .bottom_box {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    .item_box_b {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      width: 32%;
      .title {
        text-align: center;
        line-height: 50px;
        background-color: #ccc;
        font-size: 18px;
        span {
          margin-left: 10px;
        }
      }
      .bottom {
        padding: 24px;
        height: 220px;
        li {
          display: flex;
          margin-top: 10px;
          .left_ {
            flex: 1;
            text-align: right;
            color: #666;
          }
          .num {
            flex: 1;
            margin-left: 24px;
            color: #207efa;
          }
        }
      }
    }
  }
}
</style>
