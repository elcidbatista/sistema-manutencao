// Updated to fix missing vite/client type definition error
// and to support process.env.API_KEY as per GenAI guidelines.

declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
