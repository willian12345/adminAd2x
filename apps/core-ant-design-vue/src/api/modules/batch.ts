import { httpGet, httpPost } from "@/api/index";
// 导入 tiktok 批量
export const ImportTiktokBatch = (params: any) => {
  return httpPost("/v1/import/tiktok/batch", params);
};


