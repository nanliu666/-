import Vue from 'vue'

Vue.config.errorHandler = function(err, vm, info) {
  Vue.nextTick(() => {
    if (process.env.NODE_ENV === 'development') {
      window.console.group('>>>>>> 错误信息 >>>>>>')
      window.console.error(info)
      window.console.groupEnd()
      window.console.group('>>>>>> Vue 实例 >>>>>>')
      window.console.log(vm)
      window.console.groupEnd()
      window.console.group('>>>>>> Error >>>>>>')
      window.console.log(err)
      window.console.groupEnd()
    }
  })
}
