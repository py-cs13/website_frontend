<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <router-link to="/" class="logo-link">
            <img src="/logo.png" alt="母婴趣指南" class="logo-image">
            <span class="logo-text">母婴趣指南</span>
          </router-link>
        </div>
        
        <!-- 桌面端导航 -->
        <nav class="nav-desktop">
          <ul>
            <li><router-link to="/" exact-active-class="active">首页</router-link></li>
            <li><router-link to="/articles" active-class="active">文章</router-link></li>
            <li><router-link to="/agents" active-class="active">智能体</router-link></li>
            <li><router-link to="/products" active-class="active">精选好物</router-link></li>
            <li><router-link to="/about" active-class="active">关于我们</router-link></li>
          </ul>
        </nav>
        
        <div class="user-actions">
          <div class="search-container" :class="{ 'expanded': showSearch }">
            <button class="search-btn" @click="toggleSearch" v-if="!showSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <input type="text" v-model="searchQuery" placeholder="搜索文章、智能体..." class="search-input" v-show="showSearch" @keyup.enter="performSearch" ref="searchInput">
            <button class="search-submit-btn" @click="performSearch" v-show="showSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span>搜索</span>
            </button>
            <button class="search-close-btn" @click="toggleSearch" v-show="showSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <template v-if="userStore.isAuthenticated">
            <div class="user-profile">
              <span class="user-name" :title="userStore.user?.username">{{ truncatedUsername }}</span>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="login-btn">登录</router-link>
            <router-link to="/register" class="register-btn">注册</router-link>
          </template>
          
          <!-- 菜单按钮（移动端和桌面端） -->
          <div class="menu-wrapper">
            <button class="menu-btn" @click="toggleMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <!-- 桌面端下拉菜单 -->
            <div class="desktop-menu" v-if="showDesktopMenu">
              <ul>
                <li v-if="userStore.isAuthenticated">
                  <router-link to="/user" @click="showDesktopMenu = false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="menu-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    个人中心
                  </router-link>
                </li>
                <li v-if="userStore.isAuthenticated">
                  <a href="#" @click.prevent="showDesktopMenu = false; userStore.logout()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="menu-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    退出登录
                  </a>
                </li>
                <li><router-link to="/about" @click="showDesktopMenu = false">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="menu-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  关于我们
                </router-link></li>
                <li><a href="#contact-section" @click.prevent="showDesktopMenu = false; scrollToContact()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="menu-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  联系我们
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 移动端导航菜单 -->
      <div class="nav-mobile" v-if="showMobileMenu">
        <ul>
            <li><router-link to="/" exact-active-class="active" @click="showMobileMenu = false">首页</router-link></li>
            <li><router-link to="/articles" active-class="active" @click="showMobileMenu = false">文章</router-link></li>
            <li><router-link to="/agents" active-class="active" @click="showMobileMenu = false">智能体</router-link></li>
            <li><router-link to="/products" active-class="active" @click="showMobileMenu = false">精选好物</router-link></li>
            <li><router-link to="/about" active-class="active" @click="showMobileMenu = false">关于我们</router-link></li>
            <li><a href="#contact-section" @click.prevent="showMobileMenu = false; scrollToContact()">联系我们</a></li>
            <li v-if="userStore.isAuthenticated">
              <router-link to="/user" @click="showMobileMenu = false" class="user-info">
                <span class="user-name" :title="userStore.user?.username">{{ truncatedUsername }}</span>
              </router-link>
            </li>
            <li v-if="userStore.isAuthenticated">
              <a href="#" @click.prevent="showMobileMenu = false; userStore.logout()">退出登录</a>
            </li>
            <li v-else>
              <router-link to="/login" @click="showMobileMenu = false">登录</router-link>
              <router-link to="/register" @click="showMobileMenu = false">注册</router-link>
            </li>
          </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const userStore = useAuthStore()
const showMobileMenu = ref(false)
const showDesktopMenu = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const router = useRouter()

// 计算属性：截断用户名显示（最多10个字符）
const truncatedUsername = computed(() => {
  const username = userStore.user?.username || '用户'
  if (username.length <= 10) {
    return username
  }
  return username.substring(0, 10) + '...'
})

// 切换菜单（根据屏幕尺寸判断显示哪个菜单）
const toggleMenu = () => {
  // 检查屏幕宽度，判断是移动端还是桌面端
  if (window.innerWidth <= 768) {
    showMobileMenu.value = !showMobileMenu.value
    showDesktopMenu.value = false
  } else {
    showDesktopMenu.value = !showDesktopMenu.value
    showMobileMenu.value = false
  }
}

