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
  // 父元素
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  .el-main {
    min-height: calc(100vh - 56px - 40px);
    flex-basis: 1200px;
    flex-grow: 0; //存在多余长度也不放大
    margin: auto;
    padding: 0;
    &--fullscreen {
      flex-grow: 1;
      min-width: 1200px;
    }
    // &::-webkit-scrollbar {
    //   display: none;
    // }
  }
}
</style>
