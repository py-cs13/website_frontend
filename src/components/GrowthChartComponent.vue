<template>
  <div class="growth-chart-wrapper">
    <div v-if="hasRecords" class="chart-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['chart-tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-if="hasRecords" class="chart-content">
      <div class="chart-canvas">
        <Line :data="chartData" :options="chartOptions" />
      </div>
      <div class="chart-report">
        <h4>📊 生长趋势报告</h4>
        <div class="report-card" :class="reportResult.level">
          <div class="report-icon">{{ reportResult.icon }}</div>
          <div class="report-content">
            <p class="report-title">{{ reportResult.title }}</p>
            <p class="report-description">{{ reportResult.description }}</p>
            <div class="report-details">
              <div class="detail-item">
                <span class="detail-label">当前月龄</span>
                <span class="detail-value">{{ reportResult.currentAge }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ activeTab === 'weight' ? '体重' : activeTab === 'height' ? '身高' : '头围' }}</span>
                <span class="detail-value">{{ reportResult.currentValue }}{{ activeTab === 'weight' ? 'kg' : 'cm' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">百分位区间</span>
                <span class="detail-value">{{ reportResult.percentileRange }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">相比平均值</span>
                <span class="detail-value" :class="reportResult.compareClass">{{ reportResult.compareText }}</span>
              </div>
            </div>
            <p class="report-suggestion">{{ reportResult.suggestion }}</p>
          </div>
        </div>
      </div>
      <div class="chart-guide">
        <h4>📈 如何阅读生长曲线图</h4>
        <div class="guide-section">
          <p class="guide-title">📊 数据标准来源</p>
          <p class="guide-text">图表中的百分位曲线基于<strong>世界卫生组织（WHO）儿童生长标准</strong>，数据来源于WHO对全球多个国家健康儿童的长期追踪研究，是国际公认的生长发育参考标准。</p>
        </div>
        <div class="guide-section">
          <p class="guide-title">🎯 百分位曲线代表什么？</p>
          <ul class="guide-list">
            <li><span class="percentile">第3百分位</span> → 低于3%的同龄宝宝（偏轻/偏矮）</li>
            <li><span class="percentile">第10百分位</span> → 低于10%的同龄宝宝</li>
            <li><span class="percentile highlight">第50百分位</span> → 平均水平（中位数）</li>
            <li><span class="percentile">第90百分位</span> → 高于90%的同龄宝宝</li>
            <li><span class="percentile">第97百分位</span> → 高于97%的同龄宝宝（偏重/偏高）</li>
          </ul>
        </div>
        <div class="guide-section">
          <p class="guide-title">💡 举个例子：</p>
          <p class="guide-text">如果宝宝12个月时体重11公斤：</p>
          <ul class="guide-list" style="margin-top: 8px;">
            <li>• WHO第50百分位（中位数）：10.8公斤</li>
            <li>• WHO第90百分位：12.3公斤</li>
            <li>• 结论：11公斤处于第50-90百分位之间，属于<strong>正常偏上水平</strong>，非常健康！</li>
          </ul>
        </div>
        <div class="guide-section">
          <p class="guide-title">✨ 解读要点：</p>
          <ul class="guide-list">
            <li>• 第3-97百分位之间都属于正常范围</li>
            <li>• 关键看曲线趋势是否平稳增长</li>
            <li>• 突然大幅波动或持续下降需咨询医生</li>
            <li>• 定期测量，观察长期趋势更重要</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="chart-empty">
      <div class="empty-icon">📈</div>
      <p>暂无生长记录</p>
      <p class="empty-hint">添加测量记录后将显示生长曲线</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

const activeTab = ref('weight')

const tabs = [
  { key: 'weight', label: '体重 (kg)' },
  { key: 'height', label: '身高 (cm)' },
  { key: 'head', label: '头围 (cm)' }
]

const hasRecords = computed(() => props.records.length > 0)

const sortedRecords = computed(() => {
  return [...props.records].sort((a, b) => new Date(a.date) - new Date(b.date))
})

const WHO_STANDARDS = {
  weight: {
    '3rd': [3.2, 4.0, 4.7, 5.3, 5.8, 6.3, 6.7, 7.1, 7.5, 7.8, 8.1, 8.4],
    '10th': [3.5, 4.4, 5.2, 5.9, 6.5, 7.0, 7.5, 8.0, 8.4, 8.8, 9.2, 9.6],
    '50th': [3.9, 5.1, 6.0, 6.7, 7.3, 7.9, 8.5, 9.0, 9.5, 9.9, 10.4, 10.8],
    '90th': [4.4, 5.7, 6.7, 7.5, 8.2, 8.9, 9.5, 10.1, 10.7, 11.2, 11.8, 12.3],
    '97th': [4.7, 6.1, 7.2, 8.1, 8.9, 9.6, 10.3, 10.9, 11.5, 12.1, 12.7, 13.3]
  },
  height: {
    '3rd': [48.2, 52.0, 55.5, 58.5, 61.2, 63.7, 65.9, 68.0, 69.9, 71.7, 73.4, 75.0],
    '10th': [49.4, 53.5, 57.2, 60.4, 63.2, 65.8, 68.1, 70.3, 72.3, 74.2, 75.9, 77.6],
    '50th': [51.2, 55.8, 59.7, 63.1, 66.1, 68.9, 71.4, 73.8, 76.1, 78.3, 80.4, 82.4],
    '90th': [53.0, 58.1, 62.3, 65.9, 69.1, 72.1, 74.8, 77.4, 79.9, 82.3, 84.6, 86.9],
    '97th': [54.1, 59.5, 63.9, 67.7, 71.1, 74.2, 77.0, 79.7, 82.3, 84.8, 87.2, 89.6]
  },
  head: {
    '3rd': [33.0, 35.6, 37.7, 39.3, 40.7, 41.9, 42.9, 43.8, 44.6, 45.3, 45.9, 46.5],
    '10th': [33.7, 36.4, 38.6, 40.3, 41.7, 42.9, 44.0, 44.9, 45.7, 46.4, 47.0, 47.6],
    '50th': [34.9, 37.9, 40.1, 42.0, 43.5, 44.9, 46.0, 47.0, 47.9, 48.7, 49.4, 50.1],
    '90th': [36.1, 39.3, 41.7, 43.7, 45.3, 46.8, 48.0, 49.1, 50.0, 50.9, 51.6, 52.3],
    '97th': [36.8, 40.1, 42.6, 44.7, 46.4, 47.9, 49.2, 50.3, 51.3, 52.2, 53.0, 53.7]
  }
}

const chartColors = {
  baby: 'rgba(255, 107, 157, 1)',
  '3rd': 'rgba(156, 163, 175, 0.5)',
  '10th': 'rgba(156, 163, 175, 0.5)',
  '50th': 'rgba(34, 197, 94, 0.8)',
  '90th': 'rgba(156, 163, 175, 0.5)',
  '97th': 'rgba(156, 163, 175, 0.5)'
}

const calculateAgeInMonths = (birthDate, measurementDate) => {
  const birth = new Date(birthDate)
  const measurement = new Date(measurementDate)
  const months = measurement.getMonth() - birth.getMonth() + 
                 12 * (measurement.getFullYear() - birth.getFullYear())
  return Math.round(months)
}

const reportResult = computed(() => {
  if (!hasRecords.value || !sortedRecords.value[0]?.babyBirthDate) {
    return {
      icon: '📊',
      title: '数据不足',
      description: '请添加宝宝的出生日期和生长记录以生成报告',
      currentAge: '-',
      currentValue: '-',
      percentileRange: '-',
      compareText: '-',
      compareClass: '',
      suggestion: '',
      level: 'info'
    }
  }

  const latestRecord = sortedRecords.value[sortedRecords.value.length - 1]
  const ageInMonths = calculateAgeInMonths(latestRecord.babyBirthDate, latestRecord.date)
  
  let currentValue
  if (activeTab.value === 'weight') currentValue = latestRecord.weight
  else if (activeTab.value === 'height') currentValue = latestRecord.height
  else currentValue = latestRecord.headCircumference

  const standards = WHO_STANDARDS[activeTab.value]
  const maxIndex = Math.min(ageInMonths, standards['50th'].length - 1)
  
  const p3 = standards['3rd'][maxIndex]
  const p10 = standards['10th'][maxIndex]
  const p50 = standards['50th'][maxIndex]
  const p90 = standards['90th'][maxIndex]
  const p97 = standards['97th'][maxIndex]

  let percentile, level, icon, title, description, suggestion, compareText, compareClass

  if (currentValue < p3) {
    percentile = '低于第3百分位'
    level = 'warning'
    icon = '⚠️'
    title = '需要关注'
    description = `宝宝${activeTab.value === 'weight' ? '体重' : activeTab.value === 'height' ? '身高' : '头围'}低于同龄宝宝的第3百分位`
    suggestion = '建议咨询儿科医生，评估宝宝的营养摄入和生长发育情况'
  } else if (currentValue < p10) {
    percentile = '第3-10百分位'
    level = 'info'
    icon = '💬'
    title = '正常偏低'
    description = `宝宝${activeTab.value === 'weight' ? '体重' : activeTab.value === 'height' ? '身高' : '头围'}处于同龄宝宝的较低水平`
    suggestion = '继续保持观察，确保宝宝获得足够的营养和睡眠'
  } else if (currentValue < p50) {
    percentile = '第10-50百分位'
    level = 'good'
    icon = '😊'
    title = '正常'
    description = `宝宝${activeTab.value === 'weight' ? '体重' : activeTab.value === 'height' ? '身高' : '头围'}处于同龄宝宝的正常水平`
    suggestion = '宝宝生长发育正常，继续保持良好的喂养和护理习惯'
  } else if (currentValue < p90) {
    percentile = '第50-90百分位'
    level = 'excellent'
    icon = '🎉'
    title = '非常好'
    description = `宝宝${activeTab.value === 'weight' ? '体重' : activeTab.value === 'height' ? '身高' : '头围'}处于同龄宝宝的较高水平`
    suggestion = '宝宝生长发育非常健康，继续保持目前的喂养方式'
  } else if (currentValue <= p97) {
    percentile = '第90-97百分位'
    level = 'good'
    icon = '👍'
    title = '正常偏高'
    description = `宝宝${activeTab.value === 'weight' ? '体重' : activeTab.value === 'height' ? '身高' : '头围'}处于同龄宝宝的较高水平`
    suggestion = '继续保持观察，确保宝宝生长发育均衡'
  } else {
    percentile = '高于第97百分位'
    level = 'warning'
    icon = '⚠️'
    title = '需要关注'
    description = `宝宝${activeTab.value === 'weight' ? '体重' : activeTab.value === 'height' ? '身高' : '头围'}高于同龄宝宝的第97百分位`
    suggestion = '建议咨询儿科医生，评估宝宝的生长发育情况'
  }

  const diffPercent = ((currentValue - p50) / p50 * 100).toFixed(1)
  if (currentValue < p50) {
    compareText = `低于平均值 ${Math.abs(diffPercent)}%`
    compareClass = 'lower'
  } else if (currentValue > p50) {
    compareText = `高于平均值 ${diffPercent}%`
    compareClass = 'higher'
  } else {
    compareText = '等于平均值'
    compareClass = 'equal'
  }

  return {
    icon,
    title,
    description,
    currentAge: `${ageInMonths}个月`,
    currentValue: typeof currentValue === 'number' ? currentValue.toFixed(1) : '-',
    percentileRange: percentile,
    compareText,
    compareClass,
    suggestion,
    level
  }
})

const chartData = computed(() => {
  const labels = sortedRecords.value.map(r => formatDate(r.date))
  const currentData = WHO_STANDARDS[activeTab.value]
  
  const babyData = sortedRecords.value.map(r => {
    if (activeTab.value === 'weight') return r.weight
    if (activeTab.value === 'height') return r.height
    return r.headCircumference
  })

  const getStandardValue = (standardArray, record) => {
    if (!record.babyBirthDate) return null
    const months = calculateAgeInMonths(record.babyBirthDate, record.date)
    const index = Math.max(0, Math.min(months, standardArray.length - 1))
    return standardArray[index]
  }

  const p3Data = sortedRecords.value.map(r => getStandardValue(currentData['3rd'], r))
  const p10Data = sortedRecords.value.map(r => getStandardValue(currentData['10th'], r))
  const p50Data = sortedRecords.value.map(r => getStandardValue(currentData['50th'], r))
  const p90Data = sortedRecords.value.map(r => getStandardValue(currentData['90th'], r))
  const p97Data = sortedRecords.value.map(r => getStandardValue(currentData['97th'], r))

  return {
    labels,
    datasets: [
      {
        label: '宝宝数据',
        data: babyData,
        borderColor: chartColors.baby,
        backgroundColor: 'rgba(255, 107, 157, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: chartColors.baby,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.3
      },
      {
        label: '第3百分位',
        data: p3Data,
        borderColor: chartColors['3rd'],
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      },
      {
        label: '第10百分位',
        data: p10Data,
        borderColor: chartColors['10th'],
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      },
      {
        label: '第50百分位(平均)',
        data: p50Data,
        borderColor: chartColors['50th'],
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        pointRadius: 0
      },
      {
        label: '第90百分位',
        data: p90Data,
        borderColor: chartColors['90th'],
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      },
      {
        label: '第97百分位',
        data: p97Data,
        borderColor: chartColors['97th'],
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: '#666' }
    },
    y: {
      grid: { color: 'rgba(0, 0, 0, 0.05)' },
      ticks: { font: { size: 11 }, color: '#666' }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}))

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style scoped>
.growth-chart-wrapper {
  width: 100%;
  height: auto;
}

.chart-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
}

.chart-tab {
  padding: 6px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-tab:hover {
  border-color: rgba(255, 107, 157, 0.5);
  color: #FF6B9D;
}

.chart-tab.active {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border-color: #FF6B9D;
  color: white;
}

.chart-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-canvas {
  width: 100%;
  height: 250px;
}

.chart-report {
  margin-top: 10px;
}

.chart-report h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

.report-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid;
}

.report-card.info {
  border-left-color: #6366f1;
}

.report-card.good {
  border-left-color: #22c55e;
}

.report-card.excellent {
  border-left-color: #f59e0b;
}

.report-card.warning {
  border-left-color: #ef4444;
}

.report-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.report-content {
  flex: 1;
}

.report-title {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.report-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.report-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.detail-label {
  font-size: 13px;
  color: #888;
}

.detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.detail-value.higher {
  color: #22c55e;
}

.detail-value.lower {
  color: #f97316;
}

.detail-value.equal {
  color: #6366f1;
}

.report-suggestion {
  margin: 0;
  padding: 10px 12px;
  background: #f0fdf4;
  border-radius: 8px;
  font-size: 13px;
  color: #166534;
  line-height: 1.5;
}

.report-card.warning .report-suggestion {
  background: #fef2f2;
  color: #991b1b;
}

.report-card.info .report-suggestion {
  background: #eff6ff;
  color: #1e40af;
}

.chart-guide {
  background: linear-gradient(135deg, #fff5f8 0%, #fff0f5 100%);
  border-radius: 12px;
  padding: 16px;
  margin-top: 10px;
}

.chart-guide h4 {
  margin: 0 0 14px 0;
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

.guide-section {
  margin-bottom: 12px;
}

.guide-section:last-child {
  margin-bottom: 0;
}

.guide-title {
  margin: 0 0 8px 0;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.guide-list {
  margin: 0;
  padding-left: 16px;
  list-style: none;
}

.guide-list li {
  color: #666;
  font-size: 13px;
  line-height: 1.7;
  padding: 3px 0;
}

.percentile {
  display: inline-block;
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  margin-right: 8px;
}

.percentile.highlight {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
}

.guide-text {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.chart-empty p {
  margin: 4px 0;
  font-size: 14px;
}

.empty-hint {
  font-size: 12px !important;
  color: #bbb;
}
</style>
