import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Isso previne que o site trave se alguma biblioteca tentar acessar process.env
    'process.env': {}
  }
})