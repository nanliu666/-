<template>
  <el-popover
    placement="bottom"
    width="336"
    trigger="hover"
    popper-class="notification-pop"
    @show="update()"
  >
    <div>
      <div class="flex flex-justify-between">
        <span class="noreading"> 未读消息（{{ unreadCount || 0 }}） </span>
        <span class="reading">
          <el-button size="mini" :disabled="!unreadCount" @click="handleAllRead">全部已读</el-button>
        </span>
      </div>
      <div class="content">
        <ul v-if="notifyList.length > 0" class="list">
          <li v-for="(info, i) in notifyList" :key="i" class="info" @click.stop="viewDetails(info)">
            <div v-if="info.title" class="title">
              <span v-if="!info.isRead" class="spot"></span>【<span class="ellipsis">{{
                info.title
              }}</span>】
            </div>
            <div class="time">系统发布 {{ info.createTime }}</div>
          </li>
        </ul>
        <div v-else class="noData">
          <img style="height: 141px ;width: 141px" src="../assets/images/nodata.jpg" alt="" />
        </div>
      </div>
      <div class="more" @click="handleJump">
        查看更多消息
      </div>
    </div>
    <el-badge slot="reference" :hidden="!unreadCount" :value="unreadCount" class="notify-icon">
      <div class="iconimage_icon_notice iconfont message"></div>
    </el-badge>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import { postMsgNotify, postMsgNotifyCount, getMsgNotify } from '@/api/messgeCenter'
import TYPE_PATH_MAP from '@/const/viewConfigs'
export default {
  name: 'Notification',
  data() {
    return { notifyList: [], timer: null }
  },
  computed: {
    ...mapGetters(['unreadCount', 'userId'])
  },
  mounted() {
    this.update()
    // 定时获取新消息
    this.timer = setInterval(() => {
      this.getNotifyCount()
    }, 300000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    viewDetails(data) {
      // 先已读
      this.handleAllRead({ id: data.id })
      //TODO: 为什么要判断？因为第一版的点击只做了已读操作。怀疑有的消息是单纯通知，无对应页面跳转。
      if (data.type) {
        // const query = { query: { id: data.bizId } }
        // let targetPath = { path: TYPE_PATH_MAP[data.type] }
        // if (data.type === 'ExamNotify' || data.type === 'ExamRemind') {
        //   targetPath = _.assign(targetPath, query)
        // }
        let query = {}
        let targetPath = { path: TYPE_PATH_MAP[data.type] }
        if (data.type === 'TrainArrange') {
          query = { query: { clickDataIn: 'myTrainList' } }
          targetPath = _.assign(targetPath, query)
        }
        if(data.type === 'TrainJoinFail'){
          query = { query: { trainId: data.bizId,userType: sessionStorage.getItem('role') } }
          targetPath = _.assign(targetPath, query)
        }
        if(data.type === 'ExamNotify'){
          query = { query: { clickData: 'myExamList'} }
          targetPath = _.assign(targetPath, query)
        }
        if(data.type === 'revokeCertificate' || data.type === 'revokeCertificateExam' || data.type === 'ExamHandworkNotify'){
          return false
        }
        if (
          data.type === 'LiveBroadcastEveryOne' ||
          data.type === 'LiveBroadcastPlanGust' ||
          data.type === 'LiveBroadcastBegin' ||
          data.type === 'LiveBroadcastPlan' ||
          data.type === 'LiveRemindToStudents' ||
          data.type === 'LiveRemindToTeachers'
        ) {
          query = { query: { id: data.id } }
          targetPath = _.assign(targetPath, query)
        }
        if(data.type === 'FlowPass' || data.type === 'FlowReject'){
          query = { query: { name: 'mySend' } }
          targetPath = _.assign(targetPath, query)
        }
        if(data.type === 'FlowUrge'){
          query = { query: { name: 'message' } }
          targetPath = _.assign(targetPath, query)
        }
        this.$router.push(targetPath)
      }
    },
    update() {
      if (!this.userId) {
        return
      }
      this.getNotifyCount()
      this.getNotifyList()
    },
    handleJump(data) {
      let query = {
        id: data.id
      }
      this.$router.push({
        path: '/message/list',
        query
      })
    },
    handleAllRead({ id = null }) {
      const params = {
        userId: this.userId,
        id
      }
      postMsgNotify(params).then(() => {
        this.update()
      })
    },
    getNotifyCount() {
      if (!this.userId) {
        return
      }
      postMsgNotifyCount({
        userId: this.userId
      }).then((data) => {
        this.$store.commit('SET_UN_READ_COUNT', data.unreadCount)
      })
    },
    getNotifyList() {
      const params = { userId: this.userId, isRead: 0, pageSize: 5, pageNo: 1 }
      getMsgNotify(params).then((res) => {
        this.notifyList = res.data
      })
    }
  }
}
</script>
<style lang="scss">
.notification-pop {
  &.el-popover {
    padding: 0 !important;
  }

  .content {
    /*margin-top:10px;*/

    border-top: 1px solid #ebeced;
    border-bottom: 1px solid #ebeced;
    .list {
      .info {
        cursor: pointer;
        padding: 10px 32px 12px;
        border-bottom: 1px solid #ebeef5;
        .title {
          position: relative;
          line-height: 22px;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          .spot {
            position: absolute;
            top: 12px;
            left: -5px;
            display: inline-block;
            width: 8px;
            height: 8px;
            line-height: 20px;
            background: #ff4329;
            border-radius: 50%;
          }
        }
        .time {
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
          line-height: 20px;
          position: relative;
          left: 5px;
        }
        .ellipsis {
          -webkit-line-clamp: 1; /*要显示的行数*/
          -webkit-box-orient: vertical;
          max-width: 88%;
          display: inline-block;
          // white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          line-height: 20px;
          position: relative;
          top: 6px;
        }
      }
    }
  }
  .more {
    line-height: 22px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    margin: 13px 0;
  }
  .noData {
    width: 100%;
    height: 204px;
    line-height: 204px;
    text-align: center;
  }

  /*.header-menu */
  .noreading {
    margin: 13px 12px 13px 16px;
    font-size: 16px;
    line-height: 24px;
  }

  .reading {
    margin: 13px 16px 13px 16px;
    font-size: 14px;
    /*height: 24px;*/
    /*width: 76px;*/
    /*text-align: center;*/
    /*line-height: 24px;*/
  }
  /deep/.el-button--mini,
  .el-button--small {
    font-size: 14px;
    border-radius: 3px;
    padding: 4px 10px;
  }
}
</style>
<style lang="scss" scoped>
/deep/.el-badge__content.is-fixed {
  top: 5px;
  right: 10px;
}
.message {
  font-size: 20px;
  line-height: 32px;
  color: rgba($primaryFontColor, 0.45);
  cursor: pointer;
}
</style>
