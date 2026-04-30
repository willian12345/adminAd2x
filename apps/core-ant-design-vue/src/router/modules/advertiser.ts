import { httpGet, httpPost } from "@/api/index";
import type { ApiResponse } from "@/api/index";
import type { TAdvertiser } from "@/types/advertiser";



export const getAdvertisers = (platform: string | null = null, authCode: string | null = null) => {
  return httpGet<TAdvertiser[]>("/v1/gmv_max/advertisers", {
    params: {
      platform,
      auth_code: authCode,
    },
    timeout: 15000, // 该请求单独设为15秒,
    cacheFor: 0, // 核心修复：禁用缓存，防止取到上次因为 bug 返回的空数据
  });
};
