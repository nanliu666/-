<template>
  <!-- CSS起名规则按照BEM -->
  <div class="live">
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />
    <el-card>
      <div class="live__header">
        <div class="header__left">
          <div class="header__logo">
            <el-image class="logo__img" :src="detailData.fileUrl" fit="cover">
              <div slot="error" class="image__slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
          <div class="header__content">
            <com-content :skilledFields="true" :data="detailData" type="detail" />
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="live__main">
      <el-tabs v-model="activeIndex" class="live__tabs" @tab-click="handleSelect">
        <el-tab-pane  label="讲师介绍" name="1">
          <div v-if="detailData.introduction" class="introduction__class">
            <div v-html="_.unescape(detailData.introduction)" />
          </div>
          <common-empty v-else />
        </el-tab-pane>
        <el-tab-pane label="授课记录" name="2">
          <course-record />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import { queryTeacherMienDetail } from '@/api/home'
import ComContent from './components/comContent'
import CourseRecord from './components/courseRecord'
import CommonEmpty from '@/components/common-empty/Empty'
import { mapGetters } from 'vuex'
export default {
  name: 'LecturerDetail',
  components: {
    CommonBreadcrumb,
    ComContent,
    CourseRecord,
    CommonEmpty
  },
  data() {
    return {
      routeList: [
        {
          path: '/home',
          title: '首页'
        },
        {
          path: '/lecturer/list',
          title: '讲师风采'
        },
        {
          path: '/lecturer/detail',
          title: '讲师详情'
        }
      ],
      activeIndex: '1',
      detailData: {}
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  activated() {
    this.initData()
  },
  methods: {
    initData() {
      queryTeacherMienDetail({ id: this.$route.query.id }).then((res) => {
        this.detailData = res
      })
    },
    // 切换nav
    handleSelect(tab) {
      this.activeIndex = tab.name
    }
  }
}
</script>

<style scoped lang="scss">
.live {
  .live__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header__left {
      display: flex;
      .header__logo {
        position: relative;
        width: 480px;
        height: 270px;
        margin-right: 24px;
        .logo__img {
          width: 100%;
          height: 100%;
          background-color: #d0d0d0;
        }
        .header__play {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 48px;
          height: 48px;
          background: rgba(0, 11, 21, 0.45);
          border-radius: 100%;
          margin-left: -24px;
          margin-top: -24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .play-icon {
            width: 0;
            height: 0;
            margin-left: 8px;
            border-top: 10px solid transparent;
            border-left: 20px solid #ffffff;
            border-bottom: 10px solid transparent;
          }
        }
      }
      .header__content {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
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
        .header__title {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #000b15;
          font-weight: 550;
          margin-bottom: 16px;
        }
        .content__classify {
        }
        .live__time {
          display: flex;
          .value__li {
            margin-bottom: 6px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .content {
          margin-bottom: 8px;
        }
      }
    }
    .header__right {
      .qrcode__img {
        width: 130px;
        height: 130px;
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .live__main {
    margin-top: 20px;
    min-height: 55vh;
    .live__tabs{
        /deep/.el-tabs__item {
          font-family: PingFangSC-Regular;
          font-size: 16px;
        }
    }
  }
}
</style>
