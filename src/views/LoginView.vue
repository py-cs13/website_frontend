<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>登录</h1>
        <p>欢迎回到母婴健康垂直站</p>
      </div>
      
      <div class="auth-form">
        <form @submit.prevent="handleLogin">
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
              placeholder="请输入您的密码" 
              required
              class="form-input"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
          
          <div class="form-footer">
            <p>还没有账号？<a href="#" @click.prevent="$router.push('/register')">立即注册</a></p>
            <p><a href="#" @click.prevent="forgotPassword">忘记密码？</a></p>
          </div>
        </form>
        
        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores'
import toast from '../utils/toast.js'

const router = useRouter()
const userStore = useAuthStore()

// 表单数据
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// 组件挂载时重置表单数据、错误信息，并滚动到页面顶部
onMounted(() => {
  email.value = ''
  password.value = ''
  error.value = ''
  
  // 滚动到页面顶部 - 添加小延迟确保组件完全挂载
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 50)
})

// 处理登录
  const handleLogin = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const result = await userStore.login(email.value, password.value)
      if (result && result.access_token) {
        // 登录成功，跳转到首页
        router.push('/')
      } else {
        error.value = userStore.error || '邮箱或密码错误，请重试'
      }
    } catch (err) {
      error.value = userStore.error || '登录失败，请检查网络连接或稍后重试'
      console.error('登录错误:', err)
    } finally {
      loading.value = false
    }
  }

// 忘记密码
const forgotPassword = () => {
  // 这里可以实现忘记密码逻辑
  toast.info('忘记密码功能将在后续版本中实现')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FFF5F8 0%, #F0F8FF 100%);
  padding: 1.25rem;
}

.auth-container {
  background-color: white;
  border-radius: 0.75rem;
  padding: 2.5rem;
  box-shadow: var(--shadow-medium);
  max-width: 25rem;
  width: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.875rem;
}

.auth-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.625rem;
}

.auth-header p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 0.125rem solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  background-color: var(--bg-secondary);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: white;
  box-shadow: 0 0 0 0.1875rem rgba(255, 105, 180, 0.1);
}

.form-actions {
  margin-top: 1.875rem;
}

.btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 1.5625rem;
  font-size: 1rem;
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
  transform: translateY(-0.125rem);
  box-shadow: var(--shadow-medium);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.form-footer {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.875rem;
}

.form-footer p {
  margin-bottom: 0.625rem;
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
  margin-top: 1.25rem;
  padding: 0.75rem;
  background-color: #FFF0F0;
  border: 0.0625rem solid #FFB3B3;
  border-radius: 0.5rem;
  color: #FF6B6B;
  font-size: 0.875rem;
  text-align: center;
}


</style>