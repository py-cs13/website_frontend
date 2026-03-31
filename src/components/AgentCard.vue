<template>
  <div class="agent-card">
    <div class="agent-icon">🤖</div>
    <div class="agent-content">
      <h3 class="agent-name">育儿健康助手</h3>
      <p class="agent-description">专业的育儿健康咨询AI助手，为您提供宝宝营养、健康、发育等方面的专业建议</p>
      <button class="use-btn" @click="openAgent">立即使用</button>
    </div>
  </div>
</template>

<script setup>
// 智能体卡片组件
const openAgent = () => {
  // 直接在新标签页打开扣子智能体链接
  window.open('https://www.coze.cn/store/agent/7618910253279002662?bot_id=true', '_blank')
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
  
  .agent-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>