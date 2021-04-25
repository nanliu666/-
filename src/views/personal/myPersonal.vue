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
    </div>

    <div class="content">
      <div class="option_bar">
        <ul>
          <li
            v-for="(item, index) in LeftData"
            :key="index"
            :class="{ pitch: pitch === index }"
            @click="showBtn(index)"
          >
            <i :class="item.icon"></i> {{ item.title }} <i :class="{ Line: pitch === index }"></i>
          </li>
        </ul>
      </div>
      <div class="content_item">
        <MyFiles v-show="pitch === 0"></MyFiles>
        <MyCollection v-show="pitch === 1"></MyCollection>
        <MyNotes v-show="pitch === 2"></MyNotes>
        <MyMentor v-show="pitch === 3"></MyMentor>
        <MyApprentice v-show="pitch === 4"></MyApprentice>
        <MyShare v-show="pitch === 5"></MyShare>
        <PersonalSettings v-show="pitch === 6"></PersonalSettings>
      </div>
    </div>
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
export default {
  name: 'Record',
  components: {
    MyFiles: () => import('./components/MyFiles'), //我的档案
    MyCollection: () => import('./components/MyCollection'), //我的收藏
    MyNotes: () => import('./components/MyNotes'), //我的笔记
    MyMentor: () => import('./components/MyMentor'), // 我的导师/学徒
    MyApprentice: () => import('./components/MyApprentice'), // 我的导师/学徒
    MyShare: () => import('./components/MyShare'), //我的分享
    PersonalSettings: () => import('./components/PersonalSettings') //个人设置
  },
  data() {
    return {
      // 右侧显示
      pitch: 0,

      // 头部个人信息
      infoData: {},

      // 左侧数据结构
      LeftData: [
        {
          title: '我的档案',
          icon: 'el-icon-user'
        },
        {
          title: '我的收藏',
          icon: 'el-icon-user'
        },
        {
          title: '我的笔记',
          icon: 'el-icon-user'
        },
        {
          title: '我的导师',
          icon: 'el-icon-user'
        },
        {
          title: '我的学徒',
          icon: 'el-icon-user'
        },

        {
          title: '我的分享',
          icon: 'el-icon-user'
        },
        {
          title: '个人设置',
          icon: 'el-icon-user'
        }
      ]
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
    justify-content: space-between;
    .option_bar {
      width: 20%;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      padding: 20px 0;
      height: 450px;
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
      width: 77.5%;
    }
  }
}
</style>
