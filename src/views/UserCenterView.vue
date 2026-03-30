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
            <img v-if="user.avatar" :src="user.avatar" alt="用户头像" />
            <div v-else class="avatar-placeholder">
              {{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="avatar-upload">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                @change="handleAvatarUpload"
                class="avatar-upload-input"
              >
              <label for="avatar-upload" class="upload-btn">
                {{ isUploading ? '上传中...' : '更换头像' }}
              </label>
            </div>
            <div v-if="avatarError" class="error-message">{{ avatarError }}</div>
          </div>
          <div class="user-name">{{ user.username }}</div>
          <div class="user-email">{{ user.email }}</div>
          <div class="user-badge" v-if="user.babyName">
            👶 {{ user.babyName }} 的{{ user.gender === 'male' ? '爸爸' : '妈妈' }}
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
            <!-- 我的内容标签 - 第一版隐藏 -->
            <li class="nav-item" :class="{ active: activeTab === 'content' }" v-if="false">
              <a href="#" @click.prevent="switchTab('content')">
                <i class="icon">📝</i> 我的内容
              </a>
            </li>

            <li class="nav-item" :class="{ active: activeTab === 'favorites' }">
              <a href="#" @click.prevent="switchTab('favorites')">
                <i class="icon">❤️</i> 我的收藏
              </a>
            </li>
            <li class="nav-item">
              <router-link to="/products">
                <i class="icon">🛍️</i> 精选好物
              </router-link>
            </li>
            <!-- 账户设置标签 - 第一版隐藏 -->
            <li class="nav-item" :class="{ active: activeTab === 'settings' }" v-if="false">
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
          <form class="profile-form" novalidate @submit.prevent>
            <div class="form-group">
              <FormInput
                id="username"
                v-model="user.username"
                label="用户名"
                type="text"
              />
            </div>
            <div class="form-group">
              <FormInput
                id="email"
                v-model="user.email"
                label="邮箱"
                type="email"
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
            <div class="error-message" v-if="error">
              {{ error }}
            </div>
            <div class="form-actions">
              <Button variant="secondary" size="medium" class="cancel-btn">取消</Button>
              <Button variant="primary" size="medium" class="save-btn" @click="saveUserInfo">保存修改</Button>
            </div>
          </form>
        </div>
        
        <!-- 宝宝信息 -->
        <div v-if="activeTab === 'baby'" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">👶</span> 宝宝信息
          </h2>
          <form class="baby-form" novalidate @submit.prevent>
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
              <Button variant="primary" size="medium" class="save-btn" @click="saveBabyInfo">保存宝宝信息</Button>
            </div>
          </form>
        </div>
        
        <!-- 我的内容 - 第一版隐藏 -->
        <div v-if="activeTab === 'content' && false" class="tab-content">
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
                  <span>{{ formatDate(item.created_at) }}</span>
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
        

        
        <!-- 我的收藏 -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">❤️</span> 我的收藏
          </h2>
          <div class="favorites-list">
            <div v-if="favoritesLoading" class="loading-state">
              <p>加载中...</p>
            </div>
            <div class="empty-state" v-else-if="favorites.length === 0">
              <i class="icon">❤️</i>
              <p>您还没有收藏任何育儿内容</p>
            </div>
            <div 
              v-for="(item, index) in favorites" 
              :key="item.id" 
              class="favorite-item"
            >
              <div class="favorite-item-info">
                <h3 class="favorite-item-title">
                  <router-link 
                    :to="item.category === 'agent' ? `/agent/${item.content_id}` : `/article/${item.content_id}`"
                    class="favorite-title-link"
                  >
                    {{ item.title }}
                  </router-link>
                </h3>
                <p class="favorite-item-summary">{{ item.summary || '暂无摘要' }}</p>
                <div class="favorite-item-meta-row">
                  <span class="favorite-category">{{ item.category }}</span>
                  <span class="favorite-date">{{ formatDate(item.created_at) }}</span>
                </div>
              </div>
              <div class="favorite-item-actions">
                <Button 
                  variant="danger" 
                  size="small" 
                  class="remove-btn"
                  @click="removeFavorite(item.content_id, index)"
                >
                  💔 取消收藏
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账户设置 - 第一版隐藏 -->
        <div v-if="activeTab === 'settings' && false" class="tab-content">
          <h2 class="tab-title">
            <span class="title-icon">⚙️</span> 账户设置
          </h2>
          <div class="settings-section">
            <h3 class="section-title">密码设置</h3>
            <form class="password-form" novalidate @submit.prevent>
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
    <!-- Toast提示组件 -->
    <Toast v-if="showToast" :type="toastType">
      {{ toastMessage }}
    </Toast>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores'
import axios from 'axios'
import apiClient from '../utils/api.js'
import Button from '../components/Button.vue'
import FormInput from '../components/FormInput.vue'
import FormTextarea from '../components/FormTextarea.vue'
import Toast from '../components/Toast.vue'
import { formatDate } from '../utils/formatters'
import Swal from 'sweetalert2'

const router = useRouter()
const userStore = useAuthStore()
const activeTab = ref('profile')
const activeContentTab = ref('articles')
const error = ref('')

// 头像相关
const avatarError = ref('')
const isUploading = ref(false)

// 用户信息
const user = ref({
  username: '',
  email: '',
  avatar: '',
  gender: '',
  birthday: '',
  bio: '',
  // 母婴特色字段
  babyName: '',
  babyBirthday: '',
  babyGender: '',
  babyMilestones: ''
})

// 标记是否正在保存，用于控制是否重新加载用户数据
const isSaving = ref(false)

// Toast提示状态
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 显示Toast提示
function showToastMessage(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  // 3秒后自动隐藏
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}



// 从API获取最新的用户数据
async function loadUserData() {
  try {
    // 使用apiClient确保错误处理一致
    const response = await apiClient.get('/users/me')
    
    const userData = response.data
    
    // 处理生日日期，确保它是YYYY-MM-DD格式
    let formattedBirthday = ''
    if (userData.birthday) {
      const birthday = new Date(userData.birthday)
      formattedBirthday = isNaN(birthday.getTime()) ? '' : birthday.toISOString().split('T')[0]
    }
    
    // 处理宝宝生日日期，确保它是YYYY-MM-DD格式
    let formattedBabyBirthday = ''
    if (userData.baby_birthday) {
      const babyBirthday = new Date(userData.baby_birthday)
      formattedBabyBirthday = isNaN(babyBirthday.getTime()) ? '' : babyBirthday.toISOString().split('T')[0]
    }
    
    // 完全使用后端返回的新值，不保留之前的表单值
    user.value = {
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar || '',
      gender: userData.gender || '',
      birthday: formattedBirthday,
      bio: userData.bio || '',
      // 母婴特色字段
      babyName: userData.baby_name || '',
      babyBirthday: formattedBabyBirthday,
      babyGender: userData.baby_gender || '',
      babyMilestones: userData.baby_milestones || ''
    }
  } catch (err) {
    console.error('加载用户数据失败:', err)
    // 如果加载失败，检查是否是认证错误
    if (err.response && err.response.status === 401) {
      // 认证失败，清除本地存储并要求用户重新登录
      showToastMessage('登录已过期，请重新登录', 'error')
      userStore.logout()
      // 跳转到登录页面
      router.push('/login')
    } else {
      // 其他错误，显示错误信息
      showToastMessage('加载用户数据失败，请稍后重试', 'error')
    }
  }
}

// 组件挂载时加载用户数据
onMounted(async () => {
  await loadUserData()
  await loadFavorites()
})

// 组件激活时重新加载用户数据（用于路由切换返回时）
onActivated(async () => {
  await loadUserData()
  await loadFavorites()
})

// 移除自动监听userStore.user变化的逻辑，避免页面抖动
// 用户信息在页面加载和激活时获取，确保总是显示最新数据

// 保存用户信息
async function saveUserInfo() {
  error.value = ''
  isSaving.value = true
  
  try {
    // 准备要更新的数据，包含所有表单字段
    const userData = {
      username: user.value.username,
      email: user.value.email,
      gender: user.value.gender || null,
      birthday: user.value.birthday ? new Date(user.value.birthday).toISOString().split('T')[0] : null,
      bio: user.value.bio || null,
      // 母婴特色字段（转换为后端期望的下划线格式）
      baby_name: user.value.babyName || null,
      baby_birthday: user.value.babyBirthday ? new Date(user.value.babyBirthday).toISOString().split('T')[0] : null,
      baby_gender: user.value.babyGender || null,
      baby_milestones: user.value.babyMilestones || null
    }
    
    // 使用userStore的updateUser方法更新用户信息，确保前端状态和localStorage同步
    const success = await userStore.updateUser(userData)
    
    if (success) {
      // 保存成功，显示提示
      showToastMessage('用户信息更新成功！')
      
      // 直接从API获取最新数据，确保显示的是数据库中的最新状态
      await loadUserData()
    } else {
      // 更新失败，使用userStore中的错误信息
      error.value = userStore.error
    }
  } catch (err) {
    error.value = err.response?.data?.details || err.response?.data?.message || '更新失败，请重试'
    console.error('更新用户信息失败:', err)
  } finally {
    isSaving.value = false
  }
}

// 保存宝宝信息
async function saveBabyInfo() {
  error.value = ''
  isSaving.value = true
  
  try {
    // 准备要更新的数据，只包含宝宝相关字段
    const userData = {
      // 母婴特色字段（转换为后端期望的下划线格式）
      baby_name: user.value.babyName || null,
      baby_birthday: user.value.babyBirthday ? new Date(user.value.babyBirthday).toISOString().split('T')[0] : null,
      baby_gender: user.value.babyGender || null,
      baby_milestones: user.value.babyMilestones || null
    }
    
    // 使用userStore的updateUser方法更新用户信息，确保前端状态和localStorage同步
    const success = await userStore.updateUser(userData)
    
    if (success) {
      // 保存成功，显示提示
      showToastMessage('宝宝信息更新成功！')
      
      // 直接从API获取最新数据，确保显示的是数据库中的最新状态
      await loadUserData()
    } else {
      // 更新失败，使用userStore中的错误信息
      error.value = userStore.error
    }
  } catch (err) {
    error.value = err.response?.data?.details || err.response?.data?.message || '更新失败，请重试'
    console.error('更新宝宝信息失败:', err)
  } finally {
    isSaving.value = false
  }
}

// 内容标签
const contentTabs = [
  { value: 'articles', label: '我的文章' },
  { value: 'agents', label: '我的智能体' }
]

// 用户内容
const userContents = ref([
  { id: 1, title: '我的母乳喂养经验分享', created_at: '2024-06-15', status: 'published' },
  { id: 2, title: '0-6个月宝宝辅食添加指南', created_at: '2024-06-10', status: 'draft' },
  { id: 3, title: '新生儿睡眠习惯培养', created_at: '2024-05-20', status: 'published' }
])



// 收藏列表
const favorites = ref([])
const favoritesLoading = ref(false)

// 从API获取收藏列表
async function loadFavorites() {
  if (!userStore.token) {
    favorites.value = []
    return
  }
  
  favoritesLoading.value = true
  try {
    const response = await apiClient.get('/users/me/favorites')
    if (response.data && response.data.data) {
      favorites.value = response.data.data.map(fav => ({
        id: fav.content_id,
        title: fav.content ? fav.content.title : '未知标题',
        summary: fav.content ? fav.content.summary : '',
        category: fav.content ? fav.content.category : '未分类',
        created_at: fav.created_at,
        content_id: fav.content_id
      }))
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    favorites.value = []
  } finally {
    favoritesLoading.value = false
  }
}

// 取消收藏
const removeFavorite = async (contentId, index) => {
  if (!userStore.token) {
    alert('请先登录')
    return
  }
  
  try {
    await apiClient.post(`/content/${contentId}/collect`)
    
    // 从列表中移除
    favorites.value.splice(index, 1)
  } catch (error) {
    console.error('取消收藏失败:', error)
    alert(error.response?.data?.detail || '取消收藏失败，请稍后重试')
  }
}

// 通知设置
const notificationSettings = ref({
  email: true,
  push: false,
  marketing: true
})



// 处理头像上传
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    avatarError.value = '只支持JPEG、PNG和GIF格式的图片'
    return
  }
  
  // 检查文件大小（5MB限制）
  if (file.size > 5 * 1024 * 1024) {
    avatarError.value = '头像大小不能超过5MB'
    return
  }
  
  isUploading.value = true
  avatarError.value = ''
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // 调用后端API上传头像，使用apiClient确保认证错误处理一致
    const response = await apiClient.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // 更新用户信息
    user.value.avatar = response.data.avatar
    // 直接更新userStore中的user对象，确保导航栏同步更新
    userStore.user = response.data
    // 同时更新localStorage
    localStorage.setItem('user', JSON.stringify(response.data))
    
    // 显示成功信息
    setTimeout(() => {
      alert('头像上传成功')
    }, 1000)
  } catch (error) {
    console.error('上传头像失败:', error)
    avatarError.value = '上传头像失败，请稍后重试'
  } finally {
    isUploading.value = false
    // 清空文件输入
    event.target.value = ''
  }
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
  text-align: center;
}

