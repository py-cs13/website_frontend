<template>
  <div class="home-view">
    <!-- 母婴主题装饰 -->
    <div class="theme-decoration">
      <div class="decoration-icon">👶</div>
      <div class="decoration-icon">🍼</div>
      <div class="decoration-icon">🎀</div>
    </div>
      <!-- 页面副标题 -->
      <p class="page-subtitle main-subtitle">专业的母婴知识分享，陪伴宝贝健康成长每一天</p>
      
      <!-- 内容分类标签 -->
      <div class="category-tabs-wrapper">
        <div class="category-tabs-simple">
          <!-- 全部按钮 -->
          <button 
            class="tab-btn-simple" 
            :class="{ active: activeCategory === 0 }"
            @click="filterContent(0)"
          >
            <span class="tab-icon">{{ getCategoryIcon('全部') }}</span>
            全部
          </button>
          <!-- 其他分类标签容器 -->
          <div class="category-tabs-container">
            <button 
              v-for="category in categories.filter(c => c.id !== 0 && (isExpanded || c.id <= 4))" 
              :key="category.id" 
              class="tab-btn-simple" 
              :class="{ active: activeCategory === category.id }"
              @click="filterContent(category.id)"
            >
              <span class="tab-icon">{{ getCategoryIcon(category.name) }}</span>
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
    
    <!-- 加载状态：骨架屏 -->
    <div v-if="loading && !hasCachedContent" class="skeleton-container">
      <!-- 文章骨架屏 -->
      <div v-if="activeType !== 'toolkit'" class="content-section">
        <div class="section-header skeleton">
          <div class="section-title skeleton-text"></div>
          <div class="view-all-link skeleton-text"></div>
        </div>
        <div class="content-list">
          <div v-for="i in 4" :key="'skeleton-article-' + i" class="content-card skeleton-card">
            <div class="card-header skeleton">
              <div class="card-category skeleton-text"></div>
              <div class="card-type skeleton-text"></div>
            </div>
            <div class="card-title skeleton-text"></div>
            <div class="card-summary skeleton-text"></div>
            <div class="card-meta skeleton">
              <div class="meta-item skeleton-text"></div>
              <div class="meta-item skeleton-text"></div>
              <div class="meta-item skeleton-text"></div>
            </div>
            <div class="card-actions skeleton">
              <div class="read-more-btn skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 工具包骨架屏 -->
      <div v-if="activeType !== 'article'" class="content-section">
        <div class="section-header skeleton">
          <div class="section-title skeleton-text"></div>
          <div class="view-all-link skeleton-text"></div>
        </div>
        <div class="content-list">
          <div v-for="i in 2" :key="'skeleton-toolkit-' + i" class="content-card content-card-toolkit skeleton-card">
            <div class="card-header skeleton">
              <div class="card-category skeleton-text"></div>
              <div class="card-type skeleton-text"></div>
            </div>
            <div class="toolkit-value-badge skeleton"></div>
            <div class="card-title skeleton-text"></div>
            <div class="card-summary skeleton-text"></div>
            <div class="card-meta skeleton">
              <div class="meta-item skeleton-text"></div>
              <div class="meta-item skeleton-text"></div>
              <div class="meta-item skeleton-text"></div>
              <div class="meta-item price skeleton-text"></div>
            </div>
            <div class="card-actions skeleton">
              <div class="read-more-btn skeleton-text"></div>
              <div class="buy-btn skeleton-text"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载状态：传统加载动画（作为备选） -->
    <div v-else-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>正在加载内容...</p>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div v-else-if="activeType === null || activeType === 'all' || activeType === 'article' || activeType === 'toolkit'">
      <!-- 文章区域 -->
      <div v-if="(activeType === 'article' || activeType === 'all' || activeType === null) && (!searchQuery || filteredArticles.length > 0)" class="content-section">
        <!-- 只在首页显示"最新文章"标题和"查看全部"链接，分类页面不显示 -->
        <div class="section-header" v-if="!$route.query.category">
          <h2 class="section-title">
            <span class="section-icon">📚</span>
            最新文章
          </h2>
          <router-link to="/?category=article" class="view-all-link">查看全部 →</router-link>
        </div>
        
        <div class="content-list">
          <!-- 生成文章卡片 -->
          <template v-for="(article, i) in displayedArticles" :key="'article-' + article.id">
            <!-- 实际文章卡片 -->
            <div 
              class="content-card"
            >
              <div class="card-header">
                <div class="card-category">
                  <span class="category-icon">{{ getCategoryIcon(article.category) }}</span>
                  {{ article.category }}
                </div>
                <div class="card-type">📚 文章</div>
              </div>
              
              <h3 class="card-title">
                <router-link :to="`/article/${article.id}`">
                  {{ article.title || '标题加载中...' }}
                </router-link>
              </h3>
              
              <p class="card-summary">{{ article.summary || '内容摘要加载中...' }}</p>
              
              <div class="card-meta">
                <span class="meta-item">
                  <i class="icon">📅</i> {{ formatDate(article.created_at || '2024-06-03') }}
                </span>
                <span class="meta-item">
                  <i class="icon">👁️‍🗨️</i> {{ formatNumber(article.view_count || 0) }}
                </span>
                <span class="meta-item">
                  <i class="icon">❤️</i> {{ formatNumber(article.likes || 0) }}
                </span>
              </div>
              
              <div class="card-actions">
                <router-link 
                  :to="`/article/${article.id}`" 
                  class="read-more-btn"
                >
                  阅读全文 →
                </router-link>
              </div>
            </div>
          </template>
        </div>
        
        <!-- 加载更多按钮（仅在分类页面显示） -->
        <div v-if="$route.query.category && displayedArticles.length < filteredArticles.length" class="load-more-container">
          <button @click="loadMoreArticles" class="load-more-btn">
            <span v-if="loadingMore" class="loading-spinner"></span>
            {{ loadingMore ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
      
      <!-- 工具包区域 -->
      <div v-if="(activeType === 'toolkit' || activeType === 'all' || activeType === null) && (!searchQuery || filteredToolkits.length > 0)" class="content-section">
        <!-- 只在首页显示"实用工具包"标题和"查看全部"链接，分类页面不显示 -->
        <div class="section-header" v-if="!$route.query.category">
          <h2 class="section-title">
            <span class="section-icon">🎁</span>
            实用工具包
          </h2>
          <router-link to="/?category=toolkit" class="view-all-link">查看全部 →</router-link>
        </div>
        
        <div class="content-list">
          <!-- 生成工具包卡片 -->
          <template v-for="(toolkit, i) in displayedToolkits" :key="'toolkit-' + toolkit.id">
            <!-- 实际工具包卡片 -->
            <div 
              class="content-card content-card-toolkit"
            >
              <div class="card-header">
                <div class="card-category">
                  <span class="category-icon">{{ getCategoryIcon(toolkit.category) }}</span>
                  {{ toolkit.category }}
                </div>
                <div class="card-type">可下载</div>
              </div>
              
              <!-- 工具包价值标签 -->
              <div class="toolkit-value-badge" title="包含可下载的实用工具和专业模板">
                <span class="badge-icon">💎</span>
                <span class="badge-text">实用工具</span>
              </div>

              <h3 class="card-title">
                <router-link :to="`/toolkit/${toolkit.id}`">
                  {{ toolkit.title || '标题加载中...' }}
                </router-link>
              </h3>
              
              <p class="card-summary">{{ toolkit.summary || '内容摘要加载中...' }}</p>
              
              <div class="card-meta">
                <span class="meta-item">
                  <i class="icon">📅</i> {{ formatDate(toolkit.created_at || '2024-06-03') }}
                </span>
                <span class="meta-item">
                  <i class="icon">👁️‍🗨️</i> {{ formatNumber(toolkit.view_count || 0) }}
                </span>
                <span class="meta-item">
                  <i class="icon">❤️</i> {{ formatNumber(toolkit.likes || 0) }}
                </span>
                <span class="meta-item price">
                  <i class="icon">💰</i> ¥{{ toolkit.price || 99.0 }}
                </span>
              </div>
              
              <div class="card-actions">
                <router-link 
                  :to="`/toolkit/${toolkit.id}`" 
                  class="read-more-btn"
                >
                  查看详情 →
                </router-link>
                <button class="buy-btn" @click="buyToolkit(toolkit)">立即购买</button>
              </div>
            </div>
          </template>
        </div>
        
        <!-- 加载更多按钮（仅在分类页面显示） -->
        <div v-if="$route.query.category && displayedToolkits.length < filteredToolkits.length" class="load-more-container">
          <button @click="loadMoreToolkits" class="load-more-btn">
            <span v-if="loadingMore" class="loading-spinner"></span>
            {{ loadingMore ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="filteredContent.length === 0" class="empty-state">
      <div class="empty-icon">
        {{ searchQuery ? '🔍' : '📚' }}
      </div>
      <h3>{{ searchQuery ? '未找到相关内容' : '暂无内容' }}</h3>
      <p>
        {{ searchQuery ? 
          `没有找到包含"${searchQuery}"的内容，换个关键词试试吧！` : 
          '该分类下暂时没有相关内容，换个分类试试吧！' 
        }}
      </p>
      <button v-if="searchQuery" class="reset-btn" @click="resetSearch">
        清除搜索
      </button>
    </div>
    

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContentStore, useAuthStore } from '../stores'
import { formatDate, formatNumber } from '../utils/formatters'

const contentStore = useContentStore()
const router = useRouter()
const route = useRoute()
const activeCategory = ref(0) // 0表示全部
const activeType = ref(null) // null表示全部，'article'表示文章，'toolkit'表示工具包
const loading = ref(false)
const isExpanded = ref(false) // 控制标签是否展开
const displayedArticleCount = ref(4) // 默认显示4篇文章
const displayedToolkitCount = ref(2) // 默认显示2个工具包
const loadStep = 4 // 每次加载数量
const loadingMore = ref(false) // 加载更多的加载状态
const searchQuery = ref('') // 搜索关键词

// 模拟分类数据
const categories = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '婴儿护理' },
  { id: 2, name: '育儿知识' },
  { id: 3, name: '营养辅食' },
  { id: 4, name: '产后恢复' },
  { id: 5, name: '亲子互动' },
  { id: 6, name: '成长发育' },
  { id: 7, name: '早期教育' },
  { id: 8, name: '健康养生' }
])

