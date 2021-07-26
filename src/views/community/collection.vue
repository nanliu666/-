<template>
  <div class="collection">
    <!-- 帖子列表 -->
    <post-list
      ref="postList"
      :showPage="true"
      :showAudit="true"
      :requestParameters="requestParameters"
      :isShowTag="true"
      :isCollection="true"
    ></post-list>
  </div>
</template>

<script>
import postList from './components/postList.vue'
export default {
  name: 'Collection',
  components: {
    postList
  },
  data() {
    return {
      requestParameters: { isCollect: 'Y' }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>