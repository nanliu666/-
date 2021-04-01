<template>
  <div :class="['header', { isFullscreenHead: isFullscreen }]">
    <div class="header-inner">
      <div class="logo">
        <img v-if="envVar === 'zehui' && isOrgIdE" src="../assets/images/logoE.png" />
        <img v-else-if="envVar === 'zehui'" src="../assets/images/logoZeHui.png" />
        <img v-else src="../assets/images/logo.png" />
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
          <el-dropdown class="dropdown-avatar">
            <span class="el-dropdown-link avatar">
              <img
                v-if="userInfo && userInfo.avatar_url"
                class="top-bar__img"
                :src="userInfo.avatar_url"
              />
              <i v-else class="iconimage_icon_headportrait iconfont" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>
            <div @click="showUserCenter">
              个人中心
            </div>
          </el-dropdown-item> -->
              <el-dropdown-item @click.native="toRouter('/my/info')"> 个人信息 </el-dropdown-item>
              <el-dropdown-item
                v-if="userInfo.role_id && userInfo.role_id.length > 0"
                @click.native="toRouter('', 'backstage')"
              >
                后台管理
              </el-dropdown-item>
              <el-dropdown-item @click.native="toRouter('/my/info', 1)">
                修改密码
              </el-dropdown-item>
              <el-dropdown-item @click.native="toRouter('/my/record')"> 我的档案 </el-dropdown-item>
              <el-dropdown-item @click.native="toRouter('/approvalCenter/center')">
                审批中心
              </el-dropdown-item>
              <!-- <el-dropdown-item>
                后台管理
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="logout"> 退出登录 </el-dropdown-item>
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
  { label: '我的任务', path: '/learn' },
  { label: '企业知识', path: '/course' },
  { label: '知识分享', path: '/knowledge' },
  { label: '考试中心', path: '/exam' },
  { label: '新闻公告', path: '/news' },
  { label: '培训中心', path: '/train' },
  { label: '直播中心', path: '/live' }
]
import Notification from './Notification'
import { mapGetters } from 'vuex'
import { backBaseUrl } from '@/config/env'
import { getStore } from '@/util/store'
export default {
  name: 'Header',
  components: {
    Notification
  },
  data() {
    return {
      menu,
      activePath: '/home',
      routerTo: '',
      isOrgIdE: false
    }
  },
  computed: {
    envVar() {
      let envC = process.env
      return envC.VUE_APP_ENV
    },
    isFullscreen() {
      return this.$route.meta.fullscreen
    },
    ...mapGetters(['userId', 'userInfo'])
  },
  watch: {
    //监听路由变化
    $route(to) {
      this.$nextTick(() => {
        this.activePath = this.getCaption(to.path, 0)
      })
      // to , from 分别表示从哪跳转到哪，都是一个对象
      // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
    }
  },
  beforeMount() {
    // 初始化时设置激活中的菜单
    this.activePath = this.$route.path.match(/^\/\w*/g)[0]
  },
  mounted() {
    this.$nextTick(() => {
      this.isOrgIdEFn()
    })
  },
  methods: {
    isOrgIdEFn() {
      // 判断是否是挖机组织
      this.orgIds = getStore({ name: 'orgIds' })
      this.isOrgIdE = this.orgIds.indexOf('5263') !== -1 ? true : false
    },
    // 个人中心跳转
    toRouter(data, i) {
      if (i === 'backstage') {
        // 跳转到后台管理
        let tid = getStore({ name: 'token' })
        window.location.href = `${backBaseUrl}/#/wel?tid=${tid}`
      }
      this.$router.push({
        path: data,
        query: {
          pitch: i
        }
      })
    },
    handleMenuClick(item) {
      if (this.$route.path === item.path) {
        return
      }
      // this.activePath = item.path
      // this.activePath = this.routerTo
      this.$router.push(item.path)
    },

    getCaption(obj, state) {
      let index = obj.lastIndexOf('/')
      if (state == 0) {
        obj = obj.substring(0, index)
      } else {
        obj = obj.substring(index + 1, obj.length)
      }
      return obj
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
  height: $headerHeight;
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
    .dropdown-avatar {
      margin-left: 24px;
    }
    .avatar {
      i {
        font-size: 32px;
        color: rgba($primaryFontColor, 0.45);
      }
      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      cursor: pointer;
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
      line-height: $headerHeight;
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
.isFullscreenHead {
  background: none;
  box-shadow: none;
}
</style>
