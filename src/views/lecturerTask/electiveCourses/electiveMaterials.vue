<template>
  <div class="materials">
    <div class="top_breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/lecturerTask/task' }">我的任务</el-breadcrumb-item>
        <el-breadcrumb-item><span class="breadcrumb_span" @click="back"> 课程详情</span></el-breadcrumb-item>
        <el-breadcrumb-item>查看上报材料</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="materials_top">
      <div class="materials_top_title">{{ courseData.name }}的上报材料</div>
      <div class="materials_top_box">
        <div class="materials_top_box_item">
          <span>手机：</span>
          <span>{{ courseData.phonenum }}</span>
        </div>
        <div class="materials_top_box_item">
          <span>所属部门：</span>
          <span>{{ courseData.deptName }}</span>
        </div>
        <div class="materials_top_box_item">
          <span>名称：</span>
          <span>{{ courseData.courseName }}</span>
        </div>
        <div class="materials_top_box_item">
          <span>作业提交率：</span>
          <span>{{ courseData.jobTimes || 0 }}次 / {{ courseData.jobPercent || 0 }}% </span>
        </div>
        <!-- <div class="materials_top_box_item">
          <span>学习心得提交率：</span>
          <span>{{ courseData.jobTimes }} / {{ courseData.jobPercent }}% </span>
        </div> -->
      </div>
    </div>
    <div class="materials_content">
      <div class="materials_content_bar">
        <span :class="{ Select: Select == 1 }" @click="setSelect(1)">课程作业</span>
        <span :class="{ Select: Select == 2 }" @click="setSelect(2)">学习心得</span>
      </div>
      <EourseTask v-show="Select == 1"></EourseTask>
      <Experience v-show="Select == 2"></Experience>
    </div>
  </div>
</template>

<script>
import EourseTask from './courseTask'
import Experience from './Experience'
export default {
  components: {
    EourseTask,
    Experience
  },
  data() {
    return {
      Select: 1,
      courseData: {}
    }
  },
  activated() {
    this.courseData = JSON.parse(this.$route.query.row)
  },
  methods: {
    back() {
      this.$router.back()
    },
    setSelect(i) {
      this.Select = i
    }
  }
}
</script>

<style lang="scss" scoped>
.materials {
  &_top {
    background-color: #fff;
    padding: 25px 50px;
    &_title {
      font-size: 18px;
      font-weight: bold;
    }
    &_box {
      display: flex;
      flex-wrap: wrap;
      &_item {
        margin-top: 15px;
        width: 33%;
      }
    }
  }
  &_content {
    background-color: #fff;
    padding: 10px 50px 100px;
    margin-top: 25px;
    &_bar {
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      display: flex;
      span {
        margin-left: 50px;
        line-height: 70px;
        font-size: 18px;
        cursor: pointer;
      }
      .Select {
        font-weight: bold;
        border-bottom: 4px solid #1677ff;
      }
    }
  }
}
.top_breadcrumb {
  padding: 20px 0;
}
.breadcrumb_span {
  cursor: pointer;
  font-weight: bold;
  color: #303133;
}
</style>
