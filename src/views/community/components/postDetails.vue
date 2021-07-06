<template>
  <div class="postDetails">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>推荐</el-breadcrumb-item>
      <el-breadcrumb-item>{{ zoneInfomation.name || '' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card shadow="never" :body-style="{ padding: 0 }">
      <!-- 社区信息 -->
      <!-- 头部信息 -->
      <div v-loading="zoneLoading" class="header-info">
        <el-row type="flex" justify="space-between" style="align-items: center">
          <el-row type="flex" style="align-items: center">
            <el-avatar
              class="header-info-avatar"
              :size="80"
              :src="zoneInfomation.headImg"
            ></el-avatar>
            <div class="header-info-content">
              <el-row type="flex" style="align-items: center">
                <span class="header-info-content-name">{{ zoneInfomation.name || '' }}</span>
                <div class="header-info-content-focuson" style="margin-left: 20px">
                  <span class="tip">关注：</span
                  ><span class="num">{{ zoneInfomation.totalFocus || 0 }}</span>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="header-info-content-focuson">
                  <span class="tip">帖子：</span
                  ><span class="num">{{ zoneInfomation.totalTopic || 0 }}</span>
                </div>
              </el-row>
              <!-- 专区描述 -->
              <div class="section-describes">
                {{
                  zoneInfomation.introduce && zoneInfomation.introduce.length > 50
                    ? zoneInfomation.introduce.slice(0, 50) + '...'
                    : zoneInfomation.introduce
                }}
              </div>
            </div>
          </el-row>
          <el-button
            :type="zoneInfomation.focus ? '' : 'primary'"
            size="medium"
            style="width: 90px; padding: 10px"
            :loading="focusLoading"
            @click.stop="attentionZone(zoneInfomation.focus)"
            >{{ zoneInfomation.focus ? '取消关注' : '+关注' }}</el-button
          >
        </el-row>
      </div>
      <el-divider></el-divider>
      <!-- tabs切换 -->
      <div class="zoneTabs">
        <el-tabs v-model="activeName" @tab-click="changeTabs">
          <el-tab-pane label="全部回复" name="1"> </el-tab-pane>
          <el-tab-pane label="只看专家" name="2"> </el-tab-pane>
          <el-tab-pane label="只看发帖人" name="3"> </el-tab-pane>
        </el-tabs>
        <div v-if="Object.keys(postInfo).length" class="zoneTabs-top">
          <el-button
            type="text"
            :loading="topLoading"
            @click="placedTop(postInfo.top)"
            style="color: rgba(0, 11, 21, 0.45)"
            >{{ postInfo.top ? '取消置顶' : '置顶' }}</el-button
          >
          <el-button
            type="text"
            :loading="highLoading"
            @click="highQuality(postInfo.fine)"
            style="color: rgba(0, 11, 21, 0.45)"
            >{{ postInfo.fine ? '取消精品' : '精品' }}</el-button
          >
        </div>
      </div>
      <!-- 帖子详情 -->
      <post-list
        ref="postList"
        :is-post-detail="true"
        :show-expert="true"
        :post-topic-id="topicId"
        :isShowTag="true"
        @postInfo="getPostInfo"
        @initData="initData"
      ></post-list>
      <!-- 帖子回复列表 -->
      <post-reply-list ref="postReplyList"></post-reply-list>
      <!-- 发表回复 -->
      <published-reply ref="publishedReply" @initData="initData"></published-reply>
    </el-card>
  </div>
</template>

<script>
import {
  queryAreaDetail,
  areaFollow,
  cancelAreaFollow,
  cancelTop,
  placedTop,
  cancelFine,
  highQualityFine
} from '@/api/community'
import postReplyList from './postReplyList.vue'
import postList from './postList.vue'
import publishedReply from './publishedReply.vue'
export default {
  name: 'PostDetails',
  components: {
    postReplyList,
    postList,
    publishedReply
  },
  data() {
    return {
      activeName: '1',
      areaId: '', // 专区id
      userId: '', // 发帖用户id,
      topicId: '', // 帖子id
      zoneInfomation: {}, // 专区信息
      zoneLoading: false,
      focusLoading: false,
      topLoading: false,
      highLoading: false,
      postInfo: {} // 帖子详情
    }
  },
  activated() {
    if (this.$route.query.areaId) {
      this.areaId = this.$route.query.areaId
      this.userId = this.$route.query.userId
      this.topicId = this.$route.query.topicId
      this.initAreaDetail()
    }
  },
  methods: {
    // 获取专区详情
    async initAreaDetail() {
      this.zoneLoading = true
      await queryAreaDetail({ areaId: this.areaId })
        .then((res) => {
          this.zoneInfomation = res
        })
        .finally(() => {
          this.zoneLoading = false
        })
    },
    // 关注专区
    async attentionZone(flag) {
      // flag = 1 是关注,0未关注
      this.focusLoading = true
      if (flag) {
        // 取消关注
        await cancelAreaFollow(this.areaId)
          .then(() => {
            this.$set(this.zoneInfomation, 'focus', 0)
            this.$message.success('取消关注成功!')
          })
          .finally(() => {
            this.focusLoading = false
          })
      } else {
        // 关注
        await areaFollow(this.areaId)
          .then(() => {
            this.$set(this.zoneInfomation, 'focus', 1)
            this.$message.success('关注成功!')
          })
          .finally(() => {
            this.focusLoading = false
          })
      }
    },
    // 置顶帖子
    async placedTop(flag) {
      // flag = 1置顶，0未置顶
      this.topLoading = true
      if (flag) {
        await cancelTop(this.topicId)
          .then(() => {
            this.$set(this.postInfo, 'top', 0)
            this.$message.success('取消置顶成功!')
          })
          .finally(() => {
            this.topLoading = false
          })
      } else {
        await placedTop(this.topicId)
          .then(() => {
            this.$set(this.postInfo, 'top', 1)
            this.$message.success('置顶成功!')
          })
          .finally(() => {
            this.topLoading = false
          })
      }
    },
    // 精品帖子
    async highQuality(flag) {
      // flag = 1精品，0不是精品
      this.highLoading = true
      if (flag) {
        await cancelFine(this.topicId)
          .then(() => {
            this.$set(this.postInfo, 'fine', 0)
            this.$message.success('取消精品成功!')
          })
          .finally(() => {
            this.highLoading = false
          })
      } else {
        await highQualityFine(this.topicId)
          .then(() => {
            this.$set(this.postInfo, 'fine', 1)
            this.$message.success('操作成功!')
          })
          .finally(() => {
            this.highLoading = false
          })
      }
    },
    // 获取帖子详情
    getPostInfo(val) {
      this.postInfo = val
    },
    // 重新刷新帖子回复
    initData() {
      this.$refs.postReplyList.pageConfig.pageNo = 1
      this.$refs.postReplyList.initTopicReply()
    },
    // 切换tabs
    changeTabs() {
      this.$refs.postReplyList.pageConfig.pageNo = 1
      this.$refs.postReplyList.requestType = this.activeName
      this.$refs.postReplyList.initTopicReply()
    }
  }
}
</script>

<style lang="scss" scoped>
.postDetails {
  .header-info {
    padding: 25px 25px 10px;
    &-avatar {
      flex: 0 0 80px;
    }
    &-content {
      margin-left: 20px;
      &-name {
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: bold;
      }
      &-focuson {
        font-size: 14px;
        .tip {
          color: rgba(0, 11, 21, 0.45);
        }
        .num {
          color: rgba(0, 11, 21, 0.85);
        }
      }
      .section-describes {
        margin-top: 15px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
    }
    /deep/ .el-divider--vertical {
      margin: 0 18px;
      height: 10px;
    }
  }
  .zoneTabs {
    position: relative;
    /deep/ .el-tabs {
      margin-top: -12px;
      .el-tabs__item {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
      }
    }
    /deep/ .el-tabs .el-tabs__nav-wrap {
      padding: 0 25px;
    }
    &-top {
      position: absolute;
      right: 20px;
      top: 10px;
    }
  }
}
</style>
