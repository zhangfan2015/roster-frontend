import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [AntDesignVueResolver({
        importStyle: false,
      })],
      eslintrc: { enabled: true },
    }),
    Components({
      dirs: ['src/components'],
      resolvers: [AntDesignVueResolver({
        importStyle: false,
      })],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#1890ff',
        },
      },
    },
  },
  server: {
    port: 8081,
    host: '0.0.0.0',
    proxy: {
      '/api': { // 是一个路径前缀，表示所有以/api开头的请求都将被代理
        // target: 'http://192.168.2.11:8080',
        target: 'http://124.220.206.34:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
})
