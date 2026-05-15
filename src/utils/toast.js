// 全局Toast服务 - 纯DOM实现
let toastContainer = null

// 创建Toast容器
function createContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
    `
    document.body.appendChild(toastContainer)
  }
}

// 移除之前的Toast
function removeExistingToast() {
  const existing = toastContainer.querySelector('.toast')
  if (existing) {
    existing.style.opacity = '0'
    existing.style.transform = 'scale(0.9)'
    setTimeout(() => existing.remove(), 300)
  }
}

// Toast服务
const ToastService = {
  success(message, options = {}) {
    this.show(message, { type: 'success', ...options })
  },
  
  error(message, options = {}) {
    this.show(message, { type: 'error', ...options })
  },
  
  warning(message, options = {}) {
    this.show(message, { type: 'warning', ...options })
  },
  
  info(message, options = {}) {
    this.show(message, { type: 'info', ...options })
  },
  
  show(message, options = {}) {
    const type = options.type || 'info'
    const duration = options.duration || 3000
    const autoClose = options.autoClose !== undefined ? options.autoClose : true
    
    createContainer()
    removeExistingToast()
    
    // 根据类型选择颜色
    const colors = {
      success: { bg: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)', icon: '✓' },
      error: { bg: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)', icon: '✕' },
      warning: { bg: 'linear-gradient(135deg, #FF9800 0%, #FFA726 100%)', icon: '⚠' },
      info: { bg: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%)', icon: 'ℹ' }
    }
    
    const color = colors[type]
    
    // 创建Toast元素
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.innerHTML = `
      <div class="toast-icon">${color.icon}</div>
      <div class="toast-message">${message}</div>
      ${!autoClose ? '<button class="toast-close">×</button>' : ''}
    `
    
    // 添加样式
    toast.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      min-width: 240px;
      max-width: 400px;
      background: ${color.bg};
      color: white;
      opacity: 0;
      transform: scale(0.9);
      transition: all 0.3s ease;
    `
    
    // 图标的样式
    const iconEl = toast.querySelector('.toast-icon')
    iconEl.style.cssText = `
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      background: rgba(255, 255, 255, 0.2);
    `
    
    // 消息的样式
    const messageEl = toast.querySelector('.toast-message')
    messageEl.style.cssText = `
      flex: 1;
      line-height: 1.5;
    `
    
    // 关闭按钮（如果有）
    const closeBtn = toast.querySelector('.toast-close')
    if (closeBtn) {
      closeBtn.style.cssText = `
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      `
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.5)'
      })
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)'
      })
      closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0'
        toast.style.transform = 'scale(0.9)'
        setTimeout(() => toast.remove(), 300)
      })
    }
    
    // 添加到容器
    toastContainer.appendChild(toast)
    
    // 显示动画
    requestAnimationFrame(() => {
      toast.style.opacity = '1'
      toast.style.transform = 'scale(1)'
    })
    
    // 自动关闭
    if (autoClose) {
      setTimeout(() => {
        toast.style.opacity = '0'
        toast.style.transform = 'scale(0.9)'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove()
          }
        }, 300)
      }, duration)
    }
  }
}

// Vue插件
export function useToast(app) {
  app.config.globalProperties.$toast = ToastService
}

export default ToastService
