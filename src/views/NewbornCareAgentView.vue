<template>
  <div class="newborn-care-agent-view">
    <!-- 导航栏 -->
    <div class="agent-navbar">
      <div class="nav-left">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          返回智能体
        </button>
      </div>
      
      <div class="nav-center">
        <h1>新生儿紧急护理助手</h1>
        <p>新手父母的24小时贴身护理专家</p>
      </div>
      
      <div class="nav-right">
        <div class="status-indicator">
          <span class="status-dot"></span>
          在线服务
        </div>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="agent-main">
      <!-- 左侧信息栏 -->
      <div class="sidebar">

        
        <div class="sidebar-section">
            <div class="section-header">
              <h3>宝宝健康档案</h3>
              <button class="add-baby-btn" @click="showAddBabyModal = true" title="添加宝宝">
                <span class="add-icon">+</span>
              </button>
            </div>
            <div class="baby-list">
            <div 
              v-for="baby in babies" 
              :key="baby.id"
              :class="['baby-item', { active: currentBaby?.id === baby.id }]"
              @click="selectBaby(baby)"
            >
              <div class="baby-avatar">👶</div>
              <div class="baby-info">
                <h4>{{ baby.name }}</h4>
                <span>{{ formatAge(baby.birthDate) }}</span>
              </div>
              <div class="baby-actions">
                <button class="edit-btn" @click.stop="editBaby(baby)" title="编辑">✏️</button>
                <button class="delete-btn" @click.stop="deleteBaby(baby)" title="删除">🗑️</button>
              </div>
            </div>
            <div v-if="babies.length === 0" class="no-babies">
              <p>暂无宝宝信息</p>
              <button @click="showAddBabyModal = true" class="add-first-baby">添加第一个宝宝</button>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h3>使用说明</h3>
          <div class="instructions">
            <p>💬 <strong>描述症状</strong>：详细描述宝宝的症状表现</p>
            <p>⚡ <strong>快速响应</strong>：AI秒级分析并提供指导</p>
            <p>🔴 <strong>风险预警</strong>：红色/黄色/绿色三级警报</p>
            <p>📊 <strong>历史分析</strong>：基于宝宝历史记录个性化建议</p>
          </div>
        </div>
      </div>
      
      <!-- 右侧对话区域 -->
      <div class="chat-area">
        <NewbornCareAgent :current-baby="currentBaby" />
      </div>
    </div>
    
    <!-- 安全提示 -->
    <div class="safety-footer">
      <div class="safety-content">
        <span class="warning-icon">⚠️</span>
        <p>
          <strong>安全提示：</strong>本助手提供的建议仅供参考，不能替代专业医疗诊断。
          紧急情况下请立即拨打120或前往医院就诊。
        </p>
      </div>
    </div>

    <!-- 添加/编辑宝宝模态框 -->
    <div v-if="showAddBabyModal" class="baby-modal">
      <div class="modal-overlay" @click="showAddBabyModal = false; resetBabyForm()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingBaby ? '编辑宝宝信息' : '添加新宝宝' }}</h3>
          <span class="modal-icon">👶</span>
        </div>
        
        <div class="form-container">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📝</span>
              宝宝姓名
            </label>
            <input 
              v-model="newBaby.name" 
              type="text" 
              placeholder="请输入宝宝姓名（最多20字）"
              maxlength="20"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📅</span>
              出生日期
            </label>
            <div class="modern-date-picker">
              <div 
                class="date-display"
                @click="showDatePicker = !showDatePicker"
                :class="{ active: showDatePicker }"
              >
                <span class="date-text">
                  {{ newBaby.birthDate ? formatDateDisplay(newBaby.birthDate) : '请选择出生日期' }}
                </span>
                <span class="calendar-icon">📅</span>
              </div>
              
              <div v-if="showDatePicker" class="date-picker-popup">
                <div class="date-picker-header">
                  <button @click="prevYear" class="nav-btn" title="上一年">«</button>
                  <button @click="prevMonth" class="nav-btn" title="上个月">‹</button>
                  <span class="current-month" @click="showYearSelector = !showYearSelector">
                    {{ currentMonthDisplay }}
                  </span>
                  <button @click="nextMonth" class="nav-btn" title="下个月">›</button>
                  <button @click="nextYear" class="nav-btn" title="下一年">»</button>
                </div>
                
                <!-- 年份选择器 -->
                <div v-if="showYearSelector" class="year-selector">
                  <div class="year-selector-header">
                    <button @click="prevDecade" class="nav-btn">«</button>
                    <span class="decade-range">{{ decadeStart }} - {{ decadeEnd }}</span>
                    <button @click="nextDecade" class="nav-btn">»</button>
                  </div>
                  <div class="year-grid">
                    <span 
                      v-for="year in decadeYears" 
                      :key="year"
                      :class="[
                        'year',
                        { 
                          'current-year': year === currentDate.getFullYear(),
                          'selected-year': year === selectedYear
                        }
                      ]"
                      @click="selectYear(year)"
                    >
                      {{ year }}
                    </span>
                  </div>
                </div>
                
                <div class="date-picker-weekdays">
                  <span v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" class="weekday">
                    {{ day }}
                  </span>
                </div>
                
                <div class="date-picker-days">
                  <span 
                    v-for="day in calendarDays" 
                    :key="day.date"
                    :class="[
                      'day',
                      { 
                        'other-month': !day.isCurrentMonth,
                        'today': day.isToday,
                        'selected': day.isSelected,
                        'disabled': day.isDisabled
                      }
                    ]"
                    @click="selectDate(day)"
                  >
                    {{ day.day }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="age-display" v-if="newBaby.birthDate">
              <span class="age-label">当前年龄：</span>
              <span class="age-value">{{ formatAge(newBaby.birthDate) }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">👦👧</span>
              性别
            </label>
            <div class="gender-selector">
              <label :class="['gender-option', { active: newBaby.gender === '男' }]">
                <input 
                  type="radio" 
                  v-model="newBaby.gender" 
                  value="男" 
                  hidden
                />
                <span class="gender-icon">👦</span>
                <span>男宝宝</span>
              </label>
              <label :class="['gender-option', { active: newBaby.gender === '女' }]">
                <input 
                  type="radio" 
                  v-model="newBaby.gender" 
                  value="女" 
                  hidden
                />
                <span class="gender-icon">👧</span>
                <span>女宝宝</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="showAddBabyModal = false; resetBabyForm()" class="cancel-btn">
            <span class="btn-icon">❌</span>
            取消
          </button>
          <button @click="saveBaby" class="save-btn">
            <span class="btn-icon">💾</span>
            {{ editingBaby ? '更新' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import NewbornCareAgent from '../components/NewbornCareAgent.vue'
import { apiClient as api } from '../utils/api'
import toast from '../utils/toast.js'

const router = useRouter()

// 响应式数据
const currentBaby = ref(null)
const babies = ref([])
const showAddBabyModal = ref(false)
const editingBaby = ref(null)
const newBaby = ref({
  name: '',
  gender: '男',
  birthDate: ''
})

// 风险等级图标
const getRiskIcon = (level) => {
  const icons = { '红色': '🔴', '黄色': '🟡', '绿色': '🟢' }
  return icons[level] || '⚪'
}

// 返回智能体列表
const goBack = () => {
  router.push('/agents')
}



// 获取风险等级对应的颜色
const getRiskColor = (level) => {
  const colors = { '红色': '#ff6b6b', '黄色': '#ffd93d', '绿色': '#51cf66' }
  return colors[level] || '#666'
}

// 根据出生日期计算年龄（月）
const calculateAge = (birthDate) => {
  if (!birthDate) return 0
  
  const birth = new Date(birthDate)
  const now = new Date()
  
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + 
                 (now.getMonth() - birth.getMonth())
  
  return Math.max(0, months)
}

// 格式化年龄显示
const formatAge = (birthDate) => {
  const months = calculateAge(birthDate)
  if (months === 0) return '新生儿'
  if (months < 12) return `${months}个月`
  
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (remainingMonths === 0) return `${years}岁`
  return `${years}岁${remainingMonths}个月`
}

// 选择宝宝（优化性能，避免不必要的重渲染）
const selectBaby = (baby) => {
  // 如果当前已经是选中的宝宝，避免重复设置
  if (currentBaby.value?.id === baby.id) return
  
  // 使用浅拷贝避免深度响应式
  currentBaby.value = { ...baby }
  
  // 这里可以加载宝宝的历史记录
  console.log(`切换到宝宝: ${baby.name}`)
}

// 编辑宝宝
const editBaby = (baby) => {
  editingBaby.value = baby
  newBaby.value = { ...baby }
  showAddBabyModal.value = true
}

// 删除宝宝
const deleteBaby = async (baby) => {
  if (confirm(`确定要删除宝宝"${baby.name}"吗？此操作不可撤销。`)) {
    try {
      await deleteBabyFromAPI(baby.id)
      
      // 如果删除的是当前选中的宝宝，切换到其他宝宝
      if (currentBaby.value?.id === baby.id) {
        currentBaby.value = babies.value[0] || null
      }
    } catch (error) {
      console.error('删除宝宝失败:', error)
      toast.error('删除宝宝失败，请重试')
    }
  }
}

// 添加或更新宝宝
const saveBaby = async () => {
  if (!newBaby.value.name.trim()) {
    toast.info('请输入宝宝姓名')
    return
  }
  
  try {
    const babyData = {
      name: newBaby.value.name,
      gender: newBaby.value.gender,
      birth_date: newBaby.value.birthDate
    }
    
    if (editingBaby.value) {
      // 更新现有宝宝
      await saveBabyToAPI(babyData, true, editingBaby.value.id)
    } else {
      // 添加新宝宝
      await saveBabyToAPI(babyData)
    }
    
    // 重置表单并关闭模态框
    resetBabyForm()
    showAddBabyModal.value = false
  } catch (error) {
    console.error('保存宝宝失败:', error)
    toast.error('保存宝宝失败，请重试')
  }
}

// 日期选择器相关状态
const showDatePicker = ref(false)
const showYearSelector = ref(false)
const currentDate = ref(new Date())
const selectedYear = ref(new Date().getFullYear())

// 重置宝宝表单
const resetBabyForm = () => {
  newBaby.value = {
    name: '',
    gender: '男',
    birthDate: ''
  }
  editingBaby.value = null
  showDatePicker.value = false
}

// 格式化日期显示
const formatDateDisplay = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取当前月份显示
const currentMonthDisplay = computed(() => {
  return `${currentDate.value.getFullYear()}年${currentDate.value.getMonth() + 1}月`
})

// 年份选择器相关计算属性
const decadeStart = computed(() => {
  const year = selectedYear.value
  return Math.floor(year / 10) * 10
})

const decadeEnd = computed(() => {
  return decadeStart.value + 9
})

const decadeYears = computed(() => {
  const years = []
  for (let i = decadeStart.value - 1; i <= decadeEnd.value + 1; i++) {
    years.push(i)
  }
  return years
})

// 生成日历天数
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 获取当月第一天
  const firstDay = new Date(year, month, 1)
  // 获取当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  // 获取当月第一天是星期几
  const firstDayOfWeek = firstDay.getDay()
  
  const days = []
  
  // 添加上个月的最后几天
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    days.push({
      day,
      date: new Date(year, month - 1, day).toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: true
    })
  }
  
  // 添加当月天数
  const today = new Date().toISOString().split('T')[0]
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i).toISOString().split('T')[0]
    const isToday = date === today
    const isSelected = date === newBaby.value.birthDate
    const isDisabled = date > today
    
    days.push({
      day: i,
      date,
      isCurrentMonth: true,
      isToday,
      isSelected,
      isDisabled
    })
  }
  
  // 添加下个月的前几天
  const nextMonthDays = 42 - days.length // 6行7列
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i).toISOString().split('T')[0]
    days.push({
      day: i,
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: date > today
    })
  }
  
  return days
})