// 切换搜索框显示/隐藏
const searchInput = ref(null)
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  // 如果显示搜索框，自动聚焦
  if (showSearch.value) {
    setTimeout(() => {
      if (searchInput.value) {
        searchInput.value.focus()
      }
    }, 300)
  } else {
    searchQuery.value = ''
  }
}

// 执行搜索
const performSearch = () => {
  if (searchQuery.value.trim()) {
    // 跳转到文章列表页并带上搜索参数
    router.push({ path: '/articles', query: { search: searchQuery.value.trim() } })
    showSearch.value = false
  }
}

// 显示联盟推广弹窗
const showAffiliateAlert = () => {
  Swal.fire({
    title: '联盟推广',
    text: '感谢您对我们的支持！目前联盟推广功能正在开发中，敬请期待。',
    icon: 'info',
    confirmButtonText: '确定'
  })
}

// 滚动到页面底部联系区域
const scrollToContact = () => {
  // 关闭移动端菜单
  showMobileMenu.value = false
  showDesktopMenu.value = false
  
  // 直接滚动到页面底部
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}

// 点击菜单外区域关闭菜单
const handleClickOutside = (event) => {
  // 使用refs来获取菜单元素，确保准确性
  const menuBtn = document.querySelector('.menu-btn')
  const menuWrapper = document.querySelector('.menu-wrapper')
  const desktopMenu = document.querySelector('.desktop-menu')
  const mobileMenu = document.querySelector('.nav-mobile')
  
  // 检查点击的是否是菜单按钮本身
  const isMenuButton = menuBtn && menuBtn.contains(event.target)
  
  // 检查点击的是否是菜单区域
  const isMenuArea = (menuWrapper && menuWrapper.contains(event.target)) ||
                    (desktopMenu && desktopMenu.contains(event.target)) ||
                    (mobileMenu && mobileMenu.contains(event.target))
  
  // 如果点击的不是菜单按钮也不是菜单区域，则关闭菜单
  if (!isMenuButton && !isMenuArea) {
    showDesktopMenu.value = false
    showMobileMenu.value = false
  }
}

// 组件挂载时添加点击事件监听
onMounted(() => {
  // 延迟添加事件监听，确保DOM已经渲染完成
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 100)
})

// 组件卸载时移除点击事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 12000; /* 高于分类标签的z-index */
  border-bottom: 0.125rem solid var(--primary-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.6875rem;
}

.logo {
  font-size: 1.625rem;
  font-weight: 700;
}

.logo-link {
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-image {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  border-radius: 0.5rem;
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.logo-text {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--primary-color);
}

/* 桌面端导航 */
.nav-desktop ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  flex-wrap: nowrap;
  min-width: 0;
  flex: 1;
  justify-content: center;
}

.nav-desktop a {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.nav-desktop a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 1.25rem;
  font-size: 1rem;
}

.nav-desktop a:hover {
  color: var(--primary-color);
  background-color: var(--bg-accent);
  transform: translateY(-0.0625rem);
}

.nav-desktop a.active {
  color: var(--primary-color);
  background-color: var(--bg-accent);
  font-weight: 600;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 0.9375rem;
}

/* 菜单按钮容器 */
.menu-wrapper {
  position: relative;
}

/* 桌面端下拉菜单 */
.desktop-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.625rem;
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-medium);
  border-radius: 0.75rem;
  border: 0.0625rem solid var(--border-color);
  min-width: 11.25rem;
  z-index: 13000;
}

.desktop-menu ul {
  list-style: none;
  padding: 0.5rem 0;
}

.desktop-menu a {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9375rem;
}

.desktop-menu a:hover {
  background-color: var(--bg-accent);
  color: var(--primary-color);
}

.menu-icon {
  flex-shrink: 0;
}

.search-btn, .menu-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border-radius: 1.5625rem;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  height: 2.5rem;
  width: 2.5rem;
  min-width: 2.5rem;
  max-width: 17.5rem;
}

.search-container.expanded {
  width: 17.5rem;
  padding: 0 0.9375rem;
  background-color: var(--bg-secondary);
  border: 0.0625rem solid var(--border-color);
  box-shadow: var(--shadow-light);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  font-size: 0.9375rem;
  color: var(--text-primary);
  opacity: 0;
  width: 0;
  transition: opacity 0.3s ease-in-out 0.1s, width 0.3s ease-in-out 0.1s;
  position: relative;
  z-index: 2;
}

