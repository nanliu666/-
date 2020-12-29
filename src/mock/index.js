/* eslint-disable no-unused-vars */
import Mock from 'mockjs'
const modules = require.context('./modules/', true, /\.js$/)

/**
 * @param {boolean} enable 全局启用mock
 * @returns {void}
 */
export default (enable) => {
  if (!enable) return
  /**
   * 模拟数据mock
   *
   * mock是否开启模拟数据拦截
   */
  const options = { mock: false }
  // 设置500毫秒的时延长
  Mock.setup({
    timeout: 500
  })
  modules.keys().forEach((key) => {
    modules(key).default(options)
  })
}
