<template>
  <div>
    <ul class="tabs">
      <li v-for="(item, index) in tabsData" :key="item.id" class="tab" @click="clickTab(item.path)">
        <div class="tab_box" :class="{ lastClass: index == tabsData.length - 1 }">
          <span class="tab_icon">
            <img class="topIcon" :src="topIcon(item)" alt="" />
          </span>
          <span class="tab_title" :class="{ clickClass: clickData == item.path }">
            {{ item.name }}
          </span>
          <span v-if="index != 4" class="tab_num" :class="{ clickClass: clickData == item.path }">(
            <span v-if="index == 0"> {{ studyNum }} </span>
            <span v-if="index == 1"> {{ homeWorkNum }} </span>
            <span v-if="index == 2"> {{ examinationNum }} </span>
            <span v-if="index == 3"> {{ questionTodoNum }} </span>
            )</span>
        </div>
        <div :class="{ tab_bottom: clickData == item.path }"></div>
      </li>
    </ul>
    <component :is="clickData" ref="mytask"></component>
  </div>
</template>
<script>
import taskIcon from '@/components/svg-icon'
import myLearn from './myLearn'
import myExamList from './myExamList'
import myHomeWork from './myHomeWork'
import questionnaire from './questionnaire'
import studyMap from './studyMap'
import { studyTodoNum, examTodoNum, homeWorkNum, questionTodoNum } from '@/api/myTask'
export default {
  components: { myLearn, myExamList, questionnaire, myHomeWork, studyMap, taskIcon },

  data() {
    return {
      clickData: '',
      tabsData: [
        {
          name: '学习',
          id: 'study',
          path: 'myLearn'
        },
        {
          name: '作业',
          id: 'task',
          path: 'myHomeWork'
        },
        {
          name: '考试',
          id: 'examination',
          path: 'myExamList'
        },
        {
          name: '问卷',
          id: 'questionnaire',
          path: 'questionnaire'
        },
        {
          name: '学习地图',
          id: 'studyMap',
          path: 'studyMap'
        }
      ],
      studyNum: 0,
      examinationNum: 0,
      homeWorkNum: 0,
      questionTodoNum: 0
    }
  },
  computed: {
    topIcon() {
      return (data) => {
        let url = ''
        switch (data.path) {
          case 'myLearn':
            url = this.clickData === 'myLearn' ? 'activeStudy.svg' : 'study.svg'
            break
          case 'myHomeWork':
            url = this.clickData === 'myHomeWork' ? 'activeWork.svg' : 'work.svg'
            break
          case 'myExamList':
            url = this.clickData === 'myExamList' ? 'activeTest.svg' : 'test.svg'
            break
          case 'questionnaire':
            url = this.clickData === 'questionnaire' ? 'activeQuestion.svg' : 'question.svg'
            break
          case 'studyMap':
            url = this.clickData === 'studyMap' ? 'avtiveMap.svg' : 'map.svg'
            break
        }

        return require('@/assets/images/myTask/' + url)
      }
    }
  },
  created() {
    this.getInfo()
  },
  activated() {
    if (this.$route.params.questionnaire) {
      this.clickData = _.get(this.$route, 'query.clickData', 'questionnaire')
    } else {
      this.clickData = _.get(this.$route, 'query.clickData', 'myLearn')
    }

    this.getInfo()
  },
  methods: {
    clickTab(path) {
      this.clickData = path
    },
    async getInfo() {
      // 学习待办条数
      this.studyNum = await studyTodoNum()
      // 考试待办条数
      this.examinationNum = await examTodoNum()
      // 作业待办条数
      this.homeWorkNum = await homeWorkNum()
      // 问卷待办条数
      let res = await questionTodoNum()
      this.questionTodoNum = res.asqTodoList
      //更新问卷数据
      if (this.clickData === 'questionnaire') {
        this.$refs.mytask.getQuestionnaireList()
      }
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
    &_box {
      text-align: center;
      padding: 0 4.5%;
      display: flex;
      justify-content: center;
      cursor: pointer;
      border-right: 1px solid #ebeced;
      align-items: center;
    }
    &_icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-block;
      line-height: 40px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #5d646b;
      letter-spacing: 0;
      line-height: 32px;
      margin: 0 8px;
      font-weight: bold;
      padding-top: 4px;
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
