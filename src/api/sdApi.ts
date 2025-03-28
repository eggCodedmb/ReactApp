import request from '../utils/request';

const service = '/v1';

// 修改用户信息
export const getModels = (): Promise<any> => {
  return request.get(`${service}/get-models`);
};

// 文生图
export const txtToimg = (data: any) => {
  return request.post(`${service}/txt2img`, data);
};

// 获取任务进度
export const getProgress = (data: any) => {
  return request.post(`${service}/progress`, data);
};
