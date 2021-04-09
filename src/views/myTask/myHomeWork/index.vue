<template>
  <div class="tabs_box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="必修课" name="compulsoryCourses"> </el-tab-pane>
      <el-tab-pane label="培训" name="training"></el-tab-pane>
      <el-tab-pane label="选修课" name="electiveCourse"></el-tab-pane>
    </el-tabs>
    <component :is="activeName"></component>
  </div>
</template>
<script>
import compulsoryCourses from './compulsoryCourses' //必修课
import training from './training' //培训
import electiveCourse from './electiveCourse' //选修课
export default {
  components: { compulsoryCourses, training, electiveCourse },
  data() {
    return {
      activeName: 'compulsoryCourses'
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
