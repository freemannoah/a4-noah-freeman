import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,

    proxy: {
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/submit': 'http://localhost:3000',
      '/edit': 'http://localhost:3000',
      '/data': 'http://localhost:3000',
    },
  },
})
