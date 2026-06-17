import { createRouter, createWebHashHistory } from 'vue-router'
import h5 from './h5'

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    //首页
    {
      path: '/home',
      meta: {
        title: '首页',
        keepAlive: true
      },
      component: () => import('@/layout/home.vue'),
      // meta:{show:true},
      redirect: '/',
      children: [
        {
          path: '',
          component: () => import('@/views/home/index.vue')
        },
      ]
    },
    //留言
    {
      path: '/note',
      meta: {
        title: '留言',
        keepAlive: true
      },
      component: () => import('@/layout/home.vue'),
      // meta:{show:true},
      redirect: '/',
      children: [
        {
          path: '',
          component: () => import('@/views/note/index.vue')
        },
      ]
    },
    //论坛
    {
      path: '/chat',
      meta: {
        title: '论坛',
        keepAlive: true
      },
      component: () => import('@/layout/home.vue'),
      // meta:{show:true},
      redirect: '/',
      children: [
        {
          path: '',
          component: () => import('@/views/chat/index.vue')
        },
      ]
    },
    //资源
    {
      path: '/resources',
      meta: {
        title: '资源',
        keepAlive: true
      },
      component: () => import('@/layout/home.vue'),
      // meta:{show:true},
      redirect: '/',
      children: [
        {
          path: '',
          component: () => import('@/views/resources/index.vue')
        },
      ]
    },
    //摄影
    {
      path: '/picture',
      meta: {
        title: '摄影',
        keepAlive: true
      },
      component: () => import('@/layout/home.vue'),
      // meta:{show:true},
      redirect: '/',
      children: [
        {
          path: '',
          component: () => import('@/views/picture/index.vue')
        },
      ]
    },
    
    //书单
    {
      path: '/book',
      meta: {
        title: '书单',
        keepAlive: true
      },
      component: () => import('@/layout/home.vue'),
      // meta:{show:true},
      redirect: '/',
      children: [
        {
          path: '',
          component: () => import('@/views/book/index.vue')
        },
      ]
    },
        //主页
    {
      path: '/my',
      meta: {
        title: '主页',
        keepAlive: true
      },
      component: () => import('@/layout/home.vue'),
      // meta:{show:true},
      redirect: '/',
      children: [
        {
          path: '',
          component: () => import('@/views/my/index.vue')
        },
      ]
    },
    ...h5
  ],
})

// h5 页面路径列表
const h5Paths = h5.map(route => route.path)

// 移动端跳转到面经页面，非移动端跳转到首页
router.beforeEach((to, _from) => {
  const isH5 = to.matched.some(record => h5Paths.includes(record.path))
  
  if (isMobileDevice()) {
    // 移动端且不是 H5 页面，重定向到 H5 面经页
    if (!isH5) return '/mianJingh5'
    // 否则放行（也可以不写 return，默认放行）
  } else {
    // 非移动端且是 H5 页面，重定向到首页
    if (isH5) return '/home'
  }
  
  // 默认放行
  return true 
})

export default router
