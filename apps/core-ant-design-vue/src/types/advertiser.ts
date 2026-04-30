


/**
 * 广告主信息类型定义
 */
export type TAdvertiser = {
  advertiser_id: string; // 广告主ID - 唯一标识广告主的编号
  advertiser_name: string; // 广告主名称 - 广告主的显示名称
  from_app_id: string; // 来源应用ID - 广告主关联的应用标识
  from_state_id: string; // 来源状态ID - 广告主的状态标识
  platform: string; // 平台 - 广告投放的平台（如TikTok）
  sync_time: string; // 同步时间 - 数据最后同步的时间戳
  timezone: string; // 时区 - 广告主所在的时区
  timezone_offset: number; // 时区偏移 - 相对于UTC的偏移量（秒）
};
