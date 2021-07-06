<template>
  <div>
    <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">热门课程</span>
      <router-link :to="'/course/list'">
        查看更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <template v-for="(item, i) in hotCourseData">
          <div v-if="i > 0" :key="item.courseId" class="homeCourse">
            <router-link :to="'/course/detail?id=' + item.courseId">

              <div style="width:100%">
            <img class="img"  width="285" height="166" :src="item.coverUrl ? item.coverUrl : '/img/autoL.png'" alt="" />
            <div class="homeTrainTitle">
              <div class="title">
                {{ item.courseName }}
            </div>
            <div class="homeTrainText">
              <span>讲师：{{ item.teacherName}}</span>
              <span class="line"></span>
              <span>学习人数：{{ item.people }}</span>
            </div>
            <div  class="homeTrainTextItem">
               <el-rate
                    v-model="item.scope"
                    disabled
                    show-score
                    text-color="#72787E"
                    disabled-void-color="#ccc"
                    score-template="{value}"
                  ></el-rate>
              <span class="tag" v-if="item.knowledgeSystemName">{{ item.knowledgeSystemName }}</span>
            </div>
            </div>
          </div>
            </router-link>
          </div>
          <div v-if="i == 0" :key="item.courseId" class="recommendCourse">
            <router-link :to="'/course/detail?id=' + item.courseId">
              <img
                :src="item.coverUrl ? item.coverUrl : '/img/autoB.png'"
                width="590"
                height="282"
                alt=""
                style="border-radius: 4px;"
              />
              <div class="recommendCourseTextP">
                <div class="recommendCourseText">
                  <span class="recommendCourseTitle">{{ item.courseName }}</span>
                  <div class="recommendGrade">
                    <span>讲师：{{ item.teacherName}}</span>
                    <span class="line"></span>
                    <span>学习人数：{{ item.people }}人</span>
                  </div>
                  <div class="learnNub">
                   <el-rate
                      v-model="item.scope"
                      disabled
                      show-score
                      text-color="#72787E"
                      score-template="{value}"
                    >
                    </el-rate>
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
<style lang="scss" scoped>
.rate{
  font-size: 16px;
}
</style>
