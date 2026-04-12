<template>
  <div class="newborn-care-agent">
    <!-- 当前宝宝信息 -->
    <div v-if="currentBaby" class="current-baby-info">
      <div class="baby-avatar">👶</div>
      <div class="baby-details">
        <h4>{{ currentBaby.name }}</h4>
        <span>{{ formatAge(currentBaby.birthDate) }}</span>
      </div>
    </div>



    <!-- 主界面 -->
    <div class="agent-container" :class="{ 'emergency-active': isEmergencyMode }">
      <!-- 对话区域 -->
      <div class="chat-container">
        <!-- 消息列表 -->
        <div class="messages-container" ref="messagesContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index" 
            :class="['message', message.type]"
          >
            <!-- 用户消息 -->
            <div v-if="message.type === 'user'" class="message-content user-message">
              <div class="message-bubble">
                <p>{{ message.content }}</p>
                <span class="message-time">{{ message.time }}</span>
              </div>
            </div>

            <!-- AI回复 -->
            <div v-else class="message-content ai-message">
              <div class="ai-avatar">🤖</div>
              <div class="message-bubble">
                <!-- 普通文本消息（如开场白） -->
                <div v-if="message.content && !message.personalizedAdvice" class="simple-message">
                  <p>{{ message.content }}</p>
                </div>
                
                <!-- 分析结果消息 -->
                <template v-else>
                  <!-- 思考过程展示 -->
                  <div v-if="message.thinkingProcess" class="thinking-process">
                    <div class="thinking-header" @click="toggleThinking(index)">
                      <span class="thinking-icon">💭</span>
                      <span class="thinking-title">思考过程</span>
                      <span class="thinking-toggle">{{ message.showThinking ? '收起' : '展开' }}</span>
                    </div>
                    <div v-show="message.showThinking" class="thinking-content">
                      <pre>{{ message.thinkingProcess }}</pre>
                    </div>
                  </div>

                  <!-- 问候语回复 - 简洁友好 -->
                  <div v-if="message.isGreeting" class="greeting-message">
                    <div class="greeting-content">
                      <p v-html="formatBoldText(message.personalizedAdvice)"></p>
                    </div>
                  </div>

                  <!-- 紧急情况回复 - 突出安全处理 -->
                  <div v-else-if="message.isEmergency" class="emergency-message">
                    <!-- 风险等级标识 -->
                    <div v-if="message.riskLevel" :class="['risk-badge', message.riskLevel]">
                      <span class="risk-icon">{{ getRiskIcon(message.riskLevel) }}</span>
                      <span class="risk-text">{{ getRiskText(message.riskLevel) }}</span>
                    </div>

                    <!-- 立即行动步骤 -->
                    <div v-if="message.immediateActions && message.immediateActions.length" class="action-steps">
                      <h5>立即行动：</h5>
                      <ol>
                        <li v-for="(action, actionIndex) in message.immediateActions" :key="actionIndex">
                          {{ action }}
                        </li>
                      </ol>
                    </div>

                    <!-- 个性化建议 -->
                    <div v-if="message.personalizedAdvice" class="personalized-advice">
                      <h5>专业建议：</h5>
                      <p v-html="formatBoldText(message.personalizedAdvice)"></p>
                    </div>

                    <!-- 就医时机 -->
                    <div v-if="message.whenToSeekHelp && message.whenToSeekHelp.length" class="seek-help">
                      <h5>何时需要就医：</h5>
                      <ul>
                        <li v-for="(condition, helpIndex) in message.whenToSeekHelp" :key="helpIndex">
                          {{ condition }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 一般育儿问题回复 - 专业详细 -->
                  <div v-else-if="message.isGeneralQuestion" class="general-question-message">
                    <!-- 个性化建议 -->
                    <div v-if="message.personalizedAdvice" class="personalized-advice">
                      <h5>专业建议：</h5>
                      <p v-html="formatBoldText(message.personalizedAdvice)"></p>
                    </div>

                    <!-- 就医时机（仅在必要时显示） -->
                    <div v-if="message.whenToSeekHelp && message.whenToSeekHelp.length" class="seek-help">
                      <h5>何时需要就医：</h5>
                      <ul>
                        <li v-for="(condition, helpIndex) in message.whenToSeekHelp" :key="helpIndex">
                          {{ condition }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 症状咨询回复 - 全面分析 -->
                  <div v-else class="symptom-consultation-message">
                    <!-- 风险等级标识 -->
                    <div v-if="message.riskLevel" :class="['risk-badge', message.riskLevel]">
                      <span class="risk-icon">{{ getRiskIcon(message.riskLevel) }}</span>
                      <span class="risk-text">{{ getRiskText(message.riskLevel) }}</span>
                    </div>

                    <!-- 个性化建议 -->
                    <div v-if="message.personalizedAdvice" class="personalized-advice">
                      <h5>专业建议：</h5>
                      <p v-html="formatBoldText(message.personalizedAdvice)"></p>
                    </div>

                    <!-- 历史上下文 -->
                    <div v-if="message.historicalContext" class="historical-context">
                      <p class="context-tip">📊 {{ message.historicalContext }}</p>
                    </div>

                    <!-- 安全警告 -->
                    <div v-if="message.safetyWarning" class="safety-warning">
                      <p>{{ message.safetyWarning }}</p>
                    </div>

                    <!-- 就医时机（仅在必要时显示） -->
                    <div v-if="message.whenToSeekHelp && message.whenToSeekHelp.length" class="seek-help">
                      <h5>何时需要就医：</h5>
                      <ul>
                        <li v-for="(condition, helpIndex) in message.whenToSeekHelp" :key="helpIndex">
                          {{ condition }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </template>

                <span class="message-time">{{ message.time }}</span>
                <span class="response-time" v-if="message.responseTime">
                  响应时间: {{ message.responseTime.toFixed(2) }}秒
                </span>
              </div>
            </div>
          </div>

          <!-- 实时思考过程展示（分析中） -->
          <div v-if="isLoading && currentThinking" class="message ai-message thinking-message">
            <div class="message-content ai-message">
              <div class="ai-avatar">🤖</div>
              <div class="message-bubble">
                <div class="thinking-process active">
                  <div class="thinking-header">
                    <span class="thinking-icon">💭</span>
                    <span class="thinking-title">正在深度思考...</span>
                    <span class="thinking-indicator">
                      <span class="dot"></span>
                      <span class="dot"></span>
                      <span class="dot"></span>
                    </span>
                  </div>
                  <div class="thinking-content active">
                    <pre>{{ currentThinking }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载指示器 -->
          <div v-if="isLoading && !currentThinking" class="loading-indicator">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>{{ analysisStatus || 'AI正在分析症状...' }}</p>
          </div>
        </div>
      </div>

      <!-- 输入区域 - 固定在底部 -->
      <div class="input-container">
        <div class="quick-symptoms">
          <span class="quick-label">快速描述：</span>
          <div class="quick-symptoms-tags">
            <button 
              v-for="symptom in quickSymptoms" 
              :key="symptom" 
              class="quick-symptom-btn"
              @click="selectQuickSymptom(symptom)"
            >
              {{ symptom }}
            </button>
          </div>
        </div>
        
        <div class="input-group">
          <textarea 
            v-model="userInput" 
            placeholder="请详细描述宝宝的症状，例如：宝宝突然呛奶，呼吸有点困难..."
            @keydown.enter.prevent="sendMessage"
            :disabled="isLoading"
            rows="2"
          ></textarea>
          <button 
            @click="sendMessage" 
            :disabled="!userInput.trim() || isLoading"
            class="send-btn"
          >
            {{ isLoading ? '分析中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { apiClient as api } from '../utils/api'

// 接收父组件传递的当前宝宝信息
const props = defineProps({
  currentBaby: {
    type: Object,
    default: null
  }
})

// 根据出生日期计算年龄
const formatAge = (birthDate) => {
  if (!birthDate) return '未知'
  
  const birth = new Date(birthDate)
  const now = new Date()
  
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + 
                 (now.getMonth() - birth.getMonth())
  
  if (months === 0) return '新生儿'
  if (months < 12) return `${months}个月`
  
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (remainingMonths === 0) return `${years}岁`
  return `${years}岁${remainingMonths}个月`
}

// 响应式数据
const userInput = ref('')
const isLoading = ref(false)
const isEmergencyMode = ref(false)
const messagesContainer = ref(null)
const analysisStatus = ref('')
const currentThinking = ref('')

// 快速症状描述
const quickSymptoms = [
  '呛奶呼吸困难', '发热38度', '腹泻呕吐', '皮肤红疹', '咳嗽不止', '哭闹不安'
]

// 消息记录
const messages = reactive([])

// 风险等级图标和文本
const getRiskIcon = (level) => {
  const icons = { '红色': '🔴', '黄色': '🟡', '绿色': '🟢' }
  return icons[level] || '⚪'
}

const getRiskText = (level) => {
  const texts = { 
    '红色': '紧急情况', 
    '黄色': '需要观察', 
    '绿色': '正常现象' 
  }
  return texts[level] || '待评估'
}

// 智能识别用户意图
const isGreetingMessage = (message) => {
  const greetingKeywords = ['你好', '您好', 'hello', 'hi', '在吗', '请问', '医生好', 
                          '大夫好', '老师好', '早上好', '下午好', '晚上好']
  return greetingKeywords.some(keyword => message.includes(keyword))
}

const isEmergencyMessage = (message) => {
  const emergencyKeywords = ['发烧', '高烧', '抽搐', '惊厥', '呼吸困难', '窒息', '昏迷', 
                           '严重呕吐', '便血', '吐血', '严重腹泻', '脱水', '过敏', 
                           '休克', '外伤', '烫伤', '中毒', '误食']
  return emergencyKeywords.some(keyword => message.includes(keyword))
}

const isGeneralQuestionMessage = (message) => {
  const generalKeywords = ['怎么办', '怎么处理', '如何', '什么原因', '为什么', '正常吗', 
                         '好不好', '可以吗', '需要吗', '建议', '推荐', '指导']
  const emergencyKeywords = ['发烧', '高烧', '抽搐', '惊厥', '呼吸困难']
  
  const hasGeneral = generalKeywords.some(keyword => message.includes(keyword))
  const hasEmergency = emergencyKeywords.some(keyword => message.includes(keyword))
  
  return hasGeneral && !hasEmergency
}

// 切换思考过程显示/隐藏
const toggleThinking = (index) => {
  if (messages[index]) {
    messages[index].showThinking = !messages[index].showThinking
  }
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  
  const userMessage = userInput.value.trim()
  userInput.value = ''
  
  // 添加用户消息
  addMessage('user', userMessage)
  
  // 发送到后端分析（使用流式API）
  isLoading.value = true
  currentThinking.value = ''
  
  try {
    await sendMessageStream(userMessage)
  } catch (error) {
    console.error('分析失败:', error)
    addMessage('ai', '', {
      riskLevel: '黄色',
      immediateActions: ['系统暂时无法响应，请稍后重试'],
      personalizedAdvice: '如情况紧急，请立即就医。',
      safetyWarning: '🟡 系统维护中，建议谨慎处理。'
    })
  } finally {
    isLoading.value = false
    currentThinking.value = ''
  }
}

// 使用流式API发送消息
const sendMessageStream = async (userMessage) => {
  const babyId = props.currentBaby ? props.currentBaby.id : 1
  
  // 构建对话历史（修复格式错误，确保每个轮次包含完整的用户和AI消息）
  const conversationHistory = []
  
  // 遍历消息，将相邻的用户消息和AI消息配对
  for (let i = 0; i < messages.length; i++) {
    const currentMsg = messages[i]
    
    if (currentMsg.type === 'user') {
      // 找到用户消息，查找下一个AI消息
      const aiMsg = messages.slice(i + 1).find(msg => msg.type === 'ai')
      
      if (aiMsg) {
        // 提取AI回复内容
        const aiContent = aiMsg.personalizedAdvice || aiMsg.content || ''
        
        conversationHistory.push({
          user: currentMsg.content || '',
          assistant: aiContent
        })
        
        // 跳过已配对的AI消息
        i = messages.findIndex(msg => msg === aiMsg)
      } else {
        // 如果没有对应的AI回复，只添加用户消息
        conversationHistory.push({
          user: currentMsg.content || '',
          assistant: ''
        })
      }
    }
  }
  
  // 只保留最近5轮对话
  const recentHistory = conversationHistory.slice(-5)
  
  // 调试日志：打印对话历史信息
  console.log('🔍 多轮对话调试信息:')
  console.log('当前消息数量:', messages ? messages.length : 0)
  console.log('过滤后的对话历史数量:', recentHistory.length)
  console.log('对话历史内容:', recentHistory)
  console.log('当前用户消息:', userMessage)
  console.log('---')
  
  try {
    // 使用fetch API发送POST请求（使用相对路径，通过Vite代理）
    const response = await fetch('/api/newborn-care/analyze-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        baby_id: babyId,
        symptom_description: userMessage,
        conversation_history: conversationHistory
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // 获取可读流
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    let thinkingProcess = ''
    let finalResult = null
    let buffer = ''
    
    // 读取流
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        break
      }
      
      // 解码数据
      buffer += decoder.decode(value, { stream: true })
      
      // 按行分割数据
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留最后一个不完整的行
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.substring(6)
          try {
            console.log('收到流式消息:', dataStr)
            const data = JSON.parse(dataStr)
            
            if (data.type === 'thinking') {
              // 实时更新思考过程
              thinkingProcess = data.full_thinking || data.content
              currentThinking.value = thinkingProcess
              
              // 滚动到底部
              nextTick(() => {
                if (messagesContainer.value) {
                  messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
                }
              })
            } else if (data.type === 'result') {
              // 智能解析AI回复内容
              const aiContent = data.data.personalized_advice || ''
              
              // 使用后端返回的风险等级作为主要依据
              const riskLevel = data.data.risk_level || '绿色'
              
              // 前端意图识别（与后端保持一致）
              const isEmergency = isEmergencyMessage(userMessage)
              const isGeneralQuestion = isGeneralQuestionMessage(userMessage)
              const isGreeting = isGreetingMessage(userMessage)
              
              // 优先级处理：紧急情况 > 一般问题 > 问候语（与后端保持一致）
              let finalIsEmergency = isEmergency
              let finalIsGeneralQuestion = isGeneralQuestion
              let finalIsGreeting = isGreeting
              
              if (isEmergency) {
                // 紧急情况优先级最高
                finalIsGreeting = false
                finalIsGeneralQuestion = false
                console.log('🚨 前端检测到紧急情况，优先级最高')
              } else if (isGeneralQuestion) {
                // 一般问题优先级中等
                finalIsGreeting = false
                console.log('📝 前端检测到一般问题，忽略问候语')
              }
              
              console.log(`🎯 前端意图识别结果 - 紧急: ${finalIsEmergency}, 一般问题: ${finalIsGeneralQuestion}, 问候语: ${finalIsGreeting}`)
              
              // 根据用户意图智能构建回复结构
              finalResult = {
                riskLevel: riskLevel,
                immediateActions: finalIsEmergency ? (data.data.immediate_actions || []) : [],
                personalizedAdvice: aiContent,
                whenToSeekHelp: finalIsEmergency || finalIsGeneralQuestion ? (data.data.when_to_seek_help || []) : [],
                historicalContext: data.data.historical_context || '',
                safetyWarning: data.data.safety_warning || '',
                responseTime: data.data.response_time || 0,
                thinkingProcess: thinkingProcess,
                showThinking: false,  // 默认收起思考过程，避免干扰
                isGreeting: finalIsGreeting,
                isEmergency: finalIsEmergency,
                isGeneralQuestion: finalIsGeneralQuestion
              }
              
              // 添加AI回复
              addMessage('ai', '', finalResult)
              
              // 清空思考过程
              currentThinking.value = ''
            } else if (data.type === 'error') {
              console.error('分析错误:', data.message)
              addMessage('ai', '', {
                riskLevel: '黄色',
                immediateActions: ['系统暂时无法响应，请稍后重试'],
                personalizedAdvice: '如情况紧急，请立即就医。',
                safetyWarning: '🟡 系统维护中，建议谨慎处理。'
              })
              
              // 清空思考过程
              currentThinking.value = ''
            }
          } catch (error) {
            console.error('解析流式响应失败:', error)
            console.error('原始消息:', dataStr)
          }
        }
      }
    }
    
    // 如果有思考过程但没有最终结果，使用思考过程作为回复
    if (thinkingProcess && !finalResult) {
      addMessage('ai', '', {
        riskLevel: '黄色',
        immediateActions: ['请稍后重试'],
        personalizedAdvice: '分析过程中断，请重新发送您的问题。',
        safetyWarning: '🟡 系统连接中断。',
        thinkingProcess: thinkingProcess,
        showThinking: true
      })
    }
    
  } catch (error) {
    console.error('流式连接错误:', error)
    
    addMessage('ai', '', {
      riskLevel: '黄色',
      immediateActions: ['系统暂时无法响应，请稍后重试'],
      personalizedAdvice: '如情况紧急，请立即就医。',
      safetyWarning: '🟡 系统维护中，建议谨慎处理。'
    })
  } finally {
    isLoading.value = false
    currentThinking.value = ''
  }
}

// 降级到传统API
const fallbackToTraditionalAPI = async (userMessage) => {
  try {
    // 设置分析状态
    analysisStatus.value = '正在使用备用分析方式...'
    
    // 构建对话历史（修复格式错误，确保每个轮次包含完整的用户和AI消息）
    const conversationHistory = []
    
    // 遍历消息，将相邻的用户消息和AI消息配对
    for (let i = 0; i < messages.length; i++) {
      const currentMsg = messages[i]
      
      if (currentMsg.type === 'user') {
        // 找到用户消息，查找下一个AI消息
        const aiMsg = messages.slice(i + 1).find(msg => msg.type === 'ai')
        
        if (aiMsg) {
          // 提取AI回复内容
          const aiContent = aiMsg.personalizedAdvice || aiMsg.content || ''
          
          conversationHistory.push({
            user: currentMsg.content || '',
            assistant: aiContent
          })
          
          // 跳过已配对的AI消息
          i = messages.findIndex(msg => msg === aiMsg)
        } else {
          // 如果没有对应的AI回复，只添加用户消息
          conversationHistory.push({
            user: currentMsg.content || '',
            assistant: ''
          })
        }
      }
    }
    
    // 只保留最近5轮对话
    const recentHistory = conversationHistory.slice(-5)
    
    // 调试日志：打印传统API的对话历史信息
    console.log('🔍 传统API多轮对话调试信息:')
    console.log('当前消息数量:', messages ? messages.length : 0)
    console.log('过滤后的对话历史数量:', recentHistory.length)
    console.log('对话历史内容:', recentHistory)
    console.log('当前用户消息:', userMessage)
    console.log('---')
    
    const response = await api.post('/newborn-care/analyze', {
      baby_id: props.currentBaby ? props.currentBaby.id : 1,
      symptom_description: userMessage,
      conversation_history: recentHistory
    })
    
    // 转换后端返回的数据格式为前端期望的格式
    const formattedResponse = {
      riskLevel: response.data.risk_level || '绿色',
      immediateActions: response.data.immediate_actions || [],
      personalizedAdvice: response.data.personalized_advice || '',
      whenToSeekHelp: response.data.when_to_seek_help || [],
      historicalContext: response.data.historical_context || '',
      safetyWarning: response.data.safety_warning || '',
      responseTime: response.data.response_time || 0
    }
    
    // 清空分析状态
    analysisStatus.value = ''
    
    // 添加AI回复
    addMessage('ai', '', formattedResponse)
  } catch (error) {
    console.error('传统API分析失败:', error)
    // 清空分析状态
    analysisStatus.value = ''
    addMessage('ai', '', {
      riskLevel: '黄色',
      immediateActions: ['系统暂时无法响应，请稍后重试'],
      personalizedAdvice: '如情况紧急，请立即就医。',
      safetyWarning: '🟡 系统维护中，建议谨慎处理。'
    })
  }
}

// 添加消息到对话记录
const addMessage = (type, content, analysisResult = {}) => {
  const message = {
    type,
    content,
    time: new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    ...analysisResult
  }
  
  messages.push(message)
  
  // 滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}



// 格式化加粗文本
const formatBoldText = (text) => {
  if (!text) return ''
  // 将 **内容** 转换为 <strong>内容</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

// 选择快速症状 - 直接获取预设回复
const selectQuickSymptom = async (symptom) => {
  // 添加用户消息
  addMessage('user', `宝宝${symptom}`)
  
  // 显示加载状态
  isLoading.value = true
  
  try {
    // 调用预设回复API（使用POST请求避免URL编码问题）
    const response = await api.post('/newborn-care/quick-symptom', {
      symptom_key: symptom
    })
    
    // 添加AI回复
    addMessage('ai', '', {
      riskLevel: response.data.risk_level,
      immediateActions: response.data.immediate_actions,
      personalizedAdvice: response.data.personalized_advice,
      whenToSeekHelp: response.data.when_to_seek_help,
      historicalContext: response.data.historical_context,
      safetyWarning: response.data.safety_warning,
      responseTime: response.data.response_time
    })
    
  } catch (error) {
    console.error('获取预设回复失败:', error)
    
    // 显示错误消息
    addMessage('ai', '', {
      riskLevel: '绿色',
      personalizedAdvice: '抱歉，获取预设回复失败。请尝试详细描述宝宝的症状，我会为您提供专业建议。',
      safetyWarning: '🟢 您也可以直接输入症状描述获取帮助。'
    })
  } finally {
    isLoading.value = false
  }
}

// 监听紧急指南选择事件
const handleEmergencyGuideSelected = (event) => {
  const { guide, symptom } = event.detail
  
  // 预填充输入框
  userInput.value = `宝宝${symptom}，请指导如何处理`
}

// 初始化欢迎消息和事件监听
onMounted(() => {
  // 添加简洁的开场白
  addMessage('ai', '您好！我是新生儿紧急护理助手，可以为您提供专业的宝宝健康指导。请描述宝宝的症状，我会为您分析并提供处理建议。')
  
  // 监听紧急指南选择事件
  window.addEventListener('emergency-guide-selected', handleEmergencyGuideSelected)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('emergency-guide-selected', handleEmergencyGuideSelected)
})
</script>

<style scoped>
.newborn-care-agent {
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
  max-height: 950px;
}

/* 当前宝宝信息样式 */
.current-baby-info {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 12px 16px;
  border-left: 4px solid #007bff;
  flex-shrink: 0;
}

.current-baby-info .baby-avatar {
  font-size: 24px;
  margin-right: 12px;
}

.current-baby-info .baby-details h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
}

.current-baby-info .baby-details span {
  color: #666;
  font-size: 14px;
}



/* 主容器 */
.agent-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.agent-container.emergency-active {
  background: #fff5f5;
}

/* 对话区域 */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
}

.message {
  margin-bottom: 16px;
}

.message-content {
  display: flex;
  align-items: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.user-message .message-bubble {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message .message-bubble {
  background: white;
  border: 1px solid #e9ecef;
  border-bottom-left-radius: 4px;
  /* 优化字体和间距 */
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: 0.2px;
  color: #2d3748;
}

.ai-avatar {
  font-size: 20px;
  margin-right: 10px;
  margin-top: 4px;
  flex-shrink: 0;
}

/* 思考过程样式 */
.thinking-process {
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.thinking-process.active {
  background: #e3f2fd;
  border-color: #90caf9;
}

.thinking-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.02);
  transition: background 0.2s;
}

.thinking-header:hover {
  background: rgba(0, 0, 0, 0.05);
}

.thinking-icon {
  font-size: 16px;
  margin-right: 8px;
}

.thinking-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #495057;
}

.thinking-toggle {
  font-size: 12px;
  color: #6c757d;
}

.thinking-indicator {
  display: flex;
  gap: 4px;
}

.thinking-indicator .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007bff;
  animation: bounce 1.4s infinite ease-in-out;
}

.thinking-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.thinking-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.thinking-content {
  padding: 12px;
  display: none;
}

.thinking-content.active {
  display: block;
}

.thinking-content pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #495057;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 风险等级标识 */
.risk-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
}

.risk-badge.红色 {
  background: #ff6b6b;
  color: white;
}

.risk-badge.黄色 {
  background: #ffd93d;
  color: #856404;
}

.risk-badge.绿色 {
  background: #51cf66;
  color: white;
}

.risk-icon {
  margin-right: 4px;
}

/* 内容区块样式 - 优化为更自然、舒适的显示效果 */
.action-steps,
.personalized-advice,
.historical-context,
.safety-warning,
.seek-help {
  margin: 12px 0;
}

/* 问候语回复样式 */
.greeting-message {
  margin: 12px 0;
}

.greeting-content {
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  padding: 12px 16px;
}

.greeting-content p {
  margin: 0;
  line-height: 1.6;
  font-size: 14px;
  color: #2d3748;
  letter-spacing: 0.2px;
}

/* 紧急情况回复样式 */
.emergency-message {
  margin: 12px 0;
}

/* 一般育儿问题回复样式 */
.general-question-message {
  margin: 12px 0;
}

/* 症状咨询回复样式 */
.symptom-consultation-message {
  margin: 12px 0;
}

/* 立即行动 - 突出显示 */
.action-steps {
  background: #fff8f8;
  border-left: 4px solid #ff4d4f;
  border-radius: 8px;
  padding: 12px 16px;
}

.action-steps h5 {
  margin: 0 0 8px 0;
  color: #d63031;
  font-size: 15px;
  font-weight: 600;
}

/* 专业建议 - 自然流畅 */
.personalized-advice {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
}

.personalized-advice h5 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 15px;
  font-weight: 600;
}

