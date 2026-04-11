<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- 按高度从高到低排列：关于我们 > 快速链接 > 关注我们 > 联系方式 -->
        <div class="footer-section">
          <h3 class="footer-title">关于我们</h3>
          <p class="footer-text">
            母婴趣指南专注于为0-6岁宝宝的父母提供专业的育儿知识、实用的育儿工具和优质的育儿课程，陪伴宝宝健康快乐成长。
          </p>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-title">快速链接</h3>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/about">关于我们</router-link></li>
            <li><router-link to="/articles">文章中心</router-link></li>
            <li><router-link to="/agents">智能体工具</router-link></li>
            <li><router-link to="/privacy">隐私政策</router-link></li>
            <li><router-link to="/terms">用户协议</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-title">关注我们</h3>
          <ul class="social-links">
            <li><span class="social-text">微信</span></li>
            <li><span class="social-text">微博</span></li>
            <li><span class="social-text">知乎</span></li>
            <li><span class="social-text">小红书</span></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-title">联系方式</h3>
          <div class="contact-info">
            <p><i class="icon">📧</i> cl06221227@gmail.com</p>
            <p><i class="icon">📞</i> 19041331887</p>
            <p><i class="icon">📍</i> 河北省邯郸市</p>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; {{ new Date().getFullYear() }} 母婴趣指南. 保留所有权利.</p>
          <div class="filing-info">
            <a href="https://beian.mps.gov.cn/#/query/webSearch?code=13043002130446" 
               target="_blank" rel="noopener noreferrer" class="filing-link">
              <img src="/beian-icon.png" alt="公安备案" class="beian-icon" />
              冀公网安备13043002130446号
            </a>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="filing-link">
              冀ICP备2025138678号-1
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer组件不需要复杂的逻辑
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #FFF5F8 0%, #F8F9FA 100%);
  color: var(--text-primary);
  padding: 2.5rem 0 1.25rem;
  margin-top: 3.75rem;
  border-top: 0.1875rem solid var(--primary-color);
  box-shadow: 0 -0.25rem 1.25rem rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 75rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15.625rem, 1fr));
  gap: 1.875rem;
  margin-bottom: 1.875rem;
  align-items: start;
}

.footer-section {
  background-color: var(--bg-primary);
  padding: 1.25rem;
  border-radius: 0.625rem;
  border: 0.0625rem solid var(--border-color);
  box-shadow: var(--shadow-light);
}

.footer-section .footer-title {
  font-size: 1.1875rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.footer-section .footer-title::before {
  content: "🎀";
  font-size: 1.125rem;
}

.footer-text {
  font-size: 0.875rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
  position: relative;
  padding-left: 1.375rem;
}

.footer-links li::before {
  content: "🌟";
  position: absolute;
  left: 0.5rem;
  top: 0.625rem;
  font-size: 0.75rem;
  color: var(--accent-color);
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  display: block;
}

.footer-links a:hover {
  color: var(--primary-color);
  background-color: var(--bg-accent);
  transform: translateX(0.3125rem);
}

.contact-info {
  margin: 0;
  padding: 0;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.9375rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.contact-info p:last-child {
  margin-bottom: 0;
}

.contact-info p:hover {
  transform: translateY(-0.125rem);
}

.icon {
  font-size: 1.125rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.social-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.social-links li {
  margin-bottom: 0.75rem;
  position: relative;
  padding-left: 1.375rem;
}

.social-links li:last-child {
  margin-bottom: 0;
}

.social-links li::before {
  content: "🌟";
  position: absolute;
  left: 0.5rem;
  top: 0.625rem;
  font-size: 0.75rem;
  color: var(--accent-color);
}

.social-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  display: block;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5625rem;
  border-top: 0.125rem solid var(--border-color);
  color: var(--text-light);
  font-size: 0.875rem;
}

.footer-bottom-content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: center;
}

.footer-bottom p {
  margin: 0;
}

.filing-info {
  display: flex;
  gap: 0.9375rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.filing-link {
  color: var(--text-light);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3125rem 0.625rem;
  border-radius: 0.3125rem;
  display: flex;
  align-items: center;
  gap: 0.3125rem;
}

.filing-link:hover {
  color: var(--primary-color);
  background-color: var(--bg-accent);
}

.beian-icon {
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
}


</style>