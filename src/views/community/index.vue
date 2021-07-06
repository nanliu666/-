<template>
  <div class="community">
    <el-tabs v-model="activeName" @tab-click="tabSwitch">
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.name"
        :name="item.name"
        class="tab_name"
        :disabled="item.name == 'expertsAnswer' && !isShowExpertAnswer"
      >
        <div
          slot="label"
          class="tabs-label"
          :style="{
            visibility: item.name == 'expertsAnswer' && !isShowExpertAnswer ? 'hidden' : ''
          }"
        >
          <div class="tabs-label">
            <el-badge is-dot :hidden="item.name != 'notice' || unreadCount === 0">
              <span :class="item.icon" class="iconfont"></span>
              {{ item.label }}
            </el-badge>
          </div>
        </div>
        <div class="container">
          <component :is="item.name" v-if="activeName == item.name"></component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import recommended from './recommended'
import allZone from './allZone'
import communityManagement from './communityManagement'
import expertsAnswer from './expertsAnswer'
import notice from './notice'
import collection from './collection'
import post from './post'
import { queryUnreadCount } from '@/api/community'
export default {
  name: 'Community',
  components: {
    recommended,
    allZone,
    communityManagement,
    expertsAnswer,
    notice,
    collection,
    post
  },
  data() {
    return {
      activeName: 'recommended',
      tabsList: [
        {
          name: 'recommended',
          label: '推荐',
          icon: 'iconcommunity_ic_recommend'
        },
        {
          name: 'allZone',
          label: '全部专区',
          icon: 'iconcommunity_ic_all'
        },
        {
          name: 'communityManagement',
          label: '社区管理',
          icon: 'iconcommunity_ic_management'
        },
        {
          name: 'expertsAnswer',
          label: '专家答复',
          icon: 'iconcommunity_ic_expert'
        },
        {
          name: 'notice',
          label: '通知',
          icon: 'iconcommunity_ic_notice'
        },
        {
          name: 'collection',
          label: '收藏',
          icon: 'iconcommunity_ic_favorites'
        },
        {
          name: 'post',
          label: '帖子',
          icon: 'iconcommunity_ic_post'
        }
      ],
      unreadCount: 0,
      isShowExpertAnswer: 0
    }
  },
  activated() {
    if (this.$route.query.tagName) {
      this.activeName = this.$route.query.tagName
    }
    this.getUnreadCount()
  },
  methods: {
    //   获取通知未读数量
    async getUnreadCount() {
      await queryUnreadCount().then((res) => {
        this.unreadCount = res.count
        this.isShowExpertAnswer = res.isExpert
      })
    },
    // 判断切换到通知
    tabSwitch() {
      if (this.activeName == 'notice') {
        this.unreadCount = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.community {
  margin-top: 20px;
  background: #ffffff;
  min-height: calc(100vh - 130px);
  /deep/ .el-tabs__nav {
    width: 100%;
    .el-tabs__item {
      font-size: 16px;
      height: 50px;
      line-height: 50px;
      color: rgba(0, 11, 21, 0.65);
    }
    .el-tabs__item.is-active {
      color: #01aafc !important;
    }
    .el-tabs__item.is-top:nth-child(2) {
      padding-left: 25px;
    }
    .el-tabs__item.is-top:nth-child(5) {
      padding-left: 475px;
    }
  }
  /deep/ .el-badge .el-badge__content.is-fixed.is-dot {
    top: 18px;
    left: 4px;
  }
}
</style>
