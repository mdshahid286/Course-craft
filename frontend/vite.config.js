import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/videos': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  // No proxy needed in unified server mode
  build: {
    target: 'esnext',
  },
})
