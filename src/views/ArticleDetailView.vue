<template>
  <div class="article-detail">
    <!-- 文章头部信息 -->
    <div class="article-header">
      <div class="article-category">{{ article.category }}</div>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="meta-item">
          <i class="icon">📅</i> {{ article.created_at }}
        </span>
        <span class="meta-item">
          <i class="icon">👁️</i> {{ article.views }} 阅读
        </span>
        <span class="meta-item">
          <i class="icon">❤️</i> {{ article.likes }} 点赞
        </span>
      </div>
      <div class="article-summary">{{ article.summary }}</div>
    </div>
    
    <!-- 文章正文 -->
    <div class="article-content">
      <!-- 使用 v-html 渲染富文本内容 -->
      <div v-html="article.content"></div>
    </div>
    
    <!-- 文章操作区 -->
    <div class="article-actions">
      <button class="action-btn like-btn" @click="toggleLike">
        <i class="icon">❤️</i> {{ article.liked ? '已点赞' : '点赞' }}
      </button>
      <button class="action-btn share-btn" @click="shareArticle">
        <i class="icon">📤</i> 分享
      </button>
      <button class="action-btn collect-btn" @click="toggleCollect">
        <i class="icon">⭐</i> {{ article.collected ? '已收藏' : '收藏' }}
      </button>
    </div>
    
    <!-- 相关推荐 -->
    <div class="related-content">
      <h3 class="related-title">相关推荐</h3>
      <div class="related-list">
        <div 
          v-for="item in relatedArticles" 
          :key="item.id" 
          class="related-item"
        >
          <router-link :to="`/article/${item.id}`" class="related-link">
            <h4 class="related-item-title">{{ item.title }}</h4>
            <p class="related-item-summary">{{ item.summary }}</p>
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
const articleId = parseInt(route.params.id)

// 文章详情
const article = ref({
  id: articleId,
  title: '',
  category: '',
  summary: '',
  content: '',
  created_at: '',
  views: 0,
  likes: 0,
  liked: false,
  collected: false
})

// 相关推荐
const relatedArticles = ref([
  { id: 2, title: '如何科学安排孕期饮食', summary: '孕期饮食对胎儿发育至关重要，本文将为您介绍科学的孕期饮食安排。' },
  { id: 3, title: '上班族必看：缓解颈椎疼痛的方法', summary: '长期久坐的上班族容易出现颈椎问题，这些简单的方法可以帮助您缓解疼痛。' },
  { id: 4, title: '营养早餐搭配指南', summary: '一顿营养均衡的早餐是一天活力的开始，学会这些搭配技巧，让您的早餐更健康。' }
])

// 加载文章详情
onMounted(() => {
  // 在实际项目中，这里会调用API获取文章详情
  // contentStore.fetchArticleDetail(articleId)
  
  // 模拟数据
  article.value = {
    id: articleId,
    title: '10个简单的养生小技巧',
    category: '健康养生',
    summary: '养生并不需要复杂的方法，这些简单的小技巧可以帮助您保持健康的生活方式。',
    content: `
      <p>在快节奏的现代生活中，保持健康的生活方式变得越来越重要。以下是10个简单易行的养生小技巧，帮助您在日常生活中保持健康：</p>
      
      <h2>1. 每天喝足够的水</h2>
      <p>水是生命之源，保持充足的水分摄入对身体健康至关重要。建议每天喝8-10杯水，保持身体水分平衡。</p>
      
      <h2>2. 坚持适量运动</h2>
      <p>适量的运动可以增强身体免疫力，促进血液循环。可以选择散步、瑜伽、游泳等低强度运动，每周保持3-5次。</p>
      
      <h2>3. 保证充足睡眠</h2>
      <p>睡眠是身体恢复的重要时期，建议每天保持7-8小时的睡眠时间，建立规律的作息习惯。</p>
      
      <h2>4. 合理饮食</h2>
      <p>保持饮食均衡，多吃蔬菜、水果、全谷物等富含营养的食物，减少油腻、辛辣食物的摄入。</p>
      
      <h2>5. 保持良好的心态</h2>
      <p>情绪对身体健康有很大影响，保持积极乐观的心态，学会缓解压力，可以通过冥想、听音乐等方式放松心情。</p>
      
      <h2>6. 定期体检</h2>
      <p>定期进行身体检查，及早发现和预防疾病，是保持健康的重要措施。</p>
      
      <h2>7. 减少久坐时间</h2>
      <p>长期久坐容易导致颈椎、腰椎问题，建议每隔1小时起身活动一下，伸展身体。</p>
      
      <h2>8. 戒烟限酒</h2>
      <p>吸烟和过量饮酒对身体健康有很大危害，尽量戒烟限酒，保持健康的生活方式。</p>
      
      <h2>9. 保持良好的个人卫生</h2>
      <p>勤洗手、保持居住环境清洁，可以有效预防疾病的传播。</p>
      
      <h2>10. 多与家人朋友交流</h2>
      <p>保持良好的人际关系，多与家人朋友交流，可以缓解压力，保持心理健康。</p>
      
      <p>以上这些养生小技巧简单易行，只要坚持实施，就能帮助您保持健康的生活方式，提高生活质量。</p>
    `,
    created_at: '2025-01-15',
    views: 1234,
    likes: 89,
    liked: false,
    collected: false
  }
})

// 切换点赞状态
const toggleLike = () => {
  article.value.liked = !article.value.liked
  article.value.likes += article.value.liked ? 1 : -1
}

// 切换收藏状态
const toggleCollect = () => {
  article.value.collected = !article.value.collected
}

// 分享文章
const shareArticle = () => {
  // 实际项目中这里会调用分享API
  alert('分享功能开发中...')
}
</script>

<style scoped>
.article-detail {
  max-width: 100%;
}

/* 文章头部信息 */
.article-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.article-category {
  font-size: 14px;
  color: #1E88E5;
  font-weight: 500;
  margin-bottom: 10px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
  color: #333;
}

.article-meta {
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

.article-summary {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

/* 文章正文 */
.article-content {
  margin-bottom: 40px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.article-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 30px 0 15px;
  color: #333;
}

.article-content p {
  margin-bottom: 20px;
}

.article-content ul, .article-content ol {
  margin-left: 20px;
  margin-bottom: 20px;
}

.article-content li {
  margin-bottom: 10px;
}

/* 文章操作区 */
.article-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.like-btn:hover {
  color: #e53935;
  border-color: #e53935;
}

.share-btn:hover {
  color: #1E88E5;
  border-color: #1E88E5;
}

.collect-btn:hover {
  color: #FFC107;
  border-color: #FFC107;
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
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.related-item:hover {
  background-color: #eee;
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
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-title {
    font-size: 24px;
  }
  
  .article-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .article-content {
    font-size: 15px;
  }
  
  .article-content h2 {
    font-size: 20px;
  }
  
  .article-actions {
    flex-wrap: wrap;
  }
  
  .related-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>