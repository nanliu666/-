<template>
  <div class="MyFiles">
    <div class="top_box">
      <div class="item_box">
        <div class="item_top">
          <span class="left_">{{ infoData.totalScore || 0 }}</span>
          <span class="right_" @click="toIntegralDetail"><el-button size="small" type="text"> 查看 </el-button></span>
        </div>
        <div class="item_in">总积分</div>
        <div class="item_bottom">超过{{ toFixedFn(infoData.scoreExceed) || 0 }}%的人</div>
        <div class="link"></div>
      </div>

      <div class="item_box">
        <div class="item_top">
          <span class="left_">{{ infoData.totalPeriod || 0 }}h</span>
        </div>
        <div class="item_in">总学时</div>
        <div class="item_bottom">超过{{ toFixedFn(infoData.periodExceed) || 0 }}%的人</div>
        <div class="link"></div>
      </div>
      <div class="item_box">
        <div class="item_top">
          <span class="left_">{{ infoData.totalCertificate || 0 }}</span>
          <span class="right_" @click="toCertificateDetail"><el-button size="small" type="text"> 查看 </el-button></span>
        </div>
        <div class="item_in">证书</div>
        <div class="item_bottom">超过{{ toFixedFn(infoData.certificateExceed) || 0 }}%的人</div>
      </div>
    </div>

    <div class="bottom_box">
      <div class="item_box_b">
        <div class="title">
          <img :src="require('../../../../public/img/personal/Learningsituation.png')" alt="" />
          <span>学习情况</span>
        </div>
        <div class="bottom">
          <ul>
            <li @click="toDetail('myLearn', 'myTrainList')">
              参加培训 <span class="num">{{ infoData.totalTrain || 0 }}</span> 个
            </li>
            <li @click="toDetail('myLearn', 'myRequiredList')">
              参加必修课 <span class="num">{{ infoData.totalRequiredCourse || 0 }}</span> 个
            </li>
            <li @click="toDetail('myLearn', 'myElectiveList')">
              学习选修课 <span class="num">{{ infoData.totalOptionalCourse || 0 }}</span> 个
            </li>
            <li @click="toDetail('myLearn', 'myLiveList')">
              观看直播 <span class="num">{{ infoData.totalLive || 0 }}</span> 场
            </li>
          </ul>
        </div>
      </div>

      <div class="item_box_b">
        <div class="title">
          <img :src="require('../../../../public/img/personal/Examinationsituation.png')" alt="" />
          <span>考试情况</span>
        </div>
        <div class="bottom">
          <ul>
            <li @click="toDetail('myExamList', '')">
              参加考试 <span class="num1">{{ infoData.totalExam || 0 }}</span> 场
            </li>
            <li @click="toDetail('myExamList', '')">
              通过 <span class="num1">{{ infoData.totalExamPass || 0 }}</span> 场
            </li>
          </ul>
        </div>
      </div>
      <div class="item_box_b">
        <div class="title">
          <img :src="require('../../../../public/img/personal/Knowledgelearned.png')" alt="" />
          <span>学过的知识</span>
        </div>
        <div class="bottom">
          <ul>
            <li style="cursor: auto">
              下载知识 <span class="num2">{{ infoData.downloadKnowledge || 0 }}</span> 个
            </li>
            <li style="cursor: auto">
              分享知识 <span class="num2">{{ infoData.totalShareKnowledge || 0 }}</span> 个
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statistics } from '@/api/personal'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      infoData: {}
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    this.isstatistics()
  },
  methods: {
    toFixedFn(i) {
      if (i) return Number(i).toFixed(2)
    },
    async isstatistics() {
      let { response } = await statistics({ userId: this.userId })
      this.infoData = response
    },
    toDetail(o, t) {
      this.$router.push({
        path: '/myTask',
        query: { clickData: o, clickDataIn: t }
      }) // clickData一级，clickDataIn二级
    },
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
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    display: flex;
    .item_box {
      width: 33.33%;
      padding: 48px;
      position: relative;
      .item_top {
        display: flex;
        justify-content: space-between;
        .left_ {
          font-family: DINAlternate-Bold;
          font-size: 36px;
          color: #f5c200;
          line-height: 32px;
          font-weight: 700;
        }
        .right_ {
          padding: 0 14px;
          border: 1px solid #2875d4;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background-color: #f0f9ff;
          }
        }
      }
      .item_in {
        margin-top: 8px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        font-weight: 400;
      }
      .item_bottom {
        margin-top: 24px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(0, 11, 21, 0.45);
        font-weight: 400;
      }
      .link {
        background: rgba(0, 11, 21, 0.08);
        width: 1px;
        height: 100px;
        position: absolute;
        top: 58px;
        right: 0;
      }
    }
  }
  .bottom_box {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .item_box_b {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      width: 32%;
      padding: 24px;
      .title {
        img {
          display: block;
          width: 80px;
          height: 80px;
          margin: 28px auto 0;
        }
        span {
          display: block;
          margin-top: 24px;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #000b15;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 400;
          text-align: center;
        }
      }
      .bottom {
        margin-top: 32px;
        padding: 24px;
        height: 283px;
        border-top: 1px solid rgba(0, 11, 21, 0.08);
        li {
          cursor: pointer;
          margin-top: 24px;
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 400;
          .num {
            color: #f5c201;
            padding: 0 5px;
            font-size: 16px;
            font-weight: bold;
          }
          .num1 {
            color: #f5623b;
            padding: 0 5px;
            font-size: 16px;
            font-weight: bold;
          }
          .num2 {
            color: #23cbd4;
            padding: 0 5px;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
