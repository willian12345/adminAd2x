import { httpGet, httpPost } from "@/api/index";
import type { TPageInfo } from "@/types/index";

export interface BalanceInfo {
  advertiser_id: string;
  total_recharge: number;
  total_cost: number;
  balance: number;
}

export interface FinanceSummary {
  total_recharge: number;
  total_spend: number;
  balance: number;
  currency: string;
  as_of: string;
}

export interface SpendItem {
  txn_no: string;
  stat_date: string;
  platform: string;
  advertiser_id: string;
  campaign_id: string;
  campaign_name: string;
  cost: number;
}

export interface RechargeItem {
  id: string;
  txn_no: string;
  platform: string;
  advertiser_id: string;
  advertiser_name: string;
  amount: number;
  currency: string;
  recharge_date: string;
  created_at: string;
  note?: string;
}

export interface BidRecord {
  changed_at: string;
  roas_bid: number;
  budget: number;
  change_type: string;
  changed_by: string;
  mode: string;
  reason?: string;
  source?: string;
  status: string;
}

export interface RechargeRecord {
  id: string;
  advertiser_id: string;
  amount: number;
  start_date: string;
  end_date: string;
  operator: string;
  remark: string;
  created_at: string;
}

export interface RechargeRequest {
  advertiser_id: string;
  amount: number;
  remark?: string;
}

export interface RechargeResponse {
  id: string;
  advertiser_id: string;
  amount: number;
  start_date: string;
  end_date: string;
  operator: string;
  remark: string;
  created_at: string;
}

// 充值录入
export const rechargeBalance = (data: RechargeRequest) => {
  return httpPost<RechargeResponse>('/v1/balance/recharge', data);
};


// 财务汇总
export interface FinanceFilters {
  page?: number;
  page_size?: number;
  platform?: string;
  start_date?: string;
  end_date?: string;
  advertiser_id?: string;
}

export const getFinanceSummary = (params?: FinanceFilters) => {
  return httpGet<FinanceSummary>('/v1/finance/summary', { params });
};

// 消耗明细
export const getFinanceSpends = (params?: FinanceFilters & { txn_no?: string }) => {
  return httpGet<{list: SpendItem[], page_info?: TPageInfo}>('/v1/finance/spends', { params });
};

// 充值明细
export const getFinanceRecharges = (params?: FinanceFilters & { txn_no?: string }) => {
  return httpGet<{list: RechargeItem[], page_info?: TPageInfo}>('/v1/finance/recharges', { params });
};