// 选择日期
const selectDate = (day) => {
  if (day.isDisabled) return
  
  newBaby.value.birthDate = day.date
  showDatePicker.value = false
}

// 上个月
const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

// 下个月
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// 上一年
const prevYear = () => {
  currentDate.value = new Date(currentDate.value.getFullYear() - 1, currentDate.value.getMonth(), 1)
  selectedYear.value = currentDate.value.getFullYear()
}

// 下一年
const nextYear = () => {
  currentDate.value = new Date(currentDate.value.getFullYear() + 1, currentDate.value.getMonth(), 1)
  selectedYear.value = currentDate.value.getFullYear()
}

// 上一个十年
const prevDecade = () => {
  selectedYear.value = selectedYear.value - 10
}

// 下一个十年
const nextDecade = () => {
  selectedYear.value = selectedYear.value + 10
}

// 选择年份
const selectYear = (year) => {
  selectedYear.value = year
  currentDate.value = new Date(year, currentDate.value.getMonth(), 1)
  showYearSelector.value = false
}

// 从后端API加载宝宝数据
const loadBabiesFromAPI = async () => {
  try {
    const response = await api.get('/newborn-care/babies')
    babies.value = response.data.map(baby => ({
      id: baby.id,
      name: baby.name,
      gender: baby.gender,
      birthDate: baby.birth_date
    }))
    if (babies.value.length > 0) {
      currentBaby.value = babies.value[0]
    }
  } catch (error) {
    console.error('从API加载宝宝数据失败:', error)
  }
}

