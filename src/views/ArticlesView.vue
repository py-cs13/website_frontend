<template>
  <div class="articles-view">

    <!-- 分类标签 -->
    <div class="category-tabs-wrapper">
      <div class="category-tabs-simple">
        <!-- "全部"按钮 -->
        <button
          class="tab-btn-simple"
          :class="{ active: activeCategory === 'all' }"
          @click="toggleAllCategories"
        >
          全部
        </button>

        <!-- 其他分类标签 -->
        <div class="category-tabs-container">
          <button
            v-for="category in categories"
            :key="category.id"
            class="tab-btn-simple"
            :class="{ active: activeCategory === category.id }"
            @click="setActiveCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 主内容区 -->
      <div class="content-view">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载文章...</p>
        </div>

        <!-- 文章列表 -->
        <div v-else class="content-list">
          <div
            v-for="(article, index) in displayedArticles"
            :key="article.id || index"
            class="content-card"
          >
            <!-- 文章标题 -->
            <h3 class="content-title">{{ article.title }}</h3>

            <!-- 文章描述 -->
            <p class="content-description">{{ article.content.substring(0, 100) }}...</p>

            <!-- 文章元信息 -->
            <div class="content-meta">
              <span class="meta-item author">{{ article.author || '未知作者' }}</span>
              <span class="meta-item date">{{ article.created_at ? formatDate(article.created_at) : '未知时间' }}</span>
            </div>

            <!-- 阅读全文按钮 -->
            <button
              class="read-more-btn"
              @click="navigateToArticle(article.id, article.title)"
            >
              阅读全文
            </button>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div class="load-more-container">
          <button
            id="load-more-button"
            class="load-more-btn"
            :disabled="loadingMore || !hasMoreArticles"
            @click="handleLoadMore"
            style="cursor: pointer;"
          >
            {{ loadingMore ? '加载中...' : '加载更多' }}
            <span v-if="!loadingMore">({{ displayedArticles.length }} / {{ filteredArticles.length }})</span>
          </button>
        </div>

        <!-- 没有更多文章提示 -->
        <div v-if="!loading && !hasMoreArticles && displayedArticles.length > 0" class="no-more-container">
          <p>没有更多文章了</p>
        </div>

        <!-- 没有文章提示 -->
        <div v-if="!loading && filteredArticles.length === 0" class="no-articles-container">
          <p>暂时没有相关文章</p>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>热门标签</h3>
          <div class="tag-cloud">
            <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>最新文章</h3>
          <div class="recent-articles">
            <div v-for="(article, index) in recentArticles" :key="article.id || index" class="recent-article-item">
              <h4>{{ article.title }}</h4>
              <p>{{ article.created_at ? formatDate(article.created_at) : '未知时间' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { formatDate } from '@/utils/formatters.js'

export default {
  name: 'ArticlesView',
  setup() {
    const router = useRouter()

    // 状态管理
    const articles = ref([])
    const loading = ref(false)
    const loadingMore = ref(false)
    const activeCategory = ref('all')
    const isExpanded = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(6)
    const loadStep = ref(4)

    // 分类和标签数据
    const categories = ref([
      { id: 1, name: '母乳喂养' },
      { id: 2, name: '育儿知识' },
      { id: 3, name: '营养膳食' },
      { id: 4, name: '产后恢复' },
      { id: 5, name: '早教启蒙' },
      { id: 6, name: '健康护理' },
      { id: 7, name: '安全防护' },
      { id: 8, name: '心理发展' },
    ])

    const tags = ref([
      '新生儿护理', '辅食添加', '睡眠指导', '亲子互动',
      '生长发育', '疾病预防', '儿童营养', '育儿经验'
    ])

    // 计算属性
    const filteredArticles = computed(() => {
      if (!articles.value || !Array.isArray(articles.value)) {
        return []
      }
      if (activeCategory.value === 'all') {
        return articles.value
      }
      return articles.value.filter(article => article.category_id === activeCategory.value)
    })

    const displayedArticles = computed(() => {
      if (!filteredArticles.value || !Array.isArray(filteredArticles.value)) {
        return []
      }
      return filteredArticles.value.slice(0, currentPage.value * itemsPerPage.value)
    })

    const hasMoreArticles = computed(() => {
      if (!displayedArticles.value || !Array.isArray(displayedArticles.value) ||
          !filteredArticles.value || !Array.isArray(filteredArticles.value)) {
        return false
      }
      return displayedArticles.value.length < filteredArticles.value.length
    })

    const recentArticles = computed(() => {
      return articles.value && Array.isArray(articles.value) ? articles.value.slice(0, 5) : []
    })

    // 方法
    // 设置当前分类
    const setActiveCategory = (categoryId) => {
      console.log('设置当前分类:', categoryId)
      activeCategory.value = categoryId
      currentPage.value = 1 // 切换分类时重置页码
    }

    // 切换展开/收起所有分类
    const toggleAllCategories = () => {
      console.log('切换全部分类显示')
      isExpanded.value = !isExpanded.value
      if (activeCategory.value !== 'all') {
        activeCategory.value = 'all'
        currentPage.value = 1 // 切换到全部时重置页码
      }
    }

    // 导航到文章详情页
    const navigateToArticle = (articleId, articleTitle) => {
      console.log('导航到文章:', articleId, articleTitle)
      router.push({
        path: `/article/${articleId}`,
        query: { title: articleTitle }
      })
    }

    // 加载更多文章
    const handleLoadMore = () => {
      console.log('加载更多按钮被点击')
      console.log('当前页面:', currentPage.value)
      console.log('每页显示:', itemsPerPage.value)
      console.log('显示的文章数:', displayedArticles.value.length)
      console.log('过滤后的文章数:', filteredArticles.value.length)
      console.log('是否有更多:', hasMoreArticles.value)
      console.log('是否正在加载:', loadingMore.value)

      if (loadingMore.value || !hasMoreArticles.value) {
        console.log('不执行加载操作')
        return
      }

      loadingMore.value = true

      // 模拟网络延迟
      setTimeout(() => {
        console.log('增加页码以加载更多文章')
        currentPage.value += 1
        loadingMore.value = false
        console.log('加载完成，新的当前页码:', currentPage.value)
        console.log('现在显示的文章数:', displayedArticles.value.length)
      }, 500)
    }

    // 获取文章列表
    const fetchArticles = async () => {
      console.log('开始获取文章列表')
      loading.value = true

      try {
        const response = await axios.get('http://localhost:8000/api/articles')
        console.log('API响应状态:', response.status)
        console.log('API响应数据:', response.data)

        // 确保articles.value始终是一个数组
        articles.value = Array.isArray(response.data) 
          ? response.data 
          : Array.isArray(response.data.data)
            ? response.data.data
            : Array.isArray(response.data.message)
              ? response.data.message
              : []
        console.log('获取到的文章数量:', articles.value.length)
      } catch (error) {
        console.error('获取文章失败:', error)
        articles.value = []
      } finally {
        loading.value = false
        console.log('加载完成')
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      console.log('组件挂载完成')
      fetchArticles()
    })

    return {
      articles,
      loading,
      loadingMore,
      activeCategory,
      isExpanded,
      categories,
      tags,
      displayedArticles,
      hasMoreArticles,
      recentArticles,
      setActiveCategory,
      toggleAllCategories,
      navigateToArticle,
      handleLoadMore,
      formatDate
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.articles-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f98b88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 文章列表样式 */
.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.content-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.content-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.read-more-btn {
  background-color: #f98b88;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.read-more-btn:hover {
  background-color: #e87a77;
}

/* 加载更多按钮 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  position: relative;
  z-index: 100;
}

.load-more-btn {
  background-color: #f98b88;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #e87a77;
}

.load-more-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 没有更多文章提示 */
.no-more-container,
.no-articles-container {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* 侧边栏样式 */
.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.content-view {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.sidebar-section h3 {
  color: #333;
  margin-bottom: 15px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #666;
}

.recent-articles {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recent-article-item h4 {
  color: #333;
  font-size: 1rem;
  margin-bottom: 5px;
}

.recent-article-item p {
  color: #999;
  font-size: 0.8rem;
}

/* 分类标签样式 */
.category-tabs-wrapper {
  margin-bottom: 30px;
  position: relative;
  z-index: 50;
}

.category-tabs-simple {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  position: relative;
  z-index: 51;
}

.tab-btn-simple {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background-color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  color: #666;
  flex-shrink: 0;
}

.tab-btn-simple:hover {
  border-color: #f98b88;
  color: #f98b88;
}

.tab-btn-simple.active {
  background-color: #f98b88;
  color: white;
  border-color: #f98b88;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .category-tabs-simple {
    flex-wrap: wrap;
  }
}
</style>