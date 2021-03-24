<template>
  <div class="train-detail">
    <div class="breadcrumb-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/train' }">
          培训中心
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ data.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="train-intro">
      <div class="title">
        <div class="name">
          {{ data.title }}
        </div>
        <div
          class="status"
          :class="{ will: data.status === 1, doing: data.status === 2, done: data.status === 3 }"
        >
          {{
            data.status === 2
              ? '进行中'
              : data.status === 1
                ? '未开始'
                : data.status === 3
                  ? '已办结'
                  : ''
          }}
        </div>
      </div>
      <div class="intro-list">
        <div class="intro-item">
          分类：
          <span class="text">{{ data.categoryName }}</span>
        </div>
        <div class="intro-item">
          培训时间：
          <span class="text">{{ data.trainBeginTime }} ~ {{ data.trainEndTime }}</span>
        </div>
        <div class="intro-item">
          计划人数：
          <span class="text">{{ data.people }}</span>
        </div>
      </div>
      <div class="intro-list">
        <div class="intro-item">
          培训方式：
          <span class="text">{{
            data.trainWay === 1 ? '在线' : data.trainWay === 2 ? '面授' : '混合'
          }}</span>
        </div>
        <div class="intro-item">
          培训地点：
          <span class="text">{{ data.address }}</span>
        </div>
        <div class="intro-item">
          联系人：
          <span class="text">{{ data.contactName }}</span>
        </div>
      </div>
      <div class="intro-list">
        <div class="intro-item">
          联系电话：
          <span class="text">{{ data.contactPhone }}</span>
        </div>
        <div class="intro-item">
          主办单位：
          <span class="text">{{ data.sponsor }}</span>
        </div>
        <div class="intro-item">
          承办单位：
          <span class="text">{{ data.organizer }}</span>
        </div>
      </div>
      <div class="intro-list">
        <div class="intro-item">
          班主任：
          <span class="text">{{ data.headTeacher }}</span>
        </div>
        <div class="intro-item">
          助教：
          <span class="text">{{ data.teachAssistant }}</span>
        </div>
        <div class="intro-item">
          <span class="text"></span>
        </div>
      </div>
      <el-row v-if="data.applyJoin" class="state_info">
        <el-button
          v-if="data.applyJoinStatus === 'NotRegistered' && isApplyJoin && !data.isTrainObject"
          type="primary"
          @click="handleSign"
        >立即报名</el-button>
        <el-button v-if="data.applyJoinStatus === 'SignedUp'" type="success">已报名</el-button>
        <el-button v-if="data.applyJoinStatus === 'UnderReview'" type="info">审核中</el-button>
      </el-row>
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
// eslint-disable-next-line no-unused-vars
import { Exam, Rate, Intro, Schedule, Trainee, Arrangement, MaterialsUpload } from './contents'
import { getDetail, signUp, getTrainState } from 'src/api/train'
import globalKey from 'src/config/website'
import moment from 'moment'
export default {
  name: 'TrainDetail',
  components: {
    // Exam, 移到培训安排
    Rate,
    Intro,
    Schedule,
    Trainee,
    Arrangement,
    MaterialsUpload
  },
  data() {
    return {
      reference: {
        Intro: '培训介绍',
        Rate: '培训评分',
        Trainee: '学员概况',
        Schedule: '培训安排',
        Arrangement: '培训安排',
        MaterialsUpload: '培训上报材料'
      },
      data: {},
      registrationStatus: '',
      activeComponent: '',
      isApplyJoin: false
    }
  },
  // created() {
  //   this.getData()
  // },
  activated() {
    this.getData()
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
    async getData() {
      const params = this.$route.query
      const trainDataKey = globalKey.trainDataKey
      if (!Object.keys(params).length) {
        this.data = JSON.parse(localStorage.getItem(trainDataKey))
        this.activeComponent = this.data.activeComponent

        // if (this.data.status !== 2) {
        //   this.data.tabs.splice(this.data.tabs.indexOf('Rate'), 1)
        // }
      } else {
        const { trainId, userType } = params
        await this.getTrainState(trainId)
        let tabs = []
        // userType 0 代表学员 1代表老师
        if (userType == 0) {
          tabs = ['Intro']
        } else {
          tabs = ['Trainee', 'Schedule', 'Intro', 'Rate']
        }
        // const tabs =
        //   userType === 0
        //     ? ['Course', 'Exam', 'Intro', 'Rate']
        //     : ['Trainee', 'Schedule', 'Intro', 'Rate']
        this.activeComponent = tabs[0]
        this.data = { tabs, activeComponent: this.activeComponent, ...params }
        await getDetail({ trainId }).then((res) => {
          this.data = Object.assign(this.data, res)
          this.data.userType = userType

          // this.data.status // 1 表示未开始 2表示进行中 3表示已结办
          // this.data.isTrainObject true 是否培训人员
          if (
            this.data.isTrainObject ||
            (this.data.applyJoin && this.data.applyJoinStatus == 'SignedUp')
          ) {
            if (this.data.status != 1) {
              this.data.tabs = ['Arrangement', 'Intro', 'MaterialsUpload']
            } else {
              this.data.tabs = ['Arrangement', 'Intro']
            }
            this.activeComponent = this.data.tabs[0]
          }

          this.$forceUpdate()
          let applyJoinEndDate = this.data.applyJoinEndDate || this.data.trainEndTime
          if (new Date(moment().format('yyyy-MM-DD')) <= new Date(applyJoinEndDate)) {
            this.isApplyJoin = true
          }
          localStorage.setItem(trainDataKey, JSON.stringify(this.data))
        })
      }
    },
    async handleSign() {
      // 处理立即报名
      const trainId = this.data.id
      await signUp({ trainId }).then((res) => {
        if (res) {
          this.getData()
        }
      })
    },
    async getTrainState(trainId) {
      await getTrainState({ trainId }).then((res) => {
        this.registrationStatus = res.status
      })
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
  .state_info {
    .el-button {
      padding: 8px 18px;
    }
  }
  .breadcrumb-wrap {
    margin: 24px 0 16px;
  }
  .train-intro {
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    cursor: default;
    .title {
      font-size: 0;
      margin-bottom: 18px;
      .name {
        display: inline-block;
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        margin-right: 16px;
      }
      .status {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        text-align: center;
        width: 52px;
        font-size: 12px;
        border-radius: 4px;
        &.will {
          color: #00b061;
          background-color: #e7ffee;
        }
        &.doing {
          color: #fcba00;
          background-color: #fffce6;
        }
        &.done {
          color: #01aafc;
          background-color: #e7fbff;
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
        flex: 1;
        align-items: center;
        .text {
          width: 287px;
          color: rgba(0, 11, 21, 0.85);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
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
