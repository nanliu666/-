<template>
  <div>
    <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">热门课程</span>
      <router-link :to="'/course/list'">
        更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <template v-for="(item, i) in hotCourseData">
          <div v-if="i > 0" :key="item.courseId" class="homeCourse">
            <router-link :to="'/course/detail?id=' + item.courseId">
              <div class="homeCourseImg">
                <img
                  :src="item.coverUrl ? item.coverUrl : '/img/autoL.png'"
                  width="285"
                  height="168"
                  alt=""
                />
              </div>
              <div class="homeCourseText">
                <span class="homeCourseTitle" to="">{{ item.courseName }}</span>
                <div class="grade">
                  <el-rate
                    v-model="item.scope"
                    disabled
                    show-score
                    text-color="#72787E"
                    disabled-void-color="#ccc"
                    score-template="{value}"
                  ></el-rate>
                </div>
                <div class="livePerInfo">
                  <span class="iconimage_icon_user iconfont userIcon"></span>
                  <span style="font-size: 12px">{{ item.people }}人学习</span>
                </div>
              </div>
            </router-link>
          </div>
          <div v-if="i == 0" :key="item.courseId" class="recommendCourse">
            <router-link :to="'/course/detail?id=' + item.courseId">
              <img
                :src="item.coverUrl ? item.coverUrl : '/img/autoB.png'"
                width="590"
                height="305"
                alt=""
                style="border-radius: 4px;"
              />
              <div class="recommendCourseTextP">
                <div class="recommendCourseText">
                  <span class="recommendCourseTitle">{{ item.courseName }}</span>
                  <div class="recommendGrade">
                    <el-rate
                      v-model="item.scope"
                      disabled
                      show-score
                      text-color="#72787E"
                      score-template="{value}"
                    >
                    </el-rate>
                  </div>
                  <div class="learnNub">
                    <span class="iconimage_icon_user iconfont userIcon"></span>
                    <span style="font-size: 12px">{{ item.people }}人学习</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeHotCourse',
  props: {
    hotCourseData: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
