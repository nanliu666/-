// 配置编译环境和线上环境之间的切换

let baseUrl = '' //（用户前台）
let backBaseUrl = '' //（后台管理）
let iconfontVersion = ['2232073_ivepzk6d68']
let iconfontUrl = '//at.alicdn.com/t/font_$key.css'
let codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV == 'development') {
  baseUrl = '' // 开发环境地址（用户前台）
} else if (env.NODE_ENV == 'production') {
  baseUrl = '' //生产环境地址（用户前台）
} else if (env.NODE_ENV == 'test') {
  baseUrl = '' //测试环境地址（用户前台）
}
if (location.host.indexOf('localhost') !== -1) {
  backBaseUrl = 'http://localhost:1889' // 本地开发环境地址（后台管理）
} else if (env.NODE_ENV == 'development') {
  backBaseUrl = 'http://139.159.141.248:8081' // 线上开发环境地址（后台管理）
} else if (env.NODE_ENV == 'production') {
  backBaseUrl = 'http://139.159.141.248:8081' //生产环境地址（后台管理）
} else if (env.NODE_ENV == 'test') {
  backBaseUrl = 'http://139.159.141.248:8081' //测试环境地址（后台管理）
}
export { baseUrl, backBaseUrl, iconfontUrl, iconfontVersion, codeUrl, env }
