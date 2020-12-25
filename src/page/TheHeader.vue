<template>
  <div class="header">
    <div class="header-inner">
      <div class="logo">
        <img src="../assets/images/logo.png" />
      </div>
      <template v-if="userId">
        <ul class="header-menu">
          <li
            v-for="item in menu"
            :key="item.path"
            :class="{ active: activePath === item.path }"
            @click="handleMenuClick(item)"
          >
            {{ item.label }}
          </li>
        </ul>
        <div class="flex flex-flow">
          <el-popover
            placement="bottom"
            width="336"
            trigger="hover"
            class="popover"
          >
            <div>
              <div class="flex flex-justify-between">
                <span class="noreading"> 未读消息（{{ newsCount || 0 }}） </span>
                <span class="reading">
                  <el-button
                    size="mini"
                    :disabled="!newsCount"
                    @click="handleAllRead"
                  >全部已读</el-button>
                </span>
              </div>
              <div class="content">
                <ul
                  v-if="newsList.length > 0"
                  class="list"
                >
                  <li
                    v-for="(info, i) in newsList"
                    :key="i"
                    class="info"
                    @click="handleJump(info)"
                  >
                    <div
                      v-if="info.title"
                      class="title"
                    >
                      <span
                        v-if="!info.isRead"
                        class="spot"
                      ></span>【<span class="ellipsis">{{
                        info.title
                      }}</span>】
                    </div>
                    <div class="time">
                      系统发布 {{ info.createTime }}
                    </div>
                  </li>
                </ul>
                <div
                  v-else
                  class="noData"
                >
                  <img
                    style="height: 141px ;width: 141px"
                    src="../assets/images/nodata.jpg"
                    alt=""
                  />
                </div>
              </div>
              <div
                class="more"
                @click="handleJump"
              >
                查看更多消息
              </div>
            </div>
            <el-badge
              v-if="newsCount"
              slot="reference"
              :value="newsCount"
              class="item"
            >
              <div class="iconimage_icon_notice iconfont message"></div>
            </el-badge>
            <div
              v-else
              slot="reference"
              class="el-icon-message-solid message"
            ></div>
          </el-popover>
          <div class="iconimage_icon_help iconfont help"></div>
          <!-- <div class="el-icon-picture-outline hander"></div> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { postMsgNotify } from '@/api/messgeCenter'
const menu = [
  { label: '首页', path: '/home' },
  { label: '学习', path: '/learn' },
  { label: '课程', path: '/course' },
  { label: '知识库', path: '/knowledge' },
  { label: '新闻', path: '/news' },
  { label: '培训', path: '/train' },
  { label: '个人中心', path: '/my/info' },
  { label: '我的档案', path: '/my/record' }
]
export default {
  name: 'Header',
  data() {
    return {
      menu,
      activePath: '/home'
    }
  },
  computed: {
    ...mapState({
      newsCount: (state) => state.user.newsCount,
      newsList: (state) => state.user.newsList
    }),
    ...mapGetters(['userId'])
  },
  beforeMount() {
    // 初始化时设置激活中的菜单
    this.activePath = this.$route.path.match(/^\/\w*/g)[0]
  },
  mounted() {
    this.news()
    // 定时获取新消息
    setInterval(() => {
      this.news()
    }, 300000)
  },
  methods: {
    news() {
      if (!this.userId) {
        return
      }
      this.$store.dispatch('messageCount', {
        userId: this.userId
      })
      this.$store.dispatch(
        'messageList',
        Object.assign({ userId: this.userId }, { isRead: 0, pageSize: 5, pageNo: 1 })
      )
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
    handleAllRead() {
      let params = {
        userId: this.userId
      }
      postMsgNotify(params).then(() => {
        this.news()
      })
    },
    handleMenuClick(item) {
      if (this.$route.path === item.path) {
        return
      }
      this.activePath = item.path
      this.$router.push(item.path)
    }
  }
}
</script>
<style>
.el-popover {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.header {
  align-self: flex-start;
  height: 56px;
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  background-color: white;
  .header-inner {
    height: 100%;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-menu {
    height: 100%;
    display: flex;

    li {
      opacity: 0.65;
      font-size: 16px;
      color: #000b15;
      text-align: center;
      line-height: 56px;
      position: relative;
      margin-right: 48px;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
      }
      &.active {
        color: $primaryColor;
        opacity: 1;
        font-weight: bold;
        &::after {
          content: '';
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          position: absolute;
          background-color: $primaryColor;
        }
      }
    }
  }
}
.message {
  font-size: 20px;
  margin-right: 24px;
  line-height: 32px;
  color: #8d9195;
}
.help {
  font-size: 20px;
  margin-right: 24px;
  line-height: 32px;
  color: #8d9195;
}
.hander {
  text-align: center;
  line-height: 32px;
  width: 32px;
  height: 32px;
  font-size: 32px;
}
/deep/.el-badge__content.is-fixed {
  top: 5px;
  right: 35px;
}
.content {
  /*margin-top:10px;*/

  border-top: 1px solid #ebeced;
  border-bottom: 1px solid #ebeced;
  .list {
    .info {
      cursor: pointer;
      padding: 10px 32px;
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
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        width: 220px;
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
</style>
