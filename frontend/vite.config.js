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
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@': fileURLToPath(new URL('./lib', import.meta.url)),
      '@@@': fileURLToPath(new URL('./utils', import.meta.url)),
      '$': fileURLToPath(new URL('./public', import.meta.url))
    }
  },

  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    // Proxy is crucial for cors communication between differant isolated docker containers
    proxy: {
      "/api": {
        target: "http://api:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      "/backend": {
        target: "http://backend:3500",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      }
    }
  },
})
