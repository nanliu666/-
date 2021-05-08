<template>
  <div>
    <div class="learningCourse">
      <div class="homeRightTitle">
        <span>在学课程</span>
        <!-- <router-link to="">更多</router-link> -->
      </div>
      <div
        v-for="item in learningCourseData.data"
        :key="item.id"
        class="learningCourseItem"
        @click="learningCourseFn(item)"
      >
        <img
          :src="item.coverUrl ? item.coverUrl : '/img/autoL.png'"
          width="102"
          height="58"
          alt=""
        />
        <div class="courseText">
          <h3 class="courseTitle">{{ item.name }}</h3>
          <span class="courseTime">时长 {{ item.duration }}</span>
          <!--  时长 -->
          <span class="coursePercent">{{ item.totalPrecent }}%</span>
          <div style="clear: both"></div>
          <el-progress
            :percentage="item.totalPrecent"
            :stroke-width="4"
            style="padding-top: 5px"
            :format="format"
          ></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeSideLearnCourse',
  props: {
    learningCourseData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    format() {
      return '' //percentage === 100 ? '满' : `${percentage}%`;
    },
    learningCourseFn(item) {
      // 我学习中的课程跳转
      this.$router.push({
        path: `/course/detail?id=${item.id}`
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
