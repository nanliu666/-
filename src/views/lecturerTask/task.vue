<template>
  <div>
    <ul class="tabs">
      <li v-for="(item, index) in tabsData" :key="item.id" class="tab" @click="clickTab(item.path)">
        <div class="tab_box" :class="{ lastClass: index == tabsData.length - 1 }">
          <!-- <span class="tab_icon"> <img :src="item.icon" alt="" /> </span> -->
          <i
            class="iconfont tab_icon"
            :class="{
              clickClass: clickData == item.path,
              iconxuexi: index === 0,
              iconpeixun: index === 1,
              iconjingpinkecheng: index === 2,
              icon02f: index === 3
            }"
          ></i>
          <span class="tab_title" :class="{ clickClass: clickData == item.path }">
            {{ item.name }}
          </span>
          <!-- <span class="tab_num" :class="{ clickClass: clickData == item.path }">
            (
            <span v-if="index == 0"> {{ studyNum }} </span>
            <span v-if="index == 1"> {{ homeWorkNum }} </span>
            <span v-if="index == 2"> {{ examinationNum }} </span>
            <span v-if="index == 3"> {{ questionTodoNum }} </span>

            )
          </span> -->
        </div>
        <div :class="{ tab_bottom: clickData == item.path }"></div>
      </li>
    </ul>
    <component :is="clickData"></component>
  </div>
</template>
<script>
import requiredCourseList from './requiredCourse/requiredCourseList' //必修课
import trainList from './train/trainList' //培训
import electiveCoursesList from './electiveCourses/electiveCoursesList' //选修课
import liveList from './live/liveList' //直播
export default {
  components: { electiveCoursesList, liveList, requiredCourseList, trainList },
  data() {
    return {
      tabsData: [
        {
          name: '必修课',
          id: 'requiredCourseList',
          path: 'requiredCourseList',
          icon: 'iconxuexi'
        },
        {
          name: '培训',
          id: 'trainList',
          path: 'trainList',
          icon: 'iconpeixun'
        },
        {
          name: '选修课',
          id: 'electiveCoursesList',
          path: 'electiveCoursesList',
          icon: 'iconjingpinkecheng'
        },
        {
          name: '直播',
          id: 'liveList',
          path: 'liveList',
          icon: 'icon02f'
        }
      ],
      clickData: 'requiredCourseList',
      studyNum: 0,
      examinationNum: 0,
      homeWorkNum: 0,
      questionTodoNum: 0
    }
  },
  created() {
    this.getInfo()
  },
  activated() {
    this.getInfo()
  },
  methods: {
    clickTab(path) {
      this.clickData = path
    },
    async getInfo() {
      //   // 学习待办条数
      //   this.studyNum = await studyTodoNum()
      //   // 考试待办条数
      //   this.examinationNum = await examTodoNum()
      //   // 作业待办条数
      //   this.homeWorkNum = await homeWorkNum()
      //   // 问卷待办条数
      //   let res = await questionTodoNum()
      //   this.questionTodoNum = res.asqTodoList
    }
  }
}
</script>

<style scoped lang="scss">
.tabs {
  width: 100%;
  margin-top: 24px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  display: flex;

  .tab {
    width: 50%;
    height: 64px;
    padding: 12px 0;
    color: rgba(0, 11, 21, 0.65);
    &_box {
      text-align: center;
      padding: 0 4.5%;
      display: flex;
      justify-content: center;
      cursor: pointer;
      border-right: 1px solid #ebeced;
      // :last-child
    }
    &_icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-block;
      line-height: 40px;
      font-size: 20px;
      color: #d9d9d9;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      letter-spacing: 0;
      line-height: 32px;
      margin: 0 8px;
      padding-top: 4px;
      color: rgba(0, 11, 21, 0.65);
    }
    &_num {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #5e656c;
      letter-spacing: 0;
      line-height: 32px;
      padding-top: 4px;
    }
    &_bottom {
      margin-top: 12px;
      margin-left: 35%;
      width: 30%;
      height: 2px;
      background: #2875d4;
    }
    .clickClass {
      color: #2875d4 !important ;
    }
  }
}
.lastClass {
  border: none !important ;
}
</style>
