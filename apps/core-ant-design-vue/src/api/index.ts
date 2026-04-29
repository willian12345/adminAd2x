import axios from 'axios'
import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { useRequest as useRequestOriginal, usePagination as usePaginationOriginal } from "alova/client";
import { axiosRequestAdapter } from '@alova/adapter-axios';
import { toast } from 'vue-sonner';
import type { Ref } from 'vue';

export const BASE_URL = (import.meta.env.VITE_OPEN_PROXY) ? '/api/' : import.meta.env.VITE_APP_API_BASEURL;

console.log('VITE_OPEN_PROXY: ', import.meta.env.VITE_OPEN_PROXY, BASE_URL);

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export interface ApiPaginationResponse<T> {
  code: number;
  data: {
    list: T[];
    page_info: {
      page: number;
      page_size: number;
      total: number;
    };
  };
  message?: string;
}

export type TPageInfo = {
  page: number;
  page_size: number;
  total: number;
};

// ====================== 修复 useRequest ======================
function useRequest<T>(...args: Parameters<typeof useRequestOriginal>) {
  const result = useRequestOriginal(...args);
  return {
    ...result,
    data: result.data as Ref<ApiResponse<T> | undefined>
  };
}

// ====================== 修复 usePagination（核心） ======================
function usePagination<T>(
  handler: (page: number, pageSize: number, ...args: any[]) => any,
  config?: {
    watchingStates?: Ref[];
    initialData?: { total: number; list: T[] };
    debounce?: number | number[];
    append?: boolean;
    initialPage?: number;
    initialPageSize?: number;
    defaultParams?: any[];
    total?: (response: ApiPaginationResponse<T>) => number;
    data?: (response: ApiPaginationResponse<T>) => T[];
    page?: (response: ApiPaginationResponse<T>) => number;
    pageSize?: (response: ApiPaginationResponse<T>) => number;
    [key: string]: any;
  }
) {
  const paginationConfig = config || {};

  const originalConfig = {
    ...paginationConfig,
    data: paginationConfig.data ?? ((res: ApiPaginationResponse<T>) => {
      return res.data?.list ?? [];
    }),
    total: paginationConfig.total ?? ((res: ApiPaginationResponse<T>) => {
      return res.data?.page_info?.total ?? 0;
    }),
    page: paginationConfig.page ?? ((res: ApiPaginationResponse<T>) => {
      return res.data?.page_info?.page ?? 1;
    }),
    pageSize: paginationConfig.pageSize ?? ((res: ApiPaginationResponse<T>) => {
      return res.data?.page_info?.page_size ?? 10;
    }),
  };

  const result = usePaginationOriginal(handler, originalConfig);

  // ✅ Vue 下必须返回 Ref<T[]>，不能直接转数组！！！
  return {
    ...result,
    data: result.data as Ref<T[] | undefined>
  };
}

// 请求重试配置
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: boolean;
    retryCount?: number;
    fake?: boolean;
  }
}

const api = axios.create({
  baseURL: (import.meta.env.DEV && import.meta.env.VITE_ENABLE_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
});

const alovaInstance = createAlova({
  baseURL: BASE_URL,
  requestAdapter: axiosRequestAdapter(),
  timeout: 60000,
  cacheFor: {
    GET: 0,
    POST: 0,
    PUT: 0,
    DELETE: 0,
    PATCH: 0,
    OPTIONS: 0,
    HEAD: 0
  },
  beforeRequest(method) {
    console.log('[Request]', method.type, method.url, method.config);

    if (!method.meta?.ignoreToken) {
      const token = localStorage.getItem('token');
      if (token) {
        method.config.headers.Authorization = `Bearer ${token}`;
      }
    }

    method.config.withCredentials = false;

    if (!method.config.headers['Content-Type']) {
      method.config.headers['Content-Type'] = 'application/json';
    }
  },
  responded: {
    onSuccess: async (response) => {
      const json = response.data as ApiResponse<any>;

      if (json.code === 0) {
        return json;
      } else if (json.code === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('adnix_current_user');
        if (!window.location.pathname.startsWith('/auth')) {
          toast.error(json.message || '登录已过期，请重新登录');
          setTimeout(() => {
            window.location.href = '/auth';
          }, 2000);
        }
        return json;
      } else if (response.config?.meta?.ignoreError) {
        return json;
      } else {
        toast.error(json.message || `API error: ${json.code}`);
        return json;
      }
    },

    onError: (err) => {
      console.error('请求错误:', err);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('adnix_current_user');
        toast.error('登录已过期，请重新登录');
        setTimeout(() => {
          if (!window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth';
          }
        }, 2000);
      } else if (err.response?.status === 500) {
        const msg = err.response?.data?.message || '服务器内部错误';
        toast.error(msg);
      } else {
        toast.error(err.message || '请求失败');
      }

      throw err;
    },

    onComplete: async () => {}
  },
  statesHook: VueHook
});

const httpGet = <T>(url: string, config: any = {}) => {
  return alovaInstance.Get<ApiResponse<T>>(url, config);
};

const httpPost = <T>(url: string, data?: any, config: any = {}) => {
  return alovaInstance.Post<ApiResponse<T>>(url, data, config);
};

// axios 拦截器
api.interceptors.request.use((request) => {
  if (request.fake) {
    request.baseURL = '/fake/';
  }
  if (request.headers) {
    request.headers['Accept-Language'] = 'zh-CN';
  }
  return request;
});

function handleError(error: any) {
  if (error.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('adnix_current_user');
    toast.error('登录已过期');
  } else {
    toast.error(error.message || '请求失败');
  }
  return Promise.reject(error);
}

api.interceptors.response.use(
  (response) => {
    if (response.data?.status === 0) {
      localStorage.removeItem('token');
      localStorage.removeItem('adnix_current_user');
      toast.error('登录已过期');
    }
    return response.data;
  },
  async (error) => {
    const config = error.config;
    if (!config || !config.retry) return handleError(error);

    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= MAX_RETRY_COUNT) return handleError(error);

    config.retryCount += 1;
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return api(config);
  }
);

export default api;
export {
  alovaInstance,
  httpGet,
  httpPost,
  useRequest,
  usePagination,
};
