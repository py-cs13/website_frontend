import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 后端实际运行在8000端口
        changeOrigin: true
      },
      '/static': {
        target: 'http://localhost:8000', // 后端静态资源代理
        changeOrigin: true
      }
    }
  }
})
