import { httpPost,httpGet } from "@/api/index";
import type { TPageInfo } from "@/api/index";
import type { TUser } from "@/types/user";
// 获取用户列表
export const getUserList = (
  page: number,
  page_size: number,
) => {

  return httpGet<{
    list: TUser[];
    page_info: TPageInfo;
  }>('/v1/users/list', {
    params: {
      page,
      page_size,

    }
  });
};

export const createUser = (
  fullName: string,
  email: string,
  password: string,
) => {
  const payload: any = {
    full_name: fullName,
    email,
    password
  };

  return httpPost<string>('/v1/auth/register', payload, {
    meta: {
      ignoreToken: true // 注册时不需要token
    }
  });
};



