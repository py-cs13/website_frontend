<template>
  <div class="articles-view">
    <div class="content-view">
      <div class="page-title-container">
        <h1 class="page-title">
          <span class="section-icon">📚</span>
          所有文章
        </h1>
      </div>
      
      <div class="content-list">
        <div 
          v-for="article in displayedArticles" 
          :key="article.id" 
          class="content-card"
          @click="navigateToArticle(article.id)"
        >
          <div class="card-header">
            <div class="card-category">
              <span class="category-icon">{{ getCategoryIcon(article.category) }}</span>
              {{ article.category }}
            </div>
            <div class="card-type">
              <span>📝</span>
              文章
            </div>
          </div>
          
          <h3 class="card-title">{{ article.title }}</h3>
          <p class="card-summary">{{ article.summary }}</p>
          
          <div class="card-meta">
            <span class="author">
              <span>👤</span>
              {{ article.author || '管理员' }}
            </span>
            <span class="date">
              <span>📅</span>
              {{ formatDate(article.created_at) }}
            </span>
          </div>
          
          <div class="card-actions">
            <router-link :to="`/article/${article.id}`" class="read-more-btn">
              阅读全文 →
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-if="articles.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>暂无文章</h3>
        <p>请稍后再来查看</p>
      </div>
    </div>
    
    <!-- 加载更多按钮（移到content-view外部） -->
    <div v-if="articles.length > 0 && displayedArticles.length < articles.length" class="load-more-container">
      <button @click="loadMore" class="load-more-btn">
        <span v-if="loading">加载中...</span>
        <span v-else>加载更多</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '../utils/formatters.js'
import axios from 'axios'

const router = useRouter()
const articles = ref([])
const loading = ref(false)
const displayedCount = ref(6) // 默认显示6篇文章
const loadStep = 6 // 每次加载6篇文章

// 计算当前显示的文章
const displayedArticles = computed(() => {
  return articles.value.slice(0, displayedCount.value)
})

// 获取所有文章
const fetchAllArticles = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:8000/api/articles')
    articles.value = response.data.data || response.data || []
  } catch (error) {
    console.error('获取文章失败:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

// 加载更多文章
const loadMore = () => {
  displayedCount.value += loadStep
}

// 导航到文章详情页
const navigateToArticle = (id) => {
  router.push(`/article/${id}`)
}

// 获取分类图标
const getCategoryIcon = (category) => {
  const iconMap = {
    '育儿知识': '👶',
    '孕期保健': '🤰',
    '产后恢复': '👩‍⚕️',
    '辅食营养': '🍼',
    '早期教育': '📚',
    '母婴用品': '🛍️',
    '亲子活动': '👨‍👩‍👧',
    '心理健康': '🧠'
  }
  return iconMap[category] || '📝'
}

// 页面加载时获取所有文章
onMounted(() => {
  fetchAllArticles()
})
</script>

<style scoped>
.articles-view {
  padding: 20px 0;
}

.page-title-container {
  margin-bottom: 30px;
}

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
  cursor: pointer;
}

.content-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-large);
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

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  line-height: 1.5;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.card-title:hover {
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
  background-color: var(--bg-secondary);
  padding: 10px;
  border-radius: 8px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.read-more-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  background-color: #FF4785;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
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
}

.load-more-btn:hover {
  background-color: #FF4785;
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

.load-more-btn:disabled {
  background-color: var(--text-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .content-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .content-list {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  
  .content-card {
    padding: 20px;
  }
  
  .load-more-btn {
    padding: 10px 28px;
    font-size: 14px;
  }
}
</style>