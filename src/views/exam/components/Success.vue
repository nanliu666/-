<template>
  <el-card class="card">
    <div class="success-card">
      <div class="right-box">
        <i class="iconimage_icon_succeed iconfont right" />
      </div>
      <div class="success-title">
        提交成功
      </div>
      <div class="content" v-html="_.get(paperData, 'successPaper.msg')"></div>
      <div class="handle-box">
        <el-button
          v-if="_.get(paperData, 'successPaper.openAnswerSheet')"
          type="primary"
          @click="goDetail"
        >
          查看答卷
        </el-button>
        <el-button @click="goList">
          返回列表
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  inject: ['paperData'],
  name: 'ExamSuccess',
  data() {
    return {
      isActive: true
    }
  },
  created() {},
  methods: {
    goList() {
      this.$router.push({ path: '/exam/list' })
    },
    goDetail() {
      this.$router.replace({
        name: 'ExamDetail',
        query: { examSessionId: _.get(this.paperData, 'successPaper.examSessionId') }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  height: calc(100vh - 56px - 70px);
  width: 1200px;
  margin: 24px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .success-card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .right-box {
      width: 80px;
      height: 80px;
      border-radius: 100%;
      margin-bottom: 20px;
      background-color: #5fce5f;
      display: flex;
      align-items: center;
      justify-content: center;
      .right {
        color: #ffffff;
        font-size: 35px;
      }
    }
    .success-title {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      font-weight: 550;
      color: rgba(0, 11, 21, 0.85);
      margin-bottom: 40px;
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 40px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
    }
    .handle-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
