import store from '../store'
import { getToken, removeToken, removeRefreshToken } from '@/util/auth'
import { saveLoginCredit } from '@/api/user'

export default function(router) {
  router.beforeEach((to, from, next) => {
    if (to.query.tid) {
      isToken(to.query.tid, next)
    }
    const meta = to.meta || {}
    if (getToken()) {
      if (to.path === '/login') {
        //如果登录成功访问登录页跳转到主页
        next({ path: '/' })
      } else {
        //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
        if (store.getters.token.length === 0) {
          store.dispatch('ClearSession').then(() => {
            next({ path: '/login' })
          })
        } else {
          next()
        }
      }
    } else {
      //判断是否需要认证，没有登录访问去登录页
      if (meta.isAuth === false) {
        next()
      } else {
        next({ path: '/login' })
      }
    }
  })
  router.afterEach((route) => {
    //动态设置浏览器标题
    document.title = _.get(route, 'meta.title', '')
  })
}
function isToken(tid, next) {
  removeToken()
  removeRefreshToken()
  store.dispatch('tokeLogin', tid).then((res) => {
    if (res.account) {
      next({ path: '/' })
      saveLoginCredit()
      store.dispatch('getDiyInforAc', { device: '1' }) // 用户的logo banner 首页布局等信息，存放在localstore，vuex
      //store.dispatch('getOrgIdsAc', res.account) // 获取用户的组织id（包括当前和当前以上的），存放在localstore，vuex
    }
  })
}
