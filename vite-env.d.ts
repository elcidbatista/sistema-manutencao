// Fixed: Removed missing type reference to vite/client
// Added process definition for API_KEY usage

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