<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>注册</h1>
        <p>创建您的母婴健康垂直站账号</p>
      </div>
      
      <div class="auth-form">
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="请输入您的用户名" 
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="email">邮箱</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="请输入您的邮箱" 
              required
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="请输入您的密码（至少6位）" 
              required
              minlength="6"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="请再次输入您的密码" 
              required
              minlength="6"
              class="form-input"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading || password !== confirmPassword">
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </div>
          
          <div class="form-footer">
            <p>已有账号？<a href="#" @click.prevent="$router.push('/login')">立即登录</a></p>
          </div>
        </form>
        
        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <!-- 密码不匹配提示 -->
        <div v-if="password && confirmPassword && password !== confirmPassword" class="error-message">
          两次输入的密码不匹配
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

// 处理注册
const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  // 检查密码是否匹配
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不匹配'
    loading.value = false
    return
  }
  
  try {
    const success = await userStore.register(username.value, email.value, password.value)
    if (success) {
      // 注册成功，跳转到首页
      router.push('/')
    } else {
      error.value = '注册失败，请检查信息是否正确'
    }
  } catch (err) {
    error.value = '注册失败，请检查网络连接或稍后重试'
    console.error('注册错误:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FFF5F8 0%, #F0F8FF 100%);
  padding: 20px;
}

.auth-container {
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: var(--shadow-medium);
  max-width: 400px;
  width: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.auth-header p {
  font-size: 14px;
  color: var(--text-secondary);
}

.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: var(--bg-secondary);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
}

.form-actions {
  margin-top: 30px;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #FF4785;
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.form-footer p {
  margin-bottom: 10px;
  color: var(--text-secondary);
}

.form-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 20px;
  padding: 12px;
  background-color: #FFF0F0;
  border: 1px solid #FFB3B3;
  border-radius: 8px;
  color: #FF6B6B;
  font-size: 14px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 576px) {
  .auth-container {
    padding: 30px 20px;
  }
  
  .auth-header h1 {
    font-size: 24px;
  }
  
  .btn {
    padding: 12px;
    font-size: 15px;
  }
}
</style>