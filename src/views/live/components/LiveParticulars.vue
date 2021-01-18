<template>
  <div class="detail">
    <div class="info__login">
      <div class="common__title">
        登录信息
      </div>
      <ul class="content__box">
        <span class="label">直播验证码：</span>
        <span v-if="data.qcodeImageUrl" class="value">{{ data.qcodeImageUrl }}</span>
      </ul>
    </div>
    <div class="info__login">
      <div class="common__title">
        直播介绍
      </div>
      <div v-html="_.unescape(data.liveRemark)"></div>
    </div>
    <div>
      <div class="common__title">
        关联课程
      </div>
      <ul class="course__ul">
        <li v-for="item in courseList" :key="item.id" class="course__li">
          <el-image class="logo__img" :src="item.logo" fit="cover">
            <div slot="error" class="image__slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="li__title">
            {{ item.title }}
          </div>
          <div class="li__name">
            <span class="name">{{ item.name }}</span>
            <span>
              <i class="iconimage_icon_user iconfont" />
              <span>{{ item.person }}</span>
            </span>
          </div>
          <el-rate v-model="item.score"></el-rate>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiveParticulars',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      courseList: [
        {
          id: '21',
          title: '课程标题课程标题',
          name: '赵老师',
          person: 324,
          score: 4.5,
          logo:
            'https://car2.autoimg.cn/cardfs/product/g29/M03/48/EF/1024x0_1_q95_autohomecar__ChsEn155d2aAXLzSAAMaJS8gWwA607.jpg'
        },
        {
          id: '127',
          title: '课程标题课程标题',
          name: '赵老师',
          person: 324,
          score: 4.5,
          logo:
            'https://car2.autoimg.cn/cardfs/product/g29/M03/48/EF/1024x0_1_q95_autohomecar__ChsEn155d2aAXLzSAAMaJS8gWwA607.jpg'
        },
        {
          id: '14',
          title: '课程标题课程标题',
          name: '赵老师',
          person: 324,
          score: 4.5,
          logo:
            'https://car2.autoimg.cn/cardfs/product/g29/M03/48/EF/1024x0_1_q95_autohomecar__ChsEn155d2aAXLzSAAMaJS8gWwA607.jpg'
        },
        {
          id: '121',
          title: '课程标题课程标题',
          name: '赵老师',
          person: 324,
          score: 4.5,
          logo:
            'https://car2.autoimg.cn/cardfs/product/g29/M03/48/EF/1024x0_1_q95_autohomecar__ChsEn155d2aAXLzSAAMaJS8gWwA607.jpg'
        },
        {
          id: '1116',
          title: '课程标题课程标题',
          name: '赵老师',
          person: 324,
          score: 4.5,
          logo:
            'https://car2.autoimg.cn/cardfs/product/g29/M03/48/EF/1024x0_1_q95_autohomecar__ChsEn155d2aAXLzSAAMaJS8gWwA607.jpg'
        }
      ]
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    // 加载函数
    async loadTableData() {}
  }
}
</script>

<style scoped lang="scss">
.detail {
  padding-top: 9px;
  margin-bottom: -20px;
  .label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(#000b15, 0.45);
  }
  .value {
    opacity: 0.85;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000b15;
  }
  .common__title {
    position: relative;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: 550;
    padding-left: 12px;
    margin-bottom: 16px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      background-color: #01aafc;
      width: 4px;
      height: 100%;
    }
  }
  .info__login {
    margin-bottom: 24px;
    .content__box {
    }
  }
  .course__ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    &::after {
      content: '';
      width: calc(100% / 4);
    }
    .course__li {
      cursor: pointer;
      width: calc(100% / 4);
      margin-bottom: 20px;
      .logo__img {
        width: 273px;
        height: 158px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
      .li__title {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #000b15;
        font-weight: 550;
        margin-bottom: 16px;
      }
      .li__name {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(#000b15, 0.45);
        margin-bottom: 12px;
        .name {
          margin-right: 16px;
        }
        .iconfont {
          font-size: 10px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
