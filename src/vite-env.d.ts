
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add custom environment variables here if needed
  readonly VITE_APP_TITLE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
