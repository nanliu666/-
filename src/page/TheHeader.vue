<template>
  <div :class="['header', { isFullscreenHead: isFullscreen }]">
    <div class="header-inner">
      <div class="logo">
        <!-- <img v-if="envVar === 'zehui' && isOrgIdE" src="../assets/images/logoE.png" />
        <img v-else-if="envVar === 'zehui'" src="../assets/images/logoZeHui.png" />
        <img v-else src="../assets/images/logo_yb.png" /> -->
        <img class="imglogo" :src="logoUrl" width="180" height="40" />
      </div>
      <template v-if="userId">
        <ul v-show="!hasSearch" class="header-menu">
          <li
            v-for="item in menu"
            :key="item.path"
            :class="{ active: activePath === item.path }"
            @click="handleMenuClick(item)"
          >
            {{ item.label }}
          </li>
        </ul>
        <SearchPart v-if="hasSearch" @closeSearch="hasSearch = false" />
        <div class="flex flex-flow flex-items right-menu">
          <div class="search__wrap">
            <i
              v-if="!hasSearch"
              class="iconimage_icon_search iconfont search__icon"
              @click="hasSearch = true"
            ></i>
          </div>
          <div class="iconimage_icon_help iconfont help"></div>
          <Notification />
          <el-popover class="dropdown-avatar" width="256" trigger="click">
            <el-button slot="reference" type="text">
              <span class="el-dropdown-link avatar">
                <img
                  v-if="userInfo && userInfo.avatar_url"
                  class="top-bar__img"
                  :src="userInfo.avatar_url"
                />
                <i v-else class="iconimage_icon_headportrait iconfont" /> </span
            ></el-button>
            <div class="dialogContent">
              <div class="topMenu">
                <div class="fristLine">
                  <div>
                    <span class="iconwodedangan iconfont"></span>
                    <el-button type="text" @click.native="toRouter('/personal')">
                      我的档案
                    </el-button>
                  </div>
                  <div>
                    <span class="icongerenshezhi iconfont"></span>
                    <el-button
                      type="text"
                      @click.native="toRouter('/personal', 'PersonalSettings')"
                    >
                      个人设置
                    </el-button>
                  </div>
                </div>
                <!-- <div class="secondLine">
                  <div>
                    <span class="iconwodebiji iconfont"></span>
                    <el-button type="text"> 我的笔记 </el-button>
                  </div>
                  <div>
                    <span class="iconwodeshoucang iconfont"></span>
                    <el-button type="text"> 我的收藏 </el-button>
                  </div>
                </div> -->
              </div>
              <div class="centerMenu">
                <div>
                  <span class="iconshenpizhongxin iconfont"></span>
                  <el-button type="text" @click.native="toRouter('/approvalCenter/approveIndex')">
                    审批中心
                  </el-button>
                </div>
                <div>
                  <span class="iconanquantuichu iconfont"></span>
                  <el-button type="text" @click.native="logout"> 安全退出 </el-button>
                </div>
              </div>
              <div class="bottomMenu">
                <div v-if="userInfo.role_id && userInfo.role_id.length > 0">
                  <span class="iconhoutaiguanli iconfont"></span>
                  <el-button type="text" @click.native="toRouter('', 'backstage')">
                    后台管理
                  </el-button>
                </div>

                <!-- <div>
                  <span class="el-icon-user"></span>
                  <el-button type="text" @click.native="toRouter('/personal')">
                    个人中心
                  </el-button>
                </div> -->
                <div v-if="role == 1">
                  <span class="el-icon-user"></span>
                  <el-button type="text" @click.native="lecturerBtn()">
                    {{ `${rolePage === false ? '讲师端' : '学员端'}` }}
                  </el-button>
                </div>
              </div>
            </div>
          </el-popover>

          <!-- <el-dropdown trigger="click" class="dropdown-avatar">
            <span class="el-dropdown-link avatar">
              <img
                v-if="userInfo && userInfo.avatar_url"
                class="top-bar__img"
                :src="userInfo.avatar_url"
              />
              <i v-else class="iconimage_icon_headportrait iconfont" />
            </span>
            <el-dropdown-menu slot="dropdown"> -->
          <!-- <el-dropdown-item>
            <div @click="showUserCenter">
              个人中心
            </div>
          </el-dropdown-item> -->
          <!-- <el-dropdown-item @click.native="toRouter('/my/info')"> 个人信息 </el-dropdown-item>
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
              </el-dropdown-item> -->
          <!-- <el-dropdown-item @click.native="toRouter('/personal')" >
                个人中心
              </el-dropdown-item> -->
          <!-- <el-dropdown-item @click.native="logout"> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <!-- <div class="el-icon-picture-outline hander"></div> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// let menu = [
