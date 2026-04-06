<template>
  <div class="agent-card">
    <div class="agent-icon">🚑</div>
    <div class="agent-content">
      <h3 class="agent-name">新生儿紧急护理助手</h3>
      <p class="agent-description">新手父母的24小时贴身护理专家，提供秒级紧急响应、三级风险预警、个性化历史分析和多宝宝管理</p>
      <button class="use-btn" @click="navigateToAgent">立即使用</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToAgent = () => {
  router.push('/newborn-care-agent')
}
</script>

<style scoped>
.agent-card {
  background-color: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.agent-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

.agent-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}

.agent-content {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.agent-name {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.agent-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
  font-size: 0.95em;
  flex: 1;
}

.use-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: auto;
}

.use-btn:hover {
  background-color: #FF4785;
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agent-card {
    max-width: 100%;
    padding: 20px;
  }
  
  .agent-name {
    font-size: 1.3em;
  }
}
</style>