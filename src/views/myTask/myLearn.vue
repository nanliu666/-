<template>
  <div class="tabs_box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="必修课" name="myRequiredList"> </el-tab-pane>
      <el-tab-pane label="培训" name="myTrainList"></el-tab-pane>
      <el-tab-pane label="选修课" name="myElectiveList"></el-tab-pane>
      <el-tab-pane label="直播" name="myLiveList"></el-tab-pane>
    </el-tabs>
    <component :is="activeName"></component>
  </div>
</template>
<script>
import myRequiredList from './myRequiredList'
import myTrainList from './myTrainList'
import myElectiveList from './myElectiveList'
import myLiveList from './myLiveList'
export default {
  components: { myRequiredList, myTrainList, myElectiveList, myLiveList },
  data() {
    return {
      activeName: 'myRequiredList'
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