.user-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
  box-shadow: var(--shadow-medium);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  border: 3px solid var(--primary-color);
  box-shadow: var(--shadow-medium);
}

.avatar-upload {
  margin-top: 10px;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.avatar-upload-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.upload-btn {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-light);
}

.upload-btn:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.upload-btn:disabled {
  background-color: var(--text-light);
  cursor: not-allowed;
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

.user-avatar .error-message {
  font-size: 12px;
  color: var(--danger-color);
  margin-top: 5px;
  display: block;
  text-align: center;
  width: 100%;
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
.purchase-item {
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
.purchase-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.user-content-item:last-child,
.purchase-item:last-child {
  margin-bottom: 0;
}

.content-item-title,
.purchase-item-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.content-item-meta,
.purchase-item-meta {
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
.purchase-item-actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn,
.view-btn {
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
.view-btn {
  border: 2px solid var(--accent-color);
  background-color: white;
  color: var(--accent-color);
}

.delete-btn:hover,
.view-btn:hover {
  background-color: var(--accent-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 收藏列表样式 - 增强版 */
.favorites-list {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.favorites-list::-webkit-scrollbar {
  width: 6px;
}

.favorites-list::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.favorites-list::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 3px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 2px solid var(--border-color);
  background-color: var(--bg-primary);
  border-radius: 16px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  gap: 20px;
}

.favorite-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-medium);
  border-color: var(--primary-color);
}

.favorite-item:last-child {
  margin-bottom: 0;
}

.favorite-item-info {
  flex: 1;
  min-width: 0;
}

.favorite-item-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-title-link {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.favorite-title-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.favorite-title-link:hover {
  color: var(--primary-color);
}

.favorite-title-link:hover::after {
  width: 100%;
}

.favorite-item-summary {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  opacity: 0.8;
}

.favorite-item-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.favorite-category {
  background: linear-gradient(135deg, #f87171 0%, #fb7185 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.favorite-date {
  font-size: 13px;
  color: var(--text-light);
  padding: 6px 0;
}

.favorite-item-actions {
  flex-shrink: 0;
  margin-left: 20px;
  padding-top: 16px; /* 与标题的padding-top保持一致 */
  display: flex;
  align-items: flex-start;
}

.favorite-item .remove-btn {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #f87171;
  background-color: white;
  color: #f87171;
  white-space: nowrap;
  box-shadow: var(--shadow-light);
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 6px;
}

.favorite-item .remove-btn:hover {
  background: linear-gradient(135deg, #f87171 0%, #fb7185 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(248, 113, 113, 0.3);
}

.favorite-item .remove-btn:active {
  transform: translateY(0);
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