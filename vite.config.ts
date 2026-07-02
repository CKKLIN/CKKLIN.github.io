import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //配置代理,用来解决跨域问题
  server: {
    host: 'localhost',
    port: 5200,
    // overlay: { // 关闭了错误和警告信息的覆盖显示，这意味着当出现编译错误或警告时，不会自动弹出提示覆盖整个浏览器窗口。
    //   warning: false,
    //   errors: false
    // },
    proxy: {
      '/api': {
        // target: 'http://8.134.66.229:8024', // 后端服务器地址
        target: 'http://localhost:8024', // 后端服务器地址
        changeOrigin: true, // 是否改变请求域名
        rewrite: (path) => path.replace(/^\/api/, '')//将原有请求路径中的api替换为''
      }
    }
  },
  base: './',
})