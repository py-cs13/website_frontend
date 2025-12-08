import { defineStore } from 'pinia'
import axios from 'axios'

// 内容管理store
export const useContentStore = defineStore('content', {
  state: () => ({
    articles: [],
    toolkits: [],
    todayFeature: null,
    loading: false,
    error: null
  }),
  
  actions: {
    // 获取今日推荐内容
    async fetchTodayFeature() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/content/today-feature')
        this.todayFeature = response.data
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch today feature:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取最新文章
    async fetchLatestArticles() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/articles/latest')
        this.articles = response.data
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch latest articles:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取最新工具包
    async fetchLatestToolkits() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/toolkits/latest')
        this.toolkits = response.data
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch latest toolkits:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取文章详情
    async fetchArticleDetail(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/api/articles/${id}`)
        return response.data
      } catch (error) {
        this.error = error.message
        console.error(`Failed to fetch article detail ${id}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 获取工具包详情
    async fetchToolkitDetail(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/api/toolkits/${id}`)
        return response.data
      } catch (error) {
        this.error = error.message
        console.error(`Failed to fetch toolkit detail ${id}:`, error)
        return null
      } finally {
        this.loading = false
      }
    }
  }
})

// 用户管理store
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    // 登录
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/auth/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        // 存储token到本地
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        this.error = error.message
        console.error('Login failed:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 注册
    async register(username, email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/auth/register', { username, email, password })
        this.token = response.data.token
        this.user = response.data.user
        // 存储token到本地
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        this.error = error.message
        console.error('Registration failed:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 登出
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    // 从本地存储加载用户信息
    loadUserFromStorage() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    },
    
    // 立即购买功能
    async buyNow(toolkitId, amount = 99.0) {
      this.loading = true
      this.error = null
      try {
        // 添加Authorization头
        const headers = {
          'Authorization': `Bearer ${this.token}`
        }
        
        // 构建订单数据
        const orderData = {
          product_type: 'toolkit',
          product_id: toolkitId,
          amount: amount,
          items: [{
            product_name: `工具包 #${toolkitId}`,
            product_price: amount,
            quantity: 1,
            total_amount: amount
          }]
        }
        
        // 发送请求
        const response = await axios.post('/api/orders', orderData, { headers })
        console.log('购买成功:', response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('购买失败:', error)
        return null
      } finally {
        this.loading = false
      }
    }
  }
})