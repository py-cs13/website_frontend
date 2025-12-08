<template>
  <div class="user-center">
    <h1 class="page-title">用户中心</h1>
    
    <div class="user-content">
      <!-- 左侧导航 -->
      <aside class="user-sidebar">
        <div class="user-info">
          <div class="user-avatar">
            <img src="https://via.placeholder.com/100" alt="用户头像" />
          </div>
          <div class="user-name">{{ user.name }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
        
        <nav class="user-nav">
          <ul class="nav-list">
            <li class="nav-item" :class="{ active: activeTab === 'profile' }">
              <a href="#" @click.prevent="switchTab('profile')">
                <i class="icon">👤</i> 个人信息
              </a>
            </li>
            <li class="nav-item" :class="{ active: activeTab === 'content' }">
              <a href="#" @click.prevent="switchTab('content')">
                <i class="icon">📝</i> 我的内容
              </a>
            </li>
            <li class="nav-item" :class="{ active: activeTab === 'purchases' }">
              <a href="#" @click.prevent="switchTab('purchases')">
                <i class="icon">🛒</i> 我的购买
              </a>
            </li>
            <li class="nav-item" :class="{ active: activeTab === 'favorites' }">
              <a href="#" @click.prevent="switchTab('favorites')">
                <i class="icon">❤️</i> 我的收藏
              </a>
            </li>
            <li class="nav-item" :class="{ active: activeTab === 'settings' }">
              <a href="#" @click.prevent="switchTab('settings')">
                <i class="icon">⚙️</i> 账户设置
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- 右侧内容 -->
      <main class="user-main">
        <!-- 个人信息 -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <h2 class="tab-title">个人信息</h2>
          <form class="profile-form">
            <div class="form-group">
              <label for="username">用户名</label>
              <input type="text" id="username" v-model="user.name" disabled />
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input type="email" id="email" v-model="user.email" disabled />
            </div>
            <div class="form-group">
              <label for="nickname">昵称</label>
              <input type="text" id="nickname" v-model="user.nickname" />
            </div>
            <div class="form-group">
              <label for="gender">性别</label>
              <select id="gender" v-model="user.gender">
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div class="form-group">
              <label for="birthday">生日</label>
              <input type="date" id="birthday" v-model="user.birthday" />
            </div>
            <div class="form-group">
              <label for="bio">个人简介</label>
              <textarea id="bio" v-model="user.bio" rows="4"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn">取消</button>
              <button type="button" class="save-btn">保存修改</button>
            </div>
          </form>
        </div>
        
        <!-- 我的内容 -->
        <div v-if="activeTab === 'content'" class="tab-content">
          <h2 class="tab-title">我的内容</h2>
          <div class="content-tabs">
            <button 
              v-for="tab in contentTabs" 
              :key="tab.value" 
              class="content-tab-btn"
              :class="{ active: activeContentTab === tab.value }"
              @click="activeContentTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="content-list">
            <!-- 我的文章/工具包列表 -->
            <div class="empty-state" v-if="userContents.length === 0">
              <i class="icon">📭</i>
              <p>您还没有创建任何内容</p>
              <button class="create-btn">创建内容</button>
            </div>
            <div 
              v-for="item in userContents" 
              :key="item.id" 
              class="user-content-item"
            >
              <div class="content-item-info">
                <h3 class="content-item-title">{{ item.title }}</h3>
                <p class="content-item-meta">
                  <span>{{ item.created_at }}</span>
                  <span>{{ item.status === 'published' ? '已发布' : '草稿' }}</span>
                </p>
              </div>
              <div class="content-item-actions">
                <button class="edit-btn">编辑</button>
                <button class="delete-btn">删除</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的购买 -->
        <div v-if="activeTab === 'purchases'" class="tab-content">
          <h2 class="tab-title">我的购买</h2>
          <div class="purchases-list">
            <div class="empty-state" v-if="purchases.length === 0">
              <i class="icon">🛒</i>
              <p>您还没有任何购买记录</p>
            </div>
            <div 
              v-for="item in purchases" 
              :key="item.id" 
              class="purchase-item"
            >
              <div class="purchase-item-info">
                <h3 class="purchase-item-title">{{ item.title }}</h3>
                <p class="purchase-item-meta">
                  <span>购买时间: {{ item.purchase_date }}</span>
                  <span>价格: ¥{{ item.price }}</span>
                </p>
              </div>
              <div class="purchase-item-actions">
                <button class="view-btn">查看</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的收藏 -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <h2 class="tab-title">我的收藏</h2>
          <div class="favorites-list">
            <div class="empty-state" v-if="favorites.length === 0">
              <i class="icon">❤️</i>
              <p>您还没有收藏任何内容</p>
            </div>
            <div 
              v-for="item in favorites" 
              :key="item.id" 
              class="favorite-item"
            >
              <div class="favorite-item-info">
                <h3 class="favorite-item-title">{{ item.title }}</h3>
                <p class="favorite-item-meta">{{ item.created_at }}</p>
              </div>
              <div class="favorite-item-actions">
                <button class="remove-btn">取消收藏</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账户设置 -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <h2 class="tab-title">账户设置</h2>
          <div class="settings-section">
            <h3 class="section-title">密码设置</h3>
            <form class="password-form">
              <div class="form-group">
                <label for="old-password">旧密码</label>
                <input type="password" id="old-password" />
              </div>
              <div class="form-group">
                <label for="new-password">新密码</label>
                <input type="password" id="new-password" />
              </div>
              <div class="form-group">
                <label for="confirm-password">确认新密码</label>
                <input type="password" id="confirm-password" />
              </div>
              <div class="form-actions">
                <button type="button" class="save-btn">修改密码</button>
              </div>
            </form>
          </div>
          
          <div class="settings-section">
            <h3 class="section-title">通知设置</h3>
            <div class="notification-settings">
              <label class="checkbox-item">
                <input type="checkbox" v-model="notificationSettings.email" />
                <span>接收邮件通知</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="notificationSettings.push" />
                <span>接收推送通知</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="notificationSettings.marketing" />
                <span>接收营销通知</span>
              </label>
            </div>
            <div class="form-actions">
              <button type="button" class="save-btn">保存设置</button>
            </div>
          </div>
          
          <div class="settings-section">
            <h3 class="section-title">安全设置</h3>
            <div class="security-settings">
              <p>邮箱验证状态: <span class="status verified">已验证</span></p>
              <p>手机验证状态: <span class="status unverified">未验证</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores'

const userStore = useUserStore()
const activeTab = ref('profile')
const activeContentTab = ref('articles')

// 用户信息
const user = ref({
  name: 'user123',
  email: 'user@example.com',
  nickname: '',
  gender: '',
  birthday: '',
  bio: ''
})

// 内容标签
const contentTabs = [
  { value: 'articles', label: '我的文章' },
  { value: 'toolkits', label: '我的工具包' }
]

// 用户内容
const userContents = ref([
  { id: 1, title: '我的第一篇文章', created_at: '2025-01-15', status: 'published' },
  { id: 2, title: '我的第一个工具包', created_at: '2025-01-10', status: 'draft' }
])

// 购买记录
const purchases = ref([
  { id: 1, title: '家庭健康管理工具包', purchase_date: '2025-01-05', price: 9.9 }
])

// 收藏列表
const favorites = ref([
  { id: 1, title: '10个简单的养生小技巧', created_at: '2025-01-12' },
  { id: 2, title: '如何科学安排孕期饮食', created_at: '2025-01-15' }
])

// 通知设置
const notificationSettings = ref({
  email: true,
  push: false,
  marketing: true
})

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab
}
</script>

