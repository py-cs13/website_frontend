<template>
  <div class="agent-card">
    <div class="agent-icon">🏥</div>
    <div class="agent-content">
      <h3 class="agent-name">产后科学恢复规划师</h3>
      <p class="agent-description">专业的产后恢复指导AI助手，为您提供科学的产后恢复方案、饮食建议和运动指导</p>
      <button class="use-btn" @click="openAgent">立即使用</button>
    </div>
  </div>
</template>

<script setup>
// 产后科学恢复规划师智能体卡片（占位卡片，链接为空）
const openAgent = () => {
  // 占位卡片，暂时没有实际链接
  console.log('产后科学恢复规划师智能体（占位卡片）')
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
}
</style>