<template>
  <div @click="goDetail">
    去详情
  </div>
</template>

<script>
// 直播列表
export default {
  name: 'LiveList',
  data() {
    return {}
  },
  created() {},
  methods: {
    goDetail() {
      this.$router.push({ name: 'LiveDetail' })
    }
  }
}
</script>

<style scoped lang="scss"></style>
