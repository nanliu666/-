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
                <div class="content">
                  <span class="label">知识体系：</span>
                  <span class="value">{{ detailData.knowledgeSystemName || '--' }}</span>
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
            <!-- 学员端只有观看直播 -->
            <div v-if="hasLiveButton && isTrainee">
              <el-button type="primary" size="medium" @click.native="watchLiveFun">
                观看直播
              </el-button>
            </div>
            <!-- 讲师端的直播按钮是不需要进行逻辑判断 -->
            <div v-if="!isTrainee">
              <el-button
                v-if="currentUserInfo.account"
                type="primary"
                size="medium"
                @click.native="beginLiveFn"
              >
                <span v-if="detailData.status === 'live'">继续直播</span>
                <span v-else>开始直播</span>
              </el-button>
            </div>
            <div v-if="hasSignButton && isTrainee">
              <!-- 未报名的按钮需要激活状态 -->
              <el-button
                type="primary"
                :disabled="detailData.applyJoinStatus !== 'NotRegistered'"
                size="medium"
                @click.native="applyButton"
              >
                {{ applyButtonText }}
              </el-button>
            </div>
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
        <span class="collection" @click="collection">
          <i
            class="iconoperating_ic_favorites iconfont"
            :class="{ iconoperating_ic_favorites_active: isCollection }"
          ></i>
          {{ isCollection ? '取消收藏' : '收藏' }}
        </span>
      </div>
    </el-card>
    <!-- 讲师端页面tabs -->
    <el-card v-if="!isTrainee" class="live__main">
      <el-tabs v-model="activeIndex" @tab-click="handleSelect">
        <!-- 讲师存在报名情况，用于处理学员的报名 -->
        <el-tab-pane v-if="detailData.isApprove" label="报名情况" name="6">
          <SignUp></SignUp>
        </el-tab-pane>
        <el-tab-pane label="考试情况" :name="`${detailData.isApprove ? 7 : 6}`">
          <Examination></Examination>
        </el-tab-pane>
        <el-tab-pane label="直播信息" name="1">
          <live-info :data="detailData" />
        </el-tab-pane>
        <el-tab-pane label="数据统计" name="2">
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
            :is-editable="_.get(detailData, 'isWatch', false)"
            :submit="submitComment"
            :is-comment="2"
            name="直播"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 学员端页面tabs -->
    <el-card v-if="isTrainee" class="live__main">
      <el-tabs v-model="activeIndex" @tab-click="handleSelect">
        <!-- 报名前和审核中只能看直播详情tab页 -->
        <el-tab-pane label="直播详情" name="3">
          <live-particulars :data="detailData" />
        </el-tab-pane>
        <el-tab-pane v-if="hasLiveButton" label="直播考试" name="8">
          <live-exam />
        </el-tab-pane>
        <el-tab-pane v-if="hasLiveButton" label="直播回放" name="4">
          <live-playback />
        </el-tab-pane>
        <el-tab-pane v-if="hasLiveButton" label="直播评论" name="5">
          <Comment
            :load="loadCommentList"
            :has-handle="isTrainee"
            :is-editable="_.get(detailData, 'isWatch', false)"
            :submit="submitComment"
            disable-text="您未观看该直播，暂不能对该直播评价，先去观看再来评价哦"
            name="直播"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {
  getLiveDetail,
  getCommentList,
  postComment,
  getUserRole,
  userLiveApplyJoin,
  saveCollect,
  cancelCollect,
  getIsCollectLive
} from '@/api/live'
import Comment from '@/components/common-comment/Comment'
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import LiveInfo from './components/LiveInfo'
import LiveParticulars from './components/LiveParticulars'
import LivePlayback from './components/LivePlayback'
import LiveStatistics from './components/LiveStatistics'
import LiveExam from './components/LiveExam'
import vueQr from 'vue-qr'
import { frontBaseUrl } from '@/config/env'
import { mapGetters } from 'vuex'

import SignUp from '../lecturerTask/live/SignUp' //报名情况
import Examination from '../lecturerTask/live/Examination' //考试情况
import moment from 'moment'
// 讲师的tabs的展示逻辑
// 1.存在报名情况显示：
// 报名情况、考试情况、直播信息、数据统计、直播详情、直播回放、直播评论
// 2.不存在报名情况显示
// 考试情况、直播信息、数据统计、直播详情、直播回放、直播评论

