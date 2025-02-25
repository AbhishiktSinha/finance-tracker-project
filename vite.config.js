import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {

      '@dashboard_styles': '/src/features/PrivateLayout/pages/Dashboard/styles',
      '@app_styles': '/src/styles',
      '@assets':'/assets',
      '@components_common':'/src/components_common'
    }
  },   
})
