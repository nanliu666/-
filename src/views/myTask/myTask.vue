<template>
  <div>
    <ul class="tabs">
      <li v-for="item in tabsData" :key="item.id" class="tab" @click="clickTab(item.path)">
        <div class="tab_box">
          <span class="tab_icon"> <img :src="item.icon" alt="" /> </span>
          <span class="tab_title" :class="{ clickClass: clickData == item.path }">
            {{ item.name }}
          </span>
          <span class="tab_num" :class="{ clickClass: clickData == item.path }">(11)</span>
        </div>
        <div :class="{ tab_bottom: clickData == item.path }"></div>
      </li>
    </ul>
    <component :is="clickData"></component>
  </div>
</template>
<script>
import myLearn from './myLearn'
import myExamList from './myExamList'
export default {
  components: { myLearn, myExamList },
  data() {
    return {
      tabsData: [
        {
          name: '学习',
          id: 'study',
          path: 'myLearn',
          icon: require('../../../public/img/学习.png')
        },
        {
          name: '作业',
          id: 'task',
          path: '',
          icon: require('../../../public/img/作业.png')
        },
        {
          name: '考试',
          id: 'examination',
          path: 'myExamList',

          icon: require('../../../public/img/考试.png')
        },
        {
          name: '问卷',
          id: 'questionnaire',
          path: '',
          icon: require('../../../public/img/问卷.png')
        }
      ],
      clickData: 'myLearn'
    }
  },
  methods: {
    clickTab(path) {
      this.clickData = path
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
    width: 25%;
    height: 64px;
    padding: 12px 0;

    &_box {
      text-align: center;
      padding: 0 4.5%;
      display: flex;
      justify-content: center;
      cursor: pointer;
      border-right: 1px solid #ebeced;
      :nth-child(4) {
        border-right: none;
      }
    }
    &_icon {
      width: 40px;
      height: 40px;
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
      margin-left: 4vw;
      width: 8vw;
      height: 2px;
      background: #01aafc;
    }
    .clickClass {
      color: #01aafc !important ;
    }
  }
}
</style>
