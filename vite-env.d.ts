// /// <reference types="vite/client" />

// Permite que o TypeScript entenda process.env.API_KEY
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};