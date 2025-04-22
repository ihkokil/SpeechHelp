
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add custom environment variables here if needed
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
