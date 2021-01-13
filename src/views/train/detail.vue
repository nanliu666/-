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
        <div class="status doing">
          {{ data.status === 2 ? '进行中' : data.status === 1 ? '未开始' : '已办结' }}
        </div>
      </div>
      <div class="intro-list">
        <div class="intro-item">
          分类：
          <span class="text">{{ data.categoryName }}</span>
        </div>
        <div class="intro-item">
          培训时间：
          <span class="text">{{ data.startTime }} ~ {{ data.endTime }}</span>
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
            data.trainWay === 1 ? '面授' : data.trainWay === 2 ? '混合' : '在线'
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
    </div>

    <div class="train-main">
      <el-menu
        :default-active="activeComponent"
        mode="horizontal"
        text-color="rgba(0,11,21,0.65)"
        active-text-color="rgba(1,170,252,1)"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="tab in data.tabs"
          :key="tab"
          :index="tab"
        >
          {{ reference[tab] }}
        </el-menu-item>
      </el-menu>

      <div class="train-content">
        <keep-alive>
          <component
            :is="activeComponent"
            :data="data"
          ></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { Course, Exam, Rate, Intro, Schedule, Trainee } from './contents'
import { getDetail } from 'src/api/train'
import globalKey from 'src/config/website'
export default {
  name: 'TrainDetail',
  components: {
    Course,
    Exam,
    Rate,
    Intro,
    Schedule,
    Trainee
  },
  data() {
    return {
      reference: {
        Course: '培训目录',
        Exam: '培训考试',
        Intro: '培训详情',
        Rate: '培训评分',
        Trainee: '学员概况',
        Schedule: '培训安排'
      },
      data: {},
      activeComponent: ''
    }
  },
  activated() {
    this.getData()
  },
  deactivated() {
    this.data = {}
    this.activeComponent = ''
    localStorage.removeItem(globalKey.trainDataKey)
  },
  methods: {
    handleSelect(name) {
      this.data.activeComponent = this.activeComponent = name
      localStorage.setItem(globalKey.trainDataKey, JSON.stringify(this.data))
    },
    getData() {
      const params = this.$route.params
      const trainDataKey = globalKey.trainDataKey
      if (!Object.keys(params).length) {
        this.data = JSON.parse(localStorage.getItem(trainDataKey))
        this.activeComponent = this.data.activeComponent
      } else {
        const { title, trainId, trainWay, userType } = params
        const tabs =
          userType === 0
            ? ['Course', 'Exam', 'Intro', 'Rate']
            : ['Trainee', 'Schedule', 'Intro', 'Rate']
        this.activeComponent = tabs[0]
        getDetail({ trainId }).then((res) => {
          this.data = { title, trainId, trainWay, userType, tabs, ...res }
          localStorage.setItem(trainDataKey, JSON.stringify(this.data))
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.train-detail {
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
    .el-menu-item {
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
