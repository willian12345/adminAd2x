/// <reference types="vite/client" />
interface ImportMetaEnv {
  // Auto generate by env-parse
  /**
   * 接口请求地址，会设置到 axios 的 baseURL 参数上
   */
  readonly VITE_APP_API_BASEURL: string
  /**
   * 页面标题
   */
  readonly VITE_APP_TITLE: string
}
