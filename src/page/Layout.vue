<template>
  <div class="el-layout">
    <the-header v-if="!isFullscreen" />
    <div :class="['el-main', { 'el-main--fullscreen': !isNotCenter && isFullscreen }]">
      <div class="el-view">
        <keep-alive>
          <router-view v-if="_.get($route.meta, 'keepAlive', true)" :key="$route.fullPath" />
        </keep-alive>
        <router-view v-if="!_.get($route.meta, 'keepAlive', true)" :key="$route.fullPath" />
      </div>
      <the-footer v-if="!isFullscreen" />
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
    },
    isNotCenter() {
      return this.$route.meta.isNotCenter
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
