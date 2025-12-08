<template>
  <div class="home-view">
    <!-- 母婴主题装饰 -->
    <div class="theme-decoration">
      <div class="decoration-icon">👶</div>
      <div class="decoration-icon">🍼</div>
      <div class="decoration-icon">🎀</div>
    </div>
    
    <!-- 页面标题 -->
    <h1 class="page-title">母婴生活内容平台</h1>
    <p class="page-subtitle">专业的母婴知识分享，陪伴宝贝健康成长每一天</p>
    
    <!-- 内容分类标签 -->
    <div class="category-tabs">
      <button 
        v-for="category in categories" 
        :key="category.id" 
        class="tab-btn" 
        :class="{ active: activeCategory === category.id }"
        @click="filterContent(category.id)"
      >
        <span class="tab-icon">{{ getCategoryIcon(category.name) }}</span>
        {{ category.name }}
      </button>
    </div>
    
    <!-- 内容列表 -->
    <div class="content-list">
      <div 
        v-for="item in filteredContent" 
        :key="item.id" 
        class="content-card"
        :class="{ 'content-card-toolkit': item.type === 'toolkit' }"
      >
        <div class="card-header">
          <div class="card-category">
            <span class="category-icon">{{ getCategoryIcon(item.category) }}</span>
            {{ item.category }}
          </div>
          <div class="card-type">{{ item.type === 'article' ? '📚 文章' : '🎁 工具包' }}</div>
        </div>
        
        <h3 class="card-title">
          <router-link :to="`/${item.type === 'article' ? 'article' : 'toolkit'}/${item.id}`">
            {{ item.title }}
          </router-link>
        </h3>
        
        <p class="card-summary">{{ item.summary }}</p>
        
        <div class="card-meta">
          <span class="meta-item">
            <i class="icon">📅</i> {{ item.created_at }}
          </span>
          <span class="meta-item">
            <i class="icon">👁️‍🗨️</i> {{ item.views }} 阅读
          </span>
          <span class="meta-item">
            <i class="icon">❤️</i> {{ item.likes }} 点赞
          </span>
        </div>
        
        <div class="card-actions">
          <router-link 
            :to="`/${item.type === 'article' ? 'article' : 'toolkit'}/${item.id}`" 
            class="read-more-btn"
          >
            {{ item.type === 'article' ? '阅读全文' : '查看详情' }} →
          </router-link>
          <button v-if="item.type === 'toolkit'" class="buy-btn">立即购买</button>
        </div>
      </div>
    </div>
    
    <!-- 加载更多按钮 -->
    <div class="load-more">
      <button class="load-more-btn" @click="loadMoreContent">加载更多</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContentStore } from '../stores'

const contentStore = useContentStore()
const activeCategory = ref(0) // 0表示全部

// 模拟分类数据
const categories = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '婴儿护理' },
  { id: 2, name: '育儿知识' },
  { id: 3, name: '营养辅食' },
  { id: 4, name: '产后恢复' },
  { id: 5, name: '亲子互动' },
  { id: 6, name: '成长发育' }
])

// 获取分类对应的图标
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    '全部': '🏠',
    '婴儿护理': '👶',
    '育儿知识': '📚',
    '营养辅食': '🍼',
    '产后恢复': '🤰',
    '亲子互动': '👨‍👩‍👧',
    '成长发育': '🌱'
  }
  return iconMap[categoryName] || '📖'
}

// 筛选后的内容
const filteredContent = computed(() => {
  if (activeCategory.value === 0) {
    return contentStore.contentList
  }
  return contentStore.contentList.filter(item => {
    const categoryMap = {
      '健康养生': 1,
      '母婴育儿': 2,
      '运动健身': 3,
      '饮食营养': 4,
      '心理疏导': 5,
      '睡眠管理': 6
    }
    return categoryMap[item.category] === activeCategory.value
  })
})

// 分类筛选
const filterContent = (categoryId) => {
  activeCategory.value = categoryId
}

// 加载更多内容
const loadMoreContent = () => {
  contentStore.loadMoreContent()
}
</script>

<style scoped>
.home-view {
  max-width: 100%;
  position: relative;
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
  margin-right: auto;
  box-shadow: var(--shadow-light);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
  justify-content: center;
}

.tab-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-color);
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
}

.tab-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.tab-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-medium);
}

.tab-icon {
  font-size: 16px;
}

/* 内容列表 */
.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
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

.content-card::before {
  content: "👶";
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  opacity: 0.1;
  transform: rotate(15deg);
}

.content-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-large);
}

.content-card-toolkit {
  border-left-color: var(--accent-color);
  background-color: var(--bg-accent);
}

.content-card-toolkit::before {
  content: "🎁";
  font-size: 28px;
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
  background-color: var(--accent-color-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-large);
}

/* 加载更多按钮 */
.load-more {
  text-align: center;
}

.load-more-btn {
  background-color: var(--bg-primary);
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 12px 40px;
  border-radius: 28px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
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
</style>