// Fix for missing vite/client types
// /// <reference types="vite/client" />

declare var process: {
  env: {
    API_KEY: string;
    [key: string]: any;
  }
};
