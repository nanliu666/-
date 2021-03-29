<template>
  <!-- CSS起名规则按照BEM -->
  <div class="live">
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />
    <el-card>
      <div class="live__header">
        <div class="header__left">
          <div class="header__logo">
            <el-image class="logo__img" :src="detailData.coverImageUrl" fit="cover">
              <div slot="error" class="image__slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div class="header__person">
              <i class="iconimage_icon_user iconfont" />
              <span>{{ detailData.viewersNumber }}</span>
            </div>
            <div class="header__status">
              {{ statusMap[detailData.status] }}
            </div>
            <div class="header__play" @click="playFun">
              <span class="play-icon" />
            </div>
          </div>
          <div class="header__content">
            <div>
              <div class="header__title">
                {{ detailData.channelName }}
              </div>
              <div>
                <div class="content__classify content">
                  <span class="label">直播分类：</span>
                  <span class="value">{{ detailData.categoryName }}</span>
                </div>
                <div class="content">
                  <span class="label">直播讲师：</span>
                  <span class="value">{{ detailData.lecturerName }}</span>
                </div>
                <div class="content live__time">
                  <span class="label">直播时间：</span>
                  <span class="value">
                    <ul v-if="!_.isEmpty(detailData.liveTime)">
                      <li
                        v-for="(item, index) in detailData.liveTime"
                        :key="index"
                        class="value__li"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </span>
                </div>
                <div v-if="!isTrainee && detailData.liveDate" class="content">
                  <span class="label">直播日期：</span>
                  <span class="value">{{ detailData.liveDate }}</span>
                </div>
              </div>
            </div>
            <el-button v-if="isTrainee" type="primary" size="medium" @click.native="watchLiveFun">
              观看直播
            </el-button>
            <el-button v-if="!isTrainee" type="primary" size="medium" @click.native="beginLiveFn">
              <span v-if="detailData.status === 'live'">继续直播</span>
              <span v-else>开始直播</span>
            </el-button>
          </div>
        </div>
        <div v-if="watchLiveLink" class="header__right">
          <div class="qrcode__img">
            <vue-qr
              v-if="watchLiveLink"
              class="img"
              :text="watchLiveLink"
              :margin="0"
              color-light="#fff"
              :logo-corner-radius="11"
              :size="200"
            />
          </div>
          <div class="qrcode__handler">
            <span>扫码观看</span>
            <span v-clipboard:copy="watchLiveLink" v-clipboard:success="onCopy" class="qrcode__copy">复制链接</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="live__main">
      <el-tabs v-model="activeIndex" @tab-click="handleSelect">
        <el-tab-pane v-if="!isTrainee" label="直播信息" name="1">
          <live-info :data="detailData" />
        </el-tab-pane>
        <el-tab-pane v-if="!isTrainee" label="数据统计" name="2">
          <live-statistics :live-plan-id="detailData.liveId + ''" />
        </el-tab-pane>
        <el-tab-pane label="直播详情" name="3">
          <live-particulars :data="detailData" />
        </el-tab-pane>
        <el-tab-pane label="直播回放" name="4">
          <live-playback />
        </el-tab-pane>
        <el-tab-pane label="直播评论" name="5">
          <Comment
            :load="loadCommentList"
            :has-handle="isTrainee"
            :submit="submitComment"
            name="直播"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getLiveDetail, getCommentList, postComment, getUserRole } from '@/api/live'
