import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/coc-api': {
        target: 'https://cocproxy.royaleapi.dev/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coc-api/, ''),
        secure: false,
      }
    }
  }
})