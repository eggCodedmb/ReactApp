import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_API = '/api'; // 基础地址

class HttpClient {
  private service: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config);

    // 请求拦截
    this.service.interceptors.request.use(
      this.handleRequestSuccess,
      this.handleRequestError,
    );

    // 响应拦截
    this.service.interceptors.response.use(
      this.handleResponseSuccess,
      this.handleResponseError,
    );
  }

  // 请求成功处理
  private handleRequestSuccess = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    // 自动处理不同Content-Type
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
  private handleResponseSuccess = (response: AxiosResponse): any => {
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
    if (response.status === 200) {
      return data;
    } else {
      this.handleBusinessError(response.status, response.statusText);
      return Promise.reject(new Error(response.statusText || 'Error'));
    }
  };

  // 响应错误处理
  private handleResponseError = (error: any): Promise<any> => {
    return Promise.reject(error);
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
}

// 创建实例
const service = new HttpClient({
  baseURL: BASE_API,
  timeout: 30000,
  withCredentials: true,
});

export default service;
