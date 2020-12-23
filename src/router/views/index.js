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
 * title 给面包屑用的首级title
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
        title: '课程',
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
        path: '/knowledge',
        redirect: '/knowledge/list',
        component: EmptyLayout,
        title: '知识库',
        children: [
          {
            name: 'KnowledgeList',
            path: '/knowledge/list',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/knowledge/List.vue'),
            meta: {
              title: '知识库'
            }
          },
          {
            path: '/knowledge/detail',
            name: 'KnowledgeDetail',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/knowledge/Detail.vue'),
            meta: {
              title: '知识详情'
            }
          }
        ]
      },
      {
        path: '/learn',
        redirect: '/learn/list',
        component: EmptyLayout,
        title: '学习',
        children: [
          {
            path: 'list',
            name: 'LearnList',
            component: () => import(/* webpackChunkName: "page"*/ '@/views/learn/List.vue'),
            meta: {
              title: '学习列表'
            }
          }
        ]
      },
      {
        path: '/news',
        redirect: '/news/list',
        component: EmptyLayout,
        title: '新闻',
        children: [
          {
            path: 'list',
            name: 'list',
            component: () => import(/* webpackChunkName: "page" */ '@/views/news/news.vue'),
            meta: {
              title: '新闻'
            }
          },
          {
            path: 'Details',
            name: 'newsDetails',
            component: () => import(/* webpackChunkName: "page" */ '@/views/news/newsDetails.vue'),
            meta: {
              title: '文章详情'
            }
          }
        ]
      },
      {
        path: '/my',
        redirect: '/my/info',
        component: EmptyLayout,
        title: '个人中心',
        children: [
          {
            path: 'info',
            name: 'personal',
            component: () => import(/* webpackChunkName: "page" */ '@/views/my/personal.vue'),
            meta: {
              title: '个人信息'
            }
          },
          {
            path: 'record',
            name: 'record',
            component: () => import(/* webpackChunkName: "page" */ '@/views/my/record.vue'),
            meta: {
              title: '我的档案'
            }
          }
        ]
      },
      {
        path: '/message',
        redirect: '/message/messageCenter',
        component: EmptyLayout,
        title: '消息列表',
        children: [
          {
            name: 'MessageCenter',
            path: '/message/messageCenter',
            component: () =>
              import(/* webpackChunkName: "page"*/ '@/views/message/messageCenter.vue'),
            meta: {
              title: '消息列表'
            }
          }
        ]
      },
      ...(process.env.NODE_ENV === 'development' ? demoRoutes : [])
    ]
  }
]
