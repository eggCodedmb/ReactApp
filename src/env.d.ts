// src/env.d.ts
interface ImportMetaEnv {
  // 基础配置
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SENTRY_DSN: string;

  // 功能开关
  readonly VITE_ENABLE_ANALYTICS: 'true' | 'false';

  // 数字类型验证
  readonly VITE_MAX_RETRY_COUNT: `${number}`;

  // 可选参数
  readonly VITE_DEV_MOCK_API?: 'true';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
