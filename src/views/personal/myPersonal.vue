<template>
  <div class="record">
    <div class="userInfo">
      <div class="userInfo_in">
        <div class="userInfo_in_img">
          <img v-if="infoData.avatarUrl" class="img" :src="infoData.avatarUrl" />
          <div v-else class="img"></div>
        </div>
        <div class="userInfo_in_r">
          <div class="userInfo_name">
            {{ infoData.name }} <span>（{{ infoData.workNo }}）</span>
          </div>
          <div class="userInfo_text">
            <div v-if="infoData.orgName">
              <span class="text_title">部门：</span>
              <span> {{ infoData.orgName }} </span>
            </div>
            <div v-if="infoData.position">
              <span class="text_title">职位：</span>
              <span> {{ infoData.position }} </span>
            </div>
            <div>
              <span class="text_title">电话：</span>
              <span> {{ infoData.phonenum }} </span>
            </div>
          </div>
        </div>
      </div>

      <div class="userInfo_btn">
        <el-button type="primary" @click="toPersonal"> 编辑信息 </el-button>
      </div>

      <!-- <div class="userInfo_bar">
        <span :class="{ pitch: pitch === 0 }" style="cursor: pointer" @click="showBtn(0)">课程</span>
        <span :class="{ pitch: pitch === 1 }" style="cursor: pointer" @click="showBtn(1)">培训</span>
        <span :class="{ pitch: pitch === 2 }" style="cursor: pointer" @click="showBtn(2)">考试</span>
        <span :class="{ pitch: pitch === 3 }" style="cursor: pointer" @click="showBtn(3)">积分</span>
        <span :class="{ pitch: pitch === 4 }" style="cursor: pointer" @click="showBtn(4)">证书</span>
      </div> -->
    </div>
    <!-- <course v-show="pitch === 0"></course>
    <cultivate v-show="pitch === 1"></cultivate>
    <examination v-show="pitch === 2"></examination>
    <credit v-show="pitch === 3"></credit>
    <certificate v-show="pitch === 4"></certificate> -->

    <div class="content">
      <div class="option_bar">
        <ul>
          <li :class="{ pitch: pitch === 0 }" @click="showBtn(0)">
            <i class="el-icon-user"></i> 我的档案 <i :class="{ Line: pitch === 0 }"></i>
          </li>
          <li :class="{ pitch: pitch === 1 }" @click="showBtn(1)">
            <i class="el-icon-user"></i> 我的收藏 <i :class="{ Line: pitch === 1 }"></i>
          </li>
          <li :class="{ pitch: pitch === 2 }" @click="showBtn(2)">
            <i class="el-icon-user"></i> 我的笔记 <i :class="{ Line: pitch === 2 }"></i>
          </li>
          <li :class="{ pitch: pitch === 3 }" @click="showBtn(3)">
            <i class="el-icon-user"></i> 个人设置 <i :class="{ Line: pitch === 3 }"></i>
          </li>
        </ul>
      </div>
      <div class="content_item">2</div>
    </div>
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
export default {
  name: 'Record',
  components: {
    // course: () => import('./components/Course'),
    // cultivate: () => import('./components/Cultivate'),
    // examination: () => import('./components/Examination'),
    // credit: () => import('./components/Credit'),
    // certificate: () => import('./components/Certificate')
  },
  data() {
    return {
      pitch: 0,
      infoData: {}
    }
  },
  created() {
    this.getInfo()
  },
  activated() {
    this.getInfo()
  },
  methods: {
    // 去编辑
    toPersonal() {
      //   this.$router.push({
      //     path: '/my/info'
      //   })
    },
    showBtn(i) {
      this.pitch = i
    },
    async getInfo() {
      this.infoData = await getuserInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.record {
  .userInfo {
    width: 1200px;
    height: 184px;
    // background-color: #ecf6fe;
    background-image: url(../../assets/images/my_record_bg.png);
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
        .img {
          width: 100%;
          height: 100%;
          background-color: #f2f2f2;
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
  }

  .content {
    margin-top: 24px;
    display: flex;
    width: 100%;
    .option_bar {
      width: 20%;
      background-color: pink;
      padding: 20px 0;
      .pitch {
        color: #207efa;
      }
      ul li {
        cursor: pointer;
        padding: 20px;
        position: relative;
        font-size: 16px;
        font-weight: bold;
        .Line {
          position: absolute;
          top: 15px;
          left: 0;
          width: 2px;
          height: 30px;
          background-color: #207efa;
        }
      }
    }
    &_item {
      flex: 1;
      background-color: #ccc;
      margin-left: 24px;
    }
  }
}
</style>
