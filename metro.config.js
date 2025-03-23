const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {createProxyMiddleware} = require('http-proxy-middleware');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    enhanceMiddleware: middleware => {
      // 代理配置
      return middleware.use(
        '/api', // 需要代理的路径
        createProxyMiddleware({
          target: 'http://localhost:3000', // 目标服务器
          changeOrigin: true,
          pathRewrite: {'^/api': ''}, // 路径重写
          logLevel: 'debug',
        }),
      );
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
