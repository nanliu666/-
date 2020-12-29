<template>
  <div class="paper-container">
    <div class="paper-header">
      <div class="header-left">
        <i class="iconimage_icon_leftarrow iconfont" />
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
    <div class="paper-main"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remainingTime: 0,
      paper: {
        title: 'EHS应知应会全员考试'
      }
    }
  },
  created() {
    this.initRemainingTime()
  },
  methods: {
    initRemainingTime() {
      // //获取当前时间
      // var now = new Date().getTime()
      // //设置截止时间
      // var endDate = new Date('2020/12/29 24:00:00')
      // var end = endDate.getTime()
      // //时间差
      // var leftTime = end - now
      // //定义变量 d,h,m,s保存倒计时的时间
      // const d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
      // const h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
      // const m = Math.floor((leftTime / 1000 / 60) % 60)
      // const s = Math.floor((leftTime / 1000) % 60)
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
