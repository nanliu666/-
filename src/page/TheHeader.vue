<template>
  <div class="header">
    <div class="header-inner">
      <div class="logo">
        <img src="../assets/images/logo.png" />
      </div>
      <ul class="header-menu">
        <li
          v-for="item in menu"
          :key="item.path"
          :class="{ active: activePath === item.path }"
          @click="handleMenuClick(item)"
        >
          {{ item.label }}
        </li>
      </ul>
      <div></div>
    </div>
  </div>
</template>

<script>
const menu = [
  { label: '首页', path: '/home' },
  { label: '新闻', path: '/news/news' },
  { label: '个人中心', path: '/my/info' },
  { label: '我的档案', path: '/my/record' },
  { label: '学习', path: '/learn' },
  { label: '知识库', path: '/knowledge' }
]
export default {
  name: 'Header',
  data() {
    return {
      menu,
      activePath: '/home'
    }
  },
  beforeMount() {
    // 初始化时设置激活中的菜单
    this.activePath = this.$route.path.match(/^\/\w*/g)[0]
  },
  methods: {
    handleMenuClick(item) {
      if (this.$route.path === item.path) {
        return
      }
      this.activePath = item.path
      this.$router.push(item.path)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  align-self: flex-start;
  height: 56px;
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  background-color: white;
  .header-inner {
    height: 100%;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-menu {
    height: 100%;
    display: flex;

    li {
      opacity: 0.65;
      font-size: 16px;
      color: #000b15;
      text-align: center;
      line-height: 56px;
      position: relative;
      margin-right: 48px;
      cursor: pointer;
      &:last-of-type {
        margin-right: 0;
      }
      &.active {
        color: $primaryColor;
        opacity: 1;
        font-weight: bold;
        &::after {
          content: '';
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          position: absolute;
          background-color: $primaryColor;
        }
      }
    }
  }
}
</style>
