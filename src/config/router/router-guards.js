export default function(router) {
  router.afterEach((route) => {
    //动态设置浏览器标题
    document.title = _.get(route, 'meta.title', '')
  })
}
