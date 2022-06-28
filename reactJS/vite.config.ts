import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/gql' : {
        // target: 'http://localhost:3000',
        target: 'https://tripatra-procurement.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gql/, '')
      }
      
    }
  },
  plugins: [react()]
  
})