// 页面加载时获取内容
onMounted(async () => {
  await loadContent()
})

// 每次进入页面时重新获取内容
onActivated(async () => {
  await loadContent()
})

// 加载内容的函数
const lastLoadedTime = ref(0)
const REFRESH_INTERVAL = 5 * 60 * 1000 // 5分钟刷新一次

const loadContent = async () => {
  try {
    // 检查是否需要刷新数据（5分钟内不重复刷新）
    const now = Date.now()
    if (now - lastLoadedTime.value < REFRESH_INTERVAL && 
        contentStore.articles.length > 0 && 
        contentStore.toolkits.length > 0) {
      loading.value = false
      return
    }
    
    loading.value = true
    // 并行请求文章和工具包数据
    await Promise.all([
      contentStore.fetchLatestArticles(),
      contentStore.fetchLatestToolkits()
    ])
    
    // 记录最后加载时间
    lastLoadedTime.value = now
    
    // 检查URL参数
    if (route.query.category) {
      if (route.query.category === 'article' || route.query.category === 'toolkit') {
        activeType.value = route.query.category
      }
    }
    
    // 检查搜索参数
    if (route.query.search) {
      searchQuery.value = route.query.search
    }
  } catch (error) {
    console.error('Failed to load content:', error)
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化
watch(() => route.query.category, (newCategory) => {
  if (newCategory === 'article' || newCategory === 'toolkit') {
    activeType.value = newCategory
  } else {
    activeType.value = null
  }
})

// 监听搜索参数变化
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch || ''
})