// 学员的tabs展示
// 1.已报名存在
// 直播详情、直播考试、直播回放、直播评论
// 2.未报名展示
// 直播详情
const STATUS_MAP = {
  live: '直播中',
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
    LiveExam,
    vueQr,
    SignUp,
    Examination
  },
  data() {
    return {
      isCollection: false,
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
      activeIndex: '3',
      detailData: {}
    }
  },
  computed: {
    // 拥有直播系列的按钮（能查看直播考试等tabs）只针对学员身份有以下几种情况
    // 1.直播报名不需要审批（isApprove false）
    // 2.报名需要审批（isApprove true），且用户报名状态为已报名（applyJoinStatus为SignedUp）
    // applyJoinStatus字典组：NotRegistered-未报名/UnderReview-审核中/SignedUp-已报名
    // 3.authType: code以及direct(验证码以及指定学员)不许报名
    // 4.讲师身份直播按钮常驻
    hasLiveButton() {
      const { isApprove, applyJoinStatus, authType } = this.detailData
      const conditionOne = !isApprove
      const conditionTwo = isApprove && applyJoinStatus === 'SignedUp'
      const conditionThree = authType === 'code' || authType === 'direct'
      return conditionOne || conditionTwo || conditionThree
    },
    // 存在报名按钮的情况
    hasSignButton() {
      const { isApprove, signupDeadline, authType } = this.detailData
      // 未填写报名截止日期可以一直报名
      const dateLine = signupDeadline && moment().isSameOrBefore(moment(signupDeadline))
      // 必须是学员，直播报名需要审批，并且所有人可见
      const conditionOne = this.isTrainee && isApprove && authType === ''
      return (dateLine || conditionOne) && this.applyButtonText
    },
    applyButtonText() {
      const BUTTON_TEXT_MAP = {
        NotRegistered: '预约报名',
        UnderReview: '审核中'
      }
      return BUTTON_TEXT_MAP[this.detailData.applyJoinStatus]
    },
    ...mapGetters(['userId']),
    // 是否是学员
    isTrainee() {
      return this.roleName === 'Trainee'
    },

    watchLiveLink() {
      let { userId, avatar } = this.detailData.currentUser ? this.detailData.currentUser : {}
      let QRURL = ''
      if (this.roleName === 'Trainee') {
        QRURL = `${frontBaseUrl}/#/WatchLive?wId=${this.detailData.channelId}&userid=${userId}&avatar=${avatar}&sk=${this.detailData.authSecretOrCode}&type=${this.detailData.authType}`
      } else if (this.roleName === 'Lecturer') {
        QRURL = `${frontBaseUrl}/#/beginLive?beginId=${this.detailData.channelId}&roleName=${this.roleName}`
      }
      return QRURL
    },
    id() {
      return _.get(this.$route, 'query.id', null)
    }
  },
  activated() {
    this.initData()
    this.getIsCollectLive()
  },
  methods: {
    getIsCollectLive() {
      getIsCollectLive({
        liveId: this.id,
        type: sessionStorage.getItem('role')
      }).then((res) => {
        this.isCollection = res
      })
    },
    //收藏
    collection() {
      let fun = this.isCollection ? cancelCollect : saveCollect
      fun({
        type: sessionStorage.getItem('role'),
        liveId: this.detailData.liveId
      }).then(() => {
        this.$message({
          type: 'success',
          message: `${this.isCollection ? '取消收藏成功' : '收藏成功'}`
        })
        this.getIsCollectLive()
      })
    },
    initData() {
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
        this.activeIndex = res.roleName === 'Trainee' ? '3' : '6'
        // this.activeIndex = res.roleName === 'Trainee' ? '3' : '1'
      })
    },
    // 点击报名
    applyButton() {
      userLiveApplyJoin({ liveId: this.id }).then(() => {
        this.$message.success('报名成功')
        this.initData()
      })
    },
    playFun() {
      if (this.isTrainee) {
        if (this.hasLiveButton) {
          this.watchLiveFun()
        }
      } else {
        this.beginLiveFn()
      }
    },
    // 观看直播
    watchLiveFun() {
      let { userId, avatar, userName, phonenum } = this.detailData.currentUser
        ? this.detailData.currentUser
        : {}
      this.$router.push({
        name: 'WatchLive',
        query: {
          wId: this.detailData.channelId,
          userid: userId,
          avatar: avatar,
          phonenum,
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
    position: relative;
    .header__left {
      display: flex;
      .header__logo {
        position: relative;
        width: 480px;
        height: 270px;
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
          opacity: 0.45;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #000b15;
          letter-spacing: 0;
          line-height: 22px;
        }
        .value {
          opacity: 0.85;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #000b15;
          letter-spacing: 0;
          line-height: 22px;
        }
        .header__title {
          font-family: PingFangSC-Medium;
          margin-bottom: 40px;
          font-size: 18px;
          color: #000b15;
          letter-spacing: 0;
          line-height: 28px;
          font-weight: 600;
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
    .collection {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      line-height: 18px;
      margin-left: 25px;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 2px;
      display: inline-block;
      .iconoperating_ic_favorites_active {
        color: rgb(247, 186, 42);
      }
      .iconfont {
        margin-top: 10px;
      }
    }
  }
  .live__main {
    margin-top: 20px;
    min-height: 55vh;
  }
}
</style>
