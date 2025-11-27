import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo (ex: VITE_API_KEY)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Isso cria um objeto "process.env" falso no navegador para o código não quebrar
      'process.env': {
        API_KEY: env.VITE_API_KEY
      }
    }
  }
})