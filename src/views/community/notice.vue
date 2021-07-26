<template>
  <div class="notice">
    <!-- 回复列表 -->
    <div v-if="noticeList.length" v-loading="loading" class="reply-list">
      <div v-for="(item, index) in noticeList" :key="index" class="reply-list-item">
        <el-row type="flex" justify="space-between" style="align-items: center">
          <div class="infomation">
            <el-row type="flex" style="align-items: center">
              <div class="avatar" @click="goHomePages(item)">
                <el-avatar
                  :size="32"
                  :src="item.avatarUrl"
                  style="margin-right: 3px; vertical-align: middle"
                ></el-avatar>
                {{ item.userFromName }}
              </div>
              <span v-if="item.isExpert" class="iconbiaoqian-zhuanjia iconfont experts"></span>
              <el-divider direction="vertical"></el-divider>
              <div class="zoneName" @click="goZoneHome(item)">
                <el-tag size="mini">{{ item.areaName }}</el-tag>
              </div>
            </el-row>
          </div>
          <div class="reply-time">
            <el-row type="flex" style="align-items: center">
              <span class="reply-time-info">{{ item.createTime }}</span>
              <span class="reply-time-toggle" @click="replyHandler(item)">{{
                replyIdTemp.includes(item.id) ? '收起回复' : '回复'
              }}</span>
            </el-row>
          </div>
        </el-row>
        <div class="describe">
          <span v-if="item.isAit" class="describe-isMe">{{ '@' + item.userToName }}</span>
          <span class="describe-info">{{ item.content }}</span>
          <div v-if="item.replyImgUrl" class="previewPicture">
            <img
              v-for="(src, index) in item.replyImgUrl.split(',').slice(0, 3)"
              :key="index"
              :src="src"
              class="previewPicture-img"
              @click="previewImgObject(item.replyImgUrl.split(','), index)"
            />
          </div>
        </div>
        <div class="content">
          <!-- parentId = 0 是对帖子的回复 -->
          <div class="content-info">
            <template v-if="item.parentId == '0'">
              <!-- 图片放大预览 -->
              <el-row type="flex">
                <div v-if="item.imgUrl" class="previewPicture">
                  <img
                    v-for="(src, index) in item.imgUrl.split(',').slice(0, 3)"
                    :key="index"
                    :src="src"
                    class="previewPicture-img"
                    @click="previewImgObject(item.imgUrl.split(','), index)"
                  />
                </div>
                <span class="content-info-box">{{ item.title }}</span>
              </el-row>
            </template>
            <template v-else>
              <span class="isMe">我的：</span>
              <span class="content-info-box">{{ item.parentContent }}</span>
            </template>
          </div>
        </div>
        <!-- 回复框 -->
        <el-collapse-transition>
          <div v-show="replyIdTemp.includes(item.id)" class="reply-box">
            <el-input
              v-model="replyInfoTemp[item.id]"
              type="textarea"
              :rows="5"
              placeholder="评论一下吧"
              resize="none"
              maxlength="500"
              show-word-limit
            >
            </el-input>
            <el-button
              type="primary"
              size="medium"
              style="margin-top: 20px"
              :loading="releaseLoading[item.id]"
              @click="releaseInfo(item)"
              >发布</el-button
            >
          </div>
        </el-collapse-transition>
        <el-divider v-if="index < noticeList.length - 1"></el-divider>
      </div>
    </div>
    <!-- 暂无数据提示 -->
    <div v-else v-loading="loading" class="empty-tips">
      <img src="@/assets/images/empty.png" class="empty-img" />
      <div class="empty-text">
        <span>暂无通知</span>
      </div>
    </div>
    <!-- 加载更多 -->
    <div v-if="!(noticeList.length < pageConfig.pageNo * pageConfig.pageSize)" class="load-more">
      <el-button size="medium" :loading="loadMoreLoading" @click="loadMore">加载更多</el-button>
    </div>
    <!-- 检查禁言模态框 -->
    <banned-judgment ref="bannedJudgment"></banned-judgment>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css' // 图片预览插件
