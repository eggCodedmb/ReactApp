import request from '../utils/request';

const service = '/user';

type updateUserType = {
  email: string;
  nickname: string;
  avatar: string;
};
// 修改用户信息
export const updateUser = (data: updateUserType): Promise<any> => {
  return request.put(`${service}/update`, data);
};

// me
export const me = () => {
  return request.get(`${service}/me`);
};