.search-container.expanded .search-input {
  opacity: 1;
  width: 10rem;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

/* 搜索提交按钮 - 使用固定定位避免布局跳动 */
.search-submit-btn {
  background-color: transparent;
  border: none;
  border-radius: 1.25rem;
  padding: 0.375rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  color: var(--text-secondary);
  opacity: 0;
  visibility: hidden;
  transform: scale(0.9);
  transition: all 0.3s ease-in-out 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  z-index: 2;
}

.search-container.expanded .search-submit-btn {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

/* 关闭按钮 - 使用固定定位避免布局跳动 */
.search-close-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 50%;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.9);
  transition: all 0.3s ease-in-out 0.2s;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.search-container.expanded .search-close-btn {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

.search-close-btn:hover {
  background-color: var(--bg-accent);
  color: var(--primary-color);
}

.search-submit-btn:hover {
  background-color: var(--bg-accent);
  color: var(--primary-color);
}

/* 彻底移除汉堡菜单的所有效果 */
.search-btn, .menu-btn {
  transition: none !important;
  outline: none !important;
}

.search-btn:hover, .menu-btn:hover,
.search-btn:active, .menu-btn:active,
.search-btn:focus, .menu-btn:focus {
  /* 彻底移除所有效果 */
  background-color: transparent !important;
  color: var(--text-secondary) !important;
  transform: none !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

.login-btn, .register-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 1.5625rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9375rem;
}

.login-btn {
  background-color: transparent;
  border: 0.125rem solid var(--primary-color);
  color: var(--primary-color);
}

.login-btn:hover {
  background-color: var(--bg-accent);
  transform: translateY(-0.125rem);
}

.register-btn {
  background-color: var(--primary-color);
  border: none;
  color: white;
  box-shadow: var(--shadow-light);
}

.register-btn:hover {
  background-color: #FF4785;
  transform: translateY(-0.125rem);
  box-shadow: var(--shadow-medium);
}

.user-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 1.5625rem;
  background-color: var(--bg-secondary);
  width: 7rem; /* 固定宽度，支持10个英文字符 */
  height: 2.2rem;
  box-sizing: border-box;
}

.user-name {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 0.9rem;
  background-color: transparent;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 移动端导航 */
.nav-mobile {
  display: none;
  padding: 1.25rem 0;
  border-top: 0.0625rem solid var(--border-color);
  background-color: var(--bg-primary);
}

.nav-mobile ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-mobile a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
  border-radius: 1.5625rem;
  display: block;
}

.nav-mobile a:hover {
  color: var(--primary-color);
  background-color: var(--bg-accent);
}

.nav-mobile a.active {
  color: var(--primary-color);
  background-color: var(--bg-accent);
  font-weight: 600;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-desktop {
    display: none;
  }
  
  .nav-mobile {
    display: block;
  }
  
  /* 移动端隐藏登录和注册按钮 */
  .login-btn, .register-btn {
    display: none;
  }
  
  .logo {
    font-size: 1.375rem;
  }
  
  .logo a::before {
    font-size: 1.5rem;
  }
  
  .logo-text {
    font-size: 1.125rem;
  }
  
  .logo-image {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .user-actions {
    gap: 0.5rem;
  }
  
  .search-btn, .menu-btn {
    padding: 0;
    font-size: 1.125rem;
  }
  
  .search-container.expanded {
    width: 15.625rem;
  }
  
  .search-container.expanded .search-input {
    width: 10.625rem;
  }
  
  /* 移动端用户名长度限制 */
  .user-profile {
    padding: 0.2rem 0.4rem;
    width: 5.5rem; /* 移动端固定宽度 */
    height: 2rem;
  }
  
  .user-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 1.125rem;
  }
  
  .logo a::before {
    font-size: 1.25rem;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .logo-image {
    width: 2.25rem;
    height: 2.25rem;
  }
  
  .user-actions {
    gap: 0.3125rem;
  }
  
  .search-btn, .menu-btn {
    padding: 0;
    font-size: 1rem;
  }
  
  .search-container.expanded {
    width: 13.75rem;
  }
  
  .search-container.expanded .search-input {
    width: 8.75rem;
    font-size: 0.875rem;
  }
}

</style>