// 获取分类对应的图标
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    '全部': '🏠',
    '婴儿护理': '👶',
    '育儿知识': '📚',
    '营养辅食': '🍼',
    '产后恢复': '🤰',
    '亲子互动': '👨‍👩‍👧',
    '成长发育': '🌱',
    '早期教育': '🎓',
    '健康养生': '💊'
  }
  return iconMap[categoryName] || '📖'
}

// 合并文章和工具包数据
const allContent = computed(() => {
  const articlesWithType = contentStore.articles.map(article => ({
    ...article,
    type: 'article',
    category: article.category || '母婴育儿'
  }))
  
  const toolkitsWithType = contentStore.toolkits.map(toolkit => ({
    ...toolkit,
    type: 'toolkit',
    category: toolkit.category || '育儿工具'
  }))
  
  return [...articlesWithType, ...toolkitsWithType]
})

// 筛选后的文章
const filteredArticles = computed(() => {
  // 如果activeType为toolkit，则不显示文章
  if (activeType.value === 'toolkit') {
    return []
  }
  
  let articles = contentStore.articles.map(article => ({
    ...article,
    type: 'article',
    category: article.category || '母婴育儿'
  }))
  
  // 按分类筛选
  if (activeCategory.value !== 0) {
    // 根据分类ID筛选内容
    const categoryMap = {
      1: ['婴儿护理'],
      2: ['育儿知识', '母婴育儿'],
      3: ['营养辅食'],
      4: ['产后恢复'],
      5: ['亲子互动'],
      6: ['成长发育'],
      7: ['早期教育'],
      8: ['健康养生']
    }
    
    const categoriesToShow = categoryMap[activeCategory.value] || []
    articles = articles.filter(item => categoriesToShow.includes(item.category))
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    articles = articles.filter(item => 
      item.title.toLowerCase().includes(query) || 
      (item.content && item.content.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    )
  }
  
  return articles
})

// 当前显示的文章
const displayedArticles = computed(() => {
  return filteredArticles.value.slice(0, displayedArticleCount.value)
})

// 加载更多文章
const loadMoreArticles = () => {
  loadingMore.value = true
  setTimeout(() => {
    displayedArticleCount.value += loadStep
    loadingMore.value = false
  }, 500)
}

// 筛选后的工具包
const filteredToolkits = computed(() => {
  // 如果activeType为article，则不显示工具包
  if (activeType.value === 'article') {
    return []
  }
  
  let toolkits = contentStore.toolkits.map(toolkit => ({
    ...toolkit,
    type: 'toolkit',
    category: toolkit.category || '育儿工具'
  }))
  
  // 按分类筛选
  if (activeCategory.value !== 0) {
    // 根据分类ID筛选内容
    const categoryMap = {
      1: ['婴儿护理'],
      2: ['育儿知识', '母婴育儿'],
      3: ['营养辅食'],
      4: ['产后恢复'],
      5: ['亲子互动'],
      6: ['成长发育'],
      7: ['早期教育'],
      8: ['健康养生']
    }
    
    const categoriesToShow = categoryMap[activeCategory.value] || []
    toolkits = toolkits.filter(item => categoriesToShow.includes(item.category))
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    toolkits = toolkits.filter(item => 
      item.title.toLowerCase().includes(query) || 
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.content && item.content.toLowerCase().includes(query))
    )
  }
  
  return toolkits
})

