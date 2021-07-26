<template>
  <div class="record">
    <div class="userInfo_banner">
      <div class="info_box">
        <div class="bxo_l">
          <div class="head_portrait">
            <img v-if="infoData.avatarUrl" class="img" :src="infoData.avatarUrl" />
            <div v-else class="img"></div>
          </div>
          <div class="name">
            <div>{{ infoData.name || '--' }}</div>
            <div class="txt_nmu">{{ infoData.workNo || '--' }}</div>
          </div>
        </div>
        <ul class="bxo_r">
          <li>
            <div class="name">部门</div>
            <div class="text">
              <text-over-tooltip
                ref-name="testName1"
                class-name="20"
                :content="infoData.orgLinkName"
              ></text-over-tooltip>
            </div>
            <i></i>
          </li>
          <li>
            <div class="name">职务</div>
            <div class="text">{{ infoData.post || '--' }}</div>
            <i></i>
          </li>
          <li>
            <div class="name">电话</div>
            <div class="text">{{ infoData.phonenum || '--' }}</div>
            <i></i>
          </li>
        </ul>
      </div>
    </div>

    <div class="content">
      <div class="option_bar">
        <ul>
          <li
            v-for="(item, index) in LeftData"
            :key="index"
            :class="{ pitch: pitch === item.name }"
            @click="showBtn(index)"
          >
            <i :class="item.icon"> </i> &nbsp; {{ item.title }}
            <i :class="{ Line: pitch === item.name }"></i>
          </li>
        </ul>
      </div>
      <div class="content_item">
        <MyFiles v-show="pitch === 'MyFiles'"></MyFiles>
        <MyCollection v-if="pitch === 'MyCollection'"></MyCollection>
        <MyNotes v-show="pitch === 'MyNotes'"></MyNotes>
        <MyShare v-show="pitch === 'MyShare'"></MyShare>
        <MyMentor v-show="pitch === 'MyMentor'" @MyMentorSon="MyMentorSonFn"></MyMentor>
        <MyApprentice
          v-show="pitch === 'MyApprentice'"
          @MyApprenticeSon="MyApprenticeSonFn"
        ></MyApprentice>
        <PersonalSettings v-show="pitch === 'PersonalSettings'"></PersonalSettings>
      </div>
    </div>
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
import TextOverTooltip from '../course/components/TextOverTooltip'
export default {
  name: 'Record',
  components: {
    MyFiles: () => import('./components/MyFiles'), //我的档案
    MyCollection: () => import('./components/MyCollection'), //我的收藏   现在先不做
    MyNotes: () => import('./components/MyNotes'), //我的笔记
    MyMentor: () => import('./components/MyMentor'), // 我的导师
    MyApprentice: () => import('./components/MyApprentice'), // 我的学徒
    MyShare: () => import('./components/MyShare'), //我的分享
    PersonalSettings: () => import('./components/PersonalSettings'), //个人设置
    TextOverTooltip
  },
  data() {
    return {
      // 右侧显示
      pitch: 'MyFiles',

      // 头部个人信息
      infoData: {},

      // 左侧数据结构
      LeftData: [
        {
          title: '我的档案',
          name: 'MyFiles',
          icon: 'el-icon-receiving'
        },
        {
          title: '我的收藏',
          name: 'MyCollection',
          icon: 'el-icon-paperclip'
        },
        {
          title: '我的笔记',
          name: 'MyNotes',
          icon: 'el-icon-date'
        },
        {
          title: '我的分享',
          name: 'MyShare',
          icon: 'el-icon-share'
        },
        {
          title: '我的导师',
          name: 'MyMentor',
          icon: 'el-icon-user'
        },
        {
          title: '我的学徒',
          name: 'MyApprentice',
          icon: 'el-icon-user'
        },

        {
          title: '个人设置',
          name: 'PersonalSettings',
          icon: 'el-icon-setting'
        }
      ]
    }
  },
  watch: {
    $route: 'initializationFn'
  },
  created() {
    this.getInfo()
  },
  methods: {
    initializationFn() {
      this.pitch = this.$route.query.pitch || 'MyFiles'
    },

    MyApprenticeSonFn(i) {
      if (i.length === 0) {
        let index = this.LeftData.findIndex((item) => item.name == 'MyApprentice')
        if (index != -1) this.LeftData.splice(index, 1)
      }
    },
    MyMentorSonFn(i) {
      if (i.length === 0) {
        // this.LeftData.splice(
        //   this.LeftData.findIndex((item) => item.name == 'MyMentor'),
        //   1
        // )
        let index = this.LeftData.findIndex((item) => item.name == 'MyMentor')
        if (index != -1) this.LeftData.splice(index, 1)
      }
    },
    // 去编辑
    toPersonal() {
      //   this.$router.push({
      //     path: '/my/info'
      //   })
    },
    showBtn(i) {
      this.pitch = this.LeftData[i].name
    },
    async getInfo() {
      this.infoData = await getuserInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.record {
  .userInfo_banner {
    width: 3600px;
    margin: 0 auto;
    transform: translateX(-1200px);
    background-image: url(../../../public/img/personal/marshalling.png);
    height: 200px;
    .info_box {
      margin: 0 auto;
      width: 1200px;
      height: 200px;
      display: flex;
      justify-content: space-between;
      .bxo_l {
        margin-top: 40px;
        display: flex;
        color: rgba(255, 255, 255, 0.85);
        .img {
          width: 120px;
          height: 120px;
          background-color: #ccc;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.8);
        }
        .name {
          margin: 20px;
          div {
            font-family: PingFangSC-Medium;
            font-size: 24px;
            color: rgba(255, 255, 255, 0.85);
            letter-spacing: 0;
            line-height: 28px;
            font-weight: 500;
          }
          .txt_nmu {
            font-size: 12px;
            margin-top: 16px;
            border: 1px solid rgba(255, 255, 255, 0.349);
            border-radius: 4px;
            height: 24px;
            width: 72px;
            line-height: 22px;
            text-align: center;
          }
        }
      }
      .bxo_r {
        display: flex;
        margin-top: 74px;
        li {
          padding: 0 40px;
          position: relative;

          i {
            position: absolute;
            top: 10px;
            right: 0;
            width: 1px;
            height: 30px;
            background-color: #79b5ed;
          }
          &:last-child i {
            background-color: rgba(255, 255, 255, 0);
          }
          .name {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            line-height: 22px;
            font-weight: 400;
            opacity: 0.7;
          }
          .text {
            margin-top: 16px;
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            line-height: 22px;
            font-weight: 500;
            max-width: 260px;
          }
        }
      }
    }
  }

  .content {
    display: flex;
    align-items: stretch;
    margin-top: 20px;
    width: 100%;
    margin-bottom: 60px;
    .option_bar {
      width: 285px;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      padding: 20px 0;
      .pitch {
        color: #207efa;
      }
      ul li {
        cursor: pointer;
        padding: 17px 42px;
        position: relative;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 22px;
        font-weight: 400;

        .Line {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 56px;
          background-color: #2875d4;
          color: #2875d4;
        }
      }
    }
    .content_item {
      margin-left: 20px;
      flex: 1;
    }
  }
}
</style>
