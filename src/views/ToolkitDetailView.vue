<template>
  <div class="toolkit-detail">
    <!-- 工具包头部信息 -->
    <div class="toolkit-header">
      <div class="toolkit-category">{{ toolkit.category }}</div>
      <h1 class="toolkit-title">{{ toolkit.title }}</h1>
      <div class="toolkit-meta">
        <span class="meta-item">
          <i class="icon">📅</i> {{ toolkit.created_at }}
        </span>
        <span class="meta-item">
          <i class="icon">👁️</i> {{ toolkit.views }} 浏览
        </span>
        <span class="meta-item">
          <i class="icon">❤️</i> {{ toolkit.likes }} 点赞
        </span>
      </div>
      <div class="toolkit-summary">{{ toolkit.summary }}</div>
      
      <!-- 价格和购买按钮 -->
      <div class="toolkit-price-section">
        <div class="price-info">
          <span class="current-price">¥{{ toolkit.price }}</span>
          <span v-if="toolkit.original_price" class="original-price">¥{{ toolkit.original_price }}</span>
        </div>
        <button class="buy-now-btn">立即购买</button>
        <button class="add-cart-btn">加入购物车</button>
      </div>
    </div>
    
    <!-- 工具包详情内容 -->
    <div class="toolkit-content">
      <!-- 使用 v-html 渲染富文本内容 -->
      <div v-html="toolkit.content"></div>
    </div>
    
    <!-- 工具包包含内容 -->
    <div class="toolkit-includes">
      <h3 class="section-title">工具包包含</h3>
      <ul class="includes-list">
        <li v-for="(item, index) in toolkit.includes" :key="index" class="include-item">
          <i class="icon">✅</i> {{ item }}
        </li>
      </ul>
    </div>
    
    <!-- 用户评价 -->
    <div class="toolkit-reviews">
      <h3 class="section-title">用户评价</h3>
      <div class="reviews-list">
        <div v-for="review in toolkit.reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="reviewer-name">{{ review.user_name }}</span>
            <div class="review-rating">
              <span v-for="star in 5" :key="star" class="star">
                {{ star <= review.rating ? '⭐' : '☆' }}
              </span>
            </div>
            <span class="review-date">{{ review.created_at }}</span>
          </div>
          <p class="review-content">{{ review.content }}</p>
        </div>
      </div>
    </div>
    
    <!-- 相关推荐 -->
    <div class="related-content">
      <h3 class="related-title">相关推荐</h3>
      <div class="related-list">
        <div 
          v-for="item in relatedToolkits" 
          :key="item.id" 
          class="related-item"
        >
          <router-link :to="`/toolkit/${item.id}`" class="related-link">
            <h4 class="related-item-title">{{ item.title }}</h4>
            <p class="related-item-summary">{{ item.summary }}</p>
            <div class="related-item-price">¥{{ item.price }}</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '../stores'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
const toolkitId = parseInt(route.params.id)

// 工具包详情
const toolkit = ref({
  id: toolkitId,
  title: '',
  category: '',
  summary: '',
  content: '',
  created_at: '',
  views: 0,
  likes: 0,
  price: 0,
  original_price: 0,
  includes: [],
  reviews: []
})

// 相关推荐
const relatedToolkits = ref([
  { id: 2, title: '新生儿护理工具包', summary: '全面的新生儿护理知识和实用工具', price: 19.9 },
  { id: 3, title: '减肥健身计划工具包', summary: '科学的减肥健身计划和饮食指导', price: 29.9 },
  { id: 4, title: '营养膳食搭配工具包', summary: '健康营养的膳食搭配方案', price: 15.9 }
])

