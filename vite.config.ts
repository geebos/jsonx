import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    cors: true,
    hmr: {
      // 延迟重新加载时间
      timeout: 1000,
    },
    watch: {
      // 忽略某些文件的变化
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
    },
  },
  build: {
    // 减少构建时的重新加载
    watch: {
      buildDelay: 1000,
    },
  },
})
