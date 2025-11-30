// Removed invalid reference to vite/client.
// Added declarations for ImportMeta.

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}