// 当前显示的工具包
const displayedToolkits = computed(() => {
  return filteredToolkits.value.slice(0, displayedToolkitCount.value)
})

// 加载更多工具包
const loadMoreToolkits = () => {
  loadingMore.value = true
  setTimeout(() => {
    displayedToolkitCount.value += loadStep
    loadingMore.value = false
  }, 500)
}

// 筛选后的所有内容（用于空状态判断）
const filteredContent = computed(() => {
  return [...filteredArticles.value, ...filteredToolkits.value]
})

// 是否有缓存内容（用于决定显示骨架屏还是直接显示内容）
const hasCachedContent = computed(() => {
  return contentStore.articles.length > 0 || contentStore.toolkits.length > 0
})

// 分类筛选
const filterContent = (categoryId) => {
  if (categoryId === 0) {
    // 点击全部按钮时，切换展开/收起状态
    isExpanded.value = !isExpanded.value
  }
  activeCategory.value = categoryId
}

// 重置搜索
const resetSearch = () => {
  searchQuery.value = ''
  // 如果URL中有搜索参数，清除它
  if (route.query.search) {
    router.replace({
      ...route,
      query: {
        ...route.query,
        search: undefined
      }
    })
  }
}



// 测试点击事件
const testClick = () => {
  console.log('测试点击事件触发了！')
  alert('测试点击事件触发了！')
}

// 测试路由跳转
const testRouter = () => {
  console.log('测试路由跳转...')
  router.push('/about')
}



// 购买工具包
const buyToolkit = async (item) => {
  try {
    console.log('=== 立即购买按钮点击事件开始 ===')
    console.log('点击的商品：', item)
    
    // 检查商品数据完整性
    if (!item || !item.id || !item.title) {
      console.error('商品数据不完整：', item)
      alert('商品数据不完整，请刷新页面后重试')
      return
    }
    
    // 直接跳转到支付页面，携带商品信息
    router.push({
      path: '/payment',
      query: {
        product_type: item.type,
        product_id: item.id,
        product_name: item.title,
        price: item.price || 99.0
      }
    })
    console.log('路由跳转命令已执行，跳转到支付页面')
  } catch (error) {
    console.error('=== 购买工具包时发生错误 ===')
    console.error('错误类型：', typeof error)
    console.error('错误消息：', error.message)
    console.error('错误堆栈：', error.stack)
    alert('购买失败：' + error.message)
  }
}
</script>

