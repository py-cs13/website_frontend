import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
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
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router