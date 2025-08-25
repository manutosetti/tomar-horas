import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/modules': resolve(__dirname, 'src/modules'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/services': resolve(__dirname, 'src/services'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/context': resolve(__dirname, 'src/context'),
      '@/styles': resolve(__dirname, 'src/styles'),
    }
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    devSourcemap: true
  }
})