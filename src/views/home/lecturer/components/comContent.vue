<template>
  <div class="content__box">
    <div class="content__title">
      <span class="title">{{ data.teacherName }}</span>
      <ul class="content__tags">
        <li v-if="data.isRecommend" class="tag recommend__class">
          推荐讲师
        </li>
        <li v-if="data.teacherLevel" class="tag">
          {{ LECTURER_LEVEL[data.teacherLevel] }}
        </li>
        <li class="tag">
          {{ data.teacherType }}
        </li>
      </ul>
    </div>
    <div class="content__middle" :class="[type === 'list' ? 'list__middle' : 'detail__middle']">
      <div class="split">
        <span>课程数量：</span>
        <span>{{ data.courseQty ? data.courseQty : '--' }}门</span>
      </div>
      <span class="line"></span>
      <div class="split">
        <span>学习人次：</span>
        <span>{{ data.studyNums ? data.studyNums : '--' }}人</span>
      </div>
      <span class="line"></span>
      <div class="split">
        <span>评分：</span>
        <span>{{ data.teacherScore ? data.teacherScore : '--' }}分</span>
      </div>
    </div>
    <div class="content__bottom">
      <div class="split__class">
        <span class="label">专业分类：</span>
        <span>{{ PROFE_MAP[data.professionalCata] }}</span>
      </div>
      <div class="split__class skill__content" v-if="!skilledFields">
        <span class="label">擅长领域：</span>
        <ul v-if="!_.isEmpty(data.skilledFields)" class="skilledFields__ul">
          <li
            v-for="(skillItem, skillIndex) in data.skilledFields"
            :key="skillIndex"
            class="skill__li"
          >
            {{ skillItem }}
          </li>
        </ul>
        <span v-else>--</span>
      </div>
    </div>
    <div class="split__class_de skill__content_de" v-if="skilledFields">
        <span class="label">擅长领域：</span>
        <ul v-if="!_.isEmpty(data.skilledFields)" class="skilledFields__ul">
          <li
            v-for="(skillItem, skillIndex) in data.skilledFields"
            :key="skillIndex"
            class="skill__li"
          >
            {{ skillItem }}
          </li>
        </ul>
        <span v-else>--</span>
      </div>
  </div>
</template>
<script>
const LECTURER_LEVEL = {
  '00': '预备讲师',
  '01': '助理讲师',
  '02': '初级讲师',
  '03': '中级讲师',
  '04': '高级讲师',
  '05': '资深讲师',
  '06': '专家讲师',
  '07': '非讲师'
}
const PROFE_MAP = {
  '01': '技术类',
  '02': '管理类',
  '03': '营销服务类',
  '04': ''
}
export default {
  name: 'ComContent',
  props: {
    skilledFields:{
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'list'
    }
  },
  data() {
    return {}
  },
  computed: {
    LECTURER_LEVEL: () => LECTURER_LEVEL,
    PROFE_MAP: () => PROFE_MAP
  },

  created() {},
  methods: {}
}
</script>
<style scoped lang="scss">
.content__box {
  .content__title {
    display: flex;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: 600;
      margin-right: 16px;
    }
    .content__tags {
      display: flex;
      align-items: center;

      .tag {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #CF9E00;
        background-color: rgba(245,194,0,.15);
        width: 64px;
        height: 20px;
        border-radius: 2px;
        margin-right: 8px;
      }
      .recommend__class {
        color: #ffffff;
        background-color: #f5c200;
      }
    }
  }
  .content__middle {
    display: flex;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    .split {
      // margin-right: 33px;
    }
    .line{
      width: 2px;
      height: 10px;
      margin: auto 16px;
      background: #EBECED;  
    }
  }
  .list__middle {
    margin: 18px 0 16px 0;
  }
  .detail__middle {
    margin: 40px 0 24px 0;
  }
  .content__bottom {
    display: flex;
    flex-wrap: wrap;
    .split__class {
      margin-right: 40px;
      // margin-bottom: 20px;
      .label {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .value {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
      .skilledFields__ul {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        .skill__li {
          min-width: 52px;
          height: 20px;
          padding: 0 6px;
          border-radius: 4px;
          // margin-bottom: 10px;
          background: rgba(0, 11, 21, 0.04);
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8px;
        }
      }
    }
    .skill__content {
      display: flex;
      justify-content: center;
      margin-right: 0;
      .label {
        width: 80px;
      }
    }
  }
  .split__class_de {
      margin-right: 40px;
      // margin-bottom: 20px;
      .label {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .value {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
      .skilledFields__ul {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        .skill__li {
          min-width: 52px;
          height: 20px;
          padding: 0 6px;
          border-radius: 4px;
          // margin-bottom: 10px;
          background: rgba(0, 11, 21, 0.04);
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8px;
        }
      }
    }
    .skill__content_de {
      display: flex;
      margin-right: 0;
      margin-top: 8px;
      .label {
        width: 71px;
      }
    }
}
</style>
