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
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
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
      this.error = ''
      try {
        const response = await axios.post('/api/auth/login', { email, password })
        this.token = response.data.access_token
        // 登录成功后获取用户信息
        const userResponse = await axios.get('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        this.user = userResponse.data
        // 存储token到本地
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请检查邮箱和密码'
        console.error('Login failed:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 注册
    async register(username, email, password) {
      this.loading = true
      this.error = ''
      try {
        const response = await axios.post('/api/auth/register', { username, email, password })
        // 注册成功后自动登录
        return await this.login(email, password)
      } catch (error) {
        // 优先使用详细错误信息，如果没有则使用默认消息
        this.error = error.response?.data?.details || error.response?.data?.message || '注册失败，请检查输入信息'
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
    },
    
    // 初始化认证状态
    initAuth() {
      // 从localStorage加载认证信息
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (savedToken) {
        this.token = savedToken
      }
      
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser)
        } catch (e) {
          console.error('解析用户信息失败:', e)
          localStorage.removeItem('user')
        }
      }
    },
    
    // 确保认证信息不被清除
    ensureAuth() {
      // 检查当前状态
      const currentToken = this.token || localStorage.getItem('token')
      const currentUser = this.user || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
      
      // 如果内存中的信息丢失但localStorage中还有，恢复它
      if (currentToken && !this.token) {
        this.token = currentToken
        localStorage.setItem('token', currentToken)
      }
      
      if (currentUser && !this.user) {
        this.user = currentUser
        localStorage.setItem('user', JSON.stringify(currentUser))
      }
    },
    
    async updateUser(userData) {
      this.loading = true
      this.error = ''
      
      try {
        console.log('发送的用户数据:', userData)
        
        // 更新前确保认证信息存在
        this.ensureAuth()
        
        // 如果没有token，不执行更新
        if (!this.token) {
          throw new Error('未找到认证信息，无法更新用户数据')
        }
        
        const response = await axios.put('/api/users/me', userData, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        
        console.log('响应数据:', response.data)
        
        // 替换整个user对象，只保留后端返回的字段
        this.user = response.data
        
        // 更新localStorage中的user信息，确保刷新页面后数据同步
        localStorage.setItem('user', JSON.stringify(this.user))
        // 确保token仍然被保存
        localStorage.setItem('token', this.token)
        
        console.log('用户信息更新成功:', this.user)
        return true
      } catch (error) {
        console.log('错误响应:', error.response?.data)
        this.error = error.response?.data?.details || error.response?.data?.message || '更新用户信息失败'
        console.error('更新用户信息失败:', error)
        
        // 更新失败时确保认证信息不丢失
        this.ensureAuth()
        
        return false
      } finally {
        this.loading = false
      }
    }
  }
})