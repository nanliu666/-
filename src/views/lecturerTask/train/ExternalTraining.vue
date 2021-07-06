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
        <img v-if="TrainDetail.coverPic" :src="TrainDetail.coverPic" alt="" />
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
        </li>
        <li class="lian_box">
          <div>
            <span>培训时间：</span>
            <span> {{ `${TrainDetail.startTime}-${TrainDetail.startTime || '-'}` }} </span>
          </div>
          <div>
            <span>知识体系：</span> <span> {{ TrainDetail.knowledgeSystemName || '--' }} </span>
          </div>
        </li>
        <li class="lian_box">
          <div>
            <span>培训类型：</span> <span> {{ TrainDetail.trainType || '--' }} </span>
          </div>
          <div>
            <span>培训形式：</span> <span> {{ showtrainWay(TrainDetail.trainWay) || '--' }} </span>
          </div>
        </li>
        <li class="lian_box">
          <div>
            <span>培训机构：</span> <span> {{ TrainDetail.organizer || '--' }} </span>
          </div>
          <div>
            <span>培训地点：</span> <span> {{ TrainDetail.address || '--' }} </span>
          </div>
        </li>
        <li class="lian_box">
          <div>
            <span>项目经理：</span> <span> {{ TrainDetail.headTeacherName || '--' }} </span>
          </div>
          <div>
            <span>联系电话：</span> <span> {{ TrainDetail.contactPhone || '--' }} </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="content_tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="报名情况" name="OutsideSignUp">
          <OutsideSignUp></OutsideSignUp>
        </el-tab-pane>
        <el-tab-pane label="参加学员" name="Student"> <Student></Student> </el-tab-pane>
        <el-tab-pane label="培训介绍" name="Introduce"> <Introduce></Introduce> </el-tab-pane>
        <el-tab-pane label="协议签订情况" name="Agreement"> <Agreement></Agreement> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import OutsideSignUp from './OutsideSignUp' //报名情况
import Student from './Student' //参加学员
import Introduce from './Introduce' //培训介绍
import Agreement from './Agreement' //协议签订情况
import { getTrainDetail } from '@/api/lecturerTask'

import TextOverTooltip from '../../course/components/TextOverTooltip'
export default {
  components: {
    OutsideSignUp,
    Introduce,
    Student,
    Agreement,
    TextOverTooltip
  },
  data() {
    return {
      TrainDetail: {},

      activeName: 'OutsideSignUp'
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
        11: '在职',
        12: '脱产',
        13: '业余'
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
      background-color: rgba(204, 204, 204, 0.151);
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    ul {
      flex: 1;
      margin-left: 24px;
      li {
        .item_title {
          display: flex;
          justify-content: space-between;
          .box_title {
            span {
              font-size: 18px;
              color: #000b15;
              letter-spacing: 0;
              line-height: 28px;
              font-weight: 600;
            }
            i {
              padding: 3px 10px;
              border-radius: 4px;
              margin-right: 20px;
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
      .lian_box {
        display: flex;
        color: #333;
        justify-content: space-between;
        margin-bottom: 8px;
        div {
          flex: 1;
          flex-shrink: 0;
          display: flex;
          span:last-of-type {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
            line-height: 22px;
          }
          span:first-of-type {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.45);
            letter-spacing: 0;
            line-height: 22px;
          }
        }
      }
      li:first-of-type {
        margin-bottom: 40px;
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
    color: #f5c200;
    background-color: #fffee6;
  }
  .status_2 {
    color: #2875d4;
    background-color: #f0f9ff;
  }
  .status_3 {
    color: rgba(0, 11, 21, 0.45);
    background-color: #f5f5f6;
  }
}
</style>
