<template>
  <div class="InternalTraining">
    <div class="top_breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/lecturerTask/task' }">我的任务</el-breadcrumb-item>
        <el-breadcrumb-item>培训详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="top_box">
      <div class="img">
        <img :src="TrainDetail.coverPic" alt="" />
      </div>
      <ul>
        <li>
          <div class="item_title">
            <div class="box_title">
              <span> {{ TrainDetail.trainName }} </span>
              <i
                :class="{
                  status_1: TrainDetail.status == 1,
                  status_2: TrainDetail.status == 2,
                  status_3: TrainDetail.status == 3
                }"
              >
                {{ showStatus(TrainDetail.status) }}
              </i>
            </div>

            <div class="box_rate">
              <div class="rate">
                <el-rate
                  v-model="TrainDetail.composite"
                  disabled
                  show-score
                  text-color="#666"
                  score-template="{value}分"
                >
                </el-rate>
              </div>
              <div class="star">
                <!-- <i class="el-icon-star-on"></i>
                <span>
                  收藏（1000）
                </span> -->
              </div>
            </div>
          </div>
        </li>
        <li class="lian_box">
          <div>
            <span>类别：</span>
            <span> {{ `${TrainDetail.trainScope == 'inside' ? '内训' : '外训'}` }}</span>
          </div>
          <div>
            <span>分类：</span>
            <span v-if="!TrainDetail.categoryName"> -- </span>
            <text-over-tooltip
              style="width: 190px"
              ref-name="testName1"
              class-name="fs20"
              :content="TrainDetail.categoryName"
            ></text-over-tooltip>
          </div>
          <div>
            <span>培训时间：</span>
            <span> {{ `${TrainDetail.startTime}-${TrainDetail.startTime || '-'}` }} </span>
          </div>
        </li>
        <li class="lian_box">
          <div>
            <span>知识体系：</span> <span> {{ TrainDetail.knowledgeSystemName || '--' }} </span>
          </div>
          <div>
            <span>培训方式：</span> <span> {{ showtrainWay(TrainDetail.trainWay) || '--' }} </span>
          </div>
          <div>
            <span>培训地点：</span> <span> {{ TrainDetail.address || '--' }} </span>
          </div>
        </li>
        <li class="lian_box">
          <!-- <div>
            <span>联系人：</span> <span> {{ TrainDetail.contactName || '--' }} </span>
          </div> -->
          <div>
            <span>项目经理：</span> <span> {{ TrainDetail.headTeacherName || '--' }} </span>
          </div>
          <div>
            <span>联系电话：</span> <span> {{ TrainDetail.contactPhone || '--' }} </span>
          </div>
          <div>
            <span>计入积分：</span> <span> {{ TrainDetail.scoreGet || '--' }}分 </span>
          </div>
        </li>
        <li class="lian_box">
          <div>
            <span>主办单位：</span> <span> {{ TrainDetail.sponsor || '--' }} </span>
          </div>
          <div>
            <span>承办单位：</span> <span> {{ TrainDetail.organizer || '--' }} </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="content_tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="报名情况" name="SignUp"> <SignUp></SignUp> </el-tab-pane>
        <el-tab-pane label="学习情况" name="Study"><Study></Study> </el-tab-pane>
        <el-tab-pane label="签到情况" name="SignIn"><SignIn></SignIn></el-tab-pane>
        <el-tab-pane label="培训安排" name="Arrange"> <Arrange></Arrange> </el-tab-pane>
        <el-tab-pane label="培训介绍" name="Introduce"> <Introduce></Introduce> </el-tab-pane>
        <el-tab-pane label="培训评分" name="Score"> <Score></Score> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getTrainDetail } from '@/api/lecturerTask'
import TextOverTooltip from '../../course/components/TextOverTooltip'

// 内训
import SignUp from './SignUp' //报名情况
import Study from './Study' //学习情况
import SignIn from './SignIn' //签到情况
import Arrange from './Arrange' //培训安排
import Introduce from './Introduce' //培训介绍
import Score from './Score' //培训评分
export default {
  components: {
    SignUp,
    Study,
    SignIn,
    Arrange,
    Introduce,
    Score,
    TextOverTooltip
  },
  data() {
    return {
      activeName: 'SignUp',
      TrainDetail: {}
    }
  },
  created() {
    this.isgetTrainDetail()
  },
  methods: {
    showStatus(i) {
      let status = {
        1: '未开始',
        2: '进行中',
        3: '已结束'
      }
      return status[i]
    },
    showtrainWay(i) {
      let status = {
        1: '在线',
        2: '面授',
        3: '混合'
      }
      return status[i]
    },
    async isgetTrainDetail() {
      this.TrainDetail = await getTrainDetail({ trainId: this.$route.query.id })
    }
  }
}
</script>

<style scoped lang="scss">
.InternalTraining {
  i {
    font-style: normal;
  }
  .top_breadcrumb {
    padding: 20px 0;
  }
  .top_box {
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    background-color: #fff;
    display: flex;
    padding: 30px;
    .img {
      width: 480px;
      height: 270px;
      flex-shrink: 0;
      background-color: rgba(204, 204, 204, 0.151);
      img {
        width: 100%;
        height: 100%;
      }
    }
    ul {
      flex: 1;
      li {
        margin-left: 50px;
        .item_title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .box_title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
              font-size: 18px;
              color: #000b15;
              letter-spacing: 0;
              line-height: 28px;
              font-weight: 600;
              margin-right: 8px;
            }
            i {
              padding: 1px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
          }
          .box_rate {
            display: flex;
            .rate {
              display: flex;
              line-height: 20px;
              font-size: 12px;
            }
            .star {
              margin-left: 24px;
            }
          }
        }
      }
      li:first-of-type {
        margin-bottom: 40px;
      }
      .lian_box {
        display: flex;
        margin-top: 7px;
        color: #333;
        div {
          width: 33%;
          display: flex;
          span {
            &:nth-child(2) {
              flex: 1;
              font-size: 14px;
              color: rgba(0, 11, 21, 0.85);
              letter-spacing: 0;
              line-height: 22px;
            }
            &:nth-of-type(1) {
              flex-shrink: 0;
              width: 70px;
              font-size: 14px;
              color: rgba(0, 11, 21, 0.45);
              letter-spacing: 0;
              line-height: 22px;
            }
          }
        }
      }
    }
  }
  .content_tabs {
    margin-top: 24px;
    padding: 24px;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    background-color: #fff;
  }
  .status_1 {
    background: #fffee6;
    color: #f5c200;
  }
  .status_2 {
    color: #2875d4;
    background: #eaf8ff;
  }
  .status_3 {
    background: #f5f5f6;
    color: rgba(0, 11, 21, 0.45);
  }
}
</style>
