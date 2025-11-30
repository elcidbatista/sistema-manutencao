import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (ex: .env, ou variáveis da Vercel)
  // Access process.cwd() with a cast to avoid conflicts with global process type definitions in client declarations
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Isso permite usar process.env.API_KEY no código do navegador
      // Ele pega o valor de VITE_API_KEY configurado na Vercel
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  }
})