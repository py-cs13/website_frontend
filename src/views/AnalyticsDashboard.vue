<template>
  <div class="analytics-dashboard">
    <!-- 页面头部 -->
    <div class="dashboard-header">
      <h1>📊 数据可视化分析平台</h1>
      <p>实时监控用户行为和内容表现</p>
    </div>

    <!-- 实时数据卡片 -->
    <div class="real-time-stats">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardData.today_dau || 0 }}</div>
          <div class="stat-label">今日活跃用户</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👀</div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardData.today_views || 0 }}</div>
          <div class="stat-label">今日浏览量</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">❤️</div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardData.today_likes || 0 }}</div>
          <div class="stat-label">今日点赞量</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <div class="stat-value">{{ dashboardData.today_collects || 0 }}</div>
          <div class="stat-label">今日收藏量</div>
        </div>
      </div>
    </div>

    <!-- 用户增长图表 -->
    <div class="chart-section">
      <h2>📈 用户增长趋势</h2>
      <div class="chart-container">
        <div v-if="userGrowthData.user_growth" class="growth-chart">
          <div 
            v-for="(count, date) in userGrowthData.user_growth" 
            :key="date"
            class="growth-bar"
            :style="{ height: (count / maxGrowthValue) * 100 + '%' }"
            :title="`${date}: ${count}人`"
          ></div>
        </div>
        <div v-else class="no-data">暂无数据</div>
      </div>
    </div>

    <!-- 内容表现排行 -->
    <div class="content-ranking">
      <h2>🔥 热门内容排行</h2>
      <div class="ranking-list">
        <div 
          v-for="(content, index) in contentPerformance" 
          :key="content.content_id"
          class="ranking-item"
        >
          <div class="rank">#{{ index + 1 }}</div>
          <div class="content-info">
            <div class="content-title">{{ content.title }}</div>
            <div class="content-stats">
              <span class="stat">👀 {{ content.total_views }}</span>
              <span class="stat">❤️ {{ content.total_likes }}</span>
              <span class="stat">⭐ {{ content.total_collects }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户行为分析 -->
    <div class="user-behavior">
      <h2>👤 用户行为分析</h2>
      <div class="behavior-stats">
        <div class="behavior-chart">
          <div 
            v-for="(count, eventType) in userBehaviorStats" 
            :key="eventType"
            class="behavior-item"
          >
            <div class="behavior-type">{{ getEventTypeLabel(eventType) }}</div>
            <div class="behavior-bar">
              <div 
                class="behavior-fill"
                :style="{ width: (count / maxBehaviorValue) * 100 + '%' }"
              ></div>
            </div>
            <div class="behavior-count">{{ count }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="refresh-section">
      <button @click="refreshData" class="refresh-btn" :disabled="loading">
        {{ loading ? '刷新中...' : '🔄 刷新数据' }}
      </button>
      <span class="last-update">最后更新: {{ lastUpdateTime }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AnalyticsDashboard',
  setup() {
    const authStore = useAuthStore()
    const dashboardData = ref({})
    const userGrowthData = ref({})
    const contentPerformance = ref([])
    const userBehaviorStats = ref({})
    const loading = ref(false)
    const lastUpdateTime = ref('')

    // 获取数据总览
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 开始调用仪表盘API...')
        const response = await fetch('/api/analytics/dashboard', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('📊 仪表盘API响应状态:', response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ 仪表盘API返回数据:', JSON.stringify(data, null, 2))
          dashboardData.value = data.data || {}
          
          // 显示详细的数据内容
          console.log('📈 仪表盘数据详情:')
          console.log('   今日活跃用户:', dashboardData.value.today_dau || 0)
          console.log('   今日浏览量:', dashboardData.value.today_views || 0)
          console.log('   今日点赞量:', dashboardData.value.today_likes || 0)
          console.log('   今日收藏量:', dashboardData.value.today_collects || 0)
          console.log('   总用户数:', dashboardData.value.total_users || 0)
          console.log('   总内容数:', dashboardData.value.total_contents || 0)
          console.log('   今日新增用户:', dashboardData.value.today_new_users || 0)
        } else {
          console.error('❌ 仪表盘API调用失败:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('❌ 获取仪表盘数据失败:', error)
      }
    }

    // 获取用户增长数据
    const fetchUserGrowth = async () => {
      try {
        console.log('🔄 开始调用用户增长API...')
        const response = await fetch('/api/analytics/user-growth?days=7', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('📊 用户增长API响应状态:', response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ 用户增长API返回数据:', JSON.stringify(data, null, 2))
          userGrowthData.value = data.data || {}
          
          // 显示详细的数据内容
          console.log('📈 用户增长数据详情:')
          console.log('   用户增长数据:', userGrowthData.value.user_growth || {})
          console.log('   总用户数:', userGrowthData.value.total_users || 0)
          console.log('   7日活跃用户:', userGrowthData.value.active_users_7d || 0)
          console.log('   统计周期:', userGrowthData.value.period || {})
        } else {
          console.error('❌ 用户增长API调用失败:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('❌ 获取用户增长数据失败:', error)
      }
    }

    // 获取内容表现数据
    const fetchContentPerformance = async () => {
      try {
        const response = await fetch('/api/analytics/content-performance?limit=10&sort_by=views', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          contentPerformance.value = data.data?.content_performance || []
        }
      } catch (error) {
        console.error('获取内容表现数据失败:', error)
      }
    }

    // 获取用户行为数据
    const fetchUserBehavior = async () => {
      try {
        const response = await fetch('/api/analytics/user-behavior', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          userBehaviorStats.value = data.data?.event_stats || {}
        }
      } catch (error) {
        console.error('获取用户行为数据失败:', error)
      }
    }

    // 刷新所有数据
    const refreshData = async () => {
      loading.value = true
      await Promise.all([
        fetchDashboardData(),
        fetchUserGrowth(),
        fetchContentPerformance(),
        fetchUserBehavior()
      ])
      loading.value = false
      lastUpdateTime.value = new Date().toLocaleString('zh-CN')
    }

    // 计算最大增长值
    const maxGrowthValue = ref(1)
    const maxBehaviorValue = ref(1)

    // 事件类型标签映射
    const getEventTypeLabel = (eventType) => {
      const labels = {
        'view': '页面浏览',
        'like': '点赞',
        'collect': '收藏',
        'register': '用户注册',
        'search': '搜索'
      }
      return labels[eventType] || eventType
    }

    onMounted(() => {
      refreshData()
      // 每5分钟自动刷新数据
      setInterval(refreshData, 5 * 60 * 1000)
    })

    // 计算属性
    const computedMaxGrowthValue = () => {
      if (!userGrowthData.value.user_growth) return 1
      return Math.max(...Object.values(userGrowthData.value.user_growth), 1)
    }

    const computedMaxBehaviorValue = () => {
      if (!userBehaviorStats.value) return 1
      return Math.max(...Object.values(userBehaviorStats.value), 1)
    }

    return {
      dashboardData,
      userGrowthData,
      contentPerformance,
      userBehaviorStats,
      loading,
      lastUpdateTime,
      refreshData,
      getEventTypeLabel,
      maxGrowthValue: computedMaxGrowthValue,
      maxBehaviorValue: computedMaxBehaviorValue
    }
  }
}
</script>

<style scoped>
.analytics-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
}

.dashboard-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.dashboard-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.real-time-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 40px;
  margin-right: 15px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.chart-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.growth-chart {
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 5px;
  padding: 20px 0;
}

.growth-bar {
  flex: 1;
  background: linear-gradient(to top, #3498db, #2980b9);
  border-radius: 3px 3px 0 0;
  min-height: 5px;
  transition: all 0.3s ease;
}

.growth-bar:hover {
  opacity: 0.8;
}

.content-ranking {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.ranking-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rank {
  background: #e74c3c;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
}

.content-info {
  flex: 1;
}

.content-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50;
}

.content-stats {
  display: flex;
  gap: 15px;
}

.stat {
  font-size: 12px;
  color: #7f8c8d;
}

.user-behavior {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.behavior-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
}

.behavior-type {
  width: 100px;
  font-weight: bold;
  color: #2c3e50;
}

.behavior-bar {
  flex: 1;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
}

.behavior-fill {
  height: 100%;
  background: linear-gradient(90deg, #9b59b6, #8e44ad);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.behavior-count {
  width: 60px;
  text-align: right;
  font-weight: bold;
  color: #2c3e50;
}

.refresh-section {
  text-align: center;
  margin-top: 40px;
}

.refresh-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #219a52;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.last-update {
  display: block;
  margin-top: 10px;
  color: #7f8c8d;
  font-size: 14px;
}

.no-data {
  text-align: center;
  color: #7f8c8d;
  padding: 40px;
  font-style: italic;
}

@media (max-width: 768px) {
  .real-time-stats {
    grid-template-columns: 1fr;
  }
  
  .growth-chart {
    height: 150px;
  }
  
  .behavior-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .behavior-bar {
    width: 100%;
  }
}
</style>