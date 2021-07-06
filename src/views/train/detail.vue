<template>
  <div class="train-detail">
    <div class="breadcrumb-wrap">
      <el-breadcrumb separator="&gt;">
        <el-breadcrumb-item :to="{ path: '/train' }"> 培训中心 </el-breadcrumb-item>
        <el-breadcrumb-item>{{ data.trainName ? data.trainName : '--' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="train-img">
        <img :src="imgSrc(data)" style="width: 100%; height: 100%" />
      </div>
      <div class="train-intro">
        <div class="title">
          <div class="title-line">
            <el-tooltip
              v-if="data.trainName"
              class="item"
              :disabled="data.trainName.length < 10"
              effect="dark"
              :content="data.trainName"
              placement="top"
            >
              <div class="name">
                {{ data.trainName }}
              </div>
            </el-tooltip>
            <div
              class="status"
              :class="{
                will: data.status === 1,
                doing: data.status === 2,
                done: data.status === 3
              }"
            >
              {{
                data.status === 2
                  ? '进行中'
                  : data.status === 1
                    ? '未开始'
                    : data.status === 3
                      ? '已结办'
                      : ''
              }}
            </div>
          </div>
          <div class="right">
            <div v-if="data.trainScope !== 'outer'" class="score">
              <el-rate
                v-model="data.composite"
                disabled
                show-score
                text-color="#ff9900"
                :score-template="data.composite + '分'"
              >
              </el-rate>
            </div>
            <div class="collection">
              <i class="el-icon-star-off"></i>
              <span>收藏</span>
            </div>
          </div>
        </div>
        <div class="intro-list">
          <div class="intro-item">
            <span class="label"> 类别:</span>
            <span class="text">{{ data.trainScope === 'inside' ? '内训' : '外训' }}</span>
          </div>
          <div class="intro-item">
            <span class="label"> 分类：</span>
            <span class="text">
              <text-over-tooltip
                ref-name="categoryName-tt-detail"
                :content="data.categoryName == '/--' ? '--' : data.categoryName"
              >
              </text-over-tooltip>
            </span>
          </div>
          <div class="intro-item">
            <span class="label"> 培训时间：</span>

            <el-tooltip
              v-if="flag"
              class="item"
              effect="dark"
              :content="trainTime"
              placement="top-start"
              :disabled="trainTime.length < 15"
            >
              <span class="text">{{ trainTime }} </span>
            </el-tooltip>
          </div>
        </div>
        <div class="intro-list">
          <div class="intro-item">
            <span class="label"> 知识体系:</span>
            <span class="text">
              <text-over-tooltip
                ref-name="address-tt-detail"
                :content="data.knowledgeSystemName ? data.knowledgeSystemName : '--'"
              >
              </text-over-tooltip>
            </span>
          </div>
          <div class="intro-item type">
            <span class="lable"> 培训类型：</span>
            <span class="text">{{ trainType(data.trainType) }}</span>
          </div>
          <div class="intro-item">
            <span class="label"> 培训形式：</span>
            <span class="text">{{
              data.trainWay === 1
                ? '在线培训'
                : data.trainWay === 2
                  ? '面授培训'
                  : data.trainWay === 3
                    ? '混合培训'
                    : data.trainWay === 11
                      ? '在职培训'
                      : data.trainWay === 12
                        ? '脱产培训'
                        : data.trainWay === 13
                          ? '业余培训'
                          : '--'
            }}</span>
          </div>
        </div>
        <div class="intro-list">
          <div v-if="data.trainScope === 'outer'" class="intro-item">
            <span class="label">培训机构：</span>
            <span class="text">{{ data.organizer ? data.organizer : '--' }}</span>
          </div>
          <div v-if="data.trainWay !== 1" class="intro-item">
            <span class="label"> 培训地点：</span>
            <!-- <span class="text">{{ data.address ? data.address : '--' }}</span> -->
            <span class="text">
              <text-over-tooltip
                ref-name="address-tt-detail"
                :content="data.address ? data.address : '--'"
              >
              </text-over-tooltip>
            </span>
          </div>
          <div v-if="data.trainScope !== 'outer'" class="intro-item">
            <span class="label"> 项目经理：</span>
            <span class="text">{{ data.headTeacherName ? data.headTeacherName : '--' }}</span>
          </div>
          <div v-if="data.trainScope !== 'outer'" class="intro-item">
            <span class="label"> 联系电话：</span>
            <span class="text">{{ data.contactPhone ? data.contactPhone : '--' }}</span>
          </div>
          <div v-if="data.trainScope === 'outer'" class="intro-item"></div>
        </div>
        <div class="intro-list">
          <div v-if="data.trainScope === 'outer'" class="intro-item">
            <span class="label"> 项目经理：</span>
            <span class="text">{{ data.headTeacherName ? data.headTeacherName : '--' }}</span>
          </div>
          <div v-if="data.trainScope === 'outer'" class="intro-item">
            <span class="label"> 联系电话：</span>
            <span class="text">{{ data.contactPhone ? data.contactPhone : '--' }}</span>
          </div>
          <div v-if="data.trainScope !== 'outer'" class="intro-item">
            <span class="label"> 计入积分：</span>
            <span class="text">{{ data.scoreGet ? data.scoreGet : '--' }}</span>
          </div>
          <div class="intro-item">
            <span class="text"></span>
          </div>
        </div>
        <el-row class="state_info">
          <el-button v-if="isJoin" type="primary" @click="handleSign">立即报名</el-button>
          <el-button v-else-if="data.applyJoinStatus === 'SignedUp'" type="success">已报名</el-button>
          <el-button v-else-if="data.applyJoinStatus === 'UnderReview'" type="info">审核中</el-button>
        </el-row>
      </div>
    </div>

    <div class="train-main">
      <el-tabs v-model="activeComponent" class="tabs" @tab-click="handleSelect">
        <el-tab-pane v-for="tab in data.tabs" :key="tab" :label="reference[tab]" :name="tab" lazy>
          <div class="train-content">
            <component :is="tab" :data="data"></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { Rate, Intro, Schedule, Trainee, Arrangement, MaterialsUpload } from './contents'
import TextOverTooltip from '../course/components/TextOverTooltip'
import { getDetail, signUp, trainNum } from 'src/api/train'
import globalKey from 'src/config/website'
import moment from 'moment'
export default {
  name: 'TrainDetail',
  components: {
    Rate,
    Intro,
    Schedule,
    Trainee,
    Arrangement,
    MaterialsUpload,
    TextOverTooltip
  },
  data() {
    return {
      reference: {
        Intro: '培训介绍',
        Rate: '培训评分',
        Trainee: '学员概况',
        Schedule: '培训安排',
        Arrangement: '培训安排',
        MaterialsUpload: '培训总结'
      },
      data: {},
      activeComponent: '',
      isApplyJoin: false,
      flag: false,
      isJoin: false
    }
  },
  computed: {
    trainType() {
      return (data) => {
        let text = null
        switch (data) {
          case '01':
            text = '通用力培训'
            break
          case '02':
            text = '专业力培训'
            break
          case '03':
            text = '领导力培训'
            break
          case 'POST_CERT':
            text = '岗位取证'
            break
          case 'EDU_SELF':
            text = '学历教育（自主）'
            break
          case 'EDU_APPOINT':
            text = '学历教育（委派）'
            break
          case 'SPECIAL':
            text = '专题研修'
            break
          default:
            text = '--'
        }
        return text
      }
    },
    imgSrc() {
      return (data) => {
        if (data.coverPic) return data.coverPic
        else if (data.trainWay === 1 && data.trainScope === 'inside')
          return require('@/assets/images/online.png')
        else if (data.trainWay === 2 && data.trainScope === 'inside')
          return require('@/assets/images/Offline.png')
        else if (data.trainWay === 3 && data.trainScope === 'inside')
          return require('@/assets/images/mixin.png')
        else if (data.trainScope === 'outer') return require('@/assets/images/outTrain.png')
      }
    },
    trainTime() {
      if (this.data.trainBeginDate && this.data.trainEndDate)
        return this.data.trainBeginDate + '-' + this.data.trainEndDate
      else return '--'
    }
  },
  activated() {
    this.getData()
    this.$nextTick(() => {
      this.flag = true
    })
  },
  deactivated() {
    this.data = {}
    this.activeComponent = ''
  },
  methods: {
    handleSelect(tab) {
      this.data.activeComponent = tab.name
      localStorage.setItem(globalKey.trainDataKey, JSON.stringify(this.data))
    },
    getData() {
      const params = this.$route.query
      const trainDataKey = globalKey.trainDataKey
      if (!Object.keys(params).length) {
        this.data = JSON.parse(localStorage.getItem(trainDataKey))
        this.activeComponent = this.data.activeComponent
      } else {
        const { trainId, userType } = params
        let tabs = ['Intro']
        this.data = { tabs, activeComponent: this.activeComponent, ...params }
        getDetail({ trainId }).then((res) => {
          this.data = Object.assign(this.data, res)
          this.data.userType = userType
          if (this.data.trainScope === 'inside') {
            if (this.data.applyJoinStatus === 'SignedUp' || this.data.isTrainObject) {
              if (this.data.evaluationType.indexOf('1') !== -1)
                tabs.push(...['Rate', 'MaterialsUpload'])
              else tabs.push(...['MaterialsUpload'])
              tabs.unshift('Arrangement')
            }
          } else {
            if (this.data.applyJoinStatus === 'SignedUp') tabs.push('MaterialsUpload')
          }
          this.activeComponent = this.data.tabs[0]
          const trainBeginDate = moment(this.data.trainBeginTime).format('yyyy/MM/DD') || ''
          const trainEndDate = moment(this.data.trainEndTime).format('yyyy/MM/DD') || ''
          this.$set(this.data, 'trainBeginDate', trainBeginDate)
          this.$set(this.data, 'trainEndDate', trainEndDate)
          this.$forceUpdate()
          const applyJoinEndDate = moment(this.data.applyJoinEndDate).add(1, 'days')
          if (this.data.status === 3) {
            this.isApplyJoin = false
          } else if (applyJoinEndDate) {
            this.isApplyJoin = moment().valueOf() <= moment(applyJoinEndDate).valueOf()
          } else {
            this.isApplyJoin = true
          }
          localStorage.setItem(trainDataKey, JSON.stringify(this.data))
          this.getTrainNum()
        })
      }
    },
    async handleSign() {
      // 处理立即报名
      const trainId = this.data.id
      if (this.data.trainScope === 'outer') {
        this.$router.push({
          path: '/approvalCenter/outsideTraining',
          query: {
            trainId
          }
        })
        return
      }
      await signUp({ trainId }).then((res) => {
        if (res) {
          this.getData()
        }
      })
    },
    async getTrainNum() {
      const res = await trainNum({ trainId: this.$route.query.trainId })
      if (this.data.status === 3) return
      if (this.data.trainScope === 'inside') {
        this.isJoin =
          this.data.applyJoinStatus === 'NotRegistered' &&
          this.isApplyJoin &&
          !this.data.isTrainObject &&
          (!+res.plannedPopulation || res.remainingPlaces > 0)
      } else if (this.data.trainScope === 'outer') {
        this.isJoin =
          this.data.applyJoinStatus === 'NotRegistered' &&
          (this.data.isTrainObject || this.data.applyJoin) &&
          (!+res.plannedPopulation || res.remainingPlaces > 0)
      }
    }
  }
}
</script>

<style lang="scss">
.train-detail {
  .el-tabs__header {
    margin: 0;
  }
}
</style>

<style lang="scss" scoped>
.train-detail {
  .content {
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    cursor: default;
    display: flex;
    justify-content: space-between;
    .train-img {
      width: 480px;
      height: 270px;
      margin-right: 24px;
      border-radius: 5px;
      flex-shrink: 0;
      overflow: hidden;
    }
    .train-intro {
      .title {
        font-size: 0;
        margin-bottom: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .collection {
          font-size: 16px;
          cursor: pointer;
        }
        .right {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Regular;
          .score {
            margin-right: 30px;
          }
          .collection {
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            letter-spacing: 0;
            line-height: 18px;
            span {
              margin-left: 6px;
            }
          }
        }
        .title-line {
          display: flex;
          align-items: center;
          width: 200px;
          .name {
            font-size: 18px;
            color: #000b15;
            letter-spacing: 0;
            line-height: 28px;
            font-weight: 600;
          }
        }
        .name {
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          margin-right: 16px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .status {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          text-align: center;
          flex-shrink: 0;
          width: 52px;
          font-size: 12px;
          border-radius: 4px;
          &.will {
            color: #f5c200;
            background-color: #fffee6;
          }
          &.done {
            color: rgba(0, 11, 21, 0.45);
            background-color: #f5f5f6;
          }
          &.doing {
            color: #2875d4;
            background-color: #f0f9ff;
          }
        }
      }

      .intro-list {
        display: flex;
        color: rgba(0, 11, 21, 0.45);
        font-size: 14px;
        &:not(:last-child) {
          margin-bottom: 16px;
        }
        .intro-item {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          white-space: nowrap;
          .label {
            width: 70px;
          }
          .text {
            width: 150px;
            color: rgba(0, 11, 21, 0.85);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 10px;
          }
        }
      }
    }
  }
  .state_info {
    .el-button {
      padding: 8px 18px;
    }
  }
  .breadcrumb-wrap {
    margin: 24px 0 16px;
  }

  .train-main {
    margin-top: 20px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    .el-tabs__item {
      font-size: 16px;
      padding: 0 !important;
      margin: 0 20px;
      &:first-child {
        margin-left: 0;
      }
    }
    .train-content {
      padding-top: 24px;
    }
  }
}
</style>