<style scoped>
.home-view {
  position: relative;
}

/* 确保页面内容居中显示 */
.home-view {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

/* 母婴主题装饰 */
.theme-decoration {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.decoration-icon {
  font-size: 32px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transform: rotate(-10deg);
}

.decoration-icon:nth-child(2) {
  font-size: 36px;
  transform: rotate(0deg);
  animation-delay: 0.5s;
}

.decoration-icon:nth-child(3) {
  font-size: 30px;
  transform: rotate(10deg);
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--primary-color);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.page-title::before,
.page-title::after {
  content: "🎀";
  font-size: 20px;
  color: var(--accent-color);
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 30px;
  text-align: center;
  background-color: var(--bg-primary);
  padding: 12px 20px;
  border-radius: 20px;
  display: inline-block;
  margin-left: auto;
}

.main-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 215, 0, 0.1));
  padding: 16px 30px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-light);
  margin-top: 20px;
  margin-right: auto;
  box-shadow: var(--shadow-light);
}

/* 分类标签 - 水平平铺解决方案 */
.category-tabs-wrapper {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px 0;
  box-sizing: border-box;
  position: relative;
  z-index: 100; /* 降低z-index，确保不覆盖导航栏 */
}

.category-tabs-simple {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  position: relative;
  z-index: 101; /* 降低z-index，确保不覆盖导航栏 */
  width: 100%;
  contain: content;
  max-width: 100%;
  align-items: flex-start; /* 防止子元素拉伸，解决全部按钮变大问题 */
}

/* 其他分类标签容器 */
.category-tabs-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tabs-simple::-webkit-scrollbar {
  display: none; /* Chrome/Safari隐藏滚动条 */
}

/* 标签按钮 - 最终修复版 */
.tab-btn-simple {
  flex-shrink: 0;
  padding: 12px 24px;
  border: 3px solid var(--border-color); /* 增加边框宽度，更明显 */
  background-color: var(--bg-primary);
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-light);
  min-width: fit-content;
  white-space: nowrap;
  position: relative;
  z-index: 10002; /* 与容器层级保持一致 */
  margin: 0;
  outline: none;
  box-sizing: border-box;
}



.tab-btn-simple:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: var(--shadow-medium);
  background-color: rgba(255, 255, 255, 0.95);
}

.tab-btn-simple.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-medium);
  background-color: var(--primary-color);
}

.tab-icon {
  font-size: 16px;
}

/* 内容区域头部 */
.content-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px; /* 增加底部间距，避免卡片悬停时遮挡 */
}

.view-all-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.view-all-link:hover {
  color: #FF4785;
  text-decoration: underline;
}

/* 内容列表 */
.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
}

.content-card {
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: 25px;
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
  border-left: 5px solid var(--primary-color);
  position: relative;
  overflow: hidden;
}

/* 工具包卡片特殊样式 */
.content-card-toolkit {
  border: 2px solid #FFD700;
  background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(255, 215, 0, 0.05) 100%);
}

.content-card-toolkit:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(255, 215, 0, 0.15);
}

.content-card::before {
  content: "👶";
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  opacity: 0.1;
  transform: rotate(15deg);
  pointer-events: none;
}

.content-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-large);
}

.content-card-toolkit {
  border: 2px solid #FFD700;
  background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(255, 215, 0, 0.05) 100%);
}

.content-card-toolkit:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(255, 215, 0, 0.15);
}

.content-card-toolkit::before {
  content: "🎁";
  font-size: 28px;
  position: absolute;
  top: 15px;
  left: 15px;
  opacity: 0.1;
  z-index: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-category {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--bg-secondary);
  padding: 4px 10px;
  border-radius: 12px;
}

.category-icon {
  font-size: 14px;
}

.card-type {
  font-size: 12px;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 工具包价值标签 */
.toolkit-value-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #FFD700;
  color: #8B4513;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 15px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1;
  position: relative;
}

.toolkit-value-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.badge-icon {
  font-size: 14px;
}

.badge-text {
  white-space: nowrap;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  line-height: 1.5;
  color: var(--text-primary);
}

