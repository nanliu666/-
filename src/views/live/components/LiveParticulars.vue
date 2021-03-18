<template>
  <div class="detail">
    <div v-if="data.authType === 'code'" class="info__login">
      <div class="common__title">
        登录信息
      </div>
      <ul class="content__box">
        <span class="label">直播验证码：</span>
        <span v-if="data.authSecretOrCode" class="value">{{ data.authSecretOrCode }}</span>
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
        <li
          v-for="item in data.courseInfo"
          :key="item.id"
          class="course__li"
          @click="goDetail(item)"
        >
          <el-image class="logo__img" :src="item.coverUrl" fit="cover">
            <div slot="error" class="image__slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="li__title">
            {{ item.courseName }}
          </div>
          <div class="li__name">
            <span class="name">{{ item.teacherName }}</span>
            <!-- <span>
              <i class="iconimage_icon_user iconfont" />
              <span>{{ item.person }}</span>
            </span> -->
          </div>
          <!-- <el-rate v-model="item.score"></el-rate> -->
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
    return {}
  },
  created() {},
  methods: {
    goDetail(data) {
      this.$router.push({ path: '/course/detail', query: { id: data.courseId } })
    }
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
    padding-bottom: 10px;
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
        margin-bottom: 10px;
      }
      .li__title {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #000b15;
        font-weight: 550;
        margin-bottom: 6px;
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
