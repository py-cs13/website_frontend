import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/index.js'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: () => import('../views/ArticleDetailView.vue')
  },
  {
    path: '/toolkit/:id',
    name: 'toolkit-detail',
    component: () => import('../views/ToolkitDetailView.vue')
  },
  {
    path: '/user',
    name: 'user-center',
    component: () => import('../views/UserCenterView.vue')
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('../views/PaymentView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/affiliate',
    name: 'affiliate',
    component: () => import('../views/AffiliateView.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫：在每次路由切换时重置错误信息
router.beforeEach((to, from, next) => {
  // 重置错误信息
  const userStore = useUserStore()
  userStore.error = ''
  next()
})

export default router