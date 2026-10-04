import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/chatbot': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/predict_health': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/predict_timeline': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
