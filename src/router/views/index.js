import demoRoutes from './demo'
import Layout from '@/page/Layout'
import EmptyLayout from '@/page/EmptyLayout'
/**
 * 路由定义规范
 * 路由整体分八大模块，每个模块写一个路由对象，对象属性包括
 * path 模块的根路径,尽量使用简洁的单词
 * component 路由容器
 * redirect 因为模块不直接写页面组件，所以要重定向到模块内的某个页面，一般是列表页
 * children 模块内所有的页面配置
 *
 * 页面路由,属性包括:
 * path 页面路径，注意不要以/开头,这样路径会自动拼上模块的根路径
 * name 使用大写的驼峰式命名，保证全局唯一，页面跳转时可以使用name跳转
 * component 页面文件
 * meta 这是一个对象可以写自定义属性，目前可以写title和fullscreen两个属性，title的值会自动设置为浏览器的标题，fullscreen为true时会隐藏顶部菜单栏并且宽度占满
 *
 * 路由定义可以参考下面的course模块
 * 注：最下面的demo路由是预留的本地演示或者测试用的路由
 */
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/home',
        component: EmptyLayout,
        children: [
          {
            path: '',
            name: 'Home',
            component: () => import(/* webpackChunkName: "page" */ '@/views/Home.vue'),
            meta: {
              title: '首页'
            }
          }
        ]
      },
      {
        path: '/course',
        redirect: '/course/list',
        component: EmptyLayout,
        children: [
          {
            path: 'list',
            name: 'CourseList',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/course/CourseList.vue'),
            meta: {
              title: '课程列表'
            }
          }
        ]
      },
      {
        path: '/pressList',
        component: EmptyLayout,
        children: [
          {
            path: '',
            name: 'pressList',
            component: () =>
              import(/* webpackChunkName: "page" */ '@/views/pressCenter/pressList.vue'),
            meta: {
              title: '新闻'
            }
          },
          {
            path: '/pressDetails',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'pressDetails',
                component: () =>
                  import(/* webpackChunkName: "page" */ '@/views/pressCenter/pressDetails.vue'),
                meta: {
                  title: '文章详情'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/personalInfo',
        component: EmptyLayout,
        children: [
          {
            path: '',
            name: 'personalInfo',
            component: () =>
              import(
                /* webpackChunkName: "page" */ '@/views/personalCenter/personal/components/personalInfo.vue'
              ),
            meta: {
              title: '个人信息'
            }
          },
          {
            path: '/changePassword',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'changePassword',
                component: () =>
                  import(
                    /* webpackChunkName: "page" */ '@/views/personalCenter/personal/components/changePassword.vue'
                  ),
                meta: {
                  title: '修改密码'
                }
              }
            ]
          },
          {
            path: '/certificate',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'certificate',
                component: () =>
                  import(
                    /* webpackChunkName: "page" */ '@/views/personalCenter/record/components/certificate.vue'
                  ),
                meta: {
                  title: '我的证书'
                }
              }
            ]
          },
          {
            path: '/course',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'course',
                component: () =>
                  import(
                    /* webpackChunkName: "page" */ '@/views/personalCenter/record/components/course.vue'
                  ),
                meta: {
                  title: '我的课程'
                }
              }
            ]
          },
          {
            path: '/credit',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'credit',
                component: () =>
                  import(
                    /* webpackChunkName: "page" */ '@/views/personalCenter/record/components/credit.vue'
                  ),
                meta: {
                  title: '我的学分'
                }
              }
            ]
          },
          {
            path: '/cultivate',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'cultivate',
                component: () =>
                  import(
                    /* webpackChunkName: "page" */ '@/views/personalCenter/record/components/cultivate.vue'
                  ),
                meta: {
                  title: '我的培训'
                }
              }
            ]
          },
          {
            path: '/examination',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'examination',
                component: () =>
                  import(
                    /* webpackChunkName: "page" */ '@/views/personalCenter/record/components/examination.vue'
                  ),
                meta: {
                  title: '我的考试'
                }
              }
            ]
          },
          {
            path: '/personal',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'personal',
                component: () =>
                  import(
                    /* webpackChunkName: "page" */ '@/views/personalCenter/personal/personal.vue'
                  ),
                meta: {
                  title: '个人信息'
                }
              }
            ]
          },

          {
            path: '/record',
            component: EmptyLayout,
            children: [
              {
                path: '',
                name: 'record',
                component: () =>
                  import(/* webpackChunkName: "page" */ '@/views/personalCenter/record/record.vue'),
                meta: {
                  title: '我的档案'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  ...(process.env.NODE_ENV === 'development' ? demoRoutes : [])
]
