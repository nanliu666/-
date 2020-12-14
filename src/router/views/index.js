import demoRoutes from './demo'
export default [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "page" */ '@/views/Home.vue')
  },
  ...(process.env.NODE_ENV === 'development' ? demoRoutes : [])
]
