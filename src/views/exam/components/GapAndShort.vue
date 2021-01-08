<template>
  <div class="view-contain-box">
    <div>
      <span class="dot"></span>
      <span>标准答案：</span>
      <span>春秋战国</span>
    </div>
    <div class="blank-box common-box">
      <div class="blank-top">
        <span class="label">考生答案：</span>
        <span class="value">考生答案</span>
      </div>
      <div class="blank-middle">
        <div>
          <span class="label">评分结果：</span>
          <span class="value">对</span>
        </div>
        <div>
          <span class="label">得分：</span>
          <span class="value">4分</span>
        </div>
        <div>
          <span class="label">评卷人：</span>
          <span class="value">王平</span>
        </div>
      </div>
      <div>
        <span class="label">考生答案：</span>
        <span class="value">这个时答案</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GapAndShort',
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.view-contain-box {
  .is-correct {
    color: #00b061;
  }
  .is-fault {
    color: #ff4329;
  }
  .analysis-box {
    margin-top: 8px;
  }
  .common-box {
    padding: 24px;
    background-color: #fafafa;
    .label {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.25);
    }
    .value {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
    }
  }
  .blank-box {
    .blank-top {
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(0, 11, 21, 0.05);
    }
    .blank-middle {
      padding: 24px 0;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
