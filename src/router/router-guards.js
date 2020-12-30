import store from '../store'
import { getToken } from '@/util/auth'

export default function(router) {
  router.beforeEach((to, from, next) => {
    const meta = to.meta || {}
    if (getToken()) {
      if (to.path === '/login') {
        //如果登录成功访问登录页跳转到主页
        next({ path: '/' })
      } else {
        //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
        if (store.getters.token.length === 0) {
          store.dispatch('LogOut').then(() => {
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