.card-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.card-title a:hover {
  color: var(--primary-color);
}

.card-summary {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  background-color: var(--bg-secondary);
  padding: 12px;
  border-radius: 8px;
}

.card-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 12px;
  color: var(--text-light);
  
  .price {
    color: var(--accent-color);
    font-weight: 600;
    font-size: 14px;
  }

  background-color: var(--bg-secondary);
  padding: 10px;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.read-more-btn {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 12px;
  background-color: var(--bg-secondary);
}

.read-more-btn:hover {
  color: white;
  background-color: var(--primary-color);
  transform: translateX(5px);
}

.buy-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-medium);
}

.buy-btn:hover {
  background-color: #FFC107;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 占位卡片样式 */
.placeholder-card {
  opacity: 0.7;
  animation: pulse 1.5s infinite;
}

.placeholder-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  height: 16px;
  overflow: hidden;
  color: transparent;
  margin-bottom: 8px;
}

.placeholder-text.card-title {
  height: 24px;
  margin-bottom: 12px;
  width: 70%;
}

.placeholder-text.card-summary {
  height: 48px;
  width: 100%;
}

.placeholder-text.meta-item {
  height: 14px;
  width: 40%;
  display: inline-block;
  margin-right: 12px;
}

.placeholder-btn {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent;
  border: none;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 加载更多按钮 */
.load-more {
  text-align: center;
}



.load-more-btn {
  padding: 0.75rem 2rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.load-more-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .content-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-title::before,
  .page-title::after {
    font-size: 18px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .theme-decoration {
    gap: 20px;
  }
  
  .decoration-icon {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
    flex-direction: column;
    gap: 8px;
  }
  
  .page-title::before,
  .page-title::after {
    content: "";
  }
  
  .page-subtitle {
    font-size: 14px;
    padding: 10px 15px;
    font-weight: 500;
  }
  
  .category-tabs {
    gap: 8px;
  }
  
  .tab-btn {
    padding: 8px 16px;
    font-size: 13px;
    gap: 6px;
  }
  
  .content-list {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .card-actions {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .buy-btn {
    justify-content: center;
  }
  
  .theme-decoration {
    gap: 15px;
  }
  
  .decoration-icon {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }
  
  .page-subtitle {
    font-size: 13px;
  }
  
  .tab-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .card-summary {
    font-size: 13px;
  }
}

/* 骨架屏样式 */
.skeleton-container {
  padding: 20px 0;
}

.skeleton-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-color);
  overflow: hidden;
  animation: shimmer 1.5s infinite linear;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-text {
  background-color: #e0e0e0;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

/* 具体元素骨架屏样式 */
.section-header.skeleton .section-title {
  width: 150px;
  height: 24px;
  margin-bottom: 20px;
}

.section-header.skeleton .view-all-link {
  width: 80px;
  height: 16px;
}

.card-header.skeleton {
  margin-bottom: 16px;
}

.card-category.skeleton-text {
  width: 100px;
  height: 16px;
  margin-bottom: 8px;
}

.card-type.skeleton-text {
  width: 60px;
  height: 14px;
}

.card-title.skeleton-text {
  width: 100%;
  height: 20px;
  margin-bottom: 12px;
}

.card-summary.skeleton-text {
  width: 100%;
  height: 48px;
  margin-bottom: 16px;
}

.card-meta.skeleton {
  margin-bottom: 16px;
  gap: 16px;
}

.meta-item.skeleton-text {
  width: 60px;
  height: 14px;
}

.meta-item.price.skeleton-text {
  width: 80px;
}

.card-actions.skeleton {
  gap: 12px;
}

.read-more-btn.skeleton-text {
  width: 120px;
  height: 36px;
}

.buy-btn.skeleton-text {
  width: 100px;
  height: 36px;
}

.toolkit-value-badge.skeleton {
  width: 80px;
  height: 24px;
  margin-bottom: 12px;
  background-color: #e0e0e0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-secondary);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 加载更多按钮样式 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 40px;
}

.load-more-btn {
  padding: 12px 36px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-medium);
  display: flex;
  align-items: center;
  gap: 10px;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #FF4785;
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

.load-more-btn:disabled {
  background-color: var(--bg-secondary);
  color: var(--text-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
  background-color: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  margin-bottom: 30px;
}

.reset-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #FF4785;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.2;
}

.empty-state h3 {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 600;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 400px;
}
</style>