<template>
  <div class="toolkits-view">
    <div class="content-view">
      
      <div class="content-list">
        <div 
          v-for="toolkit in displayedToolkits" 
          :key="toolkit.id" 
          class="content-card content-card-toolkit"
          @click="navigateToToolkit(toolkit.id)"
        >
          <div class="card-header">
            <div class="card-category">
              <span class="category-icon">{{ getCategoryIcon(toolkit.category) }}</span>
              {{ toolkit.category }}
            </div>
            <div class="card-type">
              <span>🎁</span>
              工具包
            </div>
          </div>
          
          <div class="toolkit-value-badge">
            <span class="badge-icon">💎</span>
            <span class="badge-text">实用工具</span>
          </div>
          
          <h3 class="card-title">{{ toolkit.name }}</h3>
          <p class="card-summary">{{ toolkit.description }}</p>
          
          <div class="toolkit-price">
            <span v-if="toolkit.price > 0" class="price">
              <span class="currency">¥</span>
              {{ toolkit.price.toFixed(2) }}
            </span>
            <span v-else class="free">免费</span>
          </div>
          
          <div class="card-meta">
            <span class="author">
              <span>👤</span>
              {{ toolkit.author || '管理员' }}
            </span>
            <span class="date">
              <span>📅</span>
              {{ formatDate(toolkit.created_at) }}
            </span>
          </div>
          
          <div class="card-actions">
            <router-link :to="`/toolkit/${toolkit.id}`" class="read-more-btn">
              查看详情 →
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-if="displayedToolkits.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>暂无工具包</h3>
        <p>请稍后再来查看</p>
      </div>
    </div>
    
    <!-- 加载更多按钮（移到content-view外部） -->
    <div v-if="displayedToolkits.length > 0 && displayedToolkits.length < toolkits.length" class="load-more-container">
      <button 
        class="load-more-btn"
        @click="loadMore"
        :disabled="loading"
      >
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? '加载中...' : '加载更多' }}
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
const toolkits = ref([])
const loading = ref(false)
const displayedCount = ref(6)
const loadStep = 6

// 计算属性：控制显示的工具包数量
const displayedToolkits = computed(() => {
  return toolkits.value.slice(0, displayedCount.value)
})

// 加载更多工具包
const loadMore = () => {
  if (loading.value) return
  loading.value = true
  
  // 模拟网络延迟
  setTimeout(() => {
    displayedCount.value += loadStep
    loading.value = false
  }, 500)
}

// 获取所有工具包
const fetchAllToolkits = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/toolkits')
    toolkits.value = response.data.data || response.data || []
  } catch (error) {
    console.error('获取工具包失败:', error)
    toolkits.value = []
  }
}

// 导航到工具包详情页
const navigateToToolkit = (id) => {
  router.push(`/toolkit/${id}`)
}

// 获取分类图标
const getCategoryIcon = (category) => {
  const iconMap = {
    '孕期工具': '🤰',
    '育儿工具': '👶',
    '辅食工具': '🍼',
    '教育工具': '📚',
    '健康工具': '🧠',
    '成长记录': '📝',
    '其他工具': '📊'
  }
  return iconMap[category] || '🎁'
}

// 页面加载时获取所有工具包
onMounted(() => {
  fetchAllToolkits()
})
</script>

<style scoped>
/* 加载更多按钮样式 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.load-more-btn {
  padding: 12px 30px;
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

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.toolkits-view {
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

.content-card-toolkit {
  border-left: none;
  border: 3px solid transparent;
  background: linear-gradient(var(--bg-primary), var(--bg-primary)) padding-box,
              linear-gradient(135deg, #FFD700, #FFA500) border-box;
}

.content-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-large);
}

.content-card-toolkit:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
}

.content-card::before {
  content: "🎁";
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

.toolkit-value-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
}

.toolkit-value-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 215, 0, 0.3);
}

.badge-icon {
  font-size: 14px;
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

.toolkit-price {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 20px;
  color: var(--primary-color);
}

.price {
  display: flex;
  align-items: center;
  gap: 2px;
}

.currency {
  font-size: 14px;
}

.free {
  color: #28a745;
  font-size: 16px;
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
}
</style>