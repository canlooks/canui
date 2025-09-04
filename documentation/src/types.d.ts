/// <reference types="vite/client"/>

interface ImportMetaEnv {
    readonly VITE_ALGOLIA_APP_ID: string
    readonly VITE_ALGOLIA_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}