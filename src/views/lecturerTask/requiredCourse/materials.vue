<template>
  <div class="materials">
    <div class="top_breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/lecturerTask/task' }">我的任务</el-breadcrumb-item>
        <el-breadcrumb-item><span style="cursor: pointer" @click="goBack"> 必修课详情</span></el-breadcrumb-item>
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
          <span>必修课名称：</span>
          <span>{{ courseData.studyPlanName }}</span>
        </div>
        <div class="materials_top_box_item">
          <span>作业提交率：</span>
          <span>{{ courseData.jobTimes || 0 }}次 / {{ courseData.jobPercent || 0 }}% </span>
        </div>
        <div class="materials_top_box_item">
          <span>学习心得提交率：</span>
          <span>{{ courseData.feelTimes || 0 }} 次</span>
        </div>
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
import { getMaterialsDetail } from '@/api/lecturerTask'
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
    this.isgetMaterialsDetail()
  },
  created() {
    this.isgetMaterialsDetail()
  },
  methods: {
    async isgetMaterialsDetail() {
      let params = {
        studyPlanId: this.$route.query.studyPlanId,
        stuId: this.$route.query.stuId
      }
      this.courseData = await getMaterialsDetail(params)
    },
    goBack() {
      this.$router.go(-1)
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
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 24px;
    &_title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      margin-bottom: 24px;
      font-weight: 600;
    }
    &_box {
      display: flex;
      flex-wrap: wrap;
      &_item {
        margin-top: 15px;
        width: 33%;
        & span:nth-of-type(1) {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
          line-height: 22px;
        }
        & span:last-of-type {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          line-height: 22px;
        }
      }
    }
  }
  &_content {
    background-color: #fff;
    padding: 24px 24px 30px;
    margin-top: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px 0 4px 4px 4px;
    &_bar {
      border-bottom: 1px solid #ebeced;
      margin-bottom: 20px;
      display: flex;
      span {
        cursor: pointer;
        font-size: 16px;
        color: #596067;
        line-height: 24px;
        margin-right: 40px;
        padding-bottom: 16px;
      }
      .Select {
        color: #2875d4;
        font-weight: 600;
        border-bottom: 3px solid #2875d4;
      }
    }
  }
}
.top_breadcrumb {
  padding: 20px 0;
}
</style>