import Comment from '@/components/common-comment/Comment'
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import LiveInfo from './components/LiveInfo'
import LiveParticulars from './components/LiveParticulars'
import LivePlayback from './components/LivePlayback'
import LiveStatistics from './components/LiveStatistics'
import vueQr from 'vue-qr'
import { mapGetters } from 'vuex'
const STATUS_MAP = {
  live: '直播中',
  // start: '未开始',
  end: '未开始'
}
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
      currentUserInfo: {},
      routeList: [
        {
          path: '/live',
          title: '直播'
        },
        {
          path: '',
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ],
      roleName: '',
      statusMap: STATUS_MAP,
      activeIndex: '1',
      detailData: {}
    }
  },
  computed: {
    ...mapGetters(['userId']),
    isTrainee() {
      return this.roleName === 'Trainee'
    },
    watchLiveLink() {
      let { userId, avatar, userName } = this.detailData.currentUser
        ? this.detailData.currentUser
        : {}
      let QRURL = ''
      if (this.roleName === 'Trainee') {
        QRURL = `${location.origin}/#/WatchLive?wId=${this.detailData.channelId}&userid=${userId}&avatar=${avatar}&sk=${this.detailData.authSecretOrCode}&type=${this.detailData.authType}`
      } else if (this.roleName === 'Lecturer') {
        QRURL = `${location.origin}/#/beginLive?beginId=${this.detailData.channelId}&roleName=${this.roleName}`
      }
      return QRURL
      // return `${location.origin}/#/WatchLive?wId=${this.detailData.channelId}`
      // return `${location.origin}/#/WatchLive?wId=${_.get(this.currentUserInfo, 'account')}`
    },
    id() {
      const id = _.get(this.$route, 'query.id', null)
      const route = `${id ? `${this.$route.path}?id=${id}` : `${this.$route.path}`}`
      _.set(this.routeList, '[1].path', route)
      return id
    }
  },
  activated() {
    const params = { liveId: this.id }
    getLiveDetail(params).then((res) => {
      // 重组数据，将数据组合成低保需要的格式
      const sortRules = {
        '': 3,
        Lecturer: 0, //主讲师
        Assistant: 1, // 助教
        Guest: 2 // 嘉宾
      }
      const { loginInfo } = res
      this.currentUserInfo = _.find(loginInfo, (item) => item.userId === this.userId)
      let temp = []
      _.chain(loginInfo)
        .groupBy('roleName')
        .forIn((value, key) => {
          _.each(value, (item, index) => {
            switch (key) {
              case 'Lecturer':
                _.set(item, 'showUserName', '主讲师')
                break
              case 'Assistant':
                _.set(
                  item,
                  'showUserName',
                  `${item.userName}（助教${_.size(value) > 1 ? `${index + 1}` : ''}）`
                )
                break
              case 'Guest':
                _.set(
                  item,
                  'showUserName',
                  `${item.userName}（嘉宾${_.size(value) > 1 ? `${index + 1}` : ''}）`
                )
                break
              default:
                _.set(
                  item,
                  'showUserName',
                  `${item.userName}（身份缺失${_.size(value) > 1 ? `${index + 1}` : ''}）`
                )
                break
            }
          })
          temp.push(value)
        })
        .value()
      const tempArray = _.flatten(temp)
      tempArray.sort(function(a, b) {
        return sortRules[a.roleName] - sortRules[b.roleName]
      })
      res.loginInfo = tempArray
      this.detailData = res
    })
    getUserRole(params).then((res) => {
      const { roleName } = res
      this.roleName = roleName
      this.activeIndex = res.roleName === 'Trainee' ? '3' : '1'
    })
  },
  methods: {
    playFun() {
      if (this.isTrainee) {
        this.watchLiveFun()
      } else {
        this.beginLiveFn()
      }
    },
    // 观看直播
    watchLiveFun() {
      let { userId, avatar, userName } = this.detailData.currentUser
        ? this.detailData.currentUser
        : {}
      this.$router.push({
        name: 'WatchLive',
        query: {
          wId: this.detailData.channelId,
          userid: userId,
          avatar: avatar,
          userName: encodeURIComponent(userName),
          sk: this.detailData.authSecretOrCode,
          type: this.detailData.authType
        }
      })
    },
    beginLiveFn() {
      // 开播
      this.$router.push({
        path: '/beginLive',
        query: { beginId: _.get(this.currentUserInfo, 'account'), roleName: this.roleName }
      })
    },
    onCopy() {
      this.$message.success('您已成功复制二维码链接')
    },
    // 切换nav
    handleSelect(tab) {
      this.activeIndex = tab.name
    },
    loadCommentList(params) {
      return getCommentList({ ...params, livePlanId: this.id })
    },
    submitComment(params) {
      return postComment({ ...params, livePlanId: this.id })
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
          background-color: #d0d0d0;
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
