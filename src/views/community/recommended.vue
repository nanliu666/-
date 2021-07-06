<template>
  <div class="recommended">
    <!-- 关注的专区 -->
    <attention-zone ref="attentionZone"></attention-zone>
    <!-- 热门动态 -->
    <div class="popular-dynamic">
      <div class="common-title" style="padding: 0 25px"><span class="tip"></span>热门动态</div>
      <el-divider></el-divider>
      <!-- 动态列表 -->
      <post-list
        ref="postList"
        :show-load-more="true"
        :page-config="pageConfig"
        :is-hot-topic="true"
        :request-parameters="{}"
         :isShowTag="true"
        empty-tip="还没有热门动态"
      ></post-list>
    </div>
  </div>
</template>

<script>
import attentionZone from './components/attentionZone.vue'
import postList from './components/postList.vue'
export default {
  name: 'Recommended',
  components: {
    attentionZone,
    postList
  },
  data() {
    return {
      pageConfig: {
        pageNo: 1,
        pageSize: 40,
        total: 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './components/commonTitle.scss';
.recommended {
  .popular-dynamic {
    margin-top: 40px;
  }
}
[v-cloak] {
  display: none !important;
}
</style>
