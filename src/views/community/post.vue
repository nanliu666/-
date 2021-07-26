<template>
  <div class="post">
    <!-- 帖子列表 -->
    <post-list
      ref="postList"
      :showPage="true"
      :showAudit="true"
      :isShowTag="true"
      :requestParameters="requestParameters"
    ></post-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import postList from './components/postList.vue'
export default {
  name: 'Post',
  components: {
    postList
  },
  computed: {
    ...mapGetters(['userId']),
    requestParameters() {
      return { userId: this.userId, status: '0' }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>