// 加载工具包详情
onMounted(() => {
  // 在实际项目中，这里会调用API获取工具包详情
  // contentStore.fetchToolkitDetail(toolkitId)
  
  // 模拟数据
  toolkit.value = {
    id: toolkitId,
    title: '家庭健康管理工具包',
    category: '健康养生',
    summary: '全面的家庭健康管理知识和实用工具，帮助您管理家人的健康。',
    content: `
      <p>家庭健康管理是现代生活中非常重要的一部分，一个好的家庭健康管理工具包可以帮助您更好地照顾家人的健康。</p>
      
      <h2>工具包特点</h2>
      <p>本工具包包含了丰富的家庭健康管理资源，包括：</p>
      <ul>
        <li>家庭健康档案模板</li>
        <li>常见疾病预防指南</li>
        <li>家庭急救知识手册</li>
        <li>儿童生长发育监测表</li>
        <li>老年人健康管理指南</li>
      </ul>
      
      <h2>使用方法</h2>
      <p>1. 下载工具包中的所有资源文件</p>
      <p>2. 按照说明填写家庭健康档案</p>
      <p>3. 根据指南制定家庭健康计划</p>
      <p>4. 定期更新健康数据，监测家人健康状况</p>
      
      <h2>适用人群</h2>
      <p>本工具包适合所有关注家庭健康的人群，特别是有老人和儿童的家庭。</p>
    `,
    created_at: '2025-01-10',
    views: 892,
    likes: 67,
    price: 9.9,
    original_price: 99,
    includes: [
      '家庭健康档案Excel模板',
      '常见疾病预防指南PDF',
      '家庭急救知识手册PDF',
      '儿童生长发育监测表Excel',
      '老年人健康管理指南PDF',
      '家庭健康管理视频教程'
    ],
    reviews: [
      { id: 1, user_name: '健康达人', rating: 5, created_at: '2025-01-12', content: '工具包非常实用，包含了很多有用的健康管理资源。' },
      { id: 2, user_name: '快乐妈妈', rating: 4, created_at: '2025-01-11', content: '儿童生长发育监测表很实用，帮助我更好地了解孩子的成长情况。' },
      { id: 3, user_name: '爱心爸爸', rating: 5, created_at: '2025-01-10', content: '家庭急救知识手册很全面，值得购买。' }
    ]
  }
})

// 购买按钮点击事件
const buyNow = () => {
  // 实际项目中这里会跳转到支付页面
  alert('购买功能开发中...')
}

// 加入购物车
const addToCart = () => {
  // 实际项目中这里会调用加入购物车API
  alert('已加入购物车')
}
</script>

<style scoped>
.toolkit-detail {
  max-width: 100%;
}

/* 工具包头部信息 */
.toolkit-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.toolkit-category {
  font-size: 14px;
  color: #FF9800;
  font-weight: 500;
  margin-bottom: 10px;
}

.toolkit-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
  color: #333;
}

.toolkit-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolkit-summary {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  background-color: #fff3e0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
}

/* 价格和购买按钮 */
.toolkit-price-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #F44336;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.buy-now-btn {
  background-color: #F44336;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buy-now-btn:hover {
  background-color: #D32F2F;
}

.add-cart-btn {
  background-color: #FF9800;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-cart-btn:hover {
  background-color: #F57C00;
}

/* 工具包详情内容 */
.toolkit-content {
  margin-bottom: 40px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.toolkit-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 30px 0 15px;
  color: #333;
}

.toolkit-content p {
  margin-bottom: 20px;
}

.toolkit-content ul, .toolkit-content ol {
  margin-left: 20px;
  margin-bottom: 20px;
}

.toolkit-content li {
  margin-bottom: 10px;
}

/* 工具包包含内容 */
.toolkit-includes {
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.includes-list {
  list-style: none;
}

.include-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 15px;
  color: #333;
}

.include-item .icon {
  margin-top: 5px;
}

/* 用户评价 */
.toolkit-reviews {
  margin-bottom: 40px;
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.review-item {
  padding: 20px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.reviewer-name {
  font-weight: 500;
  color: #333;
}

.review-rating {
  color: #FFC107;
}

.review-date {
  color: #999;
}

.review-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

/* 相关推荐 */
.related-content {
  margin-top: 40px;
}

.related-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.related-item {
  padding: 20px;
  background-color: #fff3e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.related-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.related-link {
  text-decoration: none;
  color: inherit;
}

.related-item-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.related-item-summary {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-item-price {
  font-size: 18px;
  font-weight: 600;
  color: #F44336;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolkit-title {
    font-size: 24px;
  }
  
  .toolkit-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .toolkit-price-section {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .current-price {
    font-size: 28px;
  }
  
  .toolkit-content {
    font-size: 15px;
  }
  
  .toolkit-content h2 {
    font-size: 20px;
  }
  
  .reviews-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .related-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>