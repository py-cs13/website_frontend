<template>
  <div class="user-center">
    <!-- 母婴主题装饰 -->
    <div class="theme-decoration">
      <div class="decoration-icon">👶</div>
      <div class="decoration-icon">🎀</div>
      <div class="decoration-icon">💖</div>
    </div>
    
    <h1 class="page-title">我的育儿中心</h1>
    
    <div class="user-content">
      <!-- 左侧导航 -->
      <aside class="user-sidebar">
        <div class="user-info">
          <div class="user-avatar">
            <img src="https://via.placeholder.com/100" alt="用户头像" />
            <div class="avatar-decoration">👼</div>
          </div>
          <div class="user-name">{{ user.name }}</div>
          <div class="user-email">{{ user.email }}</div>
          <div class="user-badge" v-if="user.babyName">
            👶 {{ user.babyName }} 的妈妈
          </div>
        </div>
        
        <nav class="user-nav">
          <ul class="nav-list">
            <li class="nav-item" :class="{ active: activeTab === 'profile' }">
              <a href="#" @click.prevent="switchTab('profile')">
                <i class="icon">👤</i> 个人信息
              </a>
            </li>
            <li class="nav-item" :class="{ active: activeTab === 'baby' }">
              <a href="#" @click.prevent="switchTab('baby')">
                <i class="icon">👶</i> 宝宝信息
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
          <h2 class="tab-title">
            <span class="title-icon">👤</span> 个人信息
          </h2>
          <form class="profile-form">
            <div class="form-group">
              <FormInput
                id="username"
                v-model="user.name"
                label="用户名"
                type="text"
                :disabled="true"
              />
            </div>
            <div class="form-group">
              <FormInput
                id="email"
                v-model="user.email"
                label="邮箱"
                type="email"
                :disabled="true"
              />
            </div>
            <div class="form-group">
              <FormInput
                id="nickname"
                v-model="user.nickname"
                label="昵称"
                type="text"
                placeholder="例如：小宝贝的妈妈"
              />
            </div>
            <div class="form-group">
              <label for="gender">性别</label>
              <select id="gender" v-model="user.gender" class="form-input">
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div class="form-group">
              <FormInput
                id="birthday"
                v-model="user.birthday"
                label="生日"
                type="date"
              />
            </div>
            <div class="form-group">
              <FormTextarea
                id="bio"
                v-model="user.bio"
                label="个人简介"
                rows="4"
                placeholder="分享你的育儿故事..."
              />
            </div>
            <div class="form-actions">
              <Button variant="secondary" size="medium" class="cancel-btn">取消</Button>
              <Button variant="primary" size="medium" class="save-btn">保存修改</Button>
            </div>
          </form>
        </div>
        
        <!-- 宝宝信息 -->
        <div v-if="activeTab === 'baby'" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">👶</span> 宝宝信息
          </h2>
          <form class="baby-form">
            <div class="form-group">
              <FormInput
                id="babyName"
                v-model="user.babyName"
                label="宝宝姓名"
                type="text"
                placeholder="请输入宝宝姓名"
              />
            </div>
            <div class="form-group">
              <FormInput
                id="babyBirthday"
                v-model="user.babyBirthday"
                label="宝宝生日"
                type="date"
              />
            </div>
            <div class="form-group">
              <label for="babyGender">宝宝性别</label>
              <select id="babyGender" v-model="user.babyGender" class="form-input">
                <option value="">请选择</option>
                <option value="boy">男宝宝</option>
                <option value="girl">女宝宝</option>
              </select>
            </div>
            <div class="form-group">
              <FormTextarea
                id="babyMilestones"
                v-model="user.babyMilestones"
                label="成长里程碑"
                rows="4"
                placeholder="记录宝宝的第一次爬行、第一次说话..."
              />
            </div>
            <div class="form-actions">
              <Button variant="secondary" size="medium" class="cancel-btn">取消</Button>
              <Button variant="primary" size="medium" class="save-btn">保存宝宝信息</Button>
            </div>
          </form>
        </div>
        
        <!-- 我的内容 -->
        <div v-if="activeTab === 'content'" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">📝</span> 我的内容
          </h2>
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
              <p>您还没有创建任何育儿内容</p>
              <Button variant="primary" size="medium" class="create-btn">分享育儿经验</Button>
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
                <Button variant="secondary" size="small" class="edit-btn">编辑</Button>
                <Button variant="danger" size="small" class="delete-btn">删除</Button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的购买 -->
        <div v-if="activeTab === 'purchases'" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">🛒</span> 我的购买
          </h2>
          <div class="purchases-list">
            <div class="empty-state" v-if="purchases.length === 0">
              <i class="icon">🛒</i>
              <p>您还没有购买任何育儿课程或工具包</p>
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
                <Button variant="primary" size="small" class="view-btn" @click="viewPurchase(item)">查看</Button>
                <Button variant="success" size="small" class="download-btn" @click="downloadPurchase(item)">下载</Button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的收藏 -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">❤️</span> 我的收藏
          </h2>
          <div class="favorites-list">
            <div class="empty-state" v-if="favorites.length === 0">
              <i class="icon">❤️</i>
              <p>您还没有收藏任何育儿内容</p>
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
                <Button variant="danger" size="small" class="remove-btn">取消收藏</Button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账户设置 -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">⚙️</span> 账户设置
          </h2>
          <div class="settings-section">
            <h3 class="section-title">密码设置</h3>
            <form class="password-form">
              <div class="form-group">
                <FormInput
                  id="old-password"
                  label="旧密码"
                  type="password"
                />
              </div>
              <div class="form-group">
                <FormInput
                  id="new-password"
                  label="新密码"
                  type="password"
                />
              </div>
              <div class="form-group">
                <FormInput
                  id="confirm-password"
                  label="确认新密码"
                  type="password"
                />
              </div>
              <div class="form-actions">
                <Button variant="primary" size="medium" class="save-btn">修改密码</Button>
              </div>
            </form>
          </div>
          
          <div class="settings-section">
            <h3 class="section-title">通知设置</h3>
            <div class="notification-settings">
              <label class="checkbox-item">
                <input type="checkbox" v-model="notificationSettings.email" />
                <span>接收育儿资讯邮件</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="notificationSettings.push" />
                <span>接收宝宝成长提醒</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="notificationSettings.marketing" />
                <span>接收育儿产品优惠</span>
              </label>
            </div>
            <div class="form-actions">
                <Button variant="primary" size="medium" class="save-btn">保存设置</button>
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
import Button from '../components/Button.vue'
import FormInput from '../components/FormInput.vue'
import FormTextarea from '../components/FormTextarea.vue'