//   { label: '首页', path: '/home' },
//   // { label: '我的任务', path: '/learn' },
//   // { label: '我的任务', path: '/myTask' },
//   { label: '讲师任务', path: '/lecturerTask' },
//   { label: '企业知识', path: '/course' },
//   { label: '知识分享', path: '/knowledge' },
//   { label: '考试中心', path: '/exam' },
//   { label: '新闻公告', path: '/news' },
//   { label: '培训中心', path: '/train' },
//   { label: '直播中心', path: '/live' }
// ]
import Notification from './Notification'
import { mapGetters } from 'vuex'
import { backBaseUrl } from '@/config/env'
import { getStore } from '@/util/store'
import { judgeTeacherStudent } from '@/api/lecturerTask'
import SearchPart from './components/searchPart'
export default {
  name: 'Header',
  components: {
    Notification,
    SearchPart
  },
  data() {
    return {
      menu: [
        { label: '首页', path: '/home' },
        // { label: '我的任务', path: '/learn' },
        // { label: '我的任务', path: '/myTask' },
        { label: '我的任务', path: '/myTask' },
        { label: '课程资源', path: '/course' },
        { label: '知识分享', path: '/knowledge' },
        { label: '培训中心', path: '/train' },
        { label: '直播中心', path: '/live' },
        { label: '考试中心', path: '/exam' },
        { label: '社区', path: '/community' },
        { label: '新闻中心', path: '/news' }
      ],
      hasSearch: false,
      // menu,
      logoUrl: '',
      activePath: '/home',
      routerTo: '',
      isOrgIdE: false,
      role: '',
      rolePage: false
    }
  },
  computed: {
    // logoImg() {
    //   let logoBaseInfor = this.diyInfor||getStore({ name: 'diyInfor' })
    //   let logoImg = logoBaseInfor.logo && logoBaseInfor.logo.FrontUrl
    //   return logoImg
    // },
    envVar() {
      let envC = process.env
      return envC.VUE_APP_ENV
    },
    isFullscreen() {
      return this.$route.meta.fullscreen
    },
    ...mapGetters(['userId', 'userInfo', 'orgIds', 'diyInfor'])
  },
  watch: {
    //监听路由变化
    $route(to) {
      this.$nextTick(() => {
        this.activePath = this.getCaption(to.path, 0)
        // this.activePath = to.path
      })
      // to , from 分别表示从哪跳转到哪，都是一个对象
      // to.path  ( 表示的是要跳转到的路由的地址 eg: /home );
    },
    diyInfor: {
      handler() {
        let logoBaseInfor =
          (this.diyInfor && this.diyInfor.logo && this.diyInfor.logo.length > 0 && this.diyInfor) ||
          getStore({ name: 'diyInfor' })
        this.logoUrl = logoBaseInfor.logo && logoBaseInfor.logo.FrontUrl
      },
      deep: true
    }
    // orgIds(val) {
    //   this.isOrgIdE = val.indexOf('5263') !== -1 ? true : false
    // }
  },
  beforeMount() {
    // 初始化时设置激活中的菜单
    this.activePath = this.$route.path.match(/^\/\w*/g)[0]
  },
  created() {
    // this.isOrgIdEFn()
    this.isJudgeTeacherStudent()
  },
  mounted() {
    this.$nextTick(() => {
      let logoBaseInfor =
        (this.diyInfor && this.diyInfor.logo && this.diyInfor.logo.length > 0 && this.diyInfor) ||
        getStore({ name: 'diyInfor' })
      this.logoUrl = logoBaseInfor.logo && logoBaseInfor.logo.FrontUrl
    })
  },
  activated() {
    // this.isOrgIdEFn()
    // this.isJudgeTeacherStudent()
  },
  methods: {
    // isOrgIdEFn() {
    //   // 判断是否是挖机组织
    //   // 获取用户的组织id（包括当前和当前以上的），存放在localstore，vuex
    //   let orgIdsVuex = this.orgIds
    //   this.orgIdsD = orgIdsVuex || getStore({ name: 'orgIds' })
    //   this.isOrgIdE = this.orgIdsD.indexOf('5263') !== -1 ? true : false
    // },

    lecturerBtn() {
      let roleData = sessionStorage.getItem('role')
      this.rolePage = roleData == 1 ? false : true
      if (this.rolePage) {
        sessionStorage.setItem('role', 1)
        let item = { label: '讲师任务', path: '/lecturerTask' }
        this.roleSwitch()
        this.handleMenuClick(item)
      } else {
        sessionStorage.setItem('role', 0)
        let item = { label: '我的任务', path: '/myTask' }
        this.roleSwitch()
        this.handleMenuClick(item)
      }
    },
    // 判断讲师/学员角色 0 学员 1 讲师
    isJudgeTeacherStudent() {
      let roleData = sessionStorage.getItem('role')
      this.role = sessionStorage.getItem('identity')
      this.rolePage = roleData == 1 ? true : false

      // 如果角色为空才去请求
      if (roleData === null) {
        judgeTeacherStudent().then((res) => {
          // 保存到内存
          sessionStorage.setItem('role', res.identity)
          sessionStorage.setItem('identity', res.identity)
          this.role = res.identity
          this.rolePage = res.identity == 1 ? true : false
          this.roleSwitch()
        })
      } else {
        this.roleSwitch()
      }
    },

    roleSwitch() {
      let roleData = sessionStorage.getItem('role')
      if (roleData == 1) {
        this.menu[1].label = '讲师任务'
        this.menu[1].path = '/lecturerTask'
      } else {
        this.menu[1].label = '我的任务'
        this.menu[1].path = '/myTask'
      }
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
      // if (this.$route.path === item.path) {
      //   return
      // }
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
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('identity')
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
  position: relative;
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
    .imglogo {
      width: 180px;
      height: 40px;
    }
  }
  .right-menu {
    .help {
      margin-right: 24px;
      font-size: 20px;
      color: rgba($primaryFontColor, 0.45);
      cursor: pointer;
    }
    .dropdown-avatar {
      margin-left: 36px;
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
    height: 60px;
    display: flex;
    opacity: 1;
    li {
      opacity: 0.65;
      font-size: 16px;
      color: #000b15;
      text-align: center;
      line-height: $headerHeight;
      position: relative;
      margin-right: 30px;
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
  .search__wrap {
    width: 30px;
    height: 20px;
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin-right: 24px;
    .search__icon {
      color: #8c9195;
      cursor: pointer;
      margin-top: 2px;
    }
  }
}
.isFullscreenHead {
  background: none;
  box-shadow: none;
}
.dialogContent {
  height: auto;
  width: 230px;
  .centerMenu {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(229, 229, 229);
  }
  .topMenu,
  .centerMenu,
  .bottomMenu {
    .iconfont {
      color: rgb(148, 152, 157);
    }
    .el-button.el-button--text {
      padding: 13px 20px 13px 5px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      line-height: 16px;
    }
  }
  .topMenu {
    padding-top: 0;
    border-bottom: 1px solid rgb(229, 229, 229);
    .fristLine,
    .secondLine {
      vertical-align: center;
      display: flex;
      justify-content: space-between;
    }
  }
  .bottomMenu {
    padding-bottom: 0;
    color: rgb(153, 153, 153);
    .el-button.el-button--text {
      color: rgba(0, 11, 21, 0.85);
    }
  }
}
</style>