<style scoped>
.user-center {
  max-width: 100%;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
}

.user-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 左侧导航 */
.user-sidebar {
  width: 280px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  margin-bottom: 15px;
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.user-email {
  font-size: 14px;
  color: #666;
}

.user-nav .nav-list {
  list-style: none;
}

.user-nav .nav-item {
  margin-bottom: 5px;
}

.user-nav .nav-item a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 6px;
  color: #666;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s ease;
}

.user-nav .nav-item:hover a {
  background-color: #e9ecef;
  color: #333;
}

.user-nav .nav-item.active a {
  background-color: #1E88E5;
  color: white;
}

/* 右侧内容 */
.user-main {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tab-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #333;
}

/* 个人信息表单 */
.profile-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 40px;
}

.cancel-btn,
.save-btn {
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.save-btn {
  border: none;
  background-color: #1E88E5;
  color: white;
}

.save-btn:hover {
  background-color: #1565C0;
}

/* 内容标签 */
.content-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.content-tab-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.content-tab-btn:hover {
  border-color: #1E88E5;
  color: #1E88E5;
}

.content-tab-btn.active {
  background-color: #1E88E5;
  color: white;
  border-color: #1E88E5;
}

/* 内容列表 */
.content-list {
  max-height: 500px;
  overflow-y: auto;
}

.user-content-item,
.purchase-item,
.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.user-content-item:last-child,
.purchase-item:last-child,
.favorite-item:last-child {
  border-bottom: none;
}

.content-item-title,
.purchase-item-title,
.favorite-item-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.content-item-meta,
.purchase-item-meta,
.favorite-item-meta {
  font-size: 14px;
  color: #666;
}

.content-item-meta span,
.purchase-item-meta span {
  margin-right: 15px;
}

.content-item-actions,
.purchase-item-actions,
.favorite-item-actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn,
.view-btn,
.remove-btn {
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  border: 1px solid #1E88E5;
  background-color: white;
  color: #1E88E5;
}

.edit-btn:hover {
  background-color: #1E88E5;
  color: white;
}

.delete-btn,
.remove-btn {
  border: 1px solid #F44336;
  background-color: white;
  color: #F44336;
}

.delete-btn:hover,
.remove-btn:hover {
  background-color: #F44336;
  color: white;
}

.view-btn {
  border: 1px solid #4CAF50;
  background-color: white;
  color: #4CAF50;
}

.view-btn:hover {
  background-color: #4CAF50;
  color: white;
}

/* 设置部分 */
.settings-section {
  margin-bottom: 40px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section .section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

/* 通知设置 */
.notification-settings {
  margin-bottom: 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 15px;
  color: #333;
}

/* 安全设置 */
.security-settings p {
  margin-bottom: 10px;
  font-size: 15px;
}

.status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.status.verified {
  background-color: #e8f5e9;
  color: #2E7D32;
}

.status.unverified {
  background-color: #ffebee;
  color: #C62828;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 50px 0;
  color: #999;
}

.empty-state .icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

.create-btn {
  padding: 10px 20px;
  border: 1px solid #1E88E5;
  background-color: white;
  color: #1E88E5;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background-color: #1E88E5;
  color: white;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .user-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .user-sidebar {
    width: 100%;
    padding: 15px;
  }
  
  .user-main {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .user-main {
    padding: 15px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .tab-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .user-content-item,
  .purchase-item,
  .favorite-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
  }
  
  .content-item-actions,
  .purchase-item-actions,
  .favorite-item-actions {
    align-self: flex-end;
  }
}
</style>