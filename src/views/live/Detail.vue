<template>
  <!-- CSS起名规则按照BEM -->
  <div class="live">
    <common-breadcrumb ref="breadcrumb" />
    <el-card>
      <div class="live__header">
        <div class="header__left">
          <div class="header__logo">
            <el-image
              class="logo__img"
              src="https://scpic.chinaz.net/files/pic/pic9/202101/apic30172.jpg"
              fit="cover"
            >
              <div slot="error" class="image__slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="header__person">
              <i class="iconimage_icon_user iconfont" />
              <span>321</span>
            </div>
            <div class="header__status">
              直播中
            </div>
            <div class="header__play">
              <span class="play-icon" />
            </div>
          </div>
          <div class="header__content">
            <div>
              <div class="header__title">
                JAVA函数编程
              </div>
              <div>
                <div class="content__classify content">
                  <span class="label">直播分类：</span>
                  <span class="value">UCD中心</span>
                </div>
                <div class="content">
                  <span class="label">直播讲师：</span>
                  <span class="value">李文、赵老师</span>
                </div>
                <div class="content">
                  <span class="label">课程类型：</span>
                  <span class="value">在线类型</span>
                </div>
              </div>
            </div>
            <el-button type="primary" size="medium">
              继续直播
            </el-button>
          </div>
        </div>
        <div class="header__right">
          <vue-qr
            class="qrcode__img"
            text="qrcode.url"
            :margin="0"
            color-light="#fff"
            :logo-corner-radius="11"
            :size="200"
          />
          <div class="qrcode__handler">
            <span>扫码观看</span>
            <span class="qrcode__copy">复制链接</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="live__main">
      <el-tabs v-model="activeIndex" @tab-click="handleSelect">
        <el-tab-pane label="直播信息" name="1">
          <live-info />
        </el-tab-pane>
        <el-tab-pane label="数据统计" name="2">
          <live-statistics />
        </el-tab-pane>
        <el-tab-pane label="直播详情" name="3">
          <live-particulars />
        </el-tab-pane>
        <el-tab-pane label="直播回放" name="4">
          <live-playback />
        </el-tab-pane>
        <el-tab-pane label="直播评论" name="5">
          <Comment
            :load="loadCommentList"
            :submit="submitComment"
            name="直播"
            :is-editable="false"
            disable-text="您还未观看直播，暂不能对直播评价，先去观看再来评价哦~"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getEvaluateList, addCourseScope } from '@/api/knowledge'
import Comment from '@/components/common-comment/Comment'
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import LiveInfo from './components/LiveInfo'
import LiveParticulars from './components/LiveParticulars'
import LivePlayback from './components/LivePlayback'
import LiveStatistics from './components/LiveStatistics'
import vueQr from 'vue-qr'
export default {
  name: 'LiveDetail',
  components: {
    Comment,
    CommonBreadcrumb,
    LiveInfo,
    LiveParticulars,
    LivePlayback,
    LiveStatistics,
    vueQr
  },
  data() {
    return {
      activeIndex: '1'
    }
  },
  mounted() {
    // this.$refs.breadcrumb.setBreadcrumbTitle('信息安全')
  },
  methods: {
    // 切换nav
    handleSelect(tab) {
      this.activeIndex = tab.name
    },
    loadCommentList(params) {
      return getEvaluateList({ ...params, knowledgeId: this.id })
    },
    submitComment(params) {
      return addCourseScope({ ...params, knowledgeId: this.id })
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
        width: 320px;
        height: 180px;
        margin-right: 40px;
        .logo__img {
          width: 100%;
          height: 100%;
        }
        .header__person {
          position: absolute;
          bottom: 8px;
          right: 20px;
          background: rgba(0, 11, 21, 0.45);
          border-radius: 4px;
          width: 48px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #fff;
          i {
            font-size: 10px;
            margin-right: 4px;
          }
        }
        .header__status {
          position: absolute;
          top: 8px;
          right: 20px;
          width: 48px;
          height: 20px;
          border-radius: 4px;
          background-color: #e7fbff;
          font-family: NotoSansCJKsc-Regular;
          font-size: 12px;
          color: #01aafc;
          display: flex;
          align-items: center;
          justify-content: center;
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
        .content {
          margin-bottom: 8px;
        }
      }
    }
    .header__right {
      .qrcode__img {
        width: 130px;
        height: 130px;
      }
      .qrcode__handler {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 8px;
        color: rgba(0, 11, 21, 0.45);
        font-family: PingFangSC-Regular;
        font-size: 12px;
        .qrcode__copy {
          margin-left: 8px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #01aafc;
          cursor: pointer;
        }
      }
    }
  }
  .live__main {
    margin-top: 20px;
    min-height: 55vh;
  }
}
</style>
