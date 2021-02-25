<template>
  <div class="message">
    <div class="flex-flow flex flex-justify-between hander">
      <div class="title">
        <span>系统消息</span>
        <span class="sub__title">
          <span>（未读<span class="warn__num">{{ unreadCount }}</span>条，</span>
          <span>共{{ page.total }}条）</span>
        </span>
      </div>
      <div>
        <el-button size="medium" @click="handleAllRead">
          全部已读
        </el-button>
        <el-button size="medium" @click="handleNoRead">
          未读
        </el-button>
      </div>
    </div>
    <div>
      <div class="list">
        <ul>
          <li
            v-for="item in listData"
            :key="item.id"
            class="flex flex-flow flex-items"
            @click="handleAllRead({ id: item.id })"
          >
            <div class="image">
              <i class="el-icon-s-comment icon"></i>
            </div>
            <div class="content">
              <div class="title">
                <span> <span v-if="!item.isRead" class="spot"></span>【{{ item.title }}】</span>
                <span class="time">系统发布 {{ item.createTime }}</span>
              </div>
              <div>
                <div class="text">
                  {{ item.content }}
                  <el-button
                    v-if="hasView(item.type)"
                    size="mini"
                    type="text"
                    @click="viewDetails(item)"
                  >
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
            <el-button
              v-if="!item.isRead"
              size="medium"
              class="sign"
              @click="handleAllRead({ id: item.id })"
            >
              标记已读
            </el-button>
          </li>
        </ul>
        <div class="flex pagination">
          <el-pagination
            v-if="listData.length > 0"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
      <div v-if="listData.length == 0" class="noData">
        <img src="../../assets/images/nodata.jpg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { getMsgNotify, postMsgNotify, postMsgNotifyCount } from '@/api/messgeCenter'