import { api as viewerApi } from 'v-viewer'
import { getNotificationList, replyTopic, updateBeenRead } from '@/api/community'
import bannedJudgment from './components/bannedJudgment.vue'
export default {
  name: 'Notice',
  components: {
    bannedJudgment
  },
  data() {
    return {
      noticeList: [],
      loading: false,
      replyIdTemp: [], // 存储回复框的id
      replyInfoTemp: {}, // 每条数据的回复框双向绑定的值
      releaseLoading: {}, // 每条数据发布按钮的loading
      pageConfig: {
        pageNo: 1,
        pageSize: 40
      },
      loadMoreLoading: false
    }
  },
  mounted() {
    this.initNotificationList()
  },
  methods: {
    //   初始化通知列表
    async initNotificationList() {
      let params = {
        pageNo: this.pageConfig.pageNo,
        pageSize: this.pageConfig.pageSize
      }
      if (this.pageConfig.pageNo > 1) {
        this.loadMoreLoading = true
      } else {
        this.loading = true
      }
      await getNotificationList(params)
        .then(async (res) => {
          this.noticeList = [...this.noticeList, ...res.data]
          this.noticeList.map((v) => {
            this.$set(this.replyInfoTemp, v.id, '')
            this.$set(this.releaseLoading, v.id, false)
          })
          //   更新未读通知
          await updateBeenRead()
        })
        .finally(() => {
          this.loadMoreLoading = false
          this.loading = false
        })
    },
    // 加载更多
    loadMore() {
      this.pageConfig.pageNo++
      this.initNotificationList()
    },
    async replyHandler(item) {
      await this.$refs.bannedJudgment.checkBanned(item.areaId)
      if (this.$refs.bannedJudgment.flagBanned) return
      this.replyIdTemp.includes(item.id)
        ? (this.replyIdTemp.splice(this.replyIdTemp.indexOf(item.id), 1),
          (this.replyInfoTemp[item.id] = ''))
        : this.replyIdTemp.push(item.id)
    },
    // 回复信息
    async releaseInfo(item) {
      let params = {
        topicId: item.topicId,
        content: this.replyInfoTemp[item.id],
        parentId: item.parentId == '0' ? item.replyId : item.parentId,
        userToId: item.userFrom,
        isAit: item.parentId == '0' ? '0' : '1'
      }
      //   回复消息不能为空
      if (!this.replyInfoTemp[item.id]) {
        this.$message.warning('评论内容不能为空!')
        return
      }
      this.releaseLoading[item.id] = true
      await replyTopic(params)
        .then(() => {
          this.replyInfoTemp[item.id] = ''
          this.replyHandler(item)
          this.$message.success('评论成功!')
        })
        .finally(() => {
          this.releaseLoading[item.id] = false
        })
    },
    // 跳到专区主页
    goZoneHome(item) {
      this.$router.push({ path: '/community/zoneHomePage', query: { areaId: item.areaId } })
    },
    // 跳转他人主页
    goHomePages(item) {
      this.$router.push({ path: '/community/otherHomePage', query: { userId: item.userFrom } })
    },
    // 图片预览
    previewImgObject(images, index) {
      viewerApi({
        options: {
          toolbar: true,
          initialViewIndex: index
        },
        images: images
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  padding: 20px 25px;
  .reply-list {
    font-size: 16px;
    .infomation {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.85);
      line-height: 24px;
      .avatar {
        cursor: pointer;
        font-size: 16px;
      }
      .experts {
        margin-left: 5px;
        color: #f5623b;
        font-size: 24px;
      }
      .zoneName {
        cursor: pointer;
      }
    }
    .reply-time {
      font-size: 12px;

      &-info {
        color: rgba(0, 11, 21, 0.45);
      }
      &-toggle {
        color: rgba(0, 11, 21, 0.65);
        cursor: pointer;
        margin-left: 10px;
      }
    }
    &-item {
      margin-bottom: 20px;
      .time {
        font-size: 12px;
        .reply-btn {
          cursor: pointer;
          margin-left: 15px;
        }
      }
      .describe {
        margin-top: 10px;
        padding-left: 40px;
        font-size: 14px;
        color: #000b15;
        line-height: 22px;
        word-break: break-all;
        &-isMe {
          margin-right: 10px;
        }
        .previewPicture {
          margin-top: 5px;
          height: 54px;
          &-img {
            width: 96px;
            height: 100%;
            border-radius: 5px;
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
      .content {
        margin: 10px 20px 20px;
        background: #fafafa;
        padding: 15px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        line-height: 24px;
        margin-left: 40px;
        &-info {
          .previewPicture {
            height: 54px;
            &-img {
              width: 96px;
              height: 100%;
              border-radius: 5px;
              margin-right: 10px;
              cursor: pointer;
            }
          }
          .isMe {
            vertical-align: top;
            margin-left: 10px;
          }
          &-box {
            vertical-align: top;
            word-break: break-all;
          }
        }
      }
      .reply-box {
        text-align: right;
      }
    }
  }
  .empty-tips {
    padding: 75px 0;
    text-align: center;
    .empty-img {
      width: 160px;
      height: 160px;
    }
    .empty-text {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.25);
    }
  }
  .load-more {
    text-align: center;
    margin: 20px 0;
  }
}
</style>
