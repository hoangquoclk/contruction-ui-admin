interface IImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string

  [key: string]: unknown
}

interface ImportMeta {
  readonly env: IImportMetaEnv
}