// 保存宝宝到后端API
const saveBabyToAPI = async (babyData, isUpdate = false, babyId = null) => {
  try {
    if (isUpdate && babyId) {
      // 更新现有宝宝
      await api.put(`/newborn-care/babies/${babyId}`, babyData)
    } else {
      // 创建新宝宝
      await api.post('/newborn-care/babies', babyData)
    }
    // 重新加载宝宝列表
    await loadBabiesFromAPI()
  } catch (error) {
    console.error('保存宝宝数据失败:', error)
    throw error
  }
}

// 从后端API删除宝宝
const deleteBabyFromAPI = async (babyId) => {
  try {
    await api.delete(`/newborn-care/babies/${babyId}`)
    // 重新加载宝宝列表
    await loadBabiesFromAPI()
  } catch (error) {
    console.error('删除宝宝数据失败:', error)
    throw error
  }
}

// 加载数据
const loadData = async () => {
  try {
    // 从后端API加载宝宝数据
    await loadBabiesFromAPI()
    
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.newborn-care-agent-view {
  flex: 1;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.agent-navbar {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-left {
  flex: 1;
}

.back-btn {
  background: #ff69b4;
  border: 2px solid #ff1493;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  color: white;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.3);
}

.back-btn:hover {
  background: #ff1493;
  border-color: #c71585;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.4);
  transform: translateY(-1px);
}

.back-icon {
  font-size: 20px;
  font-weight: bold;
}

.nav-center {
  flex: 2;
  text-align: center;
}

.nav-center h1 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: #ff69b4;
}

.nav-center p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4caf50;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 主内容区域 */
.agent-main {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 侧边栏样式 */
.sidebar {
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 24px;
  overflow-y: auto;
  min-height: 500px;
}

.sidebar-section {
  margin-bottom: 32px;
}

.sidebar-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-left: 3px solid #ff69b4;
  padding-left: 12px;
}



/* 宝宝列表 */
.baby-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.baby-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.baby-item:hover {
  background: #f8f9fa;
}

.baby-item.active {
  border-color: #ff69b4;
  background: rgba(255, 105, 180, 0.05);
}

.baby-avatar {
  font-size: 20px;
  margin-right: 12px;
}

.baby-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.baby-info span {
  color: #666;
  font-size: 12px;
}

/* 使用说明 */
.instructions p {
  margin: 0 0 8px 0;
  font-size: 13px;
  line-height: 1.4;
  color: #666;
}

/* 对话区域 */
.chat-area {
  background: #f8f9fa;
  padding: 0;
  min-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 安全提示 */
.safety-footer {
  background: #fff3cd;
  border-top: 1px solid #ffeaa7;
  padding: 12px 24px;
}

/* 宝宝管理相关样式 */
.section-header {
  display: flex;
  align-items: flex-start; /* 改为顶部对齐 */
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  line-height: 28px; /* 与按钮高度保持一致 */
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.add-baby-btn {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(255, 105, 180, 0.3);
  line-height: 1;
  height: 28px;
}

.add-baby-btn:hover {
  background: linear-gradient(135deg, #ff1493, #c71585);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.4);
}

.add-baby-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(255, 105, 180, 0.3);
}

.baby-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #e9ecef;
}

.delete-btn:hover {
  background: #ff6b6b;
  color: white;
}

.no-babies {
  text-align: center;
  padding: 20px;
  color: #666;
}

.add-first-baby {
  background: #ff69b4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
}

.add-first-baby:hover {
  background: #ff1493;
}

/* 添加/编辑宝宝模态框 */
.baby-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.baby-modal .modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid #e9ecef;
  position: relative;
  z-index: 1002;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(255, 105, 180, 0.2);
}

.modal-header h3 {
  margin: 0;
  color: #ff69b4;
  font-size: 24px;
  font-weight: 700;
}

.modal-icon {
  font-size: 32px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #ff69b4;
  font-size: 16px;
}

.label-icon {
  font-size: 18px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #ffe4e9;
  border-radius: 12px;
  font-size: 15px;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #ff69b4;
  box-shadow: 0 0 0 4px rgba(255, 105, 180, 0.1);
  transform: translateY(-1px);
}

/* 现代日期选择器样式 */
.modern-date-picker {
  position: relative;
}

.date-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

.date-display:hover {
  border-color: #ffb6c1;
}

.date-display.active {
  border-color: #ff69b4;
  box-shadow: 0 0 0 4px rgba(255, 105, 180, 0.1);
}

.date-text {
  color: #495057;
}

.date-text:empty::before {
  content: '请选择出生日期';
  color: #6c757d;
  font-style: italic;
}

.calendar-icon {
  color: #ff69b4;
  font-size: 18px;
}

.date-picker-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #ff69b4;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
  padding: 12px;
  max-height: 320px;
  overflow-y: auto;
}

.date-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 2px;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #ff69b4;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  min-width: 28px;
}

.nav-btn:hover {
  background: rgba(255, 105, 180, 0.1);
  transform: scale(1.05);
}

.current-month {
  font-weight: 600;
  color: #ff69b4;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.current-month:hover {
  background: rgba(255, 105, 180, 0.1);
}

.date-picker-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 6px;
}