const userStore = useUserStore()
const activeTab = ref('profile')
const activeContentTab = ref('articles')

// 用户信息
const user = ref({
  name: '小宝贝妈妈',
  email: 'mama@example.com',
  nickname: '',
  gender: 'female',
  birthday: '',
  bio: '',
  // 母婴特色字段
  babyName: '小宝贝',
  babyBirthday: '2024-01-15',
  babyGender: 'girl',
  babyMilestones: '2024-06-01 第一次翻身\n2024-08-15 长出第一颗牙\n2024-10-01 第一次爬行'
})

// 内容标签
const contentTabs = [
  { value: 'articles', label: '我的文章' },
  { value: 'toolkits', label: '我的工具包' }
]

// 用户内容
const userContents = ref([
  { id: 1, title: '我的母乳喂养经验分享', created_at: '2024-06-15', status: 'published' },
  { id: 2, title: '0-6个月宝宝辅食添加指南', created_at: '2024-06-10', status: 'draft' },
  { id: 3, title: '新生儿睡眠习惯培养', created_at: '2024-05-20', status: 'published' }
])

// 购买记录
const purchases = ref([
  { id: 1, title: '科学育儿课程（0-1岁）', purchase_date: '2024-05-05', price: 99.0 },
  { id: 2, title: '宝宝辅食食谱工具包', purchase_date: '2024-04-20', price: 19.9 }
])

