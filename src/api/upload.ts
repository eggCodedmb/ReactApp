import request from '../utils/request';

const service = '/file';
export const uploadFile = (file: File) => {
  request.post(`${service}/upload`, file);
};
