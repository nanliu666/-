<template>
  <div class="tabs_box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="必修课" name="required">必修课</el-tab-pane>
      <el-tab-pane label="培训" name="train">培训</el-tab-pane>
      <el-tab-pane label="选修课" name="elective ">选修课</el-tab-pane>
      <el-tab-pane label="直播" name="live ">直播</el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'required'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped lang="scss">
.tabs_box {
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  margin-top: 16px;
  padding: 24px;
}
/deep/.el-tabs__item {
  font-size: 16px;
}
</style>
