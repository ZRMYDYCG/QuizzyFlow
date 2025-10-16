import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * 配置文档: https://vite.dev/config/
*/
export default defineConfig({
  plugins: [react()],
  /**
   * 路径别名配置
   * @ -> src 目录
   */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
      }
  },
  /**
   * Vite 开发服务器配置
   * 端口: 8000
   * 代理: /api -> http://localhost:3000
   */
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
