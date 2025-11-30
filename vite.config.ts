import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente (como VITE_API_KEY da Vercel)
  // O cast (process as any) evita erros de tipo no Node.js
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Injeta a chave da API no código do navegador de forma segura
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  }
})