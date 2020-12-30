<template>
  <div class="el-layout">
    <the-header v-if="!isFullscreen" />
    <div :class="['el-main', { 'el-main--fullscreen': isFullscreen }]">
      <div class="el-view">
        <keep-alive>
          <router-view :key="$route.fullPath" />
        </keep-alive>
      </div>
      <the-footer />
    </div>
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
  // 父元素
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  .el-main {
    min-height: calc(100vh - #{$headerHeight} - 40px);
    padding: 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    .el-view {
      width: 1200px;
      flex: 1;
    }
    &--fullscreen {
      .el-view {
        width: 100vw;
      }
    }
  }
}
</style>
