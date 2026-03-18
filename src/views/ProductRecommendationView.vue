<template>
  <div class="products-view">
    <div v-if="showProductRecommendations" class="container">
      <div class="page-header">
        <h1 class="page-title">精选好物</h1>
        <p class="page-subtitle">为您推荐优质的母婴用品</p>
      </div>
      
      <div class="filter-section">
        <!-- 分类标签在上方 -->
        <div class="category-tabs-wrapper">
          <div class="category-tabs-grid">
            <!-- 第一行：全部按钮 + 前4个分类标签 -->
            <div class="category-row first-row">
              <button 
                v-for="cat in firstRowCategories" 
                :key="cat"
                :class="['tab-btn-simple', cat === '全部' ? 'all-btn' : '', { active: activeCategory === cat }]"
                @click="filterByCategory(cat)"
              >
                <span class="tab-icon">{{ getCategoryIcon(cat) }}</span>
                {{ cat }}
              </button>
            </div>
            
            <!-- 第二行：剩下的4个分类标签，与第一行第一个分类标签对齐 -->
            <div class="category-row second-row">
              <!-- 占位符，用于对齐第一行的"全部"按钮 -->
              <div class="placeholder-tab"></div>
              <button 
                v-for="cat in secondRowCategories" 
                :key="cat"
                :class="{ active: activeCategory === cat }"
                @click="filterByCategory(cat)"
                class="tab-btn-simple"
              >
                <span class="tab-icon">{{ getCategoryIcon(cat) }}</span>
                {{ cat }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 筛选框在下方 -->
        <div class="filter-header">
          <div class="sort-options">
            <div class="custom-select-wrapper">
              <div 
                class="custom-select" 
                :class="{ 'custom-select-open': isSelectOpen }"
                @click="toggleSelect"
              >
                <span class="custom-select-value">{{ getSortLabel(sortBy) }}</span>
                <span class="custom-select-arrow">▼</span>
              </div>
              
              <!-- 自定义下拉菜单 -->
              <div v-if="isSelectOpen" class="custom-select-dropdown">
                <div 
                  v-for="option in sortOptions" 
                  :key="option.value"
                  class="custom-select-option"
                  :class="{ 'custom-select-option-active': sortBy === option.value }"
                  @click="selectOption(option.value)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <p>暂无商品</p>
      </div>
      
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id"
          :product="product"
        />
      </div>
      
      <div v-if="hasMore" class="load-more-container">
        <button 
          @click="loadMore"
          :disabled="loadingMore"
          class="load-more-btn"
        >
          {{ loadingMore ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
    
    <!-- 当商品推荐被隐藏时显示提示信息 -->
    <div v-else class="container">
      <div class="disabled-state">
        <div class="disabled-icon">🔒</div>
        <h2>精选好物功能暂未开放</h2>
        <p>我们正在优化商品推荐功能，敬请期待！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiClient from '../utils/api'
import ProductCard from '../components/ProductCard.vue'

// 是否显示商品推荐（根据环境变量控制）
const showProductRecommendations = computed(() => {
  return import.meta.env.VITE_SHOW_PRODUCT_RECOMMENDATIONS === 'true'
})

const categories = ref([
  '全部',
  '孕期指南',
  '新生照顾',
  '幼儿发展',
  '亲子互动',
  '早期教育',
  '营养健康',
  '产后恢复',
  '育儿用品'
])

// 自定义下拉菜单状态
const isSelectOpen = ref(false)

// 排序选项配置
const sortOptions = ref([
  { value: 'created_at', label: '最新上架' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
  { value: 'click_count', label: '最受欢迎' }
])

// 计算属性获取分类数组
const categoryList = computed(() => categories.value)

// 第一行分类（全部 + 前4个）
const firstRowCategories = computed(() => {
  const cats = categories.value
  return cats.slice(0, 5) // 取前5个：全部 + 4个分类
})

// 第二行分类（剩下的4个）
const secondRowCategories = computed(() => {
  return categories.value.slice(5) // 取第5个之后的4个分类
})

const activeCategory = ref('全部')
const sortBy = ref('created_at')
const products = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const hasMore = ref(false)

const loadProducts = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      sort_by: sortBy.value
    }
    
    if (activeCategory.value !== '全部') {
      params.category = activeCategory.value
    }
    
    const response = await apiClient.get('/products', { params })
    products.value = response.data.products
    hasMore.value = response.data.total > currentPage.value * pageSize.value
  } catch (error) {
    console.error('加载商品失败:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value) return
  loadingMore.value = true
  
  try {
    currentPage.value += 1
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      sort_by: sortBy.value
    }
    
    if (activeCategory.value !== '全部') {
      params.category = activeCategory.value
    }
    
    const response = await apiClient.get('/products', { params })
    products.value = [...products.value, ...response.data.products]
    hasMore.value = response.data.total > currentPage.value * pageSize.value
  } catch (error) {
    console.error('加载更多商品失败:', error)
  } finally {
    loadingMore.value = false
  }
}

const filterByCategory = (category) => {
  activeCategory.value = category
  currentPage.value = 1
  products.value = []
  loadProducts()
}

// 获取分类图标
const getCategoryIcon = (category) => {
  const iconMap = {
    '全部': '📚',
    '孕期指南': '🤰',
    '新生照顾': '👶',
    '幼儿发展': '🌱',
    '亲子互动': '👨‍👩‍👧',
    '早期教育': '🎓',
    '营养健康': '🍎',
    '产后恢复': '🏥',
    '育儿用品': '🛍️'
  }
  return iconMap[category] || '📦'
}

// 获取排序选项的显示标签
const getSortLabel = (value) => {
  const option = sortOptions.value.find(opt => opt.value === value)
  return option ? option.label : '最新上架'
}

// 切换下拉菜单显示状态
const toggleSelect = () => {
  isSelectOpen.value = !isSelectOpen.value
}

// 选择排序选项
const selectOption = (value) => {
  sortBy.value = value
  isSelectOpen.value = false
  loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.products-view {
  min-height: 100vh;
  padding: 40px 0;
  background-color: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.filter-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 10; /* 确保筛选框在下拉菜单时层级合适 */
}

.category-filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: rgba(255, 255, 255, 0.95);
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.sort-options {
  display: flex;
  align-items: center;
}

/* 经典下拉菜单样式 */
.custom-select-wrapper {
  position: relative;
  display: inline-block;
  width: 180px;
}

.custom-select {
  padding: 10px 30px 10px 16px;
  border: 2px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
}

.custom-select:hover {
  border-color: var(--primary-color);
  background-color: white;
}

.custom-select-open {
  border-color: var(--primary-color);
  background-color: white;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-select-value {
  font-weight: 500;
}

.custom-select-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
  color: #666;
}

.custom-select-open .custom-select-arrow {
  transform: rotate(180deg);
  color: var(--primary-color);
}

/* 经典下拉菜单 */
.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 2px solid var(--primary-color);
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 5;
  margin-top: -2px;
  animation: dropdownFadeIn 0.2s ease-out;
  overflow: hidden;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-select-option {
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.custom-select-option:last-child {
  border-bottom: none;
}

.custom-select-option:hover {
  background-color: #f8f9fa;
  transform: translateX(2px);
}

.custom-select-option-active {
  background-color: rgba(255, 107, 139, 0.08);
  color: var(--primary-color);
  font-weight: 600;
}

.custom-select-option-active:hover {
  background-color: rgba(255, 107, 139, 0.12);
}

/* 确保下拉菜单显示在筛选框下面 */
.sort-options {
  position: relative;
  z-index: 15;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 10px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--bg-accent);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.load-more-container {
  text-align: center;
  margin-top: 30px;
}

.load-more-btn {
  padding: 12px 32px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .category-filter {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .filter-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}

/* 商品推荐被隐藏时的样式 */
.disabled-state {
  text-align: center;
  padding: 80px 20px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 2px dashed var(--border-color);
  margin-top: 40px;
}

.disabled-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.disabled-state h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.disabled-state p {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 分类标签网格布局 */
.category-tabs-wrapper {
  margin-bottom: 0;
  padding: 0;
  position: relative;
  z-index: 5; /* 降低层级，确保筛选框下拉菜单能正常显示 */
  flex: 1;
}

.category-tabs-grid {
  display: grid;
  grid-template-columns: repeat(5, auto); /* 5列网格，对应第一行的5个元素 */
  gap: 10px;
  width: fit-content;
  max-width: 100%;
}

.category-row {
  display: contents; /* 使用网格布局，不创建额外的布局容器 */
}

/* 第一行：全部按钮 + 4个标签 */
.category-row.first-row {
  /* 使用网格布局，不需要额外样式 */
}

/* 第二行：4个标签，与第一行第一个分类标签对齐 */
.category-row.second-row {
  /* 使用网格布局，不需要额外样式 */
}

/* 占位符标签，用于对齐第一行的"全部"按钮 */
.placeholder-tab {
  width: 100px; /* 与"全部"按钮宽度一致 */
  height: 0;
  visibility: hidden;
}

/* 确保标签按钮样式一致 */
.tab-btn-simple {
  flex-shrink: 0;
  padding: 12px 24px;
  border: 3px solid #e0e0e0;
  background-color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: fit-content;
  white-space: nowrap;
  position: relative;
  margin: 0;
  outline: none;
  box-sizing: border-box;
}

.tab-btn-simple:hover {
  border-color: #FF6B8B;
  color: #FF6B8B;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
}

.tab-btn-simple.active {
  background-color: #FF6B8B;
  color: white;
  border-color: #FF6B8B;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* "全部"按钮样式 */
.all-btn {
  z-index: 102;
}
</style>
