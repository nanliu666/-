<template>
  <div class="post">
    <!-- 帖子列表 -->
    <post-list ref="postList" :showPage="true" :showAudit="true" :isShowTag="true"></post-list>
  </div>
</template>

<script>
import postList from './components/postList.vue'
export default {
  name: 'Post',
  components: {
    postList
  }
}
</script>

<style lang="scss" scoped>
</style>