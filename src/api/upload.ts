import request from '../utils/request';

const service = '/file';
export const uploadFile = (file: any): Promise<any> => {
  return request.postFile(`${service}/upload`, file);
};
