/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API mode: "server" | "local" (legacy: "host") */
  readonly VITE_MODE: string;
  /** Explicit API base URL (overrides mode logic) */
  readonly VITE_API_URL?: string;
  /** Local backend port (default: 4000) */
  readonly VITE_API_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
