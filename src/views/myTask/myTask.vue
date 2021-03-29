<template>
  <div>
    <ul class="tabs">
      <li v-for="item in tabsData" :key="item.id" class="tab" @click="clickTab(item.id)">
        <div class="tab_box">
          <span class="tab_icon"></span>
          <span class="tab_title" :class="{ clickClass: clickData == item.id }">{{
            item.name
          }}</span>
          <span class="tab_num" :class="{ clickClass: clickData == item.id }">(11)</span>
        </div>
        <div :class="{ tab_bottom: clickData == item.id }"></div>
      </li>
    </ul>

    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabsData: [
        {
          name: '学习',
          id: 'study'
        },
        {
          name: '作业',
          id: 'task'
        },
        {
          name: '考试',
          id: 'examination'
        },
        {
          name: '问卷',
          id: 'questionnaire'
        }
      ],
      clickData: 'study'
    }
  },
  methods: {
    clickTab(id) {
      this.clickData = id
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
      background-color: pink;
    }
    &_title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #5d646b;
      letter-spacing: 0;
      line-height: 32px;
      margin: 0 8px;
      font-weight: bold;
    }
    &_num {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #5e656c;
      letter-spacing: 0;
      line-height: 32px;
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
