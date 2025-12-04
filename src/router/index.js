import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { isLoggedIn, getAccessToken } from '@/utils/auth'
import MainLayout from '@/layout/MainLayout.vue'

import SettingRouter from './modules/setting'
import ContactRouter from './modules/contact'
import AuthRouter from './modules/auth'
import SortRouter from './modules/sort.js'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: { auth: true },
    component: MainLayout,
    redirect: '/message',
    children: [
      {
        path: '/message',
        name: 'message',
        meta: { auth: true },
        component: () => import('@/views/message/index.vue')
      },
      {
        path: '/note',
        name: 'note',
        meta: { auth: true },
        component: () => import('@/views/note/index.vue')
      },
      {
        path: '/example',
        name: 'example',
        component: () => import('@/views/example/index.vue')
      },
      SettingRouter,
      ContactRouter,
      SortRouter
    ]
  },
  AuthRouter,
  {
    path: '/:pathMatch(.*)*',
    name: '404 NotFound',
    component: () => import('@/views/other/not-found.vue')
  }
]

const getHistoryMode = () => {
  return import.meta.env.VITE_ROUTER_MODE == 'hash' ? createWebHashHistory() : createWebHistory()
}

const router = createRouter({
  history: getHistoryMode(),
  routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 设置中间件，权限验证
router.beforeEach((to, from, next) => {
  console.log('路由守卫检查:', to.path, '需要验证:', to.meta?.auth, '当前登录状态:', isLoggedIn());
  
  // 如果目标路由需要认证且用户未登录
  if (to.meta?.auth && !isLoggedIn()) {
    console.log('用户未登录，重定向到登录页');
    
    // 如果从登录页跳转过来，且token刚刚更新，可能是正在处理登录
    // 这种情况下避免路由循环
    if (from.path.includes('/auth/login') && getAccessToken()) {
      console.log('检测到可能的登录流程，token存在但状态可能未更新，允许访问');
      next();
      return;
    }
    
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
})

export default router
