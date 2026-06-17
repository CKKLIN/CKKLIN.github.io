import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import localApiPlugin from './vite-plugin-user-api'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动按需引入 Element Plus 组件（Ant Design Vue 手动引入）
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: 'css' }),
      ],
      dts: 'src/components.d.ts',
    }),
    // 自动引入 Element Plus 命令式 API（ElMessage, ElNotification 等）
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      dts: 'src/auto-imports.d.ts',
    }),
    localApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 配置代理，用来解决跨域问题
  server: {
    host: 'localhost',
    port: 5200,
    proxy: {
      '/api': {
        target: 'http://localhost:8024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  base: './',
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // 代码分割：大依赖拆成独立 chunk，提升缓存命中率
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vendor-vue'
            }
            if (id.includes('three')) {
              return 'vendor-three'
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap'
            }
            if (id.includes('element-plus') || id.includes('ant-design-vue')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
