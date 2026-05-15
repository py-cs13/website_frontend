<template>
  <div class="development-monitoring-agent-view">
    <div class="agent-header">
      <h2>📊 宝宝发育监测与答疑</h2>
      <p>专业的宝宝发育监测和问题解答助手</p>
    </div>
    
    <div class="agent-content">
      <DevelopmentMonitoringAgent />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import DevelopmentMonitoringAgent from '../components/DevelopmentMonitoringAgent.vue'

onMounted(() => {
  console.log('Development Monitoring Agent View mounted')
})
</script>

<style scoped>
.development-monitoring-agent-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.agent-header {
  margin-bottom: 20px;
  text-align: center;
}

.agent-header h2 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.agent-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.agent-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>