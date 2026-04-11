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
      <div class="modal-content">
        <h3>{{ editingBaby ? '编辑宝宝信息' : '添加新宝宝' }}</h3>
        
        <div class="form-group">
          <label>宝宝姓名：</label>
          <input 
            v-model="newBaby.name" 
            type="text" 
            placeholder="请输入宝宝姓名"
            maxlength="20"
          />
        </div>
        
        <div class="form-group">
          <label>出生日期：</label>
          <input 
            v-model="newBaby.birthDate" 
            type="date" 
            placeholder="选择出生日期"
          />
          <small style="color: #666; font-size: 12px; margin-top: 4px; display: block;">
            当前年龄：{{ formatAge(newBaby.birthDate) }}
          </small>
        </div>
        
        <div class="form-group">
          <label>性别：</label>
          <select v-model="newBaby.gender">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        

        
        <div class="modal-actions">
          <button @click="showAddBabyModal = false; resetBabyForm()" class="cancel-btn">取消</button>
          <button @click="saveBaby" class="save-btn">{{ editingBaby ? '更新' : '保存' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NewbornCareAgent from '../components/NewbornCareAgent.vue'
import { apiClient as api } from '../utils/api'

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

// 选择宝宝
const selectBaby = (baby) => {
  currentBaby.value = baby
  // 这里可以加载宝宝的历史记录
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
      alert('删除宝宝失败，请重试')
    }
  }
}

// 添加或更新宝宝
const saveBaby = async () => {
  if (!newBaby.value.name.trim()) {
    alert('请输入宝宝姓名')
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
    alert('保存宝宝失败，请重试')
  }
}

// 重置宝宝表单
const resetBabyForm = () => {
  newBaby.value = {
    name: '',
    gender: '男',
    birthDate: ''
  }
  editingBaby.value = null
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
  min-height: 100vh;
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
  height: calc(100vh - 120px);
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
  height: calc(100vh - 120px);
  overflow: hidden;
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.baby-modal .modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.baby-modal h3 {
  margin: 0 0 20px 0;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn {
  flex: 1;
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #5a6268;
}

.save-btn {
  flex: 1;
  background: #ff69b4;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn:hover {
  background: #ff1493;
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
    height: calc(100vh - 200px);
  }
  
  .safety-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>