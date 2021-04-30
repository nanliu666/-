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
            class="flex flex-flow flex-items list__li"
            @click="viewDetails(item)"
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
                  <el-button v-if="hasView(item.type)" size="mini" type="text">
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
            <el-button
              v-if="!item.isRead"
              size="medium"
              class="sign"
              @click.stop="handleAllRead({ id: item.id })"
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
import TYPE_PATH_MAP from '@/const/viewConfigs'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'MessageCenter',
  data() {
    return {
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
    ...mapGetters(['unreadCount']),
    ...mapState({
      newsCount: (state) => state.user.newsCount
    })
  },
  watch: {
    unreadCount: {
      handler() {
        this.getData()
      },
      deep: true
    }
  },
  activated() {
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
      // 先已读
      this.handleAllRead({ id: data.id })
      //TODO: 为什么要判断？因为第一版的点击只做了已读操作。怀疑有的消息是单纯通知，无对应页面跳转。
      if (data.type) {
        const query = { query: { id: data.bizId } }
        let targetPath = { path: TYPE_PATH_MAP[data.type] }
        if (data.type === 'ExamNotify' || data.type === 'ExamRemind') {
          targetPath = _.assign(targetPath, query)
        }
        this.$router.push(targetPath)
      }
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
        this.$store.commit('SET_UN_READ_COUNT', data.unreadCount)
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
  .list__li {
    cursor: pointer;
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
