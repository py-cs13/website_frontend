<template>
  <div class="agents-view">
    <div class="agents-container">
      <div class="agents-header">
        <h1>智能体工具</h1>
        <p>专业的育儿AI助手，帮助您解决育儿难题</p>
      </div>
      
      <div class="agents-grid">
        <AgentCard />
        <NewbornCareAgentCard />
        <DevelopmentMonitoringAgentCard />
      </div>
      
      <div class="coming-soon-section">
        <h3>更多智能体即将上线</h3>
        <p>我们正在积极开发更多专业的育儿AI助手，为您提供全方位的育儿支持</p>
        
        <div class="placeholder-grid">
          <div class="placeholder-card">
            <div class="placeholder-icon">🏥</div>
            <h4>产后科学恢复规划师</h4>
            <p>专业的产后恢复指导AI助手，为您提供科学的产后恢复方案</p>
          </div>
          

          
          <div class="placeholder-card">
            <div class="placeholder-icon">🎓</div>
            <h4>零基础家庭早教规划师</h4>
            <p>为新手父母提供家庭早教方案规划</p>
          </div>
          
          <div class="placeholder-card">
            <div class="placeholder-icon">🛍️</div>
            <h4>母婴用品避坑选购</h4>
            <p>帮助您避开母婴用品选购的常见陷阱</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AgentCard from '../components/AgentCard.vue'
import PostpartumAgentCard from '../components/PostpartumAgentCard.vue'
import NewbornCareAgentCard from '../components/NewbornCareAgentCard.vue'
import DevelopmentMonitoringAgentCard from '../components/DevelopmentMonitoringAgentCard.vue'
</script>

<style scoped>
.agents-view {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: var(--bg-secondary);
}

.agents-container {
  max-width: 1200px;
}

.agents-header {
  text-align: center;
  margin-bottom: 40px;
}

.agents-header h1 {
  font-size: 2.5em;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.agents-header p {
  font-size: 1.1em;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.coming-soon-section {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--border-color);
}

.coming-soon-section h3 {
  font-size: 1.8em;
  color: var(--text-primary);
  margin-bottom: 10px;
  text-align: center;
}

.coming-soon-section p {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.placeholder-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.placeholder-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.placeholder-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-light);
  opacity: 0.9;
}

.placeholder-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.placeholder-card h4 {
  font-size: 1.2em;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.placeholder-card p {
  color: var(--text-secondary);
  font-size: 0.9em;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agents-view {
    padding: 0.5rem;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .agents-header h1 {
    font-size: 1.5rem; /* 适中标题大小 */
    line-height: 1.4;
  }
  
  .agents-header p {
    font-size: 0.875rem; /* 适中描述大小 */
    line-height: 1.6;
  }
  
  .agents-grid {
    display: flex;
    flex-direction: column; /* 一列布局 */
    align-items: center; /* 居中对齐 */
    gap: 0.75rem; /* 合适的间距 */
    width: 100%;
    max-width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    justify-content: center; /* 内容居中 */
    margin: 0 auto; /* 容器居中 */
  }
  
  .agents-grid > * {
    width: 100%;
    max-width: 18rem; /* 合适的最大宽度，与首页统一 */
    min-height: 4.5rem; /* 合适的长方形高度，与首页统一 */
    background: white;
    border: 1px solid #f0f0f0;
    border-radius: 0.75rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }
  
  .coming-soon-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }
  
  .coming-soon-section h3 {
    font-size: 1.125rem; /* 适中标题大小 */
    line-height: 1.4;
  }
  
  .coming-soon-section p {
    font-size: 0.8125rem; /* 适中描述大小 */
    line-height: 1.6;
  }
  
  .placeholder-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 100%;
  }
  
  .placeholder-card {
    padding: 1.5rem 1rem;
    min-height: 5rem;
  }
  
  .placeholder-icon {
    font-size: 2rem; /* 适中图标大小 */
  }
  
  .placeholder-card h4 {
    font-size: 1rem; /* 适中标题大小 */
  }
  
  .placeholder-card p {
    font-size: 0.8125rem; /* 适中描述大小 */
  }
}
</style>