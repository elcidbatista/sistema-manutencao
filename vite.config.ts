import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual (production/development)
  // O terceiro parâmetro '' permite carregar todas as variáveis, não apenas as que começam com VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Isso substitui "process.env.API_KEY" pelo valor real da chave durante o build
      // Tenta pegar VITE_API_KEY (padrão Vite) ou API_KEY (genérico)
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY),
      // Previne que o código quebre se houver outros usos de process.env
      'process.env': {}
    }
  }
})