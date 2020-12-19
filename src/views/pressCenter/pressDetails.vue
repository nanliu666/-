<template>
  <div class="pressDetails">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/pressList' }">
          新闻中心
        </el-breadcrumb-item>
        <el-breadcrumb-item style="color:rgba(0,11,21,0.85);">
          文章详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content">
      <div class="btnBar">
        <div>
          <el-button
            size="small"
            @click="topressList"
          >
            &nbsp; <i class="icon-fanhui fanhuiicon"></i> &nbsp; 返回上一级
          </el-button>
        </div>
        <div class="btnBar_to">
          <div>
            <el-button
              size="small"
              icon="el-icon-arrow-left"
            >
              &nbsp;上一页
            </el-button>
          </div>
          <div style="margin-left: -1px;">
            <el-button size="small">
              下一页&nbsp;<i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="content_title">
        {{ '信息安全在岗考试必要性在企业发展中的重要性' }}
      </div>
      <div class="content_title_info">
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

      <div class="download">
        <el-button
          type="text"
          icon="el-icon-paperclip"
          style="font-size: 12px;"
        >
          附件下载
        </el-button>
        <span>信息安全在岗考试必要性在企业发展中的重要性</span>
      </div>

      <div class="content_info">
        <div class="info">
          2020年2月6日
          国家发改委、人社部、工信部、总工会发文《关于应对新型冠状病毒感染肺炎疫情，支持鼓励劳动者参与线上职业技能培训的通知》，支持鼓励广大劳动者参加线上职业技能培训。2020年2月6日
          国家发改委、人社部、工信部、总工会发文《关于应对新型冠状病毒感染肺炎疫情，支持鼓励劳动者参与线上职业技能培训的通知》，支持鼓励广大劳动者参加线上职业技能培训。2020年2月6日
          国家发改委、人社部、工信部、总工会发文《关于应对新型冠状病毒感染肺炎疫情，支持鼓励劳动者参与线上职业技能培训的通知》，支持鼓励广大劳动者参加线上职业技能培训。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PressDetails',
  data() {
    return {}
  },
  methods: {
    topressList() {
      this.$router.push({ path: '/pressList' })
    }
  }
}
</script>

<style lang="scss" scoped>
.pressDetails {
  .breadcrumb {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    line-height: 22px;
    margin: 24px 0;
  }
  .content {
    width: 1200px;
    height: 1000px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.1);
    padding: 24px;
    .btnBar {
      display: flex;
      justify-content: space-between;
      .btnBar_to {
        display: flex;
      }
      button {
        line-height: 16px;
        font-weight: bold;
      }
      .fanhuiicon {
        font-size: 10px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        font-weight: bold;
      }
    }
    .content_title {
      opacity: 0.85;
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: #000b15;
      line-height: 34px;
      margin-top: 24px;
    }
    .content_title_info {
      display: flex;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      .info_box {
        margin-right: 24px;
        margin-top: 16px;
      }
    }
    .download {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      border-bottom: 1px solid #ebeced;
      margin-bottom: 25px;
      padding-bottom: 10px;
      span {
        margin-left: 10px;
      }
    }
    .info {
      opacity: 0.65;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #000b15;
      line-height: 22px;
    }
  }
}
</style>