// 收藏列表
const favorites = ref([
  { id: 1, title: '新生儿护理的10个关键要点', created_at: '2024-05-12' },
  { id: 2, title: '亲子互动游戏推荐（0-1岁）', created_at: '2024-05-15' },
  { id: 3, title: '产后恢复的正确方法', created_at: '2024-05-20' }
])

// 通知设置
const notificationSettings = ref({
  email: true,
  push: false,
  marketing: true
})

// 查看购买详情
const viewPurchase = (item) => {
  console.log('查看购买详情:', item)
  // 这里可以打开详情模态框或跳转到详情页面
  alert(`查看购买详情：${item.title}`)
}

// 下载购买的工具包
const downloadPurchase = (item) => {
  console.log('下载购买的工具包:', item)
  // 这里应该调用后端API获取下载链接
  alert(`下载：${item.title}`)
  // 示例：window.open(`/api/download/${item.id}`, '_blank')
}

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab
}
</script>

<style scoped>
.user-center {
  max-width: 100%;
}

/* 母婴主题装饰 */
.theme-decoration {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.decoration-icon {
  font-size: 36px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transform: rotate(-10deg);
}

.decoration-icon:nth-child(2) {
  font-size: 40px;
  transform: rotate(0deg);
  animation-delay: 0.5s;
}

.decoration-icon:nth-child(3) {
  font-size: 34px;
  transform: rotate(10deg);
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--primary-color);
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 左侧导航 */
.user-sidebar {
  width: 280px;
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: 25px;
  box-shadow: var(--shadow-medium);
  position: relative;
  overflow: hidden;
}

.user-sidebar::before {
  content: "🎀👶🎀"; 
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  opacity: 0.1;
  transform: rotate(15deg);
}

.user-info {
  text-align: center;
  margin-bottom: 35px;
  padding-bottom: 25px;
  border-bottom: 2px solid var(--border-color);
}

.user-avatar {
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
  box-shadow: var(--shadow-medium);
}

.avatar-decoration {
  position: absolute;
  bottom: -5px;
  right: -5px;
  font-size: 24px;
  background-color: white;
  border-radius: 50%;
  padding: 5px;
  box-shadow: var(--shadow-medium);
  border: 2px solid var(--bg-primary);
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-primary);
}

.user-email {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 10px;
}

.user-badge {
  display: inline-block;
  background-color: var(--bg-secondary);
  color: var(--primary-color);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border-color);
}

.user-nav .nav-list {
  list-style: none;
}

.user-nav .nav-item {
  margin-bottom: 8px;
  border-radius: 12px;
  overflow: hidden;
}

.user-nav .nav-item a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: var(--bg-secondary);
  border: 2px solid transparent;
}

.user-nav .nav-item:hover a {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
  transform: translateX(5px);
}

.user-nav .nav-item.active a {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateX(5px);
}

/* 右侧内容 */
.user-main {
  flex: 1;
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow-medium);
}

.tab-content {
  background-color: var(--bg-secondary);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow-medium);
  border: 2px solid var(--border-color);
}

.tab-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 30px;
  color: var(--primary-color);
}

