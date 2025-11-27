// Reference to vite/client removed to resolve type definition error
// /// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add process.env definition for Google GenAI SDK usage
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};