/* 就医时机 - 仅在必要时显示 */
.seek-help {
  background: #fff3cd;
  border-left: 4px solid #f39c12;
  border-radius: 8px;
  padding: 12px 16px;
}

.seek-help h5 {
  margin: 0 0 8px 0;
  color: #e67e22;
  font-size: 15px;
  font-weight: 600;
}

.action-steps ol,
.seek-help ul {
  margin: 0;
  padding-left: 20px;
}

.action-steps li,
.seek-help li {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: #2d3748;
}

.personalized-advice p {
  margin: 0;
  line-height: 1.6;
  font-size: 14px;
  white-space: pre-wrap;
  color: #2d3748;
  letter-spacing: 0.2px;
}

.personalized-advice p strong {
  font-weight: 600;
  color: #1a1a1a;
}

.context-tip {
  font-size: 13px;
  color: #6c757d;
  font-style: italic;
  margin: 0;
  line-height: 1.5;
}

.safety-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 12px 0;
}

.safety-warning p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #856404;
  line-height: 1.5;
}

.message-time {
  font-size: 11px;
  color: #adb5bd;
  margin-top: 6px;
  display: block;
}

.response-time {
  font-size: 10px;
  color: #6c757d;
  margin-left: 8px;
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
}

.loading-dots {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #007bff;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

.loading-indicator p {
  margin: 0;
  color: #6c757d;
  font-size: 13px;
}

/* 输入区域 - 固定在底部 */
.input-container {
  border-top: 1px solid #e9ecef;
  padding: 12px 16px;
  background: white;
  flex-shrink: 0;
}

.quick-symptoms {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  width: 100%;
}

.quick-label {
  font-size: 13px;
  color: #495057;
  font-weight: 500;
}

.quick-symptoms-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}

.quick-symptom-btn {
  background: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 16px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  white-space: nowrap;
}

.quick-symptom-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  box-shadow: 0 2px 6px rgba(0,123,255,0.4);
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.input-group textarea {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  min-height: 44px;
}

.input-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.send-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.send-btn:hover:not(:disabled) {
  background: #0056b3;
}

.send-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .newborn-care-agent {
    border-radius: 0;
    height: 100vh;
    max-height: none;
    margin: 0;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .send-btn {
    width: 100%;
  }
}
</style>
