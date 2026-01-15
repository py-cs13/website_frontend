import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../utils/api'
import { getArticles, getAdminArticles, createArticle, updateArticle, deleteArticle, batchDeleteArticles } from '../utils/api'

// 内容管理store
export const useContentStore = defineStore('content', {
  state: () => ({
    articles: [],
    todayFeature: null,
    loading: false,
    error: null,
    // 管理后台相关状态
    adminArticles: [],
    totalArticles: 0,
    currentPage: 1,
    pageSize: 10,
    filter: {
      search: '',
      category: '',
      status: ''
    }
  }),
  
  actions: {
    // 获取缓存数据
    getCachedData(key) {
      const cached = localStorage.getItem(key)
      if (cached) {
        try {
          const data = JSON.parse(cached)
          // 检查缓存是否过期（1小时）
          if (Date.now() - data.timestamp < 3600000) {
            return data.content
          }
        } catch (e) {
          console.error('Error parsing cached data:', e)
        }
      }
      return null
    },
    
    // 设置缓存数据
    setCachedData(key, content) {
      try {
        localStorage.setItem(key, JSON.stringify({
          content,
          timestamp: Date.now()
        }))
      } catch (e) {
        console.error('Error setting cached data:', e)
      }
    },
    
    // 清除缓存数据
    clearCachedData(key) {
      localStorage.removeItem(key)
    },
    
    // 获取今日推荐内容
    async fetchTodayFeature() {
      this.loading = true
      this.error = null
      try {
        // 今日推荐不缓存，每次都从API获取
        const response = await apiClient.get('/content/today-feature')
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
        // 清除旧缓存，确保获取最新点赞数
        this.clearCachedData('latest_articles')
        
        // 直接从API获取最新文章，不使用缓存
        const response = await apiClient.get('/articles')
        // 处理不同的数据格式
        let data = response.data
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data
        } else if (response.data && Array.isArray(response.data)) {
          data = response.data
        }
        console.log('API返回的文章数量:', data.length)
        this.articles = data
        // 更新缓存
        this.setCachedData('latest_articles', this.articles)
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch latest articles from API:', error)
        
        // API请求失败时，尝试从缓存获取
        const cachedArticles = this.getCachedData('latest_articles')
        if (cachedArticles) {
          console.log('使用缓存的文章数据')
          this.articles = cachedArticles
        } else {
          // 如果缓存也没有数据，使用模拟数据
          console.log('API请求失败，使用模拟文章数据')
          this.articles = [
            {
              "id": 188,
              "title": "👶宝宝肠胃敏感怎么办？肠道健康守护指南💪",
              "category": "母婴育儿",
              "summary": "本文分享了宝宝肠胃敏感的原因、症状和护理方法，包括饮食调理、日常护理和就医建议，帮助新手父母守护宝宝的肠道健康。",
              "content": "<div><p>作为一位有经验的宝妈，我深刻体会到宝宝肠胃敏感带来的困扰...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 123,
              "likes": 45,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 189,
              "title": "👶婴儿抚触按摩全攻略｜促进发育增进亲子关系的温柔时光💕",
              "category": "育儿知识",
              "summary": "详细介绍婴儿抚触按摩的步骤、技巧和注意事项，帮助新手父母通过抚触按摩促进宝宝的身体发育和亲子关系建立。",
              "content": "<div><p>婴儿抚触按摩是一种简单而有效的亲子互动方式...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 89,
              "likes": 23,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 190,
              "title": "🍎孕期补铁全攻略｜告别贫血让孕期更健康💪",
              "category": "营养辅食",
              "summary": "分享孕期补铁的重要性、食物来源和补充方法，帮助准妈妈们预防和改善孕期贫血，保障母婴健康。",
              "content": "<div><p>孕期贫血是很多准妈妈都会遇到的问题...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 156,
              "likes": 67,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 191,
              "title": "💤产后失眠怎么办？新手妈妈睡眠修复全攻略🌙",
              "category": "产后恢复",
              "summary": "针对产后妈妈的睡眠问题，提供实用的睡眠修复方法和建议，帮助新手妈妈改善睡眠质量，促进身体恢复。",
              "content": "<div><p>产后失眠是很多新手妈妈都会面临的问题...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 234,
              "likes": 89,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 192,
              "title": "🤝培养宝宝社交能力｜从小培养人际交往的温柔引导🌈",
              "category": "亲子互动",
              "summary": "分享培养宝宝社交能力的方法和技巧，包括如何引导宝宝与人交往、建立良好的人际关系，帮助宝宝健康成长。",
              "content": "<div><p>宝宝的社交能力培养是成长过程中的重要一环...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 98,
              "likes": 34,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 193,
              "title": "🦷婴儿口腔护理大揭秘｜从出生开始的牙齿保护计划✨",
              "category": "成长发育",
              "summary": "详细介绍婴儿口腔护理的方法和注意事项，从出生开始保护宝宝的牙齿健康，预防口腔问题。",
              "content": "<div><p>很多新手父母可能不知道，宝宝的口腔护理应该从出生就开始...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 167,
              "likes": 56,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 194,
              "title": "🌟幼儿语言发展黄金期｜从咿呀学语到流利表达的实用指南💬",
              "category": "早期教育",
              "summary": "分享幼儿语言发展的关键时期和促进方法，帮助父母抓住语言发展黄金期，促进宝宝的语言能力提升。",
              "content": "<div><p>0-3岁是宝宝语言发展的黄金时期...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 210,
              "likes": 78,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 195,
              "title": "🧴宝宝皮肤护理全攻略｜呵护娇嫩肌肤远离湿疹困扰👶",
              "category": "健康养生",
              "summary": "详细介绍宝宝皮肤护理的方法和注意事项，帮助父母呵护宝宝的娇嫩肌肤，预防和改善湿疹等皮肤问题。",
              "content": "<div><p>宝宝的皮肤娇嫩敏感，需要特别的护理...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 189,
              "likes": 67,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 196,
              "title": "🤰孕期水肿难受？这些缓解方法让你孕期更舒适✨",
              "category": "营养辅食",
              "summary": "分享孕期水肿的原因和缓解方法，帮助准妈妈们减轻水肿不适，享受更舒适的孕期生活。",
              "content": "<div><p>孕期水肿是很多准妈妈都会遇到的问题...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 145,
              "likes": 56,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            },
            {
              "id": 197,
              "title": "⚖️产后体重管理秘籍｜健康恢复拒绝身材焦虑🌸",
              "category": "产后恢复",
              "summary": "分享产后体重管理的方法和技巧，帮助新手妈妈科学减重，健康恢复身材，拒绝身材焦虑。",
              "content": "<div><p>产后身材恢复是很多新手妈妈关心的问题...",
              "author_id": 1,
              "is_published": true,
              "published_at": "2026-01-13T17:26:13",
              "view_count": 267,
              "likes": 98,
              "created_at": "2026-01-13T17:26:13",
              "updated_at": "2026-01-13T17:26:13"
            }
          ]
          // 将模拟数据保存到缓存，以便后续使用
          this.setCachedData('latest_articles', this.articles)
        }
      } finally {
        this.loading = false
      }
    },
    
    // 管理后台 - 获取文章列表
    async fetchAdminArticles() {
      this.loading = true
      this.error = null
      try {
        const params = {
          page: this.currentPage,
          page_size: this.pageSize,
          ...this.filter
        }
        const response = await getAdminArticles(params)
        this.adminArticles = response.data.data
        this.totalArticles = response.data.total
      } catch (error) {
        this.error = error.response?.data?.message || '获取文章列表失败'
        console.error('Failed to fetch admin articles:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 管理后台 - 创建文章
    async createArticle(articleData) {
      this.loading = true
      this.error = null
      try {
        const response = await createArticle(articleData)
        // 重新获取文章列表以更新数据
        await this.fetchAdminArticles()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '创建文章失败'
        console.error('Failed to create article:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 管理后台 - 更新文章
    async updateArticle(id, articleData) {
      this.loading = true
      this.error = null
      try {
        const response = await updateArticle(id, articleData)
        // 重新获取文章列表以更新数据
        await this.fetchAdminArticles()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '更新文章失败'
        console.error(`Failed to update article ${id}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 管理后台 - 删除文章
    async deleteArticle(id) {
      this.loading = true
      this.error = null
      try {
        const response = await deleteArticle(id)
        // 重新获取文章列表以更新数据
        await this.fetchAdminArticles()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '删除文章失败'
        console.error(`Failed to delete article ${id}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 管理后台 - 批量删除文章
    async batchDeleteArticles(ids) {
      this.loading = true
      this.error = null
      try {
        const response = await batchDeleteArticles(ids)
        // 重新获取文章列表以更新数据
        await this.fetchAdminArticles()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '批量删除文章失败'
        console.error('Failed to batch delete articles:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 管理后台 - 设置筛选条件
    setFilter(filter) {
      this.filter = { ...this.filter, ...filter }
      // 筛选条件变化时重置页码
      this.currentPage = 1
    },
    
    // 管理后台 - 设置当前页码
    setCurrentPage(page) {
      this.currentPage = page
    },
    
    // 管理后台 - 设置每页显示数量
    setPageSize(size) {
      this.pageSize = size
      // 每页数量变化时重置页码
      this.currentPage = 1
    },
    
    // 管理后台 - 重置筛选条件
    resetFilter() {
      this.filter = {
        search: '',
        category: '',
        status: ''
      }
      this.currentPage = 1
    },
    
    // 获取文章详情
    async fetchArticleDetail(id) {
      this.loading = true
      this.error = null
      try {
        // 从API获取文章详情（baseURL已包含/api）
        // 确保id是字符串类型
        const stringId = id.toString()
        const response = await apiClient.get(`/content/${stringId}`)
        const articleData = response.data
        
        // 更新缓存
        this.setCachedData(`article_${id}`, articleData)
        
        // 更新articles列表中对应的数据
        this.updateArticleInList(articleData)
        
        return articleData
      } catch (error) {
        this.error = error.message
        console.error(`Failed to fetch article detail (ID: ${id}):`, error)
        
        // 如果API请求失败，尝试从缓存获取
        const cachedArticle = this.getCachedData(`article_${id}`)
        if (cachedArticle) {
          // 如果缓存存在，同时更新articles列表中对应的数据
          this.updateArticleInList(cachedArticle)
          return cachedArticle
        }
        
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 更新articles列表中对应的数据
    updateArticleInList(articleData) {
      const index = this.articles.findIndex(article => article.id === articleData.id)
      if (index !== -1) {
        // 更新列表中的文章数据
        this.articles[index] = { ...this.articles[index], ...articleData }
      }
    },
    
    // 刷新所有内容数据
    async refreshContent() {
      try {
        // 请求文章数据
        await this.fetchLatestArticles()
      } catch (error) {
        console.error('Failed to refresh content:', error)
      }
    }
  }
})
