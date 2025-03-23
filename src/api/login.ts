import request from '../utils/request';

const service = '/user';
// 登录
export const login = (data: {username: string; password: string}) => {
  return request.post(`${service}/login`, data);
};

// 注册
export const register = (data: {
  username: string;
  password: string;
  email: string;
}) => {
  return request.post(`${service}/register`, data);
};

// me
export const me = () => {
  return request.get(`${service}/me`);
};
