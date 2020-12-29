<template>
  <div class="header">
    <div class="header-inner">
      <div class="logo">
        <img src="../assets/images/logo.png" />
      </div>
      <template v-if="userId">
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
        <div class="flex flex-flow flex-items right-menu">
          <div class="iconimage_icon_help iconfont help"></div>
          <Notification />
          <el-dropdown>
            <span class="el-dropdown-link">
              <img
                v-if="userInfo && userInfo.avatar_url"
                class="top-bar__img avatar"
                :src="userInfo.avatar_url"
              />
              <i
                v-else
                class="iconimage_icon_headportrait iconfont avatar"
              />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>
            <div @click="showUserCenter">
              个人中心
            </div>
          </el-dropdown-item> -->
              <el-dropdown-item @click.native="logout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <div class="el-icon-picture-outline hander"></div> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const menu = [
  { label: '首页', path: '/home' },
  { label: '学习', path: '/learn' },
  { label: '课程', path: '/course' },
  { label: '知识库', path: '/knowledge' },
  { label: '新闻', path: '/news' },
  { label: '培训', path: '/train' },
  { label: '个人中心', path: '/my/info' },
  { label: '我的档案', path: '/my/record' }
]
import Notification from './Notification'
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  components: {
    Notification
  },
  data() {
    return {
      menu,
      activePath: '/home'
    }
  },
  computed: {
    ...mapGetters(['userId', 'userInfo'])
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
    },
    logout() {
      this.$confirm('退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  align-self: flex-start;
  height: 64px;
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
  .right-menu {
    .help {
      margin-right: 24px;
      font-size: 20px;
      color: rgba($primaryFontColor, 0.45);
      cursor: pointer;
    }
    .avatar {
      font-size: 32px;
      margin-left: 24px;
      cursor: pointer;
      color: rgba($primaryFontColor, 0.45);
    }
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
