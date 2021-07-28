<template>
  <div class="otherHomePage">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item
        ><span @click="goBack" style="cursor: pointer; font-weight: bold"
          >社区首页</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ postUserInfo.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card shadow="always" :body-style="{ padding: 0 }">
      <!-- 头部信息 -->
      <div class="header-info" v-loading="loading">
        <el-row type="flex" style="align-items: center">
          <el-avatar
            :size="80"
            :src="postUserInfo.avatarUrl"
            style="margin-right: 20px"
          ></el-avatar>
          <span class="header-info-name">{{ postUserInfo.name }}</span>
          <span
            class="iconbiaoqian-zhuanjia iconfont header-info-experts"
            v-if="postUserInfo.isExpert"
          ></span>
          <div class="header-info-focuson" style="margin-left: 20px">
            <span class="tip">关注：</span><span class="num">{{ postUserInfo.totalFocus }}</span>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="header-info-focuson">
            <span class="tip">帖子：</span><span class="num">{{ postUserInfo.totalTopic }}</span>
          </div>
        </el-row>
        <!-- 专家介绍 -->
        <div class="experts-introduce" v-if="postUserInfo.isExpert">
          <el-row type="flex">
            <div class="experts-introduce-tip">专家介绍：</div>
            <div class="experts-introduce-info">
              {{ postUserInfo.expert.introduce }}
            </div>
          </el-row>
        </div>
        <!-- 获奖情况 -->
        <div class="experts-introduce" v-if="postUserInfo.isExpert">
          <el-row type="flex">
            <div class="experts-introduce-tip">获奖情况：</div>
            <div class="experts-introduce-info">
              {{ postUserInfo.expert.rewarded }}
            </div>
          </el-row>
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <div class="main-container">
        <!-- 关注的专区 -->
        <attention-zone
          ref="attentionZone"
          :requestParameters="requestParameters"
          :clickFlag="false"
          v-if="isAreaManagement == 'Y'"
        ></attention-zone>
        <div
          class="popular-dynamic"
          :style="{ marginTop: isAreaManagement == 'Y' ? '40px' : '0px' }"
        >
          <el-row type="flex" justify="space-between" style="align-items: center; padding: 0 25px">
            <div class="common-title">
              <span class="tip"></span>发帖记录<span>（{{ topicNum }}）</span>
            </div>
            <el-date-picker
              v-model="postTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="small"
              @change="changePostTime"
            >
            </el-date-picker>
          </el-row>
          <el-divider></el-divider>
          <!-- 发帖记录 -->
          <post-list
            ref="postList"
            :showPage="true"
            :requestParameters="requestParameters"
            emptyTip="还没有发帖记录"
            @topicTotal="topicTotal"
            :showAudit="true"
            :isShowTag="true"
          ></post-list>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import attentionZone from './attentionZone.vue'
import postList from './postList.vue'
import { postUserInfo, loginUserInfo } from '@/api/community'
export default {
  name: 'OtherHomePage',
  components: {
    attentionZone,
    postList
  },
  data() {
    return {
      postUserInfo: {}, // 发帖用户信息
      loading: false,
      postTime: [], // 发帖时间
      userId: '', // 用户id
      requestParameters: {}, // 关注专区请求参数
      topicNum: 0,
      isAreaManagement: 'N'
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        if (newVal.query.userId) {
          this.userId = this.$route.query.userId
          this.requestParameters.userId = this.$route.query.userId
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //   返回上一级
    goBack() {
      this.$router.go(-1) //返回上一层
    },
    //   获取当前发帖人信息
    async initPostUserInfo() {
      let params = {
        userId: this.userId
      }
      this.loading = true
      await postUserInfo(params)
        .then((res) => {
          this.postUserInfo = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 判断当前用户是不是专区管理员
    async initLoginUserInfo() {
      await loginUserInfo().then((res) => {
        this.isAreaManagement = res
      })
    },
    // 获取帖子条数
    topicTotal(val) {
      this.topicNum = val
    },
    changePostTime() {
      if (!this.postTime) this.postTime = []
      this.requestParameters.startDate = this.postTime[0]
      this.requestParameters.endDate = this.postTime[1]
      this.$refs.postList.initTopic()
    }
  },
  mounted() {
    this.initPostUserInfo()
    this.initLoginUserInfo()
  }
}
</script>

<style lang="scss" scoped>
@import './commonTitle.scss';
.otherHomePage {
  .header-info {
    padding: 25px 25px 10px;
    &-name {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: bold;
    }
    &-experts {
      margin-left: 10px;
      color: #f5623b;
      font-size: 24px;
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
    /deep/ .el-divider--vertical {
      margin: 0 18px;
      height: 10px;
    }
  }
  .experts-introduce {
    margin: 0 0 10px 100px;
    font-size: 14px;
    &-tip {
      color: rgba(0, 11, 21, 0.45);
      flex: 0 0 70px;
    }
    &-info {
      color: rgba(0, 11, 21, 0.85);
      line-height: 22px;
      word-break: break-all;
    }
  }
  .main-container {
    .popular-dynamic {
      /deep/ .el-date-editor .el-range-separator {
        padding: 0;
      }
    }
  }
}
</style>
