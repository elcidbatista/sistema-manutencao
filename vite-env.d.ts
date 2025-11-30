// Removed invalid reference to vite/client.
// Added declarations for process.env and ImportMeta.

declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
