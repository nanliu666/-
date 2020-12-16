import demoRoutes from './demo'
import Layout from '@/page/Layout'
export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/home',
        component: () => import(/* webpackChunkName: "page" */ '@/views/Home.vue')
      },
      {
        path: '/full',
        component: () => import(/* webpackChunkName: "page"*/ '@/views/Home.vue'),
        meta: {
          fullscreen: true
        }
      }
    ]
  },
  ...(process.env.NODE_ENV === 'development' ? demoRoutes : [])
]
