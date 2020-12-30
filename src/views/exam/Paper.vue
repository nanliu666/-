<template>
  <div class="paper-container">
    <div class="paper-header">
      <div class="header-left">
        <i
          class="iconimage_icon_leftarrow iconfont"
          @click="goBack"
        />
        <span class="title">{{ paper.title }}</span>
        <span class="content">
          <span>共50题，</span>
          <span>总分120分，</span>
          <span>限定最高分为100分，</span>
          <span>计时60分钟</span>
          <span>（答题不确定时，可用</span>
          <i class="iconimage_icon_help_normal iconfont" />
          <span>标记）</span>
        </span>
      </div>
      <div class="header-right">
        <span class="time">剩余时间：{{ remainingTime }}</span>
        <el-button
          type="primary"
          size="medium"
          @click="carryOut"
        >
          交卷
        </el-button>
      </div>
    </div>
    <div class="paper-main">
      <div class="main-left">
        <el-card class="avatar-card">
        </el-card>
      </div>
      <div class="main-right"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      remainingTime: '00 : 00 : 00',
      paper: {
        title: 'EHS应知应会全员考试'
      }
    }
  },
  created() {
    this.initRemainingTime()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    initRemainingTime() {
      const dealline = moment(new Date()).add(1, 'd')
      setInterval(() => {
        const diffTime = moment(dealline).diff(moment(new Date()))
        const hoursTime = moment.duration(diffTime).hours()
        const minutesTime = moment.duration(diffTime).minutes()
        const secondsTime = moment.duration(diffTime).seconds()
        this.remainingTime = `${moment(hoursTime).format('HH')} : ${
          minutesTime < 10 ? `0${minutesTime}` : minutesTime
        } : ${secondsTime < 10 ? `0${secondsTime}` : secondsTime}`
      }, 1000)
    },
    carryOut() {}
  }
}
</script>

<style scoped lang="scss">
.paper-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .paper-header {
    align-self: flex-start;
    height: 56px;
    background: #ffffff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04), 0 8px 16px 4px rgba(0, 0, 0, 0.04);
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    .header-left {
      .iconimage_icon_leftarrow {
        cursor: pointer;
      }
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 550;
        margin: 0 8px 0 16px;
      }
      .content {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
    }
    .header-right {
      .time {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        margin-right: 16px;
      }
    }
  }
  .paper-main {
    height: 100vh;
    width: 100%;
  }
}
</style>