import { mapState } from 'vuex'
export default {
  name: 'MessageCenter',
  data() {
    return {
      unreadCount: 0,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      listData: [],
      searchParams: {
        isRead: null
      }
    }
  },
  computed: {
    ...mapState({
      newsCount: (state) => state.user.newsCount
    })
  },
  mounted() {
    if (this.$route.query.id) {
      this.handleAllRead({ id: this.$route.query.id })
    } else {
      this.getData()
    }
  },
  methods: {
    hasView(data) {
      if (data) {
        return data
      } else {
        return false
      }
    },
    viewDetails(data) {
      // TODO: 待补充类型与跳转路径
      const livePath = `/live/Detail?id=${_.get(JSON.parse(data.multiCondition), 'liveId')}`
      const TYPE_PATH_MAP = {
        LiveBroadcastBegin: livePath, // 直播开始通知
        LiveBroadcastPlanGust: livePath, // 直播计划安排通知: 讲师通知
        LiveBroadcastPlan: livePath, // 直播计划安排通知: 指定学员观看
        LiveBroadcastEveryOne: livePath, // 直播计划安排通知: 所有人或通过验证码观看
        LearnCompulsoryNotify: '/learn/list', // 学习必修安排通知
        LearnCompulsoryRemind: '/learn/list', // 学习必修安排提醒
        GrantCertificate: '/my/record', // 证书发放通知
        GetCreditCompleteCourse: '/my/record', // 学分获得通知: 完成课程获得学分
        GetCreditCompleteExam: '/my/record', // 学分获得通知: 完成考试获得学分
        GetCreditCompleteTrain: '/my/record', // 学分获得通知: 完成培训获得学分
        GetCreditEverydaySignIn: '/my/record', // 学分获得通知: 完成每日登录获得学分
        GetCreditOnlineLearning: '/my/record', // 学分获得通知: 在线学习时长超过15分钟获得学分
        GetCreditLearningArticles: '/my/record', // 学分获得通知: 知识库学习一篇文章/视频获得学分
        GetCreditResourceDownloaded: '/my/record', // 学分获得通知: 资源共享被下载十次获得学分
        PassApproval: '/approvalCenter/center', // 审批通过通知: 申请人审批通过
        FlowPass: '/approvalCenter/center', // 审批通过通知: 申请人审批通过
        FlowReject: '/approvalCenter/center', // 审批通知
        ApprovalNotify: '/approvalCenter/center', // 审批通知: 有新的审批代办
        FlowWaitApprove: '/approvalCenter/center', // 审批通知: 有新的审批代办
        ApprovalReturn: '/approvalCenter/center', // 审批退回通知: 申请人审批被退回
        ExamAchievement: '/approvalCenter/center', // 考试成绩通知: 发布考试成绩
        ExamNotify: '/exam/list', // 考试通知: 考试发布
        ExamRemind: '/exam/list', // 考试提醒: 开考前N分钟
        CourseLearning: '/course/list', // 课程学习的通知: 发布课程安排
        CourseRemind: '/course/list', // 课程学习提醒: 课程开始前N分钟
        TrainArrange: '/train/index' // 培训安排的通知: 发布培训安排
      }

      this.$router.push({ path: TYPE_PATH_MAP[data.type] })
    },
    handleNoRead() {
      this.searchParams.isRead = 0
      this.getData()
    },
    handleAllRead({ id = null }) {
      if (this.newsCount == 0) {
        this.searchParams.isRead = 1
        this.getData()
        return
      }

      let params = {
        userId: this.$store.getters.userId || '1333945383927181314',
        id: id
      }
      postMsgNotify(params).then(() => {
        this.searchParams.isRead = id ? '' : 1
        this.getData()
      })
    },
    getData() {
      let params = {
        userId: this.$store.getters.userId,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        isRead: this.searchParams.isRead
      }
      getMsgNotify(params).then((res) => {
        const { data, totalNum } = res
        this.listData = data
        this.page.total = totalNum
      })
      postMsgNotifyCount({
        userId: this.$store.getters.userId
      }).then((data) => {
        this.unreadCount = data.unreadCount
      })
    },
    handleSizeChange(data) {
      this.page.pageSize = data
      this.page.currentPage = 1
      this.getData()
    },
    handleCurrentChange(data) {
      this.page.currentPage = data
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  margin-top: 20px;
  background: #fff;
  min-height: calc(100vh - 64px - 40px);
  position: relative;
  .hander {
    padding: 0px 24px;
    height: 68px;
    align-items: center;
    .title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      display: flex;
      align-items: flex-end;
      .sub__title {
        font-size: 14px;
        .warn__num {
          color: red;
        }
      }
    }
  }
}

.list {
  padding: 24px;
  padding-top: 0px;
  .content {
    margin-left: 8px;
  }
  li {
    border-top: 1px solid #ebeced;
    padding: 9px;
    position: relative;
    /*margin-bottom: 10px;*/
  }
  li:last-child {
    border-bottom: 1px solid #ebeced;
    padding: 5px;
    margin-bottom: 18px;
  }
  li:hover {
    background: #f0fafe;
  }
  li:hover .sign {
    display: inline-block;
  }
  .image {
    .icon {
      width: 58px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 50px;
      color: #01aafc;
    }
  }
  .title {
    line-height: 26px;
    position: relative;
    margin-left: 10px;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    line-height: 22px;
    .spot {
      position: absolute;
      top: 6px;
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
    line-height: 18px;
    margin-left: 16px;
  }
  .text {
    line-height: 20px;
    margin-left: 15px;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
  }
}
.sign {
  position: absolute;
  margin: 0 auto;
  right: 24px;
  /*border: 1px solid #ebeef5;*/
  padding: 5px 5px;
  display: none;
}
/deep/.el-button--mini,
.el-button--small {
  /*font-size: 14px;*/
}
.pagination {
  bottom: 30px;
  position: absolute;
  right: 30px;
}
.noData {
  height: 500px;
  text-align: center;
}
</style>
