<template>
  <div class="allZone">
    <!-- 筛选框 -->
    <div class="search">
      <el-input
        v-model="keyword"
        placeholder="请输入您要查找的专区"
        suffix-icon="el-icon-search"
        style="width: 380px"
        size="small"
        @input="search"
      >
      </el-input>
    </div>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <el-row :gutter="22" style="padding: 10px 25px 25px" v-if="zoneList.length" v-loading="loading">
      <el-col v-for="(item, index) in zoneList" :key="index" :span="12" style="margin-bottom: 22px">
        <div class="zone-content" @click="goZoneHome(item)">
          <el-row type="flex" justify="space-between">
            <div class="zone-content-sort">{{ index < 9 ? '0' + (index + 1) : index + 1 }}</div>
            <div class="zone-content-info">
              <div class="zone-content-info-title">
                <el-tooltip
                  effect="dark"
                  :content="item.name"
                  placement="top"
                  :manual="item.name.length <= 20"
                >
                  <span>{{
                    item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name
                  }}</span>
                </el-tooltip>
              </div>
              <div class="zone-content-info-describe">
                <el-tooltip
                  effect="dark"
                  :content="item.introduce"
                  placement="top"
                  :manual="item.introduce.length <= 50"
                >
                  <span>{{
                    item.introduce.length > 50
                      ? item.introduce.slice(0, 50) + '...'
                      : item.introduce
                  }}</span>
                </el-tooltip>
              </div>
              <div class="zone-content-info-tip">
                <el-row type="flex" style="align-items: center">
                  <div class="zone-content-info-tip-focuson">
                    <span class="title">关注：</span><span class="num">{{ item.totalFocus }}</span>
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <div class="zone-content-info-tip-post">
                    <span class="title">帖子：</span><span class="num">{{ item.totalTopic }}</span>
                  </div>
                </el-row>
              </div>
            </div>
            <div class="focuson">
              <el-button
                :type="item.focus ? '' : 'primary'"
                size="medium"
                style="width: 85px"
                @click.stop="attentionZone(item, index)"
                >{{ item.focus ? '取消关注' : '关注' }}</el-button
              >
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 暂无数据 -->
    <div class="empty-tips" v-else v-loading="loading">
      <img src="@/assets/images/empty.png" class="empty-img" />
      <div class="empty-text">
        <span>暂无专区</span>
      </div>
    </div>
  </div>
</template>

<script>
import { queryAllAreas, areaFollow, cancelAreaFollow } from '@/api/community'
export default {
  name: 'AllZone',
  data() {
    return {
      keyword: '',
      loading: false,
      zoneList: []
    }
  },
  mounted() {
    this.initQueryAllAreas()
  },
  methods: {
    async initQueryAllAreas() {
      this.loading = true
      await queryAllAreas({ name: this.keyword })
        .then((res) => {
          this.zoneList = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 筛选
    search: _.debounce(function (val) {
      this.keyword = val
      this.initQueryAllAreas()
    }, 300),
    // 关注专区
    async attentionZone(item, index) {
      if (item.focus) {
        // 取消关注
        await cancelAreaFollow(item.id).then(() => {
          this.$set(this.zoneList[index], 'focus', 0)
        })
      } else {
        // 关注
        await areaFollow(item.id).then(() => {
          this.$set(this.zoneList[index], 'focus', 1)
        })
      }
    },
    // 跳到专区主页
    goZoneHome(item) {
      this.$router.push({ path: '/community/zoneHomePage', query: { areaId: item.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.allZone {
  .search {
    padding: 0 25px;
  }
  .zone-content {
    width: 564px;
    height: 130px;
    padding: 15px 20px;
    border: 1px solid rgba(0, 11, 21, 0.08);
    border-radius: 4px;
    cursor: pointer;
    &-sort {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #f0f9ff;
      font-family: Impact;
      font-size: 16px;
      color: #2875d4;
      font-weight: bold;
      text-align: center;
      line-height: 48px;
    }
    &-info {
      width: 330px;
      margin-top: 10px;
      &-title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
      &-describe {
        height: 32px;
        font-size: 12px;
        color: rgba(0, 11, 21, 0.45);
        margin-top: 8px;
        word-break: break-all;
      }
      &-tip {
        margin-top: 15px;
        font-size: 12px;
        .title {
          color: rgba(0, 11, 21, 0.45);
        }
        .num {
          color: rgba(0, 11, 21, 0.85);
        }
      }
    }
    .focuson {
      margin-top: 33px;
      /deep/ .el-button {
        padding: 10px;
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
}
</style>
