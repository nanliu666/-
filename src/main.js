import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router/router'
import './error' // 日志
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import Element, { Message } from 'element-ui'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import '@/styles/element-custom/theme/index.css'
import './styles/common.scss'

import Permission from '@/directive/pcheck'
import _ from 'lodash'
import loadmore from './directive/loadmore'
Vue.prototype._ = _

// if (process.env.NODE_ENV !== 'production') {
//   const mock = require('@/mock')
//   mock.default(true)
// }
const $message = (options) => {
  return Message({
    ...options,
    showClose: true
  })
}
;['success', 'warning', 'info', 'error'].forEach((type) => {
  $message[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
        showClose: true
      }
    }
    options.type = type
    return Message(options)
  }
})

Vue.use(router)
Vue.use(VueAxios, axios)
Vue.use(Element)
// 自定义vue指令
Vue.use(loadmore)
Vue.use(Permission)

// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key]
})
// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace('$key', ele))
})
Vue.prototype.$message = $message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