.weekday {
  text-align: center;
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
  padding: 2px;
}

.date-picker-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.day:hover:not(.disabled) {
  background: rgba(255, 105, 180, 0.1);
}

.day.other-month {
  color: #adb5bd;
}

.day.today {
  background: rgba(255, 105, 180, 0.2);
  color: #ff69b4;
  font-weight: 600;
}

.day.selected {
  background: #ff69b4;
  color: white;
  font-weight: 600;
}

.day.disabled {
  color: #dee2e6;
  cursor: not-allowed;
}

/* 年份选择器样式 */
.year-selector {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.year-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.decade-range {
  font-weight: 600;
  color: #ff69b4;
  font-size: 12px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.year {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
  background: #f8f9fa;
}

.year:hover {
  background: rgba(255, 105, 180, 0.1);
  transform: scale(1.05);
}

.year.current-year {
  background: rgba(255, 105, 180, 0.2);
  color: #ff69b4;
  font-weight: 600;
}

.year.selected-year {
  background: #ff69b4;
  color: white;
  font-weight: 600;
}

.age-display {
  margin-top: 8px;
  padding: 10px 12px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  font-size: 14px;
  border-left: 4px solid #ff69b4;
}

.age-label {
  color: #495057;
  font-weight: 500;
}

.age-value {
  color: #ff1493;
  font-weight: 600;
}

.gender-selector {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 2px solid #ffe4e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.gender-option:hover {
  border-color: #ffb6c1;
  transform: translateY(-2px);
}

.gender-option.active {
  border-color: #ff69b4;
  background: rgba(255, 105, 180, 0.05);
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2);
}

.gender-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.modal-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.cancel-btn, .save-btn {
  flex: 1;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #6c757d;
  border: 2px solid #e9ecef;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
}

.save-btn {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  border: 2px solid transparent;
}

.save-btn:hover {
  background: linear-gradient(135deg, #ff1493, #c71585);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

.btn-icon {
  font-size: 18px;
}

.safety-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1400px;
  margin: 0 auto;
}

.warning-icon {
  font-size: 20px;
}

.safety-content p {
  margin: 0;
  font-size: 14px;
  color: #856404;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .agent-main {
    grid-template-columns: 250px 1fr;
  }
}

@media (max-width: 768px) {
  .agent-navbar {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
  }
  
  .nav-left, .nav-center, .nav-right {
    flex: none;
    width: 100%;
    text-align: center;
  }
  
  .agent-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .sidebar {
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
  
  .chat-area {
    min-height: 400px;
  }
  
  .safety-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>