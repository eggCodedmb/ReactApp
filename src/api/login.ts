import request from '../utils/request';

// 登录
export const login = (data: {username: string; password: string}) => {
  return request.post('/login', data);
};

// 注册
export const register = (data: {username: string; password: string, email: string}) => {
  return request.post('/user', data);
};
