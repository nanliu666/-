<template>
  <div class="communityDetails">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item
        :to="{ path: '/community/recommended', query: { tagName: 'communityManagement' } }"
        >社区管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ communityInfomation.name || '' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card shadow="never" :body-style="{ padding: 0 }" style="border-radius: 10px">
      <div v-loading="communityLoading">
        <!-- 顶部 -->
        <div
          class="top-header"
          :style="{
            background: `url(${communityInfomation.coverPic}) 0% 0%/100% 100% no-repeat`
          }"
        ></div>
        <!-- 社区信息 -->
        <div class="zoneView">
          <div class="zoneTip">
            <el-image
              style="width: 150px; height: 150px; border-radius: 50%"
              :src="communityInfomation.headImg"
            ></el-image>
          </div>
          <el-row
            type="flex"
            justify="space-between"
            style="align-items: center; margin-left: 180px"
          >
            <div class="box-left">
              <el-row type="flex" style="align-items: flex-end">
                <div class="name">{{ communityInfomation.name || '' }}</div>
                <div class="focuson">
                  关注：<span class="num">{{ communityInfomation.totalFocus || 0 }}</span>
                </div>
                <div class="focuson">
                  帖子：<span class="num">{{ communityInfomation.totalTopic || 0 }}</span>
                </div>
              </el-row>
              <div class="describe">
                <el-tooltip
                  effect="dark"
                  :content="communityInfomation.introduce"
                  placement="top"
                  :manual="
                    communityInfomation.introduce && communityInfomation.introduce.length <= 50
                  "
                >
                  <span>{{
                    communityInfomation.introduce && communityInfomation.introduce.length > 50
                      ? communityInfomation.introduce.slice(0, 50) + '...'
                      : communityInfomation.introduce
                  }}</span>
                </el-tooltip>
              </div>
            </div>
            <el-button type="primary" size="medium" @click="goZoneHome">专区查看</el-button>
          </el-row>
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- tabs切换 -->
      <div class="zoneTabs">
        <el-tabs v-model="activeName">
          <el-tab-pane label="帖子审核" name="postAudit">
            <div v-if="activeName == 'postAudit'" class="zoneContainer">
              <post-audit ref="postAudit"></post-audit>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户管理" name="userManagement">
            <div v-if="activeName == 'userManagement'" class="zoneContainer">
              <user-management ref="userManagement" :area-id="areaId"></user-management>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import postAudit from './postAudit'
import userManagement from './userManagement'
import { queryAreaDetail } from '@/api/community'
export default {
  name: 'CommunityDetails',
  components: {
    postAudit,
    userManagement
  },
  data() {
    return {
      activeName: 'postAudit',
      communityInfomation: {}, // 社区信息
      communityLoading: false,
      areaId: '' // 专区id
    }
  },
  activated() {
    if (this.$route.query.areaId) {
      this.areaId = this.$route.query.areaId
      this.initAreaDetail()
    }
  },
  methods: {
    // 获取专区详情
    async initAreaDetail() {
      this.communityLoading = true
      await queryAreaDetail({ areaId: this.areaId })
        .then((res) => {
          this.communityInfomation = res
        })
        .finally(() => {
          this.communityLoading = false
        })
    },
    // 跳到专区主页
    goZoneHome() {
      this.$router.push({
        path: '/community/zoneHomePage',
        query: { areaId: this.communityInfomation.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.communityDetails {
  .top-header {
    width: 100%;
    height: 160px;
  }
  .zoneView {
    position: relative;
    font-size: 16px;
    margin: 15px 0 20px;
    padding: 0 25px;
    .zoneTip {
      position: absolute;
      border-radius: 50%;
      border: 4px solid rgba(255, 255, 255, 0.8);
      left: 25px;
      bottom: 0;
    }
    .box-left {
      font-size: 14px;
      .name {
        font-size: 24px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 500;
      }
      .focuson {
        margin-left: 25px;
        .num {
          color: #2875d4;
        }
      }
      .describe {
        margin-top: 10px;
      }
    }
  }
  .zoneTabs {
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
  }
  .zoneContainer {
    padding: 10px 25px;
  }
}
</style>
