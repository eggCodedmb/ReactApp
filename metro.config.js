const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const {createProxyMiddleware} = require('http-proxy-middleware');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
