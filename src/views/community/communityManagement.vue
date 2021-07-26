<template>
  <div class="communityManagement">
    <el-row style="margin-right: -18px" v-if="communityList.length" v-loading="loading">
      <div
        class="carousel-content"
        v-for="(temp, index) in communityList"
        :key="index"
        @click="goCommunityHome(temp)"
      >
        <el-avatar
          :size="32"
          shape="square"
          :src="temp.headImg"
          style="margin-right: 10px; vertical-align: middle"
        ></el-avatar>
        <el-tooltip
          effect="dark"
          :content="temp.name"
          placement="top"
          :manual="temp.name.length <= 8"
        >
          <span>{{ temp.name.length > 8 ? temp.name.slice(0, 8) + '...' : temp.name }}</span>
        </el-tooltip>
      </div>
    </el-row>
    <!-- 暂无数据 -->
    <div class="empty-tips" v-else v-loading="loading">
      <img src="@/assets/images/empty.png" class="empty-img" />
      <div class="empty-text">
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import { queryManageAreas } from '@/api/community'
export default {
  name: 'CommunityManagement',
  data() {
    return {
      communityList: [],
      loading: false
    }
  },
  methods: {
    async initQueryManageAreas() {
      this.loading = true
      await queryManageAreas()
        .then((res) => {
          this.communityList = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 跳到社区主页
    goCommunityHome(item) {
      this.$router.push({ path: '/community/communityDetails', query: { areaId: item.id } })
    }
  },
  mounted() {
    this.initQueryManageAreas()
  }
}
</script>

<style lang="scss" scoped>
.communityManagement {
  padding: 10px 25px;
  .carousel-content {
    width: 215.6px;
    height: 56px;
    background: rgba(0, 11, 21, 0.02);
    border-radius: 4px;
    font-size: 14px;
    padding: 12px 0 12px 14px;
    color: #000b15;
    cursor: pointer;
    display: inline-block;
    margin: 0 18px 18px 0;
    word-break: break-all;
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
}
/deep/ .el-avatar > img {
  width: 100%;
}
</style>
