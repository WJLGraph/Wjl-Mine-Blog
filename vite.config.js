import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' 使构建产物可部署在任意静态目录（GitHub Pages / Gitee Pages 子路径均可）
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    port: 5173,
    open: false
  }
})
