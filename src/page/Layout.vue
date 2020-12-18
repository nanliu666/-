<template>
  <div class="el-layout">
    <the-header v-if="!isFullscreen" />
    <div :class="['el-main', { 'el-main--fullscreen': isFullscreen }]">
      <keep-alive>
        <router-view
          :key="$route.fullPath"
          class="el-view"
        />
      </keep-alive>
    </div>
    <the-footer />
  </div>
</template>

<script>
import TheHeader from './TheHeader'
import TheFooter from './TheFooter'
export default {
  name: 'Layout',
  components: {
    TheHeader,
    TheFooter
  },
  computed: {
    isFullscreen() {
      return this.$route.meta.fullscreen
    }
  }
}
</script>

<style lang="scss" scoped>
.el-layout {
  background-color: $mainBackGray;
  .el-main {
    min-height: calc(100vh - 56px);
    width: 1200px;
    margin: auto;
    padding: 0;
    padding-bottom: 44px; // 留出footer的高度
    &--fullscreen {
      min-height: 100vh;
      width: 100%;
    }
  }
}
</style>
