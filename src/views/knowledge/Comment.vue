<template>
  <div class="comment-styles">
    <div class="comment-top">
      <div class="top-title">
        <div class="title">
          给该课程打分：
        </div>
        <el-rate
          v-model="value1"
          allow-half
        ></el-rate>
      </div>
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="2"
        placeholder="评论一下吧"
        maxlength="500"
        resize="none"
        show-word-limit
        @focus="inputFocus"
      >
      </el-input>
      <el-button
        v-if="hasPublish"
        class="button-box"
        type="primary"
        size="medium"
        @click="publish"
      >
        发布
      </el-button>
    </div>
    <div class="comment-bottom">
      <ul
        v-if="!_.isEmpty(commentList)"
        class="comment-ul"
      >
        <li
          v-for="(item, index) in commentList"
          :key="index"
          class="comment-li"
        >
          <div class="li-top">
            <el-avatar
              size="small"
              :src="item.circleUrl || circleUrl"
            ></el-avatar>
            <span class="title-name">{{ item.name }}</span>
          </div>
          <div style="padding-left:36px">
            <div class="li-middle">
              2020-10-15 15:32
            </div>
            <el-rate
              v-model="item.rate"
              disabled
              allow-half
            ></el-rate>
            <div class="li-bottom">
              {{ item.comment }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      hasPublish: false,
      value1: 0,
      textarea: '',
      commentList: [
        // {
        //   name: 'VIP用户A',
        //   circleUrl: '',
        //   rate: 4,
        //   comment: '讲的哈'
        // }
      ]
    }
  },
  created() {},
  methods: {
    inputFocus() {
      this.hasPublish = true
    },
    publish() {
      this.hasPublish = false
    }
  }
}
</script>

<style scoped lang="scss">
.comment-styles {
  .comment-top {
    margin-bottom: 28px;

    .top-title {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      .title {
        font-weight: 550;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
      }
    }
    .button-box {
      margin-top: 16px;
      float: right;
    }
  }
  .comment-bottom {
    .comment-ul {
      .comment-li {
        margin-bottom: 25px;
        &:last-child {
          margin-bottom: 0;
        }
        .li-top {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          .title-name {
            margin-left: 8px;
          }
        }
        .li-middle {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          margin-bottom: 8px;
        }
        .li-bottom {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
