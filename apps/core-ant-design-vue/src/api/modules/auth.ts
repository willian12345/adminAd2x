import { httpPost, alovaInstance } from "@/api/index";

// 登录接口
export const loginAPI = (email: string, password: string, fullName?: string) => {
  return httpPost<{
    token: string;
    user: {
      id: string;
      full_name: string;
      email: string;
      created_at: string;
      updated_at: string;
      is_sub_account?: boolean;
      parent_user_id?: string;
    };
  }>('/v1/auth/login', {
    full_name: fullName || 'User', // 如果没有提供full_name，使用默认值
    email,
    password,
  }, {
    meta: {
      ignoreToken: true // 注册时不需要token
    }
  });
};
