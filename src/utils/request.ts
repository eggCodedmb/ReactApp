import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Storage from './storage';
import {AppError} from '../types/error';
const BASE_API = 'http://192.168.1.114:3000/api'; // 基础地址

interface IData {
  code: number;
  message: string;
  result: any;
}

interface MyAxiosResponse<T = any> extends AxiosResponse<T> {
  data: T;
}

interface IError {
  code: number;
  message: string;
  result: AxiosResponse;
}

class HttpClient {
  private service: AxiosInstance;
  private token: string | null = null;
  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);

    // 请求拦截
    this.service.interceptors.request.use(
      this.handleRequestSuccess,
      this.handleRequestError,
    );

    // 响应拦截
    this.service.interceptors.response.use(
      this.handleResponseSuccess, // 响应成功处理
      this.handleResponseError, // 响应错误处理
    );
  }

  // 加载Token
  private async loadToken() {
    try {
      const token = await Storage.get('token');
      this.token = token;
    } catch (error) {
      console.error('加载Token失败:', error);
    }
  }

  // 删除Token
  private async deleteToken() {
    try {
      await Storage.remove('token');
      this.token = null;
      console.log('删除Token成功');
    } catch (error) {
      console.error('删除Token失败:', error);
    }
  }

  // 请求成功处理
  private handleRequestSuccess = async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig<any>> => {
    await this.loadToken();
    // 合并headers
    const headers = config.headers || {};

    // 添加Authorization头
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.headers['Content-Type'] === 'form') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.transformRequest = [data => this.stringifyFormData(data)];
    } else if (config.headers['Content-Type'] === 'form-data') {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    // 请求计时开始
    (config as any).metadata = {startTime: new Date()};
    return config;
  };

  // 请求错误处理
  private handleRequestError = (error: any): Promise<any> => {
    return Promise.reject(error);
  };

  // 响应成功处理
  private handleResponseSuccess = (response: MyAxiosResponse<IData>): any => {
    // 请求计时结束
    const endTime = new Date();
    const duration =
      endTime.getTime() - (response.config as any).metadata.startTime.getTime();

    console.log(`请求成功 ${response.config.url} 耗时 ${duration}ms`);

    // 处理二进制数据
    if (response.config.responseType === 'blob') {
      return response.data;
    }
    // 根据业务状态码处理
    const data = response.data;

    if (data.code === 0 || data.code === 200) {
      return data;
    } else {
      this.handleBusinessError(
        data.code || response.status,
        data.message || response.statusText,
      );
      return Promise.reject(new Error(data.message || response.statusText));
    }
  };

  // 响应错误处理
  private handleResponseError = (error: any): Promise<AppError> => {
    const code = error.response?.data?.code || 500;
    if (error.message === 'Network Error') {
      error.message = '网络错误';
    }

    switch (code) {
      case 10401:
        this.deleteToken();
        break;
      case 403:
        // 处理无权限
        break;
      case 404:
        // 处理接口不存在
        break;
      default:
        break;
    }
    const err = {
      code: error.response?.data?.code || 500,
      message: error.response?.data.message || error.message,
      data: error.response,
    };
    return Promise.reject(err);
  };

  // 处理业务错误
  private handleBusinessError(code: any, message: string): void {
    console.error(`业务错误 ${code}: ${message}`);
  }

  // 通用请求方法
  public request(config: AxiosRequestConfig): Promise<any> {
    return this.service.request(config);
  }

  // GET请求
  public get(
    url: string,
    params = {},
    config: AxiosRequestConfig = {},
  ): Promise<any> {
    return this.service.get(url, {params, ...config});
  }

  // POST请求
  public post(
    url: string,
    data = {},
    config: AxiosRequestConfig = {},
  ): Promise<any> {
    return this.service.post(url, data, config);
  }

  // PUT请求
  public put(
    url: string,
    data = {},
    config: AxiosRequestConfig = {},
  ): Promise<any> {
    return this.service.put(url, data, config);
  }

  // DELETE请求
  public delete(
    url: string,
    params = {},
    config: AxiosRequestConfig = {},
  ): Promise<any> {
    return this.service.delete(url, {params, ...config});
  }

  // 辅助方法
  private stringifyFormData(data: any): string {
    return Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  }

  // 文件上传
  public postFile(
    url: string,
    data: any,
    config: AxiosRequestConfig = {},
  ): Promise<any> {
    return this.service.post(url, data, {
      headers: {
        'Content-Type': 'form-data',
      },
      ...config,
    });
  }
}

// 创建实例
const service = new HttpClient({
  baseURL: BASE_API,
  timeout: 1000 * 60,
  withCredentials: true,
});

export default service;
