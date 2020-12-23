<template>
  <div class="record">
    <div class="userInfo">
      <div class="userInfo_in">
        <div class="userInfo_in_img">
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608289740056&di=00f8f4b767c42fa1c8548b4e6731e4e8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F23%2F20190123150727_byuwj.jpg"
            alt=""
          />
        </div>
        <div class="userInfo_in_r">
          <div class="userInfo_name">
            Serati Ma <span>（GZ00253）</span>
          </div>
          <div class="userInfo_text">
            <div>
              <span class="text_title">部门：</span>
              <span> 设计小组 </span>
            </div>
            <div>
              <span class="text_title">职位：</span>
              <span> 产品经理 </span>
            </div>
            <div>
              <span class="text_title">电话：</span>
              <span> 17746614024 </span>
            </div>
          </div>
        </div>
      </div>

      <div class="userInfo_btn">
        <el-button type="primary">
          编辑信息
        </el-button>
      </div>

      <div class="userInfo_bar">
        <span
          :class="{ pitch: pitch === 0 }"
          @click="showBtn(0)"
        >课程</span>
        <span
          :class="{ pitch: pitch === 1 }"
          @click="showBtn(1)"
        >培训</span>
        <span
          :class="{ pitch: pitch === 2 }"
          @click="showBtn(2)"
        >考试</span>
        <span
          :class="{ pitch: pitch === 3 }"
          @click="showBtn(3)"
        >学分</span>
        <span
          :class="{ pitch: pitch === 4 }"
          @click="showBtn(4)"
        >证书</span>
        <span
          :class="{ pitch: pitch === 5 }"
          @click="showBtn(5)"
        >无数据</span>
      </div>
    </div>
    <course v-show="pitch === 0"></course>
    <cultivate v-show="pitch === 1"></cultivate>
    <examination v-show="pitch === 2"></examination>
    <credit v-show="pitch === 3"></credit>
    <certificate v-show="pitch === 4"></certificate>
    <div
      v-show="pitch === 5"
      class="content"
    >
      <div class="content_box">
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608289740056&di=00f8f4b767c42fa1c8548b4e6731e4e8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F23%2F20190123150727_byuwj.jpg"
          alt=""
        />
        <div class="text">
          还没有加入的课程
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Record',
  components: {
    course: () => import('./components/Course'),
    cultivate: () => import('./components/Cultivate'),
    examination: () => import('./components/Examination'),
    credit: () => import('./components/Credit'),
    certificate: () => import('./components/Certificate')
  },
  data() {
    return {
      pitch: 0
    }
  },

  methods: {
    showBtn(i) {
      this.pitch = i
    }
  }
}
</script>

<style lang="scss" scoped>
.record {
  .userInfo {
    width: 1200px;
    height: 184px;
    background-color: #ecf6fe;
    margin-top: 20px;
    padding: 24px;
    position: relative;
    .userInfo_in {
      display: flex;
      .userInfo_in_img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .userInfo_in_r {
        .userInfo_name {
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          font-weight: bold;
          margin-top: 24px;
          span {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
          }
        }
        .userInfo_text {
          margin-top: 8px;
          display: flex;
          margin-left: -24px;
          div {
            display: flex;
            margin-left: 24px;
            padding-right: 24px;
            border-right: 1px solid #d9dbdc;
            line-height: 14px;
            &:nth-child(3) {
              border-right: none;
            }
            span {
              font-size: 14px;
              color: rgba(0, 11, 21, 0.85);
              letter-spacing: 0;
            }
            .text_title {
              font-size: 14px;
              color: rgba(0, 11, 21, 0.45);
              letter-spacing: 0;
            }
          }
        }
      }
    }

    .userInfo_btn {
      position: absolute;
      top: 24px;
      right: 24px;
    }

    .userInfo_bar {
      height: 56px;
      line-height: 56px;
      display: flex;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      letter-spacing: 0;
      position: absolute;
      bottom: 0;
      left: 24px;
      span {
        margin-right: 32px;
      }
      .pitch {
        font-weight: bold;
        color: #01aafc;
        border-bottom: 2px solid #01aafc;
      }
    }
  }

  .content {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    width: 1200px;
    height: 627px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    .content_box {
      width: 338px;
      height: 290px;
      background-color: #ff3;
      img {
        width: 100%;
        height: 100%;
      }
      .text {
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
      }
    }
  }
}
</style>
