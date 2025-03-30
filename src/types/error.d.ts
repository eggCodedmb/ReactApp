type AppError = Error & {
  code?: number;
  message: string;
  data?: any;
};

type APIResponse<T = any> = {
  code: number;
  message: string;
  result: T;
};
