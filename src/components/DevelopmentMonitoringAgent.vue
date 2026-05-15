<template>
  <div class="development-monitoring-agent">
    <!-- 宝宝管理区域 -->
    <div class="baby-management">
      <div class="baby-selector">
        <div class="baby-list">
          <button 
            v-for="baby in babies" 
            :key="baby.id"
            :class="['baby-item', { active: currentBaby?.id === baby.id }]"
            @click="switchBaby(baby)"
          >
            <span class="baby-avatar" :class="{ 'boy': baby.gender === '男', 'girl': baby.gender === '女' }">
              {{ baby.gender === '男' ? '♂' : baby.gender === '女' ? '♀' : '👶' }}
            </span>
            <div class="baby-info">
              <span class="baby-name">{{ baby.name }}</span>
              <span class="baby-age">{{ formatAge(baby.birthDate) }}</span>
            </div>
            <div class="baby-actions">
              <button 
                class="edit-baby-btn" 
                @click.stop="openEditBabyModal(baby)"
                title="编辑宝宝"
              >✏️</button>
              <button 
                class="delete-baby-btn" 
                @click.stop="confirmDeleteBaby(baby)"
                title="删除宝宝"
              >🗑️</button>
            </div>
          </button>
        </div>
        <button class="add-baby-btn" @click="showAddBabyModal = true">
          <span class="add-icon">+</span>
          <span>添加宝宝</span>
        </button>
      </div>
    </div>

    <!-- 主界面 -->
    <div class="agent-container">
      <!-- 功能选择区 - 左侧 -->
      <div class="function-sidebar">
        <button 
          v-for="tab in functionTabs" 
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 发育记录标签页 -->
        <div v-if="activeTab === 'milestone'" class="tab-content">
          <div class="module-content">
            <h3>发育里程碑记录</h3>
            <div class="milestone-intro">
              <p>📝 请勾选宝宝已经完成的发育里程碑，系统将根据这些数据进行发育评估</p>
            </div>
            <div class="milestone-categories">
              <button 
                v-for="category in milestoneCategories" 
                :key="category.id"
                :class="['category-btn', { active: activeMilestoneCategory === category.id }]"
                @click="handleCategoryClick(category.id)"
              >
                {{ category.icon }} {{ category.name }}
              </button>
            </div>
            <div class="milestone-list">
              <!-- 系统预设里程碑 -->
              <div class="preset-section">
                <h4 class="preset-title">🎯 系统预设里程碑</h4>
                <p class="preset-desc">点击添加宝宝已经完成的发育里程碑</p>
                <div class="milestone-grid">
                  <div 
                    v-for="milestone in filteredPresetMilestones" 
                    :key="milestone.id"
                    :class="['milestone-card', { completed: milestone.completed }]"
                    @click="toggleMilestone(milestone)"
                  >
                    <div class="milestone-icon">
                      <span v-if="milestone.completed">✓</span>
                      <span v-else>+</span>
                    </div>
                    <div class="milestone-content">
                      <div class="milestone-header">
                        <h4 class="milestone-name">{{ milestone.name }}</h4>
                        <span class="milestone-age">{{ milestone.ageRange }}</span>
                      </div>
                      <p class="milestone-description">{{ milestone.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 用户自定义里程碑 -->
              <div class="custom-section">
                <h4 class="custom-title">✨ 自定义里程碑</h4>
                <div class="milestone-grid">
                  <div 
                    v-for="milestone in filteredCustomMilestones" 
                    :key="milestone.id"
                    class="milestone-card custom-milestone"
                  >
                    <div class="milestone-content">
                      <div class="milestone-header">
                        <h4 class="milestone-name">{{ milestone.name }}</h4>
                        <span class="milestone-age">{{ milestone.ageRange }}</span>
                      </div>
                      <p class="milestone-description">{{ milestone.description }}</p>
                    </div>
                    <div class="milestone-actions">
                      <button class="milestone-action-btn edit-btn" @click.stop="editMilestone(milestone)">
                        编辑
                      </button>
                      <button class="milestone-action-btn delete-btn" @click.stop="deleteMilestone(milestone.id)">
                        删除
                      </button>
                    </div>
                  </div>
                  <div v-if="filteredCustomMilestones.length === 0" class="no-custom">
                    <p>暂无自定义里程碑</p>
                    <button class="add-custom-btn" @click="showAddMilestoneModal = true">+ 添加</button>
                  </div>
                </div>
              </div>
            </div>
            <button class="add-milestone-btn" @click="showAddMilestoneModal = true">
              + 添加自定义里程碑
            </button>
          </div>
          <!-- 底部操作区域 -->
          <div class="input-container">
            <div class="quick-questions">
              <div class="quick-label">快速操作</div>
              <div class="quick-questions-tags">
                <button class="quick-question-tag" @click="showAddMilestoneModal = true">
                  添加里程碑
                </button>
                <button class="quick-question-tag" @click="handleCategoryClick('all')">
                  查看所有
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 生长曲线标签页 -->
        <div v-if="activeTab === 'growth'" class="tab-content">
          <div class="module-content">
            <h3>生长曲线分析</h3>
            <div id="growth-form-section" class="growth-form">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">📅</span>
                  测量日期
                </label>
                <div class="modern-date-picker">
                  <div
                    class="date-display"
                    @click="showGrowthDatePicker = !showGrowthDatePicker"
                    :class="{ active: showGrowthDatePicker }"
                  >
                    <span class="date-text">
                      {{ newGrowthRecord.date ? formatDateDisplay(newGrowthRecord.date) : '请选择测量日期' }}
                    </span>
                    <span class="calendar-icon">📅</span>
                  </div>

                  <div v-if="showGrowthDatePicker" class="date-picker-popup">
                    <div class="date-picker-header">
                      <button @click="prevGrowthYear" class="nav-btn" title="上一年">«</button>
                      <button @click="prevGrowthMonth" class="nav-btn" title="上个月">‹</button>
                      <span class="current-month" @click="showGrowthYearSelector = !showGrowthYearSelector">
                        {{ growthCurrentMonthDisplay }}
                      </span>
                      <button @click="nextGrowthMonth" class="nav-btn" title="下个月">›</button>
                      <button @click="nextGrowthYear" class="nav-btn" title="下一年">»</button>
                    </div>

                    <!-- 年份选择器 -->
                    <div v-if="showGrowthYearSelector" class="year-selector">
                      <div class="year-selector-header">
                        <button @click="prevGrowthDecade" class="nav-btn">«</button>
                        <span class="decade-range">{{ growthDecadeStart }} - {{ growthDecadeEnd }}</span>
                        <button @click="nextGrowthDecade" class="nav-btn">»</button>
                      </div>
                      <div class="year-grid">
                        <span
                          v-for="year in growthDecadeYears"
                          :key="year"
                          :class="[
                            'year',
                            {
                              'current-year': year === currentDate.getFullYear(),
                              'selected-year': year === growthSelectedYear
                            }
                          ]"
                          @click="selectGrowthYear(year)"
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
                        v-for="day in growthCalendarDays"
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
                        @click="selectGrowthDate(day)"
                      >
                        {{ day.day }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">📏</span>
                  身高 (cm)
                </label>
                <input type="number" v-model.number="newGrowthRecord.height" placeholder="请输入身高" class="form-input" step="0.1" />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">⚖️</span>
                  体重 (kg)
                </label>
                <input type="number" v-model.number="newGrowthRecord.weight" placeholder="请输入体重" class="form-input" step="0.1" />
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🔵</span>
                  头围 (cm)
                </label>
                <input type="number" v-model.number="newGrowthRecord.headCircumference" placeholder="请输入头围（可选）" class="form-input" step="0.1" />
              </div>
              <button class="add-growth-btn" @click="addGrowthRecord">
                添加记录
              </button>
            </div>
            <div class="growth-chart">
              <h4>生长趋势</h4>
              <div class="chart-container">
                <GrowthChartComponent :records="growthRecords" />
              </div>
            </div>
            <div class="growth-records">
              <h4>历史记录</h4>
              <div class="records-list">
                <div 
                  v-for="record in paginatedRecords" 
                  :key="record.id"
                  class="growth-record-item"
                >
                  <span class="record-date">{{ record.date }}</span>
                  <span class="record-data">身高: {{ record.height }}cm</span>
                  <span class="record-data">体重: {{ record.weight }}kg</span>
                  <span class="record-data">头围: {{ record.headCircumference }}cm</span>
                  <div class="record-actions">
                    <button class="action-btn edit" @click="openEditGrowthRecord(record)">✏️ 编辑</button>
                    <button class="action-btn delete" @click="confirmDeleteGrowthRecord(record)">🗑️ 删除</button>
                  </div>
                </div>
              </div>
              <div class="records-pagination" v-if="totalPages > 1">
                <button 
                  class="page-btn" 
                  @click="goToPrevPage" 
                  :disabled="currentPage === 1"
                >
                  上一页
                </button>
                <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                <button 
                  class="page-btn" 
                  @click="goToNextPage" 
                  :disabled="currentPage === totalPages"
                >
                  下一页
                </button>
                <div class="page-jump">
                  <input 
                    type="number" 
                    v-model.number="jumpToPage" 
                    @keyup.enter="jumpToPageSubmit"
                    min="1"
                    :max="totalPages"
                    class="page-input"
                    placeholder="页码"
                  />
                  <button class="jump-btn" @click="jumpToPageSubmit">
                    跳转
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 底部操作区域 -->
          <div class="input-container">
            <div class="quick-questions">
              <div class="quick-label">快速操作</div>
              <div class="quick-questions-tags">
                <button class="quick-question-tag" @click="scrollToGrowthForm">
                  添加记录
                </button>
                <button class="quick-question-tag" @click="clearGrowthForm">
                  清空表单
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 发育评估标签页 -->
        <div v-if="activeTab === 'assessment'" class="tab-content">
          <div class="module-content">
            <h3>发育评估</h3>
            
            <!-- 评估引导说明 -->
            <div class="assessment-guide">
              <h4>📊 评估数据来源说明</h4>
              <div class="guide-cards">
                <div class="guide-card">
                  <div class="guide-icon">👶</div>
                  <div class="guide-content">
                    <h5>宝宝基本信息</h5>
                    <p>包含宝宝姓名、性别、出生日期，用于计算宝宝年龄</p>
                  </div>
                </div>
                <div class="guide-card">
                  <div class="guide-icon">📈</div>
                  <div class="guide-content">
                    <h5>生长曲线数据</h5>
                    <p>包含身高、体重、头围测量记录，评估生长发育情况</p>
                    <button class="guide-action" @click="activeTab = 'growth'">立即添加 →</button>
                  </div>
                </div>
                <div class="guide-card">
                  <div class="guide-icon">🎯</div>
                  <div class="guide-content">
                    <h5>发育里程碑</h5>
                    <p>包含大运动、精细动作、语言、社交、认知等能力完成情况</p>
                    <button class="guide-action" @click="activeTab = 'milestone'">立即添加 →</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="assessment-form">
              <p>点击下方按钮开始发育评估，系统将根据宝宝的发育情况进行综合分析。</p>
              <button class="start-assessment-btn" @click="startAssessment">
                开始评估
              </button>
            </div>
            <div v-if="assessmentResult" class="assessment-result">
              <h4>评估结果</h4>
              <div class="result-overview">
                <div class="result-item">
                  <span class="result-label">发育水平</span>
                  <span class="result-value">{{ assessmentResult.overallLevel }}</span>
                </div>
                <div class="result-item">
                  <span class="result-label">综合评分</span>
                  <span class="result-value">{{ assessmentResult.score }}/100</span>
                </div>
              </div>
              <div class="domain-results">
                <h5>各领域评估</h5>
                <div 
                  v-for="domain in assessmentResult.domains" 
                  :key="domain.name"
                  class="domain-item"
                >
                  <span class="domain-name">{{ domain.name }}</span>
                  <span class="domain-score">{{ domain.score }}/100</span>
                  <div class="domain-progress">
                    <div 
                      class="progress-bar" 
                      :style="{ width: domain.score + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="assessment-advice">
                <h5>建议</h5>
                <p>{{ assessmentResult.advice }}</p>
              </div>
            </div>
          </div>
          <!-- 底部操作区域 -->
          <div class="input-container">
            <div class="quick-questions">
              <div class="quick-label">快速操作</div>
              <div class="quick-questions-tags">
                <button class="quick-question-tag" @click="startAssessment">
                  开始评估
                </button>
                <button class="quick-question-tag" @click="resetAssessment">
                  重置评估
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 智能问答标签页 -->
        <div v-if="activeTab === 'qa'" class="tab-content">
          <div class="module-content">
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

                    <!-- 问候语回复 -->
                    <div v-if="message.isGreeting" class="greeting-message">
                      <div class="greeting-content">
                        <p v-html="formatBoldText(message.personalizedAdvice)"></p>
                      </div>
                    </div>

                    <!-- 发育问题回复 -->
                    <div v-else class="development-message">
                      <!-- 个性化建议 -->
                      <div v-if="message.personalizedAdvice" class="personalized-advice">
                        <h5>专业建议：</h5>
                        <p v-html="formatBoldText(message.personalizedAdvice)"></p>
                      </div>

                      <!-- 历史上下文 -->
                      <div v-if="message.historicalContext" class="historical-context">
                        <p class="context-tip">📊 {{ message.historicalContext }}</p>
                      </div>

                      <!-- 风险等级指示 -->
                      <div v-if="message.riskLevel" :class="['risk-indicator', message.riskLevel]">
                        <span class="risk-icon">{{ message.riskLevel === 'red' ? '🔴' : message.riskLevel === 'yellow' ? '🟡' : '🟢' }}</span>
                        <span class="risk-text">
                          {{ message.riskLevel === 'red' ? '紧急' : message.riskLevel === 'yellow' ? '注意' : '安全' }}
                        </span>
                      </div>

                      <!-- 安全警告 -->
                      <div v-if="message.safetyWarning" :class="['safety-warning', message.riskLevel]">
                        <p>{{ message.safetyWarning }}</p>
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
              <p>{{ analysisStatus || 'AI正在分析问题...' }}</p>
            </div>
            </div>
          </div>

          <!-- 输入区域 - 固定在底部 -->
          <div class="input-container">
            <div class="quick-questions">
              <span class="quick-label">快速提问：</span>
              <div class="quick-questions-tags">
                <button 
                  v-for="question in quickQuestions" 
                  :key="question"
                  class="quick-question-btn"
                  @click="selectQuickQuestion(question)"
                >
                  {{ question }}
                </button>
              </div>
            </div>
            
            <div class="input-group">
              <textarea 
                v-model="userInput" 
                placeholder="请描述您的问题，例如：我的宝宝10个月还不会爬，正常吗？"
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
    </div>

    <!-- 添加宝宝模态框 -->
    <div v-if="showAddBabyModal" class="modal-overlay" @click.self="showAddBabyModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>添加新宝宝</h3>
          <button class="close-btn" @click="showAddBabyModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📝</span>
              宝宝姓名
            </label>
            <input type="text" v-model="newBaby.name" placeholder="请输入宝宝姓名" class="form-input" />
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
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAddBabyModal = false">取消</button>
          <button class="confirm-btn" @click="addBaby">添加</button>
        </div>
      </div>
    </div>

    <!-- 编辑宝宝模态框 -->
    <div v-if="showEditBabyModal" class="modal-overlay" @click.self="showEditBabyModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>编辑宝宝信息</h3>
          <button class="close-btn" @click="showEditBabyModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📝</span>
              宝宝姓名
            </label>
            <input type="text" v-model="editBaby.name" placeholder="请输入宝宝姓名" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📅</span>
              出生日期
            </label>
            <div class="modern-date-picker">
              <div
                class="date-display"
                @click="showEditDatePicker = !showEditDatePicker"
                :class="{ active: showEditDatePicker }"
              >
                <span class="date-text">
                  {{ editBaby.birthDate ? formatDateDisplay(editBaby.birthDate) : '请选择出生日期' }}
                </span>
                <span class="calendar-icon">📅</span>
              </div>

              <div v-if="showEditDatePicker" class="date-picker-popup">
                <div class="date-picker-header">
                  <button @click="editPrevYear" class="nav-btn" title="上一年">«</button>
                  <button @click="editPrevMonth" class="nav-btn" title="上个月">‹</button>
                  <span class="current-month" @click="showEditYearSelector = !showEditYearSelector">
                    {{ editCurrentMonthDisplay }}
                  </span>
                  <button @click="editNextMonth" class="nav-btn" title="下个月">›</button>
                  <button @click="editNextYear" class="nav-btn" title="下一年">»</button>
                </div>

                <!-- 年份选择器 -->
                <div v-if="showEditYearSelector" class="year-selector">
                  <div class="year-selector-header">
                    <button @click="prevDecade" class="nav-btn">«</button>
                    <span class="decade-range">{{ editDecadeStart }} - {{ editDecadeEnd }}</span>
                    <button @click="nextDecade" class="nav-btn">»</button>
                  </div>
                  <div class="year-grid">
                    <span
                      v-for="year in editDecadeYears"
                      :key="year"
                      :class="[
                        'year',
                        {
                          'current-year': year === editCurrentDate.getFullYear(),
                          'selected-year': year === editSelectedYear
                        }
                      ]"
                      @click="editSelectYear(year)"
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
                    v-for="day in editCalendarDays"
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
                    @click="editSelectDate(day)"
                  >
                    {{ day.day }}
                  </span>
                </div>
              </div>
            </div>

            <div class="age-display" v-if="editBaby.birthDate">
              <span class="age-label">当前年龄：</span>
              <span class="age-value">{{ formatAge(editBaby.birthDate) }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">👦👧</span>
              性别
            </label>
            <div class="gender-selector">
              <label :class="['gender-option', { active: editBaby.gender === '男' }]">
                <input
                  type="radio"
                  v-model="editBaby.gender"
                  value="男"
                  hidden
                />
                <span class="gender-icon">👦</span>
                <span>男宝宝</span>
              </label>
              <label :class="['gender-option', { active: editBaby.gender === '女' }]">
                <input
                  type="radio"
                  v-model="editBaby.gender"
                  value="女"
                  hidden
                />
                <span class="gender-icon">👧</span>
                <span>女宝宝</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showEditBabyModal = false">取消</button>
          <button class="confirm-btn" @click="updateBaby">保存</button>
        </div>
      </div>
    </div>
  </div>

    <!-- 编辑生长记录模态框 -->
    <div v-if="showEditGrowthModal" class="modal-overlay" @click.self="showEditGrowthModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>编辑生长记录</h3>
          <button class="close-btn" @click="showEditGrowthModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📅</span>
              测量日期
            </label>
            <input type="date" v-model="editGrowthRecord.date" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📏</span>
              身高 (cm)
            </label>
            <input type="number" v-model="editGrowthRecord.height" placeholder="请输入身高" class="form-input" step="0.1" />
          </div>
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">⚖️</span>
              体重 (kg)
            </label>
            <input type="number" v-model="editGrowthRecord.weight" placeholder="请输入体重" class="form-input" step="0.1" />
          </div>
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🔵</span>
              头围 (cm)
            </label>
            <input type="number" v-model="editGrowthRecord.headCircumference" placeholder="请输入头围（可选）" class="form-input" step="0.1" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showEditGrowthModal = false">取消</button>
          <button class="confirm-btn" @click="updateGrowthRecord">保存</button>
        </div>
      </div>
    </div>

  <!-- 添加自定义里程碑模态框 -->
  <div v-if="showAddMilestoneModal" class="modal-overlay" @click.self="showAddMilestoneModal = false">
    <div class="modal-content">
      <div class="modal-header">
        <h3>添加自定义里程碑</h3>
        <button class="close-btn" @click="showAddMilestoneModal = false">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🏷️</span>
            里程碑名称
          </label>
          <input
            v-model="newMilestone.name"
            type="text"
            class="form-input"
            placeholder="例如：会说3个单词"
          />
        </div>
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📝</span>
            描述
          </label>
          <textarea
            v-model="newMilestone.description"
            class="form-textarea"
            placeholder="详细描述这个里程碑"
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📅</span>
            参考月龄
          </label>
          <input
            v-model="newMilestone.ageRange"
            type="text"
            class="form-input"
            placeholder="例如：12-18个月"
          />
        </div>
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🏷️</span>
            所属领域
          </label>
          <div class="category-selector">
            <button
              v-for="category in milestoneCategories"
              :key="category.id"
              :class="['category-option', { active: newMilestone.category === category.id }]"
              @click="newMilestone.category = category.id"
            >
              {{ category.icon }} {{ category.name }}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="showAddMilestoneModal = false">取消</button>
        <button class="confirm-btn" @click="addMilestone">添加</button>
      </div>
    </div>
  </div>

  <!-- 编辑里程碑模态框 -->
  <div v-if="showEditMilestoneModal" class="modal-overlay" @click.self="showEditMilestoneModal = false">
    <div class="modal-content">
      <div class="modal-header">
        <h3>编辑里程碑</h3>
        <button class="close-btn" @click="showEditMilestoneModal = false">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🏷️</span>
            里程碑名称
          </label>
          <input
            v-model="editingMilestone.name"
            type="text"
            class="form-input"
            placeholder="例如：会说3个单词"
          />
        </div>
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📝</span>
            描述
          </label>
          <textarea
            v-model="editingMilestone.description"
            class="form-textarea"
            placeholder="详细描述这个里程碑"
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📅</span>
            参考月龄
          </label>
          <input
            v-model="editingMilestone.ageRange"
            type="text"
            class="form-input"
            placeholder="例如：12-18个月"
          />
        </div>
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🏷️</span>
            所属领域
          </label>
          <div class="category-selector">
            <button
              v-for="category in milestoneCategories"
              :key="category.id"
              :class="['category-option', { active: editingMilestone.category === category.id }]"
              @click="editingMilestone.category = category.id"
            >
              {{ category.icon }} {{ category.name }}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="showEditMilestoneModal = false">取消</button>
        <button class="confirm-btn" @click="updateMilestone">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import GrowthChartComponent from './GrowthChartComponent.vue'
import { apiClient as api } from '../utils/api'
import toast from '../utils/toast.js'
import Swal from 'sweetalert2'

// 创建带认证的fetch请求
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
  return fetch(url, { ...options, headers })
}

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
const activeTab = ref('milestone')
const activeMilestoneCategory = ref('grossMotor')
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const analysisStatus = ref('')
const currentThinking = ref('')
const showAddMilestoneModal = ref(false)
const assessmentResult = ref(null)
const showAddBabyModal = ref(false)
const showEditBabyModal = ref(false)

// 新里程碑数据
const newMilestone = reactive({
  name: '',
  description: '',
  ageRange: '',
  category: 'grossMotor'
})

// 宝宝列表
const babies = ref([])

// 当前宝宝
let currentBaby = ref(babies.value[0])

// 新宝宝表单
const newBaby = reactive({
  name: '',
  birthDate: '',
  gender: '男'
})

// 编辑宝宝表单
const editBaby = reactive({
  id: null,
  name: '',
  birthDate: '',
  gender: '男'
})

// 编辑日期选择器相关状态
const showEditDatePicker = ref(false)
const showEditYearSelector = ref(false)
const editCurrentDate = ref(new Date())

// 编辑里程碑模态框状态
const showEditMilestoneModal = ref(false)

// 编辑里程碑表单
const editingMilestone = reactive({
  id: null,
  name: '',
  description: '',
  ageRange: '',
  category: ''
})

const editSelectedYear = ref(new Date().getFullYear())

// 日期选择器相关状态
const showDatePicker = ref(false)
const showYearSelector = ref(false)
const currentDate = ref(new Date())
const selectedYear = ref(new Date().getFullYear())

// 生长曲线日期选择器相关状态
const showGrowthDatePicker = ref(false)
const showGrowthYearSelector = ref(false)
const growthCurrentDate = ref(new Date())
const growthSelectedYear = ref(new Date().getFullYear())

// 格式化日期显示
const formatDateDisplay = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化日期为 YYYY-MM-DD 格式（本地时间）
const formatDate = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

// 获取今天的日期字符串（本地时间）
const getTodayString = () => {
  const today = new Date()
  return formatDate(today.getFullYear(), today.getMonth(), today.getDate())
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

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDay.getDay()

  const days = []

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    days.push({
      day,
      date: formatDate(year, month - 1, day),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: true
    })
  }

  const today = getTodayString()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = formatDate(year, month, i)
    const isToday = date === today
    const isSelected = date === newBaby.birthDate
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

  const nextMonthDays = 42 - days.length
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = formatDate(year, month + 1, i)
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
  newBaby.birthDate = day.date
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

// 编辑日期选择器相关计算属性
const editCurrentMonthDisplay = computed(() => {
  return `${editCurrentDate.value.getFullYear()}年${editCurrentDate.value.getMonth() + 1}月`
})

const editDecadeStart = computed(() => {
  const year = editSelectedYear.value
  return Math.floor(year / 10) * 10
})

const editDecadeEnd = computed(() => {
  return editDecadeStart.value + 9
})

const editDecadeYears = computed(() => {
  const years = []
  for (let i = editDecadeStart.value - 1; i <= editDecadeEnd.value + 1; i++) {
    years.push(i)
  }
  return years
})

const editCalendarDays = computed(() => {
  const year = editCurrentDate.value.getFullYear()
  const month = editCurrentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDay.getDay()

  const days = []

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    days.push({
      day,
      date: formatDate(year, month - 1, day),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: true
    })
  }

  const today = getTodayString()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = formatDate(year, month, i)
    const isToday = date === today
    const isSelected = date === editBaby.birthDate
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

  const nextMonthDays = 42 - days.length
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = formatDate(year, month + 1, i)
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

// 编辑选择日期
const editSelectDate = (day) => {
  if (day.isDisabled) return
  editBaby.birthDate = day.date
  showEditDatePicker.value = false
}

// 生长曲线日期选择器相关计算属性
const growthCurrentMonthDisplay = computed(() => {
  return `${growthCurrentDate.value.getFullYear()}年${growthCurrentDate.value.getMonth() + 1}月`
})

const growthDecadeStart = computed(() => {
  const year = growthSelectedYear.value
  return Math.floor(year / 10) * 10
})

const growthDecadeEnd = computed(() => {
  return growthDecadeStart.value + 9
})

const growthDecadeYears = computed(() => {
  const years = []
  for (let i = growthDecadeStart.value - 1; i <= growthDecadeEnd.value + 1; i++) {
    years.push(i)
  }
  return years
})

// 生成生长曲线日历天数
const growthCalendarDays = computed(() => {
  const year = growthCurrentDate.value.getFullYear()
  const month = growthCurrentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDay.getDay()

  const days = []

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    days.push({
      day,
      date: formatDate(year, month - 1, day),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      isDisabled: true
    })
  }

  const today = getTodayString()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = formatDate(year, month, i)
    const isToday = date === today
    const isSelected = date === newGrowthRecord.date
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

  const nextMonthDays = 42 - days.length
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = formatDate(year, month + 1, i)
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

// 生长曲线选择日期
const selectGrowthDate = (day) => {
  if (day.isDisabled) return
  newGrowthRecord.date = day.date
  showGrowthDatePicker.value = false
}

// 生长曲线日期选择器导航函数
const prevGrowthMonth = () => {
  growthCurrentDate.value = new Date(growthCurrentDate.value.getFullYear(), growthCurrentDate.value.getMonth() - 1, 1)
}

const nextGrowthMonth = () => {
  growthCurrentDate.value = new Date(growthCurrentDate.value.getFullYear(), growthCurrentDate.value.getMonth() + 1, 1)
}

const prevGrowthYear = () => {
  growthCurrentDate.value = new Date(growthCurrentDate.value.getFullYear() - 1, growthCurrentDate.value.getMonth(), 1)
  growthSelectedYear.value = growthCurrentDate.value.getFullYear()
}

const nextGrowthYear = () => {
  growthCurrentDate.value = new Date(growthCurrentDate.value.getFullYear() + 1, growthCurrentDate.value.getMonth(), 1)
  growthSelectedYear.value = growthCurrentDate.value.getFullYear()
}

const prevGrowthDecade = () => {
  growthSelectedYear.value = growthSelectedYear.value - 10
}

const nextGrowthDecade = () => {
  growthSelectedYear.value = growthSelectedYear.value + 10
}

const selectGrowthYear = (year) => {
  growthSelectedYear.value = year
  growthCurrentDate.value = new Date(year, growthCurrentDate.value.getMonth(), 1)
  showGrowthYearSelector.value = false
}

// 编辑日期选择器导航函数
const editPrevMonth = () => {
  editCurrentDate.value = new Date(editCurrentDate.value.getFullYear(), editCurrentDate.value.getMonth() - 1, 1)
}

const editNextMonth = () => {
  editCurrentDate.value = new Date(editCurrentDate.value.getFullYear(), editCurrentDate.value.getMonth() + 1, 1)
}

const editPrevYear = () => {
  editCurrentDate.value = new Date(editCurrentDate.value.getFullYear() - 1, editCurrentDate.value.getMonth(), 1)
  editSelectedYear.value = editCurrentDate.value.getFullYear()
}

const editNextYear = () => {
  editCurrentDate.value = new Date(editCurrentDate.value.getFullYear() + 1, editCurrentDate.value.getMonth(), 1)
  editSelectedYear.value = editCurrentDate.value.getFullYear()
}

// 编辑选择年份
const editSelectYear = (year) => {
  editSelectedYear.value = year
  editCurrentDate.value = new Date(year, editCurrentDate.value.getMonth(), 1)
  showEditYearSelector.value = false
}

// 打开编辑宝宝模态框
const openEditBabyModal = (baby) => {
  editBaby.id = baby.id
  editBaby.name = baby.name
  editBaby.birthDate = baby.birthDate
  editBaby.gender = baby.gender
  // 设置日期选择器的当前日期为宝宝的出生日期
  if (baby.birthDate) {
    const birth = new Date(baby.birthDate)
    editCurrentDate.value = new Date(birth.getFullYear(), birth.getMonth(), 1)
    editSelectedYear.value = birth.getFullYear()
  }
  // 初始化日期选择器为关闭状态
  showEditDatePicker.value = false
  showEditYearSelector.value = false
  showEditBabyModal.value = true
}

// 更新宝宝信息
const updateBaby = async () => {
  if (!editBaby.name || !editBaby.birthDate) {
    toast.info('请填写宝宝姓名和出生日期')
    return
  }

  try {
    const response = await fetchWithAuth(`/api/development-monitoring/babies/${editBaby.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: editBaby.name,
        gender: editBaby.gender,
        birth_date: editBaby.birthDate
      })
    })

    if (response.ok) {
      const updatedBaby = await response.json()

      // 更新本地列表
      const index = babies.value.findIndex(b => b.id === editBaby.id)
      if (index > -1) {
        babies.value[index] = {
          id: updatedBaby.id,
          name: updatedBaby.name,
          birthDate: updatedBaby.birth_date,
          gender: updatedBaby.gender,
          age: updatedBaby.age
        }

        // 如果更新的是当前选中的宝宝，更新currentBaby
        if (currentBaby.value?.id === editBaby.id) {
          currentBaby.value = babies.value[index]
          saveCurrentBaby()
        }
      }

      showEditBabyModal.value = false
      toast.success('宝宝信息更新成功')
    } else {
      toast.error('更新宝宝信息失败')
    }
  } catch (error) {
    console.error('更新宝宝信息失败:', error)
    toast.error('更新宝宝信息失败')
  }
}

// 切换宝宝
const switchBaby = (baby) => {
  currentBaby.value = baby
  // 保存当前选择
  saveCurrentBaby()
  // 重新加载对应宝宝的数据
  loadMilestones()
  loadGrowthRecords()
  loadAssessments()
}

// 确认删除宝宝
const confirmDeleteBaby = async (baby) => {
  const result = await Swal.fire({
    title: '确认删除',
    text: `确定要删除宝宝"${baby.name}"吗？此操作不可撤销。`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FF6B9D',
    cancelButtonColor: '#ccc',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消'
  })
  
  if (result.isConfirmed) {
    deleteBaby(baby)
  }
}

// 删除宝宝
const deleteBaby = async (baby) => {
  try {
    const response = await fetchWithAuth(`/api/development-monitoring/babies/${baby.id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      // 从本地列表中移除
      const index = babies.value.findIndex(b => b.id === baby.id)
      if (index > -1) {
        babies.value.splice(index, 1)
      }
      
      // 如果删除的是当前选中的宝宝，切换到其他宝宝
      if (currentBaby.value?.id === baby.id) {
        currentBaby.value = babies.value.length > 0 ? babies.value[0] : null
        if (currentBaby.value) {
          saveCurrentBaby()
          loadMilestones()
          loadGrowthRecords()
          loadAssessments()
        }
      }
      
      toast.success('宝宝删除成功')
    } else {
      throw new Error('删除失败')
    }
  } catch (error) {
    console.error('删除宝宝失败:', error)
    toast.error('删除宝宝失败，请重试')
  }
}

// 加载宝宝数据
const loadBabies = async () => {
  try {
    const response = await fetchWithAuth('/api/development-monitoring/babies')
    
    if (response.ok) {
      const data = await response.json()
      babies.value = data.map(baby => ({
        id: baby.id,
        name: baby.name,
        birthDate: baby.birth_date,
        gender: baby.gender,
        age: baby.age
      }))
      
      // 如果有宝宝数据，选择第一个或者从localStorage读取
      if (babies.value.length > 0) {
        const savedBabyId = localStorage.getItem('currentBabyId')
        if (savedBabyId) {
          const savedBaby = babies.value.find(b => b.id === parseInt(savedBabyId))
          if (savedBaby) {
            currentBaby.value = savedBaby
          } else {
            currentBaby.value = babies.value[0]
          }
        } else {
          currentBaby.value = babies.value[0]
        }
      }
    }
  } catch (error) {
    console.error('加载宝宝数据失败:', error)
  }
}

// 保存当前选择的宝宝
const saveCurrentBaby = () => {
  if (currentBaby.value) {
    localStorage.setItem('currentBabyId', currentBaby.value.id.toString())
  }
}

// 添加宝宝
const addBaby = async () => {
  if (!newBaby.name || !newBaby.birthDate) {
    toast.info('请填写宝宝姓名和出生日期')
    return
  }
  
  try {
    const response = await fetchWithAuth('/api/development-monitoring/babies', {
      method: 'POST',
      body: JSON.stringify({
        name: newBaby.name,
        gender: newBaby.gender,
        birth_date: newBaby.birthDate
      })
    })
    
    if (response.ok) {
      const savedBaby = await response.json()
      
      // 添加到本地列表
      babies.value.push({
        id: savedBaby.id,
        name: savedBaby.name,
        birthDate: savedBaby.birth_date,
        gender: savedBaby.gender,
        age: savedBaby.age
      })
      
      // 切换到新宝宝
      currentBaby.value = babies.value[babies.value.length - 1]
      
      // 保存当前选择
      saveCurrentBaby()
      
      // 重置表单
      newBaby.name = ''
      newBaby.birthDate = ''
      newBaby.gender = '男'
      
      showAddBabyModal.value = false
      
      // 加载新宝宝的数据
      loadMilestones()
      loadGrowthRecords()
      loadAssessments()
    } else {
      toast.error('添加宝宝失败')
    }
  } catch (error) {
    console.error('添加宝宝失败:', error)
    toast.error('添加宝宝失败')
  }
}

// 功能标签
const functionTabs = [
  { id: 'milestone', name: '发育里程碑', icon: '🎯' },
  { id: 'growth', name: '生长曲线', icon: '📊' },
  { id: 'assessment', name: '发育评估', icon: '📋' },
  { id: 'qa', name: '智能问答', icon: '💬' }
]

// 里程碑分类
const milestoneCategories = [
  { id: 'grossMotor', name: '大运动', icon: '🏃' },
  { id: 'fineMotor', name: '精细动作', icon: '👋' },
  { id: 'language', name: '语言', icon: '🗣️' },
  { id: 'social', name: '社交', icon: '🤝' },
  { id: 'cognitive', name: '认知', icon: '🧠' }
]

// 里程碑数据
const milestones = reactive([])

// 过滤后的里程碑
const filteredMilestones = ref([])

// 过滤后的预设里程碑
const filteredPresetMilestones = computed(() => {
  if (activeMilestoneCategory.value === 'all') {
    return milestones.filter(m => m.id <= 20)
  }
  return milestones.filter(m => m.id <= 20 && m.category === activeMilestoneCategory.value)
})

// 过滤后的自定义里程碑
const filteredCustomMilestones = computed(() => {
  if (activeMilestoneCategory.value === 'all') {
    return milestones.filter(m => m.id > 20)
  }
  return milestones.filter(m => m.id > 20 && m.category === activeMilestoneCategory.value)
})

// 加载里程碑数据
const loadMilestones = async () => {
  try {
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    const response = await fetchWithAuth(`/api/development-monitoring/milestones/${babyId}`)
    
    if (response.ok) {
      const data = await response.json()
      milestones.length = 0
      
      // 先加载预设里程碑
      await loadPresetMilestonesToMemory()
      
      // 然后加载用户自定义里程碑
      data.forEach(milestone => {
        // 检查是否是预设里程碑（通过名称和分类匹配）
        const existingPreset = milestones.find(m => 
          m.name === milestone.name && m.category === milestone.category && m.id <= 20
        )
        
        if (existingPreset) {
          // 更新预设里程碑的完成状态
          existingPreset.id = milestone.id  // 使用数据库中的真实ID
          existingPreset.completed = milestone.completed === true || milestone.completed === 'true'
        } else {
          // 添加为自定义里程碑（ID大于20）
          milestones.push({
            id: milestone.id,
            category: milestone.category,
            name: milestone.name,
            description: milestone.description,
            ageRange: milestone.age_range,
            completed: milestone.completed === true || milestone.completed === 'true'
          })
        }
      })
    } else {
      // 如果没有里程碑数据，只加载预设里程碑
      await loadPresetMilestones()
    }
  } catch (error) {
    console.error('加载里程碑失败:', error)
    // 加载预设里程碑作为备选
    await loadPresetMilestones()
  }
}

// 加载预设里程碑到内存（不清空现有数据）
const loadPresetMilestonesToMemory = async () => {
  try {
    const response = await fetchWithAuth('/api/development-monitoring/preset-milestones')
    
    if (response.ok) {
      const data = await response.json()
      data.forEach((milestone, index) => {
        // 检查是否已存在
        const exists = milestones.find(m => 
          m.name === milestone.name && m.category === milestone.category
        )
        if (!exists) {
          milestones.push({
            id: index + 1,
            category: milestone.category,
            name: milestone.name,
            description: milestone.description,
            ageRange: milestone.age_range,
            completed: false
          })
        }
      })
    }
  } catch (error) {
    console.error('加载预设里程碑失败:', error)
  }
}

// 加载预设里程碑（清空现有数据）
const loadPresetMilestones = async () => {
  try {
    const response = await fetchWithAuth('/api/development-monitoring/preset-milestones')
    
    if (response.ok) {
      const data = await response.json()
      milestones.length = 0
      data.forEach((milestone, index) => {
        milestones.push({
          id: index + 1,
          category: milestone.category,
          name: milestone.name,
          description: milestone.description,
          ageRange: milestone.age_range,
          completed: false
        })
      })
    }
  } catch (error) {
    console.error('加载预设里程碑失败:', error)
  }
}

// 监听里程碑分类变化
const updateFilteredMilestones = () => {
  if (activeMilestoneCategory.value === 'all') {
    filteredMilestones.value = [...milestones]
  } else {
    filteredMilestones.value = milestones.filter(milestone => milestone.category === activeMilestoneCategory.value)
  }
}

// 处理分类点击
const handleCategoryClick = (categoryId) => {
  activeMilestoneCategory.value = categoryId
  updateFilteredMilestones()
}

// 切换里程碑完成状态
const toggleMilestone = async (milestone) => {
  milestone.completed = !milestone.completed
  
  try {
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    
    // 如果是预设里程碑（id <= 20），需要先创建记录再更新
    if (milestone.id <= 20) {
      const response = await fetchWithAuth('/api/development-monitoring/milestones', {
        method: 'POST',
        body: JSON.stringify({
          baby_id: babyId,
          category: milestone.category,
          name: milestone.name,
          description: milestone.description,
          age_range: milestone.ageRange,
          completed: milestone.completed,
          completed_date: milestone.completed ? new Date().toISOString().split('T')[0] : null
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        milestone.id = data.id
        toast.success(milestone.completed ? '里程碑已标记完成！' : '里程碑已取消完成')
      }
    } else {
      // 如果是自定义里程碑，直接更新
      const response = await fetchWithAuth(`/api/development-monitoring/milestones/${milestone.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          category: milestone.category,
          name: milestone.name,
          description: milestone.description,
          age_range: milestone.ageRange,
          completed: milestone.completed,
          completed_date: milestone.completed ? new Date().toISOString().split('T')[0] : null
        })
      })
      
      if (response.ok) {
        toast.success(milestone.completed ? '里程碑已标记完成！' : '里程碑已取消完成')
      }
    }
  } catch (error) {
    milestone.completed = !milestone.completed
    toast.error('更新里程碑状态失败')
  }
}

// 添加自定义里程碑
const addMilestone = async () => {
  if (!newMilestone.name.trim()) {
    toast.info('请输入里程碑名称')
    return
  }
  
  try {
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    
    const response = await fetchWithAuth('/api/development-monitoring/milestones', {
      method: 'POST',
      body: JSON.stringify({
        baby_id: babyId,
        category: newMilestone.category,
        name: newMilestone.name,
        description: newMilestone.description,
        age_range: newMilestone.ageRange,
        completed: false
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // 添加到本地列表
      milestones.push({
        id: data.id,
        category: data.category,
        name: data.name,
        description: data.description,
        ageRange: data.age_range
      })
      
      // 更新过滤后的列表
      updateFilteredMilestones()
      
      // 重置表单
      newMilestone.name = ''
      newMilestone.description = ''
      newMilestone.ageRange = ''
      newMilestone.category = 'grossMotor'
      
      // 关闭模态框
      showAddMilestoneModal.value = false
      
      // 提示用户添加成功
      toast.success('里程碑添加成功！')
    } else {
      // 处理 HTTP 错误
      const errorData = await response.json().catch(() => ({ detail: '请求失败' }))
      console.error('添加里程碑失败:', errorData)
      toast.error(`添加里程碑失败: ${errorData.detail || '未知错误'}`)
    }
  } catch (error) {
    console.error('添加里程碑失败:', error)
    toast.error('添加里程碑失败，请稍后重试')
  }
}

// 编辑里程碑
const editMilestone = (milestone) => {
  editingMilestone.id = milestone.id
  editingMilestone.name = milestone.name
  editingMilestone.description = milestone.description
  editingMilestone.ageRange = milestone.ageRange
  editingMilestone.category = milestone.category
  showEditMilestoneModal.value = true
}

// 更新里程碑
const updateMilestone = async () => {
  if (!editingMilestone.name.trim()) {
    toast.info('请输入里程碑名称')
    return
  }
  
  try {
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    
    const response = await fetchWithAuth(`/api/development-monitoring/milestones/${editingMilestone.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        baby_id: babyId,
        category: editingMilestone.category,
        name: editingMilestone.name,
        description: editingMilestone.description,
        age_range: editingMilestone.ageRange,
        completed: false
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // 更新本地列表
      const index = milestones.findIndex(m => m.id === editingMilestone.id)
      if (index !== -1) {
        milestones[index] = {
          id: data.id,
          category: data.category,
          name: data.name,
          description: data.description,
          ageRange: data.age_range
        }
      }
      
      // 更新过滤后的列表
      updateFilteredMilestones()
      
      // 关闭模态框
      showEditMilestoneModal.value = false
      
      // 提示用户更新成功
      toast.success('里程碑更新成功！')
    } else {
      const errorData = await response.json().catch(() => ({ detail: '请求失败' }))
      console.error('更新里程碑失败:', errorData)
      toast.error(`更新里程碑失败: ${errorData.detail || '未知错误'}`)
    }
  } catch (error) {
    console.error('更新里程碑失败:', error)
    toast.error('更新里程碑失败: ' + error.message)
  }
}

// 删除里程碑
const deleteMilestone = async (milestoneId) => {
  const result = await Swal.fire({
    title: '确认删除',
    text: '确定要删除这个里程碑吗？',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FF6B9D',
    cancelButtonColor: '#ccc',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消'
  })
  
  if (!result.isConfirmed) {
    return
  }
  
  try {
    const response = await fetchWithAuth(`/api/development-monitoring/milestones/${milestoneId}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      // 从本地列表移除（reactive数组直接操作）
      const filtered = milestones.filter(m => m.id !== milestoneId)
      // 清空原数组并添加过滤后的元素
      milestones.length = 0
      milestones.push(...filtered)
      
      // 更新过滤后的列表
      updateFilteredMilestones()
      
      // 提示用户删除成功
      toast.success('里程碑删除成功！')
    } else {
      const errorData = await response.json().catch(() => ({ detail: '请求失败' }))
      console.error('删除里程碑失败:', errorData)
      toast.error(`删除里程碑失败: ${errorData.detail || '未知错误'}`)
    }
  } catch (error) {
    console.error('删除里程碑失败:', error)
    toast.error('删除里程碑失败: ' + error.message)
  }
}

// 切换标签
const switchTab = (tabId) => {
  activeTab.value = tabId
  if (tabId === 'milestone') {
    updateFilteredMilestones()
  } else if (tabId === 'growth') {
    loadGrowthRecords()
  }
}

// 生长记录
const growthRecords = reactive([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(5)
const jumpToPage = ref(1)
const hoveredRecordId = ref(null)

const totalPages = computed(() => {
  return Math.ceil(growthRecords.length / pageSize.value)
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return growthRecords.slice(start, end)
})

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const jumpToPageSubmit = () => {
  const page = jumpToPage.value
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    jumpToPage.value = page
  } else if (page < 1) {
    currentPage.value = 1
    jumpToPage.value = 1
  } else if (page > totalPages.value) {
    currentPage.value = totalPages.value
    jumpToPage.value = totalPages.value
  }
}

// 编辑生长记录
const editGrowthRecord = reactive({
  id: null,
  date: '',
  height: '',
  weight: '',
  headCircumference: ''
})
const showEditGrowthModal = ref(false)

// 打开编辑生长记录弹窗
const openEditGrowthRecord = (record) => {
  editGrowthRecord.id = record.id
  editGrowthRecord.date = record.date
  editGrowthRecord.height = record.height
  editGrowthRecord.weight = record.weight
  editGrowthRecord.headCircumference = record.headCircumference
  showEditGrowthModal.value = true
}

// 确认删除生长记录
const confirmDeleteGrowthRecord = async (record) => {
  const result = await Swal.fire({
    title: '确认删除',
    text: `确定要删除 ${record.date} 的生长记录吗？`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FF6B9D',
    cancelButtonColor: '#ccc',
    confirmButtonText: '确认删除',
    cancelButtonText: '取消'
  })
  
  if (!result.isConfirmed) {
    return
  }
  
  try {
    const response = await fetchWithAuth(`/api/development-monitoring/growth-records/${record.id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      toast.success('删除成功')
      loadGrowthRecords()
    } else {
      toast.error('删除失败')
    }
  } catch (error) {
    console.error('删除生长记录失败:', error)
    toast.error('删除失败')
  }
}

// 更新生长记录
const updateGrowthRecord = async () => {
  if (!editGrowthRecord.date || !editGrowthRecord.height || !editGrowthRecord.weight) {
    toast.error('请填写完整的测量数据')
    return
  }

  try {
    const response = await fetchWithAuth(`/api/development-monitoring/growth-records/${editGrowthRecord.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        measurement_date: editGrowthRecord.date,
        height: parseFloat(editGrowthRecord.height),
        weight: parseFloat(editGrowthRecord.weight),
        head_circumference: editGrowthRecord.headCircumference ? parseFloat(editGrowthRecord.headCircumference) : null
      })
    })

    if (response.ok) {
      toast.success('更新成功')
      showEditGrowthModal.value = false
      loadGrowthRecords()
    } else {
      toast.error('更新失败')
    }
  } catch (error) {
    console.error('更新生长记录失败:', error)
    toast.error('更新失败')
  }
}

// 新生长记录
const newGrowthRecord = reactive({
  date: new Date().toISOString().split('T')[0],
  height: '',
  weight: '',
  headCircumference: ''
})

// 加载生长记录
const loadGrowthRecords = async () => {
  try {
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    const response = await fetchWithAuth(`/api/development-monitoring/growth-records/${babyId}`)
    
    if (response.ok) {
      const data = await response.json()
      growthRecords.length = 0
      data.forEach(record => {
        growthRecords.push({
          id: record.id,
          date: record.measurement_date,
          height: record.height,
          weight: record.weight,
          headCircumference: record.head_circumference || 0,
          babyBirthDate: currentBaby.value?.birthDate
        })
      })
      // 重置分页到第一页
      currentPage.value = 1
    }
  } catch (error) {
    console.error('加载生长记录失败:', error)
  }
}

// 加载评估记录
const loadAssessments = async () => {
  try {
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    const response = await fetchWithAuth(`/api/development-monitoring/assessments/${babyId}`)
    
    if (response.ok) {
      const data = await response.json()
      // 可以在这里处理评估记录数据
      console.log('评估记录:', data)
    }
  } catch (error) {
    console.error('加载评估记录失败:', error)
  }
}

// 添加生长记录
const addGrowthRecord = async () => {
  if (newGrowthRecord.height && newGrowthRecord.weight) {
    try {
      const babyId = currentBaby.value ? currentBaby.value.id : 1
      const response = await fetchWithAuth('/api/development-monitoring/growth-records', {
        method: 'POST',
        body: JSON.stringify({
          baby_id: babyId,
          measurement_date: newGrowthRecord.date,
          height: newGrowthRecord.height,
          weight: newGrowthRecord.weight,
          head_circumference: newGrowthRecord.headCircumference || null
        })
      })
      
      if (response.ok) {
        // 重新加载生长记录
        await loadGrowthRecords()
        
        // 重置表单
        newGrowthRecord.date = new Date().toISOString().split('T')[0]
        newGrowthRecord.height = ''
        newGrowthRecord.weight = ''
        newGrowthRecord.headCircumference = ''
      }
    } catch (error) {
      console.error('添加生长记录失败:', error)
    }
  }
}

// 滚动到生长表单位置
const scrollToGrowthForm = () => {
  const element = document.getElementById('growth-form-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // 聚焦到第一个输入框
    const firstInput = element.querySelector('input')
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 500)
    }
  }
}

// 清空生长表单并滚动到表单位置
const clearGrowthForm = () => {
  // 清空表单内容
  newGrowthRecord.date = new Date().toISOString().split('T')[0]
  newGrowthRecord.height = ''
  newGrowthRecord.weight = ''
  newGrowthRecord.headCircumference = ''
  
  // 滚动到表单位置
  const element = document.getElementById('growth-form-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // 聚焦到第一个输入框
    const firstInput = element.querySelector('input')
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 500)
    }
  }
}

// 重置评估
const resetAssessment = () => {
  assessmentResult.value = null
}

// 开始发育评估
const startAssessment = async () => {
  isLoading.value = true
  try {
    // 调用真实API
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    
    const response = await fetchWithAuth('/api/development-monitoring/assessments', {
      method: 'POST',
      body: JSON.stringify({
        baby_id: babyId,
        assessment_date: new Date().toISOString().split('T')[0]
      })
    })
    
    if (!response.ok) {
      throw new Error('API调用失败')
    }
    
    const data = await response.json()
    
    // 构建评估结果
    assessmentResult.value = {
      overallLevel: data.overall_level,
      score: data.score,
      domains: Object.entries(data.domains).map(([name, score]) => ({
        name,
        score
      })),
      advice: data.advice,
      dataStatus: data.data_status || 'complete'
    }
  } catch (error) {
    console.error('评估失败:', error)
    // 显示错误消息
    assessmentResult.value = {
      overallLevel: '评估失败',
      score: 0,
      domains: [],
      advice: '系统暂时无法完成评估，请稍后重试。',
      dataStatus: 'error'
    }
  } finally {
    isLoading.value = false
  }
}

// 快速问题
const quickQuestions = [
  '宝宝10个月还不会爬',
  '宝宝说话晚正常吗',
  '如何促进宝宝语言发展',
  '宝宝挑食怎么办',
  '如何培养宝宝社交能力'
]

// 消息记录
const messages = reactive([])

// 智能识别用户意图
const isGreetingMessage = (message) => {
  const greetingKeywords = ['你好', '您好', 'hello', 'hi', '在吗', '请问', '医生好', 
                          '大夫好', '老师好', '早上好', '下午好', '晚上好']
  return greetingKeywords.some(keyword => message.includes(keyword))
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
      personalizedAdvice: '系统暂时无法响应，请稍后重试',
      safetyWarning: '🟡 系统维护中，建议谨慎处理。'
    })
  } finally {
    isLoading.value = false
    currentThinking.value = ''
  }
}

// 使用流式API发送消息
const sendMessageStream = async (userMessage) => {
  console.log('🎯 前端发送消息 - currentBaby:', currentBaby.value)
  const babyId = currentBaby.value ? currentBaby.value.id : 1
  console.log('🎯 前端发送消息 - babyId:', babyId)
  
  // 构建对话历史
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
  
  // 直接发送宝宝信息给后端，避免后端重复查询数据库
  const babyInfo = currentBaby.value ? {
    name: currentBaby.value.name,
    age: currentBaby.value.age,
    gender: currentBaby.value.gender,
    birthDate: currentBaby.value.birthDate
  } : null
  
  console.log('🎯 前端发送宝宝信息:', babyInfo)
  
  try {
    // 调用真实API
    const response = await fetchWithAuth('/api/development-monitoring/qa-stream', {
      method: 'POST',
      body: JSON.stringify({
        baby_id: babyId,
        question: userMessage,
        conversation_history: recentHistory,
        baby_info: babyInfo
      })
    })
    
    if (!response.ok) {
      throw new Error('API调用失败')
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    let thinkingProcess = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.replace('data: ', '')
          if (data.trim() === '') continue
          
          try {
            const parsed = JSON.parse(data)
            
            if (parsed.type === 'thinking') {
              currentThinking.value = parsed.full_thinking
              thinkingProcess = parsed.full_thinking
            } else if (parsed.type === 'result') {
              // 构建响应（包含风险评估和安全警告）
              const result = {
                personalizedAdvice: parsed.data.answer,
                historicalContext: parsed.data.historical_context || '',
                safetyWarning: parsed.data.safety_warning || '',
                riskLevel: parsed.data.risk_level || 'green',
                responseTime: 1.0,
                thinkingProcess: thinkingProcess,
                showThinking: false,
                isGreeting: isGreetingMessage(userMessage)
              }
              
              // 添加AI回复
              addMessage('ai', '', result)
              
              // 清空思考过程
              currentThinking.value = ''
            } else if (parsed.type === 'error') {
              // 使用降级回答
              const result = {
                personalizedAdvice: parsed.fallback_answer || '系统暂时无法响应，请稍后重试',
                safetyWarning: '🟡 系统维护中，建议谨慎处理。如有紧急情况，请立即拨打120。',
                responseTime: 1.0,
                thinkingProcess: '',
                showThinking: false,
                isGreeting: false
              }
              addMessage('ai', '', result)
              currentThinking.value = ''
            }
          } catch (e) {
            console.error('解析流式响应失败:', e)
          }
        }
      }
    }
    
  } catch (error) {
    console.error('流式连接错误:', error)
    
    addMessage('ai', '', {
      personalizedAdvice: '系统暂时无法响应，请稍后重试',
      safetyWarning: '🟡 系统维护中，建议谨慎处理。'
    })
  } finally {
    isLoading.value = false
    currentThinking.value = ''
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

// 选择快速问题
const selectQuickQuestion = async (question) => {
  // 添加用户消息
  addMessage('user', question)
  
  // 显示加载状态
  isLoading.value = true
  
  try {
    // 调用真实API
    const babyId = currentBaby.value ? currentBaby.value.id : 1
    
    const response = await fetchWithAuth('/api/development-monitoring/qa', {
      method: 'POST',
      body: JSON.stringify({
        baby_id: babyId,
        question: question
      })
    })
    
    if (!response.ok) {
      throw new Error('API调用失败')
    }
    
    const data = await response.json()
    
    // 构建响应
    const result = {
      personalizedAdvice: data.answer,
      historicalContext: data.historical_context || '',
      safetyWarning: data.safety_warning || '',
      riskLevel: data.risk_level || 'green',
      responseTime: 1.0
    }
    
    // 添加AI回复
    addMessage('ai', '', result)
    
  } catch (error) {
    console.error('获取预设回复失败:', error)
    
    // 显示错误消息
    addMessage('ai', '', {
      personalizedAdvice: '抱歉，获取回复失败。请尝试详细描述您的问题，我会为您提供专业建议。',
      safetyWarning: '🟢 您也可以直接输入问题获取帮助。'
    })
  } finally {
    isLoading.value = false
  }
}

// 初始化
onMounted(async () => {
  // 添加简洁的开场白
  addMessage('ai', '您好！我是宝宝发育监测助手，可以为您提供专业的发育指导。请选择上方的功能标签，开始记录宝宝的发育情况或咨询相关问题。')
  
  // 先加载宝宝数据
  await loadBabies()
  
  // 如果有宝宝数据，加载对应宝宝的数据
  if (currentBaby.value) {
    await loadMilestones()
    await loadGrowthRecords()
    await loadAssessments()
  }
  
  // 初始化里程碑过滤
  updateFilteredMilestones()
})

// 组件卸载时清理
onUnmounted(() => {
  // 清理资源
})
</script>

<style scoped>
.development-monitoring-agent {
  width: 100%;
  height: 100%;
  min-height: 1200px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 宝宝管理区域 */
.baby-management {
  background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
}

.baby-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.baby-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 4px;
}

.baby-item {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 18px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  min-height: 60px;
  color: #333;
}

.baby-item:hover {
  background: rgba(255, 182, 193, 0.2);
  border-color: rgba(255, 182, 193, 0.5);
}

.baby-item.active {
  background: rgba(255, 107, 157, 0.1);
  border-color: #FF6B9D;
}

.edit-baby-btn,
.delete-baby-btn {
  padding: 6px 10px;
  font-size: 14px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #999;
  transition: all 0.2s ease;
}

.edit-baby-btn:hover,
.delete-baby-btn:hover {
  background: #f5f5f5;
  color: #FF6B9D;
}

.delete-baby-btn:hover {
  color: #ff4757;
}

.add-baby-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

.add-baby-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
}

.add-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 功能选择区 */
.agent-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.function-sidebar {
  width: 180px;
  background: linear-gradient(180deg, #FFF5F8 0%, #FAFAFA 100%);
  border-right: 1px solid #e9ecef;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tab-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.tab-btn:hover {
  background: rgba(255, 107, 157, 0.1);
  color: #FF6B9D;
}

.tab-btn.active {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

/* 内容区域 */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tab-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.module-content {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.module-content h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

/* 里程碑分类 */
.milestone-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background: rgba(255, 107, 157, 0.1);
  border-color: rgba(255, 107, 157, 0.3);
  color: #FF6B9D;
}

.category-btn.active {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border-color: #FF6B9D;
  color: white;
}

/* 里程碑列表 */
.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.milestone-item:hover {
  background: white;
  border-color: rgba(255, 107, 157, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.milestone-info {
  flex: 1;
  min-width: 0;
}

.milestone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.milestone-name {
  margin: 0;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.milestone-description {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.milestone-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.milestone-action-btn {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.milestone-action-btn.edit-btn {
  background: #f0f0f0;
  color: #666;
}

.milestone-action-btn.edit-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.milestone-action-btn.delete-btn {
  background: #fff0f0;
  color: #e53935;
}

.milestone-action-btn.delete-btn:hover {
  background: #ffe0e0;
  color: #c62828;
}

.milestone-age {
  display: inline-block;
  padding: 4px 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  color: #999;
  font-size: 12px;
}

/* 里程碑介绍 */
.milestone-intro {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 107, 157, 0.08);
  border-radius: 12px;
}

.milestone-intro p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* 里程碑勾选框 */
.milestone-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
}

.milestone-checkbox input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
  cursor: pointer;
}

.milestone-checkbox .checkmark {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  transition: all 0.2s ease;
}

.milestone-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border-color: #FF6B9D;
}

.milestone-checkbox .checkmark:after {
  content: '';
  position: absolute;
  left: 8px;
  top: 4px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.milestone-checkbox input:checked ~ .checkmark:after {
  opacity: 1;
}

/* 已完成的里程碑样式 */
.milestone-item.completed {
  background: rgba(76, 175, 80, 0.05);
  border-color: rgba(76, 175, 80, 0.2);
}

.milestone-item.completed .milestone-name {
  color: #4CAF50;
  font-weight: 600;
}

.milestone-item.completed .milestone-description {
  color: #666;
}

/* 里程碑网格布局 */
.milestone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

/* 里程碑卡片 */
.milestone-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px dashed #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.milestone-card:hover {
  border-color: #FF6B9D;
  background: #fff5f8;
  transform: translateY(-2px);
}

.milestone-card.completed {
  border-color: #4CAF50;
  background: #f0fdf4;
}

/* 里程碑图标 */
.milestone-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  color: #999;
  transition: all 0.2s ease;
}

.milestone-card:hover .milestone-icon {
  border-color: #FF6B9D;
  color: #FF6B9D;
}

.milestone-card.completed .milestone-icon {
  background: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

/* 里程碑内容 */
.milestone-content {
  flex: 1;
  min-width: 0;
}

/* 里程碑头部：名称和年龄在同一行 */
.milestone-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.milestone-card .milestone-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.milestone-card .milestone-age {
  flex-shrink: 0;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 11px;
  color: #888;
}

.milestone-card.completed .milestone-age {
  background: #dcfce7;
  color: #16a34a;
}

.milestone-card .milestone-description {
  margin: 0;
  font-size: 12px;
  color: #888;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义里程碑卡片 */
.milestone-card.custom-milestone {
  border-style: solid;
  border-color: #e9ecef;
}

.milestone-card.custom-milestone:hover {
  border-color: #FF6B9D;
}

/* 里程碑操作按钮 */
.milestone-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.milestone-card.custom-milestone:hover .milestone-actions {
  opacity: 1;
  visibility: visible;
}

.milestone-action-btn {
  padding: 4px 8px;
  font-size: 11px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn {
  background: #f0f0f0;
  color: #666;
}

.edit-btn:hover {
  background: #e0e0e0;
}

.delete-btn {
  background: #fff0f0;
  color: #e53935;
}

.delete-btn:hover {
  background: #ffe0e0;
}

/* 空状态 */
.no-custom {
  padding: 24px;
  text-align: center;
  border: 1px dashed #e0e0e0;
  border-radius: 10px;
  background: #fafbfc;
}

.no-custom p {
  margin: 0 0 12px 0;
  color: #999;
  font-size: 13px;
}

.add-custom-btn {
  padding: 6px 16px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 13px;
  cursor: pointer;
}

/* 预设里程碑区域 */
.preset-section {
  margin-bottom: 24px;
}

.preset-title {
  margin: 0 0 6px 0;
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

.preset-desc {
  margin: 0;
  color: #999;
  font-size: 13px;
}

/* 自定义里程碑区域 */
.custom-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed #e0e0e0;
}

.custom-title {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

/* 添加里程碑按钮 */
.add-milestone-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  margin: 20px auto 0;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

.add-milestone-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
}

/* 生长曲线 */
.growth-form {
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.label-icon {
  font-size: 16px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FF6B9D;
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.add-growth-btn {
  display: block;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

.add-growth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
}

.growth-chart {
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.growth-chart h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.chart-placeholder p {
  color: #999;
  font-size: 14px;
}

.growth-records {
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
}

.growth-records h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.growth-record-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  position: relative;
  transition: all 0.2s ease;
}

.growth-record-item:hover {
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.growth-record-item:last-child {
  margin-bottom: 0;
}

.record-date {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.record-data {
  color: #666;
  font-size: 14px;
}

.record-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.growth-record-item:hover .record-actions {
  opacity: 1;
  visibility: visible;
}

.action-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn.edit {
  background: #e8f4fd;
  color: #1976d2;
}

.action-btn.edit:hover {
  background: #1976d2;
  color: white;
}

.action-btn.delete {
  background: #ffebee;
  color: #d32f2f;
}

.action-btn.delete:hover {
  background: #d32f2f;
  color: white;
}

.records-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.page-btn {
  min-width: 60px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  color: white;
  border-color: #FF6B9D;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-input {
  width: 60px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s ease;
}

.page-input:focus {
  border-color: #FF6B9D;
}

.page-input::placeholder {
  color: #999;
  font-size: 12px;
}

.jump-btn {
  min-width: 50px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #FF6B9D;
  border-radius: 6px;
  background: #FF6B9D;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jump-btn:hover {
  background: #ff4081;
  border-color: #ff4081;
}

/* 发育评估 */
/* 评估引导 */
.assessment-guide {
  margin-bottom: 24px;
  padding: 20px;
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 12px;
}

.assessment-guide h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
}

.guide-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.guide-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.guide-card:hover {
  border-color: rgba(255, 107, 157, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.guide-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 143, 163, 0.1) 100%);
  border-radius: 12px;
  font-size: 24px;
  flex-shrink: 0;
}

.guide-content {
  flex: 1;
  min-width: 0;
}

.guide-content h5 {
  margin: 0 0 6px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.guide-content p {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 12px;
  line-height: 1.5;
}

.guide-action {
  padding: 6px 12px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.guide-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

.assessment-form {
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.assessment-form p {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.start-assessment-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.start-assessment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 157, 0.4);
}

.assessment-result {
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
}

.assessment-result h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.result-overview {
  display: flex;
  gap: 30px;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-label {
  color: #999;
  font-size: 13px;
}

.result-value {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B9D;
}

.domain-results {
  margin-bottom: 24px;
}

.domain-results h5 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 15px;
}

.domain-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.domain-item:last-child {
  margin-bottom: 0;
}

.domain-name {
  width: 80px;
  color: #666;
  font-size: 14px;
}

.domain-score {
  width: 60px;
  text-align: right;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.domain-progress {
  flex: 1;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF6B9D 0%, #FF8FA3 100%);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.assessment-advice {
  padding: 20px;
  background: rgba(255, 107, 157, 0.05);
  border-radius: 12px;
  border-left: 4px solid #FF6B9D;
}

.assessment-advice h5 {
  margin: 0 0 12px 0;
  color: #FF6B9D;
  font-size: 15px;
}

.assessment-advice p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* 智能问答 */
.messages-container {
  flex: 1;
  min-height: 300px;
  overflow-y: auto;
  padding-right: 12px;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

.message {
  margin-bottom: 20px;
}

.message-content {
  display: flex;
  gap: 12px;
}

.user-message {
  justify-content: flex-end;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  color: white;
  border-radius: 20px 4px 20px 20px;
}

.ai-message {
  justify-content: flex-start;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #82C3EC 0%, #A7DEF9 100%);
  border-radius: 50%;
  font-size: 18px;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 14px 18px;
  background: #f5f5f5;
  border-radius: 4px 20px 20px 20px;
  position: relative;
}

.message-bubble p {
  margin: 0 0 8px 0;
  line-height: 1.6;
  font-size: 14px;
}

.message-bubble p:last-child {
  margin-bottom: 0;
}

.message-time {
  display: block;
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-top: 8px;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.response-time {
  display: block;
  font-size: 11px;
  color: #bbb;
  text-align: right;
  margin-top: 4px;
}

.thinking-process {
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f8f9fa;
  cursor: pointer;
}

.thinking-icon {
  font-size: 16px;
}

.thinking-title {
  flex: 1;
  font-size: 13px;
  color: #666;
}

.thinking-toggle {
  font-size: 12px;
  color: #FF6B9D;
}

.thinking-content {
  padding: 14px;
  background: #fff5f8;
}

.thinking-content pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.thinking-process.active .thinking-header {
  background: rgba(255, 107, 157, 0.1);
}

.thinking-process.active .thinking-content {
  display: block;
}

.simple-message p {
  color: #333;
}

.greeting-message .greeting-content p {
  color: #333;
  line-height: 1.7;
}

.development-message {
  color: #333;
}

.personalized-advice h5 {
  margin: 0 0 10px 0;
  color: #FF6B9D;
  font-size: 14px;
}

.personalized-advice p {
  color: #333;
  line-height: 1.7;
}

.historical-context {
  margin-top: 12px;
  padding: 12px;
  background: rgba(130, 195, 236, 0.1);
  border-radius: 8px;
}

.context-tip {
  margin: 0;
  color: #337ab7;
  font-size: 13px;
}

.risk-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
  margin-top: 12px;
}

.risk-indicator.red {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.risk-indicator.yellow {
  background: rgba(255, 217, 61, 0.2);
  color: #d69e2e;
}

.risk-indicator.green {
  background: rgba(127, 209, 174, 0.1);
  color: #28a745;
}

.risk-icon {
  font-size: 14px;
}

.safety-warning {
  margin-top: 12px;
  padding: 14px;
  border-radius: 8px;
}

.safety-warning.red {
  background: rgba(255, 71, 87, 0.1);
  border-left: 4px solid #ff4757;
}

.safety-warning.yellow {
  background: rgba(255, 217, 61, 0.2);
  border-left: 4px solid #d69e2e;
}

.safety-warning.green {
  background: rgba(127, 209, 174, 0.1);
  border-left: 4px solid #28a745;
}

.safety-warning p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}

/* 思考消息 */
.thinking-message .message-bubble {
  background: rgba(255, 107, 157, 0.05);
}

.thinking-indicator {
  display: flex;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #FF6B9D;
  border-radius: 50%;
  animation: pulse 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  background: #FF6B9D;
  border-radius: 50%;
  animation: loading-pulse 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: 0s; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes loading-pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.loading-indicator p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

/* 输入区域 */
.input-container {
  background: #fff;
  border-top: 1px solid #e9ecef;
  padding: 16px 20px;
  margin-top: auto;
}

.quick-questions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.quick-label {
  color: #999;
  font-size: 13px;
  font-weight: 500;
}

.quick-questions-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 快速操作按钮 - 优化后的小尺寸样式 */
.quick-question-tag {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
}

.quick-question-tag:hover {
  background: rgba(255, 107, 157, 0.1);
  border-color: rgba(255, 107, 157, 0.3);
  color: #FF6B9D;
  transform: none;
  box-shadow: none;
}

/* 快速提问按钮 */
.quick-question-btn {
  padding: 8px 14px;
  font-size: 13px;
  border-radius: 20px;
  background: rgba(255, 107, 157, 0.08);
  border: 1px solid rgba(255, 107, 157, 0.2);
  color: #FF6B9D;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-question-btn:hover {
  background: rgba(255, 107, 157, 0.15);
  border-color: rgba(255, 107, 157, 0.3);
}

.input-group {
  display: flex;
  gap: 12px;
}

.input-group textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  transition: all 0.2s ease;
}

.input-group textarea:focus {
  outline: none;
  border-color: #FF6B9D;
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

.input-group textarea:disabled {
  background: #f8f9fa;
  color: #999;
}

.send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 模态框 */
/* 自定义提示组件样式 */
.toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.toast-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  cursor: default;
  animation: toastScaleIn 0.3s ease-out;
  min-width: 280px;
}

.toast-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: bold;
}

.toast-icon span {
  color: white;
}

.toast-container.success .toast-icon {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fa3 100%);
}

.toast-container.error .toast-icon {
  background: linear-gradient(135deg, #ff8080 0%, #ff9999 100%);
}

.toast-container.info .toast-icon {
  background: linear-gradient(135deg, #87ceeb 0%, #add8e6 100%);
}

.toast-message {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}

.toast-close-btn {
  padding: 10px 32px;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fa3 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.toast-close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 157, 0.4);
}

.toast-close-btn:active {
  transform: translateY(0);
}

@keyframes toastScaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Toast 过渡动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

.toast-enter-from .toast-container,
.toast-leave-to .toast-container {
  transform: scale(0.8);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 10px 24px;
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.confirm-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
}

/* 日期选择器 */
.modern-date-picker {
  position: relative;
}

.date-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-display:hover,
.date-display.active {
  border-color: #FF6B9D;
}

.date-text {
  color: #333;
  font-size: 14px;
}

.calendar-icon {
  font-size: 16px;
}

.date-picker-popup {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.date-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid #e9ecef;
}

.nav-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #e9ecef;
}

.current-month {
  font-weight: 600;
  color: #333;
  font-size: 15px;
  cursor: pointer;
}

.year-selector {
  padding: 14px;
  border-bottom: 1px solid #e9ecef;
}

.year-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.decade-range {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.year {
  padding: 10px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  font-size: 14px;
}

.year:hover {
  background: rgba(255, 107, 157, 0.1);
  color: #FF6B9D;
}

.year.current-year {
  background: rgba(255, 107, 157, 0.1);
  color: #FF6B9D;
  font-weight: 600;
}

.year.selected-year {
  background: #FF6B9D;
  color: white;
}

.date-picker-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 10px 14px;
  border-bottom: 1px solid #e9ecef;
}

.weekday {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 6px;
}

.date-picker-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 10px 14px;
}

.day {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #333;
}

.day:hover:not(.disabled):not(.other-month) {
  background: rgba(255, 107, 157, 0.1);
}

.day.other-month {
  color: #ccc;
}

.day.today {
  background: rgba(255, 107, 157, 0.1);
  color: #FF6B9D;
  font-weight: 600;
}

.day.selected {
  background: #FF6B9D;
  color: white;
}

.day.disabled {
  color: #ddd;
  cursor: not-allowed;
}

/* 年龄显示 */
.age-display {
  margin-top: 8px;
  padding: 10px 14px;
  background: rgba(127, 209, 174, 0.1);
  border-radius: 8px;
}

.age-label {
  color: #999;
  font-size: 13px;
}

.age-value {
  color: #28a745;
  font-weight: 600;
  font-size: 14px;
}

/* 性别选择器 */
.gender-selector {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gender-option:hover {
  border-color: rgba(255, 107, 157, 0.3);
}

.gender-option.active {
  background: rgba(255, 107, 157, 0.05);
  border-color: #FF6B9D;
}

.gender-icon {
  font-size: 24px;
}

.gender-option span:last-child {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

/* 所属领域选择器 - 优化后的小尺寸样式 */
.category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-option {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
}

.category-option:hover {
  background: rgba(255, 107, 157, 0.1);
  border-color: rgba(255, 107, 157, 0.3);
  color: #FF6B9D;
  transform: none;
  box-shadow: none;
}

.category-option.active {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  border-color: #FF6B9D;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .development-monitoring-agent {
    border-radius: 0;
    box-shadow: none;
  }
  
  .agent-container {
    flex-direction: column;
  }
  
  .function-sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    padding: 12px;
  }
  
  .tab-btn {
    flex: 1;
    min-width: calc(50% - 4px);
    justify-content: center;
    text-align: center;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .milestone-categories {
    gap: 8px;
  }
  
  .category-btn {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .milestone-item {
    padding: 12px;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .send-btn {
    width: 100%;
  }
  
  .quick-questions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-overview {
    flex-direction: column;
    gap: 16px;
  }
  
  .domain-item {
    flex-wrap: wrap;
  }
  
  .domain-name,
  .domain-score {
    width: auto;
  }
  
  .domain-progress {
    width: 100%;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .baby-item {
    padding: 12px;
    min-height: auto;
  }
  
  .baby-info {
    display: none;
  }
  
  .milestone-categories {
    justify-content: center;
  }
  
  .category-btn {
    padding: 8px 10px;
    font-size: 11px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-header,
  .modal-footer {
    padding: 16px;
  }
}
</style>