/* 个人信息表单 */
.profile-form,
.baby-form {
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
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

.form-group input:disabled {
  background-color: var(--bg-primary);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 40px;
}

.cancel-btn,
.save-btn {
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
}

.cancel-btn {
  border: 2px solid var(--border-color);
  background-color: var(--bg-primary);
  color: var(--text-secondary);
}

.cancel-btn:hover {
  background-color: var(--bg-primary);
  border-color: var(--text-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.save-btn {
  border: none;
  background-color: var(--primary-color);
  color: white;
}

.save-btn:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 内容标签 */
.content-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.content-tab-btn {
  padding: 10px 24px;
  border: 2px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.content-tab-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.content-tab-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-medium);
}

/* 内容列表 */
.content-list,
.purchases-list,
.favorites-list {
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
  border-bottom: 2px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: 12px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.user-content-item:hover,
.purchase-item:hover,
.favorite-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.user-content-item:last-child,
.purchase-item:last-child,
.favorite-item:last-child {
  margin-bottom: 0;
}

.content-item-title,
.purchase-item-title,
.favorite-item-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.content-item-meta,
.purchase-item-meta,
.favorite-item-meta {
  font-size: 14px;
  color: var(--text-light);
}

.content-item-meta span,
.purchase-item-meta span {
  margin-right: 15px;
  background-color: var(--bg-secondary);
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
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
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  box-shadow: var(--shadow-light);
}

.edit-btn {
  border: 2px solid var(--primary-color);
  background-color: white;
  color: var(--primary-color);
}

.edit-btn:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.delete-btn,
.remove-btn {
  border: 2px solid var(--accent-color);
  background-color: white;
  color: var(--accent-color);
}

.delete-btn:hover,
.remove-btn:hover {
  background-color: var(--accent-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.view-btn {
  border: 2px solid var(--secondary-color);
  background-color: white;
  color: var(--secondary-color);
}

.view-btn:hover {
  background-color: var(--secondary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 设置部分 */
.settings-section {
  margin-bottom: 40px;
  background-color: var(--bg-primary);
  padding: 25px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section .section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-section .section-title::before {
  content: ""; 
  display: inline-block;
  width: 8px;
  height: 24px;
  background-color: var(--primary-color);
  border-radius: 4px;
}

/* 通知设置 */
.notification-settings {
  margin-bottom: 20px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  font-size: 15px;
  color: var(--text-primary);
  padding: 12px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background-color: var(--bg-secondary);
}

.checkbox-item:hover {
  background-color: var(--bg-primary);
  border: 2px solid var(--border-color);
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

/* 安全设置 */
.security-settings p {
  margin-bottom: 15px;
  font-size: 15px;
  color: var(--text-primary);
}

.status {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 500;
  margin-left: 10px;
}

.status.verified {
  background-color: var(--success-color);
  color: white;
}

.status.unverified {
  background-color: var(--danger-color);
  color: white;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
  background-color: var(--bg-primary);
  border-radius: 16px;
  border: 2px dashed var(--border-color);
}

.empty-state .icon {
  font-size: 60px;
  margin-bottom: 20px;
  color: var(--primary-color);
  opacity: 0.7;
}

.empty-state p {
  margin-bottom: 25px;
  font-size: 16px;
  color: var(--text-secondary);
}

.create-btn {
  padding: 12px 24px;
  border: 2px solid var(--primary-color);
  background-color: white;
  color: var(--primary-color);
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
}

.create-btn:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .user-content {
    flex-direction: column;
    gap: 25px;
  }
  
  .user-sidebar {
    width: 100%;
    padding: 20px;
  }
  
  .user-main {
    padding: 25px;
  }
  
  .theme-decoration {
    gap: 20px;
  }
  
  .decoration-icon {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 26px;
  }
  
  .user-main {
    padding: 20px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .tab-title {
    font-size: 20px;
    margin-bottom: 25px;
  }
  
  .title-icon {
    font-size: 24px;
  }
  
  .user-content-item,
  .purchase-item,
  .favorite-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 18px;
  }
  
  .content-item-actions,
  .purchase-item-actions,
  .favorite-item-actions {
    align-self: flex-end;
  }
  
  .theme-decoration {
    gap: 15px;
  }
  
  .decoration-icon {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 22px;
  }
  
  .user-sidebar {
    padding: 15px;
  }
  
  .user-nav .nav-item a {
    padding: 12px 15px;
    font-size: 14px;
  }
  
  .tab-title {
    font-size: 18px;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>