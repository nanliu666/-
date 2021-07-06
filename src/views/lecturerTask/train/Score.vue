<template>
  <div class="Score">
    <ul class="top">
      <li class="total_score">
        <span class="title"> 培训班整体满意度： </span>
        <span class="content">
          <el-rate
            v-model="setaData.composite"
            disabled
            show-score
            text-color="#333"
            score-template="{value}分"
          >
          </el-rate>
        </span>
      </li>
      <li>
        <span class="title"> 内容符合预期： </span>
        <span class="content">
          <el-rate
            v-model="setaData.first"
            disabled
            show-score
            text-color="#333"
            score-template="{value}分"
          >
          </el-rate>
        </span>
      </li>
      <li>
        <span class="title"> 课程设置合理： </span>
        <span class="content">
          <el-rate
            v-model="setaData.second"
            disabled
            show-score
            text-color="#333"
            score-template="{value}分"
          >
          </el-rate>
        </span>
      </li>
      <li>
        <span class="title"> 培训所有收获： </span>
        <span class="content">
          <el-rate
            v-model="setaData.fourth"
            disabled
            show-score
            text-color="#333"
            score-template="{value}分"
          >
          </el-rate>
        </span>
      </li>
      <li>
        <span class="title"> 教材容易理解： </span>
        <span class="content">
          <el-rate
            v-model="setaData.second"
            disabled
            show-score
            text-color="#333"
            score-template="{value}分"
          >
          </el-rate>
        </span>
      </li>
      <li>
        <span class="title"> 形式利于掌握： </span>
        <span class="content">
          <el-rate
            v-model="setaData.third"
            disabled
            show-score
            text-color="#333"
            score-template="{value}分"
          >
          </el-rate>
        </span>
      </li>
    </ul>
    <ul class="bottom">
      <li v-for="(item, index) in setaData.teachersEvaluate" :key="index">
        <div class="user">
          <!-- <div class="img"> -->
          <img v-if="item.imageUrl" class="img" :src="item.imageUrl" alt="" />
          <div v-else class="img"></div>
          <!-- </div> -->
          <div class="name">
            <div>{{ item.teacherName }}</div>
            <span> 课程： </span>
            <span> {{ item.courseName }} </span>
          </div>
        </div>
        <div class="content">
          <span> 授课质量： </span>
          <span class="rate">
            <el-rate
              v-model="item.teacherScore"
              disabled
              show-score
              text-color="#333"
              score-template="{value}分"
            >
            </el-rate>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getTrainEvaluate } from '@/api/lecturerTask'
export default {
  data() {
    return {
      setaData: {}
    }
  },
  created() {
    this.isgetTrainEvaluate()
  },
  methods: {
    async isgetTrainEvaluate() {
      let res = await getTrainEvaluate({ trainId: this.$route.query.id, userType: 1 })
      for (let key in res) {
        if (key != 'teachersEvaluate') res[key] === '' ? (res[key] = 0) : ''
      }
      this.setaData = res
    }
  }
}
</script>

<style lang="scss" scoped>
.Score {
  padding-top: 41px;
  color: #333;
  ::v-deep i.el-rate__icon.el-icon-star-on {
    font-size: 20px;
    margin: 0;
  }
  .top {
    li {
      margin-top: 10px;
      font-size: 14px;
      display: flex;
      .content {
        display: flex;
        margin-right: 10px;
      }
      .title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        line-height: 22px;
      }
    }
    .total_score {
      .title {
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 600;
      }
      ::v-deep i.el-rate__icon.el-icon-star-on {
        font-size: 26px;
      }
    }
  }
  .bottom {
    margin-top: 24px;
    li {
      display: flex;
      margin-top: 10px;
      .user {
        display: flex;
        align-items: center;
        .img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #f7f7f7;
        }
        .name {
          margin: 15px;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          line-height: 24px;
          font-weight: 600;
        }
      }
      .content {
        display: flex;
        padding: 15px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        line-height: 22px;
        .rate {
          display: flex;
        }
        ::v-deep i.el-rate__icon.el-icon-star-on {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
